import type { Request } from "express";
import db from "../db";
import logger from "./logger";

type AuditPayload = {
  action: string;
  targetType?: string;
  targetId?: string | number | { toString(): string };
  metadata?: unknown;
};

/*
 * Record a destructive or otherwise notable action. Never throws — audit
 * failures must not break the user-facing operation.
 */
export const recordAudit = async (
  req: Request,
  { action, targetType, targetId, metadata }: AuditPayload
): Promise<void> => {
  try {
    await db.audit.create({
      actorId: (req.user as { id?: string } | undefined)?.id,
      actorEmail: (req.user as { email?: string } | undefined)?.email,
      actorRole: (req.user as { role?: string } | undefined)?.role,
      action,
      targetType,
      targetId: targetId !== undefined ? String(targetId) : undefined,
      metadata,
      ip: req.ip,
      userAgent: req.get("user-agent") ?? undefined,
      requestId: (req as Request & { id?: string }).id,
    });
  } catch (err) {
    logger.error("audit_write_failed", {
      action,
      targetType,
      targetId: targetId !== undefined ? String(targetId) : undefined,
      err: (err as Error).message,
      requestId: (req as Request & { id?: string }).id,
    });
  }
};

export default { recordAudit };
