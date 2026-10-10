export type EditorialIntent =
  | "informar"
  | "resolver"
  | "orientar"
  | "alertar"
  | "comparar"
  | "apresentar_dados"
  | "explicar_oportunidade"
  | "contextualizar_noticia";

export type PostMagneticoInput = {
  title: string;
  excerpt: string;
  contentHtml: string;
  directAnswer?: string | null;
  localHook?: string | null;
  intent?: string | null;
  pillarId?: string | null;
  clusterId?: string | null;
  sources?: unknown;
  sourceUrl?: string | null;
  coverImageUrl?: string | null;
  coverImageAlt?: string | null;
  authorId?: string | null;
  reviewerId?: string | null;
  faqJson?: unknown;
  candidateCta?: string | null;
  companyCta?: string | null;
  internalLinkCount?: number;
};

const plain = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
const hasLocalSignal = (value: string) =>
  /(são luís|sao luis|grande ilha|maranhão|maranhao|raposa|paço do lumiar|paco do lumiar|são josé de ribamar|sao jose de ribamar)/i.test(
    value
  );

function scoreDimension(ok: boolean, partial = false) {
  return ok ? 1 : partial ? 0.5 : 0;
}

export function scorePostMagnetico(input: PostMagneticoInput) {
  const body = plain(input.contentHtml);
  const sourcesCount = Array.isArray(input.sources) ? input.sources.length : input.sourceUrl ? 1 : 0;
  const faqCount = Array.isArray(input.faqJson) ? input.faqJson.length : 0;
  const local =
    hasLocalSignal(input.localHook ?? "") ||
    hasLocalSignal(input.directAnswer ?? "") ||
    hasLocalSignal(body) ||
    hasLocalSignal(input.title);
  const dimensions = {
    originalidade: scoreDimension(body.length >= 1200, body.length >= 800),
    utilidade: scoreDimension(Boolean(input.directAnswer?.trim()) && body.length >= 800, Boolean(input.directAnswer?.trim())),
    profundidade: scoreDimension(body.length >= 1800, body.length >= 1200),
    confianca: scoreDimension(sourcesCount >= 1 && Boolean(input.reviewerId), sourcesCount >= 1),
    fonte: scoreDimension(sourcesCount >= 1),
    relevanciaLocal: scoreDimension(local && Boolean(input.localHook?.trim()), local),
    clareza: scoreDimension(Boolean(input.directAnswer?.trim()) && Boolean(input.excerpt.trim())),
    escaneabilidade: scoreDimension(/<(?:h2|h3|ol|ul|li)/i.test(input.contentHtml) || faqCount > 0, /<(?:p)/i.test(input.contentHtml)),
    imagem: scoreDimension(Boolean(input.coverImageUrl && input.coverImageAlt), Boolean(input.coverImageUrl)),
    linksInternos: scoreDimension((input.internalLinkCount ?? 0) >= 2, (input.internalLinkCount ?? 0) >= 1),
    atualizacao: scoreDimension(Boolean(input.pillarId && input.clusterId)),
    intencao: scoreDimension(Boolean(input.intent?.trim())),
    riscoDuplicacao: scoreDimension(Boolean(input.pillarId && input.clusterId && input.intent)),
    riscoRaso: scoreDimension(body.length >= 800 && sourcesCount >= 1, body.length >= 500)
  };
  const values = Object.values(dimensions);
  const total = Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 100);
  const blockers: string[] = [];
  if (!input.authorId) blockers.push("Autor obrigatório.");
  if (!input.reviewerId) blockers.push("Revisor obrigatório antes da publicação.");
  if (!input.localHook?.trim() || !local) blockers.push("Gancho local verificável ausente.");
  if (!input.directAnswer?.trim()) blockers.push("Resposta principal no início ausente.");
  if (body.length < 800) blockers.push("Corpo abaixo da meta interna de qualidade.");
  if (sourcesCount < 1) blockers.push("Fonte verificável ausente.");
  if (!input.pillarId || !input.clusterId) blockers.push("Pilar e cluster obrigatórios.");
  if (!input.coverImageUrl || !input.coverImageAlt) blockers.push("Imagem principal com alt text obrigatória.");
  if (!input.candidateCta?.trim()) blockers.push("CTA gratuito para candidato ausente.");
  return {
    total,
    dimensions,
    blockers,
    publishableInternally: blockers.length === 0 && total >= 70,
    disclaimer: "Pontuação editorial interna. Não representa pontuação do Google."
  };
}

export function validatePostMagneticoForReview(input: PostMagneticoInput) {
  const score = scorePostMagnetico(input);
  return {
    valid: score.blockers.length === 0,
    errors: score.blockers,
    score
  };
}
