# Armazenamento persistente no Coolify

## Configuração obrigatória

Os serviços `web` e `worker` precisam compartilhar o mesmo volume persistente, montado em:

```text
/app/data
```

No Coolify, crie um volume persistente e monte-o em `/app/data` nos dois serviços. O container executa com UID/GID `1001`; o volume precisa permitir leitura, escrita, criação e exclusão por esse usuário.

Estrutura criada e verificada no startup:

```text
/app/data/imports
/app/data/media
/app/data/brand
/app/data/reports
/app/data/temp
/app/data/receipts
```

Variável obrigatória para armazenamento local:

```dotenv
UPLOADS_DIR=/app/data
```

O diagnóstico aparece em `/admin/saude` e em `/api/ready`. Ele verifica provedor ativo, diretório, existência, leitura, escrita e exclusão de temporário, sem expor credenciais.

## Provedores e prioridade

O pacote central `@es/storage` escolhe:

1. S3/R2 somente quando toda a configuração estiver preenchida;
2. volume persistente local em `UPLOADS_DIR` nos demais casos.

S3/R2 é opcional. A ausência de credenciais não bloqueia importação, mídia, identidade visual, relatórios ou comprovantes.

Para habilitar S3/R2, configure o conjunto completo:

```dotenv
S3_ENDPOINT=
S3_REGION=auto
S3_BUCKET=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_PUBLIC_URL=
S3_FORCE_PATH_STYLE=false
S3_SERVER_SIDE_ENCRYPTION=AES256
```

Se qualquer variável essencial estiver ausente, o sistema usa o volume local. Não misture um bucket parcialmente configurado com o volume.

## Checklist no Coolify

1. Criar o volume persistente.
2. Montá-lo em `/app/data` no `web`.
3. Montar o mesmo volume em `/app/data` no `worker`.
4. Definir `UPLOADS_DIR=/app/data` nos dois serviços.
5. Confirmar que ambos executam com acesso do UID/GID `1001` ao volume.
6. Fazer o deploy do `web` e do `worker`.
7. Abrir `/api/ready`; `checks.storage` deve ser `ok`.
8. Abrir `/admin/saude`; escrita, leitura e exclusão devem aparecer como disponíveis.
9. Enviar uma mídia e uma planilha de teste.
10. Reiniciar/redeployar os dois serviços e confirmar que os arquivos continuam disponíveis.

## Falhas controladas

Quando o volume não pode ser usado, a API administrativa responde JSON com `ok: false`, código estável, mensagem compreensível e `requestId`. Para indisponibilidade de escrita, o código é `STORAGE_NOT_WRITABLE`; o log estruturado contém a rota e a causa sanitizada.

Nunca coloque imports, relatórios ou comprovantes em uma rota pública. Apenas as áreas `media` e `brand` podem ser servidas por `/api/uploads/...`; a rota valida e normaliza cada chave antes da leitura.

## Backup e restauração

Inclua o volume `/app/data` no plano de backup junto com o PostgreSQL. Para restauração:

1. interrompa novas importações e uploads;
2. restaure banco e volume do mesmo ponto no tempo;
3. preserve caminhos relativos internos;
4. suba `web` e `worker`;
5. valide `/api/ready`, uma mídia existente e um histórico de importação.

## Criptografia compatível com o provider

`S3_SERVER_SIDE_ENCRYPTION` aceita `AES256` (padrão), `aws:kms` ou `none`. Cloudflare R2/S3 deve manter criptografia suportada pelo provider. MinIO local sem KMS precisa de `none`; isso não desativa TLS de transporte e deve ficar restrito ao staging isolado. O diagnóstico de startup grava apenas provider, bucket lógico e capacidades, nunca credenciais.
