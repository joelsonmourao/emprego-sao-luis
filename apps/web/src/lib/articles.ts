import { and, desc, eq, gt, inArray, isNull, lte, or } from "drizzle-orm";
import { articles, authors, createDatabase } from "@es/db";

type ArticleType = "NEWS" | "GUIDE" | "DATA_REPORT";

export async function listPublishedArticles(limit = 50, since?: Date, type?: ArticleType | ArticleType[]) {
  if (!process.env.DATABASE_URL) return [];
  const connection = createDatabase(process.env.DATABASE_URL);
  const now = new Date();
  try {
    return await connection.db.select({ article: articles, authorName: authors.name }).from(articles).innerJoin(authors, eq(articles.authorId, authors.id)).where(and(
      eq(articles.status, "PUBLISHED"), lte(articles.publishedAt, now), or(isNull(articles.expiresAt), gt(articles.expiresAt, now)),
      since ? gt(articles.publishedAt, since) : undefined,
      Array.isArray(type) ? inArray(articles.type, type) : type ? eq(articles.type, type) : undefined
    )).orderBy(desc(articles.publishedAt)).limit(limit);
  } catch (error) {
    // Schema incompleto (migrate pendente) não pode derrubar home/blog.
    console.error("[articles.listPublishedArticles]", error instanceof Error ? error.message : error);
    return [];
  } finally { await connection.close(); }
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
