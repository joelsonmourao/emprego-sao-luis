export type PaymentInitInput = {
  orderCode: string;
  amount: number;
  description: string;
  returnUrl: string;
  webhookUrl: string;
};

export type PaymentInitResult =
  | { status: "redirect"; checkoutUrl: string; externalId: string | null }
  | { status: "unavailable"; message: string }
  | { status: "error"; message: string };

export type PaymentWebhookResult =
  | { status: "approved"; orderCode: string; externalId: string }
  | { status: "refused"; orderCode: string; externalId: string }
  | { status: "pending"; orderCode: string; externalId: string }
  | { status: "ignored" }
  | { status: "error" };

export interface PaymentGateway {
  provider: string;
  initiate(input: PaymentInitInput): Promise<PaymentInitResult>;
  handleWebhook(payload: unknown): Promise<PaymentWebhookResult>;
}
