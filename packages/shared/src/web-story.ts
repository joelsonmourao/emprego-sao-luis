export type WebStoryPage = {
  order: number;
  headline: string;
  body?: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
};

export type WebStoryInput = {
  title: string;
  slug: string;
  articleId?: string | null;
  authorId?: string | null;
  reviewerId?: string | null;
  status?: string | null;
  pages: WebStoryPage[];
  posterUrl?: string | null;
  posterAlt?: string | null;
  canonicalUrl?: string | null;
  ctaUrl?: string | null;
  sourceArticleEligible?: boolean;
};

const slugOk = (slug: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);

export function validateWebStory(input: WebStoryInput) {
  const errors: string[] = [];
  if (!input.title.trim() || input.title.trim().length < 8) errors.push("Título da Web Story insuficiente.");
  if (!slugOk(input.slug)) errors.push("Slug inválido.");
  if (!input.authorId) errors.push("Autor obrigatório.");
  if (!input.articleId) errors.push("Web Story deve partir de um artigo de origem.");
  if (!input.sourceArticleEligible) errors.push("Artigo de origem precisa estar marcado como elegível e aprovado.");
  if (!input.posterUrl || !input.posterAlt) errors.push("Poster com texto alternativo é obrigatório.");
  if (!input.canonicalUrl) errors.push("Canonical próprio é obrigatório.");
  if (!Array.isArray(input.pages) || input.pages.length < 3) errors.push("São necessárias ao menos 3 páginas narrativas.");
  if (input.pages.some((page) => !page.headline?.trim())) errors.push("Todas as páginas precisam de título.");
  if (input.pages.some((page) => page.imageUrl && !page.imageAlt)) errors.push("Imagens de página exigem alt text.");
  const orders = input.pages.map((page) => page.order);
  if (new Set(orders).size !== orders.length) errors.push("Ordens de página duplicadas.");
  if (["APPROVED", "SCHEDULED", "PUBLISHED"].includes(input.status ?? "") && !input.reviewerId) {
    errors.push("Revisor obrigatório para aprovação ou publicação.");
  }
  if (input.status === "PUBLISHED" && errors.length) {
    errors.push("Publicação bloqueada enquanto houver erros de validação.");
  }
  return {
    valid: errors.length === 0,
    errors,
    autoPublishAllowed: false
  };
}

export function canDuplicateWebStoryAsDraft(status: string) {
  return ["DRAFT", "PENDING_REVIEW", "APPROVED", "SCHEDULED", "PUBLISHED", "REJECTED", "ARCHIVED"].includes(status);
}
