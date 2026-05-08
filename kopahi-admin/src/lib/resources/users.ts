/*
 * User-resource API calls. Backed by /api/admin/users (list, delete) and
 * /api/admin/users/create-vendor / create-admin (admin-only manual onboarding).
 */

import { api, toApiError } from "../api";
import type { ApiUser, Role, ApiListResponse, ApiResource } from "../types";

/**
 * GET /api/admin/users — list every user. Filter by role client-side.
 * Throws ApiError on failure.
 */
export const listUsers = async (): Promise<ApiUser[]> => {
  try {
    const res = await api.get<ApiListResponse<"users", ApiUser>>("/api/admin/users");
    return res.data.users;
  } catch (err) {
    throw toApiError(err);
  }
};

/** Convenience filter — uses listUsers and narrows by role. */
export const listUsersByRole = async (role: Role): Promise<ApiUser[]> => {
  const users = await listUsers();
  return users.filter((u) => u.role === role);
};

/**
 * DELETE /api/admin/user/:id — admin-only. Backend refuses self-delete.
 * Throws ApiError on failure.
 */
export const deleteUser = async (id: string): Promise<void> => {
  try {
    await api.delete(`/api/admin/user/${id}`);
  } catch (err) {
    throw toApiError(err);
  }
};

/**
 * POST /api/admin/users/create-vendor — manually onboard a vendor.
 * Created with emailVerified=true so they can sign in immediately.
 */
export const createVendor = async (input: {
  name: string;
  email: string;
  password: string;
  businessName: string;
  phone: string;
}): Promise<ApiUser> => {
  try {
    const res = await api.post<ApiResource<"user", ApiUser>>(
      "/api/admin/users/create-vendor",
      input
    );
    return res.data.user;
  } catch (err) {
    throw toApiError(err);
  }
};

/**
 * POST /api/admin/users/create-admin — add another admin.
 * Audit action: admin.user_create_admin.
 */
export const createAdmin = async (input: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}): Promise<ApiUser> => {
  try {
    const res = await api.post<ApiResource<"user", ApiUser>>(
      "/api/admin/users/create-admin",
      input
    );
    return res.data.user;
  } catch (err) {
    throw toApiError(err);
  }
};
