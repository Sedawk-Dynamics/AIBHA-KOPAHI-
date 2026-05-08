/*
 * Storage layer index — Prisma against PostgreSQL.
 *
 * Same export shape as the legacy CommonJS db/index.js. Routes/controllers
 * import this and never touch Prisma directly.
 *
 * See ../../POSTGRES_MIGRATION.md for the migration playbook.
 */

import users from "./users";
import products from "./products";
import orders from "./orders";
import categories from "./categories";
import leads from "./leads";
import coupons from "./coupons";
import blog from "./blog";
import audit from "./audit";

const db = {
  users,
  products,
  orders,
  categories,
  leads,
  coupons,
  blog,
  audit,
};

export default db;
export { users, products, orders, categories, leads, coupons, blog, audit };
