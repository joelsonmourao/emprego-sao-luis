import { createHash, randomUUID } from "node:crypto";
import type { APIRoute } from "astro";
import { auditLogs, createDatabase, mediaAssets } from "@es/db";
import { buildStoragePublicUrl, deleteStorageObject, putStorageObject, StorageError } from "@es/storage";
import sharp from "sharp";
import { adminJsonError, adminJsonRedirect, adminMethodNotAllowed } from "../../../lib/admin-api-response";
import { can } from "../../../lib/auth";
import { logServerError } from "../../../lib/server-error";

const MAX_BYTES = 10 * 1024 * 1024;
const extensions: Record<string, string[]> = {
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
  "image/webp": ["webp"],
  "image/gif": ["gif"]
};
const formats: Record<string, string> = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif"
};
const variantSpecs = [
  { key: "hero", width: 1600, height: 900 },
  { key: "card", width: 640, height: 360 },
  { key: "og", width: 1200, height: 630 },
  { key: "square", width: 1200, height: 1200 },
  { key: "landscape43", width: 1200, height: 900 }
] as const;

export const GET: APIRoute = () => adminMethodNotAllowed("POST");

export const POST: APIRoute = async ({ request, locals }) => {
  const auth = locals.auth;
  if (!auth || !can(auth, "media.manage")) return adminJsonError("Sem permissão para enviar mídia.", 403);
  if (!process.env.DATABASE_URL) return adminJsonError("Banco de dados indisponível.", 503);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return adminJsonError("Formulário de upload inválido.", 400);
  }
  const file = form.get("file");
  const altText = String(form.get("altText") ?? "").trim();
  if (!(file instanceof File) || !altText || altText.length > 240) {
    return adminJsonError("Selecione uma imagem e informe o texto alternativo.", 422);
  }
  if (file.size < 1) return adminJsonError("O arquivo está vazio.", 400);
  if (file.size > MAX_BYTES) return adminJsonError("A imagem excede o limite de 10 MB.", 413);

  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  const declaredExtensions = extensions[file.type];
  if (!declaredExtensions || !declaredExtensions.includes(extension)) {
    return adminJsonError("Extensão ou tipo de imagem não suportado.", 415);
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  let image: { width: number; height: number; mimeType: string };
  try {
    const metadata = await sharp(bytes, { animated: true }).metadata();
    const detectedMime = metadata.format ? formats[metadata.format] : undefined;
    if (!metadata.width || !metadata.height || !detectedMime || detectedMime !== file.type) {
      return adminJsonError("O conteúdo do arquivo não corresponde ao tipo informado.", 415);
    }
    image = { width: metadata.width, height: metadata.height, mimeType: detectedMime };
  } catch (error) {
    logServerError("route:/api/admin/media:decode", error);
    return adminJsonError("A imagem está corrompida ou não pode ser lida.", 422);
  }

  const digest = createHash("sha256").update(bytes).digest("hex");
  const canonicalExtension = image.mimeType === "image/jpeg" ? "jpg" : extensions[image.mimeType]![0]!;
  const key = `media/${new Date().toISOString().slice(0, 7)}/${digest.slice(0, 16)}-${randomUUID()}.${canonicalExtension}`;
  const keyWithoutExtension = key.replace(/\.[^.]+$/, "");
  const storedKeys: string[] = [];
  const variants: Record<
    string,
    { url: string; width: number; height: number; mimeType: "image/webp"; storageKey: string }
  > = {};

  try {
    await putStorageObject(key, bytes, image.mimeType);
    storedKeys.push(key);
    for (const spec of variantSpecs) {
      const variantKey = `${keyWithoutExtension}-${spec.key}.webp`;
      const body = await sharp(bytes)
        .rotate()
        .resize(spec.width, spec.height, { fit: "cover", position: "centre" })
        .webp({ quality: 82, effort: 5 })
        .toBuffer();
      await putStorageObject(variantKey, body, "image/webp");
      storedKeys.push(variantKey);
      variants[spec.key] = {
        url: buildStoragePublicUrl(variantKey),
        width: spec.width,
        height: spec.height,
        mimeType: "image/webp",
        storageKey: variantKey
      };
    }
  } catch (error) {
    await Promise.all(storedKeys.map((storedKey) => deleteStorageObject(storedKey).catch(() => undefined)));
    logServerError("route:/api/admin/media:storage", error);
    const code = error instanceof StorageError ? error.code : "STORAGE_NOT_WRITABLE";
    return adminJsonError("O armazenamento local não está disponível.", 503, { code });
  }

  const url = buildStoragePublicUrl(key);
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const asset = await connection.db.transaction(async (tx) => {
      const [created] = await tx
        .insert(mediaAssets)
        .values({
          storageKey: key,
          originalName: file.name,
          mimeType: image.mimeType,
          size: file.size,
          url,
          altText,
          metadata: {
            sha256: digest,
            width: image.width,
            height: image.height,
            original: {
              url,
              width: image.width,
              height: image.height,
              mimeType: image.mimeType,
              storageKey: key
            },
            variants,
            focalPoint: { x: 0.5, y: 0.5 }
          }
        })
        .returning();
      if (!created) throw new Error("Falha ao registrar a mídia.");
      await tx.insert(auditLogs).values({
        actorId: auth.id,
        action: "UPLOAD",
        entityType: "MEDIA",
        entityId: created.id,
        after: {
          ...created,
          metadata: { sha256: digest, width: image.width, height: image.height, variants }
        },
        origin: "ADMIN"
      });
      return created;
    });
    return adminJsonRedirect("/admin/midia?uploaded=1", { asset });
  } catch (error) {
    await Promise.all(storedKeys.map((storedKey) => deleteStorageObject(storedKey).catch(() => undefined)));
    logServerError("route:/api/admin/media:database", error);
    return adminJsonError("Não foi possível registrar a imagem.", 500);
  } finally {
    await connection.close();
  }
};
