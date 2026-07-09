# Core Framework

The Core Framework is the reusable layer shared by industry themes.

## Core Responsibilities

- Static GitHub Pages-compatible page shells.
- Access gate and session timeout.
- ES/EN language switch.
- Navigation and mobile sidebar.
- Shared layout, cards, KPI blocks, journey chips, tables, progress rows, CTA blocks, roadmap, and ROI conversation sections.
- Theme-driven rendering from `window.PADBS_THEME`.
- Chart.js adapter for common executive and operational charts.
- Cache-busted asset references using `?v=1.0.0`.

## Core Files

- `core/app.js`: renders navigation, headers, journeys, shared cards, KPI grids, tables, roadmap, CTA, and page content.
- `core/i18n.js`: language storage, translation lookup, locale handling.
- `core/access.js`: static demo access gate with hashed key and activity timeout.
- `core/charts.js`: shared Chart.js setup.
- `core/styles.css`: reusable PADBS premium layout and components.
- `core/access.css`: reusable access gate presentation.

## Boundaries

The core should not contain hardware-store-specific words, Padel House terms, customer names, mock KPIs, product categories, or commercial scenarios.

If a future theme needs a new reusable pattern, add it to core only when it is broadly useful across industries.

