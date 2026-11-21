import type { APIRoute } from "astro";
import { can } from "../../../../lib/auth";
import { getBrandIdentity, listBrandHistory, updateBrandPalette } from "../../../../lib/brand/identity-service";

export const GET: APIRoute = async ({ locals, url }) => {
  if (!locals.auth || !can(locals.auth, "settings.brand.view")) {
    return Response.json({ ok: false, error: "Sem permissão." }, { status: 403 });
  }
  const identity = await getBrandIdentity(true);
  const history = url.searchParams.get("history") === "1"
    ? await listBrandHistory(undefined, 30)
    : undefined;
  return Response.json({ ok: true, identity, history });
};

export const PUT: APIRoute = async ({ request, locals }) => {
  if (!locals.auth || !can(locals.auth, "settings.brand.manage")) {
    return Response.json({ ok: false, error: "Sem permissão." }, { status: 403 });
  }
  const body = await request.json();
  const result = await updateBrandPalette({
    siteName: body.siteName ? String(body.siteName) : undefined,
    tagline: body.tagline ? String(body.tagline) : undefined,
    logoAlt: body.logoAlt ? String(body.logoAlt) : undefined,
    useSameLogoEverywhere: body.useSameLogoEverywhere !== undefined ? Boolean(body.useSameLogoEverywhere) : undefined,
    ...(body.palette && typeof body.palette === "object" ? body.palette : {})
  }, locals.auth.id);
  const identity = await getBrandIdentity(true);
  return Response.json({ ok: true, identity, warnings: result.warnings });
};
