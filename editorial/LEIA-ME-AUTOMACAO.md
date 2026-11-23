# Produção editorial automática — Empregos São Luís

Período: 13 de outubro a 31 de dezembro de 2026, três guias por dia.

## Fluxo

1. A tarefa diária do ChatGPT cria os três arquivos Markdown reais nas pastas `editorial/AAAA-MM-DD/`, conforme `calendario-3-artigos-diarios-2026.json`. Uma pauta não é um artigo publicado.
2. Em cada push para `codex/admin-negocio-completo`, o GitHub Actions `editorial-auto.yml` executa `scripts/build-auto-editorial.mjs`, rejeita textos incompletos, repetitivos ou sem fontes citadas, gera as capas originais WebP de 1200×675 e executa typecheck, testes e compilação.
3. Após sucesso, o bot registra o manifesto e as imagens na própria branch de produção, sem escrever no banco de vagas.
4. O VPS Coolify atualiza apenas a aplicação Empregos São Luís às 08h35, caso ainda não haja três guias preparados para a data.
5. O Astro SSR libera cada URL somente às 09h, 13h e 17h de Brasília; a verificação automática das 09h12, 13h12 e 17h12 confere status HTTP, URL canônica e capa.
6. Uma publicação sem revisão factual humana recebe indicação de verificação automatizada. Para temas noticiosos/fatos recentes o script recusa o tipo `NEWS`.

## Controle

- `apps/web/src/data/auto-editorial-manifest.json`: somente artigos com QA aprovado.
- `editorial/automation-report.json`: quantidade de artigos liberados e bloqueados por falta de texto/qualidade.
- `/api/editorial/automation-status`: `preparedToday`, `publishedToday`, `publishedSlugs` e `preparedTomorrow`.
- Artigo com falha no QA **não** é publicado; não há preenchimento automático de texto genérico.
- Sem API paga, sem alteração de DNS, Instagram, Direct, banco, ou webhook.
- O sistema de automação não garante aceitação pelo Google AdSense. A reprovação por baixo valor exige utilidade real, originalidade, fontes corretas e manutenção editorial.
