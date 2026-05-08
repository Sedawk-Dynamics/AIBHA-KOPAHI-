/*
 * Orders repository — Prisma against PostgreSQL.
 *
 * Mongo `populate("user","name email")` becomes Prisma `include`. We call
 * deepShape() before returning so every nested object also gets `_id`.
 *
 * Mongo `aggregate([{$match}, {$group: {revenue:{$sum:"$totalPrice"}}}])` becomes
 * `prisma.order.aggregate({ _sum: { totalPrice: true } })`.
 *
 * Helper writers (setStatus/markPaid/cancel/markDeliveryNow) replace the old
 * "load doc → mutate → save()" pattern with explicit Prisma updates.
 */

import { Decimal } from "@prisma/client/runtime/library";
import prisma from "../config/db";
import { deepShape, userJoinSelect } from "./_shape";

type OrderItemInput = {
  product: string;
  name: string;
  image?: string;
  price: number | string | Decimal;
  quantity: number;
};

type CreateOrderInput = {
  user: string;
  items: OrderItemInput[];
  shippingAddress: Record<string, unknown>;
  paymentMethod?: string;
  paymentStatus?: "Pending" | "Paid" | "Failed";
  orderStatus?: "Placed" | "Processing" | "Packed" | "Shipped" | "Delivered" | "Cancelled";
  itemsPrice: number | string;
  shippingPrice: number | string;
  taxPrice: number | string;
  totalPrice: number | string;
  couponCode?: string;
  couponDiscount?: number | string;
};

const findById = async (id: string) => {
  const order = await prisma.order.findUnique({
    where: { id: String(id) },
    include: { items: true },
  });
  return deepShape(order);
};

const findByIdWithUser = async (id: string) => {
  const order = await prisma.order.findUnique({
    where: { id: String(id) },
    include: { items: true, user: { select: userJoinSelect } },
  });
  return deepShape(order);
};

const create = async (data: CreateOrderInput) => {
  const order = await prisma.order.create({
    data: {
      userId: String(data.user),
      shippingAddress: data.shippingAddress as never,
      paymentMethod: data.paymentMethod ?? "COD",
      paymentStatus: data.paymentStatus ?? "Pending",
      orderStatus: data.orderStatus ?? "Placed",
      itemsPrice: data.itemsPrice as never,
      shippingPrice: data.shippingPrice as never,
      taxPrice: data.taxPrice as never,
      totalPrice: data.totalPrice as never,
      couponCode: data.couponCode ?? "",
      couponDiscount: (data.couponDiscount ?? 0) as never,
      items: {
        create: data.items.map((i) => ({
          productId: String(i.product),
          name: i.name,
          image: i.image ?? "",
          price: i.price as never,
          quantity: i.quantity,
        })),
      },
    },
    include: { items: true },
  });
  return deepShape(order);
};

const findByUser = async (
  userId: string,
  { sort = { createdAt: "desc" as const } }: { sort?: { createdAt?: "asc" | "desc" } } = {}
) => {
  const orders = await prisma.order.findMany({
    where: { userId: String(userId) },
    orderBy: sort,
    include: { items: true },
  });
  return deepShape(orders);
};

const listAll = async ({
  sort = { createdAt: "desc" as const },
}: { sort?: { createdAt?: "asc" | "desc" } } = {}) => {
  const orders = await prisma.order.findMany({
    orderBy: sort,
    include: { items: true, user: { select: userJoinSelect } },
  });
  return deepShape(orders);
};

const count = (filter: Record<string, unknown> = {}) =>
  prisma.order.count({ where: filter as never });

const totalPaidRevenue = async (): Promise<number> => {
  const result = await prisma.order.aggregate({
    where: { paymentStatus: "Paid" },
    _sum: { totalPrice: true },
  });
  return Number(result._sum.totalPrice ?? 0);
};

/* Mutating helpers (replace .save() pattern from Mongoose era) */

const setStatus = async (
  id: string,
  status: CreateOrderInput["orderStatus"],
  deliveredAt?: Date | null
) => {
  const order = await prisma.order.update({
    where: { id: String(id) },
    data: {
      orderStatus: status as never,
      ...(deliveredAt !== undefined ? { deliveredAt } : {}),
    },
    include: { items: true },
  });
  return deepShape(order);
};

const markPaid = async (id: string) => {
  const order = await prisma.order.update({
    where: { id: String(id) },
    data: { paymentStatus: "Paid", paidAt: new Date() },
    include: { items: true },
  });
  return deepShape(order);
};

export default {
  findById,
  findByIdWithUser,
  create,
  findByUser,
  listAll,
  count,
  totalPaidRevenue,
  setStatus,
  markPaid,
};
