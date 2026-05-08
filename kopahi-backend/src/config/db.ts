/*
 * Prisma client singleton. The previous Mongoose `connectDB()` is gone —
 * Prisma manages its own connection pool and connects lazily on first query.
 *
 * The global cache pattern guards against the dev-watcher creating multiple
 * clients (each with its own pool) every time ts-node reloads.
 */

import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __kopahiPrisma: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  global.__kopahiPrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "production" ? ["error"] : ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.__kopahiPrisma = prisma;
}

export const connectDB = async (): Promise<void> => {
  // Optional eager connect — surfaces connection errors at boot rather than
  // on first request. Prisma re-uses this connection.
  await prisma.$connect();
};

export const disconnectDB = async (): Promise<void> => {
  await prisma.$disconnect();
};

export default prisma;
