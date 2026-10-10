# Arquitetura de SEO

## Domínio e metadados

O domínio canônico é configurado em `SITE_URL`/painel SEO e normalizado sem `www`. `BaseLayout.astro` aplica idioma, sufixo de título, descrição, canonical, robots, Open Graph, Twitter Card, cor do tema e verificações Google/Bing. Páginas de erro desativam canonical e grafo.

O painel `/admin/seo` mantém domínio, idioma, sufixo, contatos públicos, logo/ALT da organização, imagem/ALT social e códigos de verificação. `/admin/seo/auditoria` registra problemas de vagas e notícias sem duplicar issues abertas.

## Indexação por ciclo de vida

- `PUBLISHED` e não vencida: indexável, no sitemap e elegível a `JobPosting` quando a contratante é pública.
- `PAUSED`, `EXPIRED` ou `CLOSED`: informativa sem candidatura, `noindex,follow`, fora do sitemap e sem `JobPosting`.
- `ARCHIVED` ou slug removido: 404/410; página de erro sem canonical nem JSON-LD.
- Busca e filtros arbitrários: `noindex,follow`; paginação estável recebe canonical próprio.

Ao sair de `PUBLISHED`, o evento de indexação pendente é removido. Redirect permanente só nasce de merge administrativo quando há destino equivalente.

## Descoberta

- `robots.txt` bloqueia admin, APIs e áreas privadas sem bloquear assets.
- o sitemap geral separa páginas, vagas, empresas, categorias, notícias e manifest;
- o sitemap Google News contém apenas notícias da janela de dois dias;
- feeds e sitemaps usam somente conteúdo público elegível.

## Auditorias

```powershell
npm run audit:seo
npm run audit:schemas
npm run audit:performance
```

`audit:seo -- --live http://host` acrescenta smoke HTTP. Os scripts não substituem Search Console, Rich Results Test ou validação após deploy.

