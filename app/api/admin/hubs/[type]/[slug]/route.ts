import { HubType } from "@prisma/client";
import { NextResponse } from "next/server";

import { upsertHubProfile } from "@/lib/admin/site";
import { requireApiRole } from "@/lib/authz";
import { getHubProfile } from "@/lib/repositories/hubs";

const hubTypeMap: Record<string, HubType> = {
  state: "STATE",
  city: "CITY",
  company: "COMPANY"
};

function getHubType(rawType: string) {
  return hubTypeMap[rawType];
}

type Context = {
  params: Promise<{ type: string; slug: string }>;
};

export async function GET(_request: Request, context: Context) {
  await requireApiRole("EDITOR");
  const { type, slug } = await context.params;
  const hubType = getHubType(type);

  if (!hubType) {
    return NextResponse.json({ ok: false, error: "Tipo de hub invalido." }, { status: 400 });
  }

  const profile = await getHubProfile(hubType, slug);
  return NextResponse.json({ ok: true, profile });
}

export async function PATCH(request: Request, context: Context) {
  try {
    await requireApiRole("EDITOR");
    const { type, slug } = await context.params;
    const hubType = getHubType(type);

    if (!hubType) {
      return NextResponse.json({ ok: false, error: "Tipo de hub invalido." }, { status: 400 });
    }

    const payload = await request.json();
    await upsertHubProfile({
      type: hubType,
      slug,
      title: payload.title,
      intro: payload.intro,
      contentHtml: payload.contentHtml,
      seoTitle: payload.seoTitle,
      seoDescription: payload.seoDescription,
      canonicalUrl: payload.canonicalUrl,
      socialImageUrl: payload.socialImageUrl,
      noIndex: payload.noIndex
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nao foi possivel salvar o hub.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
