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

## 6. Variáveis

Obrigatórias: `APP_ENV=production`, `SITE_URL=https://empregossaoluis.com.br`, `DATABASE_URL`, `REDIS_URL` e `AUTH_SECRET`. Para upload/social: `S3_ENDPOINT`, `S3_REGION`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_PUBLIC_URL`, `S3_FORCE_PATH_STYLE`. Integrações opcionais: `RESEND_API_KEY`, `EMAIL_FROM`, `SENTRY_DSN`, `INDEXNOW_KEY`, credenciais Google e Meta, `PUBLIC_ADSENSE_CLIENT_ID`, `PUBLIC_ADSENSE_ENABLED`, `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`. Nunca grave valores no Git.

## 7. Domínio e HTTPS

Valide primeiro em subdomínio de staging com `noindex`. Depois associe o domínio, confira HTTPS/renovação e somente então promova. Confirme que DNS e proxy apontam para o recurso Astro correto, não para a implantação legada.

## 8. Healthcheck

`/api/health` confirma que o processo web está vivo. `/api/ready` confirma conexão com PostgreSQL, presença do schema Drizzle e Redis. Um banco vazio deve produzir `schema: migrations_required` e HTTP 503.

## 9. Primeiro deploy

1. Faça backup do PostgreSQL.
2. Execute o job de migration uma vez e confira as migrations `0012`–`0016` (inclui publicidade Fase 10).
3. Consulte `/api/ready` e exija todos os checks `ok`.
4. Implante web e teste `/`, `/vagas`, `/admin/login`, `/contato`, `/sitemap.xml`, `/admin/operacao` e uma consulta real.
5. Implante worker e confira `worker.started`, zero reinícios e ausência de `relation does not exist`.
6. Crie o primeiro administrador pelo processo separado e remova a senha do ambiente.

## 10. Deploy futuro

Faça backup, publique a nova imagem de migration, execute-a uma vez, confira o relatório, publique web e worker e execute smoke tests. Migration nunca faz parte do comando de start e nunca roda em várias réplicas.

## 11. Rollback

Pare o worker novo, restaure as imagens anteriores do web/worker e mantenha as migrations aditivas. Não reverta schema automaticamente. Se uma migration incompatível exigir reversão, preserve o delta, restaure o backup em banco separado e valide antes de trocar conexões.

## 12. Backup

Configure `pg_dump` diário, retenção, cópia externa criptografada e teste mensal de restauração. Ative versionamento/replicação do bucket de mídia. Antes de migration ou troca de domínio, gere backup sob demanda e registre data, tamanho, checksum e responsável.
