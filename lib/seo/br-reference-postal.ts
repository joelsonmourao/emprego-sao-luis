/**
 * CEP de referência (área central da capital) por UF.
 * Usado apenas quando a vaga não possui CEP cadastrado: aproxima região para JobPosting.
 * Prefira enriquecer o cadastro com CEP real da unidade quando disponível.
 */
export const REFERENCE_CAPITAL_POSTAL_BY_UF: Record<string, string> = {
  AC: "69900-064",
  AL: "57020-570",
  AM: "69005-000",
  AP: "68900-073",
  BA: "40026-010",
  CE: "60025-061",
  DF: "70040-902",
  ES: "29010-902",
  GO: "74810-120",
  MA: "65010-440",
  MG: "30112-000",
  MS: "79002-081",
  MT: "78005-000",
  PA: "66010-902",
  PB: "58013-000",
  PE: "50030-230",
  PI: "64000-020",
  PR: "80010-000",
  RJ: "20040-020",
  RN: "59064-600",
  RO: "78900-000",
  RR: "69301-000",
  RS: "90010-905",
  SC: "88010-400",
  SE: "49010-900",
  SP: "01310-100",
  TO: "77001-092"
};

/** Sobrescritas por `UF:citySlug` (ex.: `SP:franca`). */
const CITY_POSTAL_OVERRIDES: Record<string, string> = {
  "SP:franca": "14401-360",
  "SP:sao-paulo": "01310-100",
  "MA:sao-luis": "65010-440",
  "MA:imperatriz": "65900-000",
  "CE:fortaleza": "60025-061"
};

export type ReferencePostalInput = {
  stateCode: string;
  citySlug: string;
};

export function getReferencePostalCodeForCity(input: ReferencePostalInput): string {
  const uf = input.stateCode.trim().toUpperCase();
  const slug = input.citySlug.trim().toLowerCase();
  const override = CITY_POSTAL_OVERRIDES[`${uf}:${slug}`];
  if (override) return override;
  return REFERENCE_CAPITAL_POSTAL_BY_UF[uf] ?? "01001-000";
}
