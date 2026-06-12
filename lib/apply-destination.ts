export type ApplyDestinationType = "url" | "email" | "whatsapp" | "unknown";

export type ApplyDestination = {
  type: ApplyDestinationType;
  raw: string;
  value: string;
  display: string;
  href: string | null;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

const WHATSAPP_HOST_PATTERN = /wa\.me|whatsapp\.com|api\.whatsapp\.com/i;

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function normalizeBrazilPhoneDigits(input: string) {
  let digits = digitsOnly(input);
  if (!digits) return "";

  if (digits.startsWith("55") && digits.length >= 12) {
    digits = digits.slice(2);
  }

  if (digits.length === 10 || digits.length === 11) {
    return digits;
  }

  return "";
}

export function formatBrazilPhoneDisplay(digits: string) {
  const normalized = normalizeBrazilPhoneDigits(digits);
  if (!normalized) return digits;

  if (normalized.length === 11) {
    return `(${normalized.slice(0, 2)}) ${normalized.slice(2, 7)}-${normalized.slice(7)}`;
  }

  return `(${normalized.slice(0, 2)}) ${normalized.slice(2, 6)}-${normalized.slice(6)}`;
}

function buildWhatsAppHref(digits: string) {
  const normalized = normalizeBrazilPhoneDigits(digits);
  if (!normalized) return null;
  return `https://wa.me/55${normalized}`;
}

function parseWhatsAppUrl(input: string): ApplyDestination | null {
  try {
    const url = new URL(input);
    const host = url.hostname.toLowerCase();

    if (host === "wa.me") {
      const phone = digitsOnly(url.pathname.replace(/^\//, ""));
      if (!phone) return null;
      const href = buildWhatsAppHref(phone) ?? input;
      return {
        type: "whatsapp",
        raw: input,
        value: phone,
        display: formatBrazilPhoneDisplay(phone),
        href
      };
    }

    if (host.includes("whatsapp.com") || host.includes("api.whatsapp.com")) {
      const phone = url.searchParams.get("phone") ?? "";
      const normalized = normalizeBrazilPhoneDigits(phone);
      if (!normalized) return null;
      return {
        type: "whatsapp",
        raw: input,
        value: normalized,
        display: formatBrazilPhoneDisplay(normalized),
        href: buildWhatsAppHref(normalized)
      };
    }
  } catch {
    return null;
  }

  return null;
}

export function parseApplyDestination(rawInput?: string | null): ApplyDestination {
  const raw = (rawInput ?? "").trim();

  if (!raw) {
    return { type: "unknown", raw: "", value: "", display: "", href: null };
  }

  if (raw.toLowerCase().startsWith("mailto:")) {
    const email = raw.slice(7).split("?")[0]?.trim() ?? "";
    if (EMAIL_PATTERN.test(email)) {
      return {
        type: "email",
        raw,
        value: email,
        display: email,
        href: `mailto:${email}`
      };
    }
  }

  if (EMAIL_PATTERN.test(raw)) {
    return {
      type: "email",
      raw,
      value: raw,
      display: raw,
      href: `mailto:${raw}`
    };
  }

  if (WHATSAPP_HOST_PATTERN.test(raw)) {
    const parsed = parseWhatsAppUrl(raw);
    if (parsed) return parsed;
  }

  const phoneDigits = normalizeBrazilPhoneDigits(raw);
  if (phoneDigits) {
    return {
      type: "whatsapp",
      raw,
      value: phoneDigits,
      display: formatBrazilPhoneDisplay(phoneDigits),
      href: buildWhatsAppHref(phoneDigits)
    };
  }

  if (/^https?:\/\//i.test(raw)) {
    return {
      type: "url",
      raw,
      value: raw,
      display: raw,
      href: raw
    };
  }

  return { type: "unknown", raw, value: raw, display: raw, href: null };
}

export function isValidApplyDestination(rawInput?: string | null) {
  return parseApplyDestination(rawInput).type !== "unknown";
}
