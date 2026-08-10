# Fase 3 — Portal público

O portal Astro agora preserva as rotas públicas centrais, oferece HTML no primeiro response, listagem e detalhe ligados ao Drizzle, estado 410, formulário de busca, páginas de empresa/categoria/cidade, políticas, contato, anúncio de vaga, robots e sitemap. O detalhe produz `JobPosting` apenas para vagas publicadas.

As consultas reais dependem da migration e de `DATABASE_URL`; sem banco, a listagem fica vazia de forma honesta. Não foram inventadas vagas, salários ou empresas.
