type Coordinates = { latitude: number; longitude: number };

const CITY_COORDINATES: Record<string, Coordinates> = {
  "fortaleza|CE": { latitude: -3.7319, longitude: -38.5267 },
  "sao luis|MA": { latitude: -2.5297, longitude: -44.3028 },
  "teresina|PI": { latitude: -5.0892, longitude: -42.8016 },
  "recife|PE": { latitude: -8.0476, longitude: -34.877 },
  "joao pessoa|PB": { latitude: -7.1195, longitude: -34.845 },
  "natal|RN": { latitude: -5.7945, longitude: -35.211 },
  "nova santa rita|RS": { latitude: -29.8568, longitude: -51.2763 },
  "porto alegre|RS": { latitude: -30.0346, longitude: -51.2177 },
  "sao paulo|SP": { latitude: -23.5505, longitude: -46.6333 },
  "rio de janeiro|RJ": { latitude: -22.9068, longitude: -43.1729 },
  "salvador|BA": { latitude: -12.9777, longitude: -38.5016 },
  "belo horizonte|MG": { latitude: -19.9167, longitude: -43.9345 },
  "curitiba|PR": { latitude: -25.429, longitude: -49.2671 },
  "belem|PA": { latitude: -1.4558, longitude: -48.4902 },
  "manaus|AM": { latitude: -3.119, longitude: -60.0217 },
  "goiania|GO": { latitude: -16.6869, longitude: -49.2648 },
  "brasilia|DF": { latitude: -15.7939, longitude: -47.8828 }
};

function normalizeCityName(city: string) {
  return city
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeUf(uf: string) {
  return uf.trim().toUpperCase();
}

export function getCityCoordinates(city: string | null | undefined, uf: string | null | undefined) {
  if (!city || !uf) return null;
  const key = `${normalizeCityName(city)}|${normalizeUf(uf)}`;
  return CITY_COORDINATES[key] ?? null;
}
