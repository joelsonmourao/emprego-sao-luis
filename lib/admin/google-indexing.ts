import { JobIndexingStatus, JobStatus } from "@prisma/client";

import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { hasGoogleIndexingCredentials, isGoogleIndexingEnabled } from "@/lib/google-indexing";
import { normalizeOrigin } from "@/lib/site-url";

export type GoogleIndexingAdminSnapshot = {
  configured: boolean;
  enabled: boolean;
  clientEmailMasked: string;
  projectId: string;
  siteUrl: string;
  lastSubmittedAt: string | null;
  successCount: number;
  errorCount: number;
  pendingCount: number;
};

function maskEmail(value: string) {
  const email = value.trim();
  if (!email) return "-";
  const [local, domain] = email.split("@");
  if (!local || !domain) return "-";
  const safeLocal = local.length <= 3 ? `${local[0] ?? "*"}***` : `${local.slice(0, 3)}***`;
  return `${safeLocal}@${domain}`;
}

export async function getGoogleIndexingAdminSnapshot(): Promise<GoogleIndexingAdminSnapshot> {
  const [lastLog, successCount, errorCount, pendingCount] = await Promise.all([
    prisma.indexingLog.findFirst({
      orderBy: [{ createdAt: "desc" }],
      select: { createdAt: true }
    }),
    prisma.indexingLog.count({ where: { status: "SUCCESS" } }),
    prisma.indexingLog.count({ where: { status: "ERROR" } }),
    prisma.job.count({
      where: {
        status: JobStatus.PUBLISHED,
        indexingStatus: { in: [JobIndexingStatus.NOT_SENT, JobIndexingStatus.ERROR, JobIndexingStatus.SKIPPED] }
      }
    })
  ]);

  const siteUrl = normalizeOrigin(env.SITE_URL) ?? normalizeOrigin(env.NEXT_PUBLIC_SITE_URL) ?? "-";
  const enabled = isGoogleIndexingEnabled();
  const configured = enabled && hasGoogleIndexingCredentials() && siteUrl !== "-";

  return {
    configured,
    enabled,
    clientEmailMasked: maskEmail(env.GOOGLE_INDEXING_CLIENT_EMAIL ?? ""),
    projectId: env.GOOGLE_INDEXING_PROJECT_ID?.trim() || "-",
    siteUrl,
    lastSubmittedAt: lastLog?.createdAt.toISOString() ?? null,
    successCount,
    errorCount,
    pendingCount
  };
}
