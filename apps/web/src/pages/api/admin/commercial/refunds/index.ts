import type { APIRoute } from "astro";
import { can } from "../../../../../lib/auth";
import { listRefundsAdmin, requestRefund } from "../../../../../lib/commercial/credits-service";

export const GET: APIRoute = async ({ locals }) => {
  if (!locals.auth || !can(locals.auth, "commercial.manage")) return Response.json({ ok: false }, { status: 403 });
  const items = await listRefundsAdmin();
  return Response.json({ ok: true, items });
};

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.auth || !can(locals.auth, "commercial.manage")) return Response.json({ ok: false }, { status: 403 });
  const body = await request.json();
  try {
    const refund = await requestRefund({
      paymentId: String(body.paymentId ?? ""),
      orderId: String(body.orderId ?? ""),
      amount: String(body.amount ?? "0"),
      reason: String(body.reason ?? ""),
      partial: Boolean(body.partial),
      actorId: locals.auth.id
    });
    return Response.json({ ok: true, refund });
  } catch (e) {
    return Response.json({ ok: false, error: e instanceof Error ? e.message : "Erro ao solicitar reembolso." }, { status: 400 });
  }
};
