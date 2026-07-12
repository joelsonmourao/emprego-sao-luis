# Progresso da implementação

## Visão geral

Branch `codex/reconstrucao-astro`. Arquitetura Astro 7, Drizzle, PostgreSQL, Valkey/BullMQ e Docker preservada. A `main` não é alterada automaticamente.

## Fases concluídas

- Fase 1 — segurança e autenticação administrativa.
- Fase 2 — gestão ampliada de vagas.
- Fase 3 — importação XLSX/CSV com mapeamento e processamento BullMQ.
- Fase 4 — programação em blocos e publicação automática.
- Fase 5 — empresas, categorias, cidades, bairros e redirecionamentos seguros.
- Fase 6 — CMS editorial, autoria, revisões, agendamento e notícias públicas.
- Fase 7 — biblioteca de mídia R2/S3 e configuração visual auditável.

## Fase em andamento

- Fase 8 — SEO técnico, social e estúdio de publicação.

## Commits principais

- `ba658be` — segurança, recuperação de senha e sessões.
- `c16b268` — identificação do deployment Astro, healthchecks e 404.
- `c9c684a` — edição, duplicação e histórico de vagas.
- `ee9aba3` — ações em lote de vagas.
- `65619eb` — importação administrável de planilhas.
- `d22dc6d` — programação em blocos.

## Migrations

- `0012_public_hex.sql`, `0013_elite_lorna_dane.sql`, `0014_typical_terror.sql` e `0015_abnormal_victor_mancha.sql` aguardam aplicação pelo job de migration no Coolify.
- Migrations são aditivas, versionadas e nunca executadas automaticamente no start do web.

## Testes atuais

- lint, typecheck, migration check e build aprovados.
- 23 testes unitários aprovados.
- 9 testes E2E aprovados.

## Bloqueios externos

O domínio oficial ainda pode estar vinculado ao deployment legado. Deve ficar exclusivamente no recurso `Dockerfile.web`, seguido de limpeza do cache do proxy/Cloudflare e verificação de `X-ES-App: astro`. Isso não impede o desenvolvimento local.

## Configurações pendentes

Credenciais reais de Meta, Google, Resend, R2/S3, Sentry e AdSense devem permanecer apenas no Coolify. Os módulos usam variáveis e fallbacks sem inventar segredos.

## Próximos itens internos

Fase 8 em execução; depois alertas, publicidade, filas, usuários/admin, portal final, institucionais e auditoria final.
