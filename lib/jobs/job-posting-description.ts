import { sanitizeRichTextHtml } from "@/lib/rich-text";
import { normalizeListValues } from "@/lib/jobs/text-normalization";

const INSTITUTIONAL_PATTERNS =
  /\b(nossa hist[oó]ria|quem somos|sobre n[oó]s|somos uma empresa|h[aá] mais de|fundada em|presente em|unidades|alunos|miss[aã]o|valores|cultura|grupo educacional|conhe[cç]a nossa hist[oó]ria|p[aá]gina de carreira|nossas institui[cç][oõ]es|fazemos parte|transformar o mundo|somos refer[eê]ncia|empresa l[ií]der|maior grupo|representativos grupos|nascemos do desejo)\b/i;

function escapeHtmlText(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function isLikelyInstitutionalLine(text: string) {
  const t = text.trim();
  if (!t) return true;
  return INSTITUTIONAL_PATTERNS.test(t);
}

export function filterInstitutionalListItems(items: string[]) {
  return items.map((s) => s.trim()).filter((s) => s && !isLikelyInstitutionalLine(s));
}

/**
 * HTML da description do JobPosting e do conteúdo alinhado ao schema: neutro, sem repetir cards do site.
 */
export function buildJobPostingDescriptionHtml(input: {
  displayTitle: string;
  companyName: string;
  cityName: string;
  stateCode: string;
  summary: string;
  descriptionHtml: string;
  requirements: unknown[];
  benefits: unknown[];
  workHours?: string | null;
}) {
  const requirements = filterInstitutionalListItems(normalizeListValues(input.requirements));
  const benefits = filterInstitutionalListItems(normalizeListValues(input.benefits));

  const parts: string[] = [];

  parts.push(`<p>${escapeHtmlText(`Confira esta oportunidade de ${input.displayTitle}.`)}</p>`);

  if (input.companyName.trim()) {
    parts.push(
      `<p>${escapeHtmlText(
        `A vaga está relacionada à empresa ${input.companyName.trim()}. Esta página apenas divulga a oportunidade e não representa a empresa contratante.`
      )}</p>`
    );
  }

  const summary = input.summary.trim();
  if (summary && !isLikelyInstitutionalLine(summary)) {
    parts.push(`<p>${escapeHtmlText(summary)}</p>`);
  }

  const body = sanitizeRichTextHtml(input.descriptionHtml).trim();
  if (body) {
    parts.push(body);
  }

  if (requirements.length) {
    parts.push("<h3>Requisitos</h3>", "<ul>", ...requirements.map((item) => `<li>${escapeHtmlText(item)}</li>`), "</ul>");
  }

  if (benefits.length) {
    parts.push("<h3>Benefícios</h3>", "<ul>", ...benefits.map((item) => `<li>${escapeHtmlText(item)}</li>`), "</ul>");
  }

  const hours = input.workHours?.trim();
  if (hours && !isLikelyInstitutionalLine(hours)) {
    parts.push("<h3>Jornada</h3>", `<p>${escapeHtmlText(hours)}</p>`);
  }

  parts.push(`<p>${escapeHtmlText("A candidatura deve ser feita pelo link oficial informado na vaga.")}</p>`);

  return parts.join("\n").slice(0, 100000);
}
