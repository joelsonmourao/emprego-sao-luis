/** Chave estável para cache de localização (empresa + cidade + UF). */
export function normalizeCompanyNameForCache(companyName: string) {
  return companyName
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ");
}
