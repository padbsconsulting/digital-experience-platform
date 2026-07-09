# Theme QA Config

`active-theme.json` declares the single active industry theme that the QA layer validates.

The file is intentionally explicit. Future themes should be registered here before deployment so they cannot bypass root page checks, language coverage, asset checks, access gate checks, boundary scans, fictional-data posture checks, or browser smoke tests.

## Required Fields

- `activeThemeId`: must match `window.PADBS_THEME.id`.
- `themeFolder`: folder containing the active theme assets.
- `themeContractFile`: JavaScript file that defines `window.PADBS_THEME`.
- `accessKey`: demo key used by browser QA and validated against the theme hash.
- `languages`: currently `["es", "en"]`.
- `activeHtmlPages`: every root HTML page in the deployed active demo.
- `requiredCoreAssets`: shared assets every active page must load.
- `requiredThemeAssets`: active theme assets every active page must load.
- `syntaxCheckFiles`: reusable JavaScript files checked by `pnpm run check:js`.
- `assetPathPrefixes`: asset prefixes that must include cache-busting query params.
- `accessGateAssets`: assets required for the access gate.
- `forbiddenCopyChecks`: copy that must not appear in the configured target.
- `domainVocabularyBoundaryChecks`: industry vocabulary that must not leak into `/core`.
- `fictionalDataPosture`: visible safety signals and risky data-language patterns.

## Page Entries

Each `activeHtmlPages` item must define:

```json
{
  "file": "inventory.html",
  "themePageId": "inventory",
  "expectedTitles": {
    "es": "Inventario y rotación",
    "en": "Inventory and turnover"
  },
  "expectedCharts": ["stockByCategoryChart", "turnoverChart"]
}
```

- `file` is the root HTML file.
- `themePageId` maps to `PADBS_THEME.pages[].id`, `PADBS_THEME.i18n`, and `PADBS_THEME.data`.
- `expectedTitles` are the page headers browser QA expects after language switching.
- `expectedCharts` lists canvas ids that must render on that page. Use an empty array for pages without charts.

## Boundary Checks

Use `forbiddenCopyChecks` to prevent copy from another theme appearing in the active theme. Example:

```json
{
  "name": "Padel House copy must not appear in active theme",
  "target": "theme",
  "patterns": ["Padel", "Bullpadel", "Padel Club"]
}
```

Use `domainVocabularyBoundaryChecks` to prevent active-theme vocabulary from leaking into `/core`. Example:

```json
{
  "name": "Active theme business vocabulary must not appear in /core",
  "target": "core",
  "patterns": ["Ferreter", "cemento", "despacho", "sucursal"]
}
```

Targets can be `theme`, `core`, or `all`.

## Fictional/Sample Data Rules

`fictionalDataPosture.requiredSignals` should include terms that prove the demo is positioned as illustrative. `signalPaths` points to copy inside `window.PADBS_THEME` where those terms should appear.

`forbiddenRiskyPatterns` should include phrases that would imply production customer data is present.

## Copy-Safe Second Theme Example

This example is not active. It shows the fields to change when a future theme is ready:

```json
{
  "activeThemeId": "restaurant",
  "themeFolder": "themes/restaurant",
  "themeContractFile": "themes/restaurant/theme.js",
  "accessKey": "padbs7",
  "languages": ["es", "en"],
  "activeHtmlPages": [
    {
      "file": "index.html",
      "themePageId": "executive",
      "expectedTitles": {
        "es": "Panorama del restaurante",
        "en": "Restaurant overview"
      },
      "expectedCharts": ["salesTrendChart"]
    }
  ],
  "requiredCoreAssets": [
    "core/styles.css",
    "core/access.css",
    "core/i18n.js",
    "core/access.js",
    "core/app.js",
    "core/charts.js"
  ],
  "requiredThemeAssets": [
    "themes/restaurant/theme.css",
    "themes/restaurant/theme.js"
  ],
  "syntaxCheckFiles": [
    "core/app.js",
    "core/access.js",
    "core/charts.js",
    "core/i18n.js",
    "scripts/validate-config.js",
    "scripts/check-js.js",
    "scripts/qa-static.js",
    "scripts/qa-browser.js"
  ],
  "assetPathPrefixes": ["core/", "themes/restaurant/"],
  "accessGateAssets": ["core/access.css", "core/access.js"],
  "forbiddenCopyChecks": [
    {
      "name": "Other theme copy must not appear in restaurant theme",
      "target": "theme",
      "patterns": ["Ferreter", "Padel", "cemento"]
    }
  ],
  "domainVocabularyBoundaryChecks": [
    {
      "name": "Restaurant vocabulary must not appear in /core",
      "target": "core",
      "patterns": ["mesa", "cocina", "reservación", "delivery"]
    }
  ],
  "fictionalDataPosture": {
    "requiredSignals": ["ficticios", "fictional", "no real customer"],
    "forbiddenRiskyPatterns": ["use real customer data", "trial real data"],
    "signalPaths": [
      "i18n.es.brand.mockData",
      "i18n.en.brand.mockData",
      "i18n.es.access.modal.securityNote",
      "i18n.en.access.modal.securityNote"
    ]
  }
}
```

Run `pnpm run validate:config` after editing the config.
