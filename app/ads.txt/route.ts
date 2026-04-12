import { NextResponse } from "next/server";

import { buildAdsTxtFromPublisher } from "@/lib/google";
import { getSiteSettings } from "@/lib/site-settings";

export async function GET() {
  const settings = await getSiteSettings();
  const configured = settings.google.adsTxtContent.trim();
  const content = configured || buildAdsTxtFromPublisher(settings.google.adsensePublisherId);

  return new NextResponse(content || "# Configure o Publisher ID do AdSense no admin para gerar o ads.txt.", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=600"
    }
  });
}

