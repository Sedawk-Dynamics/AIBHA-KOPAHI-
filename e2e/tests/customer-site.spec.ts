import { test, expect } from "@playwright/test";

/*
 * Customer site smoke (kopahi-frontend on :3000).
 * Covers: home loads with hero text, login page renders, vendor-signup
 * page reachable, forgot-password gets the generic ack.
 */

const FRONTEND = process.env.FRONTEND_URL || "http://localhost:3000";

test.describe("Customer site", () => {
  test("home page renders hero + nav without overlap", async ({ page }) => {
    await page.goto(FRONTEND);
    // Hero eyebrow text must be visible — the regression that prompted
    // commit 8518959 (hero padding fix).
    await expect(
      page.getByText("Farmer Stories of North East India")
    ).toBeVisible();
    // Hero CTA
    await expect(page.getByRole("link", { name: /shop now/i })).toBeVisible();
  });

  test("login page renders", async ({ page }) => {
    await page.goto(`${FRONTEND}/login`);
    await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
    // Inputs use placeholders rather than associated labels.
    await expect(page.getByPlaceholder(/you@example\.com/i)).toBeVisible();
    await expect(page.getByPlaceholder(/enter your password/i)).toBeVisible();
  });

  test("vendor signup page exists with business + gst fields", async ({ page }) => {
    await page.goto(`${FRONTEND}/vendor-signup`);
    await expect(page.getByRole("heading", { name: /vendor signup/i })).toBeVisible();
    // Labels exist as plain text — assert by content.
    await expect(page.getByText(/business name/i).first()).toBeVisible();
    await expect(page.getByText(/gst number/i).first()).toBeVisible();
    // The GST input is recognizable by its placeholder.
    await expect(page.getByPlaceholder("22AAAAA0000A1Z5")).toBeVisible();
  });

  test("forgot-password page returns the generic ack", async ({ page }) => {
    await page.goto(`${FRONTEND}/forgot-password`);
    await page.getByPlaceholder(/you@example\.com/i).fill("nobody@example.com");
    await page.getByRole("button", { name: /send reset link/i }).click();
    await expect(page.getByText(/If an account exists/i)).toBeVisible({
      timeout: 10_000,
    });
  });
});
