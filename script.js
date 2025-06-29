let incomeData = JSON.parse(localStorage.getItem("incomeData") || "[]");
let expenseData = JSON.parse(localStorage.getItem("expenseData") || "[]");
let wealthData = JSON.parse(localStorage.getItem("wealthData") || "[]");
let currentEdit = { section: "", index: -1, subIndex: -1 };
let expensesChart;

function saveAll() {
  localStorage.setItem("incomeData", JSON.stringify(incomeData));
  localStorage.setItem("expenseData", JSON.stringify(expenseData));
  localStorage.setItem("wealthData", JSON.stringify(wealthData));
}

function renderCards() {
  renderSection("income", incomeData, "income-cards");
  renderSection("expense", expenseData, "expense-cards");
  renderSection("wealth", wealthData, "wealth-cards");
  updateIncomeTotals();
  updateExpenseTotals();
  updateBalance();
  updateWealthTotals();
  updateFiftyThirtyTwentyTotals();
  drawChart();
}

function formatCurrency(number) {
  return number.toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function renderSection(section, data, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  data.forEach((item, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.draggable = true;
    card.ondragstart = (e) => e.dataTransfer.setData("text/plain", i);
    card.ondragover = (e) => e.preventDefault();
    card.ondrop = (e) => {
      const from = parseInt(e.dataTransfer.getData("text/plain"));
      const moved = data.splice(from, 1)[0];
      data.splice(i, 0, moved);
      saveAll();
      renderCards();
    };
    card.onclick = () => openEdit(section, i);
    let amount = formatCurrency(item.amount);
    if (section !== "wealth") {
      card.innerHTML = `
          <div class="left">
            <div class="avatar">${item.icon}</div>
            <div class="text-block">
              <span class="title">${item.description}</span>
              <span class="subtext">${item.subType}</span>
            </div>
          </div>
          <div class="amount">£${amount}</div>
        `;
    } else {
      card.innerHTML = `
          <div class="left">
            <div class="avatar">${item.icon}</div>
            <div class="text-block">
              <span class="title">${item.description}</span>
              <span class="subtext">${item.type}</span>
              <span class="subtext">${item.subType}</span>
            </div>
          </div>
          <div class="amount">£${amount}</div>
        `;
    }
    container.appendChild(card);
  });
}

function addCard(section) {
  const incomeEntry = { icon: "💰", description: "New", type: "Income", subType: "Salary", amount: 0 };
  const expenseEntry = { icon: "💰", description: "New", type: "Expense", subType: "Mortgage", amount: 0 };
  const wealthEntry = { icon: "💰", description: "New", type: "Asset", subType: "Savings", amount: 0 };
  if (section === "income") incomeData.push(incomeEntry);
  if (section === "expense") expenseData.push(expenseEntry);
  else if (section === "wealth") wealthData.push(wealthEntry);
  saveAll();
  renderCards();
}

const optionSets = {
  income: ["Income"],
  expense: ["Expense"],
  wealth: ["Asset", "Liability"]
};

function populateDropdown(type) {
  const select = document.getElementById("edit-type");
  select.innerHTML = ""; // Clear existing options

  // optionSets[context]?.forEach(type => {
  //   const option = document.createElement("option");
  //   option.value = type;
  //   option.textContent = type;
  //   select.appendChild(option);
  // });
  (optionSets[type] || []).forEach(type => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    select.appendChild(option);
  });
}

const subTypeOptions = {
  income: ["Salary", "Interest", "Loan"],
  expense: ["Mortgage payments", "Rent", "Property taxes", "Home insurance", "Maintenance & repairs", "HOA or factor fees", "Security systems", "Garden or landscaping services", "Electricity", "Gas\/Heating", "Water/Sewage", "Waste Disposal", "Broadband/Internet", "Mobile phone", "TV license", "Streaming services", "Car payments", "Fuel/petrol", "Car insurance", "MOT and servicing", "Repairs", "Road tax", "Parking fees", "Public transportation", "Rideshare or taxi", "Supermarket spending", "Household supplies", "Pet food & supplies", "Baby products", "Medical insurance", "Prescriptions", "Dental care", "Eye care", "Therapy or counselling", "Life insurance", "Critical illness or income protection cover", "Clothing and shoes", "Haircuts and grooming", "Gym memberships", "Subscriptions", "Hobbies & leisure activities", "Dining out & takeaways", "Gifts & special occasions", "Charity donations", "Tuition fees", "School supplies", "Childcare or nursery fees", "Kids activities", "Uniforms", "Flights", "Accommodation", "Travel insurance", "Transport (car hire, rail, etc.)", "Meals and activities", "Credit card payments", "Loan repayments", "Overdraft charges", "Emergency fund contributions", "Investment accounts", "Retirement/pension savings", "Home office expenses", "Legal or professional fees", "Postage & couriers", "Unplanned or one-off purchases"],
  wealth: ["Cash (wallet, safe, physical cash)", "Current accounts", "Savings accounts", "Fixed deposits", "Stocks and shares", "Mutual funds", "Cryptocurrency", "Retirement accounts (e.g. pension, 401k, SIPP)", "Real estate property (primary residence)", "Real estate property (rental or second home)", "Vehicles (car, motorcycle, etc.)", "Collectibles (art, antiques, etc.)", "Jewellery", "Business ownership/equity", "Receivables (loans you've made)", "Bonds", "Commodities (e.g. gold, silver)", "Investment trusts", "ISAs (Individual Savings Accounts)", "Employer stock options", "Restricted stock units (RSUs)", "Life insurance with cash value", "Intellectual property (royalties, trademarks)", "Vested benefits", "Mortgage balance", "Home equity loan", "Car loan", "Credit card balances", "Student loan", "Personal loans", "Overdraft", "Buy now pay later (BNPL)", "Business loan", "Outstanding taxes", "Medical bills", "Child support or alimony", "Payday loans", "Lines of credit", "Unpaid utility bills", "Lease obligations", "Legal settlements or obligations", "Guarantor liabilities", "Loans from friends/family", "Unpaid insurance premiums"
]
};

function populateSubType(type) {
  const subSelect = document.getElementById("edit-sub-type");
  subSelect.innerHTML = "";

  (subTypeOptions[type] || []).forEach(sub => {
    const option = document.createElement("option");
    option.value = sub;
    option.textContent = sub;
    subSelect.appendChild(option);
  });
}

function openEdit(section, i, j = -1) {
  currentEdit = { section, index: i, subIndex: j };
  let item;
  if (section === "income") item = incomeData[i];
  else if (section === "expense") item = expenseData[i];
  else if (section === "wealth") item = wealthData[i];
  else item = null; // optional fallback
  populateDropdown(section);
  populateSubType(section);
  document.getElementById("edit-icon").value = item.icon;
  document.getElementById("edit-description").value = item.description;
  document.getElementById("edit-amount").value = item.amount;
  document.getElementById("edit-type").value = item.type;
  document.getElementById("edit-sub-type").value = item.subType;
  document.getElementById("edit-modal").style.display = "flex";
}

function saveEdit() {
  const { section, index } = currentEdit;
  const item = {
    icon: document.getElementById("edit-icon").value,
    description: document.getElementById("edit-description").value,
    amount: parseFloat(document.getElementById("edit-amount").value),
    type: document.getElementById("edit-type").value,
    subType: document.getElementById("edit-sub-type").value,
  };
  if (section === "income") incomeData[index] = item;
  else if (section === "expense") expenseData[index] = item;
  else if (section === "wealth") wealthData[index] = item;
  saveAll();
  renderCards();
  closeEdit();
}

function deleteItem() {
  const { section, index } = currentEdit;
  if (confirm("Delete this item?")) {
    if (section === "income") {
      incomeData.splice(index, 1);
    } if (section === "expense") {
      expenseData.splice(index, 1);
    } if (section === "wealth") {
      wealthData.splice(index, 1);
    }

    saveAll();
    renderCards();
    closeEdit();
  }
}

function closeEdit() {
  document.getElementById("edit-modal").style.display = "none";
}

function updateIncomeTotals() {
  let i = 0,
    e = 0,
    s = 0;
  incomeData.forEach((d) => {
    if (d.type === "Income") i += d.amount;
    if (d.type === "Expense") e += d.amount;
    if (d.type === "Savings") s += d.amount;
  });
  document.getElementById("income-totals").textContent = `Total income: £${formatCurrency(i)}`;
}

function updateExpenseTotals() {
  let i = 0,
    e = 0,
    s = 0;
  expenseData.forEach((d) => {
    if (d.type === "Income") i += d.amount;
    if (d.type === "Expense") e += d.amount;
    if (d.type === "Savings") s += d.amount;
  });
  document.getElementById("expense-totals").textContent = `Total expenses: £${formatCurrency(e)}`;
}

function updateBalance() {
  let income = 0,
    expenses = 0;
  incomeData.forEach((i) => {
    if (i.type === "Income") income += i.amount;
  });
  expenseData.forEach((e) => {
    if (e.type === "Expense") expenses += e.amount;
  });
  let total = income - expenses;
  document.getElementById("balance").textContent = `Balance: £${formatCurrency(total)}`;
}

function updateFiftyThirtyTwentyTotals() {
  let i = 0;
  incomeData.forEach((d) => {
    if (d.type === "Income") i += d.amount;
  });
  let e = i * 0.5;
  let w = i * 0.3;
  let s = i * 0.2;
  let t = e + w + s;
  document.getElementById("essentials").innerHTML = `£${formatCurrency(e)}`;
  document.getElementById("wants").innerHTML = `£${formatCurrency(w)}`;
  document.getElementById("savings").innerHTML = `£${formatCurrency(s)}`;
}

function updateWealthTotals() {
  let a = 0,
    l = 0;
  wealthData.forEach((d) => {
    if (d.type === "Asset") a += d.amount;
    if (d.type === "Liability") l += d.amount;
  });
  document.getElementById("wealth-totals").textContent = `Assets: £${formatCurrency(a)} | Liabilities: £${formatCurrency(l)} | Balance: £${formatCurrency(a - l)}`;
}

function exportData() {
  const timestamp = new Date()
    .toISOString()
    .replace(/T/, "-") // Replace T with -
    .replace(/\..+/, "") // Delete the dot and everything after
    .replace(/:/g, "-"); // Replace all colons with -

  const filename = `finance-data-${timestamp}.json`;

  const data = { incomeData, expenseData, wealthData };
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function importData(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      incomeData = data.incomeData || [];
      expenseData = data.expenseData || [];
      wealthData = data.wealthData || [];
      saveAll();
      renderCards();
    } catch (err) {
      alert("Invalid data.");
    }
  };
  reader.readAsText(file);
}

function clearData() {
  if (confirm("Are you sure you want to delete all saved data? This action cannot be undone.")) {
    localStorage.clear();
    location.reload();
  }
}

function toggleTheme() {
  const isDark = document.body.classList.toggle("light-mode");
}

renderCards();

// chart
function drawChart() {
  const ctx = document.getElementById('expenses-chart').getContext('2d');
  const grouped = {};
  expenseData.forEach(e => {
    const cat = e.subType || 'Uncategorized';
    grouped[cat] = (grouped[cat] || 0) + Math.abs(parseFloat(e.amount) || 0);
  });
  const labels = Object.keys(grouped);
  const data = Object.values(grouped);

  if (expensesChart) expensesChart.destroy();
  expensesChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{ data, backgroundColor: generateColors(labels.length) }]
    },
    options: {
      plugins: { legend: { position: 'bottom' } }
    }
  });
}

function generateColors(n) {
  const base = ['#3d8bfd', '#6610f2', '#6f42c1', '#d63384', '#fd7e14', '#20c997'];
  const colors = [];
  for (let i = 0; i < n; i++) colors.push(base[i % base.length]);
  return colors;
}

drawChart();