# Fase 2 — Banco e migração

Foi criado um schema Drizzle paralelo, prefixado com `es_`, para impedir colisões com as tabelas Prisma. A base inclui localidades, empresas, categorias, usuários, sessões, RBAC, vagas, revisões, fontes, artigos, autores, mídia, redirects, importações, auditoria, tarefas e configurações.

O script `npm run migrate:legacy --workspace=@es/db` é idempotente por chave e bloqueia destinos cujo URL pareça produção, salvo autorização explícita. Ele deve ser ampliado e executado apenas contra uma restauração de staging quando as credenciais estiverem disponíveis. Nenhuma conexão de banco foi feita nesta fase.
