/**
 * Padel House: Chart.js configurations (bilingual)
 */

const PH_CHART_COLORS = {
  primary: "#0f6b4f",
  primaryLight: "#1fa87a",
  accent: "#d4ff45",
  coral: "#ff5c2b",
  blue: "#3b82f6",
  purple: "#8b5cf6",
  palette: ["#0f6b4f", "#1fa87a", "#d4ff45", "#ff5c2b", "#3b82f6", "#8b5cf6", "#10b981", "#f59e0b"],
};

const PH_CHARTS = {
  instances: [],

  destroyAll() {
    this.instances.forEach((c) => c.destroy());
    this.instances = [];
  },

  track(chart) {
    this.instances.push(chart);
    return chart;
  },

  init(page) {
    const map = {
      executive: initExecutiveCharts,
      customers: initCustomerCharts,
      inventory: initInventoryCharts,
      sales: initSalesCharts,
      loyalty: initLoyaltyCharts,
      growth: initGrowthCharts,
    };
    if (map[page]) map[page]();
  },
};

Chart.defaults.font.family = "'Plus Jakarta Sans', system-ui, sans-serif";
Chart.defaults.color = "#64748b";
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.padding = 16;

function baseOptions(extra = {}) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: extra.legend !== false } },
    ...extra,
  };
}

function initExecutiveCharts() {
  const d = PH_DATA.executive;
  const months = PH_I18n.months();

  PH_CHARTS.track(new Chart(document.getElementById("revenueTrendChart"), {
    type: "line",
    data: {
      labels: months,
      datasets: [{
        label: PH_I18n.t("executive.charts.revenue"),
        data: d.revenueTrend,
        borderColor: PH_CHART_COLORS.primary,
        backgroundColor: "rgba(15, 107, 79, 0.1)",
        fill: true,
        tension: 0.4,
        borderWidth: 2.5,
        pointBackgroundColor: PH_CHART_COLORS.accent,
        pointRadius: 4,
      }],
    },
    options: baseOptions({
      legend: false,
      scales: {
        y: { ticks: { callback: (v) => formatCurrency(v) }, grid: { color: "rgba(0,0,0,0.04)" } },
        x: { grid: { display: false } },
      },
    }),
  }));

  PH_CHARTS.track(new Chart(document.getElementById("storePerfChart"), {
    type: "bar",
    data: {
      labels: PH_DATA.company.stores,
      datasets: [{
        label: PH_I18n.t("executive.charts.storeSales"),
        data: d.storePerformance,
        backgroundColor: PH_CHART_COLORS.palette,
        borderRadius: 8,
      }],
    },
    options: baseOptions({
      legend: false,
      scales: {
        y: { ticks: { callback: (v) => formatCurrency(v) }, grid: { color: "rgba(0,0,0,0.04)" } },
        x: { grid: { display: false } },
      },
    }),
  }));

  PH_CHARTS.track(new Chart(document.getElementById("categoryMixChart"), {
    type: "doughnut",
    data: {
      labels: categoryLabels(d.categoryMix.keys),
      datasets: [{ data: d.categoryMix.values, backgroundColor: PH_CHART_COLORS.palette, borderWidth: 0 }],
    },
    options: baseOptions({ cutout: "65%", plugins: { legend: { position: "right" } } }),
  }));
}

function initCustomerCharts() {
  const d = PH_DATA.customers;
  const months = PH_I18n.months();

  PH_CHARTS.track(new Chart(document.getElementById("segmentChart"), {
    type: "doughnut",
    data: {
      labels: d.segments.keys.map((k) => PH_I18n.segment(k)),
      datasets: [{ data: d.segments.values, backgroundColor: PH_CHART_COLORS.palette, borderWidth: 0 }],
    },
    options: baseOptions({ cutout: "60%", plugins: { legend: { position: "bottom" } } }),
  }));

  PH_CHARTS.track(new Chart(document.getElementById("acquisitionChart"), {
    type: "bar",
    data: {
      labels: d.acquisition.keys.map((k) => PH_I18n.acquisition(k)),
      datasets: [{
        label: PH_I18n.t("customers.charts.newCustomersPct"),
        data: d.acquisition.values,
        backgroundColor: PH_CHART_COLORS.primary,
        borderRadius: 8,
      }],
    },
    options: baseOptions({
      indexAxis: "y",
      legend: false,
      scales: {
        x: { max: 40, ticks: { callback: (v) => v + "%" }, grid: { color: "rgba(0,0,0,0.04)" } },
        y: { grid: { display: false } },
      },
    }),
  }));

  PH_CHARTS.track(new Chart(document.getElementById("retentionChart"), {
    type: "line",
    data: {
      labels: months,
      datasets: [{
        label: PH_I18n.t("customers.charts.retentionPct"),
        data: d.retention,
        borderColor: PH_CHART_COLORS.coral,
        backgroundColor: "rgba(255, 92, 43, 0.12)",
        fill: true,
        tension: 0.4,
        borderWidth: 2.5,
        pointBackgroundColor: PH_CHART_COLORS.coral,
      }],
    },
    options: baseOptions({
      legend: false,
      scales: {
        y: { min: 50, max: 80, ticks: { callback: (v) => v + "%" }, grid: { color: "rgba(0,0,0,0.04)" } },
        x: { grid: { display: false } },
      },
    }),
  }));
}

function initInventoryCharts() {
  const d = PH_DATA.inventory;
  const labels = categoryLabels(d.categories.keys);

  PH_CHARTS.track(new Chart(document.getElementById("stockByCategoryChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: PH_I18n.t("inventory.charts.stockUnits"),
        data: d.categories.stock,
        backgroundColor: PH_CHART_COLORS.primaryLight,
        borderRadius: 8,
      }],
    },
    options: baseOptions({
      legend: false,
      scales: {
        y: { grid: { color: "rgba(0,0,0,0.04)" } },
        x: { grid: { display: false } },
      },
    }),
  }));

  PH_CHARTS.track(new Chart(document.getElementById("turnoverChart"), {
    type: "radar",
    data: {
      labels,
      datasets: [{
        label: PH_I18n.t("inventory.charts.turnoverX"),
        data: d.categories.turnover,
        backgroundColor: "rgba(212, 255, 69, 0.25)",
        borderColor: PH_CHART_COLORS.accent,
        pointBackgroundColor: PH_CHART_COLORS.primary,
        borderWidth: 2,
      }],
    },
    options: baseOptions({
      scales: {
        r: { beginAtZero: true, max: 8, ticks: { stepSize: 2 }, grid: { color: "rgba(0,0,0,0.06)" } },
      },
    }),
  }));
}

function initSalesCharts() {
  const d = PH_DATA.sales;
  const months = PH_I18n.months();

  PH_CHARTS.track(new Chart(document.getElementById("monthlySalesChart"), {
    type: "line",
    data: {
      labels: months,
      datasets: [
        {
          label: PH_I18n.t("sales.charts.year2026"),
          data: d.monthly.current,
          borderColor: PH_CHART_COLORS.primary,
          backgroundColor: "rgba(15, 107, 79, 0.1)",
          fill: true,
          tension: 0.4,
          borderWidth: 2.5,
        },
        {
          label: PH_I18n.t("sales.charts.year2025"),
          data: d.monthly.previous,
          borderColor: "#94a3b8",
          borderDash: [6, 4],
          tension: 0.4,
          borderWidth: 2,
          fill: false,
        },
      ],
    },
    options: baseOptions({
      scales: {
        y: { ticks: { callback: (v) => formatCurrency(v) }, grid: { color: "rgba(0,0,0,0.04)" } },
        x: { grid: { display: false } },
      },
    }),
  }));

  PH_CHARTS.track(new Chart(document.getElementById("categorySalesChart"), {
    type: "pie",
    data: {
      labels: categoryLabels(d.byCategory.keys),
      datasets: [{ data: d.byCategory.values, backgroundColor: PH_CHART_COLORS.palette, borderWidth: 2, borderColor: "#fff" }],
    },
    options: baseOptions({ plugins: { legend: { position: "right" } } }),
  }));

  PH_CHARTS.track(new Chart(document.getElementById("storeSalesChart"), {
    type: "bar",
    data: {
      labels: PH_DATA.company.stores,
      datasets: [{
        label: PH_I18n.t("sales.charts.storeSalesYtd"),
        data: d.byStore,
        backgroundColor: PH_CHART_COLORS.palette.slice(0, 4),
        borderRadius: 8,
      }],
    },
    options: baseOptions({
      legend: false,
      scales: {
        y: { ticks: { callback: (v) => formatCurrency(v) }, grid: { color: "rgba(0,0,0,0.04)" } },
        x: { grid: { display: false } },
      },
    }),
  }));
}

function initLoyaltyCharts() {
  const d = PH_DATA.loyalty;
  const months = PH_I18n.months();

  PH_CHARTS.track(new Chart(document.getElementById("pointsTrendChart"), {
    type: "bar",
    data: {
      labels: months,
      datasets: [
        { label: PH_I18n.t("loyalty.charts.issued"), data: d.pointsTrend.issued, backgroundColor: PH_CHART_COLORS.primary, borderRadius: 6 },
        { label: PH_I18n.t("loyalty.charts.redeemed"), data: d.pointsTrend.redeemed, backgroundColor: PH_CHART_COLORS.accent, borderRadius: 6 },
      ],
    },
    options: baseOptions({
      scales: {
        y: { ticks: { callback: (v) => (v / 1000) + "K" }, grid: { color: "rgba(0,0,0,0.04)" } },
        x: { grid: { display: false } },
      },
    }),
  }));

  PH_CHARTS.track(new Chart(document.getElementById("engagementChart"), {
    type: "polarArea",
    data: {
      labels: d.engagement.keys.map((k) => PH_I18n.engagement(k)),
      datasets: [{ data: d.engagement.values, backgroundColor: PH_CHART_COLORS.palette.map((c) => c + "99"), borderWidth: 1, borderColor: "#fff" }],
    },
    options: baseOptions({ scales: { r: { ticks: { display: false }, grid: { color: "rgba(0,0,0,0.06)" } } } }),
  }));

  PH_CHARTS.track(new Chart(document.getElementById("tierChart"), {
    type: "doughnut",
    data: {
      labels: d.tiers.map((t) => t.name),
      datasets: [{ data: d.tiers.map((t) => t.count), backgroundColor: ["#cd7f32", "#94a3b8", "#f59e0b", "#6366f1"], borderWidth: 0 }],
    },
    options: baseOptions({ cutout: "55%", plugins: { legend: { position: "bottom" } } }),
  }));
}

function initGrowthCharts() {
  const d = PH_DATA.growth;

  PH_CHARTS.track(new Chart(document.getElementById("marketTrendChart"), {
    type: "line",
    data: {
      labels: d.marketTrend.labels,
      datasets: [
        { label: PH_I18n.t("growth.charts.activePlayers"), data: d.marketTrend.players, borderColor: PH_CHART_COLORS.primary, yAxisID: "y", tension: 0.4, borderWidth: 2.5 },
        { label: PH_I18n.t("growth.charts.equipmentMarket"), data: d.marketTrend.revenue, borderColor: PH_CHART_COLORS.coral, yAxisID: "y1", tension: 0.4, borderWidth: 2.5 },
      ],
    },
    options: baseOptions({
      scales: {
        y: { type: "linear", position: "left", ticks: { callback: (v) => (v / 1000) + "K" }, grid: { color: "rgba(0,0,0,0.04)" } },
        y1: { type: "linear", position: "right", ticks: { callback: (v) => formatCurrency(v) }, grid: { drawOnChartArea: false } },
        x: { grid: { display: false } },
      },
    }),
  }));

  PH_CHARTS.track(new Chart(document.getElementById("expansionChart"), {
    type: "bar",
    data: {
      labels: d.expansion.map((e) => e.city),
      datasets: [{
        label: PH_I18n.t("growth.charts.oppScore"),
        data: d.expansion.map((e) => e.score),
        backgroundColor: d.expansion.map((e) => (e.score >= 80 ? PH_CHART_COLORS.accent : e.score >= 70 ? PH_CHART_COLORS.coral : PH_CHART_COLORS.blue)),
        borderRadius: 8,
      }],
    },
    options: baseOptions({
      legend: false,
      scales: {
        y: { max: 100, grid: { color: "rgba(0,0,0,0.04)" } },
        x: { grid: { display: false } },
      },
    }),
  }));
}
