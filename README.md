# Emprego São Luís

Portal regional de vagas de emprego em São Luís, Região Metropolitana e cidades do Maranhão.

**Stack:** Next.js 15 · PostgreSQL · Prisma · Painel administrativo interno

**Domínio:** [empregossaoluis.com.br](https://empregossaoluis.com.br)

## Sequência para site novo (deploy)

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar `.env`

1. Copie `.env.example` para `.env`
2. Ajuste as variáveis:

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | Conexão PostgreSQL — banco `emprego_sao_luis` |
| `DATABASE_URL_DIRECT` | URL direta para migrations (pode ser igual em dev) |
| `AUTH_SECRET` | Chave secreta para sessão do admin |
| `ADMIN_LOGIN_USER` | E-mail do administrador |
| `ADMIN_SECRET_KEY` | Senha do administrador |
| `NEXT_PUBLIC_SITE_URL` | `https://empregossaoluis.com.br` |
| `NEXT_PUBLIC_SITE_NAME` | `Emprego São Luís` |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | Deixe vazio até aprovação AdSense |

### 3. Criar banco `emprego_sao_luis`

No PostgreSQL compartilhado do servidor:

```sql
CREATE DATABASE emprego_sao_luis;
```

### 4. Rodar migrations

```bash
npm run prisma:generate
npx prisma migrate deploy
```

### 5. Rodar seed novo (Maranhão)

Primeira carga ou reset completo do conteúdo:

```bash
SEED_FRESH=1 npm run db:seed
```

Seed incremental (sem apagar legado fora de MA):

```bash
npm run db:seed
```

O seed cria apenas dados coerentes com o portal:

- Cidades do Maranhão (São Luís, Região Metropolitana e interior)
- Categorias reais de emprego
- Empresas exemplo neutras
- Vagas exemplo em MA
- 12 posts completos do blog
- Configurações básicas do site

Com `SEED_FRESH=1`, remove jobs, empresas, cidades e estados fora de MA, além de posts antigos.

### 6. Rodar em desenvolvimento

```bash
npm run dev
```

- Site: `http://localhost:3000`
- Admin: `http://localhost:3000/admin/login`

### 7. Build

```bash
npm run build
npm run start
```

### 8. Publicar no Coolify

1. Crie o banco `emprego_sao_luis` no PostgreSQL compartilhado
2. No Coolify, crie um app apontando para este repositório
3. Use o `Dockerfile` na raiz
4. Configure variáveis de ambiente (`.env.example`)
5. Defina `DATABASE_URL` com host interno do PostgreSQL
6. Defina `NEXT_PUBLIC_SITE_URL=https://empregossaoluis.com.br`
7. Configure domínio e SSL
8. Após deploy, rode seed se necessário: `SEED_FRESH=1 npm run db:seed`

### 9. Auditoria antes do deploy

```bash
npm run audit:site
```

Com servidor local rodando:

```bash
npm run audit:site -- --live
```

A auditoria verifica:

- links e rotas legadas (Jovem Aprendiz, CE/SP, slzcontent)
- páginas institucionais
- robots.txt e sitemap
- seed focado em Maranhão
- ads.txt sem publisher falso

### 10. Checklist antes do AdSense

Consulte `ADSENSE-CHECKLIST.md`. Resumo:

- [ ] Domínio publicado com SSL
- [ ] Páginas institucionais completas (`/privacidade`, `/termos`, `/cookies`, `/quem-somos`, `/contato`)
- [ ] Conteúdo real (sem lorem ipsum, páginas vazias ou “em construção”)
- [ ] `npm run audit:site` sem problemas críticos
- [ ] Sitemap e robots.txt corretos
- [ ] `NEXT_PUBLIC_ADSENSE_CLIENT_ID` **vazio** até aprovação
- [ ] `public/ads.txt` **sem** publisher falso
- [ ] Após aprovação: preencher `NEXT_PUBLIC_ADSENSE_CLIENT_ID` e `ads.txt` com publisher real

## Painel administrativo

| Rota | Função |
|------|--------|
| `/admin/login` | Login |
| `/admin/dashboard` | Dashboard |
| `/admin/vagas` | Gerenciar vagas |
| `/admin/importar` | Importar Excel/CSV |
| `/admin/empresas` | Empresas |
| `/admin/categorias` | Categorias |
| `/admin/blog` | Posts do blog |
| `/admin/contatos` | Mensagens de contato |
| `/admin/anuncios` | Solicitações de anúncio |
| `/admin/configuracoes` | Configurações |

## Importação por planilha

Acesse `/admin/importar` e envie `.xlsx` ou `.csv` com colunas:

`title`, `company`, `city`, `state`, `description`, `applyUrl`, `category`, `salary`, `employmentType`, `publishedAt`, `validThrough`

Colunas obrigatórias: `title`, `company`, `city`, `state`, `description`, `applyUrl`, `category`

**Importante:** use `state=MA` e cidades do Maranhão.

## AdSense

- Componentes: `components/ads/AdSenseScript.tsx`, `components/ads/AdUnit.tsx`
- Anúncios **não aparecem** se `NEXT_PUBLIC_ADSENSE_CLIENT_ID` estiver vazio
- `public/ads.txt` preparado — preencher somente com publisher real após aprovação
- Checklist completo: `ADSENSE-CHECKLIST.md`

## URLs importantes

- `/sitemap.xml`
- `/robots.txt`
- `/ads.txt`

## Scripts úteis

```bash
npm run audit:site      # auditoria pré-deploy
npm run audit:seo       # checagem HTTP de SEO (com servidor rodando)
npm run typecheck       # TypeScript
```
