# Empregos São Luís

Portal regional de vagas de emprego em São Luís, Região Metropolitana e cidades do Maranhão.

**Stack ativa:** Astro 7 · Node 22 · PostgreSQL · Drizzle ORM · Valkey/BullMQ · Docker

**Domínio:** [empregossaoluis.com.br](https://empregossaoluis.com.br)

O código Next.js/Prisma existente na raiz é legado e não é a aplicação de produção. O portal ativo está em `apps/web`, o worker em `apps/worker` e o schema/migrations Drizzle em `packages/db`.

## Desenvolvimento

```bash
npm ci --legacy-peer-deps
copy .env.example .env.local
npm run dev
```

- Portal: `http://127.0.0.1:4321`
- Admin: `http://127.0.0.1:4321/admin/login`
- Health: `http://127.0.0.1:4321/api/health`
- Readiness: `http://127.0.0.1:4321/api/ready`

Configure no mínimo `DATABASE_URL`, `REDIS_URL`, `AUTH_SECRET`, `SITE_URL` e `UPLOADS_DIR`. Não aponte desenvolvimento ou testes mutáveis para o banco de produção.

## Arquitetura

| Caminho                                                          | Responsabilidade                                       |
| ---------------------------------------------------------------- | ------------------------------------------------------ |
| `apps/web`                                                       | portal público, painel e APIs Astro                    |
| `apps/worker`                                                    | filas, importações, agendamentos e tarefas assíncronas |
| `packages/db`                                                    | schema, migrations, auditoria e seeds Drizzle          |
| `packages/storage`                                               | volume local ou S3/R2 para todos os uploads            |
| `packages/shared`                                                | schemas e regras compartilhadas                        |
| `packages/seo`, `packages/social`, `packages/ads`, `packages/ui` | domínios auxiliares                                    |

## Banco, migrations e seeds

Verificar o histórico Drizzle:

```bash
npm run migration:check
```

Comparar o schema declarado com um PostgreSQL real, sem mutações:

```bash
npm run db:audit-schema
```

O deploy aplica migrations pelo job construído com `Dockerfile.migrate`. Seeds são explícitos e idempotentes:

```dotenv
RUN_SEED_LOCATIONS=true
RUN_SEED_CATEGORIES=true
RUN_SEED_SYSTEM_DEFAULTS=true
```

Desative as flags depois da execução intencional. Elas não criam vagas ou empresas falsas.

## Armazenamento

`web` e `worker` devem compartilhar um volume persistente em `/app/data`:

```dotenv
UPLOADS_DIR=/app/data
```

S3/R2 é opcional; se não estiver completamente configurado, o sistema usa o volume. Consulte [docs/COOLIFY_STORAGE.md](docs/COOLIFY_STORAGE.md).

## Qualidade

```bash
npm run lint
npm run typecheck
npm test
npm run migration:check
npm run build
npm run test:e2e
npm run audit:site
npm run audit:seo
npm run audit:schemas
npm run audit:performance
npm run audit:admin
```

O E2E mutável exige ambiente isolado e recebe credenciais somente por ambiente:

```dotenv
E2E_ALLOW_MUTATIONS=true
E2E_EXPECT_READY=true
E2E_ADMIN_EMAIL=
E2E_ADMIN_PASSWORD=
```

## Deploy no Coolify

1. Faça backup do PostgreSQL e do volume.
2. Use `Dockerfile.web`, `Dockerfile.worker` e `Dockerfile.migrate` como serviços separados.
3. Monte o mesmo volume em `/app/data` no web e no worker.
4. Configure `APP_ENV=production`, `SITE_URL`, `DATABASE_URL`, `REDIS_URL`, `AUTH_SECRET`, `UPLOADS_DIR=/app/data` e `COOKIE_SECURE=true`.
5. Execute o job de migration com os seeds estruturais desejados.
6. Faça deploy de web e worker a partir do mesmo SHA.
7. Valide `/api/health`, `/api/ready`, `/admin/saude`, login, mídia e importação.

Procedimento completo: [docs/PRODUCTION_STABILIZATION.md](docs/PRODUCTION_STABILIZATION.md).

## Documentação principal

- [Estabilização de produção](docs/PRODUCTION_STABILIZATION.md)
- [Auditoria das operações administrativas](docs/ADMIN_OPERATIONS_AUDIT.md)
- [Volume persistente no Coolify](docs/COOLIFY_STORAGE.md)
- [Inventário do sistema](docs/SYSTEM_INVENTORY.md)
- [Identidade visual](docs/BRAND_IDENTITY.md)
- [Operação comercial](docs/COMMERCIAL.md)
- [Modelo de conteúdo de vagas](docs/JOB_CONTENT_MODEL.md)
- [Arquitetura de SEO](docs/SEO_ARCHITECTURE.md)
- [Dados estruturados](docs/STRUCTURED_DATA.md)
- [Padrão de imagens de notícias](docs/NEWS_IMAGE_STANDARD.md)
- [Orçamento de performance](docs/PERFORMANCE_BUDGET.md)
