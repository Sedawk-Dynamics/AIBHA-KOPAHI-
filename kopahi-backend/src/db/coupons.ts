import prisma from "../config/db";
import { withMongoId, withMongoIds } from "./_shape";

const findByCode = async (code: string) => {
  const coupon = await prisma.coupon.findUnique({
    where: { code: String(code ?? "").toUpperCase().trim() },
  });
  return withMongoId(coupon);
};

const findById = async (id: string) => {
  const coupon = await prisma.coupon.findUnique({ where: { id: String(id) } });
  return withMongoId(coupon);
};

const list = async ({ sort = { createdAt: "desc" as const } }: { sort?: { createdAt?: "asc" | "desc" } } = {}) => {
  const coupons = await prisma.coupon.findMany({ orderBy: sort });
  return withMongoIds(coupons);
};

const create = async (data: Record<string, unknown>) => {
  const coupon = await prisma.coupon.create({ data: data as never });
  return withMongoId(coupon);
};

const updateById = async (id: string, updates: Record<string, unknown>) => {
  const coupon = await prisma.coupon.update({
    where: { id: String(id) },
    data: updates as never,
  });
  return withMongoId(coupon);
};

const deleteById = async (id: string) => {
  const coupon = await prisma.coupon.delete({ where: { id: String(id) } });
  return withMongoId(coupon);
};

const incrementUsage = async (id: string) => {
  const coupon = await prisma.coupon.update({
    where: { id: String(id) },
    data: { usedCount: { increment: 1 } },
  });
  return withMongoId(coupon);
};

export default {
  findByCode,
  findById,
  list,
  create,
  updateById,
  deleteById,
  incrementUsage,
};
