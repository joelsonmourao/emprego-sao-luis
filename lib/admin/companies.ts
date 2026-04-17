import { HubType, Prisma } from "@prisma/client";

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
  return prisma.$transaction(async (tx) => {
    const company = await tx.company.findUnique({
      where: { id: companyId },
      select: { id: true, name: true, slug: true }
    });

    if (!company) {
      throw new Error("Empresa nao encontrada.");
    }

    const deletedJobs = await tx.job.deleteMany({
      where: { companyId }
    });

    const deletedHubProfiles = await tx.hubProfile.deleteMany({
      where: {
        type: HubType.COMPANY,
        slug: company.slug
      }
    });

    await tx.company.delete({
      where: { id: companyId }
    });

    return {
      ...company,
      summary: {
        jobsDeleted: deletedJobs.count,
        companiesDeleted: 1,
        citiesDeleted: 0,
        statesDeleted: 0,
        hubProfilesDeleted: deletedHubProfiles.count
      }
    };
  });
}

export async function bulkDeleteCompanies(companyIds: string[]) {
  const uniqueIds = [...new Set(companyIds.filter(Boolean))];
  const results: Array<{
    id: string;
    name?: string | null;
    deleted: boolean;
    error?: string;
    summary?: {
      jobsDeleted: number;
      companiesDeleted: number;
      citiesDeleted: number;
      statesDeleted: number;
      hubProfilesDeleted: number;
    };
  }> = [];

  for (const id of uniqueIds) {
    try {
      const company = await deleteCompany(id);
      results.push({
        id,
        name: company.name,
        deleted: true,
        summary: company.summary
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
