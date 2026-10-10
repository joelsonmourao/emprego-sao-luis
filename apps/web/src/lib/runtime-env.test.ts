import { afterEach, describe, expect, it } from "vitest";
import { getAppEnv, isPublicProductionEnvironment, isStagingLikeEnvironment } from "./runtime-env";

const keys = ["APP_ENV", "NODE_ENV", "FORCE_NOINDEX", "STAGING_NOINDEX"] as const;
const previous = Object.fromEntries(keys.map((key) => [key, process.env[key]]));

afterEach(() => {
  for (const key of keys) {
    const value = previous[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

describe("runtime-env staging gates", () => {
  it("detecta staging e e2e como não indexáveis", () => {
    process.env.APP_ENV = "staging";
    delete process.env.FORCE_NOINDEX;
    expect(isStagingLikeEnvironment()).toBe(true);
    expect(isPublicProductionEnvironment()).toBe(false);

    process.env.APP_ENV = "e2e";
    expect(isStagingLikeEnvironment()).toBe(true);
  });

  it("respeita FORCE_NOINDEX mesmo em production", () => {
    process.env.APP_ENV = "production";
    process.env.FORCE_NOINDEX = "true";
    expect(isStagingLikeEnvironment()).toBe(true);
    expect(isPublicProductionEnvironment()).toBe(false);
  });

  it("produção sem flag permanece indexável no sentido de ambiente", () => {
    process.env.APP_ENV = "production";
    delete process.env.FORCE_NOINDEX;
    delete process.env.STAGING_NOINDEX;
    expect(getAppEnv()).toBe("production");
    expect(isStagingLikeEnvironment()).toBe(false);
    expect(isPublicProductionEnvironment()).toBe(true);
  });
});
