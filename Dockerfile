# syntax=docker/dockerfile:1

FROM node:22-alpine

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps --include=dev --package-lock=false --no-audit --no-fund

COPY . .
RUN rm -f tsconfig.tsbuildinfo || true
RUN set -eux; \
  echo "=== BUILD DIAGNOSTIC: BEFORE ==="; \
  node -v; npm -v; \
  df -h; \
  echo "MemTotal/MemAvailable:"; \
  (grep -E "MemTotal|MemAvailable|SwapTotal|SwapFree" /proc/meminfo || true); \
  echo "=== RUNNING npm run build ==="; \
  npm run build; \
  echo "=== BUILD DIAGNOSTIC: AFTER ==="; \
  df -h; \
  (grep -E "MemTotal|MemAvailable|SwapTotal|SwapFree" /proc/meminfo || true)

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs \
  && chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

CMD ["npm", "run", "start"]