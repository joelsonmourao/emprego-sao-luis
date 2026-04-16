import { NextResponse } from "next/server";

import { requireApiRole } from "@/lib/authz";
import { prisma } from "@/lib/db";

// Função para calcular meses a partir de validThrough
function calculateMonthsFromValidThrough(validThrough: Date | null): number | null {
  if (!validThrough) return null;
  
  const today = new Date();
  const validDate = new Date(validThrough);
  
  // Calcular diferença em meses
  const yearDiff = validDate.getFullYear() - today.getFullYear();
  const monthDiff = validDate.getMonth() - today.getMonth();
  const totalMonths = yearDiff * 12 + monthDiff;
  
  // Se for negativo ou maior que 24, retornar null
  if (totalMonths <= 0 || totalMonths > 24) return null;
  
  return totalMonths;
}

export async function GET() {
  try {
    const session = await requireApiRole("EDITOR");
    
    // Buscar todas as vagas
    const jobs = await prisma.job.findMany({
      include: {
        city: true,
        state: true
      },
      orderBy: [{ updatedAt: "desc" }]
    });
    
    // Converter para formato de planilha
    const rows = jobs.map(job => ({
      title: job.title,
      slug: job.slug,
      companyName: job.companyName,
      cityName: job.city.name,
      stateName: job.state.name,
      summary: job.summary,
      descriptionHtml: job.descriptionHtml,
      requirementsText: Array.isArray(job.requirements) ? job.requirements.join(', ') : '',
      benefitsText: Array.isArray(job.benefits) ? job.benefits.join(', ') : '',
      salaryMin: job.salaryMin || '',
      salaryMax: job.salaryMax || '',
      employmentType: job.employmentType,
      workHours: job.workHours || '',
      publishedAt: job.publishedAt.toISOString().split('T')[0],
      expiresAt: job.expiresAt ? job.expiresAt.toISOString().split('T')[0] : '',
      validThrough: job.validThrough ? job.validThrough.toISOString() : '',
      validThroughMonths: calculateMonthsFromValidThrough(job.validThrough) || '',
      applyUrl: job.applyUrl,
      isActive: job.isActive,
      sourceName: job.sourceName || '',
      sourceUrl: job.sourceUrl || '',
      locationType: job.locationType,
      seoTitle: job.seoTitle,
      seoDescription: job.seoDescription,
      featured: job.featured,
      externalId: job.externalId || ''
    }));
    
    // Criar CSV
    const headers = Object.keys(rows[0] || {}).join(',');
    const csvRows = rows.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n')) 
          ? `"${value.replace(/"/g, '""')}"` 
          : value
      ).join(',')
    );
    
    const csv = [headers, ...csvRows].join('\n');
    
    // Retornar como arquivo CSV
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="vagas-export.csv"'
      }
    });
    
  } catch (error) {
    console.error('Erro ao exportar vagas:', error);
    const message = error instanceof Error ? error.message : 'Nao foi possivel exportar vagas.';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
