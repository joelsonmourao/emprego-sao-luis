const POI_ONLY_KEYWORDS = [
  "hub",
  "loja",
  "unidade",
  "filial",
  "matriz",
  "posto",
  "agencia",
  "agência",
  "shopping",
  "center",
  "centro de distribuicao",
  "centro de distribuição"
];

function normalizeForComparison(value: string | null | undefined) {
  return (value ?? "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenSet(value: string) {
  return new Set(
    normalizeForComparison(value)
      .split(" ")
      .filter((token) => token.length > 2)
  );
}

function tokenSimilarity(a: string, b: string) {
  const aTokens = tokenSet(a);
  const bTokens = tokenSet(b);
  if (!aTokens.size || !bTokens.size) return 0;

  let matches = 0;
  for (const token of aTokens) {
    if (bTokens.has(token)) matches += 1;
  }

  return matches / Math.min(aTokens.size, bTokens.size);
}

export function streetAddressLooksLikeCompanyName(streetAddress: string | null | undefined, companyName: string | null | undefined) {
  const street = normalizeForComparison(streetAddress);
  const company = normalizeForComparison(companyName);
  if (!street || !company) return false;

  return street === company || street.includes(company) || company.includes(street) || tokenSimilarity(street, company) >= 0.75;
}

export function streetAddressHasPoiOnlyKeyword(streetAddress: string | null | undefined) {
  const street = normalizeForComparison(streetAddress);
  if (!street) return false;
  return POI_ONLY_KEYWORDS.some((keyword) => street.includes(normalizeForComparison(keyword)));
}

export function buildStructuredStreetAddress(input: {
  street?: string | null;
  houseNumber?: string | null;
  companyName?: string | null;
}) {
  const street = input.street?.trim();
  const houseNumber = input.houseNumber?.trim();
  if (!street) return null;

  const streetAddress = houseNumber ? `${street}, ${houseNumber}` : street;
  if (streetAddressLooksLikeCompanyName(streetAddress, input.companyName)) return null;
  if (streetAddressHasPoiOnlyKeyword(streetAddress)) return null;

  return streetAddress;
}

export function isInvalidCachedStreetAddress(streetAddress: string | null | undefined, companyName: string | null | undefined) {
  if (!streetAddress?.trim()) return false;
  return streetAddressLooksLikeCompanyName(streetAddress, companyName) || streetAddressHasPoiOnlyKeyword(streetAddress);
}
