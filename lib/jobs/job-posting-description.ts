import { sanitizeRichTextHtml } from "@/lib/rich-text";

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
  workHours?: string | null;
}) {
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

  const hours = input.workHours?.trim();
  if (hours && !isLikelyInstitutionalLine(hours)) {
    parts.push("<h3>Jornada</h3>", `<p>${escapeHtmlText(hours)}</p>`);
  }

  parts.push(`<p>${escapeHtmlText("A candidatura deve ser feita pelo link oficial informado na vaga.")}</p>`);

  const finalHtml = parts.join("\n").slice(0, 100000);

  return finalHtml;
}
