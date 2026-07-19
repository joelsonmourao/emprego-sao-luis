# Deploy seguro no Coolify

Este guia usa a branch `codex/reconstrucao-astro`, migrations Drizzle versionadas e três imagens independentes. Nunca use `drizzle push` em produção.

## 1. PostgreSQL

Crie PostgreSQL 17 com volume persistente, sem porta pública. Gere usuário, senha e banco exclusivos. Guarde a URL interna como `DATABASE_URL`. Antes da primeira migration em banco que possa conter dados, gere backup e teste a leitura do arquivo.

## 2. Redis/Valkey

Crie Valkey ou Redis com persistência, senha e rede interna. Guarde a URL interna como `REDIS_URL`. Não exponha a porta 6379.

## 3. Aplicação web

Crie um recurso conectado ao repositório `joelsonmourao/emprego-sao-luis`, branch `codex/reconstrucao-astro`, contexto raiz e `Dockerfile.web`. Configure porta `4321`, healthcheck `/api/health` e domínio inicialmente de staging. O endpoint `/api/ready` deve retornar `database`, `schema` e `redis` como `ok`.

## 4. Job de migration

Crie outro recurso com o mesmo repositório/branch, contexto raiz e `Dockerfile.migrate`. Configure `DATABASE_URL`, sem domínio, sem porta, sem restart automático e com uma réplica. Execute manualmente antes do web/worker. O comando aplica somente `packages/db/migrations` e imprime todas as migrations com `applied: true`. Código diferente de zero bloqueia o deploy.

Não configure seed nesse job. O primeiro administrador é criado separadamente e uma única vez com `npm run db:seed-rbac --workspace=@es/db`, usando temporariamente `ADMIN_INITIAL_EMAIL`, `ADMIN_INITIAL_NAME` e `ADMIN_INITIAL_PASSWORD`. Remova essas variáveis após o sucesso.

## 5. Worker

Crie um terceiro recurso usando `Dockerfile.worker`, sem domínio e sem porta pública. Compartilhe `DATABASE_URL`, `REDIS_URL`, armazenamento, e-mail, Sentry, Google e Meta apenas quando necessários. Configure restart `unless-stopped`/automático em falha. O processo executado é `node dist/index.js`, registra `worker.started` e encerra filas com segurança em SIGTERM/SIGINT.

## 6. Volume persistente

Monte o **mesmo volume** em web e worker:

```dotenv
UPLOADS_DIR=/app/data
```

Estrutura esperada: `/app/data/{imports,media,brand,reports,temp,receipts}`. Sem volume compartilhado, importações e mídia ficam inconsistentes entre processos. Detalhes: [COOLIFY_STORAGE.md](./COOLIFY_STORAGE.md).

## 7. Variáveis de ambiente

Nunca grave segredos no Git. Configure no Coolify por serviço.

### Obrigatórias (web + worker + migrate)

| Variável | Uso |
|----------|-----|
| `APP_ENV` | `staging` no ambiente de homologação; `production` só em produção |
| `FORCE_NOINDEX` | `true` em staging (noindex global independente das páginas) |
| `STAGING_NOINDEX` | alias opcional de `FORCE_NOINDEX` |
| `SITE_URL` | URL pública **deste** ambiente (staging ≠ produção) |
| `DATABASE_URL` | PostgreSQL interno **deste** ambiente |
| `REDIS_URL` | Valkey/Redis interno **deste** ambiente |
| `AUTH_SECRET` | Sessões e tokens (segredo exclusivo por ambiente) |
| `UPLOADS_DIR` | `/app/data` |
| `COOKIE_SECURE` | `true` em HTTPS |

### Staging vs produção

- Staging: branch `codex/reconstrucao-astro`, banco/Valkey/volume/segredos **separados**, `APP_ENV=staging`, AdSense off, Indexing/IndexNow/Meta off, `robots.txt` com `Disallow: /`.
- Nunca reutilize `AUTH_SECRET` ou `DATABASE_URL` de produção no staging.
- Detalhes e checklist: [STAGING_VALIDATION.md](./STAGING_VALIDATION.md).

### Web (público / build)

| Variável | Uso |
|----------|-----|
| `PUBLIC_ADSENSE_CLIENT_ID` | Cliente AdSense (somente após conta real) |
| `PUBLIC_ADSENSE_PUBLISHER_ID` | Publisher `pub-…` (somente após conta real) |
| `PUBLIC_ADSENSE_ENABLED` | `false` até Rota da Aprovação OK |
| `TURNSTILE_SITE_KEY` | Captcha público (se ativo) |

### Worker e integrações (quando usadas)

| Variável | Uso |
|----------|-----|
| `RESEND_API_KEY`, `EMAIL_FROM` | E-mail transacional |
| `SENTRY_DSN` | Monitoramento |
| `INDEXNOW_KEY` | IndexNow |
| Credenciais Google / Meta | Indexing, social (conforme módulo) |
| `S3_*` | R2/S3 opcional (fallback: volume) |
| `PAYMENT_PROVIDER`, `MERCADOPAGO_*` | Gateway B2B (pendente credenciais) |
| `TURNSTILE_SECRET_KEY` | Captcha servidor |
| `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` | Push (se ativo) |

Seeds **somente** no job migrate, quando intencional: `RUN_SEED_LOCATIONS`, `RUN_SEED_CATEGORIES`, `RUN_SEED_SYSTEM_DEFAULTS`. RBAC inicial: processo separado `db:seed-rbac` (não no start do web).

## 8. Domínio e HTTPS

Valide primeiro em subdomínio de staging com `noindex`. Depois associe o domínio, confira HTTPS/renovação e somente então promova. Confirme que DNS e proxy apontam para o recurso Astro correto, não para a implantação legada.

## 9. Healthcheck

`/api/health` confirma que o processo web está vivo. `/api/ready` confirma conexão com PostgreSQL, presença do schema Drizzle e Redis. Um banco vazio deve produzir `schema: migrations_required` e HTTP 503.

## 10. Primeiro deploy

1. Faça backup do PostgreSQL e do volume `/app/data`.
2. Monte `/app/data` idêntico em web e worker.
3. Execute o job de migration (`Dockerfile.migrate`) uma vez; confira `0024` e `0025` (candidatura multicanal, Web Stories, classificação) com `applied: true`.
4. Consulte `/api/ready` e exija `database`, `schema` e `redis` como `ok`.
5. Implante web e teste `/`, `/vagas`, `/admin/login`, `/contato`, `/sitemap.xml`, `/admin/adsense-readiness`, `/admin/operacao` e upload de mídia.
6. Implante worker e confira `worker.started`, filas de importação e ausência de `relation does not exist`.
7. Crie o primeiro administrador pelo processo separado e remova credenciais temporárias do ambiente.

## 11. Deploy futuro

Faça backup, publique a nova imagem de migration, execute-a uma vez, confira o relatório, publique web e worker e execute smoke tests. Migration nunca faz parte do comando de start e nunca roda em várias réplicas.

## 12. Rollback

Pare o worker novo, restaure as imagens anteriores do web/worker e mantenha as migrations aditivas. Não reverta schema automaticamente. Se uma migration incompatível exigir reversão, preserve o delta, restaure o backup em banco separado e valide antes de trocar conexões.

## 13. Backup

Configure `pg_dump` diário, retenção, cópia externa criptografada e teste mensal de restauração. Ative versionamento/replicação do bucket de mídia. Antes de migration ou troca de domínio, gere backup sob demanda e registre data, tamanho, checksum e responsável.
