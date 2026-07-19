import { z } from "zod";
import { slugify } from "./slug";

const optionalUrl = z.union([z.string().trim().url(), z.literal("")]).optional();
const schema = z.object({
  type: z.enum(["NEWS", "GUIDE", "DATA_REPORT"]),
  authorId: z.string().uuid(),
  reviewerId: z.union([z.string().uuid(), z.literal("")]).optional(),
  pillarId: z.union([z.string().uuid(), z.literal("")]).optional(),
  clusterId: z.union([z.string().uuid(), z.literal("")]).optional(),
  title: z.string().trim().min(5).max(180),
  subtitle: z.string().trim().max(240).optional(),
  slug: z.string().trim().max(180).optional(),
  excerpt: z.string().trim().min(10).max(600),
  contentHtml: z.string().trim().min(20),
  coverImageUrl: optionalUrl,
  coverImageAlt: z.string().trim().max(240).optional(),
  coverImageCaption: z.string().trim().max(300).optional(),
  coverImageCredit: z.string().trim().max(300).optional(),
  section: z.string().trim().max(100).optional(),
  tags: z.string().max(1_000).optional(),
  sourceName: z.string().trim().max(180).optional(),
  sourceUrl: optionalUrl,
  seoTitle: z.string().trim().max(70).optional(),
  metaDescription: z.string().trim().max(170).optional(),
  canonicalUrl: optionalUrl,
  internalNotes: z.string().trim().max(5_000).optional(),
  primaryKeyword: z.string().trim().max(180).optional(),
  searchIntent: z.enum(["INFORMATIONAL", "TRANSACTIONAL", "NAVIGATIONAL", "LOCAL"]).optional(),
  sources: z.string().max(10_000).optional(),
  aiAssisted: z.string().optional(),
  factCheckedAt: z.string().optional(),
  factReviewNotes: z.string().trim().max(5_000).optional(),
  sponsoredContent: z.string().optional(),
  sponsorshipDisclosure: z.string().trim().max(500).optional(),
  relatedArticleIds: z.string().max(5_000).optional(),
  relatedJobIds: z.string().max(5_000).optional(),
  editorialStage: z.enum(["PITCH", "SOURCES", "BRIEF", "DRAFT", "FACT_REVIEW", "EDITORIAL_REVIEW", "INTERNAL_LINKS", "SEO", "APPROVED"]),
  editorialTemplate: z.enum(["STANDARD", "POST_MAGNETICO"]).default("STANDARD"),
  directAnswer: z.string().trim().max(2_000).optional(),
  localHook: z.string().trim().max(2_000).optional(),
  audience: z.string().trim().max(120).optional(),
  candidateCta: z.string().trim().max(300).optional(),
  companyCta: z.string().trim().max(300).optional(),
  discoverEligible: z.string().optional(),
  newsEligible: z.string().optional(),
  webStoryEligible: z.string().optional(),
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
    return {
      ok: false as const,
      error: "Campos editoriais inválidos.",
      details: parsed.error.issues.map((issue) => issue.message)
    };
  }
  const scheduledAt = dateOrNull(parsed.data.scheduledAt);
  const expiresAt = dateOrNull(parsed.data.expiresAt);
  const factCheckedAt = dateOrNull(parsed.data.factCheckedAt);
  if (scheduledAt === "invalid" || expiresAt === "invalid" || factCheckedAt === "invalid") {
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
  if (parsed.data.coverImageUrl && !parsed.data.coverImageCredit?.trim()) {
    return { ok: false as const, error: "Informe o crédito/origem da imagem de capa.", details: [] };
  }
  if (
    parsed.data.status === "PUBLISHED" &&
    (!parsed.data.coverImageUrl ||
      !parsed.data.coverImageAlt?.trim() ||
      !parsed.data.coverImageCaption?.trim() ||
      !parsed.data.coverImageCredit?.trim())
  ) {
    return {
      ok: false as const,
      error: "Publicação exige imagem principal, ALT, legenda e crédito.",
      details: []
    };
  }
  const plainLength = parsed.data.contentHtml.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().length;
  const sourceLines = (parsed.data.sources ?? "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const sources = sourceLines.map((line) => {
    const [name, url] = line.split("|").map((part) => part.trim());
    return { name: name || null, url: url || null };
  });
  if (parsed.data.sourceName || parsed.data.sourceUrl) sources.push({ name: parsed.data.sourceName?.trim() || null, url: parsed.data.sourceUrl?.trim() || null });
  if (parsed.data.status === "PUBLISHED") {
    const blockers = [
      plainLength < 2400 ? "Conteúdo publicado precisa ter ao menos 2400 caracteres úteis (meta interna ×3)." : null,
      !parsed.data.reviewerId ? "Selecione um revisor." : null,
      !parsed.data.pillarId || !parsed.data.clusterId ? "Associe pilar e cluster." : null,
      !parsed.data.primaryKeyword?.trim() ? "Informe a palavra-chave principal." : null,
      !factCheckedAt ? "Registre a revisão factual." : null,
      parsed.data.editorialStage !== "APPROVED" ? "Conclua o fluxo editorial até APROVADO." : null,
      sources.length === 0 ? "Registre ao menos uma fonte editorial." : null,
      parsed.data.sponsoredContent === "on" && !parsed.data.sponsorshipDisclosure?.trim()
        ? "Conteúdo patrocinado exige identificação clara."
        : null,
      parsed.data.editorialTemplate === "POST_MAGNETICO" && !parsed.data.directAnswer?.trim()
        ? "Post Magnético exige resposta principal no início."
        : null,
      parsed.data.editorialTemplate === "POST_MAGNETICO" && !parsed.data.localHook?.trim()
        ? "Post Magnético exige gancho local verificável."
        : null,
      parsed.data.editorialTemplate === "POST_MAGNETICO" && !parsed.data.candidateCta?.trim()
        ? "Post Magnético exige CTA gratuito para candidato."
        : null
    ].filter((item): item is string => Boolean(item));
    if (blockers.length) return { ok: false as const, error: "Conteúdo ainda não está pronto para publicação.", details: blockers };
  }
  const slug = slugify(parsed.data.slug || parsed.data.title);
  if (!slug) return { ok: false as const, error: "Não foi possível gerar o slug do conteúdo.", details: [] };

  return {
    ok: true as const,
    data: {
      type: parsed.data.type,
      authorId: parsed.data.authorId,
      reviewerId: nullable(parsed.data.reviewerId),
      pillarId: nullable(parsed.data.pillarId),
      clusterId: nullable(parsed.data.clusterId),
      title: parsed.data.title,
      subtitle: nullable(parsed.data.subtitle),
      slug,
      excerpt: parsed.data.excerpt,
      contentHtml: parsed.data.contentHtml,
      coverImageUrl: nullable(parsed.data.coverImageUrl),
      coverImageAlt: nullable(parsed.data.coverImageAlt),
      coverImageCaption: nullable(parsed.data.coverImageCaption),
      coverImageCredit: nullable(parsed.data.coverImageCredit),
      section: nullable(parsed.data.section),
      tags: (parsed.data.tags ?? "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      sourceName: nullable(parsed.data.sourceName),
      sourceUrl: nullable(parsed.data.sourceUrl),
      seoTitle: nullable(parsed.data.seoTitle),
      metaDescription: nullable(parsed.data.metaDescription),
      canonicalUrl: nullable(parsed.data.canonicalUrl),
      internalNotes: nullable(parsed.data.internalNotes),
      primaryKeyword: nullable(parsed.data.primaryKeyword),
      searchIntent: parsed.data.searchIntent ?? null,
      sources,
      aiAssisted: parsed.data.aiAssisted === "on",
      factCheckedAt,
      factReviewNotes: nullable(parsed.data.factReviewNotes),
      sponsoredContent: parsed.data.sponsoredContent === "on",
      sponsorshipDisclosure: nullable(parsed.data.sponsorshipDisclosure),
      relatedArticleIds: (parsed.data.relatedArticleIds ?? "").split(",").map((item) => item.trim()).filter(Boolean),
      relatedJobIds: (parsed.data.relatedJobIds ?? "").split(",").map((item) => item.trim()).filter(Boolean),
      editorialStage: parsed.data.editorialStage,
      editorialTemplate: parsed.data.editorialTemplate,
      directAnswer: nullable(parsed.data.directAnswer),
      localHook: nullable(parsed.data.localHook),
      audience: nullable(parsed.data.audience),
      candidateCta: nullable(parsed.data.candidateCta),
      companyCta: nullable(parsed.data.companyCta),
      discoverEligible: parsed.data.discoverEligible === "on",
      newsEligible: parsed.data.newsEligible === "on",
      webStoryEligible: parsed.data.webStoryEligible === "on",
      reviewedAt: parsed.data.editorialStage === "APPROVED" ? now : null,
      status: parsed.data.status,
      scheduledAt: parsed.data.status === "SCHEDULED" ? scheduledAt : null,
      expiresAt,
      featured: parsed.data.featured === "on"
    }
  };
}
