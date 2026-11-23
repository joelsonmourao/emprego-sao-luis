import type { APIRoute } from "astro";
import { adCreatives, articles, auditLogs, brandAssets, companies, createDatabase, mediaAssets } from "@es/db";
import { deleteStorageObject, getStorageObject, putStorageObject, StorageError } from "@es/storage";
import { count, eq } from "drizzle-orm";
import { z } from "zod";
import { adminJsonError, adminJsonRedirect } from "../../../../lib/admin-api-response";
import { can } from "../../../../lib/auth";
import { logServerError } from "../../../../lib/server-error";

const actionSchema = z.enum(["UPDATE_ALT", "DELETE"]);

async function countUsage(connection: ReturnType<typeof createDatabase>, id: string, url: string) {
  const [article, company, creative, brand] = await Promise.all([
    connection.db.select({ value: count() }).from(articles).where(eq(articles.coverImageUrl, url)),
    connection.db.select({ value: count() }).from(companies).where(eq(companies.logoUrl, url)),
    connection.db.select({ value: count() }).from(adCreatives).where(eq(adCreatives.imageUrl, url)),
    connection.db.select({ value: count() }).from(brandAssets).where(eq(brandAssets.mediaId, id))
  ]);
  return (article[0]?.value ?? 0) + (company[0]?.value ?? 0) + (creative[0]?.value ?? 0) + (brand[0]?.value ?? 0);
}

export const POST: APIRoute = async ({ params, request, locals }) => {
  const auth = locals.auth;
  if (!auth || !can(auth, "media.manage")) return adminJsonError("Sem permissão para alterar mídia.", 403);
  if (!params.id || !process.env.DATABASE_URL) return adminJsonError("Mídia ou banco inválido.", 400);

  const form = await request.formData();
  const action = actionSchema.safeParse(form.get("action"));
  if (!action.success) return adminJsonError("Ação de mídia inválida.", 422);

  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [asset] = await connection.db.select().from(mediaAssets).where(eq(mediaAssets.id, params.id)).limit(1);
    if (!asset) return adminJsonError("Mídia não encontrada.", 404);

    if (action.data === "UPDATE_ALT") {
      const altText = String(form.get("altText") ?? "").trim();
      if (!altText || altText.length > 240) return adminJsonError("Texto alternativo inválido.", 422);
      const [updated] = await connection.db.update(mediaAssets).set({ altText, updatedAt: new Date() }).where(eq(mediaAssets.id, asset.id)).returning();
      await connection.db.insert(auditLogs).values({
        actorId: auth.id,
        action: "UPDATE_ALT",
        entityType: "MEDIA",
        entityId: asset.id,
        before: { altText: asset.altText },
        after: { altText },
        origin: "ADMIN"
      });
      return adminJsonRedirect("/admin/midia?updated=1", { asset: updated });
    }

    const usage = await countUsage(connection, asset.id, asset.url);
    if (usage > 0) {
      return adminJsonError(`A imagem está em uso em ${usage} local(is) e não pode ser excluída.`, 409, {
        code: "MEDIA_IN_USE",
        usage
      });
    }

    let backup: Uint8Array;
    try {
      backup = await getStorageObject(asset.storageKey);
      await deleteStorageObject(asset.storageKey);
    } catch (error) {
      const code = error instanceof StorageError ? error.code : "STORAGE_NOT_WRITABLE";
      return adminJsonError("Não foi possível remover o arquivo armazenado.", 503, { code });
    }

    try {
      await connection.db.transaction(async (tx) => {
        await tx.delete(mediaAssets).where(eq(mediaAssets.id, asset.id));
        await tx.insert(auditLogs).values({
          actorId: auth.id,
          action: "DELETE",
          entityType: "MEDIA",
          entityId: asset.id,
          before: asset,
          origin: "ADMIN"
        });
      });
    } catch (error) {
      await putStorageObject(asset.storageKey, backup, asset.mimeType).catch(() => undefined);
      throw error;
    }
    return adminJsonRedirect("/admin/midia?deleted=1");
  } catch (error) {
    logServerError("route:/api/admin/media/:id", error, { route: `/api/admin/media/${params.id}`, userId: auth.id });
    return adminJsonError("Não foi possível alterar a mídia.", 500);
  } finally {
    await connection.close();
  }
};
