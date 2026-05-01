import { NextResponse } from "next/server";



export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "jovem-aprendiz-vagas-next",
    timestamp: new Date().toISOString()
  });
}
