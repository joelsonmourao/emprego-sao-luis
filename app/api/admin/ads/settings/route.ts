import { NextResponse } from "next/server";

import { requireApiRole } from "@/lib/authz";
import { adSettingsPatchSchema } from "@/lib/schemas/ad-admin";
import { upsertAdSettings } from "@/lib/repositories/ad-system";

export async function PATCH(request: Request) {
  await requireApiRole("ADMIN");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON invalido." }, { status: 400 });
  }

  const parsed = adSettingsPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Payload invalido." }, { status: 400 });
  }

  const row = await upsertAdSettings(parsed.data.globalEnabled);
  return NextResponse.json({
    ok: true,
    settings: { globalEnabled: row.globalEnabled, updatedAt: row.updatedAt.toISOString() }
  });
}
