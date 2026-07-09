# Padel House Digital Experience

Premium static demo for **Padel House**, a padel retail business in the Dominican Republic. This project shows how daily operations could feel after a digital transformation: sales, customers, inventory, loyalty, growth, products, and the in-store selling experience, all in one immersive walkthrough.

**Live demo:** `https://YOUR_USERNAME.github.io/padel-house/` *(replace after GitHub Pages is enabled)*

## What this is

A **commercial demo** built for client-facing review. It uses **sample data only** to help a business owner visualize priorities, validate what matters most, and imagine a future platform without committing to a full build.

This is **not** a production ERP, CRM, accounting system, fiscal invoicing tool, or real point-of-sale.

## Modules

| Module | File | Purpose |
|--------|------|---------|
| Executive Dashboard | `index.html` | How is the business doing today? |
| Customer Insights | `customer-insights.html` | Which customers deserve attention? |
| Inventory Intelligence | `inventory-intelligence.html` | Which products need action? |
| Sales Performance | `sales-performance.html` | Where are the sales opportunities? |
| Loyalty Program | `loyalty-program.html` | How can loyalty drive repeat purchases? |
| Growth Opportunities | `growth-opportunities.html` | Where could the business grow next? |
| Product Hub | `product-hub.html` | Which products are moving the business? |
| Experience Center | `experience-center.html` | How would selling feel with a digital platform? |

## Demo access

Before the application loads, visitors see a full-screen **Welcome Experience** with PADBS Consulting branding. Pressing **Enter Demo** / **Entrar a la demostración** opens an access gate. This is **lightweight access control for demonstrations**, not real authentication: there are no user accounts, no backend, and no external identity providers.

The gate compares a **SHA-256 hash** of the entered key against a stored hash in `js/access.js`. The plain key is not stored in the repository. Because all logic runs in the browser, this still does not protect against someone inspecting the published files. Share the access key only with authorized viewers through a private channel.

### Change the access key

1. Generate a SHA-256 hex digest of your new key (for example with `openssl dgst -sha256` or any trusted SHA-256 tool).
2. Replace `PH_ACCESS_CONFIG.passwordHash` in `js/access.js` with that digest.
3. Redeploy to GitHub Pages.

```javascript
const PH_ACCESS_CONFIG = {
  passwordHash: "your-64-character-sha256-hex-digest",
  timeoutMs: 30 * 60 * 1000,
};
```

Do not commit the plain key to the repository. `crypto.subtle` requires a secure context (HTTPS or `localhost`).

### Session timeout

After a successful login, the demo stores session state in `localStorage`:

- `padel-house-access-auth`
- `padel-house-access-session` (session start timestamp)
- `padel-house-access-activity` (last activity timestamp)

User activity (mouse, click, scroll, keyboard, touch) refreshes the last-activity timestamp. If **30 minutes** pass without activity, the demo locks: the application blurs behind a glass modal, the current page URL and language are preserved, and the browser does not reload. Re-enter the access key to continue.

Clearing site data or using a private window resets the session.

## Bilingual support

Spanish is the default language. English is available from the **ES / EN** toggle in the header or sidebar. The selected language is saved in `localStorage` and persists across pages and reloads.

## Sample data disclaimer

All names, figures, products, customers, and events in this demo are **fictional**. No real customer data, emails, phone numbers, or addresses are used. The Experience Center receipt is a **demo preview only** and has no fiscal value.

## Run locally

No build step or npm install required.

**Option 1: Open directly**

Open `index.html` in your browser.

**Option 2: Local server (recommended)**

```bash
python -m http.server 8080
```

Then visit `http://localhost:8080`

## Deploy to GitHub Pages

1. Push this repository to GitHub.
2. In **Settings > Pages**, set the source branch to `main` and folder to `/ (root)`.
3. Confirm `.nojekyll` exists at the repository root (already included).
4. After deployment, the site will be available at:

   `https://YOUR_USERNAME.github.io/padel-house/`

5. Update the live demo URL in this README once published.

## Asset cache busting

Local CSS and JS files in every HTML entry point include a release query string (currently `?v=1.1.0`). This helps browsers fetch fresh assets after GitHub Pages deployments instead of serving stale cached files.

When you ship a new release, increment the version in **all 8 HTML files** and update `PH_RELEASE_VERSION` in `js/app.js`. External CDN URLs (Google Fonts, Chart.js) are left unchanged unless the CDN URL itself includes a version.

## Tech stack

- HTML5, CSS3, vanilla JavaScript
- Custom i18n layer (`js/i18n.js`) with `localStorage` persistence
- [Chart.js 4](https://www.chartjs.org/) via CDN on analytics pages only
- [Google Fonts](https://fonts.google.com/): Plus Jakarta Sans and Bricolage Grotesque
- Fully responsive layout with mobile sidebar

## Project structure

```
css/styles.css       Global styles
css/access.css       Welcome screen and demo access gate
js/i18n.js           ES/EN translations and language manager
js/access.js         Demo access gate, session timeout, localStorage
js/data.js           Mock data (language-neutral where possible)
js/app.js            Shell, navigation, language toggle
js/pages.js          Analytics page renderers
js/charts.js         Chart.js configs (re-render on language change)
js/store.js          Product Hub and Experience Center
js/hub-ops.js        Product Hub operational simulation
js/pos-ops.js        Experience Center operational simulation
.nojekyll            GitHub Pages compatibility
DEMO_SCRIPT.md       Client presentation guide
```

## Limitations

- Static front-end only: no backend, database, or data persistence beyond language preference and demo session state
- Demo access uses a client-side SHA-256 hash check and is not suitable for protecting sensitive data
- Charts and POS totals use mock data and simplified business rules
- External CDNs required for Google Fonts and Chart.js (analytics pages)
- Not optimized for offline use
- Designed for presentation and discovery, not operational use

## Presenting to a client

See [DEMO_SCRIPT.md](DEMO_SCRIPT.md) for a suggested 5-minute walkthrough, talking points, and closing questions.

---

Demo project · Padel House · República Dominicana
