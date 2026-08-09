# Implementação final de preparação para o AdSense

Atualizado em 9 de agosto de 2026. Esta é uma avaliação interna; não representa decisão do Google e não garante aprovação.

## Escopo preservado

- Aplicação ativa: Astro SSR, adaptador Node standalone, React 19, Tailwind CSS 4, PostgreSQL, Drizzle, BullMQ e Valkey/Redis.
- O legado Next.js/Prisma não foi alterado.
- Não houve commit, push, deploy, mudança em Coolify, DNS ou produção.
- Busca, cadastro, alertas, currículo, conteúdo e candidatura continuam gratuitos para candidatos. Cobranças comerciais permanecem restritas a empresas e recrutadores.

## Admin e operação

O menu foi consolidado por atividade em Visão geral, Conteúdo, Publicação, Qualidade, SEO & Google, AdSense, Operação, Negócio e Sistema. A navegação só exibe destinos reais e respeita as permissões existentes.

Rotas principais da entrega:

- `/admin/adsense-readiness`: Central AdSense, indicador interno, totais, bloqueadores, checklist e controle do modo;
- `/admin/qualidade-editorial`: auditoria de 100% do corpus disponível, classificação e clusters de similaridade;
- `/admin/qualidade-vagas`: auditoria de 100% das vagas disponíveis e grupos de duplicidade;
- `/admin/urls`: inventário filtrável e paginado de URL, HTTP, robots, canonical, sitemap, qualidade, problema e ação.

As páginas exigem RBAC. A Central e a alteração do modo exigem `seo.manage`; auditoria editorial exige `content.manage` ou `seo.manage`; auditoria de vagas exige `jobs.read` ou `seo.manage`. A gravação do resultado editorial exige `content.manage`.

## Modo de Revisão AdSense

A configuração usa `es_system_settings.adsense_review_mode`. A API `POST /api/admin/adsense-review-mode` exige autenticação, origem confiável, `seo.manage`, validação do payload e registra `UPDATE_ADSENSE_REVIEW_MODE` em `es_audit_logs`.

Quando ativo:

- uma allowlist conservadora mantém home, hubs editoriais e institucionais fortes indexáveis;
- vagas, busca, filtros, paginação, páginas fracas e rotas desconhecidas recebem `noindex,follow`;
- empresas, cidades e categorias só recebem exceção quando a regra interna as classifica como `FORTE`;
- URLs noindex saem dos sitemaps;
- o worker não envia eventos `URL_UPDATED` de vagas e Web Stories à API de indexação, mas preserva remoções e conteúdo editorial;
- a mesma resposta SSR é entregue a qualquer visitante, sem detecção de user-agent.

Ao desativar, as regras normais voltam automaticamente. Nenhuma URL é apagada.

## Auditoria editorial

`apps/web/src/lib/editorial-audit.ts` consulta todos os artigos, sem `limit` ou amostragem, e avalia:

- extensão, estrutura, título, resumo e metadata;
- autoria, datas, fontes, revisão, pilar e cluster;
- links internos e externos;
- imagem, alt e dimensões;
- parágrafos, frases, headings e frases longas repetidas;
- excesso de palavra-chave e repetição artificial de termos locais;
- utilidade local e elegibilidade para Google News;
- similaridade interna por shingles de cinco termos, índice invertido e Jaccard.

Os resultados possíveis são `MANTER`, `MELHORAR`, `NOINDEX` e `REVISAR MANUALMENTE`. Clusters mostram o melhor candidato interno para revisão, sem excluir conteúdo. A persistência opcional grava um snapshot em `articles.editorialScore.adsenseAudit` e uma trilha de auditoria, sem reescrever o artigo.

## Auditoria de vagas

`apps/web/src/lib/job-audit.ts` lê todas as vagas disponíveis e classifica `OK`, `REVISAR`, `EXPIRADA`, `DUPLICADA`, `INCOMPLETA` ou `SUSPEITA`. As regras cobrem fonte, candidatura, empresa, cidade/UF e código IBGE, descrição, contrato, requisitos, benefícios, status, validade, salário, moeda e compatibilidade com `JobPosting`.

Duplicidade usa hash, URL de origem, URL de candidatura, empresa+cargo+cidade e Jaccard sobre shingles da descrição. O status de link diferencia `ATIVO`, `REDIRECIONADO`, `ERRO` e `INDETERMINADO`; 403, timeout ou ausência de verificação não encerram uma vaga automaticamente.

## SEO e dados estruturados

- Canonicals aceitam apenas a origem do portal, removem querystring, hash e trailing slash e nunca apontam uma página arbitrariamente para a home.
- `JobPosting` omite salário, endereço, CEP, identificador, logo e `directApply` quando o dado real não existe.
- Vagas expiradas ou empresas confidenciais/não identificadas não geram `JobPosting` ativo.
- `Article` e `NewsArticle` usam a organização da Redação, autor exibível, datas existentes, publisher e `mainEntityOfPage`, sem jornalista ou data inventada.
- O grafo `Organization`/`WebSite` permanece único no layout base.
- Google News recebe apenas `NEWS`, publicado, elegível, fora das classes fracas e dentro da janela de dois dias.
- Paginação além do último resultado retorna 404/noindex; busca e combinações de filtro permanecem noindex.
- `robots.txt` bloqueia áreas privadas, permite recursos públicos e não impede crawlers de ler o meta noindex.

## Conteúdo e confiança

A home em modo de revisão prioriza notícias, guias, mercado de trabalho, currículo, entrevistas, primeiro emprego, direitos, profissões, salários, empresas e segurança contra golpes. Vagas permanecem em bloco secundário.

Foram fortalecidas as páginas Sobre, Política de Fontes, Política de Correções e Trabalhe Conosco e criada `/redacao`, com descrição factual de seleção, revisão, fontes, atualização e correção. Páginas institucionais despublicadas retornam 404/noindex. Nenhum nome pessoal, dado jurídico ou procedimento inexistente foi inventado.

## Publicidade e ads.txt

- O ID do AdSense e as linhas de `ads.txt` são normalizados e validados.
- Placeholders, linhas inválidas e duplicadas são rejeitados.
- Configuração inválida não injeta script AdSense quebrado.
- Slots continuam fora da ação de candidatura; candidatura e procura de emprego não dependem de anúncio.
- Decisões de CMP, Publisher ID e conta oficial são ações humanas externas.

## Limite factual desta execução

A URL presente no `.env` foi consultada sem expor a credencial. O banco respondeu, porém o schema público contém 0 das 65 tabelas `es_*` esperadas. O `.env.staging` não resolve DNS e o daemon Docker local não está disponível. Portanto, não foi possível obter números reais do corpus, autenticar o admin nem executar testes E2E dependentes de PostgreSQL/Redis.

Esse estado não é interpretado como “0 artigos, 0 notícias e 0 vagas”. É “corpus indisponível neste ambiente”. A Central só mostra `PRONTO PARA REVISÃO` quando os dados estão acessíveis, o modo foi persistido como ativo e todos os bloqueadores internos foram resolvidos.

## Arquivos centrais

- `apps/web/src/layouts/AdminLayout.astro`
- `apps/web/src/layouts/BaseLayout.astro`
- `apps/web/src/lib/admin-nav.ts`
- `apps/web/src/lib/admin-dashboard.ts`
- `apps/web/src/lib/adsense-review-mode.ts`
- `apps/web/src/lib/adsense-index-inventory.ts`
- `apps/web/src/lib/editorial-audit.ts`
- `apps/web/src/lib/job-audit.ts`
- `apps/web/src/lib/entity-page-quality.ts`
- `apps/web/src/lib/canonical-url.ts`
- `apps/web/src/lib/editorial-schema.ts`
- `apps/web/src/lib/ads-txt.ts`
- `apps/web/src/lib/sitemaps.ts`
- `apps/web/src/pages/admin/adsense-readiness.astro`
- `apps/web/src/pages/admin/qualidade-editorial.astro`
- `apps/web/src/pages/admin/qualidade-vagas.astro`
- `apps/web/src/pages/admin/urls.astro`
- `apps/web/src/pages/redacao.astro`
- `packages/seo/src/index.ts`
- `apps/worker/src/maintenance.ts`

