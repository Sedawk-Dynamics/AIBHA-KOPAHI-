/*
 * Audit-log API. Backed by:
 *  - GET /api/admin/audit?page=&pageSize=&action=    (admin-only)
 */

import { api, toApiError } from "../api";
import type { ApiAuditLog, ApiListResponse } from "../types";

export type AuditFilters = {
  page?: number | string;
  pageSize?: number | string;
  /** Optional exact-match action filter, e.g. "user.signup". */
  action?: string;
};

/**
 * GET /api/admin/audit — recent audit-log entries, newest first.
 * Throws ApiError on failure.
 */
export const listAudit = async (
  filters: AuditFilters = {}
): Promise<ApiAuditLog[]> => {
  try {
    const res = await api.get<ApiListResponse<"logs", ApiAuditLog>>(
      "/api/admin/audit",
      { params: filters }
    );
    return res.data.logs;
  } catch (err) {
    throw toApiError(err);
  }
};
