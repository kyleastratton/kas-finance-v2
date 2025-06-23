let budgetData = JSON.parse(localStorage.getItem("budgetData") || "[]");
let wealthData = JSON.parse(localStorage.getItem("wealthData") || "[]");
let customData = JSON.parse(localStorage.getItem("customData") || "[]");
let currentEdit = { section: "", index: -1, subIndex: -1 };

function saveAll() {
  localStorage.setItem("budgetData", JSON.stringify(budgetData));
  localStorage.setItem("wealthData", JSON.stringify(wealthData));
  localStorage.setItem("customData", JSON.stringify(customData));
}

function renderCards() {
  renderSection("budget", budgetData, "budget-cards");
  renderSection("wealth", wealthData, "wealth-cards");
  renderCustomSections();
  updateBudgetTotals();
  updateWealthTotals();
  update503020Totals();
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
    console.log(amount);
    card.innerHTML = `
          <div class="left">
            <div class="avatar">${item.icon}</div>
            <div class="text-block">
              <span class="title">${item.description}</span>
              <span class="subtext">${item.type}</span>
            </div>
          </div>
          <div class="amount">£${amount}</div>
        `;
    container.appendChild(card);
  });
}

function renderCustomSections() {
  const container = document.getElementById("custom-sections");
  container.innerHTML = "";
  customData.forEach((section, sIndex) => {
    const title = document.createElement("h3");
    title.textContent = section.title || `Custom ${sIndex + 1}`;
    const cards = document.createElement("div");
    section.items.forEach((item, i) => {
      const card = document.createElement("div");
      card.className = "card";
      card.draggable = true;
      card.ondragstart = (e) => e.dataTransfer.setData("text/plain", i);
      card.ondragover = (e) => e.preventDefault();
      card.ondrop = (e) => {
        const from = parseInt(e.dataTransfer.getData("text/plain"));
        const moved = section.items.splice(from, 1)[0];
        section.items.splice(i, 0, moved);
        saveAll();
        renderCards();
      };
      card.onclick = () => openEdit("custom", sIndex, i);
      let amount = formatCurrency(item.amount);
      card.innerHTML = `
            <div class="left">
              <div class="avatar">${item.icon}</div>
              <div class="text-block">
                <span class="title">${item.description}</span>
                <span class="subtext">${item.type}</span>
              </div>
            </div>
            <div class="amount">£${amount}</div>
          `;
      cards.appendChild(card);
    });
    container.appendChild(title);
    container.appendChild(cards);
  });
}

function addCard(section) {
  const entry = { icon: "💰", description: "New", type: "Income", amount: 0 };
  if (section === "budget") budgetData.push(entry);
  else if (section === "wealth") wealthData.push(entry);
  saveAll();
  renderCards();
}

function addCustomSection() {
  customData.push({ title: "", items: [{ icon: "📦", description: "Custom", type: "Expense", amount: 0 }] });
  saveAll();
  renderCards();
}

function openEdit(section, i, j = -1) {
  currentEdit = { section, index: i, subIndex: j };
  const item = section === "budget" ? budgetData[i] : section === "wealth" ? wealthData[i] : customData[i].items[j];
  document.getElementById("edit-icon").value = item.icon;
  document.getElementById("edit-description").value = item.description;
  document.getElementById("edit-amount").value = item.amount;
  document.getElementById("edit-type").value = item.type;
  document.getElementById("edit-modal").style.display = "flex";
}

function saveEdit() {
  const { section, index, subIndex } = currentEdit;
  const item = {
    icon: document.getElementById("edit-icon").value,
    description: document.getElementById("edit-description").value,
    amount: parseFloat(document.getElementById("edit-amount").value),
    type: document.getElementById("edit-type").value,
  };
  if (section === "budget") budgetData[index] = item;
  else if (section === "wealth") wealthData[index] = item;
  else customData[index].items[subIndex] = item;
  saveAll();
  renderCards();
  closeEdit();
}

function deleteItem() {
  const { section, index, subIndex } = currentEdit;
  if (confirm("Delete this item?")) {
    if (section === "budget") {
      budgetData.splice(index, 1);
    } else if (section === "wealth") {
      wealthData.splice(index, 1);
    } else {
      // Remove item from the section
      customData[index].items.splice(subIndex, 1);
    }

    // Remove any empty custom sections after item deletion
    customData = customData.filter((section) => section.items.length > 0);

    saveAll();
    renderCards();
    closeEdit();
  }
}

function closeEdit() {
  document.getElementById("edit-modal").style.display = "none";
}

function updateBudgetTotals() {
  let i = 0,
    e = 0,
    s = 0;
  budgetData.forEach((d) => {
    if (d.type === "Income") i += d.amount;
    if (d.type === "Expense") e += d.amount;
    if (d.type === "Savings") s += d.amount;
  });
  document.getElementById("budget-totals").textContent = `Income: £${formatCurrency(i)} | Expenses: £${formatCurrency(e)} | Savings: £${formatCurrency(s)} | Balance: £${formatCurrency(i - e - s)}`;
}

function update503020Totals() {
  let i = 0;
  budgetData.forEach((d) => {
    if (d.type === "Income") i += d.amount;
  });
  let e = i * 0.5;
  let w = i * 0.3;
  let s = i * 0.2;
  let t = e + w + s;
  const str = `Essentials (50%): £${formatCurrency(e)}

  Wants (30%): £${formatCurrency(w)}

  Savings (20%): £${formatCurrency(s)}

  Total: £${formatCurrency(t)}`;
  document.getElementById("50-30-20-totals").innerHTML = str.replace(/\n/g, "<br>");
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

  const data = { budgetData, wealthData, customData };
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
      budgetData = data.budgetData || [];
      wealthData = data.wealthData || [];
      customData = data.customData || [];
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
