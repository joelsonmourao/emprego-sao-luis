import { categories, cities, companies, createDatabase, jobs, neighborhoods, states, webStories } from "@es/db";
import { and, count, eq, gt, isNull, or } from "drizzle-orm";
import {
  normalizeApplicationEmail,
  normalizeApplicationUrl,
  normalizeApplicationWhatsapp
} from "@es/shared";
import { getAdsenseReviewDirective, getAdsenseReviewMode, sitemapCategoryAllowedInReview, staticPathAllowedInReview } from "./adsense-review-mode";
import { getRuntimeSiteUrl, resolveCanonicalUrl } from "./canonical-url";
import { getEditorialAuditReport } from "./editorial-audit";
import { classifyCategoryPage, classifyCityPage, classifyCompanyPage, type EntityPageQuality } from "./entity-page-quality";

function jobHasIndexableApplicationChannel(row: {
  applicationUrl: string | null;
  applicationEmail: string | null;
  applicationWhatsapp: string | null;
  applicationWhatsappValid: boolean;
  applicationEmailValid: boolean;
}) {
  return (
    normalizeApplicationUrl(row.applicationUrl).valid ||
    row.applicationWhatsappValid ||
    normalizeApplicationWhatsapp(row.applicationWhatsapp).valid ||
    row.applicationEmailValid ||
    normalizeApplicationEmail(row.applicationEmail).valid
  );
}

export type IndexInventoryType = "INSTITUCIONAL" | "EDITORIAL" | "NOTÍCIA" | "VAGA" | "EMPRESA" | "CIDADE" | "CATEGORIA" | "BUSCA" | "WEB_STORY" | "COMERCIAL" | "CONTA" | "OUTRO";

export type IndexInventoryRow = {
  url: string;
  path: string;
  type: IndexInventoryType;
  statusHttp: 200 | 301 | 302 | 404 | 410;
  indexable: boolean;
  robots: "index,follow" | "noindex,follow" | "noindex,nofollow";
  canonical: string;
  sitemap: boolean;
  quality: string;
  lastAnalyzed: string;
  status: "OK" | "NOINDEX" | "REVISAR" | "REDIRECIONAMENTO";
  reason: string;
  problem: string | null;
  action: string | null;
};

type StaticRoute = {
  path: string;
  type: IndexInventoryType;
  sitemap: boolean;
  quality?: string;
  noindex?: boolean;
  nofollow?: boolean;
  statusHttp?: 200 | 301 | 302 | 404 | 410;
  canonicalPath?: string;
  action?: string | null;
};

const STATIC: StaticRoute[] = [
  { path: "/", type: "INSTITUCIONAL", sitemap: true, quality: "EDITORIAL" },
  { path: "/blog", type: "EDITORIAL", sitemap: true, quality: "EDITORIAL" },
  { path: "/noticias", type: "NOTÍCIA", sitemap: true, quality: "EDITORIAL" },
  ...["sobre", "quem-somos", "contato", "privacidade", "termos", "cookies", "lgpd", "politica-editorial", "politica-fontes", "politica-correcoes", "redacao", "seguranca-candidatos", "area-empresas", "trabalhe-conosco"].map((slug): StaticRoute => ({ path: `/${slug}`, type: "INSTITUCIONAL", sitemap: true, quality: "INSTITUCIONAL", action: "/admin/paginas" })),
  { path: "/anunciar-vaga", type: "COMERCIAL", sitemap: false, quality: "REDIRECT", statusHttp: 301, canonicalPath: "/publicar-vaga" },
  { path: "/publicar-vaga", type: "COMERCIAL", sitemap: true, quality: "B2B" },
  { path: "/vagas", type: "VAGA", sitemap: true, quality: "LISTAGEM" },
  { path: "/empresas", type: "EMPRESA", sitemap: true, quality: "LISTAGEM" },
  { path: "/categorias", type: "CATEGORIA", sitemap: true, quality: "LISTAGEM" },
  { path: "/cidades", type: "CIDADE", sitemap: true, quality: "LISTAGEM" },
  { path: "/busca", type: "BUSCA", sitemap: false, quality: "FILTRO", noindex: true },
  { path: "/alertas", type: "OUTRO", sitemap: false, quality: "FUNCIONAL" },
  { path: "/instagram", type: "OUTRO", sitemap: false, quality: "FUNCIONAL" },
  { path: "/web-stories", type: "WEB_STORY", sitemap: false, quality: "LISTAGEM" },
  { path: "/vagas-slz", type: "VAGA", sitemap: false, quality: "ALIAS" },
  { path: "/slz", type: "VAGA", sitemap: false, quality: "ALIAS" },
  { path: "/slz-vagas", type: "VAGA", sitemap: false, quality: "ALIAS" },
  { path: "/slz-empregos", type: "VAGA", sitemap: false, quality: "ALIAS" },
  { path: "/empregos-slz", type: "VAGA", sitemap: false, quality: "ALIAS" },
  { path: "/entrar", type: "CONTA", sitemap: false, quality: "PRIVADA", noindex: true, nofollow: true },
  { path: "/minha-conta", type: "CONTA", sitemap: false, quality: "PRIVADA", noindex: true, nofollow: true },
  { path: "/empresa/login", type: "CONTA", sitemap: false, quality: "PRIVADA", noindex: true, nofollow: true },
  { path: "/empresa", type: "CONTA", sitemap: false, quality: "REDIRECT", noindex: true, nofollow: true, statusHttp: 302, canonicalPath: "/empresa/dashboard" },
  ...["dashboard", "pedidos", "pagamentos", "creditos", "vagas", "perfil", "suporte"].map((slug): StaticRoute => ({ path: `/empresa/${slug}`, type: "CONTA", sitemap: false, quality: "PRIVADA", noindex: true, nofollow: true })),
  { path: "/publicar-vaga/cadastro", type: "COMERCIAL", sitemap: false, quality: "TRANSACIONAL", noindex: true },
  { path: "/acesso", type: "CONTA", sitemap: false, quality: "REDIRECT", noindex: true, nofollow: true, statusHttp: 302, canonicalPath: "/entrar" },
  { path: "/confirmar-alerta", type: "OUTRO", sitemap: false, quality: "REDIRECT", noindex: true, statusHttp: 302, canonicalPath: "/alertas" },
  { path: "/descadastrar", type: "OUTRO", sitemap: false, quality: "REDIRECT", noindex: true, statusHttp: 302, canonicalPath: "/alertas" },
  { path: "/recuperar-admin", type: "CONTA", sitemap: false, quality: "REDIRECT", noindex: true, nofollow: true, statusHttp: 301, canonicalPath: "/admin/esqueci-senha" },
  { path: "/redefinir-admin", type: "CONTA", sitemap: false, quality: "REDIRECT", noindex: true, nofollow: true, statusHttp: 301, canonicalPath: "/admin/redefinir-senha" },
  { path: "/404", type: "OUTRO", sitemap: false, quality: "ERRO", noindex: true, statusHttp: 404 }
];

const categoryForType = (type: IndexInventoryType) => type === "NOTÍCIA" ? "news" : type === "EDITORIAL" ? "blog" : type === "EMPRESA" ? "companies" : type === "CIDADE" ? "cities" : type === "CATEGORIA" ? "categories" : type === "WEB_STORY" ? "web-stories" : type === "VAGA" ? "jobs" : "";

export async function getAdsenseIndexInventory(editorialReport?: Awaited<ReturnType<typeof getEditorialAuditReport>>) {
  const site = getRuntimeSiteUrl();
  const mode = await getAdsenseReviewMode();
  const analyzedAt = new Date().toISOString();
  const make = (path: string, type: IndexInventoryType, normalSitemap: boolean, options: {
    action?: string | null | undefined;
    forceNoindex?: boolean | undefined;
    nofollow?: boolean | undefined;
    quality?: string | undefined;
    qualityOverride?: boolean | undefined;
    reason?: string | undefined;
    problem?: string | null | undefined;
    statusHttp?: 200 | 301 | 302 | 404 | 410 | undefined;
    canonicalPath?: string | undefined;
  } = {}): IndexInventoryRow => {
    const canonical = resolveCanonicalUrl(options.canonicalPath, options.canonicalPath ?? path, site);
    const directive = getAdsenseReviewDirective(new URL(path, site), mode.enabled, options.qualityOverride);
    const statusHttp = options.statusHttp ?? 200;
    const redirected = statusHttp === 301 || statusHttp === 302;
    const indexable = statusHttp === 200 && !directive.noindex && !options.forceNoindex;
    const category = categoryForType(type);
    const reviewSitemapAllowed = type === "INSTITUCIONAL"
      ? staticPathAllowedInReview(path)
      : sitemapCategoryAllowedInReview(category);
    const sitemap = indexable && normalSitemap && (!mode.enabled || reviewSitemapAllowed);
    const reason = options.reason ?? directive.reason ?? (indexable ? "Indexável pela política atual." : "Política interna recomenda noindex.");
    const problem = options.problem ?? (redirected ? "URL de origem é redirecionada e não deve constar no sitemap." : !indexable && !options.forceNoindex && !directive.noindex && statusHttp === 200 ? "Revisar regra de indexação." : null);
    return {
      url: new URL(path, site).toString(), path, type, statusHttp, indexable,
      robots: options.nofollow ? "noindex,nofollow" : indexable ? "index,follow" : "noindex,follow",
      canonical, sitemap, quality: options.quality ?? "NÃO_CLASSIFICADA", lastAnalyzed: analyzedAt,
      status: redirected
        ? "REDIRECIONAMENTO"
        : indexable
          ? "OK"
          : options.forceNoindex && !["PRIVADA", "FILTRO", "ERRO", "TRANSACIONAL"].includes(options.quality ?? "")
            ? "REVISAR"
            : "NOINDEX",
      reason, problem, action: options.action ?? null
    };
  };

  const rows = STATIC.map((item) => make(item.path, item.type, item.sitemap, {
    action: item.action, forceNoindex: item.noindex, nofollow: item.nofollow, quality: item.quality,
    statusHttp: item.statusHttp, canonicalPath: item.canonicalPath
  }));
  const editorial = editorialReport ?? await getEditorialAuditReport();
  for (const assessment of editorial.assessments.filter((item) => item.article.status === "PUBLISHED")) {
    const news = assessment.article.type === "NEWS";
    const path = `/${news ? "noticias" : "blog"}/${assessment.article.slug}`;
    const auditNoindex = mode.enabled && ["NOINDEX", "REVISAR MANUALMENTE"].includes(assessment.classification);
    const expectedCanonical = resolveCanonicalUrl(undefined, path, site);
    const storedCanonical = assessment.article.canonicalUrl?.trim();
    const canonicalMismatch = Boolean(storedCanonical) && (() => {
      try {
        const parsed = new URL(storedCanonical!, site);
        parsed.search = "";
        parsed.hash = "";
        if (parsed.pathname.length > 1) parsed.pathname = parsed.pathname.replace(/\/+$/, "");
        return parsed.origin !== site.origin || parsed.toString() !== expectedCanonical;
      } catch {
        return true;
      }
    })();
    rows.push(make(path, news ? "NOTÍCIA" : "EDITORIAL", true, {
      action: `/admin/conteudo/${assessment.article.id}/editar`, forceNoindex: auditNoindex,
      quality: `${assessment.classification} · ${assessment.score}/100`,
      reason: auditNoindex ? "Conteúdo classificado como NOINDEX ou REVISAR MANUALMENTE durante a revisão." : undefined,
      problem: canonicalMismatch
        ? "Canonical cadastrado não corresponde à URL pública; o layout ignora o valor inválido e usa o path da página."
        : assessment.issues[0] ?? null
    }));
  }

  if (!process.env.DATABASE_URL) return summarize(rows, mode.enabled, false);
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const now = new Date();
    const [jobRows, companyRows, cityRows, categoryRows, storyRows, stateRows, neighborhoodRows] = await Promise.all([
      connection.db
        .select({
          id: jobs.id,
          slug: jobs.slug,
          applicationUrl: jobs.applicationUrl,
          applicationEmail: jobs.applicationEmail,
          applicationWhatsapp: jobs.applicationWhatsapp,
          applicationWhatsappValid: jobs.applicationWhatsappValid,
          applicationEmailValid: jobs.applicationEmailValid,
          applicationUrlStatus: jobs.applicationUrlStatus
        })
        .from(jobs)
        .where(and(eq(jobs.publicationStatus, "PUBLISHED"), gt(jobs.expiresAt, now))),
      connection.db.select({ id: companies.id, slug: companies.slug, descriptionHtml: companies.descriptionHtml, seoTitle: companies.seoTitle, metaDescription: companies.metaDescription, activeJobs: count(jobs.id) }).from(companies).innerJoin(jobs, eq(jobs.companyId, companies.id)).where(and(eq(companies.active, true), eq(jobs.publicationStatus, "PUBLISHED"), gt(jobs.expiresAt, now))).groupBy(companies.id),
      connection.db
        .select({ id: cities.id, slug: cities.slug, seoTitle: cities.seoTitle, metaDescription: cities.metaDescription, activeJobs: count(jobs.id) })
        .from(cities)
        .innerJoin(states, eq(cities.stateId, states.id))
        .innerJoin(jobs, eq(jobs.cityId, cities.id))
        .where(and(eq(cities.active, true), eq(states.code, "MA"), eq(jobs.publicationStatus, "PUBLISHED"), gt(jobs.expiresAt, now)))
        .groupBy(cities.id),
      connection.db.select({ id: categories.id, slug: categories.slug, description: categories.description, seoTitle: categories.seoTitle, metaDescription: categories.metaDescription, activeJobs: count(jobs.id) }).from(categories).innerJoin(jobs, eq(jobs.categoryId, categories.id)).where(and(eq(categories.active, true), eq(jobs.publicationStatus, "PUBLISHED"), gt(jobs.expiresAt, now))).groupBy(categories.id),
      connection.db.select({ id: webStories.id, slug: webStories.slug }).from(webStories).where(and(eq(webStories.status, "PUBLISHED"), or(isNull(webStories.expiresAt), gt(webStories.expiresAt, now)))),
      connection.db.select({ id: states.id, code: states.code }).from(states).innerJoin(jobs, eq(jobs.stateId, states.id)).where(and(eq(jobs.publicationStatus, "PUBLISHED"), gt(jobs.expiresAt, now))).groupBy(states.id),
      connection.db.select({ id: neighborhoods.id, slug: neighborhoods.slug }).from(neighborhoods).innerJoin(jobs, eq(jobs.neighborhoodId, neighborhoods.id)).where(and(eq(neighborhoods.active, true), eq(jobs.publicationStatus, "PUBLISHED"), gt(jobs.expiresAt, now))).groupBy(neighborhoods.id)
    ]);
    rows.push(
      ...jobRows.map((item) => {
        const accepting =
          !["CLOSED", "INVALID"].includes(item.applicationUrlStatus) && jobHasIndexableApplicationChannel(item);
        return make(`/vagas/${item.slug}`, "VAGA", accepting, {
          action: `/admin/vagas/${item.id}/editar`,
          quality: accepting ? "VAGA_ATIVA" : "VAGA_SEM_CANAL",
          forceNoindex: !accepting,
          reason: accepting ? undefined : "Vaga publicada sem canal de candidatura válido ou com status CLOSED/INVALID."
        });
      })
    );
    const addEntity = (path: string, type: "EMPRESA" | "CIDADE" | "CATEGORIA", quality: EntityPageQuality, action: string) =>
      make(path, type, true, { action, quality, forceNoindex: quality !== "FORTE", qualityOverride: quality === "FORTE", reason: quality === "FORTE" ? "Entidade possui volume, conteúdo próprio e metadados suficientes." : "Listagem sem camada editorial suficiente." });
    rows.push(...companyRows.map((item) => addEntity(`/empresas/${item.slug}`, "EMPRESA", classifyCompanyPage(item), `/admin/empresas#${item.id}`)));
    rows.push(...cityRows.map((item) => addEntity(`/vagas/cidade/${item.slug}`, "CIDADE", classifyCityPage(item), "/admin/localidades")));
    rows.push(...categoryRows.map((item) => addEntity(`/categorias/${item.slug}`, "CATEGORIA", classifyCategoryPage(item), "/admin/categorias")));
    rows.push(...categoryRows.map((item) => make(`/vagas/categoria/${item.slug}`, "CATEGORIA", false, { statusHttp: 301, canonicalPath: `/categorias/${item.slug}`, quality: "REDIRECT" })));
    rows.push(...stateRows.map((item) => make(`/vagas/estado/${item.code.toLowerCase()}`, "CIDADE", false, { forceNoindex: true, quality: "LISTAGEM", reason: "Página estadual é listagem auxiliar e permanece noindex." })));
    rows.push(...neighborhoodRows.map((item) => make(`/vagas/bairro/${item.slug}`, "CIDADE", false, { forceNoindex: true, quality: "LISTAGEM", reason: "Página de bairro é listagem auxiliar e permanece noindex." })));
    rows.push(...storyRows.map((item) => make(`/web-stories/${item.slug}`, "WEB_STORY", true, { action: `/admin/web-stories/${item.id}`, quality: "PUBLICADA" })));
    return summarize(rows, mode.enabled, true);
  } finally {
    await connection.close();
  }
}

function summarize(rows: IndexInventoryRow[], reviewMode: boolean, dataAvailable: boolean) {
  return {
    rows,
    reviewMode,
    dataAvailable,
    summary: {
      total: rows.length,
      indexable: rows.filter((row) => row.indexable).length,
      noindex: rows.filter((row) => !row.indexable).length,
      sitemap: rows.filter((row) => row.sitemap).length,
      outsideSitemap: rows.filter((row) => !row.sitemap).length,
      canonicalProblems: rows.filter((row) => row.problem?.toLowerCase().includes("canonical")).length,
      review: rows.filter((row) => row.status === "REVISAR").length
    }
  };
}
