# Phase 1 Audit — Kopahi Backend

Generated for [TASK.md](TASK.md). Source files inspected:
[kopahi-backend/src/routes/authRoutes.ts](kopahi-backend/src/routes/authRoutes.ts),
[controllers/authController.ts](kopahi-backend/src/controllers/authController.ts),
[middleware/authMiddleware.ts](kopahi-backend/src/middleware/authMiddleware.ts),
[middleware/adminMiddleware.ts](kopahi-backend/src/middleware/adminMiddleware.ts),
[routes/adminRoutes.ts](kopahi-backend/src/routes/adminRoutes.ts),
[routes/vendorRoutes.ts](kopahi-backend/src/routes/vendorRoutes.ts),
[routes/productRoutes.ts](kopahi-backend/src/routes/productRoutes.ts),
[routes/orderRoutes.ts](kopahi-backend/src/routes/orderRoutes.ts),
[routes/wishlistRoutes.ts](kopahi-backend/src/routes/wishlistRoutes.ts),
[routes/cartRoutes.ts](kopahi-backend/src/routes/cartRoutes.ts),
[routes/couponRoutes.ts](kopahi-backend/src/routes/couponRoutes.ts),
[routes/blogRoutes.ts](kopahi-backend/src/routes/blogRoutes.ts),
[routes/categoryRoutes.ts](kopahi-backend/src/routes/categoryRoutes.ts),
[routes/contactRoutes.ts](kopahi-backend/src/routes/contactRoutes.ts),
[routes/paymentRoutes.ts](kopahi-backend/src/routes/paymentRoutes.ts),
[server.ts](kopahi-backend/src/server.ts),
[utils/passwordPolicy.ts](kopahi-backend/src/utils/passwordPolicy.ts).

---

## 1. Auth endpoint inventory

All routes mounted under `/api/auth`. Source: [authRoutes.ts:34-43](kopahi-backend/src/routes/authRoutes.ts#L34-L43).

| Method | Path | Middleware | Body | Response | Notes |
|---|---|---|---|---|---|
| POST | `/register` | — | `{ name, email, password, phone?, role?, businessName? }` | `201 { success, message, token, user }` | **No rate limit.** `role` is partially gated (only "vendor" or "user" accepted) but `businessName` is also passed straight through without a vendor-only check on the API side. |
| POST | `/login` | `loginLimiter` (20/15min/IP) | `{ email, password, remember? }` | `200 { success, message, token, expiresIn, user }` | Limit is **20/15min**, not the **5/15min** TASK.md prescribes. |
| GET | `/me` | `protect` | — | `{ success, user }` | OK. |
| PUT | `/me` | `protect` | `{ name?, phone?, businessName? }` | `{ success, user }` | TASK calls for `PATCH`; current code uses `PUT`. Same shape, different verb. **No audit log.** |
| PUT | `/me/password` | `protect` | `{ currentPassword, newPassword }` | `{ success, message }` | TASK calls for `PATCH`. **No audit log.** |
| POST | `/forgot-password` | `passwordResetLimiter` (5/1h/IP) | `{ email }` | `200 { success, message }` (always 200, never confirms email exists) | OK. |
| POST | `/reset-password` | `passwordResetLimiter` | `{ token, password }` | `{ success, message }` | OK. **No audit log.** |
| POST | `/verify-email` | — | `{ token }` | `{ success, message, user }` | **No rate limit** — token guessing is hard but limiter wouldn't hurt. |
| POST | `/resend-verification` | `protect` | — | `{ success, message }` | **No rate limit.** |
| POST | `/logout` | — | — | — | **MISSING.** No endpoint exists. JWT is stateless so this is cosmetic, but TASK 2d asks for it. |
| POST | `/register-vendor` | — | — | — | **MISSING.** TASK 2a addition. |
| POST | `/refresh` | — | — | — | Skipped per TASK 2d. |

### Token shape
`generateToken({ id, role }, lifetime)` → `lifetime` is `"30d"` on register, `"30d"` if `remember=true` on login else `"12h"`. Verified in [generateToken.ts](kopahi-backend/src/utils/generateToken.ts) + [authController.ts:82,113](kopahi-backend/src/controllers/authController.ts#L82).

### `protect` flow
[authMiddleware.ts](kopahi-backend/src/middleware/authMiddleware.ts) reads `Authorization: Bearer <jwt>` first, falls back to `cookies.token`. Decodes with `JWT_SECRET`, then re-fetches the user from DB on every request (so deleted-user revocation works). 401 on missing / invalid / user-not-found.

---

## 2. Signup flow gaps per role

### Customer signup
- Endpoint: `POST /api/auth/register`. Default role: `"user"`. `role` field IS read from body but is **forced to either `"vendor"` or `"user"`** — admins cannot self-register ([authController.ts:38](kopahi-backend/src/controllers/authController.ts#L38)). Strong gate.
- **Gap:** `role` should be ignored entirely on this endpoint per TASK 2b. A vendor registering through `/register` is currently possible if the client passes `role: "vendor"` — that's how the task says **not** to do it (vendors should go through a separate `/register-vendor` endpoint).
- Password policy ≥12 chars + upper/lower/digit/symbol ([passwordPolicy.ts](kopahi-backend/src/utils/passwordPolicy.ts)). ✓
- Email verification token is generated and email sent. `emailVerified: false` is the default in the Prisma schema. **However, login does NOT check `emailVerified`** ([authController.ts:96-118](kopahi-backend/src/controllers/authController.ts#L96-L118)) — unverified users can sign in normally. TASK lists this as a question; current behavior is "verification not enforced."

### Vendor signup
- **No dedicated endpoint.** Vendors register through `/api/auth/register` with `role: "vendor"` — same flow as customers, with `businessName` captured.
- **Missing fields per TASK 2a:** `gstNumber`, KYC (no schema field), audit log (`vendor.signup` not recorded).
- **Gap:** TASK 2a wants a separate `POST /api/auth/register-vendor` with explicit business-name + phone validation, audit log, and 201 response.

### Admin
- Cannot be created via API. The `role: "admin"` value is filtered out by [authController.ts:38](kopahi-backend/src/controllers/authController.ts#L38) (`role === "vendor" ? "vendor" : "user"`). ✓
- Admins are created via `prisma db seed` only ([prisma/seed.ts](kopahi-backend/prisma/seed.ts)).
- **Gap:** TASK 2c asks for `POST /api/admin/users/create-admin` and `POST /api/admin/users/create-vendor` (admin-gated, for manual onboarding). Neither exists.

### Email-verification gate
- Verification email is sent on register ([authController.ts:58-77](kopahi-backend/src/controllers/authController.ts#L58-L77)).
- Login does not check `emailVerified`. So unverified users can fully use the app — this is a soft gate, not a hard one. Document or harden per Phase 2.

---

## 3. Rate-limiting status

| Endpoint | Has limiter? | Window | Max | Source |
|---|---|---|---|---|
| `POST /api/auth/register` | **NO** | — | — | [authRoutes.ts:34](kopahi-backend/src/routes/authRoutes.ts#L34) |
| `POST /api/auth/login` | yes | 15 min | **20** (TASK wants 5) | [authRoutes.ts:18-24](kopahi-backend/src/routes/authRoutes.ts#L18-L24) |
| `POST /api/auth/forgot-password` | yes | 60 min | 5 | [authRoutes.ts:26-32](kopahi-backend/src/routes/authRoutes.ts#L26-L32) |
| `POST /api/auth/reset-password` | yes | 60 min | 5 | shares `passwordResetLimiter` |
| `POST /api/auth/verify-email` | NO | — | — | |
| `POST /api/auth/resend-verification` | NO | — | — | abusable for email spam |
| `POST /api/contact` | yes | 15 min | 10 | [contactRoutes.ts:7-13](kopahi-backend/src/routes/contactRoutes.ts#L7-L13) |
| Everything else | NO | — | — | |

**Findings:**
- **`/register` MUST get a limiter** — currently unprotected against bulk signup / mailbomb.
- **`/login` limit is too generous** at 20/15min. TASK says 5/15min.
- `/resend-verification` and `/verify-email` should get limiters (low priority).
- `app.set("trust proxy", 1)` is present in [server.ts:36](kopahi-backend/src/server.ts#L36) so `req.ip` works correctly behind Traefik. ✓

---

## 4. Admin / vendor endpoint inventory

### `/api/admin/*` — protected by `protect, adminOnly` (set globally on the router at [adminRoutes.ts:10](kopahi-backend/src/routes/adminRoutes.ts#L10))

| Method | Path | Purpose |
|---|---|---|
| GET | `/dashboard` | Stat counts: users, vendors, products, orders, leads, totalPaidRevenue. Used by Overview page. |
| GET | `/users` | List **all** users (no role filter). Returns array; no pagination. |
| GET | `/orders` | List all orders. Used by Orders page. No pagination, no status filter. |
| GET | `/leads` | List all leads. |
| GET | `/audit` | Paginated audit log (`page`, `pageSize`, `action` query params). |
| DELETE | `/product/:id` | Delete a product. Audit logged. |
| DELETE | `/user/:id` | Delete a user (with self-delete guard). Audit logged. |

### `/api/vendor/*` — protected by `protect, vendorOrAdmin`

| Method | Path | Purpose |
|---|---|---|
| GET | `/products` | Vendor's own products. |
| GET | `/stats` | `{ totalProducts, inStock, outOfStock }` for the logged-in vendor. |

### Admin/vendor UI pages with no matching backend endpoint (Phase 4 priority)

| UI page | Needs | Status |
|---|---|---|
| `pages/admin/Overview.tsx` | `/api/admin/dashboard` | Exists ✓ |
| `pages/admin/Orders.tsx` | List + status filter + pagination | List exists; **no status filter, no pagination** — Phase 4 needs both |
| `pages/admin/Customers.tsx` | List users `role=user` with order counts | List exists but no role filter — would have to filter client-side OR add `?role=` query param + an aggregate join for order count |
| `pages/admin/Products.tsx` | List with vendor name populated | `GET /api/products` exists; need to confirm it returns vendor relation (currently it does NOT — Phase 4 backend tweak: `include: { vendor: { select: { name, businessName } } }`) |
| `pages/admin/Vendors.tsx` | List users `role=vendor` + product count + sales total | **Aggregate endpoint missing.** TASK 4.5 calls for new `GET /api/admin/vendors/stats`. |
| `pages/admin/Analytics.tsx` | Various aggregates | Out of scope per TASK |
| `pages/admin/Revenue.tsx` | Revenue breakdown | Out of scope |
| `pages/admin/Settings.tsx` | Persistence | Explicitly out of scope per TASK |
| `pages/admin/Profile.tsx` | Profile edit | `PUT /api/auth/me` exists ✓ but page is mock-only currently |
| `pages/vendor/Overview.tsx` | `/api/vendor/stats` + recent orders | Stats exist; **no recent orders endpoint scoped to vendor** — Phase 4 needs `GET /api/vendor/orders` |
| `pages/vendor/Products.tsx` | `/api/vendor/products` | Exists ✓ |
| `pages/vendor/ProductNew.tsx` | `POST /api/products` + image upload | Both exist ✓ |
| `pages/vendor/ProductEdit.tsx` | `PUT /api/products/:id` | Exists ✓ but page itself doesn't exist in admin app yet |
| `pages/vendor/Orders.tsx` | Orders containing vendor's products | **MISSING** — needs new endpoint |
| `pages/vendor/Earnings.tsx` | Revenue scoped to vendor | Out of scope |
| `pages/vendor/Reviews.tsx` | Reviews of vendor's products | Out of scope (Review model exists but no endpoint) |

### Net new endpoints required for Phase 4

1. `GET /api/admin/vendors/stats` — per-vendor `productCount` + `salesTotal` aggregate.
2. `GET /api/admin/users?role=user|vendor` — server-side role filter (or client-side filter is OK if list isn't huge).
3. `GET /api/admin/users/:id/order-count` (or include in main list) — for Customers page.
4. `GET /api/vendor/orders` — orders containing the logged-in vendor's products.
5. Optional: extend `GET /api/products` (admin view) with `?include=vendor` to populate vendor.

### Net new endpoints required for Phase 2

1. `POST /api/auth/register-vendor`
2. `POST /api/auth/logout` (cosmetic)
3. `POST /api/admin/users/create-admin`
4. `POST /api/admin/users/create-vendor`
5. Convert existing `PUT /me` and `PUT /me/password` to `PATCH` (or keep `PUT` and document — TASK is prescriptive, prefer to align).

---

## 5. CORS verification

Server config: [server.ts:44-59](kopahi-backend/src/server.ts#L44-L59).

```ts
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
  process.env.ADMIN_URL || "http://localhost:3001",
];
```

**`.env` audit:** [kopahi-backend/.env](kopahi-backend/.env) sets `FRONTEND_URL=http://localhost:3000` but **does not set `ADMIN_URL`** — the admin origin is reached only through the `|| "http://localhost:3001"` fallback. For Dokploy this would silently break CORS for admin once the customer URL changed. **Recommend adding `ADMIN_URL=http://localhost:3001` to [.env](kopahi-backend/.env).**

### Curl tests (live, against `npm run dev` on `:5000`)

#### From customer origin — passes
```
$ curl -i -H "Origin: http://localhost:3000" http://127.0.0.1:5000/api/health
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://localhost:3000
Vary: Origin
Access-Control-Allow-Credentials: true
{"success":true,"uptime":25.5,"env":"development"}
```

#### From admin origin — passes (via fallback)
```
$ curl -i -H "Origin: http://localhost:3001" http://127.0.0.1:5000/api/health
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://localhost:3001
Vary: Origin
Access-Control-Allow-Credentials: true
{"success":true,"uptime":29.6,"env":"development"}
```

#### From disallowed origin — denied
```
$ curl -i -H "Origin: http://evil.example" http://127.0.0.1:5000/api/health
HTTP/1.1 500 Internal Server Error
{"success":false,"message":"CORS: origin http://evil.example not allowed", "stack":"..."}
```

**Findings:**
- Allowlist works ✓
- **`ADMIN_URL` not in [.env](kopahi-backend/.env)** — relying on hardcoded fallback. Add it.
- **Disallowed origin returns 500, not 403.** The CORS callback throws `new Error(...)` which becomes a generic 500 via the error middleware. Cosmetic but slightly noisy in logs. Low-priority cleanup: have the cors callback `cb(null, false)` then return a 403 in a follow-up middleware, or whitelist the error in the error handler. Not a security gap — the request is still rejected.
- **Stack trace leaked in dev mode.** That's intentional (`NODE_ENV=development`). Confirm prod behavior in error middleware; Phase 1 doesn't require fixing.

---

## Summary of work for Phase 2 (recap, blocking on user review)

**Required:**
1. Add `POST /api/auth/register-vendor` with audit + verification email.
2. Strip `role` from `POST /api/auth/register` body and never accept "vendor" there — vendors go through 2a.
3. Tighten login limiter from 20→5/15min; add limiter to `/register` (5/15min).
4. Add `POST /api/admin/users/create-vendor` (admin-gated, `emailVerified: true`).
5. Add `POST /api/admin/users/create-admin` (admin-gated, audit `admin.user_create_admin`).
6. Add `POST /api/auth/logout` (stateless, audit only).
7. Add audit logs to existing `PUT /api/auth/me` and `PUT /api/auth/me/password`.
8. Add `ADMIN_URL=http://localhost:3001` to [kopahi-backend/.env](kopahi-backend/.env).

**Open question for the user:**
- TASK uses `PATCH /me` and `PATCH /me/password`. Current code uses `PUT`. Switch to `PATCH` (would require frontend update too) or keep `PUT` and update TASK?
- Should login refuse unverified emails (strict gate)? Current behavior is permissive. TASK doesn't make this explicit — flagging it for decision.

**Stop here per TASK Phase 1 instructions. Awaiting review before Phase 2.**
