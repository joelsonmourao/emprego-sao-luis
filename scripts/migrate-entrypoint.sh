#!/bin/sh
set -eu

echo "[migrate] Iniciando migrations..."
npm run db:migrate --workspace=@es/db
echo "[migrate] Migrations concluídas."

if [ "${RUN_SEED_RBAC:-}" = "true" ]; then
  if [ -z "${ADMIN_INITIAL_EMAIL:-}" ] || [ -z "${ADMIN_INITIAL_NAME:-}" ] || [ -z "${ADMIN_INITIAL_PASSWORD:-}" ]; then
    echo "[migrate] ERRO: RUN_SEED_RBAC=true exige ADMIN_INITIAL_EMAIL, ADMIN_INITIAL_NAME e ADMIN_INITIAL_PASSWORD." >&2
    exit 1
  fi
  echo "[migrate] Executando seed RBAC..."
  SEED_RBAC_REQUIRE_ADMIN=true npm run db:seed-rbac --workspace=@es/db
  echo "[migrate] Seed RBAC concluído."
fi

if [ "${RUN_SEED_COMMERCIAL_PLANS:-}" = "true" ]; then
  echo "[migrate] Executando seed de planos comerciais..."
  npm run db:seed-commercial-plans --workspace=@es/db
  echo "[migrate] Seed de planos comerciais concluído."
fi

if [ "${RUN_SEED_LOCATIONS:-}" = "true" ]; then
  echo "[migrate] Executando seed de localidades e categorias..."
  npm run db:seed-locations --workspace=@es/db
  echo "[migrate] Seed de localidades concluído."
fi

echo "[migrate] Execução finalizada. Encerrando container."
