const PADBS_THEME = window.PADBS_THEME;
const PADBS_LANG_KEY = `${PADBS_THEME.id}-lang`;

const PADBS_I18n = {
  lang: "es",
  init() {
    const saved = localStorage.getItem(PADBS_LANG_KEY);
    this.lang = saved === "en" ? "en" : "es";
    document.documentElement.lang = this.lang;
  },
  getLocale() {
    return this.lang === "en" ? "en-US" : "es-DO";
  },
  setLang(lang) {
    if (!["es", "en"].includes(lang)) return;
    this.lang = lang;
    localStorage.setItem(PADBS_LANG_KEY, lang);
    document.documentElement.lang = lang;
    if (typeof PADBS_onLanguageChange === "function") PADBS_onLanguageChange();
  },
  t(path) {
    const keys = path.split(".");
    let node = PADBS_THEME.i18n[this.lang];
    for (const key of keys) {
      if (node == null) return path;
      node = node[key];
    }
    return node ?? path;
  },
  text(value) {
    if (value && typeof value === "object") return value[this.lang] || value.es || value.en || "";
    return value ?? "";
  },
  months(count = 7) {
    return this.t("common.monthsShort").slice(0, count);
  },
};

PADBS_I18n.init();
