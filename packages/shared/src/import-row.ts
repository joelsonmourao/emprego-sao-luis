import { z } from "zod";
import { validateApplicationChannels } from "./application-channels.js";
import { isTemplateExampleRow } from "./import-template.js";

const normalizeText = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
const optionalText = (max: number) => z.preprocess((value) => value === "" || value == null ? undefined : value, z.string().trim().max(max).optional());
const optionalUrl = z.preprocess((value) => value === "" || value == null ? undefined : value, z.string().trim().url().optional());
const optionalDate = z.preprocess((value) => value === "" || value == null ? undefined : value, z.coerce.date().optional());
const optionalInteger = z.preprocess((value) => value === "" || value == null ? undefined : Number(value), z.number().int().positive().max(10_000).optional());
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

export const importModeSchema = z.enum(["DRY_RUN", "DRAFT", "PENDING_REVIEW"]);

export const importJobRowSchema = z.object({
  externalId: optionalText(200),
  originalTitle: optionalText(160),
  title: z.string().trim().min(3).max(160),
  company: z.string().trim().min(2).max(180),
  description: z.string().trim().min(80),
  locality: optionalText(200),
  city: optionalText(120),
  state: optionalText(30),
  category: optionalText(120),
  neighborhood: optionalText(160),
  workplaceType: workplaceType.default("presencial"),
  employmentType: optionalText(50).default("CLT"),
  numberOfOpenings: optionalInteger.default(1),
  summary: optionalText(500),
  activities: optionalText(10_000),
  requirements: optionalText(10_000),
  benefits: optionalText(10_000),
  salary: optionalText(120),
  salaryMin: z.preprocess(parseNumber, z.number().nonnegative().optional()),
  salaryMax: z.preprocess(parseNumber, z.number().nonnegative().optional()),
  applicationUrl: optionalUrl,
  applicationEmail: optionalText(254),
  applicationWhatsapp: optionalText(40),
  whatsappMessage: optionalText(500),
  emailSubject: optionalText(300),
  applicationInstructions: optionalText(2_000),
  sourceName: z.string().trim().min(2).max(120),
  sourceUrl: optionalUrl,
  publishedAt: optionalDate,
  expiresAt: optionalDate,
  sourceStatus: optionalText(50),
  featured: z.preprocess((value) => typeof value === "string" ? ["1", "true", "sim", "yes"].includes(normalizeText(value)) : Boolean(value), z.boolean()).optional()
}).superRefine((value, context) => {
  if (!value.locality && (!value.city || !value.state))
    context.addIssue({ code: "custom", path: ["locality"], message: "Informe localidade ou cidade e UF." });
  if (value.salaryMin !== undefined && value.salaryMax !== undefined && value.salaryMax < value.salaryMin)
    context.addIssue({ code: "custom", path: ["salaryMax"], message: "Faixa salarial inválida." });
  const channels = validateApplicationChannels(value);
  if (!channels.valid)
    context.addIssue({ code: "custom", path: ["applicationUrl"], message: "Informe candidatura válida por site, WhatsApp ou e-mail." });
});

export const importAliases: Record<string, string[]> = {
  externalId: ["codigo externo", "código externo", "externalid", "id externo"],
  originalTitle: ["titulo original", "título original", "original title"],
  title: ["titulo", "título", "title", "vaga", "cargo", "titulo publico", "título público"],
  company: ["empresa", "companhia", "company"],
  description: ["descricao", "descrição", "description", "descricao completa"],
  locality: ["localidade", "local", "location"],
  city: ["cidade", "municipio", "município", "city"],
  state: ["uf", "estado", "state"],
  workplaceType: ["modalidade", "workplacetype", "regime"],
  numberOfOpenings: ["quantidadevagas", "quantidade vagas", "numero de vagas", "número de vagas", "openings"],
  salary: ["salario", "salário", "salary"],
  salaryMin: ["salario minimo", "salário mínimo", "salarymin"],
  salaryMax: ["salario maximo", "salário máximo", "salarymax"],
  publishedAt: ["datapublicacao", "data publicacao", "data de publicação", "publishedat", "data"],
  expiresAt: ["dataencerramento", "data encerramento", "validade", "data de validade", "expiresat", "validthrough"],
  sourceName: ["fontenome", "fonte nome", "fonte", "sourcename", "source"],
  sourceUrl: ["fonteurl", "fonte url", "url da fonte", "sourceurl", "origem"],
  category: ["categoria", "category", "area", "área"],
  neighborhood: ["bairro", "neighborhood"],
  applicationUrl: ["candidaturaurl", "candidatura url", "link", "applicationurl", "applyurl", "url candidatura", "url da candidatura", "link de candidatura"],
  applicationEmail: ["candidaturaemail", "candidatura email", "email", "e-mail", "applicationemail"],
  applicationWhatsapp: ["candidaturawhatsapp", "candidatura whatsapp", "whatsapp", "telefone", "celular"],
  whatsappMessage: ["mensagemwhatsapp", "mensagem whatsapp", "whatsappmessage"],
  emailSubject: ["assuntoemail", "assunto email", "emailsubject"],
  applicationInstructions: ["instrucoescandidatura", "instruções candidatura", "instrucoes candidatura", "applicationinstructions"],
  employmentType: ["tipo de contratacao", "tipo de contratação", "tipo de contrato", "employmenttype"],
  summary: ["resumo", "summary"],
  activities: ["atividades", "responsabilidades", "activities"],
  requirements: ["requisitos", "requirements"],
  benefits: ["beneficios", "benefícios", "benefits"],
  sourceStatus: ["status", "situacao", "situação"],
  featured: ["destaque", "featured"]
};

const normalizeHeader = (value: string) => normalizeText(value).replace(/[_-]+/g, " ").replace(/\s+/g, " ");

export function suggestImportMapping(headers: string[]) {
  const normalized = new Map(headers.map((header) => [normalizeHeader(header), header]));
  return Object.fromEntries(Object.entries(importAliases)
    .map(([field, names]) => [field, names.map(normalizeHeader).map((name) => normalized.get(name)).find(Boolean)])
    .filter((entry): entry is [string, string] => typeof entry[1] === "string"));
}

export function normalizeImportRow(row: Record<string, unknown>) {
  const normalizedEntries = new Map(Object.entries(row).map(([key, value]) => [normalizeHeader(key), value]));
  return Object.fromEntries(Object.entries(importAliases)
    .map(([field, names]) => [field, names.map(normalizeHeader).map((name) => normalizedEntries.get(name)).find((value) => value !== undefined && value !== "")])
    .filter(([, value]) => value !== undefined));
}

export function shouldSkipImportRow(row: Record<string, unknown>) {
  return isTemplateExampleRow(row) || Object.values(row).every((value) => String(value ?? "").trim() === "");
}
