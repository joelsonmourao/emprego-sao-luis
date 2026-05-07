import { prisma } from "@/lib/db";

import { extractJobTitle, jobPostingSchemaTitleLooksPolluted } from "@/lib/jobs/job-title-schema";

export type JobImportSummaryReport = {
  newJobsCreated: number;
  existingJobsUpdated: number;
  oldTitlesPreserved: number;
  oldSlugsPreserved: number;
  oldSeoTitlesPreserved: number;
  slugMutationsInvalid: number;
  titleOverwritesInvalid: number;
  schemaTitlePollutedCount: number;
  duplicateSlugGroups: number;
  duplicateSeoTitleGroups: number;
};

export function formatImportReportMessage(r: JobImportSummaryReport): string {
  return [
    "Importacao concluida:",
    `- Vagas novas criadas: ${r.newJobsCreated}`,
    `- Vagas existentes atualizadas: ${r.existingJobsUpdated}`,
    `- Titles antigos preservados: ${r.oldTitlesPreserved}`,
    `- Slugs antigos preservados: ${r.oldSlugsPreserved}`,
    `- SeoTitles antigos preservados: ${r.oldSeoTitlesPreserved}`,
    `- Slugs alterados indevidamente: ${r.slugMutationsInvalid}`,
    `- Titles antigos sobrescritos indevidamente: ${r.titleOverwritesInvalid}`,
    `- JobPosting.title com possivel poluicao (heuristica): ${r.schemaTitlePollutedCount}`,
    `- Grupos de slug duplicado no banco: ${r.duplicateSlugGroups}`,
    `- Grupos de seoTitle duplicado no banco: ${r.duplicateSeoTitleGroups}`
  ].join("\n");
}

export function emptyImportSummaryReport(): JobImportSummaryReport {
  return {
    newJobsCreated: 0,
    existingJobsUpdated: 0,
    oldTitlesPreserved: 0,
    oldSlugsPreserved: 0,
    oldSeoTitlesPreserved: 0,
    slugMutationsInvalid: 0,
    titleOverwritesInvalid: 0,
    schemaTitlePollutedCount: 0,
    duplicateSlugGroups: 0,
    duplicateSeoTitleGroups: 0
  };
}

export async function finalizeImportReport(summary: JobImportSummaryReport): Promise<JobImportSummaryReport> {
  const [slugDupes, seoDupes] = await Promise.all([
    prisma.job.groupBy({
      by: ["slug"],
      _count: { slug: true },
      having: { slug: { _count: { gt: 1 } } }
    }),
    prisma.job.groupBy({
      by: ["seoTitle"],
      where: { seoTitle: { not: null }, NOT: { seoTitle: "" } },
      _count: { seoTitle: true },
      having: { seoTitle: { _count: { gt: 1 } } }
    })
  ]);

  summary.duplicateSlugGroups = slugDupes.length;
  summary.duplicateSeoTitleGroups = seoDupes.length;
  return summary;
}

export function schemaTitleForJob(job: { jobTitle?: string | null; title: string }): string {
  const jt = job.jobTitle?.trim();
  if (jt) return jt;
  const ex = extractJobTitle(job.title);
  return ex.trim() || job.title.trim();
}

export function countSchemaTitlePollutedForSlugs(slugs: string[]): Promise<number> {
  if (!slugs.length) return Promise.resolve(0);
  return prisma.job
    .findMany({
      where: { slug: { in: slugs } },
      select: { title: true, jobTitle: true }
    })
    .then((rows) => rows.filter((r) => jobPostingSchemaTitleLooksPolluted(schemaTitleForJob(r))).length);
}
