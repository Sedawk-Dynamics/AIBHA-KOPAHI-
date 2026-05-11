/*
 * Settings repository — small key/value store backing the admin Settings page.
 * Each tab gets its own key (e.g. "general", "shipping") and the value is
 * a free-form JSON blob shaped by whatever the page sends.
 */

import prisma from "../config/db";

const getAll = async (): Promise<Record<string, unknown>> => {
  const rows = await prisma.setting.findMany();
  const out: Record<string, unknown> = {};
  for (const r of rows) out[r.key] = r.value;
  return out;
};

const get = async (key: string): Promise<unknown> => {
  const row = await prisma.setting.findUnique({ where: { key } });
  return row?.value ?? null;
};

const upsert = async (
  key: string,
  value: unknown,
  updatedBy?: string
): Promise<unknown> => {
  const row = await prisma.setting.upsert({
    where: { key },
    create: { key, value: value as never, updatedBy: updatedBy ?? null },
    update: { value: value as never, updatedBy: updatedBy ?? null },
  });
  return row.value;
};

export default { getAll, get, upsert };
