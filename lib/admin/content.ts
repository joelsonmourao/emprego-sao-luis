import { slugify } from "@/lib/utils";

export function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function plainTextToHtml(input: string) {
  return sanitizeHtml(
    input
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br />")}</p>`)
      .join("")
  );
}

function convertInlineMarkdown(input: string) {
  return escapeHtml(input)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer nofollow">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>")
    .replace(/(^|[\s(])\*([^*]+)\*(?=[\s).,!?:;]|$)/g, "$1<em>$2</em>")
    .replace(/(^|[\s(])_([^_]+)_(?=[\s).,!?:;]|$)/g, "$1<em>$2</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

function closeList(buffer: string[], listType: "ul" | "ol" | null, items: string[]) {
  if (!listType || !items.length) {
    return null;
  }

  buffer.push(`<${listType}>${items.map((item) => `<li>${convertInlineMarkdown(item)}</li>`).join("")}</${listType}>`);
  return {
    listType: null as "ul" | "ol" | null,
    items: [] as string[]
  };
}

export function markdownToHtml(input: string, options?: { baseHeadingLevel?: number }) {
  const baseHeadingLevel = options?.baseHeadingLevel ?? 1;
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
      const markdownLevel = headingMatch[1].length;
      const headingLevel = Math.min(6, Math.max(baseHeadingLevel, baseHeadingLevel + markdownLevel - 1));
      blocks.push(`<h${headingLevel}>${convertInlineMarkdown(headingMatch[2].trim())}</h${headingLevel}>`);
      continue;
    }

    const unorderedMatch = line.match(/^[-*]\s+(.*)$/);
    if (unorderedMatch) {
      flushParagraph();
      if (listType && listType !== "ul") {
        flushList();
      }
      listType = "ul";
      listItems.push(unorderedMatch[1].trim());
      continue;
    }

    const orderedMatch = line.match(/^\d+[.)]\s+(.*)$/);
    if (orderedMatch) {
      flushParagraph();
      if (listType && listType !== "ol") {
        flushList();
      }
      listType = "ol";
      listItems.push(orderedMatch[1].trim());
      continue;
    }

    paragraphLines.push(line);
  }

  flushParagraph();
  flushList();

  return sanitizeHtml(blocks.join(""));
}

export function looksLikeMarkdown(input: string) {
  return /(^|\n)\s{0,3}(#{1,6}\s+|[-*]\s+|\d+[.)]\s+|> )/.test(input) || /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/.test(input) || /\*\*[^*]+\*\*/.test(input);
}

export function richTextFromInput(input: string, options?: { baseHeadingLevel?: number }) {
  const trimmed = input.trim();

  if (!trimmed) {
    return "";
  }

  if (/<[a-z][\s\S]*>/i.test(trimmed)) {
    return sanitizeHtml(trimmed);
  }

  if (looksLikeMarkdown(trimmed)) {
    return markdownToHtml(trimmed, options);
  }

  return plainTextToHtml(trimmed);
}

export function sanitizeHtml(input: string) {
  return input
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}

export function normalizeLines(input: string) {
  return input
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function normalizeSlug(input: string) {
  return slugify(input).slice(0, 120);
}

export function parseOptionalNumber(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const normalized = typeof value === "string" ? Number(value.replace(/[^\d,-]/g, "").replace(",", ".")) : Number(value);
  return Number.isFinite(normalized) ? Math.round(normalized) : null;
}

export function parseOptionalDate(value: string | undefined | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function parseBooleanLike(value: unknown) {
  if (typeof value === "boolean") {
    return value;
  }

  const normalized = String(value ?? "")
    .trim()
    .toLowerCase();

  return ["1", "true", "sim", "yes", "ativo", "publicado"].includes(normalized);
}
