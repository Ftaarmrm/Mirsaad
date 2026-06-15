#!/bin/sh
set -e

echo "======================================"
echo "  مِرصاد Mirsad v0.3.0"
echo "  $(date '+%Y-%m-%d %H:%M:%S UTC')"
echo "======================================"
echo "ENV:  ${NODE_ENV}"
echo "PORT: ${PORT:-3000}"
echo "DB:   ${DATABASE_URL:-[not set]}"
echo ""

# ── Validate DATABASE_URL ─────────────────────────────────────────────────────
if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL is not set."
  echo "  Set it to: file:/data/db/mirsad.db"
  exit 1
fi

# ── Ensure DB directory exists ────────────────────────────────────────────────
# Handles both absolute (file:/data/db/x.db) and relative (file:./db/x.db) paths
DB_FILE="${DATABASE_URL#file:}"
DB_DIR="$(dirname "$DB_FILE")"

if [ "$DB_DIR" != "." ] && [ -n "$DB_DIR" ]; then
  mkdir -p "$DB_DIR"
fi

# ── Push Prisma schema ────────────────────────────────────────────────────────
# Creates the DB if it doesn't exist; applies non-destructive schema changes.
# Will error on breaking changes (e.g. column removal) — this is intentional.
echo "Syncing database schema..."
node node_modules/prisma/build/index.js db push --skip-generate
echo "Database ready."
echo ""

# ── Start server ──────────────────────────────────────────────────────────────
echo "Starting Next.js server..."
exec node server.js
