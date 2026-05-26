// Role normalisation layer.
//
// The Postgres `Role` enum (managed by the Express backend) uses lowercase
// values: `user`, `vendor`, `admin`. v9-REST's TypeScript convention is
// UPPERCASE — `CUSTOMER`, `VENDOR`, `ADMIN` — with `CUSTOMER` aliasing the
// `user` row.
//
// Everywhere outside lib/auth, code should use these UPPERCASE constants.
// At the DB boundary (Prisma calls), use `toDbRole` / `fromDbRole`.

import type { Role as DbRole } from "@prisma/client";

export const AppRole = {
  CUSTOMER: "CUSTOMER",
  VENDOR: "VENDOR",
  ADMIN: "ADMIN",
} as const;

export type AppRole = (typeof AppRole)[keyof typeof AppRole];

const APP_TO_DB: Record<AppRole, DbRole> = {
  CUSTOMER: "user",
  VENDOR: "vendor",
  ADMIN: "admin",
};

const DB_TO_APP: Record<DbRole, AppRole> = {
  user: "CUSTOMER",
  vendor: "VENDOR",
  admin: "ADMIN",
};

export function toDbRole(app: AppRole): DbRole {
  return APP_TO_DB[app];
}

export function fromDbRole(db: DbRole): AppRole {
  return DB_TO_APP[db];
}
