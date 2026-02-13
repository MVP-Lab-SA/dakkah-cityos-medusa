# Dakkah CityOS Commerce Platform — Implementation Plan for Remaining Gaps

> **Version:** 2.0.0 | **Date:** 2026-02-13 | **Reference:** `docs/PLATFORM_MODULE_ASSESSMENT.md`

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Dependency Graph](#2-dependency-graph)
3. [Phase 1 — Infrastructure & Configuration](#3-phase-1--infrastructure--configuration)
4. [Phase 2 — Data Model Completion](#4-phase-2--data-model-completion)
5. [Phase 3 — API Route Completion](#5-phase-3--api-route-completion)
6. [Phase 4 — Cross-Module Links & Integration Wiring](#6-phase-4--cross-module-links--integration-wiring)
7. [Phase 5 — Admin UI Buildout](#7-phase-5--admin-ui-buildout)
8. [Phase 6 — Domain Service Logic & Workflow Activation](#8-phase-6--domain-service-logic--workflow-activation)
9. [Effort Summary](#9-effort-summary)
10. [Risk Register](#10-risk-register)

---

## 1. Executive Summary

This plan addresses **all remaining gaps** identified in the deep platform audit. The current state is:

- **Working:** Storefront with 65 products, 18 fully implemented modules, 42 CRUD manage pages
- **Not working:** 17 models with no DB tables, 9 missing backend API routes, 33 modules without admin UI, 28 modules with minimal service logic, 5 external integrations unconfigured, Temporal Cloud not connected

### Gap Inventory

| Gap Category | Count | Impact |
|-------------|-------|--------|
| Models missing DB tables | 17 | Runtime errors if queried |
| Missing backend API routes | 9 | Storefront pages show errors |
| Modules without admin UI | 33 | No admin management interface |
| Modules with minimal service logic | 28 | CRUD-only, no business rules |
| External integrations unconfigured | 5 | Cross-system sync inactive |
| Temporal Cloud not connected | 1 | 30+ workflows won't execute |
| Missing cross-module links | ~12 | No entity relationship navigation |
| Undocumented DB tables needing service wiring | 13 | Data exists but unused |

### Phase Overview

| Phase | Focus | Prerequisites | Effort | Unlocks |
|-------|-------|--------------|--------|---------|
| 1 | Infrastructure & Config | None | M | Everything else |
| 2 | Data Model Completion | Phase 1 | L | API routes, admin UI, services |
| 3 | API Route Completion | Phase 2 | L | Storefront functionality |
| 4 | Cross-Module Links & Integration | Phase 2 | M | Entity navigation, external sync |
| 5 | Admin UI Buildout | Phase 3 | XL | Admin management for all verticals |
| 6 | Domain Service Logic & Workflows | Phase 4 | XL | Business rules, Temporal workflows |

---

## 2. Dependency Graph

```
Phase 1: Infrastructure & Configuration
    │
    ├── Configure Stripe → unlocks payment processing
    ├── Configure Temporal Cloud → unlocks workflow execution
    └── Configure Payload/ERPNext/Fleetbase/Walt.id → unlocks sync
            │
Phase 2: Data Model Completion
    │
    ├── Create 17 missing DB migrations
    ├── Wire 13 undocumented tables to services
    └── Validate all 205 models have tables
            │
            ├──────────────────────────┐
Phase 3: API Routes                Phase 4: Links & Integration
    │                                   │
    ├── 9 missing store routes          ├── ~12 new cross-module links
    └── Validate all CRUD configs       └── Webhook/sync verification
            │                                   │
            └──────────────┬────────────────────┘
                           │
Phase 5: Admin UI Buildout
    │
    ├── High-priority: 8 modules
    ├── Medium-priority: 12 modules
    └── Low-priority: 13 modules
            │
Phase 6: Domain Service Logic & Workflows
    │
    ├── Business logic for 28 modules
    ├── Temporal workflow activation
    └── End-to-end testing
```

---

## 3. Phase 1 — Infrastructure & Configuration

> **Goal:** Configure all external services and verify connectivity.
> **Prerequisites:** None
> **Effort:** M (Medium)
> **Duration Estimate:** 1–2 days
> **Unlocks:** All subsequent phases

### 1.1 Stripe Payment Integration

| Item | Details |
|------|---------|
| **Effort** | S |
| **Env Vars** | `STRIPE_SECRET_KEY` |
| **Config File** | `apps/backend/medusa-config.ts` (lines 85–103) |
| **Verification** | Payment module initializes without errors, webhook endpoint `/webhooks/stripe` responds |
| **Acceptance** | `GET /health` reports Stripe as "connected" |

**Steps:**
1. Obtain Stripe secret key from Stripe Dashboard
2. Set `STRIPE_SECRET_KEY` as a secret
3. Verify the payment provider configuration in `medusa-config.ts`
4. Test webhook signature verification at `/webhooks/stripe`

### 1.2 Temporal Cloud Connection

| Item | Details |
|------|---------|
| **Effort** | M |
| **Env Vars** | `TEMPORAL_ENDPOINT`, `TEMPORAL_API_KEY`, `TEMPORAL_NAMESPACE` |
| **Config File** | `apps/backend/src/lib/integrations/temporal-client.ts` |
| **Verification** | Temporal client connects, event outbox processor dispatches |
| **Acceptance** | Health check reports Temporal as "connected"; test workflow executes |

**Steps:**
1. Create Temporal Cloud account and namespace
2. Set all 3 environment variables
3. Verify `temporal-client.ts` establishes connection on startup
4. Test a simple workflow dispatch via event outbox
5. Verify the 21 task queues are registered

### 1.3 Payload CMS Connection

| Item | Details |
|------|---------|
| **Effort** | S |
| **Env Vars** | `PAYLOAD_CMS_URL_DEV`, `PAYLOAD_API_KEY` |
| **Config File** | `apps/backend/src/integrations/cms-hierarchy-sync/engine.ts` |
| **Verification** | `payload-cms-poll` job connects, webhook endpoint `/webhooks/payload-cms` responds |
| **Acceptance** | Manual sync via `POST /admin/integrations/sync/cms` completes |

### 1.4 ERPNext Connection

| Item | Details |
|------|---------|
| **Effort** | S |
| **Env Vars** | `ERPNEXT_API_KEY`, `ERPNEXT_API_SECRET`, `ERPNEXT_URL_DEV` |
| **Config File** | `apps/backend/src/integrations/orchestrator/integration-registry.ts` |
| **Verification** | Webhook endpoint `/webhooks/erpnext` responds, sync tracker initializes |
| **Acceptance** | Health check reports ERPNext circuit breaker as "closed" (healthy) |

### 1.5 Fleetbase Connection

| Item | Details |
|------|---------|
| **Effort** | S |
| **Env Vars** | `FLEETBASE_API_KEY`, `FLEETBASE_URL_DEV` |
| **Verification** | Webhook endpoint `/webhooks/fleetbase` responds |
| **Acceptance** | Geocoding/address validation callable |

### 1.6 Walt.id Connection

| Item | Details |
|------|---------|
| **Effort** | S |
| **Env Vars** | `WALTID_URL_DEV`, `WALTID_API_KEY` |
| **Verification** | DID management endpoints respond |
| **Acceptance** | Credential issuance test passes |

---

## 4. Phase 2 — Data Model Completion

> **Goal:** Every model defined in code has a corresponding database table. All orphan DB tables are wired to services.
> **Prerequisites:** Phase 1 (environment configured)
> **Effort:** L (Large)
> **Duration Estimate:** 3–5 days
> **Unlocks:** API routes, admin UI, service logic for all modules

### 2.1 Create Missing Database Migrations (17 models)

Each migration must:
- Include `tenant_id: text` for multi-tenant isolation
- Include `created_at`, `updated_at`, `deleted_at` timestamps
- Follow existing migration patterns in sibling modules
- Use MikroORM migration format

#### Priority A — Core Platform (5 models, Effort: M)

| # | Model | Module | Migration Path | Key Columns |
|---|-------|--------|---------------|-------------|
| 1 | `tenant_poi` | tenant | `apps/backend/src/modules/tenant/migrations/` | id, tenant_id, name, type, node_id, location (jsonb), address, coordinates, status, metadata |
| 2 | `tenant_relationship` | tenant | `apps/backend/src/modules/tenant/migrations/` | id, tenant_id, related_tenant_id, relationship_type, status, metadata |
| 3 | `service_channel` | channel | `apps/backend/src/modules/channel/migrations/` | id, tenant_id, name, type, sales_channel_id, config (jsonb), status, metadata |
| 4 | `notification_preference` | notification-preferences | `apps/backend/src/modules/notification-preferences/migrations/` | id, user_id, tenant_id, channel, category, enabled, config (jsonb) |
| 5 | `cart_metadata` | cart-extension | `apps/backend/src/modules/cart-extension/migrations/` | id, cart_id, tenant_id, persona_id, node_id, source_channel, metadata (jsonb) |

#### Priority B — Commerce Extensions (6 models, Effort: M)

| # | Model | Module | Migration Path |
|---|-------|--------|---------------|
| 6 | `loyalty_account` | loyalty | `apps/backend/src/modules/loyalty/migrations/` |
| 7 | `point_transaction` | loyalty | `apps/backend/src/modules/loyalty/migrations/` |
| 8 | `carrier_config` | shipping-extension | `apps/backend/src/modules/shipping-extension/migrations/` |
| 9 | `shipping_rate` | shipping-extension | `apps/backend/src/modules/shipping-extension/migrations/` |
| 10 | `tax_rule` | tax-config | `apps/backend/src/modules/tax-config/migrations/` |
| 11 | `reservation_hold` | inventory-extension | `apps/backend/src/modules/inventory-extension/migrations/` |

#### Priority C — Operations & Content (6 models, Effort: M)

| # | Model | Module | Migration Path |
|---|-------|--------|---------------|
| 12 | `stock_alert` | inventory-extension | `apps/backend/src/modules/inventory-extension/migrations/` |
| 13 | `warehouse_transfer` | inventory-extension | `apps/backend/src/modules/inventory-extension/migrations/` |
| 14 | `dashboard` | analytics | `apps/backend/src/modules/analytics/migrations/` |
| 15 | `report` | analytics | `apps/backend/src/modules/analytics/migrations/` |
| 16 | `cms_page` | cms-content | `apps/backend/src/modules/cms-content/migrations/` |
| 17 | `cms_navigation` | cms-content | `apps/backend/src/modules/cms-content/migrations/` |

**Acceptance:** `SELECT count(*) FROM information_schema.tables WHERE table_schema='public'` returns 17 more tables than current count.

### 2.2 Wire Undocumented DB Tables to Services (13 tables)

These tables exist in the database but are not fully wired through the service layer. For each, verify or add:
- Model class is exported from the module's `models/index.ts`
- Service class includes the model in its `MedusaService` constructor
- API route (if needed) exposes list/get/create/update operations

| # | Table | Parent Module | Current State | Action Required |
|---|-------|--------------|---------------|-----------------|
| 1 | `approval_action` | booking | Model exists, in service | Verify API exposure for admin approval actions |
| 2 | `approval_request` | booking | Model exists, in service | Verify API route for listing/approving requests |
| 3 | `availability_exception` | booking | Model exists, in service | Verify CRUD through booking service |
| 4 | `booking_item` | booking | Model exists, in service | Verify included in booking list/detail responses |
| 5 | `booking_reminder` | booking | Model exists, in service | Verify reminder scheduling works |
| 6 | `credit_line` | company | Check model existence | Add model if missing, wire to service |
| 7 | `loyalty_points_ledger` | loyalty | Separate from model layer | Reconcile with LoyaltyProgram service; ensure ledger entries created on point events |
| 8 | `vendor_analytics_snapshot` | vendor | Model exists (VendorAnalyticsSnapshot) | Verify aggregation methods populate snapshots; add admin widget |
| 9 | `vendor_order_item` | vendor | Model exists (VendorOrderItem) | Verify included in VendorOrder list/detail responses |
| 10 | `vendor_performance_metric` | vendor | Model exists (VendorPerformanceMetric) | Verify metric calculation service runs; add admin dashboard |
| 11 | `workflow_execution` | Medusa core | Core workflow engine table | No action — internal engine table |
| 12 | `tenant_invoice` | tenant | Model exists (TenantInvoice) | Verify billing service creates invoices; add admin listing |
| 13 | `user_preference` | notification-pref / core | Table exists | Wire to notification-preferences module or user settings API |

**Effort:** M
**Acceptance:** Each table has a corresponding model export, service method, and at least a list API endpoint.

---

## 5. Phase 3 — API Route Completion

> **Goal:** Every storefront page that calls a backend endpoint gets a valid response.
> **Prerequisites:** Phase 2 (all models have tables)
> **Effort:** L (Large)
> **Duration Estimate:** 3–5 days
> **Unlocks:** Full storefront functionality

### 3.1 Implement 9 Missing Store API Routes

Each route needs:
- Route handler file at `apps/backend/src/api/store/<endpoint>/route.ts`
- Input validation schema
- Service method call (create, list, get, update, delete as appropriate)
- Tenant-scoped queries
- Proper error handling

#### High Priority — Customer-Facing Commerce (5 routes)

| # | Route | Module(s) | Models Used | Effort | File Path |
|---|-------|-----------|-------------|--------|-----------|
| 1 | `GET/POST /store/loyalty` | loyalty | LoyaltyProgram, LoyaltyAccount, loyalty_points_ledger | M | `apps/backend/src/api/store/loyalty/route.ts` |
| 2 | `GET/POST /store/wallet` | cart-extension / payment | CartMetadata, payment_session | M | `apps/backend/src/api/store/wallet/route.ts` |
| 3 | `GET/POST /store/gift-cards` | promotion-ext | GiftCardExt | S | `apps/backend/src/api/store/gift-cards/route.ts` |
| 4 | `GET /store/bundles` | promotion-ext / product | ProductBundle | S | `apps/backend/src/api/store/bundles/route.ts` |
| 5 | `GET /store/flash-sales` | promotion-ext | Promotion (time-bounded) | S | `apps/backend/src/api/store/flash-sales/route.ts` |

#### Medium Priority — Engagement & Logistics (4 routes)

| # | Route | Module(s) | Models Used | Effort | File Path |
|---|-------|-----------|-------------|--------|-----------|
| 6 | `POST /store/newsletter` | notification-preferences | NotificationPreference | S | `apps/backend/src/api/store/newsletter/route.ts` |
| 7 | `GET/POST /store/credit` | company / loyalty | credit_line, loyalty_points_ledger | S | `apps/backend/src/api/store/credit/route.ts` |
| 8 | `GET/POST /store/trade-in` | automotive | TradeIn | S | `apps/backend/src/api/store/trade-in/route.ts` |
| 9 | `GET /store/consignments` | shipping-extension | fulfillment, shipping tracking | S | `apps/backend/src/api/store/consignments/route.ts` |

**Note:** Routes 1, 2, 6 depend on Phase 2 migrations for loyalty_account, cart_metadata, and notification_preference tables.

**Acceptance:** Each endpoint returns valid JSON with HTTP 200 for list operations, 201 for creation. Storefront pages render data instead of errors.

### 3.2 Validate Existing CRUD Config Endpoints (42 endpoints)

Verify all 42 CRUD config API endpoints return valid responses:

| Priority | Configs | Endpoints |
|----------|---------|-----------|
| High | products, orders, customers, vendors, commissions, payouts | Medusa core + custom modules |
| High | bookings, subscriptions, quotes, invoices, reviews | Custom module CRUD |
| Medium | travel, automotive, healthcare, education, fitness, restaurants | `/store/admin/*` vertical CRUD |
| Medium | memberships, event-ticketing, rentals, real-estate, digital-products | `/admin/*` vertical CRUD |
| Low | parking, freelance, advertising, affiliates, crowdfunding, charity | `/store/admin/*` and `/admin/*` |
| Low | classifieds, legal, utilities, social-commerce, financial-products, pet-services | `/admin/*` vertical CRUD |
| Config | settings, stores, companies, team | `/admin/*` platform CRUD |

**Effort:** M
**Acceptance:** All 42 CRUD endpoints respond with 200/201 for their respective operations.

---

## 6. Phase 4 — Cross-Module Links & Integration Wiring

> **Goal:** All entity relationships are navigable. External systems sync data.
> **Prerequisites:** Phase 2 (models complete)
> **Effort:** M (Medium)
> **Duration Estimate:** 2–3 days
> **Unlocks:** Admin UI can show related entities; external sync flows work

### 4.1 New Cross-Module Links (~12 new links)

Add new link definitions in `apps/backend/src/links/`:

| # | Link File | Source | Target | Type | Priority |
|---|-----------|--------|--------|------|----------|
| 1 | `customer-loyalty.ts` | Customer (core) | LoyaltyProgram | One-to-Many | High |
| 2 | `customer-wishlist.ts` | Customer (core) | Wishlist | One-to-One | High |
| 3 | `product-digital-asset.ts` | Product (core) | DigitalAsset | One-to-One | High |
| 4 | `product-warranty.ts` | Product (core) | WarrantyPlan | One-to-Many | High |
| 5 | `order-dispute.ts` | Order (core) | Dispute | One-to-Many | High |
| 6 | `vendor-restaurant.ts` | Vendor | Restaurant | One-to-One | Medium |
| 7 | `product-classified.ts` | Product (core) | ClassifiedListing | One-to-One | Medium |
| 8 | `product-event.ts` | Product (core) | Event (ticketing) | One-to-One | Medium |
| 9 | `vendor-freelance.ts` | Vendor | GigListing | One-to-Many | Medium |
| 10 | `customer-donation.ts` | Customer (core) | Donation | One-to-Many | Low |
| 11 | `product-course.ts` | Product (core) | Course | One-to-One | Low |
| 12 | `customer-vehicle.ts` | Customer (core) | VehicleListing | One-to-Many | Low |

Each link file follows the existing pattern:
```typescript
import { defineLink } from "@medusajs/framework/utils"
import SourceModule from "../modules/source"
import TargetModule from "../modules/target"

export default defineLink(SourceModule.linkable.entity, TargetModule.linkable.entity)
```

**Effort:** M
**Acceptance:** Each new link creates a join table. Queries from source entity can retrieve linked target entities.

### 4.2 External Integration Verification

After Phase 1 env vars are set, verify each integration end-to-end:

| # | Integration | Verification Steps | Acceptance |
|---|-------------|-------------------|------------|
| 1 | Stripe | Create test payment session → capture → refund | Payment flows complete without errors |
| 2 | Payload CMS | Trigger manual sync → verify collection import | 8 collections sync in dependency order |
| 3 | ERPNext | Trigger product sync → verify ERPNext item created | Product appears in ERPNext with matching data |
| 4 | Fleetbase | Call geocoding API → verify address validation | Valid geocode response returned |
| 5 | Walt.id | Create DID → issue credential → verify | Credential verifiable against trust registry |

### 4.3 Webhook Endpoint Verification

| Webhook | Path | Signature Method | Verification |
|---------|------|-----------------|-------------|
| Stripe | `/webhooks/stripe` | HMAC-SHA256 | Signature verified, events processed |
| Payload CMS | `/webhooks/payload-cms` | API key header | 13 collections handled (tenants, stores, scopes, categories, subcategories, portals, governance-authorities, policies, personas, persona-assignments, countries, compliance-records, nodes) |
| ERPNext | `/webhooks/erpnext` | HMAC signature | Signature verified, events dispatched |
| Fleetbase | `/webhooks/fleetbase` | API key header | Signature verified, events dispatched |

### 4.4 Sync Flow End-to-End Verification

| Sync Flow | Direction | Schedule | Verification |
|-----------|-----------|----------|-------------|
| Product sync | Medusa → ERPNext | Hourly | Product created in Medusa appears in ERPNext within 1 hour |
| CMS hierarchy | Payload → Medusa | 15-minute poll + webhook | Countries → Authorities → Scopes → Categories → Subcategories → Tenants → Stores → Portals sync in order |
| Failed retry | All | 30 minutes | Failed sync entries re-attempted within 30 minutes |
| Hierarchy reconciliation | All | 6 hours | Mismatches detected and corrected |
| Cleanup | All | Daily | Completed sync records older than 30 days purged |

**Effort:** M
**Acceptance:** All webhook endpoints return 200 for valid signed payloads and 401 for invalid ones. Sync flows produce DurableSyncTracker entries with "completed" status.

---

## 7. Phase 5 — Admin UI Buildout

> **Goal:** Every module has a dedicated admin management page.
> **Prerequisites:** Phase 3 (all API routes working)
> **Effort:** XL (Extra Large)
> **Duration Estimate:** 5–10 days
> **Unlocks:** Full admin management of all verticals

### Admin UI Architecture

All admin pages live in `apps/backend/src/admin/`. The existing pattern uses:
- **Routes:** `apps/backend/src/admin/routes/` — full admin pages
- **Widgets:** `apps/backend/src/admin/widgets/` — embeddable dashboard widgets
- **Hooks:** `apps/backend/src/admin/hooks/` — data fetching hooks

### 5.1 High Priority — Core Commerce Verticals (8 modules)

These modules have rich data models, seeded data, and active storefront pages.

| # | Module | Models | Admin Page Path | Admin Features | Effort |
|---|--------|--------|----------------|----------------|--------|
| 1 | restaurant | 8 | `admin/routes/restaurants/` | Menu editor with modifier groups, kitchen order queue, table reservation map, delivery slot calendar | L |
| 2 | auction | 5 | `admin/routes/auctions/` | Listing manager with bid history, active bid monitor, settlement dashboard, escrow status | M |
| 3 | membership | 2 | `admin/routes/memberships/` | Tier configuration, member list with upgrade tracking, benefits management | S |
| 4 | store (cityos) | 1 | `admin/routes/stores/` | Store configuration, currency/locale settings, sales channel mapping | S |
| 5 | rental | 4 | `admin/routes/rentals/` | Inventory availability calendar, agreement tracker, return/damage processing | M |
| 6 | event-ticketing | 5 | `admin/routes/events/` | Event scheduler, seat map visual editor, ticket sales tracking, venue management | M |
| 7 | real-estate | 5 | `admin/routes/real-estate/` | Property listing manager, viewing appointment scheduler, valuation tracker | M |
| 8 | healthcare | 6 | `admin/routes/healthcare/` | Practitioner directory, appointment scheduler, prescription manager, lab order tracking | M |

**Subtotal Effort:** L

### 5.2 Medium Priority — Vertical Extensions (12 modules)

| # | Module | Models | Key Admin Features | Effort |
|---|--------|--------|-------------------|--------|
| 9 | education | 5 | Course catalog, enrollment manager, student progress, certificate issuance | M |
| 10 | digital-product | 2 | Asset manager with download tracking, license management | S |
| 11 | classified | 5 | Listing moderation queue, offer/counter-offer viewer, flag review | M |
| 12 | affiliate | 4 | Program manager, referral tracking, commission reports, payout queue | S |
| 13 | freelance | 5 | Gig listing manager, contract tracker, dispute resolution, time log viewer | M |
| 14 | crowdfunding | 5 | Campaign manager, backer list, milestone tracker, funding progress | M |
| 15 | automotive | 9 | Vehicle inventory, test drive scheduler, trade-in evaluator, parts catalog, service history | L |
| 16 | social-commerce | 6 | Stream scheduler, product pin manager, influencer campaign tracker, group buy monitor | M |
| 17 | grocery | 3 | Fresh product tracker with expiry dates, batch management, substitution rules | S |
| 18 | charity | 4 | Campaign manager, donation tracker, impact report builder | S |
| 19 | financial-product | 6 | Product catalog, loan application tracker, insurance policy manager | M |
| 20 | travel | 3 | Property/package manager, reservation tracker, guest profiles | S |

**Subtotal Effort:** L

### 5.3 Low Priority — Specialized Verticals & Extensions (13 modules)

| # | Module | Models | Key Admin Features | Effort |
|---|--------|--------|-------------------|--------|
| 21 | government | 8 | Service request queue, citizen profiles, license/permit issuance, fine management | M |
| 22 | pet-service | 5 | Pet registry, grooming scheduler, vet appointment tracker, wellness plans | S |
| 23 | fitness | 5 | Class scheduler, membership manager, trainer assignments, check-in log | S |
| 24 | legal | 4 | Case manager, consultation scheduler, retainer tracker, attorney profiles | S |
| 25 | parking | 2 | Zone manager, session monitor, occupancy dashboard | S |
| 26 | utilities | 4 | Account manager, bill generator, meter reading log, usage charts | S |
| 27 | advertising | 6 | Campaign manager, creative library, placement tracker, analytics dashboard | M |
| 28 | loyalty | 3 | Program config, points ledger viewer, reward tier editor | S |
| 29 | wishlist | 2 | Wishlist analytics, popular items report | S |
| 30 | analytics | 2 | Dashboard builder, report designer | M |
| 31 | notification-preferences | 1 | Preference manager, channel config | S |
| 32 | promotion-ext | 1 | Gift card manager, bundle editor | S |
| 33 | cms-content | 2 | Page editor, navigation tree builder | M |

**Subtotal Effort:** M

### Admin Page Template

Each admin page should follow this structure:

```
admin/routes/<module>/
├── page.tsx              # List view with DataTable
├── [id]/
│   └── page.tsx          # Detail/edit view
├── create/
│   └── page.tsx          # Creation form
└── components/
    ├── <module>-table.tsx       # Table columns and actions
    ├── <module>-form.tsx        # Create/edit form
    └── <module>-detail.tsx      # Detail view
```

**Common components** available in `apps/backend/src/admin/components/`:
- DataTable, Charts, Calendar, Map, RichTextEditor, FileUpload, FormWizard
- AnalyticsOverview, BulkActionsBar, AdvancedFilters, StatusWorkflow, ManagePageWrapper

**Acceptance per page:** List view loads data from API, detail view shows all fields, create/edit form validates and saves, delete with confirmation works.

---

## 8. Phase 6 — Domain Service Logic & Workflow Activation

> **Goal:** Every module has meaningful business logic beyond CRUD. Temporal workflows are live.
> **Prerequisites:** Phase 4 (integrations wired), Phase 5 (admin UI for testing)
> **Effort:** XL (Extra Large)
> **Duration Estimate:** 10–15 days
> **Unlocks:** Production-ready business logic, automated workflows

### 6.1 High Priority — Revenue-Critical Service Logic (7 modules)

These modules directly impact revenue and need custom business rules.

#### 6.1.1 Restaurant Module — Order Orchestration

| File | Enhancement | Effort |
|------|------------|--------|
| `modules/restaurant/service.ts` | Kitchen order state machine (pending → preparing → ready → served) | M |
| `modules/restaurant/service.ts` | Menu availability by time-of-day and day-of-week | S |
| `modules/restaurant/service.ts` | Table reservation conflict detection and waitlist | M |
| `modules/restaurant/service.ts` | Modifier validation (required modifiers, min/max selections) | S |
| `modules/restaurant/service.ts` | Delivery slot capacity management | S |

#### 6.1.2 Auction Module — Bid & Settlement

| Enhancement | Effort |
|------------|--------|
| Bid validation (minimum increment, reserve price, anti-sniping) | M |
| Auto-bid agent (proxy bidding up to max) | M |
| Auction settlement (winner determination, escrow release, loser notification) | M |
| Auto-extend on last-minute bids | S |
| Buy-it-now conversion | S |

#### 6.1.3 Rental Module — Availability & Returns

| Enhancement | Effort |
|------------|--------|
| Availability calendar with conflict detection | M |
| Dynamic pricing (peak/off-peak, duration discounts) | M |
| Return processing with damage assessment | S |
| Late fee calculation | S |

#### 6.1.4 Membership Module — Tier Management

| Enhancement | Effort |
|------------|--------|
| Tier upgrade/downgrade rules based on spend or points | M |
| Benefits activation/deactivation on tier change | S |
| Renewal reminders and grace periods | S |
| Member count capacity enforcement | S |

#### 6.1.5 Loyalty Module — Points Economy

| Enhancement | Effort |
|------------|--------|
| Points earning rules (per-purchase, bonus events, referrals) | M |
| Points expiration scheduler | S |
| Reward tier calculation and unlock | M |
| Points redemption at checkout integration | M |

#### 6.1.6 Booking Module — Scheduling (already partially implemented)

| Enhancement | Effort |
|------------|--------|
| Recurring booking support | M |
| Overbooking protection with waitlist | S |
| Cancellation policy enforcement (refund rules) | M |
| Reminder scheduling via notification system | S |

#### 6.1.7 Subscription Module — Lifecycle (already partially implemented)

| Enhancement | Effort |
|------------|--------|
| Proration on mid-cycle plan changes | M |
| Dunning management (retry logic for failed payments) | M |
| Usage-based billing calculation | M |
| Subscription pause/resume with date tracking | S |

### 6.2 Medium Priority — Vertical-Specific Logic (12 modules)

| # | Module | Key Enhancements | Effort |
|---|--------|-----------------|--------|
| 1 | education | Enrollment capacity checks, prerequisite validation, certificate auto-issuance on course completion | M |
| 2 | healthcare | Appointment scheduling with conflict detection, prescription validation, insurance eligibility verification | M |
| 3 | event-ticketing | Seat allocation algorithm, ticket transfer rules, event capacity enforcement | M |
| 4 | freelance | Milestone-based payment release, dispute mediation workflow, time tracking validation | M |
| 5 | crowdfunding | Funding threshold logic (all-or-nothing vs. flexible), backer reward fulfillment on funding success | M |
| 6 | automotive | VIN validation against external database, trade-in valuation calculator, test drive scheduling with availability | S |
| 7 | real-estate | Viewing appointment scheduling with agent availability, property valuation integration, lease document generation | M |
| 8 | classified | Listing auto-expiration, offer/counter-offer workflow with notifications, flag-based moderation queue | S |
| 9 | affiliate | Commission calculation on order completion, referral link tracking, payout threshold enforcement | S |
| 10 | warranty | Claim validation against coverage dates, repair order creation, coverage period verification | S |
| 11 | financial-product | Loan eligibility scoring, insurance premium calculator, KYC verification integration | M |
| 12 | social-commerce | Live stream scheduling, product pinning during active streams, group buy threshold notification | M |

### 6.3 Low Priority — Supporting Module Logic (9 modules)

| # | Module | Key Enhancements | Effort |
|---|--------|-----------------|--------|
| 1 | charity | Donation receipt PDF generation, impact report metric aggregation | S |
| 2 | grocery | Freshness tracking with expiry alerts, auto-substitution suggestion, batch rotation (FIFO) | S |
| 3 | advertising | Campaign budget depletion tracking, impression counter, click-through rate analytics | M |
| 4 | parking | Session start/stop metering, overstay fee detection, zone occupancy calculation | S |
| 5 | utilities | Meter reading validation, automated bill calculation from usage, usage threshold alerts | S |
| 6 | government | Service request workflow (submitted → processing → approved → completed), permit issuance with document generation | M |
| 7 | pet-service | Vaccination record tracking with reminders, grooming recurrence scheduling | S |
| 8 | fitness | Class capacity management with waitlist, trainer scheduling, streak-based check-in tracking | S |
| 9 | legal | Case status workflow with timeline, billing hour accumulation, retainer balance tracking | S |

### 6.4 Temporal Workflow Activation

Once Temporal Cloud is connected (Phase 1.2), activate workflows by priority:

#### Batch 1 — Core Commerce Workflows (Effort: L)

| Workflow | Task Queue | Trigger | Description |
|----------|-----------|---------|-------------|
| Order fulfillment | `order-processing` | Order placed | Validate inventory → create fulfillment → notify vendor → track delivery |
| Payment processing | `payment-processing` | Checkout completed | Capture payment → update order → create commission → trigger fulfillment |
| Subscription billing | `subscription-billing` | Billing cycle date | Calculate amount → charge payment → handle failure → create invoice |
| Commission calculation | `commission-processing` | Order completed | Calculate vendor commission → create transaction → update payout balance |
| Payout processing | `payout-processing` | Payout threshold met | Validate balance → create Stripe transfer → update ledger → notify vendor |

#### Batch 2 — Integration Sync Workflows (Effort: L)

| Workflow | Task Queue | Trigger | Description |
|----------|-----------|---------|-------------|
| Product sync to ERPNext | `erpnext-sync` | Product created/updated | Map fields → create/update ERPNext item → track sync state |
| CMS hierarchy sync | `cms-sync` | Webhook or 15-min poll | Sync 8 collections in dependency order → create-or-update with `custom_cms_ref_id` matching |
| Fulfillment dispatch | `fleetbase-dispatch` | Fulfillment created | Create Fleetbase order → assign driver → track delivery → update fulfillment status |
| Invoice sync | `erpnext-sync` | Invoice finalized | Create ERPNext sales invoice → create payment entry → post to GL |
| Credential issuance | `identity-management` | KYC approved | Create DID → issue Verifiable Credential → register in trust registry |

#### Batch 3 — Vertical-Specific Workflows (Effort: M)

| Workflow | Task Queue | Trigger | Description |
|----------|-----------|---------|-------------|
| Auction settlement | `auction-processing` | Auction end time | Determine winner → release escrow → create order → notify participants |
| Booking confirmation | `booking-processing` | Booking created | Validate availability → confirm booking → send confirmation → schedule reminder |
| Rental return processing | `rental-processing` | Return initiated | Inspect return → assess damage → calculate fees → update inventory |
| Event ticket issuance | `event-processing` | Ticket purchased | Generate ticket with QR code → send to customer → update seat availability |
| Donation receipt | `charity-processing` | Donation completed | Generate receipt PDF → send to donor → update campaign totals → create impact entry |

#### Batch 4 — Background & Maintenance Workflows (Effort: M)

| Workflow | Task Queue | Trigger | Description |
|----------|-----------|---------|-------------|
| Loyalty points expiration | `loyalty-processing` | Scheduled (daily) | Find expiring points → expire → notify customers → update balances |
| Subscription dunning | `subscription-billing` | Payment failed | Retry payment → escalate → pause subscription → notify customer |
| Listing expiration | `classified-processing` | Scheduled (daily) | Find expired listings → deactivate → notify sellers → offer renewal |
| Analytics aggregation | `analytics-processing` | Scheduled (hourly) | Aggregate events → compute KPIs → update vendor snapshots → refresh dashboards |
| Vendor performance | `vendor-analytics` | Scheduled (daily) | Calculate fulfillment rate → compute ratings → update metrics → flag underperformers |

**Acceptance:** Workflows execute end-to-end in Temporal Cloud. Workflow history visible in Temporal UI. Failed workflows retry according to retry policy. Completed workflows produce expected side effects (records created, notifications sent, external systems updated).

---

## 9. Effort Summary

### T-Shirt Size Definitions

| Size | Hours | Description |
|------|-------|-------------|
| S | 2–4h | Single file change, clear pattern to follow |
| M | 4–8h | Multiple files, some logic design needed |
| L | 1–2d | Multiple modules, integration testing needed |
| XL | 3–5d | Major feature, cross-cutting concerns |

### Phase Effort Breakdown

| Phase | Focus | Work Items | Effort | Dependency |
|-------|-------|------------|--------|------------|
| 1 | Infrastructure & Config | 6 integrations | M (1–2d) | None |
| 2 | Data Model Completion | 17 migrations + 13 wiring tasks | L (3–5d) | Phase 1 |
| 3 | API Route Completion | 9 new routes + 42 validations | L (3–5d) | Phase 2 |
| 4 | Links & Integration | 12 links + 5 verifications | M (2–3d) | Phase 2 |
| 5 | Admin UI Buildout | 33 admin pages | XL (5–10d) | Phase 3 |
| 6 | Service Logic & Workflows | 28 services + 20 workflows | XL (10–15d) | Phase 4, 5 |
| **Total** | | **138 work items** | | **~24–40 days** |

### Module-Level Priority Matrix

| Priority | Modules | Rationale |
|----------|---------|-----------|
| **P0 — Critical** | tenant, store, loyalty, membership, subscription | Core platform entities, revenue-impacting |
| **P1 — High** | restaurant, auction, rental, booking, event-ticketing | High-traffic verticals with rich data models |
| **P2 — Medium** | healthcare, education, real-estate, freelance, crowdfunding, automotive | Growing verticals needing domain logic |
| **P3 — Low** | charity, grocery, advertising, parking, utilities, government, pet-service, fitness, legal, financial-product, classified, affiliate, social-commerce, warranty | Long-tail verticals — CRUD is functional |
| **P4 — Deferred** | analytics, cart-extension, cms-content, inventory-extension, shipping-extension, tax-config, notification-preferences, dispute | Infrastructure extensions — can operate without custom UI |

---

## 10. Risk Register

| # | Risk | Impact | Likelihood | Mitigation |
|---|------|--------|------------|------------|
| 1 | Temporal Cloud account setup delays | High — blocks all workflows | Medium | Start Phase 1.2 first; design workflows to degrade gracefully without Temporal |
| 2 | External service API changes | Medium — breaks sync flows | Low | Pin API versions; circuit breakers already in outbox processor |
| 3 | Migration conflicts with existing data | High — data loss possible | Medium | Test migrations on DB copy; use `IF NOT EXISTS` guards; backup before running |
| 4 | Admin UI scope creep per vertical | Medium — schedule slip | High | Use CRUD config patterns; limit initial admin pages to list + detail + form |
| 5 | Stripe webhook signature failures | High — payments broken | Low | Test with Stripe CLI webhook forwarding; log all verification failures |
| 6 | Cross-module link migrations break existing join tables | High — data loss | Low | Check for existing join tables before creating; `defineLink` is idempotent |
| 7 | 28 services needing custom logic overwhelms capacity | Medium — delayed delivery | High | Prioritize P0/P1 modules; defer P3/P4 to later sprints |
| 8 | Multi-tenant isolation gaps in new code | Critical — data leakage | Medium | Code review checklist: every query includes `tenant_id`; add integration tests |
| 9 | Temporal workflow failures in production | High — orders stuck | Medium | Implement dead-letter queues; add alerting on workflow failures; manual retry UI |
| 10 | ERPNext/Payload CMS version incompatibility | Medium — sync failures | Low | Document tested versions; integration tests with mock servers |

---

## Appendix A: Quick-Reference File Paths

| Category | Path Pattern |
|----------|-------------|
| Module models | `apps/backend/src/modules/<module>/models/*.ts` |
| Module services | `apps/backend/src/modules/<module>/service.ts` |
| Module migrations | `apps/backend/src/modules/<module>/migrations/` |
| API routes (store) | `apps/backend/src/api/store/<endpoint>/route.ts` |
| API routes (admin) | `apps/backend/src/api/admin/<endpoint>/route.ts` |
| Admin UI routes | `apps/backend/src/admin/routes/<module>/page.tsx` |
| Admin UI widgets | `apps/backend/src/admin/widgets/<widget>.tsx` |
| Admin UI hooks | `apps/backend/src/admin/hooks/<hook>.ts` |
| Cross-module links | `apps/backend/src/links/<link-name>.ts` |
| Storefront manage pages | `apps/storefront/src/routes/$tenant/$locale/manage/<module>.tsx` |
| CRUD configs | `apps/storefront/src/components/manage/crud-configs.ts` |
| Integration registry | `apps/backend/src/integrations/orchestrator/integration-registry.ts` |
| Temporal spec | `apps/backend/src/lib/integrations/temporal-spec.ts` |
| CMS registry | `apps/backend/src/lib/platform/cms-registry.ts` |
| CMS hierarchy sync | `apps/backend/src/integrations/cms-hierarchy-sync/engine.ts` |
| Webhook handlers | `apps/backend/src/api/webhooks/<service>/route.ts` |
| Sync tracker | `apps/backend/src/lib/platform/sync-tracker.ts` |
| Outbox processor | `apps/backend/src/lib/platform/outbox-processor.ts` |

## Appendix B: Environment Variables Checklist

| Variable | Service | Phase | Type |
|----------|---------|-------|------|
| `STRIPE_SECRET_KEY` | Stripe | 1.1 | Secret |
| `TEMPORAL_ENDPOINT` | Temporal Cloud | 1.2 | Secret |
| `TEMPORAL_API_KEY` | Temporal Cloud | 1.2 | Secret |
| `TEMPORAL_NAMESPACE` | Temporal Cloud | 1.2 | Env var |
| `PAYLOAD_CMS_URL_DEV` | Payload CMS | 1.3 | Env var |
| `PAYLOAD_API_KEY` | Payload CMS | 1.3 | Secret |
| `ERPNEXT_API_KEY` | ERPNext | 1.4 | Secret |
| `ERPNEXT_API_SECRET` | ERPNext | 1.4 | Secret |
| `ERPNEXT_URL_DEV` | ERPNext | 1.4 | Env var |
| `FLEETBASE_API_KEY` | Fleetbase | 1.5 | Secret |
| `FLEETBASE_URL_DEV` | Fleetbase | 1.5 | Env var |
| `WALTID_URL_DEV` | Walt.id | 1.6 | Env var |
| `WALTID_API_KEY` | Walt.id | 1.6 | Secret |

---

*Document generated: 2026-02-13 | Dakkah CityOS Commerce Platform v2.0*
