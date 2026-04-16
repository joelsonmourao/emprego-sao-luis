import { Prisma } from "@prisma/client";

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
  const state = await prisma.state.findUnique({
    where: { id },
    include: {
      _count: {
        select: { cities: true, jobs: true, companies: true }
      }
    }
  });

  if (!state) {
    throw new Error("Estado nao encontrado.");
  }

  if (state._count.jobs > 0 || state._count.cities > 0 || state._count.companies > 0) {
    throw new Error("Remova primeiro as cidades, empresas e vagas ligadas a este estado antes de excluir.");
  }

  await prisma.state.delete({ where: { id } });

  return state;
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
  const city = await prisma.city.findUnique({
    where: { id },
    include: {
      _count: {
        select: { jobs: true, companies: true }
      }
    }
  });

  if (!city) {
    throw new Error("Cidade nao encontrada.");
  }

  if (city._count.jobs > 0 || city._count.companies > 0) {
    throw new Error("Existem vagas ou empresas ligadas a esta cidade. Ajuste os vinculos antes de excluir.");
  }

  await prisma.city.delete({ where: { id } });

  return city;
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
  const results: Array<{ id: string; name?: string | null; deleted: boolean; error?: string }> = [];

  for (const id of uniqueIds) {
    try {
      const item = await deleteTaxonomyEntry(resource, id);
      results.push({
        id,
        name: item.name,
        deleted: true
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
