# Vercel specific deployment notes

This project is deployed to my.hypexvpn.com using Vercel. The following file
configures rewrites and caching behavior to ensure SPA routing works and
assets are cached appropriately.

- All non-file routes are rewritten to /index.html to support deep links and refreshing of client-side routes.
- index.html is set to no-cache to ensure clients always get the latest HTML.
- Static assets (JS/CSS/images/fonts) are cached long-term with immutable header.

If you change deployment domain or use a sub-path deployment, update vite.base and the router basename accordingly.
