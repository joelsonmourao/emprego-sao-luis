import { z } from "zod";

const normalizeText = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
const parseNumber = (value: unknown) => {
  if (typeof value !== "string") return value;
  const clean = value.replace(/R\$/gi, "").replace(/\s/g, "");
  if (!clean) return undefined;
  return Number(clean.includes(",") ? clean.replace(/\./g, "").replace(",", ".") : clean);
};
const workplaceType = z.preprocess((value) => {
  if (typeof value !== "string") return value;
  const normalized = normalizeText(value);
  if (normalized.includes("hibrid")) return "hibrido";
  if (normalized.includes("remot")) return "remoto";
  return "presencial";
}, z.enum(["presencial", "hibrido", "remoto"]));

export const importModeSchema = z.enum(["DRY_RUN", "DRAFT", "PENDING_REVIEW", "PUBLISHED"]);
export const importJobRowSchema = z.object({
  externalId: z.string().trim().max(200).optional(), originalTitle: z.string().trim().min(3).max(160).optional(), title: z.string().trim().min(3).max(160),
  company: z.string().trim().min(2).max(180), category: z.string().trim().max(120).optional(), city: z.string().trim().min(2).max(120), state: z.string().trim().length(2).transform((value) => value.toUpperCase()),
  neighborhood: z.string().trim().max(160).optional(), workplaceType: workplaceType.default("presencial"), employmentType: z.string().trim().min(2).max(50).default("CLT"),
  description: z.string().trim().min(80), summary: z.string().trim().min(10).max(500).optional(), activities: z.string().trim().max(10_000).optional(), requirements: z.string().trim().max(10_000).optional(), benefits: z.string().trim().max(10_000).optional(),
  salaryMin: z.preprocess(parseNumber, z.number().nonnegative().optional()), salaryMax: z.preprocess(parseNumber, z.number().nonnegative().optional()),
  applyUrl: z.string().url(), source: z.string().trim().min(2).max(120), sourceUrl: z.string().url().optional(), publishedAt: z.coerce.date().optional(), expiresAt: z.coerce.date(), sourceStatus: z.string().trim().max(50).optional(),
  featured: z.preprocess((value) => typeof value === "string" ? ["1", "true", "sim", "yes"].includes(normalizeText(value)) : Boolean(value), z.boolean()).optional()
}).superRefine((value, context) => {
  if (value.salaryMin !== undefined && value.salaryMax !== undefined && value.salaryMax < value.salaryMin) context.addIssue({ code: "custom", path: ["salaryMax"], message: "Faixa salarial inválida." });
});

export const importAliases: Record<string, string[]> = {
  originalTitle: ["titulo original", "título original", "original title"], title: ["titulo publico", "título público", "titulo", "título", "cargo", "title", "titulo original", "título original"],
  company: ["empresa", "company"], category: ["categoria", "category"], city: ["cidade", "city"], state: ["estado", "uf", "state"], neighborhood: ["bairro", "neighborhood"],
  workplaceType: ["modalidade", "workplacetype", "regime"], employmentType: ["tipo de contratacao", "tipo de contratação", "tipo de contrato", "employmenttype"],
  description: ["descricao", "descrição", "descricao completa", "description"], summary: ["resumo", "summary"], activities: ["atividades", "responsabilidades", "activities"], requirements: ["requisitos", "requirements"], benefits: ["beneficios", "benefícios", "benefits"],
  salaryMin: ["salario", "salário", "salario minimo", "salário mínimo", "salarymin"], salaryMax: ["salario maximo", "salário máximo", "salarymax"],
  applyUrl: ["link", "link de candidatura", "url da candidatura", "applyurl", "url candidatura"], source: ["fonte", "source"], sourceUrl: ["url da fonte", "sourceurl"],
  publishedAt: ["data", "data de publicacao", "data de publicação", "publishedat"], expiresAt: ["validade", "data de validade", "expiresat", "validthrough"], sourceStatus: ["status", "situacao", "situação"], featured: ["destaque", "featured"], externalId: ["codigo externo", "código externo", "externalid", "id externo"]
};

const normalizeHeader = (value: string) => normalizeText(value).replace(/[_-]+/g, " ").replace(/\s+/g, " ");
export function suggestImportMapping(headers: string[]) { const normalized = new Map(headers.map((header) => [normalizeHeader(header), header])); return Object.fromEntries(Object.entries(importAliases).map(([field, names]) => [field, names.map(normalizeHeader).map((name) => normalized.get(name)).find(Boolean)]).filter((entry): entry is [string, string] => typeof entry[1] === "string")); }
export function normalizeImportRow(row: Record<string, unknown>) { const normalizedEntries = new Map(Object.entries(row).map(([key, value]) => [normalizeHeader(key), value])); return Object.fromEntries(Object.entries(importAliases).map(([field, names]) => [field, names.map(normalizeHeader).map((name) => normalizedEntries.get(name)).find((value) => value !== undefined && value !== "")]).filter(([, value]) => value !== undefined)); }
