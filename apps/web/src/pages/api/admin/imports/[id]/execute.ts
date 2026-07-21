import type { APIRoute } from "astro";
import { createDatabase, importBatches } from "@es/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import {
  adminJsonError,
  adminJsonRedirect,
  adminMethodNotAllowed
} from "../../../../../lib/admin-api-response";
import { can } from "../../../../../lib/auth";
import { shouldProcessImportOnWeb } from "../../../../../lib/import-dispatch";
import { processImport } from "../../../../../lib/import-processor";
import { logServerError } from "../../../../../lib/server-error";
import { createImportQueue } from "../../../../../lib/queue";

const settingsSchema = z
  .object({
    storageKey: z.string().min(1),
    stage: z.literal("VALIDATED"),
    analysisValid: z.literal(true),
    sheetName: z.string().min(1),
    mapping: z.record(z.string(), z.string()).refine((mapping) => Object.keys(mapping).length > 0),
    duplicateStrategy: z.enum(["IGNORE", "UPDATE", "CREATE_NEW"]),
    analysis: z.object({ validRows: z.number().int().positive() }).passthrough()
  })
  .passthrough();

export const GET: APIRoute = () => adminMethodNotAllowed("POST");

export const POST: APIRoute = async ({ params, request, locals }) => {
  if (!locals.auth || !can(locals.auth, "imports.manage")) return adminJsonError("Sem permissão.", 403);
  const mode = z
    .enum(["DRAFT", "PENDING_REVIEW"])
    .safeParse((await request.formData()).get("mode"));
  if (!mode.success || !params.id || !process.env.DATABASE_URL)
    return adminJsonError("Dados inválidos.", 400);

  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [batch] = await connection.db
      .select()
      .from(importBatches)
      .where(eq(importBatches.id, params.id))
      .limit(1);
    const settings = settingsSchema.safeParse(batch?.settings);
    if (
      !batch ||
      !settings.success ||
      batch.undoneAt ||
      batch.status !== "COMPLETED" ||
      batch.validRows <= 0
    ) {
      return adminJsonError("Execute apenas um lote validado com ao menos uma linha válida.", 409, {
        code: "IMPORT_ANALYSIS_REQUIRED"
      });
    }

    await connection.db
      .update(importBatches)
      .set({
        status: "PENDING",
        settings: { ...settings.data, stage: "QUEUED_IMPORT", mode: mode.data },
        updatedAt: new Date()
      })
      .where(eq(importBatches.id, batch.id));

    const processOnWeb = shouldProcessImportOnWeb() || !process.env.REDIS_URL;
    let queued = false;

    if (!processOnWeb) {
      try {
        const queue = createImportQueue();
        try {
          await queue.add(
            "process-job-file",
            {
              batchId: batch.id,
              storageKey: settings.data.storageKey,
              mode: mode.data,
              sheetName: settings.data.sheetName,
              mapping: settings.data.mapping,
              duplicateStrategy: settings.data.duplicateStrategy,
              requestId: locals.requestId ?? undefined
            },
            { jobId: `${batch.id}-${Date.now()}`, attempts: 5, backoff: { type: "exponential", delay: 5000 } }
          );
          queued = true;
        } finally {
          await queue.close();
        }
      } catch (error) {
        logServerError("route:/api/admin/imports/execute:queue", error);
      }
    }

    if (!queued) {
      try {
        await processImport({
          batchId: batch.id,
          storageKey: settings.data.storageKey,
          mode: mode.data,
          sheetName: settings.data.sheetName,
          mapping: settings.data.mapping,
          duplicateStrategy: settings.data.duplicateStrategy,
          ...(locals.requestId ? { requestId: locals.requestId } : {})
        });
        return adminJsonRedirect(`/admin/vagas/importar?batch=${batch.id}&step=resultado`);
      } catch (error) {
        logServerError("route:/api/admin/imports/execute:inline", error);
        const message = error instanceof Error ? error.message : "Erro desconhecido";
        return adminJsonError(
          message.includes("não encontrado")
            ? "Arquivo da planilha não está no armazenamento. Envie o XLSX de novo após conferir /admin/saude."
            : "Não foi possível processar o lote.",
          500,
          { details: [message] }
        );
      }
    }
    return adminJsonRedirect(`/admin/vagas/importar?batch=${batch.id}&step=acompanhar`);
  } catch (error) {
    logServerError("route:/api/admin/imports/execute", error);
    return adminJsonError("Não foi possível executar o lote.", 500);
  } finally {
    await connection.close();
  }
};
