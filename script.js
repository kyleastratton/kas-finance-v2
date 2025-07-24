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
    drawChart();
    updateMetrics();
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
        "Settlement funds",
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
    othercosts: ["Insurance", "M.O.T", "Subscription"],
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
        document.querySelectorAll("#logo-grid img").forEach((img) => {
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

function updateMetrics() {
    const metricsIncome = document.getElementById("metrics-income");
    const metricsExpenses = document.getElementById("metrics-expenses");
    const metricsRemaining = document.getElementById("metrics-remaining");
    const metricsNetWealth = document.getElementById("metrics-net-wealth");

    //  Income Data
    let income = 0;
    incomeData.forEach((incomeData) => {
        if (incomeData.type === "Income") income += incomeData.amount;
    });
    metricsIncome.textContent = `£${formatCurrency(income)}`;

    // Expense Data
    let expenses = 0;
    expenseData.forEach((expenseData) => {
        if (expenseData.type === "Expense") expenses += expenseData.amount;
    });
    metricsExpenses.textContent = `£${formatCurrency(expenses)}`;

    // Remaining balance data
    let total = income - expenses;
    if (total > 0) {
        metricsRemaining.classList.add("positive");
    } else {
        metricsRemaining.classList.add("negative");
    }
    metricsRemaining.textContent = `£${formatCurrency(total)}`;

    // Net wealth
    let netWealth = 0;
    wealthData.forEach((wealth) => {
        if (wealth.type === "Asset") netWealth += wealth.amount;
        if (wealth.type === "Liability") netWealth -= wealth.amount;
    });
    if (netWealth > 0) {
        metricsNetWealth.classList.add("positive");
    } else {
        metricsNetWealth.classList.add("negative");
    }
    metricsNetWealth.textContent = `£${formatCurrency(netWealth)}`;
}

function updateIncomeTotals() {
    let income = 0;
    incomeData.forEach((data) => {
        income += data.amount;
    });
    document.getElementById("income-totals").textContent = `- Total: £${formatCurrency(income)}`;
}

function updateExpenseTotals() {
    let expenses = 0;
    expenseData.forEach((data) => {
        expenses += data.amount;
    });
    document.getElementById("expense-totals").textContent = `- Total: £${formatCurrency(expenses)}`;
}

// Remaining balance update
function updateBalance() {
    let balance = document.getElementById("balance");
    let income = 0,
        expenses = 0;
    incomeData.forEach((i) => {
        if (i.type === "Income") income += i.amount;
    });
    expenseData.forEach((e) => {
        if (e.type === "Expense") expenses += e.amount;
    });
    let total = income - expenses;
    if (total > 0) {
        balance.classList.add("positive");
    } else {
        balance.classList.add("negative");
    }
    balance.textContent = `£${formatCurrency(total)}`;
}

function updateOtherCostsTotals() {
    let i = 0;
    otherCostsData.forEach((data) => {
        i += data.amount;
    });
    document.getElementById("othercosts-totals").textContent = `Total other costs: £${formatCurrency(i)}`;
}

function updateWealthTotals() {
    const assetTotal = document.getElementById("assets-total");
    const liabilityTotal = document.getElementById("liabilities-total");
    const netWealthTotal = document.getElementById("net-wealth-total");

    let assets = 0,
        liabilities = 0;
    wealthData.forEach((data) => {
        if (data.type === "Asset") assets += data.amount;
        if (data.type === "Liability") liabilities += data.amount;
    });
    let wealth = assets - liabilities;
    if (wealth > 0) {
        netWealthTotal.classList.add("positive");
    } else {
        netWealthTotal.classList.add("negative");
    }
    assetTotal.textContent = `£${formatCurrency(assets)}`;
    liabilityTotal.textContent = `£${formatCurrency(liabilities)}`;
    netWealthTotal.textContent = `£${formatCurrency(wealth)}`;
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
    const base = ["#3d8bfd", "#6610f2", "#6f42c1", "#d63384", "#fd7e14", "#20c997"];
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
            name: "Aberdeen City Council",
            image: "../../repos/kas-finance-v2/assets/logos/aberdeen-city-council.jpg",
        },
        {
            name: "Aberdeen City Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/aberdeen-city-council-1.jpg",
        },
        {
            name: "Aberdeenshire Council",
            image: "../../repos/kas-finance-v2/assets/logos/aberdeenshire-council.jpg",
        },
        {
            name: "Admiral",
            image: "../../repos/kas-finance-v2/assets/logos/admiral.jpeg",
        },
        {
            name: "Adur Worthing Council",
            image: "../../repos/kas-finance-v2/assets/logos/adur-worthing-council.jpg",
        },
        {
            name: "Ageas",
            image: "../../repos/kas-finance-v2/assets/logos/ageas.jpeg",
        },
        {
            name: "Aig",
            image: "../../repos/kas-finance-v2/assets/logos/aig.png",
        },
        {
            name: "Airbnb",
            image: "../../repos/kas-finance-v2/assets/logos/airbnb.jpeg",
        },
        {
            name: "Aldi",
            image: "../../repos/kas-finance-v2/assets/logos/aldi.jpg",
        },
        {
            name: "Aliexpress",
            image: "../../repos/kas-finance-v2/assets/logos/aliexpress.png",
        },
        {
            name: "Allianz",
            image: "../../repos/kas-finance-v2/assets/logos/allianz.png",
        },
        {
            name: "Amazon",
            image: "../../repos/kas-finance-v2/assets/logos/amazon.jpeg",
        },
        {
            name: "Amazon",
            image: "../../repos/kas-finance-v2/assets/logos/amazon.png",
        },
        {
            name: "Amazon Music",
            image: "../../repos/kas-finance-v2/assets/logos/amazon-music.jpeg",
        },
        {
            name: "Amber Valley Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/amber-valley-borough-council.jpg",
        },
        {
            name: "American Express",
            image: "../../repos/kas-finance-v2/assets/logos/american-express.png",
        },
        {
            name: "Angus Council",
            image: "../../repos/kas-finance-v2/assets/logos/angus-council.png",
        },
        {
            name: "Antrim And Newtownabbey District Council",
            image: "../../repos/kas-finance-v2/assets/logos/antrim-and-newtownabbey-district-council.jpg",
        },
        {
            name: "Apple",
            image: "../../repos/kas-finance-v2/assets/logos/apple.png",
        },
        {
            name: "Apple Arcade",
            image: "../../repos/kas-finance-v2/assets/logos/apple-arcade.jpg",
        },
        {
            name: "Apple Music",
            image: "../../repos/kas-finance-v2/assets/logos/apple-music.png",
        },
        {
            name: "Apple One",
            image: "../../repos/kas-finance-v2/assets/logos/apple-one.jpg",
        },
        {
            name: "Apple Tv",
            image: "../../repos/kas-finance-v2/assets/logos/apple-tv.png",
        },
        {
            name: "Apple Tv Plus",
            image: "../../repos/kas-finance-v2/assets/logos/apple-tv-plus.jpg",
        },
        {
            name: "Arbuthnot Latham",
            image: "../../repos/kas-finance-v2/assets/logos/arbuthnot-latham.jpg",
        },
        {
            name: "Argyll And Bute Council",
            image: "../../repos/kas-finance-v2/assets/logos/argyll-and-bute-council.jpg",
        },
        {
            name: "Armagh Banbridge And Craigavon District Council",
            image: "../../repos/kas-finance-v2/assets/logos/armagh-banbridge-and-craigavon-district-council.jpg",
        },
        {
            name: "Arnold Clark",
            image: "../../repos/kas-finance-v2/assets/logos/arnold-clark.jpeg",
        },
        {
            name: "Arun District Council",
            image: "../../repos/kas-finance-v2/assets/logos/arun-district-council.jpg",
        },
        {
            name: "Asda",
            image: "../../repos/kas-finance-v2/assets/logos/asda.png",
        },
        {
            name: "Ashfield District Council",
            image: "../../repos/kas-finance-v2/assets/logos/ashfield-district-council.jpg",
        },
        {
            name: "Ashford Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/ashford-borough-council.jpeg",
        },
        {
            name: "Avanti West Coast",
            image: "../../repos/kas-finance-v2/assets/logos/avanti-west-coast.png",
        },
        {
            name: "Aviva",
            image: "../../repos/kas-finance-v2/assets/logos/aviva.jpeg",
        },
        {
            name: "Axa",
            image: "../../repos/kas-finance-v2/assets/logos/axa.png",
        },
        {
            name: "B And M",
            image: "../../repos/kas-finance-v2/assets/logos/b-and-m.png",
        },
        {
            name: "Babergh District Council",
            image: "../../repos/kas-finance-v2/assets/logos/babergh-district-council.jpg",
        },
        {
            name: "Bank Of Scotland",
            image: "../../repos/kas-finance-v2/assets/logos/bank-of-scotland.jpg",
        },
        {
            name: "Barclays",
            image: "../../repos/kas-finance-v2/assets/logos/barclays.jpg",
        },
        {
            name: "Barclays",
            image: "../../repos/kas-finance-v2/assets/logos/barclays.png",
        },
        {
            name: "Barnsley Metropolitan Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/barnsley-metropolitan-borough-council.jpg",
        },
        {
            name: "Basildon District Council",
            image: "../../repos/kas-finance-v2/assets/logos/basildon-district-council.jpg",
        },
        {
            name: "Basingstoke And Deane Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/basingstoke-and-deane-borough-council.jpg",
        },
        {
            name: "Bassetlaw District Council",
            image: "../../repos/kas-finance-v2/assets/logos/bassetlaw-district-council.jpg",
        },
        {
            name: "Bath And North East Somerset Council",
            image: "../../repos/kas-finance-v2/assets/logos/bath-and-north-east-somerset-council.jpg",
        },
        {
            name: "Bedford Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/bedford-borough-council.jpg",
        },
        {
            name: "Belfast City Council",
            image: "../../repos/kas-finance-v2/assets/logos/belfast-city-council.jpg",
        },
        {
            name: "Birghton And Hove Council",
            image: "../../repos/kas-finance-v2/assets/logos/birghton-and-hove-council.jpg",
        },
        {
            name: "Birmingham City Council",
            image: "../../repos/kas-finance-v2/assets/logos/birmingham-city-council.jpg",
        },
        {
            name: "Blaby District Council",
            image: "../../repos/kas-finance-v2/assets/logos/blaby-district-council.jpg",
        },
        {
            name: "Blackburn With Darwen Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/blackburn-with-darwen-borough-council.jpg",
        },
        {
            name: "Blackpool Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/blackpool-borough-council.jpg",
        },
        {
            name: "Blaenau Gwent County Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/blaenau-gwent-county-borough-council.jpg",
        },
        {
            name: "Blink",
            image: "../../repos/kas-finance-v2/assets/logos/blink.png",
        },
        {
            name: "Blue Light Card",
            image: "../../repos/kas-finance-v2/assets/logos/blue-light-card.png",
        },
        {
            name: "Bluesky",
            image: "../../repos/kas-finance-v2/assets/logos/bluesky.jpeg",
        },
        {
            name: "Bodycare",
            image: "../../repos/kas-finance-v2/assets/logos/bodycare.png",
        },
        {
            name: "Bolsover District Council",
            image: "../../repos/kas-finance-v2/assets/logos/bolsover-district-council.png",
        },
        {
            name: "Bolton Metropolitan Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/bolton-metropolitan-borough-council.jpg",
        },
        {
            name: "Boots",
            image: "../../repos/kas-finance-v2/assets/logos/boots.png",
        },
        {
            name: "Boston Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/boston-borough-council.jpg",
        },
        {
            name: "Bournemouth Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/bournemouth-borough-council.png",
        },
        {
            name: "Bournemouth Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/bournemouth-borough-council.jpeg",
        },
        {
            name: "Bournemouth Christchurch And Poole Council",
            image: "../../repos/kas-finance-v2/assets/logos/bournemouth-christchurch-and-poole-council.jpg",
        },
        {
            name: "Bracknell Forest Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/bracknell-forest-borough-council.jpg",
        },
        {
            name: "Braintree District Council",
            image: "../../repos/kas-finance-v2/assets/logos/braintree-district-council.jpg",
        },
        {
            name: "Brave",
            image: "../../repos/kas-finance-v2/assets/logos/brave.jpg",
        },
        {
            name: "Breathehr",
            image: "../../repos/kas-finance-v2/assets/logos/breathehr.png",
        },
        {
            name: "Breckland District Council",
            image: "../../repos/kas-finance-v2/assets/logos/breckland-district-council.jpeg",
        },
        {
            name: "Brentwood Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/brentwood-borough-council.jpeg",
        },
        {
            name: "Bridgend County Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/bridgend-county-borough-council.jpeg",
        },
        {
            name: "Bristol City Council",
            image: "../../repos/kas-finance-v2/assets/logos/bristol-city-council.png",
        },
        {
            name: "British Airways",
            image: "../../repos/kas-finance-v2/assets/logos/british-airways.png",
        },
        {
            name: "British Gas",
            image: "../../repos/kas-finance-v2/assets/logos/british-gas.png",
        },
        {
            name: "Broadland District Council",
            image: "../../repos/kas-finance-v2/assets/logos/broadland-district-council.png",
        },
        {
            name: "Bromsgrove District Council",
            image: "../../repos/kas-finance-v2/assets/logos/bromsgrove-district-council.jpeg",
        },
        {
            name: "Broxbourne Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/broxbourne-borough-council.png",
        },
        {
            name: "Broxtowe Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/broxtowe-borough-council.jpg",
        },
        {
            name: "Buckinghamshire Council",
            image: "../../repos/kas-finance-v2/assets/logos/buckinghamshire-council.jpg",
        },
        {
            name: "Buckinghamshirecouncil",
            image: "../../repos/kas-finance-v2/assets/logos/buckinghamshirecouncil.jpg",
        },
        {
            name: "Bupa",
            image: "../../repos/kas-finance-v2/assets/logos/bupa.jpeg",
        },
        {
            name: "Burger King",
            image: "../../repos/kas-finance-v2/assets/logos/burger-king.png",
        },
        {
            name: "Burnley Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/burnley-borough-council.jpeg",
        },
        {
            name: "Bury Metropolitan Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/bury-metropolitan-borough-council.jpg",
        },
        {
            name: "Caerphilly County Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/caerphilly-county-borough-council.jpg",
        },
        {
            name: "Calderdale Metropolitan Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/calderdale-metropolitan-borough-council.jpg",
        },
        {
            name: "Cambridge City Council",
            image: "../../repos/kas-finance-v2/assets/logos/cambridge-city-council.jpg",
        },
        {
            name: "Cannock Chase District Council",
            image: "../../repos/kas-finance-v2/assets/logos/cannock-chase-district-council.jpg",
        },
        {
            name: "Canterbury City Council",
            image: "../../repos/kas-finance-v2/assets/logos/canterbury-city-council.jpg",
        },
        {
            name: "Car Vehicle",
            image: "../../repos/kas-finance-v2/assets/logos/car-vehicle.png",
        },
        {
            name: "Car Vehicle",
            image: "../../repos/kas-finance-v2/assets/logos/car-vehicle.jpeg",
        },
        {
            name: "Car1",
            image: "../../repos/kas-finance-v2/assets/logos/car1.png",
        },
        {
            name: "Card Factory",
            image: "../../repos/kas-finance-v2/assets/logos/card-factory.jpeg",
        },
        {
            name: "Cardiff County Council",
            image: "../../repos/kas-finance-v2/assets/logos/cardiff-county-council.jpg",
        },
        {
            name: "Carlisle City Council",
            image: "../../repos/kas-finance-v2/assets/logos/carlisle-city-council.jpg",
        },
        {
            name: "Carmarthenshire County Council",
            image: "../../repos/kas-finance-v2/assets/logos/carmarthenshire-county-council.png",
        },
        {
            name: "Cashroom",
            image: "../../repos/kas-finance-v2/assets/logos/cashroom.jpeg",
        },
        {
            name: "Castle Point Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/castle-point-borough-council.jpg",
        },
        {
            name: "Causeway Coast And Glens",
            image: "../../repos/kas-finance-v2/assets/logos/causeway-coast-and-glens.jpg",
        },
        {
            name: "Causeway Coast And Glens 1",
            image: "../../repos/kas-finance-v2/assets/logos/causeway-coast-and-glens-1.png",
        },
        {
            name: "Central Bedfordshire",
            image: "../../repos/kas-finance-v2/assets/logos/central-bedfordshire.jpeg",
        },
        {
            name: "Ceredigion County Council",
            image: "../../repos/kas-finance-v2/assets/logos/ceredigion-county-council.jpg",
        },
        {
            name: "Cex",
            image: "../../repos/kas-finance-v2/assets/logos/cex.jpeg",
        },
        {
            name: "Charnwood Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/charnwood-borough-council.jpg",
        },
        {
            name: "Chase",
            image: "../../repos/kas-finance-v2/assets/logos/chase.jpeg",
        },
        {
            name: "Chatgpt",
            image: "../../repos/kas-finance-v2/assets/logos/chatgpt.png",
        },
        {
            name: "Chelmsford Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/chelmsford-borough-council.png",
        },
        {
            name: "Cherwell District Council",
            image: "../../repos/kas-finance-v2/assets/logos/cherwell-district-council.png",
        },
        {
            name: "Cheshire East",
            image: "../../repos/kas-finance-v2/assets/logos/cheshire-east.jpeg",
        },
        {
            name: "Cheshire West And Chester Council",
            image: "../../repos/kas-finance-v2/assets/logos/cheshire-west-and-chester-council.jpeg",
        },
        {
            name: "Chesterfield Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/chesterfield-borough-council.png",
        },
        {
            name: "Chichester District Council",
            image: "../../repos/kas-finance-v2/assets/logos/chichester-district-council.jpeg",
        },
        {
            name: "Chiltern District Council",
            image: "../../repos/kas-finance-v2/assets/logos/chiltern-district-council.jpeg",
        },
        {
            name: "Chip",
            image: "../../repos/kas-finance-v2/assets/logos/chip.png",
        },
        {
            name: "Chorley Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/chorley-borough-council.jpg",
        },
        {
            name: "Christchurch Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/christchurch-borough-council.png",
        },
        {
            name: "City And County Of Swansea",
            image: "../../repos/kas-finance-v2/assets/logos/city-and-county-of-swansea.jpeg",
        },
        {
            name: "City Of Bradford Council",
            image: "../../repos/kas-finance-v2/assets/logos/city-of-bradford-council.jpg",
        },
        {
            name: "City Of Glasgow Council",
            image: "../../repos/kas-finance-v2/assets/logos/city-of-glasgow-council.png",
        },
        {
            name: "City Of York Council",
            image: "../../repos/kas-finance-v2/assets/logos/city-of-york-council.png",
        },
        {
            name: "Clackmannanshire Council",
            image: "../../repos/kas-finance-v2/assets/logos/clackmannanshire-council.jpg",
        },
        {
            name: "Claires",
            image: "../../repos/kas-finance-v2/assets/logos/claires.png",
        },
        {
            name: "Claude",
            image: "../../repos/kas-finance-v2/assets/logos/claude.png",
        },
        {
            name: "Claude",
            image: "../../repos/kas-finance-v2/assets/logos/claude.jpeg",
        },
        {
            name: "Clintons",
            image: "../../repos/kas-finance-v2/assets/logos/clintons.png",
        },
        {
            name: "Clothing",
            image: "../../repos/kas-finance-v2/assets/logos/clothing.png",
        },
        {
            name: "Club Earth",
            image: "../../repos/kas-finance-v2/assets/logos/club-earth.png",
        },
        {
            name: "Co Op",
            image: "../../repos/kas-finance-v2/assets/logos/co-op.jpg",
        },
        {
            name: "Colchester Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/colchester-borough-council.png",
        },
        {
            name: "Comhairle Nan Eilean Siar",
            image: "../../repos/kas-finance-v2/assets/logos/comhairle-nan-eilean-siar.jpeg",
        },
        {
            name: "Conwy County Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/conwy-county-borough-council.png",
        },
        {
            name: "Coop",
            image: "../../repos/kas-finance-v2/assets/logos/coop.png",
        },
        {
            name: "Copeland Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/copeland-borough-council.jpg",
        },
        {
            name: "Copilot",
            image: "../../repos/kas-finance-v2/assets/logos/copilot.jpeg",
        },
        {
            name: "Corby Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/corby-borough-council.jpeg",
        },
        {
            name: "Cornwall County Council",
            image: "../../repos/kas-finance-v2/assets/logos/cornwall-county-council.png",
        },
        {
            name: "Corporation Of The City Of London",
            image: "../../repos/kas-finance-v2/assets/logos/corporation-of-the-city-of-london.png",
        },
        {
            name: "Costa Coffee",
            image: "../../repos/kas-finance-v2/assets/logos/costa-coffee.png",
        },
        {
            name: "Cotswold District Council",
            image: "../../repos/kas-finance-v2/assets/logos/cotswold-district-council.jpg",
        },
        {
            name: "Council Of The Isles Of Scilly",
            image: "../../repos/kas-finance-v2/assets/logos/council-of-the-isles-of-scilly.jpeg",
        },
        {
            name: "Council Of The Isles Of Scilly",
            image: "../../repos/kas-finance-v2/assets/logos/council-of-the-isles-of-scilly.jpg",
        },
        {
            name: "Coventry City Council",
            image: "../../repos/kas-finance-v2/assets/logos/coventry-city-council.jpeg",
        },
        {
            name: "Craven District Council",
            image: "../../repos/kas-finance-v2/assets/logos/craven-district-council.jpg",
        },
        {
            name: "Crawley Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/crawley-borough-council.png",
        },
        {
            name: "Crowdcube",
            image: "../../repos/kas-finance-v2/assets/logos/crowdcube.png",
        },
        {
            name: "Crunchyroll",
            image: "../../repos/kas-finance-v2/assets/logos/crunchyroll.png",
        },
        {
            name: "Cumberland City Council",
            image: "../../repos/kas-finance-v2/assets/logos/cumberland-city-council.jpg",
        },
        {
            name: "Cumberland Council",
            image: "../../repos/kas-finance-v2/assets/logos/cumberland-council.png",
        },
        {
            name: "Cumberland Council Allerdale Borough",
            image: "../../repos/kas-finance-v2/assets/logos/cumberland-council-allerdale-borough.jpg",
        },
        {
            name: "Dacorum Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/dacorum-borough-council.jpg",
        },
        {
            name: "Darlington Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/darlington-borough-council.jpg",
        },
        {
            name: "Darlington Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/darlington-borough-council.png",
        },
        {
            name: "Dartford Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/dartford-borough-council.png",
        },
        {
            name: "Daventry District Council",
            image: "../../repos/kas-finance-v2/assets/logos/daventry-district-council.jpg",
        },
        {
            name: "Daventry District Council",
            image: "../../repos/kas-finance-v2/assets/logos/daventry-district-council.jpeg",
        },
        {
            name: "Deepseek",
            image: "../../repos/kas-finance-v2/assets/logos/deepseek.png",
        },
        {
            name: "Deliveroo",
            image: "../../repos/kas-finance-v2/assets/logos/deliveroo.jpeg",
        },
        {
            name: "Denbighshire County Council",
            image: "../../repos/kas-finance-v2/assets/logos/denbighshire-county-council.jpg",
        },
        {
            name: "Derby City Council",
            image: "../../repos/kas-finance-v2/assets/logos/derby-city-council.jpg",
        },
        {
            name: "Derbyshire Dales District Council",
            image: "../../repos/kas-finance-v2/assets/logos/derbyshire-dales-district-council.jpg",
        },
        {
            name: "Derry City And Strabane District Council",
            image: "../../repos/kas-finance-v2/assets/logos/derry-city-and-strabane-district-council.png",
        },
        {
            name: "Derry City And Strabane District Council",
            image: "../../repos/kas-finance-v2/assets/logos/derry-city-and-strabane-district-council.jpg",
        },
        {
            name: "Dhl",
            image: "../../repos/kas-finance-v2/assets/logos/dhl.png",
        },
        {
            name: "Direct Line",
            image: "../../repos/kas-finance-v2/assets/logos/direct-line.png",
        },
        {
            name: "Discord",
            image: "../../repos/kas-finance-v2/assets/logos/discord.png",
        },
        {
            name: "Disney",
            image: "../../repos/kas-finance-v2/assets/logos/disney.jpeg",
        },
        {
            name: "Disney Plus",
            image: "../../repos/kas-finance-v2/assets/logos/disney-plus.jpeg",
        },
        {
            name: "Dominos",
            image: "../../repos/kas-finance-v2/assets/logos/dominos.png",
        },
        {
            name: "Doncaster Metropolitan Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/doncaster-metropolitan-borough-council.png",
        },
        {
            name: "Dorset Council",
            image: "../../repos/kas-finance-v2/assets/logos/dorset-council.png",
        },
        {
            name: "Dover District Council",
            image: "../../repos/kas-finance-v2/assets/logos/dover-district-council.jpg",
        },
        {
            name: "Dpd",
            image: "../../repos/kas-finance-v2/assets/logos/dpd.png",
        },
        {
            name: "Dropbox",
            image: "../../repos/kas-finance-v2/assets/logos/dropbox.png",
        },
        {
            name: "Dudley Metropolitan Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/dudley-metropolitan-borough-council.jpeg",
        },
        {
            name: "Dumfries And Galloway Council",
            image: "../../repos/kas-finance-v2/assets/logos/dumfries-and-galloway-council.png",
        },
        {
            name: "Dundee City Council",
            image: "../../repos/kas-finance-v2/assets/logos/dundee-city-council.jpg",
        },
        {
            name: "Duolingo",
            image: "../../repos/kas-finance-v2/assets/logos/duolingo.png",
        },
        {
            name: "Durham County Council",
            image: "../../repos/kas-finance-v2/assets/logos/durham-county-council.png",
        },
        {
            name: "East Ayrshire Council",
            image: "../../repos/kas-finance-v2/assets/logos/east-ayrshire-council.jpeg",
        },
        {
            name: "East Cambridgeshire District Council",
            image: "../../repos/kas-finance-v2/assets/logos/east-cambridgeshire-district-council.png",
        },
        {
            name: "East Cambridgeshire District Council",
            image: "../../repos/kas-finance-v2/assets/logos/east-cambridgeshire-district-council.jpeg",
        },
        {
            name: "East Devon District Council",
            image: "../../repos/kas-finance-v2/assets/logos/east-devon-district-council.png",
        },
        {
            name: "East Dorset District Council",
            image: "../../repos/kas-finance-v2/assets/logos/east-dorset-district-council.jpg",
        },
        {
            name: "East Dunbartonshire Council",
            image: "../../repos/kas-finance-v2/assets/logos/east-dunbartonshire-council.jpeg",
        },
        {
            name: "East Hampshire District Council",
            image: "../../repos/kas-finance-v2/assets/logos/east-hampshire-district-council.jpeg",
        },
        {
            name: "East Hertfordshire District Council",
            image: "../../repos/kas-finance-v2/assets/logos/east-hertfordshire-district-council.png",
        },
        {
            name: "East Lindsey District Council",
            image: "../../repos/kas-finance-v2/assets/logos/east-lindsey-district-council.jpg",
        },
        {
            name: "East Lothian Council",
            image: "../../repos/kas-finance-v2/assets/logos/east-lothian-council.jpg",
        },
        {
            name: "East Lothian Council",
            image: "../../repos/kas-finance-v2/assets/logos/east-lothian-council.png",
        },
        {
            name: "East Northamptonshire Council",
            image: "../../repos/kas-finance-v2/assets/logos/east-northamptonshire-council.jpg",
        },
        {
            name: "East Renfrewshire Council",
            image: "../../repos/kas-finance-v2/assets/logos/east-renfrewshire-council.jpg",
        },
        {
            name: "East Renfrewshire Council",
            image: "../../repos/kas-finance-v2/assets/logos/east-renfrewshire-council.jpeg",
        },
        {
            name: "East Riding Of Yorkshire Council",
            image: "../../repos/kas-finance-v2/assets/logos/east-riding-of-yorkshire-council.jpeg",
        },
        {
            name: "East Staffordshire Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/east-staffordshire-borough-council.jpg",
        },
        {
            name: "East Suffolk Council",
            image: "../../repos/kas-finance-v2/assets/logos/east-suffolk-council.png",
        },
        {
            name: "Eastbourne Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/eastbourne-borough-council.jpg",
        },
        {
            name: "Eastbourne Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/eastbourne-borough-council.jpeg",
        },
        {
            name: "Eastleigh Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/eastleigh-borough-council.jpg",
        },
        {
            name: "Eastleigh Borough Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/eastleigh-borough-council-1.jpg",
        },
        {
            name: "Easyjet",
            image: "../../repos/kas-finance-v2/assets/logos/easyjet.png",
        },
        {
            name: "Ebay",
            image: "../../repos/kas-finance-v2/assets/logos/ebay.png",
        },
        {
            name: "Eden District Council",
            image: "../../repos/kas-finance-v2/assets/logos/eden-district-council.jpg",
        },
        {
            name: "Edge",
            image: "../../repos/kas-finance-v2/assets/logos/edge.jpeg",
        },
        {
            name: "Edinburgh City Council",
            image: "../../repos/kas-finance-v2/assets/logos/edinburgh-city-council.jpeg",
        },
        {
            name: "Edinburgh City Council",
            image: "../../repos/kas-finance-v2/assets/logos/edinburgh-city-council.jpg",
        },
        {
            name: "Ee",
            image: "../../repos/kas-finance-v2/assets/logos/ee.png",
        },
        {
            name: "Elmbridge Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/elmbridge-borough-council.jpg",
        },
        {
            name: "Emirates",
            image: "../../repos/kas-finance-v2/assets/logos/emirates.png",
        },
        {
            name: "Epping Forest District Council",
            image: "../../repos/kas-finance-v2/assets/logos/epping-forest-district-council.jpg",
        },
        {
            name: "Epsom And Ewell Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/epsom and-ewell-borough-council.jpeg",
        },
        {
            name: "Erewash Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/erewash-borough-council.jpg",
        },
        {
            name: "Esure",
            image: "../../repos/kas-finance-v2/assets/logos/esure.jpeg",
        },
        {
            name: "Etihad Airways",
            image: "../../repos/kas-finance-v2/assets/logos/etihad-airways.png",
        },
        {
            name: "Etoro",
            image: "../../repos/kas-finance-v2/assets/logos/etoro.png",
        },
        {
            name: "Etsy",
            image: "../../repos/kas-finance-v2/assets/logos/etsy.png",
        },
        {
            name: "Evri",
            image: "../../repos/kas-finance-v2/assets/logos/evri.png",
        },
        {
            name: "Example",
            image: "../../repos/kas-finance-v2/assets/logos/example.png",
        },
        {
            name: "Exeter City Council",
            image: "../../repos/kas-finance-v2/assets/logos/exeter-city-council.png",
        },
        {
            name: "Exeter City Council",
            image: "../../repos/kas-finance-v2/assets/logos/exeter-city-council.jpg",
        },
        {
            name: "Facebook",
            image: "../../repos/kas-finance-v2/assets/logos/facebook.png",
        },
        {
            name: "Facebook",
            image: "../../repos/kas-finance-v2/assets/logos/facebook.jpeg",
        },
        {
            name: "Falkirk Council",
            image: "../../repos/kas-finance-v2/assets/logos/falkirk-council.png",
        },
        {
            name: "Fareham Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/fareham-borough-council.jpg",
        },
        {
            name: "Fenland District Council",
            image: "../../repos/kas-finance-v2/assets/logos/fenland-district-council.jpeg",
        },
        {
            name: "Fermanagh And Omagh District Council",
            image: "../../repos/kas-finance-v2/assets/logos/fermanagh-and-omagh-district-council.jpg",
        },
        {
            name: "Fife Council",
            image: "../../repos/kas-finance-v2/assets/logos/fife-council.png",
        },
        {
            name: "Firefox",
            image: "../../repos/kas-finance-v2/assets/logos/firefox.jpeg",
        },
        {
            name: "Flintshire County Council",
            image: "../../repos/kas-finance-v2/assets/logos/flintshire-county-council.jpg",
        },
        {
            name: "Folkestone And Hythe District Council",
            image: "../../repos/kas-finance-v2/assets/logos/folkestone-and-hythe-district-council.jpg",
        },
        {
            name: "Food Warehouse",
            image: "../../repos/kas-finance-v2/assets/logos/food-warehouse.jpg",
        },
        {
            name: "Forest Of Dean District Council",
            image: "../../repos/kas-finance-v2/assets/logos/forest-of-dean-district-council.jpg",
        },
        {
            name: "Funimation",
            image: "../../repos/kas-finance-v2/assets/logos/funimation.png",
        },
        {
            name: "Fylde Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/fylde-borough-council.jpg",
        },
        {
            name: "Game",
            image: "../../repos/kas-finance-v2/assets/logos/game.jpeg",
        },
        {
            name: "Gateshead Metropolitan Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/gateshead-metropolitan-borough-council.jpeg",
        },
        {
            name: "Gateshead Metropolitan Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/gateshead-metropolitan-borough-council.png",
        },
        {
            name: "Gateshead Metropolitan Borough Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/gateshead-metropolitan-borough-council-1.png",
        },
        {
            name: "Gedling Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/gedling-borough-council.png",
        },
        {
            name: "Gedling Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/gedling-borough-council.jpg",
        },
        {
            name: "Gemini",
            image: "../../repos/kas-finance-v2/assets/logos/gemini.png",
        },
        {
            name: "Gloucester City Council",
            image: "../../repos/kas-finance-v2/assets/logos/gloucester-city-council.jpg",
        },
        {
            name: "Google",
            image: "../../repos/kas-finance-v2/assets/logos/google.jpeg",
        },
        {
            name: "Google Drive",
            image: "../../repos/kas-finance-v2/assets/logos/google-drive.png",
        },
        {
            name: "Google Play",
            image: "../../repos/kas-finance-v2/assets/logos/google-play.png",
        },
        {
            name: "Gosport Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/gosport-borough-council.png",
        },
        {
            name: "Gravesham Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/gravesham-borough-council.png",
        },
        {
            name: "Great Yarmouth Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/great-yarmouth-borough-council.jpg",
        },
        {
            name: "Greater Manchester Combined Authority",
            image: "../../repos/kas-finance-v2/assets/logos/greater-manchester-combined-authority.jpg",
        },
        {
            name: "Greggs",
            image: "../../repos/kas-finance-v2/assets/logos/greggs.png",
        },
        {
            name: "Groceries",
            image: "../../repos/kas-finance-v2/assets/logos/groceries.png",
        },
        {
            name: "Grok",
            image: "../../repos/kas-finance-v2/assets/logos/grok.png",
        },
        {
            name: "Guildford Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/guildford-borough-council.png",
        },
        {
            name: "Guildford Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/guildford-borough-council.jpeg",
        },
        {
            name: "Gwynedd Council",
            image: "../../repos/kas-finance-v2/assets/logos/gwynedd-council.png",
        },
        {
            name: "H And M",
            image: "../../repos/kas-finance-v2/assets/logos/h-and-m.png",
        },
        {
            name: "Halton Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/halton-borough-council.jpg",
        },
        {
            name: "Hambleton District Council",
            image: "../../repos/kas-finance-v2/assets/logos/hambleton-district-council.jpg",
        },
        {
            name: "Handelsbanken",
            image: "../../repos/kas-finance-v2/assets/logos/handelsbanken.jpg",
        },
        {
            name: "Handelsbanken",
            image: "../../repos/kas-finance-v2/assets/logos/handelsbanken.png",
        },
        {
            name: "Harborough District Council",
            image: "../../repos/kas-finance-v2/assets/logos/harborough-district-council.jpeg",
        },
        {
            name: "Harlow District Council",
            image: "../../repos/kas-finance-v2/assets/logos/harlow-district-council.jpg",
        },
        {
            name: "Harrogate Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/harrogate-borough-council.jpg",
        },
        {
            name: "Hart District Council",
            image: "../../repos/kas-finance-v2/assets/logos/hart-district-council.png",
        },
        {
            name: "Hartlepool Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/hartlepool-borough-council.jpg",
        },
        {
            name: "Hastings Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/hastings-borough-council.jpeg",
        },
        {
            name: "Hastings Borough Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/hastings-borough-council-1.jpg",
        },
        {
            name: "Havant Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/havant-borough-council.jpg",
        },
        {
            name: "Herefordshire Council",
            image: "../../repos/kas-finance-v2/assets/logos/herefordshire-council.png",
        },
        {
            name: "Hertsmere Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/hertsmere-borough-council.jpg",
        },
        {
            name: "High Peak Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/high-peak-borough-council.png",
        },
        {
            name: "High Peak Borough Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/high-peak-borough-council-1.png",
        },
        {
            name: "Highland Council",
            image: "../../repos/kas-finance-v2/assets/logos/highland-council.jpg",
        },
        {
            name: "Hinckley And Bosworth Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/hinckley-and-bosworth-borough-council.jpg",
        },
        {
            name: "Hiscox",
            image: "../../repos/kas-finance-v2/assets/logos/hiscox.jpeg",
        },
        {
            name: "Hive",
            image: "../../repos/kas-finance-v2/assets/logos/hive.png",
        },
        {
            name: "HMRC",
            image: "../../repos/kas-finance-v2/assets/logos/hm-revenue-and-customs-hmrc.png",
        },
        {
            name: "Hmv",
            image: "../../repos/kas-finance-v2/assets/logos/hmv.png",
        },
        {
            name: "Holland And Barrett",
            image: "../../repos/kas-finance-v2/assets/logos/holland-and-barrett.png",
        },
        {
            name: "Home",
            image: "../../repos/kas-finance-v2/assets/logos/home.png",
        },
        {
            name: "Horsham District Council",
            image: "../../repos/kas-finance-v2/assets/logos/horsham-district-council.png",
        },
        {
            name: "Hotel Chocolat",
            image: "../../repos/kas-finance-v2/assets/logos/hotel-chocolat.png",
        },
        {
            name: "House Home Property",
            image: "../../repos/kas-finance-v2/assets/logos/house-home-property.png",
        },
        {
            name: "House Home Property 1",
            image: "../../repos/kas-finance-v2/assets/logos/house-home-property-1.png",
        },
        {
            name: "Hsbc",
            image: "../../repos/kas-finance-v2/assets/logos/hsbc.png",
        },
        {
            name: "Hsbc Business",
            image: "../../repos/kas-finance-v2/assets/logos/hsbc-business.png",
        },
        {
            name: "Hsbcnet",
            image: "../../repos/kas-finance-v2/assets/logos/hsbcnet.png",
        },
        {
            name: "Huntingdonshire District Council",
            image: "../../repos/kas-finance-v2/assets/logos/huntingdonshire-district-council.png",
        },
        {
            name: "Hyndburn Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/hyndburn-borough-council.jpg",
        },
        {
            name: "Hyndburn Borough Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/hyndburn-borough-council-1.jpg",
        },
        {
            name: "Icedrive",
            image: "../../repos/kas-finance-v2/assets/logos/icedrive.jpeg",
        },
        {
            name: "Iceland",
            image: "../../repos/kas-finance-v2/assets/logos/iceland.jpg",
        },
        {
            name: "Icloud",
            image: "../../repos/kas-finance-v2/assets/logos/icloud.jpeg",
        },
        {
            name: "Ikea",
            image: "../../repos/kas-finance-v2/assets/logos/ikea.png",
        },
        {
            name: "Instagram",
            image: "../../repos/kas-finance-v2/assets/logos/instagram.png",
        },
        {
            name: "Instgram",
            image: "../../repos/kas-finance-v2/assets/logos/instgram.png",
        },
        {
            name: "Inverclyde Council",
            image: "../../repos/kas-finance-v2/assets/logos/inverclyde-council.jpeg",
        },
        {
            name: "Ipswich Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/ipswich-borough-council.jpg",
        },
        {
            name: "Ipswich Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/ipswich-borough-council.png",
        },
        {
            name: "Isle Of Anglesey County Council",
            image: "../../repos/kas-finance-v2/assets/logos/isle-of-anglesey-county-council.jpg",
        },
        {
            name: "Isle Of Wight Council",
            image: "../../repos/kas-finance-v2/assets/logos/isle-of-wight-council.jpeg",
        },
        {
            name: "Isle Of Wight Council",
            image: "../../repos/kas-finance-v2/assets/logos/isle-of-wight-council.jpg",
        },
        {
            name: "Jd Sports",
            image: "../../repos/kas-finance-v2/assets/logos/jd-sports.png",
        },
        {
            name: "Jdsports",
            image: "../../repos/kas-finance-v2/assets/logos/jdsports.png",
        },
        {
            name: "Jet2",
            image: "../../repos/kas-finance-v2/assets/logos/jet2.jpeg",
        },
        {
            name: "John Lewis",
            image: "../../repos/kas-finance-v2/assets/logos/john-lewis.jpg",
        },
        {
            name: "John Lewis",
            image: "../../repos/kas-finance-v2/assets/logos/john-lewis.png",
        },
        {
            name: "Just Eat",
            image: "../../repos/kas-finance-v2/assets/logos/just-eat.png",
        },
        {
            name: "Kettering Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/kettering-borough-council.jpg",
        },
        {
            name: "Kfc",
            image: "../../repos/kas-finance-v2/assets/logos/kfc.png",
        },
        {
            name: "Kings Lynn And West Norfolk Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/kings-lynn-and-west-norfolk-borough-council.png",
        },
        {
            name: "Kingston Upon Hull City Council",
            image: "../../repos/kas-finance-v2/assets/logos/kingston-upon-hull-city-council.jpg",
        },
        {
            name: "Kingston Upon Hull City Council",
            image: "../../repos/kas-finance-v2/assets/logos/kingston-upon-hull-city-council.jpeg",
        },
        {
            name: "Kirklees Metropolitan Council",
            image: "../../repos/kas-finance-v2/assets/logos/kirklees-metropolitan-council.jpeg",
        },
        {
            name: "Klarna",
            image: "../../repos/kas-finance-v2/assets/logos/klarna.jpeg",
        },
        {
            name: "Knowsley Metropolitan Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/knowsley-metropolitan-borough-council.png",
        },
        {
            name: "Lancaster City Council",
            image: "../../repos/kas-finance-v2/assets/logos/lancaster-city-council.jpg",
        },
        {
            name: "Leeds City Council",
            image: "../../repos/kas-finance-v2/assets/logos/leeds-city-council.jpg",
        },
        {
            name: "Leicester City Council",
            image: "../../repos/kas-finance-v2/assets/logos/leicester-city-council.png",
        },
        {
            name: "Lewes District Council",
            image: "../../repos/kas-finance-v2/assets/logos/lewes-district-council.jpeg",
        },
        {
            name: "Lichfield District Council",
            image: "../../repos/kas-finance-v2/assets/logos/lichfield-district-council.jpeg",
        },
        {
            name: "Lidl",
            image: "../../repos/kas-finance-v2/assets/logos/lidl.jpg",
        },
        {
            name: "Lincoln City Council",
            image: "../../repos/kas-finance-v2/assets/logos/lincoln-city-council.png",
        },
        {
            name: "Linkedin",
            image: "../../repos/kas-finance-v2/assets/logos/linkedin.png",
        },
        {
            name: "Lisburn City And Castlereagh District Council",
            image: "../../repos/kas-finance-v2/assets/logos/lisburn-city-and-castlereagh-district-council.png",
        },
        {
            name: "Liverpool City Council",
            image: "../../repos/kas-finance-v2/assets/logos/liverpool-city-council.png",
        },
        {
            name: "Liverpool City Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/liverpool-city-council-1.png",
        },
        {
            name: "Lloyds",
            image: "../../repos/kas-finance-v2/assets/logos/lloyds.jpg",
        },
        {
            name: "London Borough Of Barking And Dagenham",
            image: "../../repos/kas-finance-v2/assets/logos/london-borough-of-barking-and-dagenham.jpg",
        },
        {
            name: "London Borough Of Barnet",
            image: "../../repos/kas-finance-v2/assets/logos/london-borough-of-barnet.png",
        },
        {
            name: "London Borough Of Bexley",
            image: "../../repos/kas-finance-v2/assets/logos/london-borough-of-bexley.jpg",
        },
        {
            name: "London Borough Of Brent",
            image: "../../repos/kas-finance-v2/assets/logos/london-borough-of-brent.jpg",
        },
        {
            name: "London Borough Of Brent",
            image: "../../repos/kas-finance-v2/assets/logos/london-borough-of-brent.png",
        },
        {
            name: "London Borough Of Bromley Council",
            image: "../../repos/kas-finance-v2/assets/logos/london-borough-of-bromley-council.png",
        },
        {
            name: "London Borough Of Camden",
            image: "../../repos/kas-finance-v2/assets/logos/london-borough-of-camden.jpg",
        },
        {
            name: "London Borough Of Croydon",
            image: "../../repos/kas-finance-v2/assets/logos/london-borough-of-croydon.jpg",
        },
        {
            name: "London Borough Of Ealing",
            image: "../../repos/kas-finance-v2/assets/logos/london-borough-of-ealing.jpg",
        },
        {
            name: "London Borough Of Enfield",
            image: "../../repos/kas-finance-v2/assets/logos/london-borough-of-enfield.jpg",
        },
        {
            name: "London Borough Of Hackney",
            image: "../../repos/kas-finance-v2/assets/logos/london-borough-of-hackney.jpg",
        },
        {
            name: "London Borough Of Hammersmith And Fulham",
            image: "../../repos/kas-finance-v2/assets/logos/london-borough-of-hammersmith-and-fulham.jpg",
        },
        {
            name: "London Borough Of Haringey",
            image: "../../repos/kas-finance-v2/assets/logos/london-borough-of-haringey.jpg",
        },
        {
            name: "London Borough Of Harrow",
            image: "../../repos/kas-finance-v2/assets/logos/london-borough-of-harrow.jpg",
        },
        {
            name: "London Borough Of Havering",
            image: "../../repos/kas-finance-v2/assets/logos/london-borough-of-havering.jpg",
        },
        {
            name: "London Borough Of Hillingdon",
            image: "../../repos/kas-finance-v2/assets/logos/london-borough-of-hillingdon.jpg",
        },
        {
            name: "London Borough Of Hounslow",
            image: "../../repos/kas-finance-v2/assets/logos/london-borough-of-hounslow.jpg",
        },
        {
            name: "London Borough Of Islington",
            image: "../../repos/kas-finance-v2/assets/logos/london-borough-of-islington.png",
        },
        {
            name: "London Borough Of Lambeth",
            image: "../../repos/kas-finance-v2/assets/logos/london-borough-of-lambeth.jpg",
        },
        {
            name: "London Borough Of Lewisham",
            image: "../../repos/kas-finance-v2/assets/logos/london-borough-of-lewisham.jpg",
        },
        {
            name: "London Borough Of Merton",
            image: "../../repos/kas-finance-v2/assets/logos/london-borough-of-merton.jpg",
        },
        {
            name: "London Borough Of Newham",
            image: "../../repos/kas-finance-v2/assets/logos/london-borough-of-newham.jpg",
        },
        {
            name: "London Borough Of Redbridge",
            image: "../../repos/kas-finance-v2/assets/logos/london-borough-of-redbridge.jpg",
        },
        {
            name: "London Borough Of Richmond",
            image: "../../repos/kas-finance-v2/assets/logos/london-borough-of-richmond.jpeg",
        },
        {
            name: "London Borough Of Richmond",
            image: "../../repos/kas-finance-v2/assets/logos/london-borough-of-richmond.png",
        },
        {
            name: "London Borough Of Southwark",
            image: "../../repos/kas-finance-v2/assets/logos/london-borough-of-southwark.jpg",
        },
        {
            name: "London Borough Of Sutton",
            image: "../../repos/kas-finance-v2/assets/logos/london-borough-of-sutton.jpg",
        },
        {
            name: "London Borough Of Tower Hamlets",
            image: "../../repos/kas-finance-v2/assets/logos/london-borough-of-tower-hamlets.jpg",
        },
        {
            name: "London Borough Of Waltham Forest",
            image: "../../repos/kas-finance-v2/assets/logos/london-borough-of-waltham-forest.jpg",
        },
        {
            name: "London Borough Of Wandsworth",
            image: "../../repos/kas-finance-v2/assets/logos/london-borough-of-wandsworth.jpg",
        },
        {
            name: "London Borough Of Westminster",
            image: "../../repos/kas-finance-v2/assets/logos/london-borough-of-westminster.jpg",
        },
        {
            name: "Luton Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/luton-borough-council.jpg",
        },
        {
            name: "Lv",
            image: "../../repos/kas-finance-v2/assets/logos/lv.jpeg",
        },
        {
            name: "Maidstone Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/maidstone-borough-council.png",
        },
        {
            name: "Maidstone Borough Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/maidstone-borough-council-1.png",
        },
        {
            name: "Maldon District Council",
            image: "../../repos/kas-finance-v2/assets/logos/maldon-district-council.png",
        },
        {
            name: "Malvern Hills District Council",
            image: "../../repos/kas-finance-v2/assets/logos/malvern-hills-district-council.jpg",
        },
        {
            name: "Manchester City Council",
            image: "../../repos/kas-finance-v2/assets/logos/manchester-city-council.svg",
        },
        {
            name: "Manchester City Council",
            image: "../../repos/kas-finance-v2/assets/logos/manchester-city-council.jpg",
        },
        {
            name: "Mansfield District Council",
            image: "../../repos/kas-finance-v2/assets/logos/mansfield-district-council.jpeg",
        },
        {
            name: "Mansfield District Council",
            image: "../../repos/kas-finance-v2/assets/logos/mansfield-district-council.jpg",
        },
        {
            name: "Marcus",
            image: "../../repos/kas-finance-v2/assets/logos/marcus.png",
        },
        {
            name: "Marks And Spencer",
            image: "../../repos/kas-finance-v2/assets/logos/marks-and-spencer.png",
        },
        {
            name: "Mcdonalds",
            image: "../../repos/kas-finance-v2/assets/logos/mcdonalds.png",
        },
        {
            name: "Medicash",
            image: "../../repos/kas-finance-v2/assets/logos/medicash.png",
        },
        {
            name: "Medway Council",
            image: "../../repos/kas-finance-v2/assets/logos/medway-council.png",
        },
        {
            name: "Mega",
            image: "../../repos/kas-finance-v2/assets/logos/mega.jpeg",
        },
        {
            name: "Melton Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/melton-borough-council.png",
        },
        {
            name: "Melton Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/melton-borough-council.jpg",
        },
        {
            name: "Mendip District Council",
            image: "../../repos/kas-finance-v2/assets/logos/mendip-district-council.jpg",
        },
        {
            name: "Mendip District Council",
            image: "../../repos/kas-finance-v2/assets/logos/mendip-district-council.png",
        },
        {
            name: "Menkind",
            image: "../../repos/kas-finance-v2/assets/logos/menkind.png",
        },
        {
            name: "Merthyr Tydfil County Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/merthyr-tydfil-county-borough-council.jpg",
        },
        {
            name: "Merthyr Tydfil County Borough Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/merthyr-tydfil-county-borough-council-1.jpg",
        },
        {
            name: "Metro",
            image: "../../repos/kas-finance-v2/assets/logos/metro.png",
        },
        {
            name: "Microsoft",
            image: "../../repos/kas-finance-v2/assets/logos/microsoft.jpeg",
        },
        {
            name: "Mid And East Antrim District Council",
            image: "../../repos/kas-finance-v2/assets/logos/mid-and-east-antrim-district-council.jpeg",
        },
        {
            name: "Mid Devon District Council",
            image: "../../repos/kas-finance-v2/assets/logos/mid-devon-district-council.png",
        },
        {
            name: "Mid Suffolk District Council",
            image: "../../repos/kas-finance-v2/assets/logos/mid-suffolk-district-council.jpg",
        },
        {
            name: "Mid Sussex District Council",
            image: "../../repos/kas-finance-v2/assets/logos/mid-sussex-district-council.jpeg",
        },
        {
            name: "Mid Sussex District Council",
            image: "../../repos/kas-finance-v2/assets/logos/mid-sussex-district-council.jpg",
        },
        {
            name: "Mid Ulster District Council",
            image: "../../repos/kas-finance-v2/assets/logos/mid-ulster-district-council.png",
        },
        {
            name: "Mid Ulster District Council",
            image: "../../repos/kas-finance-v2/assets/logos/mid-ulster-district-council.jpg",
        },
        {
            name: "Middlesbrough Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/middlesbrough-borough-council.jpg",
        },
        {
            name: "Midlothian Council",
            image: "../../repos/kas-finance-v2/assets/logos/midlothian-council.jpg",
        },
        {
            name: "Millies Cookies",
            image: "../../repos/kas-finance-v2/assets/logos/millies-cookies.jpeg",
        },
        {
            name: "Milton Keynes Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/milton-keynes-borough-council.jpeg",
        },
        {
            name: "Mole Valley District Council",
            image: "../../repos/kas-finance-v2/assets/logos/mole-valley-district-council.png",
        },
        {
            name: "Mole Valley District Council",
            image: "../../repos/kas-finance-v2/assets/logos/mole-valley-district-council.jpeg",
        },
        {
            name: "Moneybox",
            image: "../../repos/kas-finance-v2/assets/logos/moneybox.jpeg",
        },
        {
            name: "Monmouthshire Council",
            image: "../../repos/kas-finance-v2/assets/logos/monmouthshire-council.png",
        },
        {
            name: "Monmouthshire Council",
            image: "../../repos/kas-finance-v2/assets/logos/monmouthshire-council.jpg",
        },
        {
            name: "Monument",
            image: "../../repos/kas-finance-v2/assets/logos/monument.png",
        },
        {
            name: "Monzo",
            image: "../../repos/kas-finance-v2/assets/logos/monzo.png",
        },
        {
            name: "Moray Council",
            image: "../../repos/kas-finance-v2/assets/logos/moray-council.jpeg",
        },
        {
            name: "Moray Council",
            image: "../../repos/kas-finance-v2/assets/logos/moray-council.jpg",
        },
        {
            name: "Morrisons",
            image: "../../repos/kas-finance-v2/assets/logos/morrisons.jpeg",
        },
        {
            name: "Nandos",
            image: "../../repos/kas-finance-v2/assets/logos/nandos.png",
        },
        {
            name: "National Lottery",
            image: "../../repos/kas-finance-v2/assets/logos/national-lottery.png",
        },
        {
            name: "National Savings And Investments",
            image: "../../repos/kas-finance-v2/assets/logos/national-savings-and-investments.png",
        },
        {
            name: "National Savings And Investments",
            image: "../../repos/kas-finance-v2/assets/logos/national-savings-and-investments.jpeg",
        },
        {
            name: "Nationwide",
            image: "../../repos/kas-finance-v2/assets/logos/nationwide.jpeg",
        },
        {
            name: "Natwest",
            image: "../../repos/kas-finance-v2/assets/logos/natwest.jpg",
        },
        {
            name: "Natwest Bankline",
            image: "../../repos/kas-finance-v2/assets/logos/natwest-bankline.png",
        },
        {
            name: "Ncp",
            image: "../../repos/kas-finance-v2/assets/logos/ncp.jpeg",
        },
        {
            name: "Ncp",
            image: "../../repos/kas-finance-v2/assets/logos/ncp.png",
        },
        {
            name: "Neath Port Talbot County Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/neath-port-talbot-county-borough-council.jpg",
        },
        {
            name: "Neath Port Talbot County Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/neath-port-talbot-county-borough-council.jpeg",
        },
        {
            name: "Netflix",
            image: "../../repos/kas-finance-v2/assets/logos/netflix.png",
        },
        {
            name: "New Forest District Council",
            image: "../../repos/kas-finance-v2/assets/logos/new-forest-district-council.png",
        },
        {
            name: "New Forest District Council",
            image: "../../repos/kas-finance-v2/assets/logos/new-forest-district-council.jpg",
        },
        {
            name: "New Forest District Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/new-forest-district-council-1.jpg",
        },
        {
            name: "New Look",
            image: "../../repos/kas-finance-v2/assets/logos/new-look.png",
        },
        {
            name: "Newark And Sherwood District Council",
            image: "../../repos/kas-finance-v2/assets/logos/newark-and-sherwood-district-council.png",
        },
        {
            name: "Newcastle City Council",
            image: "../../repos/kas-finance-v2/assets/logos/newcastle-city-council.jpg",
        },
        {
            name: "Newcastle City Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/newcastle-city-council-1.jpg",
        },
        {
            name: "Newcastle Under Lyme Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/newcastle-under-lyme-borough-council.jpg",
        },
        {
            name: "Newcastle Under Lyme Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/newcastle-under-lyme-borough-council.png",
        },
        {
            name: "Newport City Council",
            image: "../../repos/kas-finance-v2/assets/logos/newport-city-council.png",
        },
        {
            name: "Newry Mourne And Down District Council",
            image: "../../repos/kas-finance-v2/assets/logos/newry-mourne-and-down-district-council.jpg",
        },
        {
            name: "Next",
            image: "../../repos/kas-finance-v2/assets/logos/next.png",
        },
        {
            name: "Nhs",
            image: "../../repos/kas-finance-v2/assets/logos/nhs.jpeg",
        },
        {
            name: "Nhs",
            image: "../../repos/kas-finance-v2/assets/logos/nhs.png",
        },
        {
            name: "Nintendo",
            image: "../../repos/kas-finance-v2/assets/logos/nintendo.png",
        },
        {
            name: "Nordvpn",
            image: "../../repos/kas-finance-v2/assets/logos/nordvpn.png",
        },
        {
            name: "North Ayrshire Council",
            image: "../../repos/kas-finance-v2/assets/logos/north-ayrshire-council.png",
        },
        {
            name: "North Ayrshire Council",
            image: "../../repos/kas-finance-v2/assets/logos/north-ayrshire-council.jpg",
        },
        {
            name: "North Devon District Council",
            image: "../../repos/kas-finance-v2/assets/logos/north-devon-district-council.png",
        },
        {
            name: "North Dorset District Council",
            image: "../../repos/kas-finance-v2/assets/logos/north-dorset-district-council.png",
        },
        {
            name: "North Dorset District Council",
            image: "../../repos/kas-finance-v2/assets/logos/north-dorset-district-council.jpg",
        },
        {
            name: "North Dorset District Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/north-dorset-district-council-1.jpg",
        },
        {
            name: "North Down And Ards District Council",
            image: "../../repos/kas-finance-v2/assets/logos/north-down-and-ards-district-council.png",
        },
        {
            name: "North Down And Ards District Council",
            image: "../../repos/kas-finance-v2/assets/logos/north-down-and-ards-district-council.jpeg",
        },
        {
            name: "North East Derbyshire District Council",
            image: "../../repos/kas-finance-v2/assets/logos/north-east-derbyshire-district-council.jpeg",
        },
        {
            name: "North East Lincolnshire Council",
            image: "../../repos/kas-finance-v2/assets/logos/north-east-lincolnshire-council.png",
        },
        {
            name: "North Hertfordshire District Council",
            image: "../../repos/kas-finance-v2/assets/logos/north-hertfordshire-district-council.jpeg",
        },
        {
            name: "North Kesteven District Council",
            image: "../../repos/kas-finance-v2/assets/logos/north-kesteven-district-council.jpeg",
        },
        {
            name: "North Kesteven District Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/north-kesteven-district-council-1.jpeg",
        },
        {
            name: "North Lanarkshire Council",
            image: "../../repos/kas-finance-v2/assets/logos/north-lanarkshire-council.jpg",
        },
        {
            name: "North Lincolnshire Council",
            image: "../../repos/kas-finance-v2/assets/logos/north-lincolnshire-council.png",
        },
        {
            name: "North Norfolk District Council",
            image: "../../repos/kas-finance-v2/assets/logos/north-norfolk-district-council.png",
        },
        {
            name: "North Norfolk District Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/north-norfolk-district-council-1.png",
        },
        {
            name: "North Northamptonshire Council",
            image: "../../repos/kas-finance-v2/assets/logos/north-northamptonshire-council.jpeg",
        },
        {
            name: "North Somerset Council",
            image: "../../repos/kas-finance-v2/assets/logos/north-somerset-council.jpg",
        },
        {
            name: "North Somerset Council",
            image: "../../repos/kas-finance-v2/assets/logos/north-somerset-council.png",
        },
        {
            name: "North Tyneside Council",
            image: "../../repos/kas-finance-v2/assets/logos/north-tyneside-council.jpg",
        },
        {
            name: "North Tyneside Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/north-tyneside-council-1.jpg",
        },
        {
            name: "North Warwickshire Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/north-warwickshire-borough-council.jpg",
        },
        {
            name: "North Warwickshire Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/north-warwickshire-borough-council.jpeg",
        },
        {
            name: "North Warwickshire Borough Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/north-warwickshire-borough-council-1.jpeg",
        },
        {
            name: "North West Leicestershire District Council",
            image: "../../repos/kas-finance-v2/assets/logos/north-west-leicestershire-district-council.jpg",
        },
        {
            name: "North Yorkshire Council",
            image: "../../repos/kas-finance-v2/assets/logos/north-yorkshire-council.jpg",
        },
        {
            name: "Northampton Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/northampton-borough-council.jpeg",
        },
        {
            name: "Northumberland Council",
            image: "../../repos/kas-finance-v2/assets/logos/northumberland-council.png",
        },
        {
            name: "Northumberland Council",
            image: "../../repos/kas-finance-v2/assets/logos/northumberland-council.jpg",
        },
        {
            name: "Norwich City Council",
            image: "../../repos/kas-finance-v2/assets/logos/norwich-city-council.jpg",
        },
        {
            name: "Norwich City Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/norwich-city-council-1.jpg",
        },
        {
            name: "Notion",
            image: "../../repos/kas-finance-v2/assets/logos/notion.png",
        },
        {
            name: "Nottingham City Council",
            image: "../../repos/kas-finance-v2/assets/logos/nottingham-city-council.png",
        },
        {
            name: "Nowtv",
            image: "../../repos/kas-finance-v2/assets/logos/nowtv.jpeg",
        },
        {
            name: "Nuneaton And Bedworth Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/nuneaton-and-bedworth-borough-council.jpg",
        },
        {
            name: "O2",
            image: "../../repos/kas-finance-v2/assets/logos/o2.jpeg",
        },
        {
            name: "Oadby And Wigston District Council",
            image: "../../repos/kas-finance-v2/assets/logos/oadby-and-wigston-district-council.jpeg",
        },
        {
            name: "Ocado",
            image: "../../repos/kas-finance-v2/assets/logos/ocado.png",
        },
        {
            name: "Octopus",
            image: "../../repos/kas-finance-v2/assets/logos/octopus.png",
        },
        {
            name: "Oldham Metropolitan Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/oldham-metropolitan-borough-council.jpg",
        },
        {
            name: "Onedrive",
            image: "../../repos/kas-finance-v2/assets/logos/onedrive.png",
        },
        {
            name: "Orkney Islands Council",
            image: "../../repos/kas-finance-v2/assets/logos/orkney-islands-council.jpg",
        },
        {
            name: "Orkney Islands Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/orkney-islands-council-1.jpg",
        },
        {
            name: "Oxford City Council",
            image: "../../repos/kas-finance-v2/assets/logos/oxford-city-council.jpeg",
        },
        {
            name: "Oxford City Council",
            image: "../../repos/kas-finance-v2/assets/logos/oxford-city-council.png",
        },
        {
            name: "Oxford City Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/oxford-city-council-1.jpeg",
        },
        {
            name: "Pandora",
            image: "../../repos/kas-finance-v2/assets/logos/pandora.png",
        },
        {
            name: "Paramoun Plus",
            image: "../../repos/kas-finance-v2/assets/logos/paramoun-plus.png",
        },
        {
            name: "Paypal",
            image: "../../repos/kas-finance-v2/assets/logos/paypal.png",
        },
        {
            name: "Pcloud",
            image: "../../repos/kas-finance-v2/assets/logos/pcloud.jpeg",
        },
        {
            name: "Pembrokeshire Council",
            image: "../../repos/kas-finance-v2/assets/logos/pembrokeshire-council.jpg",
        },
        {
            name: "Pendle Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/pendle-borough-council.jpg",
        },
        {
            name: "Pendle Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/pendle-borough-council.jpeg",
        },
        {
            name: "Perkbox",
            image: "../../repos/kas-finance-v2/assets/logos/perkbox.png",
        },
        {
            name: "Perth And Kinross Council",
            image: "../../repos/kas-finance-v2/assets/logos/perth-and-kinross-council.jpeg",
        },
        {
            name: "Perth And Kinross Council",
            image: "../../repos/kas-finance-v2/assets/logos/perth-and-kinross-council.jpg",
        },
        {
            name: "Peterborough Council",
            image: "../../repos/kas-finance-v2/assets/logos/peterborough-council.png",
        },
        {
            name: "Pets At Home",
            image: "../../repos/kas-finance-v2/assets/logos/pets-at-home.png",
        },
        {
            name: "Pintrest",
            image: "../../repos/kas-finance-v2/assets/logos/pintrest.png",
        },
        {
            name: "Pizza Express",
            image: "../../repos/kas-finance-v2/assets/logos/pizza-express.png",
        },
        {
            name: "Playstation",
            image: "../../repos/kas-finance-v2/assets/logos/playstation.png",
        },
        {
            name: "Playstation Alt",
            image: "../../repos/kas-finance-v2/assets/logos/playstation-alt.png",
        },
        {
            name: "Plymouth City Council",
            image: "../../repos/kas-finance-v2/assets/logos/plymouth-city-council.png",
        },
        {
            name: "Plymouth City Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/plymouth-city-council-1.png",
        },
        {
            name: "Poole Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/poole-borough-council.jpeg",
        },
        {
            name: "Portsmouth City Council",
            image: "../../repos/kas-finance-v2/assets/logos/portsmouth-city-council.jpg",
        },
        {
            name: "Portsmouth City Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/portsmouth-city-council-1.jpg",
        },
        {
            name: "Post Office",
            image: "../../repos/kas-finance-v2/assets/logos/post-office.png",
        },
        {
            name: "Poundland",
            image: "../../repos/kas-finance-v2/assets/logos/poundland.jpeg",
        },
        {
            name: "Preston Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/preston-borough-council.png",
        },
        {
            name: "Preston Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/preston-borough-council.jpeg",
        },
        {
            name: "Primark",
            image: "../../repos/kas-finance-v2/assets/logos/primark.png",
        },
        {
            name: "Prime Video",
            image: "../../repos/kas-finance-v2/assets/logos/prime-video.png",
        },
        {
            name: "Proton",
            image: "../../repos/kas-finance-v2/assets/logos/proton.jpeg",
        },
        {
            name: "Purbeck District Council",
            image: "../../repos/kas-finance-v2/assets/logos/purbeck-district-council.jpeg",
        },
        {
            name: "Puregym",
            image: "../../repos/kas-finance-v2/assets/logos/puregym.png",
        },
        {
            name: "Qatar Airways",
            image: "../../repos/kas-finance-v2/assets/logos/qatar-airways.png",
        },
        {
            name: "Quiz",
            image: "../../repos/kas-finance-v2/assets/logos/quiz.png",
        },
        {
            name: "Rakuten",
            image: "../../repos/kas-finance-v2/assets/logos/rakuten.png",
        },
        {
            name: "Rbs",
            image: "../../repos/kas-finance-v2/assets/logos/rbs.jpg",
        },
        {
            name: "Rbs Bankline",
            image: "../../repos/kas-finance-v2/assets/logos/rbs-bankline.png",
        },
        {
            name: "Reading Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/reading-borough-council.jpg",
        },
        {
            name: "Reading Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/reading-borough-council.png",
        },
        {
            name: "Reddit",
            image: "../../repos/kas-finance-v2/assets/logos/reddit.jpeg",
        },
        {
            name: "Redditch Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/redditch-borough-council.jpg",
        },
        {
            name: "Reigate And Banstead Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/reigate-and-banstead-borough-council.jpg",
        },
        {
            name: "Renfrewshire Council",
            image: "../../repos/kas-finance-v2/assets/logos/renfrewshire-council.jpg",
        },
        {
            name: "Revolut",
            image: "../../repos/kas-finance-v2/assets/logos/revolut.png",
        },
        {
            name: "Rhondda Cynon Taff Council",
            image: "../../repos/kas-finance-v2/assets/logos/rhondda-cynon-taff-council.jpeg",
        },
        {
            name: "Ribble Valley Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/ribble-valley-borough-council.jpg",
        },
        {
            name: "Richmondshire District Council",
            image: "../../repos/kas-finance-v2/assets/logos/richmondshire-district-council.jpeg",
        },
        {
            name: "Ring",
            image: "../../repos/kas-finance-v2/assets/logos/ring.jpeg",
        },
        {
            name: "River Island",
            image: "../../repos/kas-finance-v2/assets/logos/river-island.png",
        },
        {
            name: "Rochdale Metropolitan Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/rochdale-metropolitan-borough-council.jpeg",
        },
        {
            name: "Rochdale Metropolitan Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/rochdale-metropolitan-borough-council.jpg",
        },
        {
            name: "Rochford District Council",
            image: "../../repos/kas-finance-v2/assets/logos/rochford-district-council.jpeg",
        },
        {
            name: "Rossendale Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/rossendale-borough-council.jpg",
        },
        {
            name: "Rossendale Borough Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/rossendale-borough-council-1.jpg",
        },
        {
            name: "Rother District Council",
            image: "../../repos/kas-finance-v2/assets/logos/rother-district-council.png",
        },
        {
            name: "Rother District Council",
            image: "../../repos/kas-finance-v2/assets/logos/rother-district-council.jpeg",
        },
        {
            name: "Rotherham Metropolitan Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/rotherham-metropolitan-borough-council.jpg",
        },
        {
            name: "Rotherham Metropolitan Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/rotherham-metropolitan-borough-council.png",
        },
        {
            name: "Royal Borough Of Greenwich",
            image: "../../repos/kas-finance-v2/assets/logos/royal-borough-of-greenwich.png",
        },
        {
            name: "Royal Borough Of Kensington And Chelsea",
            image: "../../repos/kas-finance-v2/assets/logos/royal-borough-of-kensington-and-chelsea.jpeg",
        },
        {
            name: "Royal Borough Of Kensington And Chelsea",
            image: "../../repos/kas-finance-v2/assets/logos/royal-borough-of-kensington-and-chelsea.png",
        },
        {
            name: "Royal Borough Of Kingston Upon Thames",
            image: "../../repos/kas-finance-v2/assets/logos/royal-borough-of-kingston-upon-thames.png",
        },
        {
            name: "Royal Borough Of Kingston Upon Thames",
            image: "../../repos/kas-finance-v2/assets/logos/royal-borough-of-kingston-upon-thames.jpg",
        },
        {
            name: "Royal Borough Of Windsor And Maidenhead",
            image: "../../repos/kas-finance-v2/assets/logos/royal-borough-of-windsor-and-maidenhead.jpeg",
        },
        {
            name: "Royal Borough Of Windsor And Maidenhead",
            image: "../../repos/kas-finance-v2/assets/logos/royal-borough-of-windsor-and-maidenhead.jpg",
        },
        {
            name: "Royal Borough Of Windsor And Maidenhead",
            image: "../../repos/kas-finance-v2/assets/logos/royal-borough-of-windsor-and-maidenhead.png",
        },
        {
            name: "Royal London",
            image: "../../repos/kas-finance-v2/assets/logos/royal-london.png",
        },
        {
            name: "Royal Mail",
            image: "../../repos/kas-finance-v2/assets/logos/royal-mail.png",
        },
        {
            name: "Rsa",
            image: "../../repos/kas-finance-v2/assets/logos/rsa.jpeg",
        },
        {
            name: "Rugby Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/rugby-borough-council.png",
        },
        {
            name: "Rugby Borough Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/rugby-borough-council-1.png",
        },
        {
            name: "Runnymede Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/runnymede-borough-council.png",
        },
        {
            name: "Runnymede Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/runnymede-borough-council.jpg",
        },
        {
            name: "Rushcliffe Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/rushcliffe-borough-council.png",
        },
        {
            name: "Rushmoor Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/rushmoor-borough-council.png",
        },
        {
            name: "Rushmoor Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/rushmoor-borough-council.jpeg",
        },
        {
            name: "Rushmoor Borough Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/rushmoor-borough-council-1.png",
        },
        {
            name: "Rutland County Council",
            image: "../../repos/kas-finance-v2/assets/logos/rutland-county-council.png",
        },
        {
            name: "Rutland County Council",
            image: "../../repos/kas-finance-v2/assets/logos/rutland-county-council.jpeg",
        },
        {
            name: "Rutland County Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/rutland-county-council-1.png",
        },
        {
            name: "Ryanair",
            image: "../../repos/kas-finance-v2/assets/logos/ryanair.jpeg",
        },
        {
            name: "Ryedale District Council",
            image: "../../repos/kas-finance-v2/assets/logos/ryedale-district-council.jpeg",
        },
        {
            name: "Ryedale District Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/ryedale-district-council-1.jpeg",
        },
        {
            name: "Ryman",
            image: "../../repos/kas-finance-v2/assets/logos/ryman.png",
        },
        {
            name: "Sage",
            image: "../../repos/kas-finance-v2/assets/logos/sage.png",
        },
        {
            name: "Sainsburys",
            image: "../../repos/kas-finance-v2/assets/logos/sainsburys.png",
        },
        {
            name: "Salford Metropolitan Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/salford-metropolitan-borough-council.png",
        },
        {
            name: "Salford Metropolitan Borough Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/salford-metropolitan-borough-council-1.png",
        },
        {
            name: "Sandwell Metropolitan Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/sandwell-metropolitan-borough-council.jpeg",
        },
        {
            name: "Sandwell Metropolitan Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/sandwell-metropolitan-borough-council.png",
        },
        {
            name: "Santander",
            image: "../../repos/kas-finance-v2/assets/logos/santander.jpg",
        },
        {
            name: "Savings",
            image: "../../repos/kas-finance-v2/assets/logos/savings.png",
        },
        {
            name: "Scarborough Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/scarborough-borough-council.jpeg",
        },
        {
            name: "Scarborough Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/scarborough-borough-council.png",
        },
        {
            name: "Schuh",
            image: "../../repos/kas-finance-v2/assets/logos/schuh.jpg",
        },
        {
            name: "Scotmid",
            image: "../../repos/kas-finance-v2/assets/logos/scotmid.png",
        },
        {
            name: "Scotrail",
            image: "../../repos/kas-finance-v2/assets/logos/scotrail.jpeg",
        },
        {
            name: "Scottish Borders Council",
            image: "../../repos/kas-finance-v2/assets/logos/scottish-borders-council.png",
        },
        {
            name: "Scottish Borders Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/scottish-borders-council-1.png",
        },
        {
            name: "Scottish Gas",
            image: "../../repos/kas-finance-v2/assets/logos/scottish-gas.png",
        },
        {
            name: "Sedgemoor District Council",
            image: "../../repos/kas-finance-v2/assets/logos/sedgemoor-district-council.png",
        },
        {
            name: "Sedgemoor District Council",
            image: "../../repos/kas-finance-v2/assets/logos/sedgemoor-district-council.jpg",
        },
        {
            name: "Seedrs",
            image: "../../repos/kas-finance-v2/assets/logos/seedrs.png",
        },
        {
            name: "Sefton Metropolitan Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/sefton-metropolitan-borough-council.png",
        },
        {
            name: "Sefton Metropolitan Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/sefton-metropolitan-borough-council.jpg",
        },
        {
            name: "Selby District Council",
            image: "../../repos/kas-finance-v2/assets/logos/selby-district-council.jpeg",
        },
        {
            name: "Selby District Council",
            image: "../../repos/kas-finance-v2/assets/logos/selby-district-council.jpg",
        },
        {
            name: "Sevenoaks District Council",
            image: "../../repos/kas-finance-v2/assets/logos/sevenoaks-district-council.jpg",
        },
        {
            name: "Sheffield City Council",
            image: "../../repos/kas-finance-v2/assets/logos/sheffield-city-council.png",
        },
        {
            name: "Shetland Islands Council",
            image: "../../repos/kas-finance-v2/assets/logos/shetland-islands-council.jpg",
        },
        {
            name: "Shetland Islands Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/shetland-islands-council-1.jpg",
        },
        {
            name: "Shien",
            image: "../../repos/kas-finance-v2/assets/logos/shien.jpeg",
        },
        {
            name: "Shropshire Council",
            image: "../../repos/kas-finance-v2/assets/logos/shropshire-council.jpeg",
        },
        {
            name: "Shropshire Council",
            image: "../../repos/kas-finance-v2/assets/logos/shropshire-council.jpg",
        },
        {
            name: "Sky",
            image: "../../repos/kas-finance-v2/assets/logos/sky.jpeg",
        },
        {
            name: "Slough Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/slough-borough-council.png",
        },
        {
            name: "Slough Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/slough-borough-council.jpg",
        },
        {
            name: "Snapchat",
            image: "../../repos/kas-finance-v2/assets/logos/snapchat.jpeg",
        },
        {
            name: "Snoop",
            image: "../../repos/kas-finance-v2/assets/logos/snoop.png",
        },
        {
            name: "Solihull Metropolitan Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/solihull-metropolitan-borough-council.jpeg",
        },
        {
            name: "Solihull Metropolitan Borough Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/solihull-metropolitan-borough-council-1.jpeg",
        },
        {
            name: "Somerset Council",
            image: "../../repos/kas-finance-v2/assets/logos/somerset-council.jpg",
        },
        {
            name: "Somerset Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/somerset-council-1.jpg",
        },
        {
            name: "Somerset West And Taunton Council",
            image: "../../repos/kas-finance-v2/assets/logos/somerset-west-and-taunton-council.jpeg",
        },
        {
            name: "Sony",
            image: "../../repos/kas-finance-v2/assets/logos/sony.png",
        },
        {
            name: "South Ayrshire Council",
            image: "../../repos/kas-finance-v2/assets/logos/south-ayrshire-council.jpeg",
        },
        {
            name: "South Bucks District Council",
            image: "../../repos/kas-finance-v2/assets/logos/south-bucks-district-council.jpeg",
        },
        {
            name: "South Bucks District Council",
            image: "../../repos/kas-finance-v2/assets/logos/south-bucks-district-council.png",
        },
        {
            name: "South Cambridgeshire District Council",
            image: "../../repos/kas-finance-v2/assets/logos/south-cambridgeshire-district-council.png",
        },
        {
            name: "South Cambridgeshire District Council",
            image: "../../repos/kas-finance-v2/assets/logos/south-cambridgeshire-district-council.jpg",
        },
        {
            name: "South Derbyshire District Council",
            image: "../../repos/kas-finance-v2/assets/logos/south-derbyshire-district-council.jpeg",
        },
        {
            name: "South Derbyshire District Council",
            image: "../../repos/kas-finance-v2/assets/logos/south-derbyshire-district-council.png",
        },
        {
            name: "South Gloucestershire District Council",
            image: "../../repos/kas-finance-v2/assets/logos/south-gloucestershire-district-council.jpg",
        },
        {
            name: "South Gloucestershire District Council",
            image: "../../repos/kas-finance-v2/assets/logos/south-gloucestershire-district-council.png",
        },
        {
            name: "South Hams District Council",
            image: "../../repos/kas-finance-v2/assets/logos/south-hams-district-council.jpg",
        },
        {
            name: "South Holland District Council",
            image: "../../repos/kas-finance-v2/assets/logos/south-holland-district-council.jpeg",
        },
        {
            name: "South Holland District Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/south-holland-district-council-1.jpeg",
        },
        {
            name: "South Kesteven District Council",
            image: "../../repos/kas-finance-v2/assets/logos/south-kesteven-district-council.jpg",
        },
        {
            name: "South Kesteven District Council",
            image: "../../repos/kas-finance-v2/assets/logos/south-kesteven-district-council.png",
        },
        {
            name: "South Lakeland District Council",
            image: "../../repos/kas-finance-v2/assets/logos/south-lakeland-district-council.jpeg",
        },
        {
            name: "South Lakeland District Council",
            image: "../../repos/kas-finance-v2/assets/logos/south-lakeland-district-council.png",
        },
        {
            name: "South Lanarkshire Council",
            image: "../../repos/kas-finance-v2/assets/logos/south-lanarkshire-council.jpeg",
        },
        {
            name: "South Lanarkshire Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/south-lanarkshire-council-1.jpeg",
        },
        {
            name: "South Norfolk District Council",
            image: "../../repos/kas-finance-v2/assets/logos/south-norfolk-district-council.png",
        },
        {
            name: "South Northamptonshire Council",
            image: "../../repos/kas-finance-v2/assets/logos/south-northamptonshire-council.jpeg",
        },
        {
            name: "South Northamptonshire Council",
            image: "../../repos/kas-finance-v2/assets/logos/south-northamptonshire-council.jpg",
        },
        {
            name: "South Oxfordshire District Council",
            image: "../../repos/kas-finance-v2/assets/logos/south-oxfordshire-district-council.png",
        },
        {
            name: "South Oxfordshire District Council",
            image: "../../repos/kas-finance-v2/assets/logos/south-oxfordshire-district-council.jpg",
        },
        {
            name: "South Ribble Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/south-ribble-borough-council.png",
        },
        {
            name: "South Ribble Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/south-ribble-borough-council.jpg",
        },
        {
            name: "South Somerset District Council",
            image: "../../repos/kas-finance-v2/assets/logos/south-somerset-district-council.png",
        },
        {
            name: "South Somerset District Council",
            image: "../../repos/kas-finance-v2/assets/logos/south-somerset-district-council.jpg",
        },
        {
            name: "South Staffordshire District Council",
            image: "../../repos/kas-finance-v2/assets/logos/south-staffordshire-district-council.jpeg",
        },
        {
            name: "South Staffordshire District Council",
            image: "../../repos/kas-finance-v2/assets/logos/south-staffordshire-district-council.jpg",
        },
        {
            name: "South Tyneside Metropolitan Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/south-tyneside-metropolitan-borough-council.png",
        },
        {
            name: "South Tyneside Metropolitan Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/south-tyneside-metropolitan-borough-council.jpeg",
        },
        {
            name: "Southampton Council",
            image: "../../repos/kas-finance-v2/assets/logos/southampton-council.jpeg",
        },
        {
            name: "Southend Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/southend-borough-council.jpg",
        },
        {
            name: "Southend Borough Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/southend-borough-council-1.jpg",
        },
        {
            name: "Spar",
            image: "../../repos/kas-finance-v2/assets/logos/spar.jpeg",
        },
        {
            name: "Specsavers",
            image: "../../repos/kas-finance-v2/assets/logos/specsavers.png",
        },
        {
            name: "Spelthorne Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/spelthorne-borough-council.png",
        },
        {
            name: "Spotify",
            image: "../../repos/kas-finance-v2/assets/logos/spotify.jpeg",
        },
        {
            name: "St Albans City And District Council",
            image: "../../repos/kas-finance-v2/assets/logos/st-albans-city-and-district-council.jpeg",
        },
        {
            name: "St Helens Metropolitan Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/st-helens-metropolitan-borough-council.jpeg",
        },
        {
            name: "Stafford Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/stafford-borough-council.jpg",
        },
        {
            name: "Stafford Borough Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/stafford-borough-council-1.jpg",
        },
        {
            name: "Staffordshire Moorlands District Council",
            image: "../../repos/kas-finance-v2/assets/logos/staffordshire-moorlands-district-council.png",
        },
        {
            name: "Staffordshire Moorlands District Council",
            image: "../../repos/kas-finance-v2/assets/logos/staffordshire-moorlands-district-council.jpg",
        },
        {
            name: "Starbucks",
            image: "../../repos/kas-finance-v2/assets/logos/starbucks.png",
        },
        {
            name: "Starbucks",
            image: "../../repos/kas-finance-v2/assets/logos/starbucks.jpg",
        },
        {
            name: "Starling",
            image: "../../repos/kas-finance-v2/assets/logos/starling.jpg",
        },
        {
            name: "Stirling Council",
            image: "../../repos/kas-finance-v2/assets/logos/stirling-council.png",
        },
        {
            name: "Stockport Metropolitan Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/stockport-metropolitan-borough-council.jpg",
        },
        {
            name: "Stockton On Tees Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/stockton-on-tees-borough-council.png",
        },
        {
            name: "Stoke On Trent City Council",
            image: "../../repos/kas-finance-v2/assets/logos/stoke-on-trent-city-council.jpg",
        },
        {
            name: "Stoke On Trent City Council",
            image: "../../repos/kas-finance-v2/assets/logos/stoke-on-trent-city-council.jpeg",
        },
        {
            name: "Stratford On Avon District Council",
            image: "../../repos/kas-finance-v2/assets/logos/stratford-on-avon-district-council.png",
        },
        {
            name: "Stratford On Avon District Council",
            image: "../../repos/kas-finance-v2/assets/logos/stratford-on-avon-district-council.jpg",
        },
        {
            name: "Stroud District Council",
            image: "../../repos/kas-finance-v2/assets/logos/stroud-district-council.jpeg",
        },
        {
            name: "Stroud District Council",
            image: "../../repos/kas-finance-v2/assets/logos/stroud-district-council.png",
        },
        {
            name: "Subway",
            image: "../../repos/kas-finance-v2/assets/logos/subway.png",
        },
        {
            name: "Sunderland City Council",
            image: "../../repos/kas-finance-v2/assets/logos/sunderland-city-council.png",
        },
        {
            name: "Sunderland City Council",
            image: "../../repos/kas-finance-v2/assets/logos/sunderland-city-council.jpeg",
        },
        {
            name: "Superdrug",
            image: "../../repos/kas-finance-v2/assets/logos/superdrug.png",
        },
        {
            name: "Superdry",
            image: "../../repos/kas-finance-v2/assets/logos/superdry.jpeg",
        },
        {
            name: "Surrey Heath Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/surrey-heath-borough-council.jpeg",
        },
        {
            name: "Surrey Heath Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/surrey-heath-borough-council.png",
        },
        {
            name: "Swale Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/swale-borough-council.jpg",
        },
        {
            name: "Swarovski",
            image: "../../repos/kas-finance-v2/assets/logos/swarovski.png",
        },
        {
            name: "Swindon Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/swindon-borough-council.jpg",
        },
        {
            name: "Swindon Borough Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/swindon-borough-council-1.jpg",
        },
        {
            name: "Tameside Metropolitan Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/tameside-metropolitan-borough-council.jpg",
        },
        {
            name: "Tameside Metropolitan Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/tameside-metropolitan-borough-council.png",
        },
        {
            name: "Tamworth Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/tamworth-borough-council.png",
        },
        {
            name: "Tandridge District Council",
            image: "../../repos/kas-finance-v2/assets/logos/tandridge-district-council.jpg",
        },
        {
            name: "Tandridge District Council",
            image: "../../repos/kas-finance-v2/assets/logos/tandridge-district-council.png",
        },
        {
            name: "Teignbridge District Council",
            image: "../../repos/kas-finance-v2/assets/logos/teignbridge-district-council.png",
        },
        {
            name: "Telford And Wrekin Council",
            image: "../../repos/kas-finance-v2/assets/logos/telford-and-wrekin-council.jpg",
        },
        {
            name: "Telford And Wrekin Council",
            image: "../../repos/kas-finance-v2/assets/logos/telford-and-wrekin-council.png",
        },
        {
            name: "Temu",
            image: "../../repos/kas-finance-v2/assets/logos/temu.png",
        },
        {
            name: "Tendring District Council",
            image: "../../repos/kas-finance-v2/assets/logos/tendring-district-council.png",
        },
        {
            name: "Tesco",
            image: "../../repos/kas-finance-v2/assets/logos/tesco.png",
        },
        {
            name: "Test Valley Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/test-valley-borough-council.jpeg",
        },
        {
            name: "Test Valley Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/test-valley-borough-council.png",
        },
        {
            name: "Tewkesbury Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/tewkesbury-borough-council.jpeg",
        },
        {
            name: "Tfl",
            image: "../../repos/kas-finance-v2/assets/logos/tfl.png",
        },
        {
            name: "Thanet District Council",
            image: "../../repos/kas-finance-v2/assets/logos/thanet-district-council.png",
        },
        {
            name: "Thomas Cook",
            image: "../../repos/kas-finance-v2/assets/logos/thomas-cook.jpeg",
        },
        {
            name: "Threads",
            image: "../../repos/kas-finance-v2/assets/logos/threads.png",
        },
        {
            name: "Three",
            image: "../../repos/kas-finance-v2/assets/logos/three.png",
        },
        {
            name: "Three Rivers District Council",
            image: "../../repos/kas-finance-v2/assets/logos/three-rivers-district-council.jpeg",
        },
        {
            name: "Three Rivers District Council",
            image: "../../repos/kas-finance-v2/assets/logos/three-rivers-district-council.jpg",
        },
        {
            name: "Thurrock Council",
            image: "../../repos/kas-finance-v2/assets/logos/thurrock-council.jpeg",
        },
        {
            name: "Ticketmaster",
            image: "../../repos/kas-finance-v2/assets/logos/ticketmaster.png",
        },
        {
            name: "Tiktok",
            image: "../../repos/kas-finance-v2/assets/logos/tiktok.jpeg",
        },
        {
            name: "Timpsons",
            image: "../../repos/kas-finance-v2/assets/logos/timpsons.jpeg",
        },
        {
            name: "Tonbridge And Malling Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/tonbridge-and-malling-borough-council.jpg",
        },
        {
            name: "Tonbridge And Malling Borough Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/tonbridge-and-malling-borough-council-1.jpg",
        },
        {
            name: "Torbay Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/torbay-borough-council.jpeg",
        },
        {
            name: "Torfaen County Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/torfaen-county-borough-council.png",
        },
        {
            name: "Torridge District Council",
            image: "../../repos/kas-finance-v2/assets/logos/torridge-district-council.jpeg",
        },
        {
            name: "Torridge District Council",
            image: "../../repos/kas-finance-v2/assets/logos/torridge-district-council.png",
        },
        {
            name: "Trading212",
            image: "../../repos/kas-finance-v2/assets/logos/trading212.jpeg",
        },
        {
            name: "Trafford Metropolitan Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/trafford-metropolitan-borough-council.jpg",
        },
        {
            name: "Trainline",
            image: "../../repos/kas-finance-v2/assets/logos/trainline.png",
        },
        {
            name: "Tsb",
            image: "../../repos/kas-finance-v2/assets/logos/tsb.png",
        },
        {
            name: "Tui",
            image: "../../repos/kas-finance-v2/assets/logos/tui.jpeg",
        },
        {
            name: "Tunbridge Wells Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/tunbridge-wells-borough-council.png",
        },
        {
            name: "Twitch",
            image: "../../repos/kas-finance-v2/assets/logos/twitch.png",
        },
        {
            name: "Uber",
            image: "../../repos/kas-finance-v2/assets/logos/uber.png",
        },
        {
            name: "Uber Eats",
            image: "../../repos/kas-finance-v2/assets/logos/uber-eats.png",
        },
        {
            name: "Uk Gov",
            image: "../../repos/kas-finance-v2/assets/logos/uk-gov.png",
        },
        {
            name: "Uttlesford District Council",
            image: "../../repos/kas-finance-v2/assets/logos/uttlesford-district-council.jpg",
        },
        {
            name: "Vale Of Glamorgan Council",
            image: "../../repos/kas-finance-v2/assets/logos/vale-of-glamorgan-council.jpg",
        },
        {
            name: "Vale Of Glamorgan Council",
            image: "../../repos/kas-finance-v2/assets/logos/vale-of-glamorgan-council.jpeg",
        },
        {
            name: "Vale Of Glamorgan Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/vale-of-glamorgan-council-1.jpg",
        },
        {
            name: "Vale Of White Horse District Council",
            image: "../../repos/kas-finance-v2/assets/logos/vale-of-white-horse-district-council.png",
        },
        {
            name: "Vinted",
            image: "../../repos/kas-finance-v2/assets/logos/vinted.png",
        },
        {
            name: "Virgin",
            image: "../../repos/kas-finance-v2/assets/logos/virgin.png",
        },
        {
            name: "Virgin Atlantic",
            image: "../../repos/kas-finance-v2/assets/logos/virgin-atlantic.png",
        },
        {
            name: "Virgin Media",
            image: "../../repos/kas-finance-v2/assets/logos/virgin-media.png",
        },
        {
            name: "Virgin Money",
            image: "../../repos/kas-finance-v2/assets/logos/virgin-money.jpeg",
        },
        {
            name: "Virgin Money",
            image: "../../repos/kas-finance-v2/assets/logos/virgin-money.jpg",
        },
        {
            name: "Virgin Trains",
            image: "../../repos/kas-finance-v2/assets/logos/virgin-trains.png",
        },
        {
            name: "Vision Express",
            image: "../../repos/kas-finance-v2/assets/logos/vision-express.png",
        },
        {
            name: "Vodafone",
            image: "../../repos/kas-finance-v2/assets/logos/vodafone.jpeg",
        },
        {
            name: "Waitrose",
            image: "../../repos/kas-finance-v2/assets/logos/waitrose.png",
        },
        {
            name: "Wakefield Metropolitan District Council",
            image: "../../repos/kas-finance-v2/assets/logos/wakefield-metropolitan-district-council.jpeg",
        },
        {
            name: "Walsall Metropolitan Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/walsall-metropolitan-borough-council.jpeg",
        },
        {
            name: "Walsall Metropolitan Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/walsall-metropolitan-borough-council.png",
        },
        {
            name: "Warren James",
            image: "../../repos/kas-finance-v2/assets/logos/warren-james.png",
        },
        {
            name: "Warrington Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/warrington-borough-council.jpg",
        },
        {
            name: "Warrington Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/warrington-borough-council.png",
        },
        {
            name: "Warrington Borough Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/warrington-borough-council-1.jpg",
        },
        {
            name: "Warwick District Council",
            image: "../../repos/kas-finance-v2/assets/logos/warwick-district-council.jpg",
        },
        {
            name: "Warwick District Council",
            image: "../../repos/kas-finance-v2/assets/logos/warwick-district-council.jpeg",
        },
        {
            name: "Waterstones",
            image: "../../repos/kas-finance-v2/assets/logos/waterstones.png",
        },
        {
            name: "Watford Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/watford-borough-council.jpg",
        },
        {
            name: "Watford Borough Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/watford-borough-council-1.jpg",
        },
        {
            name: "Waverley Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/waverley-borough-council.jpg",
        },
        {
            name: "Waverley Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/waverley-borough-council.png",
        },
        {
            name: "Wealden District Council",
            image: "../../repos/kas-finance-v2/assets/logos/wealden-district-council.jpeg",
        },
        {
            name: "Wealden District Council",
            image: "../../repos/kas-finance-v2/assets/logos/wealden-district-council.png",
        },
        {
            name: "Weatherspoons",
            image: "../../repos/kas-finance-v2/assets/logos/weatherspoons.png",
        },
        {
            name: "Wellingborough Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/wellingborough-borough-council.png",
        },
        {
            name: "Wellingborough Borough Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/wellingborough-borough-council-1.png",
        },
        {
            name: "Welwyn Hatfield District Council",
            image: "../../repos/kas-finance-v2/assets/logos/welwyn-hatfield-district-council.png",
        },
        {
            name: "Welwyn Hatfield District Council",
            image: "../../repos/kas-finance-v2/assets/logos/welwyn-hatfield-district-council.jpeg",
        },
        {
            name: "West Berkshire Council",
            image: "../../repos/kas-finance-v2/assets/logos/west-berkshire-council.jpg",
        },
        {
            name: "West Berkshire Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/west-berkshire-council-1.jpg",
        },
        {
            name: "West Devon Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/west-devon-borough-council.jpg",
        },
        {
            name: "West Dorset District Council",
            image: "../../repos/kas-finance-v2/assets/logos/west-dorset-district-council.jpeg",
        },
        {
            name: "West Dunbartonshire Council",
            image: "../../repos/kas-finance-v2/assets/logos/west-dunbartonshire-council.png",
        },
        {
            name: "West Dunbartonshire Council",
            image: "../../repos/kas-finance-v2/assets/logos/west-dunbartonshire-council.jpeg",
        },
        {
            name: "West Lancashire Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/west-lancashire-borough-council.jpg",
        },
        {
            name: "West Lindsey District Council",
            image: "../../repos/kas-finance-v2/assets/logos/west-lindsey-district-council.jpeg",
        },
        {
            name: "West Lindsey District Council",
            image: "../../repos/kas-finance-v2/assets/logos/west-lindsey-district-council.png",
        },
        {
            name: "West Lindsey District Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/west-lindsey-district-council-1.jpeg",
        },
        {
            name: "West Lothian Council",
            image: "../../repos/kas-finance-v2/assets/logos/west-lothian-council.jpg",
        },
        {
            name: "West Lothian Council",
            image: "../../repos/kas-finance-v2/assets/logos/west-lothian-council.jpeg",
        },
        {
            name: "West Northamptonshire",
            image: "../../repos/kas-finance-v2/assets/logos/west-northamptonshire.png",
        },
        {
            name: "West Northamptonshire 1",
            image: "../../repos/kas-finance-v2/assets/logos/west-northamptonshire-1.png",
        },
        {
            name: "West Oxfordshire District Council",
            image: "../../repos/kas-finance-v2/assets/logos/west-oxfordshire-district-council.jpeg",
        },
        {
            name: "West Oxfordshire District Council",
            image: "../../repos/kas-finance-v2/assets/logos/west-oxfordshire-district-council.png",
        },
        {
            name: "West Suffolk Council",
            image: "../../repos/kas-finance-v2/assets/logos/west-suffolk-council.jpeg",
        },
        {
            name: "West Suffolk Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/west-suffolk-council-1.jpeg",
        },
        {
            name: "Westmorland And Furness Council",
            image: "../../repos/kas-finance-v2/assets/logos/westmorland-and-furness-council.png",
        },
        {
            name: "Westmorland And Furness Council",
            image: "../../repos/kas-finance-v2/assets/logos/westmorland-and-furness-council.jpg",
        },
        {
            name: "Weymouth And Portland Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/weymouth-and-portland-borough-council.jpg",
        },
        {
            name: "Whatsapp",
            image: "../../repos/kas-finance-v2/assets/logos/whatsapp.png",
        },
        {
            name: "Whsmith",
            image: "../../repos/kas-finance-v2/assets/logos/whsmith.png",
        },
        {
            name: "Wigan Metropolitan Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/wigan-metropolitan-borough-council.png",
        },
        {
            name: "Wigan Metropolitan Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/wigan-metropolitan-borough-council.jpg",
        },
        {
            name: "William Hill",
            image: "../../repos/kas-finance-v2/assets/logos/william-hill.png",
        },
        {
            name: "Wiltshire Council",
            image: "../../repos/kas-finance-v2/assets/logos/wiltshire-council.jpg",
        },
        {
            name: "Wiltshire Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/wiltshire-council-1.jpg",
        },
        {
            name: "Winchester City Council",
            image: "../../repos/kas-finance-v2/assets/logos/winchester-city-council.png",
        },
        {
            name: "Winchester City Council",
            image: "../../repos/kas-finance-v2/assets/logos/winchester-city-council.jpg",
        },
        {
            name: "Wirral Metropolitan Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/wirral-metropolitan-borough-council.jpg",
        },
        {
            name: "Wirral Metropolitan Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/wirral-metropolitan-borough-council.svg",
        },
        {
            name: "Wish",
            image: "../../repos/kas-finance-v2/assets/logos/wish.png",
        },
        {
            name: "Woking Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/woking-borough-council.png",
        },
        {
            name: "Woking Borough Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/woking-borough-council-1.png",
        },
        {
            name: "Wokingham Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/wokingham-borough-council.jpeg",
        },
        {
            name: "Wolverhampton City Council",
            image: "../../repos/kas-finance-v2/assets/logos/wolverhampton-city-council.jpg",
        },
        {
            name: "Wolverhampton City Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/wolverhampton-city-council-1.jpg",
        },
        {
            name: "Worcester City Council",
            image: "../../repos/kas-finance-v2/assets/logos/worcester-city-council.png",
        },
        {
            name: "Worcester City Council",
            image: "../../repos/kas-finance-v2/assets/logos/worcester-city-council.jpg",
        },
        {
            name: "Worcester City Council 1",
            image: "../../repos/kas-finance-v2/assets/logos/worcester-city-council-1.jpg",
        },
        {
            name: "Worthing Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/worthing-borough-council.jpeg",
        },
        {
            name: "Wrexham County Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/wrexham-county-borough-council.jpg",
        },
        {
            name: "Wrexham County Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/wrexham-county-borough-council.jpeg",
        },
        {
            name: "Wychavon District Council",
            image: "../../repos/kas-finance-v2/assets/logos/wychavon-district-council.png",
        },
        {
            name: "Wychavon District Council",
            image: "../../repos/kas-finance-v2/assets/logos/wychavon-district-council.jpg",
        },
        {
            name: "Wychavon District Council",
            image: "../../repos/kas-finance-v2/assets/logos/wychavon-district-council.jpeg",
        },
        {
            name: "Wycombe District Council",
            image: "../../repos/kas-finance-v2/assets/logos/wycombe-district-council.jpeg",
        },
        {
            name: "Wyre Borough Council",
            image: "../../repos/kas-finance-v2/assets/logos/wyre-borough-council.png",
        },
        {
            name: "Wyre Forest District Council",
            image: "../../repos/kas-finance-v2/assets/logos/wyre-forest-district-council.jpg",
        },
        {
            name: "Wyre Forest District Council",
            image: "../../repos/kas-finance-v2/assets/logos/wyre-forest-district-council.png",
        },
        {
            name: "X",
            image: "../../repos/kas-finance-v2/assets/logos/x.jpeg",
        },
        {
            name: "Xbox",
            image: "../../repos/kas-finance-v2/assets/logos/xbox.png",
        },
        {
            name: "Yankee Candle",
            image: "../../repos/kas-finance-v2/assets/logos/yankee-candle.png",
        },
        {
            name: "Ybs",
            image: "../../repos/kas-finance-v2/assets/logos/ybs.jpeg",
        },
        {
            name: "Yodel",
            image: "../../repos/kas-finance-v2/assets/logos/yodel.png",
        },
        {
            name: "Yougov",
            image: "../../repos/kas-finance-v2/assets/logos/yougov.jpeg",
        },
        {
            name: "Youtube",
            image: "../../repos/kas-finance-v2/assets/logos/youtube.jpeg",
        },
        {
            name: "Youtube",
            image: "../../repos/kas-finance-v2/assets/logos/youtube.png",
        },
        {
            name: "Youtube Music",
            image: "../../repos/kas-finance-v2/assets/logos/youtube-music.png",
        },
        {
            name: "Zurich",
            image: "../../repos/kas-finance-v2/assets/logos/zurich.jpeg",
        },
    ];

    logos
        .filter((logo) => logo.name.toLowerCase().includes(query))
        .forEach((logo) => {
            const img = document.createElement("img");
            img.src = logo.image;
            img.alt = logo.name;
            img.title = logo.name;
            img.onclick = () => {
                document.querySelectorAll("#logo-grid img").forEach((i) => i.classList.remove("selected"));
                img.classList.add("selected");
                document.getElementById("edit-icon").value = logo.image;
            };
            grid.appendChild(img);
        });
}

// PWA support
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("service-worker.js")
            .then((reg) => console.log("Service Worker registered", reg))
            .catch((err) => console.error("Service Worker registration failed", err));
    });
}
