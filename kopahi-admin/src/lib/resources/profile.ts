/*
 * Self-service profile endpoints.
 *
 * - GET   /api/auth/me              — current user shape
 * - PATCH /api/auth/me              — { name?, phone?, businessName?, gstNumber? }
 *                                     (businessName/gstNumber require role=vendor)
 * - PATCH /api/auth/me/password     — { currentPassword, newPassword }
 */

import { api, toApiError } from "../api";
import type { ApiUser } from "../types";

export const getMe = async (): Promise<ApiUser> => {
  try {
    const res = await api.get<{ success: true; user: ApiUser }>("/api/auth/me");
    return res.data.user;
  } catch (err) {
    throw toApiError(err);
  }
};

export type ProfileUpdate = {
  name?: string;
  phone?: string;
  businessName?: string;
  gstNumber?: string;
};

export const updateProfile = async (input: ProfileUpdate): Promise<ApiUser> => {
  try {
    const res = await api.patch<{ success: true; user: ApiUser }>(
      "/api/auth/me",
      input
    );
    return res.data.user;
  } catch (err) {
    throw toApiError(err);
  }
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  try {
    await api.patch("/api/auth/me/password", { currentPassword, newPassword });
  } catch (err) {
    throw toApiError(err);
  }
};
