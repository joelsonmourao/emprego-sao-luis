# Modo Portal Editorial e Modo de Revisão AdSense

Painel: `/admin/adsense-readiness` → **Configurações**

## Aviso

Configurações **globais** (mesmo comportamento para visitante e crawler). **Proibido cloaking** por user-agent/IP.

Nenhuma das metas internas abaixo é regra oficial do Google AdSense.

## Modo Portal Editorial

**Objetivo:** apresentar o Empregos São Luís como portal editorial de emprego, carreira e mercado de trabalho (São Luís/Maranhão) durante preparação para nova análise AdSense.

Quando **ATIVO**:

- remove navegação/CTAs públicos de vagas;
- home editorial (notícias, guias, temas, institucional);
- URLs de job board usam landing `JobBoardPaused` (200 + noindex) — sem 404 em massa e sem redirect genérico para home;
- **não** emite JobPosting nessas URLs;
- sitemaps de vagas/empresas/cidades/categorias ficam vazios;
- importações, workers, banco e admin **continuam**;
- reversível pelo switch (sem deploy/restauração de banco).

Quando **DESATIVADO**: portal de vagas + editorial voltam ao comportamento normal.

Setting: `editorial_portal_mode` em `es_system_settings`.
API: `POST /api/admin/editorial-portal-mode` (`seo.manage` + auditoria).

## Modo de Revisão AdSense

Controle **separado**. Prioriza superfície editorial e restringe indexação de páginas de baixo valor (ex.: sitemap de jobs/web-stories conforme implementação).

Não substitui o Modo Portal Editorial.

Setting: `adsense_review_mode`.
API: `POST /api/admin/adsense-review-mode`.

## Qualidade editorial

- `/admin/qualidade-editorial` — filtros, severidade, correções seguras
- Editor: `#auditoria` com código, categoria, porquê e como corrigir
- Fontes institucionais **não** comprovam legislação/salário
- `APPROVED` sem revisor → bloqueio no save + classificação `REVISAR MANUALMENTE`
- Noindex **nunca** em massa automático

## Pacote de guias de qualidade (novos evergreen)

Arquivo CMS-ready: `scripts/data/adsense-quality-guides.mjs`
Capas estáticas: `apps/web/public/covers/adsense-quality/` (servidas em `/covers/adsense-quality/...`)
Persistência (requer `DATABASE_URL` no ambiente correto).

A imagem `Dockerfile.web` inclui **somente** o necessário para este comando administrativo:
`package.json` (scripts), `scripts/persist-adsense-quality-guides.mjs`,
`scripts/data/adsense-quality-guides.mjs` e `apps/web/public/covers/adsense-quality/*`.
Não copia o monorepo inteiro.

```sh
# dry-run (agenda + validação de capas)
npm run persist:adsense-quality-guides

# equivalente direto
node scripts/persist-adsense-quality-guides.mjs

# escrita idempotente (slug existente = skip)
npm run persist:adsense-quality-guides -- --write

# sobrescrever slugs do pacote (cuidado)
npm run persist:adsense-quality-guides -- --write --force
```

Produção / Coolify Terminal do serviço **web** (após backup; usa a `DATABASE_URL` já injetada no runtime):

```sh
cd /app
ls package.json scripts/persist-adsense-quality-guides.mjs scripts/data/adsense-quality-guides.mjs
ls apps/web/public/covers/adsense-quality/*.webp | wc -l
npm run | grep persist:adsense-quality-guides
export ADSENSE_EDITORIAL_ALLOW_PRODUCTION=1
npm run persist:adsense-quality-guides -- --write --i-understand-production
```

Regras do script:

- no máximo 2 `PUBLISH_NOW`;
- demais elegíveis: `SCHEDULED` 1/dia em `America/Sao_Paulo` (nunca no passado);
- `FACT_REVIEW` / `HOLD_REVIEW` → grava `DRAFT`, **não** agenda nem publica;
- não inventa `reviewerId`/`reviewedAt`;
- capa obrigatória no filesystem;
- transação com rollback;
- relatório inserted/updated/skipped/held.

Worker existente publica `SCHEDULED` automaticamente (`apps/worker/src/scheduled-publication.ts`).

**Não** use o seed template `adsense-editorial-*` para solicitar AdSense (é ignorado/bloqueado na Central).

## Antes de solicitar revisão ao Google

1. Ativar Modo Portal Editorial + Modo de Revisão AdSense
2. Persistir/publicar guias reais (pacote acima + corpus existente)
3. Aplicar correções seguras e revisar fontes factuais humanas
4. Conferir `/admin/adsense-readiness` (bloqueadores detalhados)
5. Revisar `ads.txt` / Publisher ID com credencial real
6. Só então solicitar análise — “Pronto” interno ≠ aprovação Google

Ver também: [ROTA_DA_APROVACAO.md](./ROTA_DA_APROVACAO.md), [ADSENSE_EDITORIAL_SCHEDULE.md](./ADSENSE_EDITORIAL_SCHEDULE.md), [LOCAL_EDITORIAL_SCHEDULE.md](./LOCAL_EDITORIAL_SCHEDULE.md).
