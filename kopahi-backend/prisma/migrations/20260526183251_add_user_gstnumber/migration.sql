-- Adds `gstNumber` to "User". Both the backend and frontend Prisma schemas
-- declare this column with default "", but the original init migration
-- (20260508095259_init) did NOT include it. Local DBs picked up the column
-- via `prisma db push` runs over time; the prod DB never did, so any query
-- that selects User.* fails with "column does not exist". This migration
-- closes that drift.
--
-- IF NOT EXISTS is defensive: on databases that already have the column
-- (most local dev DBs), this is a no-op.

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "gstNumber" TEXT NOT NULL DEFAULT '';
