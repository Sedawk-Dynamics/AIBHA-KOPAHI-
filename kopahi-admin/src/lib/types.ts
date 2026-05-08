/*
 * Hand-written API response shapes for the Kopahi admin app.
 *
 * Mirrors the Prisma models on the backend without importing @prisma/client
 * (avoid bundling Prisma into the browser). Every model has both `id` and
 * `_id` because the backend's _shape.ts shim adds `_id = id` everywhere —
 * legacy code reads `_id`, new code can read `id`.
 *
 * Decimal columns serialize to strings in JSON, but route handlers sometimes
 * coerce to number — we accept both via `Money`.
 */

export type Role = "user" | "vendor" | "admin";

export type OrderStatus =
  | "Placed"
  | "Processing"
  | "Packed"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export type PaymentStatus = "Pending" | "Paid" | "Failed";

/** Decimal columns come over the wire as strings; legacy code path may also send numbers. */
export type Money = string | number;

/** Common timestamp shape on every model. */
type Timestamps = {
  createdAt: string;
  updatedAt?: string;
};

export type ApiUser = {
  id: string;
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  businessName?: string;
  emailVerified?: boolean;
} & Timestamps;

/** Compact user join shape used in Order.user includes (`select: { id, name, email }`). */
export type ApiUserJoin = {
  id: string;
  _id: string;
  name: string;
  email: string;
};

export type ApiProduct = {
  id: string;
  _id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  category?: string;
  price: Money;
  originalPrice?: Money;
  stock: number;
  images: string[];
  tags?: string[];
  featured?: boolean;
  isActive: boolean;
  vendorId?: string | null;
  /** Optional populated relation when the API includes vendor. */
  vendor?: { id: string; _id: string; name: string; businessName?: string } | null;
  rating?: Money;
  numReviews?: number;
} & Timestamps;

export type ApiOrderItem = {
  id: string;
  _id: string;
  orderId: string;
  productId?: string | null;
  name: string;
  image?: string;
  price: Money;
  quantity: number;
};

export type ApiShippingAddress = {
  fullName?: string;
  phone?: string;
  address: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
};

export type ApiOrder = {
  id: string;
  _id: string;
  userId: string;
  /** Populated when fetched via /api/orders or /api/orders/:id (admin). */
  user?: ApiUserJoin;
  shippingAddress: ApiShippingAddress;
  paymentMethod: "COD" | "Online";
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  itemsPrice: Money;
  shippingPrice: Money;
  taxPrice: Money;
  totalPrice: Money;
  couponCode?: string;
  couponDiscount?: Money;
  paidAt?: string | null;
  deliveredAt?: string | null;
  items: ApiOrderItem[];
} & Timestamps;

export type ApiCategory = {
  id: string;
  _id: string;
  name: string;
  slug: string;
  image?: string;
} & Timestamps;

export type ApiCoupon = {
  id: string;
  _id: string;
  code: string;
  description?: string;
  percentDiscount: Money;
  minSubtotal: Money;
  maxDiscount: Money;
  usageLimit: number;
  usedCount: number;
  expiresAt?: string | null;
  active: boolean;
} & Timestamps;

export type ApiBlogPost = {
  id: string;
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  tags: string[];
  published: boolean;
  publishedAt?: string | null;
} & Timestamps;

export type ApiAuditLog = {
  id: string;
  _id: string;
  actorId?: string | null;
  actorEmail?: string | null;
  actorRole?: string | null;
  action: string;
  targetType?: string | null;
  targetId?: string | null;
  metadata?: unknown;
  ip?: string | null;
  userAgent?: string | null;
  requestId?: string | null;
  createdAt: string;
};

/* ---------- Aggregate / response envelopes ---------- */

/** Backend dashboard response — flat, not nested. */
export type AdminDashboard = {
  success: true;
  totalUsers: number;
  totalVendors: number;
  totalProducts: number;
  totalOrders: number;
  leads: number;
  revenue: number;
};

export type VendorDashboard = {
  success: true;
  totalProducts: number;
  inStock: number;
  outOfStock: number;
};

/** Common list-response envelope (count + entity-specific array). */
export type ApiListResponse<K extends string, T> = {
  success: true;
  count: number;
} & { [P in K]: T[] };

/** Paginated list envelope (used by /api/products and /api/blog). */
export type ApiPaginatedResponse<K extends string, T> = {
  success: true;
  count: number;
  page: number;
  pages: number;
} & { [P in K]: T[] };

/** Generic single-resource envelope. */
export type ApiResource<K extends string, T> = {
  success: true;
} & { [P in K]: T };

/** Per-vendor stat row used by the (planned) GET /api/admin/vendors/stats. */
export type VendorStatRow = {
  vendorId: string;
  productCount: number;
  salesTotal: number;
};

/* ---------- Inputs ---------- */

export type CreateProductInput = {
  name: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  category?: string;
  price: number;
  originalPrice?: number;
  stock: number;
  images?: string[];
  tags?: string[];
  featured?: boolean;
  isActive?: boolean;
  vendorId?: string;
};

export type UpdateProductInput = Partial<CreateProductInput>;

export type CreateVendorInput = {
  name: string;
  email: string;
  password: string;
  businessName: string;
  phone: string;
};
