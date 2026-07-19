# Agenda editorial interna (AdSense)

**Aviso:** o Google **não** publica uma quantidade mínima oficial de posts para aprovar o AdSense. Os números abaixo são **meta interna** do Empregos São Luís para a Rota da Aprovação (`/admin/adsense-readiness`).

## Meta interna

| Item | Valor |
|------|--------|
| Posts publicados substanciais | **15** |
| Caracteres úteis mínimos | **800** (HTML sem tags) |
| Autoria + fontes | obrigatório em cada publicado |
| Pilar + cluster | obrigatório para “Pronto para solicitar” |
| Anúncios no site | `PUBLIC_ADSENSE_ENABLED=false` até checklist verde + Publisher ID real |

## O que o seed cria

Script: `scripts/seed-adsense-editorial-schedule.mjs`

- 1 autor, 1 pilar, 3 clusters
- **6** artigos **PUBLISHED** imediatamente (≥800 caracteres)
- **12** artigos **SCHEDULED** em dias úteis (worker publica automaticamente)
- **3** Web Stories **SCHEDULED** ligadas a Posts Magnéticos

Quando o worker publicar os agendados, a meta de 15 substanciais é atingida (~4 semanas em ritmo de dias úteis).

## Comandos

Dry-run (sempre primeiro):

```powershell
npm run seed:adsense-editorial
```

Local E2E (`DATABASE_URL` em `127.0.0.1:55432`, banco com `staging` ou `e2e`):

```powershell
npm run seed:adsense-editorial -- --write
```

Staging remoto (Coolify / one-off), após backup:

```powershell
$env:ADSENSE_EDITORIAL_ALLOW_REMOTE="1"
$env:DATABASE_URL="..."   # URL interna do staging — nunca cole senha no chat
$env:SITE_URL="https://seu-staging.exemplo"
npm run seed:adsense-editorial -- --write
```

Produção (só com backup + autorização explícita):

```powershell
$env:ADSENSE_EDITORIAL_ALLOW_PRODUCTION="1"
$env:DATABASE_URL="..."
npm run seed:adsense-editorial -- --write --i-understand-production
```

## O que ainda é manual (AdSense “cobra” na prática)

1. Páginas institucionais sem placeholder (`/admin/paginas`): quem-somos, contato, privacidade, cookies, termos, política editorial/fontes/correções, LGPD.
2. Conta AdSense real → `PUBLIC_ADSENSE_PUBLISHER_ID` / client + `ads.txt`.
3. Só então `PUBLIC_ADSENSE_ENABLED=true` no Coolify (após “Pronto para solicitar análise”).
4. Vagas reais válidas (não inventar empresas); limpar lixo com `archive-junk-jobs` se necessário.
5. Validação mobile visual pós-deploy.

## Painel

- Checklist: `/admin/adsense-readiness`
- Calendário: `/admin/calendario-editorial`
- Fluxo: Pilares → Post Magnético → Web Stories → Rota da Aprovação
