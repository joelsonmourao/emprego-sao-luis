import { describe, expect, it, vi } from "vitest";
import {
  isPurchasablePlan,
  loadPublicationPageState,
  type PublicPlan
} from "./publication-page-state";

const plan = (overrides: Partial<PublicPlan> = {}) => ({
  id: "plan-1",
  name: "Plano real",
  slug: "plano-real",
  price: "99.90",
  promoPrice: null,
  active: true,
  archived: false,
  setupRequired: false,
  sortOrder: 1,
  ...overrides
}) as PublicPlan;

const dependencies = (plans: PublicPlan[] | null, paymentAvailable = false, contactUrl: string | null = null) => ({
  listPlans: vi.fn().mockResolvedValue(plans),
  paymentAvailable: vi.fn().mockResolvedValue(paymentAvailable),
  contactUrl: vi.fn().mockResolvedValue(contactUrl)
});

describe("estado de /publicar-vaga", () => {
  it("trata banco sem planos e consulta retornando null", async () => {
    await expect(loadPublicationPageState(dependencies([]))).resolves.toMatchObject({ plans: [], degraded: false });
    await expect(loadPublicationPageState(dependencies(null))).resolves.toMatchObject({ plans: [], degraded: false });
  });

  it("ignora planos desativados, arquivados, em setup e sem preço válido", async () => {
    const state = await loadPublicationPageState(dependencies([
      plan({ active: false }),
      plan({ archived: true }),
      plan({ setupRequired: true }),
      plan({ price: "0" }),
      plan({ price: "invalido" })
    ]));
    expect(state.plans).toEqual([]);
  });

  it("lista plano ativo, configurado e com preço válido", async () => {
    const valid = plan();
    const state = await loadPublicationPageState(dependencies([valid], true, "/contato"));
    expect(state).toMatchObject({ plans: [valid], paymentAvailable: true, commercialContactUrl: "/contato" });
    expect(isPurchasablePlan(valid)).toBe(true);
  });

  it("mantém estado seguro sem gateway, Pix manual ou contato", async () => {
    await expect(loadPublicationPageState(dependencies([plan()], false, null))).resolves.toMatchObject({
      paymentAvailable: false,
      commercialContactUrl: null,
      degraded: false
    });
  });

  it("não propaga falhas inesperadas das consultas para a rota", async () => {
    const state = await loadPublicationPageState({
      listPlans: vi.fn().mockRejectedValue(new Error("database password=segredo")),
      paymentAvailable: vi.fn().mockRejectedValue(new Error("payment unavailable")),
      contactUrl: vi.fn().mockRejectedValue(new Error("contact unavailable"))
    });
    expect(state).toEqual({ plans: [], paymentAvailable: false, commercialContactUrl: null, degraded: true });
  });
});
