const REMOVED_JOB_SLUGS = new Set<string>([
  // Adicione slugs removidos definitivamente para retornar HTTP 410.
]);

export function isRemovedJobSlug(slug: string) {
  return REMOVED_JOB_SLUGS.has(slug.trim().toLowerCase());
}
