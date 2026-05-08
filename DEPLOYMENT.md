# Deploying Kopahi on Dokploy

Step-by-step for getting the three services + Postgres running on a Dokploy
VPS, fronted by Traefik with Let's Encrypt SSL.

## 0. Prerequisites

- A Dokploy server (self-hosted) with the dashboard accessible at
  `https://your-dokploy-server.example.com`.
- A domain you control (e.g. `kopahi.example.com`) with the ability to add
  three subdomain A-records.
- This GitHub repo: `https://github.com/Sedawk-Dynamics/AIBHA-KOPAHI-`

## 1. DNS

Add three A-records pointing at your Dokploy server's public IP:

| Hostname (example) | Type | Points to |
|---|---|---|
| `kopahi.example.com` | A | Dokploy server IP |
| `admin.kopahi.example.com` | A | Dokploy server IP |
| `api.kopahi.example.com` | A | Dokploy server IP |

You can use any names — they just need to match the values you'll set in env vars below.

## 2. Create the Compose project in Dokploy

1. Dokploy dashboard → **Projects → Create project** (e.g. `kopahi-prod`).
2. Inside the project: **Create service → Compose**.
3. **Provider**: GitHub. Connect this repo: `Sedawk-Dynamics/AIBHA-KOPAHI-`.
4. **Branch**: `main`.
5. **Compose path**: `docker-compose.yml` (default).
6. **Compose type**: leave as default (Docker Compose).

## 3. Set environment variables

In the project's **Environment** tab, paste these (substitute your values):

```env
# REQUIRED
POSTGRES_USER=kopahi
POSTGRES_DB=kopahi
POSTGRES_PASSWORD=<strong-random>
JWT_SECRET=<openssl rand -hex 48>

# Hostnames
FRONTEND_HOST=kopahi.example.com
ADMIN_HOST=admin.kopahi.example.com
API_HOST=api.kopahi.example.com

# Inter-service / build-time URLs
FRONTEND_URL=https://kopahi.example.com
ADMIN_URL=https://admin.kopahi.example.com
NEXT_PUBLIC_API_URL=https://api.kopahi.example.com
NEXT_PUBLIC_ADMIN_URL=https://admin.kopahi.example.com

# Optional
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

> **Important:** the `NEXT_PUBLIC_*` vars are baked into the JavaScript bundles
> at **build time**. If you change them, you must redeploy (rebuild) — restart
> alone won't pick them up.

## 4. Map domains to services

In the project's **Domains** tab, add three entries:

| Domain | Service | Port | HTTPS | Cert resolver |
|---|---|---|---|---|
| `kopahi.example.com` (or your `FRONTEND_HOST`) | `frontend` | `3000` | ✓ | Let's Encrypt |
| `admin.kopahi.example.com` (your `ADMIN_HOST`) | `admin` | `80` | ✓ | Let's Encrypt |
| `api.kopahi.example.com` (your `API_HOST`) | `backend` | `5000` | ✓ | Let's Encrypt |

Dokploy will provision Let's Encrypt certs automatically once the DNS resolves
to the server.

## 5. Deploy

Hit **Deploy**. Dokploy will:

1. Pull the repo.
2. Build all three Docker images (`backend`, `frontend`, `admin`).
3. Pull `postgres:16-alpine`.
4. Bring the stack up on `dokploy-network`.
5. Apply Traefik routing for the three domains.
6. Backend's start command is `npx prisma migrate deploy && node dist/server.js`,
   so migrations run automatically on first boot and any future deploy. Idempotent.

## 6. Seed the database (one-time)

Dokploy → service `backend` → **Terminal** tab → run:

```bash
node /app/node_modules/prisma/build/index.js db seed
# or, equivalently:
npx prisma db seed
```

Wait for `Seeded users, categories, products, coupons, blog posts.` Demo logins
(password `DemoPass!2026`):
- `admin@kopahi.com`
- `vendor@kopahi.com`
- `customer@kopahi.com`

After your first real users exist, **change** the seed admin password (or
delete the demo admin row) — the demo password is publicly documented.

## 7. Verify

- `https://api.kopahi.example.com/api/health` → `{"success":true,"uptime":...}`
- `https://api.kopahi.example.com/api/docs` → Swagger UI
- `https://kopahi.example.com` → customer site
- `https://admin.kopahi.example.com` → admin login → sign in as admin → lands on `/admin`

## 8. (Optional) PostgreSQL backups

In Dokploy → service `postgres` → **Backups** tab — schedule daily `pg_dump`
into S3-compatible storage. The volume `postgres_data` already persists across
restarts; backups protect against human error.

---

## Local development with the same compose

```bash
# From the repo root
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

This override file:
- Publishes Postgres on `:5432`, backend on `:5000`, frontend on `:3000`, admin on `:3001`.
- Defines `dokploy-network` locally (it isn't external when not on Dokploy).
- Sets `FRONTEND_URL`/`ADMIN_URL`/`NEXT_PUBLIC_*` to localhost values.

## Troubleshooting

**Frontend builds but renders against the wrong API URL.**
You changed `NEXT_PUBLIC_API_URL` after the first deploy without rebuilding.
Trigger a redeploy in Dokploy — Next.js bakes those vars into the bundle at build time.

**`Could not reach the server` from the admin app.**
CORS rejecting it. Check that `ADMIN_URL` env on the backend matches the actual
admin domain (no trailing slash, correct scheme). Check the backend logs for
`CORS: origin … not allowed`.

**`Authentication failed for user "kopahi"`.**
The Postgres password you set in `POSTGRES_PASSWORD` doesn't match the
`DATABASE_URL` Postgres expects. Both are derived from the same env var in
compose — if you changed `POSTGRES_PASSWORD` after the volume was initialized,
the DB user still has the old password. Either:
1. Wipe the `postgres_data` volume (Dokploy → Volumes → delete) and redeploy, or
2. Open a `psql` shell into the postgres container and `ALTER USER kopahi WITH PASSWORD '<new>'`.

**Migrations didn't apply.**
Open the backend logs — the start command is `prisma migrate deploy && node dist/server.js`. If migrate fails, the container exits. Most common cause is `DATABASE_URL` unreachable from the backend container — verify `postgres` service is healthy and on the same `kopahi_internal` network.

**Image too big.**
The Next.js Dockerfile uses `output: "standalone"` so the runtime image is just
the standalone server + `.next/static` + `public/`. The admin image is `nginx:alpine` serving static files — both are < 100 MB.
