// Prisma singleton — Next.js dev mode hot-reloads modules, so we cache the
// client on `globalThis` to avoid exhausting the Postgres connection pool.

import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __kopahi_prisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.__kopahi_prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__kopahi_prisma = prisma;
}

export default prisma;
