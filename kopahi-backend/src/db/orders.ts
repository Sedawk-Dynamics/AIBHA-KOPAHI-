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

type ListAllOpts = {
  sort?: { createdAt?: "asc" | "desc" };
  status?: CreateOrderInput["orderStatus"];
  page?: number | string;
  pageSize?: number | string;
};

type OrderRow = Awaited<ReturnType<typeof prisma.order.findMany>>[number];
type PaginatedOrders = {
  count: number;
  page: number;
  pages: number;
  items: OrderRow[];
};

// Overloads disambiguate the return type by whether pagination is requested.
async function listAll(
  opts?: { sort?: { createdAt?: "asc" | "desc" }; status?: CreateOrderInput["orderStatus"] }
): Promise<OrderRow[]>;
async function listAll(opts: ListAllOpts): Promise<OrderRow[] | PaginatedOrders>;
async function listAll({
  sort = { createdAt: "desc" as const },
  status,
  page,
  pageSize,
}: ListAllOpts = {}): Promise<OrderRow[] | PaginatedOrders> {
  const where = status ? { orderStatus: status as never } : {};

  // Pagination is opt-in: when neither page nor pageSize is supplied we keep
  // the legacy "return everything" behavior.
  if (page === undefined && pageSize === undefined) {
    const orders = await prisma.order.findMany({
      where,
      orderBy: sort,
      include: { items: true, user: { select: userJoinSelect } },
    });
    return deepShape(orders) as OrderRow[];
  }

  const safeSize = Math.min(Math.max(Number(pageSize) || 20, 1), 100);
  const safePage = Math.max(Number(page) || 1, 1);
  const [count, items] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      orderBy: sort,
      include: { items: true, user: { select: userJoinSelect } },
      skip: safeSize * (safePage - 1),
      take: safeSize,
    }),
  ]);
  deepShape(items);
  return {
    count,
    page: safePage,
    pages: Math.ceil(count / safeSize) || 1,
    items,
  };
}

/* Per-vendor aggregate — productCount + salesTotal across paid orders. */
const vendorStats = async (): Promise<
  Array<{ vendorId: string; productCount: number; salesTotal: number }>
> => {
  // 1. Product counts per vendor.
  const productGroups = await prisma.product.groupBy({
    by: ["vendorId"],
    _count: { _all: true },
    where: { vendorId: { not: null } },
  });

  // 2. Sales totals per vendor — sum (price * quantity) of OrderItems whose
  //    parent Order is Paid, grouped by the product's vendor.
  // Prisma's groupBy doesn't traverse relations, so do this via raw SQL.
  const salesRows = await prisma.$queryRaw<
    Array<{ vendorId: string; salesTotal: number | string | null }>
  >`SELECT p."vendorId" AS "vendorId",
           COALESCE(SUM(oi.price * oi.quantity), 0) AS "salesTotal"
       FROM "OrderItem" oi
       JOIN "Order" o ON o.id = oi."orderId"
       JOIN "Product" p ON p.id = oi."productId"
      WHERE o."paymentStatus" = 'Paid'
        AND p."vendorId" IS NOT NULL
      GROUP BY p."vendorId"`;

  const salesMap = new Map(
    salesRows.map((r) => [String(r.vendorId), Number(r.salesTotal ?? 0)])
  );

  return productGroups
    .filter((g) => g.vendorId)
    .map((g) => ({
      vendorId: String(g.vendorId),
      productCount: g._count._all,
      salesTotal: salesMap.get(String(g.vendorId)) ?? 0,
    }));
};

/* Orders that contain at least one product owned by `vendorId`. */
const findByVendor = async (vendorId: string) => {
  const orders = await prisma.order.findMany({
    where: { items: { some: { product: { vendorId: String(vendorId) } } } },
    orderBy: { createdAt: "desc" },
    include: {
      items: { include: { product: { select: { id: true, vendorId: true } } } },
      user: { select: userJoinSelect },
    },
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
  findByVendor,
  listAll,
  vendorStats,
  count,
  totalPaidRevenue,
  setStatus,
  markPaid,
};
