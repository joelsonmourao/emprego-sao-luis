import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  isTruthyFlag,
  shouldRunCommercialPlansSeed,
  shouldRunRbacSeed,
  validateAdminBootstrapEnv
} from "./migrate-flags";

const read = (relativePath: string) => readFileSync(resolve(relativePath), "utf8");

describe("migrate flags", () => {
  it("interpreta flags booleanas como true somente quando literal true", () => {
    expect(isTruthyFlag("true")).toBe(true);
    expect(isTruthyFlag("TRUE")).toBe(true);
    expect(isTruthyFlag(" false ")).toBe(false);
    expect(isTruthyFlag("1")).toBe(false);
    expect(isTruthyFlag(undefined)).toBe(false);
  });

  it("detecta quando seeds devem rodar", () => {
    expect(shouldRunRbacSeed({ RUN_SEED_RBAC: "true" })).toBe(true);
    expect(shouldRunRbacSeed({ RUN_SEED_RBAC: "false" })).toBe(false);
    expect(shouldRunCommercialPlansSeed({ RUN_SEED_COMMERCIAL_PLANS: "true" })).toBe(true);
    expect(shouldRunCommercialPlansSeed({})).toBe(false);
  });

  it("falha quando RUN_SEED_RBAC exige dados do administrador", () => {
    expect(validateAdminBootstrapEnv({})).toContain("ADMIN_INITIAL_EMAIL");
    expect(validateAdminBootstrapEnv({
      ADMIN_INITIAL_EMAIL: "admin@example.com",
      ADMIN_INITIAL_NAME: "Admin",
      ADMIN_INITIAL_PASSWORD: ""
    })).toContain("ADMIN_INITIAL_PASSWORD");
    expect(validateAdminBootstrapEnv({
      ADMIN_INITIAL_EMAIL: "admin@example.com",
      ADMIN_INITIAL_NAME: "Administrador",
      ADMIN_INITIAL_PASSWORD: "senha-segura-14"
    })).toBeNull();
  });
});

describe("migrate entrypoint", () => {
  const entrypoint = read("scripts/migrate-entrypoint.sh");

  it("executa migrations sempre e seeds apenas com flags", () => {
    expect(entrypoint).toContain("npm run db:migrate --workspace=@es/db");
    expect(entrypoint).toContain('[ "${RUN_SEED_RBAC:-}" = "true" ]');
    expect(entrypoint).toContain('[ "${RUN_SEED_COMMERCIAL_PLANS:-}" = "true" ]');
    expect(entrypoint).toContain("npm run db:seed-rbac --workspace=@es/db");
    expect(entrypoint).toContain("npm run db:seed-commercial-plans --workspace=@es/db");
  });

  it("valida administrador antes do seed RBAC e não imprime valor da senha", () => {
    expect(entrypoint).toContain("ADMIN_INITIAL_EMAIL");
    expect(entrypoint).toContain("ADMIN_INITIAL_NAME");
    expect(entrypoint).toContain("ADMIN_INITIAL_PASSWORD");
    expect(entrypoint).not.toMatch(/echo\s+.*\$\{ADMIN_INITIAL_PASSWORD/);
    expect(entrypoint).not.toMatch(/printf\s+.*\$\{ADMIN_INITIAL_PASSWORD/);
  });

  it("encerra o container após a execução", () => {
    expect(entrypoint).toContain("Encerrando container");
    expect(entrypoint).not.toContain("while true");
    expect(entrypoint).not.toContain("tail -f");
  });

  it("Dockerfile.migrate usa o entrypoint", () => {
    const dockerfile = read("Dockerfile.migrate");
    expect(dockerfile).toContain("scripts/migrate-entrypoint.sh");
    expect(dockerfile).toContain('CMD ["sh", "scripts/migrate-entrypoint.sh"]');
  });
});

describe("seed idempotency", () => {
  it("RBAC não duplica papéis, permissões nem administrador", () => {
    const seed = read("packages/db/scripts/seed-rbac.ts");
    expect(seed).toContain("onConflictDoNothing");
    expect(seed).toContain("Administrador já existente");
    expect(seed).toContain("Administrador criado");
    expect(seed).not.toMatch(/stdout\.write\([^)]*password/i);
    expect(seed).not.toMatch(/console\.log\([^)]*password/i);
    expect(seed).toContain("SEED_RBAC_REQUIRE_ADMIN");
    expect(seed).toContain("validateAdminBootstrapEnv");
  });

  it("planos comerciais não recriam slugs existentes", () => {
    const seed = read("packages/db/scripts/seed-commercial-plans.ts");
    expect(seed).toContain("where(eq(commercialPlans.slug, plan.slug))");
    expect(seed).toContain("já existente(s)");
    expect(seed).toContain("export async function seedCommercialPlans");
  });
});
