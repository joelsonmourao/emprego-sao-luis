export function isTruthyFlag(value: string | undefined): boolean {
  return value?.trim().toLowerCase() === "true";
}

export type AdminBootstrapEnv = {
  ADMIN_INITIAL_EMAIL?: string;
  ADMIN_INITIAL_NAME?: string;
  ADMIN_INITIAL_PASSWORD?: string;
};

export function validateAdminBootstrapEnv(env: AdminBootstrapEnv): string | null {
  const missing: string[] = [];
  if (!env.ADMIN_INITIAL_EMAIL?.trim()) missing.push("ADMIN_INITIAL_EMAIL");
  if (!env.ADMIN_INITIAL_NAME?.trim()) missing.push("ADMIN_INITIAL_NAME");
  if (!env.ADMIN_INITIAL_PASSWORD?.trim()) missing.push("ADMIN_INITIAL_PASSWORD");
  if (missing.length) {
    return `RUN_SEED_RBAC=true exige: ${missing.join(", ")}.`;
  }
  return null;
}

export function shouldRunRbacSeed(env: Record<string, string | undefined>): boolean {
  return isTruthyFlag(env.RUN_SEED_RBAC);
}

export function shouldRunCommercialPlansSeed(env: Record<string, string | undefined>): boolean {
  return isTruthyFlag(env.RUN_SEED_COMMERCIAL_PLANS);
}
