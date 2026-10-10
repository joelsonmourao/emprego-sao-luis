import type { APIRoute } from "astro";
import { can } from "../../../../../lib/auth";
import { addOrderNote, cancelOrder, getOrderDetail } from "../../../../../lib/commercial/orders-service";

export const GET: APIRoute = async ({ params, locals }) => {
  if (!locals.auth || !can(locals.auth, "commercial.manage")) return Response.json({ ok: false }, { status: 403 });
  const detail = await getOrderDetail(params.code!);
  if (!detail) return Response.json({ ok: false, error: "Pedido não encontrado." }, { status: 404 });
  return Response.json({ ok: true, ...detail });
};

export const POST: APIRoute = async ({ params, request, locals }) => {
  if (!locals.auth || !can(locals.auth, "commercial.manage")) return Response.json({ ok: false }, { status: 403 });
  const body = await request.json();
  const action = String(body.action ?? "");
  if (action === "cancel") {
    const reason = String(body.reason ?? "").trim();
    if (!reason) return Response.json({ ok: false, error: "Motivo obrigatório." }, { status: 400 });
    try {
      await cancelOrder(params.code!, reason, locals.auth.id);
      return Response.json({ ok: true });
    } catch (e) {
      return Response.json({ ok: false, error: e instanceof Error ? e.message : "Erro ao cancelar." }, { status: 400 });
    }
  }
  if (action === "note") {
    const note = String(body.note ?? "").trim();
    if (!note) return Response.json({ ok: false, error: "Nota obrigatória." }, { status: 400 });
    try {
      await addOrderNote(params.code!, note, locals.auth.id);
      return Response.json({ ok: true });
    } catch (e) {
      return Response.json({ ok: false, error: e instanceof Error ? e.message : "Erro ao salvar nota." }, { status: 400 });
    }
  }
  return Response.json({ ok: false }, { status: 400 });
};
