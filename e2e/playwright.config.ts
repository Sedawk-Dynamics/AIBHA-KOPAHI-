import { defineConfig } from "@playwright/test";

/*
 * Kopahi e2e suite.
 *
 * Pre-requisites (the suite does NOT start servers — start them manually):
 *   cd kopahi-backend  && npm run dev         # :5000
 *   cd kopahi-frontend && npm run dev         # :3000
 *   cd kopahi-admin    && npm run dev         # :3001
 *
 * Run:
 *   cd e2e && npm test          # headless
 *   cd e2e && npm run test:headed  # see the browser
 */

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: process.env.FRONTEND_URL || "http://localhost:3000",
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
});
