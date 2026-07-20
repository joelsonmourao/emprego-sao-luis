# Pacote editorial local (45 posts)

## Situação honesta

- Posts ficam **SCHEDULED** até o horário (ou até rodar o activate).
- Capas fotográficas: `npm run fetch:sl-local-covers` → `/covers/sl-local/`.
- **Migrate não publica conteúdo.** Atualize no **admin** ou rode o activate **uma vez** no Terminal.

## Colocar no ar (Terminal do **web**, depois do redeploy)

1. Coolify → serviço **web** Empregos São Luís  
2. Branch `codex/admin-negocio-completo` → **Force rebuild** (precisa do SHA com o script na imagem)  
3. Terminal do **mesmo** web → cole:

```sh
cd /app
ls scripts/activate-sl-local-editorial.mjs
export ADSENSE_EDITORIAL_ALLOW_PRODUCTION=1
export SITE_URL=https://empregossaoluis.com.br
export SL_LOCAL_PUBLISH_NOW=3
node scripts/activate-sl-local-editorial.mjs --write --i-understand-production
```

Se `ls` falhar, a imagem ainda é antiga — rebuild de novo.

Worker precisa estar ligado para o restante agendado.

## Apagar envs do migrate

Não use `RUN_SEED_*` editorial no migrate. Remova se ainda existirem.

## Dev

```powershell
npm run fetch:sl-local-covers
npm run activate:local-editorial
```
