# ==============================================================================
# PalliCare Dashboard — Multi-stage Dockerfile (Next.js 15)
# ==============================================================================

# ── Stage 1: Dependencies ────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

# ── Stage 2: Build ───────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time environment variables
ARG NEXT_PUBLIC_API_URL=https://api.pallicare.aiims.edu/v1
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ── Stage 3: Production ─────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

RUN addgroup -g 1001 -S pallicare && \
    adduser -S pallicare -u 1001 -G pallicare

COPY --from=builder /app/public ./public
COPY --from=builder --chown=pallicare:pallicare /app/.next/standalone ./
COPY --from=builder --chown=pallicare:pallicare /app/.next/static ./.next/static

USER pallicare

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=15s \
  CMD wget -q --spider http://localhost:3000 || exit 1

EXPOSE 3000

CMD ["node", "server.js"]
