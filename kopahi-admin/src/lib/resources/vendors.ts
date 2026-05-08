/*
 * Vendor-resource API calls. Vendors are users with role="vendor"; backed by
 * /api/admin/users (list filtered) and /api/admin/users/create-vendor.
 *
 * getVendorStats currently hits the planned GET /api/admin/vendors/stats
 * aggregate endpoint — that endpoint is added in Phase 4 alongside the
 * Vendors page wiring. Until then this function will throw a 404 ApiError.
 */

import { api, toApiError } from "../api";
import { listUsersByRole, createVendor as createVendorViaUsers } from "./users";
import type { ApiUser, ApiListResponse, VendorStatRow, CreateVendorInput } from "../types";

/**
 * Convenience wrapper around listUsersByRole("vendor").
 * Throws ApiError on failure.
 */
export const listVendors = (): Promise<ApiUser[]> => listUsersByRole("vendor");

/**
 * Re-export createVendor from users so callers can `import { createVendor } from "../lib/resources/vendors"`.
 */
export const createVendor = (input: CreateVendorInput): Promise<ApiUser> =>
  createVendorViaUsers(input);

/**
 * GET /api/admin/vendors/stats — per-vendor aggregate (productCount + salesTotal).
 * Endpoint is added in Phase 4. Until then this throws a 404 ApiError.
 */
export const listVendorStats = async (): Promise<VendorStatRow[]> => {
  try {
    const res = await api.get<ApiListResponse<"vendors", VendorStatRow>>(
      "/api/admin/vendors/stats"
    );
    return res.data.vendors;
  } catch (err) {
    throw toApiError(err);
  }
};

/**
 * GET /api/admin/vendors/:id/stats — single vendor's stats. Optional helper
 * for a future per-vendor detail page.
 */
export const getVendorStats = async (vendorId: string): Promise<VendorStatRow> => {
  try {
    const res = await api.get<{ success: true; vendor: VendorStatRow }>(
      `/api/admin/vendors/${vendorId}/stats`
    );
    return res.data.vendor;
  } catch (err) {
    throw toApiError(err);
  }
};
