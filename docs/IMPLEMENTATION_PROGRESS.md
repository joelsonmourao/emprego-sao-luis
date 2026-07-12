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

- Fase 1 do roteiro contínuo: separar definitivamente o domínio Astro do deployment legado.

## Bloqueio externo confirmado

Em 12/07/2026, o domínio oficial respondeu com título do portal legado, `/api/health` sem marcador Astro e `/api/ready` como HTML 404. O código Astro possui `/api/ready`; portanto DNS/proxy/Coolify está roteando o domínio, total ou parcialmente, para outro recurso. No Coolify é necessário remover o domínio oficial do recurso antigo e mantê-lo somente no recurso criado com `Dockerfile.web`, depois limpar cache do proxy/CDN. Respostas do deployment novo carregam `X-ES-App: astro`.

## Próximas fases

Administração completa de vagas; importação; programação; cadastros; CMS; mídia; configuração visual; SEO; social; alertas; anúncios; filas; usuários/admin; portal público; institucionais; qualidade final.
