import { EmploymentType, LocationType, Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";
import { jobFormSchema, type JobFormValues } from "@/lib/schemas/job-form";
import { normalizeLines, normalizeSlug, parseOptionalDate, plainTextToHtml, sanitizeHtml } from "@/lib/admin/content";

export async function getStateAndCityBySlug(stateSlug: string, citySlug: string) {
  const state = await prisma.state.findUnique({
    where: { slug: stateSlug },
    include: {
      cities: {
        where: { slug: citySlug },
        take: 1
      }
    }
  });

  if (!state) {
    throw new Error("Estado nao encontrado.");
  }

  const city = state.cities[0];
  if (!city) {
    throw new Error("Cidade nao encontrada para o estado selecionado.");
  }

  return { state, city };
}

export async function resolveStateAndCityFromNames(stateInput: string, cityInput: string) {
  const normalizedState = normalizeSlug(stateInput);
  const normalizedCity = normalizeSlug(cityInput);

  const state = await prisma.state.findFirst({
    where: {
      OR: [{ slug: normalizedState }, { code: stateInput.toUpperCase() }, { name: { equals: stateInput, mode: "insensitive" } }]
    }
  });

  if (!state) {
    throw new Error(`Estado nao encontrado: ${stateInput}`);
  }

  const city =
    (await prisma.city.findFirst({
      where: {
        stateId: state.id,
        OR: [{ slug: normalizedCity }, { name: { equals: cityInput, mode: "insensitive" } }]
      }
    })) ??
    (await prisma.city.create({
      data: {
        name: cityInput.trim(),
        slug: normalizedCity,
        stateId: state.id
      }
    }));

  return { state, city };
}

export async function resolveCompany(companyId: string) {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: {
      city: true,
      state: true
    }
  });

  if (!company || !company.isActive) {
    throw new Error("Empresa nao encontrada ou inativa.");
  }

  return company;
}

export async function resolveCompanyByName(input: {
  companyName: string;
  stateId: string;
  cityId: string;
  websiteUrl?: string | null;
  logoUrl?: string | null;
  summary?: string | null;
}) {
  const name = input.companyName.trim();
  const slug = normalizeSlug(name);

  const existing =
    (await prisma.company.findFirst({
      where: {
        OR: [{ slug }, { name: { equals: name, mode: "insensitive" } }]
      }
    })) ??
    (await prisma.company.create({
      data: {
        name,
        slug,
        logoUrl: input.logoUrl?.trim() || null,
        websiteUrl: input.websiteUrl?.trim() || null,
        summary: input.summary?.trim() || `Veja vagas de Jovem Aprendiz ligadas a ${name}.`,
        stateId: input.stateId,
        cityId: input.cityId,
        isActive: true
      }
    }));

  if (existing.stateId !== input.stateId || existing.cityId !== input.cityId || (input.websiteUrl && !existing.websiteUrl) || (input.logoUrl && !existing.logoUrl)) {
    return prisma.company.update({
      where: { id: existing.id },
      data: {
        stateId: input.stateId,
        cityId: input.cityId,
        websiteUrl: existing.websiteUrl || input.websiteUrl?.trim() || null,
        logoUrl: existing.logoUrl || input.logoUrl?.trim() || null
      }
    });
  }

  return existing;
}

export async function upsertJobFromForm(input: unknown, existingId?: string) {
  const parsed = jobFormSchema.parse(input);
  const company = await resolveCompany(parsed.companyId);
  const { state, city } = await getStateAndCityBySlug(parsed.stateSlug, parsed.citySlug);
  const existing = existingId
    ? await prisma.job.findUnique({
        where: { id: existingId },
        select: { id: true, publishedAt: true }
      })
    : null;

  const baseData = {
    title: parsed.title.trim(),
    slug: normalizeSlug(parsed.slug || parsed.title),
    companyId: company.id,
    companyName: company.name,
    companyLogoUrl: company.logoUrl,
    companyWebsiteUrl: company.websiteUrl,
    heroImageUrl: parsed.heroImageUrl?.trim() || null,
    summary: parsed.summary.trim(),
    descriptionHtml: parsed.descriptionHtml.includes("<") ? sanitizeHtml(parsed.descriptionHtml.trim()) : plainTextToHtml(parsed.descriptionHtml.trim()),
    requirements: normalizeLines(parsed.requirementsText),
    benefits: normalizeLines(parsed.benefitsText ?? ""),
    salaryMin: parsed.salaryMin ?? null,
    salaryMax: parsed.salaryMax ?? null,
    employmentType: parsed.employmentType as EmploymentType,
    workHours: parsed.workHours?.trim() || null,
    expiresAt: parseOptionalDate(parsed.expiresAt),
    applyUrl: parsed.applyUrl,
    isActive: parsed.isActive,
    locationType: parsed.locationType as LocationType,
    seoTitle: parsed.seoTitle.trim(),
    seoDescription: parsed.seoDescription.trim(),
    featured: parsed.featured,
    stateId: state.id,
    cityId: city.id
  } satisfies Omit<Prisma.JobUncheckedCreateInput, "publishedAt">;

  if (existingId) {
    if (!existing) {
      throw new Error("Vaga nao encontrada.");
    }

    return prisma.job.update({
      where: { id: existingId },
      data: baseData
    });
  }

  const createData: Prisma.JobUncheckedCreateInput = {
    ...baseData,
    publishedAt: new Date()
  };

  return prisma.job.create({
    data: createData
  });
}

export type AdminImportJobInput = JobFormValues & {
  publishedAt?: string;
  sourceName?: string;
  sourceUrl?: string;
  externalId?: string;
};
