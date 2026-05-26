// Opaque tokens for email verification, password reset, and the refresh
// token's secret half. 32 bytes (256 bits) of entropy, hex-encoded.
//
// We store only the SHA-256 hash in the DB — a database leak doesn't expose
// live tokens that way.

import crypto from "crypto";

const TOKEN_BYTES = 32; // 32 bytes = 64 hex chars

export function generateOpaqueToken(): string {
  return crypto.randomBytes(TOKEN_BYTES).toString("hex");
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}
