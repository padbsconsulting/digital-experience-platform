const PADBS_RELEASE_VERSION = "1.0.0";

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}

function money(value) {
  if (value >= 1000000) return `RD$ ${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `RD$ ${(value / 1000).toFixed(0)}K`;
  return `RD$ ${Number(value).toLocaleString(PADBS_I18n.getLocale())}`;
}

function renderLangToggle() {
  const lang = PADBS_I18n.lang;
  return `<div class="lang-toggle" role="group" aria-label="Language">
    <button type="button" class="lang-btn${lang === "es" ? " active" : ""}" data-lang="es">ES</button>
    <button type="button" class="lang-btn${lang === "en" ? " active" : ""}" data-lang="en">EN</button>
  </div>`;
}

function pageHref(page) {
  return page.href || `${page.id}.html`;
}

function renderSidebar(activePage) {
  const pages = PADBS_THEME.pages.map((page) => `<li class="nav-item${page.id === activePage ? " active" : ""}">
    <a href="${pageHref(page)}"><span class="nav-icon">${page.icon}</span>${PADBS_I18n.t(`nav.${page.id}`)}</a>
  </li>`).join("");

  return `<aside class="sidebar" id="sidebar">
    <div class="brand">
      <a href="index.html" class="brand-link">
        <div class="brand-icon">${PADBS_THEME.brand.icon}</div>
        <div class="brand-text">
          <span class="brand-name">${PADBS_THEME.brand.name}</span>
          <span class="brand-tagline">${PADBS_I18n.t("brand.tagline")}</span>
        </div>
      </a>
    </div>
    <nav class="nav-section">
      <p class="nav-label">${PADBS_I18n.t("nav.modules")}</p>
      <ul class="nav-list">${pages}</ul>
    </nav>
    <div class="sidebar-footer">
      <div class="sidebar-lang">${renderLangToggle()}</div>
      <strong>${PADBS_I18n.t("brand.demoEnv")}</strong>
      ${PADBS_I18n.t("brand.mockData")}
      <span class="release-version">v${PADBS_RELEASE_VERSION}</span>
    </div>
  </aside><div class="sidebar-overlay" id="sidebarOverlay"></div>`;
}

function renderHeader(pageKey) {
  const now = new Date();
  const dateStr = now.toLocaleDateString(PADBS_I18n.getLocale(), { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  return `<header class="page-header">
    <div class="header-left">
      <button class="menu-toggle" id="menuToggle" aria-label="${PADBS_I18n.t("common.toggleMenu")}">☰</button>
      <div class="page-title-group"><h1>${PADBS_I18n.t(`${pageKey}.title`)}</h1><p>${PADBS_I18n.t(`${pageKey}.subtitle`)}</p></div>
    </div>
    <div class="header-right">
      <span class="header-date">${dateStr}</span>
      ${renderLangToggle()}
      <span class="header-badge"><span class="dot"></span>${PADBS_I18n.t("common.liveDemo")}</span>
    </div>
  </header>`;
}

function card(title, subtitle, body, footer = "") {
  return `<section class="card">
    <div class="card-header"><div><h3 class="card-title">${title}</h3>${subtitle ? `<p class="card-subtitle">${subtitle}</p>` : ""}</div></div>
    <div class="card-body">${body}</div>
    ${footer ? `<div class="card-footer">${footer}</div>` : ""}
  </section>`;
}

function journeyChip(page) {
  const order = PADBS_THEME.journey;
  const idx = order.indexOf(page);
  const j = PADBS_I18n.t("common.journey");
  if (idx < 0) return "";
  return `<div class="journey-chip">
    <span class="journey-step">${j.step} ${idx + 1} ${j.of} ${order.length}</span>
    <span class="journey-question">${PADBS_I18n.t(`${page}.question`)}</span>
  </div>`;
}

function nextStepCard(page) {
  const order = PADBS_THEME.journey;
  const idx = order.indexOf(page);
  if (idx < 0 || idx === order.length - 1) return "";
  const nextId = order[idx + 1];
  const next = PADBS_THEME.pages.find((item) => item.id === nextId);
  return `<a class="next-step" href="${pageHref(next)}">
    <div><span class="next-step-label">${PADBS_I18n.t("common.journey.nextLabel")}</span>
    <h3>${PADBS_I18n.t(`${nextId}.question`)}</h3><p>${PADBS_I18n.t(`nav.${nextId}`)}</p></div>
    <span class="next-step-arrow">→</span>
  </a>`;
}

function kpis(page) {
  return `<div class="kpi-grid">${PADBS_THEME.data[page].kpis.map((kpi, i) => {
    const meta = PADBS_I18n.t(`${page}.kpis.${kpi.id}`);
    const trendClass = kpi.direction === "down" ? "down" : kpi.direction === "neutral" ? "neutral" : "up";
    const arrow = kpi.direction === "down" ? "↓" : kpi.direction === "neutral" ? "→" : "↑";
    return `<div class="kpi-card ${i === 0 ? "accent" : ""}">
      <p class="kpi-label">${meta.label}</p><p class="kpi-value">${kpi.value}</p>
      <div class="kpi-meta"><span class="trend ${trendClass}">${arrow} ${kpi.trend}</span><span class="kpi-subtext">${meta.subtext}</span></div>
    </div>`;
  }).join("")}</div>`;
}

function insightList(items, path) {
  return `<ul class="insight-list">${items.map((item) => {
    const copy = PADBS_I18n.t(`${path}.${item.id}`);
    return `<li class="insight-item"><span class="insight-icon ${item.type}">${item.icon}</span><span><strong>${copy.title}</strong><p>${copy.text}</p></span></li>`;
  }).join("")}</ul>`;
}

function table(headers, rows) {
  return `<div class="table-wrap"><table><thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.join("")}</tbody></table></div>`;
}

function progressRows(items) {
  return items.map((item) => `<div class="progress-row">
    <div class="progress-header"><span>${item.label}</span><span>${item.value}</span></div>
    <div class="progress-bar"><div class="progress-fill ${item.accent ? "accent" : ""}" style="width:${item.percent}%"></div></div>
    ${item.note ? `<span class="kpi-subtext">${item.note}</span>` : ""}
  </div>`).join("");
}

function renderExecutive() {
  const d = PADBS_THEME.data.executive;
  const t = (k) => PADBS_I18n.t(`executive.${k}`);
  return `<section class="demo-banner">
    <div><h2>${t("bannerTitle")}</h2><p>${t("bannerText")}</p><a class="banner-cta" href="inventory.html">${t("bannerCta")} →</a></div>
    <span class="demo-banner-tag">${PADBS_I18n.t("common.demoCommercial")}</span>
  </section>
  ${journeyChip("executive")}
  ${kpis("executive")}
  <div class="grid-2">${card(t("salesTrend.title"), t("salesTrend.subtitle"), '<div class="chart-container"><canvas id="salesTrendChart"></canvas></div>')}${card(t("operatingMix.title"), t("operatingMix.subtitle"), '<div class="chart-container"><canvas id="operatingMixChart"></canvas></div>')}</div>
  <div class="grid-2 equal">${card(t("branchPerf.title"), t("branchPerf.subtitle"), '<div class="chart-container"><canvas id="branchPerfChart"></canvas></div>')}${card(t("insights.title"), t("insights.subtitle"), insightList(d.insights, "executive.insightItems"))}</div>
  ${card(t("activity.title"), t("activity.subtitle"), table([PADBS_I18n.t("common.time"), PADBS_I18n.t("common.event"), PADBS_I18n.t("common.detail")], d.activity.map((a) => `<tr><td>${PADBS_I18n.text(a.time)}</td><td><strong>${PADBS_I18n.text(a.event)}</strong></td><td>${PADBS_I18n.text(a.detail)}</td></tr>`)))}
  ${nextStepCard("executive")}`;
}

function renderInventory() {
  const d = PADBS_THEME.data.inventory;
  const t = (k) => PADBS_I18n.t(`inventory.${k}`);
  return `${journeyChip("inventory")}${kpis("inventory")}
  <div class="grid-2 equal">${card(t("stockByCat.title"), t("stockByCat.subtitle"), '<div class="chart-container"><canvas id="stockByCategoryChart"></canvas></div>')}${card(t("turnover.title"), t("turnover.subtitle"), '<div class="chart-container"><canvas id="turnoverChart"></canvas></div>')}</div>
  <div class="grid-2-1">${card(t("alerts.title"), t("alerts.subtitle"), table(["SKU", PADBS_I18n.t("common.product"), PADBS_I18n.t("common.branch"), PADBS_I18n.t("common.qty"), PADBS_I18n.t("common.status")], d.alerts.map((a) => `<tr><td><code>${a.sku}</code></td><td><strong>${a.product}</strong></td><td>${a.branch}</td><td>${a.qty}</td><td><span class="badge ${a.status === "critical" ? "danger" : "warning"}">${PADBS_I18n.text(a.label)}</span></td></tr>`)))}${card(t("branches.title"), t("branches.subtitle"), progressRows(d.branches.map((b) => ({ label: b.name, value: `${b.units.toLocaleString(PADBS_I18n.getLocale())} u · ${b.value}`, percent: b.coverage * 2, note: `${b.coverage} ${PADBS_I18n.t("common.coverage")}`, accent: b.coverage < 24 }))))}</div>
  ${card(t("topSkus.title"), t("topSkus.subtitle"), table([PADBS_I18n.t("common.rank"), PADBS_I18n.t("common.product"), PADBS_I18n.t("common.category"), PADBS_I18n.t("common.sold"), PADBS_I18n.t("common.margin"), PADBS_I18n.t("common.stock")], d.topSkus.map((s) => `<tr><td><strong>#${s.rank}</strong></td><td>${s.product}</td><td>${PADBS_I18n.text(s.category)}</td><td>${s.sold}</td><td>${s.margin}</td><td>${s.stock}</td></tr>`)))}
  ${actionCards("inventory")}${nextStepCard("inventory")}`;
}

function renderGenericOperational(page) {
  const d = PADBS_THEME.data[page];
  const t = (k) => PADBS_I18n.t(`${page}.${k}`);
  return `${journeyChip(page)}${kpis(page)}
  <div class="grid-2 equal">${card(t("primary.title"), t("primary.subtitle"), `<div class="chart-container"><canvas id="${page}PrimaryChart"></canvas></div>`)}${card(t("secondary.title"), t("secondary.subtitle"), insightList(d.insights, `${page}.insightItems`))}</div>
  ${card(t("table.title"), t("table.subtitle"), table(d.table.headers[PADBS_I18n.lang], d.table.rows.map((row) => `<tr>${row.map((cell, i) => `<td>${i === 0 ? `<strong>${PADBS_I18n.text(cell)}</strong>` : PADBS_I18n.text(cell)}</td>`).join("")}</tr>`)))}
  ${card(t("coordination.title"), t("coordination.subtitle"), progressRows(d.progress.map((p) => ({ label: PADBS_I18n.text(p.label), value: PADBS_I18n.text(p.value), percent: p.percent, note: PADBS_I18n.text(p.note), accent: p.accent }))))}
  ${actionCards(page)}${nextStepCard(page)}`;
}

function actionCards(page) {
  const actions = PADBS_I18n.t(`${page}.actions`);
  if (!Array.isArray(actions)) return "";
  return `<section class="section-heading"><h3 class="card-title">${PADBS_I18n.t("common.journey.actionsTitle")}</h3><p class="card-subtitle">${PADBS_I18n.t("common.journey.actionsSubtitle")}</p></section>
  <div class="action-grid">${actions.map((a, i) => `<article class="action-card"><span class="action-icon">${PADBS_THEME.actionIcons[page]?.[i] || "•"}</span><h4>${a.title}</h4><p>${a.desc}</p></article>`).join("")}</div>`;
}

function renderLaunch() {
  const d = PADBS_THEME.data.launch;
  const t = (k) => PADBS_I18n.t(`launch.${k}`);
  return `${journeyChip("launch")}${kpis("launch")}
  <section class="commercial-impact"><p class="commercial-kicker">${t("impact.kicker")}</p><h3 class="card-title">${t("impact.title")}</h3><p class="card-subtitle">${t("impact.subtitle")}</p><div class="impact-grid">${d.impact.map((item, i) => `<article class="impact-card"><span class="impact-rank">${String(i + 1).padStart(2, "0")}</span><h4>${PADBS_I18n.text(item.title)}</h4><p>${PADBS_I18n.text(item.text)}</p><span class="impact-signal">${PADBS_I18n.text(item.signal)}</span></article>`).join("")}</div></section>
  <section class="commercial-roadmap"><p class="commercial-kicker">${t("roadmap.kicker")}</p><h3 class="card-title">${t("roadmap.title")}</h3><p class="card-subtitle">${t("roadmap.subtitle")}</p><div class="roadmap-phase-stack">${d.roadmap.map((phase) => `<article class="roadmap-phase"><span class="roadmap-phase-tag">${PADBS_I18n.text(phase.tag)}</span><h4>${PADBS_I18n.text(phase.title)}</h4><p>${PADBS_I18n.text(phase.desc)}</p><span class="roadmap-phase-duration">${PADBS_I18n.text(phase.duration)}</span></article>`).join("")}</div></section>
  <section class="commercial-roi"><p class="commercial-kicker">${t("roi.kicker")}</p><h3 class="card-title">${t("roi.title")}</h3><p class="card-subtitle">${t("roi.subtitle")}</p><div class="roi-grid">${d.roi.map((item) => `<article class="roi-card"><p class="roi-prompt">${PADBS_I18n.text(item.prompt)}</p><p class="roi-range">${PADBS_I18n.text(item.range)}</p><p class="roi-note">${PADBS_I18n.text(item.note)}</p></article>`).join("")}</div></section>
  <section class="commercial-cta"><p class="commercial-kicker">${t("cta.kicker")}</p><h3 class="card-title">${t("cta.title")}</h3><p class="card-subtitle">${t("cta.subtitle")}</p><a class="commercial-cta-btn" href="${PADBS_THEME.contactHref}">${t("cta.button")}</a><p class="commercial-cta-note">${t("cta.note")}</p></section>`;
}

const PADBS_PAGES = {
  executive: renderExecutive,
  inventory: renderInventory,
  quotes: () => renderGenericOperational("quotes"),
  credit: () => renderGenericOperational("credit"),
  suppliers: () => renderGenericOperational("suppliers"),
  dispatch: () => renderGenericOperational("dispatch"),
  launch: renderLaunch,
};

function updatePageMeta(page) {
  const meta = PADBS_I18n.t(`meta.${page}`);
  document.title = `${meta.title} | ${PADBS_THEME.brand.name}`;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.content = meta.description;
}

function initMobileNav() {
  if (initMobileNav.bound) return;
  initMobileNav.bound = true;
  document.addEventListener("click", (e) => {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");
    if (!sidebar || !overlay) return;
    if (e.target.closest("#menuToggle")) {
      sidebar.classList.toggle("open");
      overlay.classList.toggle("visible");
    } else if (e.target.id === "sidebarOverlay" || e.target.closest(".nav-item a")) {
      sidebar.classList.remove("open");
      overlay.classList.remove("visible");
    }
  });
}
initMobileNav.bound = false;

function initLangToggle() {
  if (initLangToggle.bound) return;
  initLangToggle.bound = true;
  document.addEventListener("click", (e) => {
    const lang = e.target.closest(".lang-btn")?.dataset.lang;
    if (lang) PADBS_I18n.setLang(lang);
  });
}
initLangToggle.bound = false;

function bootstrapApp() {
  const page = document.body.dataset.page;
  document.getElementById("sidebar-slot").innerHTML = renderSidebar(page);
  document.getElementById("header-slot").innerHTML = renderHeader(page);
  updatePageMeta(page);
  initMobileNav();
  initLangToggle();
  document.getElementById("page-content").innerHTML = PADBS_PAGES[page]();
  if (typeof PADBS_CHARTS !== "undefined") PADBS_CHARTS.init(page);
}

function PADBS_onLanguageChange() {
  if (typeof PADBS_CHARTS !== "undefined") PADBS_CHARTS.destroyAll();
  bootstrapApp();
}

document.addEventListener("DOMContentLoaded", () => {
  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    bootstrapApp();
  };
  document.addEventListener("padbs-access-granted", start, { once: true });
  if (PADBS_ACCESS.isSessionValid()) start();
});
