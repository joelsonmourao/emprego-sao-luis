import type { APIRoute } from "astro";
import { can } from "../../../../../lib/auth";
import { listCreditsAdmin } from "../../../../../lib/commercial/credits-service";

export const GET: APIRoute = async ({ url, locals }) => {
  if (!locals.auth || !can(locals.auth, "commercial.manage")) return Response.json({ ok: false }, { status: 403 });
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const data = await listCreditsAdmin({
    page,
    ...(q ? { q } : {})
  });
  return Response.json({ ok: true, ...data });
};
