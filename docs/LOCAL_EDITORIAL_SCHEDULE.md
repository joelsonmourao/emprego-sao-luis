# Pacote editorial local (105 posts)

## Situação honesta

- Corpo do post já nasce em **HTML** (`content_html`) — o site e o admin usam HTML, não Markdown.
- **Resumo / descrição SEO:** texto puro (não HTML, não Markdown).
- Mix SEO: **5 NEWS** (gancho sazonal → `/noticias`) · **6 DATA_REPORT** (mapa/checklist) · restante **GUIDE** (`/blog`).
- Capas: gerar **depois** do catálogo e só então activate — URL = `/covers/sl-local/{slug-do-catálogo}.webp`.
- **Migrate não publica conteúdo.** Atualize no **admin** ou rode o activate **uma vez** no Terminal.
- Volume alto ajuda rotina editorial; **não garante** aprovação AdSense.

## Capas (ordem correta)

1. Capas já usam o **slug SEO** (ex.: `decimo-terceiro-salario-pagamento-clt.webp`).
2. Commit das webps + `credits.json` + `apps/web/src/data/sl-local-slug-map.ts`
3. Force rebuild do **web**
4. Terminal → activate `--rewrite-bodies` (atualiza slug no banco + capa)

URL antiga `/noticias/sl-local-09-decimo-terceiro` → **301** para `/noticias/decimo-terceiro-salario-pagamento-clt`.


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
