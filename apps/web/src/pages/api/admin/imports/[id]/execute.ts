import type { APIRoute } from "astro";
import { createDatabase, importBatches } from "@es/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { adminJsonError, adminJsonRedirect, adminMethodNotAllowed } from "../../../../../lib/admin-api-response";
import { can } from "../../../../../lib/auth";
import { processImport } from "../../../../../lib/import-processor";
import { logServerError } from "../../../../../lib/server-error";
import { createImportQueue } from "../../../../../lib/queue";

const settingsSchema = z.object({
  storageKey: z.string().min(1), mode: z.string().optional(), sheetName: z.string().optional(),
  mapping: z.record(z.string(), z.string()).optional(), duplicateStrategy: z.enum(["IGNORE", "UPDATE", "CREATE_NEW"]).optional()
});

export const GET: APIRoute = () => adminMethodNotAllowed("POST");

export const POST: APIRoute = async ({ params, request, locals }) => {
  if (!locals.auth || !can(locals.auth, "imports.manage")) return adminJsonError("Sem permissão.", 403);
  const mode = z.enum(["DRAFT", "PENDING_REVIEW", "PUBLISHED"]).safeParse((await request.formData()).get("mode"));
  if (!mode.success || !params.id || !process.env.DATABASE_URL) return adminJsonError("Dados inválidos.", 400);

  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [batch] = await connection.db.select().from(importBatches).where(eq(importBatches.id, params.id)).limit(1);
    const settings = settingsSchema.safeParse(batch?.settings);
    if (!batch || !settings.success || batch.undoneAt) return adminJsonError("Lote indisponível.", 409);

    await connection.db.update(importBatches).set({ status: "PENDING", settings: { ...settings.data, mode: mode.data }, updatedAt: new Date() }).where(eq(importBatches.id, batch.id));

    let queued = false;
    if (process.env.REDIS_URL) {
      try {
        const queue = createImportQueue();
        try {
          await queue.add("process-job-file", {
            batchId: batch.id, storageKey: settings.data.storageKey, mode: mode.data,
            sheetName: settings.data.sheetName, mapping: settings.data.mapping, duplicateStrategy: settings.data.duplicateStrategy
          }, { jobId: `${batch.id}-${Date.now()}`, attempts: 5, backoff: { type: "exponential", delay: 5000 } });
          queued = true;
        } finally { await queue.close(); }
      } catch (error) {
        logServerError("route:/api/admin/imports/execute:queue", error);
      }
    }

    if (!queued) {
      try {
        await processImport({
          batchId: batch.id, storageKey: settings.data.storageKey, mode: mode.data,
          ...(settings.data.sheetName ? { sheetName: settings.data.sheetName } : {}),
          ...(settings.data.mapping ? { mapping: settings.data.mapping } : {}),
          ...(settings.data.duplicateStrategy ? { duplicateStrategy: settings.data.duplicateStrategy } : {})
        });
        return adminJsonRedirect(`/admin/vagas/importar?batch=${batch.id}&step=resultado`);
      } catch (error) {
        logServerError("route:/api/admin/imports/execute:inline", error);
        return adminJsonError("Não foi possível processar o lote.", 500);
      }
    }
    return adminJsonRedirect(`/admin/vagas/importar?batch=${batch.id}&step=acompanhar`);
  } catch (error) {
    logServerError("route:/api/admin/imports/execute", error);
    return adminJsonError("Não foi possível executar o lote.", 500);
  } finally { await connection.close(); }
};
