// Standardised response envelope (v9-REST §3.2).
//
// Every endpoint returns either:
//   { success: true,  data:  { ... } }
//   { success: false, error: { code, message } }

import { NextResponse } from "next/server";

export type ErrorCode =
  | "VALIDATION_ERROR"
  | "INVALID_CREDENTIALS"
  | "EMAIL_NOT_VERIFIED"
  | "ACCOUNT_LOCKED"
  | "ACCOUNT_SUSPENDED"
  | "TOKEN_INVALID"
  | "TOKEN_EXPIRED"
  | "TOKEN_ALREADY_USED"
  | "NOT_AUTHENTICATED"
  | "FORBIDDEN"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function created<T>(data: T) {
  return ok(data, 201);
}

export function fail(code: ErrorCode, message: string, status = 400) {
  return NextResponse.json(
    { success: false, error: { code, message } },
    { status }
  );
}
