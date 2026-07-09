/**
 * Padel House: shared app utilities
 */

const PH_RELEASE_VERSION = "1.2.0";

const PH_NAV = [
  { id: "executive", href: "index.html", icon: "📊" },
  { id: "customers", href: "customer-insights.html", icon: "👥" },
  { id: "inventory", href: "inventory-intelligence.html", icon: "📦" },
  { id: "sales", href: "sales-performance.html", icon: "💰" },
  { id: "loyalty", href: "loyalty-program.html", icon: "🏆" },
  { id: "growth", href: "growth-opportunities.html", icon: "🚀" },
];

const PH_NAV_EXP = [
  { id: "products", href: "product-hub.html", icon: "🛍️" },
  { id: "experience", href: "experience-center.html", icon: "✨" },
];

function renderLangToggle() {
  const lang = PH_I18n.lang;
  return `
    <div class="lang-toggle" role="group" aria-label="Language">
      <button type="button" class="lang-btn${lang === "es" ? " active" : ""}" data-lang="es">ES</button>
      <button type="button" class="lang-btn${lang === "en" ? " active" : ""}" data-lang="en">EN</button>
    </div>`;
}

function renderNavItems(items, activePage) {
  return items.map(
    (item) => `
      <li class="nav-item${item.id === activePage ? " active" : ""}">
        <a href="${item.href}">
          <span class="nav-icon">${item.icon}</span>
          ${PH_I18n.t(`nav.${item.id}`)}
        </a>
      </li>`
  ).join("");
}

function renderSidebar(activePage) {
  const navItems = renderNavItems(PH_NAV, activePage);
  const expItems = renderNavItems(PH_NAV_EXP, activePage);

  const country = PH_DATA.company.country[PH_I18n.lang];

  return `
    <aside class="sidebar" id="sidebar">
      <div class="brand">
        <a href="index.html" class="brand-link">
          <div class="brand-icon">🎾</div>
          <div class="brand-text">
            <span class="brand-name">Padel House</span>
            <span class="brand-tagline">${PH_I18n.t("brand.tagline")}</span>
          </div>
        </a>
      </div>
      <nav class="nav-section">
        <p class="nav-label">${PH_I18n.t("nav.modules")}</p>
        <ul class="nav-list">${navItems}</ul>
        <p class="nav-label nav-label-gap">${PH_I18n.t("nav.experienceGroup")}</p>
        <ul class="nav-list">${expItems}</ul>
      </nav>
      <div class="sidebar-footer">
        <div class="sidebar-lang">${renderLangToggle()}</div>
        <strong>${PH_I18n.t("brand.demoEnv")}</strong>
        ${PH_I18n.t("brand.mockData")} · ${country}
        <span class="release-version" title="Release">v${PH_RELEASE_VERSION}</span>
      </div>
    </aside>
    <div class="sidebar-overlay" id="sidebarOverlay"></div>`;
}

function renderHeader(pageKey) {
  const now = new Date();
  const dateStr = now.toLocaleDateString(PH_I18n.getLocale(), {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
    <header class="page-header">
      <div class="header-left">
        <button class="menu-toggle" id="menuToggle" aria-label="${PH_I18n.t("common.toggleMenu")}">☰</button>
        <div class="page-title-group">
          <h1>${PH_I18n.t(`${pageKey}.title`)}</h1>
          <p>${PH_I18n.t(`${pageKey}.subtitle`)}</p>
        </div>
      </div>
      <div class="header-right">
        <span class="header-date">${dateStr}</span>
        ${renderLangToggle()}
        <span class="header-badge">
          <span class="dot"></span>
          ${PH_I18n.t("common.liveDemo")}
        </span>
      </div>
    </header>`;
}

function initApp(activePage) {
  if (!document.querySelector(".app-shell")) return;

  const sidebarSlot = document.getElementById("sidebar-slot");
  if (sidebarSlot) sidebarSlot.innerHTML = renderSidebar(activePage);

  const headerSlot = document.getElementById("header-slot");
  if (headerSlot) headerSlot.innerHTML = renderHeader(activePage);

  updatePageMeta(activePage);
  initMobileNav();
  initLangToggle();
}

function initLangToggle() {
  if (initLangToggle.bound) return;
  initLangToggle.bound = true;
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".lang-btn");
    if (!btn) return;
    const lang = btn.dataset.lang;
    if (lang && lang !== PH_I18n.lang) PH_I18n.setLang(lang);
  });
}
initLangToggle.bound = false;

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
      return;
    }

    if (e.target.id === "sidebarOverlay") {
      sidebar.classList.remove("open");
      overlay.classList.remove("visible");
      return;
    }

    if (e.target.closest(".nav-item a")) {
      sidebar.classList.remove("open");
      overlay.classList.remove("visible");
    }
  });
}
initMobileNav.bound = false;

function formatCurrency(value) {
  if (value >= 1000000) return `RD$ ${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `RD$ ${(value / 1000).toFixed(0)}K`;
  return `RD$ ${value.toLocaleString(PH_I18n.getLocale())}`;
}

function categoryLabels(keys) {
  return keys.map((k) => PH_I18n.category(k));
}

function bootstrapApp() {
  const page = document.body.dataset.page;
  if (!page) return;
  console.info(`Padel House Digital Experience v${PH_RELEASE_VERSION}`);
  try {
    initApp(page);
    PH_PAGES.render(page);
    if (typeof PH_CHARTS !== "undefined") PH_CHARTS.init(page);
  } catch (err) {
    console.error("[Padel House] Bootstrap failed, resetting demo storage.", err);
    if (typeof PH_HUB_OPS !== "undefined") PH_HUB_OPS.clearInvalidState();
    if (typeof PH_POS_OPS !== "undefined") PH_POS_OPS.clearInvalidState();
    initApp(page);
    PH_PAGES.render(page);
    if (typeof PH_CHARTS !== "undefined") PH_CHARTS.init(page);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (typeof PH_ACCESS !== "undefined") {
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      bootstrapApp();
    };
    document.addEventListener("ph-access-granted", start, { once: true });
    if (PH_ACCESS.isSessionValid()) start();
    return;
  }
  bootstrapApp();
});
