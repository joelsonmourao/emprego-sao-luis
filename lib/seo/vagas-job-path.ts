/** Primeiro segmento após `/vagas/` em URLs de listagem ou rotas reservadas (não é slug de vaga). */
export const JOB_DETAIL_PATH_RESERVED_FIRST_SEGMENTS = new Set(["estado", "cidade", "empresa", "indisponivel"]);

/**
 * Se `pathname` for página pública de detalhe de vaga (`/vagas/{slug}` com um único segmento),
 * retorna o slug da vaga; caso contrário `null`.
 */
export function getPublicJobSlugFromPathname(pathname: string | null): string | null {
  if (!pathname || pathname === "/vagas") return null;
  if (!pathname.startsWith("/vagas/")) return null;
  const rest = pathname.slice("/vagas/".length);
  const first = rest.split("/")[0]?.trim();
  if (!first || JOB_DETAIL_PATH_RESERVED_FIRST_SEGMENTS.has(first)) return null;
  if (rest.includes("/")) return null;
  return first;
}
