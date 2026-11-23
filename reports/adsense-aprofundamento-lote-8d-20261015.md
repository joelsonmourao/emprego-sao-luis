# Aprofundamento editorial AdSense — lote 8d

Data da revisão: 2026-10-15

## Escopo efetivamente reescrito

Este lote aprofunda oito guias ainda curtos do conjunto em recuperação. A seleção exclui os 26 guias aprofundados nos lotes anteriores e prioriza lacunas de qualificação, avaliação, trabalho híbrido, alfabetização digital, conflito, atendimento, deslocamento e integração em novo emprego.

| Guia | Palavras antes | Palavras depois | Ganho | Fontes HTTPS | Seções depois |
|---|---:|---:|---:|---:|---:|
| `gap-habilidades-candidatura-como-fechar` | 564 | 794 | +230 | 2 | 8 |
| `avaliacao-de-desempenho-preparacao` | 564 | 788 | +224 | 2 | 8 |
| `trabalho-hibrido-sao-luis-checklist` | 566 | 793 | +227 | 2 | 8 |
| `alfabetizacao-digital-emprego-basico` | 566 | 800 | +234 | 2 | 9 |
| `conflito-com-chefe-trabalho-dicas` | 567 | 769 | +202 | 2 | 8 |
| `empatia-atendimento-cliente-entrevista` | 568 | 785 | +217 | 2 | 10 |
| `negociar-horario-deslocamento-emprego` | 569 | 794 | +225 | 3 | 10 |
| `primeira-semana-emprego-novo` | 569 | 808 | +239 | 3 | 9 |
| **Total** | **4.533** | **6.331** | **+1.798** |  |  |

## Mudanças editoriais reais

- O guia de lacunas de habilidades passa a ensinar priorização por frequência, necessidade e prova, critério de aceite e regra de parada.
- O guia de avaliação separa expectativa, fato e dependência, inclui fonte da Enap, feedback acionável e registro equilibrado.
- O guia de trabalho híbrido classifica presença, prevê falhas de conexão/equipamento e reconcilia plano com prática.
- O guia de alfabetização digital ensina conferência de endereço, permissão e tamanho de arquivo, registro de confirmação e teste mensal de autonomia.
- O guia de conflito acrescenta roteiro fato–impacto–pergunta, cronologia, escala de resposta e atenção à saúde.
- O guia de empatia incorpora minimização de dados com fonte da ANPD, evita prazos falsos, ensina a dizer “não” e traz controle de qualidade.
- O guia sobre horário e deslocamento compara três cenários, explicita impacto operacional, formalização e revisão na primeira semana.
- O guia da primeira semana cobre as primeiras 72 horas, classificação de autonomia, tratamento de incidentes e cinco confirmações práticas.

## Fontes primárias e limites

Foram mantidas ou adicionadas fontes oficiais adequadas a cada tema, incluindo Classificação Brasileira de Ocupações, Escola Virtual de Governo/Enap, CLT e Mediador do MTE, CERT.br, Ministério Público do Trabalho, Carteira de Trabalho Digital, Lei Brasileira de Inclusão e Autoridade Nacional de Proteção de Dados. A afirmação editorial foi limitada ao que as fontes sustentam; não foram inventadas empresas, vagas, salários, datas de contratação ou garantias.

## Testes por URL

O arquivo `apps/web/src/lib/editorial-content-overrides.test.ts` agora exige, para os oito slugs:

- `reviewedAt` igual a 2026-10-15;
- pelo menos 760 palavras;
- ao menos duas fontes HTTPS distintas;
- dois subtítulos exclusivos por artigo;
- ausência de alegações proibidas sobre vagas, salário, contratação ou aprovação garantida.

## Imagens e publicação

Este lote não declara licença de nenhuma imagem com base no nome do arquivo. A comprovação individual de origem/licença, dimensões e peso das capas continua pendente onde os binários não estão disponíveis no repositório. Não houve deploy: as URLs públicas continuam exibindo a versão anterior até a promoção segura do código aprovado.

## Progresso do recorte de 86 guias

Após este lote, **34 de 86** guias foram aprofundados e **52 de 86** continuam pendentes. O noindex dos demais não é tratado como reescrita. Não foi solicitada revisão do AdSense.
