# Dependências, integrações e variáveis

## Dependências utilizadas no legado

- Runtime/framework: `next`, `react`, `react-dom`.
- Banco: `@prisma/client`; CLI `prisma` no desenvolvimento/operação.
- Formulários/validação: `react-hook-form`, `@hookform/resolvers`, `zod`.
- Editor: pacotes `@tiptap/*`.
- Autenticação: `bcryptjs`, `jose`.
- Interface: `lucide-react`, `@radix-ui/react-slot`, `class-variance-authority`, `clsx`, `tailwind-merge`.
- Datas: `dayjs`.
- Planilhas: `xlsx`.
- Google: `googleapis`.
- Tooling: TypeScript, Tailwind, PostCSS, TSX, dotenv e tipos.

`react-dom` e os pacotes `@types/*` são dependências necessárias mesmo sem importação textual direta.

## Sem referência estática

`@radix-ui/react-accordion`, `@radix-ui/react-select`, `@radix-ui/react-toast`, `exceljs`, `next-themes` e `autoprefixer`.

## Variáveis documentadas atualmente

`DATABASE_URL`, `DATABASE_URL_DIRECT`, `SITE_URL`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SITE_NAME`, `AUTH_SECRET`, `ADMIN_LOGIN_USER`, `ADMIN_SECRET_KEY`, `NEXT_PUBLIC_ADSENSE_CLIENT_ID`, `APP_TIME_ZONE`, `CRON_SECRET` e `RESET_SITE_CONTENT`.

## Variáveis usadas, mas ausentes ou incompletas no exemplo

- Google: `GOOGLE_INDEXING_ENABLED`, `GOOGLE_INDEXING_PROJECT_ID`, `GOOGLE_INDEXING_CLIENT_EMAIL`, `GOOGLE_INDEXING_PRIVATE_KEY`, `GOOGLE_INDEXING_SERVICE_ACCOUNT_FILE`, `GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON`, `GOOGLE_PLACES_API_KEY`.
- Importação opcional: `ANTHROPIC_API_KEY`.
- Analytics: `INTERNAL_ANALYTICS_DB_ENABLED`.
- Agendamento: `SCHEDULED_JOBS_LOG_DIR`, `SCHEDULED_JOBS_SHEET_NAME`, `SCHEDULED_JOBS_SPREADSHEET_PATH`.
- Enriquecimento: `LOCATION_ENRICHMENT_PROVIDER`, `LOCATION_BACKFILL_*`.
- Migration: `PRISMA_MIGRATE_*` e `PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK`.
- Auditoria: `FRONTEND_AUDIT_BASE_URL`, `FRONTEND_AUDIT_PORT`.

## Integrações externas

| Integração | Código local | Estado comprovado |
|---|---|---|
| PostgreSQL | Sim | Schema local válido; produção não acessada |
| Google Indexing | Sim | Não testada sem credenciais |
| Google Places | Sim | Não testada sem chave |
| AdSense | Sim | Não validado com publisher real |
| Vercel cron | Sim | Legado para retirada após Coolify |
| Coolify | Docker genérico | Serviço real não acessado |
| Meta/Instagram | Não completo | A construir com API oficial |
| Resend | Não | A construir por interface desacoplada |
| R2/S3 | Não | A construir por interface desacoplada |
| Redis/BullMQ | Não | A construir no worker |
| Sentry | Não | A configurar sem DSN obrigatório localmente |
| Cloudflare Turnstile/IndexNow | Não completo | A construir |

Segredos nunca serão registrados em Git. `.env` e `.env.local` já aparecem como ignorados.
