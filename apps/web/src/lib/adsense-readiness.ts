import { CANDIDATURE_BLOCKED_SLOT_KEYS } from "@es/ads";
import { articles, categories, cities, companies, createDatabase, jobs, states, webStories } from "@es/db";
import { evaluateJobPublication, isStagingLikeEnvironment } from "@es/shared";
import { eq } from "drizzle-orm";
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
  const institutional = await getInstitutionalPages();
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

  const publishedArticles = articleRows.filter((article) => article.status === "PUBLISHED");
  checks.push(
    pass({
      id: "content-volume",
      stage: "ETAPA_2",
      label: "Conteúdo original avaliável",
      kind: "OFFICIAL",
      severity: "P0",
      status: publishedArticles.length ? "APROVADO_INTERNAMENTE" : "BLOQUEADOR",
      evidence: `${publishedArticles.length} conteúdo(s) editorial(is) publicado(s). O Google não define quantidade mínima oficial.`,
      action: "/admin/conteudo/estrategia"
    })
  );
  const thin = publishedArticles.filter((article) => plainLength(article.contentHtml) < 800);
  checks.push(
    pass({
      id: "thin-content",
      stage: "ETAPA_3",
      label: "Conteúdo raso",
      kind: "INTERNAL",
      severity: "P1",
      status: thin.length ? "BLOQUEADOR" : "APROVADO_INTERNAMENTE",
      evidence: `${thin.length} conteúdo(s) publicado(s) abaixo da meta interna de 800 caracteres úteis.`,
      action: thin.length ? "/admin/conteudo/estrategia" : undefined
    })
  );
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
      status: invalidJobs.length ? "BLOQUEADOR" : "APROVADO_INTERNAMENTE",
      evidence: invalidJobs.length ? invalidJobs.slice(0, 5).join(" | ") : `${jobRows.length} vaga(s) publicada(s), sem bloqueio conhecido.`,
      action: invalidJobs.length ? "/admin/vagas" : undefined
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

  const hubPaths = ["/blog", "/noticias", "/empresas"] as const;
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

  const blockers = checks.filter((check) => check.status === "BLOQUEADOR");
  const pending = checks.filter((check) => ["PENDENTE", "EM_REVISÃO"].includes(check.status));
  const ready =
    blockers.length === 0 &&
    !pendingInstitutional.length &&
    invalidJobs.length === 0 &&
    publishedArticles.length > 0 &&
    thin.length === 0 &&
    noAuthorSource.length === 0;
  const classification = ready ? "PRONTO PARA SOLICITAR ANÁLISE" : blockers.some((item) => item.severity === "P0") ? "BLOQUEADO" : pending.length ? "QUASE PRONTO" : "NÃO PRONTO";

  const stages: Array<{ id: ReadinessStage; title: string; checks: ReadinessCheck[] }> = [
    { id: "ETAPA_0", title: "Etapa 0 — Contenção", checks: checks.filter((item) => item.stage === "ETAPA_0") },
    { id: "ETAPA_1", title: "Etapa 1 — Integridade técnica", checks: checks.filter((item) => item.stage === "ETAPA_1") },
    { id: "ETAPA_2", title: "Etapa 2 — Integridade editorial", checks: checks.filter((item) => item.stage === "ETAPA_2") },
    { id: "ETAPA_3", title: "Etapa 3 — Conteúdo estruturado", checks: checks.filter((item) => item.stage === "ETAPA_3") },
    { id: "ETAPA_4", title: "Etapa 4 — Experiência do candidato", checks: checks.filter((item) => item.stage === "ETAPA_4") },
    { id: "ETAPA_5", title: "Etapa 5 — Monetização segura", checks: checks.filter((item) => item.stage === "ETAPA_5") }
  ];

  return {
    classification,
    readyForRequest: ready,
    disclaimer: "Esta verificação é interna e não garante aprovação pelo Google AdSense.",
    checks,
    stages,
    blockers,
    generatedAt: new Date()
  };
}
