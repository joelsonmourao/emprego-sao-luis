const CANONICAL_ORIGINS = new Set([
  "https://empregossaoluis.com.br",
  "https://www.empregossaoluis.com.br"
]);

export const JSON_AUTH_API_PATHS = new Set([
  "/api/admin/login",
  "/api/auth/admin-password/request",
  "/api/auth/admin-password/reset"
]);

export function isJsonAuthApiPath(pathname: string): boolean {
  return JSON_AUTH_API_PATHS.has(pathname);
}

export function isTrustedApiOrigin(origin: string | null, requestOrigin: string): boolean {
  if (!origin) return true;
  if (origin === requestOrigin) return true;
  return CANONICAL_ORIGINS.has(origin) && CANONICAL_ORIGINS.has(requestOrigin);
}
