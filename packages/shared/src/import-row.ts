import { createHash } from "node:crypto";
import { z } from "zod";
import { validateApplicationChannels } from "./application-channels.js";
import { isTemplateExampleRow } from "./import-template.js";
import { fromDatetimeLocalValue } from "./timezone.js";

const normalizeText = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
const optionalText = (max: number) =>
  z.preprocess((value) => (value === "" || value == null ? undefined : value), z.string().trim().max(max).optional());
const optionalUrl = z.preprocess(
  (value) => (value === "" || value == null ? undefined : value),
  z.string().trim().url({ message: "URL inválida." }).optional()
);
const optionalInteger = z.preprocess(
  (value) => (value === "" || value == null ? undefined : Number(value)),
  z.number().int().positive().max(10_000).optional()
);
const parseNumber = (value: unknown) => {
  if (typeof value !== "string") return value;
  const clean = value.replace(/R\$/gi, "").replace(/\s/g, "");
  if (!clean) return undefined;
  return Number(clean.includes(",") ? clean.replace(/\./g, "").replace(",", ".") : clean);
};

/** Aceita DD/MM/AAAA (Brasil), AAAA-MM-DD e Date (Excel). */
export function parseImportDate(value: unknown): Date | undefined {
  if (value == null || value === "") return undefined;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? undefined : value;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    // Serial Excel (dias desde 1899-12-30) — XLSX costuma já converter com cellDates.
    const excelEpoch = Date.UTC(1899, 11, 30);
    const ms = excelEpoch + value * 86_400_000;
    const date = new Date(ms);
    return Number.isNaN(date.getTime()) ? undefined : date;
  }

  const raw = String(value).trim();
  if (!raw) return undefined;

  const br = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
  if (br) {
    const day = Number(br[1]);
    const month = Number(br[2]);
    const year = Number(br[3]);
    const hour = Number(br[4] ?? 0);
    const minute = Number(br[5] ?? 0);
    const second = Number(br[6] ?? 0);
    if (month < 1 || month > 12 || day < 1 || day > 31) return undefined;
    const local = `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`;
    return fromDatetimeLocalValue(local) ?? undefined;
  }

  const isoDay = raw.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2})(?::(\d{2}))?)?/);
  if (isoDay && !raw.includes("Z") && !/[+-]\d{2}:?\d{2}$/.test(raw)) {
    const hour = isoDay[4] ?? "00";
    const minute = isoDay[5] ?? "00";
    const second = isoDay[6] ?? "00";
    return fromDatetimeLocalValue(`${isoDay[1]}-${isoDay[2]}-${isoDay[3]}T${hour}:${minute}:${second}`) ?? undefined;
  }

  const fallback = new Date(raw);
  return Number.isNaN(fallback.getTime()) ? undefined : fallback;
}

const optionalDate = z.preprocess((value) => {
  if (value === "" || value == null) return undefined;
  const parsed = parseImportDate(value);
  return parsed ?? value;
}, z.date({ message: "Data inválida. Use DD/MM/AAAA ou AAAA-MM-DD." }).optional());

const workplaceType = z.preprocess((value) => {
  if (typeof value !== "string" || !value.trim()) return "presencial";
  const normalized = normalizeText(value);
  if (normalized.includes("hibrid")) return "hibrido";
  if (normalized.includes("remot")) return "remoto";
  if (normalized.includes("presenc")) return "presencial";
  return "presencial";
}, z.enum(["presencial", "hibrido", "remoto"]));

export const importModeSchema = z.enum(["DRY_RUN", "DRAFT", "PENDING_REVIEW", "PUBLISH_BY_DATE"]);

export const importJobRowSchema = z
  .object({
    externalId: optionalText(200),
    originalTitle: optionalText(160),
    title: z.string().trim().min(3, "Título muito curto.").max(160),
    company: z.string().trim().min(2, "Empresa inválida.").max(180),
    description: z
      .string()
      .trim()
      .min(80, "Descrição muito curta (mín. 80 caracteres). HTML é aceito; Markdown não é exigido."),
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
    sourceName: z.string().trim().min(2, "fonteNome é obrigatório.").max(120),
    sourceUrl: optionalUrl,
    publishedAt: optionalDate,
    expiresAt: optionalDate,
    sourceStatus: optionalText(50),
    featured: z
      .preprocess(
        (value) =>
          typeof value === "string"
            ? ["1", "true", "sim", "yes"].includes(normalizeText(value))
            : Boolean(value),
        z.boolean()
      )
      .optional()
  })
  .superRefine((value, context) => {
    if (!value.locality && (!value.city || !value.state)) {
      context.addIssue({
        code: "custom",
        path: ["locality"],
        message: "Informe localidade OU cidade + uf. Localidade pode ficar vazia se cidade e uf estiverem preenchidos."
      });
    }
    if (value.salaryMin !== undefined && value.salaryMax !== undefined && value.salaryMax < value.salaryMin) {
      context.addIssue({ code: "custom", path: ["salaryMax"], message: "Faixa salarial inválida." });
    }
    const channels = validateApplicationChannels(value);
    if (!channels.valid) {
      context.addIssue({
        code: "custom",
        path: ["applicationUrl"],
        message: "Informe ao menos um canal válido: candidaturaUrl, candidaturaEmail ou candidaturaWhatsApp."
      });
    }
  });

export type ImportJobRow = z.infer<typeof importJobRowSchema>;

/** Gera id interno estável quando a planilha não traz `id`. */
export function createImportExternalId(input: {
  externalId?: string | undefined;
  title: string;
  company: string;
  city?: string | undefined;
  state?: string | undefined;
  applicationUrl?: string | undefined;
}): string {
  const provided = input.externalId?.trim();
  if (provided) return provided;
  const fingerprint = [input.title, input.company, input.city ?? "", input.state ?? "", input.applicationUrl ?? ""]
    .map((part) => normalizeText(part))
    .join("|");
  return `SLZ-${createHash("sha256").update(fingerprint).digest("hex").slice(0, 10).toUpperCase()}`;
}

export function buildContentDuplicateHash(input: {
  title: string;
  company: string;
  city: string;
  state: string;
}): string {
  return createHash("sha256")
    .update([input.title, input.company, input.city, input.state].map((part) => normalizeText(part)).join("|"))
    .digest("hex");
}

export function formatImportRowErrors(issues: z.ZodIssue[]): string[] {
  return issues.map((issue) => {
    const path = issue.path.length ? `${issue.path.join(".")}: ` : "";
    return `${path}${issue.message}`;
  });
}

export const importAliases: Record<string, string[]> = {
  externalId: ["id", "codigo externo", "código externo", "externalid", "id externo", "external_id"],
  originalTitle: ["titulo original", "título original", "original title"],
  title: ["titulo", "título", "title", "vaga", "cargo", "titulo publico", "título público"],
  company: ["empresa", "companhia", "company"],
  description: ["descricao", "descrição", "description", "descricao completa", "descrição completa"],
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
  applicationUrl: [
    "candidaturaurl",
    "candidatura url",
    "link",
    "applicationurl",
    "applyurl",
    "url candidatura",
    "url da candidatura",
    "link de candidatura"
  ],
  applicationEmail: ["candidaturaemail", "candidatura email", "email", "e-mail", "applicationemail"],
  applicationWhatsapp: ["candidaturawhatsapp", "candidatura whatsapp", "whatsapp", "telefone", "celular"],
  whatsappMessage: ["mensagemwhatsapp", "mensagem whatsapp", "whatsappmessage"],
  emailSubject: ["assuntoemail", "assunto email", "emailsubject"],
  applicationInstructions: [
    "instrucoescandidatura",
    "instruções candidatura",
    "instrucoes candidatura",
    "applicationinstructions"
  ],
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
  return Object.fromEntries(
    Object.entries(importAliases)
      .map(([field, names]) => [field, names.map(normalizeHeader).map((name) => normalized.get(name)).find(Boolean)])
      .filter((entry): entry is [string, string] => typeof entry[1] === "string")
  );
}

export function normalizeImportRow(row: Record<string, unknown>) {
  const normalizedEntries = new Map(
    Object.entries(row).map(([key, value]) => [normalizeHeader(key), value])
  );
  return Object.fromEntries(
    Object.entries(importAliases)
      .map(([field, names]) => [
        field,
        names
          .map(normalizeHeader)
          .map((name) => normalizedEntries.get(name))
          .find((value) => value !== undefined && value !== "")
      ])
      .filter(([, value]) => value !== undefined)
  );
}

export function shouldSkipImportRow(row: Record<string, unknown>) {
  return isTemplateExampleRow(row) || Object.values(row).every((value) => String(value ?? "").trim() === "");
}
