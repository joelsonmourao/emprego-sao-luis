# Pacote editorial local (105 posts)

## Situação honesta

- Corpo do post já nasce em **HTML** (`content_html`) — o site e o admin usam HTML, não Markdown.
- Posts ficam **SCHEDULED** até o horário (ou até rodar o activate).
- Capas: `npm run generate:sl-local-covers` ou `npm run fetch:sl-local-covers` → `/covers/sl-local/`.
- **Migrate não publica conteúdo.** Atualize no **admin** ou rode o activate **uma vez** no Terminal.
- Volume alto ajuda rotina editorial; **não garante** aprovação AdSense.

## Colocar no ar (Terminal do **web**, depois do redeploy)

1. Coolify → serviço **web** Empregos São Luís  
2. Branch `codex/admin-negocio-completo` → **Force rebuild** (precisa do SHA com catálogo 105 + script na imagem)  
3. Terminal do **mesmo** web → cole:

```sh
cd /app
ls scripts/activate-sl-local-editorial.mjs
export ADSENSE_EDITORIAL_ALLOW_PRODUCTION=1
export SITE_URL=https://empregossaoluis.com.br
export SL_LOCAL_PUBLISH_NOW=6
node scripts/activate-sl-local-editorial.mjs --write --i-understand-production --rewrite-bodies
```

Se o banco só tiver ~45 posts, o activate **insere os faltantes** (46–105) e agenda ~3/dia.  
Se `ls` falhar, a imagem ainda é antiga — rebuild de novo.

Worker precisa estar ligado para o restante agendado.

## Atualizar textos

Mesmo comando com `--rewrite-bodies` regenera título + HTML a partir do catálogo (temas originais para candidato; inspiração de mercado, sem plágio).
