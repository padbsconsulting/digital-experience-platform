/**
 * Padel House: page renderers (bilingual)
 */

const PH_JOURNEY = ["executive", "customers", "inventory", "sales", "loyalty", "growth"];

const PH_ACTION_ICONS = {
  customers: ["📩", "🏅", "🎯"],
  inventory: ["📦", "🔁", "🛒"],
  sales: ["🏪", "📈", "🙌"],
  loyalty: ["🎁", "🌱", "🎟️"],
};

function journeyPhaseLabel(page) {
  const key = PH_I18n.t(`common.journey.pagePhase.${page}`);
  if (!key || key.startsWith("common.journey")) return "";
  const phase = PH_I18n.t(`common.journey.phases.${key}`);
  return phase.startsWith("common.journey") ? "" : phase;
}

function journeyChip(page) {
  const idx = PH_JOURNEY.indexOf(page);
  const j = PH_I18n.t("common.journey");
  const phase = journeyPhaseLabel(page);
  if (idx < 0) {
    if (!phase) return "";
    return `
      <div class="journey-chip journey-chip-future">
        <span class="journey-step">${phase}</span>
        <span class="journey-question">${PH_I18n.t(`${page}.question`)}</span>
      </div>`;
  }
  return `
    <div class="journey-chip">
      <span class="journey-step">${phase ? `${phase} · ${j.step} ${idx + 1}` : `${j.step} ${idx + 1}`} ${j.of} ${PH_JOURNEY.length}</span>
      <span class="journey-question">${PH_I18n.t(`${page}.question`)}</span>
    </div>`;
}

function nextStepCard(page) {
  const idx = PH_JOURNEY.indexOf(page);
  if (idx < 0) return "";
  const j = PH_I18n.t("common.journey");

  if (idx === PH_JOURNEY.length - 1) {
    return `
      <a class="next-step" href="product-hub.html">
        <div>
          <span class="next-step-label">${j.toFutureLabel}</span>
          <h3>${j.toFutureTitle}</h3>
          <p>${j.toFutureText}</p>
        </div>
        <span class="next-step-arrow">→</span>
      </a>`;
  }

  const nextId = PH_JOURNEY[idx + 1];
  const nav = PH_NAV.find((n) => n.id === nextId);
  return `
    <a class="next-step" href="${nav.href}">
      <div>
        <span class="next-step-label">${j.nextLabel}</span>
        <h3>${PH_I18n.t(`${nextId}.question`)}</h3>
        <p>${PH_I18n.t(`nav.${nextId}`)}</p>
      </div>
      <span class="next-step-arrow">→</span>
    </a>`;
}

function actionCards(page) {
  const icons = PH_ACTION_ICONS[page];
  if (!icons) return "";
  const j = PH_I18n.t("common.journey");
  const cards = icons.map((icon, i) => {
    const a = PH_I18n.t(`${page}.actions.a${i + 1}`);
    return `
      <div class="action-card">
        <span class="action-icon">${icon}</span>
        <h4>${a.title}</h4>
        <p>${a.desc}</p>
      </div>`;
  }).join("");
  return `
    <div class="section-heading">
      <h3 class="card-title">${j.actionsTitle}</h3>
      <p class="card-subtitle">${j.actionsSubtitle}</p>
    </div>
    <div class="action-grid">${cards}</div>`;
}

const PH_PAGES = {
  render(page) {
    const map = {
      executive: this.renderExecutive,
      customers: this.renderCustomers,
      inventory: this.renderInventory,
      sales: this.renderSales,
      loyalty: this.renderLoyalty,
      growth: this.renderGrowth,
      products: this.renderProducts,
      experience: this.renderExperience,
    };
    if (map[page]) map[page].call(this);
  },

  card(title, subtitle, body, footer = "") {
    return `
      <div class="card">
        <div class="card-header">
          <div>
            <h3 class="card-title">${title}</h3>
            ${subtitle ? `<p class="card-subtitle">${subtitle}</p>` : ""}
          </div>
        </div>
        <div class="card-body">${body}</div>
        ${footer ? `<div class="card-footer">${footer}</div>` : ""}
      </div>`;
  },

  renderExecutive() {
    const t = (k) => PH_I18n.t(`executive.${k}`);
    const d = PH_DATA.executive;
    const c = PH_I18n.t("common");

    document.getElementById("page-content").innerHTML = `
      <div class="demo-banner">
        <div>
          <h2>${t("bannerTitle")}</h2>
          <p>${t("bannerText")}</p>
          <a class="banner-cta" href="customer-insights.html">${t("bannerCta")} →</a>
        </div>
        <span class="demo-banner-tag">${c.demoCommercial}</span>
      </div>
      ${journeyChip("executive")}
      <div class="kpi-grid">${renderKPIs(d.kpis, "executive")}</div>
      <div class="grid-2">
        ${this.card(t("revenueTrend.title"), t("revenueTrend.subtitle"), '<div class="chart-container"><canvas id="revenueTrendChart"></canvas></div>')}
        ${this.card(t("categoryMix.title"), t("categoryMix.subtitle"), '<div class="chart-container"><canvas id="categoryMixChart"></canvas></div>')}
      </div>
      <div class="grid-2 equal">
        ${this.card(t("storePerf.title"), t("storePerf.subtitle"), '<div class="chart-container"><canvas id="storePerfChart"></canvas></div>')}
        ${this.card(t("insights.title"), t("insights.subtitle"), `<ul class="insight-list">${renderInsights(d.insights, "executive")}</ul>`)}
      </div>
      <div class="card">
        <div class="card-header">
          <div><h3 class="card-title">${t("activity.title")}</h3><p class="card-subtitle">${t("activity.subtitle")}</p></div>
        </div>
        <div class="card-body flush">
          <div class="table-wrap"><table>
            <thead><tr><th>${c.time}</th><th>${c.event}</th><th>${c.detail}</th></tr></thead>
            <tbody>${renderActivity(d.activity, "executive")}</tbody>
          </table></div>
        </div>
      </div>
      ${nextStepCard("executive")}`;
  },

  renderCustomers() {
    const t = (k) => PH_I18n.t(`customers.${k}`);
    const d = PH_DATA.customers;
    const c = PH_I18n.t("common");

    document.getElementById("page-content").innerHTML = `
      ${journeyChip("customers")}
      <div class="kpi-grid">${renderKPIs(d.kpis, "customers")}</div>
      <div class="grid-2 equal">
        ${this.card(t("segments.title"), t("segments.subtitle"), '<div class="chart-container"><canvas id="segmentChart"></canvas></div>')}
        ${this.card(t("acquisition.title"), t("acquisition.subtitle"), '<div class="chart-container"><canvas id="acquisitionChart"></canvas></div>')}
      </div>
      <div class="grid-2-1">
        <div class="card">
          <div class="card-header"><div><h3 class="card-title">${t("topCustomers.title")}</h3><p class="card-subtitle">${t("topCustomers.subtitle")}</p></div></div>
          <div class="card-body flush">
            <div class="table-wrap"><table>
              <thead><tr><th>${c.customer}</th><th>${c.store}</th><th>${c.tier}</th><th>${c.customerValue}</th><th>${c.visits}</th><th>${c.lastVisit}</th></tr></thead>
              <tbody>${renderCustomersTable(d.topCustomers)}</tbody>
            </table></div>
          </div>
        </div>
        ${this.card(t("retention.title"), t("retention.subtitle"), '<div class="chart-container sm"><canvas id="retentionChart"></canvas></div>', t("retention.footer"))}
      </div>
      ${this.card(t("geo.title"), t("geo.subtitle"), `<div id="city-bars">${renderCityBars(d.cities)}</div>`)}
      ${actionCards("customers")}
      ${nextStepCard("customers")}`;
  },

  renderInventory() {
    const t = (k) => PH_I18n.t(`inventory.${k}`);
    const d = PH_DATA.inventory;
    const c = PH_I18n.t("common");

    document.getElementById("page-content").innerHTML = `
      ${journeyChip("inventory")}
      <div class="kpi-grid">${renderKPIs(d.kpis, "inventory")}</div>
      <div class="grid-2 equal">
        ${this.card(t("stockByCat.title"), t("stockByCat.subtitle"), '<div class="chart-container"><canvas id="stockByCategoryChart"></canvas></div>')}
        ${this.card(t("turnover.title"), t("turnover.subtitle"), '<div class="chart-container"><canvas id="turnoverChart"></canvas></div>')}
      </div>
      <div class="grid-2-1">
        <div class="card">
          <div class="card-header"><div><h3 class="card-title">${t("alerts.title")}</h3><p class="card-subtitle">${t("alerts.subtitle")}</p></div></div>
          <div class="card-body flush">
            <div class="table-wrap"><table>
              <thead><tr><th>SKU</th><th>${c.product}</th><th>${c.store}</th><th>${c.qty}</th><th>${c.daysLeft}</th><th>${c.status}</th></tr></thead>
              <tbody>${renderAlertsTable(d.alerts)}</tbody>
            </table></div>
          </div>
        </div>
        ${this.card(t("warehouse.title"), t("warehouse.subtitle"), renderWarehouse(d.warehouse))}
      </div>
      <div class="card">
        <div class="card-header"><div><h3 class="card-title">${t("topSkus.title")}</h3><p class="card-subtitle">${t("topSkus.subtitle")}</p></div></div>
        <div class="card-body flush">
          <div class="table-wrap"><table>
            <thead><tr><th>${c.rank}</th><th>${c.product}</th><th>${c.category}</th><th>${c.sold}</th><th>${c.margin}</th><th>${c.stock}</th></tr></thead>
            <tbody>${renderTopSkus(d.topSKUs)}</tbody>
          </table></div>
        </div>
      </div>
      ${actionCards("inventory")}
      ${nextStepCard("inventory")}`;
  },

  renderSales() {
    const t = (k) => PH_I18n.t(`sales.${k}`);
    const d = PH_DATA.sales;
    const c = PH_I18n.t("common");

    document.getElementById("page-content").innerHTML = `
      ${journeyChip("sales")}
      <div class="kpi-grid">${renderKPIs(d.kpis, "sales")}</div>
      <div class="card mb-lg">
        ${this.cardInner(t("monthly.title"), t("monthly.subtitle"), '<div class="chart-container lg"><canvas id="monthlySalesChart"></canvas></div>')}
      </div>
      <div class="grid-2 equal">
        ${this.card(t("byCategory.title"), t("byCategory.subtitle"), '<div class="chart-container"><canvas id="categorySalesChart"></canvas></div>')}
        ${this.card(t("byStore.title"), t("byStore.subtitle"), '<div class="chart-container"><canvas id="storeSalesChart"></canvas></div>')}
      </div>
      <div class="grid-2-1">
        <div class="card">
          <div class="card-header"><div><h3 class="card-title">${t("topProducts.title")}</h3><p class="card-subtitle">${t("topProducts.subtitle")}</p></div></div>
          <div class="card-body flush">
            <div class="table-wrap"><table>
              <thead><tr><th>${c.product}</th><th>${c.revenue}</th><th>${c.unitsSold}</th><th>${c.growth}</th></tr></thead>
              <tbody>${renderTopProducts(d.topProducts)}</tbody>
            </table></div>
          </div>
        </div>
        ${this.card(t("team.title"), t("team.subtitle"), renderTeamPerformance(d.team))}
      </div>
      ${actionCards("sales")}
      ${nextStepCard("sales")}`;
  },

  renderLoyalty() {
    const t = (k) => PH_I18n.t(`loyalty.${k}`);
    const d = PH_DATA.loyalty;
    const c = PH_I18n.t("common");

    document.getElementById("page-content").innerHTML = `
      ${journeyChip("loyalty")}
      <div class="kpi-grid">${renderKPIs(d.kpis, "loyalty")}</div>
      <div class="tier-grid">${renderTierCards(d.tiers)}</div>
      <div class="grid-2 equal">
        ${this.card(t("pointsTrend.title"), t("pointsTrend.subtitle"), '<div class="chart-container"><canvas id="pointsTrendChart"></canvas></div>')}
        ${this.card(t("tierDist.title"), t("tierDist.subtitle"), '<div class="chart-container"><canvas id="tierChart"></canvas></div>')}
      </div>
      <div class="grid-2-1">
        <div class="card">
          <div class="card-header"><div><h3 class="card-title">${t("rewards.title")}</h3><p class="card-subtitle">${t("rewards.subtitle")}</p></div></div>
          <div class="card-body flush">
            <div class="table-wrap"><table>
              <thead><tr><th>${c.reward}</th><th>${c.points}</th><th>${c.redemptions}</th><th>${c.minTier}</th></tr></thead>
              <tbody>${renderRewardsTable(d.rewards)}</tbody>
            </table></div>
          </div>
        </div>
        ${this.card(t("engagement.title"), t("engagement.subtitle"), '<div class="chart-container"><canvas id="engagementChart"></canvas></div>')}
      </div>
      ${actionCards("loyalty")}
      ${nextStepCard("loyalty")}`;
  },

  renderGrowth() {
    const t = (k) => PH_I18n.t(`growth.${k}`);
    const d = PH_DATA.growth;
    const c = PH_I18n.t("common");

    document.getElementById("page-content").innerHTML = `
      ${journeyChip("growth")}
      <div class="kpi-grid">${renderKPIs(d.kpis, "growth")}</div>
      <div class="section-heading">
        <h3 class="card-title">${t("paths.title")}</h3>
        <p class="card-subtitle">${t("paths.subtitle")}</p>
      </div>
      <div class="path-grid">${renderPaths()}</div>
      <div class="section-heading">
        <h3 class="card-title">${t("roadmap.title")}</h3>
        <p class="card-subtitle">${t("roadmap.subtitle")}</p>
      </div>
      <div class="roadmap-grid">${renderRoadmap()}</div>
      <div class="card mb-lg">${this.cardInner(t("market.title"), t("market.subtitle"), '<div class="chart-container lg"><canvas id="marketTrendChart"></canvas></div>')}</div>
      <div class="card mb-lg">${this.cardInner(t("scenarios.title"), t("scenarios.subtitle"), `<div class="scenario-grid">${renderScenarios(d.scenarios)}</div>`)}</div>
      <div class="section-heading">
        <h3 class="card-title">${t("pipeline.title")}</h3>
        <p class="card-subtitle">${t("pipeline.subtitle")}</p>
      </div>
      <div class="opp-grid">${renderOpportunities(d.opportunities)}</div>
      <div class="grid-2 equal">
        ${this.card(t("expansionScore.title"), t("expansionScore.subtitle"), '<div class="chart-container"><canvas id="expansionChart"></canvas></div>')}
        ${this.card(t("expansionMap.title"), t("expansionMap.subtitle"), `<div class="location-grid">${renderExpansionMap(d.expansion)}</div>`, t("expansionMap.footer"))}
      </div>
      ${nextStepCard("growth")}
    `;
  },

  cardInner(title, subtitle, body) {
    return `
      <div class="card-header"><div><h3 class="card-title">${title}</h3><p class="card-subtitle">${subtitle}</p></div></div>
      <div class="card-body">${body}</div>`;
  },
};

function renderKPIs(kpis, pageKey) {
  return kpis.map((kpi, i) => {
    const meta = PH_I18n.t(`${pageKey}.kpis.${kpi.id}`);
    const trend = kpi.trendSuffix ? kpi.trend + (kpi.trendSuffix[PH_I18n.lang] || "") : kpi.trend;
    const cardClass = i === 0 ? "accent" : "";
    const trendClass = kpi.direction === "down" ? "down" : kpi.direction === "neutral" ? "neutral" : "up";
    const arrow = kpi.direction === "down" ? "↓" : kpi.direction === "neutral" ? "→" : "↑";
    return `
      <div class="kpi-card ${cardClass}">
        <p class="kpi-label">${meta.label}</p>
        <p class="kpi-value">${kpi.value}</p>
        <div class="kpi-meta">
          <span class="trend ${trendClass}">${arrow} ${trend}</span>
          <span class="kpi-subtext">${meta.subtext}</span>
        </div>
      </div>`;
  }).join("");
}

function renderInsights(items, pageKey) {
  return items.map((item) => {
    const copy = PH_I18n.t(`${pageKey}.insightItems.${item.id}`);
    return `
      <li class="insight-item">
        <div class="insight-icon ${item.type}">${item.icon}</div>
        <div class="insight-content"><h4>${copy.title}</h4><p>${copy.text}</p></div>
      </li>`;
  }).join("");
}

function renderActivity(ids, pageKey) {
  return ids.map((id) => {
    const a = PH_I18n.t(`${pageKey}.activityItems.${id}`);
    return `<tr><td>${a.time}</td><td><strong>${a.event}</strong></td><td>${a.detail}</td></tr>`;
  }).join("");
}

function renderCustomersTable(customers) {
  return customers.map((c) => {
    const tierClass = c.tier.toLowerCase();
    const lastVisit = typeof c.lastVisit === "object" ? c.lastVisit[PH_I18n.lang] : c.lastVisit;
    return `<tr>
      <td><div class="customer-cell"><span class="avatar">${c.initials}</span><strong>${c.name}</strong></div></td>
      <td>${c.city}</td>
      <td><span class="badge ${tierClass === "platinum" ? "platinum" : tierClass === "gold" ? "gold" : "primary"}">${c.tier}</span></td>
      <td><strong>${c.ltv}</strong></td>
      <td>${c.visits}</td>
      <td>${lastVisit}</td>
    </tr>`;
  }).join("");
}

function renderCityBars(cities) {
  const c = PH_I18n.t("common");
  return cities.map((city) => `
    <div class="progress-row">
      <div class="progress-header">
        <span>${PH_I18n.city(city.key)}</span>
        <span>${city.customers.toLocaleString(PH_I18n.getLocale())} ${c.customers} · ${city.pct}%</span>
      </div>
      <div class="progress-bar"><div class="progress-fill accent" style="width:${city.pct}%"></div></div>
    </div>`).join("");
}

function renderAlertsTable(alerts) {
  const c = PH_I18n.t("common");
  return alerts.map((a) => `
    <tr>
      <td><code>${a.sku}</code></td>
      <td><strong>${a.product}</strong></td>
      <td>${a.store}</td>
      <td>${a.qty}</td>
      <td>${a.daysLeft}${c.daysShort}</td>
      <td><span class="badge ${a.status === "critical" ? "danger" : "warning"}">${a.status === "critical" ? c.critical : c.warning}</span></td>
    </tr>`).join("");
}

function renderWarehouse(items) {
  const c = PH_I18n.t("common");
  return items.map((w) => `
    <div class="stat-row">
      <span class="stat-row-label"><span class="stat-dot"></span>${w.location}</span>
      <span class="stat-row-value">${w.units.toLocaleString(PH_I18n.getLocale())} ${c.units} · ${w.value}</span>
    </div>
    <div class="progress-row warehouse-progress">
      <div class="progress-bar"><div class="progress-fill" style="width:${Math.min(w.coverage * 2, 100)}%"></div></div>
      <span class="kpi-subtext">${w.coverage} ${c.coverage}</span>
    </div>`).join("");
}

function renderTopSkus(skus) {
  return skus.map((s) => `
    <tr>
      <td><strong>#${s.rank}</strong></td>
      <td>${s.product}</td>
      <td>${PH_I18n.category(s.categoryKey)}</td>
      <td>${s.sold}</td>
      <td>${s.margin}</td>
      <td>${s.stock}</td>
    </tr>`).join("");
}

function renderTopProducts(products) {
  return products.map((p) => `
    <tr>
      <td><strong>${p.product}</strong></td>
      <td>${p.revenue}</td>
      <td>${p.units.toLocaleString(PH_I18n.getLocale())}</td>
      <td><span class="trend up">↑ ${p.growth}</span></td>
    </tr>`).join("");
}

function renderTeamPerformance(team) {
  const c = PH_I18n.t("common");
  return team.map((t) => `
    <div class="progress-row">
      <div class="progress-header">
        <span><strong>${t.name}</strong> · ${t.store}</span>
        <span>${t.sales}</span>
      </div>
      <div class="progress-bar"><div class="progress-fill ${t.target >= 90 ? "accent" : ""}" style="width:${t.target}%"></div></div>
      <span class="kpi-subtext">${t.target}% ${c.ofTarget} · ${t.deals} ${c.transactions}</span>
    </div>`).join("");
}

function renderTierCards(tiers) {
  const c = PH_I18n.t("common");
  return tiers.map((t, i) => {
    const benefit = PH_I18n.t(`loyalty.tiers.${t.id}.benefit`);
    return `
      <div class="tier-card${i === 2 ? " featured" : ""}">
        <div class="tier-icon">${t.icon}</div>
        <p class="tier-name">${t.name}</p>
        <p class="tier-count">${t.count.toLocaleString(PH_I18n.getLocale())}</p>
        <p class="tier-desc">${t.pct}% ${c.membersPct} · ${benefit}</p>
      </div>`;
  }).join("");
}

function renderRewardsTable(rewards) {
  return rewards.map((r) => {
    const name = PH_I18n.t(`loyalty.rewardItems.${r.id}.name`);
    return `<tr>
      <td><strong>${name}</strong></td>
      <td>${r.points.toLocaleString(PH_I18n.getLocale())}</td>
      <td>${r.redemptions}</td>
      <td><span class="badge primary">${r.tier}</span></td>
    </tr>`;
  }).join("");
}

function renderScenarios(scenarios) {
  return scenarios.map((s, i) => {
    const name = PH_I18n.scenario(s.id);
    const desc = PH_I18n.t(`growth.scenarioItems.${s.id}.desc`);
    return `
      <div class="scenario-card${i === 1 ? " featured" : ""}">
        <h4>${name}${i === 1 ? " ★" : ""}</h4>
        <p class="scenario-value">${s.revenue}</p>
        <p><span class="trend up">↑ ${s.growth}</span></p>
        <p class="scenario-desc">${desc}</p>
      </div>`;
  }).join("");
}

function renderOpportunities(opps) {
  const c = PH_I18n.t("common");
  const priorityLabel = { high: c.high, medium: c.medium, low: c.low };
  const priorityBadge = { high: "success", medium: "warning", low: "info" };
  return opps.map((o) => {
    const copy = PH_I18n.t(`growth.oppItems.${o.id}`);
    return `
      <div class="opp-card ${o.priority}">
        <div class="opp-header">
          <span class="opp-title">${copy.title}</span>
          <span class="badge ${priorityBadge[o.priority]}">${priorityLabel[o.priority]}</span>
        </div>
        <p class="opp-impact">${copy.desc}</p>
        <div class="opp-metrics">
          <div><strong>${o.impact}</strong>${c.impact}</div>
          <div><strong>${o.confidence}%</strong>${c.confidence}</div>
          <div><strong>${o.timeline}</strong>${c.timeline}</div>
        </div>
      </div>`;
  }).join("");
}

function renderPaths() {
  const icons = ["🎾", "💚", "📦"];
  return icons.map((icon, i) => {
    const p = PH_I18n.t(`growth.paths.p${i + 1}`);
    return `
      <div class="path-card">
        <span class="path-icon">${icon}</span>
        <h4>${p.title}</h4>
        <p>${p.desc}</p>
      </div>`;
  }).join("");
}

function renderRoadmap() {
  return ["now", "next", "future"].map((stage, i) => {
    const s = PH_I18n.t(`growth.roadmap.${stage}`);
    const items = s.items.map((item) => `<li>${item}</li>`).join("");
    return `
      <div class="roadmap-col${i === 0 ? " active" : ""}">
        <span class="roadmap-tag">${s.tag}</span>
        <h4>${s.title}</h4>
        <ul>${items}</ul>
      </div>`;
  }).join("");
}

function renderExpansionMap(items) {
  const c = PH_I18n.t("common");
  return items.map((e) => `
    <div class="location-pill">
      <strong>${e.city}</strong>
      <span>${e.clubs} ${c.clubs} · ${e.population}</span>
      <span class="badge ${e.score >= 80 ? "success" : "primary"}">${c.score} ${e.score} · ${PH_I18n.expansionStatus(e.statusKey)}</span>
    </div>`).join("");
}

function PH_refreshPage() {
  const page = document.body.dataset.page;
  if (!page) return;
  updatePageMeta(page);
  PH_PAGES.render(page);
  if (typeof PH_CHARTS !== "undefined") {
    PH_CHARTS.destroyAll();
    PH_CHARTS.init(page);
  }
}

function updatePageMeta(page) {
  const meta = PH_I18n.t(`meta.${page}`);
  document.title = `${meta.title} | Padel House`;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.content = meta.description;
}

function PH_onLanguageChange() {
  const page = document.body.dataset.page;
  if (!page) return;
  initApp(page);
  PH_refreshPage();
}
