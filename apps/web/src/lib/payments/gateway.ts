import type { PaymentGateway, PaymentInitResult, PaymentWebhookResult } from "./types";
import { isManualPixEnabled } from "../commercial/payment-settings";

export function getConfiguredGateway(): PaymentGateway | null {
  const provider = process.env.PAYMENT_PROVIDER?.trim();
  if (!provider || provider === "none") return null;
  if (provider === "manual" && process.env.PAYMENT_MANUAL_ENABLED === "true") {
    return {
      provider: "manual",
      async initiate() {
        return { status: "unavailable" as const, message: "Pagamento manual: aguarde contato do comercial." };
      },
      async handleWebhook() {
        return { status: "ignored" as const };
      }
    };
  }
  if (provider === "mercadopago" && process.env.MERCADOPAGO_ACCESS_TOKEN) {
    return createMercadoPagoGateway();
  }
  return null;
}

function createMercadoPagoGateway(): PaymentGateway {
  return {
    provider: "mercadopago",
    async initiate(input): Promise<PaymentInitResult> {
      const token = process.env.MERCADOPAGO_ACCESS_TOKEN!;
      const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ title: input.description, quantity: 1, unit_price: input.amount }],
          external_reference: input.orderCode,
          notification_url: input.webhookUrl,
          back_urls: { success: input.returnUrl, failure: input.returnUrl, pending: input.returnUrl },
          auto_return: "approved"
        })
      });
      if (!response.ok) return { status: "error", message: "Gateway indisponível no momento." };
      const data = (await response.json()) as { id?: string; init_point?: string };
      if (!data.init_point) return { status: "error", message: "Resposta inválida do gateway." };
      return { status: "redirect", checkoutUrl: data.init_point, externalId: data.id ?? null };
    },
    async handleWebhook(payload): Promise<PaymentWebhookResult> {
      const topic = String((payload as { type?: string }).type ?? "");
      if (topic !== "payment") return { status: "ignored" };
      const paymentId = String((payload as { data?: { id?: string } }).data?.id ?? "");
      if (!paymentId) return { status: "ignored" };
      const token = process.env.MERCADOPAGO_ACCESS_TOKEN!;
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) return { status: "error" };
      const payment = (await response.json()) as { status?: string; external_reference?: string };
      const approved = payment.status === "approved";
      return {
        status: approved ? "approved" : payment.status === "rejected" ? "refused" : "pending",
        orderCode: payment.external_reference ?? "",
        externalId: paymentId
      };
    }
  };
}

export async function isPaymentAvailable(): Promise<boolean> {
  if (getConfiguredGateway() !== null) return true;
  return isManualPixEnabled();
}
