import { NextResponse } from "next/server";

import { requireApiRole } from "@/lib/authz";
import { adSlotPatchSchema } from "@/lib/schemas/ad-admin";
import { updateAdSlotBySlug } from "@/lib/repositories/ad-system";

type RouteContext = { params: Promise<{ slug: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  await requireApiRole("ADMIN");

  const { slug } = await context.params;
  if (!slug) {
    return NextResponse.json({ ok: false, error: "Slug obrigatorio." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON invalido." }, { status: 400 });
  }

  const parsed = adSlotPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Payload invalido." }, { status: 400 });
  }

  try {
    const row = await updateAdSlotBySlug(slug, parsed.data);
    return NextResponse.json({ ok: true, slot: row });
  } catch {
    return NextResponse.json({ ok: false, error: "Slot nao encontrado." }, { status: 404 });
  }
}
