export function sanitizeRichTextHtml(input: string) {
  return input
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}

export function stripHtml(input: string) {
  return input
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<li>/gi, "- ")
    .replace(/<\/li>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function countWords(input: string) {
  const text = stripHtml(input);
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

export function stripFormatting(input: string) {
  return stripHtml(input).replace(/\n{3,}/g, "\n\n").trim();
}

export function getSeoStatus(length: number, kind: "title" | "description"): {
  tone: "good" | "medium" | "bad";
  label: string;
  message: string;
} {
  const good = kind === "title" ? [30, 60] : [90, 155];
  const okay = kind === "title" ? [20, 70] : [70, 170];

  if (length >= good[0] && length <= good[1]) {
    return { tone: "good", label: "Bom", message: kind === "title" ? "Tamanho equilibrado para aparecer bem no Google." : "Descricao em um tamanho que costuma funcionar bem." };
  }

  if (length >= okay[0] && length <= okay[1]) {
    return { tone: "medium", label: "Medio", message: kind === "title" ? "Pode funcionar, mas ainda da para ajustar melhor." : "Ja ajuda, mas pode ficar mais redonda." };
  }

  return { tone: "bad", label: "Ruim", message: kind === "title" ? "Muito curto ou muito longo. Tente deixar mais direto." : "Muito curta ou muito longa. Vale resumir ou completar." };
}
