/**
 * Título público consistente (H1, meta, JSON-LD): usa o título da planilha se já incluir cidade e UF;
 * caso contrário monta `cargo em Cidade UF`.
 */
export function resolvePublicJobTitle(input: { title: string; seoTitle?: string | null; cityName: string; stateCode: string }) {
  const city = input.cityName.trim().replace(/\s+/g, " ");
  const uf = input.stateCode.trim().toUpperCase();
  const preferred = (input.seoTitle?.trim() && input.seoTitle.trim().length >= input.title.trim().length ? input.seoTitle : input.title).trim();

  if (titleContainsCityAndUf(preferred, city, uf)) {
    return squish(preferred);
  }

  const cargo = input.title.trim() || preferred;
  return squish(`${cargo} em ${city} ${uf}`);
}

function squish(s: string) {
  return s.replace(/\s+/g, " ").trim();
}

function titleContainsCityAndUf(title: string, city: string, uf: string) {
  const t = fold(title);
  const c = fold(city);
  if (!t.includes(c)) return false;
  const ufPattern = new RegExp(`\\b${uf}\\b`, "i");
  return ufPattern.test(title);
}

function fold(s: string) {
  return s
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
