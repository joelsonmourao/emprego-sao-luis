/**
 * Backfill MANUAL e ÚNICO de localização enriquecida para vagas antigas.
 *
 * Provedor: Google Places API (New) - Text Search.
 *
 * Uso:
 *   npm run enrich:locations:backfill
 *   npm run enrich:locations:backfill:dry-run
 *
 * Dry-run (sem API, sem gravar cache):
 *   npm run enrich:locations:backfill -- --dry-run
 *   npm run enrich:locations:backfill:dry-run -- --latest-jobs=2000
 *   LOCATION_BACKFILL_DRY_RUN=1 npm run enrich:locations:backfill
 *
 * Escopo opcional:
 *   --latest-jobs=2000  (considera somente as vagas mais recentes por createdAt DESC)
 *   --reprocess-invalid-street-cache  (reprocessa apenas caches MATCHED com streetAddress inválido)
 *
 * Variáveis opcionais (execução real):
 *   GOOGLE_PLACES_API_KEY=...                    (obrigatória para chamadas reais)
 *   LOCATION_BACKFILL_MAX_API_CALLS_PER_RUN=2400 (padrão: 2400)
 *   LOCATION_BACKFILL_CONCURRENCY=1              (padrão: 1, máx. 3)
 *   LOCATION_BACKFILL_DELAY_MS=500               (pausa entre lotes, padrão: 500)
 *   LOCATION_BACKFILL_BATCH_SIZE=100             (tamanho do lote, padrão: 100)
 */

import { LocationMatchStatus, PrismaClient } from "@prisma/client";

import { normalizeCompanyNameForCache } from "@/lib/location/normalize-company-name";
import {
  previewLocationEnrichmentBackfill,
  resolveBackfillMaxApiCallsPerRun,
  runLocationEnrichment,
  type LocationEnrichmentRunOutcome
} from "@/lib/location/location-enrichment-service";
import { isInvalidCachedStreetAddress } from "@/lib/location/street-address-validation";

const prisma = new PrismaClient();

type LocationKey = {
  companyName: string;
  city: string;
  state: string;
  companyNameNormalized: string;
};

type BackfillScope = {
  latestJobs: number | null;
  reprocessInvalidStreetCacheOnly: boolean;
};

function isDryRun() {
  return process.argv.includes("--dry-run") || process.env.LOCATION_BACKFILL_DRY_RUN === "1";
}

function parseLatestJobsArg(): BackfillScope {
  const arg = process.argv.find((item) => item.startsWith("--latest-jobs"));
  const reprocessInvalidStreetCacheOnly = process.argv.includes("--reprocess-invalid-street-cache");
  if (!arg) return { latestJobs: null, reprocessInvalidStreetCacheOnly };

  const [, rawValue] = arg.split("=");
  const value = rawValue?.trim();
  const parsed = Number.parseInt(value ?? "", 10);

  if (!value || !Number.isFinite(parsed) || parsed < 1 || String(parsed) !== value) {
    throw new Error('Argumento inválido: use "--latest-jobs=2000" com um número inteiro positivo.');
  }

  return { latestJobs: parsed, reprocessInvalidStreetCacheOnly };
}

function parsePositiveInt(value: string | undefined, fallback: number, max?: number) {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  if (max != null) return Math.min(parsed, max);
  return parsed;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildKey(input: { companyName: string; city: string; state: string }): LocationKey {
  const city = input.city.trim();
  const state = input.state.trim().toUpperCase();
  return {
    companyName: input.companyName.trim(),
    city,
    state,
    companyNameNormalized: normalizeCompanyNameForCache(input.companyName)
  };
}

function formatScope(scope: BackfillScope) {
  if (scope.reprocessInvalidStreetCacheOnly) {
    return "Escopo limitado aos caches MATCHED com streetAddress inválido (nome de POI/empresa).";
  }

  return scope.latestJobs
    ? `Escopo limitado às ${scope.latestJobs} vagas mais recentes (createdAt DESC).`
    : "Escopo sem limite: todas as vagas do banco.";
}

async function collectInvalidStreetCacheKeys() {
  const rows = await prisma.locationEnrichmentCache.findMany({
    where: { matchStatus: LocationMatchStatus.MATCHED },
    select: {
      id: true,
      companyName: true,
      companyNameNormalized: true,
      city: true,
      state: true,
      streetAddress: true
    }
  });

  const invalidRows = rows.filter((row) => isInvalidCachedStreetAddress(row.streetAddress, row.companyName));

  return {
    jobsAnalyzed: invalidRows.length,
    skippedInvalidJobs: 0,
    keys: invalidRows.map((row) => ({
      companyName: row.companyName,
      city: row.city,
      state: row.state,
      companyNameNormalized: row.companyNameNormalized
    })),
    invalidCacheIds: invalidRows.map((row) => row.id)
  };
}

async function collectUniqueKeysFromJobs(scope: BackfillScope) {
  if (scope.reprocessInvalidStreetCacheOnly) {
    return collectInvalidStreetCacheKeys();
  }

  const jobs = await prisma.job.findMany({
    select: {
      companyName: true,
      city: { select: { name: true } },
      state: { select: { code: true } }
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    ...(scope.latestJobs ? { take: scope.latestJobs } : {})
  });

  const keyMap = new Map<string, LocationKey>();
  let skippedInvalidJobs = 0;

  for (const job of jobs) {
    const companyName = job.companyName?.trim();
    const city = job.city?.name?.trim();
    const state = job.state?.code?.trim().toUpperCase();

    if (!companyName || !city || !state || state.length !== 2) {
      skippedInvalidJobs += 1;
      continue;
    }

    const key = buildKey({ companyName, city, state });
    const mapKey = `${key.companyNameNormalized}__${key.city}__${key.state}`;
    if (!keyMap.has(mapKey)) {
      keyMap.set(mapKey, key);
    }
  }

  return {
    jobsAnalyzed: jobs.length,
    skippedInvalidJobs,
    keys: [...keyMap.values()],
    invalidCacheIds: []
  };
}

async function runDryRun(scope: BackfillScope) {
  console.info("=== Backfill de localização — DRY-RUN ===");
  console.info("Nenhuma chamada à API externa. Nenhuma gravação em LocationEnrichmentCache.\n");
  console.info(formatScope(scope));
  console.info("Critério de recência: Job.createdAt DESC.\n");

  const { jobsAnalyzed, skippedInvalidJobs, keys, invalidCacheIds } = await collectUniqueKeysFromJobs(scope);
  const preview = scope.reprocessInvalidStreetCacheOnly
    ? {
        uniqueKeys: keys.length,
        skippedInvalid: 0,
        skippedGenericCompany: 0,
        wouldReuseTrustedCache: 0,
        wouldReuseNegativeCache: 0,
        wouldCallApi: keys.length,
        hasGooglePlacesApiKey: Boolean(process.env.GOOGLE_PLACES_API_KEY?.trim()),
        maxApiCallsPerRun: resolveBackfillMaxApiCallsPerRun(),
        wouldExceedApiLimit: keys.length > resolveBackfillMaxApiCallsPerRun(),
        pendingAfterLimit: Math.max(0, keys.length - resolveBackfillMaxApiCallsPerRun())
      }
    : await previewLocationEnrichmentBackfill(
        keys.map((key) => ({ companyName: key.companyName, city: key.city, state: key.state }))
      );

  const cacheRows = await prisma.locationEnrichmentCache.count();
  const matchedRows = await prisma.locationEnrichmentCache.count({
    where: { matchStatus: LocationMatchStatus.MATCHED }
  });

  console.info(`Vagas no banco: ${jobsAnalyzed}`);
  if (scope.latestJobs) {
    console.info(`Escopo limitado às vagas mais recentes: ${scope.latestJobs}`);
  }
  if (scope.reprocessInvalidStreetCacheOnly) {
    console.info(`Caches MATCHED com streetAddress inválido encontrados: ${invalidCacheIds.length}`);
  }
  console.info(`Vagas ignoradas (empresa/cidade/UF inválidos): ${skippedInvalidJobs}`);
  console.info(`Combinações empresa/cidade/UF únicas: ${keys.length}`);
  console.info(`Registros em LocationEnrichmentCache (total): ${cacheRows}`);
  console.info(`Registros MATCHED no cache: ${matchedRows}`);
  console.info("");
  console.info("Estimativa se você rodar o backfill real agora:");
  console.info(`  - Reutilizariam cache negativo (sem API, janela 90 dias): ${preview.wouldReuseNegativeCache}`);
  console.info(`  - Reutilizariam cache Google confiável (sem API): ${preview.wouldReuseTrustedCache}`);
  console.info(`  - Chamariam Google Places API: ${preview.wouldCallApi}`);
  console.info(`  - Ignoradas por nome de empresa genérico: ${preview.skippedGenericCompany}`);
  console.info(`  - Chaves inválidas: ${preview.skippedInvalid}`);
  console.info("");
  console.info(`GOOGLE_PLACES_API_KEY configurada: ${preview.hasGooglePlacesApiKey ? "sim" : "NÃO"}`);
  console.info(`Limite por execução (LOCATION_BACKFILL_MAX_API_CALLS_PER_RUN): ${preview.maxApiCallsPerRun}`);

  if (preview.wouldExceedApiLimit) {
    console.warn(
      `\nAtenção: ${preview.wouldCallApi} chamadas previstas excedem o limite de ${preview.maxApiCallsPerRun} por execução.`
    );
    console.warn(`Combinações que ficariam pendentes nesta execução: ${preview.pendingAfterLimit}`);
    console.warn("Execute o backfill em dias seguintes até esgotar as pendentes.");
  } else if (preview.wouldCallApi > 0) {
    console.info(`\nEstimativa cabe no limite desta execução (${preview.wouldCallApi} <= ${preview.maxApiCallsPerRun}).`);
  }

  if (!preview.hasGooglePlacesApiKey) {
    console.warn(
      "\nAtenção: sem GOOGLE_PLACES_API_KEY, o backfill real NÃO fará HTTP e registrará API_ERROR com retry permitido."
    );
  }

  console.info("\nProvedor: Google Places API (New) — POST /v1/places:searchText");
  console.info("Execute o backfill real com: npm run enrich:locations:backfill");
}

async function runPool<T>(items: T[], concurrency: number, worker: (item: T, index: number) => Promise<void>) {
  let cursor = 0;

  async function runWorker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      await worker(items[index], index);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => runWorker());
  await Promise.all(workers);
}

async function runBackfill(scope: BackfillScope) {
  const maxApiCallsPerRun = resolveBackfillMaxApiCallsPerRun();
  const concurrency = parsePositiveInt(process.env.LOCATION_BACKFILL_CONCURRENCY, 1, 3);
  const delayMs = parsePositiveInt(process.env.LOCATION_BACKFILL_DELAY_MS, 500);
  const batchSize = parsePositiveInt(process.env.LOCATION_BACKFILL_BATCH_SIZE, 100);

  let apiCallsThisRun = 0;
  let quotaReached = false;
  let pendingAfterLimit = 0;

  console.info("=== Backfill de localização (manual) ===");
  console.info(
    `Concorrência: ${concurrency} | Delay entre lotes: ${delayMs}ms | Lote: ${batchSize} | Limite API: ${maxApiCallsPerRun}`
  );
  console.info("Provedor: Google Places API (New) — POST https://places.googleapis.com/v1/places:searchText");
  console.info("Este script NÃO roda automaticamente. Execute apenas quando desejar.\n");
  console.info(formatScope(scope));
  console.info("Critério de recência: Job.createdAt DESC.\n");

  if (!process.env.GOOGLE_PLACES_API_KEY?.trim()) {
    console.warn(
      "GOOGLE_PLACES_API_KEY ausente: o script continuará, mas cada chave nova será salva como API_ERROR com retry permitido.\n"
    );
  }

  const { jobsAnalyzed, skippedInvalidJobs, keys, invalidCacheIds } = await collectUniqueKeysFromJobs(scope);

  if (scope.reprocessInvalidStreetCacheOnly && invalidCacheIds.length > 0) {
    await prisma.locationEnrichmentCache.deleteMany({
      where: { id: { in: invalidCacheIds } }
    });
    console.info(`Caches inválidos removidos antes do reprocessamento: ${invalidCacheIds.length}\n`);
  }

  const stats = {
    jobsAnalyzed,
    uniqueKeysEvaluated: keys.length,
    skippedInvalid: skippedInvalidJobs,
    cacheReusedTrusted: 0,
    cacheReusedNoRetry: 0,
    apiCalled: 0,
    apiMatched: 0,
    apiFailed: 0,
    apiSkippedGenericCompany: 0,
    apiSkippedQuota: 0
  };

  const outcomeCounts: Record<LocationEnrichmentRunOutcome, number> = {
    skipped_invalid_input: 0,
    cache_reused_trusted: 0,
    cache_reused_no_retry: 0,
    api_skipped_generic_company: 0,
    api_skipped_quota: 0,
    api_matched: 0,
    api_not_found: 0,
    api_low_confidence: 0,
    api_error: 0
  };

  console.info(`Vagas no banco: ${stats.jobsAnalyzed}`);
  if (scope.latestJobs) {
    console.info(`Escopo limitado às vagas mais recentes: ${scope.latestJobs}`);
  }
  if (scope.reprocessInvalidStreetCacheOnly) {
    console.info(`Caches MATCHED com streetAddress inválido para reprocessar: ${invalidCacheIds.length}`);
  }
  console.info(`Combinações empresa/cidade/UF únicas: ${stats.uniqueKeysEvaluated}`);
  console.info(`Ignoradas por dados incompletos (vagas): ${stats.skippedInvalid}\n`);

  outer: for (let offset = 0; offset < keys.length; offset += batchSize) {
    if (quotaReached) break;

    const batch = keys.slice(offset, offset + batchSize);
    const batchNumber = Math.floor(offset / batchSize) + 1;
    const totalBatches = Math.ceil(keys.length / batchSize);

    console.info(`--- Lote ${batchNumber}/${totalBatches} (${batch.length} chaves) ---`);

    await runPool(batch, concurrency, async (key, indexInBatch) => {
      if (quotaReached) return;

      const label = `${key.companyName} / ${key.city} / ${key.state}`;
      const globalIndex = offset + indexInBatch + 1;
      let apiCallReservedForThisKey = false;

      try {
        const outcome = await runLocationEnrichment(
          { companyName: key.companyName, city: key.city, state: key.state },
          {
            quiet: true,
            allowApiCall: () => {
              if (apiCallsThisRun >= maxApiCallsPerRun) return false;
              apiCallsThisRun += 1;
              apiCallReservedForThisKey = true;
              return true;
            }
          }
        );

        outcomeCounts[outcome] += 1;

        if (outcome === "cache_reused_trusted") {
          stats.cacheReusedTrusted += 1;
          console.info(`[${globalIndex}/${keys.length}] cache reutilizado: ${label}`);
          return;
        }

        if (outcome === "cache_reused_no_retry") {
          stats.cacheReusedNoRetry += 1;
          console.info(`[${globalIndex}/${keys.length}] cache anterior (sem API): ${label}`);
          return;
        }

        if (outcome === "skipped_invalid_input") {
          stats.skippedInvalid += 1;
          console.info(`[${globalIndex}/${keys.length}] ignorado (dados inválidos): ${label}`);
          return;
        }

        if (outcome === "api_skipped_generic_company") {
          stats.apiSkippedGenericCompany += 1;
          console.info(`[${globalIndex}/${keys.length}] ignorado (empresa genérica, sem API): ${label}`);
          return;
        }

        if (outcome === "api_skipped_quota") {
          stats.apiSkippedQuota += 1;
          quotaReached = true;
          console.warn(`[${globalIndex}/${keys.length}] limite de API atingido; pendente: ${label}`);
          return;
        }

        if (apiCallReservedForThisKey) {
          stats.apiCalled += 1;
        }

        if (outcome === "api_matched") {
          stats.apiMatched += 1;
          console.info(`[${globalIndex}/${keys.length}] API → enriquecido: ${label}`);
          return;
        }

        stats.apiFailed += 1;
        console.info(`[${globalIndex}/${keys.length}] API → sem correspondência (${outcome}): ${label}`);
      } catch (error) {
        if (apiCallReservedForThisKey) {
          stats.apiCalled += 1;
        }
        stats.apiFailed += 1;
        outcomeCounts.api_error += 1;
        console.warn(`[${globalIndex}/${keys.length}] erro (continuando): ${label}`, error);
      }
    });

    if (quotaReached) {
      pendingAfterLimit = keys.length - (offset + batch.length);
      if (pendingAfterLimit < 0) pendingAfterLimit = 0;
      break outer;
    }

    if (offset + batchSize < keys.length && delayMs > 0) {
      await sleep(delayMs);
    }
  }

  if (quotaReached) {
    const processed = stats.cacheReusedTrusted + stats.cacheReusedNoRetry + stats.apiCalled + stats.apiSkippedQuota;
    pendingAfterLimit = Math.max(0, keys.length - processed);
  }

  console.info("\n=== Resumo do backfill ===");
  console.info(`Vagas analisadas: ${stats.jobsAnalyzed}`);
  if (scope.latestJobs) {
    console.info(`Escopo limitado às vagas mais recentes: ${scope.latestJobs} (createdAt DESC)`);
  }
  console.info(`Chaves empresa/cidade/UF únicas avaliadas: ${stats.uniqueKeysEvaluated}`);
  console.info(`Cache confiável reutilizado: ${stats.cacheReusedTrusted}`);
  console.info(`Cache negativo reutilizado (sem nova API): ${stats.cacheReusedNoRetry}`);
  console.info(`Chamadas à API Google Places nesta execução: ${stats.apiCalled}`);
  console.info(`Limite por execução: ${maxApiCallsPerRun}`);
  if (quotaReached) {
    console.info(`Limite alcançado: sim`);
    console.info(`Combinações pendentes para outro dia: ${pendingAfterLimit}`);
  }
  console.info(`Enriquecidas com sucesso (MATCHED): ${stats.apiMatched}`);
  console.info(`Sem sucesso após API: ${stats.apiFailed}`);
  console.info(`Ignoradas por nome de empresa genérico: ${stats.apiSkippedGenericCompany}`);
  console.info(`Ignoradas por quota (sem gravar cache): ${stats.apiSkippedQuota}`);
  console.info(`Ignoradas por dados incompletos: ${stats.skippedInvalid}`);
  console.info("\nDetalhe por resultado:");
  for (const [outcome, count] of Object.entries(outcomeCounts)) {
    if (count > 0) console.info(`  - ${outcome}: ${count}`);
  }
}

async function main() {
  const scope = parseLatestJobsArg();

  if (isDryRun()) {
    await runDryRun(scope);
    return;
  }
  await runBackfill(scope);
}

main()
  .catch((error) => {
    console.error("Backfill interrompido por erro fatal:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
