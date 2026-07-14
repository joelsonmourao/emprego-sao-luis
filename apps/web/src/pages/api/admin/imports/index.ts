import { createHash } from "node:crypto";
import type { APIRoute } from "astro";
import { importModeSchema, suggestImportMapping } from "@es/shared";
import { createDatabase, importBatches } from "@es/db";
import { eq } from "drizzle-orm";
import { can } from "../../../../lib/auth";
import { adminJsonError, adminJsonRedirect, adminMethodNotAllowed } from "../../../../lib/admin-api-response";
import { logServerError } from "../../../../lib/server-error";
import { getImportStorageInfo, putImportFile } from "../../../../lib/import-storage";
import * as XLSX from "xlsx";

const MAX_BYTES = 20 * 1024 * 1024;

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
    return adminJsonError("Arquivo ou modo inválido.", 400, { details: ["Envie um arquivo XLSX/CSV e selecione o destino."] });
  }

  if (file.size === 0) {
    return adminJsonError("Arquivo vazio.", 400, { details: ["A planilha não contém dados."] });
  }
  if (file.size > MAX_BYTES) {
    return adminJsonError("Arquivo muito grande.", 400, { details: ["O limite é 20 MB."] });
  }
  if (!/\.(xlsx|csv)$/i.test(file.name)) {
    return adminJsonError("Extensão não suportada.", 400, { details: ["Use arquivos .xlsx ou .csv."] });
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
    const fileHash = createHash("sha256").update(bytes).digest("hex");
    const storageKey = `imports/${fileHash}/${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

    const [existing] = await connection.db.select().from(importBatches).where(eq(importBatches.fileHash, fileHash)).limit(1);
    if (existing) {
      return adminJsonRedirect(`/admin/vagas/importar?batch=${existing.id}&reused=1`);
    }

    let workbook: XLSX.WorkBook;
    try {
      workbook = XLSX.read(bytes, { type: "array", cellDates: true });
    } catch (error) {
      logServerError("route:/api/admin/imports:parse", error);
      return adminJsonError("Arquivo corrompido ou ilegível.", 400, { details: ["Não foi possível ler a planilha."] });
    }

    const sheets = workbook.SheetNames.map((name) => {
      const sheet = workbook.Sheets[name];
      const rows = sheet ? XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "", raw: false }) : [];
      const headers = rows[0] ? Object.keys(rows[0]) : [];
      return { name, headers, preview: rows.slice(0, 5) };
    });

    if (!sheets.length || sheets.every((sheet) => sheet.headers.length === 0)) {
      return adminJsonError("Planilha sem cabeçalhos.", 400, { details: ["Inclua cabeçalhos e ao menos uma linha de dados."] });
    }

    try {
      await putImportFile(storageKey, bytes, file.type || "application/octet-stream");
    } catch (error) {
      logServerError("route:/api/admin/imports:storage", error);
      return adminJsonError("Não foi possível armazenar o arquivo.", 503, { code: "STORAGE_UNAVAILABLE" });
    }

    const first = sheets[0]!;
    const [batch] = await connection.db
      .insert(importBatches)
      .values({
        fileHash,
        fileName: file.name,
        settings: {
          stage: "CONFIGURE",
          storageKey,
          mode: mode.data,
          sheets,
          sheetName: first.name,
          mapping: suggestImportMapping(first.headers),
          duplicateStrategy: "IGNORE"
        },
        createdBy: auth.id
      })
      .returning();

    if (!batch) {
      logServerError("route:/api/admin/imports:batch", new Error("Falha ao criar lote."));
      return adminJsonError("Não foi possível criar o lote.", 500);
    }

    return adminJsonRedirect(`/admin/vagas/importar?batch=${batch.id}&step=mapear`);
  } catch (error) {
    logServerError("route:/api/admin/imports", error);
    return adminJsonError("Não foi possível analisar o arquivo.", 500);
  } finally {
    await connection.close();
  }
};
