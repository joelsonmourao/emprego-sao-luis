/**
 * Coordenadas de municípios brasileiros (base local GeoNames cities1000 + admin1, gerada por
 * `node scripts/generate-municipios-geonames.mjs`). Sem API em tempo de request.
 */

import municipiosExtrasJson from "@/lib/geo/data/municipios-coordenadas-extras.json";
import municipiosJson from "@/lib/geo/data/municipios-coordenadas.json";

export type MunicipioCoordenada = {
  city: string;
  uf: string;
  latitude: number;
  longitude: number;
  ibge?: string;
  /** Apenas em `municipios-coordenadas-extras.json` (documentação humana). */
  note?: string;
};

const BR_UF = new Set([
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO"
]);

const STATE_NAME_TO_UF: Record<string, string> = {
  acre: "AC",
  alagoas: "AL",
  amapa: "AP",
  amazonas: "AM",
  bahia: "BA",
  ceara: "CE",
  "distrito federal": "DF",
  "federal district": "DF",
  "espirito santo": "ES",
  goias: "GO",
  maranhao: "MA",
  "mato grosso": "MT",
  "mato grosso do sul": "MS",
  "minas gerais": "MG",
  para: "PA",
  paraiba: "PB",
  parana: "PR",
  pernambuco: "PE",
  piaui: "PI",
  "rio de janeiro": "RJ",
  "rio grande do norte": "RN",
  "rio grande do sul": "RS",
  rondonia: "RO",
  roraima: "RR",
  "santa catarina": "SC",
  "sao paulo": "SP",
  sergipe: "SE",
  tocantins: "TO"
};

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/** Chave estável: cidade normalizada + UF em minúsculas (ex.: `sao paulo|sp`). */
export function normalizeCityKey(city: string) {
  return normalizeText(city)
    .replace(/[''`´]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Chave composta para índice (cidade + "|" + UF). */
export function normalizeGeoKey(city: string, uf: string): string | null {
  const u = resolveBrazilUfString(uf);
  if (!u) return null;
  const ck = normalizeCityKey(city);
  if (!ck) return null;
  return `${ck}|${u.toLowerCase()}`;
}

function buildGeoLookup() {
  const map = new Map<string, { latitude: number; longitude: number }>();
  const rows = municipiosJson as MunicipioCoordenada[];
  for (const row of rows) {
    const key = normalizeGeoKey(row.city, row.uf);
    if (!key) continue;
    map.set(key, { latitude: row.latitude, longitude: row.longitude });
  }
  const extras = municipiosExtrasJson as MunicipioCoordenada[];
  for (const row of extras) {
    const key = normalizeGeoKey(row.city, row.uf);
    if (!key) continue;
    map.set(key, { latitude: row.latitude, longitude: row.longitude });
  }
  return map;
}

const GEO_BY_CITY_UF = buildGeoLookup();

export function getMunicipiosGeoCount() {
  return GEO_BY_CITY_UF.size;
}

export function resolveBrazilUfString(stateInput: string): string | null {
  const raw = stateInput?.trim();
  if (!raw) return null;

  if (/^[a-z]{2}$/i.test(raw)) {
    const uf = raw.toUpperCase();
    return BR_UF.has(uf) ? uf : null;
  }

  const key = normalizeText(raw);
  return STATE_NAME_TO_UF[key] ?? null;
}

export function resolveBrazilUfFromJobState(stateCode: string, stateName: string): string | null {
  return resolveBrazilUfString(stateCode) ?? resolveBrazilUfString(stateName);
}

/**
 * Retorna latitude/longitude quando cidade e UF batem na base local; caso contrário `null`.
 * `uf` pode ser sigla (RJ) ou nome do estado (Rio de Janeiro).
 */
export function getGeoCoordinatesByCityState(city: string, uf: string): { latitude: number; longitude: number } | null {
  const cityTrim = city?.trim();
  if (!cityTrim) return null;

  const key = normalizeGeoKey(cityTrim, uf);
  if (!key) return null;

  return GEO_BY_CITY_UF.get(key) ?? null;
}
