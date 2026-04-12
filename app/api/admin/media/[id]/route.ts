import { AuditAction } from "@prisma/client";
import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

import { writeAuditLog } from "@/lib/audit";
import { requireApiRole } from "@/lib/authz";
import { prisma } from "@/lib/db";

type Context = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, context: Context) {
  try {
    const session = await requireApiRole("ADMIN");
    const { id } = await context.params;
    const asset = await prisma.mediaAsset.findUnique({
      where: { id }
    });

    if (!asset) {
      return NextResponse.json({ ok: false, error: "Midia nao encontrada." }, { status: 404 });
    }

    const filePath = path.join(process.cwd(), "public", asset.url.replace(/^\//, "").replace(/\//g, path.sep));
    await prisma.mediaAsset.delete({ where: { id } });
    await fs.unlink(filePath).catch(() => undefined);

    await writeAuditLog({
      actorId: session.sub,
      actorName: session.name,
      actorEmail: session.email,
      actorRole: session.role,
      action: AuditAction.DELETE,
      entityType: "media_asset",
      entityId: asset.id,
      entityLabel: asset.originalName,
      summary: "Midia removida da biblioteca"
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nao foi possivel remover a imagem.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
