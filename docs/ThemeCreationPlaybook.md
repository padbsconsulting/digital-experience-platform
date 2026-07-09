# Theme Creation Playbook

Use this playbook to create the next PADBS industry theme.

## 1. Start From The Core

Do not duplicate the application framework. Keep these shared:

- Navigation rendering.
- Layout.
- Access gate.
- ES/EN i18n runtime.
- Storytelling journey.
- KPI cards.
- Charts.
- CTA blocks.
- Roadmap and ROI sections.
- GitHub Pages static deployment.

## 2. Create A Theme Folder

Create:

```text
themes/<industry>/
  theme.js
  theme.css
```

`theme.js` must define `window.PADBS_THEME`.

## 3. Replace Only The Theme Layer

Theme-owned elements:

- Business domain.
- Commercial narrative.
- Mock data.
- Visual identity accents.
- Vocabulary.
- Specific modules.
- Commercial scenarios.
- Value proposition.

## 4. Avoid Product-Build Drift

Do not create generic CRUD screens, raw admin forms, or heavy ERP menus. The demo should help a decision-maker imagine a better operating model and a practical consulting path.

## 5. Keep It Bilingual

Every visible string must exist in Spanish and English. Default language is Spanish.

## 6. Validate Before Delivery

- Access gate works.
- Language switch works.
- Navigation works.
- Charts render.
- GitHub Pages paths work.
- All data is fictional.
- The theme clearly supports a PADBS 7-Day Launch conversation.

Run the automated QA layer before delivery:

```powershell
pnpm run qa
```

If a future theme adds pages, modules, root HTML files, theme assets, or chart canvases, update `config/active-theme.json` in the same change so the new theme cannot bypass validation.

## 7. Register The Theme For QA

Update `config/active-theme.json`:

- Set `activeThemeId` to the theme id.
- Set `themeFolder` and `themeContractFile`.
- Add every root HTML page to `activeHtmlPages`.
- Map each page to its `themePageId`.
- Provide expected ES/EN page titles.
- List expected chart canvas ids per page.
- Define required theme assets.
- Define forbidden copy checks from other themes.
- Define domain vocabulary terms that must not leak into `/core`.
- Define fictional/sample-data posture signals.

Run:

```powershell
pnpm run validate:config
pnpm run check:js
pnpm run qa:static
pnpm run qa:browser
```

`config/themes.schema.json` defines the required config structure. If validation fails, fix the config before changing QA scripts.
