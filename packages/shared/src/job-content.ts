export const UNIDENTIFIED_COMPANY_ID = "00000000-0000-4000-8000-000000000001";
export const UNIDENTIFIED_COMPANY_NAME = "Contratante não identificada na fonte";

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

export function sanitizeHtml(input: string) {
  return input
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/javascript:/gi, "");
}

export function plainTextFromHtml(value: string): string {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h[1-6]|li|tr)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function convertInlineMarkdown(input: string) {
  return escapeHtml(input)
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer nofollow">$1</a>'
    )
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>")
    .replace(/(^|[\s(])\*([^*]+)\*(?=[\s).,!?:;]|$)/g, "$1<em>$2</em>")
    .replace(/(^|[\s(])_([^_]+)_(?=[\s).,!?:;]|$)/g, "$1<em>$2</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

function closeList(buffer: string[], listType: "ul" | "ol" | null, items: string[]) {
  if (!listType || !items.length) return null;
  buffer.push(
    `<${listType}>${items.map((item) => `<li>${convertInlineMarkdown(item)}</li>`).join("")}</${listType}>`
  );
  return { listType: null as "ul" | "ol" | null, items: [] as string[] };
}

export function looksLikeMarkdown(input: string) {
  return (
    /(^|\n)\s{0,3}(#{1,6}\s+|[-*•]\s+|\d+[.)]\s+|> )/.test(input) ||
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/.test(input) ||
    /\*\*[^*]+\*\*/.test(input)
  );
}

export function markdownToHtml(input: string, options?: { baseHeadingLevel?: number }) {
  const baseHeadingLevel = options?.baseHeadingLevel ?? 2;
  const lines = input.replace(/\r\n/g, "\n").split("\n");
  const blocks: string[] = [];
  let paragraphLines: string[] = [];
  let listType: "ul" | "ol" | null = null;
  let listItems: string[] = [];

  function flushParagraph() {
    if (!paragraphLines.length) return;
    blocks.push(`<p>${convertInlineMarkdown(paragraphLines.join("<br />"))}</p>`);
    paragraphLines = [];
  }

  function flushList() {
    const nextState = closeList(blocks, listType, listItems);
    if (!nextState) return;
    listType = nextState.listType;
    listItems = nextState.items;
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      const markdownLevel = headingMatch[1]!.length;
      const headingLevel = Math.min(6, Math.max(baseHeadingLevel, baseHeadingLevel + markdownLevel - 1));
      blocks.push(`<h${headingLevel}>${convertInlineMarkdown(headingMatch[2]!.trim())}</h${headingLevel}>`);
      continue;
    }

    const unorderedMatch = line.match(/^[-*•]\s+(.*)$/);
    if (unorderedMatch) {
      flushParagraph();
      if (listType && listType !== "ul") flushList();
      listType = "ul";
      listItems.push(unorderedMatch[1]!.trim());
      continue;
    }

    const orderedMatch = line.match(/^\d+[.)]\s+(.*)$/);
    if (orderedMatch) {
      flushParagraph();
      if (listType && listType !== "ol") flushList();
      listType = "ol";
      listItems.push(orderedMatch[1]!.trim());
      continue;
    }

    // Linhas tipo "Atividades:" / "Requisitos:" viram subtítulos
    if (/^[A-Za-zÀ-ÿ0-9][A-Za-zÀ-ÿ0-9\s/()]{1,40}:$/.test(line)) {
      flushParagraph();
      flushList();
      blocks.push(`<h3>${convertInlineMarkdown(line.replace(/:$/, ""))}</h3>`);
      continue;
    }

    paragraphLines.push(line);
  }

  flushParagraph();
  flushList();
  return sanitizeHtml(blocks.join("\n"));
}

export function plainTextToHtml(input: string) {
  return sanitizeHtml(
    input
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)
      .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br />")}</p>`)
      .join("\n")
  );
}

/** Converte texto, markdown ou HTML solto em HTML estruturado para JobPosting e portal. */
export function richTextFromInput(input: string, options?: { baseHeadingLevel?: number }) {
  const trimmed = input.trim();
  if (!trimmed) return "";

  const hasStructuredBlocks =
    /<(ul|ol|h[1-6])\b/i.test(trimmed) && /<(p|li)\b/i.test(trimmed);
  if (hasStructuredBlocks) return sanitizeHtml(trimmed);

  if (/<[a-z][\s\S]*>/i.test(trimmed)) {
    const text = plainTextFromHtml(trimmed);
    if (!text) return sanitizeHtml(trimmed);
    if (looksLikeMarkdown(text) || text.includes("\n")) {
      return looksLikeMarkdown(text)
        ? markdownToHtml(text, options)
        : plainTextToHtml(text);
    }
    return sanitizeHtml(trimmed);
  }

  if (looksLikeMarkdown(trimmed)) return markdownToHtml(trimmed, options);
  return plainTextToHtml(trimmed);
}

/** Normaliza descrição já salva (legado) para exibição/SEO. */
export function formatJobDescriptionHtml(html: string): string {
  return richTextFromInput(html, { baseHeadingLevel: 2 });
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

  const rawBase = descriptionHtml || description || summary;
  const baseHtml = rawBase ? richTextFromInput(rawBase, { baseHeadingLevel: 2 }) : "";
  const basePlain = plainTextFromHtml(baseHtml);
  if (baseHtml) sections.push({ key: "description", title: "", items: [baseHtml], paragraphs: true });

  if (summary && plainTextFromHtml(summary).toLocaleLowerCase("pt-BR") !== basePlain.toLocaleLowerCase("pt-BR")) {
    sections.push({
      key: "summary",
      title: "Resumo",
      items: [richTextFromInput(summary, { baseHeadingLevel: 3 })],
      paragraphs: true
    });
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
      items: [richTextFromInput(additional, { baseHeadingLevel: 3 })],
      paragraphs: true
    });

  const seen = new Set<string>();
  let duplicateItemsRemoved = 0;
  const normalizedSections = sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        const key = plainTextFromHtml(item).toLocaleLowerCase("pt-BR").replace(/\s+/g, " ").trim();
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
      if (section.paragraphs) return `${heading}${section.items.join("\n")}`;
      return `${heading}<ul>${section.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
    })
    .join("\n");
  const plainText = plainTextFromHtml(html);

  return {
    descriptionHtml: sanitizeHtml(html),
    plainText,
    summary: plainText.slice(0, 500),
    report: {
      sectionsMerged: normalizedSections.map((section) => section.key),
      duplicateItemsRemoved
    }
  };
}
