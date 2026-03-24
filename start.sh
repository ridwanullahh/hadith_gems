#!/bin/sh
# BismiLlah Ar-Rahman Ar-Roheem
# Production startup script for Hadith Gems
# Seeds the database if it doesn't exist, then starts the server

set -e

DB_PATH="./data/hadith_gems.db"

if [ ! -f "$DB_PATH" ]; then
  echo "═══════════════════════════════════════"
  echo "  Database not found - seeding now..."
  echo "═══════════════════════════════════════"
  mkdir -p ./data
  node --import tsx/esm server/db/seed.ts || npx tsx server/db/seed.ts
  echo "═══════════════════════════════════════"
  echo "  Seeding complete. Starting server..."
  echo "═══════════════════════════════════════"
else
  echo "  Database already exists. Starting server..."
fi

exec node .output/server/index.mjs
