import { z } from "zod";
export * from "./publication-schedule.js";
export * from "./admin-password.js";
export * from "./zod-fields.js";

export const publicCodeSchema = z.string().regex(/^ES-\d{6}$/);

export const jobDraftSchema = z.object({
  originalTitle: z.string().trim().min(3).max(160),
  normalizedTitle: z.string().trim().min(3).max(160),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(180),
  companyId: z.string().uuid(), cityId: z.string().uuid(), stateId: z.string().uuid(), categoryId: z.string().uuid().optional(),
  employmentType: z.string().trim().min(2).max(50),
  workplaceType: z.enum(["presencial", "hibrido", "remoto"]),
  summary: z.string().trim().min(40).max(500), description: z.string().trim().min(80),
  applicationUrl: z.string().url(), sourceName: z.string().trim().min(2).max(120), sourceUrl: z.string().url().optional(),
  expiresAt: z.coerce.date(), salaryMin: z.coerce.number().nonnegative().optional(), salaryMax: z.coerce.number().nonnegative().optional(),
  publicationStatus: z.enum(["DRAFT", "PENDING_REVIEW", "APPROVED", "SCHEDULED", "PUBLISHED"]).default("DRAFT")
}).superRefine((value, context) => {
  if (value.salaryMin !== undefined && value.salaryMax !== undefined && value.salaryMax < value.salaryMin) context.addIssue({ code: "custom", path: ["salaryMax"], message: "Salário máximo menor que o mínimo." });
  if (value.expiresAt <= new Date()) context.addIssue({ code: "custom", path: ["expiresAt"], message: "Validade deve estar no futuro." });
});

export type JobDraftInput = z.infer<typeof jobDraftSchema>;

export const importModeSchema = z.enum(["DRY_RUN", "DRAFT", "PENDING_REVIEW", "PUBLISHED"]);
export const importJobRowSchema = z.object({
  externalId: z.string().trim().max(200).optional(), title: z.string().trim().min(3).max(160),
  company: z.string().trim().min(2).max(180), city: z.string().trim().min(2).max(120), state: z.string().trim().length(2).transform((v) => v.toUpperCase()),
  category: z.string().trim().max(120).optional(), description: z.string().trim().min(80), applyUrl: z.string().url(),
  source: z.string().trim().min(2).max(120), sourceUrl: z.string().url().optional(), expiresAt: z.coerce.date(),
  employmentType: z.string().trim().min(2).max(50).default("FULL_TIME"), workplaceType: z.enum(["presencial", "hibrido", "remoto"]).default("presencial"),
  salaryMin: z.coerce.number().nonnegative().optional(), salaryMax: z.coerce.number().nonnegative().optional()
}).superRefine((value, context) => { if (value.salaryMin !== undefined && value.salaryMax !== undefined && value.salaryMax < value.salaryMin) context.addIssue({ code: "custom", path: ["salaryMax"], message: "Faixa salarial inválida." }); });

const aliases: Record<string, string[]> = {
  externalId: ["externalid", "id externo"], title: ["titulo", "título", "cargo", "title"], company: ["empresa", "company"], city: ["cidade", "city"], state: ["estado", "uf", "state"], category: ["categoria", "category"], description: ["descricao", "descrição", "description"], applyUrl: ["link", "link de candidatura", "applyurl", "url candidatura"], source: ["fonte", "source"], sourceUrl: ["url da fonte", "sourceurl"], expiresAt: ["validade", "data de validade", "expiresat", "validthrough"], employmentType: ["tipo de contrato", "employmenttype"], workplaceType: ["modalidade", "workplacetype"], salaryMin: ["salario minimo", "salário mínimo", "salarymin"], salaryMax: ["salario maximo", "salário máximo", "salarymax"]
};
const normalizeHeader = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ");
export function suggestImportMapping(headers: string[]) { const normalized = new Map(headers.map((header) => [normalizeHeader(header), header])); return Object.fromEntries(Object.entries(aliases).map(([field, names]) => [field, names.map(normalizeHeader).map((name) => normalized.get(name)).find(Boolean)]).filter((entry): entry is [string, string] => typeof entry[1] === "string")); }
export function normalizeImportRow(row: Record<string, unknown>) {
  const normalizedEntries = new Map(Object.entries(row).map(([key, value]) => [normalizeHeader(key), value]));
  return Object.fromEntries(Object.entries(aliases).map(([field, names]) => [field, names.map(normalizeHeader).map((name) => normalizedEntries.get(name)).find((value) => value !== undefined && value !== "")]).filter(([, value]) => value !== undefined));
}
