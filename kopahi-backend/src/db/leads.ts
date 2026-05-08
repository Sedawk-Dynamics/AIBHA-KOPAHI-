import prisma from "../config/db";
import { withMongoId, withMongoIds } from "./_shape";

type LeadCreate = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  source?: string;
  status?: string;
  emailDelivered?: boolean;
  emailError?: string;
};

const create = async (data: LeadCreate) => {
  const lead = await prisma.lead.create({ data });
  return withMongoId(lead);
};

const list = async ({ sort = { createdAt: "desc" as const } }: { sort?: { createdAt?: "asc" | "desc" } } = {}) => {
  const leads = await prisma.lead.findMany({ orderBy: sort });
  return withMongoIds(leads);
};

const count = (filter: Record<string, unknown> = {}) =>
  prisma.lead.count({ where: filter as never });

const updateById = async (
  id: string,
  updates: Partial<LeadCreate>
) => {
  const lead = await prisma.lead.update({ where: { id: String(id) }, data: updates });
  return withMongoId(lead);
};

const findUndelivered = async () => {
  const leads = await prisma.lead.findMany({
    where: { emailDelivered: false },
    orderBy: { createdAt: "desc" },
  });
  return withMongoIds(leads);
};

export default { create, list, count, updateById, findUndelivered };
