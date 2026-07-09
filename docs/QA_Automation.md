# QA Automation

This repository includes a lightweight QA layer to protect the PADBS Digital Experience Platform before adding more industry themes.

## Local Commands

Install dependencies:

```powershell
pnpm install
```

Prerequisite: `node` must be on `PATH`. GitHub Actions handles this automatically. In a bundled desktop runtime, prepend the provided Node `bin` directory to `PATH` before running pnpm scripts.

Validate config structure:

```powershell
pnpm run validate:config
```

Run syntax checks:

```powershell
pnpm run check:js
```

Run static QA:

```powershell
pnpm run qa:static
```

Run browser smoke QA:

```powershell
pnpm run qa:browser
```

Run all checks:

```powershell
pnpm run qa
```

## What Static QA Validates

- `config/active-theme.json` already passed `config/themes.schema.json`.
- All active root HTML pages exist.
- Internal root links resolve.
- Core assets exist and are referenced.
- Active theme assets exist and are referenced.
- Active core/theme assets use cache-busting query params.
- Access gate assets remain present.
- The configured access key still matches the active theme access hash.
- ES/EN content keys exist for every active page.
- Configured forbidden copy checks do not appear in the active theme.
- Configured domain vocabulary boundary checks do not appear inside `/core`.
- Fictional/sample-data posture remains visible.

## What Browser QA Validates

- Starts a local static server.
- Opens every active root page.
- Confirms the access gate appears.
- Unlocks with `padbs7`.
- Switches from ES to EN.
- Checks internal links.
- Checks cache-busted assets.
- Fails on page errors, console errors, and failed requests.
- Verifies chart canvases render nonblank pixels.

## GitHub Actions

The workflow at `.github/workflows/qa.yml` runs:

- dependency install with pnpm
- Playwright Chromium install
- config validation
- JavaScript syntax checks
- static QA
- browser smoke QA

## Known Limitations

- QA targets the single active theme declared in `config/active-theme.json`.
- Padel House is preserved as a reference snapshot and is not validated as an active `PADBS_THEME`.
- Browser QA checks smoke-level behavior and chart rendering, not visual polish screenshots.
- Future themes must be registered in the QA config before they are considered protected.

## Config Structure

The active QA target is defined in `config/active-theme.json`.

The structure is validated against `config/themes.schema.json` by `scripts/validate-config.js`.

Key fields:

- `activeThemeId`: must match `window.PADBS_THEME.id`.
- `themeFolder`: folder for the active theme.
- `themeContractFile`: JavaScript file that defines `window.PADBS_THEME`.
- `accessKey`: key used by browser QA and validated against the theme access hash.
- `activeHtmlPages`: root HTML pages, matching theme page ids, expected ES/EN titles, and expected chart canvas ids.
- `requiredCoreAssets`: shared assets every active page must load.
- `requiredThemeAssets`: active theme assets every active page must load.
- `syntaxCheckFiles`: reusable JavaScript files checked by `check:js`; theme JS files are added from `requiredThemeAssets`.
- `assetPathPrefixes`: prefixes that must use cache-busting query params.
- `accessGateAssets`: access gate assets that must remain present.
- `forbiddenCopyChecks`: regex patterns that must not appear in configured targets such as `theme`.
- `domainVocabularyBoundaryChecks`: regex patterns that must not appear in configured targets such as `core`.
- `fictionalDataPosture`: required safety signals and forbidden risky data-language patterns.

## What Config Validation Catches

- Missing required fields.
- Invalid field types.
- Invalid relative path shapes.
- Missing ES/EN expected titles.
- Missing page chart arrays.
- Missing copy and boundary check arrays.
- Invalid check targets.
- Duplicate active page files or theme page ids.
- Invalid JavaScript regex patterns in configured checks.

## Adding Future Themes

Before adding a new industry theme, update `config/active-theme.json` so the theme cannot bypass:

- schema validation
- root page existence checks
- ES/EN coverage checks
- Core vs Theme boundary scans
- fictional/sample-data posture checks
- browser smoke checks for all active pages

For each page, add:

- `file`: root HTML file.
- `themePageId`: matching `PADBS_THEME.pages[].id`.
- `expectedTitles.es` and `expectedTitles.en`: expected page header after language switch.
- `expectedCharts`: chart canvas ids expected on that page, or an empty array.

For boundary checks, add terms that are specific to the new industry under `domainVocabularyBoundaryChecks`. Keep reusable UI terms out of that list.

Run `pnpm run validate:config` before the rest of QA when editing the config.
