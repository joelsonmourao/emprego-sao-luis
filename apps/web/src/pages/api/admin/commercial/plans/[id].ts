import type { APIRoute } from "astro";
import { can } from "../../../../../lib/auth";
import { archivePlan, getPlanById, updatePlan, type PlanInput } from "../../../../../lib/commercial/plans-service";

export const GET: APIRoute = async ({ params, locals }) => {
  if (!locals.auth || !can(locals.auth, "commercial.manage")) return Response.json({ ok: false }, { status: 403 });
  const plan = await getPlanById(params.id!);
  if (!plan) return Response.json({ ok: false }, { status: 404 });
  return Response.json({ ok: true, plan });
};

export const PUT: APIRoute = async ({ params, request, locals }) => {
  if (!locals.auth || !can(locals.auth, "commercial.manage")) return Response.json({ ok: false }, { status: 403 });
  const body = await request.json();
  const patch: Record<string, unknown> = {};
  if (body.name) patch.name = String(body.name);
  if (body.slug) patch.slug = String(body.slug);
  if (body.shortDescription !== undefined) patch.shortDescription = String(body.shortDescription);
  if (body.description) patch.description = String(body.description);
  if (body.fullDescriptionHtml !== undefined) patch.fullDescriptionHtml = String(body.fullDescriptionHtml);
  if (body.price !== undefined) patch.price = String(body.price);
  if (body.promoPrice !== undefined) patch.promoPrice = body.promoPrice ? String(body.promoPrice) : null;
  if (body.jobCredits !== undefined) patch.jobCredits = Number(body.jobCredits);
  if (body.durationDays !== undefined) patch.durationDays = Number(body.durationDays);
  if (body.highlightDays !== undefined) patch.highlightDays = Number(body.highlightDays);
  if (body.publishStories !== undefined) patch.publishStories = Boolean(body.publishStories);
  if (body.publishFeed !== undefined) patch.publishFeed = Boolean(body.publishFeed);
  if (body.publishSite !== undefined) patch.publishSite = Boolean(body.publishSite);
  if (body.postsCount !== undefined) patch.postsCount = Number(body.postsCount);
  if (body.billingType) patch.billingType = String(body.billingType);
  if (body.creditValidityDays !== undefined) patch.creditValidityDays = Number(body.creditValidityDays);
  if (body.active !== undefined) patch.active = Boolean(body.active);
  if (body.setupRequired !== undefined) patch.setupRequired = Boolean(body.setupRequired);
  if (body.recommended !== undefined) patch.recommended = Boolean(body.recommended);
  if (body.sortOrder !== undefined) patch.sortOrder = Number(body.sortOrder);
  if (Array.isArray(body.benefits)) patch.benefits = body.benefits.map(String);
  if (Array.isArray(body.limitations)) patch.limitations = body.limitations.map(String);
  if (body.rules !== undefined) patch.rules = String(body.rules);
  if (body.archived !== undefined) patch.archived = Boolean(body.archived);
  const plan = await updatePlan(params.id!, patch as Partial<PlanInput>, locals.auth.id);
  return Response.json({ ok: true, plan });
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  if (!locals.auth || !can(locals.auth, "commercial.manage")) return Response.json({ ok: false }, { status: 403 });
  await archivePlan(params.id!, locals.auth.id);
  return Response.json({ ok: true });
};
