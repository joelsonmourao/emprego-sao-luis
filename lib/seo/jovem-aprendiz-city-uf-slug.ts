import { BR_UF_CODES } from "@/lib/seo/br-uf";

/** Slugs de cidade que não podem ser confundidos com rotas aninhadas em `/vagas/jovem-aprendiz/...`. */
export const JOVEM_APRENDIZ_CITY_UF_RESERVED_SLUGS = new Set([
  "categoria",
  "estado",
  "cidade",
  "empresa",
  "blog",
  "indisponivel",
  "jovem-aprendiz"
]);

/**
 * URL compacta tipo Glassdoor (sem copiar marca): `/vagas/jovem-aprendiz/{citySlug}-{uf}`.
 * Ex.: `sao-luis-ma`, `fortaleza-ce`.
 */
export function buildJovemAprendizCityUfPath(citySlug: string, stateCode: string) {
  const uf = stateCode.trim().toLowerCase();
  return `/vagas/jovem-aprendiz/${citySlug.trim()}-${uf}`;
}

/**
 * Interpreta o segmento dinâmico `sao-luis-ma` → cidade `sao-luis`, UF `MA`.
 * Exige sufixo `-` + duas letras e UF brasileira válida; cidade não vazia.
 */
export function parseJovemAprendizCityUfSegment(segment: string): { citySlug: string; uf: string } | null {
  const raw = segment?.trim().toLowerCase();
  if (!raw || !raw.includes("-")) return null;

  const lastHyphen = raw.lastIndexOf("-");
  if (lastHyphen <= 0) return null;

  const citySlug = raw.slice(0, lastHyphen);
  const uf = raw.slice(lastHyphen + 1);

  if (!citySlug || uf.length !== 2) return null;
  const upper = uf.toUpperCase();
  if (!BR_UF_CODES.has(upper)) return null;
  if (JOVEM_APRENDIZ_CITY_UF_RESERVED_SLUGS.has(citySlug)) return null;

  return { citySlug, uf: upper };
}
