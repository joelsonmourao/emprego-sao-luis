export const IMPORT_EXAMPLE_MARKER = "EXEMPLO-NAO-IMPORTAR";

export const IMPORT_TEMPLATE_FIELDS = [
  {
    key: "externalId",
    label: "id",
    required: false,
    description: "Identificador estável opcional (ex.: SLZ-ABC123DEF0). Se vazio, o sistema gera um id interno."
  },
  { key: "title", label: "titulo", required: true, description: "Título real da vaga." },
  { key: "company", label: "empresa", required: true, description: "Empresa contratante ou 'Confidencial'." },
  {
    key: "description",
    label: "descricao",
    required: true,
    description: "Descrição completa em HTML (padrão JobPosting) ou texto. Não exige Markdown. Mínimo ~80 caracteres úteis."
  },
  {
    key: "locality",
    label: "localidade",
    required: false,
    description: "Condicional: pode ficar vazia se cidade + uf estiverem preenchidos."
  },
  {
    key: "city",
    label: "cidade",
    required: false,
    description: "Obrigatória junto com uf quando localidade estiver vazia."
  },
  { key: "state", label: "uf", required: false, description: "UF com duas letras (ex.: MA)." },
  {
    key: "workplaceType",
    label: "modalidade",
    required: true,
    description: "Presencial, Hibrido ou Remoto (case-insensitive). Internamente: presencial | hibrido | remoto."
  },
  { key: "numberOfOpenings", label: "quantidadeVagas", required: false, description: "Número inteiro; padrão 1." },
  { key: "salary", label: "salario", required: false, description: "Valor ou faixa salarial." },
  {
    key: "publishedAt",
    label: "dataPublicacao",
    required: false,
    description: "DD/MM/AAAA (Brasil) ou AAAA-MM-DD. No JobPosting vira ISO 8601."
  },
  {
    key: "expiresAt",
    label: "dataEncerramento",
    required: false,
    description: "DD/MM/AAAA ou AAAA-MM-DD. Necessária antes da publicação pública. No JobPosting vira ISO 8601 (validThrough)."
  },
  {
    key: "sourceName",
    label: "fonteNome",
    required: true,
    description: "Origem da vaga para auditoria (InfoJobs, Indeed, LinkedIn…). Não misturar com candidaturaUrl."
  },
  {
    key: "sourceUrl",
    label: "fonteUrl",
    required: false,
    description: "Página onde a vaga foi encontrada; não é a candidatura."
  },
  { key: "category", label: "categoria", required: false, description: "Opcional; o sistema pode sugerir." },
  { key: "neighborhood", label: "bairro", required: false, description: "Opcional; nunca será inventado." },
  { key: "applicationUrl", label: "candidaturaUrl", required: false, description: "URL do site da empresa." },
  { key: "applicationEmail", label: "candidaturaEmail", required: false, description: "E-mail que receberá a candidatura." },
  {
    key: "applicationWhatsapp",
    label: "candidaturaWhatsApp",
    required: false,
    description: "Número com código do país e DDD, ou com DDD no padrão brasileiro."
  },
  {
    key: "whatsappMessage",
    label: "mensagemWhatsApp",
    required: false,
    description: "Mensagem inicial opcional; salva como está se preenchida."
  },
  {
    key: "applicationInstructions",
    label: "instrucoesCandidatura",
    required: false,
    description: "Orientações ao candidato; salvas como estão se preenchidas."
  }
] as const;

export const IMPORT_TEMPLATE_HEADERS = IMPORT_TEMPLATE_FIELDS.map((field) => field.label);

export function isTemplateExampleRow(row: Record<string, unknown>) {
  return Object.values(row).some((value) => String(value ?? "").trim().toUpperCase() === IMPORT_EXAMPLE_MARKER);
}
