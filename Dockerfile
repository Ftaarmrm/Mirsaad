########################################
# Stage 1: Install Dependencies
########################################
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json ./
# Prisma schema needed for postinstall (prisma generate)
COPY prisma ./prisma/

# Install dependencies using npm
RUN npm install

########################################
# Stage 2: Build Next.js App
########################################
FROM node:22-alpine AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="file:/tmp/build.db"

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Run build using npm
RUN npm run build

########################################
# Stage 3: Production Runner
########################################
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Security: Add non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Persistent SQLite directory
RUN mkdir -p /data/db && chown nextjs:nodejs /data/db

# --- Next.js standalone output ---
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static     ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public           ./public

# --- Prisma runtime (client + query engine + CLI) ---
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma        ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma        ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/prisma         ./node_modules/prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.bin/prisma    ./node_modules/.bin/prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma                      ./prisma

# --- Entrypoint ---
COPY --chown=nextjs:nodejs docker-entrypoint.sh ./
RUN chmod +x ./docker-entrypoint.sh

USER nextjs

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
