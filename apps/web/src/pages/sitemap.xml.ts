import type { APIRoute } from "astro";
const paths = ["/", "/vagas", "/empresas", "/categorias", "/blog", "/quem-somos", "/contato", "/privacidade", "/termos", "/cookies", "/anunciar-vaga"];
export const GET: APIRoute = ({ site }) => new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `<url><loc>${new URL(path, site)}</loc></url>`).join("")}</urlset>`, { headers: { "content-type": "application/xml; charset=utf-8" } });
