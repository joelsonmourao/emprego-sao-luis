export const IMPORT_EXAMPLE_MARKER = "EXEMPLO-NAO-IMPORTAR";

export const IMPORT_TEMPLATE_FIELDS = [
  { key: "title", label: "titulo", required: true, description: "Título real da vaga." },
  { key: "company", label: "empresa", required: true, description: "Empresa contratante ou 'Confidencial'." },
  { key: "description", label: "descricao", required: true, description: "Descrição completa, com pelo menos 120 caracteres." },
  { key: "locality", label: "localidade", required: false, description: "Pode conter cidade e UF no mesmo campo." },
  { key: "city", label: "cidade", required: false, description: "Obrigatória quando a localidade não identificar a cidade." },
  { key: "state", label: "uf", required: false, description: "UF com duas letras." },
  { key: "workplaceType", label: "modalidade", required: true, description: "presencial, hibrido ou remoto." },
  { key: "numberOfOpenings", label: "quantidadeVagas", required: false, description: "Número inteiro; padrão 1." },
  { key: "salary", label: "salario", required: false, description: "Valor ou faixa salarial." },
  { key: "publishedAt", label: "dataPublicacao", required: false, description: "Data no formato AAAA-MM-DD." },
  { key: "expiresAt", label: "dataEncerramento", required: false, description: "Necessária antes da publicação." },
  { key: "sourceName", label: "fonteNome", required: true, description: "Nome de onde a vaga foi obtida." },
  { key: "sourceUrl", label: "fonteUrl", required: false, description: "Página onde a vaga foi encontrada; não é a candidatura." },
  { key: "category", label: "categoria", required: false, description: "Opcional; o sistema pode sugerir." },
  { key: "neighborhood", label: "bairro", required: false, description: "Opcional; nunca será adivinhado." },
  { key: "applicationUrl", label: "candidaturaUrl", required: false, description: "URL do site da empresa." },
  { key: "applicationEmail", label: "candidaturaEmail", required: false, description: "E-mail que receberá a candidatura." },
  { key: "applicationWhatsapp", label: "candidaturaWhatsApp", required: false, description: "Número com código do país e DDD, ou com DDD no padrão brasileiro." },
  { key: "whatsappMessage", label: "mensagemWhatsApp", required: false, description: "Mensagem inicial opcional; não é enviada automaticamente." },
  { key: "applicationInstructions", label: "instrucoesCandidatura", required: false, description: "Orientações simples ao candidato." }
] as const;

export const IMPORT_TEMPLATE_HEADERS = IMPORT_TEMPLATE_FIELDS.map((field) => field.label);

export function isTemplateExampleRow(row: Record<string, unknown>) {
  return Object.values(row).some((value) => String(value ?? "").trim().toUpperCase() === IMPORT_EXAMPLE_MARKER);
}

