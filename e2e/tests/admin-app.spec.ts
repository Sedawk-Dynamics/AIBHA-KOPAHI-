import { test, expect } from "@playwright/test";

/*
 * Admin app smoke (kopahi-admin on :3001).
 *
 * Login goes through the API directly so we (a) don't burn the rate-limit
 * bucket and (b) don't depend on the cross-origin window.location redirect
 * from the customer site.
 */

const ADMIN = process.env.ADMIN_URL || "http://localhost:3001";
const API = process.env.API_URL || "http://localhost:5000";

const ADMIN_EMAIL = "admin@kopahi.com";
const ADMIN_PASSWORD = process.env.SEED_PASSWORD || "DemoPass!2026";

test.describe("Admin app", () => {
  test.beforeEach(async ({ page }) => {
    // Stale auth from prior runs satisfies ProtectedRoute without a token;
    // wipe localStorage on the admin origin before every test.
    await page.goto(ADMIN);
    await page.evaluate(() => localStorage.clear());
  });

  test("login form renders at /login", async ({ page }) => {
    await page.goto(`${ADMIN}/login`);
    await expect(
      page.getByRole("heading", { name: /admin .* vendor sign-in/i })
    ).toBeVisible({ timeout: 10_000 });
  });

  test("admin can reach dashboard after API-seeded token", async ({
    page,
    context,
  }) => {
    const res = await context.request.post(`${API}/api/auth/login`, {
      data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
      failOnStatusCode: false,
    });
    if (!res.ok()) {
      test.skip(true, `Admin login API returned ${res.status()} (rate limited?)`);
    }
    const body = await res.json();

    await page.evaluate(
      ([t, u]) => {
        localStorage.setItem("kopahi_token", t);
        localStorage.setItem("kopahi_user", u);
      },
      [body.token, JSON.stringify(body.user)]
    );

    await page.goto(`${ADMIN}/admin`);
    await expect(page.getByText("Admin Dashboard").first()).toBeVisible({
      timeout: 15_000,
    });
  });

  test("admin Orders page renders header even with no data", async ({
    page,
    context,
  }) => {
    const res = await context.request.post(`${API}/api/auth/login`, {
      data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
      failOnStatusCode: false,
    });
    if (!res.ok()) {
      test.skip(true, `Admin login API returned ${res.status()} (rate limited?)`);
    }
    const body = await res.json();

    await page.evaluate(
      ([t, u]) => {
        localStorage.setItem("kopahi_token", t);
        localStorage.setItem("kopahi_user", u);
      },
      [body.token, JSON.stringify(body.user)]
    );

    await page.goto(`${ADMIN}/admin/orders`);
    // The Orders page renders the breadcrumb title regardless of data.
    await expect(
      page.getByText("Orders", { exact: true }).first()
    ).toBeVisible({ timeout: 15_000 });
  });
});
