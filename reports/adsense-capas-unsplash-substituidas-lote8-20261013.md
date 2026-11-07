# Lote final de substituição de capas Unsplash

Data: 13/10/2026  
Escopo: ativos estáticos e prova automatizada; sem deploy, banco, DNS ou sistemas externos.

## Entrega

- As três capas ainda vinculadas ao Unsplash foram substituídas por ilustrações editoriais próprias.
- Os arquivos são WebP 1200 × 630, com desenhos diferentes e hashes distintos.
- O manifesto `sl-local` passa a registrar 105 capas próprias, zero Unsplash e zero Picsum.
- Cada registro declara autoria da equipe, legenda, texto alternativo e base de direitos sem fotografia, rosto, marca de terceiro ou banco externo.

| Slug | Tema visual próprio |
|---|---|
| `esgotamento-busca-emprego-sinais` | pausa e recuperação durante a busca |
| `mensagem-fria-recrutador-linkedin` | mensagem personalizada sem spam |
| `busca-emprego-sao-luis-2026` | bússola para priorização local |

## Reconciliação de 105 × 106

A diferença não era uma capa ausente. A auditoria de 106 URLs reúne artigos que usam dois pacotes de ativos:

- `sl-local`: 105 registros;
- `adsense-quality`: 8 registros;
- seis dos artigos auditados usam `adsense-quality` e 100 usam `sl-local`;
- a união dos dois manifestos cobre as 106 URLs auditadas e todos os arquivos apontados existem no repositório;
- sete registros dos manifestos pertencem a guias que não integravam aquele recorte público de 106 URLs.

O teste `editorial-unsplash-cover-replacement-lote8.test.ts` fixa essa relação e impede que a diferença seja novamente tratada como arquivo ausente.

## Limites

- Este lote não altera o texto dos guias; as 98 revisões editoriais já estavam concluídas em código.
- Nenhum deploy foi executado. A produção pública só muda após publicação segura e verificável.
- O domínio continua com reprovação AdSense por “conteúdo de baixo valor”; não foi solicitada nova análise.
- Backup restaurável, restauração isolada e rollback de dados ainda não estão comprovados, portanto a publicação continua bloqueada.
