import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "jovem-aprendiz-vagas-next",
    timestamp: new Date().toISOString()
  });
}
