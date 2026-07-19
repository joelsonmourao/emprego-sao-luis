import { and, eq, gt, inArray, isNotNull, lte, or } from "drizzle-orm";
import { articles, createDatabase, indexingEvents, jobs } from "@es/db";

export async function publishScheduledJobs() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não configurada.");
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    return await connection.db.transaction(async (tx) => {
      const now = new Date();
      const published = await tx.update(jobs).set({ publicationStatus: "PUBLISHED", publishedAt: now, updatedAt: now }).where(and(
        eq(jobs.publicationStatus, "SCHEDULED"),
        lte(jobs.scheduledAt, now),
        gt(jobs.expiresAt, now),
        inArray(jobs.verificationStatus, ["SOURCE_CONFIRMED", "COMPANY_VERIFIED", "LINK_CONFIRMED"]),
        or(isNotNull(jobs.applicationUrl), isNotNull(jobs.applicationEmail), isNotNull(jobs.applicationWhatsapp))
      )).returning({ id: jobs.id, slug: jobs.slug });
      for (const job of published) {
        const url = new URL(`/vagas/${job.slug}`, process.env.SITE_URL ?? "https://empregossaoluis.com.br").toString();
        await tx.insert(indexingEvents).values([{ dedupeKey: `scheduled:${job.id}:google`, jobId: job.id, provider: "GOOGLE", url, notificationType: "URL_UPDATED" }, { dedupeKey: `scheduled:${job.id}:indexnow`, jobId: job.id, provider: "INDEXNOW", url, notificationType: "URL_UPDATED" }]).onConflictDoNothing();
      }
      const publishedArticles = await tx.update(articles).set({ status: "PUBLISHED", publishedAt: now, updatedAt: now }).where(and(eq(articles.status, "SCHEDULED"), lte(articles.scheduledAt, now))).returning({ id: articles.id, slug: articles.slug, type: articles.type });
      for (const article of publishedArticles) {
        const path = article.type === "NEWS" ? `/noticias/${article.slug}` : `/blog/${article.slug}`;
        const url = new URL(path, process.env.SITE_URL ?? "https://empregossaoluis.com.br").toString();
        await tx.insert(indexingEvents).values({ dedupeKey: `scheduled-article:${article.id}:indexnow`, provider: "INDEXNOW", url, notificationType: "URL_UPDATED" }).onConflictDoNothing();
      }
      return { published: published.length, publishedArticles: publishedArticles.length };
    });
  } finally { await connection.close(); }
}
