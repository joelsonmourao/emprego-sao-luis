# Subir tudo (PowerShell) — `C:\Users\Joelson\Documents\ES`

Ordem: **push Git → Coolify migrate → web → worker → smoke → seed editorial (staging) → só depois AdSense**.

Não ative `PUBLIC_ADSENSE_ENABLED=true` sem Publisher ID real e checklist verde em `/admin/adsense-readiness`.

## 1. Conferir branch e SHA

```powershell
cd C:\Users\Joelson\Documents\ES
git status
git branch --show-current
git log -1 --oneline
```

Branch esperada: `codex/admin-negocio-completo`.

Se houver alterações locais que devem ir (exceto `Logo/` e lixo):

```powershell
git add -A
git status
# Só faça commit se você pediu commit explicitamente ao agente, ou commit você mesmo.
git push -u origin HEAD
```

Anote o SHA: `git rev-parse --short HEAD`.

## 2. Coolify (mesmo SHA nos 3 serviços)

No painel Coolify, no ambiente certo (staging primeiro):

1. Confirme branch = `codex/admin-negocio-completo` e o SHA do push.
2. **Backup** do PostgreSQL + volume `/app/data`.
3. Rode o job **migrate** (`Dockerfile.migrate`) — espere exit 0 e migrations `applied: true`.
4. Redeploy **web** (`Dockerfile.web`).
5. Redeploy **worker** (`Dockerfile.worker`) — necessário para posts `SCHEDULED`.
6. Variáveis (web): `PUBLIC_ADSENSE_ENABLED=false` até a Rota da Aprovação OK.

## 3. Smoke rápido (troque o domínio)

```powershell
$base = "https://SEU-DOMINIO-STAGING"
Invoke-WebRequest "$base/api/ready" | Select-Object -ExpandProperty Content
Invoke-WebRequest "$base/brand/icon-instagram.webp" | Select-Object StatusCode
Invoke-WebRequest "$base/modelos/modelo-importacao-vagas.xlsx" | Select-Object StatusCode
```

Checklist completo: [DEPLOY_SMOKE_CHECKLIST.md](./DEPLOY_SMOKE_CHECKLIST.md).

## 4. Seed editorial (staging) — volume AdSense interno

No PC, com `DATABASE_URL` do **staging** (URL interna ou tunnel que você já use; nunca cole senha no chat):

```powershell
cd C:\Users\Joelson\Documents\ES
$env:ADSENSE_EDITORIAL_ALLOW_REMOTE = "1"
$env:SITE_URL = "https://SEU-DOMINIO-STAGING"
# $env:DATABASE_URL = "postgresql://..."   # staging only
npm run seed:adsense-editorial
npm run seed:adsense-editorial -- --write
```

Ou execute o mesmo `node scripts/seed-adsense-editorial-schedule.mjs --write` num one-off Coolify com as variáveis acima.

Confira:

- `/admin/calendario-editorial` — posts agendados
- `/admin/adsense-readiness` — meta 6/15 → sobe conforme o worker publica
- `/admin/paginas` — complete institucionais sem placeholder

## 5. Produção (só após staging OK)

1. Promova o **mesmo SHA**.
2. migrate → web → worker.
3. Smoke de produção.
4. **Não** use o seed `adsense-editorial-*` para pedir AdSense (template). Se já estiver no ar, despublique via migrate one-shot:
   - `RUN_UNPUBLISH_ADSENSE_EDITORIAL=true` + `ADSENSE_EDITORIAL_ALLOW_PRODUCTION=1`
   - redeploy migrate → logs OK → **remova** as duas envs → redeploy web
5. Pacote local agendado (45 posts, capas únicas): ver [LOCAL_EDITORIAL_SCHEDULE.md](./LOCAL_EDITORIAL_SCHEDULE.md) — redeploy **web** primeiro, depois migrate com `RUN_SEED_LOCAL_EDITORIAL=true`.
6. Quando a Rota da Aprovação estiver **Pronto** (posts já publicados) e você tiver conta AdSense: Publisher ID / ads.txt; só então `PUBLIC_ADSENSE_ENABLED=true`.

## 6. Limpeza de vagas lixo (opcional)

```powershell
node scripts/archive-junk-jobs.mjs --dry-run
# produção: ARCHIVE_JUNK_ALLOW_PRODUCTION=1 + --write após backup
```
