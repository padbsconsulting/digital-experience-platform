const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const vm = require("vm");
const { root, loadConfig, readRoot, existsRoot, resolveRoot } = require("./config");

const config = loadConfig();
const failures = [];

function fail(message, details = "") {
  failures.push(details ? `${message}: ${details}` : message);
}

function normalizeAsset(ref) {
  return ref.split("?")[0].replace(/\//g, path.sep);
}

function extractRefs(html) {
  return [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
}

function loadTheme() {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(readRoot(config.themeContractFile), context, {
    filename: config.themeContractFile
  });
  return context.window.PADBS_THEME;
}

function scanFiles(relDir, extensions) {
  const out = [];
  const start = resolveRoot(relDir);
  const stack = [start];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(full);
      if (entry.isFile() && extensions.includes(path.extname(entry.name))) out.push(full);
    }
  }
  return out;
}

function compilePatterns(patterns) {
  return patterns.map((pattern) => new RegExp(pattern, "i"));
}

function getByPath(source, dottedPath) {
  return dottedPath.split(".").reduce((node, key) => node?.[key], source);
}

function textForTarget(target, themeText, coreText) {
  if (target === "theme") return themeText;
  if (target === "core") return coreText;
  if (target === "all") return `${themeText}\n${coreText}`;
  return "";
}

const activePages = config.activeHtmlPages.map((page) => page.file);
const rootHtmlNames = new Set(activePages);

for (const page of activePages) {
  if (!existsRoot(page)) fail("Missing root HTML page", page);
}

const htmlByPage = new Map(activePages.map((page) => [page, readRoot(page)]));

for (const [page, html] of htmlByPage) {
  for (const asset of [...config.requiredCoreAssets, ...config.requiredThemeAssets]) {
    if (!html.includes(`${asset}?v=`)) {
      fail("Required asset missing or not cache-busted", `${page} -> ${asset}`);
    }
  }

  for (const asset of config.accessGateAssets) {
    if (!html.includes(`${asset}?v=`)) fail("Access gate asset missing", `${page} -> ${asset}`);
  }

  const refs = extractRefs(html);
  const localRefs = refs.filter((ref) => {
    return !ref.startsWith("http") &&
      !ref.startsWith("mailto:") &&
      !ref.startsWith("data:") &&
      !ref.startsWith("#");
  });

  for (const ref of localRefs) {
    const clean = normalizeAsset(ref);
    if (!existsRoot(clean)) fail("Local reference does not resolve", `${page} -> ${ref}`);
  }

  const activeAssetRefs = refs.filter((ref) => config.assetPathPrefixes.some((prefix) => ref.startsWith(prefix)));
  for (const ref of activeAssetRefs) {
    if (!/\?v=\d+\.\d+\.\d+/.test(ref)) fail("Asset missing cache-busting query", `${page} -> ${ref}`);
    if (!existsRoot(normalizeAsset(ref))) fail("Asset reference does not exist", `${page} -> ${ref}`);
  }

  for (const ref of refs.filter((ref) => rootHtmlNames.has(ref))) {
    if (!existsRoot(ref)) fail("Internal root link is broken", `${page} -> ${ref}`);
  }
}

for (const asset of [...config.requiredCoreAssets, ...config.requiredThemeAssets]) {
  if (!existsRoot(asset)) fail("Required asset file missing", asset);
}

const theme = loadTheme();
if (!theme || theme.id !== config.activeThemeId) {
  fail("Active theme contract did not load or id mismatch", `${theme?.id || "missing"} !== ${config.activeThemeId}`);
}

const configuredPageIds = config.activeHtmlPages.map((page) => page.themePageId);
const themePageIds = theme?.pages?.map((page) => page.id) || [];
const themePageHrefById = Object.fromEntries((theme?.pages || []).map((page) => [page.id, page.href]));

for (const id of configuredPageIds) {
  if (!themePageIds.includes(id)) fail("Configured page id is missing from theme.pages", id);
  if (!themePageHrefById[id] || !existsRoot(themePageHrefById[id])) {
    fail("Theme page href missing or broken", `${id} -> ${themePageHrefById[id]}`);
  }
  for (const lang of config.languages) {
    const langRoot = theme.i18n?.[lang];
    if (!langRoot) fail("Missing language root", lang);
    if (!langRoot?.meta?.[id]) fail("Missing meta i18n key", `${lang}.${id}`);
    if (!langRoot?.nav?.[id]) fail("Missing nav i18n key", `${lang}.${id}`);
    if (!langRoot?.[id]) fail("Missing page i18n section", `${lang}.${id}`);
  }
  if (!theme.data?.[id]) fail("Missing page data section", id);
}

for (const page of config.activeHtmlPages) {
  for (const lang of config.languages) {
    if (!page.expectedTitles?.[lang]) fail("Missing expected browser title in config", `${page.file}.${lang}`);
  }
}

const hash = crypto.createHash("sha256").update(config.accessKey).digest("hex");
if (theme.access?.passwordHash !== hash) fail("Access key hash does not match configured key");

const themeText = config.requiredThemeAssets
  .filter((asset) => [".js", ".css"].includes(path.extname(asset)))
  .map((asset) => readRoot(asset))
  .join("\n");
const coreText = scanFiles("core", [".js", ".css"]).map((file) => fs.readFileSync(file, "utf8")).join("\n");

for (const check of config.forbiddenCopyChecks) {
  const targetText = textForTarget(check.target, themeText, coreText);
  for (const pattern of compilePatterns(check.patterns)) {
    if (pattern.test(targetText)) fail(check.name, pattern.toString());
  }
}

for (const check of config.domainVocabularyBoundaryChecks) {
  const targetText = textForTarget(check.target, themeText, coreText);
  for (const pattern of compilePatterns(check.patterns)) {
    if (pattern.test(targetText)) fail(check.name, pattern.toString());
  }
}

const postureSignals = config.fictionalDataPosture.signalPaths
  .map((signalPath) => getByPath(theme, signalPath))
  .filter(Boolean)
  .join(" ");

if (!compilePatterns(config.fictionalDataPosture.requiredSignals).some((pattern) => pattern.test(postureSignals))) {
  fail("Fictional/sample data posture is not visible in configured signal copy");
}

for (const pattern of compilePatterns(config.fictionalDataPosture.forbiddenRiskyPatterns)) {
  if (pattern.test(themeText)) fail("Theme contains risky real-data language", pattern.toString());
}

const report = {
  status: failures.length ? "FAIL" : "PASS",
  activeThemeId: config.activeThemeId,
  themeFolder: config.themeFolder,
  activePages,
  themePages: configuredPageIds,
  checks: {
    rootPages: activePages.length,
    coreAssets: config.requiredCoreAssets.length,
    themeAssets: config.requiredThemeAssets.length,
    cacheBusting: true,
    accessKey: config.accessKey,
    languages: config.languages
  },
  failures
};

console.log(JSON.stringify(report, null, 2));

if (failures.length) process.exitCode = 1;
