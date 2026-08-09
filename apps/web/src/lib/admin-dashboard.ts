import { articles, createDatabase, jobs } from "@es/db";
import { and, count, eq, gte, inArray, lt } from "drizzle-orm";
import { getAdsenseIndexInventory } from "./adsense-index-inventory";
import { getAdsenseReviewMode } from "./adsense-review-mode";
import { getEditorialAuditReport } from "./editorial-audit";
import { getJobAuditReport } from "./job-audit";
import { countOpenSeoIssues } from "./seo-audit";
import { getInstitutionalPages } from "./site-pages";

export async function getAdminDashboardMetrics() {
  const [jobAudit, editorialAudit, reviewMode, institutional, seoIssues] = await Promise.all([
    getJobAuditReport(),
    getEditorialAuditReport(),
    getAdsenseReviewMode(),
    getInstitutionalPages(),
    countOpenSeoIssues()
  ]);
  const indexInventory = await getAdsenseIndexInventory(editorialAudit);
  const counts = {
    active: 0, publishedToday: 0, publishedSevenDays: 0, awaiting: 0, expired: 0, drafts: 0,
    editorialPublished: 0, newsPublished: 0, editorialDrafts: 0, editorialReview: 0
  };
  if (process.env.DATABASE_URL) {
    const connection = createDatabase(process.env.DATABASE_URL);
    const now = new Date();
    const startToday = new Date(now); startToday.setHours(0, 0, 0, 0);
    const sevenDays = new Date(now.getTime() - 7 * 86_400_000);
    try {
      const results = await Promise.all([
        connection.db.select({ value: count() }).from(jobs).where(and(eq(jobs.publicationStatus, "PUBLISHED"), gte(jobs.expiresAt, now))),
        connection.db.select({ value: count() }).from(jobs).where(and(eq(jobs.publicationStatus, "PUBLISHED"), gte(jobs.publishedAt, startToday))),
        connection.db.select({ value: count() }).from(jobs).where(and(eq(jobs.publicationStatus, "PUBLISHED"), gte(jobs.publishedAt, sevenDays))),
        connection.db.select({ value: count() }).from(jobs).where(inArray(jobs.publicationStatus, ["PENDING_REVIEW", "APPROVED", "SCHEDULED"])),
        connection.db.select({ value: count() }).from(jobs).where(lt(jobs.expiresAt, now)),
        connection.db.select({ value: count() }).from(jobs).where(eq(jobs.publicationStatus, "DRAFT")),
        connection.db.select({ value: count() }).from(articles).where(and(eq(articles.status, "PUBLISHED"), inArray(articles.type, ["GUIDE", "DATA_REPORT"]))),
        connection.db.select({ value: count() }).from(articles).where(and(eq(articles.status, "PUBLISHED"), eq(articles.type, "NEWS"))),
        connection.db.select({ value: count() }).from(articles).where(eq(articles.status, "DRAFT")),
        connection.db.select({ value: count() }).from(articles).where(eq(articles.status, "PENDING_REVIEW"))
      ]);
      const values = results.map((result) => Number(result[0]?.value ?? 0));
      counts.active = values[0] ?? 0;
      counts.publishedToday = values[1] ?? 0;
      counts.publishedSevenDays = values[2] ?? 0;
      counts.awaiting = values[3] ?? 0;
      counts.expired = values[4] ?? 0;
      counts.drafts = values[5] ?? 0;
      counts.editorialPublished = values[6] ?? 0;
      counts.newsPublished = values[7] ?? 0;
      counts.editorialDrafts = values[8] ?? 0;
      counts.editorialReview = values[9] ?? 0;
    } finally { await connection.close(); }
  }
  const requiredInstitutional = ["sobre", "quem-somos", "contato", "privacidade", "termos", "cookies", "lgpd", "politica-editorial", "politica-fontes", "politica-correcoes", "redacao", "seguranca-candidatos"] as const;
  const institutionalOk = requiredInstitutional.every((slug) => institutional[slug]?.published && institutional[slug].contentHtml.replace(/<[^>]*>/g, " ").trim().length >= 160);
  const publishedEditorial = editorialAudit.assessments.filter((item) => item.article.status === "PUBLISHED");
  return {
    jobs: counts,
    quality: {
      ...jobAudit.summary,
      weakArticles: publishedEditorial.filter((item) => item.quality === "FRACA").length,
      similarArticles: editorialAudit.similarities.length,
      brokenEditorialLinks: editorialAudit.brokenLinks.length
    },
    seo: {
      ...indexInventory.summary,
      seoIssues,
      structuredErrors: jobAudit.summary.jobPostingInvalid,
      jobPostingValid: jobAudit.summary.jobPostingValid,
      jobPostingInvalid: jobAudit.summary.jobPostingInvalid
    },
    adsense: {
      reviewMode: reviewMode.enabled,
      institutionalOk,
      editorialOk: publishedEditorial.some((item) => item.classification === "MANTER") &&
        publishedEditorial.every((item) => !["NOINDEX", "REVISAR MANUALMENTE"].includes(item.classification)),
      duplicateContent: editorialAudit.similarities.length,
      lowValuePages: publishedEditorial.filter((item) => item.classification === "NOINDEX").length + indexInventory.summary.review
    }
  };
}
