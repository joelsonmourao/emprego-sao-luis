import { JobStatus } from "@prisma/client";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { submitPublishedJobToIndexing } from "@/lib/job-publication";
import { normalizeOrigin } from "@/lib/site-url";
import { requireApiRole } from "@/lib/authz";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type ManualSubmitPayload = {
  url?: string;
};

function extractSlugFromJobUrl(rawUrl: string) {
  const expectedOrigin = normalizeOrigin(env.SITE_URL) ?? normalizeOrigin(env.NEXT_PUBLIC_SITE_URL);
  if (!expectedOrigin) {
    return { ok: false as const, message: "SITE_URL nao configurada no servidor." };
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return { ok: false as const, message: "URL invalida." };
  }

  if (normalizeOrigin(parsed.origin) !== expectedOrigin) {
    return { ok: false as const, message: "A URL deve pertencer ao dominio do SITE_URL." };
  }

  const match = parsed.pathname.match(/^\/vagas\/([^\/?#]+)\/?$/i);
  if (!match?.[1]) {
    return { ok: false as const, message: "A URL manual deve ser de uma pagina de vaga: /vagas/{slug}." };
  }

  return { ok: true as const, slug: decodeURIComponent(match[1]) };
}

export async function POST(request: Request) {
  try {
    await requireApiRole("ADMIN");
    const payload = (await request.json()) as ManualSubmitPayload;
    const url = payload.url?.trim() ?? "";
    if (!url) {
      return NextResponse.json({ ok: false, message: "Informe uma URL para envio manual." }, { status: 400 });
    }

    const slugResult = extractSlugFromJobUrl(url);
    if (!slugResult.ok) {
      return NextResponse.json({ ok: false, message: slugResult.message }, { status: 400 });
    }

    const job = await prisma.job.findUnique({
      where: { slug: slugResult.slug },
      select: { id: true, status: true }
    });
    if (!job) {
      return NextResponse.json({ ok: false, message: "Vaga nao encontrada para essa URL." }, { status: 404 });
    }
    if (job.status !== JobStatus.PUBLISHED) {
      return NextResponse.json(
        { ok: false, message: "Somente vagas com status PUBLISHED podem ser enviadas para indexacao." },
        { status: 400 }
      );
    }

    const result = await submitPublishedJobToIndexing(job.id);
    return NextResponse.json(result, { status: result.ok ? 200 : 207 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha no envio manual para Google Indexing API.";
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
