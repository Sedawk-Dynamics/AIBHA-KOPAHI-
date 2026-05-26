// Edge-runtime JWT verifier. Only the Edge middleware uses this — Route
// Handlers use the standard `jsonwebtoken` library via jwt.ts.
//
// Env validation is LAZY (same reason as jwt.ts — top-level throws break
// `next build` because the build-time container doesn't see runtime env).

import { jwtVerify } from "jose";
import type { AccessTokenPayload } from "./jwt";

function getEncodedSecret(): Uint8Array {
  const s = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
  if (!s) {
    throw new Error(
      "JWT_ACCESS_SECRET (or JWT_SECRET) env var is required for edge JWT verify."
    );
  }
  return new TextEncoder().encode(s);
}

export async function verifyAccessTokenEdge(
  token: string
): Promise<AccessTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getEncodedSecret(), {
      issuer: "kopahi.com",
      audience: "kopahi-web",
    });
    return payload as unknown as AccessTokenPayload;
  } catch {
    return null;
  }
}
