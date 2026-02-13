#!/bin/bash

cd /home/runner/workspace/apps/backend
NODE_OPTIONS="--max-old-space-size=512" npx medusa start &
BACKEND_PID=$!

echo "Waiting for Medusa backend to start..."
for i in $(seq 1 60); do
  if curl -s http://localhost:9000/health > /dev/null 2>&1; then
    echo "Medusa backend is ready on port 9000"
    break
  fi
  sleep 2
done

cd /home/runner/workspace/apps/storefront
echo "Starting storefront on port 5000..."
HOST=0.0.0.0 PORT=5173 NITRO_HOST=0.0.0.0 NITRO_PORT=5173 NODE_OPTIONS="--max-old-space-size=1024" node .output/server/index.mjs &
STOREFRONT_PID=$!

echo "Waiting for storefront to start..."
for i in $(seq 1 30); do
  if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo "Storefront is ready on port 5173"
    break
  fi
  sleep 1
done

cd /home/runner/workspace
echo "Starting proxy on port 5000..."
exec node prod-proxy.js
