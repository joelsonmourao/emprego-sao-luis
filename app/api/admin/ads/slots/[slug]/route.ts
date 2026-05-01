import { NextResponse } from "next/server";

import { adSlotPatchSchema } from "@/lib/schemas/ad-admin";



export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
type RouteContext = { params: Promise<{ slug: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const [{ requireApiRole }, { updateAdSlotBySlug }] = await Promise.all([
      import("@/lib/authz"),
      import("@/lib/repositories/ad-system")
    ]);

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
  } catch (error) {
    console.error("Erro na rota PATCH /api/admin/ads/slots/[slug]:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Erro interno ao atualizar slot de anuncio."
      },
      { status: 500 }
    );
  }
}
