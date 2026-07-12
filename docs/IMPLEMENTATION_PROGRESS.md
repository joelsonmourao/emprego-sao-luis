# Progresso da implementação

Branch: `codex/reconstrucao-astro`. A branch `main` não é alterada automaticamente.

## Concluído e validado

- Fundação Astro 7/Drizzle/PostgreSQL/Valkey/BullMQ e Docker/Coolify.
- Migrations `0000` a `0011`, com job independente e relatório nominal.
- Worker ESM com `node dist/index.js`, shutdown seguro e logs sanitizados.
- Autenticação administrativa, RBAC, 2FA, recuperação de senha e sessões revogáveis.
- Home dinâmica, `/vagas` com filtros, página de vaga, SEO base e rotas de descoberta.
- Cadastro manual, importação assíncrona base, Social Studio base, alertas e monetização base.

## Em execução

- Fase 3: fluxo de importação em duas etapas implementado com escolha de aba, sugestão e edição de mapeamento, modelos persistidos, prévia, estratégia de duplicidade e processamento BullMQ. Migration `0012_public_hex.sql` pendente de aplicação no Coolify.
- Fase 4: programação em blocos implementada com janela, intervalos, prevenção de conflitos, prévia persistida, pausa, retomada, cancelamento e publicação automática pelo worker. Migration `0013_elite_lorna_dane.sql` pendente de aplicação no Coolify.

## Commits recentes

- `c16b268`: identificação inequívoca do deployment Astro e 404 própria.
- `c9c684a`: edição, duplicação e histórico de vagas.
- `ee9aba3`: ações em lote de vagas.
- `65619eb`: mapeamento e processamento administrável de planilhas.

## Bloqueio externo confirmado

Em 12/07/2026, o domínio oficial respondeu com título do portal legado, `/api/health` sem marcador Astro e `/api/ready` como HTML 404. O código Astro possui `/api/ready`; portanto DNS/proxy/Coolify está roteando o domínio, total ou parcialmente, para outro recurso. No Coolify é necessário remover o domínio oficial do recurso antigo e mantê-lo somente no recurso criado com `Dockerfile.web`, depois limpar cache do proxy/CDN. Respostas do deployment novo carregam `X-ES-App: astro`.

## Próximas fases

Administração completa de vagas; importação; programação; cadastros; CMS; mídia; configuração visual; SEO; social; alertas; anúncios; filas; usuários/admin; portal público; institucionais; qualidade final.
