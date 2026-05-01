# syntax=docker/dockerfile:1

FROM node:22-alpine

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps --package-lock=false --no-audit --no-fund

COPY . .
RUN rm -f tsconfig.tsbuildinfo || true
RUN npm run build

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs \
  && chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

CMD ["npm", "run", "start"]