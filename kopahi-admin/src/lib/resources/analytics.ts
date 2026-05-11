/*
 * Aggregate analytics + revenue + earnings endpoints.
 *
 * - GET /api/admin/analytics       — KPI deltas, top categories, top products
 * - GET /api/admin/revenue/monthly — monthly gross / commission / net
 * - GET /api/vendor/earnings       — vendor-scoped revenue summary
 */

import { api, toApiError } from "../api";

export type AdminKpis = {
  revenue30d: number;
  revenueDeltaPct: number;
  orders30d: number;
  ordersDeltaPct: number;
  customers30d: number;
};

export type CategoryRow = { category: string; sales: number; orders: number };
export type TopProductRow = {
  productId: string;
  name: string;
  unitsSold: number;
  revenue: number;
};

export type AdminAnalytics = {
  kpis: AdminKpis;
  categories: CategoryRow[];
  topProducts: TopProductRow[];
};

export type MonthlyRevenueRow = {
  month: string;
  gross: number;
  commission: number;
  net: number;
  orders: number;
};

export type VendorEarnings = {
  totalRevenue: number;
  unitsSold: number;
  ordersFulfilled: number;
  monthly: Array<{ month: string; revenue: number; units: number }>;
  topProducts: Array<{ productId: string; name: string; revenue: number; units: number }>;
};

export const getAdminAnalytics = async (): Promise<AdminAnalytics> => {
  try {
    const res = await api.get<{ success: true } & AdminAnalytics>("/api/admin/analytics");
    return {
      kpis: res.data.kpis,
      categories: res.data.categories,
      topProducts: res.data.topProducts,
    };
  } catch (err) {
    throw toApiError(err);
  }
};

export const getMonthlyRevenue = async (months = 12): Promise<MonthlyRevenueRow[]> => {
  try {
    const res = await api.get<{ success: true; count: number; monthly: MonthlyRevenueRow[] }>(
      "/api/admin/revenue/monthly",
      { params: { months } }
    );
    return res.data.monthly;
  } catch (err) {
    throw toApiError(err);
  }
};

export const getVendorEarnings = async (): Promise<VendorEarnings> => {
  try {
    const res = await api.get<{ success: true } & VendorEarnings>("/api/vendor/earnings");
    return {
      totalRevenue: res.data.totalRevenue,
      unitsSold: res.data.unitsSold,
      ordersFulfilled: res.data.ordersFulfilled,
      monthly: res.data.monthly,
      topProducts: res.data.topProducts,
    };
  } catch (err) {
    throw toApiError(err);
  }
};
