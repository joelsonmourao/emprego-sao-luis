export type ApplicationChannelType = "URL" | "WHATSAPP" | "EMAIL";

export type ChannelValidation = {
  original: string | null;
  normalized: string | null;
  valid: boolean;
  reason: string | null;
};

// eslint-disable-next-line no-control-regex -- intentionally rejects control chars in candidacy inputs
const CONTROL_OR_SCRIPT = /[\u0000-\u001f\u007f<>`{}]|(?:javascript|data|vbscript):/i;

export function normalizeApplicationUrl(value: unknown): ChannelValidation {
  const original = typeof value === "string" ? value.trim() : "";
  if (!original) return { original: null, normalized: null, valid: false, reason: "URL não informada." };
  if (CONTROL_OR_SCRIPT.test(original))
    return { original, normalized: null, valid: false, reason: "URL contém protocolo ou caracteres inseguros." };
  try {
    const url = new URL(original);
    if (!['http:', 'https:'].includes(url.protocol))
      return { original, normalized: null, valid: false, reason: "Use apenas URL HTTP ou HTTPS." };
    url.username = "";
    url.password = "";
    return { original, normalized: url.toString(), valid: true, reason: null };
  } catch {
    return { original, normalized: null, valid: false, reason: "URL de candidatura inválida." };
  }
}

export function normalizeApplicationEmail(value: unknown): ChannelValidation {
  const original = typeof value === "string" ? value.trim() : "";
  if (!original) return { original: null, normalized: null, valid: false, reason: "E-mail não informado." };
  if (CONTROL_OR_SCRIPT.test(original) || /[\r\n]/.test(original))
    return { original, normalized: null, valid: false, reason: "E-mail contém caracteres inseguros." };
  const parts = original.split("@");
  if (parts.length !== 2)
    return { original, normalized: null, valid: false, reason: "Formato de e-mail inválido." };
  const local = parts[0]!;
  const domain = parts[1]!;
  const normalized = `${local.trim()}@${domain.trim().toLowerCase()}`;
  const valid =
    normalized.length <= 254 &&
    local.length > 0 &&
    local.length <= 64 &&
    /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$/i.test(normalized);
  return {
    original,
    normalized: valid ? normalized : null,
    valid,
    reason: valid ? null : "Formato de e-mail inválido."
  };
}

export function normalizeApplicationWhatsapp(value: unknown): ChannelValidation {
  const original = typeof value === "string" ? value.trim() : "";
  if (!original) return { original: null, normalized: null, valid: false, reason: "WhatsApp não informado." };
  if (/[A-Za-z<>]/.test(original))
    return { original, normalized: null, valid: false, reason: "WhatsApp deve conter apenas número e máscara." };

  let digits = original.replace(/\D/g, "");
  const explicitlyInternational = original.startsWith("+") || original.startsWith("00");
  if (original.startsWith("00")) digits = digits.slice(2);

  if (/^(\d)\1+$/.test(digits))
    return { original, normalized: null, valid: false, reason: "Número repetido não é válido." };

  if (!explicitlyInternational && (digits.length === 10 || digits.length === 11)) digits = `55${digits}`;

  let valid = /^\d{10,15}$/.test(digits);
  if (digits.startsWith("55")) {
    const national = digits.slice(2);
    const ddd = Number(national.slice(0, 2));
    valid = (national.length === 10 || national.length === 11) && ddd >= 11 && ddd <= 99;
  }
  return {
    original,
    normalized: valid ? digits : null,
    valid,
    reason: valid ? null : "Informe código do país, DDD e número em formato válido."
  };
}

export function defaultWhatsappMessage(title: string) {
  return `Olá! Tenho interesse na vaga de ${title.trim()} divulgada no Empregos São Luís.`;
}

export function defaultEmailSubject(title: string) {
  return `Candidatura – ${title.trim()}`;
}

export function buildWhatsappUrl(number: string, message: string) {
  const normalized = normalizeApplicationWhatsapp(number);
  if (!normalized.valid || !normalized.normalized) return null;
  return `https://wa.me/${normalized.normalized}?text=${encodeURIComponent(message.trim())}`;
}

export function buildMailtoUrl(email: string, subject: string) {
  const normalized = normalizeApplicationEmail(email);
  if (!normalized.valid || !normalized.normalized) return null;
  return `mailto:${normalized.normalized}?subject=${encodeURIComponent(subject.trim())}`;
}

export function validateApplicationChannels(input: {
  applicationUrl?: unknown;
  applicationEmail?: unknown;
  applicationWhatsapp?: unknown;
}) {
  const url = normalizeApplicationUrl(input.applicationUrl);
  const email = normalizeApplicationEmail(input.applicationEmail);
  const whatsapp = normalizeApplicationWhatsapp(input.applicationWhatsapp);
  const validTypes: ApplicationChannelType[] = [];
  if (url.valid) validTypes.push("URL");
  if (whatsapp.valid) validTypes.push("WHATSAPP");
  if (email.valid) validTypes.push("EMAIL");
  return { url, email, whatsapp, validTypes, valid: validTypes.length > 0 };
}
