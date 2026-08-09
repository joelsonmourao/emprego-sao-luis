import type { APIRoute } from "astro";
import { isStagingLikeEnvironment } from "../lib/runtime-env";
import { getRuntimeSiteUrl } from "../lib/canonical-url";

export const GET: APIRoute = () => {
  if (isStagingLikeEnvironment()) {
    const lines = [
      "User-agent: *",
      "Disallow: /",
      "# Staging/homologação: bloqueio total. Não enviar este domínio ao Search Console."
    ];
    return new Response(`${lines.join("\n")}\n`, {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow",
        "Cache-Control": "no-store"
      }
    });
  }

  const site = getRuntimeSiteUrl();
  const lines = [
    "User-agent: *",
    "Allow: /",
    "Allow: /api/uploads/",
    "Allow: /api/brand-assets/",
    "Allow: /api/brand-manifest.webmanifest",
    "Disallow: /admin",
    "Disallow: /admin/",
    "Disallow: /api/",
    "Disallow: /empresa",
    "Disallow: /empresa/",
    "Disallow: /minha-conta",
    "Disallow: /entrar",
    "Disallow: /acesso",
    "Disallow: /confirmar-alerta",
    "Disallow: /descadastrar",
    "Disallow: /*?*preview=",
    `Sitemap: ${new URL("/sitemap.xml", site)}`,
    `Sitemap: ${new URL("/sitemap-news.xml", site)}`
  ];
  return new Response(`${lines.join("\n")}\n`, { headers: { "content-type": "text/plain; charset=utf-8" } });
};
