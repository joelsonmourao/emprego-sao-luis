export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 150);
}

export function suggestJobSlug(title: string, city?: string, stateCode?: string) {
  const base = slugify([title, city, stateCode].filter(Boolean).join(" "));
  return base || "vaga";
}
