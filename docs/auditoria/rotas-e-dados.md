# Rotas e dados a preservar

## Rotas públicas canônicas

| Família | URL atual | Preservação |
|---|---|---|
| Home | `/` | Obrigatória |
| Vagas | `/vagas` | Obrigatória |
| Detalhe | `/vagas/:slug` | Obrigatória por slug; manter 410 quando removida |
| Indisponível | `/vagas/indisponivel/:slug` | Preservar sem indexação |
| Cidade | `/vagas/cidade/:slug` | Obrigatória |
| Categoria | `/vagas/categoria/:slug` e `/categorias/:slug` | Preservar ou redirecionar individualmente |
| Empresas | `/empresas` e `/empresas/:slug` | Obrigatória |
| Busca | `/busca` | Preservar parâmetros úteis |
| Blog | `/blog` e `/blog/:slug` | Obrigatória, preservando datas |
| Institucional | `/quem-somos`, `/sobre`, `/contato`, `/privacidade`, `/termos`, `/cookies` | Obrigatória |
| Comercial | `/anunciar-vaga` | Obrigatória |
| Descoberta | `/robots.txt`, `/sitemap.xml`, `/sitemap-fresh.xml`, `/sitemaps/index.xml`, `/sitemaps/:slug`, `/ads.txt` | Obrigatória |

## Redirects existentes a manter até auditoria live

- `/cidade/:slug` → `/vagas/cidade/:slug`
- `/vaga/:slug/:id` → `/vagas`
- `/menor-aprendiz` → `/vagas`
- `/vagas/jovem-aprendiz/:path*` → `/vagas`
- `/vagas/jovem-aprendiz-comercial-sao-luis-ma` → `/vagas/jovem-aprendiz-comercial`
- `/cidades`, `/estados`, `/estados/:path*`, `/vagas/estado/:path*`, `/ceara-ce` → `/vagas`
- `/empresa/:slug` e `/empresa/:slug/jovem-aprendiz` → `/empresas/:slug`
- `/politica-de-privacidade` → `/privacidade`
- `/politica-de-cookies` → `/cookies`
- `/termos-de-uso` → `/termos`
- `/blog/como-conseguir-vaga-de-jovem-aprendiz-em-sao-luis` → `/blog/como-buscar-vagas-de-jovem-aprendiz-em-sao-luis`

Antes do lançamento, redirects genéricos devem ser comparados com Search Console, sitemap antigo, backlinks e logs. Nenhuma URL com tráfego deve ser consolidada sem justificativa e teste.

## APIs legadas inventariadas

- Públicas: contato, anunciar vaga, analytics, health e publicação via cron protegido.
- Administrativas: login/logout; vagas; importação; empresas; posts; mídia; taxonomias; hubs; anúncios; configurações; Indexing API; logs.
- Interna: leitura/processamento de publicações agendadas.

O novo Astro deve manter contratos públicos necessários, mas APIs administrativas podem receber novos contratos versionados porque não são URLs de indexação.

## Modelos Prisma encontrados

`State`, `City`, `Company`, `LocationEnrichmentCache`, `JobCategory`, `Job`, `IndexingLog`, `ImportQueue`, `BlogCategory`, `BlogPost`, `SiteSetting`, `HubProfile`, `MediaAsset`, `AdminUser`, `AuditLog`, `AnalyticsEvent`, `AdSettings`, `ContactMessage`, `JobSubmission` e `AdSlot`.

## Dados e campos que não podem ser reiniciados

- Chaves primárias de todos os registros e relações.
- `externalId`, `slug`, `publishedPublicUrl` e URLs de origem/candidatura.
- `createdAt`, `updatedAt`, `publishedAt`, `scheduledAt`, `expiresAt`, `validThrough` e datas de indexação.
- Status de publicação, expiração, indexação e atividade.
- Nome oficial, slug, localização e identidade de empresas.
- Estados, cidades, categorias e vínculos das vagas.
- Conteúdo HTML, resumos, requisitos, benefícios, salários e moeda sem inventar valores.
- Autores/conteúdo editorial existentes, categorias e imagens.
- Arquivos de mídia, URL, nome original, MIME, tamanho e texto alternativo.
- Configurações, hubs, redirects implícitos, logs de auditoria e evidências de origem.
- Mensagens de contato e submissões, respeitando retenção e LGPD.

## Validação obrigatória de migração

Para cada tabela: contar origem/destino; comparar IDs; verificar referências órfãs; comparar hashes de conteúdo crítico; verificar unicidade de slugs; comparar datas em UTC; testar amostra e extremos; gerar relatório de divergências. O schema Prisma antigo e seu banco permanecem disponíveis até a aceitação.
