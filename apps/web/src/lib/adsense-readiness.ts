import { CANDIDATURE_BLOCKED_SLOT_KEYS } from "@es/ads";
import { articles, categories, cities, companies, createDatabase, jobs, states, webStories } from "@es/db";
import { evaluateJobPublication, isStagingLikeEnvironment } from "@es/shared";
import { eq } from "drizzle-orm";
import { getEditorialAuditReport } from "./editorial-audit";
import { getAdsenseReviewMode, getEditorialPortalMode } from "./portal-modes";
import { getInstitutionalPages } from "./site-pages";

export type ReadinessKind = "OFFICIAL" | "INTERNAL" | "RECOMMENDATION";
export type ReadinessStatus = "BLOQUEADOR" | "PENDENTE" | "EM_REVISÃO" | "APROVADO_INTERNAMENTE" | "NÃO_APLICÁVEL";
export type ReadinessStage = "ETAPA_0" | "ETAPA_1" | "ETAPA_2" | "ETAPA_3" | "ETAPA_4" | "ETAPA_5";
export type ReadinessCheck = {
  id: string;
  stage: ReadinessStage;
  label: string;
  kind: ReadinessKind;
  status: ReadinessStatus;
  severity: "P0" | "P1" | "P2";
  evidence: string;
  action?: string | undefined;
  autoFixAvailable: boolean;
};

const placeholderPattern = /\[configur[aá]vel no painel administrativo\]|data-admin-field=/i;
const plainLength = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().length;

type CacheEntry = { at: number; value: Awaited<ReturnType<typeof buildAdsenseReadiness>> };
const readinessCache = new Map<string, CacheEntry>();
const READINESS_CACHE_MS = 15_000;

async function fetchText(url: URL) {
  try {
    const response = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(4_000) });
    return { status: response.status, contentType: response.headers.get("content-type") ?? "", body: await response.text() };
  } catch (error) {
    return { status: 0, contentType: "", body: error instanceof Error ? error.message : "Falha de rede" };
  }
}

function pass(partial: Omit<ReadinessCheck, "status" | "autoFixAvailable"> & { status?: ReadinessStatus; autoFixAvailable?: boolean }): ReadinessCheck {
  return { autoFixAvailable: false, status: "APROVADO_INTERNAMENTE", ...partial };
}

export async function getAdsenseReadiness(baseUrl: URL) {
  const cacheKey = baseUrl.origin;
  const cached = readinessCache.get(cacheKey);
  if (cached && Date.now() - cached.at < READINESS_CACHE_MS) return cached.value;
  const value = await buildAdsenseReadiness(baseUrl);
  readinessCache.set(cacheKey, { at: Date.now(), value });
  return value;
}

async function buildAdsenseReadiness(baseUrl: URL) {
  const checks: ReadinessCheck[] = [];
  const stagingLike = isStagingLikeEnvironment();
  const [institutional, portalModeEarly, reviewModeEarly] = await Promise.all([
    getInstitutionalPages(),
    getEditorialPortalMode(),
    getAdsenseReviewMode()
  ]);
  const portalEnabled = portalModeEarly.enabled;
  const institutionalRequired = [
    "quem-somos",
    "contato",
    "privacidade",
    "cookies",
    "termos",
    "politica-editorial",
    "politica-fontes",
    "politica-correcoes",
    "lgpd"
  ] as const;
  const pendingInstitutional = institutionalRequired.filter(
    (slug) => !institutional[slug]?.published || placeholderPattern.test(institutional[slug]?.contentHtml ?? "")
  );
  checks.push(
    pass({
      id: "institutional",
      stage: "ETAPA_0",
      label: "Páginas institucionais sem placeholders",
      kind: "OFFICIAL",
      severity: "P0",
      status: pendingInstitutional.length ? "BLOQUEADOR" : "APROVADO_INTERNAMENTE",
      evidence: pendingInstitutional.length
        ? `Pendentes ou com placeholders: ${pendingInstitutional.join(", ")}.`
        : "Páginas essenciais publicadas sem placeholders.",
      action: pendingInstitutional.length ? "/admin/paginas" : undefined
    })
  );

  let articleRows: typeof articles.$inferSelect[] = [];
  let storyRows: typeof webStories.$inferSelect[] = [];
  let jobRows: Array<{
    job: typeof jobs.$inferSelect;
    authorCompany: string;
    city: string;
    state: string;
    category: string | null;
  }> = [];
  if (process.env.DATABASE_URL) {
    const connection = createDatabase(process.env.DATABASE_URL);
    try {
      articleRows = await connection.db.select().from(articles).limit(400);
      storyRows = await connection.db.select().from(webStories).limit(100);
      jobRows = await connection.db
        .select({
          job: jobs,
          authorCompany: companies.name,
          city: cities.name,
          state: states.code,
          category: categories.name
        })
        .from(jobs)
        .innerJoin(companies, eq(jobs.companyId, companies.id))
        .innerJoin(cities, eq(jobs.cityId, cities.id))
        .innerJoin(states, eq(jobs.stateId, states.id))
        .leftJoin(categories, eq(jobs.categoryId, categories.id))
        .where(eq(jobs.publicationStatus, "PUBLISHED"))
        .limit(400);
    } finally {
      await connection.close();
    }
  }

  const corrupted = jobRows.filter((row) => !row.job.slug || row.job.slug.length < 2 || row.job.slug === "s");
  checks.push(
    pass({
      id: "corrupt-jobs",
      stage: "ETAPA_0",
      label: "Vagas corrompidas (/vagas/s e equivalentes)",
      kind: "OFFICIAL",
      severity: "P0",
      status: corrupted.length ? "BLOQUEADOR" : "APROVADO_INTERNAMENTE",
      evidence: corrupted.length
        ? corrupted.slice(0, 5).map((row) => row.job.publicCode || row.job.slug).join(", ")
        : "Nenhuma vaga publicada com slug inválido.",
      action: corrupted.length ? "/admin/vagas" : undefined
    })
  );

  /** Meta interna ×3 (não é número oficial do Google). Usada para “Pronto para solicitar análise”. */
  const MIN_PUBLISHED_ARTICLES = 45;
  const MIN_USEFUL_CHARS = 2400;
  const isTemplateSeed = (slug: string) => slug.startsWith("adsense-editorial");
  const allPublished = articleRows.filter((article) => article.status === "PUBLISHED");
  const templatePublished = allPublished.filter((article) => isTemplateSeed(article.slug));
  /** Conta só conteúdo real — seed template não entra na meta. */
  const publishedArticles = allPublished.filter((article) => !isTemplateSeed(article.slug));
  const scheduledArticles = articleRows.filter(
    (article) => article.status === "SCHEDULED" && !isTemplateSeed(article.slug)
  );
  const coverComplete = (article: (typeof publishedArticles)[number]) =>
    Boolean(
      article.coverImageUrl &&
        article.coverImageAlt?.trim() &&
        article.coverImageCaption?.trim() &&
        article.coverImageCredit?.trim()
    );
  const missingCover = publishedArticles.filter((article) => !coverComplete(article));
  const coverUrlCounts = new Map<string, number>();
  for (const article of publishedArticles) {
    if (!article.coverImageUrl) continue;
    const key = article.coverImageUrl.trim();
    coverUrlCounts.set(key, (coverUrlCounts.get(key) ?? 0) + 1);
  }
  const duplicateCoverUrls = [...coverUrlCounts.entries()].filter(([, n]) => n > 1).map(([url]) => url);
  const uniqueCoverPublished = publishedArticles.filter(
    (article) =>
      coverComplete(article) &&
      article.coverImageUrl &&
      (coverUrlCounts.get(article.coverImageUrl.trim()) ?? 0) === 1
  );
  const substantialPublished = uniqueCoverPublished.filter(
    (article) => plainLength(article.contentHtml) >= MIN_USEFUL_CHARS
  );
  checks.push(
    pass({
      id: "content-volume",
      stage: "ETAPA_2",
      label: "Conteúdo original avaliável",
      kind: "OFFICIAL",
      severity: "P0",
      status: publishedArticles.length ? "APROVADO_INTERNAMENTE" : "BLOQUEADOR",
      evidence: `${publishedArticles.length} real(is) publicado(s); ${scheduledArticles.length} agendado(s); ${templatePublished.length} template seed ignorado(s). O Google não publica quantidade mínima oficial.`,
      action: "/admin/conteudo/estrategia"
    })
  );
  checks.push(
    pass({
      id: "content-volume-internal",
      stage: "ETAPA_2",
      label: `Meta interna: ${MIN_PUBLISHED_ARTICLES} posts reais substanciais`,
      kind: "INTERNAL",
      severity: "P0",
      status:
        substantialPublished.length >= MIN_PUBLISHED_ARTICLES
          ? "APROVADO_INTERNAMENTE"
          : publishedArticles.length === 0
            ? "BLOQUEADOR"
            : "PENDENTE",
      evidence: `${substantialPublished.length}/${MIN_PUBLISHED_ARTICLES} reais com ≥${MIN_USEFUL_CHARS} caracteres e capa exclusiva. Seed adsense-editorial-* não conta. Produza no admin.`,
      action: "/admin/conteudo/estrategia"
    })
  );
  const thin = publishedArticles.filter((article) => plainLength(article.contentHtml) < MIN_USEFUL_CHARS);
  checks.push(
    pass({
      id: "thin-content",
      stage: "ETAPA_3",
      label: "Conteúdo raso",
      kind: "INTERNAL",
      severity: "P1",
      status: thin.length ? "BLOQUEADOR" : "APROVADO_INTERNAMENTE",
      evidence: `${thin.length} conteúdo(s) real(is) publicado(s) abaixo da meta interna de ${MIN_USEFUL_CHARS} caracteres úteis.`,
      action: thin.length ? "/admin/conteudo/estrategia" : undefined
    })
  );
  checks.push(
    pass({
      id: "cover-images",
      stage: "ETAPA_3",
      label: "Imagem de capa com crédito",
      kind: "INTERNAL",
      severity: "P1",
      status: missingCover.length ? "PENDENTE" : "APROVADO_INTERNAMENTE",
      evidence: missingCover.length
        ? `${missingCover.length} publicado(s) sem capa completa (URL, ALT, legenda e crédito).`
        : "Publicados reais com capa, ALT, legenda e crédito.",
      action: missingCover.length ? "/admin/conteudo/estrategia" : undefined
    })
  );
  checks.push(
    pass({
      id: "unique-covers",
      stage: "ETAPA_3",
      label: "Capas distintas por post",
      kind: "INTERNAL",
      severity: "P1",
      status: duplicateCoverUrls.length ? "PENDENTE" : "APROVADO_INTERNAMENTE",
      evidence: duplicateCoverUrls.length
        ? `${duplicateCoverUrls.length} URL(s) de capa repetida(s) entre posts reais (ex.: mesma og-default). Cada post precisa de capa própria.`
        : "Nenhuma capa duplicada entre posts reais contados na meta.",
      action: duplicateCoverUrls.length ? "/admin/conteudo/estrategia" : undefined
    })
  );
  if (templatePublished.length) {
    checks.push(
      pass({
        id: "template-seed",
        stage: "ETAPA_3",
        label: "Seed template no ar",
        kind: "INTERNAL",
        severity: "P0",
        status: "BLOQUEADOR",
        evidence: `${templatePublished.length} post(s) adsense-editorial-* ainda PUBLISHED. Despublique (DRAFT) antes de pedir AdSense.`,
        action: "/admin/conteudo/estrategia"
      })
    );
  }
  const noAuthorSource = publishedArticles.filter(
    (article) => !article.authorId || (!article.sourceUrl && (!Array.isArray(article.sources) || article.sources.length === 0))
  );
  checks.push(
    pass({
      id: "author-source",
      stage: "ETAPA_2",
      label: "Autoria e fontes",
      kind: "INTERNAL",
      severity: "P0",
      status: noAuthorSource.length ? "BLOQUEADOR" : "APROVADO_INTERNAMENTE",
      evidence: `${noAuthorSource.length} conteúdo(s) publicado(s) sem autoria/fonte completa.`
    })
  );
  const missingPillar = publishedArticles.filter((article) => !article.pillarId || !article.clusterId);
  checks.push(
    pass({
      id: "pillars",
      stage: "ETAPA_3",
      label: "Pilares e clusters",
      kind: "INTERNAL",
      severity: "P1",
      status: missingPillar.length ? "PENDENTE" : "APROVADO_INTERNAMENTE",
      evidence: `${missingPillar.length} publicado(s) sem pilar/cluster.`,
      action: "/admin/conteudo/estrategia"
    })
  );

  const invalidJobs = jobRows.flatMap((record) => {
    const quality = evaluateJobPublication({
      title: record.job.normalizedTitle,
      companyName: record.authorCompany,
      description: record.job.descriptionHtml,
      cityName: record.city,
      stateCode: record.state,
      categoryName: record.category,
      sourceName: record.job.sourceName,
      sourceUrl: record.job.sourceUrl,
      applicationUrl: record.job.applicationUrl,
      applicationEmail: record.job.applicationEmail,
      applicationWhatsapp: record.job.applicationWhatsapp,
      applicationUrlStatus: record.job.applicationUrlStatus,
      verificationStatus: record.job.verificationStatus,
      publicationStatus: record.job.publicationStatus,
      expiresAt: record.job.expiresAt
    });
    return quality.valid ? [] : [`${record.job.publicCode}: ${quality.errors.join(" ")}`];
  });
  checks.push(
    pass({
      id: "jobs",
      stage: "ETAPA_4",
      label: "Vagas e candidaturas válidas",
      kind: "OFFICIAL",
      severity: "P0",
      status: portalEnabled
        ? "NÃO_APLICÁVEL"
        : invalidJobs.length
          ? "BLOQUEADOR"
          : "APROVADO_INTERNAMENTE",
      evidence: portalEnabled
        ? "Modo Portal Editorial ativo: vagas públicas pausadas; pipeline e admin continuam."
        : invalidJobs.length
          ? invalidJobs.slice(0, 5).join(" | ")
          : `${jobRows.length} vaga(s) publicada(s), sem bloqueio conhecido.`,
      action: invalidJobs.length && !portalEnabled ? "/admin/vagas" : undefined
    })
  );
  checks.push(
    pass({
      id: "candidate-free",
      stage: "ETAPA_4",
      label: "Candidatura gratuita sem cadastro obrigatório",
      kind: "OFFICIAL",
      severity: "P0",
      status: "APROVADO_INTERNAMENTE",
      evidence: "Fluxo público de candidatura por site, WhatsApp e e-mail não exige login no portal."
    })
  );

  const robots = await fetchText(new URL("/robots.txt", baseUrl));
  const robotsHasSitemap = robots.body.includes("Sitemap:");
  const robotsBlocksAll = /Disallow:\s*\/\s*$/m.test(robots.body);
  checks.push(
    pass({
      id: "robots",
      stage: "ETAPA_1",
      label: "robots.txt",
      kind: "OFFICIAL",
      severity: "P0",
      status: stagingLike
        ? robots.status === 200 && robotsBlocksAll && !robotsHasSitemap
          ? "APROVADO_INTERNAMENTE"
          : "BLOQUEADOR"
        : robots.status === 200 && robotsHasSitemap
          ? "APROVADO_INTERNAMENTE"
          : "BLOQUEADOR",
      evidence: stagingLike
        ? `Ambiente de homologação: HTTP ${robots.status || "indisponível"}; ${robotsBlocksAll ? "Disallow: /" : "bloqueio ausente"}; sitemap ${robotsHasSitemap ? "indevidamente declarado" : "omitido (correto)"}.`
        : `HTTP ${robots.status || "indisponível"}; ${robotsHasSitemap ? "sitemap declarado" : "sitemap ausente"}.`
    })
  );
  const sitemap = await fetchText(new URL("/sitemap.xml", baseUrl));
  const childUrls = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]!).filter(Boolean);
  const childResults = await Promise.all(
    childUrls.map(async (child) => {
      const url = new URL(child, baseUrl);
      if (url.origin !== baseUrl.origin) return `${url.pathname}: origem externa`;
      const result = await fetchText(url);
      if (result.status !== 200 || !/<(?:urlset|sitemapindex)[\s>]/.test(result.body)) {
        return `${url.pathname}: HTTP ${result.status}`;
      }
      return null;
    })
  );
  const childFailures = childResults.filter(Boolean) as string[];
  checks.push(
    pass({
      id: "sitemaps",
      stage: "ETAPA_1",
      label: "Sitemaps e filhos",
      kind: "OFFICIAL",
      severity: "P0",
      status: sitemap.status === 200 && childUrls.length > 0 && childFailures.length === 0 ? "APROVADO_INTERNAMENTE" : "BLOQUEADOR",
      evidence: childFailures.length ? childFailures.join(" | ") : `${childUrls.length} sitemap(s) filho(s) validados.`
    })
  );

  const hubPaths = (portalEnabled ? (["/blog", "/noticias"] as const) : (["/blog", "/noticias", "/empresas"] as const));
  const hubPages = await Promise.all(hubPaths.map((path) => fetchText(new URL(path, baseUrl))));
  const emptyHubs: string[] = [];
  hubPaths.forEach((path, index) => {
    const page = hubPages[index]!;
    const noindex = /noindex/i.test(page.body) || /noindex/i.test(page.contentType);
    if (page.status === 200 && /Nenhum|Nenhuma|vazia|fora do índice/i.test(page.body) && !noindex) emptyHubs.push(path);
  });
  checks.push(
    pass({
      id: "empty-hubs",
      stage: "ETAPA_0",
      label: "Hubs públicos vazios indexáveis",
      kind: "OFFICIAL",
      severity: "P0",
      status: emptyHubs.length ? "BLOQUEADOR" : "APROVADO_INTERNAMENTE",
      evidence: emptyHubs.length ? `Possíveis hubs vazios indexáveis: ${emptyHubs.join(", ")}.` : "Hubs vazios permanecem com noindex."
    })
  );

  const publisherId = import.meta.env.PUBLIC_ADSENSE_PUBLISHER_ID as string | undefined;
  const clientId = import.meta.env.PUBLIC_ADSENSE_CLIENT_ID as string | undefined;
  const adsEnabled = import.meta.env.PUBLIC_ADSENSE_ENABLED === "true";
  const adsTxt = await fetchText(new URL("/ads.txt", baseUrl));
  checks.push(
    pass({
      id: "publisher",
      stage: "ETAPA_5",
      label: "Publisher ID",
      kind: "INTERNAL",
      severity: "P1",
      status: publisherId && /^pub-\d+$/.test(publisherId) ? "APROVADO_INTERNAMENTE" : "PENDENTE",
      evidence: publisherId ? "Formato configurado." : "Pendente de conta AdSense real; nenhum ID foi inventado."
    })
  );
  checks.push(
    pass({
      id: "ads-txt",
      stage: "ETAPA_5",
      label: "ads.txt",
      kind: "OFFICIAL",
      severity: "P1",
      status: publisherId && adsTxt.body.includes(publisherId) ? "APROVADO_INTERNAMENTE" : "PENDENTE",
      evidence: adsTxt.body.trim().slice(0, 180) || "ads.txt vazio ou indisponível."
    })
  );
  checks.push(
    pass({
      id: "ads-flag",
      stage: "ETAPA_5",
      label: "Feature flag do AdSense",
      kind: "OFFICIAL",
      severity: "P0",
      status: !adsEnabled || (Boolean(publisherId) && Boolean(clientId)) ? "APROVADO_INTERNAMENTE" : "BLOQUEADOR",
      evidence: !adsEnabled
        ? "Anúncios mantidos desativados até aprovação interna e Publisher ID real."
        : "Ativação configurada; validar consentimento e exclusões."
    })
  );
  checks.push(
    pass({
      id: "ad-placement",
      stage: "ETAPA_5",
      label: "Anúncios longe da candidatura",
      kind: "OFFICIAL",
      severity: "P0",
      status: CANDIDATURE_BLOCKED_SLOT_KEYS.size >= 4 ? "APROVADO_INTERNAMENTE" : "BLOQUEADOR",
      evidence: `${CANDIDATURE_BLOCKED_SLOT_KEYS.size} posições próximas da candidatura estão bloqueadas por código.`
    })
  );
  checks.push(
    pass({
      id: "web-stories",
      stage: "ETAPA_3",
      label: "Web Stories sem publicação em massa",
      kind: "INTERNAL",
      severity: "P2",
      status: "APROVADO_INTERNAMENTE",
      evidence: `${storyRows.filter((story) => story.status === "PUBLISHED").length} Web Story publicada(s); criação exige artigo elegível e revisão.`
    })
  );
  checks.push(
    pass({
      id: "mobile",
      stage: "ETAPA_1",
      label: "Experiência mobile",
      kind: "RECOMMENDATION",
      severity: "P2",
      status: "PENDENTE",
      evidence: "Requer validação visual após cada deploy; não é inferida apenas pelo build."
    })
  );

  const editorialReport = await getEditorialAuditReport();
  const portalMode = portalModeEarly;
  const reviewMode = reviewModeEarly;
  const publishedAssessments = editorialReport.assessments.filter((item) => item.article.status === "PUBLISHED");
  const publishedQuality = {
    total: publishedAssessments.length,
    manter: publishedAssessments.filter((item) => item.classification === "MANTER").length,
    melhorar: publishedAssessments.filter((item) => item.classification === "MELHORAR").length,
    noindex: publishedAssessments.filter((item) => item.classification === "NOINDEX").length,
    revisar: publishedAssessments.filter((item) => item.classification === "REVISAR MANUALMENTE").length
  };
  const issueCodeBreakdown = Object.entries(
    editorialReport.assessments.reduce<Record<string, number>>((acc, item) => {
      for (const issue of item.issues) {
        acc[issue.code] = (acc[issue.code] ?? 0) + 1;
      }
      return acc;
    }, {})
  )
    .map(([code, count]) => ({ code, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  const publishedIssueBreakdown = Object.entries(
    publishedAssessments.reduce<Record<string, number>>((acc, item) => {
      for (const issue of item.issues) {
        acc[issue.code] = (acc[issue.code] ?? 0) + 1;
      }
      return acc;
    }, {})
  )
    .map(([code, count]) => ({ code, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  const coverUrls = publishedArticles
    .map((item) => item.coverImageUrl?.trim())
    .filter((value): value is string => Boolean(value));
  const coverCounts = coverUrls.reduce<Record<string, number>>((acc, url) => {
    acc[url] = (acc[url] ?? 0) + 1;
    return acc;
  }, {});
  const imageInventory = {
    publishedWithCover: uniqueCoverPublished.length,
    publishedMissingCover: missingCover.length,
    repeatedCovers: Object.values(coverCounts).filter((count) => count > 1).length,
    totalPublished: publishedArticles.length
  };

  const jobInventory = {
    publishedSample: jobRows.length,
    invalidPublished: invalidJobs.length,
    note: "Amostra limitada aos PUBLISHED carregados na Central (até 400). Use Qualidade das Vagas para inventário completo."
  };
  checks.push(
    pass({
      id: "editorial-portal-mode",
      stage: "ETAPA_0",
      label: "Modo Portal Editorial",
      kind: "INTERNAL",
      severity: "P1",
      status: portalMode.enabled ? "APROVADO_INTERNAMENTE" : "PENDENTE",
      evidence: portalMode.enabled
        ? "Ativo: superfície pública de vagas pausada; pipeline de coleta continua."
        : "Desativado: portal público ainda inclui job board.",
      action: "/admin/adsense-readiness#configuracoes"
    })
  );
  checks.push(
    pass({
      id: "adsense-review-mode",
      stage: "ETAPA_0",
      label: "Modo de Revisão AdSense",
      kind: "INTERNAL",
      severity: "P1",
      status: reviewMode.enabled ? "APROVADO_INTERNAMENTE" : "PENDENTE",
      evidence: reviewMode.enabled
        ? "Ativo: prioriza indexação editorial e restringe páginas de baixo valor."
        : "Desativado.",
      action: "/admin/adsense-readiness#configuracoes"
    })
  );

  const blockers = checks.filter((check) => check.status === "BLOQUEADOR");
  const pending = checks.filter((check) => ["PENDENTE", "EM_REVISÃO"].includes(check.status));
  const ready =
    blockers.length === 0 &&
    !pendingInstitutional.length &&
    (portalEnabled || invalidJobs.length === 0) &&
    substantialPublished.length >= MIN_PUBLISHED_ARTICLES &&
    thin.length === 0 &&
    noAuthorSource.length === 0 &&
    missingPillar.length === 0 &&
    missingCover.length === 0 &&
    duplicateCoverUrls.length === 0 &&
    templatePublished.length === 0;
  const classification = ready
    ? "PRONTO PARA SOLICITAR ANÁLISE"
    : blockers.some((item) => item.severity === "P0")
      ? "BLOQUEADO"
      : pending.length || substantialPublished.length < MIN_PUBLISHED_ARTICLES
        ? "QUASE PRONTO"
        : "NÃO PRONTO";

  const stages: Array<{ id: ReadinessStage; title: string; checks: ReadinessCheck[] }> = [
    { id: "ETAPA_0", title: "Etapa 0 — Contenção", checks: checks.filter((item) => item.stage === "ETAPA_0") },
    { id: "ETAPA_1", title: "Etapa 1 — Integridade técnica", checks: checks.filter((item) => item.stage === "ETAPA_1") },
    { id: "ETAPA_2", title: "Etapa 2 — Integridade editorial", checks: checks.filter((item) => item.stage === "ETAPA_2") },
    { id: "ETAPA_3", title: "Etapa 3 — Conteúdo estruturado", checks: checks.filter((item) => item.stage === "ETAPA_3") },
    { id: "ETAPA_4", title: "Etapa 4 — Experiência do candidato", checks: checks.filter((item) => item.stage === "ETAPA_4") },
    { id: "ETAPA_5", title: "Etapa 5 — Monetização segura", checks: checks.filter((item) => item.stage === "ETAPA_5") }
  ];

  const detailedBlockers = blockers.map((item) => ({
    id: item.id,
    type:
      item.kind === "OFFICIAL"
        ? "REQUISITO TÉCNICO"
        : item.kind === "INTERNAL"
          ? "RECOMENDAÇÃO INTERNA"
          : "RECOMENDAÇÃO INTERNA",
    label: item.label,
    description: item.evidence,
    howToFix: item.action ? `Resolver em ${item.action}` : "Revisar evidência e corrigir no admin.",
    status: item.status,
    severity: item.severity,
    category:
      item.id.includes("content") || item.id.includes("author") || item.id.includes("thin") || item.id.includes("template")
        ? "PENDÊNCIA EDITORIAL"
        : item.id.includes("publisher") || item.id.includes("ads-txt") || item.id.includes("ads-flag")
          ? "PENDÊNCIA EXTERNA"
          : item.kind === "OFFICIAL"
            ? "REQUISITO TÉCNICO"
            : "RECOMENDAÇÃO INTERNA"
  }));

  return {
    classification,
    readyForRequest: ready,
    disclaimer:
      "Verificação interna apenas. A aprovação final é do Google AdSense — “Pronto” aqui não garante aprovação. Seed template e capas repetidas não contam. Pontuação/classificação editorial é métrica interna, não do Google.",
    editorialMeta: {
      minPublished: MIN_PUBLISHED_ARTICLES,
      minUsefulChars: MIN_USEFUL_CHARS,
      published: publishedArticles.length,
      substantialPublished: substantialPublished.length,
      scheduled: scheduledArticles.length,
      withCover: uniqueCoverPublished.length,
      templateIgnored: templatePublished.length,
      publishedStories: storyRows.filter((story) => story.status === "PUBLISHED" && !story.slug.startsWith("adsense-editorial")).length,
      auditedTotal: editorialReport.summary.total,
      auditedPublished: editorialReport.summary.published,
      countExplanation: `${publishedArticles.length} conteúdos publicados atualmente (exclui seed template). ${editorialReport.summary.total} registros editoriais auditados incluindo rascunhos, agendados e arquivados. A qualidade abaixo usa apenas os publicados.`
    },
    publishedQuality,
    issueCodeBreakdown,
    publishedIssueBreakdown,
    imageInventory,
    jobInventory,
    portalMode,
    reviewMode,
    checks,
    stages,
    blockers,
    detailedBlockers,
    generatedAt: new Date()
  };
}
