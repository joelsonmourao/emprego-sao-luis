import { createHash } from "node:crypto";
import type { APIRoute } from "astro";
import { importModeSchema, suggestImportMapping } from "@es/shared";
import { createDatabase, importBatches } from "@es/db";
import { desc, eq } from "drizzle-orm";
import { can } from "../../../../lib/auth";
import { adminJsonError, adminJsonRedirect, adminMethodNotAllowed } from "../../../../lib/admin-api-response";
import { logServerError } from "../../../../lib/server-error";
import { getImportStorageInfo, putImportFile } from "../../../../lib/import-storage";
import * as XLSX from "xlsx";
import { StorageError } from "@es/storage";
import { validateImportFile } from "../../../../lib/import-file-validation";

export const GET: APIRoute = () => adminMethodNotAllowed("POST");

export const POST: APIRoute = async ({ request, locals }) => {
  const auth = locals.auth;
  if (!auth || !can(auth, "imports.manage")) {
    return adminJsonError("Sem permissão para importar.", 403);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch (error) {
    logServerError("route:/api/admin/imports:form", error);
    return adminJsonError("Requisição inválida.", 400);
  }

  const file = form.get("file");
  const mode = importModeSchema.safeParse(form.get("mode"));
  if (!(file instanceof File) || !mode.success) {
    return adminJsonError("Arquivo ou modo inválido.", 400, {
      details: ["Envie um arquivo XLSX/CSV e selecione o destino."]
    });
  }

  const initialValidation = validateImportFile(file.name, file.size);
  if (!initialValidation.ok) {
    return adminJsonError(initialValidation.error, initialValidation.status, {
      code: initialValidation.code
    });
  }
  if (!process.env.DATABASE_URL) {
    return adminJsonError("Banco de dados indisponível.", 503);
  }

  const storage = getImportStorageInfo();
  if (!storage.ready) {
    return adminJsonError("Armazenamento indisponível.", 503);
  }

  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const contentValidation = validateImportFile(file.name, file.size, bytes);
    if (!contentValidation.ok) {
      return adminJsonError(contentValidation.error, contentValidation.status, {
        code: contentValidation.code
      });
    }
    const fileHash = createHash("sha256").update(bytes).digest("hex");
    const storageKey = `imports/${fileHash}/${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

    const [existing] = await connection.db
      .select()
      .from(importBatches)
      .where(eq(importBatches.fileHash, fileHash))
      .orderBy(desc(importBatches.createdAt))
      .limit(1);
    if (existing && !["FAILED", "CANCELLED"].includes(existing.status) && !existing.undoneAt) {
      return adminJsonRedirect(`/admin/vagas/importar?batch=${existing.id}&reused=1`, {
        batchId: existing.id,
        duplicateBy: "content-sha256"
      });
    }

    let workbook: XLSX.WorkBook;
    try {
      workbook = XLSX.read(bytes, { type: "array", cellDates: true });
    } catch (error) {
      logServerError("route:/api/admin/imports:parse", error);
      return adminJsonError("Arquivo corrompido ou ilegível.", 422, {
        code: "FILE_CORRUPTED",
        details: ["Não foi possível ler a planilha."]
      });
    }

    const sheets = workbook.SheetNames.map((name) => {
      const sheet = workbook.Sheets[name];
      const rows = sheet
        ? XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "", raw: false })
        : [];
      const headers = rows[0] ? Object.keys(rows[0]) : [];
      return { name, headers, preview: rows.slice(0, 5) };
    });

    if (!sheets.length || sheets.every((sheet) => sheet.headers.length === 0)) {
      return adminJsonError("Planilha sem cabeçalhos.", 422, {
        code: "HEADERS_MISSING",
        details: ["Inclua cabeçalhos e ao menos uma linha de dados."]
      });
    }

    try {
      await putImportFile(storageKey, bytes, file.type || "application/octet-stream");
    } catch (error) {
      logServerError("route:/api/admin/imports:storage", error);
      return adminJsonError("O armazenamento local não está disponível.", 503, {
        code: error instanceof StorageError ? error.code : "STORAGE_NOT_WRITABLE"
      });
    }

    const first = sheets[0]!;
    const [batch] = await connection.db.transaction(async (tx) => {
      if (existing?.status === "FAILED") {
        const previousSettings =
          typeof existing.settings === "object" && existing.settings ? existing.settings : {};
        await tx
          .update(importBatches)
          .set({
            status: "CANCELLED",
            settings: {
              ...previousSettings,
              stage: "ARCHIVED_FAILED",
              archivedAt: new Date().toISOString(),
              archivedReason: "Nova tentativa criada para o mesmo conteúdo.",
              supersededByRequestId: locals.requestId
            },
            updatedAt: new Date()
          })
          .where(eq(importBatches.id, existing.id));
      }
      return tx
        .insert(importBatches)
        .values({
          fileHash,
          fileName: file.name,
          settings: {
            stage: "CONFIGURE",
            storageKey,
            mode: mode.data,
            targetMode: mode.data === "DRY_RUN" ? "DRAFT" : mode.data,
            sheets,
            sheetName: first.name,
            mapping: suggestImportMapping(first.headers),
            duplicateStrategy: "IGNORE",
            contentHashAlgorithm: "sha256",
            retryOf: existing?.status === "FAILED" ? existing.id : null,
            analysisValid: false
          },
          createdBy: auth.id
        })
        .returning();
    });

    if (!batch) {
      logServerError("route:/api/admin/imports:batch", new Error("Falha ao criar lote."));
      return adminJsonError("Não foi possível criar o lote.", 500);
    }

    return adminJsonRedirect(`/admin/vagas/importar?batch=${batch.id}&step=mapear`, {
      batchId: batch.id,
      retryOf: existing?.status === "FAILED" ? existing.id : null
    });
  } catch (error) {
    logServerError("route:/api/admin/imports", error);
    return adminJsonError("Não foi possível analisar o arquivo.", 500);
  } finally {
    await connection.close();
  }
};
