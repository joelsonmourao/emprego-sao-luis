# Dados estruturados

## Grafo único por página

`BaseLayout.astro` emite um único bloco `application/ld+json` com `@context` e `@graph`. O grafo contém, conforme a rota: `Organization`, `WebSite` com `SearchAction`, subtipo de `WebPage`, `BreadcrumbList` e entidades específicas como `JobPosting`, `NewsArticle` e `ItemList`.

Schemas recebidos por componentes perdem o `@context` próprio antes de entrar no grafo, evitando blocos duplicados.

## JobPosting

O builder retorna `null` se status não for `PUBLISHED`, a validade estiver ausente/vencida, a empresa for confidencial/desconhecida, a organização não for pública ou campos essenciais forem inválidos. `directApply` só é publicado quando explicitamente `true`; salário só aparece quando válido e público.

## NewsArticle

Notícias publicadas usam headline, resumo, datas, página principal, autor, publisher e três `ImageObject`: 16:9, 4:3 e 1:1. Dimensões, legenda e crédito acompanham as imagens. O OG usa 1200×630.

## Erros e validação

404 e 410 não emitem grafo. Empresa confidencial nunca expõe nome, site, slug ou logo no HTML/JSON-LD.

```powershell
npm run audit:schemas
npm run test -- --run packages/seo/src/job-posting.test.ts
```

Após deploy, validar amostras no Rich Results Test e Search Console; essa etapa externa não foi simulada localmente.

