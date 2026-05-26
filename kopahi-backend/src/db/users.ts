/*
 * Users repository — Prisma against PostgreSQL.
 * Public surface mirrors the old Mongoose db/users.js so routes/controllers
 * compile unchanged. The `_id` mirror is added on the way out (see _shape.ts).
 */

import prisma from "../config/db";
import { deepShape, userPublicSelect, withMongoId } from "./_shape";

type Sort = { createdAt?: "asc" | "desc"; [k: string]: "asc" | "desc" | undefined };

const findById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id: String(id) },
    select: userPublicSelect,
  });
  return withMongoId(user);
};

const findByIdWithPassword = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id: String(id) },
    select: { ...userPublicSelect, password: true },
  });
  return withMongoId(user);
};

const findByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email: String(email ?? "").toLowerCase() },
    select: userPublicSelect,
  });
  return withMongoId(user);
};

const findByEmailWithPassword = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email: String(email ?? "").toLowerCase() },
    select: { ...userPublicSelect, password: true },
  });
  return withMongoId(user);
};

const findByPasswordResetToken = async (tokenHash: string) => {
  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: tokenHash,
      passwordResetExpires: { gt: new Date() },
    },
    select: { ...userPublicSelect, passwordResetToken: true, passwordResetExpires: true },
  });
  return withMongoId(user);
};

const findByEmailVerificationToken = async (tokenHash: string) => {
  const user = await prisma.user.findFirst({
    where: {
      emailVerificationToken: tokenHash,
      emailVerificationExpires: { gt: new Date() },
    },
    select: {
      ...userPublicSelect,
      emailVerificationToken: true,
      emailVerificationExpires: true,
    },
  });
  return withMongoId(user);
};

type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: "user" | "vendor" | "admin";
  businessName?: string;
  gstNumber?: string;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
};

const create = async (data: CreateUserInput) => {
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email.toLowerCase(),
      password: data.password,
      phone: data.phone ?? "",
      role: data.role ?? "user",
      businessName: data.businessName ?? "",
      gstNumber: data.gstNumber ?? "",
      emailVerificationToken: data.emailVerificationToken,
      emailVerificationExpires: data.emailVerificationExpires,
    },
    select: userPublicSelect,
  });
  return withMongoId(user);
};

const updateById = async (id: string, updates: Partial<CreateUserInput> & Record<string, unknown>) => {
  // Caller must pass plain Prisma-shaped data (no $unset / $inc).
  const user = await prisma.user.update({
    where: { id: String(id) },
    data: updates as never,
    select: userPublicSelect,
  });
  return withMongoId(user);
};

const deleteById = async (id: string) => {
  const user = await prisma.user.delete({
    where: { id: String(id) },
    select: userPublicSelect,
  });
  return withMongoId(user);
};

const list = async (
  filter: Record<string, unknown> = {},
  { sort = { createdAt: "desc" as const } }: { sort?: Sort } = {}
) => {
  const users = await prisma.user.findMany({
    where: filter as never,
    orderBy: sort as never,
    select: userPublicSelect,
  });
  return users.map((u) => withMongoId(u)!);
};

const count = (filter: Record<string, unknown> = {}) =>
  prisma.user.count({ where: filter as never });

const setPasswordResetToken = (id: string, tokenHash: string, expires: Date) =>
  prisma.user.update({
    where: { id: String(id) },
    data: { passwordResetToken: tokenHash, passwordResetExpires: expires },
    select: { id: true },
  });

const clearPasswordResetToken = (id: string, newPasswordHash: string) =>
  prisma.user.update({
    where: { id: String(id) },
    data: {
      password: newPasswordHash,
      passwordResetToken: null,
      passwordResetExpires: null,
    },
    select: { id: true },
  });

const setEmailVerificationToken = (id: string, tokenHash: string, expires: Date) =>
  prisma.user.update({
    where: { id: String(id) },
    data: {
      emailVerificationToken: tokenHash,
      emailVerificationExpires: expires,
      emailVerified: false,
    },
    select: { id: true },
  });

const markEmailVerified = async (id: string) => {
  const user = await prisma.user.update({
    where: { id: String(id) },
    data: {
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
    },
    select: userPublicSelect,
  });
  return withMongoId(user);
};

const updatePassword = (id: string, hashed: string) =>
  prisma.user.update({
    where: { id: String(id) },
    data: { password: hashed },
    select: { id: true },
  });

/* Lockout + sign-in tracking — see authController.loginUser. */

const incrementFailedAttempts = async (id: string): Promise<number> => {
  const updated = await prisma.user.update({
    where: { id: String(id) },
    data: { failedLoginAttempts: { increment: 1 } },
    select: { failedLoginAttempts: true },
  });
  return updated.failedLoginAttempts;
};

const lockAccount = (id: string, until: Date) =>
  prisma.user.update({
    where: { id: String(id) },
    data: { lockedUntil: until },
    select: { id: true },
  });

const clearLockAndAttempts = (id: string) =>
  prisma.user.update({
    where: { id: String(id) },
    data: { failedLoginAttempts: 0, lockedUntil: null },
    select: { id: true },
  });

const recordSuccessfulSignIn = (id: string, ip: string | null) =>
  prisma.user.update({
    where: { id: String(id) },
    data: {
      failedLoginAttempts: 0,
      lockedUntil: null,
      lastSignInAt: new Date(),
      lastSignInIp: ip,
    },
    select: { id: true },
  });

/* Wishlist & cart — return shapes that mimic the old populated subdocuments. */

const getWishlist = async (id: string) => {
  const items = await prisma.wishlist.findMany({
    where: { userId: String(id) },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });
  // Frontend reads { wishlist: Product[] } — flatten and shape.
  const wishlist = items.map((i) => i.product);
  deepShape(wishlist);
  return { _id: id, id, wishlist };
};

const addToWishlist = async (id: string, productId: string) => {
  // $addToSet equivalent — composite PK makes upsert idempotent.
  await prisma.wishlist.upsert({
    where: { userId_productId: { userId: String(id), productId: String(productId) } },
    create: { userId: String(id), productId: String(productId) },
    update: {},
  });
  return getWishlist(id);
};

const removeFromWishlist = async (id: string, productId: string) => {
  try {
    await prisma.wishlist.delete({
      where: { userId_productId: { userId: String(id), productId: String(productId) } },
    });
  } catch {
    // P2025 — already gone. Idempotent.
  }
  return getWishlist(id);
};

const getCart = async (id: string) => {
  const items = await prisma.cartItem.findMany({
    where: { userId: String(id) },
    include: { product: true },
    orderBy: { updatedAt: "desc" },
  });
  // Map to old shape: { cart: [{ product, quantity }] }
  const cart = items.map((i) => ({ product: i.product, quantity: i.quantity }));
  deepShape(cart);
  return { _id: id, id, cart };
};

const replaceCart = async (
  id: string,
  items: Array<{ product: string; quantity: number }>
) => {
  await prisma.$transaction([
    prisma.cartItem.deleteMany({ where: { userId: String(id) } }),
    prisma.cartItem.createMany({
      data: items.map((i) => ({
        userId: String(id),
        productId: String(i.product),
        quantity: Math.max(1, Math.min(50, Number(i.quantity) || 1)),
      })),
      skipDuplicates: true,
    }),
  ]);
  return getCart(id);
};

const clearCart = async (id: string) => {
  await prisma.cartItem.deleteMany({ where: { userId: String(id) } });
  return getCart(id);
};

export default {
  findById,
  findByIdWithPassword,
  findByEmail,
  findByEmailWithPassword,
  findByPasswordResetToken,
  findByEmailVerificationToken,
  create,
  updateById,
  deleteById,
  list,
  count,
  setPasswordResetToken,
  clearPasswordResetToken,
  setEmailVerificationToken,
  markEmailVerified,
  updatePassword,
  incrementFailedAttempts,
  lockAccount,
  clearLockAndAttempts,
  recordSuccessfulSignIn,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getCart,
  replaceCart,
  clearCart,
};
