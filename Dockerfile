# syntax=docker/dockerfile:1

FROM node:22-alpine AS base

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

RUN apk add --no-cache libc6-compat

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps --include=dev --package-lock=false --no-audit --no-fund

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN rm -f tsconfig.tsbuildinfo || true
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs

EXPOSE 3000

CMD ["npm", "run", "start"]