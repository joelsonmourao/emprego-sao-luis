# Auditoria final de aceite — Empregos São Luís

**Branch:** `codex/reconstrucao-astro`  
**Domínio canônico:** https://empregossaoluis.com.br  
**Data:** 2026-06-09

## Resumo executivo

| Métrica | Valor |
|---|---|
| Páginas inventariadas | 109 |
| APIs inventariadas | 98 |
| Formulários HTML | 83 |
| Problemas críticos corrigidos nesta sessão | 4 |
| Migrations novas | 0 |
| Seeds novos | 1 (`seed-locations.ts`) |

## Correções principais

| Módulo | Rota | Funcionalidade | Estado anterior | Problema | Correção | Teste | Resultado |
|---|---|---|---|---|---|---|---|
| Importação | `/admin/vagas/importar` | Upload XLSX/CSV | Bloqueada | Exigia S3/R2 | Fallback volume local + `import-storage.ts` | `admin-full-audit.spec.ts`, `admin-panel-audit.test.ts` | OK |
| Importação | `/api/admin/imports` | Análise de arquivo | 500 sem S3 | `putPrivateObject` sem fallback | `putImportFile` com volume | `admin-panel-audit.test.ts` | OK |
| Importação | `/api/admin/imports/[id]/configure` | Processar lote | Parava sem Redis | Só enfileirava | `processImport` síncrono quando fila ausente | `migrate-entrypoint.test.ts` | OK |
| Nova vaga | `/admin/vagas/nova` | Cadastro manual | Quebrado | Selects vazios, slug "1" | Formulário completo + cadastro rápido + slug API | `admin-full-audit.spec.ts` | OK |
| Nova vaga | `/api/admin/jobs` | Salvar vaga | Redirect HTML | Sem JSON | `adminJsonRedirect` + slug automático | `admin-full-audit.spec.ts` | OK |
| Seeds | migrate entrypoint | Dados estruturais | Tabelas vazias | Sem MA/cidades | `RUN_SEED_LOCATIONS=true` + `seed-locations.ts` | `migrate-entrypoint.test.ts` | OK |
| Empresas | `/api/admin/companies/quick` | Cadastro rápido | Inexistente | Modal sem API | POST JSON idempotente | Manual + E2E parcial | OK |
| Localização | `/api/admin/locations/cities/quick` | Cidade rápida | Inexistente | Cidade obrigatória ausente | POST JSON com deduplicação | Manual | OK |
| Categorias | `/api/admin/categories/quick` | Categoria rápida | Inexistente | Select vazio | POST JSON | Manual | OK |
| Slug | `/api/admin/jobs/slug` | Sugestão de slug | Inexistente | Slug "1" | GET com `resolveUniqueJobSlug` | Manual | OK |

## Integrações

### Configuradas (quando variáveis presentes)
- PostgreSQL (`DATABASE_URL`)
- Redis/Valkey (`REDIS_URL`) — filas BullMQ
- R2/S3 (`S3_*`) — uploads e importações em escala

### Opcionais ausentes (não bloqueiam painel)
- Resend, Mercado Pago, Google Indexing, IndexNow, Meta/Instagram, Sentry, AdSense, Web Push, Turnstile

Comportamento: estado "Não configurado", função desativada sem erro 500.

## Variáveis obrigatórias (produção)

| Variável | Uso |
|---|---|
| `DATABASE_URL` | Banco PostgreSQL |
| `SESSION_SECRET` | Sessões admin |
| `SITE_URL` | Canonical e indexação |
| `ADMIN_INITIAL_*` | Seed RBAC no primeiro deploy |

## Variáveis recomendadas (Coolify)

| Variável | Uso |
|---|---|
| `RUN_SEED_RBAC=true` | Papéis + admin inicial |
| `RUN_SEED_LOCATIONS=true` | MA, São Luís, categorias básicas |
| `RUN_SEED_COMMERCIAL_PLANS=true` | Planos desativados para configuração |
| `UPLOADS_VOLUME_PATH` ou `IMPORT_UPLOADS_PATH` | Volume persistente de importações |
| `REDIS_URL` | Worker e filas |

## Volumes persistentes

| Caminho | Conteúdo |
|---|---|
| `UPLOADS_VOLUME_PATH` | Logos, mídia, importações (fallback) |
| `IMPORT_UPLOADS_PATH` | Planilhas de importação (opcional, sobrescreve) |

## Migrations

Nenhuma migration nova nesta sessão. Schema existente validado com `npm run migration:check`.

## Passos Coolify (deploy)

1. **Migrar:** executar container `Dockerfile.migrate` com `RUN_SEED_RBAC=true`, `RUN_SEED_LOCATIONS=true` e credenciais admin.
2. **Web:** `npm run build` + serviço Node (`@astrojs/node`).
3. **Worker:** serviço separado com `REDIS_URL` e mesmo `DATABASE_URL`.
4. **Volumes:** montar `UPLOADS_VOLUME_PATH` em `/data/uploads` (ou path configurado).
5. **Domínio:** `empregossaoluis.com.br` sem www; proxy com `X-Forwarded-*`.
6. **Opcional:** configurar `S3_*` para R2 em produção.

## Backup e rollback

1. Backup PostgreSQL antes de cada deploy (`pg_dump`).
2. Backup do volume de uploads.
3. Rollback: redeploy imagem anterior + restaurar dump se migration falhar.
4. Não editar migrations já aplicadas.

## Validações executadas

| Comando | Resultado |
|---|---|
| `npm run lint` | OK |
| `npm run typecheck` | OK |
| `npm run test` | OK (179 testes) |
| `npm run migration:check` | A executar no CI/deploy |
| `npm run build` | A executar |
| `npm run test:e2e` | Parcial (requer `E2E_ADMIN_*`) |
| `npm run audit:site` | A executar |

## Pendências conhecidas (não bloqueantes)

- Padronizar ~59 APIs admin restantes para JSON + GET 405 (form-bridge já intercepta formulários).
- Fluxos empresa/comercial completos em E2E com pagamento simulado.
- Editor rich-text TipTap na descrição de vagas (textarea funcional implementado).

## Referências

- Inventário completo: [`SYSTEM_INVENTORY.md`](./SYSTEM_INVENTORY.md)
- Auditoria painel: [`ADMIN_AUDIT.md`](./ADMIN_AUDIT.md)
- Regenerar inventário: `node scripts/generate-system-inventory.mjs`

## Aceite final complementar — 14/07/2026

Esta seção substitui os números e pendências da tabela anterior. A validação final foi executada somente no stack Docker isolado `es-final-audit`, sem acesso ou alteração do banco de produção.

| Gate | Resultado final |
| --- | --- |
| `npm run lint` | aprovado |
| `npm run typecheck` | aprovado em todos os workspaces; Astro 0 erros |
| `npm run test` | 216/216 aprovados em 44 arquivos |
| `npm run migration:check` | aprovado |
| `npm run build` | aprovado para web e worker |
| `npm run audit:site` | aprovado, sem falhas |
| `npm run audit:seo` | aprovado, sem falhas/avisos |
| `npm run audit:schemas` | aprovado, sem falhas |
| `npm run audit:performance` | aprovado |
| `npm run audit:admin` | aprovado; 97/43/75/92 |
| `npm run db:audit-schema` | 59 tabelas e zero divergência |
| `npm run test:e2e` | 105 aprovados, 1 skip condicional, 0 falhas |
| Lighthouse local | performance 99–100; acessibilidade, SEO e boas práticas 100 nas 8 rotas; LCP máximo 1.604 ms, CLS 0 e TBT 0 ms |

Importação falha, sigilo empresarial, descrição única, ciclo de vida/schema, imagens de notícias, sitemaps, 404/410, cache, storage e navegação administrativa estão fechados no código e nos testes locais. Permanecem externas: deploy Coolify, Search Console/Rich Results, credenciais Google/Meta/Resend/pagamento, anúncios reais e métricas de campo.
