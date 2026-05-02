import { EmploymentType, type Prisma } from "@prisma/client";

const ic = "insensitive" as const;

/** Vagas contadas no hub compacto Jovem Aprendiz: aprendizagem OU menção explícita no conteúdo. */
export function jovemAprendizHubOrKeywordsWhere(): Prisma.JobWhereInput {
  return {
    OR: [
      { employmentType: EmploymentType.APPRENTICESHIP },
      { title: { contains: "jovem aprendiz", mode: ic } },
      { title: { contains: "menor aprendiz", mode: ic } },
      { title: { contains: "aprendiz", mode: ic } },
      { seoTitle: { contains: "jovem aprendiz", mode: ic } },
      { seoTitle: { contains: "aprendiz", mode: ic } },
      { summary: { contains: "jovem aprendiz", mode: ic } },
      { summary: { contains: "aprendiz", mode: ic } },
      { descriptionHtml: { contains: "jovem aprendiz", mode: ic } },
      { descriptionHtml: { contains: "aprendiz", mode: ic } }
    ]
  };
}
