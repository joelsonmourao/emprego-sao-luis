# Inventário técnico e funcional

## Arquitetura encontrada

| Área | Implementação atual | Classificação | Evidência/limite |
|---|---|---|---|
| Portal | Next.js App Router, SSR/React Server Components | Funcional localmente | Home, vagas, busca, categorias, cidades, empresas e blog |
| Banco | PostgreSQL via Prisma | Funcional, a preservar | 20 modelos e 10 migrations versionadas |
| Painel | `/admin`, cookie JWT próprio e dois papéis | Parcial | CRUD amplo, sem RBAC granular, 2FA/passkey ou gestão completa de usuários |
| Importação | XLSX/CSV e fila persistida em PostgreSQL | Parcial/funcional | Endpoint tem cerca de mil linhas; não usa BullMQ e exige testes de idempotência/carga |
| SEO | metadata, canonical, JobPosting, sitemaps e redirects | Parcial/funcional | Auditoria estática aprovada; falta validação live, News sitemap e cobertura final |
| Publicação | imediata e agendada | Parcial/funcional | Cron HTTP e scripts; não há worker resiliente com Redis |
| Google | Indexing API e Places | Parcial | Código existe; funcionamento depende de credenciais e validação externa |
| Ads | slots e feature/configuração | Parcial | AdSense depende de aprovação/publisher; sem suíte de testes de compliance |
| Analytics | coleta interna e links rastreados | Parcial | Não substitui GA4/Search Console; ativação depende de configuração |
| Mídia | upload/local e catálogo | Parcial | Não há R2/S3 desacoplado comprovado |
| Docker | multi-stage, usuário sem root | Parcial | imagem final copia `node_modules` inteiro; migration junto do start |
| Coolify | Docker preparado | Incompleto | não há manifesto verificável de serviços web/worker/Redis nem staging |
| Testes | typecheck e scripts de auditoria | Incompleto | sem Vitest, Playwright e Lighthouse CI; lint é simulado |
| Social | links e configurações visuais | Incompleto | sem `/instagram`, estúdio, Meta API, métricas e retry |
| Alertas | não encontrado | Ausente | sem Resend, WhatsApp, Web Push ou preferências |
| Filas | tabela `ImportQueue` | Legado parcial | não há Valkey/Redis ou BullMQ |

## Funcionalidades realmente implementadas

- Portal público com conteúdo server-rendered.
- Listagem e detalhe de vagas, incluindo estado indisponível/410.
- Busca e hubs por cidade, categoria e empresa.
- Blog com listagem e artigos.
- Páginas institucionais, contato e envio de vaga por empresa.
- Login administrativo e proteção server-side das rotas administrativas.
- CRUD de vagas, empresas, taxonomias, posts, mídia, hubs e configurações.
- Agendamento, publicação, expiração e submissão à Indexing API.
- Importação XLSX/CSV e exportação.
- Sitemaps segmentados, robots, ads.txt, canonical, redirects e JSON-LD.
- Logs de auditoria, indexação e analytics interno.
- Docker multi-stage e migrations Prisma.

“Implementada” não significa validada em produção. Apenas typecheck e auditoria estática foram comprovados nesta fase.

## Incompleto

- RBAC possui somente `ADMIN` e `EDITOR` e não representa os papéis do prompt.
- Autenticação não tem verificação de e-mail, 2FA/passkey, rate limit persistente ou gestão de sessões.
- Importação não foi testada nesta fase com 10/1.000 linhas e reimportações.
- Publicação agendada usa cron/HTTP e banco, sem fila durável BullMQ.
- Google Indexing e Places dependem de credenciais não verificadas.
- Mídia ainda não usa abstração R2/S3.
- AdSense e analytics dependem de configuração externa.
- Docker não possui serviço worker separado nem readiness que valide dependências.
- `.env.example` omite variáveis referenciadas pelo código.
- Não há suíte automatizada unitária, integração ou E2E.

## Simulado ou não comprovado

- `npm run lint` é explicitamente um placeholder e não executa ESLint.
- Páginas de painel podem mostrar métricas derivadas do banco, mas não comprovam integrações externas.
- Integrações configuráveis no formulário não garantem conexão com os provedores.
- AdSense apresenta placeholders para administradores por design; publicação real não foi validada.
- Auditoria live e Lighthouse dependem de servidor em execução e não foram concluídos na Fase 0.

## Legado

- Next.js, Prisma e `vercel.json` serão substituídos após equivalência no Astro.
- Dois endpoints cron de publicação têm sobreposição conceitual.
- Scripts de migração Neon e build com retry são específicos da operação anterior.
- Logs `next-*.log`, capturas em `tmp-audit/` e uma planilha estão versionados; devem ser preservados agora e revisados antes da limpeza futura.
- Redirects de várias URLs antigas apontam genericamente para `/vagas`; precisam de inventário de tráfego antes da troca.

## Sem uso confirmado por busca estática

- `@radix-ui/react-accordion`
- `@radix-ui/react-select`
- `@radix-ui/react-toast`
- `exceljs`
- `next-themes`
- `autoprefixer`

Esses pacotes não serão apagados na Fase 0. A remoção será feita no contexto da nova workspace, seguida de instalação limpa, lint, typecheck, testes e build.
