import type { APIRoute } from "astro";
import { getEditorialPortalMode } from "../../lib/portal-modes";

export const GET: APIRoute = async ({ url, redirect }) => {
  const portal = await getEditorialPortalMode();
  if (portal.enabled) return redirect("/quadro-pausado", 302);
  const code = url.searchParams.get("code")?.toUpperCase();
  return redirect(code && /^ES-\d{6}$/.test(code) ? `/i/${code}` : "/instagram", 302);
};
