import { createHash } from "node:crypto";
import type { APIRoute } from "astro";
import { auditLogs, createDatabase, importBatches, importRows } from "@es/db";
import { can } from "../../../../lib/auth";
import { adminJsonError, adminJsonRedirect } from "../../../../lib/admin-api-response";
import { analyzeContactEntry } from "../../../../lib/link-import";

export const POST: APIRoute = async ({ request, locals }) => {
  const auth = locals.auth;
  if (!auth || !can(auth, "imports.manage")) return adminJsonError("Sem permissão.", 403);
  if (!process.env.DATABASE_URL) return adminJsonError("Banco indisponível.", 503);
  const form = await request.formData();
  const entries = String(form.get("entries") ?? "").split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
  if (!entries.length || entries.length > 200) return adminJsonError("Informe de 1 a 200 entradas.", 422);

  const analyses: Awaited<ReturnType<typeof analyzeContactEntry>>[] = [];
  for (const entry of entries) analyses.push(await analyzeContactEntry(entry));
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const batch = await connection.db.transaction(async (tx) => {
      const [created] = await tx.insert(importBatches).values({
        fileHash: createHash("sha256").update(entries.join("\n")).digest("hex"),
        fileName: `links-contatos-${new Date().toISOString().slice(0, 10)}.txt`,
        status: "COMPLETED",
        totalRows: analyses.length,
        validRows: analyses.filter((item) => item.status !== "REJECTED").length,
        rejectedRows: analyses.filter((item) => item.status === "REJECTED").length,
        settings: { stage: "CONTACT_PREVIEW", mode: "DRAFT", source: "LINKS_OR_CONTACTS" },
        createdBy: auth.id
      }).returning();
      if (!created) throw new Error("Falha ao criar lote.");
      await tx.insert(importRows).values(analyses.map((item, index) => ({
        batchId: created.id,
        rowNumber: index + 1,
        raw: { entry: item.raw },
        normalized: item.normalized,
        errors: item.errors,
        warnings: item.warnings,
        reviewStatus: item.status,
        action: item.status === "REJECTED" ? "REJECTED" : "CONTACT_DRAFT"
      })));
      await tx.insert(auditLogs).values({ actorId: auth.id, action: "CREATE_CONTACT_IMPORT_PREVIEW", entityType: "IMPORT_BATCH", entityId: created.id, after: { entries: analyses.length }, origin: "ADMIN" });
      return created;
    });
    return adminJsonRedirect(`/admin/vagas/importar?batch=${batch.id}&step=resultado`, { message: "Prévia criada. Complete os dados críticos antes de importar." });
  } finally {
    await connection.close();
  }
};
