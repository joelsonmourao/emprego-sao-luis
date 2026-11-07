import type { APIRoute } from "astro";
import { can } from "../../../lib/auth";
import { getAdsenseReadiness } from "../../../lib/adsense-readiness";
export const GET: APIRoute = async ({ locals, url }) => {
  if (!locals.auth || !can(locals.auth, "seo.manage")) return new Response("Não autorizado.", { status: 403 });
  const report = await getAdsenseReadiness(new URL(process.env.SITE_URL ?? url.origin));
  return Response.json(report, { headers: { "cache-control": "no-store" } });
};

