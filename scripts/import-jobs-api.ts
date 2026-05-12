import * as XLSX from "xlsx";

import { normalizeSlug, parseBooleanLike, parseOptionalNumber } from "../lib/admin/content";
import { importedJobRowSchema, type ImportedJobRow } from "../lib/schemas/job-import";

const aliases: Record<string, string> = {
  title: "title",
  titulo: "title",
  slug: "slug",
  company: "companyName",
  empresa: "companyName",
  city: "cityName",
  cidade: "cityName",
  state: "stateName",
  estado: "stateName",
  description: "descriptionHtml",
  descricao: "descriptionHtml",
  requirements: "requirementsText",
  requisitos: "requirementsText",
  benefits: "benefitsText",
  beneficios: "benefitsText",
  area: "area",
  categoria: "area",
  salary: "salaryMin",
  salario: "salaryMin",
  salarymin: "salaryMin",
  salarymax: "salaryMax",
  employmenttype: "employmentType",
  workhours: "workHours",
  jornada: "workHours",
  publishedat: "publishedAt",
  expiresat: "expiresAt",
  validthrough: "validThrough",
  applyurl: "applyUrl",
  isactive: "isActive",
  active: "isActive",
  source: "sourceName",
  sourcename: "sourceName",
  sourceurl: "sourceUrl",
  locationtype: "locationType",
  seotitle: "seoTitle",
  seodescription: "seoDescription",
  externalid: "externalId",
  resumo: "summary",
  summary: "summary",
  featured: "featured"
};

function parseBooleanWithDefault(value: unknown, defaultValue: boolean) {
  if (value === null || value === undefined) return defaultValue;
  if (typeof value === "string" && value.trim() === "") return defaultValue;
  return parseBooleanLike(value);
}

function readOption(name: string) {
  const entry = process.argv.find((arg) => arg.startsWith(`${name}=`));
  return entry ? entry.slice(name.length + 1) : undefined;
}

function hasFlag(name: string) {
  return process.argv.includes(name);
}

function normalizeHeader(header: string) {
  return header
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

function parseRows(filePath: string): ImportedJobRow[] {
  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: "" });
  const rows: ImportedJobRow[] = [];
  const errors: string[] = [];

  jsonRows.forEach((rawRow, index) => {
    const normalized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(rawRow)) {
      const mapped = aliases[normalizeHeader(key)];
      if (mapped) normalized[mapped] = value;
    }

    const candidate = {
      title: String(normalized.title ?? "").trim(),
      slug: String(normalized.slug ?? "").trim() || normalizeSlug(String(normalized.title ?? "")),
      companyName: String(normalized.companyName ?? "").trim(),
      cityName: String(normalized.cityName ?? "").trim(),
      stateName: String(normalized.stateName ?? "").trim(),
      summary: String(normalized.summary ?? normalized.descriptionHtml ?? "").trim().slice(0, 220),
      descriptionHtml: String(normalized.descriptionHtml ?? "").trim(),
      requirementsText: String(normalized.requirementsText ?? "").trim(),
      benefitsText: String(normalized.benefitsText ?? "").trim(),
      area: String(normalized.area ?? "").trim(),
      salaryMin: parseOptionalNumber(normalized.salaryMin),
      salaryMax: parseOptionalNumber(normalized.salaryMax),
      employmentType: String(normalized.employmentType ?? "").trim(),
      workHours: String(normalized.workHours ?? "").trim(),
      publishedAt: String(normalized.publishedAt ?? "").trim(),
      expiresAt: String(normalized.expiresAt ?? "").trim(),
      validThrough: String(normalized.validThrough ?? "").trim(),
      validThroughMonths: parseOptionalNumber(normalized.validThroughMonths),
      applyUrl: String(normalized.applyUrl ?? "").trim(),
      isActive: parseBooleanWithDefault(normalized.isActive, true),
      sourceName: String(normalized.sourceName ?? "").trim(),
      sourceUrl: String(normalized.sourceUrl ?? "").trim(),
      locationType: String(normalized.locationType ?? "ONSITE").trim().toUpperCase(),
      seoTitle: String(normalized.seoTitle ?? normalized.title ?? "").trim(),
      seoDescription: String(normalized.seoDescription ?? normalized.summary ?? "").trim(),
      featured: parseBooleanWithDefault(normalized.featured, false),
      externalId: String(normalized.externalId ?? "").trim()
    };

    const parsed = importedJobRowSchema.safeParse(candidate);
    if (parsed.success) {
      rows.push(parsed.data);
    } else {
      errors.push(`Linha ${index + 2}: ${parsed.error.issues.map((issue) => issue.message).join("; ")}`);
    }
  });

  if (errors.length) {
    throw new Error(errors.join("\n"));
  }

  return rows;
}

async function main() {
  const filePath = readOption("--file");
  const apiUrl = readOption("--api-url") ?? "http://127.0.0.1:3000/api/admin/import/jobs";
  const cookie = readOption("--cookie");
  const useAi = hasFlag("--use-ai");
  const reprocessExistingContent = hasFlag("--reprocess-existing-content");

  if (!filePath) {
    throw new Error("Informe a planilha com --file=\"C:\\\\caminho\\\\vagas.xlsx\".");
  }

  const rows = parseRows(filePath);
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {})
    },
    body: JSON.stringify({ rows, useAi, reprocessExistingContent })
  });
  const body = await response.text();

  if (!response.ok) {
    throw new Error(`Importacao falhou (${response.status}): ${body}`);
  }

  console.log(body);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Falha inesperada na importacao.");
  process.exitCode = 1;
});
