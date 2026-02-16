#!/bin/bash
set -e

echo "========================================"
echo "  Dakkah CityOS Commerce — Production"
echo "========================================"

fuser -k 9000/tcp 2>/dev/null || true
fuser -k 5000/tcp 2>/dev/null || true
sleep 1

cd /home/runner/workspace/apps/backend
echo "Starting Medusa backend (production)..."
NODE_ENV=production NODE_OPTIONS="--max-old-space-size=512" npx medusa start &
BACKEND_PID=$!

echo "Waiting for Medusa backend to start..."
for i in $(seq 1 60); do
  if curl -s http://localhost:9000/health > /dev/null 2>&1; then
    echo "Medusa backend is ready on port 9000"
    break
  fi
  if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "Backend process died unexpectedly"
    exit 1
  fi
  sleep 2
done

cd /home/runner/workspace/apps/storefront
echo "Starting storefront (production)..."
NODE_ENV=production exec node .output/server/index.mjs
