# Jovem Aprendiz Vagas

Portal de vagas para Jovem Aprendiz com:

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- Prisma ORM
- PostgreSQL
- admin real
- SEO tecnico forte
- importacao por Excel
- empresas, vagas, blog e hubs locais
- base de publicacao, consentimento, Analytics, Search Console e AdSense

## Rodando localmente

1. Copie `.env.example` para `.env`
2. Ajuste `DATABASE_URL`, `DATABASE_URL_DIRECT` (em Postgres local pode ser igual a `DATABASE_URL`; no Neon use URL **direta** sem `-pooler` no host para migrações), `SITE_URL`, `NEXT_PUBLIC_SITE_URL` e `AUTH_SECRET`
3. Rode:

```bash
pnpm install
pnpm --filter @workspace/jovem-aprendiz-vagas-next run prisma:generate
pnpm --filter @workspace/jovem-aprendiz-vagas-next exec -- prisma db push
pnpm --filter @workspace/jovem-aprendiz-vagas-next run db:seed
pnpm --filter @workspace/jovem-aprendiz-vagas-next run dev
```

## URLs importantes

- site publico: `http://localhost:3000`
- admin: `http://localhost:3000/admin/login`
- sitemap: `http://localhost:3000/sitemap.xml`
- robots: `http://localhost:3000/robots.txt`
- ads.txt: `http://localhost:3000/ads.txt`

## Usuario inicial do admin

Defina `ADMIN_LOGIN_USER` e `ADMIN_SECRET_KEY` no arquivo `.env` antes de rodar o projeto ou publicar em producao.

## O que o admin controla hoje

- vagas
- empresas
- posts do blog
- importacao por Excel
- estados e cidades
- hubs de estado, cidade e empresa
- conteudo da home
- FAQ
- paginas institucionais
- configuracoes gerais do site
- integracoes Google
- checklist de publicacao
- painel de analytics nativo
- biblioteca de midia
- logs

## Integracoes Google

No admin, em `/admin/integracoes`, voce pode configurar:

- Google Analytics 4 Measurement ID
- Google Tag Manager ID
- Search Console verification code
- URL da propriedade do Search Console
- Google AdSense Publisher ID
- Auto Ads
- ads.txt
- URLs de Looker Studio, GA4 e Search Console
- banner de cookies e consentimento

## O que o projeto mede nativamente

Depois do consentimento de Analytics, o portal registra:

- page views
- buscas feitas no portal
- cliques em vaga
- cliques no blog
- cliques em candidatura
- origem aproximada do trafego
- dispositivo
- navegador
- sistema operacional

Esses dados aparecem resumidos em `/admin/analytics`.

## O que o painel de analytics mostra hoje

- top paginas
- top vagas
- top posts
- origens de trafego
- dominios de referencia
- mediums
- dispositivos
- navegadores
- sistemas operacionais
- buscas internas recentes
- eventos principais
- taxa aproximada de clique em candidatura

## O que fica melhor via Google / Looker Studio

Os seguintes indicadores dependem de conta externa e ficam melhores em dashboards conectados:

- impressoes no Google
- cliques organicos
- CTR
- posicao media
- consultas do Search Console
- dados agregados do GA4
- interesses, idade e outros dados agregados disponibilizados pelo Google

## Variaveis de ambiente

Arquivo `.env.example`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/jovem_aprendiz_vagas?schema=jovem_aprendiz_vagas"
SITE_URL="https://slzcontent.com.br"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
SITE_TIME_ZONE="America/Sao_Paulo"
AUTH_SECRET="troque-esta-chave-por-uma-segura"
ADMIN_LOGIN_USER="defina-um-email-admin@seudominio.com"
ADMIN_SECRET_KEY="defina-uma-senha-admin-forte"
SCHEDULED_JOBS_SPREADSHEET_PATH="C:\\caminho\\para\\sua\\planilha.xlsx"
SCHEDULED_JOBS_SHEET_NAME="Sheet1"
SCHEDULED_JOBS_LOG_DIR="C:\\caminho\\para\\logs"
GOOGLE_INDEXING_SERVICE_ACCOUNT_FILE="C:\\caminho\\fora-do-repo\\google-indexing-service-account.json"
GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON=""
CRON_SECRET="defina-um-token-secreto-para-cron"
```

## Publicacao agendada por planilha

O projeto agora suporta publicacao agendada de vagas a partir de uma planilha Excel, usando o horario do Brasil.

Timezone usada:

- `America/Sao_Paulo`

Colunas lidas e atualizadas na planilha:

- `scheduledAt`
- `publishStatus`
- `publishedUrl`
- `publishedAt`
- `googleIndexingStatus`
- `googleIndexedAt`
- `googleIndexingMessage`

Fluxo de status:

- `AGUARDANDO_AGENDAMENTO`
- `AGENDADA`
- `PUBLICANDO`
- `PUBLICADA`
- `INDEXANDO_GOOGLE`
- `OK`
- `ERRO`

### Execucao manual/local

```bash
pnpm run jobs:schedule:process -- --file="C:\\caminho\\para\\planilha.xlsx"
```

Opcoes:

- `--file=...`
- `--sheet=...`
- `--log-dir=...`

O processo:

1. le a planilha
2. encontra linhas vencidas em `scheduledAt`
3. publica ou atualiza a vaga no banco
4. grava a URL final em `publishedUrl`
5. chama a Google Indexing API com a URL do seu dominio
6. salva o status de publicacao e indexacao na propria planilha
7. gera log `.jsonl` separado

### Execucao automatica

Para automacao sem acao manual depois do agendamento, existem dois caminhos:

1. local/servidor proprio:
   - agende `pnpm run jobs:schedule:process` no Agendador de Tarefas do Windows ou cron
2. Vercel:
   - o projeto ja inclui `vercel.json` com cron para `/api/internal/scheduled-jobs`
   - configure `CRON_SECRET`
   - configure `SCHEDULED_JOBS_SPREADSHEET_PATH`

Observacao importante:

- se a sua planilha estiver so no seu computador local, a Vercel nao consegue ler esse arquivo
- nesse caso, a automacao correta e rodar o script no seu PC/servidor ou mover a planilha para um local acessivel ao ambiente de execucao

### Google Indexing API

Nao coloque a chave JSON no codigo.

Use uma destas configuracoes:

- `GOOGLE_INDEXING_SERVICE_ACCOUNT_FILE`
- `GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON`

Para o Google aceitar os envios:

1. a API Indexing precisa estar ativada no projeto Google Cloud
2. a conta de servico precisa ser proprietaria delegada da propriedade no Search Console
3. a URL enviada precisa ser a URL final do seu dominio

Quando isso falhar, o retorno fica salvo em:

- `googleIndexingStatus`
- `googleIndexingMessage`

### Logs e auditoria

Cada execucao grava:

- status de cada linha na propria planilha
- log `.jsonl` separado
- auditoria no banco em `AuditLog`

## Dependencias externas para producao

- banco PostgreSQL
- dominio com HTTPS
- conta Google Analytics 4
- conta Google Search Console
- conta Google AdSense
- opcional: Looker Studio

## Checklist de publicacao

1. Ajustar `SITE_URL` para o dominio final com `https`
2. Manter `SITE_URL` como URL canonica de producao e usar `NEXT_PUBLIC_SITE_URL` apenas para ambiente local ou preview, quando fizer sentido
2. Gerar um `AUTH_SECRET` forte
3. Subir o banco PostgreSQL
4. Rodar `prisma generate` e `prisma db push`
5. Rodar o seed inicial apenas se precisar de base padrao
6. Entrar no admin e revisar:
   - configuracoes gerais
   - integracoes Google
   - politica de cookies
   - paginas institucionais
7. Validar:
   - `/sitemap.xml`
   - `/robots.txt`
   - `/ads.txt`
8. Conectar:
   - GA4
   - Search Console
   - AdSense
9. Conferir se o banner de cookies aparece corretamente
10. Verificar logs, admin, importacao e paginas publicas principais
11. Abrir `/admin/publicacao` e revisar o status final antes do deploy

## Passos de conexao com Google

### Analytics 4

1. Crie uma propriedade GA4
2. Copie o Measurement ID
3. Cole em `/admin/integracoes`
4. Ative a mensuracao do Google
5. Teste com consentimento de Analytics liberado

### Search Console

1. Adicione a propriedade do dominio
2. Copie o codigo de verificacao
3. Cole em `/admin/integracoes`
4. Abra a pagina inicial e confirme a meta tag
5. Envie o sitemap

### AdSense

1. Copie o Publisher ID
2. Cole em `/admin/integracoes`
3. Revise `/ads.txt`
4. Ative AdSense e Auto Ads quando sua conta estiver pronta

## Status tecnico atual

O projeto esta pronto para:

- rodar localmente
- publicar com HTTPS
- medir eventos locais
- integrar GA4, GTM, Search Console e AdSense
- operar com admin real

O que ainda pode evoluir depois:

- RBAC mais profundo
- dashboards Google nativos no painel via APIs externas
- testes E2E
- observabilidade mais completa
- edicao ainda mais granular de blocos e layouts
