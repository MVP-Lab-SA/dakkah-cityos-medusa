# Testing Guide

Complete guide for running tests in the Multi-Tenant B2B Marketplace.

## Table of Contents

1. [Integration Tests](#integration-tests)
2. [E2E Tests](#e2e-tests)
3. [Running Tests](#running-tests)
4. [CI/CD Integration](#cicd-integration)

---

## Integration Tests

Integration tests verify that sync services work correctly between Medusa and Payload.

### Location
- `apps/orchestrator/tests/sync/`

### Test Files
- `medusaToPayload.test.ts` - Tests for syncing from Medusa to Payload
- `payloadToMedusa.test.ts` - Tests for syncing from Payload to Medusa
- `reconciliation.test.ts` - Tests for data reconciliation

### Running Integration Tests

```bash
# From orchestrator directory
cd apps/orchestrator

# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage
```

### Writing New Integration Tests

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('My Feature', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should do something', async () => {
    // Arrange
    const input = { data: 'test' }
    
    // Act
    const result = await myFunction(input)
    
    // Assert
    expect(result.success).toBe(true)
  })
})
```

---

## E2E Tests

End-to-end tests verify complete user flows in the storefront.

### Location
- `apps/storefront/e2e/`

### Test Files
- `store-selection.spec.ts` - Multi-tenant store selection
- `b2b-quotes.spec.ts` - B2B quote request flow
- `vendor-portal.spec.ts` - Vendor dashboard and management
- `dynamic-pages.spec.ts` - CMS page rendering

### Running E2E Tests

```bash
# From storefront directory
cd apps/storefront

# Run all E2E tests
pnpm test:e2e

# Run tests with UI
pnpm test:e2e:ui

# Run tests in debug mode
pnpm test:e2e:debug

# Run specific test file
pnpm test:e2e store-selection.spec.ts

# Run tests on specific browser
pnpm test:e2e --project=chromium
pnpm test:e2e --project=firefox
pnpm test:e2e --project=webkit
```

### Test Reports

After running tests, view the HTML report:

```bash
pnpm dlx playwright show-report
```

### Writing New E2E Tests

```typescript
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test('should perform user action', async ({ page }) => {
    // Navigate
    await page.goto('/us/feature')
    
    // Interact
    await page.click('[data-testid="button"]')
    
    // Assert
    await expect(page.locator('[data-testid="result"]')).toBeVisible()
  })
})
```

---

## Running All Tests

### Quick Test Suite

Run the essential tests:

```bash
# From root directory
pnpm --filter orchestrator test
pnpm --filter storefront test:e2e --project=chromium
```

### Full Test Suite

Run all tests on all browsers:

```bash
# Integration tests
cd apps/orchestrator && pnpm test

# E2E tests on all browsers
cd apps/storefront && pnpm test:e2e
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  integration:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run integration tests
        working-directory: apps/orchestrator
        run: pnpm test

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Install Playwright browsers
        working-directory: apps/storefront
        run: pnpm exec playwright install --with-deps
      
      - name: Run E2E tests
        working-directory: apps/storefront
        run: pnpm test:e2e
      
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: apps/storefront/playwright-report/
          retention-days: 30
```

---

## Test Coverage Goals

### Integration Tests
- ✅ Product sync (Medusa → Payload)
- ✅ Vendor sync (Medusa → Payload)
- ✅ Tenant sync (Medusa → Payload)
- ✅ Content sync (Payload → Medusa)
- ✅ Page sync (Payload → Medusa)
- ✅ Branding sync (Payload → Medusa)
- ✅ Data reconciliation
- ✅ Conflict detection

### E2E Tests
- ✅ Store selection and switching
- ✅ Store branding application
- ✅ B2B quote requests
- ✅ Volume pricing display
- ✅ Vendor dashboard
- ✅ Vendor product management
- ✅ Order fulfillment
- ✅ Commission tracking
- ✅ Payout requests
- ✅ Dynamic CMS pages

---

## Debugging Tests

### Integration Tests

```bash
# Run specific test file
pnpm test medusaToPayload.test.ts

# Run with verbose output
pnpm test --reporter=verbose

# Debug single test
pnpm test -t "should create new product content"
```

### E2E Tests

```bash
# Run in headed mode (see browser)
pnpm test:e2e --headed

# Run in debug mode
pnpm test:e2e:debug

# Run specific test
pnpm test:e2e -g "should display store selection"
```

---

## Best Practices

### Integration Tests
1. Mock external services
2. Test both success and error cases
3. Clean up test data
4. Use descriptive test names
5. Keep tests isolated

### E2E Tests
1. Use data-testid attributes for selectors
2. Wait for elements to be ready
3. Test critical user journeys
4. Keep tests independent
5. Use page objects for reusability

---

## Troubleshooting

### Common Issues

**Integration tests fail to connect to Redis:**
```bash
# Make sure Redis is running
redis-cli ping
# Should return PONG
```

**E2E tests timeout:**
```bash
# Increase timeout in playwright.config.ts
timeout: 60000  // 60 seconds
```

**Playwright browsers not installed:**
```bash
cd apps/storefront
pnpm exec playwright install
```

---

## Next Steps

1. Add more edge case tests
2. Implement visual regression tests
3. Add load/performance tests
4. Set up continuous testing
5. Monitor test flakiness

For production deployment, see [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md).
