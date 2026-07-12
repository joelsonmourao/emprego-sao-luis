import type { APIRoute } from "astro";
import { approveOrderAndGrantCredits } from "../../../lib/commercial";
import { getConfiguredGateway } from "../../../lib/payments/gateway";

export const POST: APIRoute = async ({ request }) => {
  const gateway = getConfiguredGateway();
  if (!gateway) return new Response("Gateway não configurado", { status: 503 });
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    payload = Object.fromEntries(await request.formData());
  }
  const result = await gateway.handleWebhook(payload);
  if (result.status === "approved" && result.orderCode) {
    await approveOrderAndGrantCredits(result.orderCode, result.externalId);
    return new Response("OK", { status: 200 });
  }
  if (result.status === "refused" && result.orderCode) {
    return new Response("Refused", { status: 200 });
  }
  return new Response("Ignored", { status: 200 });
};
