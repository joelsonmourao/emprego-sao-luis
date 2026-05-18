import type { LocationEnrichmentProvider, LocationProviderPlace } from "@/lib/location/providers/types";

type AddressComponent = {
  longText?: string;
  shortText?: string;
  types?: string[];
};

type PlacesSearchResponse = {
  places?: Array<{
    id?: string;
    displayName?: { text?: string };
    formattedAddress?: string;
    location?: { latitude?: number; longitude?: number };
    addressComponents?: AddressComponent[];
    types?: string[];
  }>;
};

function componentValue(components: AddressComponent[] | undefined, type: string, preferShort = false) {
  const match = components?.find((c) => c.types?.includes(type));
  if (!match) return null;
  const value = preferShort ? match.shortText ?? match.longText : match.longText ?? match.shortText;
  return value?.trim() || null;
}

function buildStreetAddress(components: AddressComponent[] | undefined) {
  const route = componentValue(components, "route");
  const number = componentValue(components, "street_number");
  if (route && number) return `${route}, ${number}`;
  return route ?? number ?? null;
}

function mapPlace(place: NonNullable<PlacesSearchResponse["places"]>[number]): LocationProviderPlace | null {
  const providerPlaceId = place.id?.trim();
  const displayName = place.displayName?.text?.trim() ?? "";
  const formattedAddress = place.formattedAddress?.trim() ?? "";
  if (!providerPlaceId || !displayName) return null;

  const components = place.addressComponents;
  const latitude = place.location?.latitude ?? null;
  const longitude = place.location?.longitude ?? null;

  return {
    providerPlaceId,
    displayName,
    formattedAddress,
    streetAddress: buildStreetAddress(components),
    postalCode: componentValue(components, "postal_code"),
    city:
      componentValue(components, "locality") ??
      componentValue(components, "administrative_area_level_2") ??
      componentValue(components, "sublocality"),
    state: componentValue(components, "administrative_area_level_1", true),
    latitude: typeof latitude === "number" && Number.isFinite(latitude) ? latitude : null,
    longitude: typeof longitude === "number" && Number.isFinite(longitude) ? longitude : null,
    types: place.types ?? []
  };
}

export function createGooglePlacesProvider(): LocationEnrichmentProvider {
  return {
    id: "google_places",

    async searchBranch(query, context) {
      const apiKey = process.env.GOOGLE_PLACES_API_KEY?.trim();
      if (!apiKey) {
        console.warn("[location-enrichment] GOOGLE_PLACES_API_KEY ausente; API de localização indisponível.");
        return null;
      }

      try {
        const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask":
              "places.id,places.displayName,places.formattedAddress,places.location,places.addressComponents,places.types"
          },
          body: JSON.stringify({
            textQuery: query,
            languageCode: "pt-BR",
            regionCode: "BR",
            maxResultCount: 5
          }),
          signal: AbortSignal.timeout(12_000)
        });

        if (!response.ok) {
          console.warn("[location-enrichment] Google Places respondeu com erro:", response.status, await response.text());
          return null;
        }

        const data = (await response.json()) as PlacesSearchResponse;
        const candidates = (data.places ?? []).map(mapPlace).filter((p): p is LocationProviderPlace => Boolean(p));
        if (!candidates.length) return null;

        const cityKey = context.city.trim().toLowerCase();
        const stateKey = context.state.trim().toUpperCase();

        const scored = candidates
          .map((place) => {
            let score = 0.4;
            const placeCity = place.city?.trim().toLowerCase() ?? "";
            const placeState = place.state?.trim().toUpperCase() ?? "";

            if (placeCity && (placeCity === cityKey || placeCity.includes(cityKey) || cityKey.includes(placeCity))) {
              score += 0.25;
            }
            if (placeState && placeState === stateKey) {
              score += 0.2;
            }
            if (place.streetAddress) score += 0.1;
            if (place.postalCode) score += 0.05;
            if (place.latitude != null && place.longitude != null) score += 0.05;

            const establishmentTypes = new Set([
              "establishment",
              "point_of_interest",
              "store",
              "finance",
              "food",
              "health",
              "shopping_mall"
            ]);
            if (place.types.some((t) => establishmentTypes.has(t))) {
              score += 0.1;
            }

            return { place, score };
          })
          .sort((a, b) => b.score - a.score);

        const best = scored[0];
        if (!best || best.score < 0.65) return null;

        return best.place;
      } catch (error) {
        console.warn("[location-enrichment] Falha ao consultar Google Places:", error);
        return null;
      }
    }
  };
}
