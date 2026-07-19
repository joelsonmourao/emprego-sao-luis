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
  echo "[migrate] Executando seed de localidades..."
  npm run db:seed-locations --workspace=@es/db
  echo "[migrate] Seed de localidades concluído."
fi

if [ "${RUN_SEED_CATEGORIES:-}" = "true" ]; then
  echo "[migrate] Executando seed de categorias..."
  npm run db:seed-categories --workspace=@es/db
  echo "[migrate] Seed de categorias concluído."
fi

if [ "${RUN_SEED_SYSTEM_DEFAULTS:-}" = "true" ]; then
  echo "[migrate] Executando seed de padrões estruturais..."
  npm run db:seed-system-defaults --workspace=@es/db
  echo "[migrate] Seed de padrões estruturais concluído."
fi

# Seed editorial AdSense (one-shot). Remova a variável após o sucesso.
if [ "${RUN_SEED_ADSENSE_EDITORIAL:-}" = "true" ]; then
  if [ "${ADSENSE_EDITORIAL_ALLOW_PRODUCTION:-}" != "1" ]; then
    echo "[migrate] ERRO: RUN_SEED_ADSENSE_EDITORIAL=true exige ADSENSE_EDITORIAL_ALLOW_PRODUCTION=1." >&2
    exit 1
  fi
  if [ -z "${SITE_URL:-}" ]; then
    echo "[migrate] ERRO: RUN_SEED_ADSENSE_EDITORIAL=true exige SITE_URL." >&2
    exit 1
  fi
  echo "[migrate] Executando seed editorial AdSense (produção autorizada)..."
  node scripts/seed-adsense-editorial-schedule.mjs --write --i-understand-production
  echo "[migrate] Seed editorial AdSense concluído."
fi

# Despublica template adsense-editorial-* (one-shot). Remova a variável após o sucesso.
if [ "${RUN_UNPUBLISH_ADSENSE_EDITORIAL:-}" = "true" ]; then
  if [ "${ADSENSE_EDITORIAL_ALLOW_PRODUCTION:-}" != "1" ]; then
    echo "[migrate] ERRO: RUN_UNPUBLISH_ADSENSE_EDITORIAL=true exige ADSENSE_EDITORIAL_ALLOW_PRODUCTION=1." >&2
    exit 1
  fi
  echo "[migrate] Despublicando seed editorial template (DRAFT)..."
  node scripts/unpublish-adsense-editorial-seed.mjs --write --i-understand-production
  echo "[migrate] Unpublish editorial concluído."
fi

echo "[migrate] Execução finalizada. Encerrando container."
