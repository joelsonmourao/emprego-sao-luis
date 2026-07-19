# Pacote editorial local (45 posts em ~2 semanas)

Agenda **45** artigos `sl-local-*` com status `SCHEDULED`, ~**3 por dia** (09:00 / 13:00 / 17:00 America/São_Paulo), cada um com **capa exclusiva** em `/covers/sl-local/{slug}.webp`.

Isso alimenta a meta interna da Rota da Aprovação. **Não garante** aprovação do Google AdSense.

## Gerar capas (local / CI)

```powershell
npm run generate:sl-local-covers
```

## Dry-run / write

```powershell
npm run seed:local-editorial
# staging/local E2E:
npm run seed:local-editorial -- --write
```

## Produção (Coolify one-shot)

1. **Redeploy web** na branch `codex/admin-negocio-completo` (leva as capas em `public/covers/sl-local/`).
2. No **migrate-staging**:
   - `RUN_SEED_LOCAL_EDITORIAL=true`
   - `ADSENSE_EDITORIAL_ALLOW_PRODUCTION=1`
   - `SITE_URL=https://empregossaoluis.com.br`
   - Remova `RUN_SEED_ADSENSE_EDITORIAL` / `RUN_UNPUBLISH_ADSENSE_EDITORIAL` se não forem necessários.
3. Force rebuild do migrate.
4. Logs: `Seed editorial local concluído` com `scheduled: 45`.
5. **Apague obrigatoriamente** `RUN_SEED_LOCAL_EDITORIAL` e `ADSENSE_EDITORIAL_ALLOW_PRODUCTION` (senão o migrate reinicia em loop).
6. Confirme **worker** ativo (publica quando `scheduled_at <= now`).
7. Confira `/admin/calendario-editorial`.

Idempotente: se já existirem slugs `sl-local-*`, o script **não faz nada** (não fica regravando a cada migrate).

Ajuste pontual de SEO/capa (máx. 70 chars):  
`node scripts/seed-local-editorial-schedule.mjs --write --fix-seo --i-understand-production`  
Depois **remova** `RUN_SEED_LOCAL_EDITORIAL` do Coolify para o migrate não reiniciar em loop.

### Erro “Campos editoriais inválidos” no admin

Causa comum: **Título SEO > 70 caracteres**. Encurte o campo ou rode uma vez com `--fix-seo`. Ao salvar `SCHEDULED`, a data/hora precisa estar **no futuro**.

## Pedido AdSense

Só após a janela de publicação (~15 dias), Rota **Pronto** com posts reais no ar, institucionais ok, anúncios ainda off.
