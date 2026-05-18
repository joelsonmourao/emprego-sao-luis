const INVALID_SALARY_TEXT = new Set([
  "a combinar",
  "nao informado",
  "não informado",
  "nao divulgado",
  "não divulgado",
  "indeterminado",
  "indefinido",
  "s/d",
  "n/d",
  "—",
  "-"
]);

/**
 * Converte salaryMin da planilha/banco para número do schema JobPosting.baseSalary.
 * Retorna null quando o valor não é confiável (omitir baseSalary).
 */
export function parseSalaryMinForJobPostingSchema(value: number | string | null | undefined): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) && value > 0 ? value : null;
  }

  if (value == null) return null;

  const raw = String(value).trim();
  if (!raw) return null;

  const low = raw.toLowerCase();
  if (INVALID_SALARY_TEXT.has(low)) return null;

  const digitsOnly = raw.replace(/\D/g, "");
  if (!digitsOnly) return null;

  let normalized = raw.replace(/r\$\s*/gi, "").trim();

  if (normalized.includes(",") && normalized.includes(".")) {
    normalized = normalized.replace(/\./g, "").replace(",", ".");
  } else if (normalized.includes(",")) {
    normalized = normalized.replace(",", ".");
  }

  normalized = normalized.replace(/[^\d.]/g, "");
  const parsed = Number.parseFloat(normalized);

  if (!Number.isFinite(parsed) || parsed <= 0) return null;

  return parsed;
}
