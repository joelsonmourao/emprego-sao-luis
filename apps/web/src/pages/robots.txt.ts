import type { APIRoute } from "astro";
import { isStagingLikeEnvironment } from "../lib/runtime-env";

export const GET: APIRoute = ({ site }) => {
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

  const lines = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /admin/",
    "Disallow: /api/",
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
