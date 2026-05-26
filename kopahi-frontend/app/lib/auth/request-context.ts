// Extracts IP + user-agent from an incoming request. Used by audit logs
// and rate limiting.

import type { NextRequest } from "next/server";

export interface RequestContext {
  ip: string;
  userAgent: string;
}

export function getRequestContext(req: NextRequest): RequestContext {
  const fwd = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const ip = fwd?.split(",")[0]?.trim() || realIp || "unknown";
  const userAgent = req.headers.get("user-agent") ?? "unknown";
  return { ip, userAgent };
}
