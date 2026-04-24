/**
 * Fonte pública (faixas de CEP por município) usada para cobertura nacional.
 * Mantemos fallback local para cenários sem rede.
 */
const CEP_DATASET_URL = "https://gist.githubusercontent.com/tamnil/792a6a66f6df9fc028041587cfca0c3d/raw/ceps.csv";

/** Fallback mínimo local por cidade (`UF:citySlug`). */
const CITY_POSTAL_OVERRIDES: Record<string, string> = {
  "SP:franca": "14401-360",
  "SP:sao-paulo": "01310-100",
  "SP:sao-jose-dos-campos": "12210-000",
  "SP:campinas": "13010-111",
  "MA:sao-luis": "65010-440",
  "MA:imperatriz": "65900-000",
  "CE:fortaleza": "60025-061"
};

export type ReferencePostalInput = {
  stateCode: string;
  citySlug: string;
};

let postalMapPromise: Promise<Map<string, string>> | null = null;

function normalizeCitySlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatCep(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 8) return null;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

function parseMunicipalityPostalMap(csv: string) {
  const map = new Map<string, string>();
  const lines = csv.split(/\r?\n/);
  for (let index = 1; index < lines.length; index += 1) {
    const line = lines[index]?.trim();
    if (!line) continue;
    const [ufRaw, cityRaw, cepFromRaw] = line.split(",");
    const uf = ufRaw?.trim().toUpperCase();
    const city = cityRaw?.trim();
    const cep = formatCep(String(cepFromRaw ?? ""));
    if (!uf || !city || !cep) continue;
    const key = `${uf}:${normalizeCitySlug(city)}`;
    if (!map.has(key)) {
      map.set(key, cep);
    }
  }
  return map;
}

async function getNationalMunicipalityPostalMap() {
  if (!postalMapPromise) {
    postalMapPromise = fetch(CEP_DATASET_URL, { next: { revalidate: 60 * 60 * 24 } })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Falha ao baixar base de CEPs: ${response.status}`);
        }
        const csv = await response.text();
        return parseMunicipalityPostalMap(csv);
      })
      .catch(() => {
        // Mantém funcionamento mesmo sem rede/CDN.
        return new Map<string, string>();
      });
  }
  return postalMapPromise;
}

export async function getReferencePostalCodeForCity(input: ReferencePostalInput): Promise<string | null> {
  const uf = input.stateCode.trim().toUpperCase();
  const slug = normalizeCitySlug(input.citySlug);
  const nationalMap = await getNationalMunicipalityPostalMap();
  const fromDataset = nationalMap.get(`${uf}:${slug}`);
  if (fromDataset) return fromDataset;
  const override = CITY_POSTAL_OVERRIDES[`${uf}:${slug}`];
  return override ?? null;
}
