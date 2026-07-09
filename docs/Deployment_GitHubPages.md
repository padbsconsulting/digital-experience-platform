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

## Custom Domain

The public custom domain is:

```text
https://demo.padbs.com/
```

The repository includes a root `CNAME` file with the custom domain value. Keep that file committed so GitHub Pages preserves the custom domain setting across deployments.

In GitHub Pages settings:

1. Set the custom domain to `demo.padbs.com`.
2. Enable **Enforce HTTPS** after DNS validation completes.
3. Confirm `http://demo.padbs.com/` redirects to `https://demo.padbs.com/`.
4. Re-run browser QA against the live domain after activation.

Deployment-path compatibility depends on relative local paths such as `core/styles.css?v=1.0.0` and `themes/ferreteria/theme.css?v=1.0.0`. Do not hardcode `/digital-experience-platform/` in runtime HTML, JavaScript, or theme assets.

## Demo Access

The current demo key is:

```text
padbs7
```

This is a static gate for commercial demo privacy, not real authentication.
