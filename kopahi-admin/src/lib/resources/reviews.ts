/*
 * Reviews — vendor-scoped list for the vendor Reviews page.
 */

import { api, toApiError } from "../api";

export type VendorReview = {
  id: string;
  _id: string;
  productId: string;
  product?: { id: string; _id: string; name: string; images: string[] };
  user?: { id: string; _id: string; name: string; email: string };
  rating: number;
  title?: string;
  comment?: string;
  createdAt: string;
};

export const listVendorReviews = async (): Promise<VendorReview[]> => {
  try {
    const res = await api.get<{ success: true; count: number; reviews: VendorReview[] }>(
      "/api/vendor/reviews"
    );
    return res.data.reviews;
  } catch (err) {
    throw toApiError(err);
  }
};
