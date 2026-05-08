import prisma from "../config/db";
import { deepShape } from "./_shape";

type AuditCreateInput = {
  actorId?: string;
  actorEmail?: string;
  actorRole?: string;
  action: string;
  targetType?: string;
  targetId?: string;
  metadata?: unknown;
  ip?: string;
  userAgent?: string;
  requestId?: string;
};

const create = async (data: AuditCreateInput) => {
  const log = await prisma.auditLog.create({
    data: {
      actorId: data.actorId,
      actorEmail: data.actorEmail,
      actorRole: data.actorRole,
      action: data.action,
      targetType: data.targetType,
      targetId: data.targetId,
      metadata: data.metadata as never,
      ip: data.ip,
      userAgent: data.userAgent,
      requestId: data.requestId,
    },
  });
  return deepShape(log);
};

type ListOpts = {
  page?: number | string;
  pageSize?: number | string;
  action?: string;
  actor?: string;
};

const list = async ({ page = 1, pageSize = 50, action, actor }: ListOpts = {}) => {
  const safeSize = Math.min(Math.max(Number(pageSize) || 50, 1), 200);
  const safePage = Math.max(Number(page) || 1, 1);
  const where: Record<string, unknown> = {};
  if (action) where.action = action;
  if (actor) where.actorId = actor;

  const logs = await prisma.auditLog.findMany({
    where: where as never,
    orderBy: { createdAt: "desc" },
    skip: safeSize * (safePage - 1),
    take: safeSize,
    include: { actor: { select: { id: true, name: true, email: true, role: true } } },
  });
  return deepShape(logs);
};

const count = (filter: Record<string, unknown> = {}) =>
  prisma.auditLog.count({ where: filter as never });

export default { create, list, count };
