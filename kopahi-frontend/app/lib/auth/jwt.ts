// JWT sign/verify for the v9-REST auth stack.
//
// Two secrets — one for access tokens (short-lived, 15m default), one for
// refresh tokens (long-lived, 30d default with rotation). Both signed HS256.
// Edge-runtime verification (used by middleware.ts) lives in jwt-edge.ts and
// uses `jose` because `jsonwebtoken` won't run on the Edge runtime.

import jwt from "jsonwebtoken";
import type { VendorStatus } from "@prisma/client";
import type { AppRole } from "./roles";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
const REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
const ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY ?? "15m";
const REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY ?? "30d";

if (!ACCESS_SECRET) {
  throw new Error(
    "JWT_ACCESS_SECRET (or JWT_SECRET) env var is required for auth."
  );
}
if (!REFRESH_SECRET) {
  throw new Error(
    "JWT_REFRESH_SECRET (or JWT_SECRET) env var is required for auth."
  );
}

export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: AppRole;
  isSuperAdmin: boolean;
  vendorStatus: VendorStatus | null;
  onboardingComplete: boolean;
}

const ISSUER = "kopahi.com";
const AUDIENCE = "kopahi-web";

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, ACCESS_SECRET!, {
    expiresIn: ACCESS_EXPIRY as jwt.SignOptions["expiresIn"],
    issuer: ISSUER,
    audience: AUDIENCE,
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, ACCESS_SECRET!, {
    issuer: ISSUER,
    audience: AUDIENCE,
  }) as AccessTokenPayload;
}

export interface RefreshTokenPayload {
  sub: string;
  jti: string;
}

export function signRefreshToken(userId: string, tokenId: string): string {
  return jwt.sign({ sub: userId, jti: tokenId }, REFRESH_SECRET!, {
    expiresIn: REFRESH_EXPIRY as jwt.SignOptions["expiresIn"],
    issuer: ISSUER,
  });
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, REFRESH_SECRET!, {
    issuer: ISSUER,
  }) as RefreshTokenPayload;
}
