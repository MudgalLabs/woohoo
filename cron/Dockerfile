# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
# Copy workspace manifests so npm understands the workspace topology and hoists
# deps into root node_modules. cron imports generated prisma from web/, so we
# need web's manifest too.
COPY package.json package-lock.json ./
COPY web/package.json ./web/
COPY packages/ui/package.json ./packages/ui/
COPY cron/package.json ./cron/
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY packages/ ./packages/
COPY web/prisma ./web/prisma/
COPY web/prisma.config.ts ./web/prisma.config.ts
# cron imports date-tz + unsubscribe helpers from web/lib.
COPY web/lib ./web/lib/
# cron imports from web/app/generated/prisma/client. Generate it from web's
# schema. We intentionally skip copying the rest of web/ — cron only needs
# the generated client + the two helper files, not the Next.js source.
RUN cd web && npx prisma generate
COPY cron/ ./cron/

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 app

# Runtime artefacts: node_modules (for tsx, prisma runtime, resend, etc.),
# generated prisma client, and cron source (tsx compiles TS at startup).
COPY --from=builder --chown=app:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=app:nodejs /app/web/app/generated ./web/app/generated/
COPY --from=builder --chown=app:nodejs /app/web/prisma ./web/prisma/
COPY --from=builder --chown=app:nodejs /app/web/lib ./web/lib/
COPY --from=builder --chown=app:nodejs /app/cron ./cron/
COPY --from=builder --chown=app:nodejs /app/package.json ./package.json

USER app
# --tsconfig is required: tsx's tsconfig discovery starts at cwd (/app), not
# at the source file, so without it cron/tsconfig.json is missed and JSX
# falls back to the classic transform (breaks FollowUpDigest.tsx).
CMD ["npx", "tsx", "--tsconfig", "cron/tsconfig.json", "cron/src/index.ts"]
