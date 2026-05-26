// Password hashing with bcryptjs. We use bcryptjs (pure JS) over node-bcrypt
// (native binding) to keep the deploy pipeline portable across Dokploy /
// Vercel / serverless runtimes that don't reliably build native deps.
//
// Hash format is identical to node-bcrypt's; the two libraries' hashes are
// cross-compatible.

import bcrypt from "bcryptjs";

const COST_FROM_ENV = parseInt(process.env.BCRYPT_COST ?? "12", 10);
// In test, drop cost to 4 so suites stay fast.
const COST = process.env.NODE_ENV === "test" ? 4 : COST_FROM_ENV;

export async function hashPassword(plaintext: string): Promise<string> {
  return bcrypt.hash(plaintext, COST);
}

export async function verifyPassword(
  plaintext: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plaintext, hash);
}

// A bcrypt-formatted hash that will always verify-fail. Used by the login
// route to consume a hashing cycle when the email is unknown, so the
// response time is uniform across "no such user" and "wrong password" cases
// (mitigates user-enumeration via timing).
//
// Generated once at module load with the configured cost — same shape and
// cost as a real hash but the plaintext is unguessable garbage.
export const TIMING_DUMMY_HASH = bcrypt.hashSync(
  "kopahi-timing-dummy-" + Math.random().toString(36),
  COST
);
