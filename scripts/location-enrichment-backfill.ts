/**
 * Backfill MANUAL e ÚNICO de localização enriquecida para vagas antigas.
 *
 * Não roda automaticamente em deploy, cron ou páginas públicas.
 *
 * Uso:
 *   npm run enrich:locations:backfill
 *
 * Variáveis opcionais:
 *   LOCATION_BACKFILL_CONCURRENCY=2   (padrão: 2, máx. 3)
 *   LOCATION_BACKFILL_DELAY_MS=400    (pausa entre lotes, padrão: 400)
 *   LOCATION_BACKFILL_BATCH_SIZE=20   (tamanho do lote, padrão: 20)
 */

import { PrismaClient } from "@prisma/client";

import { normalizeCompanyNameForCache } from "@/lib/location/normalize-company-name";
import { runLocationEnrichment, type LocationEnrichmentRunOutcome } from "@/lib/location/location-enrichment-service";

const prisma = new PrismaClient();

type LocationKey = {
  companyName: string;
  city: string;
  state: string;
  companyNameNormalized: string;
};

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

async function main() {
  const concurrency = parsePositiveInt(process.env.LOCATION_BACKFILL_CONCURRENCY, 2, 3);
  const delayMs = parsePositiveInt(process.env.LOCATION_BACKFILL_DELAY_MS, 400);
  const batchSize = parsePositiveInt(process.env.LOCATION_BACKFILL_BATCH_SIZE, 20);

  console.info("=== Backfill de localização (manual) ===");
  console.info(`Concorrência: ${concurrency} | Delay entre lotes: ${delayMs}ms | Lote: ${batchSize}`);
  console.info("Este script NÃO roda automaticamente. Execute apenas quando desejar.\n");

  const jobs = await prisma.job.findMany({
    select: {
      id: true,
      companyName: true,
      city: { select: { name: true } },
      state: { select: { code: true } }
    }
  });

  const stats = {
    jobsAnalyzed: jobs.length,
    uniqueKeysEvaluated: 0,
    skippedInvalid: 0,
    cacheReusedTrusted: 0,
    cacheReusedNoRetry: 0,
    apiCalled: 0,
    apiMatched: 0,
    apiFailed: 0
  };

  const outcomeCounts: Record<LocationEnrichmentRunOutcome, number> = {
    skipped_invalid_input: 0,
    cache_reused_trusted: 0,
    cache_reused_no_retry: 0,
    api_matched: 0,
    api_not_found: 0,
    api_low_confidence: 0,
    api_error: 0
  };

  const keyMap = new Map<string, LocationKey>();

  for (const job of jobs) {
    const companyName = job.companyName?.trim();
    const city = job.city?.name?.trim();
    const state = job.state?.code?.trim().toUpperCase();

    if (!companyName || !city || !state || state.length !== 2) {
      stats.skippedInvalid += 1;
      continue;
    }

    const key = buildKey({ companyName, city, state });
    const mapKey = `${key.companyNameNormalized}__${key.city}__${key.state}`;
    if (!keyMap.has(mapKey)) {
      keyMap.set(mapKey, key);
    }
  }

  const keys = [...keyMap.values()];
  stats.uniqueKeysEvaluated = keys.length;

  console.info(`Vagas no banco: ${stats.jobsAnalyzed}`);
  console.info(`Combinações empresa/cidade/UF únicas: ${stats.uniqueKeysEvaluated}`);
  console.info(`Ignoradas por dados incompletos (vagas): ${stats.skippedInvalid}\n`);

  for (let offset = 0; offset < keys.length; offset += batchSize) {
    const batch = keys.slice(offset, offset + batchSize);
    const batchNumber = Math.floor(offset / batchSize) + 1;
    const totalBatches = Math.ceil(keys.length / batchSize);

    console.info(`--- Lote ${batchNumber}/${totalBatches} (${batch.length} chaves) ---`);

    await runPool(batch, concurrency, async (key, indexInBatch) => {
      const label = `${key.companyName} / ${key.city} / ${key.state}`;
      const globalIndex = offset + indexInBatch + 1;

      try {
        const outcome = await runLocationEnrichment(
          { companyName: key.companyName, city: key.city, state: key.state },
          { quiet: true }
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

        stats.apiCalled += 1;

        if (outcome === "api_matched") {
          stats.apiMatched += 1;
          console.info(`[${globalIndex}/${keys.length}] API → enriquecido: ${label}`);
          return;
        }

        stats.apiFailed += 1;
        console.info(`[${globalIndex}/${keys.length}] API → sem correspondência (${outcome}): ${label}`);
      } catch (error) {
        stats.apiFailed += 1;
        outcomeCounts.api_error += 1;
        console.warn(`[${globalIndex}/${keys.length}] erro (continuando): ${label}`, error);
      }
    });

    if (offset + batchSize < keys.length && delayMs > 0) {
      await sleep(delayMs);
    }
  }

  console.info("\n=== Resumo do backfill ===");
  console.info(`Vagas analisadas: ${stats.jobsAnalyzed}`);
  console.info(`Chaves empresa/cidade/UF únicas avaliadas: ${stats.uniqueKeysEvaluated}`);
  console.info(`Cache confiável reutilizado: ${stats.cacheReusedTrusted}`);
  console.info(`Cache negativo reutilizado (sem nova API): ${stats.cacheReusedNoRetry}`);
  console.info(`Chamadas à API: ${stats.apiCalled}`);
  console.info(`Enriquecidas com sucesso (MATCHED): ${stats.apiMatched}`);
  console.info(`Sem sucesso após API: ${stats.apiFailed}`);
  console.info(`Ignoradas por dados incompletos: ${stats.skippedInvalid}`);
  console.info("\nDetalhe por resultado:");
  for (const [outcome, count] of Object.entries(outcomeCounts)) {
    if (count > 0) console.info(`  - ${outcome}: ${count}`);
  }
}

main()
  .catch((error) => {
    console.error("Backfill interrompido por erro fatal:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
