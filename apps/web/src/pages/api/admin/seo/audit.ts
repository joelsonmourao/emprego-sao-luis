import type { APIRoute } from "astro";
import { can } from "../../../../lib/auth";
import { ignoreSeoIssue, listSeoIssues, resolveSeoIssue, runSeoAudit } from "../../../../lib/seo-audit";

export const GET: APIRoute = async ({ url, locals }) => {
  if (!locals.auth || !can(locals.auth, "seo.manage")) return Response.json({ ok: false }, { status: 403 });
  const severity = url.searchParams.get("severity") ?? undefined;
  const resolved = url.searchParams.get("resolved");
  const resolvedFilter = resolved === "true" ? true : resolved === "false" ? false : undefined;
  const issues = await listSeoIssues({
    ...(severity ? { severity } : {}),
    ...(resolvedFilter !== undefined ? { resolved: resolvedFilter } : {})
  });
  return Response.json({ ok: true, issues });
};

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.auth || !can(locals.auth, "seo.manage")) return Response.json({ ok: false }, { status: 403 });
  const body = await request.json();
  const action = String(body.action ?? "run");
  if (action === "run") {
    const limit = Number(body.limit ?? 50);
    const result = await runSeoAudit(limit);
    return Response.json({ ok: true, ...result });
  }
  if (action === "resolve" && body.id) {
    await resolveSeoIssue(String(body.id));
    return Response.json({ ok: true });
  }
  if (action === "ignore" && body.id) {
    await ignoreSeoIssue(String(body.id), String(body.reason ?? "Ignorado pelo admin"));
    return Response.json({ ok: true });
  }
  return Response.json({ ok: false }, { status: 400 });
};
