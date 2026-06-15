#!/bin/sh

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
  echo "ERROR: DATABASE_URL is not set. Set it to: file:/data/db/mirsad.db"
  exit 1
fi

# ── Ensure DB directory exists ────────────────────────────────────────────────
DB_FILE="${DATABASE_URL#file:}"
DB_DIR="$(dirname "$DB_FILE")"
if [ "$DB_DIR" != "." ] && [ -n "$DB_DIR" ]; then
  mkdir -p "$DB_DIR"
fi

# ── Push Prisma schema (non-fatal) ───────────────────────────────────────────
# Server starts regardless — failed push is logged as warning, not a hard stop.
echo "Syncing database schema..."
if node node_modules/prisma/build/index.js db push --skip-generate; then
  echo "Database ready."
else
  echo "Warning: DB push failed (exit $?). Starting server anyway — check logs."
fi
echo ""

# ── Start server ──────────────────────────────────────────────────────────────
echo "Starting Next.js server..."
exec node server.js
