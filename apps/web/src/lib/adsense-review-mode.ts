import { auditLogs, createDatabase, settings } from "@es/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const ADSENSE_REVIEW_MODE_KEY = "adsense_review_mode";

const storedSchema = z.object({
  enabled: z.boolean().default(false),
  updatedAt: z.string().datetime().nullable().default(null),
  updatedBy: z.string().uuid().nullable().default(null)
});

export type AdsenseReviewMode = z.infer<typeof storedSchema> & { persisted: boolean };

const fallback: AdsenseReviewMode = { enabled: false, updatedAt: null, updatedBy: null, persisted: false };
let cache: { at: number; value: AdsenseReviewMode } | null = null;
const CACHE_MS = 5_000;

export async function getAdsenseReviewMode(): Promise<AdsenseReviewMode> {
  if (!process.env.DATABASE_URL) return fallback;
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.value;
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [row] = await connection.db.select().from(settings).where(eq(settings.key, ADSENSE_REVIEW_MODE_KEY)).limit(1);
    const parsed = storedSchema.safeParse(row?.value);
    const value: AdsenseReviewMode = parsed.success ? { ...parsed.data, persisted: true } : fallback;
    cache = { at: Date.now(), value };
    return value;
  } catch {
    return fallback;
  } finally {
    await connection.close();
  }
}

export async function setAdsenseReviewMode(enabled: boolean, actorId: string) {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não configurada.");
  const connection = createDatabase(process.env.DATABASE_URL);
  const now = new Date();
  try {
    const result = await connection.db.transaction(async (tx) => {
      const [beforeRow] = await tx.select().from(settings).where(eq(settings.key, ADSENSE_REVIEW_MODE_KEY)).limit(1);
      const beforeParsed = storedSchema.safeParse(beforeRow?.value);
      const before = beforeParsed.success ? beforeParsed.data : fallback;
      const value = { enabled, updatedAt: now.toISOString(), updatedBy: actorId };
      await tx.insert(settings).values({ key: ADSENSE_REVIEW_MODE_KEY, value, public: false }).onConflictDoUpdate({
        target: settings.key,
        set: { value, public: false, updatedAt: now }
      });
      await tx.insert(auditLogs).values({
        actorId,
        action: "UPDATE_ADSENSE_REVIEW_MODE",
        entityType: "SETTING",
        entityId: ADSENSE_REVIEW_MODE_KEY,
        before: { enabled: before.enabled },
        after: { enabled },
        origin: "ADMIN"
      });
      return { before: before.enabled, after: enabled, value };
    });
    cache = { at: Date.now(), value: { ...result.value, persisted: true } };
    return result;
  } finally {
    await connection.close();
  }
}

const REVIEW_INDEXABLE_EXACT = new Set([
  "/",
  "/blog",
  "/noticias",
  "/sobre",
  "/quem-somos",
  "/contato",
  "/privacidade",
  "/termos",
  "/cookies",
  "/lgpd",
  "/politica-editorial",
  "/politica-fontes",
  "/politica-correcoes",
  "/redacao",
  "/seguranca-candidatos",
  "/area-empresas",
  "/trabalhe-conosco"
]);

const REVIEW_NOINDEX_PREFIXES = [
  "/vagas",
  "/vagas-slz",
  "/slz",
  "/slz-vagas",
  "/slz-empregos",
  "/empregos-slz",
  "/empresas",
  "/categorias",
  "/cidades",
  "/busca"
] as const;

const REVIEW_QUALITY_OVERRIDE_PREFIXES = [
  "/empresas/",
  "/categorias/",
  "/vagas/cidade/"
] as const;

export function getAdsenseReviewDirective(url: URL, enabled: boolean, qualityOverride = false) {
  if (!enabled) return { noindex: false, reason: null };
  const path = url.pathname.replace(/\/$/, "") || "/";
  const hasNonTrackingParameters = [...url.searchParams.keys()].some(
    (key) => !key.startsWith("utm_") && !["gclid", "fbclid"].includes(key)
  );
  if (REVIEW_INDEXABLE_EXACT.has(path) || path.startsWith("/blog/") || path.startsWith("/noticias/")) {
    return hasNonTrackingParameters
      ? { noindex: true, reason: "Variação parametrizada ou paginação temporariamente fora do índice." }
      : { noindex: false, reason: null };
  }
  if (
    qualityOverride &&
    REVIEW_QUALITY_OVERRIDE_PREFIXES.some((prefix) => path.startsWith(prefix)) &&
    !hasNonTrackingParameters
  ) {
    return { noindex: false, reason: "Exceção interna: página de entidade possui conteúdo próprio, metadados e volume útil." };
  }
  if (url.search) return { noindex: true, reason: "Combinação de parâmetros temporariamente fora do índice." };
  if (REVIEW_NOINDEX_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`)))
    return { noindex: true, reason: "Página de vaga, listagem ou entidade temporariamente fora do índice." };
  return { noindex: true, reason: "Rota não incluída na superfície editorial prioritária do Modo de Revisão." };
}

export function sitemapCategoryAllowedInReview(category: string) {
  return ["static", "blog", "news", "companies", "cities", "categories"].includes(category);
}

export function staticPathAllowedInReview(path: string) {
  return REVIEW_INDEXABLE_EXACT.has(path);
}
