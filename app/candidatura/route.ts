import { JobStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";

const TRUSTED_WEBHOOK_HOST = "webhook.empregossaoluis.com.br";
const TRUSTED_FALLBACK_PATHS = new Set(["/candidatura/abrir", "/candidatura/email"]);

function clean(value: string | null, maxLength: number) {
  return (value ?? "").trim().slice(0, maxLength);
}

function trustedFallback(raw: string | null) {
  if (!raw) return null;

  try {
    const url = new URL(raw);
    if (url.protocol !== "https:") return null;
    if (url.hostname.toLowerCase() !== TRUSTED_WEBHOOK_HOST) return null;
    if (!TRUSTED_FALLBACK_PATHS.has(url.pathname)) return null;
    return url;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const mediaId = clean(request.nextUrl.searchParams.get("media_id"), 80);
  const permalink = clean(request.nextUrl.searchParams.get("permalink"), 500);
  const jobTitle = clean(request.nextUrl.searchParams.get("job"), 180);
  const fallback = trustedFallback(request.nextUrl.searchParams.get("fallback"));

  const publishedScope = {
    status: JobStatus.PUBLISHED,
    isActive: true,
    publishedAt: { not: null }
  } as const;

  let job: { slug: string } | null = null;

  if (mediaId) {
    job = await prisma.job.findFirst({
      where: { ...publishedScope, externalId: mediaId },
      select: { slug: true },
      orderBy: { publishedAt: "desc" }
    });
  }

  if (!job && permalink && /^https:\/\/(?:www\.)?instagram\.com\//i.test(permalink)) {
    job = await prisma.job.findFirst({
      where: { ...publishedScope, sourceUrl: permalink },
      select: { slug: true },
      orderBy: { publishedAt: "desc" }
    });
  }

  if (!job && jobTitle) {
    job = await prisma.job.findFirst({
      where: { ...publishedScope, title: { equals: jobTitle, mode: "insensitive" } },
      select: { slug: true },
      orderBy: { publishedAt: "desc" }
    });
  }

  if (job) {
    const destination = new URL(`/vagas/${job.slug}`, request.url);
    destination.searchParams.set("candidatar", "1");
    destination.searchParams.set("utm_source", "instagram");
    destination.searchParams.set("utm_medium", "direct");
    destination.searchParams.set("utm_campaign", "candidatura");
    return NextResponse.redirect(destination, 307);
  }

  if (fallback) {
    return NextResponse.redirect(fallback, 307);
  }

  const jobsUrl = new URL("/vagas", request.url);
  if (jobTitle) jobsUrl.searchParams.set("q", jobTitle);
  jobsUrl.searchParams.set("utm_source", "instagram");
  jobsUrl.searchParams.set("utm_medium", "direct");
  return NextResponse.redirect(jobsUrl, 307);
}
