# Deploying Kopahi on Dokploy

The deployment uses **two separate Dokploy services**:

1. A managed **PostgreSQL Database** service (Dokploy's built-in DB type)
2. A **Compose** service that bundles the backend + frontend + admin

Both join the `dokploy-network` so the apps reach the DB by its internal
hostname (no public port needed).

---

## 0. Prerequisites

- A Dokploy server (self-hosted) with the dashboard accessible.
- A domain you control (e.g. `aibaagri.sedawk.cloud`) with the ability to add
  three A-records.
- This GitHub repo: `https://github.com/Sedawk-Dynamics/AIBHA-KOPAHI-`

## 1. DNS

Add three A-records pointing to your Dokploy server's public IP:

| Hostname | Type | Points to |
|---|---|---|
| `aibaagri.sedawk.cloud` | A | Dokploy server IP |
| `admin.aibaagri.sedawk.cloud` | A | Dokploy server IP |
| `api.aibaagri.sedawk.cloud` | A | Dokploy server IP |

Substitute your own subdomains as needed — they just have to match the
`*_HOST` env vars below.

## 2. Create the PostgreSQL service

1. Dokploy → Project (e.g. **AIBHA**) → **Create service → Database → PostgreSQL**.
2. Name it `db`.
3. Choose Postgres version (16+).
4. Set:
   - **Database name**: `kopahi`
   - **User**: `kopahi`
   - **Password**: a strong random string
5. Deploy.
6. Once it's running, open the service page and copy the **internal
   connection URL** — it looks like:
   ```
   postgresql://kopahi:<password>@db:5432/kopahi?schema=public
   ```
   (the host part is whatever Dokploy assigns — `db` if you named it that, or
   sometimes a generated name like `aibha-db-abc123`).

## 3. Create the Compose service

1. Same project → **Create service → Compose**.
2. **Provider**: GitHub. Connect this repo, branch `main`.
3. **Compose path**: `docker-compose.yml`.

## 4. Set environment variables on the Compose service

In the Compose service's **Environment** tab paste this, substituting your values:

```env
# DB connection — from the db service in step 2
DATABASE_URL=postgresql://kopahi:<password>@db:5432/kopahi?schema=public

# Auth
JWT_SECRET=<openssl rand -hex 48>
JWT_EXPIRES_IN=30d
LOG_LEVEL=info

# Public hostnames (no scheme, no trailing slash)
FRONTEND_HOST=aibaagri.sedawk.cloud
ADMIN_HOST=admin.aibaagri.sedawk.cloud
API_HOST=api.aibaagri.sedawk.cloud

# Inter-service / browser-facing URLs (with https://)
FRONTEND_URL=https://aibaagri.sedawk.cloud
ADMIN_URL=https://admin.aibaagri.sedawk.cloud
NEXT_PUBLIC_API_URL=https://api.aibaagri.sedawk.cloud
NEXT_PUBLIC_ADMIN_URL=https://admin.aibaagri.sedawk.cloud

# Optional — uncomment / fill in as needed
# SMTP_HOST=
# SMTP_PORT=587
# SMTP_USER=
# SMTP_PASS=
# CLOUDINARY_CLOUD_NAME=
# CLOUDINARY_API_KEY=
# CLOUDINARY_API_SECRET=
# RAZORPAY_KEY_ID=
# RAZORPAY_KEY_SECRET=
```

> **Important:** the `NEXT_PUBLIC_*` vars are baked into the JavaScript bundle
> at **build time**. If you change them, click **Redeploy** (a restart alone
> won't pick them up).

## 5. Map domains

The `docker-compose.yml` already declares Traefik labels for each public
service, so domains route by `Host()` rule. You **also** want to add them to
the Dokploy **Domains** tab so the UI shows DNS validation status:

| Domain | Service | Port | HTTPS |
|---|---|---|---|
| `aibaagri.sedawk.cloud` | `frontend` | 3000 | ✓ |
| `admin.aibaagri.sedawk.cloud` | `admin` | 80 | ✓ |
| `api.aibaagri.sedawk.cloud` | `backend` | 5000 | ✓ |

## 6. Deploy

Hit **Deploy** on the Compose service. Dokploy will:

1. Build all three Docker images (`backend`, `frontend`, `admin`).
2. Bring them up on `dokploy-network`.
3. Apply Traefik routing (declared in compose labels).
4. Backend's start command is `npx prisma migrate deploy && node dist/server.js`,
   so migrations run automatically on first boot. Idempotent across redeploys.

## 7. Seed the database (one-time)

Compose service → backend → **Terminal** tab → run:

```bash
npx prisma db seed
```

Wait for `Seeded users, categories, products, coupons, blog posts.` Demo logins
(password `DemoPass!2026`):
- `admin@kopahi.com`
- `vendor@kopahi.com`
- `customer@kopahi.com`

> **Important — change the seed admin password before going live.** The seed
> hashes a publicly-documented password. As soon as you have a real admin,
> sign in with the demo admin once and either:
> - `PATCH /api/auth/me/password` to set a new password, or
> - delete the demo admin user via `DELETE /api/admin/user/<id>`.
>
> Same applies to the demo vendor and customer rows if you keep them around.

## 7a. Onboarding more admins and vendors

Public signup is **customer-only** — the standard `/api/auth/register`
endpoint strips any `role` field and always creates a customer.

| Who                | How                                                                                  |
|--------------------|--------------------------------------------------------------------------------------|
| Customers          | `/signup` on the customer site or `POST /api/auth/register`.                          |
| Self-serve vendors | `/vendor-signup` on the customer site → `POST /api/auth/register-vendor`. Vendor accounts are created with `emailVerified: false`; the vendor must verify before their first login (server returns `403 EMAIL_NOT_VERIFIED` otherwise). |
| Manual vendor onboarding | Sign in as admin and `POST /api/admin/users/create-vendor`. Created with `emailVerified: true` so they can sign in immediately. Audit action: `admin.user_create_vendor`. |
| Additional admins  | Sign in as admin and `POST /api/admin/users/create-admin`. Audit action: `admin.user_create_admin`. |

## 8. Verify

- `https://api.aibaagri.sedawk.cloud/api/health` → `{"success":true,"uptime":...}`
- `https://api.aibaagri.sedawk.cloud/api/docs` → Swagger UI
- `https://aibaagri.sedawk.cloud` → customer site
- `https://admin.aibaagri.sedawk.cloud` → admin login → sign in as admin → land on `/admin`

## 8a. Rate limits

The backend enforces an in-memory IP-based limiter on the auth surface
(see [authRoutes.ts](kopahi-backend/src/routes/authRoutes.ts)):

| Endpoint                       | Window  | Max | Notes                                                            |
|--------------------------------|---------|-----|------------------------------------------------------------------|
| `POST /api/auth/register`      | 15 min  | 5   | Shared `credentialLimiter`                                       |
| `POST /api/auth/register-vendor` | 15 min | 5  | Shared `credentialLimiter`                                       |
| `POST /api/auth/login`         | 15 min  | 5   | Shared `credentialLimiter`                                       |
| `POST /api/auth/forgot-password` | 60 min | 5  | `passwordResetLimiter`                                           |
| `POST /api/auth/reset-password`  | 60 min | 5  | Shares `passwordResetLimiter`                                    |
| `POST /api/contact`            | 15 min  | 10  |                                                                  |

Limits are per IP. The server has `app.set("trust proxy", 1)` so it reads
the first `X-Forwarded-For` hop from Traefik / Nginx. If you put another
proxy layer in front, raise that number to match the hop count or the
limiter will key off the inner-most proxy's IP and rate-limit everyone
together.

The store is in-process — restarting the backend resets all buckets.
For production-grade limiting across multiple replicas, swap in a Redis
store (`rate-limit-redis`).

## 9. (Optional) PostgreSQL backups

Dokploy's managed Database service has its own **Backups** tab — schedule
daily `pg_dump` to S3-compatible storage. The Postgres volume already persists
across restarts; backups protect against human error.

---

## Local development

```bash
# From the repo root — uses a throwaway Postgres in the override file
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

Or without Docker:
```bash
# Postgres on host (or via npx ts-node kopahi-backend/scripts/start-pg.ts)
cd kopahi-backend && npm install && npx prisma migrate dev && npm run seed && npm run dev   # :5000
cd ../kopahi-frontend && npm install && npm run dev                                          # :3000
cd ../kopahi-admin && npm install && npm run dev                                             # :3001
```

## Troubleshooting

**Frontend builds but renders against the wrong API URL.**
You changed `NEXT_PUBLIC_API_URL` after the first deploy without rebuilding.
Click **Redeploy** in Dokploy — Next.js bakes those vars into the bundle at build time.

**`Could not reach the server` from the admin app.**
CORS rejecting it. Check that `ADMIN_URL` env on the backend matches the actual
admin domain (no trailing slash, correct scheme). Backend logs will show
`CORS: origin … not allowed`.

**Black `404 page not found` page.**
That's Traefik's default 404 — it received the request but couldn't find a
matching service. Confirm:
- The compose has Traefik labels (it does in this repo)
- All three services are on `dokploy-network`
- The `*_HOST` env vars are set and match the domains in the Domains tab
- Containers are running (compose service → service tab → green status dot)

**`Authentication failed for user "kopahi"`.**
Password mismatch between `DATABASE_URL` and what Postgres has. Open the
`db` service in Dokploy → reset password → copy the fresh URL → paste into
the Compose service's `DATABASE_URL` env → Redeploy.

**Migrations didn't apply.**
Open the backend logs — start command is `prisma migrate deploy && node dist/server.js`. If migrate fails, the container exits. Most common cause is `DATABASE_URL` not reachable from the backend container — check that both the Compose service and the `db` service are on the same network (Dokploy puts both on `dokploy-network` automatically).
