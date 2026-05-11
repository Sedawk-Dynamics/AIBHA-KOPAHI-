/*
 * Admin settings — free-form key/value store backed by /api/admin/settings.
 * The Settings page serializes each tab as its own JSON blob under a
 * stable key (e.g. "general", "shipping", "payments").
 */

import { api, toApiError } from "../api";

export type SettingsMap = Record<string, unknown>;

export const getAllSettings = async (): Promise<SettingsMap> => {
  try {
    const res = await api.get<{ success: true; settings: SettingsMap }>(
      "/api/admin/settings"
    );
    return res.data.settings;
  } catch (err) {
    throw toApiError(err);
  }
};

export const upsertSetting = async (
  key: string,
  value: unknown
): Promise<unknown> => {
  try {
    const res = await api.put<{ success: true; key: string; value: unknown }>(
      `/api/admin/settings/${encodeURIComponent(key)}`,
      { value }
    );
    return res.data.value;
  } catch (err) {
    throw toApiError(err);
  }
};
