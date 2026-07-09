/**
 * Padel House: Product Hub operational simulation (Sprint 5)
 */

const PH_HUB_KEYS = {
  catalog: "padel-house-demo-catalog",
  timeline: "padel-house-demo-hub-timeline",
};

const PH_HUB_OPS = {
  drawer: null,
  toastTimer: null,

  init() {
    if (!localStorage.getItem(PH_HUB_KEYS.catalog)) {
      this.saveCatalog(this.baseline());
    }
  },

  baseline() {
    return JSON.parse(JSON.stringify(PH_DATA.products));
  },

  clearInvalidState() {
    localStorage.removeItem(PH_HUB_KEYS.catalog);
    localStorage.removeItem(PH_HUB_KEYS.timeline);
  },

  sanitizeProduct(raw, baseline) {
    if (!raw || typeof raw !== "object" || !raw.id || !raw.name) return null;
    const base = baseline.find((item) => item.id === raw.id);
    const stock = Number(raw.stock);
    const price = Number(raw.price);
    const product = {
      id: String(raw.id),
      icon: raw.icon || base?.icon || "🎾",
      name: String(raw.name),
      categoryKey: raw.categoryKey || base?.categoryKey || "accessories",
      price: Number.isFinite(price) ? price : (base?.price || 0),
      stock: Number.isFinite(stock) ? stock : (base?.stock || 0),
      health: raw.health || "good",
      tags: Array.isArray(raw.tags) ? raw.tags.slice() : (base?.tags ? base.tags.slice() : []),
      pairsWith: Array.isArray(raw.pairsWith) ? raw.pairsWith.slice() : (base?.pairsWith ? base.pairsWith.slice() : []),
      storeHint: raw.storeHint || base?.storeHint || "",
    };
    return this.applyHealth(product);
  },

  getCatalog() {
    const baseline = this.baseline();
    try {
      const raw = localStorage.getItem(PH_HUB_KEYS.catalog);
      if (!raw) return baseline;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || !parsed.length) {
        this.clearInvalidState();
        return baseline;
      }
      const catalog = parsed.map((item) => this.sanitizeProduct(item, baseline)).filter(Boolean);
      if (!catalog.length) {
        console.warn("[Padel House] Catalog in localStorage was invalid. Resetting demo catalog.");
        this.clearInvalidState();
        return baseline;
      }
      this.saveCatalog(catalog);
      return catalog;
    } catch (err) {
      console.warn("[Padel House] Failed to parse catalog from localStorage. Resetting demo catalog.", err);
      this.clearInvalidState();
      return baseline;
    }
  },

  saveCatalog(catalog) {
    localStorage.setItem(PH_HUB_KEYS.catalog, JSON.stringify(catalog));
  },

  getTimeline() {
    try {
      const raw = localStorage.getItem(PH_HUB_KEYS.timeline);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        localStorage.removeItem(PH_HUB_KEYS.timeline);
        return [];
      }
      return parsed.filter((item) => item && item.type && item.at);
    } catch (err) {
      console.warn("[Padel House] Failed to parse hub timeline. Clearing stored timeline.", err);
      localStorage.removeItem(PH_HUB_KEYS.timeline);
      return [];
    }
  },

  pushTimeline(type, detail) {
    const entry = {
      id: `tl-${Date.now()}`,
      type,
      detail,
      at: Date.now(),
    };
    const list = [entry, ...this.getTimeline()].slice(0, 12);
    localStorage.setItem(PH_HUB_KEYS.timeline, JSON.stringify(list));
  },

  reset(showToast) {
    this.clearInvalidState();
    if (showToast !== false) this.toast(PH_I18n.t("products.ops.toast.reset"));
    if (typeof PH_PAGES !== "undefined" && document.body.dataset.page === "products") {
      PH_PAGES.render("products");
    }
  },

  healthFromStock(stock) {
    if (stock <= 10) return "critical";
    if (stock <= 18) return "low";
    return "good";
  },

  applyHealth(product) {
    product.health = this.healthFromStock(product.stock);
    return product;
  },

  nextProductId(catalog) {
    const nums = catalog.map((p) => Number(String(p.id).replace("p", ""))).filter((n) => !Number.isNaN(n));
    const max = nums.length ? Math.max(...nums) : 0;
    return `p${max + 1}`;
  },

  categoryIcon(key) {
    const map = { rackets: "🎾", footwear: "👟", apparel: "👕", balls: "🟡", accessories: "🎒", protection: "🛡️" };
    return map[key] || "🎾";
  },

  productOptions(selectedId) {
    return this.getCatalog().map((p) =>
      `<option value="${p.id}"${p.id === selectedId ? " selected" : ""}>${p.name}</option>`
    ).join("");
  },

  storeOptions(selected) {
    return PH_DATA.company.stores.map((s) =>
      `<option value="${s}"${s === selected ? " selected" : ""}>${s}</option>`
    ).join("");
  },

  categoryOptions(selected) {
    const cats = ["rackets", "footwear", "apparel", "balls", "accessories", "protection"];
    return cats.map((c) =>
      `<option value="${c}"${c === selected ? " selected" : ""}>${PH_I18n.category(c)}</option>`
    ).join("");
  },

  toast(message) {
    let el = document.getElementById("ph-ops-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "ph-ops-toast";
      el.className = "ops-toast";
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add("visible");
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => el.classList.remove("visible"), 3200);
  },

  closeDrawer() {
    this.drawer = null;
    const root = document.getElementById("ph-hub-drawer");
    if (root) root.remove();
    document.body.classList.remove("ops-drawer-open");
  },

  openDrawer(action) {
    this.drawer = action;
    document.body.classList.add("ops-drawer-open");
    let root = document.getElementById("ph-hub-drawer");
    if (!root) {
      root = document.createElement("div");
      root.id = "ph-hub-drawer";
      root.className = "ops-drawer-root";
      document.body.appendChild(root);
    }
    root.innerHTML = this.drawerHTML(action);
  },

  drawerHTML(action) {
    const o = PH_I18n.t("products.ops");
    const d = o.drawer;
    const titles = {
      add: [d.addTitle, d.addSubtitle],
      receive: [d.receiveTitle, d.receiveSubtitle],
      transfer: [d.transferTitle, d.transferSubtitle],
      adjust: [d.adjustTitle, d.adjustSubtitle],
      featured: [d.featuredTitle, d.featuredSubtitle],
    };
    const [title, sub] = titles[action] || ["", ""];

    let fields = "";
    if (action === "add") {
      fields = `
        <label class="ops-field"><span>${d.nameLabel}</span><input name="name" required placeholder="Padel House Demo Pro"></label>
        <label class="ops-field"><span>${d.categoryLabel}</span><select name="category">${this.categoryOptions("accessories")}</select></label>
        <label class="ops-field"><span>${d.priceLabel}</span><input name="price" type="number" min="100" step="50" value="2500" required></label>
        <label class="ops-field"><span>${d.stockLabel}</span><input name="qty" type="number" min="1" value="12" required></label>
        <label class="ops-field"><span>${d.storeLabel}</span><select name="store">${this.storeOptions(PH_DATA.company.stores[0])}</select></label>`;
    } else if (action === "receive") {
      fields = `
        <label class="ops-field"><span>${d.productLabel}</span><select name="product">${this.productOptions("p1")}</select></label>
        <label class="ops-field"><span>${d.stockLabel}</span><input name="qty" type="number" min="1" value="6" required></label>
        <label class="ops-field"><span>${d.storeLabel}</span><select name="store">${this.storeOptions(PH_DATA.company.stores[0])}</select></label>`;
    } else if (action === "transfer") {
      fields = `
        <label class="ops-field"><span>${d.productLabel}</span><select name="product">${this.productOptions("p1")}</select></label>
        <label class="ops-field"><span>${d.stockLabel}</span><input name="qty" type="number" min="1" value="3" required></label>
        <label class="ops-field"><span>${d.fromStoreLabel}</span><select name="fromStore">${this.storeOptions(PH_DATA.company.stores[0])}</select></label>
        <label class="ops-field"><span>${d.toStoreLabel}</span><select name="toStore">${this.storeOptions(PH_DATA.company.stores[1])}</select></label>`;
    } else if (action === "adjust") {
      fields = `
        <label class="ops-field"><span>${d.productLabel}</span><select name="product">${this.productOptions("p10")}</select></label>
        <label class="ops-field"><span>${d.stockLabel}</span><input name="qty" type="number" value="0" required></label>
        <label class="ops-field"><span>${d.reasonLabel}</span><select name="reason">
          <option value="count">${o.reasons.count}</option>
          <option value="damage">${o.reasons.damage}</option>
          <option value="correction">${o.reasons.correction}</option>
        </select></label>`;
    } else if (action === "featured") {
      fields = `
        <label class="ops-field"><span>${d.productLabel}</span><select name="product">${this.productOptions("p2")}</select></label>`;
    }

    return `
      <div class="ops-drawer-backdrop" data-hub-ops="close"></div>
      <div class="ops-drawer glass" role="dialog" aria-modal="true">
        <button type="button" class="ops-drawer-close" data-hub-ops="close" aria-label="${d.cancel}">×</button>
        <p class="ops-drawer-kicker">${PH_I18n.t("products.ops.panelTitle")}</p>
        <h3>${title}</h3>
        <p class="ops-drawer-sub">${sub}</p>
        <form id="ph-hub-ops-form" data-hub-action="${action}" class="ops-form">${fields}
          <div class="ops-form-actions">
            <button type="button" class="ops-btn ghost" data-hub-ops="close">${d.cancel}</button>
            <button type="submit" class="ops-btn primary">${d.submit}</button>
          </div>
        </form>
      </div>`;
  },

  panelHTML() {
    const o = PH_I18n.t("products.ops");
    const actions = [
      ["add", o.actions.addProduct],
      ["receive", o.actions.receiveStock],
      ["transfer", o.actions.transferStock],
      ["adjust", o.actions.adjustStock],
      ["featured", o.actions.markFeatured],
    ];
    const chips = actions.map(([id, label]) =>
      `<button type="button" class="ops-chip" data-hub-ops="open" data-action="${id}">${label}</button>`
    ).join("");

    return `
      <div class="ops-panel glass">
        <div class="ops-panel-head">
          <div>
            <h3 class="card-title">${o.panelTitle}</h3>
            <p class="card-subtitle">${o.panelSubtitle}</p>
          </div>
        </div>
        <p class="ops-outcome-note">${o.outcomeNote}</p>
        <div class="ops-chip-row">${chips}</div>
      </div>`;
  },

  timelineHTML() {
    const o = PH_I18n.t("products.ops");
    const items = this.getTimeline();
    if (!items.length) {
      return `
        <div class="ops-timeline card">
          <h3 class="card-title">${o.timelineTitle}</h3>
          <p class="ops-empty">${o.timelineEmpty}</p>
        </div>`;
    }
    const rows = items.map((item) => {
      const label = o.timeline[item.type] || item.type;
      const time = new Date(item.at).toLocaleString(PH_I18n.getLocale(), { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" });
      return `
        <div class="ops-timeline-item">
          <span class="ops-timeline-dot"></span>
          <div>
            <strong>${label}</strong>
            <p>${item.detail}</p>
            <span class="ops-timeline-time">${time}</span>
          </div>
        </div>`;
    }).join("");
    return `
      <div class="ops-timeline card">
        <h3 class="card-title">${o.timelineTitle}</h3>
        <div class="ops-timeline-list">${rows}</div>
      </div>`;
  },

  handleSubmit(form) {
    const action = form.dataset.hubAction;
    const fd = new FormData(form);
    const catalog = this.getCatalog();
    const o = PH_I18n.t("products.ops");

    if (action === "add") {
      const name = String(fd.get("name") || "").trim();
      if (!name) return;
      const categoryKey = fd.get("category");
      const price = Number(fd.get("price")) || 0;
      const stock = Number(fd.get("qty")) || 0;
      const store = fd.get("store");
      const product = this.applyHealth({
        id: this.nextProductId(catalog),
        icon: this.categoryIcon(categoryKey),
        name,
        categoryKey,
        price,
        stock,
        health: "good",
        tags: ["new"],
        pairsWith: [],
        storeHint: store,
      });
      catalog.unshift(product);
      this.saveCatalog(catalog);
      this.pushTimeline("product_created", `${name} · ${store}`);
      this.toast(o.toast.addProduct);
    } else if (action === "receive") {
      const id = fd.get("product");
      const qty = Number(fd.get("qty")) || 0;
      const store = fd.get("store");
      const p = catalog.find((x) => x.id === id);
      if (!p || qty <= 0) return;
      p.stock += qty;
      this.applyHealth(p);
      this.saveCatalog(catalog);
      this.pushTimeline("stock_received", `+${qty} ${p.name} · ${store}`);
      this.toast(o.toast.receiveStock);
    } else if (action === "transfer") {
      const id = fd.get("product");
      const qty = Number(fd.get("qty")) || 0;
      const fromStore = fd.get("fromStore");
      const toStore = fd.get("toStore");
      const p = catalog.find((x) => x.id === id);
      if (!p || qty <= 0 || fromStore === toStore) return;
      if (p.stock < qty) return;
      p.stock -= qty;
      this.applyHealth(p);
      this.saveCatalog(catalog);
      this.pushTimeline("transfer_completed", `${qty} ${p.name} · ${fromStore} → ${toStore}`);
      this.toast(o.toast.transferStock);
    } else if (action === "adjust") {
      const id = fd.get("product");
      const delta = Number(fd.get("qty")) || 0;
      const reason = fd.get("reason");
      const p = catalog.find((x) => x.id === id);
      if (!p) return;
      p.stock = Math.max(0, p.stock + delta);
      this.applyHealth(p);
      this.saveCatalog(catalog);
      const reasonLabel = o.reasons[reason] || reason;
      this.pushTimeline("stock_adjusted", `${delta >= 0 ? "+" : ""}${delta} ${p.name} · ${reasonLabel}`);
      this.toast(o.toast.adjustStock);
    } else if (action === "featured") {
      const id = fd.get("product");
      const p = catalog.find((x) => x.id === id);
      if (!p) return;
      const tags = Array.isArray(p.tags) ? p.tags : (p.tags = []);
      if (!tags.includes("featured")) tags.push("featured");
      this.saveCatalog(catalog);
      this.pushTimeline("marked_featured", p.name);
      this.toast(o.toast.markFeatured);
    }

    this.closeDrawer();
    if (typeof PH_PAGES !== "undefined") PH_PAGES.render("products");
  },

  bindEvents() {
    if (this.bound) return;
    this.bound = true;

    document.addEventListener("click", (e) => {
      const open = e.target.closest('[data-hub-ops="open"]');
      if (open) {
        this.openDrawer(open.dataset.action);
        return;
      }
      const close = e.target.closest('[data-hub-ops="close"]');
      if (close) {
        this.closeDrawer();
        return;
      }
    });

    document.addEventListener("submit", (e) => {
      if (e.target.id === "ph-hub-ops-form") {
        e.preventDefault();
        this.handleSubmit(e.target);
      }
    });
  },
};

PH_HUB_OPS.bound = false;

document.addEventListener("DOMContentLoaded", () => {
  if (typeof PH_HUB_OPS !== "undefined") {
    PH_HUB_OPS.init();
    PH_HUB_OPS.bindEvents();
  }
});
