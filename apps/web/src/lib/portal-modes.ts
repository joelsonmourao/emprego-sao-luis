import { auditLogs, createDatabase, settings } from "@es/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

export {
  ADSENSE_REVIEW_MODE_KEY,
  getAdsenseReviewMode,
  setAdsenseReviewMode,
  getAdsenseReviewDirective,
  sitemapCategoryAllowedInReview,
  staticPathAllowedInReview
} from "./adsense-review-mode";

export const EDITORIAL_PORTAL_MODE_KEY = "editorial_portal_mode";

const storedSchema = z.object({
  enabled: z.boolean().default(false),
  updatedAt: z.string().datetime().nullable().default(null),
  updatedBy: z.string().uuid().nullable().default(null)
});

export type PortalModeState = z.infer<typeof storedSchema> & { persisted: boolean };

const fallback = (enabled = false): PortalModeState => ({
  enabled,
  updatedAt: null,
  updatedBy: null,
  persisted: false
});

let portalCache: { at: number; value: PortalModeState } | null = null;
const CACHE_MS = 5_000;

async function readPortalMode(): Promise<PortalModeState> {
  if (!process.env.DATABASE_URL) return fallback(false);
  if (portalCache && Date.now() - portalCache.at < CACHE_MS) return portalCache.value;
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [row] = await connection.db
      .select()
      .from(settings)
      .where(eq(settings.key, EDITORIAL_PORTAL_MODE_KEY))
      .limit(1);
    const parsed = storedSchema.safeParse(row?.value);
    const value: PortalModeState = parsed.success
      ? { ...parsed.data, persisted: true }
      : fallback(false);
    portalCache = { at: Date.now(), value };
    return value;
  } catch {
    return fallback(false);
  } finally {
    await connection.close();
  }
}

export function getEditorialPortalMode() {
  return readPortalMode();
}

export async function setEditorialPortalMode(enabled: boolean, actorId: string) {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não configurada.");
  const connection = createDatabase(process.env.DATABASE_URL);
  const now = new Date();
  try {
    const result = await connection.db.transaction(async (tx) => {
      const [beforeRow] = await tx
        .select()
        .from(settings)
        .where(eq(settings.key, EDITORIAL_PORTAL_MODE_KEY))
        .limit(1);
      const beforeParsed = storedSchema.safeParse(beforeRow?.value);
      const before = beforeParsed.success ? beforeParsed.data : fallback(false);
      const value = { enabled, updatedAt: now.toISOString(), updatedBy: actorId };
      await tx
        .insert(settings)
        .values({ key: EDITORIAL_PORTAL_MODE_KEY, value, public: false })
        .onConflictDoUpdate({
          target: settings.key,
          set: { value, public: false, updatedAt: now }
        });
      await tx.insert(auditLogs).values({
        actorId,
        action: "UPDATE_EDITORIAL_PORTAL_MODE",
        entityType: "SETTING",
        entityId: EDITORIAL_PORTAL_MODE_KEY,
        before: { enabled: before.enabled },
        after: { enabled },
        origin: "ADMIN"
      });
      return { before: before.enabled, after: enabled, value };
    });
    portalCache = { at: Date.now(), value: { ...result.value, persisted: true } };
    return result;
  } finally {
    await connection.close();
  }
}

/** Área pública de vagas/empresas/cidades/categorias pausada. */
export function isJobBoardPubliclyActive(portalModeEnabled: boolean) {
  return !portalModeEnabled;
}

const JOB_BOARD_PATH_PREFIXES = [
  "/vagas",
  "/vagas-slz",
  "/slz",
  "/slz-vagas",
  "/slz-empregos",
  "/empregos-slz",
  "/empresas",
  "/categorias",
  "/cidades",
  "/busca",
  "/alertas",
  "/publicar-vaga",
  "/anunciar-vaga",
  "/area-empresas"
] as const;

export function isJobBoardPublicPath(pathname: string) {
  const path = pathname.replace(/\/$/, "") || "/";
  return JOB_BOARD_PATH_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

export function sitemapCategoryAllowedWhenPortalEditorial(category: string) {
  return ["static", "blog", "news", "web-stories"].includes(category);
}

export function staticPathAllowedWhenPortalEditorial(path: string) {
  const normalized = path.replace(/\/$/, "") || "/";
  if (isJobBoardPublicPath(normalized)) return false;
  return true;
}

/** Temas editoriais com filtro no /blog (rotas reais; sem páginas vazias inventadas). */
export const EDITORIAL_BLOG_THEMES = {
  mercado: { label: "Mercado de Trabalho", query: "mercado" },
  curriculo: { label: "Currículo", query: "curriculo" },
  entrevista: { label: "Entrevistas", query: "entrevista" },
  "primeiro-emprego": { label: "Primeiro Emprego", query: "primeiro emprego" }
} as const;

export type EditorialBlogTheme = keyof typeof EDITORIAL_BLOG_THEMES;

export function resolveEditorialBlogTheme(raw: string | null | undefined): EditorialBlogTheme | null {
  if (!raw) return null;
  const key = raw.trim().toLowerCase();
  return key in EDITORIAL_BLOG_THEMES ? (key as EditorialBlogTheme) : null;
}

export function editorialBlogThemeHref(theme: EditorialBlogTheme) {
  return `/blog?tema=${theme}`;
}

export function getPublicNav(portalEditorial: boolean): Array<[string, string]> {
  if (portalEditorial) {
    return [
      ["Início", "/"],
      ["Blog", "/blog"],
      ["Notícias", "/noticias"],
      ["Mercado de Trabalho", editorialBlogThemeHref("mercado")],
      ["Currículo", editorialBlogThemeHref("curriculo")],
      ["Entrevistas", editorialBlogThemeHref("entrevista")],
      ["Primeiro Emprego", editorialBlogThemeHref("primeiro-emprego")],
      ["Segurança", "/seguranca-candidatos"],
      ["Sobre", "/sobre"],
      ["Redação", "/redacao"]
    ];
  }
  return [
    ["Vagas", "/vagas"],
    ["Cidades", "/cidades"],
    ["Empresas", "/empresas"],
    ["Categorias", "/categorias"],
    ["Notícias", "/noticias"],
    ["Blog", "/blog"],
    ["Alertas", "/alertas"],
    ["Instagram", "/instagram"]
  ];
}

export function clearPortalModeCaches() {
  portalCache = null;
}
