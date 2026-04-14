#!/bin/bash

# Script de build com retry para migrações do Prisma
echo "Iniciando build com retry para migrações..."

# Gerar Prisma Client
echo "Gerando Prisma Client..."
npx prisma generate

# Tentar rodar migrate deploy com retry
echo "Tentando prisma migrate deploy (com retry)..."
RETRY_COUNT=0
MAX_RETRIES=3

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    echo "Tentativa $((RETRY_COUNT + 1)) de $MAX_RETRIES..."
    
    if npx prisma migrate deploy --preview-feature; then
        echo "✅ Migração aplicada com sucesso!"
        break
    else
        echo "❌ Falha na migração (tentativa $((RETRY_COUNT + 1)))"
        RETRY_COUNT=$((RETRY_COUNT + 1))
        
        if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
            echo "Aguardando 10 segundos antes de tentar novamente..."
            sleep 10
        fi
    fi
done

# Se todas as tentativas falharam, continuar com o build
if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo "⚠️  Todas as tentativas de migração falharam, continuando com o build..."
fi

# Build do Next.js
echo "Iniciando build do Next.js..."
npx next build

echo "✅ Build concluído!"
