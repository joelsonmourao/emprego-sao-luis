/**
 * Datas e horários no fuso America/Sao_Paulo.
 * Instantes no banco continuam em UTC (timestamptz); conversão explícita na borda (schema, UI, regras).
 */
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { SITE_TIME_ZONE } from "@/lib/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

const TZ = SITE_TIME_ZONE;

/** Agora como dayjs no fuso do Brasil (parede). */
export function getBrazilNow() {
  return dayjs().tz(TZ);
}

/** Instante atual (UTC) — use para comparar timestamps do Prisma. */
export function getInstantNow(): Date {
  return new Date();
}

export function toBrazilWall(input: string | Date | null | undefined) {
  if (input == null || input === "") return null;
  const d = dayjs(input);
  if (!d.isValid()) return null;
  return d.tz(TZ);
}

/**
 * Converte instante armazenado (UTC) para string ISO com offset de Brasília
 * (ex.: 2026-04-29T10:30:00-03:00). Não usa toISOString() (UTC).
 */
export function toBrazilIsoWithOffset(input: string | Date): string | undefined {
  const wall = toBrazilWall(input);
  if (!wall) return undefined;
  return wall.format("YYYY-MM-DDTHH:mm:ss") + formatBrazilNumericOffset(wall);
}

function formatBrazilNumericOffset(wall: dayjs.Dayjs) {
  const off = wall.utcOffset();
  const sign = off >= 0 ? "+" : "-";
  const abs = Math.abs(off);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `${sign}${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Fim do dia (23:59:59.999) no calendário do Brasil para o instante/calendário informado. */
export function endOfDayBrazil(input: string | Date): Date {
  return dayjs(input).tz(TZ).endOf("day").toDate();
}

/** Adiciona N dias no calendário do Brasil e retorna o fim desse dia no Brasil. */
export function addCalendarDaysBrazilEnd(input: string | Date, days: number): Date {
  return dayjs(input).tz(TZ).add(days, "day").endOf("day").toDate();
}

/** Data efetiva de término público: validThrough, senão expiresAt, senão +90 dias (fim do dia BR). */
export function getEffectiveJobDeadlineUtc(input: {
  publishedAt: Date | string;
  validThrough: Date | string | null | undefined;
  expiresAt: Date | string | null | undefined;
}): Date {
  const published = dayjs(input.publishedAt);
  if (!published.isValid()) {
    return addCalendarDaysBrazilEnd(new Date(), 90);
  }

  const vt = input.validThrough != null ? dayjs(input.validThrough) : null;
  if (vt && vt.isValid()) {
    return vt.toDate();
  }

  const ex = input.expiresAt != null ? dayjs(input.expiresAt) : null;
  if (ex && ex.isValid()) {
    return ex.toDate();
  }

  return addCalendarDaysBrazilEnd(input.publishedAt, 90);
}

/** Vaga vencida quando o instante atual é depois do prazo efetivo (instante UTC). */
export function isExpiredBrazil(job: {
  publishedAt: Date | string;
  validThrough: Date | string | null | undefined;
  expiresAt: Date | string | null | undefined;
}) {
  return getInstantNow().getTime() > getEffectiveJobDeadlineUtc(job).getTime();
}

/** String ISO do fim do dia BR correspondente ao instante do prazo (para schema validThrough). */
export function normalizeValidThroughSchemaString(input: {
  publishedAt: Date | string;
  validThrough: Date | string | null | undefined;
  expiresAt: Date | string | null | undefined;
}) {
  const deadline = getEffectiveJobDeadlineUtc(input);
  const end = dayjs(deadline).tz(TZ).endOf("day");
  return end.format("YYYY-MM-DDTHH:mm:ss") + formatBrazilNumericOffset(end);
}

/**
 * datePosted para JobPosting: mesmo instante do banco, formatado no offset do Brasil.
 */
export function normalizeDatePostedForSchema(input: string | Date | null | undefined): string | undefined {
  if (input == null || input === "") return undefined;
  return toBrazilIsoWithOffset(typeof input === "string" ? input : input);
}

const NAIVE_PARSE_FORMATS = [
  "YYYY-MM-DDTHH:mm:ss",
  "YYYY-MM-DD HH:mm:ss",
  "YYYY-MM-DDTHH:mm",
  "YYYY-MM-DD HH:mm",
  "YYYY-MM-DD",
  "DD/MM/YYYY HH:mm:ss",
  "DD/MM/YYYY HH:mm",
  "DD/MM/YYYY"
];

/**
 * Planilha/campo sem fuso: interpreta como horário de Brasília e grava o instante UTC correto.
 * Strings já com Z ou +/-offset usam o interpretador nativo.
 */
export function parseFlexibleDateToUtc(value: string | undefined | null): Date | null {
  if (!value?.trim()) return null;

  const s = value.trim();
  if (/[zZ]$|[+-]\d{2}:?\d{2}$/.test(s)) {
    const native = new Date(s);
    return Number.isNaN(native.getTime()) ? null : native;
  }

  const normalized = s.includes(" ") && !s.includes("T") ? s.replace(" ", "T") : s;

  for (const fmt of NAIVE_PARSE_FORMATS) {
    const d = dayjs.tz(normalized, fmt, TZ);
    if (d.isValid()) {
      return d.utc().toDate();
    }
  }

  const fallback = new Date(s);
  if (!Number.isNaN(fallback.getTime())) {
    // #region agent log
    fetch("http://127.0.0.1:7370/ingest/b54ed65d-267c-4421-b3af-1ea0f3df3748", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "582712" },
      body: JSON.stringify({
        sessionId: "582712",
        runId: "date-parse",
        hypothesisId: "H_TZ_FALLBACK",
        location: "lib/date-utils.ts",
        message: "Data parseada com fallback nativo (verificar formato)",
        data: { raw: s.slice(0, 80) },
        timestamp: Date.now()
      })
    }).catch(() => {});
    // #endregion
    return fallback;
  }

  // #region agent log
  fetch("http://127.0.0.1:7370/ingest/b54ed65d-267c-4421-b3af-1ea0f3df3748", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "582712" },
    body: JSON.stringify({
      sessionId: "582712",
      runId: "date-parse",
      hypothesisId: "H_TZ_INVALID",
      location: "lib/date-utils.ts",
      message: "Data invalida na entrada",
      data: { raw: s.slice(0, 80) },
      timestamp: Date.now()
    })
  }).catch(() => {});
  // #endregion

  return null;
}

export function formatBrazilDate(input: string | Date | null | undefined) {
  const d = input == null ? null : typeof input === "string" ? new Date(input) : input;
  if (!d || Number.isNaN(d.getTime())) return "Data indisponivel";
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: TZ,
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(d);
}

export function formatBrazilDateLong(input: string | Date | null | undefined) {
  const d = input == null ? null : typeof input === "string" ? new Date(input) : input;
  if (!d || Number.isNaN(d.getTime())) return "Data indisponivel";
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: TZ,
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(d);
}

export function formatBrazilDateTime(input: string | Date | null | undefined) {
  const d = input == null ? null : typeof input === "string" ? new Date(input) : input;
  if (!d || Number.isNaN(d.getTime())) return "Data indisponivel";
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: TZ,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(d);
}

/** Calendário YYYY-MM-DD no fuso Brasil (útil para export CSV). */
export function formatBrazilCalendarDate(input: string | Date | null | undefined) {
  const w = input == null ? null : toBrazilWall(input);
  return w ? w.format("YYYY-MM-DD") : "";
}
