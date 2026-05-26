-- AlterTable: account-lockout + sign-in tracking columns on User.
-- See authController.loginUser for the lockout flow (5 fails → 15 min lock).
ALTER TABLE "User"
  ADD COLUMN "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "lockedUntil" TIMESTAMP(3),
  ADD COLUMN "lastSignInAt" TIMESTAMP(3),
  ADD COLUMN "lastSignInIp" TEXT;
