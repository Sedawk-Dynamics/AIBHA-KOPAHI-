# Kopahi

A B2B2C marketplace for North-East-India agri-products — GI-tagged tea, raw honey, black rice, and regional spices sourced directly from farmer cooperatives.

## Architecture

Three apps in this monorepo:

```
kopahi-backend/   Express 5 + TypeScript + Prisma 6 + PostgreSQL 16
                  Listens on :5000. Serves /api/* and Swagger at /api/docs.

kopahi-frontend/  Next.js 16 + React 19 + Tailwind 4 customer site
                  Listens on :3000. Marketing pages, product catalog,
                  cart/checkout, customer dashboard, signup/login,
                  vendor signup at /vendor-signup.

kopahi-admin/     Vite 8 + React 19 + react-router-dom 7 + Axios
                  Listens on :3001. Admin and vendor dashboards.
                  Cross-origin from the customer site — admins/vendors
                  who log in on :3000 are redirected here.
```

The customer site and admin app share the same `kopahi_token` localStorage key, but because they're on different origins users sign in on each app once.

## Local development

### Prerequisites
- Node 20+
- PostgreSQL 16 listening on `127.0.0.1:5432` with a `kopahi` database, user `kopahi`, password `kopahi` (or supply your own `DATABASE_URL`).

### First run

```bash
# Backend
cd kopahi-backend
npm install
npx prisma migrate dev --name init    # apply schema
npm run seed                          # demo users, products, coupons, blog posts
npm run dev                           # :5000

# Customer site (new terminal)
cd kopahi-frontend
npm install
npm run dev                           # :3000

# Admin app (new terminal)
cd kopahi-admin
npm install
npm run dev                           # :3001
```

Then open:
- http://localhost:3000 — customer site
- http://localhost:3001 — admin/vendor app
- http://localhost:5000/api/docs — Swagger UI

### Demo credentials

After running `npm run seed` in the backend (password is `DemoPass!2026` for all three):

| Role     | Email                  | Where to sign in       |
|----------|------------------------|------------------------|
| Admin    | `admin@kopahi.com`     | either site            |
| Vendor   | `vendor@kopahi.com`    | either site            |
| Customer | `customer@kopahi.com`  | http://localhost:3000  |

After your first real users exist, **change the seed admin password** (or delete the demo admin row) — the demo password is publicly documented.

## Creating users

| Who        | How                                                                                                                                    |
|------------|----------------------------------------------------------------------------------------------------------------------------------------|
| Customer   | Self-signup at `/signup` on the customer site, or `POST /api/auth/register`.                                                           |
| Vendor     | Self-signup at `/vendor-signup`. Creates the account but **email must be verified before first login** (gate is enforced backend-side). |
| First admin| `npm run seed` in the backend. There is no public admin signup endpoint — by design.                                                    |
| More admins| Sign in as an existing admin and `POST /api/admin/users/create-admin`. Audit action: `admin.user_create_admin`.                         |
| More vendors (manual onboarding) | Sign in as admin and `POST /api/admin/users/create-vendor`. These vendors are created with `emailVerified: true` so they can sign in immediately. |

The standard signup endpoint (`/api/auth/register`) ignores any `role` field in the body and always creates a customer.

## End-to-end smoke test

A 13-step script that exercises the full stack lives at [scripts/smoke-test.ts](scripts/smoke-test.ts). With the backend running:

```bash
cd kopahi-backend
npm run smoke
```

The script signs up a customer + vendor, has the admin onboard a second vendor, places an order with a coupon, verifies stock decrement + restore on cancel, and confirms the login rate limit triggers on the 6th failed attempt. It uses fake `X-Forwarded-For` IPs so the rate-limit buckets stay separate per simulated user.

## Type-checking

```bash
# Each app independently
cd kopahi-backend  && npm run typecheck   # tsc --noEmit
cd kopahi-frontend && npx tsc --noEmit
cd kopahi-admin    && npx tsc -b --noEmit
```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) — covers Dokploy with a managed Postgres service plus a Compose project for the three apps.

## Repo layout

| Path                                  | What lives here                                                  |
|---------------------------------------|------------------------------------------------------------------|
| [kopahi-backend/src/routes/](kopahi-backend/src/routes/)         | All HTTP routes (auth, products, orders, admin, vendor, …)        |
| [kopahi-backend/src/db/](kopahi-backend/src/db/)                 | Repository layer over Prisma. `_shape.ts` adds the `_id = id` shim |
| [kopahi-backend/prisma/schema.prisma](kopahi-backend/prisma/schema.prisma)        | Data model (User, Product, Order, Review, Coupon, …)              |
| [kopahi-backend/openapi.yaml](kopahi-backend/openapi.yaml)        | OpenAPI doc, served at `/api/docs`                                |
| [kopahi-frontend/app/](kopahi-frontend/app/)                     | Customer site — Next App Router                                   |
| [kopahi-admin/src/pages/](kopahi-admin/src/pages/)               | Admin and vendor pages                                            |
| [kopahi-admin/src/lib/resources/](kopahi-admin/src/lib/resources/) | Typed API client (one module per resource)                        |
| [docker-compose.yml](docker-compose.yml)                         | Production compose (3 services on `dokploy-network`)              |
| [docker-compose.dev.yml](docker-compose.dev.yml)                 | Local-dev override that bundles a throwaway Postgres              |
| [scripts/smoke-test.ts](scripts/smoke-test.ts)                   | End-to-end smoke test                                             |
| [AUDIT.md](AUDIT.md)                                             | Phase 1 audit of the auth and admin surfaces                      |
