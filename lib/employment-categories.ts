import { EmploymentType } from "@prisma/client";

export type EmploymentCategoryDefinition = {
  slug: string;
  employmentType: EmploymentType;
  label: string;
  description: string;
};

export const EMPLOYMENT_CATEGORIES: EmploymentCategoryDefinition[] = [
  {
    slug: "jovem-aprendiz",
    employmentType: EmploymentType.APPRENTICESHIP,
    label: "Jovem Aprendiz",
    description: "Vagas no programa de aprendizagem profissional."
  },
  {
    slug: "estagio",
    employmentType: EmploymentType.INTERNSHIP,
    label: "Estagio",
    description: "Vagas de estagio para estudantes."
  },
  {
    slug: "temporario",
    employmentType: EmploymentType.TEMPORARY,
    label: "Temporario",
    description: "Contratos temporarios e oportunidades por temporada."
  },
  {
    slug: "meio-periodo",
    employmentType: EmploymentType.PART_TIME,
    label: "Meio periodo",
    description: "Vagas em jornada reduzida."
  },
  {
    slug: "integral",
    employmentType: EmploymentType.FULL_TIME,
    label: "Integral",
    description: "Vagas em jornada integral."
  }
];

export function getEmploymentCategoryBySlug(slug: string) {
  return EMPLOYMENT_CATEGORIES.find((item) => item.slug === slug) ?? null;
}
