import { AuditAction } from "@prisma/client";
import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";


import { writeAuditLog } from "@/lib/audit";
import { requireApiRole } from "@/lib/authz";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";


export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
const uploadsDir = path.join(process.cwd(), "public", "uploads", "site");

export async function GET() {
  await requireApiRole("EDITOR");
  const assets = await prisma.mediaAsset.findMany({
    orderBy: [{ createdAt: "desc" }]
  });

  return NextResponse.json({ ok: true, assets });
}

export async function POST(request: Request) {
  try {
    const session = await requireApiRole("EDITOR");
    const formData = await request.formData();
    const file = formData.get("file");
    const altText = String(formData.get("altText") ?? "");

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "Selecione um arquivo valido." }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ ok: false, error: "Envie uma imagem JPG, PNG, WEBP ou SVG." }, { status: 400 });
    }

    await fs.mkdir(uploadsDir, { recursive: true });

    const extension = path.extname(file.name) || (file.type === "image/svg+xml" ? ".svg" : ".png");
    const fileName = `${Date.now()}-${slugify(path.basename(file.name, extension))}${extension.toLowerCase()}`;
    const filePath = path.join(uploadsDir, fileName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    const url = `/uploads/site/${fileName}`;

    const asset = await prisma.mediaAsset.create({
      data: {
        originalName: file.name,
        fileName,
        mimeType: file.type || "application/octet-stream",
        size: file.size,
        url,
        altText: altText.trim() || null
      }
    });

    await writeAuditLog({
      actorId: session.sub,
      actorName: session.name,
      actorEmail: session.email,
      actorRole: session.role,
      action: AuditAction.CREATE,
      entityType: "media_asset",
      entityId: asset.id,
      entityLabel: asset.originalName,
      summary: "Imagem enviada para a biblioteca",
      after: { url: asset.url, mimeType: asset.mimeType }
    });

    return NextResponse.json({ ok: true, asset });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nao foi possivel enviar a imagem.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
