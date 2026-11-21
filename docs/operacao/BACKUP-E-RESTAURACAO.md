# Backup e restauração

## Backup PostgreSQL

Execute a partir de uma máquina com `pg_dump` e acesso ao banco:

```powershell
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
pg_dump --format=custom --no-owner --no-acl --file "empregos-$stamp.dump" $env:DATABASE_URL
Get-FileHash "empregos-$stamp.dump" -Algorithm SHA256
```

Copie o dump para armazenamento externo criptografado. Registre checksum, horário, origem e responsável. Nunca considere o backup válido sem restauração.

## Teste de restauração

Crie um PostgreSQL isolado e vazio:

```powershell
createdb empregos_restore_test
pg_restore --clean --if-exists --no-owner --dbname empregos_restore_test ".\empregos-AAAAMMDD-HHMMSS.dump"
psql "postgres://USUARIO:SENHA@HOST:5432/empregos_restore_test" -c "select count(*) from es_jobs;"
```

Compare as contagens de todas as tabelas e amostras de IDs, slugs e datas. Não use `--clean` contra produção.

## Objetos R2/S3

Ative versionamento quando disponível. Faça inventário de chaves, tamanhos e ETags e replique para outro bucket/conta. Banco e bucket devem usar o mesmo identificador de janela de backup.

## Retenção mínima

- 7 backups diários;
- 4 semanais;
- 12 mensais;
- teste de restauração mensal;
- backup adicional antes de migrations e troca de versão.
