import { unstable_cache } from "next/cache";

import { prisma } from "@/lib/db";
import { pagination } from "@/lib/constants";
import { PUBLIC_BLOG_CACHE_TAG } from "@/lib/public-revalidate";

export const getRecentPosts = unstable_cache(async () => {
  return prisma.blogPost.findMany({
    where: { isPublished: true },
    include: { category: true },
    orderBy: [{ publishedAt: "desc" }],
    take: 6
  });
}, ["recent-posts-v1"], {
  revalidate: 7200,
  tags: [PUBLIC_BLOG_CACHE_TAG]
});

const getPostsBySlugsCached = unstable_cache(async (slugKey: string) => {
  const slugs = JSON.parse(slugKey) as string[];
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
}, ["posts-by-slugs-v1"], {
  revalidate: 7200,
  tags: [PUBLIC_BLOG_CACHE_TAG]
});

export async function getPostsBySlugs(slugs: string[]) {
  return getPostsBySlugsCached(JSON.stringify(slugs));
}

const getPostsCached = unstable_cache(async (page: number) => {
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
}, ["posts-list-v1"], {
  revalidate: 7200,
  tags: [PUBLIC_BLOG_CACHE_TAG]
});

export async function getPosts(params?: { page?: number }) {
  return getPostsCached(params?.page ?? 1);
}

export const getPostBySlug = unstable_cache(async (slug: string) => {
  return prisma.blogPost.findUnique({
    where: { slug },
    include: { category: true }
  });
}, ["post-by-slug-v1"], {
  revalidate: 7200,
  tags: [PUBLIC_BLOG_CACHE_TAG]
});

export const getAllPublishedPostEntries = unstable_cache(async () => {
  return prisma.blogPost.findMany({
    where: { isPublished: true },
    select: {
      slug: true,
      updatedAt: true
    },
    orderBy: [{ updatedAt: "desc" }]
  });
}, ["published-post-sitemap-entries-v1"], {
  revalidate: 7200,
  tags: [PUBLIC_BLOG_CACHE_TAG]
});

const getRelatedPostsCached = unstable_cache(async (key: string) => {
  const params = JSON.parse(key) as { slug?: string; categoryId?: string; limit?: number };
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
}, ["related-posts-v1"], {
  revalidate: 7200,
  tags: [PUBLIC_BLOG_CACHE_TAG]
});

export async function getRelatedPosts(params: { slug?: string; categoryId?: string; limit?: number }) {
  return getRelatedPostsCached(
    JSON.stringify({
      slug: params.slug ?? null,
      categoryId: params.categoryId ?? null,
      limit: params.limit ?? 3
    })
  );
}
