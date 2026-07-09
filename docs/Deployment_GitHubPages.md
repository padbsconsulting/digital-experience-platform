# Deployment: GitHub Pages

This project is a static site and is compatible with GitHub Pages.

## Requirements

- Keep `.nojekyll` at the repository root.
- Keep root HTML files for the active theme.
- Keep asset paths relative, for example `core/styles.css?v=1.0.0`.
- Keep cache-busting query strings on CSS and JavaScript files.
- Avoid build-only dependencies unless a future increment adds a build step.

## Deploy

1. Commit the repository.
2. Push to GitHub.
3. In repository settings, enable GitHub Pages from the desired branch and root folder.
4. Open the Pages URL and validate:
   - Access gate.
   - ES/EN language switch.
   - Navigation between all pages.
   - Charts render.
   - Cache-busted files load.

## Demo Access

The current demo key is:

```text
padbs7
```

This is a static gate for commercial demo privacy, not real authentication.

