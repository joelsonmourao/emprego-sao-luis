/**
 * Triagem DOCUMENTADA em 12/10/2026: 106 artigos públicos examinados.
 * 98 guias tinham múltiplos trechos repetitivos ou menos de 350 palavras.
 * 28 já receberam revisão substantiva; 70 permanecem acessíveis, mas fora do índice.
 * 5 notícias de julho/2026 ainda precisam de fontes factuais externas.
 * Não inventar data ou prova e não confundir este controle com aprovação Google.
 * Relatórios: reports/adsense-revisao-integral-parte-{1,2}.json
 */
export const EDITORIAL_REVIEW_DATE = "2026-10-12";

export const guidesPendingReview = new Set<string>([
  "agradecimento-pos-entrevista-mensagem",
  "alfabetizacao-digital-emprego-basico",
  "auxiliar-administrativo-vagas-sao-luis",
  "avaliacao-de-desempenho-preparacao",
  "candidatura-whatsapp-emprego-mensagem",
  "carta-apresentacao-emprego-curta",
  "certificado-ou-experiencia-curriculo",
  "como-ler-holerite-descontos",
  "como-pedir-aumento-salario",
  "como-usar-empregos-sao-luis",
  "comparar-beneficios-vaga-emprego",
  "comparar-duas-propostas-emprego",
  "conflito-com-chefe-trabalho-dicas",
  "curriculo-ats-palavras-chave-sao-luis",
  "cursos-no-curriculo-sem-enchimento",
  "dinamica-de-grupo-entrevista-dicas",
  "documentos-admissao-emprego-maranhao",
  "email-candidatura-emprego-modelo",
  "empatia-atendimento-cliente-entrevista",
  "emprego-apos-40-anos-curriculo",
  "entrevista-desligamento-o-que-falar",
  "entrevista-por-video-emprego",
  "entrevista-presencial-sao-luis-dicas",
  "esgotamento-busca-emprego-sinais",
  "excel-basico-vagas-emprego",
  "experiencia-informal-curriculo-como-colocar",
  "follow-up-apos-entrevista-mensagem",
  "freelancer-ou-clt-vantagens",
  "gap-habilidades-candidatura-como-fechar",
  "gestao-de-tempo-trabalho-dicas",
  "golpe-vaga-emprego-sao-luis",
  "home-office-remoto-checklist-vaga",
  "ingles-no-curriculo-nivel-honesto",
  "inteligencia-emocional-entrevista",
  "linkedin-emprego-sao-luis-perfil",
  "marca-pessoal-candidatura-sao-luis",
  "mitos-direitos-trabalhistas-whatsapp",
  "mudanca-de-carreira-sao-luis-curriculo",
  "negociar-horario-deslocamento-emprego",
  "networking-emprego-sao-luis",
  "o-que-vestir-entrevista-emprego",
  "pedir-feedback-entrevista-emprego",
  "plano-90-dias-emprego-sao-luis",
  "plano-semanal-vagas-sao-luis",
  "portfolio-simples-candidato-emprego",
  "pretensao-salarial-entrevista-dicas",
  "primeira-semana-emprego-novo",
  "produtividade-busca-emprego-sao-luis",
  "referencias-profissionais-emprego",
  "rejeicao-processo-seletivo-como-reagir",
  "retorno-mercado-trabalho-gap-curriculo",
  "saude-mental-trabalho-limites",
  "seguranca-candidatas-entrevista-emprego",
  "servicos-gerais-epi-vaga",
  "sindicato-trabalhador-direitos-basico",
  "soft-skills-hard-skills-curriculo",
  "teste-online-processo-seletivo-dicas",
  "trabalho-hibrido-sao-luis-checklist",
  "transferencia-interna-emprego-como-pedir",
  "transporte-entrevista-emprego-sao-luis",
  "vaga-recepcionista-clinica-sao-luis",
  "vaga-sazonal-comercio-sao-luis",
  "vagas-afirmativas-como-candidatar",
  "vagas-call-center-sao-luis",
  "vagas-estoque-logistica-sao-luis",
  "vagas-motorista-entregador-sao-luis",
  "vagas-pcd-inclusao-emprego",
  "vagas-restaurante-sao-luis-dicas",
  "vagas-vendedor-loja-comissao-dicas",
  "vale-alimentacao-ou-refeicao-diferenca",
]);

export const newsPendingFactCheck = new Set<string>([
  "contrato-temporario-temporada-direitos",
  "decimo-terceiro-salario-pagamento-clt",
  "feriado-ponto-facultativo-sao-luis",
  "imposto-de-renda-2026-trabalhador-clt",
  "vagas-hotelaria-temporada-sao-luis",
]);

export function isEditorialReviewPending(type: "GUIDE" | "DATA_REPORT" | "NEWS", slug: string) {
  return type === "NEWS" ? newsPendingFactCheck.has(slug) : guidesPendingReview.has(slug);
}
