type EditorialArticle = {
  id: string;
  title: string;
  slug: string;
  type: "NEWS" | "GUIDE" | "DATA_REPORT";
  contentHtml: string;
  primaryKeyword: string | null;
  pillarId: string | null;
  clusterId: string | null;
  sourceUrl: string | null;
  sources: unknown;
  authorId: string;
  reviewerId: string | null;
  factCheckedAt: Date | null;
  updatedAt: Date;
  status: string;
  relatedArticleIds: unknown;
  relatedJobIds: unknown;
};

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
const plainLength = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().length;
const internalHrefs = (html: string) => [...html.matchAll(/href=["'](\/(?:blog|noticias)\/[^"'#?]+)["']/gi)].map((match) => match[1]!);

export function auditEditorialContent(articles: EditorialArticle[]) {
  const publishedPaths = new Set(articles.filter((article) => article.status === "PUBLISHED").map((article) => `/${article.type === "NEWS" ? "noticias" : "blog"}/${article.slug}`));
  const inbound = new Map<string, number>();
  for (const article of articles) for (const href of internalHrefs(article.contentHtml)) inbound.set(href, (inbound.get(href) ?? 0) + 1);
  const thin = articles.filter((article) => plainLength(article.contentHtml) < 800);
  const staleCutoff = Date.now() - 180 * 86_400_000;
  const stale = articles.filter((article) => article.updatedAt.getTime() < staleCutoff);
  const orphan = articles.filter((article) => article.status === "PUBLISHED" && (inbound.get(`/${article.type === "NEWS" ? "noticias" : "blog"}/${article.slug}`) ?? 0) === 0);
  const brokenLinks = articles.flatMap((article) => internalHrefs(article.contentHtml).filter((href) => !publishedPaths.has(href)).map((href) => ({ articleId: article.id, title: article.title, href })));
  const keywordGroups = new Map<string, EditorialArticle[]>();
  for (const article of articles) {
    const keyword = normalize(article.primaryKeyword ?? "");
    if (!keyword) continue;
    keywordGroups.set(keyword, [...(keywordGroups.get(keyword) ?? []), article]);
  }
  const cannibalization = [...keywordGroups.entries()].filter(([, group]) => group.length > 1).map(([keyword, group]) => ({ keyword, articles: group.map((item) => ({ id: item.id, title: item.title })) }));
  const missingGovernance = articles.filter((article) => !article.pillarId || !article.clusterId || !article.reviewerId || !article.factCheckedAt || (!article.sourceUrl && (!Array.isArray(article.sources) || article.sources.length === 0)));
  const suggestions = articles.map((article) => ({
    articleId: article.id,
    title: article.title,
    suggestions: articles.filter((candidate) => candidate.id !== article.id && candidate.status === "PUBLISHED" && candidate.clusterId && candidate.clusterId === article.clusterId).slice(0, 3).map((candidate) => `/${candidate.type === "NEWS" ? "noticias" : "blog"}/${candidate.slug}`)
  })).filter((item) => item.suggestions.length > 0);
  return { thin, stale, orphan, brokenLinks, cannibalization, missingGovernance, suggestions };
}

