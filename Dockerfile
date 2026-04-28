# syntax=docker/dockerfile:1

FROM node:22-alpine AS base

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

RUN apk add --no-cache libc6-compat

FROM base AS deps

COPY package.json ./

RUN npm install --legacy-peer-deps

FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN rm -f tsconfig.tsbuildinfo || true

RUN if [ -f prisma/schema.prisma ]; then npx prisma generate; fi

RUN npm run build

FROM base AS runner

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --chown=nextjs:nodejs package.json ./

RUN npm install --omit=dev --legacy-peer-deps

COPY --chown=nextjs:nodejs --from=builder /app/.next ./.next

COPY --chown=nextjs:nodejs --from=builder /app/public ./public

COPY --chown=nextjs:nodejs --from=builder /app/prisma ./prisma

COPY --chown=nextjs:nodejs --from=builder /app/next.config.ts ./next.config.ts

COPY --chown=nextjs:nodejs --from=builder /app/node_modules/.prisma ./node_modules/.prisma

COPY --chown=nextjs:nodejs --from=builder /app/node_modules/@prisma ./node_modules/@prisma

USER nextjs

EXPOSE 3000

CMD ["npm", "run", "start"]

# Force Coolify rebuild without npm lockfile
