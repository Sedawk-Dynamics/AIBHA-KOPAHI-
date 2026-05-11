/*
 * Reviews repository — backs the vendor Reviews page (reviews on a vendor's
 * own products) and any future admin moderation view.
 */

import prisma from "../config/db";
import { deepShape } from "./_shape";

const findByVendor = async (vendorId: string, limit = 100) => {
  const reviews = await prisma.review.findMany({
    where: { product: { vendorId } },
    include: {
      user: { select: { id: true, name: true, email: true } },
      product: { select: { id: true, name: true, images: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return deepShape(reviews);
};

export default { findByVendor };
