
let budgetData = JSON.parse(localStorage.getItem('budgetData') || '[]');
let wealthData = JSON.parse(localStorage.getItem('wealthData') || '[]');
let customData = JSON.parse(localStorage.getItem('customData') || '[]');
let currency = localStorage.getItem('currency') || 'GBP';

const symbols = { GBP: '£', USD: '$', EUR: '€' };

const budgetCards = document.getElementById('budget-cards');
const budgetTotals = document.getElementById('budget-totals');
const wealthCards = document.getElementById('wealth-cards');
const wealthTotals = document.getElementById('wealth-totals');
const customContainer = document.getElementById('custom-sections');

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon();
}

function changeCurrency(newCurrency) {
    currency = newCurrency;
    localStorage.setItem('currency', currency);
    updateBudgetTotals();
    updateWealthTotals();
    renderAllCustomSections();
    document.getElementById('currency-select').value = currency;
}

function currencySymbol() {
    return symbols[currency] || '£';
}

function formatNum(n) {
    return currencySymbol() + n.toLocaleString('en-UK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function clearAllData() {
    if (!confirm('Are you sure you want to clear all data?')) return;
    localStorage.clear();
    location.reload();
}

function exportData() {
    const data = { budgetData, wealthData, customData, currency };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'finance-data.json';
    a.click();
    URL.revokeObjectURL(url);
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.budgetData) budgetData = data.budgetData;
            if (data.wealthData) wealthData = data.wealthData;
            if (data.customData) customData = data.customData;
            if (data.currency) currency = data.currency;
            localStorage.setItem('budgetData', JSON.stringify(budgetData));
            localStorage.setItem('wealthData', JSON.stringify(wealthData));
            localStorage.setItem('customData', JSON.stringify(customData));
            localStorage.setItem('currency', currency);
            location.reload();
        } catch (err) {
            alert('Invalid file format.');
        }
    };
    reader.readAsText(file);
}

document.getElementById('currency-select').value = currency;

// Budget Section
function addBudgetCard() {
    const idx = budgetData.length;
    budgetData.push({ desc: '', amount: 0, type: 'Income' });
    renderBudgetCard(idx);
    saveBudgetData();
    updateBudgetTotals();
}

function removeBudgetCard(btn, idx) {
    budgetData[idx] = null;
    saveBudgetData();
    renderAllBudgetCards();
    updateBudgetTotals();
}

function updateBudget(idx, field, value) {
    if (!budgetData[idx]) return;
    budgetData[idx][field] = field === 'amount' ? parseFloat(value) || 0 : value;
    saveBudgetData();
    updateBudgetTotals();
}

function updateBudgetTotals() {
    let income = 0, expenses = 0, savings = 0;
    budgetData.forEach(entry => {
        if (!entry) return;
        const amt = parseFloat(entry.amount) || 0;
        if (entry.type === 'Income') income += amt;
        if (entry.type === 'Expense') expenses += amt;
        if (entry.type === 'Savings') savings += amt;
    });
    const balance = income - expenses - savings;
    budgetTotals.innerHTML = `
    Total Income: ${formatNum(income)}<br>
    Total Expenses: ${formatNum(expenses)}<br>
    Total Savings: ${formatNum(savings)}<br>
    Remaining Balance: ${formatNum(balance)}
  `;
}

function saveBudgetData() {
    localStorage.setItem('budgetData', JSON.stringify(budgetData));
}

function renderBudgetCard(idx) {
    const entry = budgetData[idx];
    if (!entry) return;
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
    <div class="flex-row">
      <input type="text" placeholder="Description" value="${entry.desc}" oninput="updateBudget(${idx}, 'desc', this.value)">
      <input type="number" placeholder="Amount" value="${entry.amount}" oninput="updateBudget(${idx}, 'amount', this.value)">
      <select onchange="updateBudget(${idx}, 'type', this.value)">
        <option value="Income" ${entry.type === 'Income' ? 'selected' : ''}>Income</option>
        <option value="Expense" ${entry.type === 'Expense' ? 'selected' : ''}>Expense</option>
        <option value="Savings" ${entry.type === 'Savings' ? 'selected' : ''}>Savings</option>
      </select>
      <button onclick="removeBudgetCard(this, ${idx})">✖</button>
    </div>
  `;
    budgetCards.appendChild(card);
}

function renderAllBudgetCards() {
    budgetCards.innerHTML = '';
    budgetData.forEach((_, idx) => renderBudgetCard(idx));
}

renderAllBudgetCards();
updateBudgetTotals();

// Net Wealth Section
function addWealthCard() {
    const idx = wealthData.length;
    wealthData.push({ desc: '', amount: 0, type: 'Asset', category: 'Savings' });
    renderWealthCard(idx);
    saveWealthData();
    updateWealthTotals();
}

function removeWealthCard(btn, idx) {
    wealthData[idx] = null;
    saveWealthData();
    renderAllWealthCards();
    updateWealthTotals();
}

function updateWealth(idx, field, value) {
    if (!wealthData[idx]) return;
    wealthData[idx][field] = field === 'amount' ? parseFloat(value) || 0 : value;
    saveWealthData();
    updateWealthTotals();
}

function updateWealthTotals() {
    let assets = 0, liabilities = 0;
    wealthData.forEach(entry => {
        if (!entry) return;
        const amt = parseFloat(entry.amount) || 0;
        if (entry.type === 'Asset') assets += amt;
        if (entry.type === 'Liability') liabilities += amt;
    });
    const net = assets - liabilities;
    wealthTotals.innerHTML = `
    Total Assets: ${formatNum(assets)}<br>
    Total Liabilities: ${formatNum(liabilities)}<br>
    Net Wealth: ${formatNum(net)}
  `;
}

function saveWealthData() {
    localStorage.setItem('wealthData', JSON.stringify(wealthData));
}

function renderWealthCard(idx) {
    const entry = wealthData[idx];
    if (!entry) return;
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
    <div class="flex-row">
      <input type="text" placeholder="Description" value="${entry.desc}" oninput="updateWealth(${idx}, 'desc', this.value)">
      <input type="number" placeholder="Amount" value="${entry.amount}" oninput="updateWealth(${idx}, 'amount', this.value)">
      <select onchange="updateWealth(${idx}, 'type', this.value)">
        <option value="Asset" ${entry.type === 'Asset' ? 'selected' : ''}>Asset</option>
        <option value="Liability" ${entry.type === 'Liability' ? 'selected' : ''}>Liability</option>
      </select>
      <select onchange="updateWealth(${idx}, 'category', this.value)">
        ${['Savings', 'Pension', 'Investments', 'Property', 'Vehicle', 'Loan', 'Mortgage', 'Credit Card', 'Personal Loan'].map(cat =>
        `<option value="${cat}" ${entry.category === cat ? 'selected' : ''}>${cat}</option>`).join('')}
      </select>
      <button onclick="removeWealthCard(this, ${idx})">Remove</button>
    </div>
  `;
    wealthCards.appendChild(card);
}

function renderAllWealthCards() {
    wealthCards.innerHTML = '';
    wealthData.forEach((_, idx) => renderWealthCard(idx));
}

renderAllWealthCards();
updateWealthTotals();

// Custom Sections
function addCustomSection() {
    const id = Date.now();
    customData.push({ id, title: 'Custom Section', entries: [] });
    saveCustomData();
    renderAllCustomSections();
}

function removeCustomSection(id) {
    customData = customData.filter(s => s.id !== id);
    saveCustomData();
    renderAllCustomSections();
}

function updateCustomTitle(id, value) {
    const section = customData.find(s => s.id === id);
    if (section) section.title = value;
    saveCustomData();
}

function addCustomCard(id) {
    const section = customData.find(s => s.id === id);
    if (section) section.entries.push({ desc: '', amount: 0, type: 'Income' });
    saveCustomData();
    renderAllCustomSections();
}

function updateCustomEntry(sectionId, idx, field, value) {
    const section = customData.find(s => s.id === sectionId);
    if (!section || !section.entries[idx]) return;
    section.entries[idx][field] = field === 'amount' ? parseFloat(value) || 0 : value;
    saveCustomData();
    renderAllCustomSections();
}

function removeCustomCard(sectionId, idx) {
    const section = customData.find(s => s.id === sectionId);
    if (!section) return;
    section.entries.splice(idx, 1);
    saveCustomData();
    renderAllCustomSections();
}

function renderAllCustomSections() {
    customContainer.innerHTML = '';
    customData.forEach(section => {
        const wrapper = document.createElement('div');
        wrapper.className = 'card';
        let income = 0, expenses = 0, savings = 0;
        section.entries.forEach(e => {
            if (e.type === 'Income') income += e.amount;
            if (e.type === 'Expense') expenses += e.amount;
            if (e.type === 'Savings') savings += e.amount;
        });
        const balance = income - expenses - savings;
        wrapper.innerHTML = `
      <div class="flex-row">
        <input type="text" value="${section.title}" onchange="updateCustomTitle(${section.id}, this.value)">
        <button onclick="removeCustomSection(${section.id})">Remove Section</button>
      </div>
      ${section.entries.map((e, idx) => `
        <div class="flex-row">
          <input type="text" placeholder="Description" value="${e.desc}" oninput="updateCustomEntry(${section.id}, ${idx}, 'desc', this.value)">
          <input type="number" placeholder="Amount" value="${e.amount}" oninput="updateCustomEntry(${section.id}, ${idx}, 'amount', this.value)">
          <select onchange="updateCustomEntry(${section.id}, ${idx}, 'type', this.value)">
            <option value="Income" ${e.type === 'Income' ? 'selected' : ''}>Income</option>
            <option value="Expense" ${e.type === 'Expense' ? 'selected' : ''}>Expense</option>
            <option value="Savings" ${e.type === 'Savings' ? 'selected' : ''}>Savings</option>
          </select>
          <button onclick="removeCustomCard(${section.id}, ${idx})">Remove</button>
        </div>
      `).join('')}
      <button onclick="addCustomCard(${section.id})">Add Item</button>
      <div class="totals">
        Total Income: ${formatNum(income)}<br>
        Total Expenses: ${formatNum(expenses)}<br>
        Total Savings: ${formatNum(savings)}<br>
        Remaining Balance: ${formatNum(balance)}
      </div>
    `;
        customContainer.appendChild(wrapper);
    });
}

function saveCustomData() {
    localStorage.setItem('customData', JSON.stringify(customData));
}

renderAllCustomSections();
function applyStoredTheme() {
    const storedTheme = localStorage.getItem('theme');
    const isDark = storedTheme === 'dark';
    document.body.classList.toggle('dark', isDark);
    updateThemeIcon();
}

function updateThemeIcon() {
    const btn = document.getElementById('theme-toggle');
    const isDark = document.body.classList.contains('dark');
    btn.textContent = isDark ? '☀️' : '🌙';
}