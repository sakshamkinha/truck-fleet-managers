const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const number = new Intl.NumberFormat("en-IN");
const today = new Date("2026-06-15T09:00:00");
const storageKey = "haulops-fleet-v1";

const seed = {
  trucks: [
    ["TRK-001","MH12 AB 4101","Tata Prima 5530.S",2021,"Rajesh Kumar",184220,"Active",325000,890000],
    ["TRK-002","MH12 AB 4102","Ashok Leyland 4825",2020,"Imran Shaikh",211880,"Active",298000,810000],
    ["TRK-003","MH12 AB 4103","BharatBenz 5528T",2022,"Suresh Patil",132420,"Maintenance",188000,620000],
    ["TRK-004","MH12 AB 4104","Eicher Pro 6048",2019,"Mahesh Yadav",246310,"Active",342000,930000],
    ["TRK-005","MH12 AB 4105","Tata Signa 4825.TK",2021,"Anil Pawar",176900,"Idle",224000,540000],
    ["TRK-006","MH12 AB 4106","Volvo FM 420",2023,"Girish Nair",88110,"Active",276000,1020000],
    ["TRK-007","MH12 AB 4107","Tata Prima 5530.S",2020,"Karan Singh",228760,"Active",315000,870000],
    ["TRK-008","MH12 AB 4108","Ashok Leyland 4825",2018,"Prakash More",283540,"Maintenance",366000,710000],
    ["TRK-009","MH12 AB 4109","BharatBenz 5528T",2022,"Nitin Desai",121870,"Active",207000,760000],
    ["TRK-010","MH12 AB 4110","Eicher Pro 6048",2021,"Amit Jadhav",169440,"Active",253000,800000],
    ["TRK-011","MH12 AB 4111","Tata Signa 4825.TK",2020,"Shankar Rao",238910,"Active",301000,790000],
    ["TRK-012","MH12 AB 4112","Volvo FM 420",2023,"Deepak Verma",75420,"Active",248000,1120000],
    ["TRK-013","MH12 AB 4113","Tata Prima 5530.S",2019,"Faizan Khan",264150,"Idle",289000,610000],
    ["TRK-014","MH12 AB 4114","Ashok Leyland 4825",2021,"Vijay Kale",155360,"Active",233000,740000],
    ["TRK-015","MH12 AB 4115","BharatBenz 5528T",2022,"Ramesh Gaikwad",118020,"Active",196000,720000],
    ["TRK-016","MH12 AB 4116","Eicher Pro 6048",2018,"Sameer Ansari",297880,"Maintenance",405000,590000],
    ["TRK-017","MH12 AB 4117","Tata Signa 4825.TK",2020,"Harish Chavan",226700,"Active",286000,780000],
    ["TRK-018","MH12 AB 4118","Volvo FM 420",2023,"Manoj Pillai",68240,"Active",219000,1080000],
    ["TRK-019","MH12 AB 4119","Tata Prima 5530.S",2021,"Akash Bhosale",147770,"Active",221000,760000],
    ["TRK-020","MH12 AB 4120","Ashok Leyland 4825",2019,"Santosh Shinde",268900,"Idle",332000,630000]
  ].map(([truckNo, registration, model, year, driver, odometer, status, monthlyCost, monthlyRevenue], index) => ({
    id: crypto.randomUUID(), truckNo, registration, model, year, driver, odometer, status,
    monthlyCost, monthlyRevenue, insuranceExpiry: addDays(38 + index * 7), pollutionExpiry: addDays(24 + index * 5)
  })),
  fuel: [],
  maintenance: [],
  tires: [],
  drivers: [],
  expenses: []
};

function addDays(days) {
  const next = new Date(today);
  next.setDate(next.getDate() + days);
  return next.toISOString().slice(0, 10);
}

function makeInitialData() {
  const data = structuredClone(seed);
  data.trucks.forEach((truck, index) => {
    const liters = 850 + (index % 7) * 95;
    const efficiency = +(3.2 + (index % 6) * .25).toFixed(1);
    data.fuel.push({
      id: crypto.randomUUID(), date: `2026-06-${String(1 + (index % 14)).padStart(2, "0")}`,
      truckNo: truck.truckNo, liters, costPerLiter: 92 + (index % 4), total: liters * (92 + (index % 4)), efficiency
    });
    data.maintenance.push({
      id: crypto.randomUUID(), truckNo: truck.truckNo,
      service: ["Oil change", "Engine inspection", "Brake inspection", "Battery replacement"][index % 4],
      lastDone: `2026-05-${String(3 + (index % 20)).padStart(2, "0")}`,
      nextDue: addDays(index % 5 === 0 ? 6 : 18 + index * 3),
      cost: 8500 + (index % 8) * 4200, vendor: ["Metro Diesel Care", "Highway Motors", "Prime Truck Works"][index % 3]
    });
    data.tires.push({
      id: crypto.randomUUID(), truckNo: truck.truckNo,
      position: ["Front Left", "Front Right", "Rear Axle 1", "Rear Axle 2"][index % 4],
      brand: ["MRF", "Apollo", "JK Tyre", "Bridgestone"][index % 4],
      installed: `2025-${String(7 + (index % 6)).padStart(2, "0")}-${String(5 + (index % 18)).padStart(2, "0")}`,
      condition: ["Good", "Good", "Rotate Soon", "Replace Soon"][index % 4],
      rotationDue: addDays(index % 4 === 3 ? 4 : 22 + index * 2),
      cost: 24500 + (index % 5) * 2800,
      lifespanKm: 62000 - (index % 8) * 4200
    });
    data.drivers.push({
      id: crypto.randomUUID(), name: truck.driver, phone: `+91 98${String(43000000 + index * 7319).slice(0, 8)}`,
      license: `MH-${String(1200000 + index * 9341)}`, licenseExpiry: addDays(index % 6 === 0 ? 14 : 90 + index * 9),
      assignedTruck: truck.truckNo, score: 78 + (index % 8) * 3, onTime: 82 + (index % 7) * 2
    });
    data.expenses.push(
      { id: crypto.randomUUID(), date: "2026-06-05", category: "Diesel", truckNo: truck.truckNo, description: "Highway fuel fill", amount: data.fuel[index].total },
      { id: crypto.randomUUID(), date: "2026-06-10", category: index % 3 === 0 ? "Tire" : "Maintenance", truckNo: truck.truckNo, description: index % 3 === 0 ? "Tire rotation and balancing" : "Scheduled service", amount: index % 3 === 0 ? 6500 : data.maintenance[index].cost },
      { id: crypto.randomUUID(), date: "2026-06-01", category: "Driver Salary", truckNo: truck.truckNo, description: "Monthly driver salary accrual", amount: 38000 + (index % 5) * 1500 }
    );
  });
  return data;
}

let state = loadState();
let currentView = "dashboard";
let editId = null;
let formType = "truck";

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || makeInitialData();
  } catch {
    return makeInitialData();
  }
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

const views = {
  dashboard: ["Dashboard", "Twenty-truck operating snapshot for June 2026"],
  trucks: ["Truck Management", "Add, edit, delete, search, and filter fleet assets"],
  diesel: ["Diesel Management", "Fuel fills, cost tracking, and efficiency analytics"],
  maintenance: ["Maintenance Management", "Service schedules, history, reminders, and cost reports"],
  tires: ["Tire Management", "Rotation schedule, condition tracking, alerts, and tire lifespan"],
  drivers: ["Driver Management", "Assignments, license expiry, and performance tracking"],
  expenses: ["Expense Management", "Diesel, tire, maintenance, salary, and operating expenses"],
  reports: ["Reports", "Daily, weekly, monthly, annual exports for operations review"],
  alerts: ["Alerts & Notifications", "Service, tire, insurance, pollution, and license expiry"],
  analytics: ["Fleet Analytics", "Cost per truck, revenue per truck, trends, and utilization"]
};

document.querySelectorAll(".nav-item, [data-view-link]").forEach(btn => {
  btn.addEventListener("click", () => showView(btn.dataset.view || btn.dataset.viewLink));
});
document.getElementById("menuToggle").addEventListener("click", () => document.getElementById("sidebar").classList.toggle("open"));
document.getElementById("themeToggle").addEventListener("click", toggleTheme);
document.getElementById("globalSearch").addEventListener("input", render);
document.getElementById("statusFilter").addEventListener("change", renderTrucks);
document.getElementById("modelFilter").addEventListener("change", renderTrucks);
document.getElementById("chartMode").addEventListener("change", renderDashboard);
document.getElementById("reportPeriod").addEventListener("change", renderReport);
document.getElementById("reportType").addEventListener("change", renderReport);
document.getElementById("exportCsv").addEventListener("click", exportCsv);
document.getElementById("exportJson").addEventListener("click", exportJson);
document.getElementById("printReport").addEventListener("click", () => window.print());
document.getElementById("acknowledgeAlerts").addEventListener("click", () => toast("Alerts marked as reviewed"));
document.getElementById("addPrimary").addEventListener("click", () => openForm("truck"));
document.querySelectorAll("[data-open-form]").forEach(btn => btn.addEventListener("click", () => openForm(btn.dataset.openForm)));
document.getElementById("saveRecord").addEventListener("click", saveRecord);

function showView(view) {
  currentView = view;
  document.querySelectorAll(".view").forEach(el => el.classList.remove("active"));
  document.getElementById(`${view}View`).classList.add("active");
  document.querySelectorAll(".nav-item").forEach(btn => btn.classList.toggle("active", btn.dataset.view === view));
  document.getElementById("pageTitle").textContent = views[view][0];
  document.getElementById("pageSubtitle").textContent = views[view][1];
  document.getElementById("sidebar").classList.remove("open");
  render();
}

function toggleTheme() {
  const dark = document.documentElement.dataset.theme !== "dark";
  document.documentElement.dataset.theme = dark ? "dark" : "";
  document.getElementById("themeToggle").textContent = dark ? "Light mode" : "Dark mode";
  render();
}

function kpis() {
  const active = state.trucks.filter(t => t.status === "Active").length;
  const maintenance = state.trucks.filter(t => t.status === "Maintenance").length;
  const diesel = sum(state.fuel, "liters");
  const maintenanceCost = sum(state.expenses.filter(e => e.category === "Maintenance"), "amount");
  const tireAlerts = state.tires.filter(t => t.condition === "Replace Soon" || daysUntil(t.rotationDue) < 10).length;
  const serviceAlerts = state.maintenance.filter(m => daysUntil(m.nextDue) < 15).length;
  const revenue = sum(state.trucks, "monthlyRevenue");
  const expenses = sum(state.expenses, "amount");
  return { active, maintenance, diesel, maintenanceCost, tireAlerts, serviceAlerts, revenue, expenses };
}

function render() {
  populateModelFilter();
  renderDashboard();
  renderTrucks();
  renderFuel();
  renderMaintenance();
  renderTires();
  renderDrivers();
  renderExpenses();
  renderReport();
  renderAlerts();
  renderAnalytics();
}

function renderDashboard() {
  const data = kpis();
  const metrics = [
    ["Total Trucks", state.trucks.length, "Fleet capacity"],
    ["Active Trucks", data.active, `${Math.round(data.active / state.trucks.length * 100)}% utilization base`],
    ["Under Maintenance", data.maintenance, "Currently in workshop"],
    ["Diesel Consumption", `${number.format(data.diesel)} L`, "Current month"],
    ["Maintenance Cost", currency.format(data.maintenanceCost), "Monthly service spend"],
    ["Tire Alerts", data.tireAlerts, "Rotation or replacement"],
    ["Upcoming Service", data.serviceAlerts, "Due in 15 days"],
    ["Net Summary", currency.format(data.revenue - data.expenses), "Revenue minus expenses"]
  ];
  document.getElementById("metricGrid").innerHTML = metrics.map(([label, value, hint]) => `
    <article class="metric"><small>${label}</small><strong>${value}</strong><span>${hint}</span></article>
  `).join("");
  const financeMode = document.getElementById("chartMode").value;
  if (financeMode === "category") {
    const cats = groupSum(state.expenses, "category", "amount");
    drawBarChart("financeChart", Object.keys(cats), Object.values(cats), "Expense categories", ["#176b87", "#1f8a70", "#d97706", "#c24132", "#7c3aed"]);
  } else {
    drawBarChart("financeChart", ["Revenue", "Expenses", "Net"], [data.revenue, data.expenses, data.revenue - data.expenses], "Monthly finance", ["#1f8a70", "#c24132", "#176b87"]);
  }
  drawDonutChart("statusChart", groupCount(state.trucks, "status"), ["#16815a", "#b7791f", "#c24132"]);
  document.getElementById("priorityAlerts").innerHTML = buildAlerts().slice(0, 5).map(alertTemplate).join("");
  document.getElementById("efficiencyRows").innerHTML = state.fuel
    .slice().sort((a, b) => b.efficiency - a.efficiency).slice(0, 6)
    .map(f => {
      const truck = state.trucks.find(t => t.truckNo === f.truckNo);
      return `<tr><td>${f.truckNo}</td><td>${truck?.driver || "-"}</td><td>${statusBadge(truck?.status)}</td><td>${f.efficiency}</td><td>${currency.format(truck?.monthlyRevenue || 0)}</td><td>${currency.format(Math.round((truck?.monthlyCost || 0) / 6000))}</td></tr>`;
    }).join("");
}

function renderTrucks() {
  const term = document.getElementById("globalSearch").value.toLowerCase();
  const status = document.getElementById("statusFilter").value;
  const model = document.getElementById("modelFilter").value;
  const rows = state.trucks.filter(t => {
    const matchesTerm = Object.values(t).join(" ").toLowerCase().includes(term);
    return matchesTerm && (status === "all" || t.status === status) && (model === "all" || t.model === model);
  });
  document.getElementById("truckRows").innerHTML = rows.map(t => `
    <tr>
      <td><strong>${t.truckNo}</strong></td><td>${t.registration}</td><td>${t.model}</td><td>${t.year}</td>
      <td>${t.driver}</td><td>${number.format(t.odometer)} km</td><td>${statusBadge(t.status)}</td>
      <td><div class="row-actions"><button onclick="editTruck('${t.id}')">Edit</button><button onclick="deleteTruck('${t.id}')">Delete</button></div></td>
    </tr>
  `).join("");
}

function renderFuel() {
  document.getElementById("fuelRows").innerHTML = state.fuel.map(f => `
    <tr><td>${f.date}</td><td>${f.truckNo}</td><td>${number.format(f.liters)}</td><td>${currency.format(f.costPerLiter)}</td><td>${currency.format(f.total)}</td><td>${f.efficiency} km/L</td></tr>
  `).join("");
  drawLineChart("fuelChart", state.fuel.slice(0, 14).map(f => f.truckNo), state.fuel.slice(0, 14).map(f => f.efficiency), "Fuel efficiency km/L");
  document.getElementById("fuelSummary").innerHTML = [
    ["Total fuel cost", currency.format(sum(state.fuel, "total"))],
    ["Average KM/L", avg(state.fuel, "efficiency").toFixed(2)],
    ["Highest fill", `${number.format(Math.max(...state.fuel.map(f => f.liters)))} L`]
  ].map(summaryTemplate).join("");
}

function renderMaintenance() {
  document.getElementById("maintenanceRows").innerHTML = state.maintenance.map(m => `
    <tr><td>${m.truckNo}</td><td>${m.service}</td><td>${m.lastDone}</td><td>${m.nextDue}</td><td>${currency.format(m.cost)}</td><td>${m.vendor}</td><td>${duePill(m.nextDue)}</td></tr>
  `).join("");
}

function renderTires() {
  document.getElementById("tireRows").innerHTML = state.tires.map(t => `
    <tr><td>${t.truckNo}</td><td>${t.position}</td><td>${t.brand}</td><td>${t.installed}</td><td>${conditionPill(t.condition)}</td><td>${t.rotationDue}</td><td>${currency.format(t.cost)}</td><td>${number.format(t.lifespanKm)} km</td></tr>
  `).join("");
}

function renderDrivers() {
  document.getElementById("driverRows").innerHTML = state.drivers.map(d => `
    <tr><td><strong>${d.name}</strong></td><td>${d.phone}</td><td>${d.license}</td><td>${d.licenseExpiry}</td><td>${d.assignedTruck}</td><td>${d.score}/100</td><td>${d.onTime}%</td></tr>
  `).join("");
}

function renderExpenses() {
  document.getElementById("expenseRows").innerHTML = state.expenses.slice().reverse().map(e => `
    <tr><td>${e.date}</td><td>${e.category}</td><td>${e.truckNo}</td><td>${e.description}</td><td>${currency.format(e.amount)}</td></tr>
  `).join("");
  const cats = groupSum(state.expenses, "category", "amount");
  drawBarChart("expenseChart", Object.keys(cats), Object.values(cats), "Monthly expenses", ["#176b87", "#1f8a70", "#d97706", "#c24132", "#7c3aed"]);
  document.getElementById("expenseSummary").innerHTML = Object.entries(cats).map(([k, v]) => summaryTemplate([k, currency.format(v)])).join("");
}

function renderReport() {
  const data = kpis();
  const period = document.getElementById("reportPeriod").value;
  const type = document.getElementById("reportType").value;
  document.getElementById("reportSheet").innerHTML = `
    <h2>${period} ${type}</h2>
    <p>Generated for HaulOps Logistics on ${today.toLocaleDateString("en-IN", { dateStyle: "medium" })}</p>
    <div class="report-kpis">
      <div><small>Total Trucks</small><strong>${state.trucks.length}</strong></div>
      <div><small>Active</small><strong>${data.active}</strong></div>
      <div><small>Revenue</small><strong>${currency.format(data.revenue)}</strong></div>
      <div><small>Expenses</small><strong>${currency.format(data.expenses)}</strong></div>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Truck</th><th>Status</th><th>Driver</th><th>Fuel KM/L</th><th>Cost</th><th>Revenue</th><th>Net</th></tr></thead>
        <tbody>${state.trucks.map(t => {
          const fuel = state.fuel.find(f => f.truckNo === t.truckNo);
          return `<tr><td>${t.truckNo}</td><td>${t.status}</td><td>${t.driver}</td><td>${fuel?.efficiency || "-"}</td><td>${currency.format(t.monthlyCost)}</td><td>${currency.format(t.monthlyRevenue)}</td><td>${currency.format(t.monthlyRevenue - t.monthlyCost)}</td></tr>`;
        }).join("")}</tbody>
      </table>
    </div>`;
}

function renderAlerts() {
  document.getElementById("alertGrid").innerHTML = buildAlerts().map(a => `
    <article class="alert-card"><h3>${a.title}</h3><p>${a.detail}</p><span class="pill ${a.level}">${a.when}</span></article>
  `).join("");
}

function renderAnalytics() {
  const labels = state.trucks.map(t => t.truckNo);
  drawBarChart("truckProfitChart", labels, state.trucks.map(t => t.monthlyRevenue - t.monthlyCost), "Net profit per truck", ["#176b87"]);
  drawLineChart("maintenanceTrendChart", ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], [181000, 214000, 198000, 236000, 255000, kpis().maintenanceCost], "Maintenance trend");
  const utilization = Math.round(state.trucks.filter(t => t.status === "Active").length / state.trucks.length * 100);
  document.getElementById("utilizationGauge").textContent = `${utilization}%`;
  document.querySelector(".gauge").style.setProperty("--gauge", `${utilization}%`);
}

function buildAlerts() {
  const alerts = [];
  state.maintenance.filter(m => daysUntil(m.nextDue) < 15).forEach(m => alerts.push({ title: `${m.service} due`, detail: `${m.truckNo} is due on ${m.nextDue} with ${m.vendor}.`, when: `${daysUntil(m.nextDue)} days`, level: "warn" }));
  state.tires.filter(t => t.condition === "Replace Soon" || daysUntil(t.rotationDue) < 10).forEach(t => alerts.push({ title: `Tire attention`, detail: `${t.truckNo} ${t.position} ${t.brand} is ${t.condition.toLowerCase()}.`, when: t.rotationDue, level: t.condition === "Replace Soon" ? "bad" : "warn" }));
  state.trucks.filter(t => daysUntil(t.insuranceExpiry) < 60).forEach(t => alerts.push({ title: "Insurance expiry", detail: `${t.truckNo} insurance expires on ${t.insuranceExpiry}.`, when: `${daysUntil(t.insuranceExpiry)} days`, level: "warn" }));
  state.trucks.filter(t => daysUntil(t.pollutionExpiry) < 45).forEach(t => alerts.push({ title: "Pollution certificate expiry", detail: `${t.truckNo} certificate expires on ${t.pollutionExpiry}.`, when: `${daysUntil(t.pollutionExpiry)} days`, level: "warn" }));
  state.drivers.filter(d => daysUntil(d.licenseExpiry) < 45).forEach(d => alerts.push({ title: "Driver license expiry", detail: `${d.name}'s license expires on ${d.licenseExpiry}.`, when: `${daysUntil(d.licenseExpiry)} days`, level: "bad" }));
  return alerts.sort((a, b) => parseInt(a.when, 10) - parseInt(b.when, 10));
}

function openForm(type, record = null) {
  formType = type;
  editId = record?.id || null;
  const fields = formFields(type, record);
  document.getElementById("dialogTitle").textContent = `${record ? "Edit" : "Add"} ${type}`;
  document.getElementById("formFields").innerHTML = fields.map(fieldTemplate).join("");
  document.getElementById("recordDialog").showModal();
}

function formFields(type, r = {}) {
  const truckOptions = state.trucks.map(t => t.truckNo);
  const fields = {
    truck: [["truckNo","Truck number",r.truckNo],["registration","Registration number",r.registration],["model","Model",r.model],["year","Year",r.year,"number"],["driver","Driver assigned",r.driver],["odometer","Odometer reading",r.odometer,"number"],["status","Status",r.status || "Active","select",["Active","Maintenance","Idle"]]],
    fuel: [["date","Date",r.date || new Date().toISOString().slice(0,10),"date"],["truckNo","Truck number",r.truckNo || truckOptions[0],"select",truckOptions],["liters","Diesel quantity (liters)",r.liters,"number"],["costPerLiter","Cost per liter",r.costPerLiter || 93,"number"],["efficiency","Fuel efficiency (km/L)",r.efficiency || 3.8,"number"]],
    maintenance: [["truckNo","Truck number",r.truckNo || truckOptions[0],"select",truckOptions],["service","Service",r.service || "Oil change","select",["Oil change","Engine inspection","Brake inspection","Battery replacement"]],["lastDone","Last done",r.lastDone || "2026-06-15","date"],["nextDue","Next due",r.nextDue || addDays(30),"date"],["cost","Cost",r.cost || 0,"number"],["vendor","Vendor",r.vendor || "Prime Truck Works"]],
    tire: [["truckNo","Truck number",r.truckNo || truckOptions[0],"select",truckOptions],["position","Tire position",r.position || "Front Left"],["brand","Brand",r.brand || "MRF"],["installed","Installation date",r.installed || "2026-06-15","date"],["condition","Condition",r.condition || "Good","select",["Good","Rotate Soon","Replace Soon"]],["rotationDue","Rotation due",r.rotationDue || addDays(45),"date"],["cost","Cost",r.cost || 0,"number"],["lifespanKm","Lifespan km",r.lifespanKm || 60000,"number"]],
    driver: [["name","Driver name",r.name],["phone","Phone number",r.phone],["license","License number",r.license],["licenseExpiry","License expiry date",r.licenseExpiry || addDays(180),"date"],["assignedTruck","Assigned truck",r.assignedTruck || truckOptions[0],"select",truckOptions],["score","Performance score",r.score || 85,"number"],["onTime","On-time %",r.onTime || 92,"number"]],
    expense: [["date","Date",r.date || "2026-06-15","date"],["category","Category",r.category || "Other","select",["Diesel","Tire","Maintenance","Driver Salary","Other"]],["truckNo","Truck number",r.truckNo || truckOptions[0],"select",truckOptions],["description","Description",r.description || ""],["amount","Amount",r.amount || 0,"number"]]
  };
  return fields[type];
}

function fieldTemplate([name, label, value = "", type = "text", options = []]) {
  if (type === "select") {
    return `<div class="field"><label for="${name}">${label}</label><select id="${name}" name="${name}">${options.map(o => `<option ${o === value ? "selected" : ""}>${o}</option>`).join("")}</select></div>`;
  }
  return `<div class="field"><label for="${name}">${label}</label><input id="${name}" name="${name}" type="${type}" value="${value ?? ""}" required></div>`;
}

function saveRecord(event) {
  event.preventDefault();
  const fields = [...document.querySelectorAll("#formFields input, #formFields select")];
  const record = Object.fromEntries(fields.map(f => [f.name, f.type === "number" ? Number(f.value) : f.value]));
  record.id = editId || crypto.randomUUID();
  if (formType === "fuel") record.total = record.liters * record.costPerLiter;
  if (formType === "truck") {
    record.monthlyCost ??= 0;
    record.monthlyRevenue ??= 0;
    record.insuranceExpiry ??= addDays(365);
    record.pollutionExpiry ??= addDays(180);
  }
  const collectionMap = { truck: "trucks", fuel: "fuel", maintenance: "maintenance", tire: "tires", driver: "drivers", expense: "expenses" };
  const collection = collectionMap[formType];
  const index = state[collection].findIndex(item => item.id === record.id);
  if (index >= 0) state[collection][index] = { ...state[collection][index], ...record };
  else state[collection].push(record);
  if (formType === "truck" && record.driver) syncDriverAssignment(record);
  mirrorExpense(formType, record);
  saveState();
  document.getElementById("recordDialog").close();
  toast(`${formType[0].toUpperCase() + formType.slice(1)} saved`);
  render();
}

function mirrorExpense(type, record) {
  if (editId || !["fuel", "maintenance", "tire"].includes(type)) return;
  const expense = {
    id: crypto.randomUUID(),
    date: record.date || record.lastDone || record.installed || new Date().toISOString().slice(0, 10),
    category: type === "fuel" ? "Diesel" : type === "tire" ? "Tire" : "Maintenance",
    truckNo: record.truckNo,
    description: type === "fuel" ? "Fuel filling" : type === "tire" ? `${record.brand} ${record.position}` : record.service,
    amount: type === "fuel" ? record.total : record.cost
  };
  state.expenses.push(expense);
}

window.editTruck = id => openForm("truck", state.trucks.find(t => t.id === id));
window.deleteTruck = id => {
  const truck = state.trucks.find(t => t.id === id);
  if (!truck || !confirm(`Delete ${truck.truckNo}? Related history is retained for reporting.`)) return;
  state.trucks = state.trucks.filter(t => t.id !== id);
  saveState();
  toast("Truck deleted");
  render();
};

function syncDriverAssignment(truck) {
  const driver = state.drivers.find(d => d.name === truck.driver);
  if (driver) driver.assignedTruck = truck.truckNo;
}

function exportCsv() {
  const rows = [["Truck","Status","Driver","Odometer","Revenue","Cost","Net"], ...state.trucks.map(t => [t.truckNo,t.status,t.driver,t.odometer,t.monthlyRevenue,t.monthlyCost,t.monthlyRevenue - t.monthlyCost])];
  download("fleet-report.csv", rows.map(r => r.map(v => `"${String(v).replaceAll('"', '""')}"`).join(",")).join("\n"), "text/csv");
}

function exportJson() {
  download("fleet-data.json", JSON.stringify(state, null, 2), "application/json");
}

function download(filename, content, type) {
  const blob = new Blob([content], { type });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

function drawBarChart(id, labels, values, title, colors) {
  const ctx = canvasCtx(id);
  const { width, height } = ctx.canvas;
  clear(ctx);
  const max = Math.max(...values, 1);
  const pad = 46;
  const barW = Math.max(12, (width - pad * 2) / values.length * .62);
  label(ctx, title, 18, 24, 14, true);
  values.forEach((value, i) => {
    const x = pad + i * ((width - pad * 2) / values.length) + barW * .25;
    const h = (height - 92) * (value / max);
    const y = height - 42 - h;
    ctx.fillStyle = colors[i % colors.length];
    roundRect(ctx, x, y, barW, h, 5);
    ctx.fill();
    ctx.fillStyle = css("--muted");
    ctx.font = "11px Segoe UI";
    ctx.save();
    ctx.translate(x + 2, height - 24);
    ctx.rotate(values.length > 8 ? -0.7 : 0);
    ctx.fillText(labels[i], 0, 0);
    ctx.restore();
  });
}

function drawLineChart(id, labels, values, title) {
  const ctx = canvasCtx(id);
  const { width, height } = ctx.canvas;
  clear(ctx);
  const pad = 46;
  const max = Math.max(...values, 1), min = Math.min(...values, 0);
  label(ctx, title, 18, 24, 14, true);
  ctx.strokeStyle = css("--line");
  ctx.beginPath(); ctx.moveTo(pad, height - 42); ctx.lineTo(width - pad, height - 42); ctx.stroke();
  ctx.strokeStyle = css("--primary");
  ctx.lineWidth = 3;
  ctx.beginPath();
  values.forEach((v, i) => {
    const x = pad + i * ((width - pad * 2) / Math.max(values.length - 1, 1));
    const y = height - 42 - ((v - min) / Math.max(max - min, 1)) * (height - 92);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();
  values.forEach((v, i) => {
    const x = pad + i * ((width - pad * 2) / Math.max(values.length - 1, 1));
    const y = height - 42 - ((v - min) / Math.max(max - min, 1)) * (height - 92);
    ctx.fillStyle = css("--primary-2"); ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
  });
}

function drawDonutChart(id, data, colors) {
  const ctx = canvasCtx(id);
  const total = Object.values(data).reduce((a, b) => a + b, 0);
  clear(ctx);
  const cx = ctx.canvas.width / 2, cy = 140, r = 78;
  let start = -Math.PI / 2;
  Object.entries(data).forEach(([key, value], i) => {
    const angle = (value / total) * Math.PI * 2;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, start, start + angle); ctx.closePath();
    ctx.fillStyle = colors[i % colors.length]; ctx.fill();
    start += angle;
  });
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath(); ctx.arc(cx, cy, 44, 0, Math.PI * 2); ctx.fill();
  ctx.globalCompositeOperation = "source-over";
  let y = 242;
  Object.entries(data).forEach(([key, value], i) => {
    ctx.fillStyle = colors[i % colors.length]; ctx.fillRect(34, y - 10, 12, 12);
    label(ctx, `${key}: ${value}`, 54, y, 13);
    y += 24;
  });
}

function canvasCtx(id) {
  const canvas = document.getElementById(id);
  const rect = canvas.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.max(320, rect.width) * scale;
  canvas.height = Number(canvas.getAttribute("height")) * scale;
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);
  return ctx;
}

function clear(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function label(ctx, text, x, y, size = 12, bold = false) {
  ctx.fillStyle = css("--text");
  ctx.font = `${bold ? "700 " : ""}${size}px Segoe UI`;
  ctx.fillText(text, x, y);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function css(variable) {
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
}

function groupCount(items, key) {
  return items.reduce((acc, item) => ((acc[item[key]] = (acc[item[key]] || 0) + 1), acc), {});
}

function groupSum(items, key, sumKey) {
  return items.reduce((acc, item) => ((acc[item[key]] = (acc[item[key]] || 0) + Number(item[sumKey])), acc), {});
}

function sum(items, key) { return items.reduce((total, item) => total + Number(item[key] || 0), 0); }
function avg(items, key) { return sum(items, key) / Math.max(items.length, 1); }
function daysUntil(date) { return Math.ceil((new Date(`${date}T00:00:00`) - today) / 86400000); }
function statusBadge(status) { return `<span class="status ${status}">${status}</span>`; }
function conditionPill(condition) { return `<span class="pill ${condition === "Good" ? "good" : condition === "Rotate Soon" ? "warn" : "bad"}">${condition}</span>`; }
function duePill(date) {
  const days = daysUntil(date);
  return `<span class="pill ${days < 10 ? "bad" : days < 20 ? "warn" : "good"}">${days < 0 ? "Overdue" : `${days} days`}</span>`;
}
function summaryTemplate([labelText, value]) { return `<div class="notice"><strong>${value}</strong><small>${labelText}</small></div>`; }
function alertTemplate(a) { return `<div class="notice"><strong>${a.title}</strong><small>${a.detail}</small></div>`; }

function populateModelFilter() {
  const filter = document.getElementById("modelFilter");
  const models = [...new Set(state.trucks.map(t => t.model))];
  const current = filter.value;
  filter.innerHTML = `<option value="all">All models</option>${models.map(m => `<option>${m}</option>`).join("")}`;
  filter.value = models.includes(current) ? current : "all";
}

function toast(message) {
  const el = document.getElementById("toast");
  el.textContent = message;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2200);
}

window.addEventListener("resize", render);
render();
