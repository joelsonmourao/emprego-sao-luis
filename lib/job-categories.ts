export type JobCategoryDefinition = {
  slug: string;
  name: string;
  description: string;
};

/** Categorias de área de atuação para vagas no portal Emprego São Luís. */
export const JOB_CATEGORIES: JobCategoryDefinition[] = [
  {
    slug: "administrativo",
    name: "Administrativo",
    description: "Vagas de apoio administrativo, rotinas de escritório e organização de processos."
  },
  {
    slug: "atendimento",
    name: "Atendimento",
    description: "Oportunidades em atendimento ao cliente, recepção e suporte presencial."
  },
  {
    slug: "comercial",
    name: "Comercial",
    description: "Vagas ligadas a vendas, negociação e relacionamento com clientes."
  },
  {
    slug: "operacional",
    name: "Operacional",
    description: "Funções operacionais em lojas, indústrias e serviços do dia a dia."
  },
  {
    slug: "logistica",
    name: "Logística",
    description: "Vagas em armazenagem, expedição, entregas e movimentação de mercadorias."
  },
  {
    slug: "jovem-aprendiz",
    name: "Jovem Aprendiz",
    description: "Programa de aprendizagem profissional para quem está entrando no mercado."
  },
  {
    slug: "estagio",
    name: "Estágio",
    description: "Oportunidades de estágio para estudantes em formação."
  },
  {
    slug: "vendas",
    name: "Vendas",
    description: "Vagas em balcão, loja, televendas e metas comerciais."
  },
  {
    slug: "servicos-gerais",
    name: "Serviços Gerais",
    description: "Funções de apoio, limpeza, manutenção e serviços auxiliares."
  },
  {
    slug: "tecnologia",
    name: "Tecnologia",
    description: "Vagas em TI, suporte técnico, redes e desenvolvimento."
  },
  {
    slug: "saude",
    name: "Saúde",
    description: "Oportunidades em clínicas, hospitais, farmácias e áreas correlatas."
  },
  {
    slug: "educacao",
    name: "Educação",
    description: "Vagas em escolas, cursos, treinamentos e instituições de ensino."
  },
  {
    slug: "geral",
    name: "Geral",
    description: "Vagas que não se encaixam em uma categoria específica."
  }
];

export function getJobCategoryBySlug(slug: string) {
  return JOB_CATEGORIES.find((item) => item.slug === slug) ?? null;
}

export function normalizeJobCategorySlug(input: string) {
  const normalized = input
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const bySlug = getJobCategoryBySlug(normalized);
  if (bySlug) return bySlug;

  const byName = JOB_CATEGORIES.find(
    (item) => item.name.toLowerCase() === input.trim().toLowerCase()
  );
  return byName ?? JOB_CATEGORIES.find((item) => item.slug === "geral")!;
}
