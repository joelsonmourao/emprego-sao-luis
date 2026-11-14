/** Fuso oficial do Emprego São Luís (persistência no banco continua em UTC/timestamptz). */
export const DEFAULT_SITE_TIME_ZONE = "America/Sao_Paulo";

function resolveSiteTimeZone(): string {
  const configured = (process.env.APP_TIME_ZONE || process.env.TZ || DEFAULT_SITE_TIME_ZONE).trim();
  try {
    Intl.DateTimeFormat("pt-BR", { timeZone: configured }).format(new Date());
    return configured;
  } catch {
    return DEFAULT_SITE_TIME_ZONE;
  }
}

export const SITE_TIME_ZONE = resolveSiteTimeZone();

type DateTimeParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

const TWO_DIGITS = new Intl.NumberFormat("en-US", {
  minimumIntegerDigits: 2,
  useGrouping: false
});

function pad(value: number) {
  return TWO_DIGITS.format(value);
}

export function getDateTimePartsInTimeZone(date: Date, timeZone = SITE_TIME_ZONE): DateTimeParts {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  });
  const parts = Object.fromEntries(formatter.formatToParts(date).map((part) => [part.type, part.value]));
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    second: Number(parts.second)
  };
}

/** Ex.: 21/07/2026, 18:42 */
export function formatDateTimePtBr(value: Date | string | null | undefined, timeZone = SITE_TIME_ZONE): string {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("pt-BR", {
    timeZone,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

/** Ex.: 21 de jul. de 2026 */
export function formatDatePtBr(value: Date | string | null | undefined, timeZone = SITE_TIME_ZONE): string {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("pt-BR", {
    timeZone,
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

/** Valor para `<input type="datetime-local">` no fuso do site. */
export function toDatetimeLocalValue(value: Date | null | undefined, timeZone = SITE_TIME_ZONE): string {
  if (!value || Number.isNaN(value.getTime())) return "";
  const parts = getDateTimePartsInTimeZone(value, timeZone);
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}T${pad(parts.hour)}:${pad(parts.minute)}`;
}

/**
 * Interpreta `YYYY-MM-DDTHH:mm` (ou com segundos) como relógio de parede em America/Sao_Paulo
 * e devolve o Instant UTC correspondente.
 */
export function fromDatetimeLocalValue(value: string, timeZone = SITE_TIME_ZONE): Date | null {
  const raw = value.trim();
  if (!raw) return null;
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (!match) {
    const fallback = new Date(raw);
    return Number.isNaN(fallback.getTime()) ? null : fallback;
  }
  const [, y, mo, d, h, mi, s = "0"] = match;
  const asUtcGuess = Date.UTC(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi), Number(s));
  // Ajusta o offset real do fuso naquele instante (UTC-3 sem DST no Brasil desde 2019).
  const probe = new Date(asUtcGuess);
  const parts = getDateTimePartsInTimeZone(probe, timeZone);
  const asLocalMs = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
  const offsetMs = asLocalMs - asUtcGuess;
  return new Date(asUtcGuess - offsetMs);
}
