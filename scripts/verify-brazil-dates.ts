/**
 * Verificação manual de fuso (America/Sao_Paulo). Rodar: npx tsx scripts/verify-brazil-dates.ts
 */
import {
  addCalendarDaysBrazilEnd,
  formatBrazilDateTime,
  getBrazilNow,
  normalizeDatePostedForSchema,
  normalizeValidThroughSchemaString,
  parseFlexibleDateToUtc
} from "../lib/date-utils";

function main() {
  const nowBr = getBrazilNow();
  console.log("Cenário 1 — agora no Brasil:", nowBr.format("YYYY-MM-DD HH:mm:ss Z"));

  const naive = "2026-04-28 23:59:59";
  const parsed = parseFlexibleDateToUtc(naive);
  console.log("Parse planilha sem offset (BR):", naive, "→", parsed?.toISOString());

  const posted = parseFlexibleDateToUtc("2026-04-28T23:59:59")!;
  const dp = normalizeDatePostedForSchema(posted);
  console.log("datePosted schema:", dp);

  const vt60 = normalizeValidThroughSchemaString({
    publishedAt: posted,
    validThrough: null,
    expiresAt: null
  });
  console.log("validThrough +90d fim dia BR (90 dias calendário a partir de published):", vt60);

  const endToday = addCalendarDaysBrazilEnd(posted, 60);
  console.log("addCalendarDaysBrazilEnd +60 (instante fim do dia):", endToday.toISOString());

  const sample = new Date("2026-04-29T13:30:00.000Z");
  console.log("Exibição BR de instante UTC 13:30Z:", formatBrazilDateTime(sample));
  console.log("datePosted schema desse instante:", normalizeDatePostedForSchema(sample));
}

main();
