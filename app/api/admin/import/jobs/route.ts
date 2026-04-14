import { AuditAction, EmploymentType, LocationType } from "@prisma/client";
import { NextResponse } from "next/server";

import { normalizeLines, normalizeSlug, parseOptionalDate, plainTextToHtml } from "@/lib/admin/content";
import { writeAuditLog } from "@/lib/audit";
import { requireApiRole } from "@/lib/authz";
import { prisma } from "@/lib/db";
import { importJobsPayloadSchema } from "@/lib/schemas/job-import";

async function resolveStateAndCityFromNames(stateName: string, cityName: string) {
  const trimmedState = stateName.trim();
  const state = await prisma.state.findFirst({
    where: {
      OR: [{ code: { equals: trimmedState, mode: "insensitive" } }, { name: { equals: trimmedState, mode: "insensitive" } }]
    }
  });

  if (!state) {
    throw new Error(`Estado nao encontrado para "${stateName}".`);
  }

  const citySlug = normalizeSlug(cityName);
  
  let city = await prisma.city.findFirst({
    where: {
      stateId: state.id,
      OR: [
        { name: { equals: cityName.trim(), mode: "insensitive" } },
        { slug: citySlug }
      ]
    }
  });

  if (!city) {
    city = await prisma.city.create({
      data: {
        stateId: state.id,
        name: cityName.trim(),
        slug: citySlug,
        seoTitle: `Vagas de Jovem Aprendiz em ${cityName.trim()}`,
        seoIntro: `Veja vagas de Jovem Aprendiz em ${cityName.trim()}, ${state.code}.`
      }
    });
  }

  return { state, city };
}

async function resolveCompany(companyName: string, stateId: string, cityId: string, summary?: string) {
  const slug = normalizeSlug(companyName);
  const existing = await prisma.company.findFirst({
    where: {
      OR: [{ slug }, { name: { equals: companyName.trim(), mode: "insensitive" } }]
    }
  });

  if (existing) return existing;

  return prisma.company.create({
    data: {
      name: companyName.trim(),
      slug,
      summary: summary?.trim() || `${companyName.trim()} com vagas de Jovem Aprendiz publicadas no portal.`,
      isActive: true,
      featured: false,
      stateId,
      cityId
    }
  });
}

export async function POST(request: Request) {
  try {
    const session = await requireApiRole("EDITOR");
    const payload = importJobsPayloadSchema.parse(await request.json());

    const imported: string[] = [];
    const updated: string[] = [];
    const errors: string[] = [];

    for (const [index, row] of payload.rows.entries()) {
      try {
        const { state, city } = await resolveStateAndCityFromNames(row.stateName, row.cityName);
        const company = await resolveCompany(row.companyName, state.id, city.id, row.summary);

        const existing = await prisma.job.findFirst({
          where: {
            OR: [{ slug: normalizeSlug(row.slug || row.title) }, ...(row.externalId ? [{ externalId: row.externalId.trim() }] : [])]
          },
          select: {
            id: true,
            publishedAt: true
          }
        });

        // employmentType já vem validado pelo schema como APPRENTICESHIP, INTERNSHIP, etc.
        const mappedEmploymentType = row.employmentType;

        // Log de depuração para cada vaga
        console.log(`=== PROCESSANDO VAGA ${index + 1} ===`);
        console.log('Dados brutos da planilha:', JSON.stringify(row, null, 2));
        console.log('Estado:', state);
        console.log('Cidade:', city);
        console.log('Empresa:', company);
        console.log('Vaga existente:', !!existing);

        const data = {
          title: row.title.trim(),
          slug: normalizeSlug(row.slug || row.title),
          companyId: company.id,
          companyName: company.name,
          companyLogoUrl: company.logoUrl,
          companyWebsiteUrl: company.websiteUrl,
          summary: row.summary.trim(),
          descriptionHtml: row.descriptionHtml.includes("<") ? row.descriptionHtml.trim() : plainTextToHtml(row.descriptionHtml.trim()),
          requirements: normalizeLines(row.requirementsText),
          benefits: normalizeLines(row.benefitsText ?? ""),
          salaryMin: row.salaryMin ? Math.round(row.salaryMin) : null, // Salvar valor bruto em centavos
          salaryMax: row.salaryMax ? Math.round(row.salaryMax) : null, // Salvar valor bruto em centavos
          employmentType: mappedEmploymentType as EmploymentType,
          workHours: row.workHours?.trim() || null,
          expiresAt: parseOptionalDate(row.expiresAt),
          validThrough: parseOptionalDate(row.validThrough), // Adicionar suporte a validThrough
          applyUrl: row.applyUrl,
          isActive: row.isActive,
          sourceName: row.sourceName?.trim() || null,
          sourceUrl: row.sourceUrl?.trim() || null,
          locationType: row.locationType as LocationType,
          seoTitle: row.seoTitle.trim(),
          seoDescription: row.seoDescription.trim(),
          featured: row.featured,
          externalId: row.externalId?.trim() || null,
          publishedAt: existing?.publishedAt ?? parseOptionalDate(row.publishedAt) ?? new Date(),
          stateId: state.id,
          cityId: city.id
        };

        console.log('Dados preparados para salvar:', JSON.stringify(data, null, 2));

        if (existing) {
          console.log(`ATUALIZANDO vaga existente: ${data.slug}`);
          await prisma.job.update({
            where: { id: existing.id },
            data: {
              ...data,
              updatedAt: new Date() // Garantir updatedAt seja atualizado
            }
          });
          console.log(`Vaga atualizada com sucesso: ${data.slug}`);
          updated.push(data.slug);
        } else {
          console.log(`CRIANDO nova vaga: ${data.slug}`);
          await prisma.job.create({
            data
          });
          console.log(`Vaga criada com sucesso: ${data.slug}`);
          imported.push(data.slug);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        errors.push(`Linha ${index + 1}: ${errorMessage}`);
        console.error(`Erro na linha ${index + 1} (${row.title}):`, error);
      }
    }

    await writeAuditLog({
      actorId: session.sub,
      actorName: session.name,
      actorEmail: session.email,
      actorRole: session.role,
      action: AuditAction.IMPORT,
      entityType: "job-import",
      summary: "Importacao de vagas por planilha",
      after: {
        importedCount: imported.length,
        updatedCount: updated.length,
        imported,
        updated
      }
    });

    return NextResponse.json({
      ok: true,
      importedCount: imported.length,
      updatedCount: updated.length,
      errorCount: errors.length,
      imported,
      updated,
      errors
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nao foi possivel importar a planilha.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
