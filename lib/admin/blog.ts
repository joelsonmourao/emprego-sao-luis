import { prisma } from "@/lib/db";
import { blogFormSchema } from "@/lib/schemas/blog-form";
import { normalizeSlug, plainTextToHtml, parseOptionalDate, sanitizeHtml } from "@/lib/admin/content";

export async function getOrCreateBlogCategoryBySlug(slugOrName: string) {
  const slug = normalizeSlug(slugOrName);

  return (
    (await prisma.blogCategory.findFirst({
      where: {
        OR: [{ slug }, { name: { equals: slugOrName, mode: "insensitive" } }]
      }
    })) ??
    prisma.blogCategory.create({
      data: {
        name: slugOrName.trim(),
        slug
      }
    })
  );
}

export async function upsertBlogPostFromForm(input: unknown, existingId?: string) {
  const parsed = blogFormSchema.parse(input);
  const category = await getOrCreateBlogCategoryBySlug(parsed.categorySlug);
  const existing = existingId
    ? await prisma.blogPost.findUnique({
        where: { id: existingId },
        select: { id: true, publishedAt: true }
      })
    : null;

  const data = {
    title: parsed.title.trim(),
    slug: normalizeSlug(parsed.slug || parsed.title),
    excerpt: parsed.excerpt.trim(),
    contentHtml: parsed.contentHtml.includes("<") ? sanitizeHtml(parsed.contentHtml.trim()) : plainTextToHtml(parsed.contentHtml.trim()),
    coverImageUrl: parsed.coverImageUrl?.trim() || null,
    seoTitle: parsed.seoTitle.trim(),
    seoDescription: parsed.seoDescription.trim(),
    isPublished: parsed.isPublished,
    categoryId: category.id
  };

  if (existingId) {
    if (!existing) {
      throw new Error("Post nao encontrado.");
    }

    return prisma.blogPost.update({
      where: { id: existingId },
      data: {
        ...data,
        publishedAt: parseOptionalDate(parsed.publishedAt) ?? existing.publishedAt
      }
    });
  }

  return prisma.blogPost.create({
    data: {
      ...data,
      publishedAt: parseOptionalDate(parsed.publishedAt) ?? new Date()
    }
  });
}
