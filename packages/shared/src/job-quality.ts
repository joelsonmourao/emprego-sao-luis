import { validateApplicationChannels } from "./application-channels.js";

export type PublicationQualityInput = {
  title: string;
  companyName: string;
  description: string;
  cityName: string;
  stateCode: string;
  categoryName?: string | null;
  sourceName: string;
  sourceUrl?: string | null;
  applicationUrl?: string | null;
  applicationEmail?: string | null;
  applicationWhatsapp?: string | null;
  applicationUrlStatus?: string | null;
  verificationStatus?: string | null;
  publicationStatus?: string | null;
  expiresAt?: Date | null;
  duplicate?: boolean;
};

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
const TEST_PATTERNS = [/^test(e|ando)?\b/i, /^vaga\s+(de\s+)?teste/i, /^lorem\b/i, /^asdf/i, /^qwerty/i, /^x{3,}$/i, /^s?q+s?q*s?$/i];
const STOP = new Set(["de", "da", "do", "das", "dos", "e", "em", "para", "com", "a", "o"]);

export function evaluateJobPublication(input: PublicationQualityInput) {
  const errors: string[] = [];
  const warnings: string[] = [];
  const title = input.title.trim();
  const description = input.description.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const channels = validateApplicationChannels(input);

  if (title.length < 5 || TEST_PATTERNS.some((pattern) => pattern.test(title)) || new Set(normalize(title)).size < 3)
    errors.push("Título parece ser teste, ruído ou está incompleto.");
  if (description.length < 120) errors.push("Descrição precisa ter ao menos 120 caracteres para publicação.");
  if (!input.companyName.trim() || TEST_PATTERNS.some((pattern) => pattern.test(input.companyName.trim()))) errors.push("Empresa inválida ou de teste.");
  if (!input.cityName.trim() || !/^[A-Z]{2}$/.test(input.stateCode.trim().toUpperCase())) errors.push("Cidade e UF precisam estar confirmadas.");
  if (!input.sourceName.trim() || TEST_PATTERNS.some((pattern) => pattern.test(input.sourceName.trim()))) errors.push("Fonte ausente ou incompatível.");
  if (!channels.valid) errors.push("Informe ao menos uma candidatura válida por site, WhatsApp ou e-mail.");
  if (input.applicationUrlStatus === "CLOSED") errors.push("A URL de candidatura foi identificada como encerrada.");
  if (input.duplicate) errors.push("A vaga foi identificada como duplicada.");
  if (input.expiresAt && input.expiresAt <= new Date()) errors.push("A data de encerramento já passou.");
  if (["APPROVED", "SCHEDULED", "PUBLISHED"].includes(input.publicationStatus ?? "") && !input.expiresAt)
    errors.push("Informe uma data de encerramento antes de aprovar ou publicar.");
  if (input.publicationStatus === "PUBLISHED" && input.verificationStatus === "NEEDS_REVIEW")
    errors.push("Uma vaga que precisa de revisão não pode ser publicada.");

  const titleTokens = normalize(title).split(/\W+/).filter((token) => token.length >= 4 && !STOP.has(token));
  if (titleTokens.length && !titleTokens.some((token) => normalize(description).includes(token)))
    errors.push("Título e descrição não apresentam correspondência suficiente.");
  if (!input.categoryName) warnings.push("Categoria ausente; a vaga continuará válida na listagem geral.");

  const status = errors.length ? "REJECTED" : warnings.length ? "NEEDS_REVIEW" : "READY_FOR_REVIEW";
  return { valid: errors.length === 0, status, errors, warnings, channels } as const;
}
