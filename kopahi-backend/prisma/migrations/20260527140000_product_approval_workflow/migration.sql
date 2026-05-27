-- Product approval workflow.
-- Vendors create products in PENDING state; admin must APPROVE before they
-- show up in customer-facing listings. Existing products are grandfathered
-- in as APPROVED so the catalogue doesn't go dark on this migration.

CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- Add column with default APPROVED so existing rows stay live.
ALTER TABLE "Product"
  ADD COLUMN "approvalStatus" "ApprovalStatus" NOT NULL DEFAULT 'APPROVED';

-- New rows from now on default to PENDING.
ALTER TABLE "Product" ALTER COLUMN "approvalStatus" SET DEFAULT 'PENDING';

ALTER TABLE "Product" ADD COLUMN "approvedAt"      TIMESTAMP(3);
ALTER TABLE "Product" ADD COLUMN "approvedBy"      TEXT;
ALTER TABLE "Product" ADD COLUMN "rejectionReason" TEXT;

-- Set approvedAt for the grandfathered rows so the audit trail isn't ambiguous.
UPDATE "Product" SET "approvedAt" = CURRENT_TIMESTAMP WHERE "approvalStatus" = 'APPROVED';

ALTER TABLE "Product"
  ADD CONSTRAINT "Product_approvedBy_fkey"
  FOREIGN KEY ("approvedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "Product_approvalStatus_idx" ON "Product"("approvalStatus");
