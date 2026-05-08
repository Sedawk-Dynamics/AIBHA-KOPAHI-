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

/**
 * GET /api/orders — admin-only list of all orders, sorted newest first.
 * Returns user.name/email populated on each order.
 */
export const listOrders = async (): Promise<ApiOrder[]> => {
  try {
    const res = await api.get<ApiListResponse<"orders", ApiOrder>>("/api/orders");
    return res.data.orders;
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
