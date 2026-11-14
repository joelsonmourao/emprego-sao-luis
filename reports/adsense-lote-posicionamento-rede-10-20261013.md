# Revisão editorial AdSense — lote 10

Data da revisão: 13/10/2026

## Escopo e resultado

Este lote substitui o corpo repetitivo de oito guias por conteúdo editorial individual, com exemplos delimitados, riscos, limites e referências externas identificáveis. A revisão não altera título, slug ou data original de publicação.

O controle do corpus passa de 84 para 92 guias substantivamente revistos entre os 98 sinalizados em 12/10/2026. Restam 6 guias em `guidesPendingReview`, ainda acessíveis, mas com `noindex`, sem anúncio e fora do sitemap até revisão individual.

| Guia                                     | Palavras auditadas antes | Palavras do override | Foco da revisão                                               |
| ---------------------------------------- | -----------------------: | -------------------: | ------------------------------------------------------------- |
| `follow-up-apos-entrevista-mensagem`     |                      482 |                  543 | prazo, canal, modelos, registro e proteção de dados           |
| `gestao-de-tempo-trabalho-dicas`         |                      457 |                  538 | fila de trabalho, prioridade, interrupções e comunicação      |
| `inteligencia-emocional-entrevista`      |                      453 |                  495 | histórias reais, pausa, dinâmica, limites e discriminação     |
| `linkedin-emprego-sao-luis-perfil`       |                      514 |                  475 | título, evidências, alertas, privacidade e coerência          |
| `marca-pessoal-candidatura-sao-luis`     |                      463 |                  479 | proposta verificável, conjunto mínimo e exposição segura      |
| `mudanca-de-carreira-sao-luis-curriculo` |                      484 |                  534 | matriz de transição, lacunas, evidências e vaga ponte         |
| `networking-emprego-sao-luis`            |                      457 |                  478 | pedidos específicos, consentimento, reciprocidade e segurança |
| `o-que-vestir-entrevista-emprego`        |                      461 |                  506 | contexto, segurança, custo, discriminação e checklist         |

Contagem dos overrides: texto visível após retirada de tags HTML; não inclui navegação, rodapé ou conteúdo antigo da página pública.

## Fontes verificáveis incorporadas

- Ministério do Trabalho e Emprego: Classificação Brasileira de Ocupações.
- Gov.br: Buscar Emprego no SINE e Quadro Brasileiro de Qualificações.
- Escola Virtual de Governo: cursos de Produtividade e Gestão do Tempo e Inteligência Emocional.
- LinkedIn Help: recomendações de vagas, organização de oportunidades e primeiros passos.
- CERT.br: fascículos e dicas rápidas de segurança e privacidade.
- Presidência da República: Lei nº 9.029/1995.

Os textos deixam explícito quando uma fonte é classificatória, educacional ou operacional e não a tratam como garantia de vaga, contratação ou resultado.

## Auditoria das capas

As oito capas locais são WebP de 1200 × 630 px, com peso entre 35.232 e 156.706 bytes. `credits.json` fornece legenda, texto alternativo, fotógrafo e origem nominal para cada arquivo:

| Slug                                     |   Bytes | Crédito registrado                        |
| ---------------------------------------- | ------: | ----------------------------------------- |
| `follow-up-apos-entrevista-mensagem`     |  98.458 | Foto: Picsum Photos                       |
| `gestao-de-tempo-trabalho-dicas`         |  39.968 | Foto: Alesia Kazantceva / Unsplash        |
| `inteligencia-emocional-entrevista`      |  99.838 | Foto: Marvin Meyer / Unsplash             |
| `linkedin-emprego-sao-luis-perfil`       |  39.968 | Foto: Alesia Kazantceva / Unsplash        |
| `marca-pessoal-candidatura-sao-luis`     | 156.706 | Foto: LinkedIn Sales Solutions / Unsplash |
| `mudanca-de-carreira-sao-luis-curriculo` |  68.480 | Foto: Brooke Cagle / Unsplash             |
| `networking-emprego-sao-luis`            | 137.036 | Foto: Picsum Photos                       |
| `o-que-vestir-entrevista-emprego`        |  35.232 | Foto: Glenn Carstens-Peters / Unsplash    |

O nome do provedor e o identificador guardado no repositório não comprovam, isoladamente, a licença aplicável ao binário baixado nem eventual direito de imagem. Essa verificação jurídica permanece pendente e não foi marcada como concluída.

## Seis guias ainda pendentes

- `pedir-feedback-entrevista-emprego`
- `plano-semanal-vagas-sao-luis`
- `produtividade-busca-emprego-sao-luis`
- `rejeicao-processo-seletivo-como-reagir`
- `retorno-mercado-trabalho-gap-curriculo`
- `transporte-entrevista-emprego-sao-luis`

## Limites operacionais

- Deploy: ZERO.
- Publicação pública deste lote: ZERO.
- Alteração de banco, seed ou migration: ZERO.
- Alteração de DNS, webhook, `slz.empregossaoluis.com.br`, Instagram, Direct ou pagamentos: ZERO.
- Solicitação de nova revisão ao AdSense: ZERO.
- Aprovação AdSense: ZERO; o estado informado continua “conteúdo de baixo valor”.

O lote só pode ser tratado como publicado depois de integração, CI verde, deploy autorizado do aplicativo correto e verificação pública de cada URL.
