// Edge-runtime JWT verifier. Only the Edge middleware uses this — Route
// Handlers use the standard `jsonwebtoken` library via jwt.ts.

import { jwtVerify } from "jose";
import type { AccessTokenPayload } from "./jwt";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;

if (!ACCESS_SECRET) {
  throw new Error("JWT_ACCESS_SECRET (or JWT_SECRET) must be set for edge JWT verify.");
}

const encoded = new TextEncoder().encode(ACCESS_SECRET);

export async function verifyAccessTokenEdge(
  token: string
): Promise<AccessTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encoded, {
      issuer: "kopahi.com",
      audience: "kopahi-web",
    });
    return payload as unknown as AccessTokenPayload;
  } catch {
    return null;
  }
}
