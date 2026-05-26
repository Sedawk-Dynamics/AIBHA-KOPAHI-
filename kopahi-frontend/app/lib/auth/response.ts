// Standardised response envelope (v9-REST §3.2).
//
// Every endpoint returns either:
//   { success: true,  data:  { ... } }
//   { success: false, error: { code, message } }

import { NextResponse, type NextRequest } from "next/server";

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

// Wraps a route-handler function so any unhandled exception inside becomes
// a structured JSON response instead of an empty 500 (which is what Next.js
// produces by default for App Router route handlers that throw). The full
// error stack is logged server-side; the client response carries the
// error.message string (truncated). For the duration of the bootstrap /
// diagnostic phase we surface the real message in prod too — typed Prisma
// errors like 'The table `Vendor` does not exist' are gold for triage and
// won't leak anything sensitive (they describe shape, not data). Tighten
// this back to a generic string once the auth stack is stable.
export function withErrorHandling(
  label: string,
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      return await handler(req);
    } catch (err) {
      console.error(`[${label}] unhandled:`, err);
      const rawMessage =
        err instanceof Error ? err.message : "Internal server error.";
      // Truncate so a 10 KB Prisma error doesn't make a wall of text.
      const message = rawMessage.length > 600
        ? rawMessage.slice(0, 600) + "…"
        : rawMessage;
      return fail("INTERNAL_ERROR", message, 500);
    }
  };
}
