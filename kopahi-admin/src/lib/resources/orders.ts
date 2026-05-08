/*
 * Order-resource API calls. Backed by:
 *  - GET /api/orders                  (admin: list all, with user populated)
 *  - GET /api/orders/:id              (owner or admin: single order)
 *  - PUT /api/orders/:id/status       (admin: update status)
 *  - PUT /api/orders/:id/pay          (admin: mark paid)
 *  - PUT /api/orders/:id/cancel       (owner or admin: cancel + restore stock)
 *  - GET /api/orders/mine             (current user's own orders)
 *
 * vendorOrders() hits a planned GET /api/vendor/orders endpoint added in
 * Phase 4 — until then it returns 404.
 */

import { api, toApiError } from "../api";
import type {
  ApiOrder,
  OrderStatus,
  ApiListResponse,
  ApiResource,
} from "../types";

export type OrderListFilters = {
  status?: OrderStatus | "All";
  page?: number;
  pageSize?: number;
};

export type OrderListResult = {
  orders: ApiOrder[];
  page: number;
  pages: number;
  count: number;
};

/**
 * GET /api/orders — admin-only. Supports ?status=&page=&pageSize=.
 * Returns user.name/email populated on each order. The status filter is
 * applied server-side; "All" or unset disables the filter.
 */
export const listOrders = async (
  filters: OrderListFilters = {}
): Promise<OrderListResult> => {
  try {
    const params: Record<string, string | number> = {};
    if (filters.status && filters.status !== "All") params.status = filters.status;
    if (filters.page) params.page = filters.page;
    if (filters.pageSize) params.pageSize = filters.pageSize;

    const res = await api.get<{
      success: true;
      count: number;
      page?: number;
      pages?: number;
      orders: ApiOrder[];
    }>("/api/orders", { params });

    return {
      orders: res.data.orders,
      page: res.data.page ?? 1,
      pages: res.data.pages ?? 1,
      count: res.data.count,
    };
  } catch (err) {
    throw toApiError(err);
  }
};

/**
 * GET /api/orders/:id — owner or admin can fetch.
 */
export const getOrder = async (id: string): Promise<ApiOrder> => {
  try {
    const res = await api.get<ApiResource<"order", ApiOrder>>(`/api/orders/${id}`);
    return res.data.order;
  } catch (err) {
    throw toApiError(err);
  }
};

/**
 * PUT /api/orders/:id/status — admin-only. Allowed values match OrderStatus.
 */
export const updateStatus = async (
  id: string,
  orderStatus: OrderStatus
): Promise<ApiOrder> => {
  try {
    const res = await api.put<ApiResource<"order", ApiOrder>>(
      `/api/orders/${id}/status`,
      { orderStatus }
    );
    return res.data.order;
  } catch (err) {
    throw toApiError(err);
  }
};

/**
 * PUT /api/orders/:id/pay — admin-only. Marks paymentStatus = "Paid".
 */
export const markPaid = async (id: string): Promise<ApiOrder> => {
  try {
    const res = await api.put<ApiResource<"order", ApiOrder>>(
      `/api/orders/${id}/pay`
    );
    return res.data.order;
  } catch (err) {
    throw toApiError(err);
  }
};

/**
 * PUT /api/orders/:id/cancel — owner or admin. Restores stock atomically.
 */
export const cancelOrder = async (id: string): Promise<ApiOrder> => {
  try {
    const res = await api.put<ApiResource<"order", ApiOrder>>(
      `/api/orders/${id}/cancel`
    );
    return res.data.order;
  } catch (err) {
    throw toApiError(err);
  }
};

/**
 * GET /api/vendor/orders — orders containing the logged-in vendor's products.
 * Endpoint is added in Phase 4. Until then returns 404 ApiError.
 */
export const vendorOrders = async (): Promise<ApiOrder[]> => {
  try {
    const res = await api.get<ApiListResponse<"orders", ApiOrder>>(
      "/api/vendor/orders"
    );
    return res.data.orders;
  } catch (err) {
    throw toApiError(err);
  }
};
