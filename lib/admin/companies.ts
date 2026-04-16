import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";
import { companyFormSchema, type CompanyFormInput } from "@/lib/schemas/company-form";
import { normalizeSlug, sanitizeHtml } from "@/lib/admin/content";

function toNullableText(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

async function resolveStateAndCity(stateSlug: string, citySlug: string) {
  const state = await prisma.state.findUnique({
    where: { slug: stateSlug },
    select: { id: true, slug: true, name: true, code: true }
  });

  if (!state) {
    throw new Error("Estado nao encontrado.");
  }

  const city = await prisma.city.findFirst({
    where: {
      slug: citySlug,
      stateId: state.id
    },
    select: { id: true, slug: true, name: true }
  });

  if (!city) {
    throw new Error("Cidade nao encontrada para o estado selecionado.");
  }

  return { state, city };
}

function describePrismaError(error: unknown, fallback: string) {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    return "Ja existe um registro com esses dados. Revise nome, slug ou URL.";
  }

  return error instanceof Error ? error.message : fallback;
}

export async function upsertCompanyFromForm(input: CompanyFormInput, companyId?: string) {
  const parsed = companyFormSchema.parse(input);
  const { state, city } = await resolveStateAndCity(parsed.stateSlug, parsed.citySlug);

  const data = {
    name: parsed.name.trim(),
    slug: normalizeSlug(parsed.slug || parsed.name),
    logoUrl: toNullableText(parsed.logoUrl),
    websiteUrl: toNullableText(parsed.websiteUrl),
    socialImageUrl: toNullableText(parsed.socialImageUrl),
    summary: parsed.summary.trim(),
    descriptionHtml: parsed.descriptionHtml.trim() ? sanitizeHtml(parsed.descriptionHtml) : null,
    seoTitle: toNullableText(parsed.seoTitle),
    seoDescription: toNullableText(parsed.seoDescription),
    featured: parsed.featured,
    isActive: parsed.isActive,
    stateId: state.id,
    cityId: city.id
  };

  try {
    if (companyId) {
      return prisma.company.update({
        where: { id: companyId },
        data
      });
    }

    return prisma.company.create({ data });
  } catch (error) {
    throw new Error(describePrismaError(error, "Nao foi possivel salvar a empresa."));
  }
}

export async function deleteCompany(companyId: string) {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: {
      _count: {
        select: {
          jobs: true
        }
      }
    }
  });

  if (!company) {
    throw new Error("Empresa nao encontrada.");
  }

  if (company._count.jobs > 0) {
    throw new Error("Existem vagas ligadas a esta empresa. Ajuste as vagas antes de excluir.");
  }

  await prisma.company.delete({
    where: { id: companyId }
  });

  return company;
}

export async function bulkDeleteCompanies(companyIds: string[]) {
  const uniqueIds = [...new Set(companyIds.filter(Boolean))];
  const results: Array<{ id: string; name?: string | null; deleted: boolean; error?: string }> = [];

  for (const id of uniqueIds) {
    try {
      const company = await deleteCompany(id);
      results.push({
        id,
        name: company.name,
        deleted: true
      });
    } catch (error) {
      results.push({
        id,
        deleted: false,
        error: error instanceof Error ? error.message : "Nao foi possivel excluir a empresa."
      });
    }
  }

  return results;
}
