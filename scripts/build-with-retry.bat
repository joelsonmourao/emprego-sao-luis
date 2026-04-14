@echo off
REM Script de build com retry para migrações do Prisma (Windows)
echo Iniciando build com retry para migrações...

REM Gerar Prisma Client
echo Gerando Prisma Client...
npx prisma generate
if %errorlevel% neq 0 (
    echo Erro ao gerar Prisma Client
    exit /b 1
)

REM Tentar rodar migrate deploy com retry
echo Tentando prisma migrate deploy (com retry)...
set RETRY_COUNT=0
set MAX_RETRIES=3

:retry_loop
echo Tentativa %RETRY_COUNT% de %MAX_RETRIES%...

npx prisma migrate deploy --preview-feature
if %errorlevel% equ 0 (
    echo ✅ Migração aplicada com sucesso!
    goto :build_next
)

echo ❌ Falha na migração (tentativa %RETRY_COUNT%)
set /a RETRY_COUNT+=1

if %RETRY_COUNT% lss %MAX_RETRIES% (
    echo Aguardando 10 segundos antes de tentar novamente...
    timeout /t 10 /nobreak
    goto :retry_loop
)

echo ⚠️  Todas as tentativas de migração falharam, continuando com o build...

:build_next
REM Build do Next.js
echo Iniciando build do Next.js...
npx next build
if %errorlevel% neq 0 (
    echo Erro no build do Next.js
    exit /b 1
)

echo ✅ Build concluído!
exit /b 0
