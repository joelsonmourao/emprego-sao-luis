# Fase 0 — Inventário e proteção

Data da auditoria: 11 de julho de 2026  
Branch protegida de origem: `main`  
Branch de trabalho: `codex/reconstrucao-astro`  
Commit de origem: `5a3db0c` (`Ajustar identidade visual do Emprego São Luís`)

## Escopo e limites

Esta auditoria analisou o repositório local em `C:\Users\Joelson\Documents\ES`. Nenhuma conexão foi aberta com o banco de produção, Coolify, Cloudflare, Google, Meta ou Resend. Nenhum arquivo legado foi apagado e nenhuma migration foi executada.

O repositório contém 396 arquivos rastreados: 176 TypeScript, 122 TSX, 36 SVG, 11 SQL, 10 MJS e outros ativos. A aplicação existente é Next.js 15/React 19, PostgreSQL e Prisma 6. A reconstrução será paralela em Astro; o legado continuará disponível até a troca aprovada.

## Conclusão executiva

O legado não é apenas um protótipo visual: há portal público, CRUD administrativo, importação, publicação agendada, sitemaps, JSON-LD, analytics, anúncios e auditoria. Contudo, vários requisitos do produto final ainda não existem: RBAC completo, autenticação forte, filas Redis/BullMQ, alertas, e-mail, Instagram oficial, notícias com workflow editorial, observatório, testes automatizados e operação separada de worker.

O código legado deve ser tratado como fonte de dados, regras e URLs, não como fundação arquitetural. A nova fundação Astro/Drizzle será criada ao lado dele e receberá funcionalidades por migração controlada.

## Evidências executadas

- `git status --short`: limpo antes da auditoria.
- `npm run typecheck`: aprovado.
- `npx prisma validate`: aprovado; schema válido.
- `npm run build`: aprovado; compilação Next.js, tipos, páginas e traces concluídos.
- `npm run audit:site`: aprovado com três avisos; a verificação HTTP ao vivo não foi executada.
- `npm run lint`: não constitui lint real; apenas imprime que foi ignorado.
- Não há scripts `test`, `test:e2e` ou `migration:check` no pacote legado.

## Documentos

- [inventario.md](./inventario.md): componentes e classificação funcional.
- [rotas-e-dados.md](./rotas-e-dados.md): URLs, modelos e campos a preservar.
- [dependencias-e-variaveis.md](./dependencias-e-variaveis.md): pacotes, integrações e ambiente.
- [planos-de-protecao.md](./planos-de-protecao.md): backup, migração, staging e rollback.

## Decisão de passagem

A Fase 0 está concluída no repositório local. Ela não afirma que o estado de produção foi inventariado: crawl do domínio, contagens do banco, dump e inventário dos buckets dependem de acesso externo e devem ocorrer antes de qualquer troca de produção.
