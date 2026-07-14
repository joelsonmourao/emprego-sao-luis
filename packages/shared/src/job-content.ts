export const UNIDENTIFIED_COMPANY_ID = "00000000-0000-4000-8000-000000000001";
export const UNIDENTIFIED_COMPANY_NAME = "Contratante não identificada na fonte";

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

export function plainTextFromHtml(value: string): string {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeBlock(value: unknown): string[] {
  const values = Array.isArray(value) ? value : typeof value === "string" ? value.split(/\r?\n|;/) : [];
  return values
    .map((item) =>
      plainTextFromHtml(String(item))
        .replace(/^[-•]\s*/, "")
        .trim()
    )
    .filter(Boolean);
}

function paragraphHtml(value: string): string {
  return value
    .split(/\n{2,}/)
    .map((paragraph) => plainTextFromHtml(paragraph).trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("\n");
}

export interface LegacyJobContent {
  descriptionHtml?: unknown;
  description?: unknown;
  summary?: unknown;
  activities?: unknown;
  requirements?: unknown;
  benefits?: unknown;
  additionalInfo?: unknown;
}

export interface ConsolidatedJobContent {
  descriptionHtml: string;
  plainText: string;
  summary: string;
  report: {
    sectionsMerged: string[];
    duplicateItemsRemoved: number;
  };
}

export function consolidateJobContent(input: LegacyJobContent): ConsolidatedJobContent {
  const sections: Array<{ key: string; title: string; items: string[]; paragraphs?: boolean }> = [];
  const descriptionHtml = typeof input.descriptionHtml === "string" ? input.descriptionHtml.trim() : "";
  const description = typeof input.description === "string" ? input.description.trim() : "";
  const summary = typeof input.summary === "string" ? input.summary.trim() : "";

  const base = plainTextFromHtml(descriptionHtml || description || summary);
  if (base) sections.push({ key: "description", title: "", items: [base], paragraphs: true });
  if (summary && plainTextFromHtml(summary).toLocaleLowerCase("pt-BR") !== base.toLocaleLowerCase("pt-BR")) {
    sections.push({ key: "summary", title: "Resumo", items: [plainTextFromHtml(summary)], paragraphs: true });
  }

  for (const [key, title, value] of [
    ["activities", "Atividades", input.activities],
    ["requirements", "Requisitos", input.requirements],
    ["benefits", "Benefícios", input.benefits]
  ] as const) {
    const items = normalizeBlock(value);
    if (items.length) sections.push({ key, title, items });
  }

  const additional =
    typeof input.additionalInfo === "string" ? plainTextFromHtml(input.additionalInfo).trim() : "";
  if (additional)
    sections.push({
      key: "additionalInfo",
      title: "Informações adicionais",
      items: [additional],
      paragraphs: true
    });

  const seen = new Set<string>();
  let duplicateItemsRemoved = 0;
  const normalizedSections = sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        const key = item.toLocaleLowerCase("pt-BR").replace(/\s+/g, " ").trim();
        if (!key || seen.has(key)) {
          duplicateItemsRemoved++;
          return false;
        }
        seen.add(key);
        return true;
      })
    }))
    .filter((section) => section.items.length);

  const html = normalizedSections
    .map((section) => {
      const heading = section.title ? `<h2>${escapeHtml(section.title)}</h2>\n` : "";
      if (section.paragraphs) return `${heading}${section.items.map(paragraphHtml).join("\n")}`;
      return `${heading}<ul>${section.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
    })
    .join("\n");
  const plainText = plainTextFromHtml(html);

  return {
    descriptionHtml: html,
    plainText,
    summary: plainText.slice(0, 500),
    report: {
      sectionsMerged: normalizedSections.map((section) => section.key),
      duplicateItemsRemoved
    }
  };
}
