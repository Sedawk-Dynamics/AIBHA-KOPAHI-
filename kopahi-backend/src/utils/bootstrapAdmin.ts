/*
 * One-time admin bootstrap.
 *
 * Reads BOOTSTRAP_ADMIN_EMAIL from env; if set, promotes that user to
 * role='admin' (also clearing any active lockout, so a stuck account can be
 * recovered in the same operation). Idempotent — already-admin users are a
 * no-op. Uses raw SQL because some v9 columns (`isSuperAdmin`) live in the
 * Postgres schema but aren't declared in this Prisma schema.
 *
 * Usage:
 *   1. Set BOOTSTRAP_ADMIN_EMAIL in Dokploy → app → Environment
 *   2. Redeploy the backend container
 *   3. Watch the logs for `bootstrap_admin_promoted` (or `_already_admin` / `_user_not_found`)
 *   4. Remove the env var so future deploys don't keep referencing it
 */
import prisma from "../config/db";
import logger from "./logger";

export default async function bootstrapAdmin(): Promise<void> {
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.toLowerCase().trim();
  if (!email) {
    return;
  }

  const rows = await prisma.$queryRaw<
    Array<{ id: string; role: string; isSuperAdmin: boolean }>
  >`SELECT id, role::text AS role, "isSuperAdmin" FROM "User" WHERE email = ${email}`;

  if (rows.length === 0) {
    logger.warn("bootstrap_admin_user_not_found", { email });
    return;
  }

  const current = rows[0];
  if (current.role === "admin" && current.isSuperAdmin) {
    logger.info("bootstrap_admin_already_admin", { email });
    return;
  }

  // Singleton invariant — only one admin can exist. If a different user is
  // already admin, refuse to promote a second one.
  const otherAdmins = await prisma.$queryRaw<Array<{ email: string }>>`
    SELECT email FROM "User" WHERE role = 'admin' AND id <> ${current.id}
  `;
  if (otherAdmins.length > 0) {
    logger.error("bootstrap_admin_refused_singleton_violation", {
      email,
      existingAdminEmail: otherAdmins[0].email,
    });
    return;
  }

  await prisma.$executeRaw`
    UPDATE "User"
    SET role = 'admin'::"Role",
        "isSuperAdmin" = true,
        "failedLoginAttempts" = 0,
        "lockedUntil" = NULL
    WHERE id = ${current.id}
  `;

  logger.info("bootstrap_admin_promoted", {
    email,
    previousRole: current.role,
  });
}
