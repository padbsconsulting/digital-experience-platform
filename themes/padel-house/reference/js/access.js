/**
 * Padel House: demo access gate (static, GitHub Pages compatible)
 * Not a real authentication system.
 */

const PH_ACCESS_CONFIG = {
  passwordHash: "bd12c77858d5e0ce6852b45970fed177db5def75999ba0c6b15ddd1d8d44ee06",
  timeoutMs: 30 * 60 * 1000,
};

const PH_ACCESS_KEYS = {
  auth: "padel-house-access-auth",
  sessionStart: "padel-house-access-session",
  lastActivity: "padel-house-access-activity",
};

const PH_ACCESS = {
  mode: "welcome",
  unlocked: false,
  appStarted: false,
  root: null,
  checkTimer: null,
  activityBound: false,

  init() {
    this.patchLangSwitch();
    this.buildOverlay();
    this.bindGlobalEvents();

    if (this.isSessionValid()) {
      this.touchActivity();
      this.unlock(false);
      this.startSessionMonitor();
      return;
    }

    this.clearSession();
    this.showWelcome();
  },

  patchLangSwitch() {
    const original = PH_I18n.setLang.bind(PH_I18n);
    PH_I18n.setLang = (lang) => {
      original(lang);
      if (!this.unlocked) this.render();
    };
  },

  t(key) {
    return PH_I18n.t(`access.${key}`);
  },

  async hashInput(value) {
    const data = new TextEncoder().encode(value);
    const buffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(buffer))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  },

  isSessionValid() {
    if (localStorage.getItem(PH_ACCESS_KEYS.auth) !== "true") return false;
    const last = Number(localStorage.getItem(PH_ACCESS_KEYS.lastActivity));
    if (!last || Number.isNaN(last)) return false;
    return Date.now() - last < PH_ACCESS_CONFIG.timeoutMs;
  },

  grantSession() {
    const now = String(Date.now());
    localStorage.setItem(PH_ACCESS_KEYS.auth, "true");
    localStorage.setItem(PH_ACCESS_KEYS.sessionStart, now);
    localStorage.setItem(PH_ACCESS_KEYS.lastActivity, now);
  },

  clearSession() {
    localStorage.removeItem(PH_ACCESS_KEYS.auth);
    localStorage.removeItem(PH_ACCESS_KEYS.sessionStart);
    localStorage.removeItem(PH_ACCESS_KEYS.lastActivity);
  },

  touchActivity() {
    if (!this.unlocked) return;
    localStorage.setItem(PH_ACCESS_KEYS.lastActivity, String(Date.now()));
  },

  buildOverlay() {
    if (document.getElementById("ph-access-root")) return;
    const root = document.createElement("div");
    root.id = "ph-access-root";
    root.className = "ph-access-root";
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    document.body.appendChild(root);
    this.root = root;
    this.render();
  },

  renderLangToggle() {
    const lang = PH_I18n.lang;
    return `
      <div class="lang-toggle ph-access-lang" role="group" aria-label="Language">
        <button type="button" class="lang-btn${lang === "es" ? " active" : ""}" data-ph-access-lang="es">ES</button>
        <button type="button" class="lang-btn${lang === "en" ? " active" : ""}" data-ph-access-lang="en">EN</button>
      </div>`;
  },

  render() {
    if (!this.root) return;

    if (this.mode === "welcome") {
      this.root.innerHTML = `
        <div class="ph-access-bg"></div>
        <div class="ph-welcome">
          <div class="ph-welcome-inner">
            ${this.renderLangToggle()}
            <p class="ph-welcome-brand">${this.t("welcome.brand")}</p>
            <h1 class="ph-welcome-title">${this.t("welcome.title")}</h1>
            <p class="ph-welcome-sub">${this.t("welcome.subtitle")}</p>
            <span class="ph-welcome-version">${this.t("welcome.version")}</span>
            <button type="button" class="ph-welcome-btn" id="ph-enter-demo">${this.t("welcome.enter")}</button>
          </div>
        </div>`;
      return;
    }

    const isTimeout = this.mode === "timeout";
    this.root.innerHTML = `
      <div class="ph-access-bg"></div>
      <div class="ph-access-modal-wrap">
        <div class="ph-access-modal glass" id="ph-access-modal">
          ${this.renderLangToggle()}
          <div class="ph-modal-icon" aria-hidden="true"></div>
          <h2>${isTimeout ? this.t("modal.timeoutTitle") : this.t("modal.title")}</h2>
          <p class="ph-modal-sub">${isTimeout ? this.t("modal.timeoutSubtitle") : this.t("modal.subtitle")}</p>
          <form id="ph-access-form" autocomplete="off">
            <label class="ph-sr-only" for="ph-access-input">${this.t("modal.placeholder")}</label>
            <input type="password" id="ph-access-input" placeholder="${this.t("modal.placeholder")}" required>
            <p class="ph-access-error" id="ph-access-error" hidden>${this.t("modal.error")}</p>
            <button type="submit" class="ph-modal-submit">${this.t("modal.submit")}</button>
          </form>
          <p class="ph-access-note">${this.t("modal.securityNote")}</p>
        </div>
      </div>`;
  },

  showWelcome() {
    this.mode = "welcome";
    this.unlocked = false;
    this.showOverlay();
    document.body.classList.remove("ph-access-locked");
    this.render();
  },

  showModal(isTimeout) {
    this.mode = isTimeout ? "timeout" : "gate";
    this.showOverlay();
    if (isTimeout) document.body.classList.add("ph-access-locked");
    this.render();
    const input = document.getElementById("ph-access-input");
    if (input) setTimeout(() => input.focus(), 120);
  },

  hideOverlay() {
    document.body.classList.remove("ph-access-active", "ph-access-locked");
    if (this.root) this.root.innerHTML = "";
  },

  showOverlay() {
    document.body.classList.add("ph-access-active");
  },

  unlock(fromWelcome) {
    this.unlocked = true;
    this.mode = "none";
    this.hideOverlay();
    this.startSessionMonitor();
    this.bindActivity();

    if (!this.appStarted) {
      this.appStarted = true;
      document.dispatchEvent(new CustomEvent("ph-access-granted"));
    }
  },

  lock() {
    if (!this.unlocked) return;
    this.unlocked = false;
    this.clearSession();
    this.showModal(true);
  },

  bindGlobalEvents() {
    if (this.globalBound) return;
    this.globalBound = true;

    document.addEventListener("click", (e) => {
      const langBtn = e.target.closest("[data-ph-access-lang]");
      if (langBtn && document.getElementById("ph-access-root")?.contains(langBtn)) {
        const lang = langBtn.dataset.phAccessLang;
        if (lang && lang !== PH_I18n.lang) PH_I18n.setLang(lang);
        return;
      }

      if (e.target.id === "ph-enter-demo") {
        this.showModal(false);
      }
    });

    document.addEventListener("submit", (e) => {
      if (e.target.id !== "ph-access-form") return;
      e.preventDefault();
      void this.handleSubmit();
    });
  },

  async handleSubmit() {
    const input = document.getElementById("ph-access-input");
    const error = document.getElementById("ph-access-error");
    const modal = document.getElementById("ph-access-modal");
    if (!input) return;

    let hash = "";
    try {
      hash = await this.hashInput(input.value);
    } catch {
      if (error) error.hidden = false;
      return;
    }

    if (hash === PH_ACCESS_CONFIG.passwordHash) {
      this.grantSession();
      this.unlock(this.mode === "welcome" || this.mode === "gate");
      return;
    }

    if (error) error.hidden = false;
    if (modal) {
      modal.classList.remove("ph-shake");
      void modal.offsetWidth;
      modal.classList.add("ph-shake");
    }
    input.value = "";
    input.focus();
  },

  bindActivity() {
    if (this.activityBound) return;
    this.activityBound = true;

    const events = ["mousemove", "click", "scroll", "keydown", "touchstart"];
    let throttle = 0;

    events.forEach((evt) => {
      document.addEventListener(evt, () => {
        const now = Date.now();
        if (now - throttle < 5000) return;
        throttle = now;
        this.touchActivity();
      }, { passive: true });
    });
  },

  startSessionMonitor() {
    if (this.checkTimer) return;
    this.checkTimer = setInterval(() => {
      if (!this.unlocked) return;
      if (!this.isSessionValid()) this.lock();
    }, 15000);
  },
};

document.addEventListener("DOMContentLoaded", () => {
  PH_ACCESS.init();
});
