# ==============================================================================
# PalliCare API — Multi-stage Dockerfile
# ==============================================================================

# ── Stage 1: Build ──────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files for dependency caching
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

# Copy source
COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src/ ./src/

# Build
RUN npm run build

# ── Stage 2: Production ────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

# Security: run as non-root
RUN addgroup -g 1001 -S pallicare && \
    adduser -S pallicare -u 1001 -G pallicare

# Copy package files and install production-only deps
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# Copy built output
COPY --from=builder /app/dist ./dist

# Create logs directory
RUN mkdir -p /app/logs && chown -R pallicare:pallicare /app

USER pallicare

# Health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=30s \
  CMD wget -q --spider http://localhost:3001/api/v1/health || exit 1

EXPOSE 3001 3002 9090

ENV NODE_ENV=production
ENV APP_PORT=3001

CMD ["node", "dist/main.js"]

# ── Stage 3: Development ───────────────────────────────────
FROM node:20-alpine AS development

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src/ ./src/

EXPOSE 3001 3002 9090 9229

CMD ["npx", "nest", "start", "--watch"]
