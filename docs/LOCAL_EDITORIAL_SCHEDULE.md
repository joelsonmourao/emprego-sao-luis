# Pacote editorial local (45 posts)

## Situação honesta

- Posts ficam **SCHEDULED** até o horário (ou até rodar o activate).
- Capas fotográficas: `npm run fetch:sl-local-covers` → `/covers/sl-local/`.
- **Migrate não publica conteúdo.** Atualize no **admin** ou rode o activate **uma vez** no Terminal.

## Colocar no ar (uma vez no Coolify Terminal)

1. Redeploy **web** (leva as capas novas).
2. Confirme **worker** ligado.
3. No Terminal (container com script + `DATABASE_URL`), **uma vez**:

```sh
cd /app
export ADSENSE_EDITORIAL_ALLOW_PRODUCTION=1
export SITE_URL=https://empregossaoluis.com.br
# opcional: quantos publicar agora (default 3)
export SL_LOCAL_PUBLISH_NOW=3
node scripts/activate-sl-local-editorial.mjs --write --i-understand-production
```

Isso:
- publica **3** posts agora (aparecem em `/blog` e `/noticias`)
- agenda o restante ~3/dia
- aplica créditos/URLs das capas de `credits.json`

Sem `--write` = dry-run.

## Apagar envs do migrate

Não use `RUN_SEED_*` editorial no migrate. Remova se ainda existirem.

## Dev

```powershell
npm run fetch:sl-local-covers
npm run activate:local-editorial
```
