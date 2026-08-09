import { articles, auditLogs, authors, createDatabase } from "@es/db";
import { asc, eq } from "drizzle-orm";

export type EditorialClassification = "MANTER" | "MELHORAR" | "NOINDEX" | "REVISAR MANUALMENTE";

export type EditorialArticle = {
  id: string;
  title: string;
  slug: string;
  type: "NEWS" | "GUIDE" | "DATA_REPORT";
  excerpt: string;
  contentHtml: string;
  primaryKeyword: string | null;
  pillarId: string | null;
  clusterId: string | null;
  sourceUrl: string | null;
  sources: unknown;
  authorId: string;
  authorName?: string | null;
  reviewerId: string | null;
  factCheckedAt: Date | null;
  publishedAt: Date | null;
  updatedAt: Date;
  status: string;
  relatedArticleIds: unknown;
  relatedJobIds: unknown;
  seoTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  section?: string | null;
  localHook?: string | null;
  newsEligible?: boolean;
  coverImageUrl?: string | null;
  coverImageAlt?: string | null;
  coverImageWidth?: number | null;
  coverImageHeight?: number | null;
  editorialScore?: unknown;
};

export type EditorialAssessment = {
  article: EditorialArticle;
  wordCount: number;
  repeatedParagraphs: number;
  repeatedSentences: number;
  repeatedHeadings: number;
  repeatedPhrases: number;
  keywordDensity: number;
  cityTermDensity: number;
  localUtility: "ALTA" | "MÉDIA" | "BAIXA";
  quality: "BOA" | "REVISAR" | "FRACA";
  classification: EditorialClassification;
  indexable: boolean;
  score: number;
  maxSimilarity: number;
  issues: string[];
};

export type EditorialSimilarity = {
  articleA: { id: string; title: string };
  articleB: { id: string; title: string };
  similarity: number;
  sharedExcerpt: string;
  suggestedAction: string;
};

export type EditorialSimilarityCluster = {
  id: number;
  members: Array<{ id: string; title: string; classification: EditorialClassification; score: number; maxSimilarity: number }>;
  bestCandidateId: string;
  strongestSimilarity: number;
};

const STOPWORDS = new Set([
  "a", "o", "as", "os", "de", "da", "do", "das", "dos", "e", "em", "um", "uma", "para", "por", "com",
  "que", "se", "no", "na", "nos", "nas", "ao", "aos", "como", "mais", "sua", "seu", "suas", "seus"
]);
const LOCAL_TERMS = ["são luís", "sao luis", "maranhão", "maranhao", "grande ilha", "ribamar", "paço do lumiar", "paco do lumiar", "raposa", "slz"];
const GENERIC_PATTERNS = [/neste artigo (?:vamos|você vai)/i, /no mundo de hoje/i, /é importante destacar/i, /em conclusão/i];
const CLICKBAIT = [/você não vai acreditar/i, /chocante/i, /imperdível!!!/i, /segredo revelado/i];

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
const plainText = (html: string) => html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]*>/g, " ").replace(/&nbsp;|&#160;/gi, " ").replace(/&amp;/gi, "&").replace(/\s+/g, " ").trim();
const tokens = (value: string) => normalize(value).split(" ").filter((token) => token.length > 2 && !STOPWORDS.has(token));
const internalHrefs = (html: string) => [...html.matchAll(/href=["'](\/(?:blog|noticias)\/[^"'#?]+)["']/gi)].map((match) => match[1]!);
const externalHrefs = (html: string) => [...html.matchAll(/href=["']https?:\/\/[^"']+["']/gi)].length;

function makeShingles(article: EditorialArticle) {
  const values = tokens(`${article.title} ${plainText(article.contentHtml)}`);
  const result = new Set<string>();
  for (let index = 0; index <= values.length - 5; index++) result.add(values.slice(index, index + 5).join(" "));
  return result;
}

function buildSimilarityReport(articleRows: EditorialArticle[]) {
  const shinglesById = new Map(articleRows.map((article) => [article.id, makeShingles(article)]));
  const inverted = new Map<string, string[]>();
  for (const [id, shingles] of shinglesById) {
    for (const shingle of shingles) inverted.set(shingle, [...(inverted.get(shingle) ?? []), id]);
  }
  const candidateKeys = new Set<string>();
  for (const ids of inverted.values()) {
    if (ids.length < 2 || ids.length > 20) continue;
    for (let left = 0; left < ids.length - 1; left++) {
      for (let right = left + 1; right < ids.length; right++) candidateKeys.add([ids[left]!, ids[right]!].sort().join("|"));
    }
  }
  const byId = new Map(articleRows.map((article) => [article.id, article]));
  const similarities: EditorialSimilarity[] = [];
  const maximum = new Map<string, number>();
  for (const key of candidateKeys) {
    const [leftId, rightId] = key.split("|") as [string, string];
    const left = shinglesById.get(leftId) ?? new Set<string>();
    const right = shinglesById.get(rightId) ?? new Set<string>();
    if (!left.size || !right.size) continue;
    const shared = [...left].filter((value) => right.has(value));
    const similarity = shared.length / (left.size + right.size - shared.length);
    maximum.set(leftId, Math.max(maximum.get(leftId) ?? 0, similarity));
    maximum.set(rightId, Math.max(maximum.get(rightId) ?? 0, similarity));
    if (similarity < 0.32) continue;
    const articleA = byId.get(leftId)!;
    const articleB = byId.get(rightId)!;
    similarities.push({
      articleA: { id: articleA.id, title: articleA.title },
      articleB: { id: articleB.id, title: articleB.title },
      similarity,
      sharedExcerpt: shared.slice(0, 2).join(" … "),
      suggestedAction: similarity >= 0.7 ? "Revisar possível duplicidade antes de manter ambos indexáveis." : "Comparar intenção de busca e diferenciar escopo, exemplos e links."
    });
  }
  similarities.sort((a, b) => b.similarity - a.similarity);
  return { similarities, maximum };
}

function repeatedUnits(values: string[], minimumLength: number) {
  const counts = new Map<string, number>();
  for (const value of values.map(normalize).filter((value) => value.length >= minimumLength))
    counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.values()].reduce((sum, count) => sum + Math.max(0, count - 1), 0);
}

function repeatedPhraseCount(text: string) {
  const values = tokens(text);
  const counts = new Map<string, number>();
  for (let index = 0; index <= values.length - 10; index++) {
    const phrase = values.slice(index, index + 10).join(" ");
    counts.set(phrase, (counts.get(phrase) ?? 0) + 1);
  }
  return [...counts.values()].filter((count) => count > 1).length;
}

export function assessEditorialArticle(article: EditorialArticle, maxSimilarity = 0): EditorialAssessment {
  const text = plainText(article.contentHtml);
  const words = text.split(/\s+/).filter(Boolean);
  const normalizedText = normalize(text);
  const paragraphs = article.contentHtml.split(/<\/p>|\n{2,}/i).map((paragraph) => normalize(plainText(paragraph))).filter((paragraph) => paragraph.length >= 60);
  const paragraphCounts = new Map<string, number>();
  for (const paragraph of paragraphs) paragraphCounts.set(paragraph, (paragraphCounts.get(paragraph) ?? 0) + 1);
  const repeatedParagraphs = [...paragraphCounts.values()].filter((count) => count > 1).reduce((sum, count) => sum + count - 1, 0);
  const repeatedSentences = repeatedUnits(text.split(/[.!?]+/), 45);
  const repeatedHeadings = repeatedUnits([...article.contentHtml.matchAll(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi)].map((match) => plainText(match[1] ?? "")), 8);
  const repeatedPhrases = repeatedPhraseCount(text);
  const keyword = normalize(article.primaryKeyword ?? "");
  const keywordOccurrences = keyword ? normalizedText.split(keyword).length - 1 : 0;
  const keywordDensity = words.length ? keywordOccurrences / words.length : 0;
  const localMatches = LOCAL_TERMS.filter((term) => normalizedText.includes(normalize(term))).length;
  const cityMentions = (normalizedText.match(/\b(?:sao luis|maranhao|slz)\b/g) ?? []).length;
  const cityTermDensity = words.length ? cityMentions / words.length : 0;
  const hasSources = Boolean(article.sourceUrl || (Array.isArray(article.sources) && article.sources.length));
  const hasInternal = internalHrefs(article.contentHtml).length > 0;
  const hasExternal = externalHrefs(article.contentHtml) > 0;
  const issues: string[] = [];
  let score = 100;

  if (words.length < 250) { issues.push("Conteúdo muito curto para responder ao tema com profundidade."); score -= 45; }
  else if (words.length < 600) { issues.push("Conteúdo pode precisar de mais contexto, exemplos ou orientação prática."); score -= 18; }
  if (repeatedParagraphs) { issues.push(`${repeatedParagraphs} parágrafo(s) repetido(s) internamente.`); score -= Math.min(20, repeatedParagraphs * 6); }
  if (repeatedSentences) { issues.push(`${repeatedSentences} frase(s) longa(s) repetida(s) internamente.`); score -= Math.min(12, repeatedSentences * 4); }
  if (repeatedHeadings) { issues.push(`${repeatedHeadings} heading(s) repetido(s).`); score -= Math.min(10, repeatedHeadings * 5); }
  if (repeatedPhrases >= 4) { issues.push("Blocos de frases muito semelhantes se repetem dentro do texto."); score -= Math.min(12, repeatedPhrases); }
  if (GENERIC_PATTERNS.some((pattern) => pattern.test(text))) { issues.push("Há construções genéricas que devem ser substituídas por informação concreta."); score -= 10; }
  if (CLICKBAIT.some((pattern) => pattern.test(article.title))) { issues.push("Título potencialmente sensacionalista."); score -= 18; }
  if (keywordDensity > 0.04) { issues.push("Repetição excessiva da palavra-chave principal."); score -= 18; }
  if (cityTermDensity > 0.035) { issues.push("São Luís/MA aparece com frequência artificial em relação ao tamanho do texto."); score -= 15; }
  if (!hasSources) { issues.push("Fontes editoriais não registradas."); score -= 16; }
  if (!article.authorId || !article.authorName) { issues.push("Autoria não identificada de forma exibível."); score -= 20; }
  if (!article.publishedAt && article.status === "PUBLISHED") { issues.push("Conteúdo publicado sem data de publicação."); score -= 12; }
  if (!article.pillarId || !article.clusterId) { issues.push("Pilar ou cluster editorial ausente."); score -= 8; }
  if (!article.metaDescription?.trim()) { issues.push("Meta description editorial não preenchida; o fallback deve ser revisado."); score -= 5; }
  if (!article.excerpt?.trim() || article.excerpt.trim().length < 80) { issues.push("Resumo editorial curto ou ausente."); score -= 5; }
  if (article.title.trim().length < 25 || article.title.trim().length > 110) { issues.push("Título fora da faixa editorial recomendada para clareza."); score -= 5; }
  if (!article.coverImageUrl) { issues.push("Imagem editorial principal ausente."); score -= 8; }
  else {
    if (!article.coverImageAlt?.trim()) { issues.push("Imagem principal sem texto alternativo próprio."); score -= 4; }
    if (!article.coverImageWidth || !article.coverImageHeight) { issues.push("Dimensões da imagem principal não registradas."); score -= 3; }
  }
  if (!hasInternal) { issues.push("Nenhum link interno contextual."); score -= 5; }
  if (!hasExternal && article.type === "NEWS") { issues.push("Notícia sem link externo de referência verificável."); score -= 8; }
  if (article.type === "NEWS" && !article.newsEligible) { issues.push("Notícia não foi marcada como elegível para o sitemap Google News."); score -= 5; }
  if (localMatches === 0 && !article.localHook?.trim()) { issues.push("Utilidade local não está explícita."); score -= article.type === "NEWS" ? 18 : 8; }
  if (maxSimilarity >= 0.7) { issues.push(`Similaridade máxima de ${(maxSimilarity * 100).toFixed(0)}% com outro conteúdo.`); score -= 30; }
  else if (maxSimilarity >= 0.45) { issues.push(`Similaridade relevante de ${(maxSimilarity * 100).toFixed(0)}% com outro conteúdo.`); score -= 15; }

  score = Math.max(0, Math.min(100, score));
  const localUtility = localMatches >= 2 || article.localHook?.trim() ? "ALTA" : localMatches === 1 ? "MÉDIA" : "BAIXA";
  const classification: EditorialClassification =
    maxSimilarity >= 0.7 || keywordDensity > 0.06
      ? "REVISAR MANUALMENTE"
      : score < 35
        ? "NOINDEX"
        : score < 75
          ? "MELHORAR"
          : "MANTER";
  const quality = score >= 75 ? "BOA" : score >= 40 ? "REVISAR" : "FRACA";
  return {
    article,
    wordCount: words.length,
    repeatedParagraphs,
    repeatedSentences,
    repeatedHeadings,
    repeatedPhrases,
    keywordDensity,
    cityTermDensity,
    localUtility,
    quality,
    classification,
    indexable: article.status === "PUBLISHED" && !["NOINDEX", "REVISAR MANUALMENTE"].includes(classification),
    score,
    maxSimilarity,
    issues
  };
}

export function auditEditorialContent(articleRows: EditorialArticle[]) {
  const publishedRows = articleRows.filter((article) => article.status === "PUBLISHED");
  const publishedPaths = new Set(publishedRows.map((article) => `/${article.type === "NEWS" ? "noticias" : "blog"}/${article.slug}`));
  const inbound = new Map<string, number>();
  for (const article of publishedRows) for (const href of internalHrefs(article.contentHtml)) inbound.set(href, (inbound.get(href) ?? 0) + 1);
  const { similarities, maximum } = buildSimilarityReport(publishedRows);
  const assessments = articleRows.map((article) => assessEditorialArticle(article, maximum.get(article.id) ?? 0));
  const assessmentById = new Map(assessments.map((assessment) => [assessment.article.id, assessment]));
  const parent = new Map<string, string>();
  const find = (id: string): string => {
    const current = parent.get(id) ?? id;
    if (current === id) return id;
    const root = find(current);
    parent.set(id, root);
    return root;
  };
  const union = (left: string, right: string) => {
    const leftRoot = find(left);
    const rightRoot = find(right);
    if (leftRoot !== rightRoot) parent.set(rightRoot, leftRoot);
  };
  for (const pair of similarities) {
    parent.set(pair.articleA.id, parent.get(pair.articleA.id) ?? pair.articleA.id);
    parent.set(pair.articleB.id, parent.get(pair.articleB.id) ?? pair.articleB.id);
    union(pair.articleA.id, pair.articleB.id);
  }
  const membersByRoot = new Map<string, Set<string>>();
  for (const id of parent.keys()) {
    const root = find(id);
    const members = membersByRoot.get(root) ?? new Set<string>();
    members.add(id);
    membersByRoot.set(root, members);
  }
  const similarityClusters: EditorialSimilarityCluster[] = [...membersByRoot.values()].map((ids, index) => {
    const members = [...ids].map((id) => assessmentById.get(id)!).filter(Boolean).sort((left, right) => right.score - left.score || right.wordCount - left.wordCount);
    const strongestSimilarity = similarities.filter((pair) => ids.has(pair.articleA.id) && ids.has(pair.articleB.id)).reduce((maximumValue, pair) => Math.max(maximumValue, pair.similarity), 0);
    return {
      id: index + 1,
      members: members.map((item) => ({ id: item.article.id, title: item.article.title, classification: item.classification, score: item.score, maxSimilarity: item.maxSimilarity })),
      bestCandidateId: members[0]!.article.id,
      strongestSimilarity
    };
  }).sort((left, right) => right.strongestSimilarity - left.strongestSimilarity);
  const thin = assessments.filter((item) => item.article.status === "PUBLISHED" && item.wordCount < 250).map((item) => item.article);
  const staleCutoff = Date.now() - 180 * 86_400_000;
  const stale = publishedRows.filter((article) => article.updatedAt.getTime() < staleCutoff);
  const orphan = publishedRows.filter((article) => (inbound.get(`/${article.type === "NEWS" ? "noticias" : "blog"}/${article.slug}`) ?? 0) === 0);
  const brokenLinks = publishedRows.flatMap((article) => internalHrefs(article.contentHtml).filter((href) => !publishedPaths.has(href)).map((href) => ({ articleId: article.id, title: article.title, href })));
  const keywordGroups = new Map<string, EditorialArticle[]>();
  for (const article of publishedRows) {
    const keyword = normalize(article.primaryKeyword ?? "");
    if (keyword) keywordGroups.set(keyword, [...(keywordGroups.get(keyword) ?? []), article]);
  }
  const cannibalization = [...keywordGroups.entries()].filter(([, group]) => group.length > 1).map(([keyword, group]) => ({ keyword, articles: group.map((item) => ({ id: item.id, title: item.title })) }));
  const missingGovernance = publishedRows.filter((article) => !article.pillarId || !article.clusterId || !article.reviewerId || !article.factCheckedAt || (!article.sourceUrl && (!Array.isArray(article.sources) || article.sources.length === 0)));
  const suggestions = articleRows.map((article) => ({
    articleId: article.id,
    title: article.title,
    suggestions: articleRows.filter((candidate) => candidate.id !== article.id && candidate.status === "PUBLISHED" && candidate.clusterId && candidate.clusterId === article.clusterId).slice(0, 3).map((candidate) => `/${candidate.type === "NEWS" ? "noticias" : "blog"}/${candidate.slug}`)
  })).filter((item) => item.suggestions.length > 0);
  return { thin, stale, orphan, brokenLinks, cannibalization, missingGovernance, suggestions, assessments, similarities, similarityClusters };
}

type EditorialAuditReport = ReturnType<typeof auditEditorialContent>;
let reportCache: { at: number; value: EditorialAuditReport } | null = null;
const REPORT_CACHE_MS = 15_000;

export async function getEditorialAuditReport() {
  if (!process.env.DATABASE_URL) return auditEditorialContent([]);
  if (reportCache && Date.now() - reportCache.at < REPORT_CACHE_MS) return reportCache.value;
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const rows = await connection.db.select({ article: articles, authorName: authors.name }).from(articles).leftJoin(authors, eq(articles.authorId, authors.id)).orderBy(asc(articles.title));
    const value = auditEditorialContent(rows.map(({ article, authorName }) => ({ ...article, authorName })));
    reportCache = { at: Date.now(), value };
    return value;
  } finally {
    await connection.close();
  }
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
        const previous = assessment.article.editorialScore && typeof assessment.article.editorialScore === "object" && !Array.isArray(assessment.article.editorialScore)
          ? assessment.article.editorialScore as Record<string, unknown>
          : {};
        await tx.update(articles).set({
          editorialScore: {
            ...previous,
            adsenseAudit: {
              classification: assessment.classification,
              score: assessment.score,
              quality: assessment.quality,
              indexable: assessment.indexable,
              maxSimilarity: assessment.maxSimilarity,
              issues: assessment.issues,
              auditedAt
            }
          }
        }).where(eq(articles.id, assessment.article.id));
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
    reportCache = null;
    return { total: report.assessments.length, auditedAt };
  } finally {
    await connection.close();
  }
}
