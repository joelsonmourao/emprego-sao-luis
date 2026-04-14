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
        
        // Verificar se state e city foram encontrados
        if (!state) {
          console.error(`ERRO: Estado não encontrado para "${row.stateName}" na linha ${index + 1}`);
          throw new Error(`Estado não encontrado: ${row.stateName}`);
        }
        if (!city) {
          console.error(`ERRO: Cidade não encontrada para "${row.cityName}" no estado ${state.name} na linha ${index + 1}`);
          throw new Error(`Cidade não encontrada: ${row.cityName}`);
        }
        
        const company = await resolveCompany(row.companyName, state.id, city.id, row.summary);
        
        // Verificar se company foi encontrada
        if (!company) {
          console.error(`ERRO: Empresa não encontrada/criada para "${row.companyName}" na linha ${index + 1}`);
          throw new Error(`Empresa não encontrada: ${row.companyName}`);
        }
        
        console.log(`SUCESSO: Associações encontradas - Estado: ${state.name}, Cidade: ${city.name}, Empresa: ${company.name}`);

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
        
        // Log detalhado do erro do Prisma
        console.error(`=== ERRO DETALHADO AO SALVAR LINHA ${index + 1} ===`);
        console.error(`Título da vaga: ${row.title}`);
        console.error(`Mensagem de erro: ${errorMessage}`);
        console.error(`Erro completo:`, error);
        
        // Verificar se é erro de Prisma
        if (error instanceof Error && error.message.includes('Prisma')) {
          console.error('ERRO DO PRISMA DETECTADO - Possíveis causas:');
          console.error('1. Chave estrangeira inválida (stateId, cityId, companyId)');
          console.error('2. Campo obrigatório faltando');
          console.error('3. Restrição única violada (slug)');
          console.error('4. Tipo de dado inválido');
        }
        
        // Verificar dados que estavam sendo processados
        console.error(`Dados processados até o erro:`, {
          title: row.title,
          stateName: row.stateName,
          cityName: row.cityName,
          companyName: row.companyName,
          slug: normalizeSlug(row.slug || row.title)
        });
      }
    }

    // Log final do resultado
    console.log(`=== RESUMO DA IMPORTAÇÃO ===`);
    console.log(`Total de linhas processadas: ${payload.rows.length}`);
    console.log(`Vagas importadas: ${imported.length}`);
    console.log(`Vagas atualizadas: ${updated.length}`);
    console.log(`Erros: ${errors.length}`);
    
    if (imported.length > 0) {
      console.log(`Slugs importados: ${imported.join(', ')}`);
    }
    if (updated.length > 0) {
      console.log(`Slugs atualizados: ${updated.join(', ')}`);
    }
    if (errors.length > 0) {
      console.log(`Erros encontrados: ${errors.join('; ')}`);
    }
    
    // Verificação crítica: se não houve erros mas também não importou nada
    if (errors.length === 0 && imported.length === 0 && updated.length === 0) {
      console.error('!!! ATENÇÃO: Nenhuma vaga foi importada/atualizada, mas também não houve erros !!!');
      console.error('Possíveis causas:');
      console.error('1. Operações Prisma não estão sendo executadas (await faltando)');
      console.error('2. Todas as vagas já existem e não estão sendo atualizadas');
      console.error('3. Falha silenciosa no prisma.job.create/update');
      console.error('4. Transação não sendo commitada');
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
