#!/bin/bash
set -e

echo "========================================"
echo "  Dakkah CityOS Commerce — Test Runner"
echo "========================================"

FAILED=0

echo ""
echo "[1/3] Backend Unit Tests"
echo "------------------------"
cd apps/backend
if pnpm test:unit 2>&1; then
  echo "  ✓ Backend unit tests passed"
else
  echo "  ✗ Backend unit tests failed"
  FAILED=1
fi
cd ../..

echo ""
echo "[2/3] Storefront Unit Tests"
echo "----------------------------"
cd apps/storefront
if pnpm test 2>&1; then
  echo "  ✓ Storefront unit tests passed"
else
  echo "  ✗ Storefront unit tests failed"
  FAILED=1
fi
cd ../..

echo ""
echo "[3/3] Backend Integration Tests (requires DB)"
echo "-----------------------------------------------"
if [ -n "$DATABASE_URL" ]; then
  cd apps/backend
  if pnpm test:integration:http 2>&1; then
    echo "  ✓ Integration tests passed"
  else
    echo "  ✗ Integration tests failed"
    FAILED=1
  fi
  cd ../..
else
  echo "  ⊘ Skipped (DATABASE_URL not set)"
fi

echo ""
echo "========================================"
if [ $FAILED -eq 0 ]; then
  echo "  All tests passed!"
else
  echo "  Some tests failed. See output above."
fi
echo "========================================"

exit $FAILED
