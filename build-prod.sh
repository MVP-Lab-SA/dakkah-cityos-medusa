#!/bin/bash
set -e

echo "Building Medusa backend..."
cd /home/runner/workspace/apps/backend
npx medusa build

echo "Building storefront..."
cd /home/runner/workspace/apps/storefront
npx vite build

echo "Build complete."
