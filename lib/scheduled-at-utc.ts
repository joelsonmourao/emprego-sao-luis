import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { SITE_TIME_ZONE, normalizeScheduledAtValue } from "@/lib/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

/**
 * Converte valor de planilha (texto, numero Excel, ISO) para instante UTC,
 * interpretando data/hora "sem fuso" como relogio de Brasilia (America/Sao_Paulo).
 */
export function parseScheduledAtInputToUtc(value: unknown): Date | null {
  const key = normalizeScheduledAtValue(value);
  if (!key) {
    return null;
  }

  const parsed = dayjs.tz(key, "YYYY-MM-DD HH:mm:ss", SITE_TIME_ZONE);
  return parsed.isValid() ? parsed.toDate() : null;
}
