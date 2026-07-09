/**
 * Padel House: Product Hub and Experience Center (Sprint 3)
 * Fully client-side simulation. Nothing is persisted.
 */

function PH_fmt(n) {
  return `RD$ ${n.toLocaleString(PH_I18n.getLocale())}`;
}

function PH_product(id) {
  const catalog = typeof PH_HUB_OPS !== "undefined" ? PH_HUB_OPS.getCatalog() : PH_DATA.products;
  return catalog.find((p) => p.id === id);
}

function PH_catalog() {
  return typeof PH_HUB_OPS !== "undefined" ? PH_HUB_OPS.getCatalog() : PH_DATA.products;
}

function expChip(page) {
  const phase = PH_I18n.t("common.journey.phases.future");
  return `
    <div class="journey-chip journey-chip-future">
      <span class="journey-step exp">${phase}</span>
      <span class="journey-question">${PH_I18n.t(`${page}.question`)}</span>
    </div>`;
}

function productTags(p) {
  return Array.isArray(p.tags) ? p.tags : [];
}

function productBadges(p, t) {
  const badges = [];
  const tags = productTags(p);
  if (tags.includes("new")) badges.push(`<span class="p-badge new">${t.badges.new}</span>`);
  if (tags.includes("bestseller")) badges.push(`<span class="p-badge best">${t.badges.bestseller}</span>`);
  if (tags.includes("featured")) badges.push(`<span class="p-badge feat">${t.badges.featured}</span>`);
  if (p.health === "low") badges.push(`<span class="p-badge low">${t.badges.low}</span>`);
  if (p.health === "critical") badges.push(`<span class="p-badge crit">${t.badges.critical}</span>`);
  return badges.join("");
}

function stockBar(p, t) {
  const pct = Math.min(Math.round((p.stock / 50) * 100), 100);
  return `
    <div class="p-stock">
      <div class="p-stock-bar"><div class="p-stock-fill ${p.health}" style="width:${pct}%"></div></div>
      <span>${p.stock} ${t.stockLabel}</span>
    </div>`;
}

/* ---------- Product Hub ---------- */

const PH_HUB = { filter: "all" };

function hubGridHTML() {
  const t = PH_I18n.t("products");
  const items = PH_catalog().filter(
    (p) => PH_HUB.filter === "all" || p.categoryKey === PH_HUB.filter
  );
  return items.map((p, i) => `
    <div class="product-card" style="animation-delay:${i * 40}ms">
      <div class="p-visual">${p.icon}<div class="p-badges">${productBadges(p, t)}</div></div>
      <div class="p-info">
        <span class="p-category">${PH_I18n.category(p.categoryKey)}</span>
        <h4>${p.name}</h4>
        <p class="p-price">${PH_fmt(p.price)}</p>
        ${stockBar(p, t)}
      </div>
    </div>`).join("");
}

function hubFiltersHTML() {
  const t = PH_I18n.t("products");
  const cats = ["all", "rackets", "footwear", "apparel", "balls", "accessories", "protection"];
  return cats.map((c) => `
    <button type="button" class="hub-filter${PH_HUB.filter === c ? " active" : ""}" data-filter="${c}">
      ${c === "all" ? t.allFilter : PH_I18n.category(c)}
    </button>`).join("");
}

function hubFeaturedHTML() {
  const t = PH_I18n.t("products");
  return PH_catalog().filter((p) => productTags(p).includes("featured")).map((p) => `
    <div class="featured-card">
      <div class="featured-visual">${p.icon}</div>
      <div>
        <span class="p-category light">${PH_I18n.category(p.categoryKey)}</span>
        <h4>${p.name}</h4>
        <p class="featured-price">${PH_fmt(p.price)}</p>
      </div>
    </div>`).join("");
}

function hubPairsHTML() {
  const t = PH_I18n.t("products");
  const pairs = [
    ["p1", "p10"],
    ["p5", "p9"],
    ["p2", "p12"],
  ];
  return pairs.map(([aId, bId]) => {
    const a = PH_product(aId);
    const b = PH_product(bId);
    if (!a || !b) return "";
    return `
      <div class="pair-card">
        <span class="pair-item">${a.icon} ${a.name}</span>
        <span class="pair-plus">+</span>
        <span class="pair-item">${b.icon} ${b.name}</span>
        <span class="pair-total">${PH_fmt(a.price + b.price)}</span>
      </div>`;
  }).join("");
}

PH_PAGES.renderProducts = function () {
  const t = PH_I18n.t("products");
  const d = PH_catalog();
  const low = d.filter((p) => p.health !== "good").length;
  const critical = d.filter((p) => p.health === "critical").length;
  const healthyPct = Math.round(((d.length - low) / d.length) * 100);

  document.getElementById("page-content").innerHTML = `
    ${expChip("products")}
    ${typeof PH_HUB_OPS !== "undefined" ? PH_HUB_OPS.panelHTML() : ""}
    <div class="health-strip">
      <div class="health-pill good"><strong>${healthyPct}%</strong>${t.health.healthy}</div>
      <div class="health-pill warn"><strong>${low}</strong>${t.health.lowStock}</div>
      <div class="health-pill crit"><strong>${critical}</strong>${t.health.reorder}</div>
    </div>
    <div class="section-heading">
      <h3 class="card-title">${t.featuredTitle}</h3>
      <p class="card-subtitle">${t.featuredSubtitle}</p>
    </div>
    <div class="featured-row">${hubFeaturedHTML()}</div>
    <div class="section-heading">
      <h3 class="card-title">${t.catalogTitle}</h3>
      <p class="card-subtitle">${t.catalogSubtitle}</p>
    </div>
    <div class="hub-filters" id="hub-filters">${hubFiltersHTML()}</div>
    <div class="product-grid" id="hub-grid">${hubGridHTML()}</div>
    ${typeof PH_HUB_OPS !== "undefined" ? PH_HUB_OPS.timelineHTML() : ""}
    <div class="section-heading">
      <h3 class="card-title">${t.pairsTitle}</h3>
      <p class="card-subtitle">${t.pairsSubtitle}</p>
    </div>
    <div class="pair-grid">${hubPairsHTML()}</div>
    <a class="next-step" href="experience-center.html">
      <div>
        <span class="next-step-label">${t.ctaTitle}</span>
        <h3>${t.ctaText}</h3>
        <p>${t.ctaButton}</p>
      </div>
      <span class="next-step-arrow">→</span>
    </a>`;

  initHubEvents();
};

function initHubEvents() {
  if (initHubEvents.bound) return;
  initHubEvents.bound = true;
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".hub-filter");
    if (!btn) return;
    PH_HUB.filter = btn.dataset.filter;
    const filters = document.getElementById("hub-filters");
    const grid = document.getElementById("hub-grid");
    if (filters) filters.innerHTML = hubFiltersHTML();
    if (grid) grid.innerHTML = hubGridHTML();
  });
}
initHubEvents.bound = false;

/* ---------- Experience Center (POS simulation) ---------- */

const PH_POS = {
  customerId: "walkin",
  cart: [],
  discountPct: 0,
  payment: "card",
  receipt: false,
  search: "",
};

function posCustomer() {
  return PH_DATA.posCustomers.find((c) => c.id === PH_POS.customerId);
}

function posTotals() {
  const cust = posCustomer();
  let subtotal = 0;
  let benefit = 0;
  PH_POS.cart.forEach((line) => {
    const p = PH_product(line.id);
    if (!p) return;
    const lineTotal = p.price * line.qty;
    subtotal += lineTotal;
    if (cust.benefitPct && (p.categoryKey === "accessories" || p.categoryKey === "protection")) {
      benefit += Math.round(lineTotal * (cust.benefitPct / 100));
    }
  });
  const discount = Math.round((subtotal - benefit) * (PH_POS.discountPct / 100));
  const base = subtotal - benefit - discount;
  const tax = Math.round(base * 0.18);
  const total = base + tax;
  const points = Math.floor(total / 200);
  return { subtotal, benefit, discount, tax, total, points };
}

function posProductsHTML() {
  const t = PH_I18n.t("experience");
  const q = PH_POS.search.trim().toLowerCase();
  const items = PH_catalog().filter((p) => {
    if (!q) return true;
    return p.name.toLowerCase().includes(q) || PH_I18n.category(p.categoryKey).toLowerCase().includes(q);
  });
  if (!items.length) return `<p class="pos-empty">${t.noResults}</p>`;
  return items.map((p) => `
    <div class="pos-product">
      <span class="pos-p-icon">${p.icon}</span>
      <div class="pos-p-info">
        <strong>${p.name}</strong>
        <span>${PH_I18n.category(p.categoryKey)} · ${PH_fmt(p.price)}</span>
      </div>
      <button type="button" class="pos-add" data-action="pos-add" data-id="${p.id}">+ ${t.add}</button>
    </div>`).join("");
}

function posCustomersHTML() {
  const t = PH_I18n.t("experience");
  return PH_DATA.posCustomers.map((c) => {
    const name = c.id === "walkin" ? t.walkin : c.name;
    const tier = c.tier ? `<span class="pos-tier ${c.tier.toLowerCase()}">${c.tier} · -${c.benefitPct}%</span>` : "";
    return `
      <button type="button" class="pos-customer${PH_POS.customerId === c.id ? " active" : ""}" data-action="pos-customer" data-id="${c.id}">
        <span class="avatar">${c.initials}</span>
        <span class="pos-cust-name">${name}</span>
        ${tier}
      </button>`;
  }).join("");
}

function posSuggestedHTML() {
  const t = PH_I18n.t("experience");
  if (!PH_POS.cart.length) return "";
  const inCart = new Set(PH_POS.cart.map((l) => l.id));
  const suggested = [];
  PH_POS.cart.forEach((line) => {
    const p = PH_product(line.id);
    if (!p) return;
    (p.pairsWith || []).forEach((id) => {
      if (!inCart.has(id) && !suggested.includes(id)) suggested.push(id);
    });
  });
  if (!suggested.length) return "";
  const chips = suggested.slice(0, 3).map((id) => {
    const p = PH_product(id);
    if (!p) return "";
    return `
      <button type="button" class="pos-suggest" data-action="pos-add" data-id="${p.id}">
        ${p.icon} ${p.name} · ${PH_fmt(p.price)}
      </button>`;
  }).join("");
  return `<p class="pos-suggest-label">${t.suggestedTitle}</p><div class="pos-suggest-row">${chips}</div>`;
}

function posCartHTML() {
  const t = PH_I18n.t("experience");
  const totals = posTotals();

  if (PH_POS.receipt) return posReceiptHTML(totals);

  const lines = PH_POS.cart.length
    ? PH_POS.cart.map((line) => {
        const p = PH_product(line.id);
        return `
          <div class="cart-line">
            <span class="cart-icon">${p.icon}</span>
            <div class="cart-info">
              <strong>${p.name}</strong>
              <span>${PH_fmt(p.price)}</span>
            </div>
            <div class="cart-qty">
              <button type="button" data-action="pos-dec" data-id="${p.id}">-</button>
              <span>${line.qty}</span>
              <button type="button" data-action="pos-inc" data-id="${p.id}">+</button>
            </div>
            <span class="cart-line-total">${PH_fmt(p.price * line.qty)}</span>
          </div>`;
      }).join("")
    : `<p class="pos-empty">${t.emptyCart}</p>`;

  const discountOpts = [0, 5, 10, 15].map(
    (pct) => `<option value="${pct}"${PH_POS.discountPct === pct ? " selected" : ""}>${pct === 0 ? t.noDiscount : `-${pct}%`}</option>`
  ).join("");

  const payments = ["cash", "card", "transfer"].map((m) => {
    const icons = { cash: "💵", card: "💳", transfer: "🏦" };
    return `
      <button type="button" class="pos-pay${PH_POS.payment === m ? " active" : ""}" data-action="pos-payment" data-id="${m}">
        ${icons[m]} ${t.payments[m]}
      </button>`;
  }).join("");

  const itemCount = PH_POS.cart.reduce((sum, l) => sum + l.qty, 0);

  return `
    <div class="cart-header">
      <h3>${t.cartTitle}</h3>
      <span class="cart-count">${itemCount} ${t.itemsLabel}</span>
    </div>
    <div class="cart-lines">${lines}</div>
    ${posSuggestedHTML()}
    <div class="cart-controls">
      <label class="cart-control">
        <span>${t.discountLabel}</span>
        <select data-action="pos-discount">${discountOpts}</select>
      </label>
      <div class="cart-control">
        <span>${t.paymentLabel}</span>
        <div class="pos-pay-row">${payments}</div>
      </div>
    </div>
    <div class="cart-totals">
      <div class="total-row"><span>${t.subtotal}</span><span>${PH_fmt(totals.subtotal)}</span></div>
      ${totals.benefit ? `<div class="total-row benefit"><span>${t.benefitLine}</span><span>-${PH_fmt(totals.benefit)}</span></div>` : ""}
      ${totals.discount ? `<div class="total-row benefit"><span>${t.discountLine} (-${PH_POS.discountPct}%)</span><span>-${PH_fmt(totals.discount)}</span></div>` : ""}
      <div class="total-row"><span>${t.taxLine}</span><span>${PH_fmt(totals.tax)}</span></div>
      <div class="total-row grand"><span>${t.totalLine}</span><span>${PH_fmt(totals.total)}</span></div>
    </div>
    <button type="button" class="pos-checkout" data-action="pos-receipt" ${PH_POS.cart.length ? "" : "disabled"}>${t.checkoutBtn}</button>`;
}

function posReceiptHTML(totals) {
  const t = PH_I18n.t("experience");
  const cust = posCustomer();
  const custName = cust.id === "walkin" ? t.walkin : cust.name;
  const now = new Date();
  const dateStr = now.toLocaleDateString(PH_I18n.getLocale(), { day: "numeric", month: "short", year: "numeric" });
  const timeStr = now.toLocaleTimeString(PH_I18n.getLocale(), { hour: "2-digit", minute: "2-digit" });

  const lines = PH_POS.cart.map((line) => {
    const p = PH_product(line.id);
    return `<div class="receipt-line"><span>${line.qty} x ${p.name}</span><span>${PH_fmt(p.price * line.qty)}</span></div>`;
  }).join("");

  return `
    <div class="receipt">
      <div class="receipt-head">
        <span class="receipt-ball"></span>
        <h3>${t.receiptTitle}</h3>
        <p>${t.receiptStore}</p>
        <p>${dateStr} · ${timeStr}</p>
      </div>
      <div class="receipt-line"><span>${t.receiptCustomer}</span><span>${custName}</span></div>
      <div class="receipt-sep"></div>
      ${lines}
      <div class="receipt-sep"></div>
      <div class="receipt-line"><span>${t.subtotal}</span><span>${PH_fmt(totals.subtotal)}</span></div>
      ${totals.benefit ? `<div class="receipt-line"><span>${t.benefitLine}</span><span>-${PH_fmt(totals.benefit)}</span></div>` : ""}
      ${totals.discount ? `<div class="receipt-line"><span>${t.discountLine}</span><span>-${PH_fmt(totals.discount)}</span></div>` : ""}
      <div class="receipt-line"><span>${t.taxLine}</span><span>${PH_fmt(totals.tax)}</span></div>
      <div class="receipt-line grand"><span>${t.totalLine}</span><span>${PH_fmt(totals.total)}</span></div>
      <div class="receipt-line"><span>${t.receiptPayment}</span><span>${PH_I18n.t(`experience.payments.${PH_POS.payment}`)}</span></div>
      <div class="receipt-sep"></div>
      <div class="receipt-line points"><span>${t.receiptPoints}</span><span>+${totals.points}</span></div>
      <p class="receipt-thanks">${t.receiptThanks}</p>
      <p class="receipt-note">${t.receiptNote}</p>
    </div>
    <div class="receipt-actions">
      <button type="button" class="pos-secondary" data-action="pos-back">${t.backToCartBtn}</button>
      <button type="button" class="pos-checkout" data-action="pos-new">${t.newSaleBtn}</button>
    </div>`;
}

function commercialClosingHTML() {
  const impact = PH_I18n.t("commercial.impact");
  const roadmap = PH_I18n.t("commercial.roadmap");
  const roi = PH_I18n.t("commercial.roi");
  const cta = PH_I18n.t("commercial.cta");

  const opportunities = ["o1", "o2", "o3"].map((key) => {
    const o = impact.items[key];
    return `
      <div class="impact-card">
        <span class="impact-rank">${o.rank}</span>
        <h4>${o.title}</h4>
        <p>${o.text}</p>
        <span class="impact-signal">${o.signal}</span>
      </div>`;
  }).join("");

  const phases = ["p1", "p2", "p3", "p4"].map((key, i) => {
    const p = roadmap.phases[key];
    const arrow = i < 3 ? `<span class="roadmap-phase-arrow">↓</span>` : "";
    return `
      <div class="roadmap-phase">
        <span class="roadmap-phase-tag">${p.tag}</span>
        <h4>${p.title}</h4>
        <p>${p.desc}</p>
        ${p.duration ? `<span class="roadmap-phase-duration">${p.duration}</span>` : ""}
      </div>${arrow}`;
  }).join("");

  const scenarios = ["s1", "s2", "s3"].map((key) => {
    const s = roi.scenarios[key];
    return `
      <div class="roi-card">
        <p class="roi-prompt">${s.prompt}</p>
        <p class="roi-range">${s.range}</p>
        <p class="roi-note">${s.note}</p>
      </div>`;
  }).join("");

  return `
    <section class="commercial-impact glass" aria-labelledby="impact-heading">
      <p class="commercial-kicker">${impact.kicker}</p>
      <h3 id="impact-heading" class="card-title">${impact.title}</h3>
      <p class="card-subtitle">${impact.subtitle}</p>
      <div class="impact-grid">${opportunities}</div>
    </section>
    <section class="commercial-roadmap glass" aria-labelledby="roadmap-heading">
      <p class="commercial-kicker">${roadmap.kicker}</p>
      <h3 id="roadmap-heading" class="card-title">${roadmap.title}</h3>
      <p class="card-subtitle">${roadmap.subtitle}</p>
      <div class="roadmap-phase-stack">${phases}</div>
    </section>
    <section class="commercial-roi" aria-labelledby="roi-heading">
      <p class="commercial-kicker">${roi.kicker}</p>
      <h3 id="roi-heading" class="card-title">${roi.title}</h3>
      <p class="card-subtitle">${roi.subtitle}</p>
      <div class="roi-grid">${scenarios}</div>
    </section>
    <section class="commercial-cta glass">
      <p class="commercial-kicker">${cta.kicker}</p>
      <h3 class="card-title">${cta.title}</h3>
      <p class="card-subtitle">${cta.subtitle}</p>
      <a class="commercial-cta-btn" href="${cta.href}" target="_blank" rel="noopener noreferrer">${cta.button}</a>
      <p class="commercial-cta-note">${cta.note}</p>
    </section>`;
}

PH_PAGES.renderExperience = function () {
  const t = PH_I18n.t("experience");

  document.getElementById("page-content").innerHTML = `
    ${expChip("experience")}
    <div id="pos-ops-bar">${typeof PH_POS_OPS !== "undefined" ? PH_POS_OPS.barHTML() : ""}</div>
    <div class="pos-layout">
      <div class="pos-left">
        <div class="card pos-card">
          <div class="card-header"><div><h3 class="card-title">${t.customerTitle}</h3></div></div>
          <div class="card-body"><div class="pos-customers" id="pos-customers">${posCustomersHTML()}</div></div>
        </div>
        <div class="card pos-card">
          <div class="card-header"><div><h3 class="card-title">${t.searchTitle}</h3></div></div>
          <div class="card-body">
            <input type="search" class="pos-search" id="pos-search" placeholder="${t.searchPlaceholder}" value="${PH_POS.search}">
            <div class="pos-products" id="pos-products">${posProductsHTML()}</div>
          </div>
        </div>
      </div>
      <div class="pos-cart glass" id="pos-cart">${posCartHTML()}</div>
    </div>
    ${commercialClosingHTML()}`;

  initPosEvents();
};

function posRefreshCart() {
  const cart = document.getElementById("pos-cart");
  if (cart) cart.innerHTML = posCartHTML();
}

function initPosEvents() {
  if (initPosEvents.bound) return;
  initPosEvents.bound = true;

  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-action]");
    if (!el) return;
    const action = el.dataset.action;
    const id = el.dataset.id;

    if (action === "pos-add") {
      const line = PH_POS.cart.find((l) => l.id === id);
      if (line) line.qty += 1;
      else PH_POS.cart.push({ id, qty: 1 });
      posRefreshCart();
    } else if (action === "pos-inc" || action === "pos-dec") {
      const line = PH_POS.cart.find((l) => l.id === id);
      if (!line) return;
      line.qty += action === "pos-inc" ? 1 : -1;
      if (line.qty <= 0) PH_POS.cart = PH_POS.cart.filter((l) => l.id !== id);
      posRefreshCart();
    } else if (action === "pos-customer") {
      PH_POS.customerId = id;
      const wrap = document.getElementById("pos-customers");
      if (wrap) wrap.innerHTML = posCustomersHTML();
      posRefreshCart();
    } else if (action === "pos-payment") {
      PH_POS.payment = id;
      posRefreshCart();
    } else if (action === "pos-receipt") {
      if (!PH_POS.cart.length) return;
      PH_POS.receipt = true;
      posRefreshCart();
    } else if (action === "pos-back") {
      PH_POS.receipt = false;
      posRefreshCart();
    } else if (action === "pos-new") {
      PH_POS.cart = [];
      PH_POS.discountPct = 0;
      PH_POS.receipt = false;
      PH_POS.customerId = "walkin";
      PH_POS.payment = "card";
      const wrap = document.getElementById("pos-customers");
      if (wrap) wrap.innerHTML = posCustomersHTML();
      posRefreshCart();
    }
  });

  document.addEventListener("input", (e) => {
    if (e.target.id === "pos-search") {
      PH_POS.search = e.target.value;
      const list = document.getElementById("pos-products");
      if (list) list.innerHTML = posProductsHTML();
    }
  });

  document.addEventListener("change", (e) => {
    const el = e.target.closest('[data-action="pos-discount"]');
    if (!el) return;
    PH_POS.discountPct = Number(el.value);
    posRefreshCart();
  });
}
initPosEvents.bound = false;
