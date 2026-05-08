import prisma from "../config/db";
import { withMongoId, withMongoIds } from "./_shape";

const findById = async (id: string) => {
  const c = await prisma.category.findUnique({ where: { id: String(id) } });
  return withMongoId(c);
};

const list = async ({ sort = { name: "asc" as const } }: { sort?: { name?: "asc" | "desc" } } = {}) => {
  const cats = await prisma.category.findMany({ orderBy: sort });
  return withMongoIds(cats);
};

const create = async (data: { name: string; slug: string; image?: string }) => {
  const c = await prisma.category.create({
    data: {
      name: data.name,
      slug: data.slug,
      image: data.image ?? "",
    },
  });
  return withMongoId(c);
};

const updateById = async (id: string, updates: { name?: string; slug?: string; image?: string }) => {
  const c = await prisma.category.update({
    where: { id: String(id) },
    data: updates,
  });
  return withMongoId(c);
};

const deleteById = async (id: string) => {
  const c = await prisma.category.delete({ where: { id: String(id) } });
  return withMongoId(c);
};

export default { findById, list, create, updateById, deleteById };
