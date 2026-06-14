########################################
# Stage 1: Install Dependencies
########################################
FROM oven/bun:1.2 AS deps
WORKDIR /app

# Copy only what's needed for install
COPY package.json bun.lock ./
# Prisma schema needed for postinstall (prisma generate)
COPY prisma ./prisma/

# Install all deps (triggers postinstall → prisma generate for linux)
RUN bun install --frozen-lockfile

########################################
# Stage 2: Build Next.js App
########################################
FROM oven/bun:1.2 AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
# Dummy DB URL for build time — real URL set at runtime via env var
ENV DATABASE_URL="file:/tmp/build.db"

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# next build + copies static/ and public/ into standalone/ (see package.json)
RUN bun run build

########################################
# Stage 3: Production Runner
########################################
FROM oven/bun:1.2-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Non-root user for security
RUN groupadd --gid 1001 nodejs \
    && useradd --uid 1001 --gid 1001 --no-create-home nextjs

# Persistent SQLite directory (mount a volume here in production)
RUN mkdir -p /data/db && chown nextjs:nodejs /data/db

# --- Next.js standalone output ---
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static     ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public           ./public

# --- Prisma runtime (client + native query engine + CLI for db push) ---
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma    ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma    ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/prisma     ./node_modules/prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma                  ./prisma

# --- Entrypoint ---
COPY --chown=nextjs:nodejs docker-entrypoint.sh ./
RUN chmod +x ./docker-entrypoint.sh

USER nextjs

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
