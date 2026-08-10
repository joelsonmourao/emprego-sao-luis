# Fase 6 — Google e SEO

Implementados `JobPosting` com empresa/local reais e salário somente quando informado, remoção automática do schema para vaga expirada, `NewsArticle`/`Article`, blog SSR, news sitemap limitado a dois dias, sitemap geral, RSS, canonical e 410.

O worker expira vagas a cada 15 minutos, remove JobPosting, cria eventos idempotentes e envia `URL_UPDATED`/`URL_DELETED` pela Google Indexing API oficial. IndexNow possui key file e processamento com retry. A ativação depende das credenciais documentadas no `.env.example`.

Ainda dependem de validação externa: Search Console, resultados enriquecidos, News e Discover. VideoObject e páginas de vídeo ainda não foram implementados.
