import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(180),
  subject: z.string().trim().min(3).max(180),
  message: z.string().trim().min(10).max(5000)
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Preencha todos os campos corretamente." }, { status: 400 });
    }

    await prisma.contactMessage.create({
      data: parsed.data
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contato] Falha ao salvar mensagem.", error);
    return NextResponse.json({ error: "Não foi possível registrar sua mensagem agora." }, { status: 500 });
  }
}
