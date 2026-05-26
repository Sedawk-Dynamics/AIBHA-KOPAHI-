// Audit logging wrapper (v9-REST §4.7).
//
// Writes to the new `AuthAuditLog` table (separate from the Express
// backend's `AuditLog`). Audit failures never throw — a broken audit pipe
// must not break the user-facing request.

import { prisma } from "../db";
import type { AuditAction } from "@prisma/client";

interface LogParams {
  userId?: string | null;
  action: AuditAction;
  metadata?: Record<string, unknown>;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export async function logAudit(params: LogParams): Promise<void> {
  try {
    await prisma.authAuditLog.create({
      data: {
        userId: params.userId ?? null,
        action: params.action,
        metadata: (params.metadata ?? undefined) as never,
        ipAddress: params.ipAddress ?? null,
        userAgent: params.userAgent ?? null,
      },
    });
  } catch (e) {
    console.error("[audit] failed to write:", e);
  }
}
