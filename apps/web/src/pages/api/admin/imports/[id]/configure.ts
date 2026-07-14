import type { APIRoute } from "astro";
import { auditLogs, createDatabase, importBatches, importMappingTemplates } from "@es/db";
import { importModeSchema } from "@es/shared";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { can } from "../../../../../lib/auth";
import {
  adminJsonError,
  adminJsonRedirect,
  adminMethodNotAllowed
} from "../../../../../lib/admin-api-response";
import { logServerError } from "../../../../../lib/server-error";
import { createImportQueue } from "../../../../../lib/queue";
import { processImport } from "../../../../../lib/import-processor";

const fields = [
  "externalId",
  "originalTitle",
  "title",
  "company",
  "city",
  "state",
  "category",
  "neighborhood",
  "description",
  "summary",
  "activities",
  "requirements",
  "benefits",
  "applyUrl",
  "source",
  "sourceUrl",
  "publishedAt",
  "expiresAt",
  "sourceStatus",
  "featured",
  "employmentType",
  "workplaceType",
  "salaryMin",
  "salaryMax"
] as const;
const requiredFields = [
  "title",
  "company",
  "city",
  "state",
  "description",
  "applyUrl",
  "source",
  "expiresAt"
] as const;
const mappingSchema = z.record(z.enum(fields), z.string().min(1)).superRefine((mapping, context) => {
  for (const field of requiredFields) {
    if (!mapping[field])
      context.addIssue({ code: "custom", path: [field], message: `Mapeie o campo obrigatório ${field}.` });
  }
});
const settingsSchema = z.object({
  storageKey: z.string(),
  sheets: z.array(
    z.object({
      name: z.string(),
      headers: z.array(z.string()),
      preview: z.array(z.record(z.string(), z.unknown()))
    })
  )
});

export const GET: APIRoute = () => adminMethodNotAllowed("POST");

export const POST: APIRoute = async ({ params, request, locals, clientAddress }) => {
  const auth = locals.auth;
  if (!auth || !can(auth, "imports.manage")) return adminJsonError("Sem permissão.", 403);
  if (!params.id || !process.env.DATABASE_URL) return adminJsonError("Dados inválidos.", 400);

  const form = await request.formData();
  const mode = importModeSchema.exclude(["DRY_RUN"]).or(z.literal("DRY_RUN")).safeParse(form.get("mode"));
  const sheetName = z.string().min(1).safeParse(form.get("sheetName"));
  const duplicateStrategy = z
    .enum(["IGNORE", "UPDATE", "CREATE_NEW"])
    .safeParse(form.get("duplicateStrategy"));
  const mapping = mappingSchema.safeParse(
    Object.fromEntries(
      fields.flatMap((field) => {
        const value = form.get(`map_${field}`);
        return typeof value === "string" && value !== "" ? [[field, value]] : [];
      })
    )
  );

  if (!mode.success || !sheetName.success || !duplicateStrategy.success || !mapping.success) {
    return adminJsonError("Configuração inválida.", 400, {
      details: ["Revise o mapeamento de colunas e os campos obrigatórios."]
    });
  }

  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [batch] = await connection.db
      .select()
      .from(importBatches)
      .where(eq(importBatches.id, params.id))
      .limit(1);
    const current = settingsSchema.safeParse(batch?.settings);
    if (
      !batch ||
      !current.success ||
      ["FAILED", "CANCELLED", "PROCESSING"].includes(batch.status) ||
      !current.data.sheets.some((sheet) => sheet.name === sheetName.data)
    ) {
      return adminJsonError("Lote indisponível.", 409);
    }

    const settings = {
      ...(typeof batch.settings === "object" && batch.settings ? batch.settings : {}),
      stage: "QUEUED_VALIDATION",
      mode: "DRY_RUN",
      targetMode: mode.data === "DRY_RUN" ? "DRAFT" : mode.data,
      analysisValid: false,
      sheetName: sheetName.data,
      mapping: mapping.data,
      duplicateStrategy: duplicateStrategy.data
    };

    await connection.db.transaction(async (tx) => {
      await tx
        .update(importBatches)
        .set({ settings, status: "PENDING", updatedAt: new Date() })
        .where(eq(importBatches.id, batch.id));
      const templateName = String(form.get("templateName") ?? "").trim();
      if (templateName) {
        await tx
          .insert(importMappingTemplates)
          .values({
            name: templateName,
            mapping: mapping.data,
            sheetName: sheetName.data,
            createdBy: auth.id
          })
          .onConflictDoUpdate({
            target: importMappingTemplates.name,
            set: { mapping: mapping.data, sheetName: sheetName.data, updatedAt: new Date() }
          });
      }
      await tx.insert(auditLogs).values({
        actorId: auth.id,
        action: "CONFIGURE_IMPORT",
        entityType: "IMPORT_BATCH",
        entityId: batch.id,
        after: {
          sheetName: sheetName.data,
          mapping: mapping.data,
          duplicateStrategy: duplicateStrategy.data,
          ip: clientAddress
        },
        origin: "ADMIN"
      });
    });

    let queueWarning: string | undefined;
    let processedInline = false;

    if (process.env.REDIS_URL) {
      try {
        const queue = createImportQueue();
        try {
          await queue.add(
            "process-job-file",
            {
              batchId: batch.id,
              storageKey: current.data.storageKey,
              mode: "DRY_RUN",
              sheetName: sheetName.data,
              mapping: mapping.data,
              duplicateStrategy: duplicateStrategy.data,
              requestId: locals.requestId ?? undefined
            },
            { jobId: `${batch.id}-${Date.now()}`, attempts: 5, backoff: { type: "exponential", delay: 5000 } }
          );
        } finally {
          await queue.close();
        }
      } catch (error) {
        logServerError("route:/api/admin/imports/configure:queue", error);
        queueWarning = "Fila indisponível. Processando o lote nesta requisição.";
      }
    }

    if (!process.env.REDIS_URL || queueWarning) {
      try {
        await processImport({
          batchId: batch.id,
          storageKey: current.data.storageKey,
          mode: "DRY_RUN",
          sheetName: sheetName.data,
          mapping: mapping.data,
          duplicateStrategy: duplicateStrategy.data,
          ...(locals.requestId ? { requestId: locals.requestId } : {})
        });
        processedInline = true;
        queueWarning = undefined;
      } catch (error) {
        logServerError("route:/api/admin/imports/configure:sync", error);
        if (!queueWarning) {
          queueWarning = "Não foi possível processar o lote automaticamente. Tente novamente em Operação.";
        }
      }
    }

    return adminJsonRedirect(
      `/admin/vagas/importar?batch=${batch.id}&step=${processedInline ? "resultado" : "acompanhar"}`,
      queueWarning
        ? { warning: queueWarning }
        : { message: "Validação concluída. Confirme antes de importar." }
    );
  } catch (error) {
    logServerError("route:/api/admin/imports/configure", error);
    return adminJsonError("Não foi possível validar o lote.", 500);
  } finally {
    await connection.close();
  }
};
