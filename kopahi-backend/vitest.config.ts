import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Only run tests under src/, never the smoke script or node_modules.
    include: ["src/**/*.test.ts"],
    environment: "node",
    // The repository tests don't hit the database. Tests that touch Prisma
    // would need a separate integration suite — out of scope here.
    globals: false,
    reporters: ["default"],
    testTimeout: 10_000,
  },
});
