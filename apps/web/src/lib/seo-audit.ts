import { articles, createDatabase, jobs, seoAuditIssues } from "@es/db";
import { and, count, desc, eq, inArray } from "drizzle-orm";

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
    issues.push({
      checkKey: "missing_title",
      severity: "critical",
      scoreImpact: 15,
      message: "Título ausente",
      recommendation: "Defina normalizedTitle."
    });
  }
  if (!job.metaDescription?.trim() && !job.summary?.trim()) {
    issues.push({
      checkKey: "missing_description",
      severity: "warning",
      scoreImpact: 10,
      message: "Meta description ausente",
      recommendation: "Adicione uma descrição SEO ou conteúdo suficiente para geração automática."
    });
  }
  if (!job.slug?.trim()) {
    issues.push({
      checkKey: "canonical_invalid",
      severity: "critical",
      scoreImpact: 12,
      message: "Slug ausente impede canonical",
      recommendation: `Defina slug para ${url}.`
    });
  } else if (job.slug !== job.slug.toLowerCase() || /[^a-z0-9-]/.test(job.slug)) {
    issues.push({
      checkKey: "slug_bad",
      severity: "warning",
      scoreImpact: 6,
      message: "Slug com formato ruim",
      recommendation: "Use slug minúsculo com hífens, sem www."
    });
  }
  if (job.publicationStatus === "EXPIRED") {
    issues.push({
      checkKey: "expired_indexable",
      severity: "critical",
      scoreImpact: 20,
      message: "Vaga expirada ainda publicável",
      recommendation: "Arquivar ou noindex."
    });
  }
  if (!job.descriptionHtml || job.descriptionHtml.length < 80) {
    issues.push({
      checkKey: "thin_content",
      severity: "warning",
      scoreImpact: 8,
      message: "Descrição muito curta para JobPosting",
      recommendation: "Enriqueça a descrição."
    });
  }
  if (job.canonicalUrl && !canonicalOk(job.canonicalUrl))
    issues.push({
      checkKey: "canonical_invalid",
      severity: "critical",
      scoreImpact: 12,
      message: "Canônica fora do domínio oficial",
      recommendation: "Use a URL sem www do próprio portal."
    });
  if (job.seoTitle && job.seoTitle.length > 60)
    issues.push({
      checkKey: "title_too_long",
      severity: "warning",
      scoreImpact: 4,
      message: "Título SEO longo",
      recommendation: "Mantenha o título em até 60 caracteres quando possível."
    });
  if (job.metaDescription && (job.metaDescription.length < 70 || job.metaDescription.length > 160))
    issues.push({
      checkKey: "meta_length",
      severity: "warning",
      scoreImpact: 4,
      message: "Meta description fora da faixa recomendada",
      recommendation: "Use uma descrição clara entre 70 e 160 caracteres."
    });
  if (job.confidentialCompany || job.unidentifiedCompany)
    issues.push({
      checkKey: "jobposting_ineligible_organization",
      severity: "info",
      scoreImpact: 0,
      message: "JobPosting inelegível por organização não pública",
      recommendation: "Mantenha o schema desativado ou vincule uma contratante pública real."
    });
  if (job.publicationStatus === "PUBLISHED" && (!job.expiresAt || job.expiresAt <= new Date()))
    issues.push({
      checkKey: "expired_schema",
      severity: "critical",
      scoreImpact: 20,
      message: "Vaga vencida marcada como publicada",
      recommendation: "Execute a expiração e remova JobPosting/sitemap."
    });
  return issues;
}

export function auditArticle(article: typeof articles.$inferSelect): SeoCheck[] {
  const issues: SeoCheck[] = [];
  if (!article.seoTitle?.trim())
    issues.push({
      checkKey: "missing_seo_title",
      severity: "warning",
      scoreImpact: 6,
      message: "Título SEO ausente",
      recommendation: "Defina um título exclusivo."
    });
  if (!article.metaDescription?.trim())
    issues.push({
      checkKey: "missing_meta_description",
      severity: "warning",
      scoreImpact: 6,
      message: "Meta description ausente",
      recommendation: "Defina uma descrição exclusiva."
    });
  if (!article.coverImageUrl)
    issues.push({
      checkKey: "news_image_missing",
      severity: "critical",
      scoreImpact: 15,
      message: "Imagem principal ausente",
      recommendation: "Selecione imagem editorial processada."
    });
  if (article.coverImageUrl && !article.coverImageAlt)
    issues.push({
      checkKey: "image_alt_missing",
      severity: "critical",
      scoreImpact: 12,
      message: "ALT da imagem ausente",
      recommendation: "Descreva objetivamente a imagem."
    });
  if (article.coverImageUrl && (!article.coverImageWidth || article.coverImageWidth < 1200))
    issues.push({
      checkKey: "news_image_width",
      severity: "critical",
      scoreImpact: 15,
      message: "Imagem abaixo de 1200 px",
      recommendation: "Substitua por original com largura mínima de 1200 px."
    });
  if (article.canonicalUrl && !canonicalOk(article.canonicalUrl))
    issues.push({
      checkKey: "canonical_invalid",
      severity: "critical",
      scoreImpact: 12,
      message: "Canônica inválida",
      recommendation: "Use o domínio oficial sem www."
    });
  return issues;
}

export async function runSeoAudit(limit = 50) {
  if (!process.env.DATABASE_URL) return { scanned: 0, issues: 0 };
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const rows = await connection.db
      .select()
      .from(jobs)
      .where(inArray(jobs.publicationStatus, ["PUBLISHED", "PAUSED", "EXPIRED"]))
      .orderBy(desc(jobs.updatedAt))
      .limit(limit);
    const articleRows = await connection.db
      .select()
      .from(articles)
      .where(eq(articles.status, "PUBLISHED"))
      .orderBy(desc(articles.updatedAt))
      .limit(limit);
    let issueCount = 0;
    for (const job of rows) {
      const checks = await auditJob(job);
      const url = `${SITE_URL}/vagas/${job.slug}`;
      for (const check of checks) {
        const [open] = await connection.db
          .select({ id: seoAuditIssues.id })
          .from(seoAuditIssues)
          .where(
            and(
              eq(seoAuditIssues.url, url),
              eq(seoAuditIssues.checkKey, check.checkKey),
              eq(seoAuditIssues.resolved, false),
              eq(seoAuditIssues.ignored, false)
            )
          )
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
    for (const article of articleRows) {
      const checks = auditArticle(article);
      const path = article.type === "NEWS" ? "noticias" : "blog";
      const url = `${SITE_URL}/${path}/${article.slug}`;
      for (const check of checks) {
        const [open] = await connection.db
          .select({ id: seoAuditIssues.id })
          .from(seoAuditIssues)
          .where(
            and(
              eq(seoAuditIssues.url, url),
              eq(seoAuditIssues.checkKey, check.checkKey),
              eq(seoAuditIssues.resolved, false),
              eq(seoAuditIssues.ignored, false)
            )
          )
          .limit(1);
        if (open) continue;
        await connection.db
          .insert(seoAuditIssues)
          .values({
            entityType: "ARTICLE",
            entityId: article.id,
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
    return { scanned: rows.length + articleRows.length, issues: issueCount };
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
    return await connection.db
      .select()
      .from(seoAuditIssues)
      .where(and(...filters))
      .orderBy(desc(seoAuditIssues.checkedAt))
      .limit(200);
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
    await connection.db
      .update(seoAuditIssues)
      .set({ resolved: true, updatedAt: new Date() })
      .where(eq(seoAuditIssues.id, id));
  } finally {
    await connection.close();
  }
}

export async function ignoreSeoIssue(id: string, reason: string) {
  if (!process.env.DATABASE_URL) return;
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    await connection.db
      .update(seoAuditIssues)
      .set({ ignored: true, ignoreReason: reason, updatedAt: new Date() })
      .where(eq(seoAuditIssues.id, id));
  } finally {
    await connection.close();
  }
}

export function seoScoreFromIssues(issues: Array<{ scoreImpact: number; severity: string }>) {
  const base = 100;
  const penalty = issues.reduce((sum, i) => sum + i.scoreImpact, 0);
  return Math.max(0, base - penalty);
}
