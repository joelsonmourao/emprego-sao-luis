/**
 * Triagem DOCUMENTADA em 12/10/2026: 106 artigos públicos examinados.
 * 98 guias tinham múltiplos trechos repetitivos ou menos de 350 palavras.
 * Os 98 guias sinalizados já receberam revisão substantiva.
 * 5 notícias de julho/2026 ainda precisam de fontes factuais externas.
 * Não inventar data ou prova e não confundir este controle com aprovação Google.
 * Relatórios: reports/adsense-revisao-integral-parte-{1,2}.json
 */
export const EDITORIAL_REVIEW_DATE = "2026-10-13";

export const guidesPendingReview = new Set<string>([]);

export const newsPendingFactCheck = new Set<string>([
  "contrato-temporario-temporada-direitos",
  "decimo-terceiro-salario-pagamento-clt",
  "feriado-ponto-facultativo-sao-luis",
  "imposto-de-renda-2026-trabalhador-clt",
  "vagas-hotelaria-temporada-sao-luis"
]);

export function isEditorialReviewPending(type: "GUIDE" | "DATA_REPORT" | "NEWS", slug: string) {
  return type === "NEWS" ? newsPendingFactCheck.has(slug) : guidesPendingReview.has(slug);
}
