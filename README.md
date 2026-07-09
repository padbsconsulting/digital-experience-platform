# PADBS Digital Experience Platform

Reusable demo factory for PADBS Consulting commercial digital experiences.

This repository turns the validated Padel House Digital Experience pattern into a reusable platform where the Core Framework stays shared and each Industry Theme supplies the business story, bilingual copy, fictional data, visual identity, and domain-specific scenarios.

## Current Active Theme

**Ferretería Digital Experience** is the active deployed theme.

It helps a hardware store owner visualize operational modernization across inventory, quotations, frequent customers, customer credit, suppliers, purchases, branches, cash-register context, dispatch, high-rotation products, construction materials, and centralized control.

This is a commercial consulting demo, not an ERP product and not a CRUD admin system.

## PADBS 7-Day Launch

The active experience is positioned to support a PADBS 7-Day Launch conversation:

- clarify the owner’s operational priorities
- map current sources such as Mónica, spreadsheets, and WhatsApp workflows
- create a first navigable executive view
- validate the next implementation step without overbuilding

## Demo Access

Static demo access key:

```text
padbs7
```

The access gate is for demo privacy only. It is not production authentication.

## Data Policy

All demo names, suppliers, customers, values, products, quantities, and operational events are fictional and illustrative. Do not add private customer data or production operational data to this repository.

## Run Locally

Serve the repository root over local HTTP:

```powershell
python -m http.server 8080
```

Then visit:

```text
http://localhost:8080/
```

## QA

Install dependencies once:

```powershell
pnpm install
```

The QA commands expect `node` to be on `PATH`. GitHub Actions handles this automatically through `actions/setup-node`.

Run the repeatable checks:

```powershell
pnpm run validate:config
pnpm run check:js
pnpm run qa:static
pnpm run qa:browser
```

Or run everything:

```powershell
pnpm run qa
```

What QA validates:

- theme config schema
- JavaScript syntax
- root page existence
- internal links
- core and theme assets
- cache-busted asset references
- access gate references and access key hash
- ES/EN content coverage
- Core vs Theme boundaries
- forbidden copy leakage
- fictional/sample-data posture
- browser smoke behavior and chart rendering

QA is configured through:

```text
config/active-theme.json
```

The config is structurally validated by:

```text
config/themes.schema.json
```

See [config/README.md](config/README.md) for future theme registration instructions.

## GitHub Actions

The workflow at `.github/workflows/qa.yml` is ready for the first public push. It runs:

- pnpm install
- Playwright Chromium install
- config validation
- JavaScript syntax checks
- static QA
- browser smoke QA

## GitHub Pages Deployment

This is a static site. No build step is required.

After pushing to GitHub:

1. Open the repository settings.
2. Go to **Pages**.
3. Set **Source** to **Deploy from a branch**.
4. Select the deployment branch, usually `main`.
5. Select the root folder `/`.
6. Save.
7. Open the generated GitHub Pages URL and run a quick manual check:
   - access gate opens
   - `padbs7` unlocks
   - ES/EN switch works
   - all pages navigate
   - charts render

The `.nojekyll` file is included so GitHub Pages serves the static files directly.

## Structure

```text
core/
  access.css
  access.js
  app.js
  charts.js
  i18n.js
  styles.css
config/
  README.md
  active-theme.json
  themes.schema.json
themes/
  ferreteria/
    theme.css
    theme.js
  padel-house/
    reference/
shared/
  assets/
docs/
  CoreFramework.md
  Deployment_GitHubPages.md
  IndustryTheme_Ferreteria.md
  QA_Automation.md
  QA_Report_Ferreteria.md
  ThemeCreationPlaybook.md
scripts/
  check-js.js
  config.js
  validate-config.js
  qa-static.js
  qa-browser.js
.github/workflows/
  qa.yml
```

## Padel House Reference

`themes/padel-house/reference` preserves the commercially validated Padel House demo as a reference snapshot. It has not yet been converted into the `PADBS_THEME` contract.
