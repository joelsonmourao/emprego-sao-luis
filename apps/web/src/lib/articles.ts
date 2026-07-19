import { and, count, desc, eq, gt, inArray, isNull, lte, or, type SQL } from "drizzle-orm";
import { articles, authors, createDatabase } from "@es/db";

type ArticleType = "NEWS" | "GUIDE" | "DATA_REPORT";

export function articlePublicPath(type: ArticleType | string, slug: string) {
  return type === "NEWS" ? `/noticias/${slug}` : `/blog/${slug}`;
}

function publishedWhere(now: Date, since?: Date, type?: ArticleType | ArticleType[]) {
  return and(
    eq(articles.status, "PUBLISHED"),
    lte(articles.publishedAt, now),
    or(isNull(articles.expiresAt), gt(articles.expiresAt, now)),
    since ? gt(articles.publishedAt, since) : undefined,
    Array.isArray(type) ? inArray(articles.type, type) : type ? eq(articles.type, type) : undefined
  );
}

export async function listPublishedArticles(limit = 50, since?: Date, type?: ArticleType | ArticleType[]) {
  if (!process.env.DATABASE_URL) return [];
  const connection = createDatabase(process.env.DATABASE_URL);
  const now = new Date();
  try {
    return await connection.db
      .select({ article: articles, authorName: authors.name })
      .from(articles)
      .innerJoin(authors, eq(articles.authorId, authors.id))
      .where(publishedWhere(now, since, type))
      .orderBy(desc(articles.publishedAt))
      .limit(limit);
  } catch (error) {
    // Schema incompleto (migrate pendente) não pode derrubar home/blog.
    console.error("[articles.listPublishedArticles]", error instanceof Error ? error.message : error);
    return [];
  } finally {
    await connection.close();
  }
}

export async function listPublishedArticlesPage(
  page = 1,
  pageSize = 12,
  type?: ArticleType | ArticleType[]
): Promise<{ items: Awaited<ReturnType<typeof listPublishedArticles>>; total: number; page: number; pages: number }> {
  const safePage = Math.max(1, page);
  const safeSize = Math.min(48, Math.max(1, pageSize));
  if (!process.env.DATABASE_URL) return { items: [], total: 0, page: 1, pages: 1 };
  const connection = createDatabase(process.env.DATABASE_URL);
  const now = new Date();
  try {
    const where = publishedWhere(now, undefined, type) as SQL;
    const [totalRow] = await connection.db.select({ value: count() }).from(articles).where(where);
    const total = Number(totalRow?.value ?? 0);
    const pages = Math.max(1, Math.ceil(total / safeSize));
    const current = Math.min(safePage, pages);
    const items = await connection.db
      .select({ article: articles, authorName: authors.name })
      .from(articles)
      .innerJoin(authors, eq(articles.authorId, authors.id))
      .where(where)
      .orderBy(desc(articles.publishedAt))
      .limit(safeSize)
      .offset((current - 1) * safeSize);
    return { items, total, page: current, pages };
  } catch (error) {
    console.error("[articles.listPublishedArticlesPage]", error instanceof Error ? error.message : error);
    return { items: [], total: 0, page: 1, pages: 1 };
  } finally {
    await connection.close();
  }
}

export async function findPublishedArticle(slug: string, type?: ArticleType | ArticleType[]) {
  if (!process.env.DATABASE_URL) return null;
  const connection = createDatabase(process.env.DATABASE_URL);
  const now = new Date();
  try {
    const [result] = await connection.db.select({ article: articles, authorName: authors.name }).from(articles).innerJoin(authors, eq(articles.authorId, authors.id)).where(and(
      eq(articles.slug, slug), eq(articles.status, "PUBLISHED"), lte(articles.publishedAt, now), or(isNull(articles.expiresAt), gt(articles.expiresAt, now)),
      Array.isArray(type) ? inArray(articles.type, type) : type ? eq(articles.type, type) : undefined
    )).limit(1);
    return result ?? null;
  } catch (error) {
    console.error("[articles.findPublishedArticle]", error instanceof Error ? error.message : error);
    return null;
  } finally { await connection.close(); }
}
