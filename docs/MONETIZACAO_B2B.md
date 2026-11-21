# Monetização B2B

## Princípio inegociável

O candidato acessa busca e candidatura **gratuitamente**. Receita vem de empresas, anunciantes e AdSense — nunca de bloquear vaga, esconder contato ou cobrar o candidato.

## Produtos

1. Publicação unitária de vaga  
2. Destaque/patrocínio visual (não confunde com verificação)  
3. Planos recorrentes com créditos  
4. Perfil empresarial patrocinado  
5. Publicidade direta (anunciante/campanha/slot)  
6. Conteúdo patrocinado identificado

## Fluxo

`plano → pedido → pagamento → crédito → vaga → revisão → publicação/destaque → métricas`

## Estado no código

Módulos em `/admin/comercial/*`, `/publicar-vaga`, schemas comerciais e testes em `apps/web/src/lib/commercial*`.

Quando o gateway não estiver configurado: estados, sandbox e feature flags existem; **não** se simula pagamento aprovado com credencial inventada.
