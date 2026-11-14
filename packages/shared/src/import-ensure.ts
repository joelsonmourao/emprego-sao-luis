/** Empresa confidencial da planilha → usa contratante não identificada. */
export function isConfidentialCompanyName(name: string): boolean {
  const normalized = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
  if (!normalized) return true;
  return (
    normalized.includes("confidencial") ||
    normalized.includes("nao identific") ||
    normalized.includes("nao informad") ||
    normalized === "sigilo" ||
    normalized === "a definir"
  );
}

export function normalizeEntityKey(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}
