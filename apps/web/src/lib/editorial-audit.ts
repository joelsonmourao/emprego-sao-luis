import { articles, auditLogs, createDatabase } from "@es/db";
import { desc, eq } from "drizzle-orm";

export type EditorialClassification = "MANTER" | "MELHORAR" | "NOINDEX" | "REVISAR MANUALMENTE";
export type IssueCategory =
  | "TÉCNICO"
  | "SEO"
  | "ESTRUTURA"
  | "CONTEÚDO"
  | "FONTES"
  | "AUTORIA"
  | "IMAGEM"
  | "DUPLICIDADE"
  | "CONFIANÇA"
  | "UTILIDADE LOCAL"
  | "REVISÃO EDITORIAL";
export type IssueSeverity = "CRÍTICA" | "ALTA" | "MÉDIA" | "BAIXA";
export type SourceKind =
  | "PRIMÁRIA"
  | "OFICIAL"
  | "SECUNDÁRIA CONFIÁVEL"
  | "INTERNA"
  | "INSTITUCIONAL"
  | "NÃO VERIFICÁVEL"
  | "AUSENTE";

export type EditorialIssue = {
  code: string;
  category: IssueCategory;
  title: string;
  description: string;
  severity: IssueSeverity;
  currentValue?: string | null;
  expectedValue?: string | null;
  recommendation: string;
  autoFixable: boolean;
  impact: string;
  status: "PENDENTE" | "CORRIGIDO" | "IGNORADO";
};

export type EditorialArticleInput = {
  id: string;
  title: string;
  slug: string;
  type: "NEWS" | "GUIDE" | "DATA_REPORT";
  excerpt: string;
  contentHtml: string;
  status: string;
  editorialStage: string;
  authorId: string;
  reviewerId: string | null;
  reviewedAt: Date | null;
  factCheckedAt: Date | null;
  pillarId: string | null;
  clusterId: string | null;
  primaryKeyword: string | null;
  sourceName: string | null;
  sourceUrl: string | null;
  sources: unknown;
  seoTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  coverImageCaption: string | null;
  coverImageCredit: string | null;
  localHook: string | null;
  updatedAt: Date;
  publishedAt: Date | null;
};

export type EditorialAssessment = {
  article: EditorialArticleInput;
  classification: EditorialClassification;
  score: number;
  issues: EditorialIssue[];
  sourceKind: SourceKind;
  wordCount: number;
  charCount: number;
  autoFixableCount: number;
};

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

export function plainText(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function countWords(html: string) {
  const text = plainText(html);
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

const INTERNAL_HOSTS = /empregossaoluis\.com\.br|localhost|127\.0\.0\.1/i;
const INSTITUTIONAL_PATHS =
  /\/(politica-editorial|politica-fontes|politica-correcoes|privacidade|termos|cookies|lgpd|sobre|quem-somos|redacao)(\/|$)/i;
const OFFICIAL_HOSTS =
  /\.(gov\.br|jus\.br)$|camara\.leg\.br|senado\.leg\.br|planalto\.gov\.br|ibge\.gov\.br|dieese\.org\.br|trabalho\.gov\.br|gov\.br/i;

function issue(
  partial: Omit<EditorialIssue, "status"> & { status?: EditorialIssue["status"] }
): EditorialIssue {
  return { status: "PENDENTE", ...partial };
}

export function classifySourceUrl(url: string | null | undefined, name?: string | null): SourceKind {
  const raw = String(url ?? "").trim();
  if (!raw && !String(name ?? "").trim()) return "AUSENTE";
  try {
    const parsed = new URL(raw, "https://empregossaoluis.com.br");
    if (INTERNAL_HOSTS.test(parsed.hostname)) {
      if (INSTITUTIONAL_PATHS.test(parsed.pathname)) return "INSTITUCIONAL";
      return "INTERNA";
    }
    if (OFFICIAL_HOSTS.test(parsed.hostname)) return "OFICIAL";
    if (/wikipedia\.org|bbc\.com|g1\.globo\.com|folha\.uol\.com\.br|estadao\.com\.br/i.test(parsed.hostname))
      return "SECUNDÁRIA CONFIÁVEL";
    if (parsed.protocol === "http:" || parsed.protocol === "https:") return "SECUNDÁRIA CONFIÁVEL";
    return "NÃO VERIFICÁVEL";
  } catch {
    return "NÃO VERIFICÁVEL";
  }
}

function listSources(article: EditorialArticleInput): Array<{ name?: string; url?: string }> {
  const items: Array<{ name?: string; url?: string }> = [];
  if (article.sourceUrl || article.sourceName) {
    const entry: { name?: string; url?: string } = {};
    if (article.sourceName) entry.name = article.sourceName;
    if (article.sourceUrl) entry.url = article.sourceUrl;
    items.push(entry);
  }
  if (Array.isArray(article.sources)) {
    for (const entry of article.sources) {
      if (!entry || typeof entry !== "object") continue;
      const record = entry as Record<string, unknown>;
      const item: { name?: string; url?: string } = {};
      if (typeof record.name === "string") item.name = record.name;
      else if (typeof record.title === "string") item.name = record.title;
      if (typeof record.url === "string") item.url = record.url;
      items.push(item);
    }
  }
  return items;
}

function bestSourceKind(article: EditorialArticleInput): SourceKind {
  const kinds = listSources(article).map((item) => classifySourceUrl(item.url, item.name));
  if (!kinds.length) return "AUSENTE";
  const order: SourceKind[] = [
    "PRIMÁRIA",
    "OFICIAL",
    "SECUNDÁRIA CONFIÁVEL",
    "INTERNA",
    "INSTITUCIONAL",
    "NÃO VERIFICÁVEL",
    "AUSENTE"
  ];
  return order.find((kind) => kinds.includes(kind)) ?? "NÃO VERIFICÁVEL";
}

function factualTopic(title: string, html: string) {
  const blob = normalize(`${title} ${plainText(html)}`);
  return /\b(13o|decimo terceiro|salario minimo|clt|fgts|seguro desemprego|direito trabalh|hora extra|aviso previo|rescisao|inss|lei |artigo \d+)\b/.test(
    blob
  );
}

export function assessEditorialArticle(
  article: EditorialArticleInput,
  corpus: EditorialArticleInput[] = []
): EditorialAssessment {
  const issues: EditorialIssue[] = [];
  const text = plainText(article.contentHtml);
  const charCount = text.length;
  const wordCount = countWords(article.contentHtml);
  const sourceKind = bestSourceKind(article);
  const publicPath = `/${article.type === "NEWS" ? "noticias" : "blog"}/${article.slug}`;

  if (!article.seoTitle?.trim()) {
    issues.push(
      issue({
        code: "SEO_TITLE_MISSING",
        category: "SEO",
        title: "Título SEO ausente",
        description: "O campo seoTitle está vazio.",
        severity: "MÉDIA",
        currentValue: "",
        expectedValue: "Título derivado do título editorial",
        recommendation: "Preencher seoTitle com o título do conteúdo ou aplicar correção segura.",
        autoFixable: true,
        impact: "Snippet de busca menos controlado."
      })
    );
  }
  if (!article.metaDescription?.trim()) {
    issues.push(
      issue({
        code: "META_DESCRIPTION_MISSING",
        category: "SEO",
        title: "Meta description ausente",
        description: "Não há meta description cadastrada.",
        severity: "MÉDIA",
        currentValue: "",
        expectedValue: "Resumo de até ~160 caracteres",
        recommendation: "Usar o excerpt ou gerar a partir do início do texto.",
        autoFixable: Boolean(article.excerpt?.trim() || text),
        impact: "Menor clareza no resultado de busca."
      })
    );
  }
  if (article.canonicalUrl?.trim()) {
    try {
      const parsed = new URL(article.canonicalUrl, "https://empregossaoluis.com.br");
      const expected = publicPath;
      const path = parsed.pathname.replace(/\/$/, "") || "/";
      if (path !== expected) {
        issues.push(
          issue({
            code: "CANONICAL_MISMATCH",
            category: "TÉCNICO",
            title: "Canonical divergente",
            description: "O canonical cadastrado não corresponde à URL pública do conteúdo.",
            severity: "ALTA",
            currentValue: article.canonicalUrl,
            expectedValue: expected,
            recommendation: "Corrigir para o path público do artigo/notícia.",
            autoFixable: true,
            impact: "Risco de consolidar sinais SEO na URL errada."
          })
        );
      }
    } catch {
      issues.push(
        issue({
          code: "CANONICAL_INVALID",
          category: "TÉCNICO",
          title: "Canonical inválido",
          description: "O valor de canonicalUrl não é uma URL válida.",
          severity: "ALTA",
          currentValue: article.canonicalUrl,
          expectedValue: publicPath,
          recommendation: "Remover ou corrigir o canonical.",
          autoFixable: true,
          impact: "Canonical quebrado pode ser ignorado ou prejudicar indexação."
        })
      );
    }
  }

  if (!article.coverImageUrl?.trim()) {
    issues.push(
      issue({
        code: "COVER_MISSING",
        category: "IMAGEM",
        title: "Capa ausente",
        description: "O conteúdo não possui imagem de capa.",
        severity: "MÉDIA",
        currentValue: "",
        expectedValue: "URL de capa editorial própria + ALT + crédito",
        recommendation: "Adicionar capa coerente com o tema (não reutilizar placeholder genérico em massa).",
        autoFixable: false,
        impact: "Percepção de qualidade e completude editorial."
      })
    );
  } else if (!article.coverImageAlt?.trim()) {
    issues.push(
      issue({
        code: "COVER_ALT_MISSING",
        category: "IMAGEM",
        title: "ALT da capa ausente",
        description: "Há imagem de capa sem texto alternativo.",
        severity: "MÉDIA",
        currentValue: "",
        expectedValue: "Descrição objetiva da imagem",
        recommendation: "Definir ALT a partir do título quando for capa ilustrativa do tema.",
        autoFixable: true,
        impact: "Acessibilidade e SEO de imagem."
      })
    );
  }

  if (sourceKind === "AUSENTE") {
    issues.push(
      issue({
        code: "SOURCE_MISSING",
        category: "FONTES",
        title: "Fonte ausente",
        description: "Não há fonte principal nem lista de fontes.",
        severity: article.type === "NEWS" ? "CRÍTICA" : "ALTA",
        currentValue: "AUSENTE",
        expectedValue: "Pelo menos uma fonte verificável",
        recommendation: "Informar fonte oficial ou secundária confiável. Não usar política editorial como prova factual.",
        autoFixable: false,
        impact: "Confiabilidade editorial insuficiente."
      })
    );
  } else if (
    factualTopic(article.title, article.contentHtml) &&
    (sourceKind === "INSTITUCIONAL" || sourceKind === "INTERNA")
  ) {
    issues.push(
      issue({
        code: "SOURCE_INTERNAL_AS_FACTUAL",
        category: "FONTES",
        title: "Fonte institucional não comprova fato",
        description:
          "O texto trata de regra/direito/salário, mas a fonte principal é página interna ou institucional do próprio portal.",
        severity: "ALTA",
        currentValue: sourceKind,
        expectedValue: "OFICIAL ou SECUNDÁRIA CONFIÁVEL",
        recommendation:
          "Substituir/complementar com fonte oficial (ex.: gov.br) ou veículo confiável. Política editorial não prova lei trabalhista.",
        autoFixable: false,
        impact: "Risco de conteúdo de baixo valor / afirmação sem comprovação."
      })
    );
  }

  if (article.editorialStage === "APPROVED" && !article.reviewerId && !article.reviewedAt) {
    issues.push(
      issue({
        code: "APPROVED_WITHOUT_REVIEWER",
        category: "REVISÃO EDITORIAL",
        title: "APPROVED sem revisor comprovado",
        description: "A etapa editorial está APPROVED, mas não há reviewerId nem reviewedAt.",
        severity: "ALTA",
        currentValue: "APPROVED / revisor pendente",
        expectedValue: "Revisor identificado ou etapa anterior à aprovação",
        recommendation: "Atribuir revisor real ou voltar a EDITORIAL_REVIEW. Não inventar revisor.",
        autoFixable: false,
        impact: "Inconsistência de governança editorial."
      })
    );
  }

  if (!article.pillarId || !article.clusterId) {
    issues.push(
      issue({
        code: "GOVERNANCE_PILLAR_CLUSTER",
        category: "ESTRUTURA",
        title: "Pilar/cluster ausente",
        description: "Conteúdo sem pilar ou cluster editorial.",
        severity: "BAIXA",
        recommendation: "Associar a um pilar/cluster existente no admin.",
        autoFixable: false,
        impact: "Planejamento e links internos menos claros."
      })
    );
  }

  if (!article.localHook?.trim() && !/\b(sao luis|maranhao|slz|ilha)\b/i.test(normalize(`${article.title} ${text}`))) {
    issues.push(
      issue({
        code: "LOCAL_CONTEXT_WEAK",
        category: "UTILIDADE LOCAL",
        title: "Contexto local fraco",
        description: "Não há gancho local explícito para São Luís/Maranhão.",
        severity: "MÉDIA",
        recommendation: "Incluir utilidade local real sem inventar dados.",
        autoFixable: false,
        impact: "Menor relevância geográfica para o público do portal."
      })
    );
  }

  // Tamanho é indicador auxiliar — só alerta se conteúdo for extremamente curto.
  if (charCount > 0 && charCount < 280) {
    issues.push(
      issue({
        code: "CONTENT_EXTREMELY_SHORT",
        category: "CONTEÚDO",
        title: "Texto extremamente curto",
        description: `Apenas ${charCount} caracteres úteis.`,
        severity: "ALTA",
        currentValue: String(charCount),
        expectedValue: "Conteúdo com utilidade mínima clara",
        recommendation: "Expandir com informação útil ou considerar NOINDEX se não houver valor.",
        autoFixable: false,
        impact: "Alto risco de página de baixo valor."
      })
    );
  } else if (charCount > 0 && charCount < 800) {
    issues.push(
      issue({
        code: "CONTENT_SHORT_AUX",
        category: "CONTEÚDO",
        title: "Texto curto (indicador auxiliar)",
        description: `${charCount} caracteres / ${wordCount} palavras. Tamanho sozinho não define qualidade.`,
        severity: "BAIXA",
        currentValue: String(charCount),
        expectedValue: "Avaliar utilidade, fontes e originalidade",
        recommendation: "Revisar se o texto resolve a intenção do leitor; não inflar artificialmente.",
        autoFixable: false,
        impact: "Pode precisar aprofundamento, dependendo do tema."
      })
    );
  }

  const keyword = normalize(article.primaryKeyword ?? "");
  if (keyword) {
    const rivals = corpus.filter(
      (item) => item.id !== article.id && item.status === "PUBLISHED" && normalize(item.primaryKeyword ?? "") === keyword
    );
    if (rivals.length) {
      issues.push(
        issue({
          code: "KEYWORD_CANNIBALIZATION",
          category: "DUPLICIDADE",
          title: "Possível canibalização de palavra-chave",
          description: `Outros conteúdos publicados usam a mesma primaryKeyword (${keyword}).`,
          severity: "MÉDIA",
          currentValue: rivals.map((item) => item.slug).slice(0, 5).join(", "),
          recommendation: "Diferenciar intenção ou consolidar em um conteúdo principal.",
          autoFixable: false,
          impact: "Disputa interna de relevância."
        })
      );
    }
  }

  // Similaridade simples por título normalizado (sem O(n²) pesado de corpo).
  const titleKey = normalize(article.title).slice(0, 80);
  if (titleKey.length > 12) {
    const similarTitle = corpus.filter(
      (item) =>
        item.id !== article.id &&
        item.status === "PUBLISHED" &&
        normalize(item.title).slice(0, 80) === titleKey
    );
    if (similarTitle.length) {
      issues.push(
        issue({
          code: "TITLE_DUPLICATE",
          category: "DUPLICIDADE",
          title: "Título duplicado",
          description: "Há outro conteúdo publicado com título equivalente.",
          severity: "ALTA",
          currentValue: similarTitle.map((item) => item.slug).join(", "),
          recommendation: "Revisar manualmente; marcar/classificar sem apagar automaticamente.",
          autoFixable: false,
          impact: "Risco de conteúdo repetido."
        })
      );
    }
  }

  let score = 100;
  for (const item of issues) {
    if (item.severity === "CRÍTICA") score -= 25;
    else if (item.severity === "ALTA") score -= 15;
    else if (item.severity === "MÉDIA") score -= 8;
    else score -= 3;
  }
  score = Math.max(0, Math.min(100, score));

  const critical = issues.some((item) => item.severity === "CRÍTICA");
  const factReviewCodes = ["SOURCE_INTERNAL_AS_FACTUAL", "TITLE_DUPLICATE", "SOURCE_MISSING"];
  const needsFactReview = issues.some((item) => factReviewCodes.includes(item.code)) || critical;
  const approvedWithoutReviewer = issues.some((item) => item.code === "APPROVED_WITHOUT_REVIEWER");

  let classification: EditorialClassification = "MANTER";
  if (charCount > 0 && charCount < 200 && article.status === "PUBLISHED") {
    classification = "NOINDEX";
  } else if (needsFactReview) {
    // Reserva REVISAR MANUALMENTE para risco factual/crítico — não para governança leve.
    classification = "REVISAR MANUALMENTE";
  } else if (
    approvedWithoutReviewer ||
    issues.some((item) => item.severity === "ALTA" || item.severity === "MÉDIA" || item.severity === "CRÍTICA")
  ) {
    classification = "MELHORAR";
  } else if (issues.length) {
    classification = score >= 85 ? "MANTER" : "MELHORAR";
  }

  return {
    article,
    classification,
    score,
    issues,
    sourceKind,
    wordCount,
    charCount,
    autoFixableCount: issues.filter((item) => item.autoFixable).length
  };
}

/** Compatibilidade com a API antiga usada em estratégia.astro */
export function auditEditorialContent(articlesInput: EditorialArticleInput[]) {
  const assessments = articlesInput.map((article) => assessEditorialArticle(article, articlesInput));
  return {
    assessments,
    thin: assessments.filter((item) => item.charCount < 800).map((item) => item.article),
    stale: assessments
      .filter((item) => Date.now() - item.article.updatedAt.getTime() > 180 * 86_400_000)
      .map((item) => item.article),
    orphan: [] as EditorialArticleInput[],
    brokenLinks: [] as Array<{ articleId: string; title: string; href: string }>,
    cannibalization: [] as Array<{ keyword: string; articles: Array<{ id: string; title: string }> }>,
    missingGovernance: assessments
      .filter((item) => item.issues.some((issueItem) => issueItem.code === "GOVERNANCE_PILLAR_CLUSTER"))
      .map((item) => item.article),
    suggestions: [] as Array<{ articleId: string; title: string; suggestions: string[] }>
  };
}

export type EditorialAuditReport = {
  assessments: EditorialAssessment[];
  summary: {
    total: number;
    published: number;
    manter: number;
    melhorar: number;
    noindex: number;
    revisar: number;
    autoFixableIssues: number;
    sourceProblems: number;
    reviewPending: number;
  };
  generatedAt: Date;
};

function summarize(assessments: EditorialAssessment[]): EditorialAuditReport["summary"] {
  return {
    total: assessments.length,
    published: assessments.filter((item) => item.article.status === "PUBLISHED").length,
    manter: assessments.filter((item) => item.classification === "MANTER").length,
    melhorar: assessments.filter((item) => item.classification === "MELHORAR").length,
    noindex: assessments.filter((item) => item.classification === "NOINDEX").length,
    revisar: assessments.filter((item) => item.classification === "REVISAR MANUALMENTE").length,
    autoFixableIssues: assessments.reduce((sum, item) => sum + item.autoFixableCount, 0),
    sourceProblems: assessments.filter((item) =>
      item.issues.some((issueItem) => issueItem.category === "FONTES")
    ).length,
    reviewPending: assessments.filter((item) =>
      item.issues.some((issueItem) => issueItem.code === "APPROVED_WITHOUT_REVIEWER")
    ).length
  };
}

let reportCache: { at: number; value: EditorialAuditReport } | null = null;
const REPORT_CACHE_MS = 15_000;

export async function getEditorialAuditReport(options?: { publishedOnly?: boolean }): Promise<EditorialAuditReport> {
  if (!process.env.DATABASE_URL) {
    return { assessments: [], summary: summarize([]), generatedAt: new Date() };
  }
  if (!options?.publishedOnly && reportCache && Date.now() - reportCache.at < REPORT_CACHE_MS) {
    return reportCache.value;
  }
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const rows = options?.publishedOnly
      ? await connection.db
          .select()
          .from(articles)
          .where(eq(articles.status, "PUBLISHED"))
          .orderBy(desc(articles.updatedAt))
          .limit(500)
      : await connection.db.select().from(articles).orderBy(desc(articles.updatedAt)).limit(500);
    const inputs: EditorialArticleInput[] = rows.map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      type: row.type,
      excerpt: row.excerpt,
      contentHtml: row.contentHtml,
      status: row.status,
      editorialStage: row.editorialStage,
      authorId: row.authorId,
      reviewerId: row.reviewerId,
      reviewedAt: row.reviewedAt,
      factCheckedAt: row.factCheckedAt,
      pillarId: row.pillarId,
      clusterId: row.clusterId,
      primaryKeyword: row.primaryKeyword,
      sourceName: row.sourceName,
      sourceUrl: row.sourceUrl,
      sources: row.sources,
      seoTitle: row.seoTitle,
      metaDescription: row.metaDescription,
      canonicalUrl: row.canonicalUrl,
      coverImageUrl: row.coverImageUrl,
      coverImageAlt: row.coverImageAlt,
      coverImageCaption: row.coverImageCaption,
      coverImageCredit: row.coverImageCredit,
      localHook: row.localHook,
      updatedAt: row.updatedAt,
      publishedAt: row.publishedAt
    }));
    const assessments = inputs.map((article) => assessEditorialArticle(article, inputs));
    const value = { assessments, summary: summarize(assessments), generatedAt: new Date() };
    if (!options?.publishedOnly) reportCache = { at: Date.now(), value };
    return value;
  } finally {
    await connection.close();
  }
}

export function clearEditorialAuditCache() {
  reportCache = null;
}

export async function getEditorialAssessment(articleId: string) {
  const report = await getEditorialAuditReport();
  return report.assessments.find((item) => item.article.id === articleId) ?? null;
}

export async function persistEditorialAudit(actorId: string) {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não configurada.");
  const report = await getEditorialAuditReport();
  const connection = createDatabase(process.env.DATABASE_URL);
  const auditedAt = new Date().toISOString();
  try {
    await connection.db.transaction(async (tx) => {
      for (const assessment of report.assessments) {
        const [current] = await tx
          .select({ editorialScore: articles.editorialScore })
          .from(articles)
          .where(eq(articles.id, assessment.article.id))
          .limit(1);
        const previous =
          current?.editorialScore &&
          typeof current.editorialScore === "object" &&
          !Array.isArray(current.editorialScore)
            ? (current.editorialScore as Record<string, unknown>)
            : {};
        await tx
          .update(articles)
          .set({
            editorialScore: {
              ...previous,
              adsenseAudit: {
                classification: assessment.classification,
                score: assessment.score,
                sourceKind: assessment.sourceKind,
                wordCount: assessment.wordCount,
                charCount: assessment.charCount,
                autoFixableCount: assessment.autoFixableCount,
                indexable: assessment.classification !== "NOINDEX",
                issues: assessment.issues.map((issue) => ({
                  code: issue.code,
                  category: issue.category,
                  title: issue.title,
                  severity: issue.severity,
                  autoFixable: issue.autoFixable
                })),
                auditedAt
              }
            },
            updatedAt: new Date()
          })
          .where(eq(articles.id, assessment.article.id));
      }
      await tx.insert(auditLogs).values({
        actorId,
        action: "PERSIST_EDITORIAL_QUALITY_AUDIT",
        entityType: "ARTICLE",
        entityId: "ALL",
        before: {},
        after: { total: report.assessments.length, auditedAt },
        origin: "ADMIN"
      });
    });
    clearEditorialAuditCache();
    return { total: report.assessments.length, auditedAt };
  } finally {
    await connection.close();
  }
}

export type SafeFixResult = {
  articleId: string;
  slug: string;
  applied: string[];
};

export async function applySafeEditorialFixes(actorId: string, articleIds?: string[]) {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não configurada.");
  const { auditLogs } = await import("@es/db");
  const connection = createDatabase(process.env.DATABASE_URL);
  const results: SafeFixResult[] = [];
  try {
    const report = await getEditorialAuditReport();
    const targets = report.assessments.filter(
      (item) =>
        item.autoFixableCount > 0 && (!articleIds?.length || articleIds.includes(item.article.id))
    );
    await connection.db.transaction(async (tx) => {
      for (const assessment of targets) {
        const applied: string[] = [];
        const patch: Record<string, unknown> = { updatedAt: new Date() };
        const article = assessment.article;
        const publicPath = `/${article.type === "NEWS" ? "noticias" : "blog"}/${article.slug}`;
        for (const item of assessment.issues.filter((issueItem) => issueItem.autoFixable)) {
          if (item.code === "SEO_TITLE_MISSING" && !article.seoTitle?.trim()) {
            patch.seoTitle = article.title.slice(0, 70);
            applied.push(item.code);
          }
          if (item.code === "META_DESCRIPTION_MISSING" && !article.metaDescription?.trim()) {
            const base = (article.excerpt || plainText(article.contentHtml)).slice(0, 160);
            if (base) {
              patch.metaDescription = base;
              applied.push(item.code);
            }
          }
          if (
            (item.code === "CANONICAL_MISMATCH" || item.code === "CANONICAL_INVALID") &&
            article.canonicalUrl
          ) {
            patch.canonicalUrl = publicPath;
            applied.push(item.code);
          }
          if (item.code === "COVER_ALT_MISSING" && article.coverImageUrl && !article.coverImageAlt?.trim()) {
            patch.coverImageAlt = `Ilustração: ${article.title}`.slice(0, 120);
            applied.push(item.code);
          }
        }
        if (!applied.length) continue;
        await tx.update(articles).set(patch).where(eq(articles.id, article.id));
        await tx.insert(auditLogs).values({
          actorId,
          action: "SAFE_EDITORIAL_AUTOFIX",
          entityType: "ARTICLE",
          entityId: article.id,
          before: {},
          after: { applied, patch },
          origin: "ADMIN"
        });
        results.push({ articleId: article.id, slug: article.slug, applied });
      }
    });
    clearEditorialAuditCache();
    return { results, totalApplied: results.reduce((sum, item) => sum + item.applied.length, 0) };
  } finally {
    await connection.close();
  }
}
