import { BR_UF_CODES } from "@/lib/seo/br-uf";
import { buildJovemAprendizCityUfPath } from "@/lib/seo/jovem-aprendiz-city-uf-slug";

export type JobSearchFilterGeoState = {
  id: string;
  name: string;
  slug: string;
  code: string;
  cities: Array<{ id: string; name: string; slug: string }>;
};

function normalize(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Termo de busca indica intenção Jovem/Menor Aprendiz. */
export function isApprenticeSearchIntent(query: string) {
  const q = normalize(query);
  if (!q) return false;
  return (
    /\bjovem\s+aprendiz\b/i.test(q) ||
    /\bmenor\s+aprendiz\b/i.test(q) ||
    /\baprendiz\b/i.test(q) ||
    q === "aprendiz"
  );
}

/**
 * Tenta montar `/vagas/jovem-aprendiz/{cidade}-{uf}` a partir de texto livre "Cidade, UF".
 * Retorna `null` se não houver combinação segura.
 */
export function resolveJovemAprendizCleanPath(query: string, location: string, states: JobSearchFilterGeoState[]): string | null {
  const q = query.trim();
  if (q.length > 0 && !isApprenticeSearchIntent(q)) return null;

  const raw = location.trim();
  if (!raw) return null;

  const parts = raw.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length < 2) {
    const only = parts[0] ?? "";
    if (only.length === 2 && BR_UF_CODES.has(only.toUpperCase())) {
      return null;
    }
    const cityName = only;
    const matches: Array<{ citySlug: string; stateCode: string }> = [];
    for (const st of states) {
      const hit = st.cities.find((c) => normalize(c.name) === normalize(cityName));
      if (hit) matches.push({ citySlug: hit.slug, stateCode: st.code });
    }
    if (matches.length === 1) {
      return buildJovemAprendizCityUfPath(matches[0].citySlug, matches[0].stateCode);
    }
    return null;
  }

  const ufToken = parts[parts.length - 1]!;
  const cityTokens = parts.slice(0, -1).join(", ");
  const uf = ufToken.length === 2 && BR_UF_CODES.has(ufToken.toUpperCase()) ? ufToken.toUpperCase() : null;
  if (!uf) return null;

  const state = states.find((s) => s.code === uf);
  if (!state) return null;

  const city = state.cities.find((c) => normalize(c.name) === normalize(cityTokens));
  if (!city) return null;

  return buildJovemAprendizCityUfPath(city.slug, state.code);
}

export function buildVagasQueryFallback(query: string, location: string, states: JobSearchFilterGeoState[]) {
  const params = new URLSearchParams();
  if (query.trim()) params.set("q", query.trim());

  const raw = location.trim();
  if (!raw) return `/vagas?${params.toString()}`;

  const parts = raw.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 2) {
    const ufToken = parts[parts.length - 1]!;
    const cityName = parts.slice(0, -1).join(", ");
    const uf = ufToken.length === 2 && BR_UF_CODES.has(ufToken.toUpperCase()) ? ufToken.toUpperCase() : null;
    if (uf) {
      const state = states.find((s) => s.code === uf);
      const city = state?.cities.find((c) => normalize(c.name) === normalize(cityName));
      if (state && city) {
        params.set("estado", state.slug);
        params.set("cidade", city.slug);
        return `/vagas?${params.toString()}`;
      }
    }
  }

  if (parts.length === 1) {
    const only = parts[0]!;
    if (only.length === 2 && BR_UF_CODES.has(only.toUpperCase())) {
      const st = states.find((s) => s.code === only.toUpperCase());
      if (st) {
        params.set("estado", st.slug);
        return `/vagas?${params.toString()}`;
      }
    }
    for (const st of states) {
      const city = st.cities.find((c) => normalize(c.name) === normalize(only));
      if (city) {
        params.set("estado", st.slug);
        params.set("cidade", city.slug);
        return `/vagas?${params.toString()}`;
      }
    }
  }

  return `/vagas?${params.toString()}`;
}
