import { z } from "zod";
import { slugify } from "./slug";

const optionalUrl = z.union([z.string().trim().url(), z.literal("")]).optional();
const schema = z.object({
  type: z.enum(["NEWS", "GUIDE", "DATA_REPORT"]),
  authorId: z.string().uuid(),
  title: z.string().trim().min(5).max(180),
  subtitle: z.string().trim().max(240).optional(),
  slug: z.string().trim().max(180).optional(),
  excerpt: z.string().trim().min(10).max(600),
  contentHtml: z.string().trim().min(20),
  coverImageUrl: optionalUrl,
  coverImageAlt: z.string().trim().max(240).optional(),
  coverImageCaption: z.string().trim().max(300).optional(),
  section: z.string().trim().max(100).optional(),
  tags: z.string().max(1_000).optional(),
  sourceName: z.string().trim().max(180).optional(),
  sourceUrl: optionalUrl,
  seoTitle: z.string().trim().max(70).optional(),
  metaDescription: z.string().trim().max(170).optional(),
  canonicalUrl: optionalUrl,
  internalNotes: z.string().trim().max(5_000).optional(),
  status: z.enum(["DRAFT", "PENDING_REVIEW", "SCHEDULED", "PUBLISHED", "ARCHIVED"]),
  scheduledAt: z.string().optional(),
  expiresAt: z.string().optional(),
  featured: z.string().optional()
});

function dateOrNull(value: string | undefined): Date | null | "invalid" {
  if (!value?.trim()) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "invalid" : date;
}

const nullable = (value: string | undefined) => value?.trim() || null;

export function parseArticleForm(form: FormData, now = new Date()) {
  const parsed = schema.safeParse(Object.fromEntries(form));
  if (!parsed.success) {
    return { ok: false as const, error: "Campos editoriais inválidos.", details: parsed.error.issues.map((issue) => issue.message) };
  }
  const scheduledAt = dateOrNull(parsed.data.scheduledAt);
  const expiresAt = dateOrNull(parsed.data.expiresAt);
  if (scheduledAt === "invalid" || expiresAt === "invalid") {
    return { ok: false as const, error: "Data de agendamento ou validade inválida.", details: [] };
  }
  if (parsed.data.status === "SCHEDULED" && (!scheduledAt || scheduledAt <= now)) {
    return { ok: false as const, error: "O agendamento deve estar no futuro.", details: [] };
  }
  if (expiresAt && expiresAt <= now) {
    return { ok: false as const, error: "A validade deve estar no futuro.", details: [] };
  }
  if (parsed.data.coverImageUrl && !parsed.data.coverImageAlt?.trim()) {
    return { ok: false as const, error: "Informe o texto alternativo da imagem de capa.", details: [] };
  }
  const slug = slugify(parsed.data.slug || parsed.data.title);
  if (!slug) return { ok: false as const, error: "Não foi possível gerar o slug do conteúdo.", details: [] };

  return {
    ok: true as const,
    data: {
      type: parsed.data.type,
      authorId: parsed.data.authorId,
      title: parsed.data.title,
      subtitle: nullable(parsed.data.subtitle),
      slug,
      excerpt: parsed.data.excerpt,
      contentHtml: parsed.data.contentHtml,
      coverImageUrl: nullable(parsed.data.coverImageUrl),
      coverImageAlt: nullable(parsed.data.coverImageAlt),
      coverImageCaption: nullable(parsed.data.coverImageCaption),
      section: nullable(parsed.data.section),
      tags: (parsed.data.tags ?? "").split(",").map((tag) => tag.trim()).filter(Boolean),
      sourceName: nullable(parsed.data.sourceName),
      sourceUrl: nullable(parsed.data.sourceUrl),
      seoTitle: nullable(parsed.data.seoTitle),
      metaDescription: nullable(parsed.data.metaDescription),
      canonicalUrl: nullable(parsed.data.canonicalUrl),
      internalNotes: nullable(parsed.data.internalNotes),
      status: parsed.data.status,
      scheduledAt: parsed.data.status === "SCHEDULED" ? scheduledAt : null,
      expiresAt,
      featured: parsed.data.featured === "on"
    }
  };
}
