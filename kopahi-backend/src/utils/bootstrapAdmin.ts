/*
 * One-time admin bootstrap / recovery.
 *
 * Reads BOOTSTRAP_ADMIN_EMAIL from env; if set, promotes that user to
 * role='admin' and clears any active lockout. Optionally, if
 * BOOTSTRAP_ADMIN_PASSWORD is also set, resets the account's password —
 * this is the email-free way to recover an admin login when SMTP delivery
 * isn't working. Uses raw SQL because some v9 columns (`isSuperAdmin`) live
 * in the Postgres schema but aren't declared in this Prisma schema.
 *
 * Usage:
 *   1. Set BOOTSTRAP_ADMIN_EMAIL (and optionally BOOTSTRAP_ADMIN_PASSWORD)
 *      in Dokploy → app → Environment
 *   2. Redeploy the backend container
 *   3. Watch the logs for `bootstrap_admin_promoted` /
 *      `bootstrap_admin_password_reset` (or `_already_admin` / `_user_not_found`)
 *   4. REMOVE both env vars afterward — leaving BOOTSTRAP_ADMIN_PASSWORD set
 *      would re-reset the password (and re-clear lockout) on every deploy.
 */
import bcrypt from "bcryptjs";
import prisma from "../config/db";
import logger from "./logger";

export default async function bootstrapAdmin(): Promise<void> {
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.toLowerCase().trim();
  if (!email) {
    return;
  }
  const newPassword = process.env.BOOTSTRAP_ADMIN_PASSWORD || "";

  const rows = await prisma.$queryRaw<
    Array<{ id: string; role: string; isSuperAdmin: boolean }>
  >`SELECT id, role::text AS role, "isSuperAdmin" FROM "User" WHERE email = ${email}`;

  if (rows.length === 0) {
    logger.warn("bootstrap_admin_user_not_found", { email });
    return;
  }

  const current = rows[0];
  const alreadyAdmin = current.role === "admin" && current.isSuperAdmin;

  // Nothing to do if already a super-admin AND no password reset requested.
  if (alreadyAdmin && !newPassword) {
    logger.info("bootstrap_admin_already_admin", { email });
    return;
  }

  // Singleton invariant — only one admin can exist. If a DIFFERENT user is
  // already admin, refuse to promote a second one.
  if (!alreadyAdmin) {
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
  }

  const passwordHash = newPassword
    ? await bcrypt.hash(newPassword, Number(process.env.BCRYPT_COST) || 12)
    : null;

  if (passwordHash) {
    await prisma.$executeRaw`
      UPDATE "User"
      SET role = 'admin'::"Role",
          "isSuperAdmin" = true,
          "failedLoginAttempts" = 0,
          "lockedUntil" = NULL,
          password = ${passwordHash}
      WHERE id = ${current.id}
    `;
    logger.info("bootstrap_admin_password_reset", {
      email,
      previousRole: current.role,
    });
  } else {
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
}
