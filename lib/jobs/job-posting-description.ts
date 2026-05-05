import { sanitizeRichTextHtml } from "@/lib/rich-text";

function escapeHtmlText(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function shouldWarnMissingJobDescription() {
  if (process.env.NODE_ENV === "development") return true;
  return process.env.npm_lifecycle_event === "build";
}

/**
 * Remove apenas tags perigosas do HTML da vaga, preservando o texto e marcação útil (p, h2, ul, etc.).
 * Não adiciona frases, não reescreve e não injeta dados de cidade/empresa.
 */
function stripDangerousMarkup(html: string) {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "")
    .replace(/<iframe\b[^>]*\/?>/gi, "")
    .replace(/<object[\s\S]*?>[\s\S]*?<\/object>/gi, "")
    .replace(/<object\b[^>]*\/?>/gi, "")
    .replace(/<embed\b[^>]*\/?>/gi, "");
}

/**
 * Prepara o HTML de `job.description` (campo `descriptionHtml` no app) exclusivamente para o campo
 * `description` do JSON-LD JobPosting.
 */
export function cleanJobDescriptionForSchema(
  descriptionHtml: string,
  context: { slug?: string | null; id?: string | null; title: string }
): string {
  const raw = typeof descriptionHtml === "string" ? descriptionHtml : "";
  const titleFallback = (context.title ?? "").trim();

  if (!raw.trim()) {
    if (shouldWarnMissingJobDescription()) {
      console.warn(`Descrição ausente para a vaga: ${context.slug || context.id || "unknown"}`);
    }
    return escapeHtmlText(titleFallback || "Vaga");
  }

  const cleaned = sanitizeRichTextHtml(stripDangerousMarkup(raw)).trim();
  if (!cleaned) {
    if (shouldWarnMissingJobDescription()) {
      console.warn(`Descrição ausente para a vaga: ${context.slug || context.id || "unknown"}`);
    }
    return escapeHtmlText(titleFallback || "Vaga");
  }

  return cleaned;
}
