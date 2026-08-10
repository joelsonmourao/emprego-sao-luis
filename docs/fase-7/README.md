# Fase 7 — Instagram e página da bio

Criados `/instagram`, busca por `ES-000001`, short link `/i/:code` com UTMs, últimas vagas/notícias, templates SVG e legendas rastreáveis. O worker possui cliente de publicação em duas etapas usando exclusivamente o Instagram Graph API oficial.

O estúdio protegido seleciona vagas publicadas, gera Feed, Story, quadrado ou carrossel, produz PNG com Sharp, envia ao R2/S3, registra legenda/alt text e usa BullMQ com retry. A publicação automática é opcional e usa somente a Graph API oficial.

Publicação real requer `META_INSTAGRAM_ACCOUNT_ID` e `META_PAGE_ACCESS_TOKEN`, conta profissional conectada a uma Página e mídia acessível por HTTPS. Coleta automática de métricas depende dessas credenciais.
