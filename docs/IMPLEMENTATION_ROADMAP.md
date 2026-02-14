# CityOS Commerce - Detailed Implementation Roadmap

**Last Updated:** January 2025  
**Current Status:** 50% Complete (Phases 0-3 Done)  
**Estimated Remaining:** 6-8 weeks

---

## Executive Summary

| Phase | Name | Status | Tasks | Est. Time |
|-------|------|--------|-------|-----------|
| 0 | Foundation Infrastructure | DONE | 5/5 | - |
| 1 | Core Data Sync | DONE | 4/4 | - |
| 2 | Storefront Integration | DONE | 3/3 | - |
| 3 | Multi-Tenant | DONE | 3/3 | - |
| **4** | **B2B Features** | TODO | 0/5 | 2 weeks |
| **5** | **Vendor Portal** | TODO | 0/7 | 2.5 weeks |
| **6** | **Admin Customizations** | TODO | 0/4 | 1 week |
| **7** | **Testing & QA** | TODO | 0/4 | 1 week |
| **8** | **Production Ready** | TODO | 0/5 | 1 week |

**Total Remaining: 25 tasks across 5 phases**

---

## Phase 4: B2B Features (Week 1-2)

### 4.1 Quote Request System
**Time:** 3 days | **Priority:** P0 | **Dependencies:** None

#### Backend Tasks
```
apps/backend/
  src/api/store/quotes/
    route.ts              # POST /store/quotes - Create quote request
    [id]/route.ts         # GET /store/quotes/:id - Get quote details
    [id]/accept/route.ts  # POST /store/quotes/:id/accept - Accept quote
  src/api/admin/quotes/
    route.ts              # GET /admin/quotes - List all quotes
    [id]/respond/route.ts # POST /admin/quotes/:id/respond - Send quote response
```

#### Storefront Tasks
```
apps/storefront/src/
  routes/$countryCode/
    quote/
      request.tsx         # Quote request form
      $id.tsx             # Quote detail page
      index.tsx           # Quote history list
  components/quotes/
    quote-form.tsx        # Multi-product quote form
    quote-item.tsx        # Line item component
    quote-status.tsx      # Status badge/tracker
```

#### Acceptance Criteria
- [ ] Customer can add multiple products to quote request
- [ ] Customer can specify quantities and requirements
- [ ] Admin receives notification of new quote
- [ ] Admin can respond with pricing
- [ ] Customer can accept/reject quote
- [ ] Accepted quote converts to order

---

### 4.2 Volume Pricing Display
**Time:** 2 days | **Priority:** P1 | **Dependencies:** volume-pricing module (done)

#### Backend Tasks
```
apps/backend/
  src/api/store/products/[handle]/pricing/route.ts  # GET volume pricing tiers
```

#### Storefront Tasks
```
apps/storefront/src/
  components/product/
    volume-pricing-table.tsx   # Tiered pricing display
    quantity-calculator.tsx    # Price calculator with tiers
  lib/hooks/
    use-volume-pricing.ts      # Hook to fetch/calculate pricing
```

#### Acceptance Criteria
- [ ] Product page shows volume pricing tiers
- [ ] Price updates dynamically as quantity changes
- [ ] Savings percentage displayed per tier
- [ ] Works with variant selection

---

### 4.3 Company Account Registration
**Time:** 3 days | **Priority:** P0 | **Dependencies:** company module (done)

#### Backend Tasks
```
apps/backend/
  src/api/store/company/
    register/route.ts     # POST - Register new company
    route.ts              # GET - Get current company
    users/route.ts        # GET/POST - Manage company users
    addresses/route.ts    # GET/POST - Manage addresses
```

#### Storefront Tasks
```
apps/storefront/src/
  routes/$countryCode/
    register/
      company.tsx         # Company registration form
    company/
      dashboard.tsx       # Company overview
      users.tsx           # User management
      settings.tsx        # Company settings
  components/company/
    registration-form.tsx
    company-header.tsx
    user-invite-modal.tsx
```

#### Acceptance Criteria
- [ ] Company can register with business details
- [ ] Tax ID/VAT validation
- [ ] Admin approval workflow
- [ ] Multiple users per company
- [ ] Company-specific pricing visible after approval

---

### 4.4 B2B Checkout Enhancements
**Time:** 2 days | **Priority:** P1 | **Dependencies:** 4.3

#### Storefront Tasks
```
apps/storefront/src/
  routes/$countryCode/checkout/
    index.tsx             # Enhanced checkout (modify existing)
  components/checkout/
    po-number-field.tsx   # Purchase order number
    net-terms-selector.tsx # Net 30/60/90 payment terms
    approval-workflow.tsx  # Order approval for large purchases
```

#### Acceptance Criteria
- [ ] PO number field for B2B customers
- [ ] Payment terms selection (Net 30/60/90)
- [ ] Credit limit display and enforcement
- [ ] Order approval workflow for amounts > threshold

---

### 4.5 B2B Customer Dashboard
**Time:** 2 days | **Priority:** P2 | **Dependencies:** 4.3

#### Storefront Tasks
```
apps/storefront/src/
  routes/$countryCode/account/
    orders/index.tsx      # Order history with filters
    invoices/index.tsx    # Invoice management
    statements/index.tsx  # Account statements
  components/account/
    invoice-table.tsx
    statement-download.tsx
    reorder-button.tsx
```

#### Acceptance Criteria
- [ ] View all company orders
- [ ] Download invoices as PDF
- [ ] View account statements
- [ ] Quick reorder functionality

---

## Phase 5: Vendor Portal (Week 3-4.5)

### 5.1 Vendor Registration Flow
**Time:** 2 days | **Priority:** P0 | **Dependencies:** vendor module (done)

#### Backend Tasks
```
apps/backend/
  src/api/store/vendor/
    register/route.ts     # POST - Vendor application
    [id]/status/route.ts  # GET - Check application status
```

#### Storefront Tasks
```
apps/storefront/src/
  routes/$countryCode/
    vendor/
      apply.tsx           # Vendor application form
      pending.tsx         # Pending approval page
      rejected.tsx        # Rejection with feedback
```

#### Acceptance Criteria
- [ ] Multi-step vendor application form
- [ ] Business verification fields
- [ ] Document upload (business license, etc.)
- [ ] Admin notification on submission
- [ ] Status tracking page

---

### 5.2 Vendor Dashboard
**Time:** 3 days | **Priority:** P0 | **Dependencies:** 5.1

#### Storefront Tasks
```
apps/storefront/src/
  routes/$countryCode/vendor/
    dashboard.tsx         # Main dashboard
    _layout.tsx           # Vendor portal layout
  components/vendor/
    stats-cards.tsx       # Sales, orders, products stats
    revenue-chart.tsx     # Revenue over time
    recent-orders.tsx     # Latest orders widget
    low-stock-alert.tsx   # Inventory alerts
```

#### Acceptance Criteria
- [ ] Sales overview (today, week, month, all-time)
- [ ] Revenue chart with date range selector
- [ ] Pending orders count
- [ ] Low stock alerts
- [ ] Quick actions (add product, view orders)

---

### 5.3 Vendor Product Management
**Time:** 4 days | **Priority:** P0 | **Dependencies:** 5.2

#### Backend Tasks
```
apps/backend/
  src/api/vendor/products/
    route.ts              # GET/POST - List/Create products
    [id]/route.ts         # GET/PUT/DELETE - Single product
    [id]/variants/route.ts # Manage variants
    [id]/images/route.ts  # Upload images
```

#### Storefront Tasks
```
apps/storefront/src/
  routes/$countryCode/vendor/
    products/
      index.tsx           # Product list
      new.tsx             # Create product
      $id/
        index.tsx         # Edit product
        variants.tsx      # Manage variants
        inventory.tsx     # Stock management
  components/vendor/products/
    product-form.tsx      # Product create/edit form
    variant-editor.tsx    # Variant management
    image-uploader.tsx    # Multi-image upload
    inventory-table.tsx   # Stock levels
```

#### Acceptance Criteria
- [ ] Create products with all fields
- [ ] Upload multiple images
- [ ] Create/edit variants
- [ ] Set pricing per variant
- [ ] Manage inventory levels
- [ ] Bulk inventory update
- [ ] Product status (draft/published)

---

### 5.4 Vendor Order Fulfillment
**Time:** 3 days | **Priority:** P0 | **Dependencies:** 5.2

#### Backend Tasks
```
apps/backend/
  src/api/vendor/orders/
    route.ts              # GET - List vendor orders
    [id]/route.ts         # GET - Order details
    [id]/fulfill/route.ts # POST - Mark fulfilled
    [id]/ship/route.ts    # POST - Add tracking
```

#### Storefront Tasks
```
apps/storefront/src/
  routes/$countryCode/vendor/
    orders/
      index.tsx           # Order list with filters
      $id.tsx             # Order detail + fulfillment
  components/vendor/orders/
    order-table.tsx       # Orders list
    order-detail.tsx      # Full order view
    fulfillment-form.tsx  # Shipping details form
    tracking-input.tsx    # Tracking number entry
```

#### Acceptance Criteria
- [ ] View all orders for vendor's products
- [ ] Filter by status, date, customer
- [ ] View order details and items
- [ ] Mark items as shipped
- [ ] Add tracking information
- [ ] Print packing slips

---

### 5.5 Commission Tracking
**Time:** 2 days | **Priority:** P1 | **Dependencies:** 5.4

#### Storefront Tasks
```
apps/storefront/src/
  routes/$countryCode/vendor/
    earnings/
      index.tsx           # Earnings overview
      commissions.tsx     # Commission breakdown
  components/vendor/earnings/
    earnings-summary.tsx  # Total earnings card
    commission-table.tsx  # Per-order commissions
    commission-chart.tsx  # Earnings over time
```

#### Acceptance Criteria
- [ ] View total earnings
- [ ] See commission per order
- [ ] Commission breakdown by product
- [ ] Historical earnings chart
- [ ] Commission rate visibility

---

### 5.6 Payout Requests
**Time:** 2 days | **Priority:** P1 | **Dependencies:** 5.5

#### Backend Tasks
```
apps/backend/
  src/api/vendor/payouts/
    route.ts              # GET/POST - List/Request payouts
    [id]/route.ts         # GET - Payout details
```

#### Storefront Tasks
```
apps/storefront/src/
  routes/$countryCode/vendor/
    payouts/
      index.tsx           # Payout history
      request.tsx         # Request new payout
      settings.tsx        # Bank details
  components/vendor/payouts/
    payout-balance.tsx    # Available balance
    payout-history.tsx    # Past payouts
    bank-form.tsx         # Banking details form
```

#### Acceptance Criteria
- [ ] View available balance
- [ ] Request payout (min $50)
- [ ] View payout history
- [ ] Manage bank details
- [ ] Payout status tracking

---

### 5.7 Vendor Store Customization
**Time:** 2 days | **Priority:** P2 | **Dependencies:** 5.2

#### Storefront Tasks
```
apps/storefront/src/
  routes/$countryCode/vendor/
    store/
      index.tsx           # Store preview
      branding.tsx        # Logo, colors, banner
      about.tsx           # About page content
  components/vendor/store/
    logo-uploader.tsx
    color-picker.tsx
    banner-editor.tsx
```

#### Acceptance Criteria
- [ ] Upload store logo
- [ ] Set store colors
- [ ] Upload banner image
- [ ] Edit store description
- [ ] Preview store page

---

## Phase 6: Admin Customizations (Week 5)

### 6.1 Vendor Management Widget
**Time:** 2 days | **Priority:** P0 | **Dependencies:** Phase 5

#### Backend Tasks
```
apps/backend/
  src/admin/
    widgets/
      vendor-overview.tsx     # Dashboard widget
      pending-vendors.tsx     # Pending approvals widget
    routes/
      vendors/
        page.tsx              # Full vendor management page
        [id]/page.tsx         # Vendor detail page
```

#### Acceptance Criteria
- [ ] Widget shows vendor stats on dashboard
- [ ] Pending vendor approvals list
- [ ] Approve/reject vendors
- [ ] View vendor details
- [ ] Disable/enable vendors

---

### 6.2 Commission Configuration UI
**Time:** 2 days | **Priority:** P1 | **Dependencies:** 6.1

#### Backend Tasks
```
apps/backend/
  src/admin/
    routes/
      commissions/
        page.tsx              # Commission rules page
        new/page.tsx          # Create new rule
```

#### Acceptance Criteria
- [ ] View all commission rules
- [ ] Create commission rules (flat %, tiered)
- [ ] Assign rules to vendors
- [ ] Category-based commission rules
- [ ] Default commission rate setting

---

### 6.3 Quote Management Page
**Time:** 1.5 days | **Priority:** P1 | **Dependencies:** 4.1

#### Backend Tasks
```
apps/backend/
  src/admin/
    routes/
      quotes/
        page.tsx              # All quotes list
        [id]/page.tsx         # Quote detail + response
```

#### Acceptance Criteria
- [ ] List all quote requests
- [ ] Filter by status, company, date
- [ ] View quote details
- [ ] Respond with custom pricing
- [ ] Convert quote to order

---

### 6.4 Payout Processing
**Time:** 1.5 days | **Priority:** P1 | **Dependencies:** 5.6

#### Backend Tasks
```
apps/backend/
  src/admin/
    routes/
      payouts/
        page.tsx              # Pending payouts
        [id]/page.tsx         # Payout detail
```

#### Acceptance Criteria
- [ ] List pending payout requests
- [ ] Approve/reject payouts
- [ ] Mark payouts as processed
- [ ] View payout history

---

## Phase 7: Testing & QA (Week 6)

### 7.1 Integration Tests - Sync System
**Time:** 2 days | **Priority:** P0

#### Test Files
```
apps/backend/
  tests/integration/
    sync/
      product-sync.test.ts    # Medusa -> Payload product sync
      order-sync.test.ts      # Order sync tests
      vendor-sync.test.ts     # Vendor/tenant sync
    webhooks/
      payload-webhook.test.ts # Incoming webhook tests
      medusa-webhook.test.ts  # Outgoing webhook tests
```

#### Test Scenarios
- [ ] Product created in Medusa syncs to Payload
- [ ] Product updated in Medusa updates Payload
- [ ] Order placed syncs to Payload
- [ ] Vendor approved creates tenant
- [ ] Webhook retry on failure
- [ ] Reconciliation fixes mismatches

---

### 7.2 Integration Tests - B2B Features
**Time:** 1 day | **Priority:** P1

#### Test Files
```
apps/backend/
  tests/integration/
    b2b/
      company-registration.test.ts
      quote-workflow.test.ts
      volume-pricing.test.ts
```

#### Test Scenarios
- [ ] Company registration workflow
- [ ] Company approval updates status
- [ ] Quote request creates quote
- [ ] Quote response sends notification
- [ ] Volume pricing applies correctly

---

### 7.3 E2E Tests - Customer Flows
**Time:** 1.5 days | **Priority:** P0

#### Test Files
```
apps/storefront/
  tests/e2e/
    customer/
      registration.spec.ts
      checkout.spec.ts
      account.spec.ts
    b2b/
      company-signup.spec.ts
      quote-request.spec.ts
```

#### Test Scenarios
- [ ] Customer registration
- [ ] Add to cart + checkout
- [ ] Order history
- [ ] Company registration
- [ ] Quote request + acceptance

---

### 7.4 E2E Tests - Vendor Flows
**Time:** 1.5 days | **Priority:** P1

#### Test Files
```
apps/storefront/
  tests/e2e/
    vendor/
      registration.spec.ts
      product-crud.spec.ts
      order-fulfillment.spec.ts
      payout-request.spec.ts
```

#### Test Scenarios
- [ ] Vendor application
- [ ] Create product
- [ ] Update inventory
- [ ] Fulfill order
- [ ] Request payout

---

## Phase 8: Production Ready (Week 7)

### 8.1 Caching Strategy
**Time:** 2 days | **Priority:** P0

#### Implementation
```
apps/backend/
  src/services/
    cache.service.ts          # Redis cache service
  src/utils/
    cache-keys.ts             # Cache key constants
    cache-middleware.ts       # Route caching middleware

apps/storefront/
  src/lib/
    cache.ts                  # Client-side cache utilities
```

#### Cache Layers
- [ ] Redis for API responses
- [ ] Product data cache (5 min TTL)
- [ ] Tenant/branding cache (1 hour TTL)
- [ ] Storefront SWR caching
- [ ] CDN for static assets

---

### 8.2 Error Tracking & Monitoring
**Time:** 2 days | **Priority:** P0

#### Implementation
```
apps/backend/
  src/utils/
    sentry.ts                 # Sentry initialization
    logger.ts                 # Structured logging
  src/subscribers/
    error-tracking.ts         # Error event subscriber

apps/storefront/
  src/lib/
    sentry.ts                 # Client-side Sentry
    analytics.ts              # Event tracking
```

#### Monitoring Setup
- [ ] Sentry error tracking (backend + frontend)
- [ ] Structured logging (JSON)
- [ ] Request tracing
- [ ] Performance monitoring
- [ ] Custom metrics (sync success rate, etc.)

---

### 8.3 Alerting System
**Time:** 1 day | **Priority:** P1

#### Implementation
```
apps/backend/
  src/services/
    alerting.service.ts       # Alert service
  src/subscribers/
    sync-failure-alert.ts     # Sync failure alerts
    webhook-failure-alert.ts  # Webhook failure alerts
```

#### Alerts
- [ ] Sync job failures
- [ ] Webhook delivery failures
- [ ] High error rate
- [ ] API latency threshold
- [ ] Queue backlog

---

### 8.4 Security Hardening
**Time:** 1 day | **Priority:** P0

#### Tasks
- [ ] Rate limiting on all endpoints
- [ ] Input validation (Zod schemas)
- [ ] CORS configuration
- [ ] Webhook signature verification
- [ ] API key rotation policy
- [ ] SQL injection prevention audit
- [ ] XSS prevention audit

---

### 8.5 Performance Optimization
**Time:** 1 day | **Priority:** P1

#### Tasks
- [ ] Database query optimization
- [ ] Index review and creation
- [ ] N+1 query elimination
- [ ] Response compression
- [ ] Image optimization pipeline
- [ ] Lazy loading implementation

---

## Appendix A: File Structure Summary

### New Files by Phase

**Phase 4 (B2B):** ~25 files
**Phase 5 (Vendor):** ~40 files  
**Phase 6 (Admin):** ~15 files
**Phase 7 (Testing):** ~20 files
**Phase 8 (Production):** ~10 files

**Total New Files:** ~110 files

---

## Appendix B: Dependencies

### External Packages Needed

```bash
# Backend
pnpm add ioredis bull @sentry/node winston

# Storefront
pnpm add @sentry/react recharts @tanstack/react-query

# Testing
pnpm add -D vitest @playwright/test msw
```

---

## Appendix C: Environment Variables

### New Variables Required

```env
# Caching
REDIS_URL=redis://localhost:6379

# Monitoring
SENTRY_DSN=https://xxx@sentry.io/xxx
LOG_LEVEL=info

# Alerting
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx
ALERT_EMAIL=alerts@example.com

# Security
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60000
```

---

## Appendix D: Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Sync failures cause data inconsistency | High | Medium | Reconciliation job, alerts |
| Vendor portal security breach | High | Low | Auth audit, rate limiting |
| Performance degradation at scale | Medium | Medium | Caching, optimization |
| B2B feature scope creep | Medium | High | Strict acceptance criteria |
| Testing delays | Low | Medium | Parallel testing tracks |

---

## Appendix E: Success Metrics

### Phase Completion Criteria

| Phase | Criteria |
|-------|----------|
| 4 | All B2B features functional, 5 test scenarios passing |
| 5 | Vendor can complete full product lifecycle |
| 6 | Admin can manage vendors, quotes, payouts |
| 7 | >80% test coverage, all E2E tests passing |
| 8 | <100ms P95 latency, <0.1% error rate |

---

**Document Owner:** Engineering Team  
**Review Frequency:** Weekly  
**Next Review:** End of Phase 4
