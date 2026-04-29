import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { NextResponse } from "next/server";

import { requireApiRole } from "@/lib/authz";
import { formatBrazilCalendarDate, getBrazilNow } from "@/lib/date-utils";
import { prisma } from "@/lib/db";
import { SITE_TIME_ZONE } from "@/lib/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const EXPORT_BATCH_SIZE = 500;

const CSV_HEADERS = [
  "title",
  "slug",
  "companyName",
  "cityName",
  "stateName",
  "summary",
  "descriptionHtml",
  "requirementsText",
  "benefitsText",
  "salaryMin",
  "salaryMax",
  "employmentType",
  "workHours",
  "publishedAt",
  "expiresAt",
  "validThrough",
  "validThroughMonths",
  "applyUrl",
  "isActive",
  "sourceName",
  "sourceUrl",
  "locationType",
  "seoTitle",
  "seoDescription",
  "featured",
  "externalId"
] as const;

type ExportJob = {
  title: string;
  slug: string;
  companyName: string;
  summary: string;
  descriptionHtml: string;
  requirements: unknown;
  benefits: unknown;
  salaryMin: number | null;
  salaryMax: number | null;
  employmentType: string;
  workHours: string | null;
  publishedAt: Date;
  expiresAt: Date | null;
  validThrough: Date | null;
  applyUrl: string;
  isActive: boolean;
  sourceName: string | null;
  sourceUrl: string | null;
  locationType: string;
  seoTitle: string | null;
  seoDescription: string | null;
  featured: boolean;
  externalId: string | null;
  city: { name: string };
  state: { name: string };
  id: string;
};

function calculateMonthsFromValidThrough(validThrough: Date | null) {
  if (!validThrough) return "";

  const today = getBrazilNow();
  const validDate = dayjs(validThrough).tz(SITE_TIME_ZONE);
  const totalMonths = validDate.diff(today, "month");

  if (totalMonths <= 0 || totalMonths > 24) return "";
  return String(totalMonths);
}

function escapeCsvValue(value: unknown) {
  const stringValue = value == null ? "" : String(value);

  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, "\"\"")}"`;
  }

  return stringValue;
}

function serializeJobRow(job: ExportJob) {
  const row = {
    title: job.title,
    slug: job.slug,
    companyName: job.companyName,
    cityName: job.city.name,
    stateName: job.state.name,
    summary: job.summary,
    descriptionHtml: job.descriptionHtml,
    requirementsText: Array.isArray(job.requirements) ? job.requirements.join(", ") : "",
    benefitsText: Array.isArray(job.benefits) ? job.benefits.join(", ") : "",
    salaryMin: job.salaryMin ?? "",
    salaryMax: job.salaryMax ?? "",
    employmentType: job.employmentType,
    workHours: job.workHours ?? "",
    publishedAt: formatBrazilCalendarDate(job.publishedAt),
    expiresAt: job.expiresAt ? formatBrazilCalendarDate(job.expiresAt) : "",
    validThrough: job.validThrough ? formatBrazilCalendarDate(job.validThrough) : "",
    validThroughMonths: calculateMonthsFromValidThrough(job.validThrough),
    applyUrl: job.applyUrl,
    isActive: job.isActive,
    sourceName: job.sourceName ?? "",
    sourceUrl: job.sourceUrl ?? "",
    locationType: job.locationType,
    seoTitle: job.seoTitle ?? "",
    seoDescription: job.seoDescription ?? "",
    featured: job.featured,
    externalId: job.externalId ?? ""
  } satisfies Record<(typeof CSV_HEADERS)[number], string | number | boolean>;

  return CSV_HEADERS.map((header) => escapeCsvValue(row[header])).join(",");
}

export async function GET() {
  try {
    await requireApiRole("EDITOR");

    const encoder = new TextEncoder();

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        controller.enqueue(encoder.encode(`${CSV_HEADERS.join(",")}\n`));

        let cursor: string | null = null;

        while (true) {
          const jobs: ExportJob[] = await prisma.job.findMany({
            include: {
              city: true,
              state: true
            },
            orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
            take: EXPORT_BATCH_SIZE,
            ...(cursor
              ? {
                  skip: 1,
                  cursor: { id: cursor }
                }
              : {})
          });

          if (!jobs.length) break;

          const csvChunk = jobs.map((job: ExportJob) => serializeJobRow(job)).join("\n");
          controller.enqueue(encoder.encode(`${csvChunk}\n`));

          cursor = jobs[jobs.length - 1]?.id ?? null;
        }

        controller.close();
      }
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="vagas-export.csv"',
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    console.error("Erro ao exportar vagas:", error);
    const message = error instanceof Error ? error.message : "Nao foi possivel exportar vagas.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
