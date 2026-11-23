import type { APIRoute } from "astro";
import { can } from "../../../../../lib/auth";
import { createPlan, duplicatePlan, listPlansAdmin, reorderPlans } from "../../../../../lib/commercial/plans-service";

export const GET: APIRoute = async ({ url, locals }) => {
  if (!locals.auth || !can(locals.auth, "commercial.manage")) return Response.json({ ok: false }, { status: 403 });
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "20");
  const activeParam = url.searchParams.get("active");
  const archivedParam = url.searchParams.get("archived");
  const active = activeParam === "true" ? true : activeParam === "false" ? false : undefined;
  const archived = archivedParam === "true" ? true : archivedParam === "false" ? false : undefined;
  const data = await listPlansAdmin({
    page,
    pageSize,
    ...(q ? { q } : {}),
    ...(active !== undefined ? { active } : {}),
    ...(archived !== undefined ? { archived } : {})
  });
  return Response.json({ ok: true, ...data });
};

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.auth || !can(locals.auth, "commercial.manage")) return Response.json({ ok: false }, { status: 403 });
  const body = await request.json();
  const action = body.action as string | undefined;
  if (action === "reorder" && Array.isArray(body.ids)) {
    await reorderPlans(body.ids, locals.auth.id);
    return Response.json({ ok: true });
  }
  if (action === "duplicate" && body.id) {
    const plan = await duplicatePlan(body.id, locals.auth.id);
    return Response.json({ ok: true, plan });
  }
  const plan = await createPlan({
    name: String(body.name ?? ""),
    shortDescription: String(body.shortDescription ?? ""),
    description: String(body.description ?? ""),
    price: String(body.price ?? "0"),
    promoPrice: body.promoPrice ? String(body.promoPrice) : null,
    jobCredits: Number(body.jobCredits ?? 1),
    durationDays: Number(body.durationDays ?? 30),
    highlightDays: Number(body.highlightDays ?? 0),
    publishStories: Boolean(body.publishStories),
    publishFeed: Boolean(body.publishFeed),
    publishSite: body.publishSite !== false,
    postsCount: Number(body.postsCount ?? 0),
    billingType: String(body.billingType ?? "one_time"),
    creditValidityDays: Number(body.creditValidityDays ?? 365),
    active: Boolean(body.active),
    setupRequired: body.setupRequired !== false,
    recommended: Boolean(body.recommended),
    sortOrder: Number(body.sortOrder ?? 0),
    benefits: Array.isArray(body.benefits) ? body.benefits.map(String) : [],
    limitations: Array.isArray(body.limitations) ? body.limitations.map(String) : [],
    ...(body.slug ? { slug: String(body.slug) } : {}),
    ...(body.fullDescriptionHtml ? { fullDescriptionHtml: String(body.fullDescriptionHtml) } : {}),
    ...(body.rules ? { rules: String(body.rules) } : {})
  }, locals.auth.id);
  return Response.json({ ok: true, plan });
};
