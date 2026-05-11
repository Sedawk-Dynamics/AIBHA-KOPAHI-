/*
 * Shape helpers — keep the API surface stable across the Mongo→Postgres swap.
 *
 * Old Mongoose responses had `_id` on every document. Frontend code relies on
 * that exact field name everywhere (`order.user._id`, `product._id`, etc.).
 * Prisma uses `id` instead. We tack `_id = id` onto every result so legacy
 * callers never see the difference.
 */

type Shapeable = Record<string, unknown> & { id?: string };

/** Add `_id` mirror on a single record. Idempotent. Returns the same object. */
export const withMongoId = <T extends Shapeable>(row: T | null | undefined): T | null => {
  if (!row) return null as T | null;
  if (typeof row.id === "string") (row as Shapeable & { _id?: string })._id = row.id;
  return row;
};

/** Same, but for arrays. */
export const withMongoIds = <T extends Shapeable>(rows: T[]): T[] => {
  for (const r of rows) withMongoId(r);
  return rows;
};

/** Recursively walk an object, attaching `_id` wherever there's an `id`. Used
 *  for nested includes (orders → user, items → product, etc.). */
export const deepShape = <T>(value: T): T => {
  if (Array.isArray(value)) {
    for (const v of value) deepShape(v);
  } else if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if (typeof obj.id === "string") obj._id = obj.id;
    for (const k of Object.keys(obj)) deepShape(obj[k]);
  }
  return value;
};

/** Default Prisma User selector — public fields only (no secrets). */
export const userPublicSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  businessName: true,
  gstNumber: true,
  emailVerified: true,
  createdAt: true,
  updatedAt: true,
} as const;

/** Compact User select used inside Order.user joins (was `.populate("user","name email")`). */
export const userJoinSelect = {
  id: true,
  name: true,
  email: true,
} as const;
