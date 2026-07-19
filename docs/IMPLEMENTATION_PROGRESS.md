# Progresso da implementação

## Estado atual

Branch de trabalho: `codex/reconstrucao-astro`.

Arquitetura ativa preservada: Astro 7, Drizzle, PostgreSQL, Valkey/BullMQ, Docker e worker separado. A `main` não foi alterada ou mesclada. O banco de produção não foi usado nos testes mutáveis.

## Estabilização administrativa concluída

- Storage central `@es/storage`, com S3/R2 opcional e fallback para volume compartilhado.
- Estrutura persistente `/app/data/{imports,media,brand,reports,temp,receipts}` e diagnóstico em startup/readiness/admin.
- Importação XLSX/CSV com validação real, mapeamento completo, fila/fallback inline, histórico e desfazer.
- Seeds idempotentes de localizações, categorias e defaults, acionados por flags no migrate.
- Cadastro rápido de cidade, categoria e empresa integrado ao formulário de vaga.
- Vagas completas com nome público/confidencial, conteúdo, SEO, revisões, auditoria, agenda e publicação.
- Autores e conteúdo editorial com JSON/form consistente, revisão, imagem, SEO e status.
- Mídia local/R2 com validação por Sharp, ALT, preview, uso e exclusão segura.
- APIs administrativas padronizadas, `requestId`, logs sanitizados e bridge único de formulário/download.
- Inventário automático das rotas administrativas e proteção contra navegação direta para API.
- Auditoria real do schema PostgreSQL contra Drizzle.

## Migration e seeds

- Migrations vigentes de `0000` a `0023`, incluindo estabilização administrativa (`0021`), integridade de conteúdo/importação (`0022`) e imagens editoriais (`0023`).
- Schema auditado: 59 tabelas, 695 colunas, 121 índices, 158 constraints, 10 enums e zero divergência.
- Seeds confirmados no ambiente isolado: 27 estados, 8 cidades do Maranhão, 10 categorias e defaults de sistema.

## Aceitação de produção

Ambiente isolado composto por PostgreSQL 17, Valkey, `web`, `worker`, job de migration e volume compartilhado. Builds Docker de web/worker, migrations `0000`–`0021`, seeds, health, readiness e diagnóstico de storage foram aprovados.

| Validação                 | Resultado                                     |
| ------------------------- | --------------------------------------------- |
| `npm run lint`            | aprovado                                      |
| `npm run typecheck`       | aprovado em todos os workspaces               |
| `npm test`                | 216/216 aprovados em 44 arquivos              |
| `npm run migration:check` | aprovado                                      |
| `npm run build`           | aprovado, web + worker                        |
| `npm run audit:site`      | aprovado, sem falhas                           |
| `npm run db:audit-schema` | aprovado, 0 divergência                       |
| `npm run test:e2e`        | 105 aprovados, 1 skip condicional, 0 falhas   |

O E2E produtivo cobre login, rotas de todo o menu, cadastros auxiliares, autor, mídia, vaga, notícia, estados de publicação, visualização pública, importação, arquivos inválidos, histórico, desfazer, arquivamento e limpeza.

## Próximo passo operacional

Publicar o SHA final da branch no Coolify seguindo:

- [PRODUCTION_STABILIZATION.md](./PRODUCTION_STABILIZATION.md)
- [COOLIFY_STORAGE.md](./COOLIFY_STORAGE.md)
- [ADMIN_OPERATIONS_AUDIT.md](./ADMIN_OPERATIONS_AUDIT.md)

O deploy deve montar o mesmo volume em `/app/data` no web e worker, executar o job de migration/seeds antes do rollout e validar `/api/ready` depois da publicação.

## Checkpoint final — 14/07/2026

- Migrations: `0000`–`0023`, verificadas em PostgreSQL 17 isolado.
- Schema: 59 tabelas, 695 colunas, 121 índices, 158 constraints, zero divergência.
- Qualidade: lint, typecheck, build, migration check e 216 testes unitários aprovados.
- Auditorias: site, SEO, schemas, performance e admin aprovadas.
- E2E: 105 aprovados, 1 skip condicional e nenhuma falha contra web/worker Docker.
- Lighthouse: performance 99–100 e acessibilidade, SEO e boas práticas em 100 nas oito rotas públicas principais; LCP de 1.207–1.604 ms, CLS 0 e TBT 0 ms no ciclo final local.
- Storage: S3/MinIO e volume compartilhado validados para leitura, escrita e exclusão.
- Proteção: banco de produção e `main` não foram tocados; mudanças do usuário em `Logo/` ficaram fora do escopo e dos commits.

O próximo passo é operacional: publicar o SHA desta branch, aplicar o job de migration antes de web/worker e validar integrações externas no Coolify. Não há validação local capaz de certificar Search Console, Rich Results, Google/Meta, Resend, gateway de pagamento, anúncios ou Core Web Vitals de campo.

## Checkpoint continuidade — 19/07/2026

Trabalho local ainda **não commitado** na branch `codex/reconstrucao-astro`.

- Migrations: `0000`–`0025` (journal validado por `migration:check`).
- Novos módulos: candidatura multicanal na página pública, Rota da Aprovação em 6 etapas, Post Magnético, Web Stories, regras de classificação admin, eventos de clique de candidatura.
- Qualidade local desta sessão: `npm test` 243/243; `npm run typecheck` 0 erros; `npm run build` web+worker aprovado; lint limpo após correções.
- Docs novas: `CONTINUATION_AUDIT.md`, `BLOG_FANTASMA_ADAPTADO.md`, `ROTA_DA_APROVACAO.md`, `MONETIZACAO_B2B.md`, `CANDIDATURA_MULTICANAL.md`, `IMPORTACAO_DE_VAGAS.md`, `DISCOVER_NEWS_WEBSTORIES.md`.
- Pendências externas: Publisher ID AdSense, gateway de pagamento, deploy Coolify / produção.
- Validação isolada (`es-e2e`, 19/07/2026): `db:audit-schema` ok (65 tabelas / 816 colunas), E2E **121/121**, placeholders E2E = 0, AdSense desativado no HTML.

## Checkpoint — continuação julho/2026

Branch: `codex/reconstrucao-astro` (WIP não commitado da sessão Codex).

### Migration 0025

`0025_webstories_editorial_automation.sql`: flags Discover/News/Web Story, campos Post Magnético, `es_classification_rules`, `es_web_stories`, `es_job_application_events`, `es_adsense_readiness_history`, pilar 6 e clusters ampliados.

### Módulos novos ou estendidos

| Área | Artefatos principais |
|------|----------------------|
| Candidatura UX | `ApplicationChannels.astro`, `POST /api/jobs/application-click` |
| Rota da Aprovação | `/admin/adsense-readiness`, `adsense-readiness.ts` (6 etapas) |
| Post Magnético | `post-magnetico.ts`, template `POST_MAGNETICO` no admin |
| Web Stories | Admin `/admin/web-stories/*`, público `/web-stories/[slug]`, sitemap `web-stories` |
| Classificação | `/admin/classificacao`, regras no import processor |
| Bairro | `extractNeighborhood()` sem invenção |
| Institucionais | `institutional-defaults.ts` sem placeholders |
| Worker | `application-monitor.ts` |

### Parcial / pendente operacional

- Comercial B2B já existente; gateway e planos ativos aguardam credenciais e configuração no painel.
- Flags Discover/News: somente governança interna.
- `editorial_score` no schema; persistência automática do score no painel ainda não ligada.
- Import processor duplicado web/worker — regras via banco, código exige paridade manual.
- Publisher ID AdSense real e deploy Coolify com 0025 ainda não executados.

Documentação desta continuação: [CONTINUATION_AUDIT.md](./CONTINUATION_AUDIT.md) e docs temáticos (`BLOG_FANTASMA_ADAPTADO`, `ROTA_DA_APROVACAO`, `MONETIZACAO_B2B`, `CANDIDATURA_MULTICANAL`, `IMPORTACAO_DE_VAGAS`, `DISCOVER_NEWS_WEBSTORIES`).
