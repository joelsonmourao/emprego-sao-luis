# Estabilização de produção do painel administrativo

## Resultado

O painel Astro foi estabilizado na branch `codex/reconstrucao-astro` sem alteração da `main`, sem retorno a Next.js/Prisma e sem acesso ao banco de produção. A aceitação foi executada em build de produção com PostgreSQL 17, Valkey, `web`, `worker`, migrations e volume compartilhado em containers isolados.

## Causas reais e correções

### Importação de vagas

**Causa:** armazenamento fragmentado entre `web` e `worker`, dependência implícita de S3/R2, caminhos locais sem contrato único e respostas genéricas para arquivos inválidos ou falha de fila.

**Correção:** `@es/storage` centraliza o volume/R2, o volume `/app/data` é compartilhado, arquivo e assinatura são validados antes de persistir, XLSX/CSV usam o mesmo schema de aliases e o processamento possui fallback inline quando Redis/fila não está disponível. As APIs retornam 400/413/415/422 para erros de entrada e preservam `requestId`.

### Biblioteca de mídia

**Causa:** upload e metadados seguiam caminhos independentes, o bridge de formulário não normalizava corretamente respostas e a validação não comprovava que o conteúdo era uma imagem decodificável.

**Correção:** PNG/JPEG/WebP/GIF são validados por MIME, assinatura, extensão, tamanho, dimensões e decodificação via Sharp. Arquivo e registro de banco possuem compensação em falha. A interface exibe preview, uso, edição de ALT e remoção segura; exclusão é bloqueada quando a mídia está ativa em artigo, empresa, publicidade ou identidade visual.

### Autores e conteúdo editorial

**Causa:** o mesmo endpoint misturava semântica de redirect/formulário e JSON, enquanto o cliente esperava um envelope de API; erros de validação acabavam reduzidos a uma mensagem genérica.

**Correção:** criação, edição e exclusão de autor usam respostas administrativas padronizadas, slug único, auditoria e proteção por uso. O autor criado é retornado em JSON e selecionado sem recarregar. Notícias passaram por validação compartilhada, revisões, rascunho, agendamento, publicação, arquivamento, imagem e SEO.

### Estados, cidades e categorias

**Causa:** cobertura insuficiente do seed e ausência de flags no entrypoint de migration deixavam o banco estrutural vazio, embora o formulário dependesse desses registros.

**Correção:** seeds idempotentes de 27 estados, cidades iniciais do Maranhão, categorias e configurações do sistema foram adicionados e ligados ao migrate por `RUN_SEED_LOCATIONS`, `RUN_SEED_CATEGORIES` e `RUN_SEED_SYSTEM_DEFAULTS`. Modalidades, contratações e statuses permanecem enums/valores estruturais do schema.

### Vagas, APIs e painel

- Cadastro rápido de cidade, categoria e empresa funciona e seleciona o novo registro.
- Empresa possui nome interno e nome público; vagas confidenciais ocultam nome e logo no portal.
- Slug automático é normalizado, nunca vazio e recebe sufixo apenas em colisão; slug manual colidente é rejeitado.
- Vaga registra conteúdo completo, SEO, revisão, auditoria, agendamento e transições de publicação.
- Respostas de `/api/admin/**` usam `{ ok, data }` ou `{ ok: false, error, code, requestId }`; downloads continuam binários.
- Middleware central aplica autenticação, origem confiável, `requestId`, normalização e log estruturado.
- Consultas lazy do Drizzle são aguardadas antes do fechamento das conexões; um teste estático impede a regressão que causava `CONNECTION_ENDED` sob concorrência.
- Links e formulários do painel não navegam diretamente para `/api/`.
- Logs sanitizam senha, segredo, cookie, token e payload sensível.

## Banco e migration

Nova migration aditiva:

- `0021_admin_stabilization.sql`: adiciona `companies.public_name` e os campos `jobs.additional_info`, `jobs.confidential_company`, `jobs.seo_title`, `jobs.meta_description` e `jobs.canonical_url`.

O comando `npm run db:audit-schema` compara Drizzle com o PostgreSQL real sem alterar dados: tabelas, colunas, tipos, nullable, defaults, índices, uniques, foreign keys, constraints e enums.

Resultado no banco isolado migrado:

| Item                    | Quantidade |
| ----------------------- | ---------: |
| Tabelas esperadas/reais |    59 / 59 |
| Colunas                 |        688 |
| Índices                 |        121 |
| Constraints             |        159 |
| Enums                   |         10 |
| Divergências            |          0 |

## Seeds

O job `Dockerfile.migrate` aceita:

```dotenv
RUN_SEED_RBAC=true
RUN_SEED_COMMERCIAL=true
RUN_SEED_LOCATIONS=true
RUN_SEED_CATEGORIES=true
RUN_SEED_SYSTEM_DEFAULTS=true
```

Na aceitação isolada foram confirmados 27 estados, 8 cidades do Maranhão, 10 categorias, defaults do sistema, 11 papéis, 24 permissões e 4 planos. Os seeds podem ser repetidos sem duplicação e não criam vagas ou empresas fictícias.

## Variáveis para produção

Obrigatórias:

```dotenv
APP_ENV=production
SITE_URL=https://empregossaoluis.com.br
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
AUTH_SECRET=<segredo forte com pelo menos 32 caracteres>
UPLOADS_DIR=/app/data
COOKIE_SECURE=true
```

Temporárias para migration/seed, somente quando necessário:

```dotenv
RUN_SEED_LOCATIONS=true
RUN_SEED_CATEGORIES=true
RUN_SEED_SYSTEM_DEFAULTS=true
```

`ADMIN_INITIAL_EMAIL`, `ADMIN_INITIAL_PASSWORD`, `RUN_SEED_RBAC` e `RUN_SEED_COMMERCIAL` só devem ser ativadas quando a operação correspondente for intencional. Remova senhas e desative flags após o job.

S3/R2, e-mail, indexação, Meta, Sentry, AdSense, Turnstile e Web Push são integrações opcionais. A ausência delas não bloqueia os CRUDs básicos.

## Validação executada

| Gate                         | Resultado                                                   |
| ---------------------------- | ----------------------------------------------------------- |
| `npm run lint`               | aprovado, zero erro                                         |
| `npm run typecheck`          | aprovado em todos os workspaces; Astro 0 erros e 0 warnings |
| `npm test`                   | 209/209 aprovados em 42 arquivos                            |
| `npm run migration:check`    | aprovado                                                    |
| `npm run build`              | aprovado para web e worker                                  |
| `npm run audit:site`         | aprovado; 4 avisos legados não bloqueantes                  |
| `npm run db:audit-schema`    | aprovado; zero divergência                                  |
| Docker web/worker            | build e startup aprovados                                   |
| `/api/health` e `/api/ready` | healthy/ready; banco, schema, Redis e storage `ok`          |
| `npm run test:e2e`           | 100/100 aprovados contra build de produção                  |

O E2E mutável cobre login, cadastros rápidos, autor, mídia e ALT, vaga do rascunho à publicação pública, notícia do rascunho à publicação pública, importação XLSX, arquivos inválidos, histórico, desfazer, arquivar e limpeza. Credenciais são recebidas exclusivamente por `E2E_ADMIN_EMAIL` e `E2E_ADMIN_PASSWORD`.

## Publicação no Coolify

1. Faça backup do PostgreSQL e do volume atual.
2. Publique a branch `codex/reconstrucao-astro` sem merge automático na `main`.
3. Configure `web` com `Dockerfile.web`, `worker` com `Dockerfile.worker` e o job com `Dockerfile.migrate`.
4. Monte o mesmo volume persistente em `/app/data` no `web` e no `worker`, conforme [COOLIFY_STORAGE.md](./COOLIFY_STORAGE.md).
5. Configure as variáveis obrigatórias acima, com `COOKIE_SECURE=true` no domínio HTTPS.
6. Ative as três flags estruturais de seed e execute uma vez o job de migration. Ele aplica migrations até `0021` antes dos seeds.
7. Confirme no log as contagens de locations, categories e system defaults; depois desative as flags.
8. Faça deploy do `web` e do `worker` a partir do mesmo SHA.
9. Valide `https://empregossaoluis.com.br/api/health` e `/api/ready`.
10. Valide login, `/admin/saude`, nova vaga, upload de mídia e uma importação pequena.
11. Confirme persistência após um redeploy e acompanhe logs por `requestId`.

## Rollback

Migrations são aditivas; não execute downgrade destrutivo. Em incidente, pare o worker novo, restaure as imagens anteriores e, se necessário, restaure banco e volume do mesmo backup. Preserve a migration aplicada para uma correção forward-only.

## Atualização final — 14/07/2026

O job de deploy aplica migrations até `0023`. A `0022` corrige integridade de importação e conteúdo de vagas; a `0023` adiciona metadata/variantes editoriais. No banco isolado, o schema final ficou em 59 tabelas, 695 colunas, 121 índices e 158 constraints, sem divergência.

Antes do rollout, execute também `audit:seo`, `audit:schemas`, `audit:performance` e `audit:admin`. O resultado local final foi 216 testes unitários, build web/worker, 105 E2E aprovados com 1 skip condicional e Lighthouse 99–100 em performance, com 100 em acessibilidade, SEO e boas práticas nas oito rotas principais.

No Coolify HTTPS mantenha `COOKIE_SECURE=true`. Para R2/S3 mantenha `S3_SERVER_SIDE_ENCRYPTION=AES256` (padrão) ou `aws:kms`; use `none` somente quando o provider, como MinIO de staging sem KMS, não aceitar SSE. Depois do deploy valide `/api/ready`, upload, importação em duas fases e persistência após redeploy.
