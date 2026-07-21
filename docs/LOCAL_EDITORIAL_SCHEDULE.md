# Pacote editorial local (105 posts)

## Situação honesta

- Corpo do post já nasce em **HTML** (`content_html`) — o site e o admin usam HTML, não Markdown.
- **Resumo / descrição SEO:** texto puro (não HTML, não Markdown).
- Mix SEO: **5 NEWS** (gancho sazonal → `/noticias`) · **6 DATA_REPORT** (mapa/checklist) · restante **GUIDE** (`/blog`).
- Capas: gerar **depois** do catálogo e só então activate — URL = `/covers/sl-local/{slug-do-catálogo}.webp`.
- **Migrate não publica conteúdo.** Atualize no **admin** ou rode o activate **uma vez** no Terminal.
- Volume alto ajuda rotina editorial; **não garante** aprovação AdSense.

## Capas (ordem correta)

1. `npm run generate:sl-local-covers` **ou** `npm run fetch:sl-local-covers`
2. Commit das webps + `credits.json`
3. Force rebuild do **web** (precisa servir `/covers/sl-local/*.webp` no `dist`)
4. Terminal do web → activate com `--rewrite-bodies` (sincroniza **slug + capa** com o catálogo)

## Colocar no ar (Terminal do **web**, depois do redeploy)

```sh
cd /app
ls scripts/activate-sl-local-editorial.mjs
export ADSENSE_EDITORIAL_ALLOW_PRODUCTION=1
export SITE_URL=https://empregossaoluis.com.br
export SL_LOCAL_PUBLISH_NOW=6
node scripts/activate-sl-local-editorial.mjs --write --i-understand-production --rewrite-bodies
```

Worker precisa estar ligado para o restante agendado.
