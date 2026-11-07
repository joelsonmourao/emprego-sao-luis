import type { APIRoute } from "astro";
import { can } from "../../../../../../lib/auth";
import { approvePaymentManual, rejectPaymentManual } from "../../../../../../lib/commercial/payments-service";

export const POST: APIRoute = async ({ params, request, locals }) => {
  if (!locals.auth || !can(locals.auth, "payments.approve")) return Response.json({ ok: false, error: "Sem permissão." }, { status: 403 });
  const body = await request.json();
  const action = String(body.action ?? "");
  if (action === "approve") {
    if (!body.confirm || !body.reason || !body.confirmedAmount) {
      return Response.json({ ok: false, error: "Confirmação, motivo e valor são obrigatórios." }, { status: 400 });
    }
    await approvePaymentManual(params.id!, {
      actorId: locals.auth.id,
      reason: String(body.reason),
      confirmedAmount: String(body.confirmedAmount),
      method: String(body.method ?? "manual")
    });
    return Response.json({ ok: true });
  }
  if (action === "reject") {
    await rejectPaymentManual(params.id!, { actorId: locals.auth.id, reason: String(body.reason ?? "Reprovado") });
    return Response.json({ ok: true });
  }
  return Response.json({ ok: false }, { status: 400 });
};
