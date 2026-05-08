/*
 * Products repository — Prisma against PostgreSQL.
 * The atomic decrementStock is the most important function here: it preserves
 * the "conditional update returns nothing if stock insufficient" semantics from
 * the Mongoose era (`findOneAndUpdate({stock: {$gte: qty}})`).
 */

import prisma from "../config/db";
import { deepShape, withMongoId, withMongoIds } from "./_shape";

type Sort = Record<string, "asc" | "desc">;
type ListOpts = { page?: number | string; pageSize?: number | string; sort?: Sort };

const findById = async (id: string) => {
  const p = await prisma.product.findUnique({ where: { id: String(id) } });
  return withMongoId(p);
};

const findByIds = async (ids: string[]) => {
  const products = await prisma.product.findMany({
    where: { id: { in: ids.map((i) => String(i)) } },
  });
  return withMongoIds(products);
};

const create = async (data: Record<string, unknown>) => {
  const product = await prisma.product.create({ data: data as never });
  return withMongoId(product);
};

const list = async (
  filter: Record<string, unknown> = {},
  { page = 1, pageSize = 12, sort = { createdAt: "desc" } as Sort }: ListOpts = {}
) => {
  const safeSize = Math.min(Math.max(Number(pageSize) || 12, 1), 50);
  const safePage = Math.max(Number(page) || 1, 1);
  const where = filter as never;
  const [count, items] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      skip: safeSize * (safePage - 1),
      take: safeSize,
      orderBy: sort as never,
    }),
  ]);
  withMongoIds(items);
  return {
    count,
    page: safePage,
    pages: Math.ceil(count / safeSize) || 1,
    items,
  };
};

const findFeatured = async (limit = 8) => {
  const products = await prisma.product.findMany({
    where: { featured: true, isActive: true },
    take: limit,
  });
  return withMongoIds(products);
};

const count = (filter: Record<string, unknown> = {}) =>
  prisma.product.count({ where: filter as never });

const deleteById = async (id: string) => {
  const product = await prisma.product.delete({ where: { id: String(id) } });
  return withMongoId(product);
};

const updateById = async (id: string, updates: Record<string, unknown>) => {
  const product = await prisma.product.update({
    where: { id: String(id) },
    data: updates as never,
  });
  return withMongoId(product);
};

/*
 * Atomic conditional decrement.
 *
 * Mongo: findOneAndUpdate({_id, stock: {$gte: qty}}, {$inc: {stock: -qty}}, {new: true})
 * Prisma equivalent: updateMany with predicate. Returns count, not the row,
 * so we re-fetch on success. Returns null if stock was insufficient (matches
 * Mongoose's "no doc found" return).
 */
const decrementStock = async (id: string, qty: number) => {
  const result = await prisma.product.updateMany({
    where: { id: String(id), stock: { gte: qty } },
    data: { stock: { decrement: qty } },
  });
  if (result.count === 0) return null;
  const updated = await prisma.product.findUnique({ where: { id: String(id) } });
  return withMongoId(updated);
};

const incrementStock = async (id: string, qty: number) => {
  const updated = await prisma.product.update({
    where: { id: String(id) },
    data: { stock: { increment: qty } },
  });
  return withMongoId(updated);
};

const findByVendor = async (
  vendorId: string,
  { sort = { createdAt: "desc" } as Sort }: { sort?: Sort } = {}
) => {
  const products = await prisma.product.findMany({
    where: { vendorId: String(vendorId) },
    orderBy: sort as never,
  });
  return withMongoIds(products);
};

export default {
  findById,
  findByIds,
  create,
  list,
  findFeatured,
  count,
  deleteById,
  updateById,
  decrementStock,
  incrementStock,
  findByVendor,
};

export { deepShape };
