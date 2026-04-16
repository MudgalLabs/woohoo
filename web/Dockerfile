# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
# Copy workspace manifests so npm understands the workspace structure
COPY package.json package-lock.json ./
COPY web/package.json ./web/
COPY packages/ui/package.json ./packages/ui/
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
# Copy workspace package sources (symlink node_modules/@woohoo/ui -> packages/ui resolves once packages/ exists)
COPY packages/ ./packages/
COPY web/ ./web/
RUN cd web && npx prisma generate
RUN cd web && npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

COPY --from=builder /app/web/public ./web/public
COPY --from=builder --chown=nextjs:nodejs /app/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/web/.next/static ./web/.next/static

# Prisma: ship schema + CLI so `prisma migrate deploy` works in this image.
# The `prisma-client` generator emits the runtime into app/generated/prisma,
# which is already included by Next's standalone output.
COPY --from=builder --chown=nextjs:nodejs /app/web/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/web/prisma.config.ts ./prisma.config.ts
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

USER nextjs
EXPOSE 3000
CMD ["node", "web/server.js"]
