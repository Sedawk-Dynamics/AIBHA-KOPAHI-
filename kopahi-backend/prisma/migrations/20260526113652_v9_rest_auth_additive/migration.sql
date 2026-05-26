-- v9-REST auth additive migration.
-- Adds new enums, new User columns, and new tables consumed by the
-- frontend's Next.js Route Handlers (kopahi-frontend/app/api/auth/*).
-- All changes are additive; the backend's existing Express tables and
-- columns are left untouched.

-- ─────────────────────────────────────────────────────────────────────
-- ENUMS
-- ─────────────────────────────────────────────────────────────────────

CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'DELETED');

CREATE TYPE "VendorStatus" AS ENUM (
  'PENDING_REVIEW',
  'KYC_REQUIRED',
  'APPROVED',
  'SUSPENDED',
  'REJECTED'
);

CREATE TYPE "AuditAction" AS ENUM (
  'SIGN_UP',
  'SIGN_IN',
  'SIGN_IN_FAILED',
  'SIGN_OUT',
  'TOKEN_REFRESHED',
  'PASSWORD_RESET_REQUESTED',
  'PASSWORD_RESET_COMPLETED',
  'PASSWORD_CHANGED',
  'EMAIL_VERIFIED',
  'ACCOUNT_LOCKED',
  'VENDOR_KYC_SUBMITTED',
  'VENDOR_APPROVED',
  'VENDOR_REJECTED'
);

-- ─────────────────────────────────────────────────────────────────────
-- USER  — additive columns only.
-- ─────────────────────────────────────────────────────────────────────

ALTER TABLE "User"
  ADD COLUMN "isSuperAdmin"       BOOLEAN      NOT NULL DEFAULT false,
  ADD COLUMN "status"             "UserStatus" NOT NULL DEFAULT 'ACTIVE',
  ADD COLUMN "emailVerifiedAt"    TIMESTAMP(3),
  ADD COLUMN "onboardingComplete" BOOLEAN      NOT NULL DEFAULT false;

-- ─────────────────────────────────────────────────────────────────────
-- VENDOR
-- ─────────────────────────────────────────────────────────────────────

CREATE TABLE "Vendor" (
  "id"              TEXT         NOT NULL,
  "userId"          TEXT         NOT NULL,
  "businessName"    TEXT         NOT NULL,
  "storeSlug"       TEXT         NOT NULL,
  "state"           TEXT         NOT NULL,
  "district"        TEXT,
  "gstNumber"       TEXT,
  "panNumber"       TEXT,
  "fssaiNumber"     TEXT,
  "status"          "VendorStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
  "approvedAt"      TIMESTAMP(3),
  "approvedBy"      TEXT,
  "rejectionReason" TEXT,
  "kycSubmitted"    BOOLEAN      NOT NULL DEFAULT false,
  "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"       TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Vendor_userId_key"    ON "Vendor"("userId");
CREATE UNIQUE INDEX "Vendor_storeSlug_key" ON "Vendor"("storeSlug");
CREATE INDEX        "Vendor_status_idx"    ON "Vendor"("status");

ALTER TABLE "Vendor"
  ADD CONSTRAINT "Vendor_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ─────────────────────────────────────────────────────────────────────
-- PASSWORD RESET TOKEN
-- ─────────────────────────────────────────────────────────────────────

CREATE TABLE "PasswordResetToken" (
  "id"        TEXT         NOT NULL,
  "userId"    TEXT         NOT NULL,
  "tokenHash" TEXT         NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "usedAt"    TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PasswordResetToken_tokenHash_key" ON "PasswordResetToken"("tokenHash");
CREATE INDEX        "PasswordResetToken_tokenHash_idx" ON "PasswordResetToken"("tokenHash");

ALTER TABLE "PasswordResetToken"
  ADD CONSTRAINT "PasswordResetToken_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ─────────────────────────────────────────────────────────────────────
-- EMAIL VERIFICATION TOKEN
-- ─────────────────────────────────────────────────────────────────────

CREATE TABLE "EmailVerificationToken" (
  "id"        TEXT         NOT NULL,
  "userId"    TEXT         NOT NULL,
  "tokenHash" TEXT         NOT NULL,
  "email"     TEXT         NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "usedAt"    TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EmailVerificationToken_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "EmailVerificationToken_tokenHash_key" ON "EmailVerificationToken"("tokenHash");
CREATE INDEX        "EmailVerificationToken_tokenHash_idx" ON "EmailVerificationToken"("tokenHash");

ALTER TABLE "EmailVerificationToken"
  ADD CONSTRAINT "EmailVerificationToken_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ─────────────────────────────────────────────────────────────────────
-- REFRESH TOKEN
-- ─────────────────────────────────────────────────────────────────────

CREATE TABLE "RefreshToken" (
  "id"        TEXT         NOT NULL,
  "userId"    TEXT         NOT NULL,
  "tokenHash" TEXT         NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "revokedAt" TIMESTAMP(3),
  "userAgent" TEXT,
  "ipAddress" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "RefreshToken_tokenHash_key" ON "RefreshToken"("tokenHash");
CREATE INDEX        "RefreshToken_userId_idx"    ON "RefreshToken"("userId");
CREATE INDEX        "RefreshToken_tokenHash_idx" ON "RefreshToken"("tokenHash");

ALTER TABLE "RefreshToken"
  ADD CONSTRAINT "RefreshToken_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ─────────────────────────────────────────────────────────────────────
-- AUTH AUDIT LOG  (named AuthAuditLog to avoid collision with Express AuditLog)
-- ─────────────────────────────────────────────────────────────────────

CREATE TABLE "AuthAuditLog" (
  "id"        TEXT          NOT NULL,
  "userId"    TEXT,
  "action"    "AuditAction" NOT NULL,
  "metadata"  JSONB,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "createdAt" TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AuthAuditLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AuthAuditLog_userId_idx"    ON "AuthAuditLog"("userId");
CREATE INDEX "AuthAuditLog_action_idx"    ON "AuthAuditLog"("action");
CREATE INDEX "AuthAuditLog_createdAt_idx" ON "AuthAuditLog"("createdAt");

ALTER TABLE "AuthAuditLog"
  ADD CONSTRAINT "AuthAuditLog_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
