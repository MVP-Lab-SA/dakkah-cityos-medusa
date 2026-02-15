#!/bin/bash

# Kill any stale processes on our ports
fuser -k 9000/tcp 2>/dev/null
fuser -k 5000/tcp 2>/dev/null
sleep 2

# Start Medusa backend in background with limited memory
cd /home/runner/workspace/apps/backend
NODE_OPTIONS="--max-old-space-size=512" npx medusa develop &
BACKEND_PID=$!

# Wait for backend to start (up to 90 seconds)
echo "Waiting for Medusa backend to start..."
for i in $(seq 1 45); do
  if curl -s http://localhost:9000/health > /dev/null 2>&1; then
    echo "Medusa backend is ready on port 9000"
    break
  fi
  if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "Backend process died. Cleaning port and retrying..."
    fuser -k 9000/tcp 2>/dev/null
    sleep 2
    NODE_OPTIONS="--max-old-space-size=512" npx medusa develop &
    BACKEND_PID=$!
  fi
  sleep 2
done

# Start storefront
cd /home/runner/workspace/apps/storefront
echo "Starting storefront on port 5000..."
NODE_OPTIONS="--max-old-space-size=1024" exec npx vite dev --host 0.0.0.0 --port 5000 --strictPort
