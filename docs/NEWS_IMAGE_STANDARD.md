# Padrão de imagens para notícias

## Entrada e publicação

A original deve ter ao menos 1200 px de largura. O upload preserva a original e gera variantes WebP; notícia `PUBLISHED` exige imagem processada da biblioteca, ALT, legenda e crédito. URL externa ou asset incompleto pode ficar em rascunho, mas é bloqueado na publicação.

| Variante | Dimensão | Uso |
| --- | ---: | --- |
| `hero` | 1600×900 | LCP e detalhe 16:9 |
| `card` | 640×360 | listagens e `srcset` |
| `og` | 1200×630 | Open Graph/social |
| `square` | 1200×1200 | schema e redes 1:1 |
| `landscape43` | 1200×900 | schema 4:3 |

O registro guarda URL original, dimensões, variantes, URL OG, ALT, legenda, crédito e ponto focal. A notícia informa `width`/`height`, `srcset`, `sizes` e `fetchpriority="high"` para a imagem LCP.

Original e variantes ficam no mesmo provider de web e worker. Falha intermediária remove chaves já geradas. Readiness confirma escrita, leitura e exclusão.

Para MinIO sem KMS use `S3_SERVER_SIDE_ENCRYPTION=none`. Produção mantém `AES256` por padrão; `aws:kms` pode ser usado quando o provider estiver preparado.

