import { NextResponse } from "next/server";

import { buildAdsTxtFromPublisher } from "@/lib/google";
import { getSiteSettings } from "@/lib/site-settings";

export const revalidate = 3600;

export async function GET() {
  const settings = await getSiteSettings();
  const custom = settings.google.adsTxtContent.trim();

  let body: string;
  if (custom.length > 0) {
    body = custom.endsWith("\n") ? custom : `${custom}\n`;
  } else {
    const generated = buildAdsTxtFromPublisher(settings.google.adsensePublisherId);
    body = generated
      ? generated.endsWith("\n")
        ? generated
        : `${generated}\n`
      : "# ads.txt: defina o Publisher ID ou o conteudo em Admin > Integracoes.\n";
  }

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600"
    }
  });
}
