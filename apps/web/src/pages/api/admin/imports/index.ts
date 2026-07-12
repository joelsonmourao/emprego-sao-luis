import { createHash } from "node:crypto";
import type { APIRoute } from "astro";
import { importModeSchema } from "@es/shared";
import { createDatabase, importBatches } from "@es/db";
import { eq } from "drizzle-orm";
import { can } from "../../../../lib/auth";
import { createImportQueue } from "../../../../lib/queue";
import { putPrivateObject } from "../../../../lib/storage";

const MAX_BYTES = 20 * 1024 * 1024;
export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const auth = locals.auth!; if (!can(auth, "imports.manage")) return Response.json({ ok: false, error: "Proibido." }, { status: 403 });
  const form = await request.formData(); const file = form.get("file"); const mode = importModeSchema.safeParse(form.get("mode"));
  if (!(file instanceof File) || !mode.success) return Response.json({ ok: false, error: "Arquivo ou modo inválido." }, { status: 400 });
  if (file.size === 0 || file.size > MAX_BYTES || !/\.(xlsx|csv)$/i.test(file.name)) return Response.json({ ok: false, error: "Envie XLSX/CSV de até 20 MB." }, { status: 400 });
  if (!process.env.DATABASE_URL) return Response.json({ ok: false, error: "Banco indisponível." }, { status: 503 });
  const bytes = new Uint8Array(await file.arrayBuffer()); const fileHash = createHash("sha256").update(bytes).digest("hex"); const storageKey = `imports/${fileHash}/${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [existing] = await connection.db.select().from(importBatches).where(eq(importBatches.fileHash, fileHash)).limit(1);
    if (existing) return redirect(`/admin/importacao?batch=${existing.id}&reused=1`, 303);
    await putPrivateObject(storageKey, bytes, file.type || "application/octet-stream");
    const [batch] = await connection.db.insert(importBatches).values({ fileHash, fileName: file.name, settings: { storageKey, mode: mode.data }, createdBy: auth.id }).returning();
    if (!batch) throw new Error("Falha ao criar lote.");
    const queue = createImportQueue(); try { await queue.add("process-job-file", { batchId: batch.id, storageKey, mode: mode.data }, { jobId: batch.id, attempts: 5, backoff: { type: "exponential", delay: 5000 }, removeOnComplete: 1000, removeOnFail: 5000 }); } finally { await queue.close(); }
    return redirect(`/admin/importacao?batch=${batch.id}`, 303);
  } finally { await connection.close(); }
};
