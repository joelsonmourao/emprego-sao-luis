/**
 * Coordenadas aproximadas de municípios (fonte local, sem API em tempo de request).
 * Chave de busca: cidade normalizada (sem acento, minúsculas) + UF.
 */

export type MunicipioCoordenada = {
  city: string;
  uf: string;
  latitude: number;
  longitude: number;
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

/** Nome completo do estado (sem acento, minúsculas) → UF */
const STATE_NAME_TO_UF: Record<string, string> = {
  acre: "AC",
  alagoas: "AL",
  amapa: "AP",
  amazonas: "AM",
  bahia: "BA",
  ceara: "CE",
  "distrito federal": "DF",
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

/** Base local: cidade como referência humana; busca usa normalização. */
export const MUNICIPIOS_COORDENADAS: MunicipioCoordenada[] = [
  { city: "Araruama", uf: "RJ", latitude: -22.883333, longitude: -42.333332 },
  { city: "São Luís", uf: "MA", latitude: -2.5297, longitude: -44.3028 },
  { city: "Fortaleza", uf: "CE", latitude: -3.7319, longitude: -38.5267 },
  { city: "São Paulo", uf: "SP", latitude: -23.55052, longitude: -46.633308 },
  { city: "Teresina", uf: "PI", latitude: -5.0892, longitude: -42.8016 },
  { city: "Recife", uf: "PE", latitude: -8.0476, longitude: -34.877 },
  { city: "João Pessoa", uf: "PB", latitude: -7.1195, longitude: -34.845 },
  { city: "Natal", uf: "RN", latitude: -5.7945, longitude: -35.211 },
  { city: "Nova Santa Rita", uf: "RS", latitude: -29.8568, longitude: -51.2763 },
  { city: "Porto Alegre", uf: "RS", latitude: -30.0346, longitude: -51.2177 },
  { city: "Rio de Janeiro", uf: "RJ", latitude: -22.9068, longitude: -43.1729 },
  { city: "Salvador", uf: "BA", latitude: -12.9777, longitude: -38.5016 },
  { city: "Belo Horizonte", uf: "MG", latitude: -19.9167, longitude: -43.9345 },
  { city: "Curitiba", uf: "PR", latitude: -25.429, longitude: -49.2671 },
  { city: "Belém", uf: "PA", latitude: -1.4558, longitude: -48.4902 },
  { city: "Manaus", uf: "AM", latitude: -3.119, longitude: -60.0217 },
  { city: "Goiânia", uf: "GO", latitude: -16.6869, longitude: -49.2648 },
  { city: "Brasília", uf: "DF", latitude: -15.7939, longitude: -47.8828 }
];

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/** Chave estável para cidade (sem acento, minúsculas, sem pontuação extra). */
export function normalizeCityKey(city: string) {
  return normalizeText(city).replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function buildLookup() {
  const map = new Map<string, { latitude: number; longitude: number }>();
  for (const row of MUNICIPIOS_COORDENADAS) {
    const key = `${normalizeCityKey(row.city)}|${row.uf.trim().toUpperCase()}`;
    map.set(key, { latitude: row.latitude, longitude: row.longitude });
  }
  return map;
}

const LOOKUP = buildLookup();

/**
 * Converte nome completo do estado ou UF em sigla de 2 letras, quando reconhecível.
 */
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

/**
 * Usa `stateCode` (ex.: RJ) e, se necessário, `stateName` (ex.: Rio de Janeiro).
 */
export function resolveBrazilUfFromJobState(stateCode: string, stateName: string): string | null {
  return resolveBrazilUfString(stateCode) ?? resolveBrazilUfString(stateName);
}

/**
 * Retorna latitude/longitude quando a cidade e a UF existem na base local; caso contrário `null`.
 * `uf` pode ser sigla (RJ) ou nome completo do estado (Rio de Janeiro).
 */
export function getGeoCoordinatesByCityState(city: string, uf: string): { latitude: number; longitude: number } | null {
  const cityTrim = city?.trim();
  if (!cityTrim) return null;

  const ufResolved = resolveBrazilUfString(uf);
  if (!ufResolved) return null;

  return LOOKUP.get(`${normalizeCityKey(cityTrim)}|${ufResolved}`) ?? null;
}
