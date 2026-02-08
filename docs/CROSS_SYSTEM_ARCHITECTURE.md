# Dakkah CityOS — Cross-System Commerce Architecture

> **Version:** 1.0.0
> **Date:** 2026-02-08
> **Status:** Reference Architecture
> **Audience:** All system teams (Medusa, ERPNext, Fleetbase, Walt.id, Payment Gateways, PayloadCMS, Temporal)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Roles & Responsibilities](#2-system-roles--responsibilities)
3. [Model Distribution by System](#3-model-distribution-by-system)
   - 3.1 Medusa.js — Commerce Engine
   - 3.2 ERPNext — Back-Office ERP
   - 3.3 Fleetbase — Logistics & Fulfillment
   - 3.4 Walt.id — Identity & Credentials
   - 3.5 Payment Gateways — Financial Transactions
   - 3.6 PayloadCMS — Content & Configuration
   - 3.7 Shared / Synced Models (PayloadCMS = Master System)
4. [Temporal Workflow System](#4-temporal-workflow-system)
   - 4.1 Architecture Overview
   - 4.2 Design Principles
   - 4.3 Workflow Catalog
   - 4.4 Signal & Query Contracts
   - 4.5 Error Handling & Retry Policies
5. [Integration Patterns](#5-integration-patterns)
6. [Data Flow Diagrams](#6-data-flow-diagrams)
7. [Security & Compliance](#7-security--compliance)
8. [Appendix](#8-appendix)

---

## 1. Executive Summary

Dakkah CityOS is a multi-tenant, multi-vendor city-scale commerce platform. It distributes ~195 data models across 6 specialized systems, orchestrated by Temporal workflows for cross-system operations.

**Core principle:** Each system owns the models it is best suited to manage. Cross-system coordination happens through Temporal workflows, with the EventOutbox providing an audit trail of all inter-system events.

### System Count Summary

| System | Model Count | Role |
|--------|------------|------|
| Medusa.js | ~75 | Commerce engine, marketplace, B2B |
| ERPNext | ~35 | Accounting, inventory, HR, compliance |
| Fleetbase | ~20 | Delivery, fleet, warehousing |
| Walt.id | ~15 | Identity, credentials, KYC |
| Payment Gateways | ~15 | Money movement, wallets, BNPL |
| PayloadCMS | ~25 | Content, branding, city services |
| Shared/Synced (PayloadCMS-managed) | ~10 | Master data synced via Temporal |
| **Total** | **~195** | |

### Temporal Workflow Count Summary

| Category | Workflow Count |
|----------|---------------|
| Order Lifecycle | 8 |
| Payment & Financial | 7 |
| Marketplace & Vendor | 6 |
| B2B Commerce | 5 |
| Subscription & Billing | 5 |
| Logistics & Fulfillment | 6 |
| Identity & Compliance | 5 |
| Content & Notification | 4 |
| Booking & Services | 4 |
| Platform Operations | 5 |
| **Total** | **~55** |

---

## 2. System Roles & Responsibilities

### 2.1 Medusa.js — Commerce Engine
- **Owns:** Product catalog, cart, checkout, orders, pricing, customers, marketplace, B2B, subscriptions, bookings, reviews, quotes, commissions
- **Does NOT own:** Accounting ledger, physical fulfillment, identity verification, content pages, payment processing internals
- **Integration role:** Source of truth for commerce events. Publishes to EventOutbox → Temporal picks up

### 2.2 ERPNext — Back-Office ERP
- **Owns:** Chart of accounts, general ledger, inventory levels, stock movements, HR, payroll, tax reporting, compliance, supplier management, asset management, budgets
- **Does NOT own:** Customer-facing checkout, real-time delivery tracking, content management
- **Integration role:** Receives order/payment events from Medusa via Temporal. Publishes inventory updates back

### 2.3 Fleetbase — Logistics & Fulfillment
- **Owns:** Delivery orders, driver/fleet management, route optimization, real-time tracking, warehouse operations, proof of delivery, last-mile config
- **Does NOT own:** Product catalog, pricing, payment, accounting
- **Integration role:** Receives fulfillment requests from Medusa via Temporal. Publishes tracking updates back

### 2.4 Walt.id — Identity & Credentials
- **Owns:** Decentralized identities (DIDs), verifiable credentials, KYC verification, digital wallets, credential schemas, consent management
- **Does NOT own:** Commerce transactions, content, delivery
- **Integration role:** Called by Temporal for identity verification during onboarding, high-value transactions, and credential issuance

### 2.5 Payment Gateways (Stripe / Tap / HyperPay)
- **Owns:** Payment intents, payment methods, transaction processing, refunds, disputes, escrow, connected accounts, wallets, BNPL
- **Does NOT own:** Order lifecycle, product data, delivery
- **Integration role:** Called by Temporal for payment capture, refunds, splits, escrow. Webhooks feed back into Medusa

### 2.6 PayloadCMS — Content, Configuration & Master Data
- **Owns:** Pages, blog posts, media, navigation, banners, email/SMS/push templates, storefront themes, SEO, forms, city events, venue profiles, localized content
- **Owns (Master System):** Node hierarchy, Governance, Persona, Translations, Sales Channel mappings, Region-Zone mappings, Store config, Event envelope routing, Audit log aggregation. PayloadCMS is the single source of truth for all shared/synced models — all other systems receive these via Temporal sync workflows
- **Does NOT own:** Transactional data, inventory, payments
- **Integration role:** Master system for platform configuration and shared models. Temporal workflows sync changes from PayloadCMS → all other systems. Also provides content to storefront

---

## 3. Model Distribution by System

### 3.1 Medusa.js — Commerce Engine (~75 models)

#### 3.1.1 Core Commerce (Medusa Built-in) — 18 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 1 | Product | Product catalog entries | product |
| 2 | ProductVariant | SKU-level variants | product_variant |
| 3 | ProductCollection | Product groupings | product_collection |
| 4 | ProductCategory | Product taxonomy | product_category |
| 5 | Cart | Shopping session | cart |
| 6 | Order | Order lifecycle | order |
| 7 | LineItem | Order/cart items | line_item |
| 8 | Customer | Customer accounts | customer |
| 9 | Region | Regional configuration | region |
| 10 | SalesChannel | Multi-channel selling | sales_channel |
| 11 | PriceList | B2B/VIP pricing | price_list |
| 12 | Discount | Promotion rules | discount |
| 13 | GiftCard | Gift card management | gift_card |
| 14 | Return | Return processing | return |
| 15 | Exchange | Product exchanges | exchange |
| 16 | Swap | Product swaps | swap |
| 17 | ClaimOrder | Damage/defect claims | claim_order |
| 18 | Notification | System notifications | notification |

#### 3.1.2 Tenant & Platform — 6 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 19 | Tenant | Multi-tenant isolation | tenant |
| 20 | TenantUser | Tenant RBAC (10 roles, node-scoped) | tenant_user |
| 21 | TenantSettings | Tenant commerce config | tenant_settings |
| 22 | TenantBilling | Platform billing per tenant | tenant_billing |
| 23 | TenantUsageRecord | Usage metering | tenant_usage_record |
| 24 | TenantInvoice | Platform invoices to tenants | tenant_invoice |

#### 3.1.3 Vendor Marketplace — 7 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 25 | Vendor | Marketplace vendor profiles | vendor |
| 26 | VendorUser | Vendor staff accounts | vendor_user |
| 27 | VendorProduct | Vendor-product ownership | vendor_product |
| 28 | VendorOrder | Order split per vendor | vendor_order |
| 29 | VendorOrderItem | Vendor line items | vendor_order_item |
| 30 | VendorAnalyticsSnapshot | Periodic analytics snapshots | vendor_analytics_snapshot |
| 31 | VendorPerformanceMetric | Performance KPIs | vendor_performance_metric |

#### 3.1.4 Commission & Payouts — 4 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 32 | CommissionRule | Commission rate structures | commission_rule |
| 33 | CommissionTransaction | Commission ledger entries | commission_transaction |
| 34 | Payout | Vendor payout records | payout |
| 35 | PayoutTransactionLink | Payout-to-transaction mapping | payout_transaction_link |

#### 3.1.5 B2B Commerce — 9 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 36 | Company | B2B company accounts | company |
| 37 | CompanyUser | Company user roles/limits | company_user |
| 38 | PurchaseOrder | B2B purchase orders | purchase_order |
| 39 | PurchaseOrderItem | PO line items | purchase_order_item |
| 40 | PaymentTerms | Net 30/60 payment terms | payment_terms |
| 41 | TaxExemption | B2B tax exemptions | tax_exemption |
| 42 | ApprovalWorkflow | Purchase approval config | approval_workflow |
| 43 | ApprovalRequest | Approval instances | approval_request |
| 44 | ApprovalAction | Individual approval decisions | approval_action |

#### 3.1.6 Quotes — 2 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 45 | Quote | RFQ/quote management | quote |
| 46 | QuoteItem | Quote line items | quote_item |

#### 3.1.7 Subscriptions — 7 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 47 | Subscription | Active subscriptions | subscription |
| 48 | SubscriptionItem | Subscribed products | subscription_item |
| 49 | SubscriptionPlan | Plan definitions | subscription_plan |
| 50 | SubscriptionDiscount | Plan-level discounts | subscription_discount |
| 51 | BillingCycle | Billing period records | billing_cycle |
| 52 | SubscriptionEvent | Lifecycle events | subscription_event |
| 53 | SubscriptionPause | Pause/resume records | subscription_pause |

#### 3.1.8 Bookings & Services — 7 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 54 | Booking | Service bookings | booking |
| 55 | BookingItem | Booking line items | booking_item |
| 56 | BookingReminder | Reminder scheduling | booking_reminder |
| 57 | ServiceProduct | Bookable product config | service_product |
| 58 | ServiceProvider | Service provider profiles | service_provider |
| 59 | Availability | Provider schedules | availability |
| 60 | AvailabilityException | Schedule overrides | availability_exception |

#### 3.1.9 Reviews & Pricing — 4 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 61 | Review | Product/service reviews | review |
| 62 | VolumePricing | Tiered pricing rules | volume_pricing |
| 63 | VolumePricingTier | Individual price tiers | volume_pricing_tier |
| 64 | Invoice | Order invoices | invoice |
| 65 | InvoiceItem | Invoice line items | invoice_item |

#### 3.1.10 Promotions & Customer (NEW — to build) — 8 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 66 | Coupon | Coupon codes with usage limits | coupon |
| 67 | BundleOffer | Product bundle pricing | bundle_offer |
| 68 | FlashSale | Time-limited deals | flash_sale |
| 69 | WishList | Customer saved items | wish_list |
| 70 | AbandonedCart | Cart recovery tracking | abandoned_cart |
| 71 | CustomerGroup | Customer grouping | customer_group |
| 72 | ReferralProgram | Referral tracking/rewards | referral_program |
| 73 | FeaturedListing | Sponsored/promoted products | featured_listing |

#### 3.1.11 Digital Products (NEW — to build) — 2 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 74 | DigitalAsset | Downloadable files/media | digital_asset |
| 75 | LicenseKey | Software license keys | license_key |

---

### 3.2 ERPNext — Back-Office ERP (~35 models)

#### 3.2.1 Accounting & Finance — 8 models

| # | Model (ERPNext DocType) | Description |
|---|------------------------|-------------|
| 1 | Chart of Accounts | Account structure |
| 2 | Journal Entry | Double-entry bookkeeping |
| 3 | General Ledger Entry | Ledger records |
| 4 | Accounts Receivable | Customer outstanding amounts |
| 5 | Accounts Payable | Vendor/supplier outstanding |
| 6 | Bank Reconciliation | Bank statement matching |
| 7 | Credit Note | Store credits issued |
| 8 | Debit Note | Debit adjustments |

#### 3.2.2 Tax & Compliance — 5 models

| # | Model (ERPNext DocType) | Description |
|---|------------------------|-------------|
| 9 | Tax Rate | Tax rates per region/product type |
| 10 | Tax Zone | Geographic tax jurisdictions |
| 11 | Tax Report | Generated tax filing reports |
| 12 | Compliance Certificate | Business licenses, health permits |
| 13 | Data Retention Policy | GDPR/data retention rules per zone |

#### 3.2.3 Inventory & Stock — 7 models

| # | Model (ERPNext DocType) | Description |
|---|------------------------|-------------|
| 14 | Warehouse (InventoryLocation) | Stock locations |
| 15 | Bin (InventoryLevel) | Stock quantity per location per item |
| 16 | Stock Entry (InventoryMovement) | Stock transfers/adjustments/receipts |
| 17 | Stock Reservation Entry | Reserved inventory for orders |
| 18 | Stock Alert (InventoryAlert) | Low/overstock notifications |
| 19 | Batch | Batch/lot tracking for perishables |
| 20 | Supplier Quotation (SupplierCatalog) | Supplier product listings and costs |

#### 3.2.4 Procurement & Suppliers — 3 models

| # | Model (ERPNext DocType) | Description |
|---|------------------------|-------------|
| 21 | Supplier | Supplier management |
| 22 | Purchase Receipt | Goods received notes |
| 23 | Settlement Report | Periodic vendor settlement reports |

#### 3.2.5 HR & Payroll — 4 models

| # | Model (ERPNext DocType) | Description |
|---|------------------------|-------------|
| 24 | Employee | Employee records |
| 25 | Payroll Entry | Salary processing |
| 26 | Leave Application | Leave management |
| 27 | Attendance | Employee attendance tracking |

#### 3.2.6 Asset Management — 3 models

| # | Model (ERPNext DocType) | Description |
|---|------------------------|-------------|
| 28 | Asset (FixedAsset) | City/company asset register |
| 29 | Asset Maintenance | Maintenance schedules |
| 30 | Asset Depreciation | Depreciation calculations |

#### 3.2.7 Insurance — 3 models

| # | Model (ERPNext DocType) | Description |
|---|------------------------|-------------|
| 31 | Insurance Policy | Business/asset insurance |
| 32 | Insurance Claim | Claim processing |
| 33 | Insurance Premium | Premium payment schedules |

#### 3.2.8 Budgets — 2 models

| # | Model (ERPNext DocType) | Description |
|---|------------------------|-------------|
| 34 | Budget Allocation | Department/project budgets |
| 35 | Cost Center | Cost center tracking |

---

### 3.3 Fleetbase — Logistics & Fulfillment (~20 models)

| # | Model (Fleetbase Resource) | Description |
|---|---------------------------|-------------|
| 1 | Service Area (DeliveryZone) | Geographic delivery boundaries, pricing per zone |
| 2 | Delivery Slot | Schedulable time windows for delivery |
| 3 | Order (DeliveryOrder) | Delivery order lifecycle (pickup → transit → delivered) |
| 4 | Tracking Status (DeliveryTracking) | Real-time GPS tracking events |
| 5 | Driver (CourierProvider) | Driver profiles, credentials, ratings |
| 6 | Fleet | Vehicle fleet groups |
| 7 | Vehicle | Individual vehicle records, maintenance status |
| 8 | Route | Optimized delivery routes |
| 9 | Waypoint (RouteWaypoint) | Individual stops on a route |
| 10 | Payload (ShipmentPackage) | Package dimensions, weight, labels |
| 11 | Return Shipment | Reverse logistics tracking |
| 12 | Warehouse (WarehouseLocation) | Fulfillment center profiles |
| 13 | Warehouse Zone | Zones within a warehouse (cold, fragile, etc.) |
| 14 | Pick List | Order picking assignments |
| 15 | Packing Slip | Packing instructions per shipment |
| 16 | Proof of Delivery | Delivery confirmation (photo, signature, code) |
| 17 | Service Rate | Delivery rate calculations |
| 18 | Fuel Log | Fleet fuel consumption tracking |
| 19 | Driver Schedule | Driver shift management |
| 20 | Last Mile Config | Last-mile delivery rules per zone |

---

### 3.4 Walt.id — Identity & Credentials (~15 models)

| # | Model (Walt.id Resource) | Description |
|---|-------------------------|-------------|
| 1 | Decentralized Identity (DID) | W3C DID documents for users/orgs |
| 2 | Verifiable Credential (VC) | Issued W3C Verifiable Credentials |
| 3 | Credential Schema | Templates defining credential structure |
| 4 | Credential Issuance Record | Log of who issued what to whom |
| 5 | Credential Verification Log | Verification attempts and results |
| 6 | Identity Wallet | User's digital credential wallet |
| 7 | KYC Verification | KYC process state machine |
| 8 | KYC Document | Uploaded identity documents |
| 9 | Access Policy | Credential-based access control rules |
| 10 | Municipal Permit | Digitally-signed city permits |
| 11 | Business License | Verifiable business operating licenses |
| 12 | Professional Certification | Professional credentials (healthcare, legal) |
| 13 | Age Verification | Age-gated commerce verification |
| 14 | Residency Proof | Zone-based residency verification |
| 15 | Consent Record | GDPR/privacy consent tracking |

---

### 3.5 Payment Gateways (Stripe / Tap / HyperPay) (~15 models)

| # | Model (Gateway Resource) | Description | Primary Gateway |
|---|-------------------------|-------------|-----------------|
| 1 | Payment Intent | Payment initiation and lifecycle | Stripe/Tap/HyperPay |
| 2 | Payment Method | Stored cards, bank accounts, wallets | Stripe/Tap |
| 3 | Payment Transaction | Completed transaction records | All |
| 4 | Refund | Refund processing and tracking | All |
| 5 | Dispute (Chargeback) | Dispute/chargeback cases | Stripe/Tap |
| 6 | Dispute Evidence | Evidence uploaded for disputes | Stripe |
| 7 | Escrow Hold | Held funds for marketplace | Stripe Connect |
| 8 | Escrow Release | Release events for held funds | Stripe Connect |
| 9 | Connected Account | Vendor payment accounts | Stripe Connect |
| 10 | Transfer (Payment Split) | Split payments to vendors | Stripe Connect |
| 11 | Wallet | Digital wallet balances | Tap/Custom |
| 12 | Wallet Transaction | Wallet top-ups, debits, transfers | Tap/Custom |
| 13 | Installment Plan (BNPL) | Buy-now-pay-later plan setup | Tap/Tamara |
| 14 | Installment Payment | Individual installment records | Tap/Tamara |
| 15 | Loyalty Points & Transactions | Points earning and redemption | Custom |

---

### 3.6 PayloadCMS — Content & Configuration (~25 models)

#### 3.6.1 Core Content — 8 models

| # | Collection/Global | Description |
|---|-------------------|-------------|
| 1 | Page | CMS pages with block-based layout |
| 2 | Blog Post | Blog/news articles |
| 3 | Media | Images, videos, documents |
| 4 | Navigation | Site navigation menus |
| 5 | Menu Item | Individual menu entries |
| 6 | Content Block | Reusable content components |
| 7 | Taxonomy / Tag | Content classification tags |
| 8 | Redirect | URL redirect rules |

#### 3.6.2 Marketing & Communication — 6 models

| # | Collection/Global | Description |
|---|-------------------|-------------|
| 9 | Banner / HeroBanner | Marketing banners with scheduling |
| 10 | Announcement | Platform-wide announcements |
| 11 | Email Template | Transactional email templates (localized) |
| 12 | SMS Template | SMS notification templates |
| 13 | Push Template | Push notification templates |
| 14 | FAQ | Frequently asked questions |

#### 3.6.3 Tenant & Storefront Config — 4 models

| # | Collection/Global | Description |
|---|-------------------|-------------|
| 15 | Storefront Theme | Tenant branding, colors, fonts, logos |
| 16 | SEO Metadata | Per-page/collection SEO configuration |
| 17 | Localized Content | Multi-language content variants (en/fr/ar) |
| 18 | Site Settings (Global) | Global site configuration |

#### 3.6.4 City-Specific Content — 4 models

| # | Collection/Global | Description |
|---|-------------------|-------------|
| 19 | City Event | Public events, festivals, conferences |
| 20 | City Service | Municipal service listings |
| 21 | Venue Profile | Venue/restaurant/facility pages |
| 22 | Property Listing | Real estate listing content |

#### 3.6.5 Interactive Content — 3 models

| # | Collection/Global | Description |
|---|-------------------|-------------|
| 23 | Form Builder | Dynamic form definitions |
| 24 | Form Submission | Form response records |
| 25 | Course Content | Educational/training content |

---

### 3.7 Shared / Synced Models (~10 models) — PayloadCMS = Master System

PayloadCMS is the **master system** (single source of truth) for all shared/synced models. Changes are authored in PayloadCMS and propagated to all other systems via Temporal sync workflows. Other systems hold read replicas of this data and must not modify it directly.

| # | Model | Master System | Synced To | Sync Direction | Temporal Workflow Trigger |
|---|-------|--------------|-----------|----------------|--------------------------|
| 1 | Node (5-level hierarchy) | PayloadCMS | Medusa, ERPNext, Fleetbase | PayloadCMS → Others | node.created / node.updated |
| 2 | GovernanceAuthority | PayloadCMS | Medusa, ERPNext | PayloadCMS → Others | governance.updated |
| 3 | Persona | PayloadCMS | Medusa | PayloadCMS → Medusa | persona.created |
| 4 | PersonaAssignment | PayloadCMS | Medusa | PayloadCMS → Medusa | persona.assigned |
| 5 | EventOutbox | PayloadCMS | All (event bus) | PayloadCMS → All | Every domain event routing |
| 6 | AuditLog | PayloadCMS | ERPNext | PayloadCMS → ERPNext | All auditable actions (aggregated) |
| 7 | SalesChannelMapping | PayloadCMS | Medusa, Fleetbase | PayloadCMS → Others | channel.mapped |
| 8 | RegionZoneMapping | PayloadCMS | Medusa, ERPNext, Fleetbase, Walt.id | PayloadCMS → Others | region.mapped |
| 9 | Translation | PayloadCMS | Medusa | PayloadCMS → Medusa | translation.updated |
| 10 | CityosStore | PayloadCMS | Medusa, ERPNext | PayloadCMS → Others | store.updated |

> **Sync Rule:** All changes to shared models originate in PayloadCMS. Temporal workflows detect changes via PayloadCMS webhooks/events and push updates to target systems. If a target system needs to reference a shared model, it reads from its local synced copy (never calls PayloadCMS directly at runtime).

---

## 4. Temporal Workflow System

### 4.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     TEMPORAL SERVER                              │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │  Task Queue  │  │  Task Queue  │  │  Task Queue  │           │
│  │  medusa-     │  │  erpnext-    │  │  fleetbase-  │           │
│  │  commerce    │  │  backoffice  │  │  logistics   │           │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘            │
│         │                │                │                     │
│  ┌──────┴──────┐  ┌──────┴──────┐  ┌──────┴──────┐            │
│  │  Task Queue  │  │  Task Queue  │  │  Task Queue  │           │
│  │  waltid-     │  │  payment-    │  │  payload-    │           │
│  │  identity    │  │  gateway     │  │  content     │           │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                 │
│  Workflow History │ Timers │ Signals │ Queries │ Schedules      │
└─────────────────────────────────────────────────────────────────┘

Workers per system:
  - medusa-commerce-worker    → Activities that call Medusa APIs
  - erpnext-backoffice-worker → Activities that call ERPNext APIs
  - fleetbase-logistics-worker→ Activities that call Fleetbase APIs
  - waltid-identity-worker    → Activities that call Walt.id APIs
  - payment-gateway-worker    → Activities that call Stripe/Tap/HyperPay APIs
  - payload-content-worker    → Activities that call PayloadCMS APIs
```

### 4.2 Design Principles

1. **Workflow as saga coordinator:** Each workflow orchestrates activities across multiple systems. If any step fails, compensation activities run to undo previous steps.

2. **Idempotency keys:** Every activity call carries an idempotency key derived from `{workflow_id}_{activity_name}_{attempt}`.

3. **Correlation IDs:** All workflows propagate `correlation_id` and `causation_id` from the originating EventOutbox entry.

4. **Tenant isolation:** All workflow IDs are prefixed with `tenant:{tenant_id}:` to prevent cross-tenant interference.

5. **Retry policies (defaults):**

```typescript
const DEFAULT_RETRY_POLICY = {
  initialInterval: '1s',
  backoffCoefficient: 2.0,
  maximumInterval: '5m',
  maximumAttempts: 5,
  nonRetryableErrorTypes: [
    'InvalidArgumentError',
    'InsufficientFundsError',
    'CredentialVerificationFailedError',
    'FraudDetectedError',
  ],
}
```

6. **Timeouts:**

```typescript
const DEFAULT_TIMEOUTS = {
  workflowExecutionTimeout: '24h',     // max total workflow time
  workflowRunTimeout: '1h',            // max single run (before continue-as-new)
  defaultActivityTimeout: '30s',        // default per activity
  paymentActivityTimeout: '2m',         // payment gateway calls
  fulfillmentActivityTimeout: '5m',     // logistics calls
  identityVerificationTimeout: '48h',   // KYC can take days (uses timer)
}
```

7. **Versioning:** All workflows use Temporal's patching API for backward-compatible changes.

8. **Observability:** Every workflow emits:
   - Start/complete/fail metrics to Prometheus
   - Structured logs with correlation_id
   - AuditLog entry via Medusa EventOutbox activity

---

### 4.3 Workflow Catalog

#### 4.3.1 ORDER LIFECYCLE WORKFLOWS

---

##### WF-001: OrderPlacementWorkflow

**Trigger:** `order.placed` event from Medusa EventOutbox
**Task Queue:** `medusa-commerce`
**Estimated Duration:** 30s–2m

```typescript
interface OrderPlacementPayload {
  workflow_id: string                    // "tenant:{tenant_id}:order:{order_id}"
  correlation_id: string
  tenant_id: string
  order_id: string
  customer_id: string
  vendor_orders: {
    vendor_id: string
    vendor_order_id: string
    items: {
      line_item_id: string
      product_id: string
      variant_id: string
      quantity: number
      unit_price: number
    }[]
    subtotal: number
    commission_rate: number
  }[]
  payment: {
    payment_intent_id: string
    gateway: 'stripe' | 'tap' | 'hyperpay'
    amount: number
    currency_code: string
  }
  shipping_address: {
    address_1: string
    city: string
    province: string
    postal_code: string
    country_code: string
    lat?: number
    lng?: number
  }
  requires_identity_verification: boolean
  is_b2b: boolean
  company_id?: string
  purchase_order_id?: string
}
```

**Steps:**

| Step | Activity | System | Compensating Activity |
|------|----------|--------|----------------------|
| 1 | capturePayment | Payment Gateway | refundPayment |
| 2 | verifyIdentity (if required) | Walt.id | — |
| 3 | reserveInventory | ERPNext | releaseInventory |
| 4 | calculateCommissions | Medusa | reverseCommissions |
| 5 | createDeliveryOrder | Fleetbase | cancelDeliveryOrder |
| 6 | createAccountingEntries | ERPNext | reverseAccountingEntries |
| 7 | sendOrderConfirmation | PayloadCMS (template) | — |
| 8 | recordAuditLog | Medusa | — |

**Signals:**
- `payment.captured` — payment gateway webhook confirmation
- `inventory.reserved` — ERPNext stock reservation confirmation
- `delivery.created` — Fleetbase delivery creation confirmation

**Queries:**
- `getOrderStatus()` → returns current step and status
- `getPaymentStatus()` → returns payment capture state

---

##### WF-002: OrderFulfillmentWorkflow

**Trigger:** `order.fulfillment_started` OR Fleetbase `delivery.status_changed`
**Task Queue:** `fleetbase-logistics`
**Estimated Duration:** Minutes to days

```typescript
interface OrderFulfillmentPayload {
  workflow_id: string
  correlation_id: string
  tenant_id: string
  order_id: string
  vendor_order_id: string
  vendor_id: string
  delivery_order_id: string           // Fleetbase delivery ID
  items: {
    line_item_id: string
    sku: string
    quantity: number
    warehouse_id: string
  }[]
  shipping_method: 'standard' | 'express' | 'same_day' | 'pickup'
  delivery_zone_id: string
  delivery_slot?: {
    date: string                      // ISO date
    window_start: string              // "09:00"
    window_end: string                // "12:00"
  }
  recipient: {
    name: string
    phone: string
    address: object
    lat: number
    lng: number
  }
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | generatePickList | Fleetbase |
| 2 | assignDriver | Fleetbase |
| 3 | optimizeRoute | Fleetbase |
| 4 | awaitPickup (signal) | Fleetbase |
| 5 | trackDelivery (polling/signal) | Fleetbase |
| 6 | awaitDeliveryProof (signal) | Fleetbase |
| 7 | confirmDelivery | Medusa |
| 8 | updateInventoryDeducted | ERPNext |
| 9 | triggerVendorPayout (timer: T+7 days) | Medusa |

**Signals:**
- `driver.assigned` — driver accepted the job
- `pickup.completed` — goods picked up
- `delivery.in_transit` — en route
- `delivery.completed` — delivered with proof
- `delivery.failed` — delivery attempt failed
- `delivery.returned` — returned to sender

---

##### WF-003: OrderCancellationWorkflow

**Trigger:** `order.cancel_requested`
**Task Queue:** `medusa-commerce`

```typescript
interface OrderCancellationPayload {
  workflow_id: string
  correlation_id: string
  tenant_id: string
  order_id: string
  vendor_order_ids: string[]
  reason: string
  requested_by: string                // customer_id or admin user_id
  refund_amount: number
  currency_code: string
  payment_intent_id: string
  gateway: string
  delivery_order_id?: string          // if already in fulfillment
  has_inventory_reserved: boolean
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | cancelDeliveryOrder (if exists) | Fleetbase |
| 2 | releaseInventory | ERPNext |
| 3 | reverseCommissions | Medusa |
| 4 | processRefund | Payment Gateway |
| 5 | reverseAccountingEntries | ERPNext |
| 6 | updateOrderStatus | Medusa |
| 7 | sendCancellationNotification | PayloadCMS |
| 8 | recordAuditLog | Medusa |

---

##### WF-004: ReturnAndRefundWorkflow

**Trigger:** `return.requested`
**Task Queue:** `medusa-commerce`

```typescript
interface ReturnRefundPayload {
  workflow_id: string
  correlation_id: string
  tenant_id: string
  order_id: string
  return_id: string
  customer_id: string
  items: {
    line_item_id: string
    quantity: number
    reason: string
    condition: 'unopened' | 'opened' | 'damaged' | 'defective'
  }[]
  return_method: 'pickup' | 'drop_off' | 'mail'
  refund_method: 'original_payment' | 'store_credit' | 'exchange'
  original_payment_intent_id: string
  gateway: string
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | validateReturnEligibility | Medusa |
| 2 | createReturnShipment | Fleetbase |
| 3 | awaitReturnReceipt (signal) | Fleetbase |
| 4 | inspectReturnItems | ERPNext |
| 5 | processRefund OR issueCreditNote | Payment Gateway / ERPNext |
| 6 | restockItems (if applicable) | ERPNext |
| 7 | reverseCommissions (partial) | Medusa |
| 8 | sendRefundConfirmation | PayloadCMS |
| 9 | recordAuditLog | Medusa |

---

##### WF-005: OrderDisputeWorkflow

**Trigger:** `dispute.opened` (payment gateway webhook)
**Task Queue:** `payment-gateway`

```typescript
interface OrderDisputePayload {
  workflow_id: string
  correlation_id: string
  tenant_id: string
  order_id: string
  dispute_id: string                  // gateway dispute ID
  gateway: string
  amount: number
  currency_code: string
  reason: string
  evidence_due_by: string             // ISO datetime
  vendor_id?: string
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | freezePayoutForVendor | Medusa |
| 2 | gatherOrderEvidence | Medusa |
| 3 | gatherDeliveryEvidence | Fleetbase |
| 4 | submitDisputeEvidence | Payment Gateway |
| 5 | awaitDisputeResolution (signal, timer: evidence_due_by) | Payment Gateway |
| 6 | applyDisputeOutcome | Medusa, ERPNext |
| 7 | notifyVendor | PayloadCMS |
| 8 | recordAuditLog | Medusa |

---

##### WF-006: OrderSplitAndRoutingWorkflow

**Trigger:** `cart.completed` (multi-vendor cart)
**Task Queue:** `medusa-commerce`

```typescript
interface OrderSplitPayload {
  workflow_id: string
  correlation_id: string
  tenant_id: string
  order_id: string
  customer_id: string
  items_by_vendor: {
    vendor_id: string
    items: { variant_id: string; quantity: number; price: number }[]
    fulfillment_zone: string
    warehouse_id: string
  }[]
  total_amount: number
  payment_intent_id: string
  gateway: string
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | splitOrderByVendor | Medusa |
| 2 | calculateCommissionsPerVendor | Medusa |
| 3 | splitPayment | Payment Gateway |
| 4 | createVendorOrders | Medusa |
| 5 | createDeliveryOrdersPerVendor | Fleetbase |
| 6 | notifyVendors | PayloadCMS |

---

##### WF-007: NoShowCheckWorkflow

**Trigger:** Scheduled — runs every 15 minutes
**Task Queue:** `medusa-commerce`

```typescript
interface NoShowCheckPayload {
  workflow_id: string
  tenant_id: string
  check_window_minutes: number         // e.g., 30 minutes past booking time
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | findOverdueBookings | Medusa |
| 2 | markAsNoShow | Medusa |
| 3 | applyNoShowFee (if configured) | Payment Gateway |
| 4 | notifyCustomer | PayloadCMS |
| 5 | freeProviderSlot | Medusa |

---

##### WF-008: OrderReviewReminderWorkflow

**Trigger:** `delivery.completed` + timer (T+3 days)
**Task Queue:** `payload-content`

```typescript
interface ReviewReminderPayload {
  workflow_id: string
  tenant_id: string
  order_id: string
  customer_id: string
  customer_email: string
  products: { product_id: string; title: string; thumbnail?: string }[]
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | waitForReviewWindow (timer: 3 days) | Temporal |
| 2 | checkIfAlreadyReviewed | Medusa |
| 3 | sendReviewReminder | PayloadCMS |
| 4 | waitForSecondWindow (timer: 7 days) | Temporal |
| 5 | sendFinalReminder (if still no review) | PayloadCMS |

---

#### 4.3.2 PAYMENT & FINANCIAL WORKFLOWS

---

##### WF-009: PaymentCaptureWorkflow

**Trigger:** `checkout.completed`
**Task Queue:** `payment-gateway`

```typescript
interface PaymentCapturePayload {
  workflow_id: string
  correlation_id: string
  tenant_id: string
  order_id: string
  payment_intent_id: string
  gateway: 'stripe' | 'tap' | 'hyperpay'
  amount: number
  currency_code: string
  capture_method: 'immediate' | 'manual'
  customer_id: string
  vendor_splits?: {
    vendor_id: string
    connected_account_id: string
    amount: number
    commission_amount: number
  }[]
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | capturePaymentIntent | Payment Gateway |
| 2 | splitPaymentToVendors (if marketplace) | Payment Gateway |
| 3 | holdPlatformCommission | Payment Gateway |
| 4 | recordTransaction | Medusa |
| 5 | createAccountingEntry | ERPNext |
| 6 | recordAuditLog | Medusa |

---

##### WF-010: VendorPayoutWorkflow

**Trigger:** Scheduled (daily) OR `payout.requested`
**Task Queue:** `payment-gateway`

```typescript
interface VendorPayoutPayload {
  workflow_id: string
  correlation_id: string
  tenant_id: string
  payout_id: string
  vendor_id: string
  connected_account_id: string
  amount: number
  currency_code: string
  commission_transactions: string[]    // IDs of included transactions
  payout_method: 'bank_transfer' | 'stripe_connect' | 'wallet'
  settlement_period: string            // "2026-02-01 to 2026-02-07"
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | validatePayoutEligibility | Medusa |
| 2 | verifyVendorIdentity (if first payout) | Walt.id |
| 3 | calculateNetPayout | Medusa |
| 4 | initiateTransfer | Payment Gateway |
| 5 | awaitTransferCompletion (signal) | Payment Gateway |
| 6 | updatePayoutStatus | Medusa |
| 7 | createSettlementReport | ERPNext |
| 8 | notifyVendor | PayloadCMS |

---

##### WF-011: EscrowManagementWorkflow

**Trigger:** `order.placed` (marketplace with escrow)
**Task Queue:** `payment-gateway`

```typescript
interface EscrowPayload {
  workflow_id: string
  correlation_id: string
  tenant_id: string
  order_id: string
  vendor_order_id: string
  vendor_id: string
  amount: number
  currency_code: string
  escrow_period_days: number           // e.g., 7 days after delivery
  release_conditions: ('delivery_confirmed' | 'no_dispute' | 'review_period_passed')[]
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | holdFundsInEscrow | Payment Gateway |
| 2 | awaitDeliveryConfirmation (signal) | Fleetbase |
| 3 | startDisputeWindow (timer) | Temporal |
| 4 | checkForDisputes | Payment Gateway |
| 5 | releaseFunds OR holdForDispute | Payment Gateway |
| 6 | updatePayoutLedger | Medusa |
| 7 | createAccountingEntry | ERPNext |

---

##### WF-012: InstallmentPaymentWorkflow (BNPL)

**Trigger:** `order.placed` with installment plan
**Task Queue:** `payment-gateway`

```typescript
interface InstallmentPayload {
  workflow_id: string
  correlation_id: string
  tenant_id: string
  order_id: string
  customer_id: string
  plan: {
    total_amount: number
    currency_code: string
    num_installments: number
    interval: 'weekly' | 'biweekly' | 'monthly'
    first_payment_amount: number
    recurring_amount: number
    fees: number
  }
  payment_method_id: string
  gateway: string
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | chargeFirstInstallment | Payment Gateway |
| 2 | loop: scheduleNextInstallment (timer) | Temporal |
| 3 | chargeInstallment | Payment Gateway |
| 4 | handlePaymentFailure (retry 3x, then notify) | Payment Gateway, PayloadCMS |
| 5 | updateInstallmentStatus | Medusa |
| 6 | finalInstallmentComplete → closeplan | Medusa |

**Signals:**
- `installment.paid` — payment webhook
- `installment.failed` — payment failure
- `plan.cancelled` — early cancellation

---

##### WF-013: LoyaltyPointsWorkflow

**Trigger:** `order.completed`, `review.submitted`, `referral.converted`
**Task Queue:** `medusa-commerce`

```typescript
interface LoyaltyPointsPayload {
  workflow_id: string
  tenant_id: string
  customer_id: string
  trigger_event: 'purchase' | 'review' | 'referral' | 'birthday' | 'manual'
  order_id?: string
  amount_spent?: number
  currency_code?: string
  points_rule: {
    points_per_currency_unit: number
    bonus_multiplier: number
    max_points_per_transaction?: number
  }
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | calculatePointsEarned | Medusa |
| 2 | creditPoints | Payment Gateway (wallet) |
| 3 | updateCustomerTier (if threshold crossed) | Medusa |
| 4 | notifyCustomer | PayloadCMS |

---

##### WF-014: ReconciliationWorkflow

**Trigger:** Scheduled (daily at 02:00 UTC)
**Task Queue:** `erpnext-backoffice`

```typescript
interface ReconciliationPayload {
  workflow_id: string
  tenant_id: string
  date: string                         // ISO date to reconcile
  gateways: string[]                   // ['stripe', 'tap']
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | fetchGatewayTransactions | Payment Gateway |
| 2 | fetchMedusaTransactions | Medusa |
| 3 | compareAndFindDiscrepancies | ERPNext |
| 4 | createReconciliationReport | ERPNext |
| 5 | flagUnmatchedTransactions | ERPNext |
| 6 | notifyFinanceTeam (if discrepancies) | PayloadCMS |

---

##### WF-015: GiftCardWorkflow

**Trigger:** `gift_card.purchased` OR `gift_card.redeemed`
**Task Queue:** `medusa-commerce`

```typescript
interface GiftCardPayload {
  workflow_id: string
  tenant_id: string
  gift_card_id: string
  action: 'purchase' | 'redeem' | 'expire'
  amount: number
  currency_code: string
  customer_id: string
  recipient_email?: string
}
```

**Steps (purchase):**

| Step | Activity | System |
|------|----------|--------|
| 1 | generateGiftCardCode | Medusa |
| 2 | capturePayment | Payment Gateway |
| 3 | sendGiftCardEmail | PayloadCMS |
| 4 | createAccountingEntry | ERPNext |

---

#### 4.3.3 MARKETPLACE & VENDOR WORKFLOWS

---

##### WF-016: VendorOnboardingWorkflow

**Trigger:** `vendor.registration_submitted`
**Task Queue:** `medusa-commerce`
**Estimated Duration:** Minutes to days (KYC dependent)

```typescript
interface VendorOnboardingPayload {
  workflow_id: string
  correlation_id: string
  tenant_id: string
  vendor_id: string
  owner_user_id: string
  business_info: {
    legal_name: string
    trade_name: string
    tax_id: string
    business_type: 'sole_proprietor' | 'partnership' | 'corporation' | 'llc'
    country_code: string
    address: object
  }
  documents: {
    type: 'trade_license' | 'tax_certificate' | 'bank_statement' | 'id_document'
    file_url: string
  }[]
  bank_details: {
    account_holder: string
    iban?: string
    swift?: string
    account_number?: string
    bank_name: string
  }
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | createVendorRecord | Medusa |
| 2 | initiateKYC | Walt.id |
| 3 | verifyDocuments | Walt.id |
| 4 | awaitKYCApproval (signal, timer: 48h) | Walt.id |
| 5 | createConnectedPaymentAccount | Payment Gateway |
| 6 | issueBusinessCredential | Walt.id |
| 7 | createERPSupplierRecord | ERPNext |
| 8 | setDefaultCommissionRules | Medusa |
| 9 | createVendorStorefrontPage | PayloadCMS |
| 10 | activateVendor | Medusa |
| 11 | sendWelcomeKit | PayloadCMS |
| 12 | recordAuditLog | Medusa |

**Signals:**
- `kyc.approved` — KYC passed
- `kyc.rejected` — KYC failed (with reason)
- `kyc.additional_info_required` — need more documents
- `payment_account.verified` — bank account verified

---

##### WF-017: VendorPerformanceReviewWorkflow

**Trigger:** Scheduled (weekly, Sunday 00:00 UTC)
**Task Queue:** `medusa-commerce`

```typescript
interface VendorPerformancePayload {
  workflow_id: string
  tenant_id: string
  review_period: { start: string; end: string }
  vendor_ids: string[]                 // all active vendors
  thresholds: {
    min_order_fulfillment_rate: number  // e.g., 0.95
    max_cancellation_rate: number       // e.g., 0.05
    min_review_rating: number           // e.g., 3.5
    max_dispute_rate: number            // e.g., 0.02
    max_avg_fulfillment_hours: number   // e.g., 48
  }
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | aggregateOrderMetrics | Medusa |
| 2 | aggregateReviewMetrics | Medusa |
| 3 | aggregateDeliveryMetrics | Fleetbase |
| 4 | calculatePerformanceScores | Medusa |
| 5 | createAnalyticsSnapshots | Medusa |
| 6 | flagUnderperformingVendors | Medusa |
| 7 | sendPerformanceReports | PayloadCMS |
| 8 | applyPenalties (if thresholds breached) | Medusa |

---

##### WF-018: VendorProductApprovalWorkflow

**Trigger:** `vendor_product.submitted`
**Task Queue:** `medusa-commerce`

```typescript
interface ProductApprovalPayload {
  workflow_id: string
  tenant_id: string
  vendor_id: string
  product_id: string
  product_data: {
    title: string
    description: string
    category_ids: string[]
    variants: { sku: string; price: number }[]
    images: string[]
  }
  requires_compliance_check: boolean
  product_category_rules?: {
    requires_license: boolean
    restricted_zones: string[]
  }
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | validateProductData | Medusa |
| 2 | checkCategoryCompliance | ERPNext |
| 3 | verifyVendorLicense (if required) | Walt.id |
| 4 | contentModerationCheck | PayloadCMS / external |
| 5 | autoApprove OR queueForManualReview | Medusa |
| 6 | awaitManualApproval (signal, timer: 72h) | Medusa |
| 7 | publishProduct | Medusa |
| 8 | syncToERPCatalog | ERPNext |
| 9 | notifyVendor | PayloadCMS |

---

##### WF-019: CommissionRecalculationWorkflow

**Trigger:** `commission_rule.updated` OR `order.refunded` (partial)
**Task Queue:** `medusa-commerce`

```typescript
interface CommissionRecalcPayload {
  workflow_id: string
  tenant_id: string
  trigger: 'rule_change' | 'partial_refund' | 'adjustment'
  commission_rule_id?: string
  order_id?: string
  vendor_id?: string
  recalc_scope: 'single_order' | 'vendor_all_pending' | 'global'
  effective_date: string
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | fetchAffectedTransactions | Medusa |
| 2 | recalculateCommissions | Medusa |
| 3 | createAdjustmentTransactions | Medusa |
| 4 | updatePayoutLedger | Medusa |
| 5 | updateAccountingEntries | ERPNext |
| 6 | notifyAffectedVendors | PayloadCMS |

---

##### WF-020: VendorSuspensionWorkflow

**Trigger:** Manual admin action OR automated performance threshold breach
**Task Queue:** `medusa-commerce`

```typescript
interface VendorSuspensionPayload {
  workflow_id: string
  tenant_id: string
  vendor_id: string
  reason: string
  suspension_type: 'temporary' | 'permanent'
  duration_days?: number
  initiated_by: string
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | deactivateVendorProducts | Medusa |
| 2 | pausePendingPayouts | Medusa |
| 3 | reassignPendingOrders (if any) | Medusa, Fleetbase |
| 4 | revokeVendorCredentials | Walt.id |
| 5 | notifyVendor | PayloadCMS |
| 6 | notifyAffectedCustomers | PayloadCMS |
| 7 | scheduleReactivation (if temporary, timer) | Temporal |
| 8 | recordAuditLog | Medusa |

---

##### WF-021: MarketplaceSettlementWorkflow

**Trigger:** Scheduled (weekly or biweekly)
**Task Queue:** `erpnext-backoffice`

```typescript
interface SettlementPayload {
  workflow_id: string
  tenant_id: string
  settlement_period: { start: string; end: string }
  vendor_ids: string[]
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | aggregateCommissionTransactions | Medusa |
| 2 | deductPendingRefunds | Medusa |
| 3 | deductPlatformFees | Medusa |
| 4 | generateSettlementReports | ERPNext |
| 5 | initiatePayouts (batch) | Payment Gateway |
| 6 | sendSettlementStatements | PayloadCMS |
| 7 | createAccountingEntries | ERPNext |
| 8 | recordAuditLog | Medusa |

---

#### 4.3.4 B2B COMMERCE WORKFLOWS

---

##### WF-022: PurchaseOrderApprovalWorkflow

**Trigger:** `purchase_order.submitted`
**Task Queue:** `medusa-commerce`

```typescript
interface POApprovalPayload {
  workflow_id: string
  correlation_id: string
  tenant_id: string
  purchase_order_id: string
  company_id: string
  submitted_by: string                 // company_user_id
  total_amount: number
  currency_code: string
  approval_workflow_id: string
  steps: {
    step_number: number
    approver_role: string
    approver_ids: string[]
    threshold_amount?: number
    auto_approve_below?: number
  }[]
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | validatePOAgainstSpendingLimits | Medusa |
| 2 | checkBudgetAvailability | ERPNext |
| 3 | routeToApprovers (per step) | Medusa |
| 4 | awaitApproval (signal per step, timer: 72h) | Medusa |
| 5 | escalateIfTimeout | PayloadCMS |
| 6 | convertPOToOrder (if approved) | Medusa |
| 7 | updateCreditUsed | Medusa |
| 8 | notifySubmitter | PayloadCMS |
| 9 | recordAuditLog | Medusa |

**Signals:**
- `approval.approved` — approver approved
- `approval.rejected` — approver rejected (with reason)
- `approval.delegated` — forwarded to another approver

---

##### WF-023: QuoteNegotiationWorkflow

**Trigger:** `quote.requested`
**Task Queue:** `medusa-commerce`

```typescript
interface QuoteNegotiationPayload {
  workflow_id: string
  tenant_id: string
  quote_id: string
  company_id: string
  customer_id: string
  requested_items: {
    product_id: string
    variant_id: string
    quantity: number
    requested_price?: number
  }[]
  delivery_requirements?: {
    delivery_date: string
    location: object
  }
  max_negotiation_rounds: number       // e.g., 3
  expiry_days: number                  // e.g., 14
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | calculateInitialQuote (volume pricing) | Medusa |
| 2 | checkInventoryAvailability | ERPNext |
| 3 | sendQuoteToCustomer | PayloadCMS |
| 4 | awaitCustomerResponse (signal, timer: expiry) | Medusa |
| 5 | handleCounterOffer (loop up to max rounds) | Medusa |
| 6 | finalizeQuote | Medusa |
| 7 | convertToPurchaseOrder (if accepted) | Medusa |
| 8 | recordAuditLog | Medusa |

**Signals:**
- `quote.accepted` — customer accepted
- `quote.countered` — customer counter-offered
- `quote.rejected` — customer rejected
- `quote.expired` — timer expired

---

##### WF-024: CreditLimitReviewWorkflow

**Trigger:** `company.credit_limit_review_requested` OR scheduled (quarterly)
**Task Queue:** `medusa-commerce`

```typescript
interface CreditLimitReviewPayload {
  workflow_id: string
  tenant_id: string
  company_id: string
  current_credit_limit: number
  requested_credit_limit?: number
  review_data: {
    payment_history_months: number
    total_orders: number
    total_spent: number
    average_days_to_pay: number
    late_payments: number
    current_credit_used: number
  }
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | gatherPaymentHistory | ERPNext |
| 2 | calculateCreditScore | ERPNext |
| 3 | checkCompanyCredentials | Walt.id |
| 4 | proposeNewLimit | Medusa |
| 5 | routeForApproval (if above threshold) | Medusa |
| 6 | updateCreditLimit | Medusa |
| 7 | notifyCompany | PayloadCMS |
| 8 | recordAuditLog | Medusa |

---

##### WF-025: CompanyOnboardingWorkflow

**Trigger:** `company.registration_submitted`
**Task Queue:** `medusa-commerce`

```typescript
interface CompanyOnboardingPayload {
  workflow_id: string
  tenant_id: string
  company_id: string
  admin_user_id: string
  business_info: {
    name: string
    legal_name: string
    tax_id: string
    industry: string
    employee_count: number
    country_code: string
    address: object
  }
  documents: {
    type: 'trade_license' | 'tax_certificate' | 'tax_exemption_cert'
    file_url: string
  }[]
  requested_tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  requested_payment_terms: string
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | createCompanyRecord | Medusa |
| 2 | verifyBusinessDocuments | Walt.id |
| 3 | issueBusinessCredentials | Walt.id |
| 4 | createERPCustomerAccount | ERPNext |
| 5 | assignPaymentTerms | Medusa |
| 6 | setInitialCreditLimit | Medusa |
| 7 | processTaxExemptions | Medusa, ERPNext |
| 8 | setupApprovalWorkflows | Medusa |
| 9 | sendWelcomeKit | PayloadCMS |
| 10 | recordAuditLog | Medusa |

---

##### WF-026: B2BInvoicingWorkflow

**Trigger:** `order.completed` (B2B order with payment terms)
**Task Queue:** `erpnext-backoffice`

```typescript
interface B2BInvoicingPayload {
  workflow_id: string
  tenant_id: string
  order_id: string
  company_id: string
  invoice_id: string
  payment_terms_id: string
  net_days: number
  amount: number
  currency_code: string
  early_payment_discount?: {
    percent: number
    days: number
  }
  line_items: {
    product_id: string
    title: string
    quantity: number
    unit_price: number
    tax_amount: number
  }[]
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | generateInvoice | Medusa |
| 2 | createAccountsReceivable | ERPNext |
| 3 | sendInvoice | PayloadCMS |
| 4 | schedulePaymentReminder (timer: due_date - 7d) | Temporal |
| 5 | sendPaymentReminder | PayloadCMS |
| 6 | awaitPayment (signal, timer: due_date + grace) | Payment Gateway |
| 7 | markAsPaid OR markAsOverdue | Medusa, ERPNext |
| 8 | applyLateFees (if overdue) | ERPNext |
| 9 | escalateToCollections (if > 90 days) | ERPNext |

**Signals:**
- `payment.received` — payment captured
- `payment.partial` — partial payment received

---

#### 4.3.5 SUBSCRIPTION & BILLING WORKFLOWS

---

##### WF-027: SubscriptionLifecycleWorkflow

**Trigger:** `subscription.created`
**Task Queue:** `medusa-commerce`
**Duration:** Long-running (months/years, uses continue-as-new)

```typescript
interface SubscriptionLifecyclePayload {
  workflow_id: string
  tenant_id: string
  subscription_id: string
  customer_id: string
  plan_id: string
  billing_interval: 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  billing_anchor_date: string
  payment_method_id: string
  gateway: string
  items: {
    product_id: string
    variant_id: string
    quantity: number
    unit_price: number
  }[]
  trial_days?: number
}
```

**Steps (recurring loop):**

| Step | Activity | System |
|------|----------|--------|
| 1 | startTrialPeriod (if trial_days) | Temporal timer |
| 2 | createBillingCycle | Medusa |
| 3 | calculateBillingAmount (with discounts) | Medusa |
| 4 | chargeSubscription | Payment Gateway |
| 5 | handlePaymentFailure (retry 3x over 7 days) | Payment Gateway |
| 6 | createSubscriptionOrder | Medusa |
| 7 | createFulfillment (if physical) | Fleetbase |
| 8 | createAccountingEntry | ERPNext |
| 9 | sendBillingReceipt | PayloadCMS |
| 10 | scheduleNextBillingCycle (timer) | Temporal |
| 11 | continue-as-new (every 30 cycles) | Temporal |

**Signals:**
- `subscription.paused` — customer paused
- `subscription.resumed` — customer resumed
- `subscription.cancelled` — customer cancelled
- `subscription.plan_changed` — upgrade/downgrade
- `subscription.payment_method_updated` — new payment method
- `subscription.discount_applied` — new discount added

---

##### WF-028: SubscriptionTrialEndWorkflow

**Trigger:** Timer from SubscriptionLifecycleWorkflow (trial_days)
**Task Queue:** `medusa-commerce`

```typescript
interface TrialEndPayload {
  workflow_id: string
  tenant_id: string
  subscription_id: string
  customer_id: string
  plan_id: string
  payment_method_id: string
  first_billing_amount: number
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | sendTrialEndingReminder (3 days before) | PayloadCMS |
| 2 | validatePaymentMethod | Payment Gateway |
| 3 | chargeFirstBilling | Payment Gateway |
| 4 | activateSubscription | Medusa |
| 5 | sendActivationConfirmation | PayloadCMS |
| 6 | OR cancelIfNoPaymentMethod | Medusa |

---

##### WF-029: SubscriptionDunningWorkflow

**Trigger:** `subscription.payment_failed`
**Task Queue:** `payment-gateway`

```typescript
interface DunningPayload {
  workflow_id: string
  tenant_id: string
  subscription_id: string
  customer_id: string
  billing_cycle_id: string
  amount: number
  currency_code: string
  attempt_number: number
  max_attempts: number                 // e.g., 4
  retry_schedule: number[]             // e.g., [1, 3, 5, 7] days
  payment_method_id: string
  gateway: string
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | sendPaymentFailureNotice | PayloadCMS |
| 2 | waitRetryPeriod (timer) | Temporal |
| 3 | retryPayment | Payment Gateway |
| 4 | if success: updateBillingCycle | Medusa |
| 5 | if fail and attempts < max: goto step 1 | — |
| 6 | if fail and attempts >= max: pauseSubscription | Medusa |
| 7 | sendFinalNotice | PayloadCMS |
| 8 | scheduleGracePeriodCancellation (timer: 14 days) | Temporal |
| 9 | cancelSubscription (if no payment) | Medusa |

---

##### WF-030: SubscriptionUpgradeDowngradeWorkflow

**Trigger:** `subscription.plan_change_requested`
**Task Queue:** `medusa-commerce`

```typescript
interface PlanChangePayload {
  workflow_id: string
  tenant_id: string
  subscription_id: string
  customer_id: string
  current_plan_id: string
  new_plan_id: string
  change_type: 'upgrade' | 'downgrade'
  proration_method: 'immediate' | 'next_billing_cycle' | 'prorated_now'
  current_period_end: string
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | calculateProration | Medusa |
| 2 | chargeOrCreditDifference | Payment Gateway |
| 3 | updateSubscriptionPlan | Medusa |
| 4 | updateERPBillingSchedule | ERPNext |
| 5 | sendConfirmation | PayloadCMS |

---

##### WF-031: SubscriptionCancellationWorkflow

**Trigger:** `subscription.cancel_requested`
**Task Queue:** `medusa-commerce`

```typescript
interface SubscriptionCancelPayload {
  workflow_id: string
  tenant_id: string
  subscription_id: string
  customer_id: string
  cancellation_type: 'immediate' | 'end_of_period'
  reason: string
  refund_prorated: boolean
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | cancelPendingFulfillments | Fleetbase |
| 2 | calculateProratedRefund (if applicable) | Medusa |
| 3 | processRefund (if applicable) | Payment Gateway |
| 4 | deactivateSubscription | Medusa |
| 5 | sendCancellationSurvey | PayloadCMS |
| 6 | updateAccountingEntries | ERPNext |
| 7 | scheduleWinBackCampaign (timer: 30d) | PayloadCMS |
| 8 | recordAuditLog | Medusa |

---

#### 4.3.6 LOGISTICS & FULFILLMENT WORKFLOWS

---

##### WF-032: WarehouseReceivingWorkflow

**Trigger:** `purchase_receipt.created` (ERPNext)
**Task Queue:** `fleetbase-logistics`

```typescript
interface WarehouseReceivingPayload {
  workflow_id: string
  tenant_id: string
  purchase_receipt_id: string
  supplier_id: string
  warehouse_id: string
  items: {
    product_id: string
    variant_id: string
    sku: string
    expected_quantity: number
    batch_number?: string
    expiry_date?: string
  }[]
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | createReceivingTask | Fleetbase |
| 2 | awaitInspection (signal) | Fleetbase |
| 3 | updateInventoryLevels | ERPNext |
| 4 | assignWarehouseZones | Fleetbase |
| 5 | updateProductAvailability | Medusa |
| 6 | recordAuditLog | Medusa |

---

##### WF-033: InventorySyncWorkflow

**Trigger:** Scheduled (every 15 minutes) OR `stock.level_changed`
**Task Queue:** `erpnext-backoffice`

```typescript
interface InventorySyncPayload {
  workflow_id: string
  tenant_id: string
  sync_type: 'full' | 'delta'
  changed_variants?: string[]          // for delta sync
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | fetchERPInventoryLevels | ERPNext |
| 2 | compareWithMedusaLevels | Medusa |
| 3 | updateMedusaStockQuantities | Medusa |
| 4 | updateFleetbaseWarehouseLevels | Fleetbase |
| 5 | triggerLowStockAlerts (if needed) | PayloadCMS |
| 6 | markOutOfStockProducts (if zero) | Medusa |

---

##### WF-034: RouteOptimizationWorkflow

**Trigger:** Scheduled (daily) OR `delivery_batch.ready`
**Task Queue:** `fleetbase-logistics`

```typescript
interface RouteOptimizationPayload {
  workflow_id: string
  tenant_id: string
  delivery_zone_id: string
  date: string
  pending_deliveries: {
    delivery_order_id: string
    pickup_location: { lat: number; lng: number }
    dropoff_location: { lat: number; lng: number }
    priority: 'standard' | 'express' | 'same_day'
    time_window?: { start: string; end: string }
    package_weight_kg: number
  }[]
  available_drivers: {
    driver_id: string
    vehicle_type: string
    current_location: { lat: number; lng: number }
    shift_end: string
    max_capacity_kg: number
  }[]
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | calculateOptimalRoutes | Fleetbase |
| 2 | assignDeliveriesToDrivers | Fleetbase |
| 3 | notifyDrivers | Fleetbase |
| 4 | updateEstimatedDeliveryTimes | Medusa |
| 5 | notifyCustomers (ETA updates) | PayloadCMS |

---

##### WF-035: SameDayDeliveryWorkflow

**Trigger:** `order.placed` with same_day shipping
**Task Queue:** `fleetbase-logistics`

```typescript
interface SameDayDeliveryPayload {
  workflow_id: string
  tenant_id: string
  order_id: string
  delivery_order_id: string
  cutoff_time: string                  // e.g., "14:00" local time
  warehouse_id: string
  items: { sku: string; quantity: number; location_in_warehouse: string }[]
  recipient: { name: string; phone: string; address: object; lat: number; lng: number }
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | verifyCutoffTime | Fleetbase |
| 2 | createUrgentPickList | Fleetbase |
| 3 | assignNearestDriver | Fleetbase |
| 4 | trackPickupCompletion (signal) | Fleetbase |
| 5 | optimizeDirectRoute | Fleetbase |
| 6 | trackDelivery (real-time) | Fleetbase |
| 7 | confirmDelivery (signal) | Fleetbase |
| 8 | updateOrderStatus | Medusa |

---

##### WF-036: FleetMaintenanceWorkflow

**Trigger:** Scheduled OR `vehicle.maintenance_due`
**Task Queue:** `fleetbase-logistics`

```typescript
interface FleetMaintenancePayload {
  workflow_id: string
  tenant_id: string
  vehicle_id: string
  maintenance_type: 'scheduled' | 'unscheduled' | 'inspection'
  due_date: string
  mileage_at_due: number
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | markVehicleUnavailable | Fleetbase |
| 2 | reassignPendingDeliveries | Fleetbase |
| 3 | createMaintenanceRecord | ERPNext (asset) |
| 4 | scheduleMaintenanceAppointment | Fleetbase |
| 5 | awaitMaintenanceCompletion (signal) | Fleetbase |
| 6 | markVehicleAvailable | Fleetbase |
| 7 | updateAssetRecord | ERPNext |

---

##### WF-037: LastMileHandoffWorkflow

**Trigger:** `delivery.arrived_at_hub`
**Task Queue:** `fleetbase-logistics`

```typescript
interface LastMileHandoffPayload {
  workflow_id: string
  tenant_id: string
  delivery_order_id: string
  from_driver_id: string
  hub_id: string
  last_mile_zone: string
  packages: { package_id: string; weight_kg: number }[]
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | confirmHubArrival | Fleetbase |
| 2 | sortPackagesByZone | Fleetbase |
| 3 | assignLastMileDriver | Fleetbase |
| 4 | transferCustody | Fleetbase |
| 5 | optimizeLastMileRoute | Fleetbase |
| 6 | dispatchLastMile | Fleetbase |
| 7 | updateTrackingStatus | Medusa |

---

#### 4.3.7 IDENTITY & COMPLIANCE WORKFLOWS

---

##### WF-038: CustomerKYCWorkflow

**Trigger:** `customer.high_value_purchase` OR `customer.kyc_required`
**Task Queue:** `waltid-identity`

```typescript
interface CustomerKYCPayload {
  workflow_id: string
  tenant_id: string
  customer_id: string
  verification_level: 'basic' | 'enhanced' | 'full'
  required_documents: ('id_card' | 'passport' | 'utility_bill' | 'selfie')[]
  purpose: 'age_verification' | 'high_value_purchase' | 'regulatory' | 'account_upgrade'
  residency_zone: string
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | createVerificationSession | Walt.id |
| 2 | sendVerificationLink | PayloadCMS |
| 3 | awaitDocumentUpload (signal, timer: 7d) | Walt.id |
| 4 | verifyDocuments (OCR + liveness) | Walt.id |
| 5 | checkSanctionsList | Walt.id |
| 6 | issueVerifiedCredential | Walt.id |
| 7 | updateCustomerVerificationStatus | Medusa |
| 8 | unlockRestrictedProducts (if applicable) | Medusa |
| 9 | recordAuditLog | Medusa |

---

##### WF-039: CredentialIssuanceWorkflow

**Trigger:** `credential.issue_requested`
**Task Queue:** `waltid-identity`

```typescript
interface CredentialIssuancePayload {
  workflow_id: string
  tenant_id: string
  issuer_did: string
  subject_did: string
  credential_type: 'business_license' | 'professional_cert' | 'municipal_permit' | 'residency_proof' | 'age_verification'
  credential_data: Record<string, unknown>
  schema_id: string
  expiry_date?: string
  revocable: boolean
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | validateSchema | Walt.id |
| 2 | signCredential | Walt.id |
| 3 | storeCredential | Walt.id |
| 4 | issueToWallet | Walt.id |
| 5 | createIssuanceRecord | Walt.id |
| 6 | notifySubject | PayloadCMS |
| 7 | recordAuditLog | Medusa |

---

##### WF-040: PeriodicComplianceCheckWorkflow

**Trigger:** Scheduled (monthly)
**Task Queue:** `waltid-identity`

```typescript
interface ComplianceCheckPayload {
  workflow_id: string
  tenant_id: string
  check_type: 'vendor_licenses' | 'product_compliance' | 'data_retention' | 'credential_expiry'
  scope: 'all_vendors' | 'all_companies' | 'all_credentials'
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | fetchExpiringCredentials | Walt.id |
| 2 | fetchExpiredBusinessLicenses | ERPNext |
| 3 | checkDataRetentionPolicies | ERPNext |
| 4 | flagNonCompliantEntities | Medusa |
| 5 | sendRenewalNotices | PayloadCMS |
| 6 | suspendExpiredVendors (if grace period exceeded) | Medusa |
| 7 | generateComplianceReport | ERPNext |
| 8 | recordAuditLog | Medusa |

---

##### WF-041: ConsentManagementWorkflow

**Trigger:** `customer.consent_updated` OR GDPR request
**Task Queue:** `waltid-identity`

```typescript
interface ConsentManagementPayload {
  workflow_id: string
  tenant_id: string
  customer_id: string
  request_type: 'consent_update' | 'data_export' | 'data_deletion' | 'right_to_forget'
  consent_changes?: {
    marketing_email: boolean
    marketing_sms: boolean
    analytics_tracking: boolean
    third_party_sharing: boolean
  }
  residency_zone: string              // determines applicable regulations
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | updateConsentRecord | Walt.id |
| 2 | propagateConsentToSystems | All systems |
| 3 | exportCustomerData (if requested) | Medusa, ERPNext |
| 4 | deleteCustomerData (if right_to_forget) | All systems |
| 5 | sendConfirmation | PayloadCMS |
| 6 | recordAuditLog | Medusa |

---

##### WF-042: AgeVerificationWorkflow

**Trigger:** `cart.contains_age_restricted_product`
**Task Queue:** `waltid-identity`

```typescript
interface AgeVerificationPayload {
  workflow_id: string
  tenant_id: string
  customer_id: string
  cart_id: string
  required_age: number
  verification_method: 'credential_check' | 'id_upload' | 'third_party'
  product_ids: string[]
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | checkExistingAgeCredential | Walt.id |
| 2 | if valid: approveCheckout | Medusa |
| 3 | if not: requestAgeVerification | Walt.id |
| 4 | awaitVerification (signal, timer: 24h) | Walt.id |
| 5 | verifyAge | Walt.id |
| 6 | issueAgeCredential (for future use) | Walt.id |
| 7 | approveOrBlockCheckout | Medusa |

---

#### 4.3.8 CONTENT & NOTIFICATION WORKFLOWS

---

##### WF-043: TransactionalNotificationWorkflow

**Trigger:** Any commerce event requiring customer notification
**Task Queue:** `payload-content`

```typescript
interface NotificationPayload {
  workflow_id: string
  tenant_id: string
  template_id: string
  channels: ('email' | 'sms' | 'push' | 'in_app')[]
  recipient: {
    customer_id: string
    email?: string
    phone?: string
    push_token?: string
    locale: 'en' | 'fr' | 'ar'
  }
  variables: Record<string, unknown>   // template variables
  priority: 'high' | 'normal' | 'low'
  scheduled_at?: string               // for delayed sending
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | fetchTemplate (localized) | PayloadCMS |
| 2 | renderTemplate | PayloadCMS |
| 3 | sendEmail (if channel includes email) | PayloadCMS / SMTP |
| 4 | sendSMS (if channel includes sms) | PayloadCMS / Twilio |
| 5 | sendPush (if channel includes push) | PayloadCMS / FCM |
| 6 | recordNotificationLog | Medusa |

---

##### WF-044: ContentPublishingWorkflow

**Trigger:** `content.publish_requested` (PayloadCMS)
**Task Queue:** `payload-content`

```typescript
interface ContentPublishPayload {
  workflow_id: string
  tenant_id: string
  content_type: 'page' | 'blog_post' | 'banner' | 'announcement'
  content_id: string
  locales: string[]
  publish_at?: string
  requires_approval: boolean
  approver_ids?: string[]
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | validateContent | PayloadCMS |
| 2 | routeForApproval (if required) | PayloadCMS |
| 3 | awaitApproval (signal) | PayloadCMS |
| 4 | publishContent | PayloadCMS |
| 5 | invalidateCDNCache | PayloadCMS |
| 6 | notifySubscribers (if blog) | PayloadCMS |
| 7 | recordAuditLog | Medusa |

---

##### WF-045: TenantBrandingSyncWorkflow

**Trigger:** `tenant.branding_updated`
**Task Queue:** `payload-content`

```typescript
interface BrandingSyncPayload {
  workflow_id: string
  tenant_id: string
  branding: {
    logo_url: string
    favicon_url: string
    primary_color: string
    secondary_color: string
    font_family: string
    custom_css?: string
  }
  affected_storefronts: string[]
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | updateStorefrontTheme | PayloadCMS |
| 2 | generateDesignTokens | Medusa (design-runtime) |
| 3 | updateEmailTemplates | PayloadCMS |
| 4 | invalidateCache | PayloadCMS |
| 5 | notifyTenantAdmin | PayloadCMS |

---

##### WF-046: AbandonedCartRecoveryWorkflow

**Trigger:** `cart.abandoned` (no activity for 1 hour with items)
**Task Queue:** `payload-content`

```typescript
interface AbandonedCartPayload {
  workflow_id: string
  tenant_id: string
  cart_id: string
  customer_id: string
  customer_email: string
  locale: string
  items: {
    product_id: string
    title: string
    thumbnail?: string
    quantity: number
    unit_price: number
  }[]
  total: number
  currency_code: string
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | wait1Hour | Temporal timer |
| 2 | checkIfCartCompleted | Medusa |
| 3 | sendReminder1 (gentle reminder) | PayloadCMS |
| 4 | wait24Hours | Temporal timer |
| 5 | checkIfCartCompleted | Medusa |
| 6 | sendReminder2 (with incentive/coupon) | PayloadCMS |
| 7 | wait72Hours | Temporal timer |
| 8 | sendFinalReminder | PayloadCMS |
| 9 | trackConversion | Medusa |

---

#### 4.3.9 BOOKING & SERVICES WORKFLOWS

---

##### WF-047: BookingLifecycleWorkflow

**Trigger:** `booking.created`
**Task Queue:** `medusa-commerce`

```typescript
interface BookingLifecyclePayload {
  workflow_id: string
  tenant_id: string
  booking_id: string
  customer_id: string
  service_product_id: string
  provider_id: string
  scheduled_at: string
  start_time: string
  end_time: string
  price: number
  currency_code: string
  payment_intent_id: string
  gateway: string
  reminders: {
    type: 'email' | 'sms' | 'push'
    send_before_minutes: number
  }[]
  cancellation_policy: 'flexible' | 'moderate' | 'strict'
  cancellation_deadline_hours: number
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | capturePayment (or authorize) | Payment Gateway |
| 2 | confirmBooking | Medusa |
| 3 | blockProviderSlot | Medusa |
| 4 | sendBookingConfirmation | PayloadCMS |
| 5 | scheduleReminders (timers) | Temporal |
| 6 | sendReminder (for each configured) | PayloadCMS |
| 7 | awaitBookingTime | Temporal timer |
| 8 | markInProgress | Medusa |
| 9 | awaitCompletion (signal or timer) | Medusa |
| 10 | finalizePayment | Payment Gateway |
| 11 | sendReviewRequest | PayloadCMS |
| 12 | recordAuditLog | Medusa |

**Signals:**
- `booking.checked_in` — customer arrived
- `booking.completed` — service completed
- `booking.no_show` — customer didn't show
- `booking.cancelled` — cancelled before deadline

---

##### WF-048: BookingRescheduleWorkflow

**Trigger:** `booking.reschedule_requested`
**Task Queue:** `medusa-commerce`

```typescript
interface BookingReschedulePayload {
  workflow_id: string
  tenant_id: string
  booking_id: string
  original_start_time: string
  new_start_time: string
  new_end_time: string
  requested_by: 'customer' | 'provider'
  reason?: string
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | checkNewSlotAvailability | Medusa |
| 2 | releaseOriginalSlot | Medusa |
| 3 | blockNewSlot | Medusa |
| 4 | updateBooking | Medusa |
| 5 | cancelOldReminders | Temporal (cancel timers) |
| 6 | scheduleNewReminders | Temporal |
| 7 | notifyOtherParty | PayloadCMS |

---

##### WF-049: ProviderAvailabilitySyncWorkflow

**Trigger:** `provider.external_calendar_connected` OR scheduled (every 30 min)
**Task Queue:** `medusa-commerce`

```typescript
interface AvailabilitySyncPayload {
  workflow_id: string
  tenant_id: string
  provider_id: string
  external_calendar_provider: 'google' | 'outlook' | 'apple'
  external_calendar_id: string
  sync_direction: 'inbound' | 'outbound' | 'bidirectional'
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | fetchExternalCalendarEvents | External API |
| 2 | compareWithInternalAvailability | Medusa |
| 3 | blockConflictingSlots | Medusa |
| 4 | pushBookingsToExternalCalendar | External API |
| 5 | updateAvailabilityExceptions | Medusa |

---

##### WF-050: ServiceProviderOnboardingWorkflow

**Trigger:** `service_provider.registered`
**Task Queue:** `medusa-commerce`

```typescript
interface ProviderOnboardingPayload {
  workflow_id: string
  tenant_id: string
  provider_id: string
  user_id: string
  services: string[]
  certifications: {
    type: string
    document_url: string
    expiry_date?: string
  }[]
  requires_background_check: boolean
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | createProviderRecord | Medusa |
| 2 | verifyCertifications | Walt.id |
| 3 | runBackgroundCheck (if required) | Walt.id |
| 4 | issueProfessionalCredential | Walt.id |
| 5 | setupDefaultAvailability | Medusa |
| 6 | createProviderProfile | PayloadCMS |
| 7 | activateProvider | Medusa |
| 8 | sendWelcomeKit | PayloadCMS |

---

#### 4.3.10 PLATFORM OPERATIONS WORKFLOWS

---

##### WF-051: TenantProvisioningWorkflow

**Trigger:** `tenant.created`
**Task Queue:** `medusa-commerce`

```typescript
interface TenantProvisioningPayload {
  workflow_id: string
  tenant_id: string
  tenant_slug: string
  owner_user_id: string
  plan: 'free' | 'starter' | 'professional' | 'enterprise'
  locales: string[]
  residency_zone: string
  initial_config: {
    default_currency: string
    default_locale: string
    timezone: string
  }
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | createTenantRecord | Medusa |
| 2 | createDefaultSettings | Medusa |
| 3 | createNodeHierarchy (root city node) | Medusa |
| 4 | setupDefaultGovernance | Medusa |
| 5 | createDefaultPersonas | Medusa |
| 6 | createERPCompanyRecord | ERPNext |
| 7 | createPayloadTenantSpace | PayloadCMS |
| 8 | createDefaultSalesChannels | Medusa |
| 9 | createFleetbaseOrg | Fleetbase |
| 10 | issueAdminCredentials | Walt.id |
| 11 | sendWelcomeEmail | PayloadCMS |
| 12 | recordAuditLog | Medusa |

---

##### WF-052: TenantBillingWorkflow

**Trigger:** Scheduled (monthly, per tenant)
**Task Queue:** `medusa-commerce`

```typescript
interface TenantBillingPayload {
  workflow_id: string
  tenant_id: string
  billing_period: { start: string; end: string }
  plan: string
  base_amount: number
  usage_metrics: {
    api_calls: number
    storage_mb: number
    bandwidth_mb: number
    active_products: number
    orders_processed: number
    active_vendors: number
  }
  overage_rates: Record<string, number>
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | aggregateUsageMetrics | Medusa |
| 2 | calculateOverages | Medusa |
| 3 | generateTenantInvoice | Medusa |
| 4 | chargeTenantPayment | Payment Gateway |
| 5 | createAccountingEntry | ERPNext |
| 6 | sendInvoice | PayloadCMS |
| 7 | handlePaymentFailure (if failed) | Payment Gateway, PayloadCMS |
| 8 | recordUsageRecord | Medusa |

---

##### WF-053: DataMigrationWorkflow

**Trigger:** Manual admin trigger
**Task Queue:** `medusa-commerce`

```typescript
interface DataMigrationPayload {
  workflow_id: string
  tenant_id: string
  migration_type: 'import' | 'export' | 'transfer'
  source_system: string
  target_system: string
  entities: string[]                   // e.g., ['products', 'customers', 'orders']
  batch_size: number
  dry_run: boolean
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | validateMigrationConfig | Medusa |
| 2 | extractData (batched) | Source system |
| 3 | transformData | Medusa |
| 4 | loadData (batched, with rollback) | Target system |
| 5 | validateMigrationResults | Medusa |
| 6 | generateMigrationReport | Medusa |
| 7 | recordAuditLog | Medusa |

---

##### WF-054: SystemHealthCheckWorkflow

**Trigger:** Scheduled (every 5 minutes)
**Task Queue:** `medusa-commerce`

```typescript
interface HealthCheckPayload {
  workflow_id: string
  systems: {
    name: string
    health_endpoint: string
    timeout_ms: number
    critical: boolean
  }[]
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | pingMedusa | Medusa |
| 2 | pingERPNext | ERPNext |
| 3 | pingFleetbase | Fleetbase |
| 4 | pingWaltId | Walt.id |
| 5 | pingPaymentGateways | Payment Gateway |
| 6 | pingPayloadCMS | PayloadCMS |
| 7 | compareWithPreviousCheck | Temporal |
| 8 | alertOnDegradation (if critical) | PayloadCMS |
| 9 | updateStatusPage | PayloadCMS |

---

##### WF-055: AuditReportWorkflow

**Trigger:** Scheduled (daily) OR manual
**Task Queue:** `medusa-commerce`

```typescript
interface AuditReportPayload {
  workflow_id: string
  tenant_id: string
  report_type: 'daily_activity' | 'security_audit' | 'compliance_report' | 'financial_audit'
  period: { start: string; end: string }
  include_systems: string[]
  recipients: string[]
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | gatherMedusaAuditLogs | Medusa |
| 2 | gatherERPAuditTrail | ERPNext |
| 3 | gatherIdentityEvents | Walt.id |
| 4 | gatherPaymentAuditTrail | Payment Gateway |
| 5 | correlateEvents | Medusa |
| 6 | generateReport | ERPNext |
| 7 | sendReport | PayloadCMS |
| 8 | archiveReport | ERPNext |

---

## 5. Integration Patterns

### 5.1 Event Flow Architecture

```
  PayloadCMS (Master)            Temporal Server              Target Systems
  ┌───────────────────┐        ┌──────────────────┐      ┌────────────────────┐
  │ SHARED MODELS     │        │                  │      │                    │
  │ (Source of Truth)  │        │  Config Sync     │      │                    │
  │                   │        │  Workflows       │      │                    │
  │  node.created ────┼───────>│  (PayloadCMS →   │─────>│  Medusa            │
  │  governance.upd ──┼───────>│   All systems)   │─────>│  ERPNext           │
  │  persona.created ─┼───────>│                  │─────>│  Fleetbase         │
  │  channel.mapped ──┼───────>│                  │─────>│  Walt.id           │
  │  translation.upd ─┼───────>│                  │      │                    │
  └───────────────────┘        └──────────────────┘      └────────────────────┘

  Medusa EventOutbox             Temporal Server              Target Systems
  ┌───────────────────┐        ┌──────────────────┐      ┌────────────────────┐
  │ COMMERCE EVENTS    │        │                  │      │                    │
  │                   │        │  OrderPlacement  │─────>│  Payment Gateway   │
  │  order.placed ────┼───────>│  Workflow         │─────>│  ERPNext           │
  │  order.cancelled ─┼───────>│                  │─────>│  Fleetbase         │
  │  vendor.created ──┼───────>│  OrderCancellation│─────>│  PayloadCMS        │
  │  subscription.    │        │  Workflow         │─────>│  Walt.id           │
  │   created ────────┼───────>│                  │      │                    │
  │                   │        │  VendorOnboarding │      │                    │
  └───────────────────┘        │  Workflow         │      └────────────────────┘
                               │                  │               ▲
                               │  Subscription    │               │
                               │  Lifecycle       │               │
                               └──────────────────┘               │
                                        │                        │
                                        │    Webhooks/Signals    │
                                        └────────────────────────┘
```

### 5.2 EventOutbox Envelope Format

Every cross-system event follows this envelope format:

```typescript
interface EventEnvelope {
  id: string                           // UUID
  tenant_id: string
  event_type: string                   // e.g., "order.placed"
  aggregate_type: string               // e.g., "order"
  aggregate_id: string                 // e.g., order_id
  correlation_id: string               // traces the original user action
  causation_id: string                 // the event that caused this event
  payload: Record<string, unknown>     // event-specific data
  metadata: {
    source_system: string              // "payloadcms" | "medusa" | "erpnext" | "fleetbase" | "waltid" | "payment_gateway"
    actor_id: string
    actor_role: string
    node_id?: string
    timestamp: string
    version: number
  }
  status: 'pending' | 'processing' | 'delivered' | 'failed'
  retry_count: number
  max_retries: number
  next_retry_at?: string
  error_message?: string
  created_at: string
  processed_at?: string
}
```

### 5.3 System Sync Rules

#### Shared/Synced Models (PayloadCMS = Master)

PayloadCMS is the master system for all platform configuration and shared models. Changes flow outward from PayloadCMS to all other systems via Temporal.

| Source → Target | Sync Method | Frequency | Conflict Resolution |
|----------------|-------------|-----------|---------------------|
| PayloadCMS → Medusa | Temporal workflow | Real-time (webhook) | PayloadCMS wins (master for shared models) |
| PayloadCMS → ERPNext | Temporal workflow | Real-time (webhook) | PayloadCMS wins (master for shared models) |
| PayloadCMS → Fleetbase | Temporal workflow | Real-time (webhook) | PayloadCMS wins (master for shared models) |
| PayloadCMS → Walt.id | Temporal workflow | Real-time (webhook) | PayloadCMS wins (master for shared models) |

#### Domain-Specific Data (each system owns its domain)

| Source → Target | Sync Method | Frequency | Conflict Resolution |
|----------------|-------------|-----------|---------------------|
| Medusa → ERPNext | Temporal workflow | Real-time (event) | Medusa wins (commerce truth) |
| ERPNext → Medusa | Temporal workflow | Every 15 min (inventory) | ERPNext wins (inventory truth) |
| Medusa → Fleetbase | Temporal workflow | Real-time (fulfillment) | Medusa wins (order truth) |
| Fleetbase → Medusa | Webhook → Signal | Real-time (tracking) | Fleetbase wins (logistics truth) |
| Walt.id → Medusa | Temporal signal | Real-time (verification) | Walt.id wins (identity truth) |
| Gateway → Medusa | Webhook → Signal | Real-time (payment) | Gateway wins (payment truth) |

---

## 6. Data Flow Diagrams

### 6.1 Order-to-Cash Flow

```
Customer                Medusa              Payment          ERPNext          Fleetbase          PayloadCMS
   │                      │                 Gateway             │                │                   │
   │──── Place Order ────>│                    │                │                │                   │
   │                      │── Capture ────────>│                │                │                   │
   │                      │<── Captured ───────│                │                │                   │
   │                      │── Reserve Stock ──────────────────>│                │                   │
   │                      │<── Reserved ──────────────────────│                │                   │
   │                      │── Create Delivery ─────────────────────────────>  │                   │
   │                      │<── Delivery Created ──────────────────────────── │                   │
   │                      │── Journal Entry ──────────────────>│                │                   │
   │                      │── Order Confirm ────────────────────────────────────────────────────> │
   │<─── Confirmation ────────────────────────────────────────────────────────────────────────── │
   │                      │                    │                │                │                   │
   │                      │                    │                │── Driver Assigned ─>│             │
   │                      │                    │                │── In Transit ──────>│             │
   │                      │                    │                │── Delivered ────────>│             │
   │                      │<── Delivery Done ──────────────────────────────── │                   │
   │                      │── Deduct Stock ───────────────────>│                │                   │
   │                      │── Calculate Commission ─>│          │                │                   │
   │                      │                    │                │                │                   │
   │                      │ ~~~ T+7 days ~~~   │                │                │                   │
   │                      │── Vendor Payout ──>│── Transfer ──>│                │                   │
   │                      │── Settlement ─────────────────────>│                │                   │
```

### 6.2 Vendor Onboarding Flow

```
Vendor                  Medusa              Walt.id          Payment          ERPNext          PayloadCMS
   │                      │                    │              Gateway             │                │
   │── Register ─────────>│                    │                │                │                │
   │                      │── Initiate KYC ───>│                │                │                │
   │                      │                    │── Verify ──>  │                │                │
   │<── Upload Docs ──────────────────────────>│                │                │                │
   │                      │<── KYC Approved ───│                │                │                │
   │                      │── Create Account ──────────────>   │                │                │
   │                      │<── Account Ready ──────────────    │                │                │
   │                      │── Issue Credential ─>│              │                │                │
   │                      │── Create Supplier ─────────────────────────────>   │                │
   │                      │── Create Profile ────────────────────────────────────────────────> │
   │                      │── Activate ────────>│              │                │                │
   │<── Welcome ──────────────────────────────────────────────────────────────────────────── │
```

---

## 7. Security & Compliance

### 7.1 Data Classification

| Classification | Examples | Storage Rules | Access Rules |
|---------------|----------|---------------|-------------|
| **Restricted** | Payment credentials, KYC documents, passwords | Encrypted at rest, never in logs | MFA required, role-based |
| **Confidential** | PII (names, emails, addresses), financial data | Encrypted at rest, masked in logs | Role-based, audit logged |
| **Internal** | Order details, product data, analytics | Standard encryption | Authenticated users |
| **Public** | Published content, product listings | Standard | Open access |

### 7.2 Residency Zone Rules

| Zone | Data Storage | Cross-Border Transfer | Applicable Regulations |
|------|-------------|----------------------|----------------------|
| **GCC** | Local storage required | No cross-border for PII | PDPL (Saudi), DPL (UAE) |
| **EU** | EU data centers only | Requires adequacy decision | GDPR |
| **MENA** | Regional storage preferred | Restricted for financial data | Country-specific |
| **APAC** | Flexible | Flexible with consent | PDPA (Singapore), etc. |
| **AMERICAS** | Flexible | Flexible | CCPA, LGPD |
| **GLOBAL** | Flexible | Flexible | Minimum: GDPR-aligned |

### 7.3 Cross-System Authentication

| System Pair | Auth Method | Token Type | Rotation |
|------------|-------------|-----------|----------|
| Medusa ↔ Temporal | mTLS + API key | Service token | 90 days |
| Temporal ↔ ERPNext | API key + OAuth2 | Bearer token | 24 hours |
| Temporal ↔ Fleetbase | API key | API key | 90 days |
| Temporal ↔ Walt.id | DID-based auth | Verifiable Presentation | Per-session |
| Temporal ↔ Payment GW | API key (env secret) | Secret key | 90 days |
| Temporal ↔ PayloadCMS | API key + JWT | Bearer token | 24 hours |

---

## 8. Appendix

### 8.1 Temporal Task Queue Reference

| Task Queue Name | Worker Service | Activities |
|----------------|---------------|------------|
| `medusa-commerce` | medusa-worker | All Medusa API calls (orders, products, vendors, subscriptions, bookings) |
| `erpnext-backoffice` | erpnext-worker | Accounting, inventory, HR, compliance, tax, supplier operations |
| `fleetbase-logistics` | fleetbase-worker | Delivery, fleet, route, warehouse, tracking operations |
| `waltid-identity` | waltid-worker | KYC, credential issuance/verification, consent, DID operations |
| `payment-gateway` | payment-worker | Capture, refund, transfer, escrow, wallet, BNPL operations |
| `payload-content` | payload-worker | Content publishing, notifications, template rendering, branding |

### 8.2 Workflow ID Conventions

```
Format: tenant:{tenant_id}:{domain}:{entity_id}:{action}

Examples:
  tenant:t_001:order:ord_abc:placement
  tenant:t_001:vendor:vnd_xyz:onboarding
  tenant:t_001:subscription:sub_123:lifecycle
  tenant:t_001:booking:bkg_456:lifecycle
  tenant:t_001:payout:pay_789:processing
  scheduled:tenant:t_001:performance_review:2026-02-08
  scheduled:system:health_check:2026-02-08T12:00
```

### 8.3 Signal Name Conventions

```
Format: {domain}.{entity}.{event}

Examples:
  payment.intent.captured
  payment.intent.failed
  delivery.order.completed
  delivery.order.failed
  kyc.verification.approved
  kyc.verification.rejected
  approval.request.approved
  approval.request.rejected
  subscription.payment.received
  booking.customer.checked_in
```

### 8.4 Common Activity Interfaces

```typescript
// Every activity receives this context
interface ActivityContext {
  tenant_id: string
  correlation_id: string
  causation_id: string
  idempotency_key: string
  actor_id?: string
  node_id?: string
}

// Every activity returns this shape
interface ActivityResult<T = unknown> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    retryable: boolean
    details?: Record<string, unknown>
  }
  audit?: {
    action: string
    resource_type: string
    resource_id: string
    changes?: Record<string, unknown>
  }
}
```

### 8.5 Error Classification

| Error Type | Retryable | Action |
|-----------|-----------|--------|
| NetworkError | Yes | Retry with backoff |
| TimeoutError | Yes | Retry with backoff |
| RateLimitError | Yes | Retry after rate limit window |
| ServiceUnavailableError | Yes | Retry with backoff |
| InvalidArgumentError | No | Fail immediately, notify admin |
| InsufficientFundsError | No | Fail, notify customer |
| AuthenticationError | No | Fail, alert security |
| FraudDetectedError | No | Fail, freeze account, alert security |
| DataConflictError | Conditional | Retry with fresh data fetch |
| CredentialExpiredError | No | Fail, trigger renewal workflow |

---

*This document is the single source of truth for cross-system architecture. All teams should reference this when implementing integrations, building new features, or debugging cross-system issues.*

*Last updated: 2026-02-08 | Next review: 2026-03-01*
