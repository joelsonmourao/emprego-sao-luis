import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const lines = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /admin",
    "Disallow: /api/admin",
    `Sitemap: ${new URL("/sitemap.xml", site)}`,
    `Sitemap: ${new URL("/sitemap-news.xml", site)}`
  ];
  return new Response(`${lines.join("\n")}\n`, { headers: { "content-type": "text/plain; charset=utf-8" } });
};
