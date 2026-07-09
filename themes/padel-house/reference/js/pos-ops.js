/**
 * Padel House: Experience Center operational simulation (Sprint 5)
 */

const PH_POS_KEYS = {
  customers: "padel-house-demo-pos-customers",
  transactions: "padel-house-demo-pos-transactions",
  quotes: "padel-house-demo-pos-quotes",
  reservations: "padel-house-demo-pos-reservations",
  returns: "padel-house-demo-pos-returns",
};

const PH_POS_OPS = {
  drawer: null,
  confirm: null,
  toastTimer: null,

  init() {
    if (!localStorage.getItem(PH_POS_KEYS.customers)) {
      this.saveCustomers(this.baselineCustomers());
    } else {
      PH_DATA.posCustomers = this.getCustomers();
    }
  },

  baselineCustomers() {
    return JSON.parse(JSON.stringify(PH_DATA.posCustomers));
  },

  clearInvalidState() {
    localStorage.removeItem(PH_POS_KEYS.customers);
    localStorage.removeItem(PH_POS_KEYS.transactions);
    localStorage.removeItem(PH_POS_KEYS.quotes);
    localStorage.removeItem(PH_POS_KEYS.reservations);
    localStorage.removeItem(PH_POS_KEYS.returns);
    PH_DATA.posCustomers = this.baselineCustomers();
  },

  validateCustomers(list) {
    if (!Array.isArray(list) || !list.length) return null;
    const valid = list.filter(
      (c) => c && c.id && (c.id === "walkin" || (typeof c.name === "string" && c.name.trim()))
    );
    return valid.length ? valid : null;
  },

  getCustomers() {
    try {
      const raw = localStorage.getItem(PH_POS_KEYS.customers);
      if (!raw) return this.baselineCustomers();
      const parsed = JSON.parse(raw);
      const valid = this.validateCustomers(parsed);
      if (!valid) {
        console.warn("[Padel House] POS customers in localStorage were invalid. Resetting demo customers.");
        this.clearInvalidState();
        return this.baselineCustomers();
      }
      return valid;
    } catch (err) {
      console.warn("[Padel House] Failed to parse POS customers. Resetting demo customers.", err);
      this.clearInvalidState();
      return this.baselineCustomers();
    }
  },

  saveCustomers(list) {
    localStorage.setItem(PH_POS_KEYS.customers, JSON.stringify(list));
    PH_DATA.posCustomers = list;
  },

  readList(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        localStorage.removeItem(key);
        return [];
      }
      return parsed.filter((item) => item && typeof item === "object");
    } catch (err) {
      console.warn("[Padel House] Failed to parse demo list. Clearing key.", key, err);
      localStorage.removeItem(key);
      return [];
    }
  },

  writeList(key, list) {
    localStorage.setItem(key, JSON.stringify(list.slice(0, 20)));
  },

  ref(prefix) {
    return `${prefix}-${Date.now().toString(36).toUpperCase()}`;
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

  reset(showToast) {
    this.clearInvalidState();
    this.saveCustomers(this.baselineCustomers());
    PH_POS.cart = [];
    PH_POS.customerId = "walkin";
    PH_POS.discountPct = 0;
    PH_POS.payment = "card";
    PH_POS.receipt = false;
    if (showToast !== false) this.toast(PH_I18n.t("experience.ops.toast.reset"));
    if (typeof PH_PAGES !== "undefined" && document.body.dataset.page === "experience") {
      PH_PAGES.render("experience");
    }
  },

  catalog() {
    return typeof PH_HUB_OPS !== "undefined" ? PH_HUB_OPS.getCatalog() : PH_DATA.products;
  },

  productOptions(selectedId) {
    return this.catalog().map((p) =>
      `<option value="${p.id}"${p.id === selectedId ? " selected" : ""}>${p.name}</option>`
    ).join("");
  },

  closeDrawer() {
    this.drawer = null;
    const root = document.getElementById("ph-pos-drawer");
    if (root) root.remove();
    document.body.classList.remove("ops-drawer-open");
  },

  openDrawer(action) {
    this.drawer = action;
    document.body.classList.add("ops-drawer-open");
    let root = document.getElementById("ph-pos-drawer");
    if (!root) {
      root = document.createElement("div");
      root.id = "ph-pos-drawer";
      root.className = "ops-drawer-root";
      document.body.appendChild(root);
    }
    root.innerHTML = this.drawerHTML(action);
  },

  drawerHTML(action) {
    const o = PH_I18n.t("experience.ops");
    const d = o.drawer;
    const map = {
      customer: [d.customerTitle, d.customerSubtitle],
      quote: [d.quoteTitle, d.quoteSubtitle],
      reserve: [d.reserveTitle, d.reserveSubtitle],
      return: [d.returnTitle, d.returnSubtitle],
    };
    const [title, sub] = map[action] || ["", ""];

    let fields = "";
    if (action === "customer") {
      fields = `
        <label class="ops-field"><span>${d.nameLabel}</span><input name="name" required placeholder="Carlos A."></label>
        <label class="ops-field"><span>${d.tierLabel}</span><select name="tier">
          <option value="none">${d.tiers.none}</option>
          <option value="Bronze">${d.tiers.bronze}</option>
          <option value="Silver">${d.tiers.silver}</option>
          <option value="Gold">${d.tiers.gold}</option>
          <option value="Platinum">${d.tiers.platinum}</option>
        </select></label>`;
    } else if (action === "quote" || action === "reserve") {
      fields = `
        <label class="ops-field"><span>${d.productLabel}</span><select name="product">${this.productOptions(PH_POS.cart[0]?.id || "p1")}</select></label>
        <label class="ops-field"><span>${d.qtyLabel}</span><input name="qty" type="number" min="1" value="${PH_POS.cart[0]?.qty || 1}" required></label>
        <label class="ops-field"><span>${d.noteLabel}</span><input name="note" placeholder=""></label>`;
    } else if (action === "return") {
      const txs = this.readList(PH_POS_KEYS.transactions);
      const txOpts = txs.length
        ? txs.map((t) => `<option value="${t.id}">${t.ref} · ${PH_fmt(t.total)}</option>`).join("")
        : `<option value="">${o.savedEmpty}</option>`;
      fields = `
        <label class="ops-field"><span>${o.savedLabel}</span><select name="transaction">${txOpts}</select></label>
        <label class="ops-field"><span>${d.noteLabel}</span><input name="note" placeholder=""></label>`;
    }

    return `
      <div class="ops-drawer-backdrop" data-pos-ops="close"></div>
      <div class="ops-drawer glass" role="dialog" aria-modal="true">
        <button type="button" class="ops-drawer-close" data-pos-ops="close" aria-label="${d.cancel}">×</button>
        <p class="ops-drawer-kicker">${o.panelTitle}</p>
        <h3>${title}</h3>
        <p class="ops-drawer-sub">${sub}</p>
        <form id="ph-pos-ops-form" data-pos-action="${action}" class="ops-form">${fields}
          <div class="ops-form-actions">
            <button type="button" class="ops-btn ghost" data-pos-ops="close">${d.cancel}</button>
            <button type="submit" class="ops-btn primary">${d.submit}</button>
          </div>
        </form>
      </div>`;
  },

  confirmHTML(data) {
    const c = PH_I18n.t("experience.ops.confirm");
    const rows = data.rows.map(([k, v]) => `<div class="ops-confirm-row"><span>${k}</span><strong>${v}</strong></div>`).join("");
    return `
      <div class="ops-confirm glass">
        <span class="ops-confirm-icon">✓</span>
        <h4>${data.title}</h4>
        ${rows}
      </div>`;
  },

  barHTML() {
    const o = PH_I18n.t("experience.ops");
    const actions = [
      ["customer", o.actions.quickCustomer],
      ["save", o.actions.saveSale],
      ["quote", o.actions.createQuote],
      ["reserve", o.actions.reserveProduct],
    ];
    const chips = actions.map(([id, label]) =>
      `<button type="button" class="ops-chip" data-pos-ops="action" data-action="${id}">${label}</button>`
    ).join("");

    return `
      <div class="ops-panel glass ops-panel-pos">
        <div class="ops-panel-head">
          <div>
            <h3 class="card-title">${o.panelTitle}</h3>
            <p class="card-subtitle">${o.panelSubtitle}</p>
          </div>
        </div>
        <p class="ops-outcome-note">${o.outcomeNote}</p>
        <div class="ops-chip-row">${chips}</div>
        ${this.confirm ? this.confirmHTML(this.confirm) : ""}
      </div>`;
  },

  handleAction(action) {
    const o = PH_I18n.t("experience.ops");
    if (action === "customer") {
      this.openDrawer("customer");
      return;
    }
    if (action === "save") {
      if (!PH_POS.cart.length) return;
      const totals = posTotals();
      const cust = posCustomer();
      const tx = {
        id: `tx-${Date.now()}`,
        ref: this.ref("V"),
        total: totals.total,
        customer: cust.id === "walkin" ? PH_I18n.t("experience.walkin") : cust.name,
        at: Date.now(),
      };
      const list = [tx, ...this.readList(PH_POS_KEYS.transactions)];
      this.writeList(PH_POS_KEYS.transactions, list);
      this.confirm = {
        title: o.confirm.saveSaleTitle,
        rows: [[o.confirm.refLabel, tx.ref], [o.confirm.totalLabel, PH_fmt(tx.total)]],
      };
      this.toast(o.toast.saveSale);
      this.refreshBar();
      return;
    }
    if (action === "quote") {
      if (!PH_POS.cart.length) this.openDrawer("quote");
      else {
        const totals = posTotals();
        const quote = {
          id: `qt-${Date.now()}`,
          ref: this.ref("Q"),
          total: totals.total,
          validUntil: Date.now() + 7 * 86400000,
          at: Date.now(),
        };
        this.writeList(PH_POS_KEYS.quotes, [quote, ...this.readList(PH_POS_KEYS.quotes)]);
        this.confirm = {
          title: o.confirm.quoteTitle,
          rows: [[o.confirm.refLabel, quote.ref], [o.confirm.totalLabel, PH_fmt(quote.total)], [o.confirm.validLabel, new Date(quote.validUntil).toLocaleDateString(PH_I18n.getLocale())]],
        };
        this.toast(o.toast.createQuote);
        this.refreshBar();
      }
      return;
    }
    if (action === "reserve") {
      this.openDrawer("reserve");
      return;
    }
    if (action === "return") {
      this.openDrawer("return");
      return;
    }
  },

  handleSubmit(form) {
    const action = form.dataset.posAction;
    const fd = new FormData(form);
    const o = PH_I18n.t("experience.ops");

    if (action === "customer") {
      const name = String(fd.get("name") || "").trim();
      const tier = fd.get("tier");
      if (!name) return;
      const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
      const benefitMap = { Bronze: 5, Silver: 10, Gold: 15, Platinum: 20, none: 0 };
      const id = `c-${Date.now()}`;
      const customer = {
        id,
        name,
        initials,
        tier: tier === "none" ? null : tier,
        benefitPct: benefitMap[tier] || 0,
      };
      const list = [...this.getCustomers(), customer];
      this.saveCustomers(list);
      PH_POS.customerId = id;
      this.toast(o.toast.customer);
      this.closeDrawer();
      PH_PAGES.render("experience");
      return;
    }

    if (action === "quote") {
      const id = fd.get("product");
      const qty = Number(fd.get("qty")) || 1;
      const p = this.catalog().find((x) => x.id === id);
      if (!p) return;
      const total = p.price * qty;
      const quote = {
        id: `qt-${Date.now()}`,
        ref: this.ref("Q"),
        total,
        validUntil: Date.now() + 7 * 86400000,
        at: Date.now(),
        note: fd.get("note") || "",
      };
      this.writeList(PH_POS_KEYS.quotes, [quote, ...this.readList(PH_POS_KEYS.quotes)]);
      this.confirm = {
        title: o.confirm.quoteTitle,
        rows: [[o.confirm.refLabel, quote.ref], [o.confirm.totalLabel, PH_fmt(total)], [o.confirm.validLabel, new Date(quote.validUntil).toLocaleDateString(PH_I18n.getLocale())]],
      };
      this.toast(o.toast.createQuote);
      this.closeDrawer();
      this.refreshBar();
      return;
    }

    if (action === "reserve") {
      const id = fd.get("product");
      const qty = Number(fd.get("qty")) || 1;
      const p = this.catalog().find((x) => x.id === id);
      if (!p) return;
      const reservation = {
        id: `rs-${Date.now()}`,
        ref: this.ref("R"),
        product: p.name,
        qty,
        pickup: PH_DATA.company.stores[0],
        at: Date.now(),
        note: fd.get("note") || "",
      };
      this.writeList(PH_POS_KEYS.reservations, [reservation, ...this.readList(PH_POS_KEYS.reservations)]);
      this.confirm = {
        title: o.confirm.reserveTitle,
        rows: [[o.confirm.refLabel, reservation.ref], [o.confirm.pickupLabel, reservation.pickup], ["", `${qty} x ${p.name}`]],
      };
      this.toast(o.toast.reserveProduct);
      this.closeDrawer();
      this.refreshBar();
      return;
    }

    if (action === "return") {
      const txId = fd.get("transaction");
      const txs = this.readList(PH_POS_KEYS.transactions);
      const tx = txs.find((t) => t.id === txId);
      const ret = {
        id: `rt-${Date.now()}`,
        ref: this.ref("D"),
        linked: tx ? tx.ref : this.ref("D"),
        at: Date.now(),
        note: fd.get("note") || "",
      };
      this.writeList(PH_POS_KEYS.returns, [ret, ...this.readList(PH_POS_KEYS.returns)]);
      this.confirm = {
        title: o.confirm.returnTitle,
        rows: [[o.confirm.refLabel, ret.ref], ["", tx ? tx.ref : PH_I18n.t("experience.ops.savedEmpty")]],
      };
      this.toast(o.toast.simulateReturn);
      this.closeDrawer();
      this.refreshBar();
    }
  },

  refreshBar() {
    const bar = document.getElementById("pos-ops-bar");
    if (bar) bar.innerHTML = this.barHTML();
  },

  bindEvents() {
    if (this.bound) return;
    this.bound = true;

    document.addEventListener("click", (e) => {
      const act = e.target.closest('[data-pos-ops="action"]');
      if (act) {
        this.handleAction(act.dataset.action);
        return;
      }
      if (e.target.closest('[data-pos-ops="close"]')) {
        this.closeDrawer();
        return;
      }
    });

    document.addEventListener("submit", (e) => {
      if (e.target.id === "ph-pos-ops-form") {
        e.preventDefault();
        this.handleSubmit(e.target);
      }
    });
  },
};

PH_POS_OPS.bound = false;

document.addEventListener("DOMContentLoaded", () => {
  if (typeof PH_POS_OPS !== "undefined") {
    PH_POS_OPS.init();
    PH_POS_OPS.bindEvents();
  }
});
