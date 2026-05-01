import { prisma } from "@/lib/db";
import { blogFormSchema } from "@/lib/schemas/blog-form";
import { looksLikeMarkdown, normalizeSlug, parseOptionalDate, richTextFromInput, sanitizeHtml } from "@/lib/admin/content";

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

  const rawContent = parsed.contentHtml.trim();
  const normalizedContent = richTextFromInput(rawContent, { baseHeadingLevel: 2 });
  // #region agent log
  fetch("http://127.0.0.1:7370/ingest/b54ed65d-267c-4421-b3af-1ea0f3df3748", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "582712" },
    body: JSON.stringify({
      sessionId: "582712",
      runId: "blog-markdown",
      hypothesisId: "H1_SAVE_CONVERSION",
      location: "lib/admin/blog.ts:upsertBlogPostFromForm",
      message: "Conteudo do blog normalizado na persistencia",
      data: {
        hasHtmlTags: /<[a-z][\s\S]*>/i.test(rawContent),
        looksLikeMarkdown: looksLikeMarkdown(rawContent),
        rawPreview: rawContent.slice(0, 180),
        normalizedPreview: normalizedContent.slice(0, 220)
      },
      timestamp: Date.now()
    })
  }).catch(() => {});
  // #endregion

  const data = {
    title: parsed.title.trim(),
    slug: normalizeSlug(parsed.slug || parsed.title),
    excerpt: parsed.excerpt.trim(),
    contentHtml: /<[a-z][\s\S]*>/i.test(rawContent) ? sanitizeHtml(normalizedContent) : normalizedContent,
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
