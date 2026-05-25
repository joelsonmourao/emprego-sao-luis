export const BRAZIL_TIME_ZONE = "America/Fortaleza";

/** Fuso do portal e da planilha de publicacao: sempre Brasilia (nao configuravel por env). */
export const SITE_TIME_ZONE = BRAZIL_TIME_ZONE;

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

function formatPart(value: number) {
  return TWO_DIGITS.format(value);
}

function partsToKey(parts: DateTimeParts) {
  return `${parts.year}-${formatPart(parts.month)}-${formatPart(parts.day)} ${formatPart(parts.hour)}:${formatPart(parts.minute)}:${formatPart(parts.second)}`;
}

export function getNowInSiteTimeZone() {
  return new Date();
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
    hour12: false
  });

  const values = Object.fromEntries(
    formatter
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number(part.value)])
  ) as Record<string, number>;

  return {
    year: values.year,
    month: values.month,
    day: values.day,
    hour: values.hour,
    minute: values.minute,
    second: values.second
  };
}

export function formatDateTimeKeyInTimeZone(date: Date, timeZone = SITE_TIME_ZONE) {
  return partsToKey(getDateTimePartsInTimeZone(date, timeZone));
}

export function formatDateTimeLabelInTimeZone(date: Date, timeZone = SITE_TIME_ZONE) {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone,
    dateStyle: "short",
    timeStyle: "medium"
  }).format(date);
}

export function formatDateTimeSpreadsheetValue(date: Date, timeZone = SITE_TIME_ZONE) {
  const parts = getDateTimePartsInTimeZone(date, timeZone);
  return `${formatPart(parts.day)}/${formatPart(parts.month)}/${parts.year} ${formatPart(parts.hour)}:${formatPart(parts.minute)}:${formatPart(parts.second)}`;
}

export function formatDateTimeSpreadsheetValueMinutes(date: Date, timeZone = SITE_TIME_ZONE) {
  const parts = getDateTimePartsInTimeZone(date, timeZone);
  return `${formatPart(parts.day)}/${formatPart(parts.month)}/${parts.year} ${formatPart(parts.hour)}:${formatPart(parts.minute)}`;
}

function buildDateFromLocalParts(parts: DateTimeParts) {
  return new Date(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
}

function parsePartsFromString(value: string): DateTimeParts | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const isoLike = trimmed.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/
  );

  if (isoLike) {
    return {
      year: Number(isoLike[1]),
      month: Number(isoLike[2]),
      day: Number(isoLike[3]),
      hour: Number(isoLike[4] ?? 0),
      minute: Number(isoLike[5] ?? 0),
      second: Number(isoLike[6] ?? 0)
    };
  }

  const brLike = trimmed.match(
    /^(\d{2})\/(\d{2})\/(\d{4})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/
  );

  if (brLike) {
    return {
      year: Number(brLike[3]),
      month: Number(brLike[2]),
      day: Number(brLike[1]),
      hour: Number(brLike[4] ?? 0),
      minute: Number(brLike[5] ?? 0),
      second: Number(brLike[6] ?? 0)
    };
  }

  return null;
}

export function normalizeScheduledAtValue(value: unknown, timeZone = SITE_TIME_ZONE) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return formatDateTimeKeyInTimeZone(value, timeZone);
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    const wholeDays = Math.floor(value);
    const dayFraction = value - wholeDays;
    const base = new Date(Date.UTC(1899, 11, 30 + wholeDays));

    const totalSeconds = Math.round(dayFraction * 24 * 60 * 60);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return partsToKey({
      year: base.getUTCFullYear(),
      month: base.getUTCMonth() + 1,
      day: base.getUTCDate(),
      hour: Math.max(0, Math.min(23, hours)),
      minute: Math.max(0, Math.min(59, minutes)),
      second: Math.max(0, Math.min(59, seconds))
    });
  }

  const stringValue = String(value).trim();
  if (!stringValue) return null;

  if (/[zZ]|[+-]\d{2}:\d{2}$/.test(stringValue)) {
    const parsedDate = new Date(stringValue);
    if (!Number.isNaN(parsedDate.getTime())) {
      return formatDateTimeKeyInTimeZone(parsedDate, timeZone);
    }
  }

  const localParts = parsePartsFromString(stringValue);
  if (localParts) {
    return partsToKey(localParts);
  }

  const parsedDate = new Date(stringValue);
  if (!Number.isNaN(parsedDate.getTime())) {
    return formatDateTimeKeyInTimeZone(parsedDate, timeZone);
  }

  return null;
}

export function compareDateTimeKeys(left: string, right: string) {
  return left.localeCompare(right);
}

export function toWorkbookDateTimeValue(value: Date | string | null | undefined, timeZone = SITE_TIME_ZONE) {
  if (!value) return "";

  if (typeof value === "string") {
    const normalized = normalizeScheduledAtValue(value, timeZone);
    if (!normalized) {
      return value;
    }

    const parsed = parseScheduledKeyToDate(normalized);
    return parsed ? formatDateTimeSpreadsheetValue(parsed, timeZone) : value;
  }

  return formatDateTimeSpreadsheetValue(value, timeZone);
}

export function parseScheduledKeyToDate(value: string) {
  const parts = parsePartsFromString(value);
  return parts ? buildDateFromLocalParts(parts) : null;
}

export function formatScheduledAtDisplay(value: unknown, timeZone = SITE_TIME_ZONE) {
  const normalized = normalizeScheduledAtValue(value, timeZone);
  if (!normalized) return "";
  const parsed = parseScheduledKeyToDate(normalized);
  if (!parsed) return "";
  return formatDateTimeSpreadsheetValueMinutes(parsed, timeZone);
}
