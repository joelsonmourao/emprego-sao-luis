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

const getPostsCached = unstable_cache(async (key: string) => {
  const { page, categorySlug } = JSON.parse(key) as { page: number; categorySlug: string | null };
  const where = {
    isPublished: true,
    ...(categorySlug ? { category: { slug: categorySlug } } : {})
  };

  const [items, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      include: { category: true },
      orderBy: [{ publishedAt: "desc" }],
      take: pagination.blogPerPage,
      skip: (page - 1) * pagination.blogPerPage
    }),
    prisma.blogPost.count({ where })
  ]);

  return {
    items,
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / pagination.blogPerPage))
  };
}, ["posts-list-v2"], {
  revalidate: 7200,
  tags: [PUBLIC_BLOG_CACHE_TAG]
});

export async function getPosts(params?: { page?: number; categorySlug?: string }) {
  return getPostsCached(
    JSON.stringify({
      page: params?.page ?? 1,
      categorySlug: params?.categorySlug?.trim() || null
    })
  );
}

export const getBlogCategories = unstable_cache(async () => {
  return prisma.blogCategory.findMany({
    where: { posts: { some: { isPublished: true } } },
    orderBy: [{ name: "asc" }],
    include: {
      _count: {
        select: { posts: { where: { isPublished: true } } }
      }
    }
  });
}, ["blog-categories-v1"], {
  revalidate: 7200,
  tags: [PUBLIC_BLOG_CACHE_TAG]
});

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
