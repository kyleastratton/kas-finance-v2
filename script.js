let incomeData = JSON.parse(localStorage.getItem("incomeData") || "[]");
let expenseData = JSON.parse(localStorage.getItem("expenseData") || "[]");
let otherCostsData = JSON.parse(localStorage.getItem("otherCostsData") || "[]");
let wealthData = JSON.parse(localStorage.getItem("wealthData") || "[]");
let currentEdit = { section: "", index: -1, subIndex: -1 };
let expensesChart;

function saveAll() {
  localStorage.setItem("incomeData", JSON.stringify(incomeData));
  localStorage.setItem("expenseData", JSON.stringify(expenseData));
  localStorage.setItem("otherCostsData", JSON.stringify(otherCostsData));
  localStorage.setItem("wealthData", JSON.stringify(wealthData));
}

function renderCards() {
  renderSection("income", incomeData, "income-cards");
  renderSection("expense", expenseData, "expense-cards");
  renderSection("othercosts", otherCostsData, "othercosts-cards");
  renderSection("wealth", wealthData, "wealth-cards");
  updateIncomeTotals();
  updateExpenseTotals();
  updateBalance();
  updateOtherCostsTotals();
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
            <div class="avatar">
                ${
                  typeof item.icon === "string" &&
                  (item.icon.endsWith(".png") ||
                  item.icon.endsWith(".jpg") ||
                  item.icon.endsWith(".jpeg") ||
                  item.icon.endsWith(".svg"))
                    ? `<img src="${item.icon}" alt="icon" style="width:100%; height:100%; border-radius: 0.5rem;">`
                    : item.icon
                }
              </div>
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
            <div class="avatar">
                ${
                  typeof item.icon === "string" &&
                  (item.icon.endsWith(".png") ||
                  item.icon.endsWith(".jpg") ||
                  item.icon.endsWith(".jpeg") ||
                  item.icon.endsWith(".svg"))
                    ? `<img src="${item.icon}" alt="icon" style="width:100%; height:100%; border-radius: 0.5rem;">`
                    : item.icon
                }
              </div>
            <div class="text-block">
              <span class="title">${item.description}</span>
              <span class="subtext">${item.type} | ${item.subType}</span>
            </div>
          </div>
          <div class="amount">£${amount}</div>
        `;
    }
    container.appendChild(card);
  });
}

function addCard(section) {
  const incomeEntry = {
    icon: "./assets/logos/example.png",
    description: "",
    type: "Income",
    subType: "",
    amount: 0,
  };
  const expenseEntry = {
    icon: "./assets/logos/example.png",
    description: "",
    type: "Expense",
    subType: "",
    amount: 0,
  };
  const otherCostsEntry = {
    icon: "./assets/logos/example.png",
    description: "",
    type: "Expense",
    subType: "",
    amount: 0,
  };
  const wealthEntry = {
    icon: "./assets/logos/example.png",
    description: "",
    type: "Asset",
    subType: "",
    amount: 0,
  };
  if (section === "income") incomeData.push(incomeEntry);
  if (section === "expense") expenseData.push(expenseEntry);
  if (section === "othercosts") otherCostsData.push(otherCostsEntry);
  else if (section === "wealth") wealthData.push(wealthEntry);
  saveAll();
  renderCards();
}

const optionSets = {
  income: ["Income"],
  expense: ["Expense"],
  othercosts: ["Expense"],
  wealth: ["Asset", "Liability"],
};

function populateDropdown(type) {
  const select = document.getElementById("edit-type");
  select.innerHTML = ""; // Clear existing options

  (optionSets[type] || []).forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    select.appendChild(option);
  });
}

const subTypeOptions = {
  income: [
    "Salary or wages",
    "Bonuses",
    "Commissions",
    "Overtime pay",
    "Freelance or contract work",
    "Dividends",
    "Interest",
    "Capital gains",
    "Rental income",
    "REIT distributions",
    "Royalties",
    "Affiliate marketing income",
    "Dropshipping or e-commerce",
    "YouTube/streaming platform payouts",
    "Ad revenue from websites or blogs",
    "Pension income",
    "Annuity distributions",
    "Social Security",
    "Disability benefits",
    "Universal Credit",
    "Child benefit",
    "Gifts received",
    "Inheritance",
    "Tax refunds",
    "Insurance payouts",
    "Lawsuit settlements",
    "Lottery or gambling winnings",
    "Sale of personal items",
    "Loan proceeds",
    "Settlement funds"
  ],
  expense: [
    "Mortgage payments",
    "Rent",
    "Property taxes",
    "Home insurance",
    "Maintenance & repairs",
    "HOA or factor fees",
    "Security systems",
    "Garden or landscaping services",
    "Utilities",
    "Electricity",
    "Gas/Heating",
    "Water/Sewage",
    "Waste Disposal",
    "Broadband/Internet",
    "Mobile phone",
    "TV license",
    "Streaming services",
    "Car payments",
    "Fuel/petrol",
    "Car insurance",
    "MOT and servicing",
    "Repairs",
    "Road tax",
    "Parking fees",
    "Public transportation",
    "Rideshare or taxi",
    "Supermarket spending",
    "Household supplies",
    "Pet food & supplies",
    "Baby products",
    "Medical insurance",
    "Prescriptions",
    "Dental care",
    "Eye care",
    "Therapy or counselling",
    "Life insurance",
    "Critical illness or income protection cover",
    "Clothing and shoes",
    "Haircuts and grooming",
    "Gym memberships",
    "Subscriptions",
    "Hobbies & leisure activities",
    "Dining out & takeaways",
    "Gifts & special occasions",
    "Charity donations",
    "Tuition fees",
    "School supplies",
    "Childcare or nursery fees",
    "Kids activities",
    "Uniforms",
    "Flights",
    "Accommodation",
    "Travel insurance",
    "Transport (car hire, rail, etc.)",
    "Meals and activities",
    "Credit card payments",
    "Loan repayments",
    "Overdraft charges",
    "Emergency fund contributions",
    "Investment accounts",
    "Retirement/pension savings",
    "Home office expenses",
    "Legal or professional fees",
    "Postage & couriers",
    "Unplanned or one-off purchases",
  ],
  othercosts: [
    "Insurance",
    "M.O.T",
    "Subscription"
  ],
  wealth: [
    "Cash (wallet, safe, physical cash)",
    "Current accounts",
    "Savings accounts",
    "Fixed deposits",
    "Stocks and shares",
    "Mutual funds",
    "Cryptocurrency",
    "Retirement accounts (e.g. pension, 401k, SIPP)",
    "Real estate property (primary residence)",
    "Real estate property (rental or second home)",
    "Vehicles (car, motorcycle, etc.)",
    "Collectibles (art, antiques, etc.)",
    "Jewellery",
    "Business ownership/equity",
    "Receivables (loans you've made)",
    "Bonds",
    "Commodities (e.g. gold, silver)",
    "Investment trusts",
    "ISAs (Individual Savings Accounts)",
    "Employer stock options",
    "Restricted stock units (RSUs)",
    "Life insurance with cash value",
    "Intellectual property (royalties, trademarks)",
    "Vested benefits",
    "Mortgage balance",
    "Home equity loan",
    "Car loan",
    "Credit card balances",
    "Student loan",
    "Personal loans",
    "Overdraft",
    "Buy now pay later (BNPL)",
    "Business loan",
    "Outstanding taxes",
    "Medical bills",
    "Child support or alimony",
    "Payday loans",
    "Lines of credit",
    "Unpaid utility bills",
    "Lease obligations",
    "Legal settlements or obligations",
    "Guarantor liabilities",
    "Loans from friends/family",
    "Unpaid insurance premiums",
  ],
};

function populateSubType(type) {
  const dataList = document.getElementById("sub-type-list");
  dataList.innerHTML = "";

  (subTypeOptions[type] || []).forEach((sub) => {
    const option = document.createElement("option");
    option.value = sub;
    dataList.appendChild(option);
  });
}

function openEdit(section, i, j = -1) {
  currentEdit = { section, index: i, subIndex: j };
  let item;
  if (section === "income") item = incomeData[i];
  else if (section === "expense") item = expenseData[i];
  else if (section === "othercosts") item = otherCostsData[i];
  else if (section === "wealth") item = wealthData[i];
  else item = null; // optional fallback
  populateDropdown(section);
  populateSubType(section);
  document.getElementById("edit-icon").value = item.icon;
  document.getElementById("edit-icon-search").value = "";
  filterLogos();

  // Select the current icon if it's an image
  setTimeout(() => {
    document.querySelectorAll("#logo-grid img").forEach(img => {
      if (img.src.endsWith(item.icon)) {
        img.classList.add("selected");
      }
    });
  }, 10);

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
  else if (section === "othercosts") otherCostsData[index] = item;
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
    }
    if (section === "expense") {
      expenseData.splice(index, 1);
    }
    if (section === "othercosts") {
      otherCostsData.splice(index, 1);
    }
    if (section === "wealth") {
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
  document.getElementById(
    "income-totals"
  ).textContent = `Total income: £${formatCurrency(i)}`;
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
  document.getElementById(
    "expense-totals"
  ).textContent = `Total expenses: £${formatCurrency(e)}`;
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
  document.getElementById("balance").textContent = `Balance: £${formatCurrency(
    total
  )}`;
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

function updateOtherCostsTotals() {
  let i = 0;
  otherCostsData.forEach((o) => {
    i += o.amount;
  });
  document.getElementById(
    "othercosts-totals"
  ).textContent = `Total other costs: £${formatCurrency(i)}`;
}

function updateWealthTotals() {
  let a = 0,
    l = 0;
  wealthData.forEach((d) => {
    if (d.type === "Asset") a += d.amount;
    if (d.type === "Liability") l += d.amount;
  });
  document.getElementById(
    "wealth-totals"
  ).textContent = `Assets: £${formatCurrency(
    a
  )} | Liabilities: £${formatCurrency(l)} | Net Worth: £${formatCurrency(a - l)}`;
}

function exportData() {
  const timestamp = new Date()
    .toISOString()
    .replace(/T/, "-") // Replace T with -
    .replace(/\..+/, "") // Delete the dot and everything after
    .replace(/:/g, "-"); // Replace all colons with -

  const filename = `finance-data-${timestamp}.json`;

  const data = { incomeData, expenseData, otherCostsData, wealthData };
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
      otherCostsData = data.otherCostsData || [];
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
  if (
    confirm(
      "Are you sure you want to delete all saved data? This action cannot be undone."
    )
  ) {
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
  const ctx = document.getElementById("expenses-chart").getContext("2d");
  const grouped = {};
  expenseData.forEach((e) => {
    const cat = e.subType || "Uncategorized";
    grouped[cat] = (grouped[cat] || 0) + Math.abs(parseFloat(e.amount) || 0);
  });
  const labels = Object.keys(grouped);
  const data = Object.values(grouped);

  if (expensesChart) expensesChart.destroy();
  expensesChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels,
      datasets: [{ data, backgroundColor: generateColors(labels.length) }],
    },
    options: {
      plugins: { legend: { position: "bottom" } },
    },
  });
}

function generateColors(n) {
  const base = [
    "#3d8bfd",
    "#6610f2",
    "#6f42c1",
    "#d63384",
    "#fd7e14",
    "#20c997",
  ];
  const colors = [];
  for (let i = 0; i < n; i++) colors.push(base[i % base.length]);
  return colors;
}

drawChart();

// logos

function filterLogos() {
  const query = document.getElementById("edit-icon-search").value.toLowerCase();
  const grid = document.getElementById("logo-grid");
  grid.innerHTML = "";

  const logos = [
    {
      "name": "Trainline",
      "image": "./assets/logos/trainline.png"
    },
    {
      "name": "Nowtv",
      "image": "./assets/logos/nowtv.jpeg"
    },
    {
      "name": "Tsb",
      "image": "./assets/logos/tsb.png"
    },
    {
      "name": "Boots",
      "image": "./assets/logos/boots.png"
    },
    {
      "name": "Ryman",
      "image": "./assets/logos/ryman.png"
    },
    {
      "name": "Wish",
      "image": "./assets/logos/wish.png"
    },
    {
      "name": "Just-Eat",
      "image": "./assets/logos/just-eat.png"
    },
    {
      "name": "Ticketmaster",
      "image": "./assets/logos/ticketmaster.png"
    },
    {
      "name": "Virgin-Money",
      "image": "./assets/logos/virgin-money.jpeg"
    },
    {
      "name": "Virgin",
      "image": "./assets/logos/virgin.png"
    },
    {
      "name": "Apple-Tv-Plus",
      "image": "./assets/logos/apple-tv-plus.jpg"
    },
    {
      "name": "Deepseek",
      "image": "./assets/logos/deepseek.png"
    },
    {
      "name": "Iceland",
      "image": "./assets/logos/iceland.jpg"
    },
    {
      "name": "Sainsburys",
      "image": "./assets/logos/sainsburys.png"
    },
    {
      "name": "Pizza-Express",
      "image": "./assets/logos/pizza-express.png"
    },
    {
      "name": "Hmv",
      "image": "./assets/logos/hmv.png"
    },
    {
      "name": "American-Express",
      "image": "./assets/logos/american-express.png"
    },
    {
      "name": "Timpsons",
      "image": "./assets/logos/timpsons.jpeg"
    },
    {
      "name": "Nationwide",
      "image": "./assets/logos/nationwide.jpeg"
    },
    {
      "name": "Game",
      "image": "./assets/logos/game.jpeg"
    },
    {
      "name": "Icloud",
      "image": "./assets/logos/icloud.jpeg"
    },
    {
      "name": "Arbuthnot-Latham",
      "image": "./assets/logos/arbuthnot-latham.jpg"
    },
    {
      "name": "Marks-And-Spencer",
      "image": "./assets/logos/marks-and-spencer.png"
    },
    {
      "name": "Notion",
      "image": "./assets/logos/notion.png"
    },
    {
      "name": "Arnold-Clark",
      "image": "./assets/logos/arnold-clark.jpeg"
    },
    {
      "name": "Allianz",
      "image": "./assets/logos/allianz.png"
    },
    {
      "name": "Ybs",
      "image": "./assets/logos/ybs.jpeg"
    },
    {
      "name": "Ncp",
      "image": "./assets/logos/ncp.jpeg"
    },
    {
      "name": "Onedrive",
      "image": "./assets/logos/onedrive.png"
    },
    {
      "name": "Emirates",
      "image": "./assets/logos/emirates.png"
    },
    {
      "name": "Starling",
      "image": "./assets/logos/starling.jpg"
    },
    {
      "name": "Swarovski",
      "image": "./assets/logos/swarovski.png"
    },
    {
      "name": "Morrisons",
      "image": "./assets/logos/morrisons.jpeg"
    },
    {
      "name": "Snapchat",
      "image": "./assets/logos/snapchat.jpeg"
    },
    {
      "name": "Three",
      "image": "./assets/logos/three.png"
    },
    {
      "name": "Spotify",
      "image": "./assets/logos/spotify.jpeg"
    },
    {
      "name": "Mcdonalds",
      "image": "./assets/logos/mcdonalds.png"
    },
    {
      "name": "Cex",
      "image": "./assets/logos/cex.jpeg"
    },
    {
      "name": "Natwest",
      "image": "./assets/logos/natwest.jpg"
    },
    {
      "name": "Natwest-Bankline",
      "image": "./assets/logos/natwest-bankline.png"
    },
    {
      "name": "Aliexpress",
      "image": "./assets/logos/aliexpress.png"
    },
    {
      "name": "Threads",
      "image": "./assets/logos/threads.png"
    },
    {
      "name": "Dominos",
      "image": "./assets/logos/dominos.png"
    },
    {
      "name": "Claires",
      "image": "./assets/logos/claires.png"
    },
    {
      "name": "Instagram",
      "image": "./assets/logos/instagram.png"
    },
    {
      "name": "Apple-Music",
      "image": "./assets/logos/apple-music.png"
    },
    {
      "name": "Instgram",
      "image": "./assets/logos/instgram.png"
    },
    {
      "name": "Specsavers",
      "image": "./assets/logos/specsavers.png"
    },
    {
      "name": "Yougov",
      "image": "./assets/logos/yougov.jpeg"
    },
    {
      "name": "Youtube",
      "image": "./assets/logos/youtube.jpeg"
    },
    {
      "name": "Kfc",
      "image": "./assets/logos/kfc.png"
    },
    {
      "name": "Whsmith",
      "image": "./assets/logos/whsmith.png"
    },
    {
      "name": "Rakuten",
      "image": "./assets/logos/rakuten.png"
    },
    {
      "name": "Zurich",
      "image": "./assets/logos/zurich.jpeg"
    },
    {
      "name": "Aig",
      "image": "./assets/logos/aig.png"
    },
    {
      "name": "Perkbox",
      "image": "./assets/logos/perkbox.png"
    },
    {
      "name": "Clintons",
      "image": "./assets/logos/clintons.png"
    },
    {
      "name": "John-Lewis",
      "image": "./assets/logos/john-lewis.jpg"
    },
    {
      "name": "Apple-Arcade",
      "image": "./assets/logos/apple-arcade.jpg"
    },
    {
      "name": "John-Lewis",
      "image": "./assets/logos/john-lewis.png"
    },
    {
      "name": "Nordvpn",
      "image": "./assets/logos/nordvpn.png"
    },
    {
      "name": "Scotmid",
      "image": "./assets/logos/scotmid.png"
    },
    {
      "name": "Esure",
      "image": "./assets/logos/esure.jpeg"
    },
    {
      "name": "Qatar-Airways",
      "image": "./assets/logos/qatar-airways.png"
    },
    {
      "name": "Ocado",
      "image": "./assets/logos/ocado.png"
    },
    {
      "name": "Pcloud",
      "image": "./assets/logos/pcloud.jpeg"
    },
    {
      "name": "Octopus",
      "image": "./assets/logos/octopus.png"
    },
    {
      "name": "Pintrest",
      "image": "./assets/logos/pintrest.png"
    },
    {
      "name": "Google-Play",
      "image": "./assets/logos/google-play.png"
    },
    {
      "name": "Airbnb",
      "image": "./assets/logos/airbnb.jpeg"
    },
    {
      "name": "Deliveroo",
      "image": "./assets/logos/deliveroo.jpeg"
    },
    {
      "name": "X",
      "image": "./assets/logos/x.jpeg"
    },
    {
      "name": "Paramoun-Plus",
      "image": "./assets/logos/paramoun-plus.png"
    },
    {
      "name": "Etsy",
      "image": "./assets/logos/etsy.png"
    },
    {
      "name": "Chip",
      "image": "./assets/logos/chip.png"
    },
    {
      "name": "Card-Factory",
      "image": "./assets/logos/card-factory.jpeg"
    },
    {
      "name": "Proton",
      "image": "./assets/logos/proton.jpeg"
    },
    {
      "name": "Burger-King",
      "image": "./assets/logos/burger-king.png"
    },
    {
      "name": "Trading212",
      "image": "./assets/logos/trading212.jpeg"
    },
    {
      "name": "Google-Drive",
      "image": "./assets/logos/google-drive.png"
    },
    {
      "name": "Youtube-Music",
      "image": "./assets/logos/youtube-music.png"
    },
    {
      "name": "Virgin-Atlantic",
      "image": "./assets/logos/virgin-atlantic.png"
    },
    {
      "name": "Nintendo",
      "image": "./assets/logos/nintendo.png"
    },
    {
      "name": "Club-Earth",
      "image": "./assets/logos/club-earth.png"
    },
    {
      "name": "Lidl",
      "image": "./assets/logos/lidl.jpg"
    },
    {
      "name": "Bupa",
      "image": "./assets/logos/bupa.jpeg"
    },
    {
      "name": "Evri",
      "image": "./assets/logos/evri.png"
    },
    {
      "name": "Edge",
      "image": "./assets/logos/edge.jpeg"
    },
    {
      "name": "Dpd",
      "image": "./assets/logos/dpd.png"
    },
    {
      "name": "Yodel",
      "image": "./assets/logos/yodel.png"
    },
    {
      "name": "Waitrose",
      "image": "./assets/logos/waitrose.png"
    },
    {
      "name": "Breathehr",
      "image": "./assets/logos/breathehr.png"
    },
    {
      "name": "Hsbcnet",
      "image": "./assets/logos/hsbcnet.png"
    },
    {
      "name": "Sage",
      "image": "./assets/logos/sage.png"
    },
    {
      "name": "Tesco",
      "image": "./assets/logos/tesco.png"
    },
    {
      "name": "Handelsbanken",
      "image": "./assets/logos/handelsbanken.jpg"
    },
    {
      "name": "Nhs",
      "image": "./assets/logos/nhs.jpeg"
    },
    {
      "name": "Rsa",
      "image": "./assets/logos/rsa.jpeg"
    },
    {
      "name": "Handelsbanken",
      "image": "./assets/logos/handelsbanken.png"
    },
    {
      "name": "Etihad-Airways",
      "image": "./assets/logos/etihad-airways.png"
    },
    {
      "name": "Food-Warehouse",
      "image": "./assets/logos/food-warehouse.jpg"
    },
    {
      "name": "Royal-London",
      "image": "./assets/logos/royal-london.png"
    },
    {
      "name": "Crunchyroll",
      "image": "./assets/logos/crunchyroll.png"
    },
    {
      "name": "Metro",
      "image": "./assets/logos/metro.png"
    },
    {
      "name": "Vinted",
      "image": "./assets/logos/vinted.png"
    },
    {
      "name": "Dropbox",
      "image": "./assets/logos/dropbox.png"
    },
    {
      "name": "Asda",
      "image": "./assets/logos/asda.png"
    },
    {
      "name": "British-Airways",
      "image": "./assets/logos/british-airways.png"
    },
    {
      "name": "Lloyds",
      "image": "./assets/logos/lloyds.jpg"
    },
    {
      "name": "Funimation",
      "image": "./assets/logos/funimation.png"
    },
    {
      "name": "Ikea",
      "image": "./assets/logos/ikea.png"
    },
    {
      "name": "Coop",
      "image": "./assets/logos/coop.png"
    },
    {
      "name": "Bluesky",
      "image": "./assets/logos/bluesky.jpeg"
    },
    {
      "name": "Gemini",
      "image": "./assets/logos/gemini.png"
    },
    {
      "name": "Uber-Eats",
      "image": "./assets/logos/uber-eats.png"
    },
    {
      "name": "Schuh",
      "image": "./assets/logos/schuh.jpg"
    },
    {
      "name": "Royal-Mail",
      "image": "./assets/logos/royal-mail.png"
    },
    {
      "name": "William-Hill",
      "image": "./assets/logos/william-hill.png"
    },
    {
      "name": "Claude",
      "image": "./assets/logos/claude.png"
    },
    {
      "name": "Tiktok",
      "image": "./assets/logos/tiktok.jpeg"
    },
    {
      "name": "Puregym",
      "image": "./assets/logos/puregym.png"
    },
    {
      "name": "Amazon",
      "image": "./assets/logos/amazon.jpeg"
    },
    {
      "name": "Mega",
      "image": "./assets/logos/mega.jpeg"
    },
    {
      "name": "Primark",
      "image": "./assets/logos/primark.png"
    },
    {
      "name": "Virgin-Media",
      "image": "./assets/logos/virgin-media.png"
    },
    {
      "name": "Bank-Of-Scotland",
      "image": "./assets/logos/bank-of-scotland.jpg"
    },
    {
      "name": "Blink",
      "image": "./assets/logos/blink.png"
    },
    {
      "name": "Direct-Line",
      "image": "./assets/logos/direct-line.png"
    },
    {
      "name": "Warren-James",
      "image": "./assets/logos/warren-james.png"
    },
    {
      "name": "Blue-Light-Card",
      "image": "./assets/logos/blue-light-card.png"
    },
    {
      "name": "Netflix",
      "image": "./assets/logos/netflix.png"
    },
    {
      "name": "Ee",
      "image": "./assets/logos/ee.png"
    },
    {
      "name": "Apple-Tv",
      "image": "./assets/logos/apple-tv.png"
    },
    {
      "name": "Apple",
      "image": "./assets/logos/apple.png"
    },
    {
      "name": "Axa",
      "image": "./assets/logos/axa.png"
    },
    {
      "name": "Hsbc-Business",
      "image": "./assets/logos/hsbc-business.png"
    },
    {
      "name": "Pandora",
      "image": "./assets/logos/pandora.png"
    },
    {
      "name": "Marcus",
      "image": "./assets/logos/marcus.png"
    },
    {
      "name": "Sky",
      "image": "./assets/logos/sky.jpeg"
    },
    {
      "name": "Rbs",
      "image": "./assets/logos/rbs.jpg"
    },
    {
      "name": "British-Gas",
      "image": "./assets/logos/british-gas.png"
    },
    {
      "name": "Admiral",
      "image": "./assets/logos/admiral.jpeg"
    },
    {
      "name": "Snoop",
      "image": "./assets/logos/snoop.png"
    },
    {
      "name": "Tui",
      "image": "./assets/logos/tui.jpeg"
    },
    {
      "name": "Holland-And-Barrett",
      "image": "./assets/logos/holland-and-barrett.png"
    },
    {
      "name": "Hive",
      "image": "./assets/logos/hive.png"
    },
    {
      "name": "Rbs-Bankline",
      "image": "./assets/logos/rbs-bankline.png"
    },
    {
      "name": "Lv",
      "image": "./assets/logos/lv.jpeg"
    },
    {
      "name": "Ebay",
      "image": "./assets/logos/ebay.png"
    },
    {
      "name": "Aldi",
      "image": "./assets/logos/aldi.jpg"
    },
    {
      "name": "Moneybox",
      "image": "./assets/logos/moneybox.jpeg"
    },
    {
      "name": "O2",
      "image": "./assets/logos/o2.jpeg"
    },
    {
      "name": "Millies-Cookies",
      "image": "./assets/logos/millies-cookies.jpeg"
    },
    {
      "name": "Reddit",
      "image": "./assets/logos/reddit.jpeg"
    },
    {
      "name": "Google",
      "image": "./assets/logos/google.jpeg"
    },
    {
      "name": "Santander",
      "image": "./assets/logos/santander.jpg"
    },
    {
      "name": "B-And-M",
      "image": "./assets/logos/b-and-m.png"
    },
    {
      "name": "Nhs",
      "image": "./assets/logos/nhs.png"
    },
    {
      "name": "Aviva",
      "image": "./assets/logos/aviva.jpeg"
    },
    {
      "name": "Duolingo",
      "image": "./assets/logos/duolingo.png"
    },
    {
      "name": "Jet2",
      "image": "./assets/logos/jet2.jpeg"
    },
    {
      "name": "New-Look",
      "image": "./assets/logos/new-look.png"
    },
    {
      "name": "Discord",
      "image": "./assets/logos/discord.png"
    },
    {
      "name": "Jd-Sports",
      "image": "./assets/logos/jd-sports.png"
    },
    {
      "name": "Subway",
      "image": "./assets/logos/subway.png"
    },
    {
      "name": "Linkedin",
      "image": "./assets/logos/linkedin.png"
    },
    {
      "name": "Weatherspoons",
      "image": "./assets/logos/weatherspoons.png"
    },
    {
      "name": "Claude",
      "image": "./assets/logos/claude.jpeg"
    },
    {
      "name": "Thomas-Cook",
      "image": "./assets/logos/thomas-cook.jpeg"
    },
    {
      "name": "Dhl",
      "image": "./assets/logos/dhl.png"
    },
    {
      "name": "Xbox",
      "image": "./assets/logos/xbox.png"
    },
    {
      "name": "Amazon-Music",
      "image": "./assets/logos/amazon-music.jpeg"
    },
    {
      "name": "Etoro",
      "image": "./assets/logos/etoro.png"
    },
    {
      "name": "Playstation-Alt",
      "image": "./assets/logos/playstation-alt.png"
    },
    {
      "name": "Virgin-Trains",
      "image": "./assets/logos/virgin-trains.png"
    },
    {
      "name": "Superdry",
      "image": "./assets/logos/superdry.jpeg"
    },
    {
      "name": "Icedrive",
      "image": "./assets/logos/icedrive.jpeg"
    },
    {
      "name": "Shien",
      "image": "./assets/logos/shien.jpeg"
    },
    {
      "name": "National-Savings-And-Investments",
      "image": "./assets/logos/national-savings-and-investments.jpeg"
    },
    {
      "name": "Yankee-Candle",
      "image": "./assets/logos/yankee-candle.png"
    },
    {
      "name": "Uber",
      "image": "./assets/logos/uber.png"
    },
    {
      "name": "Vodafone",
      "image": "./assets/logos/vodafone.jpeg"
    },
    {
      "name": "Menkind",
      "image": "./assets/logos/menkind.png"
    },
    {
      "name": "Disney",
      "image": "./assets/logos/disney.jpeg"
    },
    {
      "name": "Post-Office",
      "image": "./assets/logos/post-office.png"
    },
    {
      "name": "Jdsports",
      "image": "./assets/logos/jdsports.png"
    },
    {
      "name": "Bodycare",
      "image": "./assets/logos/bodycare.png"
    },
    {
      "name": "Twitch",
      "image": "./assets/logos/twitch.png"
    },
    {
      "name": "Youtube",
      "image": "./assets/logos/youtube.png"
    },
    {
      "name": "Ncp",
      "image": "./assets/logos/ncp.png"
    },
    {
      "name": "Grok",
      "image": "./assets/logos/grok.png"
    },
    {
      "name": "Starbucks",
      "image": "./assets/logos/starbucks.png"
    },
    {
      "name": "Pets-At-Home",
      "image": "./assets/logos/pets-at-home.png"
    },
    {
      "name": "Starbucks",
      "image": "./assets/logos/starbucks.jpg"
    },
    {
      "name": "Next",
      "image": "./assets/logos/next.png"
    },
    {
      "name": "Crowdcube",
      "image": "./assets/logos/crowdcube.png"
    },
    {
      "name": "Hsbc",
      "image": "./assets/logos/hsbc.png"
    },
    {
      "name": "Apple-One",
      "image": "./assets/logos/apple-one.jpg"
    },
    {
      "name": "Greggs",
      "image": "./assets/logos/greggs.png"
    },
    {
      "name": "Co-Op",
      "image": "./assets/logos/co-op.jpg"
    },
    {
      "name": "Medicash",
      "image": "./assets/logos/medicash.png"
    },
    {
      "name": "Prime-Video",
      "image": "./assets/logos/prime-video.png"
    },
    {
      "name": "River-Island",
      "image": "./assets/logos/river-island.png"
    },
    {
      "name": "Disney-Plus",
      "image": "./assets/logos/disney-plus.jpeg"
    },
    {
      "name": "Seedrs",
      "image": "./assets/logos/seedrs.png"
    },
    {
      "name": "National-Lottery",
      "image": "./assets/logos/national-lottery.png"
    },
    {
      "name": "Costa-Coffee",
      "image": "./assets/logos/costa-coffee.png"
    },
    {
      "name": "Brave",
      "image": "./assets/logos/brave.jpg"
    },
    {
      "name": "H-And-M",
      "image": "./assets/logos/h-and-m.png"
    },
    {
      "name": "Chatgpt",
      "image": "./assets/logos/chatgpt.png"
    },
    {
      "name": "Poundland",
      "image": "./assets/logos/poundland.jpeg"
    },
    {
      "name": "Whatsapp",
      "image": "./assets/logos/whatsapp.png"
    },
    {
      "name": "Klarna",
      "image": "./assets/logos/klarna.jpeg"
    },
    {
      "name": "Nandos",
      "image": "./assets/logos/nandos.png"
    },
    {
      "name": "Facebook",
      "image": "./assets/logos/facebook.png"
    },
    {
      "name": "Tfl",
      "image": "./assets/logos/tfl.png"
    },
    {
      "name": "Waterstones",
      "image": "./assets/logos/waterstones.png"
    },
    {
      "name": "Spar",
      "image": "./assets/logos/spar.jpeg"
    },
    {
      "name": "Playstation",
      "image": "./assets/logos/playstation.png"
    },
    {
      "name": "Amazon",
      "image": "./assets/logos/amazon.png"
    },
    {
      "name": "Ryanair",
      "image": "./assets/logos/ryanair.jpeg"
    },
    {
      "name": "Superdrug",
      "image": "./assets/logos/superdrug.png"
    },
    {
      "name": "Paypal",
      "image": "./assets/logos/paypal.png"
    },
    {
      "name": "Facebook",
      "image": "./assets/logos/facebook.jpeg"
    },
    {
      "name": "Avanti-West-Coast",
      "image": "./assets/logos/avanti-west-coast.png"
    },
    {
      "name": "Uk-Gov",
      "image": "./assets/logos/uk-gov.png"
    },
    {
      "name": "Scotrail",
      "image": "./assets/logos/scotrail.jpeg"
    },
    {
      "name": "Revolut",
      "image": "./assets/logos/revolut.png"
    },
    {
      "name": "Barclays",
      "image": "./assets/logos/barclays.jpg"
    },
    {
      "name": "Sony",
      "image": "./assets/logos/sony.png"
    },
    {
      "name": "Hiscox",
      "image": "./assets/logos/hiscox.jpeg"
    },
    {
      "name": "Barclays",
      "image": "./assets/logos/barclays.png"
    },
    {
      "name": "Monzo",
      "image": "./assets/logos/monzo.png"
    },
    {
      "name": "Quiz",
      "image": "./assets/logos/quiz.png"
    },
    {
      "name": "Ageas",
      "image": "./assets/logos/ageas.jpeg"
    },
    {
      "name": "Easyjet",
      "image": "./assets/logos/easyjet.png"
    },
    {
      "name": "Vision-Express",
      "image": "./assets/logos/vision-express.png"
    },
    {
      "name": "Firefox",
      "image": "./assets/logos/firefox.jpeg"
    },
    {
      "name": "Virgin-Money",
      "image": "./assets/logos/virgin-money.jpg"
    },
    {
      "name": "Temu",
      "image": "./assets/logos/temu.png"
    },
    {
      "name": "Chase",
      "image": "./assets/logos/chase.jpeg"
    },
    {
      "name": "Microsoft",
      "image": "./assets/logos/microsoft.jpeg"
    },
    {
      "name": "Copilot",
      "image": "./assets/logos/copilot.jpeg"
    },
    {
      "name": "Monument",
      "image": "./assets/logos/monument.png"
    },
    {
      "name": "Hotel-Chocolat",
      "image": "./assets/logos/hotel-chocolat.png"
    },
    {
      "name": "Ring",
      "image": "./assets/logos/ring.jpeg"
    },
    {
      "name": "Scottish-Gas",
      "image": "./assets/logos/scottish-gas.png"
    },
    {
      "name": "Example",
      "image": "./assets/logos/example.png"
    },
    {
      "name": "Cashroom",
      "image": "./assets/logos/cashroom.jpeg"
    }
  ];

  logos
    .filter((logo) => logo.name.toLowerCase().includes(query))
    .forEach((logo) => {
      const img = document.createElement("img");
      img.src = logo.image;
      img.alt = logo.name;
      img.title = logo.name;
      img.onclick = () => {
        document
          .querySelectorAll("#logo-grid img")
          .forEach((i) => i.classList.remove("selected"));
        img.classList.add("selected");
        document.getElementById("edit-icon").value = logo.image;
      };
      grid.appendChild(img);
    });
}
