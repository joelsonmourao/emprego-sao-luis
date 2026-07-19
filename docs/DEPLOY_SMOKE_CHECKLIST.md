# Smoke pós-deploy (staging → produção)

Branch: `codex/admin-negocio-completo` · Deploy: migrate → web → worker · Mesmo volume `/app/data`.

## Confirmar no Coolify

- [ ] Branch = `codex/admin-negocio-completo`
- [ ] SHA = tip esperado (após push do commit desta entrega)
- [ ] `APP_ENV=staging` no staging; `production` só na produção
- [ ] `FORCE_NOINDEX=true` no staging
- [ ] `PUBLIC_ADSENSE_ENABLED=false` até Rota da Aprovação interna OK
- [ ] `DATABASE_URL` / `AUTH_SECRET` distintos por ambiente

## URLs públicas (substitua o domínio)

| Check | Esperado |
|-------|----------|
| `/api/ready` | `database`, `schema`, `redis` = ok |
| `/brand/icon-instagram.webp` | 200 |
| `/brand/logo-horizontal.webp` | 200 e logo nítida no header |
| `/favicon-32x32.png` | 200 |
| `/modelos/modelo-importacao-vagas.xlsx` | 200 |
| `/web-stories` | 200; `noindex` se vazio |
| `/blog` e `/noticias` | `noindex` se vazios |
| Página de vaga com WhatsApp/e-mail | botões de candidatura (não só compartilhar) |

## Admin (após login real)

| Check | Esperado |
|-------|----------|
| `/admin` | 6 cards “Operação do dia” |
| `/admin/vagas/importar` | card grande Excel + CSV + texto bairro opcional |
| `/admin/adsense-readiness` | aviso de AdSense desligado + checklist |
| Menu | “Operação do dia” no topo; resto em grupos |

## Limpeza de lixo (produção)

Com backup e `DATABASE_URL` de produção autorizada:

```bash
node scripts/archive-junk-jobs.mjs --dry-run
node scripts/archive-junk-jobs.mjs --write
```

Só arquiva títulos claramente de teste (ex.: `sqsqs`) — nunca dados reais sem revisão.

## Agenda AdSense (interno)

Ver [ADSENSE_EDITORIAL_SCHEDULE.md](./ADSENSE_EDITORIAL_SCHEDULE.md) e comandos PowerShell em [DEPLOY_POWERSHELL.md](./DEPLOY_POWERSHELL.md).

- [ ] Worker redeployado (publica `SCHEDULED`)
- [ ] Seed editorial dry-run + `--write` no staging
- [ ] `/admin/adsense-readiness` mostra meta editorial (ex.: 6/15)
- [ ] Institucionais sem placeholder
- [ ] `PUBLIC_ADSENSE_ENABLED=false` até “Pronto para solicitar análise” + Publisher ID real
