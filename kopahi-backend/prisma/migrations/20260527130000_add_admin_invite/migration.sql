-- AdminInvite — single-use, email-locked invite tokens for admin signup.
-- Issued by an existing admin via POST /api/admin/invites; consumed by
-- POST /api/auth/signup/admin. Only the frontend's v9-REST Prisma client
-- queries this table; the backend leaves it alone.

CREATE TABLE "AdminInvite" (
  "id"        TEXT         NOT NULL,
  "email"     TEXT         NOT NULL,
  "tokenHash" TEXT         NOT NULL,
  "invitedBy" TEXT         NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "usedAt"    TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AdminInvite_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AdminInvite_tokenHash_key" ON "AdminInvite"("tokenHash");
CREATE INDEX        "AdminInvite_email_idx"     ON "AdminInvite"("email");

ALTER TABLE "AdminInvite"
  ADD CONSTRAINT "AdminInvite_invitedBy_fkey"
  FOREIGN KEY ("invitedBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
