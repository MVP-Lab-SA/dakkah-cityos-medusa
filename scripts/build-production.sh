#!/bin/bash
set -e

echo "========================================"
echo "  Dakkah CityOS Commerce — Build"
echo "========================================"

echo "[1/3] Building backend..."
cd /home/runner/workspace/apps/backend
pnpm build
echo "  ✓ Backend built"

echo "[2/3] Running database migrations..."
npx medusa db:migrate
echo "  ✓ Database migrations complete"

echo "[3/3] Building storefront..."
cd /home/runner/workspace/apps/storefront
pnpm build
echo "  ✓ Storefront built"

echo ""
echo "========================================"
echo "  Build complete! Run scripts/start-production.sh to start"
echo "========================================"
