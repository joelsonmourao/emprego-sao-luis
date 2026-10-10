# Fase 1 — Nova fundação

Workspace criada em paralelo ao legado com `apps/web`, `apps/worker` e pacotes `db`, `shared`, `ui`, `seo`, `social` e `config`. O portal usa Astro 7 SSR com adaptador Node, React 19 disponível apenas para ilhas, Tailwind 4 via Vite e TypeScript strict. O worker possui base BullMQ/Redis e logs JSON com Pino.

Foram adicionados ESLint real, Prettier, Vitest, Playwright, health/readiness e configurações de build. Nenhuma funcionalidade Next.js foi removida.
