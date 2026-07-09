const PADBS_ACCESS_CONFIG = {
  passwordHash: PADBS_THEME.access.passwordHash,
  timeoutMs: 30 * 60 * 1000,
};

const PADBS_ACCESS_KEYS = {
  auth: `${PADBS_THEME.id}-access-auth`,
  lastActivity: `${PADBS_THEME.id}-access-activity`,
};

const PADBS_ACCESS = {
  mode: "welcome",
  unlocked: false,
  appStarted: false,
  root: null,
  checkTimer: null,

  init() {
    this.patchLangSwitch();
    this.buildOverlay();
    this.bindGlobalEvents();
    if (this.isSessionValid()) {
      this.unlock();
      return;
    }
    this.clearSession();
    this.showWelcome();
  },

  patchLangSwitch() {
    const original = PADBS_I18n.setLang.bind(PADBS_I18n);
    PADBS_I18n.setLang = (lang) => {
      original(lang);
      if (!this.unlocked) this.render();
    };
  },

  t(key) {
    return PADBS_I18n.t(`access.${key}`);
  },

  async hashInput(value) {
    const data = new TextEncoder().encode(value);
    const buffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(buffer)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
  },

  isSessionValid() {
    if (localStorage.getItem(PADBS_ACCESS_KEYS.auth) !== "true") return false;
    const last = Number(localStorage.getItem(PADBS_ACCESS_KEYS.lastActivity));
    return Boolean(last) && Date.now() - last < PADBS_ACCESS_CONFIG.timeoutMs;
  },

  grantSession() {
    localStorage.setItem(PADBS_ACCESS_KEYS.auth, "true");
    localStorage.setItem(PADBS_ACCESS_KEYS.lastActivity, String(Date.now()));
  },

  clearSession() {
    localStorage.removeItem(PADBS_ACCESS_KEYS.auth);
    localStorage.removeItem(PADBS_ACCESS_KEYS.lastActivity);
  },

  touchActivity() {
    if (this.unlocked) localStorage.setItem(PADBS_ACCESS_KEYS.lastActivity, String(Date.now()));
  },

  buildOverlay() {
    const root = document.createElement("div");
    root.id = "padbs-access-root";
    root.className = "padbs-access-root";
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    document.body.appendChild(root);
    this.root = root;
    this.render();
  },

  langToggle() {
    return `<div class="lang-toggle access-lang" role="group" aria-label="Language">
      <button type="button" class="lang-btn${PADBS_I18n.lang === "es" ? " active" : ""}" data-access-lang="es">ES</button>
      <button type="button" class="lang-btn${PADBS_I18n.lang === "en" ? " active" : ""}" data-access-lang="en">EN</button>
    </div>`;
  },

  render() {
    if (!this.root) return;
    if (this.mode === "welcome") {
      this.root.innerHTML = `<div class="access-bg"></div><section class="access-panel welcome-panel">
        ${this.langToggle()}
        <p class="access-kicker">${this.t("welcome.brand")}</p>
        <h1>${this.t("welcome.title")}</h1>
        <p>${this.t("welcome.subtitle")}</p>
        <span class="access-version">${this.t("welcome.version")}</span>
        <button type="button" class="primary-pill" id="enter-demo">${this.t("welcome.enter")}</button>
      </section>`;
      return;
    }

    const timeout = this.mode === "timeout";
    this.root.innerHTML = `<div class="access-bg"></div><section class="access-panel gate-panel" id="access-modal">
      ${this.langToggle()}
      <div class="lock-icon" aria-hidden="true"></div>
      <h2>${timeout ? this.t("modal.timeoutTitle") : this.t("modal.title")}</h2>
      <p>${timeout ? this.t("modal.timeoutSubtitle") : this.t("modal.subtitle")}</p>
      <form id="access-form" autocomplete="off">
        <label class="sr-only" for="access-input">${this.t("modal.placeholder")}</label>
        <input id="access-input" type="password" placeholder="${this.t("modal.placeholder")}" required>
        <span class="access-error" id="access-error" hidden>${this.t("modal.error")}</span>
        <button type="submit" class="primary-pill">${this.t("modal.submit")}</button>
      </form>
      <small>${this.t("modal.securityNote")}</small>
    </section>`;
  },

  showWelcome() {
    this.mode = "welcome";
    this.unlocked = false;
    document.body.classList.add("access-active");
    document.body.classList.remove("access-locked");
    this.render();
  },

  showModal(timeout = false) {
    this.mode = timeout ? "timeout" : "gate";
    document.body.classList.add("access-active");
    if (timeout) document.body.classList.add("access-locked");
    this.render();
    setTimeout(() => document.getElementById("access-input")?.focus(), 80);
  },

  unlock() {
    this.unlocked = true;
    this.mode = "none";
    document.body.classList.remove("access-active", "access-locked");
    if (this.root) this.root.innerHTML = "";
    this.bindActivity();
    this.startMonitor();
    if (!this.appStarted) {
      this.appStarted = true;
      document.dispatchEvent(new CustomEvent("padbs-access-granted"));
    }
  },

  lock() {
    if (!this.unlocked) return;
    this.unlocked = false;
    this.clearSession();
    this.showModal(true);
  },

  bindGlobalEvents() {
    document.addEventListener("click", (e) => {
      const lang = e.target.closest("[data-access-lang]")?.dataset.accessLang;
      if (lang) PADBS_I18n.setLang(lang);
      if (e.target.id === "enter-demo") this.showModal(false);
    });
    document.addEventListener("submit", (e) => {
      if (e.target.id !== "access-form") return;
      e.preventDefault();
      void this.handleSubmit();
    });
  },

  async handleSubmit() {
    const input = document.getElementById("access-input");
    const error = document.getElementById("access-error");
    const modal = document.getElementById("access-modal");
    const hash = await this.hashInput(input.value);
    if (hash === PADBS_ACCESS_CONFIG.passwordHash) {
      this.grantSession();
      this.unlock();
      return;
    }
    error.hidden = false;
    modal.classList.remove("shake");
    void modal.offsetWidth;
    modal.classList.add("shake");
    input.value = "";
    input.focus();
  },

  bindActivity() {
    if (this.activityBound) return;
    this.activityBound = true;
    let last = 0;
    ["mousemove", "click", "scroll", "keydown", "touchstart"].forEach((evt) => {
      document.addEventListener(evt, () => {
        const now = Date.now();
        if (now - last < 5000) return;
        last = now;
        this.touchActivity();
      }, { passive: true });
    });
  },

  startMonitor() {
    if (this.checkTimer) return;
    this.checkTimer = setInterval(() => {
      if (this.unlocked && !this.isSessionValid()) this.lock();
    }, 15000);
  },
};

document.addEventListener("DOMContentLoaded", () => PADBS_ACCESS.init());
