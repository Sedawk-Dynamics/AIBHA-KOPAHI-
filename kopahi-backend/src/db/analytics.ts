/*
 * Aggregate queries for the admin Analytics, Revenue, Earnings dashboards.
 *
 * All sums are over Paid orders only (paymentStatus = "Paid"). Time-bucketed
 * queries use `date_trunc` so the SQL leans on Postgres rather than rebuilding
 * months in TypeScript.
 */

import prisma from "../config/db";

export type MonthlyRevenueRow = {
  /** First day of the month, ISO date string (e.g. "2026-05-01"). */
  month: string;
  gross: number;
  /** 10% platform commission, matches the Revenue page placeholder math. */
  commission: number;
  net: number;
  orders: number;
};

const monthlyRevenue = async (months = 12): Promise<MonthlyRevenueRow[]> => {
  const rows = await prisma.$queryRaw<
    Array<{ month: Date; gross: string | number; orders: bigint }>
  >`SELECT
       date_trunc('month', "paidAt") AS month,
       COALESCE(SUM("totalPrice"), 0) AS gross,
       COUNT(*) AS orders
     FROM "Order"
     WHERE "paymentStatus" = 'Paid'
       AND "paidAt" IS NOT NULL
       AND "paidAt" >= NOW() - (${months}::int * INTERVAL '1 month')
     GROUP BY 1
     ORDER BY 1 ASC`;

  return rows.map((r) => {
    const gross = Number(r.gross);
    const commission = Math.round(gross * 0.1);
    return {
      month: new Date(r.month).toISOString().slice(0, 10),
      gross,
      commission,
      net: gross - commission,
      orders: Number(r.orders),
    };
  });
};

export type CategoryRevenueRow = { category: string; sales: number; orders: number };

const revenueByCategory = async (): Promise<CategoryRevenueRow[]> => {
  const rows = await prisma.$queryRaw<
    Array<{ category: string; sales: string | number; orders: bigint }>
  >`SELECT
       p.category,
       COALESCE(SUM(oi.price * oi.quantity), 0) AS sales,
       COUNT(DISTINCT o.id) AS orders
     FROM "OrderItem" oi
     JOIN "Order" o ON o.id = oi."orderId"
     JOIN "Product" p ON p.id = oi."productId"
     WHERE o."paymentStatus" = 'Paid'
     GROUP BY p.category
     ORDER BY sales DESC
     LIMIT 10`;
  return rows.map((r) => ({
    category: r.category,
    sales: Number(r.sales),
    orders: Number(r.orders),
  }));
};

export type TopProductRow = {
  productId: string;
  name: string;
  unitsSold: number;
  revenue: number;
};

const topProducts = async (limit = 5): Promise<TopProductRow[]> => {
  const rows = await prisma.$queryRaw<
    Array<{
      productId: string | null;
      name: string;
      unitsSold: bigint;
      revenue: string | number;
    }>
  >`SELECT
       oi."productId",
       oi.name,
       SUM(oi.quantity) AS "unitsSold",
       SUM(oi.price * oi.quantity) AS revenue
     FROM "OrderItem" oi
     JOIN "Order" o ON o.id = oi."orderId"
     WHERE o."paymentStatus" = 'Paid'
     GROUP BY oi."productId", oi.name
     ORDER BY revenue DESC
     LIMIT ${limit}`;
  return rows
    .filter((r) => r.productId)
    .map((r) => ({
      productId: String(r.productId),
      name: r.name,
      unitsSold: Number(r.unitsSold),
      revenue: Number(r.revenue),
    }));
};

/** Aggregate KPIs for the admin Analytics view — last 30 days vs prior 30. */
const headlineKpis = async () => {
  const rows = await prisma.$queryRaw<
    Array<{
      revenue_30d: string | null;
      revenue_prev30: string | null;
      orders_30d: bigint;
      orders_prev30: bigint;
      customers_30d: bigint;
    }>
  >`WITH ranges AS (
       SELECT NOW() - INTERVAL '30 days' AS d30,
              NOW() - INTERVAL '60 days' AS d60
     )
     SELECT
       (SELECT COALESCE(SUM("totalPrice"),0)
          FROM "Order", ranges
          WHERE "paymentStatus"='Paid' AND "paidAt" >= ranges.d30) AS revenue_30d,
       (SELECT COALESCE(SUM("totalPrice"),0)
          FROM "Order", ranges
          WHERE "paymentStatus"='Paid'
            AND "paidAt" >= ranges.d60 AND "paidAt" < ranges.d30) AS revenue_prev30,
       (SELECT COUNT(*)::bigint
          FROM "Order", ranges
          WHERE "createdAt" >= ranges.d30) AS orders_30d,
       (SELECT COUNT(*)::bigint
          FROM "Order", ranges
          WHERE "createdAt" >= ranges.d60 AND "createdAt" < ranges.d30) AS orders_prev30,
       (SELECT COUNT(DISTINCT "userId")::bigint
          FROM "Order", ranges
          WHERE "createdAt" >= ranges.d30) AS customers_30d`;

  const r = rows[0]!;
  const revenue30 = Number(r.revenue_30d ?? 0);
  const revenuePrev = Number(r.revenue_prev30 ?? 0);
  const orders30 = Number(r.orders_30d);
  const ordersPrev = Number(r.orders_prev30);
  const pct = (cur: number, prev: number) =>
    prev === 0 ? (cur > 0 ? 100 : 0) : Math.round(((cur - prev) / prev) * 100);

  return {
    revenue30d: revenue30,
    revenueDeltaPct: pct(revenue30, revenuePrev),
    orders30d: orders30,
    ordersDeltaPct: pct(orders30, ordersPrev),
    customers30d: Number(r.customers_30d),
  };
};

/** Vendor-scoped revenue + units sold across paid orders. */
const earningsForVendor = async (
  vendorId: string
): Promise<{
  totalRevenue: number;
  unitsSold: number;
  ordersFulfilled: number;
  monthly: Array<{ month: string; revenue: number; units: number }>;
  topProducts: Array<{ productId: string; name: string; revenue: number; units: number }>;
}> => {
  const summary = await prisma.$queryRaw<
    Array<{
      revenue: string | number | null;
      units: bigint;
      orders: bigint;
    }>
  >`SELECT
       COALESCE(SUM(oi.price * oi.quantity), 0) AS revenue,
       COALESCE(SUM(oi.quantity), 0) AS units,
       COUNT(DISTINCT o.id) AS orders
     FROM "OrderItem" oi
     JOIN "Order" o ON o.id = oi."orderId"
     JOIN "Product" p ON p.id = oi."productId"
     WHERE o."paymentStatus" = 'Paid' AND p."vendorId" = ${vendorId}`;

  const monthly = await prisma.$queryRaw<
    Array<{ month: Date; revenue: string | number; units: bigint }>
  >`SELECT
       date_trunc('month', o."paidAt") AS month,
       COALESCE(SUM(oi.price * oi.quantity), 0) AS revenue,
       COALESCE(SUM(oi.quantity), 0) AS units
     FROM "OrderItem" oi
     JOIN "Order" o ON o.id = oi."orderId"
     JOIN "Product" p ON p.id = oi."productId"
     WHERE o."paymentStatus" = 'Paid'
       AND p."vendorId" = ${vendorId}
       AND o."paidAt" IS NOT NULL
       AND o."paidAt" >= NOW() - INTERVAL '12 months'
     GROUP BY 1
     ORDER BY 1 ASC`;

  const top = await prisma.$queryRaw<
    Array<{
      productId: string;
      name: string;
      revenue: string | number;
      units: bigint;
    }>
  >`SELECT oi."productId", oi.name,
            SUM(oi.price * oi.quantity) AS revenue,
            SUM(oi.quantity) AS units
       FROM "OrderItem" oi
       JOIN "Order" o ON o.id = oi."orderId"
       JOIN "Product" p ON p.id = oi."productId"
      WHERE o."paymentStatus" = 'Paid' AND p."vendorId" = ${vendorId}
      GROUP BY oi."productId", oi.name
      ORDER BY revenue DESC
      LIMIT 5`;

  const s = summary[0]!;
  return {
    totalRevenue: Number(s.revenue ?? 0),
    unitsSold: Number(s.units),
    ordersFulfilled: Number(s.orders),
    monthly: monthly.map((m) => ({
      month: new Date(m.month).toISOString().slice(0, 10),
      revenue: Number(m.revenue),
      units: Number(m.units),
    })),
    topProducts: top.map((t) => ({
      productId: t.productId,
      name: t.name,
      revenue: Number(t.revenue),
      units: Number(t.units),
    })),
  };
};

export default {
  monthlyRevenue,
  revenueByCategory,
  topProducts,
  headlineKpis,
  earningsForVendor,
};
