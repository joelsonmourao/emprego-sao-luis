import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  BLOCKING_STATUSES,
  PAID_STATUSES,
  PAYMENT_STATUSES,
  appendTimeline,
  slugify
} from "./commercial/constants";
import { paymentSettingsSchema } from "./commercial/payment-settings";
import { seoScoreFromIssues } from "./seo-audit";

describe("commercial constants", () => {
  it("slugify normaliza nomes de plano", () => {
    expect(slugify("Vaga Destacada")).toBe("vaga-destacada");
    expect(slugify("Site + Instagram")).toBe("site-instagram");
    expect(slugify("  Pacote   de   Vagas  ")).toBe("pacote-de-vagas");
    expect(slugify("São Luís — Empresa")).toBe("sao-luis-empresa");
  });

  it("define status de pagamento e bloqueio", () => {
    expect(PAYMENT_STATUSES).toContain("MANUAL_REVIEW");
    expect(PAYMENT_STATUSES).toContain("PAID");
    expect(BLOCKING_STATUSES).toContain("PENDING");
    expect(BLOCKING_STATUSES).toContain("MANUAL_REVIEW");
    expect(PAID_STATUSES).toEqual(["PAID"]);
  });

  it("appendTimeline adiciona entrada com timestamp", () => {
    const timeline = appendTimeline([], { type: "ORDER_CREATED" });
    expect(timeline).toHaveLength(1);
    expect(timeline[0]).toMatchObject({ type: "ORDER_CREATED" });
    expect(timeline[0]).toHaveProperty("at");
    const extended = appendTimeline(timeline, { type: "PAYMENT_PAID", paymentId: "pay-1" });
    expect(extended).toHaveLength(2);
    expect(extended[1]).toMatchObject({ type: "PAYMENT_PAID", paymentId: "pay-1" });
  });
});

describe("commercial payment settings", () => {
  it("valida schema de PIX manual", () => {
    const parsed = paymentSettingsSchema.parse({
      manualPixEnabled: true,
      manualPixKey: "email@empresa.com",
      manualPixHolder: "Empregos SL",
      manualPixInstructions: "Envie comprovante."
    });
    expect(parsed.manualPixEnabled).toBe(true);
    expect(parsed.mercadoPagoEnabled).toBe(false);
  });
});

describe("commercial grantCreditsOnce idempotency", () => {
  it("verifica créditos existentes antes de inserir", () => {
    const source = readFileSync(resolve("apps/web/src/lib/commercial/payments-service.ts"), "utf8");
    expect(source).toContain("from(companyCredits).where(eq(companyCredits.orderId, orderId))");
    expect(source).toContain("if ((existing?.value ?? 0) > 0) return");
    expect(source).toContain("if (!order || order.status !== \"PAID\") return");
  });
});

describe("commercial payment status transitions", () => {
  it("transiciona pedido para PAID ou MANUAL_REVIEW", () => {
    const source = readFileSync(resolve("apps/web/src/lib/commercial/payments-service.ts"), "utf8");
    expect(source).toContain('status === "PAID"');
    expect(source).toContain('status: "PAID"');
    expect(source).toContain('status === "MANUAL_REVIEW"');
    expect(source).toContain('status: "MANUAL_REVIEW"');
    expect(source).toContain('status === "FAILED"');
    expect(source).toContain("PAYMENT_STATUS_${status}");
  });

  it("submitManualProof define MANUAL_REVIEW no pedido", () => {
    const source = readFileSync(resolve("apps/web/src/lib/commercial/payments-service.ts"), "utf8");
    expect(source).toContain('status: "MANUAL_REVIEW"');
    expect(source).toContain('method: "pix_manual"');
    expect(source).toContain("MANUAL_PROOF_SUBMITTED");
  });
});

describe("commercial manual approval validation", () => {
  it("exige valor confirmado igual ao pagamento", () => {
    const source = readFileSync(resolve("apps/web/src/lib/commercial/payments-service.ts"), "utf8");
    expect(source).toContain('if (payment.status === "PAID") throw new Error("Pagamento já aprovado.")');
    expect(source).toContain("Valor confirmado não confere com o pedido");
    expect(source).toContain("Number(payment.amount) !== Number(input.confirmedAmount)");
  });

  it("API admin exige confirmação, motivo e valor", () => {
    const api = readFileSync(resolve("apps/web/src/pages/api/admin/commercial/payments/[id]/action.ts"), "utf8");
    expect(api).toContain("!body.confirm || !body.reason || !body.confirmedAmount");
    expect(api).toContain("approvePaymentManual");
  });
});

describe("commercial seed idempotency", () => {
  it("seed não recria planos com slug existente", () => {
    const seed = readFileSync(resolve("packages/db/scripts/seed-commercial-plans.ts"), "utf8");
    expect(seed).toContain("where(eq(commercialPlans.slug, plan.slug))");
    expect(seed).toContain("if (existing) continue");
    expect(seed).toContain('"vaga-individual"');
    expect(seed).toContain('"site-instagram"');
  });
});

describe("commercial canonical host", () => {
  it("redireciona www para domínio canônico sem www", () => {
    const mw = readFileSync(resolve("apps/web/src/middleware.ts"), "utf8");
    expect(mw).toContain('host === `www.${CANONICAL_HOST}`');
    expect(mw).toContain("target.hostname = CANONICAL_HOST");
    expect(mw).toContain("301");
  });
});

describe("commercial isPaymentAvailable", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    delete process.env.PAYMENT_PROVIDER;
    delete process.env.MERCADOPAGO_ACCESS_TOKEN;
    delete process.env.PAYMENT_MANUAL_ENABLED;
    delete process.env.DATABASE_URL;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.resetModules();
  });

  it("retorna true quando gateway Mercado Pago está configurado", async () => {
    process.env.PAYMENT_PROVIDER = "mercadopago";
    process.env.MERCADOPAGO_ACCESS_TOKEN = "test-token";
    const { isPaymentAvailable } = await import("./payments/gateway");
    expect(await isPaymentAvailable()).toBe(true);
  });

  it("retorna true quando PIX manual está habilitado nas settings", async () => {
    vi.doMock("./commercial/payment-settings", () => ({
      isManualPixEnabled: vi.fn().mockResolvedValue(true)
    }));
    const { isPaymentAvailable } = await import("./payments/gateway");
    expect(await isPaymentAvailable()).toBe(true);
  });

  it("retorna false sem gateway nem PIX manual", async () => {
    vi.doMock("./commercial/payment-settings", () => ({
      isManualPixEnabled: vi.fn().mockResolvedValue(false)
    }));
    const { isPaymentAvailable } = await import("./payments/gateway");
    expect(await isPaymentAvailable()).toBe(false);
  });
});

describe("commercial checkout flow", () => {
  it("createCommercialOrder aguarda isPaymentAvailable", () => {
    const lib = readFileSync(resolve("apps/web/src/lib/commercial.ts"), "utf8");
    expect(lib).toContain("await isPaymentAvailable()");
    expect(lib).toContain("getPaymentSettings");
  });

  it("API de pedido redireciona para resumo", () => {
    const api = readFileSync(resolve("apps/web/src/pages/api/commercial/order.ts"), "utf8");
    expect(api).toContain("/publicar-vaga/resumo/");
  });

  it("páginas de checkout cobrem resumo, pagamento e confirmação", () => {
    const resumo = readFileSync(resolve("apps/web/src/pages/publicar-vaga/resumo/[code].astro"), "utf8");
    const pedido = readFileSync(resolve("apps/web/src/pages/publicar-vaga/pedido/[code].astro"), "utf8");
    const confirmacao = readFileSync(resolve("apps/web/src/pages/publicar-vaga/confirmacao/[code].astro"), "utf8");
    expect(resumo).toContain("Resumo do pedido");
    expect(resumo).toContain("Continuar para pagamento");
    expect(pedido).toContain("await isPaymentAvailable()");
    expect(pedido).toContain("getPaymentSettings");
    expect(pedido).toContain("manualPixQrUrl");
    expect(pedido).toContain("/api/commercial/manual-proof");
    expect(pedido).toContain("Pagar com Mercado Pago");
    expect(confirmacao).toContain("Pagamento confirmado");
    expect(confirmacao).toContain("Comprovante recebido");
  });

  it("API manual-proof valida URL do comprovante", () => {
    const api = readFileSync(resolve("apps/web/src/pages/api/commercial/manual-proof.ts"), "utf8");
    expect(api).toContain("proofUrl");
    expect(api).toContain("submitManualProof");
    expect(api).toContain("/publicar-vaga/confirmacao/");
  });

  it("admin dashboard usa countOpenSeoIssues", () => {
    const dash = readFileSync(resolve("apps/web/src/lib/admin-dashboard.ts"), "utf8");
    expect(dash).toContain("countOpenSeoIssues");
    expect(dash).toContain("seoIssues");
    expect(dash).toMatch(/countOpenSeoIssues\(\)/);
  });

  it("refunds-service expõe funções básicas", () => {
    const refunds = readFileSync(resolve("apps/web/src/lib/commercial/refunds-service.ts"), "utf8");
    expect(refunds).toContain("requestRefund");
    expect(refunds).toContain("approveRefund");
    expect(refunds).toContain("rejectRefund");
    expect(refunds).toContain("getRefundById");
  });
});

describe("commercial seo score helper", () => {
  it("calcula penalidade de score a partir de issues", () => {
    expect(seoScoreFromIssues([{ scoreImpact: 15, severity: "critical" }, { scoreImpact: 10, severity: "warning" }])).toBe(75);
    expect(seoScoreFromIssues([])).toBe(100);
    expect(seoScoreFromIssues([{ scoreImpact: 120, severity: "critical" }])).toBe(0);
  });
});
