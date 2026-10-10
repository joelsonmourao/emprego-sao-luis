import type { APIRoute } from "astro";
import { adminGlobalSearch } from "../../../lib/admin-search";

export const GET: APIRoute = async ({ url, locals }) => {
  if (!locals.auth) return Response.json({ ok: false, results: [] }, { status: 403 });
  const q = url.searchParams.get("q") ?? "";
  if (!q.trim()) return Response.json({ ok: true, results: [] });
  const results = await adminGlobalSearch(q);
  return Response.json({ ok: true, results });
};
