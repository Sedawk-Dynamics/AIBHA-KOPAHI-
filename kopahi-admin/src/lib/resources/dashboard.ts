/*
 * Dashboard-stats API calls. Backed by:
 *  - GET /api/admin/dashboard         (admin-only aggregates)
 *  - GET /api/vendor/stats             (vendor's own product counts)
 */

import { api, toApiError } from "../api";
import type { AdminDashboard, VendorDashboard } from "../types";

/**
 * GET /api/admin/dashboard — totalUsers, totalVendors, totalProducts,
 * totalOrders, leads, revenue (sum of paid orders).
 */
export const getAdminStats = async (): Promise<AdminDashboard> => {
  try {
    const res = await api.get<AdminDashboard>("/api/admin/dashboard");
    return res.data;
  } catch (err) {
    throw toApiError(err);
  }
};

/**
 * GET /api/vendor/stats — totalProducts, inStock, outOfStock for the
 * logged-in vendor. Reachable by vendor or admin.
 */
export const getVendorStats = async (): Promise<VendorDashboard> => {
  try {
    const res = await api.get<VendorDashboard>("/api/vendor/stats");
    return res.data;
  } catch (err) {
    throw toApiError(err);
  }
};
