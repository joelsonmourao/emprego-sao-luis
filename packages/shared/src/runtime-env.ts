/**
 * Ambiente de runtime compartilhado (web + worker).
 * Staging e pré-produção nunca devem ser indexáveis nem disparar Indexing/IndexNow.
 */
export function getAppEnv(): string {
  return (process.env.APP_ENV ?? process.env.NODE_ENV ?? "development").trim().toLowerCase();
}

/** Homologação, preview, e2e ou flag explícita — nunca indexar. */
export function isStagingLikeEnvironment(): boolean {
  if (process.env.FORCE_NOINDEX === "true" || process.env.STAGING_NOINDEX === "true") return true;
  const env = getAppEnv();
  return ["staging", "homolog", "homologacao", "preview", "e2e"].includes(env);
}

export function isPublicProductionEnvironment(): boolean {
  return getAppEnv() === "production" && !isStagingLikeEnvironment();
}

export function stagingRobotsDirective(): "noindex, nofollow" {
  return "noindex, nofollow";
}
