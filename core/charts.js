const PADBS_CHART_COLORS = {
  primary: "#365a3a",
  primaryLight: "#5f8b54",
  accent: "#d8b35a",
  coral: "#bc5b32",
  blue: "#3f72af",
  palette: ["#365a3a", "#5f8b54", "#d8b35a", "#bc5b32", "#3f72af", "#159060", "#c7831f"],
};

const PADBS_CHARTS = {
  instances: [],
  destroyAll() {
    this.instances.forEach((chart) => chart.destroy());
    this.instances = [];
  },
  track(chart) {
    this.instances.push(chart);
    return chart;
  },
  init(page) {
    if (typeof Chart === "undefined") return;
    Chart.defaults.font.family = "'Plus Jakarta Sans', system-ui, sans-serif";
    Chart.defaults.color = "#647067";
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    const map = {
      executive: initExecutiveCharts,
      inventory: initInventoryCharts,
      quotes: () => initOperationalChart("quotes"),
      credit: () => initOperationalChart("credit"),
      suppliers: () => initOperationalChart("suppliers"),
      dispatch: () => initOperationalChart("dispatch"),
    };
    if (map[page]) map[page]();
  },
};

function baseOptions(extra = {}) {
  return { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: extra.legend !== false } }, ...extra };
}

function initExecutiveCharts() {
  const d = PADBS_THEME.data.executive;
  const months = PADBS_I18n.months();
  PADBS_CHARTS.track(new Chart(document.getElementById("salesTrendChart"), {
    type: "line",
    data: { labels: months, datasets: [{ label: PADBS_I18n.t("executive.charts.sales"), data: d.salesTrend, borderColor: PADBS_CHART_COLORS.primary, backgroundColor: "rgba(54,90,58,0.1)", fill: true, tension: 0.4, borderWidth: 2.5, pointBackgroundColor: PADBS_CHART_COLORS.accent }] },
    options: baseOptions({ legend: false, scales: { y: { ticks: { callback: (v) => money(v) }, grid: { color: "rgba(0,0,0,0.04)" } }, x: { grid: { display: false } } } }),
  }));
  PADBS_CHARTS.track(new Chart(document.getElementById("branchPerfChart"), {
    type: "bar",
    data: { labels: PADBS_THEME.data.company.branches, datasets: [{ label: PADBS_I18n.t("executive.charts.branchSales"), data: d.branchPerformance, backgroundColor: PADBS_CHART_COLORS.palette, borderRadius: 8 }] },
    options: baseOptions({ legend: false, scales: { y: { ticks: { callback: (v) => money(v) }, grid: { color: "rgba(0,0,0,0.04)" } }, x: { grid: { display: false } } } }),
  }));
  PADBS_CHARTS.track(new Chart(document.getElementById("operatingMixChart"), {
    type: "doughnut",
    data: { labels: d.operatingMix.labels[PADBS_I18n.lang], datasets: [{ data: d.operatingMix.values, backgroundColor: PADBS_CHART_COLORS.palette, borderWidth: 0 }] },
    options: baseOptions({ cutout: "64%", plugins: { legend: { position: "right" } } }),
  }));
}

function initInventoryCharts() {
  const d = PADBS_THEME.data.inventory;
  PADBS_CHARTS.track(new Chart(document.getElementById("stockByCategoryChart"), {
    type: "bar",
    data: { labels: d.categories.labels[PADBS_I18n.lang], datasets: [{ label: PADBS_I18n.t("inventory.charts.stock"), data: d.categories.stock, backgroundColor: PADBS_CHART_COLORS.primaryLight, borderRadius: 8 }] },
    options: baseOptions({ legend: false, scales: { y: { grid: { color: "rgba(0,0,0,0.04)" } }, x: { grid: { display: false } } } }),
  }));
  PADBS_CHARTS.track(new Chart(document.getElementById("turnoverChart"), {
    type: "radar",
    data: { labels: d.categories.labels[PADBS_I18n.lang], datasets: [{ label: PADBS_I18n.t("inventory.charts.turnover"), data: d.categories.turnover, backgroundColor: "rgba(216,179,90,0.22)", borderColor: PADBS_CHART_COLORS.accent, pointBackgroundColor: PADBS_CHART_COLORS.primary, borderWidth: 2 }] },
    options: baseOptions({ scales: { r: { beginAtZero: true, max: 8, ticks: { stepSize: 2 }, grid: { color: "rgba(0,0,0,0.06)" } } } }),
  }));
}

function initOperationalChart(page) {
  const d = PADBS_THEME.data[page].chart;
  PADBS_CHARTS.track(new Chart(document.getElementById(`${page}PrimaryChart`), {
    type: d.type,
    data: { labels: d.labels[PADBS_I18n.lang], datasets: [{ label: PADBS_I18n.text(d.label), data: d.values, backgroundColor: PADBS_CHART_COLORS.palette, borderColor: PADBS_CHART_COLORS.primary, borderRadius: d.type === "bar" ? 8 : 0, tension: 0.4, fill: d.type === "line" }] },
    options: baseOptions({ legend: d.type !== "bar", scales: d.type === "doughnut" ? {} : { y: { grid: { color: "rgba(0,0,0,0.04)" } }, x: { grid: { display: false } } } }),
  }));
}
