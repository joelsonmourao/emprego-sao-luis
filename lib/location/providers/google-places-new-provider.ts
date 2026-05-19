import type { LocationEnrichmentProvider, LocationProviderPlace } from "@/lib/location/providers/types";
import { buildStructuredStreetAddress } from "@/lib/location/street-address-validation";

const GOOGLE_PLACES_TEXT_SEARCH_ENDPOINT = "https://places.googleapis.com/v1/places:searchText";

export const GOOGLE_PLACES_NEW_FIELD_MASK = [
  "places.id",
  "places.displayName.text",
  "places.formattedAddress",
  "places.addressComponents",
  "places.location",
  "places.types",
  "places.businessStatus"
].join(",");

type GoogleAddressComponent = {
  longText?: string;
  shortText?: string;
  types?: string[];
};

type GooglePlace = {
  id?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  addressComponents?: GoogleAddressComponent[];
  location?: { latitude?: number; longitude?: number };
  types?: string[];
  businessStatus?: string;
};

type GooglePlacesSearchResponse = {
  places?: GooglePlace[];
};

function componentValue(components: GoogleAddressComponent[] | undefined, type: string, preferShort = false) {
  const match = components?.find((component) => component.types?.includes(type));
  if (!match) return null;
  const value = preferShort ? match.shortText ?? match.longText : match.longText ?? match.shortText;
  return value?.trim() || null;
}

function normalizeForComparison(value: string | null | undefined) {
  return (value ?? "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function cityMatches(expectedCity: string, placeCity: string | null) {
  const expected = normalizeForComparison(expectedCity);
  const actual = normalizeForComparison(placeCity);
  return Boolean(actual && (actual === expected || actual.includes(expected) || expected.includes(actual)));
}

function companyRelationScore(companyName: string | undefined, displayName: string) {
  const companyTokens = normalizeForComparison(companyName)
    .split(/\s+/)
    .filter((token) => token.length > 2);
  const display = normalizeForComparison(displayName);
  if (!companyTokens.length || !display) return 0;

  const matched = companyTokens.filter((token) => display.includes(token)).length;
  return matched / companyTokens.length;
}

function mapPlace(place: GooglePlace, context: { city: string; state: string; companyName?: string }): LocationProviderPlace | null {
  const providerPlaceId = place.id?.trim();
  const displayName = place.displayName?.text?.trim() ?? "";
  if (!providerPlaceId || !displayName) return null;

  const components = place.addressComponents;
  const route = componentValue(components, "route");
  const streetNumber = componentValue(components, "street_number");
  const city =
    componentValue(components, "locality") ??
    componentValue(components, "administrative_area_level_2") ??
    componentValue(components, "sublocality");
  const state = componentValue(components, "administrative_area_level_1", true);
  const latitude = place.location?.latitude;
  const longitude = place.location?.longitude;
  const companyScore = companyRelationScore(context.companyName, displayName);

  const hasValidGeo = typeof latitude === "number" && Number.isFinite(latitude) && typeof longitude === "number" && Number.isFinite(longitude);
  const hasValidCity = cityMatches(context.city, city);
  const hasValidState = state?.trim().toUpperCase() === context.state.trim().toUpperCase();
  const streetAddress = buildStructuredStreetAddress({
    street: route,
    houseNumber: streetNumber,
    companyName: context.companyName
  });

  return {
    providerPlaceId,
    displayName,
    formattedAddress: place.formattedAddress?.trim() ?? displayName,
    streetAddress,
    postalCode: componentValue(components, "postal_code"),
    city,
    state: state?.trim().toUpperCase() || null,
    latitude: hasValidGeo ? latitude : null,
    longitude: hasValidGeo ? longitude : null,
    types: place.types ?? [],
    businessStatus: place.businessStatus ?? null,
    companyRelationScore: companyScore,
    structuredAddressComplete: Boolean(streetAddress && hasValidGeo && hasValidCity && hasValidState)
  };
}

function scoreCandidate(place: LocationProviderPlace, context: { city: string; state: string }) {
  let score = 0;

  if (cityMatches(context.city, place.city)) score += 0.2;
  if (place.state?.trim().toUpperCase() === context.state.trim().toUpperCase()) score += 0.2;
  if (place.providerPlaceId?.trim()) score += 0.1;
  if (place.latitude != null && place.longitude != null) score += 0.1;
  if (place.streetAddress?.trim()) score += 0.15;
  if (place.postalCode?.trim()) score += 0.1;
  if ((place.companyRelationScore ?? 0) >= 0.5) score += 0.2;
  if (place.businessStatus === "OPERATIONAL" || !place.businessStatus) score += 0.05;
  if (place.types.some((type) => ["establishment", "point_of_interest", "store"].includes(type))) score += 0.05;
  if (place.types.some((type) => ["locality", "political", "administrative_area_level_1", "country"].includes(type))) score -= 0.25;

  return Math.min(1, Math.max(0, score));
}

export function createGooglePlacesNewProvider(): LocationEnrichmentProvider {
  return {
    id: "google_places_new",

    async searchBranch(query, context) {
      const apiKey = process.env.GOOGLE_PLACES_API_KEY?.trim();
      if (!apiKey) {
        throw new Error("[location-enrichment] GOOGLE_PLACES_API_KEY ausente; API de localização indisponível.");
      }

      try {
        const response = await fetch(GOOGLE_PLACES_TEXT_SEARCH_ENDPOINT, {
          method: "POST",
          signal: AbortSignal.timeout(12_000),
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask": GOOGLE_PLACES_NEW_FIELD_MASK
          },
          body: JSON.stringify({
            textQuery: query,
            languageCode: "pt-BR",
            regionCode: "BR",
            maxResultCount: 5
          })
        });

        if (!response.ok) {
          const body = await response.text();
          throw new Error(`[location-enrichment] Google Places New respondeu com erro HTTP ${response.status}: ${body}`);
        }

        const data = (await response.json()) as GooglePlacesSearchResponse;
        const candidates = (data.places ?? [])
          .map((place) => mapPlace(place, context))
          .filter((place): place is LocationProviderPlace => Boolean(place));

        const scored = candidates
          .map((place) => ({ place, score: scoreCandidate(place, context) }))
          .sort((a, b) => b.score - a.score);

        const best = scored[0];
        if (!best) return null;

        if (
          best.score < 0.75 ||
          !best.place.structuredAddressComplete ||
          !best.place.postalCode?.trim() ||
          (best.place.companyRelationScore ?? 0) < 0.5
        ) {
          return {
            ...best.place,
            structuredAddressComplete: false
          };
        }

        return best.place;
      } catch (error) {
        console.warn("[location-enrichment] Falha ao consultar Google Places New:", error);
        throw error;
      }
    }
  };
}
