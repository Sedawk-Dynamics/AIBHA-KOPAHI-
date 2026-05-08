/*
 * Product-resource API calls. Backed by:
 *  - GET    /api/products              (public, paginated, ?keyword=&category=)
 *  - GET    /api/products/:id          (public)
 *  - POST   /api/products               (vendor or admin)
 *  - PUT    /api/products/:id          (vendor on own; admin on any)
 *  - DELETE /api/products/:id          (vendor on own; admin on any)
 *  - GET    /api/vendor/products        (vendor's own products)
 *  - POST   /api/products/upload        (multipart image)
 */

import { api, toApiError } from "../api";
import type {
  ApiProduct,
  ApiPaginatedResponse,
  ApiResource,
  ApiListResponse,
  CreateProductInput,
  UpdateProductInput,
} from "../types";

export type ProductFilters = {
  keyword?: string;
  category?: string;
  page?: number;
  pageSize?: number;
  /** When true, include the vendor relation on each product (admin view). */
  includeVendor?: boolean;
  /** When true, also include inactive products (admin view). */
  all?: boolean;
};

export type ProductListResult = {
  products: ApiProduct[];
  page: number;
  pages: number;
  count: number;
};

/**
 * GET /api/products — paginated list with optional keyword + category filters.
 * Throws ApiError on failure.
 */
export const listProducts = async (
  filters: ProductFilters = {}
): Promise<ProductListResult> => {
  try {
    const res = await api.get<ApiPaginatedResponse<"products", ApiProduct>>(
      "/api/products",
      { params: filters }
    );
    return {
      products: res.data.products,
      page: res.data.page,
      pages: res.data.pages,
      count: res.data.count,
    };
  } catch (err) {
    throw toApiError(err);
  }
};

/**
 * GET /api/products/:id — fetch a single product by id.
 */
export const getProduct = async (id: string): Promise<ApiProduct> => {
  try {
    const res = await api.get<ApiResource<"product", ApiProduct>>(
      `/api/products/${id}`
    );
    return res.data.product;
  } catch (err) {
    throw toApiError(err);
  }
};

/**
 * POST /api/products — create a product. Vendors are auto-attached as owner.
 * Admins may pass `vendorId` to onboard on a vendor's behalf.
 */
export const createProduct = async (
  input: CreateProductInput
): Promise<ApiProduct> => {
  try {
    const res = await api.post<ApiResource<"product", ApiProduct>>(
      "/api/products",
      input
    );
    return res.data.product;
  } catch (err) {
    throw toApiError(err);
  }
};

/**
 * PUT /api/products/:id — partial update. Vendors may only edit their own.
 */
export const updateProduct = async (
  id: string,
  input: UpdateProductInput
): Promise<ApiProduct> => {
  try {
    const res = await api.put<ApiResource<"product", ApiProduct>>(
      `/api/products/${id}`,
      input
    );
    return res.data.product;
  } catch (err) {
    throw toApiError(err);
  }
};

/**
 * DELETE /api/products/:id — vendors may only delete their own.
 */
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await api.delete(`/api/products/${id}`);
  } catch (err) {
    throw toApiError(err);
  }
};

/**
 * GET /api/vendor/products — products owned by the logged-in vendor.
 */
export const vendorProducts = async (): Promise<ApiProduct[]> => {
  try {
    const res = await api.get<ApiListResponse<"products", ApiProduct>>(
      "/api/vendor/products"
    );
    return res.data.products;
  } catch (err) {
    throw toApiError(err);
  }
};

/**
 * POST /api/products/upload — multipart upload of a single image. Backend
 * uses Cloudinary if configured, otherwise saves to /uploads/products.
 * Returns the public URL of the saved image.
 */
export const uploadProductImage = async (file: File): Promise<string> => {
  try {
    const form = new FormData();
    form.append("image", file);
    const res = await api.post<{ success: true; image?: string; url?: string }>(
      "/api/products/upload",
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data.url ?? res.data.image ?? "";
  } catch (err) {
    throw toApiError(err);
  }
};
