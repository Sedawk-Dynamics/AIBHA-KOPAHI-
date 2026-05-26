/*
 * AES-256-GCM encrypt / decrypt for sensitive at-rest data — bank account
 * numbers, IFSC, UPI IDs, etc. (vendor KYC, Phase 2).
 *
 * Format of ciphertext: base64(iv ‖ authTag ‖ encrypted)
 *   - iv:        12 bytes (GCM recommended size)
 *   - authTag:   16 bytes
 *   - encrypted: variable
 *
 * Requires env var ENCRYPTION_KEY to be a 64-char hex string (32 bytes).
 * Generate with:  `openssl rand -hex 32`
 *
 * Rotate by re-reading rows with the old key and re-writing with the new
 * one; do NOT change ENCRYPTION_KEY without a rotation step or existing
 * data becomes undecipherable.
 */

import crypto from "crypto";

const ALGO = "aes-256-gcm";
const IV_BYTES = 12;
const TAG_BYTES = 16;
const KEY_BYTES = 32;

let cachedKey: Buffer | null = null;

const loadKey = (): Buffer => {
  if (cachedKey) return cachedKey;
  const raw = process.env.ENCRYPTION_KEY;
  if (!raw) {
    throw new Error(
      "ENCRYPTION_KEY env var is not set. Generate with `openssl rand -hex 32`."
    );
  }
  if (!/^[0-9a-fA-F]+$/.test(raw) || raw.length !== KEY_BYTES * 2) {
    throw new Error(
      `ENCRYPTION_KEY must be ${KEY_BYTES * 2} hex characters (${KEY_BYTES} bytes).`
    );
  }
  cachedKey = Buffer.from(raw, "hex");
  return cachedKey;
};

/** Encrypt a plaintext string. Returns base64 ciphertext. */
export const encrypt = (plaintext: string): string => {
  if (typeof plaintext !== "string") {
    throw new TypeError("encrypt() expects a string");
  }
  const key = loadKey();
  const iv = crypto.randomBytes(IV_BYTES);
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64");
};

/** Decrypt a base64 ciphertext produced by `encrypt`. Throws on tamper. */
export const decrypt = (ciphertext: string): string => {
  if (typeof ciphertext !== "string") {
    throw new TypeError("decrypt() expects a string");
  }
  const key = loadKey();
  const data = Buffer.from(ciphertext, "base64");
  if (data.length < IV_BYTES + TAG_BYTES + 1) {
    throw new Error("Ciphertext is malformed (too short).");
  }
  const iv = data.subarray(0, IV_BYTES);
  const tag = data.subarray(IV_BYTES, IV_BYTES + TAG_BYTES);
  const encrypted = data.subarray(IV_BYTES + TAG_BYTES);
  const decipher = crypto.createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString(
    "utf8"
  );
};

/**
 * Last-N-only display helper for masked rendering of sensitive numbers
 * (e.g. bank account "XXXX XXXX 1234"). Pure formatting — does not touch
 * the encryption layer.
 */
export const mask = (value: string, visibleTail = 4): string => {
  const v = String(value ?? "");
  if (v.length <= visibleTail) return "•".repeat(v.length);
  return "•".repeat(v.length - visibleTail) + v.slice(-visibleTail);
};

export default { encrypt, decrypt, mask };
