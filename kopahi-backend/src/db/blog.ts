import prisma from "../config/db";
import { withMongoId, withMongoIds } from "./_shape";

const findBySlug = async (slug: string) => {
  const post = await prisma.blogPost.findUnique({ where: { slug: String(slug) } });
  return withMongoId(post);
};

const findById = async (id: string) => {
  const post = await prisma.blogPost.findUnique({ where: { id: String(id) } });
  return withMongoId(post);
};

const listPublished = async ({
  page = 1,
  pageSize = 12,
}: { page?: number | string; pageSize?: number | string } = {}) => {
  const safeSize = Math.min(Math.max(Number(pageSize) || 12, 1), 50);
  const safePage = Math.max(Number(page) || 1, 1);
  const where = { published: true };

  const [count, items] = await Promise.all([
    prisma.blogPost.count({ where }),
    prisma.blogPost.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: safeSize * (safePage - 1),
      take: safeSize,
    }),
  ]);
  withMongoIds(items);
  return {
    count,
    page: safePage,
    pages: Math.ceil(count / safeSize) || 1,
    items,
  };
};

const listAll = async ({ sort = { publishedAt: "desc" as const } }: { sort?: { publishedAt?: "asc" | "desc" } } = {}) => {
  const posts = await prisma.blogPost.findMany({ orderBy: sort });
  return withMongoIds(posts);
};

const create = async (data: Record<string, unknown>) => {
  const post = await prisma.blogPost.create({ data: data as never });
  return withMongoId(post);
};

const updateById = async (id: string, updates: Record<string, unknown>) => {
  const post = await prisma.blogPost.update({
    where: { id: String(id) },
    data: updates as never,
  });
  return withMongoId(post);
};

const deleteById = async (id: string) => {
  const post = await prisma.blogPost.delete({ where: { id: String(id) } });
  return withMongoId(post);
};

export default {
  findBySlug,
  findById,
  listPublished,
  listAll,
  create,
  updateById,
  deleteById,
};
