/*
 * End-to-end smoke test for the Kopahi backend.
 *
 * Runs against a live backend on http://127.0.0.1:5000. Spin it up first:
 *   cd kopahi-backend && npm run dev
 *
 * Then run this script (uses the backend's ts-node):
 *   cd kopahi-backend && npm run smoke
 *
 * Tests in order:
 *   1.  Health check
 *   2.  Customer signup (random email)
 *   3.  Customer login -> token
 *   4.  Vendor signup via /register-vendor (random email)
 *   5.  Vendor login while unverified (must fail with EMAIL_NOT_VERIFIED)
 *   6.  Admin login (seeded admin)
 *   7.  Admin manually creates a vendor -> that vendor logs in immediately
 *   8.  Vendor creates a product
 *   9.  Customer adds to cart -> places order with WELCOME10 coupon
 *   10. Admin views orders -> updates status to Shipped
 *   11. Customer cancels eligible order -> stock restored
 *   12. Rate-limit: 6 failed logins -> 429 on the 6th
 *   13. Cleanup: delete test users (best-effort)
 *
 * NOTE: step 12 burns the credential-limiter bucket for the test IP, so it
 * MUST run after every other step that needs to call /login.
 */

const API = process.env.API_URL || "http://127.0.0.1:5000";
const ADMIN_EMAIL = "admin@kopahi.com";
const ADMIN_PASSWORD = process.env.SEED_PASSWORD || "DemoPass!2026";

type Json = Record<string, unknown>;

interface CallOpts {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  token?: string;
  body?: Json;
  expectStatus?: number;
  /** Override the source IP via X-Forwarded-For. The backend has `trust proxy: 1`,
   *  which is why this works — each fake IP gets its own rate-limit bucket. */
  forwardIp?: string;
}

// Per-role fake IPs so each test "user" has an independent rate-limit bucket.
// All values are RFC 5737 documentation ranges so they can never collide with
// a real client.
const IP = {
  customer: "203.0.113.10",
  unverifiedVendor: "203.0.113.20",
  admin: "203.0.113.30",
  onboardedVendor: "203.0.113.40",
  rateLimitProbe: "203.0.113.50",
} as const;

class TestFailure extends Error {
  constructor(public step: string, message: string) {
    super(`[${step}] ${message}`);
  }
}

const results: Array<{ step: string; status: "PASS" | "FAIL"; note?: string }> = [];

const log = (...args: unknown[]) => {
  // eslint-disable-next-line no-console
  console.log(...args);
};

const call = async <T = unknown>(
  step: string,
  path: string,
  opts: CallOpts = {}
): Promise<{ status: number; data: T }> => {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (opts.token) headers.Authorization = `Bearer ${opts.token}`;
  if (opts.forwardIp) headers["X-Forwarded-For"] = opts.forwardIp;

  const res = await fetch(`${API}${path}`, {
    method: opts.method ?? (opts.body ? "POST" : "GET"),
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (opts.expectStatus !== undefined && res.status !== opts.expectStatus) {
    throw new TestFailure(
      step,
      `expected ${opts.expectStatus}, got ${res.status}: ${JSON.stringify(data)}`
    );
  }

  return { status: res.status, data: data as T };
};

const pass = (step: string, note?: string) => {
  results.push({ step, status: "PASS", note });
  log(`  PASS  ${step}${note ? `  (${note})` : ""}`);
};

const fail = (step: string, msg: string) => {
  results.push({ step, status: "FAIL", note: msg });
  log(`  FAIL  ${step}  -- ${msg}`);
};

const rand = () => Math.random().toString(36).slice(2, 8);

(async () => {
  log("=== Kopahi backend smoke test ===");
  log(`API: ${API}`);
  log("");

  const ts = Date.now();
  const customerEmail = `smoke-c-${ts}-${rand()}@example.com`;
  const vendorEmail = `smoke-v-${ts}-${rand()}@example.com`;
  const onboardedVendorEmail = `smoke-ov-${ts}-${rand()}@example.com`;
  const PASSWORD = "StrongPass!2026";

  let customerToken = "";
  let onboardedVendorToken = "";
  let adminToken = "";
  let customerUserId = "";
  let vendorUserId = "";
  let onboardedVendorUserId = "";
  let productId = "";
  let orderId = "";

  // ── 1. Health
  try {
    const r = await call<{ success: boolean; uptime: number }>(
      "1. health",
      "/api/health",
      { expectStatus: 200 }
    );
    if (!r.data.success) throw new TestFailure("1. health", "success !== true");
    pass("1. health", `uptime=${r.data.uptime.toFixed(1)}s`);
  } catch (err) {
    fail("1. health", (err as Error).message);
    log("\nBackend not reachable — aborting. Start it with `cd kopahi-backend && npm run dev`.");
    process.exit(1);
  }

  // ── 2. Customer signup
  try {
    type RegRes = { success: boolean; token: string; user: { id: string; role: string } };
    const r = await call<RegRes>("2. customer signup", "/api/auth/register", {
      body: { name: "Smoke Customer", email: customerEmail, phone: "+919999000111", password: PASSWORD },
      expectStatus: 201,
      forwardIp: IP.customer,
    });
    if (r.data.user.role !== "user") throw new TestFailure("2. customer signup", `role=${r.data.user.role}`);
    customerUserId = r.data.user.id;
    pass("2. customer signup", `id=${customerUserId.slice(-6)} role=user`);
  } catch (err) {
    fail("2. customer signup", (err as Error).message);
  }

  // ── 3. Customer login
  try {
    type LoginRes = { success: boolean; token: string; user: { role: string } };
    const r = await call<LoginRes>("3. customer login", "/api/auth/login", {
      body: { email: customerEmail, password: PASSWORD },
      expectStatus: 200,
      forwardIp: IP.customer,
    });
    customerToken = r.data.token;
    pass("3. customer login", `tokenLen=${customerToken.length}`);
  } catch (err) {
    fail("3. customer login", (err as Error).message);
  }

  // ── 4. Vendor signup
  try {
    type VendorRegRes = { success: boolean; user: { id: string; role: string; emailVerified: boolean } };
    const r = await call<VendorRegRes>("4. vendor signup", "/api/auth/register-vendor", {
      body: {
        name: "Smoke Vendor",
        email: vendorEmail,
        phone: "+919999000222",
        password: PASSWORD,
        businessName: "Smoke Tea Co.",
      },
      expectStatus: 201,
      forwardIp: IP.unverifiedVendor,
    });
    if (r.data.user.role !== "vendor") throw new TestFailure("4. vendor signup", `role=${r.data.user.role}`);
    if (r.data.user.emailVerified !== false)
      throw new TestFailure("4. vendor signup", "expected emailVerified=false");
    vendorUserId = r.data.user.id;
    pass("4. vendor signup", `id=${vendorUserId.slice(-6)} verified=false`);
  } catch (err) {
    fail("4. vendor signup", (err as Error).message);
  }

  // ── 5. Vendor login while unverified MUST fail
  try {
    type LoginErr = { success: false; code?: string; message?: string };
    const r = await call<LoginErr>("5. unverified vendor login", "/api/auth/login", {
      body: { email: vendorEmail, password: PASSWORD },
      expectStatus: 403,
      forwardIp: IP.unverifiedVendor,
    });
    if (r.data.code !== "EMAIL_NOT_VERIFIED")
      throw new TestFailure("5. unverified vendor login", `expected code=EMAIL_NOT_VERIFIED, got ${r.data.code}`);
    pass(
      "5. unverified vendor login",
      "rejected with EMAIL_NOT_VERIFIED — documented behavior: vendors must verify email before first login"
    );
  } catch (err) {
    fail("5. unverified vendor login", (err as Error).message);
  }

  // ── 6. Admin login
  try {
    type LoginRes = { success: boolean; token: string; user: { role: string } };
    const r = await call<LoginRes>("6. admin login", "/api/auth/login", {
      body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
      expectStatus: 200,
      forwardIp: IP.admin,
    });
    if (r.data.user.role !== "admin") throw new TestFailure("6. admin login", `role=${r.data.user.role}`);
    adminToken = r.data.token;
    pass("6. admin login", "role=admin");
  } catch (err) {
    fail("6. admin login", (err as Error).message);
    log("\nAdmin login failed — did you run `npm run seed` in kopahi-backend?");
  }

  // ── 7. Admin manually onboards a vendor -> that vendor logs in immediately
  try {
    type CreateRes = { success: boolean; user: { id: string; emailVerified: boolean } };
    const r = await call<CreateRes>("7a. admin onboards vendor", "/api/admin/users/create-vendor", {
      token: adminToken,
      body: {
        name: "Onboarded Vendor",
        email: onboardedVendorEmail,
        password: PASSWORD,
        businessName: "Onboarded Co.",
        phone: "+919999000333",
      },
      expectStatus: 201,
      forwardIp: IP.admin,
    });
    if (!r.data.user.emailVerified)
      throw new TestFailure("7a. admin onboards vendor", "expected emailVerified=true");
    onboardedVendorUserId = r.data.user.id;
    pass("7a. admin onboards vendor", `verified=true id=${onboardedVendorUserId.slice(-6)}`);

    type LoginRes = { success: boolean; token: string };
    const r2 = await call<LoginRes>("7b. onboarded vendor login", "/api/auth/login", {
      body: { email: onboardedVendorEmail, password: PASSWORD },
      expectStatus: 200,
      forwardIp: IP.onboardedVendor,
    });
    onboardedVendorToken = r2.data.token;
    pass("7b. onboarded vendor login");
  } catch (err) {
    fail("7. admin onboards vendor", (err as Error).message);
  }

  // ── 8. Onboarded vendor creates a product
  try {
    type ProductRes = { success: boolean; product: { id: string; name: string; stock: number } };
    const r = await call<ProductRes>("8. vendor creates product", "/api/products", {
      token: onboardedVendorToken,
      body: {
        name: `Smoke Test Tea ${rand()}`,
        category: "Tea",
        price: 499,
        originalPrice: 599,
        stock: 50,
        description: "Smoke-test product, safe to ignore.",
        shortDescription: "Smoke-test product",
        images: ["https://example.com/placeholder.jpg"],
        isActive: true,
      },
      expectStatus: 201,
    });
    productId = r.data.product.id;
    pass("8. vendor creates product", `id=${productId.slice(-6)} stock=${r.data.product.stock}`);
  } catch (err) {
    fail("8. vendor creates product", (err as Error).message);
  }

  // ── 9. Customer puts product in cart, then places order with coupon
  try {
    if (!customerToken || !productId) throw new TestFailure("9. customer order", "skipped (prereqs failed)");

    // Put cart
    await call("9a. cart put", "/api/cart", {
      method: "PUT",
      token: customerToken,
      body: { items: [{ product: productId, quantity: 2 }] },
      expectStatus: 200,
    });

    // Place order with coupon WELCOME10 (seeded)
    type OrderRes = {
      success: boolean;
      order: {
        id: string;
        items: Array<{ quantity: number; price: number | string }>;
        couponCode: string;
        couponDiscount: number | string;
        totalPrice: number | string;
      };
    };
    const r = await call<OrderRes>("9b. order place", "/api/orders", {
      token: customerToken,
      body: {
        items: [{ product: productId, quantity: 2 }],
        shippingAddress: {
          fullName: "Smoke Customer",
          phone: "+919999000111",
          address: "1 Test Lane",
          city: "Guwahati",
          state: "Assam",
          pincode: "781001",
          country: "India",
        },
        paymentMethod: "COD",
        couponCode: "WELCOME10",
      },
      expectStatus: 201,
    });
    orderId = r.data.order.id;
    if (r.data.order.couponCode !== "WELCOME10")
      throw new TestFailure("9b. order place", `couponCode=${r.data.order.couponCode}`);
    if (Number(r.data.order.couponDiscount) <= 0)
      throw new TestFailure("9b. order place", "couponDiscount must be > 0");

    // Stock should now be 48 (was 50)
    type ProdRes = { success: boolean; product: { stock: number } };
    const prod = await call<ProdRes>("9c. stock decremented", `/api/products/${productId}`, {
      expectStatus: 200,
    });
    if (prod.data.product.stock !== 48)
      throw new TestFailure("9c. stock decremented", `expected 48, got ${prod.data.product.stock}`);
    pass(
      "9. customer order with coupon",
      `orderId=${orderId.slice(-6)} discount=${r.data.order.couponDiscount} stock 50->48`
    );
  } catch (err) {
    fail("9. customer order with coupon", (err as Error).message);
  }

  // ── 10. Admin updates order status to Shipped
  try {
    if (!orderId) throw new TestFailure("10. admin updates status", "skipped (no orderId)");
    type R = { success: boolean; order: { orderStatus: string } };
    const r = await call<R>("10. admin updates status", `/api/orders/${orderId}/status`, {
      method: "PUT",
      token: adminToken,
      body: { orderStatus: "Shipped" },
      expectStatus: 200,
    });
    if (r.data.order.orderStatus !== "Shipped")
      throw new TestFailure("10. admin updates status", `status=${r.data.order.orderStatus}`);
    pass("10. admin updates status", "Placed -> Shipped");
  } catch (err) {
    fail("10. admin updates status", (err as Error).message);
  }

  // ── 11. Customer cancels order -- but Shipped is non-cancellable; place a fresh
  // one and cancel that to prove the stock-restore path works.
  try {
    if (!customerToken || !productId) throw new TestFailure("11. cancel order", "skipped (prereqs failed)");

    type OrderRes = { success: boolean; order: { id: string } };
    const placed = await call<OrderRes>("11a. place cancellable order", "/api/orders", {
      token: customerToken,
      body: {
        items: [{ product: productId, quantity: 3 }],
        shippingAddress: {
          fullName: "Smoke Customer",
          phone: "+919999000111",
          address: "1 Test Lane",
          city: "Guwahati",
          state: "Assam",
          pincode: "781001",
          country: "India",
        },
        paymentMethod: "COD",
      },
      expectStatus: 201,
    });
    const cancelOrderId = placed.data.order.id;

    // Stock should now be 48 - 3 = 45
    type ProdRes = { success: boolean; product: { stock: number } };
    const beforeCancel = await call<ProdRes>("11b. stock pre-cancel", `/api/products/${productId}`, {
      expectStatus: 200,
    });
    if (beforeCancel.data.product.stock !== 45)
      throw new TestFailure("11b. stock pre-cancel", `expected 45, got ${beforeCancel.data.product.stock}`);

    type CancelRes = { success: boolean; order: { orderStatus: string } };
    const cancelled = await call<CancelRes>("11c. cancel order", `/api/orders/${cancelOrderId}/cancel`, {
      method: "PUT",
      token: customerToken,
      expectStatus: 200,
    });
    if (cancelled.data.order.orderStatus !== "Cancelled")
      throw new TestFailure("11c. cancel order", `status=${cancelled.data.order.orderStatus}`);

    // Stock should be restored to 48
    const afterCancel = await call<ProdRes>("11d. stock post-cancel", `/api/products/${productId}`, {
      expectStatus: 200,
    });
    if (afterCancel.data.product.stock !== 48)
      throw new TestFailure(
        "11d. stock post-cancel",
        `expected stock restored to 48, got ${afterCancel.data.product.stock}`
      );
    pass("11. cancel restores stock", `45 -> 48`);
  } catch (err) {
    fail("11. cancel restores stock", (err as Error).message);
  }

  // ── 12. Rate-limit: 6 wrong-password attempts -> 6th is 429
  try {
    const codes: number[] = [];
    for (let i = 1; i <= 6; i++) {
      const r = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Forwarded-For": IP.rateLimitProbe,
        },
        body: JSON.stringify({ email: "nope-rate@example.com", password: "WRONG-Password!2026" }),
      });
      codes.push(r.status);
    }
    const last = codes[codes.length - 1];
    if (last !== 429) throw new TestFailure("12. rate limit", `last status ${last}, sequence: ${codes.join(",")}`);
    pass("12. rate limit", `sequence: ${codes.join(", ")}`);
  } catch (err) {
    fail("12. rate limit", (err as Error).message);
  }

  // ── 13. Cleanup. Note the rate-limit bucket is now full, but DELETE /api/admin/user
  // doesn't go through the credentialLimiter — we already have adminToken from step 6.
  try {
    const cleanupTargets: Array<{ id: string; label: string }> = [
      { id: customerUserId, label: "customer (has orders, may fail)" },
      { id: vendorUserId, label: "unverified vendor" },
      { id: onboardedVendorUserId, label: "onboarded vendor (owns product, may fail)" },
    ];
    let cleaned = 0;
    let skipped = 0;
    for (const t of cleanupTargets) {
      if (!t.id) continue;
      const r = await fetch(`${API}/api/admin/user/${t.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (r.ok) {
        cleaned++;
      } else {
        skipped++;
        log(`     · could not delete ${t.label}: HTTP ${r.status} (likely FK constraint — leave for manual cleanup)`);
      }
    }
    pass("13. cleanup", `deleted ${cleaned}, skipped ${skipped}`);
  } catch (err) {
    fail("13. cleanup", (err as Error).message);
  }

  // ── Summary
  log("\n=== Summary ===");
  const passes = results.filter((r) => r.status === "PASS").length;
  const fails = results.filter((r) => r.status === "FAIL").length;
  log(`PASS: ${passes}   FAIL: ${fails}`);
  if (fails > 0) {
    log("\nFailures:");
    results.filter((r) => r.status === "FAIL").forEach((r) => log(`  - ${r.step}: ${r.note}`));
    process.exit(1);
  }
  process.exit(0);
})();
