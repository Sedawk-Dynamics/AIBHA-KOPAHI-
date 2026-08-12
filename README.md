# Kopahi

The kopahi.com brand site for AIBA Agri NE LLP — GI-tagged tea, spices, rice
and heritage produce from Northeast India, sourced through farmer cooperatives
and FPOs.

## Architecture (hybrid model)

```
kopahi.com          kopahi-frontend/ (this repo) — Next.js 16 + React 19 +
                    Tailwind 4 brand site: Home, About, Farmers, B2B, Contact,
                    Sustainability, Privacy, Terms. Listens on :3000.

shop.kopahi.com     WordPress + WooCommerce + Dokan Lite (deployed separately,
                    NOT in this repo): shop, cart, checkout, customer accounts,
                    FPO/vendor dashboards, blog, districts.
                    Custom behavior lives in WPCode snippets — reference
                    copies in kopahi-wordpress/.

crm.kopahi.com      Webelio CRM — receives B2B leads from the kopahi.com/b2b
                    form (embedded web-to-lead iframe).
```

Every commerce link in the frontend derives from `SHOP_URL` in
`kopahi-frontend/app/lib/shop.ts`. Retired routes (old /products catalog,
cart, auth, dashboards) permanently redirect to their shop.kopahi.com
equivalents via `next.config.ts`.

`/journal` is temporarily still served by the frontend — its essays are being
migrated into the WordPress blog; delete `app/journal/` and restore the
/journal redirects in `next.config.ts` once migration is complete.

## Local development

```bash
cd kopahi-frontend
npm install
npm run dev   # http://localhost:3000
```

No environment variables are required.

## Deployment

Dokploy builds `docker-compose.yml` (single `frontend` service) on push to
`main`. The only required Dokploy env var is `FRONTEND_HOST` (e.g.
`kopahi.com`).

## History

This repo previously contained a full custom marketplace (Express backend,
Postgres, Vite admin SPA). That stack was retired in favor of the WordPress
shop — see git history before the `cleanup/hybrid-model` merge if you need it.
