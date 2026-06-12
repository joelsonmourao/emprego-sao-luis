import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";

const jobSubmissionSchema = z.object({
  companyName: z.string().trim().min(2).max(180),
  contactName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(180),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  jobTitle: z.string().trim().min(3).max(180),
  city: z.string().trim().min(2).max(120),
  description: z.string().trim().min(20).max(8000),
  applyUrl: z.string().trim().url().max(500).optional().or(z.literal("")),
  message: z.string().trim().max(3000).optional().or(z.literal(""))
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = jobSubmissionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Revise os campos e tente novamente." }, { status: 400 });
    }

    const data = parsed.data;

    await prisma.jobSubmission.create({
      data: {
        companyName: data.companyName,
        contactName: data.contactName,
        email: data.email,
        phone: data.phone || null,
        jobTitle: data.jobTitle,
        city: data.city,
        description: data.description,
        applyUrl: data.applyUrl || null,
        message: data.message || null
      }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[anunciar-vaga] Falha ao salvar solicitação.", error);
    return NextResponse.json({ error: "Não foi possível registrar sua solicitação agora." }, { status: 500 });
  }
}
