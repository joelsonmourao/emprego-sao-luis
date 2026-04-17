import { HubType, Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";
import { normalizeSlug } from "@/lib/admin/content";
import {
  cityAdminSchema,
  stateAdminSchema,
  type CityAdminInput,
  type StateAdminInput,
  type TaxonomyResource
} from "@/lib/schemas/taxonomy-admin";

function toNullableText(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function normalizeStateInput(input: StateAdminInput) {
  const parsed = stateAdminSchema.parse(input);

  return {
    name: parsed.name.trim(),
    code: parsed.code.trim().toUpperCase(),
    slug: normalizeSlug(parsed.slug || parsed.name),
    seoTitle: toNullableText(parsed.seoTitle),
    seoIntro: toNullableText(parsed.seoIntro)
  };
}

function normalizeCityInput(input: CityAdminInput) {
  const parsed = cityAdminSchema.parse(input);

  return {
    stateId: parsed.stateId,
    name: parsed.name.trim(),
    slug: normalizeSlug(parsed.slug || parsed.name),
    seoTitle: toNullableText(parsed.seoTitle),
    seoIntro: toNullableText(parsed.seoIntro)
  };
}

function describePrismaError(error: unknown, fallback: string) {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    return "Ja existe um registro com esses dados. Revise nome, slug ou sigla.";
  }

  return error instanceof Error ? error.message : fallback;
}

export async function createState(input: StateAdminInput) {
  const data = normalizeStateInput(input);

  try {
    return await prisma.state.create({ data });
  } catch (error) {
    throw new Error(describePrismaError(error, "Nao foi possivel criar o estado."));
  }
}

export async function updateState(id: string, input: StateAdminInput) {
  const data = normalizeStateInput(input);

  try {
    return await prisma.state.update({
      where: { id },
      data
    });
  } catch (error) {
    throw new Error(describePrismaError(error, "Nao foi possivel atualizar o estado."));
  }
}

export async function deleteState(id: string) {
  return prisma.$transaction(async (tx) => {
    const state = await tx.state.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        slug: true,
        cities: {
          select: {
            id: true,
            slug: true
          }
        },
        companies: {
          select: {
            id: true,
            slug: true
          }
        }
      }
    });

    if (!state) {
      throw new Error("Estado nao encontrado.");
    }

    const deletedJobs = await tx.job.deleteMany({
      where: { stateId: id }
    });

    const companySlugs = state.companies.map((item) => item.slug);
    const cityHubSlugs = state.cities.map((item) => `${state.slug}__${item.slug}`);

    const deletedCompanyHubProfiles = companySlugs.length
      ? await tx.hubProfile.deleteMany({
          where: {
            type: HubType.COMPANY,
            slug: { in: companySlugs }
          }
        })
      : { count: 0 };

    await tx.company.deleteMany({
      where: { stateId: id }
    });

    const deletedCityHubProfiles = cityHubSlugs.length
      ? await tx.hubProfile.deleteMany({
          where: {
            type: HubType.CITY,
            slug: { in: cityHubSlugs }
          }
        })
      : { count: 0 };

    const deletedStateHubProfiles = await tx.hubProfile.deleteMany({
      where: {
        type: HubType.STATE,
        slug: state.slug
      }
    });

    await tx.state.delete({ where: { id } });

    return {
      id: state.id,
      name: state.name,
      summary: {
        jobsDeleted: deletedJobs.count,
        companiesDeleted: state.companies.length,
        citiesDeleted: state.cities.length,
        statesDeleted: 1,
        hubProfilesDeleted: deletedCompanyHubProfiles.count + deletedCityHubProfiles.count + deletedStateHubProfiles.count
      }
    };
  });
}

export async function createCity(input: CityAdminInput) {
  const data = normalizeCityInput(input);

  try {
    return await prisma.city.create({ data });
  } catch (error) {
    throw new Error(describePrismaError(error, "Nao foi possivel criar a cidade."));
  }
}

export async function updateCity(id: string, input: CityAdminInput) {
  const data = normalizeCityInput(input);

  try {
    return await prisma.city.update({
      where: { id },
      data
    });
  } catch (error) {
    throw new Error(describePrismaError(error, "Nao foi possivel atualizar a cidade."));
  }
}

export async function deleteCity(id: string) {
  return prisma.$transaction(async (tx) => {
    const city = await tx.city.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        slug: true,
        state: {
          select: {
            slug: true
          }
        },
        companies: {
          select: {
            id: true,
            slug: true
          }
        }
      }
    });

    if (!city) {
      throw new Error("Cidade nao encontrada.");
    }

    const deletedJobs = await tx.job.deleteMany({
      where: { cityId: id }
    });

    const companySlugs = city.companies.map((item) => item.slug);

    const deletedCompanyHubProfiles = companySlugs.length
      ? await tx.hubProfile.deleteMany({
          where: {
            type: HubType.COMPANY,
            slug: { in: companySlugs }
          }
        })
      : { count: 0 };

    await tx.company.deleteMany({
      where: { cityId: id }
    });

    const deletedCityHubProfiles = await tx.hubProfile.deleteMany({
      where: {
        type: HubType.CITY,
        slug: `${city.state.slug}__${city.slug}`
      }
    });

    await tx.city.delete({ where: { id } });

    return {
      id: city.id,
      name: city.name,
      summary: {
        jobsDeleted: deletedJobs.count,
        companiesDeleted: city.companies.length,
        citiesDeleted: 1,
        statesDeleted: 0,
        hubProfilesDeleted: deletedCompanyHubProfiles.count + deletedCityHubProfiles.count
      }
    };
  });
}

export async function createTaxonomyEntry(resource: TaxonomyResource, input: unknown) {
  switch (resource) {
    case "states":
      return createState(input as StateAdminInput);
    case "cities":
      return createCity(input as CityAdminInput);
  }
}

export async function updateTaxonomyEntry(resource: TaxonomyResource, id: string, input: unknown) {
  switch (resource) {
    case "states":
      return updateState(id, input as StateAdminInput);
    case "cities":
      return updateCity(id, input as CityAdminInput);
  }
}

export async function deleteTaxonomyEntry(resource: TaxonomyResource, id: string) {
  switch (resource) {
    case "states":
      return deleteState(id);
    case "cities":
      return deleteCity(id);
  }
}

export async function bulkDeleteTaxonomyEntries(resource: TaxonomyResource, ids: string[]) {
  const uniqueIds = [...new Set(ids.filter(Boolean))];
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
      const item = await deleteTaxonomyEntry(resource, id);
      results.push({
        id,
        name: item.name,
        deleted: true,
        summary: item.summary
      });
    } catch (error) {
      results.push({
        id,
        deleted: false,
        error: error instanceof Error ? error.message : "Nao foi possivel excluir."
      });
    }
  }

  return results;
}
