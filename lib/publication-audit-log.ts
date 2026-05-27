import { appendFile, mkdir } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { env } from "@/lib/env";
import { SITE_TIME_ZONE } from "@/lib/timezone";

const LOG_SUBDIR = "publication-audit";

function resolveAuditLogDir() {
  const configured = env.SCHEDULED_JOBS_LOG_DIR?.trim();
  if (configured) {
    return path.join(configured, LOG_SUBDIR);
  }

  if (process.env.VERCEL || process.env.COOLIFY || process.env.NODE_ENV === "production") {
    return path.join(os.tmpdir(), "jovem-aprendiz-publication-audit");
  }

  return path.join(process.cwd(), "logs", LOG_SUBDIR);
}

export type PublicationAuditPayload = {
  phase: "upload" | "publish_attempt" | "publish_ok" | "publish_error";
  jobId?: string;
  slug?: string;
  externalId?: string | null;
  message: string;
  extra?: Record<string, unknown>;
};

export async function appendPublicationAuditLog(payload: PublicationAuditPayload) {
  const dir = resolveAuditLogDir();
  const day = new Date().toISOString().slice(0, 10);
  const filePath = path.join(dir, `${day}.jsonl`);
  const line = JSON.stringify({
    ts: new Date().toISOString(),
    timeZone: SITE_TIME_ZONE,
    ...payload,
    extra: payload.extra
  });

  try {
    await mkdir(dir, { recursive: true });
    await appendFile(filePath, `${line}\n`, "utf-8");
    return filePath;
  } catch (error) {
    console.error("[publication-audit-log] Falha ao gravar arquivo de auditoria:", error);
    console.info("[publication-audit-log] Registro:", line);
    return null;
  }
}
