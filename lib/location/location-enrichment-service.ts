import { LocationMatchStatus } from "@prisma/client";

import { prisma } from "@/lib/db";
import { normalizeCompanyNameForCache } from "@/lib/location/normalize-company-name";
import { createGooglePlacesNewProvider } from "@/lib/location/providers/google-places-new-provider";
import type { LocationEnrichmentProvider } from "@/lib/location/providers/types";
import type { LocationEnrichmentLookupInput, TrustedLocationEnrichment } from "@/lib/location/types";

const CONFIDENCE_THRESHOLD = 0.75;
const CACHE_RETRY_DAYS = 90;
const ACTIVE_LOCATION_PROVIDER_ID = "google_places_new";

function resolveProvider(): LocationEnrichmentProvider {
  const configured = process.env.LOCATION_ENRICHMENT_PROVIDER?.trim().toLowerCase();
  if (configured && configured !== ACTIVE_LOCATION_PROVIDER_ID) {
    console.warn(`[location-enrichment] Provedor desconhecido "${configured}"; usando ${ACTIVE_LOCATION_PROVIDER_ID}.`);
  }
  return createGooglePlacesNewProvider();
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
    rankConfidence?: number | null;
    rankConfidenceCityLevel?: number | null;
    rankConfidenceStreetLevel?: number | null;
  }
) {
  let score = place.rankConfidence ?? 0.55;
  if (place.rankConfidenceCityLevel != null) {
    score = score * 0.65 + place.rankConfidenceCityLevel * 0.35;
  }
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

function cacheMapKey(companyNameNormalized: string, city: string, state: string) {
  return `${companyNameNormalized}__${city}__${state}`;
}

export type LocationEnrichmentBackfillPreview = {
  uniqueKeys: number;
  skippedInvalid: number;
  skippedGenericCompany: number;
  wouldReuseTrustedCache: number;
  wouldReuseNegativeCache: number;
  wouldCallApi: number;
  hasGooglePlacesApiKey: boolean;
  maxApiCallsPerRun: number;
  wouldExceedApiLimit: boolean;
  pendingAfterLimit: number;
};

/** Estima o backfill sem chamar API externa (somente leitura do banco). */
export function resolveBackfillMaxApiCallsPerRun() {
  const parsed = Number.parseInt(process.env.LOCATION_BACKFILL_MAX_API_CALLS_PER_RUN ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 2400;
}

export async function previewLocationEnrichmentBackfill(
  keys: LocationEnrichmentLookupInput[]
): Promise<LocationEnrichmentBackfillPreview> {
  const hasGooglePlacesApiKey = Boolean(process.env.GOOGLE_PLACES_API_KEY?.trim());
  const maxApiCallsPerRun = resolveBackfillMaxApiCallsPerRun();
  const preview: LocationEnrichmentBackfillPreview = {
    uniqueKeys: 0,
    skippedInvalid: 0,
    skippedGenericCompany: 0,
    wouldReuseTrustedCache: 0,
    wouldReuseNegativeCache: 0,
    wouldCallApi: 0,
    hasGooglePlacesApiKey,
    maxApiCallsPerRun,
    wouldExceedApiLimit: false,
    pendingAfterLimit: 0
  };

  const cacheRows = await prisma.locationEnrichmentCache.findMany({
    where: { provider: ACTIVE_LOCATION_PROVIDER_ID }
  });
  const cacheByKey = new Map(
    cacheRows.map((row) => [cacheMapKey(row.companyNameNormalized, row.city, row.state), row])
  );

  for (const input of keys) {
    if (!isValidEnrichmentInput(input)) {
      preview.skippedInvalid += 1;
      continue;
    }

    preview.uniqueKeys += 1;

    if (isGenericCompanyName(input.companyName)) {
      preview.skippedGenericCompany += 1;
      continue;
    }

    const companyNameNormalized = normalizeCompanyNameForCache(input.companyName);
    const city = input.city.trim();
    const state = input.state.trim().toUpperCase();
    const existing = cacheByKey.get(cacheMapKey(companyNameNormalized, city, state));

    if (existing) {
      if (trustedFieldsFromCache(existing)) {
        preview.wouldReuseTrustedCache += 1;
        continue;
      }
      if (existing.matchStatus !== LocationMatchStatus.API_ERROR && shouldSkipApiFetch(existing.lastFetchedAt)) {
        preview.wouldReuseNegativeCache += 1;
        continue;
      }
    }

    preview.wouldCallApi += 1;
  }

  preview.wouldExceedApiLimit = preview.wouldCallApi > maxApiCallsPerRun;
  preview.pendingAfterLimit = Math.max(0, preview.wouldCallApi - maxApiCallsPerRun);

  return preview;
}

export type LocationEnrichmentRunOutcome =
  | "skipped_invalid_input"
  | "api_skipped_generic_company"
  | "cache_reused_trusted"
  | "cache_reused_no_retry"
  | "api_skipped_quota"
  | "api_matched"
  | "api_not_found"
  | "api_low_confidence"
  | "api_error";

function isValidEnrichmentInput(input: LocationEnrichmentLookupInput) {
  const companyName = input.companyName?.trim();
  const city = input.city?.trim();
  const state = input.state?.trim().toUpperCase();
  if (!companyName || !city || !state || state.length !== 2) return false;
  return true;
}

function isGenericCompanyName(companyName: string | null | undefined) {
  const normalized = normalizeCompanyNameForCache(companyName ?? "");
  return (
    !normalized ||
    normalized === "empresa" ||
    normalized === "confidencial" ||
    normalized === "empresa confidencial" ||
    normalized === "nao informado" ||
    normalized === "não informado" ||
    normalized === "nao informada" ||
    normalized === "não informada"
  );
}

/**
 * Processa uma combinação empresa/cidade/UF (idempotente). Usado na importação e no backfill manual.
 */
export async function runLocationEnrichment(
  input: LocationEnrichmentLookupInput,
  options?: { quiet?: boolean; allowApiCall?: () => boolean }
): Promise<LocationEnrichmentRunOutcome> {
  if (!isValidEnrichmentInput(input)) {
    return "skipped_invalid_input";
  }

  const companyName = input.companyName.trim();
  const city = input.city.trim();
  const state = input.state.trim().toUpperCase();
  const companyNameNormalized = normalizeCompanyNameForCache(companyName);
  const rawQuery = buildRawQuery(input);
  const log = (message: string) => {
    if (!options?.quiet) console.info(message);
  };

  const provider = resolveProvider();
  const existing = await prisma.locationEnrichmentCache.findUnique({
    where: {
      companyNameNormalized_city_state: {
        companyNameNormalized,
        city,
        state
      }
    }
  });

  if (existing && existing.provider === provider.id) {
    const trusted = trustedFieldsFromCache(existing);
    if (trusted) {
      log(`[location-enrichment] Cache confiável reutilizado: ${companyName} / ${city} / ${state}.`);
      return "cache_reused_trusted";
    }
    if (existing.matchStatus !== LocationMatchStatus.API_ERROR && shouldSkipApiFetch(existing.lastFetchedAt)) {
      log(
        `[location-enrichment] Tentativa anterior reutilizada (sem nova API): ${companyName} / ${city} / ${state} [${existing.matchStatus}].`
      );
      return "cache_reused_no_retry";
    }
  }

  if (isGenericCompanyName(companyName)) {
    log(`[location-enrichment] Empresa genérica ignorada sem chamada de API: ${companyName} / ${city} / ${state}.`);
    return "api_skipped_generic_company";
  }

  if (options?.allowApiCall && !options.allowApiCall()) {
    log(`[location-enrichment] Cota de API do backfill atingida; pendente: ${companyName} / ${city} / ${state}.`);
    return "api_skipped_quota";
  }

  log(`[location-enrichment] Consultando API (${provider.id}): ${rawQuery}`);

  let place: Awaited<ReturnType<LocationEnrichmentProvider["searchBranch"]>> = null;
  try {
    place = await provider.searchBranch(rawQuery, { city, state, companyName });
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
    return "api_error";
  }

  if (!place) {
    log(`[location-enrichment] Localização não encontrada: ${companyName} / ${city} / ${state}.`);
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
    return "api_not_found";
  }

  const matchConfidence = scorePlaceMatch(input, place);
  const hasGeo = place.latitude != null && place.longitude != null;
  const hasAddress = Boolean(place.structuredAddressComplete !== false && place.streetAddress?.trim() && place.postalCode?.trim());

  if (matchConfidence < CONFIDENCE_THRESHOLD || !hasGeo || !hasAddress) {
    log(
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
      streetAddress: null,
      postalCode: null,
      latitude: null,
      longitude: null
    });
    return "api_low_confidence";
  }

  log(
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

  return "api_matched";
}

/**
 * Enriquece localização durante importação/admin. Não lança erro se a API falhar.
 */
export async function ensureLocationEnrichment(input: LocationEnrichmentLookupInput): Promise<void> {
  await runLocationEnrichment(input);
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
