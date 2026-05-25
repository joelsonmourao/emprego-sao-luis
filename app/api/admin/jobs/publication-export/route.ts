import { JobPublicationStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";


import { requireApiRole } from "@/lib/authz";
import { prisma } from "@/lib/db";
import { getSiteUrl } from "@/lib/site-url";
import { formatDateTimeSpreadsheetValueMinutes } from "@/lib/timezone";


export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
function sheetPublishStatus(status: JobPublicationStatus): "AGUARDANDO" | "PUBLICADA" | "ERRO" {
  if (status === JobPublicationStatus.OK || status === JobPublicationStatus.PUBLICADA || status === JobPublicationStatus.INDEXANDO_GOOGLE) {
    return "PUBLICADA";
  }
  if (status === JobPublicationStatus.ERRO) {
    return "ERRO";
  }
  return "AGUARDANDO";
}

export async function GET() {
  await requireApiRole("EDITOR");

  const jobs = await prisma.job.findMany({
    where: {
      OR: [{ scheduledPublishAt: { not: null } }, { publicationStatus: { not: JobPublicationStatus.OK } }]
    },
    orderBy: [{ updatedAt: "desc" }],
    take: 5000,
    select: {
      title: true,
      slug: true,
      externalId: true,
      scheduledPublishAt: true,
      publicationStatus: true,
      publishedPublicUrl: true,
      publishedAt: true,
      googleIndexingStatus: true,
      googleIndexedAt: true,
      googleIndexingMessage: true
    }
  });

  const rows = jobs.map((job) => {
    const publishedUrl = job.publishedPublicUrl || (job.slug ? getSiteUrl(`/vagas/${job.slug}`) : "");
    return {
      dataHoraPublicacao: job.scheduledPublishAt ? formatDateTimeSpreadsheetValueMinutes(job.scheduledPublishAt) : "",
      publishStatus: sheetPublishStatus(job.publicationStatus),
      publishedUrl: publishedUrl || "",
      publishedAt: job.publishedAt ? formatDateTimeSpreadsheetValueMinutes(job.publishedAt) : "",
      googleIndexingStatus: job.googleIndexingStatus ?? "",
      googleIndexedAt: job.googleIndexedAt ? formatDateTimeSpreadsheetValueMinutes(job.googleIndexedAt) : "",
      googleIndexingMessage: job.googleIndexingMessage ?? "",
      title: job.title,
      externalId: job.externalId ?? ""
    };
  });

  const sheet = XLSX.utils.json_to_sheet(rows);
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, "Publicacao");

  const buffer = XLSX.write(book, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="publicacao-vagas-${new Date().toISOString().slice(0, 10)}.xlsx"`,
      "Cache-Control": "no-store"
    }
  });
}
