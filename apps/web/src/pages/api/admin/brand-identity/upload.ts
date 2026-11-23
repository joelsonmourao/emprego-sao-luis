import type { APIRoute } from "astro";
import { can } from "../../../../lib/auth";
import { BRAND_ASSET_KEYS, type BrandAssetKey } from "../../../../lib/brand/constants";
import { removeBrandAsset, restoreBrandAssetFromHistory, uploadBrandAsset } from "../../../../lib/brand/identity-service";

const validKeys = new Set(Object.values(BRAND_ASSET_KEYS));

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.auth || !can(locals.auth, "settings.brand.manage") || !can(locals.auth, "media.upload")) {
    return Response.json({ ok: false, error: "Sem permissão." }, { status: 403 });
  }
  const form = await request.formData();
  const key = String(form.get("key") ?? "") as BrandAssetKey;
  const file = form.get("file");
  if (!validKeys.has(key) || !(file instanceof File)) {
    return Response.json({ ok: false, error: "Campo ou arquivo inválido." }, { status: 400 });
  }
  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const asset = await uploadBrandAsset({
      key,
      bytes,
      filename: file.name,
      declaredMime: file.type,
      trimTransparent: form.get("trimTransparent") === "true",
      actorId: locals.auth.id,
      ...(String(form.get("altText") ?? "").trim() ? { altText: String(form.get("altText")).trim() } : {})
    });
    return Response.json({ ok: true, asset });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha no upload.";
    return Response.json({ ok: false, error: message }, { status: 400 });
  }
};

export const DELETE: APIRoute = async ({ request, locals }) => {
  if (!locals.auth || !can(locals.auth, "settings.brand.manage") || !can(locals.auth, "media.delete")) {
    return Response.json({ ok: false, error: "Sem permissão." }, { status: 403 });
  }
  const body = await request.json();
  const key = String(body.key ?? "") as BrandAssetKey;
  if (!validKeys.has(key)) return Response.json({ ok: false, error: "Campo inválido." }, { status: 400 });
  await removeBrandAsset(key, locals.auth.id);
  return Response.json({ ok: true });
};

export const PATCH: APIRoute = async ({ request, locals }) => {
  if (!locals.auth || !can(locals.auth, "settings.brand.manage") || !can(locals.auth, "media.restore")) {
    return Response.json({ ok: false, error: "Sem permissão." }, { status: 403 });
  }
  const body = await request.json();
  if (!body.historyId) return Response.json({ ok: false, error: "historyId obrigatório." }, { status: 400 });
  try {
    await restoreBrandAssetFromHistory(String(body.historyId), locals.auth.id);
    return Response.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha na restauração.";
    return Response.json({ ok: false, error: message }, { status: 400 });
  }
};
