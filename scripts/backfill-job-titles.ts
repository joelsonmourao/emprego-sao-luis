/**
 * Backfill manual e pontual para corrigir somente Job.title a partir de planilha.
 *
 * Uso:
 *   npm run jobs:backfill-titles -- --file="C:\\caminho\\vagas-corrigidas.xlsx" --dry-run
 *   DRY_RUN=true npm run jobs:backfill-titles -- --file="C:\\caminho\\vagas-corrigidas.xlsx"
 *   npm run jobs:backfill-titles -- --file="C:\\caminho\\vagas-corrigidas.xlsx"
 */

import * as XLSX from "xlsx";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type TitleBackfillRow = {
  line: number;
  title: string;
  externalId: string;
  sourceUrl: string;
  slug: string;
};

type MatchedJob = {
  id: string;
  slug: string;
  title: string;
  externalId: string | null;
  sourceUrl: string | null;
  employmentType: string;
  state: { slug: string };
  city: { slug: string };
  company: { slug: string } | null;
};

const aliases: Record<string, keyof Omit<TitleBackfillRow, "line">> = {
  title: "title",
  titulo: "title",
  externalid: "externalId",
  external: "externalId",
  idexterno: "externalId",
  sourceurl: "sourceUrl",
  urlfonte: "sourceUrl",
  fonteurl: "sourceUrl",
  source: "sourceUrl",
  slug: "slug"
};

function normalizeHeader(header: string) {
  return header
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

function readOption(name: string) {
  const entry = process.argv.find((arg) => arg.startsWith(`${name}=`));
  return entry ? entry.slice(name.length + 1) : undefined;
}

function isDryRun() {
  return process.argv.includes("--dry-run") || process.env.DRY_RUN === "true";
}

function parseRows(filePath: string): TitleBackfillRow[] {
  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: "" });

  return jsonRows.map((rawRow, index) => {
    const normalized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(rawRow)) {
      const mapped = aliases[normalizeHeader(key)];
      if (mapped) normalized[mapped] = value;
    }

    return {
      line: index + 2,
      title: String(normalized.title ?? "").trim(),
      externalId: String(normalized.externalId ?? "").trim(),
      sourceUrl: String(normalized.sourceUrl ?? "").trim(),
      slug: String(normalized.slug ?? "").trim()
    };
  });
}

function titleChanged(currentTitle: string, nextTitle: string) {
  return currentTitle.trim() !== nextTitle.trim();
}

async function findJobForRow(row: TitleBackfillRow): Promise<{ job: MatchedJob | null; key: string; ambiguous: boolean }> {
  const select = {
    id: true,
    slug: true,
    title: true,
    externalId: true,
    sourceUrl: true,
    employmentType: true,
    state: { select: { slug: true } },
    city: { select: { slug: true } },
    company: { select: { slug: true } }
  } as const;

  if (row.externalId) {
    const job = await prisma.job.findUnique({
      where: { externalId: row.externalId },
      select
    });
    return { job: job as MatchedJob | null, key: `externalId=${row.externalId}`, ambiguous: false };
  }

  if (row.sourceUrl) {
    const jobs = await prisma.job.findMany({
      where: { sourceUrl: row.sourceUrl },
      select,
      take: 2
    });

    return {
      job: jobs.length === 1 ? (jobs[0] as MatchedJob) : null,
      key: `sourceUrl=${row.sourceUrl}`,
      ambiguous: jobs.length > 1
    };
  }

  if (row.slug) {
    const job = await prisma.job.findUnique({
      where: { slug: row.slug },
      select
    });
    return { job: job as MatchedJob | null, key: `slug=${row.slug}`, ambiguous: false };
  }

  return { job: null, key: "", ambiguous: false };
}

async function revalidateUpdatedJobs(jobs: MatchedJob[]) {
  if (!jobs.length) return;

  try {
    const { revalidatePublicSurfacesAfterJobImports } = await import("../lib/public-revalidate");
    revalidatePublicSurfacesAfterJobImports(
      jobs.map((job) => ({
        slug: job.slug,
        stateSlug: job.state.slug,
        citySlug: job.city.slug,
        companySlug: job.company?.slug ?? null,
        employmentType: job.employmentType as never
      }))
    );
    console.info(`Revalidacao publica solicitada para ${jobs.length} vaga(s) atualizada(s).`);
  } catch (error) {
    console.warn(
      "Nao foi possivel chamar a revalidacao do Next neste contexto de script. Se o cache publico persistir, rode via ambiente Next ou faça redeploy/restart.",
      error
    );
  }
}

async function main() {
  const filePath = readOption("--file");
  const dryRun = isDryRun();

  if (!filePath) {
    throw new Error('Informe a planilha com --file="C:\\\\caminho\\\\vagas-corrigidas.xlsx".');
  }

  const rows = parseRows(filePath);
  const updatedJobs: MatchedJob[] = [];
  const stats = {
    totalRows: rows.length,
    found: 0,
    updated: 0,
    unchanged: 0,
    notFound: 0,
    skippedMissingIdentifier: 0,
    skippedMissingTitle: 0,
    skippedAmbiguousSourceUrl: 0
  };

  console.info(`Backfill de titles iniciado em modo ${dryRun ? "DRY_RUN" : "REAL"}.`);
  console.info(`Planilha: ${filePath}`);

  for (const row of rows) {
    if (!row.title) {
      stats.skippedMissingTitle += 1;
      console.warn(`Linha ${row.line}: ignorada por falta de title.`);
      continue;
    }

    if (!row.externalId && !row.sourceUrl && !row.slug) {
      stats.skippedMissingIdentifier += 1;
      console.warn(`Linha ${row.line}: ignorada por falta de externalId/sourceUrl/slug.`);
      continue;
    }

    const { job, key, ambiguous } = await findJobForRow(row);

    if (ambiguous) {
      stats.skippedAmbiguousSourceUrl += 1;
      console.warn(`Linha ${row.line}: sourceUrl ambigua, nenhuma atualizacao feita (${key}).`);
      continue;
    }

    if (!job) {
      stats.notFound += 1;
      console.warn(`Linha ${row.line}: vaga nao encontrada (${key}).`);
      continue;
    }

    stats.found += 1;

    if (!titleChanged(job.title, row.title)) {
      stats.unchanged += 1;
      continue;
    }

    console.info(`Linha ${row.line}: atualizando ${job.slug} (${key})`);
    console.info(`  atual: ${job.title}`);
    console.info(`  novo : ${row.title}`);

    if (!dryRun) {
      await prisma.job.update({
        where: { id: job.id },
        data: { title: row.title }
      });
      updatedJobs.push(job);
    }

    stats.updated += 1;
  }

  if (!dryRun) {
    await revalidateUpdatedJobs(updatedJobs);
  }

  console.info("\n=== Resumo do backfill de titles ===");
  console.info(`Linhas lidas: ${stats.totalRows}`);
  console.info(`Vagas encontradas: ${stats.found}`);
  console.info(`Vagas atualizadas${dryRun ? " (simuladas)" : ""}: ${stats.updated}`);
  console.info(`Sem alteracao de title: ${stats.unchanged}`);
  console.info(`Vagas nao encontradas: ${stats.notFound}`);
  console.info(`Linhas ignoradas por falta de identificador: ${stats.skippedMissingIdentifier}`);
  console.info(`Linhas ignoradas por falta de title: ${stats.skippedMissingTitle}`);
  console.info(`Linhas ignoradas por sourceUrl ambigua: ${stats.skippedAmbiguousSourceUrl}`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : "Falha inesperada no backfill de titles.");
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
