# Runbook de incidentes

## Site indisponível

Verifique `/api/health`, depois `/api/ready`, logs do web, PostgreSQL e Valkey. Health verde com readiness vermelho indica dependência indisponível. Não reinicie migrations repetidamente.

## Worker parado

Verifique logs, conexão Redis, contagem de jobs failed e credenciais R2/Resend/Meta. Corrija a causa e use retry do BullMQ; não duplique o lote manualmente.

## Importação incorreta

Pause publicação do lote, preserve arquivo/hash/linhas, identifique jobs pelo `batchId` e faça correção auditada. Não apague vagas anteriores ao lote.

## SEO

Em aumento de 404/410, compare sitemap anterior, redirects e Search Console. Reponha redirects individuais. Não redirecione tudo para a home.

## Segurança

Revogue sessões, rotacione somente os segredos potencialmente expostos e preserve evidências. Nunca publique token ou dump em issue, commit ou chat.
