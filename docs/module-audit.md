# Dakkah CityOS Commerce Platform — Comprehensive Backend Module Audit

**Date:** 2026-02-16
**Platform:** Medusa.js v2 (custom commerce platform)
**Scope:** Complete audit of all 59 custom modules under `apps/backend/src/modules/`, including architecture analysis, duplicate/overlap investigation, stub module implementation plans, facade route documentation, and Medusa upgrade risk assessment.

---

## 1. Architecture Overview

### Code Separation from Medusa Core

All custom code lives entirely within `apps/backend/src/` and is **completely separate** from `node_modules/@medusajs/`. There are:

- **No patches** to Medusa packages
- **No forks** of Medusa source code
- **No modifications** to any file inside `node_modules/@medusajs/`

### Extension Pattern

Every custom module follows Medusa v2's **official extension pattern**:

1. **Service class** extends `MedusaService({})` from `@medusajs/framework/utils`, passing in custom data models
2. **Data models** use Medusa DML (`model.define()` from `@medusajs/framework/utils`)
3. **Module registration** via `Module()` from `@medusajs/framework/utils` in each module's `index.ts`
4. **Config registration** in `medusa-config.ts` using `resolve: "./src/modules/..."` with a unique `key`
5. **Links to Medusa core** through `defineLink()` in `src/links/` — connecting custom entities to Medusa's Product, Customer, Order, Cart, etc.

```
apps/backend/src/modules/<module-name>/
├── index.ts          # Module() registration
├── service.ts        # extends MedusaService({ Model1, Model2 })
├── models/
│   ├── model1.ts     # model.define("model1", { ... })
│   └── model2.ts
└── migrations/
    └── Migration*.ts
```

### Upgrade Safety

Future Medusa upgrades will **NOT break custom modules** unless one of these changes:

| Medusa API Surface | Likelihood of Breaking Change |
|---|---|
| `MedusaService` base class API | **Medium** — has evolved across v2 minor releases; 59 modules depend on it |
| `defineLink()` API | **Medium** — 27 link files across the project; API has changed during v2 lifecycle |
| `model.define()` DML API | **Medium** — 59 modules use DML; new modifiers added across releases |
| Event names used by subscribers | **Medium** — may change between minor/major versions; 34 subscribers affected |
| `medusa-config.ts` schema | Low |
| Admin UI extension points | Medium — 134 admin files |
| API route conventions | Low (stable) |

**Mitigation strategy:**
- Pin Medusa version in package.json (exact version, no ranges)
- Run integration tests before upgrading
- Review Medusa changelog and migration guides for each minor version
- With 59 modules, budget 1-2 days for testing each Medusa minor upgrade

---

## 2. Custom Backend Code Inventory

| Category | Count | Location |
|---|---|---|
| Custom module directories | 59 | `apps/backend/src/modules/` |
| API route files (total) | 486 | `apps/backend/src/api/` |
| — Admin routes | 237 | `apps/backend/src/api/admin/` |
| — Store routes | 163 | `apps/backend/src/api/store/` |
| — Vendor routes | 68 | `apps/backend/src/api/vendor/` |
| — Other routes (platform, webhooks, health) | 18 | `apps/backend/src/api/{platform,webhooks,health}/` |
| Subscriber files | 34 | `apps/backend/src/subscribers/` |
| Workflow files | 30 | `apps/backend/src/workflows/` |
| Link files (defineLink) | 27 | `apps/backend/src/links/` |
| Job files (scheduled tasks) | 17 | `apps/backend/src/jobs/` |
| Script files (seed/setup) | 29 | `apps/backend/src/scripts/` |
| Admin UI files (widgets, routes, components) | 134 | `apps/backend/src/admin/` |
| Integration directories | 8 | `apps/backend/src/integrations/` |
| Workers | 1 | `apps/backend/src/workers/temporal-worker.ts` |

### Integration Directories

| Integration | Purpose |
|---|---|
| `cms-hierarchy-sync` | Sync CMS content with node hierarchy |
| `erpnext` | ERPNext ERP integration |
| `fleetbase` | Fleet/logistics management |
| `node-hierarchy-sync` | Node hierarchy synchronization |
| `orchestrator` | Payload CMS orchestration |
| `payload-sync` | Payload CMS data sync |
| `stripe-gateway` | Stripe payment gateway |
| `waltid` | Walt.id identity/credentials |

---

## 3. Complete Module Classification Matrix

### Updated Classifications (Post-Deep-Analysis)

All modules previously classified as DUPLICATE or HYBRID-OVERLAP have been reclassified to EXTENSION after deep analysis (see sections 6 and 7 for full justification).

**Final count: 0 modules requiring immediate migration. All 59 modules justified.**

**Note on residual overlaps:** While none of these modules are safe to remove/replace today, some have partial functional overlap with evolving Medusa capabilities. As Medusa's Analytics, Translation, and other modules mature, optional consolidation paths may emerge. Specifically:
- `analytics.trackEvent` could optionally *also* forward events to Medusa Analytics for PostHog integration (additive, not replacing)
- `i18n` could work alongside Medusa Translation when it exits experimental status (our module for UI strings, Medusa's for entity-field translations)
- `notification-preferences.shouldNotify` could integrate with Medusa Notification subscriber pipelines

These are enhancement opportunities, not migration requirements.

### Category A — EXTENSIONS (Reclassified from DUPLICATE)

These were originally flagged as potential duplicates of Medusa built-in modules. Deep analysis proves they are NOT duplicates — they serve fundamentally different purposes from their Medusa counterparts.

| Custom Module | Original Classification | New Classification | Medusa Counterpart | Why NOT a Duplicate |
|---|---|---|---|---|
| `analytics` (3 models, 9 methods, 5 API routes) | DUPLICATE | **EXTENSION** | Medusa Analytics (v2.8.3+) | Medusa Analytics is event forwarding only (track/identify → PostHog). Our module is a self-contained BI system with Report/Dashboard models, sales metrics, conversion funnels. 80%+ has no Medusa equivalent. |
| `i18n` (1 model, 5 methods, 2 API routes) | DUPLICATE | **EXTENSION** | Medusa Translation (v2.12.3+, experimental) | Medusa Translation is entity-field-level (product title in French). Our module is a tenant-scoped key-value store for UI strings with namespace support and draft/published workflow. Complementary, not duplicative. |
| `notification-preferences` (1 model, 10 methods, 2+ API routes) | DUPLICATE | **EXTENSION** | Medusa Notification module | Medusa Notification = sending infrastructure (SendGrid). Our module = preference/consent management (opt-in/out, frequency control). Medusa docs explicitly recommend this custom approach. |

### Category A — EXTENSIONS (Reclassified from HYBRID-OVERLAP)

These were originally flagged as having partial overlap with Medusa core. Gap analysis proves all are genuine extensions with unique capabilities.

| Custom Module | Original Classification | New Classification | Medusa Overlap Area | Why EXTENSION |
|---|---|---|---|---|
| `cart-extension` (1 model, 14 methods, 2 API routes) | HYBRID | **EXTENSION** | Medusa Cart (metadata JSON field) | CartMetadata provides typed, queryable fields (gift_wrap, delivery_instructions, preferred_delivery_date) vs unstructured JSON. Dedicated API surface. No migration benefit. |
| `promotion-ext` (4 models, 8 methods, 1 API route) | HYBRID | **EXTENSION** | Medusa Promotion + Gift Cards | 3/4 models unique (Referral, ProductBundle, CustomerSegment). GiftCardExt adds tenant scoping, sender/recipient info beyond Medusa gift cards. |
| `shipping-extension` (2 models, 9 methods, 2 API routes) | HYBRID | **EXTENSION** | Medusa Fulfillment | Centralized carrier config + custom rate rules per zone/weight vs Medusa's per-provider plugin approach. Different architecture. |
| `tax-config` (2 models, 11 methods, 1 API route) | HYBRID | **EXTENSION** | Medusa Tax | TaxRule: tenant-scoped with product/category targeting (Medusa Tax = region-based only). TaxExemption: customer-level workflows with document upload (no Medusa equivalent). |
| `inventory-extension` (3 models, 7 methods, 2 API routes) | HYBRID | **EXTENSION** | Medusa Inventory | ReservationHold (time-based expiry), StockAlert (low-stock notifications), WarehouseTransfer (inter-warehouse moves) — all 3 models add capabilities beyond Medusa Inventory. |

### Category B — EXTENSIONS (Always classified as EXTENSION)

| Custom Module | Extends | What It Adds | Status |
|---|---|---|---|
| `cityosStore` (key: "cityosStore", 1 model, 10 methods) | Medusa Store | Multi-tenant store entity with tenant_id, subdomain, custom_domain, theme_config, brand_colors. Completely separate from Medusa's built-in Store module. | KEEP |
| `volume-pricing` (3 models, 3 methods) | Medusa Pricing | Tiered/volume pricing rules targeting products/variants | KEEP |
| `vendor` (7 models, 15 methods) | None (custom marketplace) | Full vendor management, VendorProduct, VendorOrder, vendor profiles, order splitting | KEEP |
| `commission` (3 models, 7 methods) | None | Commission rules, calculations per vendor/tenant | KEEP |
| `payout` (3 models, 10 methods) | None | Vendor payout management, payout schedules | KEEP |
| `subscription` (6 models, 17 methods) | None | Recurring subscriptions, billing cycles, subscription items | KEEP |
| `company` (8 models, 15 methods) | None | B2B: companies, purchase orders, buyer/seller relationships | KEEP |
| `quote` (2 models) | Medusa Draft Order (partial) | B2B quote/RFQ workflow with negotiation, approval chains. More complex than Draft Order. | KEEP |
| `review` (1 model, 10 methods) | None | Product/service reviews and ratings | KEEP |
| `digital-product` (3 models, 9 methods) | None | Digital asset delivery, download management | KEEP |
| `invoice` (2 models, 10 methods) | None | Invoice generation and management | KEEP |
| `dispute` (2 models, 12 methods) | None | Order/transaction dispute resolution | KEEP |
| `loyalty` (3 models, 8 methods) | None | Points programs, loyalty accounts | KEEP |
| `wishlist` (2 models, 7 methods) | RSC-Labs plugin (disabled) | Wishlist with items. Custom implementation works; plugin can be revisited. | KEEP |
| `social-commerce` (6 models, 6 methods) | None | Live shopping, social selling features | KEEP |
| `membership` (6 models, 4 methods) | None | Membership tiers, benefits | KEEP |

### Category C — VERTICAL/DOMAIN-SPECIFIC (unique, KEEP)

27 vertical modules, each with domain-specific models and business logic. No Medusa equivalents exist for any of these.

**Most mature (6+ models, 7+ methods):**

| Module | Models | Methods | Domain |
|---|---|---|---|
| `booking` | 6 | 19 | Appointment/service booking |
| `healthcare` | 8 | 8 | Healthcare services |
| `restaurant` | 8 | 7 | Restaurant/food ordering |
| `travel` | 8 | 8 | Travel packages |
| `event-ticketing` | 7 | 8 | Event tickets |
| `freelance` | 7 | 8 | Freelance marketplace |
| `grocery` | 5 | 8 | Grocery delivery |
| `automotive` | 6 | 8 | Automotive parts/services |
| `fitness` | 6 | 8 | Fitness/gym services |
| `financial-product` | 6 | 8 | Financial products |
| `advertising` | 6 | 9 | Ad management |
| `parking` | 5 | 8 | Parking services |
| `utilities` | 5 | 8 | Utility services |
| `legal` | 5 | 7 | Legal services |
| `government` | 6 | 7 | Government services |
| `crowdfunding` | 6 | 7 | Crowdfunding campaigns |

**Standard (5-7 models, 4-7 methods):**

| Module | Models | Methods | Domain |
|---|---|---|---|
| `auction` | 6 | 4 | Auction listings |
| `classified` | 6 | 6 | Classified ads |
| `charity` | 5 | 5 | Charitable donations |
| `education` | 7 | 5 | Online courses |
| `real-estate` | 7 | 5 | Property listings |
| `pet-service` | 5 | 7 | Pet services |
| `affiliate` | 5 | 7 | Affiliate marketing |
| `warranty` | 5 | 7 | Product warranties |
| `rental` | 6 | 4 | Equipment/property rentals |
| `events` | 2 | 4 | Event outbox (key: "eventOutbox") |
| `membership` | 6 | 4 | Membership programs |

### Category D — INFRASTRUCTURE / CityOS (unique, KEEP)

| Module | Models | Methods | Purpose |
|---|---|---|---|
| `tenant` | 8 | 22 | Multi-tenant isolation, tenant profiles, onboarding |
| `node` | 2 | 9 | 5-level hierarchy (CITY > DISTRICT > ZONE > FACILITY > ASSET) |
| `governance` | 2 | 10 | Policy inheritance, approval chains |
| `persona` | 3 | 8 | 6-axis persona system |
| `channel` | 2 | 11 | Communication channels per tenant |
| `region-zone` | 2 | 8 | Residency zones, geographic scoping |
| `audit` | 2 | 7 | Audit trail, compliance logging |
| `cms-content` | 2 | 7 | CMS pages and navigation (Payload CMS bridge) |

### Category E — STUB MODULES (Need Implementation, NOT Removal)

| Module | Models | Methods | Migrations | index.ts | API Routes | Status |
|---|---|---|---|---|---|---|
| `wallet` | 0 | 6 | 0 | ❌ | 2 (store, vendor) | Needs implementation |
| `trade-in` | 0 | 6 | 0 | ❌ | 4 (admin×2, store×2) | Needs implementation |
| `insurance` | 0 | 5 | 0 | ❌ | 4 (admin×2, store×2, vendor) | Needs implementation |

These modules have **service logic already written** but lack data models, migrations, and module registration. They need to be completed, not removed. See Section 5 for implementation plans.

---

## 4. Config Notes

- `meilisearch` is referenced in `medusa-config.ts` (conditional on `MEILISEARCH_HOST` env var) but has no module directory at `src/modules/meilisearch`. This is acceptable since it is conditionally loaded and `MEILISEARCH_HOST` is not set.
- All 56 non-stub modules (59 total minus 3 stubs) are registered in `medusa-config.ts` with `resolve: "./src/modules/..."`.

---

## 5. Stub Module Implementation Plan

### General Implementation Steps (applies to all 3 stubs)

1. Create data models using Medusa DML (`model.define()`)
2. Create migration files
3. Create `index.ts` with `Module()` registration
4. Register in `medusa-config.ts`
5. Add `defineLink()` connections to Medusa core entities (Customer, Product, Order)
6. Verify existing API routes work with new models
7. Test storefront pages that reference these modules

### 5.1 Wallet Implementation Plan

**Current state:** Service has `createWallet`, `creditWallet`, `debitWallet`, `getBalance`, `freezeWallet`, `getTransactionHistory` — all referencing models that don't exist yet (`Wallet`, `WalletTransaction`).

**Storefront dependencies:**
- `WalletPage` component, wallet route
- Account/vendor layout links
- `use-payments` hooks calling `/store/wallet/balance` and `/store/wallet/transactions`
- `manage/wallet` CRUD page
- Module registry entry

**Medusa built-in:** NO native wallet module. Store Credits & Gift Cards announced for Medusa Cloud (early access, to be open-sourced). Community plugin `@igorppbr/medusa-v2-b2b-credit` exists but is B2B-focused. Best approach: build as custom module (Medusa's recommended approach for wallets).

**Models needed:**

```typescript
// models/wallet.ts
const Wallet = model.define("wallet", {
  id: model.id().primaryKey(),
  customer_id: model.text(),
  currency: model.text().default("usd"),
  balance: model.bigNumber().default(0),
  status: model.enum(["active", "frozen", "closed"]).default("active"),
  freeze_reason: model.text().nullable(),
  frozen_at: model.dateTime().nullable(),
  metadata: model.json().nullable(),
})

// models/wallet-transaction.ts
const WalletTransaction = model.define("wallet_transaction", {
  id: model.id().primaryKey(),
  wallet_id: model.text(),
  type: model.enum(["credit", "debit"]),
  amount: model.bigNumber(),
  balance_after: model.bigNumber(),
  description: model.text().nullable(),
  reference_id: model.text().nullable(),
  metadata: model.json().nullable(),
})
```

**Links needed:**
```typescript
// src/links/customer-wallet.ts
defineLink(CustomerModule.linkable.customer, WalletModule.linkable.wallet)
```

**Unique constraints:** Add `.unique()` on `[customer_id, currency]` to prevent duplicate wallets per customer per currency.

**Transactional integrity (critical):**
- `creditWallet` and `debitWallet` involve read-then-write on balance — must handle race conditions
- Options: (a) Use database-level row locking (`SELECT ... FOR UPDATE`) in the service, (b) Use Medusa's `@MedusaContext()` with `transactionManager`, or (c) Use optimistic concurrency with a `version` column
- Recommended: Add a `version` field to Wallet model and implement optimistic locking to prevent double-spend

**Integration hooks/subscribers needed:**
- `order.placed` → auto-debit wallet if wallet payment selected
- `payment.refunded` → auto-credit wallet with refund amount
- `order.cancelled` → restore wallet balance
- `customer.created` → optionally auto-create wallet

**Optional enhancement:** Create as Medusa Payment Provider for checkout integration (pay with wallet balance at checkout).

**Effort:** Medium (2-3 days for models/registration, +1-2 days for transactional safety and subscribers)

### 5.2 Trade-In Implementation Plan

**Current state:** Service has `submitTradeIn`, `evaluateTradeIn`, `approveTradeIn`, `rejectTradeIn`, `completeTradeIn`, `getCustomerTradeIns`. Existing workflow `trade-in-evaluation.ts` has 4 steps (submit, inspect, price, generate-offer) — needs to reference actual models.

**Storefront dependencies:**
- Vendor layout link
- `manage/trade-in` CRUD page
- `trade-in/$id` detail page
- `use-commerce-extras` hook

**Medusa built-in:** NO trade-in module or plugin. Medusa has Return/Exchange flows that can serve as foundation but don't cover device grading, valuation, or credit issuance. Must build as custom module.

**Models needed:**

```typescript
// models/trade-in-request.ts
const TradeInRequest = model.define("trade_in_request", {
  id: model.id().primaryKey(),
  customer_id: model.text(),
  product_id: model.text(),
  condition: model.enum(["excellent", "good", "fair", "poor"]),
  description: model.text(),
  photos: model.json().default([]),
  status: model.enum(["submitted", "evaluated", "approved", "rejected", "completed"]).default("submitted"),
  trade_in_number: model.text(),
  estimated_value: model.bigNumber().nullable(),
  final_value: model.bigNumber().nullable(),
  credit_amount: model.bigNumber().nullable(),
  evaluation_notes: model.text().nullable(),
  rejection_reason: model.text().nullable(),
  submitted_at: model.dateTime().nullable(),
  evaluated_at: model.dateTime().nullable(),
  approved_at: model.dateTime().nullable(),
  rejected_at: model.dateTime().nullable(),
  completed_at: model.dateTime().nullable(),
  metadata: model.json().nullable(),
})

// models/trade-in-offer.ts
const TradeInOffer = model.define("trade_in_offer", {
  id: model.id().primaryKey(),
  request_id: model.text(),
  offer_amount: model.bigNumber(),
  credit_type: model.enum(["store_credit", "wallet", "refund"]).default("store_credit"),
  expires_at: model.dateTime().nullable(),
  status: model.enum(["pending", "accepted", "rejected", "expired"]).default("pending"),
  metadata: model.json().nullable(),
})
```

**Links needed:**
```typescript
// src/links/customer-trade-in.ts
defineLink(CustomerModule.linkable.customer, TradeInModule.linkable.tradeInRequest)
// src/links/product-trade-in.ts
defineLink(ProductModule.linkable.product, TradeInModule.linkable.tradeInRequest)
```

**Unique constraints:** Add unique index on `trade_in_number` to prevent duplicate request numbers.

**Existing workflow:** `trade-in-evaluation.ts` with 4 steps (submit, inspect, price, generate-offer) — update steps to create/update actual TradeInRequest and TradeInOffer records.

**Integration hooks/subscribers needed:**
- `trade-in.submitted` → trigger evaluation workflow
- `trade-in.approved` → create wallet credit or store credit for customer
- `trade-in.completed` → update inventory (if applicable), notify customer
- Link to wallet module: approved trade-in value → wallet credit

**Effort:** Medium (2-3 days for models/registration, +1 day for workflow integration)

### 5.3 Insurance Implementation Plan

**Current state:** Service has `createPolicy`, `fileInsuranceClaim`, `processInsuranceClaim`, `cancelPolicy`, `getPolicyDetails`.

**Storefront dependencies:**
- Vendor layout link
- `manage/insurance` CRUD page
- `insurance/$id` detail page

**Medusa built-in:** NO insurance module or plugin. Warranty module exists but is separate (already implemented at `apps/backend/src/modules/warranty`). Insurance covers post-purchase protection policies with claims adjudication — a unique domain distinct from warranties.

**Models needed:**

```typescript
// models/insurance-policy.ts
const InsurancePolicy = model.define("insurance_policy", {
  id: model.id().primaryKey(),
  customer_id: model.text(),
  product_id: model.text(),
  order_id: model.text().nullable(),
  plan_type: model.text(),
  coverage_amount: model.bigNumber(),
  premium: model.bigNumber(),
  start_date: model.dateTime(),
  end_date: model.dateTime(),
  status: model.enum(["active", "expired", "cancelled", "claimed"]).default("active"),
  policy_number: model.text(),
  cancellation_reason: model.text().nullable(),
  cancelled_at: model.dateTime().nullable(),
  metadata: model.json().nullable(),
})

// models/insurance-claim.ts
const InsuranceClaim = model.define("insurance_claim", {
  id: model.id().primaryKey(),
  policy_id: model.text(),
  claim_type: model.text().nullable(),
  claim_amount: model.bigNumber(),
  description: model.text(),
  evidence: model.json().nullable(),
  status: model.enum(["pending", "under_review", "approved", "rejected"]).default("pending"),
  claim_number: model.text(),
  decision_notes: model.text().nullable(),
  payout_amount: model.bigNumber().nullable(),
  filed_at: model.dateTime().nullable(),
  decided_at: model.dateTime().nullable(),
  metadata: model.json().nullable(),
})
```

**Links needed:**
```typescript
// src/links/customer-insurance.ts
defineLink(CustomerModule.linkable.customer, InsuranceModule.linkable.insurancePolicy)
// src/links/order-insurance.ts
defineLink(OrderModule.linkable.order, InsuranceModule.linkable.insurancePolicy)
```

**Unique constraints:** Add unique index on `policy_number` and `claim_number` to prevent duplicates.

**Integration hooks/subscribers needed:**
- `order.placed` → auto-create insurance policy if insurance product was purchased
- `insurance.claim_filed` → notify admin for review, create audit trail entry
- `insurance.claim_approved` → trigger payout via payment module or wallet credit
- `insurance.policy_expired` → notify customer, update status

**Effort:** Medium (2-3 days for models/registration, +1 day for subscriber integration)

---

## 6. Duplicate Module Deep Analysis

This section provides detailed justification for why each module originally classified as DUPLICATE is **NOT a safe duplicate** and should be reclassified as EXTENSION.

### 6.1 analytics → NOT A SAFE DUPLICATE

**Custom module details:**
- **3 models:** AnalyticsEvent (tenant_id, event_type, entity tracking, revenue, session_id), Report (tenant-specific, report_type, date_range_type, schedule, filters), Dashboard (tenant-specific, widgets JSON, layout, role_access, is_default)
- **9 custom methods:** trackEvent, getEventCounts (date-filtered), getSalesMetrics (revenue/orders/AOV), getTopProducts, trackPageView, getConversionFunnel (5-step funnel analysis), generateDashboardMetrics (30-day aggregation with unique sessions), generateReport, getDashboard
- **5 API routes**, registered in `medusa-config.ts`

**Medusa Analytics (v2.8.3+):**
- Provides only `track()` and `identify()` methods
- Sends events to external providers (PostHog or local file)
- **NO built-in event storage** — events are forwarded, not persisted
- **NO reporting or dashboard models**
- **NO sales metrics aggregation**
- **NO tenant-scoping**
- **NO conversion funnel analysis**

**Gap analysis:**

| Capability | Our Module | Medusa Analytics |
|---|---|---|
| Event tracking | ✅ trackEvent with tenant_id, entity tracking | ✅ track() — forward only |
| Persistent event storage | ✅ AnalyticsEvent model in DB | ❌ Events forwarded to external provider |
| Sales metrics (revenue, AOV) | ✅ getSalesMetrics | ❌ Not available |
| Top products ranking | ✅ getTopProducts | ❌ Not available |
| Conversion funnel | ✅ getConversionFunnel (5-step) | ❌ Not available |
| Dashboard metrics | ✅ generateDashboardMetrics | ❌ Not available |
| Report model (BI) | ✅ Report with scheduling, filters | ❌ No equivalent |
| Dashboard model | ✅ Dashboard with widgets, role_access | ❌ No equivalent |
| Tenant scoping | ✅ All queries scoped by tenant_id | ❌ No concept of tenant |

**VERDICT:** Medusa Analytics is an **event forwarding pipeline**. Our module is a **self-contained BI/reporting system** with persistent storage. The Report and Dashboard models have NO Medusa equivalent. At best, `trackEvent` could optionally forward to Medusa Analytics, but 80%+ of the module must stay.

**Reclassification: DUPLICATE → EXTENSION**

### 6.2 i18n → NOT A SAFE DUPLICATE

**Custom module details:**
- **1 model:** Translation with fields: tenant_id, locale, namespace, key, value, context, status (draft/published/archived), metadata
- **Unique index** on `[tenant_id, locale, namespace, key]`
- **5 methods:** getTranslations (tenant-scoped, namespace-aware, status-filtered), getTranslation, upsertTranslation, bulkUpsert, getSupportedLocales
- **2 API routes**, registered in `medusa-config.ts`

**Medusa Translation (v2.12.3+, EXPERIMENTAL):**
- Supports product entity translations with `.translatable()` modifier
- Admin UI for configuration
- Locale-based API queries with fallback
- v2.13+ supports custom model translations via `.translatable()`

**Critical differences:**

| Capability | Our i18n Module | Medusa Translation |
|---|---|---|
| Purpose | UI string key-value store | Entity-field-level translation |
| Tenant scoping | ✅ tenant_id on every record | ❌ No tenant concept |
| Namespace support | ✅ namespace field (common, checkout, etc.) | ❌ No namespace concept |
| Draft/published workflow | ✅ status: draft/published/archived | ❌ No workflow |
| Arbitrary key-value | ✅ Any key → value pair | ❌ Tied to entity fields |
| Bulk upsert | ✅ bulkUpsert method | ❌ Not available |
| Example use case | `getTranslation("tenant1", "ar", "checkout.pay_now")` | Product title in Arabic via `.translatable()` |

**VERDICT:** These modules serve **fundamentally different purposes**. Our i18n is a tenant-aware translation key-value store for UI strings, labels, and custom content. Medusa Translation is entity-field-level translation (e.g., product title in French). **Both are needed — they complement each other.** Consider using BOTH: Medusa Translation for product/entity data + custom i18n for UI strings and tenant-specific labels.

**Reclassification: DUPLICATE → EXTENSION**

### 6.3 notification-preferences → NOT A DUPLICATE AT ALL

**Custom module details:**
- **1 model:** NotificationPreference with fields: customer_id, tenant_id, channel (email/sms/push/in_app), event_type, enabled, frequency (immediate/daily_digest/weekly_digest), metadata
- **10 methods:** getByCustomer, updatePreference (upsert), getEnabledChannelsForEvent, initializeDefaults (9 default prefs), bulkUpdate, getEffectivePreferences, shouldNotify, bulkOptOut, updateChannelPreference, updateCategoryPreference
- **2+ API routes**, registered in `medusa-config.ts`

**Medusa Notification module:**
- Handles **SENDING** notifications via providers (SendGrid, Twilio, etc.)
- Configured in `medusa-config.ts` with SendGrid provider
- **NO built-in per-customer preference storage**
- **NO opt-in/opt-out management**
- **NO frequency control** (immediate vs digest)
- **NO channel preference** (which channels a customer wants)

**The relationship:**

```
Customer action triggers event
        ↓
notification-preferences module: shouldNotify(customer, channel, category)?
        ↓ (if yes)
Medusa Notification module: send via SendGrid/Twilio
```

**Medusa's own documentation explicitly recommends** building a custom preference module for notification opt-in/opt-out management. This is exactly what we have.

**VERDICT:** Medusa Notification = **sending infrastructure**. Our module = **preference/consent management**. They are complementary layers, not competing implementations. Medusa docs recommend exactly this approach.

**Reclassification: DUPLICATE → EXTENSION**

---

## 7. Hybrid-Overlap Gap Analysis

This section provides detailed justification for why each module originally classified as HYBRID-OVERLAP should be reclassified as EXTENSION.

### 7.1 cart-extension

**Custom module:** 1 model (CartMetadata), 14 methods, 2 API routes

**CartMetadata model fields:**
- `cart_id`, `tenant_id`, `gift_wrap` (boolean), `gift_message` (text), `delivery_instructions` (text), `preferred_delivery_date` (datetime), `special_handling` (text), `source_channel` (text), `metadata` (JSON)

**Dedicated methods:** `getByCartId`, `setGiftWrap`, `setDeliveryInstructions`, `calculateCartTotals`, `applyBulkDiscount`, `validateCartItems`, `getCartWithExtensions`, `applyGiftWrap`, `calculateCartSavings`, `validateCartForCheckout`, `calculateCartInsights`, `applyBundleDiscounts`, `validateCartLimits`, `mergeGuestCart`

**Medusa Cart overlap:** Cart has a `metadata` JSON field, but it is:
- **Unstructured** — no schema validation
- **Not queryable** — cannot filter carts by `gift_wrap = true`
- **No dedicated API surface** — no `setGiftWrap` endpoint
- **No type safety** — any JSON goes in

**VERDICT: KEEP as EXTENSION.** Could theoretically use `Cart.metadata` but loses type safety, queryability, and dedicated API surface. No migration benefit. The 14 methods provide substantial business logic (bulk discounts, cart insights, checkout validation) that would need to exist regardless.

### 7.2 promotion-ext

**Custom module:** 4 models, 8 methods, 1 API route

| Model | Medusa Equivalent? | Details |
|---|---|---|
| `GiftCardExt` | Partial (Medusa Gift Cards) | Adds tenant_id, sender/recipient info, delivery tracking, expiry. Medusa gift cards lack tenant scoping and messaging. |
| `Referral` | ❌ None | Referral codes, reward tracking, status workflow |
| `ProductBundle` | ❌ None | Bundle types (fixed/BOGO/mix-and-match), discount rules |
| `CustomerSegment` | ❌ None | Manual/dynamic segmentation with rules engine |

**VERDICT: KEEP as EXTENSION.** 3 of 4 models are completely unique. GiftCardExt extends beyond Medusa's native gift cards with tenant scoping and sender/recipient messaging.

### 7.3 shipping-extension

**Custom module:** 2 models (ShippingRate, CarrierConfig), 9 methods, 2 API routes

- **ShippingRate:** Custom rate rules per zone/weight/dimensions
- **CarrierConfig:** Carrier API key storage, configuration per carrier

**Medusa Fulfillment:** Uses a provider-based approach where each carrier has its own fulfillment provider plugin. Does not store carrier configs centrally or support custom rate rules per zone.

**VERDICT: KEEP as EXTENSION.** Different architectural approach — centralized carrier config vs per-provider plugins. Both can coexist.

### 7.4 tax-config

**Custom module:** 2 models (TaxRule, TaxExemption), 11 methods, 1 API route

- **TaxRule:** Tenant-scoped tax rules with product/category targeting
- **TaxExemption:** Customer-level tax exemption workflows with document upload

**Medusa Tax:** Region-based tax rates. No tenant scoping. No customer-level exemption workflows.

**VERDICT: KEEP as EXTENSION.** Tenant-scoped tax rules and exemption workflows are capabilities not present in Medusa Tax.

### 7.5 inventory-extension

**Custom module:** 3 models (ReservationHold, StockAlert, WarehouseTransfer), 7 methods, 2 API routes

| Model | Medusa Inventory Equivalent? | Details |
|---|---|---|
| `ReservationHold` | Partial (Medusa has reservations) | Adds time-based holds with auto-expiry. Medusa reservations have no expiry mechanism. |
| `StockAlert` | ❌ None | Low-stock notifications with threshold configuration |
| `WarehouseTransfer` | ❌ None | Warehouse-to-warehouse stock transfer tracking |

**VERDICT: KEEP as EXTENSION.** All 3 models add capabilities beyond Medusa Inventory.

---

## 8. Facade Routes Documentation

The following API route directories under `apps/backend/src/api/` do **not** have their own module directory — they access existing modules' services to compose responses across multiple modules. This is a **valid and common Medusa pattern** known as "facade routes."

### Facade Route Inventory

| Route Directory | What It Accesses |
|---|---|
| `availability` | Booking module + Inventory |
| `b2b` | Company module + Customer |
| `bundles` | Promotion-ext (ProductBundle model) |
| `cms` | CMS-content module |
| `consignments` | Vendor module + Order |
| `credit` | Company module (B2B credit) |
| `dropshipping` | Vendor module + Fulfillment |
| `flash-deals` | Promotion-ext + Product |
| `flash-sales` | Promotion-ext + Product |
| `gift-cards` | Promotion-ext (GiftCardExt model) |
| `health` | System health checks |
| `integrations` | Integration services |
| `inventory-ext` | Inventory-extension module |
| `metrics` | Analytics module |
| `newsletter` | Notification-preferences + Customer |
| `payment-terms` | Company module (B2B payment terms) |
| `platform` | Tenant + Node + Store modules |
| `print-on-demand` | Vendor module + Product |
| `promotions-ext` | Promotion-ext module |
| `service-providers` | Booking module (service providers) |
| `settings` | Tenant module (tenant settings) |
| `shipping-ext` | Shipping-extension module |
| `temporal` | Temporal workflow engine |
| `try-before-you-buy` | Order + Product modules |
| `volume-deals` | Volume-pricing module |
| `webhooks` | Integration webhook handlers (ERPNext, Fleetbase, Payload, Stripe) |
| `white-label` | Tenant + Store modules |

These routes are **not orphaned** — they intentionally compose data from multiple modules through their services, following Medusa's recommended pattern for cross-module API endpoints.

---

## 9. Medusa Upgrade Risk Assessment

### Risk Matrix

| Risk Level | Area | Impact | Affected Files |
|---|---|---|---|
| **HIGH** | `MedusaService` base class API changes | All 59 custom module services extend this class. A breaking change here affects every module. | 59 service files |
| **MEDIUM** | `defineLink()` API changes | All module-to-core connections would need updating. | 27 link files |
| **MEDIUM** | Event name changes | Subscribers listening for Medusa events (e.g., `order.placed`) would break if event names change. | 34 subscriber files |
| **LOW** | `medusa-config.ts` schema changes | Single file, easy to update. | 1 file |
| **LOW** | Admin UI extension API changes | Widget/route registration API could change between versions. | 134 admin UI files |
| **MINIMAL** | API route convention changes | Route handler signatures are stable. Even if conventions change, routes are straightforward to update. | 486 route files |

### Mitigation Strategy

1. **Pin Medusa version** — Do not auto-upgrade. Use exact version pinning in `package.json`.
2. **Review changelog before upgrading** — Check for breaking changes in `MedusaService`, `defineLink`, event names, and admin UI APIs.
3. **Test in staging first** — Run full integration test suite before applying upgrades to production.
4. **Monitor Medusa release notes** — Subscribe to Medusa's GitHub releases and Discord announcements.
5. **Maintain integration tests** — The `apps/backend/integration-tests/` and `apps/backend/tests/` directories should cover critical paths.

### Version-Specific Considerations

- **Medusa Analytics (v2.8.3+):** Our custom analytics module complements (not competes with) Medusa Analytics. No conflict.
- **Medusa Translation (v2.12.3+, experimental):** Our custom i18n module serves a different purpose. Can coexist. Monitor when Translation reaches GA for potential product-field translation adoption.
- **Medusa Draft Order:** Our quote module extends beyond Draft Order capabilities. No conflict.

---

## 10. Reclassification Summary

Based on deep analysis of source code, model schemas, method implementations, and Medusa v2 built-in capabilities:

| Module | Previous Classification | New Classification | Reason |
|---|---|---|---|
| `analytics` | DUPLICATE | **EXTENSION** | Medusa Analytics is event forwarding only (track/identify → PostHog). Report and Dashboard models have no Medusa equivalent. 80%+ of module functionality is unique. |
| `i18n` | DUPLICATE | **EXTENSION** | Tenant-scoped key-value store for UI strings vs Medusa's entity-field-level translation. Complementary, not duplicative. Different data model, different purpose. |
| `notification-preferences` | DUPLICATE | **EXTENSION** | Medusa Notification = sending infrastructure. Our module = preference/consent management. Medusa docs explicitly recommend this exact custom approach. |
| `cart-extension` | HYBRID-OVERLAP | **EXTENSION** | Typed, queryable fields with dedicated methods vs unstructured JSON metadata. 14 methods provide substantial cart business logic. No migration benefit. |
| `promotion-ext` | HYBRID-OVERLAP | **EXTENSION** | 3/4 models are completely unique (Referral, ProductBundle, CustomerSegment). GiftCardExt adds tenant scoping and sender/recipient info beyond Medusa gift cards. |
| `shipping-extension` | HYBRID-OVERLAP | **EXTENSION** | Centralized carrier config and custom rate rules vs Medusa's per-provider plugin approach. Different architecture, both valid. |
| `tax-config` | HYBRID-OVERLAP | **EXTENSION** | Tenant-scoped tax rules and customer-level exemption workflows with document upload. Neither exists in Medusa Tax. |
| `inventory-extension` | HYBRID-OVERLAP | **EXTENSION** | All 3 models (ReservationHold with expiry, StockAlert, WarehouseTransfer) add unique capabilities beyond Medusa Inventory. |

### Final Module Count

| Category | Count | Action |
|---|---|---|
| Extensions (reclassified from duplicate) | 3 | KEEP |
| Extensions (reclassified from hybrid) | 5 | KEEP |
| Extensions (always classified as extension) | 16 | KEEP |
| Vertical/domain-specific | 27 | KEEP |
| Infrastructure/CityOS | 8 | KEEP |
| Stub modules (need implementation) | 3 | IMPLEMENT |
| **Total** | **59** | **0 removals, 3 implementations needed** |

**Result: 0 duplicates. 0 hybrid-overlaps requiring migration. All 59 custom modules are justified. 3 stub modules need implementation to become fully functional.**

---

## Maturity Assessment Summary

| Tier | Modules | Description |
|---|---|---|
| **Production-ready** (15+ methods, 5+ models) | tenant (22m), booking (19m), subscription (17m), vendor (15m), company (15m), cart-extension (14m) | Well-developed, comprehensive business logic |
| **Solid** (7-14 methods) | governance, channel, region-zone, commission, payout, tax-config, notification-preferences (10m), review, dispute, invoice, loyalty, digital-product, shipping-extension, analytics (9m) + most verticals | Functional, adequate for production |
| **Basic** (3-6 methods) | node, persona, audit, i18n, volume-pricing, wishlist, social-commerce, membership, rental, quote | Minimal viable implementation |
| **Stub** (service only, no models) | wallet, trade-in, insurance | Need model creation, migration, and module registration |

---

## Integration Pattern Observations

The following extension modules have API routes but zero subscriber/workflow/job references. They function correctly via direct API calls. Adding event-driven behavior is an optional enhancement, not a required fix:

- analytics, cart-extension, inventory-extension, shipping-extension, tax-config, promotion-ext, notification-preferences

---

## Implementation Priority Roadmap

### Phase 1 — Implement Stub Modules (Medium Effort, High Value)

1. **wallet** — Create Wallet + WalletTransaction models, index.ts, migration, register in medusa-config.ts, add Customer → Wallet link. (2-3 days)
2. **trade-in** — Create TradeInRequest + TradeInOffer models, index.ts, migration, register in medusa-config.ts, add Customer/Product → TradeInRequest links. Wire up existing workflow. (2-3 days)
3. **insurance** — Create InsurancePolicy + InsuranceClaim models, index.ts, migration, register in medusa-config.ts, add Customer/Order → InsurancePolicy links. (2-3 days)

### Phase 2 — Strengthen Extension Patterns (Optional)

1. Add Medusa links for extension modules where missing
2. Consider subscribers for isolated modules (e.g., inventory-extension reacting to stock events)
3. Optionally forward analytics.trackEvent to Medusa Analytics for external provider integration

### Phase 3 — Plugin Re-evaluation (Future)

1. Re-evaluate RSC-Labs plugins when compatible: medusa-wishlist, medusa-rbac, medusa-documents-v2, medusa-store-analytics-v2
2. Monitor Medusa Translation GA status for potential product-field translation adoption alongside custom i18n
