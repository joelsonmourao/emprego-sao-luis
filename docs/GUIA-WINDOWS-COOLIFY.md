# Guia completo — Windows ao Coolify

Pasta local inicial:

`C:\Users\Joelson\Documents\ES`

## A. Preparar o computador

Instale Git, Node.js 22 LTS, Docker Desktop e uma conta GitHub. Abra o Docker Desktop antes do teste de imagens.

## B. Entrar na pasta C:\Users\Joelson\Documents\ES

Prompt de Comando:

```cmd
cd /d "C:\Users\Joelson\Documents\ES"
```

PowerShell:

```powershell
Set-Location "C:\Users\Joelson\Documents\ES"
```

## C. Conferir o projeto

```powershell
dir
git status
git branch
```

Somente se `git status` disser que não é um repositório:

```powershell
git init
```

A branch da reconstrução é `codex/reconstrucao-astro`. Confirme que `.env`, `.env.local` e `.env.staging` aparecem no `.gitignore` e nunca use `git add -f` nesses arquivos.

## D. Instalar dependências

```powershell
npm ci --legacy-peer-deps
```

## E. Executar testes

```powershell
npm run lint
npm run typecheck
npm run test
npm run migration:check
npm run build
npx playwright install chromium
npm run test:e2e
npm run lighthouse
```

Não continue se algum comando terminar com erro.

## F. Testar localmente

Crie `.env` a partir de `.env.example`, usando apenas serviços locais/staging. Em um terminal:

```powershell
npm run dev
```

Em outro:

```powershell
npm run dev:worker
```

Portal: `http://localhost:4321`. Health: `http://localhost:4321/api/health`. Readiness: `http://localhost:4321/api/ready`.

## G. Testar com Docker

Copie `.env.staging.example` para `.env.staging`, troque as senhas locais e crie o bucket `empregos-staging` no MinIO. Depois:

```powershell
docker compose -f compose.staging.yml build
docker compose -f compose.staging.yml up -d
docker compose -f compose.staging.yml ps
docker compose -f compose.staging.yml logs web
docker compose -f compose.staging.yml logs worker
```

Finalize com `docker compose -f compose.staging.yml down`. Não acrescente `-v` se quiser preservar os volumes.

## H. Preparar Git

```powershell
git status
git diff --check
git add .
git status
git commit -m "Preparar plataforma Astro para staging"
```

Revise a lista antes do commit e confirme que não contém `.env`, dumps ou credenciais.

## I. Criar e enviar para o GitHub

O remoto atual é `origin` e aponta para `https://github.com/joelsonmourao/emprego-sao-luis.git`.

```powershell
git remote -v
git push -u origin codex/reconstrucao-astro
```

Abra um pull request para revisão. Não mescle em `main` antes do staging.

## J. Entrar no Coolify

Acesse seu painel Coolify e crie um projeto chamado `Empregos Sao Luis - Staging`. Use ambiente separado de produção.

## K. Criar PostgreSQL

Crie PostgreSQL 17 com volume persistente. Anote a URL interna e configure-a como `DATABASE_URL` nos serviços web, worker e job de migration. Não exponha a porta publicamente.

## L. Criar Valkey/Redis

Crie Valkey 8 com persistência e senha. Configure a URL interna como `REDIS_URL` no web e worker.

## M. Configurar R2/S3

No Cloudflare R2, crie bucket de staging e credenciais limitadas ao bucket. Preencha `S3_ENDPOINT`, `S3_REGION=auto`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_PUBLIC_URL` e `S3_FORCE_PATH_STYLE=false`.

## N. Criar serviço web

Conecte o repositório/branch `codex/reconstrucao-astro`. Dockerfile: `Dockerfile.web`. Contexto: raiz. Porta: `4321`. Health check: `/api/health`. Readiness operacional: `/api/ready`.

## O. Criar serviço worker

Use o mesmo repositório/branch. Dockerfile: `Dockerfile.worker`. Contexto: raiz. Não configure domínio nem porta pública. Mantenha uma réplica inicialmente.

## P. Preencher variáveis

Copie os nomes de `.env.example`. Obrigatórias: `APP_ENV=staging`, `SITE_URL`, `DATABASE_URL`, `REDIS_URL`, `AUTH_SECRET`, credenciais S3/R2. Gere `AUTH_SECRET` com:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

Opcionais até obter credenciais: Resend, Sentry, Google, Meta e AdSense. Não copie valores de staging para produção.

## P.1 Criar job de migration

Crie um terceiro recurso no Coolify usando o mesmo repositório e branch, com `Dockerfile.migrate` e contexto na raiz. Configure somente `DATABASE_URL`. Esse recurso é um job manual: não associe domínio, não habilite reinício automático e não o escale para mais de uma réplica.

## Q. Configurar domínio

Use primeiro um subdomínio de staging. Proteja-o por autenticação no proxy e mantenha `noindex`. Só depois dos testes associe `empregossaoluis.com.br` ao web de produção. HTTPS deve ser emitido e renovado pelo Coolify/Let's Encrypt.

## R. Executar migrations

Faça backup e teste a restauração. Execute uma única vez pelo recurso criado com `Dockerfile.migrate`, nunca simultaneamente em todas as réplicas. O comando padrão dessa imagem executa:

```powershell
npm run db:migrate --workspace=@es/db
```

Depois que a migration terminar com código zero, altere temporariamente o comando do mesmo job para `npm run db:seed-rbac --workspace=@es/db`. Para criar o primeiro admin, defina temporariamente `ADMIN_INITIAL_EMAIL`, `ADMIN_INITIAL_NAME` e `ADMIN_INITIAL_PASSWORD`, execute o seed uma vez e remova imediatamente a senha e as três variáveis do Coolify.

## S. Fazer deploy

Implante primeiro web e depois worker. Mantenha migrations fora do comando de start. Não altere produção enquanto os gates não estiverem aprovados.

## T. Conferir logs

No Coolify, abra logs de web, worker, PostgreSQL e Valkey. Procure erros de conexão, migration, fila, S3, e-mail e Sentry.

## U. Testar o sistema

Confira home, `/vagas`, vaga válida, vaga 410, `/blog`, `/instagram`, `/alertas`, `/admin/login`, cadastro manual, importação, `/api/health`, `/api/ready`, `/robots.txt`, `/sitemap.xml`, `/sitemap-news.xml`, `/feed.xml` e `/ads.txt`.

## V. Configurar Search Console

Adicione `https://empregossaoluis.com.br`, valide DNS, envie `sitemap.xml` e `sitemap-news.xml` e monitore JobPosting. Credenciais da Indexing API ficam somente no Coolify.

## W. Configurar Meta

Use uma conta profissional conectada a Página, crie app Meta e obtenha token oficial com permissões aprovadas. Configure `META_INSTAGRAM_ACCOUNT_ID` e `META_PAGE_ACCESS_TOKEN`. Teste em staging antes de agendar.

## X. Configurar Resend

Verifique o domínio, crie chave restrita e preencha `RESEND_API_KEY` e `EMAIL_FROM`. Teste confirmação e descadastro.

## Y. Configurar backups

Siga `docs/operacao/BACKUP-E-RESTAURACAO.md`. Configure backup diário do PostgreSQL, cópia externa criptografada, versionamento do bucket e teste mensal de restauração.

## Z. Atualização futura

Comece novamente pela pasta:

```cmd
cd /d "C:\Users\Joelson\Documents\ES"
```

ou:

```powershell
Set-Location "C:\Users\Joelson\Documents\ES"
```

Depois:

```powershell
git switch main
git pull --ff-only
git switch -c codex/atualizacao-descritiva
npm ci --legacy-peer-deps
npm run lint
npm run typecheck
npm run test
npm run migration:check
npm run build
git add .
git commit -m "Descrever a atualização"
git push -u origin codex/atualizacao-descritiva
```

Abra PR, acompanhe CI, implante staging, confira logs e só então promova. Nunca edite arquivos dentro do container.

## AA. Rollback

No Coolify, pare o worker novo, selecione a imagem anterior do web e redirecione o proxy. Se migrations foram somente aditivas, o app anterior deve continuar compatível. Se houve escrita nova, preserve e reconcilie o delta antes de restaurar. Siga `docs/operacao/ROLLBACK.md` e valide rotas críticas.
