# Runbook de recuperação — PostgreSQL e armazenamento

> **Estado:** procedimento preparado, ainda não executado nem homologado em produção.
>
> Deploy, migrations, seeds e alterações de dados permanecem bloqueados até que backup, restauração isolada e rollback sejam comprovados.

Este runbook vale somente para o aplicativo público `empregossaoluis.com.br`, UUID Coolify `s5dowl45t5bgfduiy1b5f3d8`, repositório `joelsonmourao/emprego-sao-luis` e branch de produção `codex/admin-negocio-completo`.

A aplicação ativa documentada no repositório usa Astro, Drizzle, PostgreSQL e armazenamento compartilhado em `/app/data`. O código Next.js/Prisma na raiz é legado. Se o inventário do Coolify indicar outra arquitetura, branch, domínio, banco ou volume, interrompa o procedimento e reconcilie o inventário antes de tocar nos dados.

## Escopo proibido

Este procedimento não autoriza acesso, reinício, deploy ou alteração de:

- `webhook.empregossaoluis.com.br`;
- UUID `ir0ej2xf4a6c2pptnqzcv0ob`;
- Instagram, Direct, tokens ou automações;
- bancos, volumes ou aplicações que não pertençam ao app público acima;
- scripts de seed, reset, demonstração ou migrations.

## 1. Gate de autorização

Antes de qualquer leitura de produção, registre em local restrito e sem segredos:

- autorização e responsável pela janela;
- aplicativo, domínio, repo, branch e commit implantado;
- IDs do PostgreSQL, Valkey/Redis e volume;
- provedor de armazenamento ativo: `/app/data` ou S3/R2;
- versão principal do PostgreSQL;
- tamanho estimado do banco e do armazenamento;
- espaço livre no host e no destino independente;
- política de retenção;
- plano de retorno à operação;
- confirmação de que o webhook e demais apps estão fora do alvo.

Pare se a identidade de qualquer recurso estiver ambígua.

## 2. Consistência entre banco e arquivos

Vagas, mídia, marca, imports, relatórios e comprovantes podem depender simultaneamente do PostgreSQL e de `/app/data`. Os dois artefatos precisam representar o mesmo ponto operacional.

Em janela autorizada:

1. bloqueie temporariamente novas escritas no app público;
2. pause somente o worker deste aplicativo;
3. aguarde a fila deste aplicativo drenar ou registre jobs pendentes;
4. confirme que web e worker não estão escrevendo no volume;
5. gere o dump do PostgreSQL;
6. gere o snapshot/arquivo do armazenamento;
7. calcule checksums e copie ambos ao destino independente;
8. só então restaure web/worker e retire o modo de manutenção.

Não reinicie o VPS e não pare serviços externos. Se não houver mecanismo seguro para suspender as escritas somente deste app, o gate permanece fechado.

## 3. Diretório de trabalho protegido

Use caminho dedicado fora do repositório. Defina os caminhos literalmente; não use `/`, `~`, curingas ou variáveis não validadas.

```bash
set -euo pipefail
umask 077

export BACKUP_ID="$(date -u +%Y%m%dT%H%M%SZ)"
export BACKUP_WORK_DIR="/caminho/seguro/esl-${BACKUP_ID}"
mkdir -p "${BACKUP_WORK_DIR}"
```

Configure `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER` e `PGPASSFILE` no executor autorizado. O arquivo de senha deve ter permissão `0600`. Não passe credenciais na linha de comando e nunca habilite `set -x`.

## 4. Dump consistente do PostgreSQL

```bash
export DB_DUMP="${BACKUP_WORK_DIR}/database.dump"

pg_dump   --format=custom   --compress=9   --no-owner   --no-privileges   --serializable-deferrable   --file="${DB_DUMP}"

pg_restore --list "${DB_DUMP}" > "${BACKUP_WORK_DIR}/database.contents"
sha256sum "${DB_DUMP}" > "${BACKUP_WORK_DIR}/database.sha256"
```

Qualquer erro no dump, inventário ou checksum invalida a execução.

## 5. Snapshot do volume ou bucket

### Volume local

Primeiro resolva o mount real associado a `/app/data`. Valide que o alvo é um diretório exclusivo deste aplicativo e não é a raiz do host.

```bash
export RECOVERY_UPLOADS_PATH="/mount/exato/deste-app"
export STORAGE_ARCHIVE="${BACKUP_WORK_DIR}/app-data.tar.gz"

test -d "${RECOVERY_UPLOADS_PATH}"
test "${RECOVERY_UPLOADS_PATH}" != "/"
test "${RECOVERY_UPLOADS_PATH}" != "/home"

tar   --one-file-system   --xattrs   --acls   --numeric-owner   -czf "${STORAGE_ARCHIVE}"   -C "${RECOVERY_UPLOADS_PATH}" .

sha256sum "${STORAGE_ARCHIVE}" > "${BACKUP_WORK_DIR}/app-data.sha256"
```

### S3/R2

Quando o provider ativo for S3/R2:

- use versionamento ou snapshot do bucket;
- registre versão/marker de consistência;
- replique para destino independente;
- não grave access key, secret, URL assinada ou lista de objetos privados em logs públicos;
- valide recuperação de uma amostra em bucket isolado.

Um backup apenas do PostgreSQL não satisfaz o gate quando mídia ou documentos dependem do volume/bucket.

## 6. Manifesto e destino independente

Crie um manifesto sem dados pessoais ou segredos:

```text
backup_id=<UTC>
application_uuid=s5dowl45t5bgfduiy1b5f3d8
domain=empregossaoluis.com.br
repository=joelsonmourao/emprego-sao-luis
branch=codex/admin-negocio-completo
deployed_commit=<sha>
postgres_version=<major.minor>
storage_provider=<volume|s3|r2>
database_sha256=<sha256>
storage_sha256_or_version=<valor>
independent_destination=<identificador sem credenciais>
retention_until=<data UTC>
write_pause_started_at=<UTC>
write_pause_finished_at=<UTC>
```

Copie dump, armazenamento e manifesto para destino criptografado e independente do VPS/volume primário. Recalcule os checksums no destino. Artefatos presentes apenas no mesmo VPS não liberam o gate.

## 7. Restauração isolada

Crie ambiente descartável com:

- PostgreSQL da mesma versão principal;
- volume ou bucket novo e vazio;
- rede privada, sem domínio público;
- credenciais exclusivas;
- e-mail, Meta, Google, AdSense, pagamentos, webhooks, indexação e push desabilitados;
- worker inicialmente parado;
- `APP_ENV=staging` e `FORCE_NOINDEX=true`;
- commit exatamente igual ao manifesto.

Transfira os artefatos a partir do destino independente e valide checksums antes de restaurar.

```bash
sha256sum --check database.sha256
sha256sum --check app-data.sha256

createdb --template=template0 "${RESTORE_DATABASE}"

pg_restore   --exit-on-error   --no-owner   --no-privileges   --dbname="${RESTORE_DATABASE}"   database.dump

mkdir -p "${RESTORE_UPLOADS_PATH}"
tar -xzf app-data.tar.gz -C "${RESTORE_UPLOADS_PATH}"
```

`RESTORE_DATABASE` e `RESTORE_UPLOADS_PATH` devem apontar somente para recursos descartáveis. Se houver dúvida, pare antes de `createdb`, `pg_restore`, `mkdir` ou `tar`.

## 8. Verificação sem exposição de dados

Registre resultados agregados, nunca nomes, e-mails, candidaturas, contatos, tokens ou conteúdo privado.

Critérios mínimos:

- restore terminou sem erro;
- histórico Drizzle e schema esperado estão presentes;
- `npm run db:audit-schema` não encontrou divergências no banco isolado;
- tabelas críticas, constraints e índices existem;
- contagens agregadas são compatíveis com o manifesto;
- arquivos do volume/bucket estão legíveis;
- uma amostra de mídia já referenciada no banco abre no ambiente isolado;
- `/api/health` e `/api/ready` respondem;
- login e leitura do painel funcionam;
- uma vaga, uma notícia e um histórico de importação existentes podem ser lidos;
- nenhuma integração externa dispara;
- worker só é iniciado após confirmar isolamento de saída.

Exemplo de inventário agregado:

```sql
SELECT schemaname, relname, n_live_tup
FROM pg_stat_user_tables
ORDER BY schemaname, relname;
```

Use contagens exatas quando o critério de aceitação exigir reconciliação.

## 9. Ensaio de rollback de código e dados

No ambiente isolado:

1. confirme commit, dump e armazenamento do manifesto;
2. implante o candidato usando banco/volume isolados;
3. execute smoke tests;
4. pare o worker isolado;
5. volte web e worker ao commit/imagem anterior;
6. recrie um banco descartável vazio;
7. restaure novamente o dump;
8. restaure novamente volume/bucket correspondente;
9. conecte apenas a aplicação isolada no commit anterior;
10. repita health, readiness, mídia e amostras de leitura;
11. registre duração, operador, checksums e resultado.

A possibilidade de reverter um commit não comprova recuperação dos dados.

## 10. Critérios para liberar o deploy

- [ ] app, domínio, repo, branch, commit, banco e armazenamento conferidos;
- [ ] dump PostgreSQL consistente;
- [ ] volume/bucket do mesmo ponto operacional;
- [ ] checksums verificados no destino independente;
- [ ] retenção e acesso documentados;
- [ ] restauração isolada concluída;
- [ ] schema, health, readiness, mídia e leituras aprovados;
- [ ] rollback de código, banco e armazenamento ensaiado;
- [ ] evidência não sensível registrada no checklist oficial;
- [ ] autorização explícita para a janela de deploy.

Até todos os itens passarem, mantenha o deploy bloqueado e não execute migrations, seeds ou resets.

## 11. Retenção e evidência

Política inicial sugerida, sujeita à aprovação operacional:

- diário: 14 cópias;
- semanal: 8 cópias;
- mensal: 6 cópias.

Por execução, registre ID, horário UTC, operador, commit, versão PostgreSQL, provider de storage, tamanhos, checksums/versões, destino independente, resultado do restore, verificações e rollback.

Nunca anexe dumps, arquivos do volume, segredos, URLs de banco ou dados pessoais a issues, PRs ou logs de CI.
