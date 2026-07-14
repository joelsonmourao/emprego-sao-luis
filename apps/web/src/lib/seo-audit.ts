import { createDatabase, jobs, seoAuditIssues } from "@es/db";
import { and, count, desc, eq } from "drizzle-orm";

const SITE_URL = process.env.SITE_URL ?? "https://empregossaoluis.com.br";

export type SeoCheck = {
  checkKey: string;
  severity: "critical" | "warning" | "info";
  scoreImpact: number;
  message: string;
  recommendation: string;
};

function canonicalOk(url: string | null | undefined) {
  if (!url) return false;
  return url.startsWith(SITE_URL) && !url.includes("www.");
}

export function siteCanonicalOk() {
  return canonicalOk(SITE_URL);
}

export async function auditJob(job: typeof jobs.$inferSelect): Promise<SeoCheck[]> {
  const issues: SeoCheck[] = [];
  const url = `${SITE_URL}/vagas/${job.slug}`;
  if (!job.normalizedTitle?.trim()) {
    issues.push({ checkKey: "missing_title", severity: "critical", scoreImpact: 15, message: "Título ausente", recommendation: "Defina normalizedTitle." });
  }
  if (!job.summary?.trim()) {
    issues.push({ checkKey: "missing_description", severity: "warning", scoreImpact: 10, message: "Description ausente", recommendation: "Adicione summary útil para meta description." });
  }
  if (!job.slug?.trim()) {
    issues.push({ checkKey: "canonical_invalid", severity: "critical", scoreImpact: 12, message: "Slug ausente impede canonical", recommendation: `Defina slug para ${url}.` });
  } else if (job.slug !== job.slug.toLowerCase() || /[^a-z0-9-]/.test(job.slug)) {
    issues.push({ checkKey: "slug_bad", severity: "warning", scoreImpact: 6, message: "Slug com formato ruim", recommendation: "Use slug minúsculo com hífens, sem www." });
  }
  if (job.publicationStatus === "EXPIRED") {
    issues.push({ checkKey: "expired_indexable", severity: "critical", scoreImpact: 20, message: "Vaga expirada ainda publicável", recommendation: "Arquivar ou noindex." });
  }
  if (!job.description || job.description.length < 80) {
    issues.push({ checkKey: "thin_content", severity: "warning", scoreImpact: 8, message: "Descrição muito curta para JobPosting", recommendation: "Enriqueça a descrição." });
  }
  return issues;
}

export async function runSeoAudit(limit = 50) {
  if (!process.env.DATABASE_URL) return { scanned: 0, issues: 0 };
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const rows = await connection.db.select().from(jobs).where(eq(jobs.publicationStatus, "PUBLISHED")).orderBy(desc(jobs.updatedAt)).limit(limit);
    let issueCount = 0;
    for (const job of rows) {
      const checks = await auditJob(job);
      const url = `${SITE_URL}/vagas/${job.slug}`;
      for (const check of checks) {
        const [open] = await connection.db
          .select({ id: seoAuditIssues.id })
          .from(seoAuditIssues)
          .where(and(eq(seoAuditIssues.url, url), eq(seoAuditIssues.checkKey, check.checkKey), eq(seoAuditIssues.resolved, false), eq(seoAuditIssues.ignored, false)))
          .limit(1);
        if (open) continue;
        await connection.db.insert(seoAuditIssues).values({
          entityType: "JOB",
          entityId: job.id,
          url,
          checkKey: check.checkKey,
          severity: check.severity,
          scoreImpact: check.scoreImpact,
          message: check.message,
          recommendation: check.recommendation,
          checkedAt: new Date()
        });
        issueCount++;
      }
    }
    return { scanned: rows.length, issues: issueCount };
  } finally {
    await connection.close();
  }
}

export async function listSeoIssues(options: { severity?: string; resolved?: boolean } = {}) {
  if (!process.env.DATABASE_URL) return [];
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const filters = [eq(seoAuditIssues.ignored, false)];
    if (options.severity) filters.push(eq(seoAuditIssues.severity, options.severity));
    if (options.resolved !== undefined) filters.push(eq(seoAuditIssues.resolved, options.resolved));
    return await connection.db.select().from(seoAuditIssues).where(and(...filters)).orderBy(desc(seoAuditIssues.checkedAt)).limit(200);
  } finally {
    await connection.close();
  }
}

export async function countOpenSeoIssues() {
  if (!process.env.DATABASE_URL) return 0;
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [row] = await connection.db
      .select({ value: count() })
      .from(seoAuditIssues)
      .where(and(eq(seoAuditIssues.resolved, false), eq(seoAuditIssues.ignored, false)));
    return row?.value ?? 0;
  } finally {
    await connection.close();
  }
}

export async function resolveSeoIssue(id: string) {
  if (!process.env.DATABASE_URL) return;
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    await connection.db.update(seoAuditIssues).set({ resolved: true, updatedAt: new Date() }).where(eq(seoAuditIssues.id, id));
  } finally {
    await connection.close();
  }
}

export async function ignoreSeoIssue(id: string, reason: string) {
  if (!process.env.DATABASE_URL) return;
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    await connection.db.update(seoAuditIssues).set({ ignored: true, ignoreReason: reason, updatedAt: new Date() }).where(eq(seoAuditIssues.id, id));
  } finally {
    await connection.close();
  }
}

export function seoScoreFromIssues(issues: Array<{ scoreImpact: number; severity: string }>) {
  const base = 100;
  const penalty = issues.reduce((sum, i) => sum + i.scoreImpact, 0);
  return Math.max(0, base - penalty);
}
