/**
 * Título vindo da planilha: só limpeza leve (espaços, quebras, caracteres de controle).
 * Não inventa cargo/área; remove numeração no início do título.
 */
function foldKey(s: string) {
  return s
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function titleAlreadyContainsCityAndUf(title: string, cityName: string, uf: string) {
  const t = foldKey(title);
  const c = foldKey(cityName.trim().replace(/\s+/g, " "));
  if (!c || !t.includes(c)) return false;
  const safeUf = uf.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&").toUpperCase();
  return new RegExp(`\\b${safeUf}\\b`, "i").test(title);
}

/**
 * Título público tipo planilha: `Jovem Aprendiz São Paulo / SP`.
 * Se já houver cidade e UF no texto, mantém só a limpeza.
 */
export function ensureSpreadsheetTitleWithCitySlashUf(rawTitle: string, cityName: string, stateCode: string): string {
  const city = cityName.trim().replace(/\s+/g, " ");
  const uf = stateCode.trim().toUpperCase();
  const base = sanitizeSpreadsheetTitle(rawTitle);
  if (!city || !uf) return base || "";
  if (!base.trim()) return `${city} / ${uf}`.trim();
  if (titleAlreadyContainsCityAndUf(base, city, uf)) return base;
  return `${base} ${city} / ${uf}`.replace(/\s+/g, " ").trim();
}

export function sanitizeSpreadsheetTitle(raw: string): string {
  let s = raw.replace(/\r\n|\r|\n/g, " ").replace(/\s+/g, " ").trim();
  s = s.replace(/^[\u200B-\u200D\uFEFF]+|[\u200B-\u200D\uFEFF]+$/g, "");
  s = s.replace(/^\s*(?:\d{1,4}\s*[\.\)\-–—]\s*|\(\s*\d{1,4}\s*\)\s*)/, "");
  return s.replace(/\s+/g, " ").trim();
}

/**
 * Extrai cargo curto para schema JobPosting.title quando `jobTitle` não está preenchido.
 * Prioriza cargos conhecidos no início; evita cidade/UF/salário quando possível.
 */
export function extractJobTitle(fullTitle: string): string {
  const t = sanitizeSpreadsheetTitle(fullTitle);
  if (!t) return "";

  const lower = t.toLowerCase();
  const known = [
    { needle: "jovem aprendiz", len: "jovem aprendiz".length },
    { needle: "menor aprendiz", len: "menor aprendiz".length },
    { needle: "aprendiz", len: "aprendiz".length }
  ] as const;

  for (const { needle, len } of known) {
    if (lower.startsWith(needle)) {
      const slice = t.slice(0, len).trim();
      if (slice) return slice;
    }
  }

  const firstSegment = t.split(/\s+(?:em|na|no|[,|/]|-|–|—)\s+/i)[0]?.trim() ?? t;
  return firstSegment
    .replace(/\s+R\$\s*[\d\.\,]+.*$/i, "")
    .replace(/\s+\d{1,3}(?:\.\d{3})+(?:,\d{2})?\s*$/i, "")
    .replace(/\s+\b[A-Z]{2}\s*$/i, "")
    .trim();
}

const POLLUTED_HINTS = [/\bR\$\s*\d/i, /\bcód\.?\s*\d/i, /\bcodigo\s*\d/i, /\b\d{4,}\b/];

/** Heurística: título de vaga com salário, código longo ou padrões promocionais claros. */
export function jobPostingSchemaTitleLooksPolluted(title: string): boolean {
  const t = title.trim();
  if (!t) return true;
  if (POLLUTED_HINTS.some((re) => re.test(t))) return true;
  return false;
}
