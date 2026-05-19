/**
 * Reset manual do cache Google Places API (New) para permitir nova consulta.
 *
 * Uso:
 *   npm run enrich:locations:reset-google-cache:dry-run -- --latest-jobs=2000
 *   npm run enrich:locations:reset-google-cache -- --latest-jobs=2000
 */

import { LocationMatchStatus, Prisma, PrismaClient } from "@prisma/client";

import { normalizeCompanyNameForCache } from "@/lib/location/normalize-company-name";

const prisma = new PrismaClient();
const GOOGLE_PLACES_NEW_PROVIDER_ID = "google_places_new";

type LocationKey = {
  companyNameNormalized: string;
  city: string;
  state: string;
};

function isDryRun() {
  return process.argv.includes("--dry-run") || process.env.LOCATION_BACKFILL_DRY_RUN === "1";
}

function parseLatestJobsArg() {
  const arg = process.argv.find((item) => item.startsWith("--latest-jobs"));
  const [, rawValue] = (arg ?? "").split("=");
  const value = rawValue?.trim();
  const parsed = Number.parseInt(value ?? "", 10);

  if (!value || !Number.isFinite(parsed) || parsed < 1 || String(parsed) !== value) {
    throw new Error('Argumento obrigatório inválido: use "--latest-jobs=2000" com um número inteiro positivo.');
  }

  return parsed;
}

function buildCacheWhere(keys: LocationKey[]): Prisma.LocationEnrichmentCacheWhereInput {
  return {
    provider: GOOGLE_PLACES_NEW_PROVIDER_ID,
    OR: keys.map((key) => ({
      companyNameNormalized: key.companyNameNormalized,
      city: key.city,
      state: key.state
    }))
  };
}

async function collectUniqueKeysFromLatestJobs(latestJobs: number) {
  const jobs = await prisma.job.findMany({
    select: {
      companyName: true,
      city: { select: { name: true } },
      state: { select: { code: true } }
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: latestJobs
  });

  const keyMap = new Map<string, LocationKey>();

  for (const job of jobs) {
    const companyName = job.companyName?.trim();
    const city = job.city?.name?.trim();
    const state = job.state?.code?.trim().toUpperCase();
    if (!companyName || !city || !state || state.length !== 2) continue;

    const companyNameNormalized = normalizeCompanyNameForCache(companyName);
    const mapKey = `${companyNameNormalized}__${city}__${state}`;
    keyMap.set(mapKey, { companyNameNormalized, city, state });
  }

  return {
    jobsAnalyzed: jobs.length,
    keys: [...keyMap.values()]
  };
}

async function main() {
  const latestJobs = parseLatestJobsArg();
  const dryRun = isDryRun();
  const { jobsAnalyzed, keys } = await collectUniqueKeysFromLatestJobs(latestJobs);

  console.info(`=== Reset cache Google Places New ${dryRun ? "- DRY-RUN" : "- REAL"} ===`);
  console.info(`Escopo: ${latestJobs} vagas mais recentes (createdAt DESC).`);
  console.info(`Vagas avaliadas: ${jobsAnalyzed}`);
  console.info(`Combinações únicas empresa/cidade/UF no recorte: ${keys.length}`);

  if (!keys.length) {
    console.info("Nenhuma combinação válida encontrada.");
    return;
  }

  const where = buildCacheWhere(keys);
  const rows = await prisma.locationEnrichmentCache.findMany({
    where,
    select: { id: true, matchStatus: true }
  });

  const counts = {
    total: rows.length,
    matched: rows.filter((row) => row.matchStatus === LocationMatchStatus.MATCHED).length,
    lowConfidence: rows.filter((row) => row.matchStatus === LocationMatchStatus.LOW_CONFIDENCE).length,
    notFound: rows.filter((row) => row.matchStatus === LocationMatchStatus.NOT_FOUND).length,
    apiError: rows.filter((row) => row.matchStatus === LocationMatchStatus.API_ERROR).length
  };

  console.info(`Caches Google encontrados no recorte: ${counts.total}`);
  console.info(`  - MATCHED: ${counts.matched}`);
  console.info(`  - NOT_FOUND: ${counts.notFound}`);
  console.info(`  - LOW_CONFIDENCE: ${counts.lowConfidence}`);
  console.info(`  - API_ERROR: ${counts.apiError}`);
  console.info(`Serão apagados/invalidados: ${counts.total}`);

  if (dryRun || !rows.length) {
    if (dryRun) console.info("Dry-run: nenhum cache foi apagado.");
    return;
  }

  const deleted = await prisma.locationEnrichmentCache.deleteMany({
    where: { id: { in: rows.map((row) => row.id) } }
  });

  console.info(`Caches Google apagados: ${deleted.count}`);
}

main()
  .catch((error) => {
    console.error("Reset Google Places interrompido por erro fatal:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
