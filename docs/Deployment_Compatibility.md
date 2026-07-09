# Deployment Compatibility Report

Date: 2026-07-09

## Scope

This report validates that the active PADBS Digital Experience Platform application can be served from:

- Custom domain root: `https://demo.padbs.com/`
- GitHub Pages repository path: `https://padbsconsulting.github.io/digital-experience-platform/`

The audit covers active Ferreteria pages, shared core assets, theme assets, JavaScript navigation, cache-busting references, access gate behavior, ES/EN switching, and chart rendering.

## Result

PASS. The active application is compatible with both root-domain hosting and GitHub Pages repository-path hosting.

No runtime resource currently assumes `/digital-experience-platform/`, `github.io`, or `demo.padbs.com`.

## Path Strategy

The application uses relative paths for local pages and local assets:

- Page navigation uses relative document links such as `index.html`, `inventory.html`, and `launch.html`.
- Core assets load through relative references such as `core/app.js?v=1.0.0`.
- Theme assets load through relative references such as `themes/ferreteria/theme.css?v=1.0.0`.
- No `<base>` tag is used.
- No client-side router, `pushState`, or `replaceState` path rewriting is used.

This means the same static files resolve correctly whether the browser is at `/` or `/digital-experience-platform/`.

## Cache Busting

Local CSS and JavaScript references keep explicit cache-busting query parameters with `?v=1.0.0`.

External resources, including Google Fonts and Chart.js CDN, are intentionally absolute third-party URLs and are not part of the local deployment path contract.

## Browser Smoke Evidence

A local static server was exercised in two modes:

- Root-compatible mode: `/index.html`, `/inventory.html`, `/quotes.html`, `/credit.html`, `/suppliers.html`, `/dispatch.html`, `/launch.html`
- Repository-path mode: `/digital-experience-platform/index.html`, `/digital-experience-platform/inventory.html`, `/digital-experience-platform/quotes.html`, `/digital-experience-platform/credit.html`, `/digital-experience-platform/suppliers.html`, `/digital-experience-platform/dispatch.html`, `/digital-experience-platform/launch.html`

For each page:

- HTTP status was `200`.
- The access gate unlocked with `padbs7`.
- ES/EN switching changed localized page content.
- Local asset references remained relative and cache-busted.
- Internal links resolved under the current hosting path.
- No blocking console errors were observed.
- Chart canvases rendered where charts are present.

## Static Scan Evidence

The active runtime files were scanned for:

- Root-absolute local references such as `href="/..."` or `src="/..."`
- Hardcoded `/digital-experience-platform/`
- Hardcoded `demo.padbs.com`
- Hardcoded `github.io`
- `<base>` tags
- Client-side path routing through `location.href`, `window.location`, `pushState`, or `replaceState`

Result: no issues in active HTML, core JavaScript, or Ferreteria theme JavaScript.

The only repository-path references found are documentation/reference-only items outside the active runtime, including the preserved Padel House reference snapshot.

## Readiness

Custom domain root readiness: PASS.

GitHub Pages repository URL readiness: PASS.

No application refactor was required for deployment-path compatibility.

## Maintenance Rule

Future themes should continue to use relative local paths in HTML and theme contracts. Avoid root-absolute paths unless a deployment adapter is added intentionally and validated in QA.
