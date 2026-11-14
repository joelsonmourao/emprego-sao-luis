import { listPublicPlans } from "./plans-service";
import { getCommercialContactUrl } from "./payment-settings";
import { isPaymentAvailable } from "../payments/gateway";
import { logServerError } from "../server-error";

export type PublicPlan = Awaited<ReturnType<typeof listPublicPlans>>[number];

export type PublicationPageState = {
  plans: PublicPlan[];
  paymentAvailable: boolean;
  commercialContactUrl: string | null;
  degraded: boolean;
};

type Dependencies = {
  listPlans: () => Promise<PublicPlan[] | null>;
  paymentAvailable: () => Promise<boolean>;
  contactUrl: () => Promise<string | null>;
};

const defaultDependencies: Dependencies = {
  listPlans: listPublicPlans,
  paymentAvailable: isPaymentAvailable,
  contactUrl: getCommercialContactUrl
};

export function isPurchasablePlan(plan: PublicPlan): boolean {
  const price = Number(plan.promoPrice ?? plan.price);
  return plan.active && !plan.archived && !plan.setupRequired && Number.isFinite(price) && price > 0;
}

export async function loadPublicationPageState(
  dependencies: Dependencies = defaultDependencies
): Promise<PublicationPageState> {
  const state: PublicationPageState = {
    plans: [],
    paymentAvailable: false,
    commercialContactUrl: null,
    degraded: false
  };

  const [plans, payment, contact] = await Promise.allSettled([
    dependencies.listPlans(),
    dependencies.paymentAvailable(),
    dependencies.contactUrl()
  ]);

  if (plans.status === "fulfilled") {
    state.plans = (plans.value ?? []).filter(isPurchasablePlan);
  } else {
    state.degraded = true;
    logServerError("route:/publicar-vaga:plans", plans.reason);
  }

  if (payment.status === "fulfilled") {
    state.paymentAvailable = payment.value;
  } else {
    state.degraded = true;
    logServerError("route:/publicar-vaga:payment", payment.reason);
  }

  if (contact.status === "fulfilled") {
    state.commercialContactUrl = contact.value;
  } else {
    state.degraded = true;
    logServerError("route:/publicar-vaga:contact", contact.reason);
  }

  return state;
}
