# AdSense — transparência de capas e créditos

Data: 14/10/2026

## Correção no código

As capas locais já haviam sido substituídas por ilustrações editoriais próprias, mas as páginas públicas ainda dependiam da legenda, do texto alternativo e do crédito armazenados nas linhas antigas do banco. Enquanto o banco não fosse sincronizado, uma ilustração própria poderia continuar acompanhada por atribuição legada a fotógrafo ou banco externo.

O render de guias e notícias agora consulta os manifestos versionados de direitos para os pacotes `sl-local` e `adsense-quality`. A substituição dos metadados ocorre somente quando:

1. o caminho da imagem pertence a um dos dois pacotes locais;
2. o nome do arquivo corresponde exatamente ao slug do artigo;
3. o manifesto registra `source: original` e `licenseStatus: owned`;
4. texto alternativo, legenda, crédito e base de direitos estão preenchidos.

Se qualquer condição falhar, a página preserva os dados do banco e não atribui licença ou autoria por inferência. Para notícias com capa manifestada, variantes antigas deixam de substituir o arquivo auditado no HTML e no JSON-LD.

## Limites operacionais

- Alteração de código: **SIM**.
- Banco, migration, seed ou reset: **ZERO**.
- Deploy: **ZERO**.
- Publicação pública da correção: **ZERO**.
- Estado AdSense: permanece reprovado por “conteúdo de baixo valor”; nenhuma nova análise foi solicitada.
- Backup independente restaurável, restauração isolada e rollback de código e dados continuam sem nova comprovação.

Esta mudança evita crédito público incorreto após um futuro deploy, mas não comprova que a versão pública atual já a utiliza.
