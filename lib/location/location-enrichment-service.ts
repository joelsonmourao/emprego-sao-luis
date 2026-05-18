import { LocationMatchStatus } from "@prisma/client";

import { prisma } from "@/lib/db";
import { normalizeCompanyNameForCache } from "@/lib/location/normalize-company-name";
import { createGooglePlacesProvider } from "@/lib/location/providers/google-places-provider";
import type { LocationEnrichmentProvider } from "@/lib/location/providers/types";
import type { LocationEnrichmentLookupInput, TrustedLocationEnrichment } from "@/lib/location/types";

const CONFIDENCE_THRESHOLD = 0.75;
const CACHE_RETRY_DAYS = 90;

function resolveProvider(): LocationEnrichmentProvider {
  const configured = process.env.LOCATION_ENRICHMENT_PROVIDER?.trim().toLowerCase();
  if (configured && configured !== "google_places") {
    console.warn(`[location-enrichment] Provedor desconhecido "${configured}"; usando google_places.`);
  }
  return createGooglePlacesProvider();
}

function buildRawQuery(input: LocationEnrichmentLookupInput) {
  return `${input.companyName.trim()} ${input.city.trim()} ${input.state.trim().toUpperCase()} Brasil`;
}

function scorePlaceMatch(
  input: LocationEnrichmentLookupInput,
  place: {
    displayName: string;
    city: string | null;
    state: string | null;
    streetAddress: string | null;
    postalCode: string | null;
    latitude: number | null;
    longitude: number | null;
  }
) {
  let score = 0.55;
  const companyTokens = normalizeCompanyNameForCache(input.companyName)
    .split(" ")
    .filter((t) => t.length > 2);
  const display = place.displayName.toLowerCase();

  const matchedTokens = companyTokens.filter((token) => display.includes(token)).length;
  if (companyTokens.length) {
    score += Math.min(0.25, (matchedTokens / companyTokens.length) * 0.25);
  }

  const cityKey = input.city.trim().toLowerCase();
  const stateKey = input.state.trim().toUpperCase();
  const placeCity = place.city?.trim().toLowerCase() ?? "";
  const placeState = place.state?.trim().toUpperCase() ?? "";

  if (placeCity && (placeCity === cityKey || placeCity.includes(cityKey) || cityKey.includes(placeCity))) {
    score += 0.12;
  }
  if (placeState === stateKey) score += 0.1;
  if (place.streetAddress?.trim()) score += 0.05;
  if (place.postalCode?.trim()) score += 0.03;
  if (place.latitude != null && place.longitude != null) score += 0.05;

  return Math.min(1, score);
}

export function trustedFieldsFromCache(entry: {
  matchStatus: LocationMatchStatus;
  matchConfidence: number | null;
  streetAddress: string | null;
  postalCode: string | null;
  latitude: number | null;
  longitude: number | null;
}): TrustedLocationEnrichment | null {
  if (entry.matchStatus !== LocationMatchStatus.MATCHED) return null;
  if ((entry.matchConfidence ?? 0) < CONFIDENCE_THRESHOLD) return null;

  const streetAddress = entry.streetAddress?.trim();
  const postalCode = entry.postalCode?.trim();
  const latitude = entry.latitude;
  const longitude = entry.longitude;

  if (!streetAddress || !postalCode || latitude == null || longitude == null) return null;
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

  return { streetAddress, postalCode, latitude, longitude };
}

export async function getTrustedLocationEnrichmentForJob(
  input: LocationEnrichmentLookupInput
): Promise<TrustedLocationEnrichment | null> {
  const companyNameNormalized = normalizeCompanyNameForCache(input.companyName);
  const city = input.city.trim();
  const state = input.state.trim().toUpperCase();

  const cached = await prisma.locationEnrichmentCache.findUnique({
    where: {
      companyNameNormalized_city_state: {
        companyNameNormalized,
        city,
        state
      }
    }
  });

  if (!cached) return null;

  const trusted = trustedFieldsFromCache(cached);
  if (trusted) {
    console.info(
      `[location-enrichment] Cache reutilizado para ${input.companyName} / ${city} / ${state} (confiança ${cached.matchConfidence ?? "n/a"}).`
    );
    return trusted;
  }

  return null;
}

function shouldSkipApiFetch(lastFetchedAt: Date | null | undefined) {
  if (!lastFetchedAt) return false;
  const ageMs = Date.now() - lastFetchedAt.getTime();
  return ageMs < CACHE_RETRY_DAYS * 24 * 60 * 60 * 1000;
}

/**
 * Enriquece localização durante importação/admin. Não lança erro se a API falhar.
 */
export async function ensureLocationEnrichment(input: LocationEnrichmentLookupInput): Promise<void> {
  const companyName = input.companyName.trim();
  const city = input.city.trim();
  const state = input.state.trim().toUpperCase();
  const companyNameNormalized = normalizeCompanyNameForCache(companyName);
  const rawQuery = buildRawQuery(input);

  const existing = await prisma.locationEnrichmentCache.findUnique({
    where: {
      companyNameNormalized_city_state: {
        companyNameNormalized,
        city,
        state
      }
    }
  });

  if (existing) {
    const trusted = trustedFieldsFromCache(existing);
    if (trusted) {
      console.info(`[location-enrichment] Cache confiável reutilizado na importação: ${companyName} / ${city} / ${state}.`);
      return;
    }
    if (shouldSkipApiFetch(existing.lastFetchedAt)) {
      console.info(
        `[location-enrichment] Tentativa anterior reutilizada (sem nova API): ${companyName} / ${city} / ${state} [${existing.matchStatus}].`
      );
      return;
    }
  }

  const provider = resolveProvider();
  console.info(`[location-enrichment] Consultando API (${provider.id}): ${rawQuery}`);

  let place: Awaited<ReturnType<LocationEnrichmentProvider["searchBranch"]>> = null;
  try {
    place = await provider.searchBranch(rawQuery, { city, state });
  } catch (error) {
    console.warn("[location-enrichment] API indisponível:", error);
    await upsertCacheRow({
      companyName,
      companyNameNormalized,
      city,
      state,
      provider: provider.id,
      rawQuery,
      matchStatus: LocationMatchStatus.API_ERROR,
      matchConfidence: null,
      providerPlaceId: null,
      streetAddress: null,
      postalCode: null,
      latitude: null,
      longitude: null
    });
    return;
  }

  if (!place) {
    console.info(`[location-enrichment] Localização não encontrada: ${companyName} / ${city} / ${state}.`);
    await upsertCacheRow({
      companyName,
      companyNameNormalized,
      city,
      state,
      provider: provider.id,
      rawQuery,
      matchStatus: LocationMatchStatus.NOT_FOUND,
      matchConfidence: 0,
      providerPlaceId: null,
      streetAddress: null,
      postalCode: null,
      latitude: null,
      longitude: null
    });
    return;
  }

  const matchConfidence = scorePlaceMatch(input, place);
  const hasGeo = place.latitude != null && place.longitude != null;
  const hasAddress = Boolean(place.streetAddress?.trim() && place.postalCode?.trim());

  if (matchConfidence < CONFIDENCE_THRESHOLD || !hasGeo || !hasAddress) {
    console.info(
      `[location-enrichment] Localização rejeitada por baixa confiança (${matchConfidence.toFixed(2)}): ${companyName} / ${city} / ${state}.`
    );
    await upsertCacheRow({
      companyName,
      companyNameNormalized,
      city,
      state,
      provider: provider.id,
      rawQuery,
      matchStatus: LocationMatchStatus.LOW_CONFIDENCE,
      matchConfidence,
      providerPlaceId: place.providerPlaceId,
      streetAddress: place.streetAddress,
      postalCode: place.postalCode,
      latitude: place.latitude,
      longitude: place.longitude
    });
    return;
  }

  console.info(
    `[location-enrichment] Localização encontrada com confiança ${matchConfidence.toFixed(2)}: ${companyName} / ${city} / ${state}.`
  );

  await upsertCacheRow({
    companyName,
    companyNameNormalized,
    city,
    state,
    provider: provider.id,
    rawQuery,
    matchStatus: LocationMatchStatus.MATCHED,
    matchConfidence,
    providerPlaceId: place.providerPlaceId,
    streetAddress: place.streetAddress,
    postalCode: place.postalCode,
    latitude: place.latitude,
    longitude: place.longitude
  });
}

async function upsertCacheRow(data: {
  companyName: string;
  companyNameNormalized: string;
  city: string;
  state: string;
  provider: string;
  rawQuery: string;
  matchStatus: LocationMatchStatus;
  matchConfidence: number | null;
  providerPlaceId: string | null;
  streetAddress: string | null;
  postalCode: string | null;
  latitude: number | null;
  longitude: number | null;
}) {
  const now = new Date();
  await prisma.locationEnrichmentCache.upsert({
    where: {
      companyNameNormalized_city_state: {
        companyNameNormalized: data.companyNameNormalized,
        city: data.city,
        state: data.state
      }
    },
    create: {
      ...data,
      lastFetchedAt: now,
      lastValidatedAt: data.matchStatus === LocationMatchStatus.MATCHED ? now : null
    },
    update: {
      companyName: data.companyName,
      provider: data.provider,
      rawQuery: data.rawQuery,
      matchStatus: data.matchStatus,
      matchConfidence: data.matchConfidence,
      providerPlaceId: data.providerPlaceId,
      streetAddress: data.streetAddress,
      postalCode: data.postalCode,
      latitude: data.latitude,
      longitude: data.longitude,
      lastFetchedAt: now,
      lastValidatedAt: data.matchStatus === LocationMatchStatus.MATCHED ? now : null
    }
  });
}
