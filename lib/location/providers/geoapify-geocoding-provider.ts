import type { LocationEnrichmentProvider, LocationProviderPlace } from "@/lib/location/providers/types";

type GeoapifyRank = {
  confidence?: number;
  confidence_city_level?: number;
  confidence_street_level?: number;
  confidence_building_level?: number;
  match_type?: string;
};

type GeoapifyResult = {
  place_id?: string;
  name?: string;
  formatted?: string;
  address_line1?: string;
  housenumber?: string;
  street?: string;
  city?: string;
  state?: string;
  state_code?: string;
  postcode?: string;
  country_code?: string;
  lat?: number;
  lon?: number;
  result_type?: string;
  rank?: GeoapifyRank;
};

type GeoapifySearchResponse = {
  results?: GeoapifyResult[];
};

function buildStreetAddress(result: GeoapifyResult) {
  const line1 = result.address_line1?.trim();
  if (line1) return line1;

  const street = result.street?.trim();
  const number = result.housenumber?.trim();
  if (street && number) return `${street}, ${number}`;
  return street ?? number ?? null;
}

function normalizeStateCode(value: string | undefined | null) {
  return value?.trim().toUpperCase() ?? "";
}

function normalizeCityKey(value: string | undefined | null) {
  return value
    ?.trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase() ?? "";
}

function mapResult(result: GeoapifyResult): LocationProviderPlace | null {
  const providerPlaceId = result.place_id?.trim();
  const displayName = (result.name ?? result.formatted ?? "").trim();
  if (!providerPlaceId || !displayName) return null;

  const latitude = typeof result.lat === "number" && Number.isFinite(result.lat) ? result.lat : null;
  const longitude = typeof result.lon === "number" && Number.isFinite(result.lon) ? result.lon : null;

  return {
    providerPlaceId,
    displayName,
    formattedAddress: result.formatted?.trim() ?? displayName,
    streetAddress: buildStreetAddress(result),
    postalCode: result.postcode?.trim() || null,
    city: result.city?.trim() || null,
    state: normalizeStateCode(result.state_code || result.state),
    latitude,
    longitude,
    types: result.result_type ? [result.result_type] : [],
    rankConfidence: result.rank?.confidence ?? null,
    rankConfidenceCityLevel: result.rank?.confidence_city_level ?? null,
    rankConfidenceStreetLevel: result.rank?.confidence_street_level ?? null,
    rankMatchType: result.rank?.match_type ?? null
  };
}

function scoreCandidate(
  place: LocationProviderPlace,
  context: { city: string; state: string }
) {
  const cityKey = normalizeCityKey(context.city);
  const stateKey = context.state.trim().toUpperCase();
  const placeCity = normalizeCityKey(place.city);
  const placeState = normalizeStateCode(place.state);

  let score = place.rankConfidence ?? 0.45;

  if (place.rankConfidenceCityLevel != null) {
    score = score * 0.6 + place.rankConfidenceCityLevel * 0.4;
  }

  if (placeCity && (placeCity === cityKey || placeCity.includes(cityKey) || cityKey.includes(placeCity))) {
    score += 0.15;
  } else if ((place.rankConfidenceCityLevel ?? 0) >= 0.7) {
    score += 0.08;
  } else {
    score -= 0.2;
  }

  if (placeState && placeState === stateKey) {
    score += 0.12;
  } else {
    score -= 0.15;
  }

  if (place.streetAddress?.trim()) score += 0.08;
  if (place.postalCode?.trim()) score += 0.04;
  if (place.latitude != null && place.longitude != null) score += 0.05;

  const usefulTypes = new Set(["amenity", "building", "street", "suburb", "district"]);
  if (place.types.some((t) => usefulTypes.has(t))) {
    score += 0.06;
  }

  const weakTypes = new Set(["country", "state", "city", "county", "unknown"]);
  if (place.types.length && place.types.every((t) => weakTypes.has(t))) {
    score -= 0.25;
  }

  const matchType = place.rankMatchType ?? "";
  if (matchType === "full_match" || matchType === "match_by_building" || matchType === "match_by_street") {
    score += 0.05;
  }

  return Math.min(1, Math.max(0, score));
}

export function createGeoapifyGeocodingProvider(): LocationEnrichmentProvider {
  return {
    id: "geoapify",

    async searchBranch(query, context) {
      const apiKey = process.env.GEOAPIFY_API_KEY?.trim();
      if (!apiKey) {
        console.warn("[location-enrichment] GEOAPIFY_API_KEY ausente; API de localização indisponível.");
        return null;
      }

      const url = new URL("https://api.geoapify.com/v1/geocode/search");
      url.searchParams.set("text", query);
      url.searchParams.set("format", "json");
      url.searchParams.set("limit", "5");
      url.searchParams.set("lang", "pt");
      url.searchParams.set("filter", "countrycode:br");
      url.searchParams.set("bias", "countrycode:br");
      url.searchParams.set("apiKey", apiKey);

      try {
        const response = await fetch(url.toString(), {
          method: "GET",
          signal: AbortSignal.timeout(12_000)
        });

        if (!response.ok) {
          console.warn("[location-enrichment] Geoapify respondeu com erro:", response.status, await response.text());
          return null;
        }

        const data = (await response.json()) as GeoapifySearchResponse;
        const candidates = (data.results ?? [])
          .filter((row) => row.country_code?.trim().toLowerCase() === "br")
          .map(mapResult)
          .filter((p): p is LocationProviderPlace => Boolean(p));

        if (!candidates.length) return null;

        const scored = candidates
          .map((place) => ({ place, score: scoreCandidate(place, context) }))
          .sort((a, b) => b.score - a.score);

        const best = scored[0];
        if (!best || best.score < 0.72) return null;

        const minGeoapifyConfidence = 0.55;
        if ((best.place.rankConfidence ?? 0) < minGeoapifyConfidence) return null;
        if ((best.place.rankConfidenceCityLevel ?? 0) < 0.5) return null;

        return best.place;
      } catch (error) {
        console.warn("[location-enrichment] Falha ao consultar Geoapify:", error);
        return null;
      }
    }
  };
}
