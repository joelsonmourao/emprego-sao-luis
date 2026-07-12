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

## Fase atual

- Fase 8 — SEO técnico, social e estúdio de publicação. Ainda não iniciada; o repositório foi encerrado em ponto seguro após a Fase 7.

## Commits principais

- `ba658be` — segurança, recuperação de senha e sessões.
- `c16b268` — identificação do deployment Astro, healthchecks e 404.
- `c9c684a` — edição, duplicação e histórico de vagas.
- `ee9aba3` — ações em lote de vagas.
- `65619eb` — importação administrável de planilhas.
- `d22dc6d` — programação em blocos.
- `535dd46` — empresas, categorias, cidades e bairros.
- `80c8084` — CMS editorial completo.
- `ce3f675` — biblioteca de mídia e aparência; último commit funcional antes do encerramento documental.

O commit mais recente é o commit de encerramento que contém este relatório; seu hash deve ser obtido com `git log -1 --oneline` após o checkout da branch.

## Migrations

- `0012_public_hex.sql`, `0013_elite_lorna_dane.sql`, `0014_typical_terror.sql` e `0015_abnormal_victor_mancha.sql` aguardam aplicação pelo job de migration no Coolify.
- Migrations são aditivas, versionadas e nunca executadas automaticamente no start do web.

## Testes atuais

- `npm run lint` aprovado.
- `npm run typecheck` aprovado.
- `npm run test` aprovado: 23 testes unitários.
- `npm run migration:check` aprovado.
- `npm run build` aprovado para web e worker.

## Pendências internas

- Implementar a Fase 8 sem alterar os módulos concluídos das Fases 1 a 7.
- Depois da Fase 8: alertas multicanal, publicidade, operação de filas, usuários/admin, acabamento do portal, páginas institucionais e auditoria final.
- Manter lint, typecheck, testes, migration check e build verdes a cada commit de fase.

## Bloqueios externos

O domínio oficial ainda pode estar vinculado ao deployment legado. Deve ficar exclusivamente no recurso `Dockerfile.web`, seguido de limpeza do cache do proxy/Cloudflare e verificação de `X-ES-App: astro`. Isso não impede o desenvolvimento local.

## Configurações pendentes

Credenciais reais de Meta, Google, Resend, R2/S3, Sentry e AdSense devem permanecer apenas no Coolify. Os módulos usam variáveis e fallbacks sem inventar segredos.

## Pendências externas do Coolify

- Executar, pelo serviço/job de migrations, `0012_public_hex.sql`, `0013_elite_lorna_dane.sql`, `0014_typical_terror.sql` e `0015_abnormal_victor_mancha.sql` antes de usar os novos módulos.
- Configurar `S3_ENDPOINT`, `S3_REGION`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_PUBLIC_URL` e `S3_FORCE_PATH_STYLE` para habilitar uploads.
- Confirmar que o domínio oficial aponta exclusivamente para o serviço criado com `Dockerfile.web`, limpar cache do proxy/Cloudflare e validar o cabeçalho `X-ES-App: astro`.
- Fornecer somente no Coolify as credenciais externas de Meta, Google, Resend, Sentry e AdSense quando suas integrações forem ativadas.

## Primeiro item da próxima execução

Auditar o módulo existente de SEO e social (`apps/web/src/pages/admin/social.astro`, endpoints de sitemap/feed/indexação, `packages/seo`, `packages/social` e workers relacionados) e produzir uma lista objetiva do que já funciona e do que falta antes de alterar o schema ou criar migrations da Fase 8.
