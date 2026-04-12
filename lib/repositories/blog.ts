import { prisma } from "@/lib/db";
import { pagination } from "@/lib/constants";

export async function getRecentPosts() {
  return prisma.blogPost.findMany({
    where: { isPublished: true },
    include: { category: true },
    orderBy: [{ publishedAt: "desc" }],
    take: 6
  });
}

export async function getPostsBySlugs(slugs: string[]) {
  if (!slugs.length) return [];

  const items = await prisma.blogPost.findMany({
    where: {
      isPublished: true,
      slug: { in: slugs }
    },
    include: { category: true }
  });

  const map = new Map(items.map((item) => [item.slug, item]));
  return slugs
    .map((slug) => map.get(slug))
    .filter((item): item is (typeof items)[number] => Boolean(item));
}

export async function getPosts(params?: { page?: number }) {
  const page = params?.page ?? 1;

  const [items, total] = await Promise.all([
    prisma.blogPost.findMany({
      where: { isPublished: true },
      include: { category: true },
      orderBy: [{ publishedAt: "desc" }],
      take: pagination.blogPerPage,
      skip: (page - 1) * pagination.blogPerPage
    }),
    prisma.blogPost.count({
      where: { isPublished: true }
    })
  ]);

  return {
    items,
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / pagination.blogPerPage))
  };
}

export async function getPostBySlug(slug: string) {
  return prisma.blogPost.findUnique({
    where: { slug },
    include: { category: true }
  });
}

export async function getAllPublishedPostEntries() {
  return prisma.blogPost.findMany({
    where: { isPublished: true },
    select: {
      slug: true,
      updatedAt: true
    },
    orderBy: [{ updatedAt: "desc" }]
  });
}

export async function getRelatedPosts(params: { slug?: string; categoryId?: string; limit?: number }) {
  return prisma.blogPost.findMany({
    where: {
      isPublished: true,
      ...(params.slug ? { slug: { not: params.slug } } : {}),
      ...(params.categoryId ? { categoryId: params.categoryId } : {})
    },
    include: { category: true },
    orderBy: [{ publishedAt: "desc" }],
    take: params.limit ?? 3
  });
}
