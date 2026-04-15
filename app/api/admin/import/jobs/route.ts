import { AuditAction, EmploymentType, LocationType } from "@prisma/client";
import { NextResponse } from "next/server";

import { normalizeLines, normalizeSlug, parseOptionalDate, plainTextToHtml } from "@/lib/admin/content";
import { writeAuditLog } from "@/lib/audit";
import { requireApiRole } from "@/lib/authz";
import { prisma } from "@/lib/db";
import { importJobsPayloadSchema } from "@/lib/schemas/job-import";

// Função para calcular validThrough baseado em número de meses ou data direta
function calculateValidThrough(validThroughValue: string | number | null | undefined): Date | null {
  if (!validThroughValue) return null;
  
  // Se for número, tratar como quantidade de meses
  if (typeof validThroughValue === 'number') {
    const monthsToAdd = validThroughValue;
    
    if (monthsToAdd <= 0) {
      console.log(`Valor inválido para validThrough (meses): ${monthsToAdd}, usando null`);
      return null;
    }
    
    // Calcular data atual + meses
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setMonth(today.getMonth() + monthsToAdd);
    
    console.log(`validThrough: ${monthsToAdd} meses a partir de hoje = ${futureDate.toISOString().split('T')[0]}`);
    return futureDate;
  }
  
  // Se for string, tentar converter como data primeiro
  const stringValue = String(validThroughValue).trim();
  if (!stringValue) return null;
  
  // Tentar parse como data (formato ISO ou DD/MM/YYYY)
  const dateValue = new Date(stringValue);
  if (!isNaN(dateValue.getTime())) {
    console.log(`validThrough: data direta da planilha = ${dateValue.toISOString().split('T')[0]}`);
    return dateValue;
  }
  
  // Se não for data, tentar converter como número de meses
  const monthsToAdd = Number(stringValue);
  if (!isNaN(monthsToAdd) && monthsToAdd > 0) {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setMonth(today.getMonth() + monthsToAdd);
    
    console.log(`validThrough: ${stringValue} meses a partir de hoje = ${futureDate.toISOString().split('T')[0]}`);
    return futureDate;
  }
  
  console.log(`Valor inválido para validThrough: ${validThroughValue}, usando null`);
  return null;
}

async function resolveStateAndCityFromNames(stateName: string, cityName: string) {
  const trimmedState = stateName.trim();
  let state = await prisma.state.findFirst({
    where: {
      OR: [{ code: { equals: trimmedState, mode: "insensitive" } }, { name: { equals: trimmedState, mode: "insensitive" } }]
    }
  });

  // Criar estado automaticamente se não existir
  if (!state) {
    console.log(`Criando estado automaticamente: ${trimmedState}`);
    state = await prisma.state.create({
      data: {
        code: trimmedState.slice(0, 2).toUpperCase(),
        name: trimmedState,
        slug: normalizeSlug(trimmedState),
        seoTitle: `Vagas de Jovem Aprendiz em ${trimmedState}`,
        seoIntro: `Veja todas as vagas de Jovem Aprendiz disponíveis em ${trimmedState}.`
      }
    });
    console.log(`Estado criado com sucesso: ${state.name}`);
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
    console.log(`Criando cidade automaticamente: ${cityName.trim()} no estado ${state.name}`);
    city = await prisma.city.create({
      data: {
        stateId: state.id,
        name: cityName.trim(),
        slug: citySlug,
        seoTitle: `Vagas de Jovem Aprendiz em ${cityName.trim()}`,
        seoIntro: `Veja vagas de Jovem Aprendiz em ${cityName.trim()}, ${state.code}.`
      }
    });
    console.log(`Cidade criada com sucesso: ${city.name}`);
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

  if (existing) {
    console.log(`Empresa encontrada: ${existing.name}`);
    return existing;
  }

  console.log(`Criando empresa automaticamente: ${companyName.trim()}`);
  const company = await prisma.company.create({
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
  console.log(`Empresa criada com sucesso: ${company.name}`);
  return company;
}

export async function POST(request: Request) {
  // Adicionar headers CORS para Vercel
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

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
        
        console.log(`SUCESSO: Associações resolvidas - Estado: ${state.name}, Cidade: ${city.name}, Empresa: ${company.name}`);

        const existing = await prisma.job.findFirst({
          where: {
            OR: [{ slug: normalizeSlug(row.slug || row.title) }, ...(row.externalId ? [{ externalId: row.externalId.trim() }] : [])]
          },
          select: {
            id: true,
            publishedAt: true,
            slug: true // Adicionar slug para verificação de conflito
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

        // Gerar slug único com número aleatório se houver conflito
        let baseSlug = normalizeSlug(row.slug || row.title);
        let uniqueSlug = baseSlug;
        let slugAttempts = 0;
        const maxAttempts = 10;
        
        while (slugAttempts < maxAttempts) {
          const slugCheck = await prisma.job.findFirst({
            where: { slug: uniqueSlug },
            select: { id: true }
          });
          
          if (!slugCheck || (existing && existing.slug === uniqueSlug)) {
            break; // Slug está disponível ou é o mesmo registro existente
          }
          
          // Adicionar sufixo aleatório
          const randomSuffix = Math.floor(Math.random() * 10000);
          uniqueSlug = `${baseSlug}-${randomSuffix}`;
          slugAttempts++;
        }
        
        if (slugAttempts >= maxAttempts) {
          throw new Error(`Não foi possível gerar slug único para: ${baseSlug}`);
        }
        
        console.log(`Slug gerado: ${uniqueSlug}${uniqueSlug !== baseSlug ? ' (com sufixo)' : ''}`);

        const data = {
          title: row.title.trim(),
          slug: uniqueSlug,
          // Campos obrigatórios do schema
          companyName: company.name,
          companyLogoUrl: company.logoUrl,
          companyWebsiteUrl: company.websiteUrl,
          // Relacionamentos do Prisma usando connect
          company: {
            connect: { id: company.id }
          },
          state: {
            connect: { id: state.id }
          },
          city: {
            connect: { id: city.id }
          },
          summary: row.summary.trim(),
          descriptionHtml: row.descriptionHtml.includes("<") ? row.descriptionHtml.trim() : plainTextToHtml(row.descriptionHtml.trim()),
          requirements: normalizeLines(row.requirementsText),
          benefits: normalizeLines(row.benefitsText ?? ""),
          salaryMin: row.salaryMin ? Math.round(row.salaryMin) : null,
          salaryMax: row.salaryMax ? Math.round(row.salaryMax) : null,
          employmentType: mappedEmploymentType as EmploymentType,
          workHours: row.workHours?.trim() || null,
          expiresAt: parseOptionalDate(row.expiresAt),
          validThrough: calculateValidThrough(row.validThrough),
          applyUrl: row.applyUrl,
          isActive: row.isActive,
          sourceName: row.sourceName?.trim() || null,
          sourceUrl: row.sourceUrl?.trim() || null,
          locationType: row.locationType as LocationType,
          seoTitle: row.seoTitle.trim(),
          seoDescription: row.seoDescription.trim(),
          featured: row.featured,
          externalId: row.externalId?.trim() || null,
          publishedAt: existing?.publishedAt ?? parseOptionalDate(row.publishedAt) ?? new Date()
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

    // Resposta detalhada para depuração no navegador
    const response = {
      ok: true,
      summary: {
        totalRows: payload.rows.length,
        importedCount: imported.length,
        updatedCount: updated.length,
        errorCount: errors.length,
        successRate: payload.rows.length > 0 ? Math.round(((imported.length + updated.length) / payload.rows.length) * 100) : 0
      },
      results: {
        imported: imported.map((slug, i) => ({ slug, status: 'imported' })),
        updated: updated.map((slug, i) => ({ slug, status: 'updated' })),
        errors: errors.map((error, i) => ({ 
          line: error.split(':')[0], 
          message: error.split(':').slice(1).join(':').trim(),
          fullError: error 
        }))
      },
      debug: {
        processedSlugs: [...imported, ...updated],
        errorDetails: errors.length > 0 ? errors : ['Nenhum erro detectado'],
        timestamp: new Date().toISOString()
      }
    };

    // Log detalhado no console para depuração
    console.log('=== RESPOSTA FINAL DA IMPORTAÇÃO ===');
    console.log(JSON.stringify(response, null, 2));

    return NextResponse.json(response, { headers });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nao foi possivel importar a planilha.";
    
    // Capturar erro detalhado do Prisma para depuração
    const detailedError = {
      ok: false,
      error: message,
      details: error instanceof Error ? error.stack : null,
      timestamp: new Date().toISOString(),
      debug: {
        errorMessage: message,
        errorType: error instanceof Error ? error.constructor.name : 'Unknown',
        isPrismaError: error instanceof Error && error.message.includes('Prisma'),
        fullError: error
      }
    };
    
    console.error('ERRO DETALHADO DA IMPORTAÇÃO:', detailedError);
    
    return NextResponse.json(detailedError, { status: 400, headers });
  }
}
