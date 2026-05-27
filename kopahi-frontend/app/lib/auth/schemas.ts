// Zod schemas shared between client forms and Route Handlers.

import { z } from "zod";

export const emailSchema = z.string().email().toLowerCase().trim().max(254);

// Password policy: 12+ chars (matches the backend's existing policy),
// upper / lower / digit / symbol. The v9-REST brief specifies 8 minimum,
// but we keep parity with the stronger existing backend policy.
export const passwordSchema = z
  .string()
  .min(12, "Password must be at least 12 characters")
  .max(128, "Password is too long")
  .regex(/[A-Z]/, "Must contain an uppercase letter")
  .regex(/[a-z]/, "Must contain a lowercase letter")
  .regex(/[0-9]/, "Must contain a digit")
  .regex(/[^a-zA-Z0-9]/, "Must contain a symbol");

export const phoneSchema = z
  .string()
  .regex(/^\+?[0-9\s-]{10,15}$/, "Invalid phone number");

export const NE_STATES = [
  "Assam",
  "Meghalaya",
  "Arunachal Pradesh",
  "Nagaland",
  "Manipur",
  "Sikkim",
  "Mizoram",
  "Tripura",
] as const;

export const customerSignupSchema = z.object({
  name: z.string().min(2).max(80).trim(),
  email: emailSchema,
  phone: phoneSchema.optional(),
  password: passwordSchema,
  acceptTerms: z.literal(true, { message: "You must accept the terms" }),
});

export const vendorSignupSchema = customerSignupSchema.extend({
  businessName: z.string().min(2).max(120).trim(),
  state: z.enum(NE_STATES),
  primaryCategory: z.enum([
    "Tea",
    "Spices",
    "Rice",
    "Fruit",
    "Vegetable Powder",
    "Herbal Powder",
    "Superfood",
    "Specialty",
    "Handcraft",
  ]),
  phone: phoneSchema, // required for vendors
  acceptVendorAgreement: z.literal(true, {
    message: "You must accept the vendor agreement",
  }),
});

// Admin signup is gated by a single-use, email-locked invite token issued
// by another admin via POST /api/admin/invites. The submitted email must
// match the invite's email; the server ignores any mismatch.
export const adminSignupSchema = customerSignupSchema.extend({
  token: z.string().length(64),
  phone: phoneSchema, // required for admins
});

export const createAdminInviteSchema = z.object({
  email: emailSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(128),
});

export const forgotPasswordSchema = z.object({ email: emailSchema });

export const resetPasswordSchema = z.object({
  token: z.string().length(64),
  password: passwordSchema,
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: passwordSchema,
});

export type CustomerSignupInput = z.infer<typeof customerSignupSchema>;
export type VendorSignupInput = z.infer<typeof vendorSignupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
