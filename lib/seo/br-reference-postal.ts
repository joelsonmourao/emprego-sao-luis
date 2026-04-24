/** CEPs de referência por cidade (`UF:citySlug`). */
const CITY_POSTAL_OVERRIDES: Record<string, string> = {
  "SP:franca": "14401-360",
  "SP:sao-paulo": "01310-100",
  "SP:sao-jose-dos-campos": "12210-000",
  "SP:campinas": "13010-111",
  "MA:sao-luis": "65010-440",
  "MA:imperatriz": "65900-000",
  "CE:fortaleza": "60025-061"
};

export type ReferencePostalInput = {
  stateCode: string;
  citySlug: string;
};

export function getReferencePostalCodeForCity(input: ReferencePostalInput): string | null {
  const uf = input.stateCode.trim().toUpperCase();
  const slug = input.citySlug.trim().toLowerCase();
  const override = CITY_POSTAL_OVERRIDES[`${uf}:${slug}`];
  return override ?? null;
}
