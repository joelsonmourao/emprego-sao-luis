# Pacote editorial local (45 posts em ~2 semanas)

## Onde atualizar conteúdo (um só lugar)

**Admin** → Notícias e guias / Calendário editorial.  
O serviço **migrate** só aplica migrations de banco — **não** cria nem reescreve posts.

## Seed (só uma vez, se ainda não rodou)

Capas no deploy do **web** (`/covers/sl-local/`). Depois, **uma vez** no Terminal do Coolify (container que tenha o script + `DATABASE_URL`), não por variável permanente no migrate:

```sh
cd /app
export ADSENSE_EDITORIAL_ALLOW_PRODUCTION=1
export SITE_URL=https://empregossaoluis.com.br
node scripts/seed-local-editorial-schedule.mjs --write --i-understand-production
```

Se os 45 `sl-local-*` já existem, o script **não altera nada**.

Corrigir título SEO (≤70) / URL de capa em lote **só se pedir**:

```sh
node scripts/seed-local-editorial-schedule.mjs --write --i-understand-production --fix-seo
```

## Coolify — o que apagar nas envs do migrate

Remova se ainda existirem (evitam loop/restart):

- `RUN_SEED_LOCAL_EDITORIAL`
- `RUN_SEED_ADSENSE_EDITORIAL`
- `RUN_UNPUBLISH_ADSENSE_EDITORIAL`
- `ADSENSE_EDITORIAL_ALLOW_PRODUCTION` (se só servia para isso)

## Gerar capas (dev)

```powershell
npm run generate:sl-local-covers
```

## Pedido AdSense

Só após a janela de publicação, Rota **Pronto**, institucionais ok — anúncios ainda off.
