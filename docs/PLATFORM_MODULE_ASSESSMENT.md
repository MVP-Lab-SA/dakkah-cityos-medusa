# Dakkah CityOS Commerce Platform — Deep-Dive Module Assessment

> **Version:** 1.0.0 | **Date:** 2026-02-13 | **Platform:** Medusa.js v2 | **Modules:** 58

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture Overview](#2-architecture-overview)
3. [Cross-Module Relationships](#3-cross-module-relationships-links)
4. [External Integration Layer](#4-external-integration-layer)
5. [Temporal Workflow Orchestration](#5-temporal-workflow-orchestration)
6. [Per-Module Deep Assessment](#6-per-module-deep-assessment)
   - [TIER 1 — Fully Implemented (18 modules)](#tier-1--fully-implemented-18-modules)
   - [TIER 2 — Backend Complete, No Admin UI (33 modules)](#tier-2--backend-complete-no-admin-ui-33-modules)
   - [TIER 3 — Incomplete (7 modules)](#tier-3--incomplete-7-modules)
7. [Admin Panel Summary](#7-admin-panel-summary)
8. [Gap Analysis & Recommendations](#8-gap-analysis--recommendations)
9. [Complete Model & Entity Registry](#9-complete-model--entity-registry)

---

## 1. Executive Summary

The Dakkah CityOS Commerce Platform is a **multi-tenant, multi-vertical commerce operating system** built on Medusa.js v2. It extends the core Medusa e-commerce framework with **58 custom modules** spanning retail, hospitality, government services, healthcare, education, real estate, and more.

### Platform at a Glance

| Metric | Value |
|--------|-------|
| Custom Modules | 58 |
| Total Custom Models | 205 (188 with DB tables, 17 code-only) |
| Cross-Module Links | 15 |
| External Integrations | 5 (Payload CMS, ERPNext, Fleetbase, Walt.id, Stripe) |
| Temporal Workflows | 30+ system workflows + dynamic agent workflows |
| Admin Pages | 21 |
| Admin Widgets | 7 |
| Admin Hooks | 19 |
| RBAC Roles | 10 |
| Node Hierarchy Levels | 5 (CITY → DISTRICT → ZONE → FACILITY → ASSET) |
| Persona Axes | 6 |

### Implementation Maturity Tiers

| Tier | Count | Description |
|------|-------|-------------|
| **Tier 1** | 18 | Fully implemented: models, migrations, services, API routes, admin UI, seeded data |
| **Tier 2** | 33 | Backend complete: models, migrations, API routes, seeded data — **no admin UI** |
| **Tier 3** | 7 | Incomplete: models defined but DB tables may not exist, minimal service logic |

### Key Gaps

- **33 modules** lack dedicated admin UI pages
- **17 models** have code definitions but no database tables: cms_navigation, cms_page, dashboard, report, cart_metadata, carrier_config, shipping_rate, reservation_hold, stock_alert, warehouse_transfer, tax_rule, notification_preference, loyalty_account, point_transaction, service_channel, tenant_poi, tenant_relationship
- **~20 modules** rely on auto-generated CRUD with no custom service logic
- All 5 external integrations require environment variables that are not yet configured
- Temporal Cloud connection requires `TEMPORAL_API_KEY`, `TEMPORAL_ENDPOINT`, `TEMPORAL_NAMESPACE`

---

## 2. Architecture Overview

### 2.1 Monorepo Structure

```
├── apps/
│   ├── backend/           # Medusa.js v2 backend (modules, API, admin, integrations)
│   ├── storefront/        # React/Remix storefront (multi-tenant, multi-locale)
│   └── orchestrator/      # Payload CMS orchestrator (content management)
├── packages/
│   ├── cityos-contracts/       # Shared TypeScript contracts
│   ├── cityos-design-system/   # UI component library
│   ├── cityos-design-runtime/  # Runtime theme/context
│   ├── cityos-design-tokens/   # Design tokens (colors, spacing, typography)
│   └── lodash-set-safe/        # Utility package
└── patches/               # Dependency patches
```

### 2.2 Multi-Tenant Isolation

Every module model includes a `tenant_id: text` field. Tenant isolation is enforced at:
- **Model level:** All queries are scoped by `tenant_id`
- **API level:** Middleware resolves tenant from request context
- **Workflow level:** Every Temporal workflow receives a `NodeContext` containing `tenantId`

Tenant types: `platform` | `marketplace` | `vendor` | `brand`

### 2.3 Five-Level Node Hierarchy

```
CITY (depth 0)
 └── DISTRICT (depth 1)
      └── ZONE (depth 2)
           └── FACILITY (depth 3)
                └── ASSET (depth 4)
```

Nodes are tenant-scoped with parent-child relationships. Each node has `breadcrumbs` (JSON path), `location` (geo data), and `status` (active/inactive/maintenance).

### 2.4 Ten-Role RBAC System

| Role | Level | Scope |
|------|-------|-------|
| `super-admin` | 0 | Platform-wide |
| `tenant-admin` | 1 | Full tenant control |
| `compliance-officer` | 2 | Governance & compliance |
| `auditor` | 3 | Read-only audit access |
| `city-manager` | 4 | City-level operations |
| `district-manager` | 5 | District-level operations |
| `zone-operator` | 6 | Zone-level operations |
| `facility-operator` | 7 | Facility-level operations |
| `asset-technician` | 8 | Asset-level operations |
| `viewer` | 10 | Read-only access |

Roles are assigned via `TenantUser` with optional `assigned_nodes` (JSON) and `permissions` (JSON) for fine-grained access control.

### 2.5 Six-Axis Persona System

Personas define contextual profiles that shape the user experience. Each persona has:

| Field | Type | Description |
|-------|------|-------------|
| `category` | enum | Persona classification |
| `axes` | JSON | 6-axis scoring (e.g., engagement, spending, loyalty) |
| `constraints` | JSON | Rules and limitations |
| `allowed_workflows` | JSON | Permitted workflow types |
| `allowed_tools` | JSON | Available tools/features |
| `allowed_surfaces` | JSON | UI surfaces the persona can access |
| `feature_overrides` | JSON | Feature flag overrides |

Personas are assigned to users via `PersonaAssignment` with scope (tenant, node, store) and priority.

---

## 3. Cross-Module Relationships (Links)

All cross-module links are defined using Medusa's `defineLink()` utility in `apps/backend/src/links/`.

| # | Link File | Source Module | Source Entity | Target Module | Target Entity |
|---|-----------|---------------|---------------|---------------|---------------|
| 1 | `booking-customer.ts` | Customer (core) | `customer` | Booking | `booking` |
| 2 | `company-invoice.ts` | Company | `company` | Invoice | `invoice` |
| 3 | `customer-company.ts` | Customer (core) | `customer` | Company | `company` |
| 4 | `customer-membership.ts` | Customer (core) | `customer` | Membership | `membership` |
| 5 | `customer-subscription.ts` | Customer (core) | `customer` | Subscription | `subscription` |
| 6 | `node-governance.ts` | Node | `node` | Governance | `governanceAuthority` |
| 7 | `order-vendor.ts` | Order (core) | `order` | Vendor | `vendor` |
| 8 | `product-auction.ts` | Product (core) | `product` | Auction | `auctionListing` |
| 9 | `product-rental.ts` | Product (core) | `product` | Rental | `rentalProduct` |
| 10 | `product-review.ts` | Product (core) | `product` | Review | `review` |
| 11 | `tenant-node.ts` | Tenant | `tenant` | Node | `node` |
| 12 | `tenant-store.ts` | Tenant | `tenant` | Store | `cityosStore` |
| 13 | `vendor-commission.ts` | Vendor | `vendor` | Commission | `commissionRule` |
| 14 | `vendor-payout.ts` | Vendor | `vendor` | Payout | `payout` |
| 15 | `vendor-store.ts` | Vendor | `vendor` | Store | `cityosStore` |

---

## 4. External Integration Layer

All integrations are managed through the `IntegrationRegistry` in `apps/backend/src/integrations/orchestrator/integration-registry.ts`. Each adapter implements the `IIntegrationAdapter` interface with methods: `healthCheck()`, `isConfigured()`, `syncEntity()`, `handleWebhook()`.

### 4.1 Payload CMS

| Item | Detail |
|------|--------|
| **Environment** | `PAYLOAD_CMS_URL_DEV`, `PAYLOAD_API_KEY` |
| **Health Check** | `GET {PAYLOAD_CMS_URL_DEV}/api/health` |
| **Webhook** | `/webhooks/payload-cms` (13 collections) |
| **Polling** | `payload-cms-poll` job every 15 minutes |
| **Manual Sync** | `POST /admin/integrations/sync/cms` |

**CMS Hierarchy Sync Engine** — 8 collections synced in dependency order:

1. Countries
2. Governance Authorities
3. Scopes
4. Categories
5. Subcategories
6. Tenants
7. Stores
8. Portals

### 4.2 ERPNext

| Item | Detail |
|------|--------|
| **Environment** | `ERPNEXT_API_KEY`, `ERPNEXT_API_SECRET`, `ERPNEXT_URL_DEV` |
| **Auth** | Token-based: `token {API_KEY}:{API_SECRET}` |
| **Health Check** | `GET {ERPNEXT_URL_DEV}/api/method/frappe.auth.get_logged_user` |
| **Webhook** | `/webhooks/erpnext` |
| **Syncs** | Sales invoices, payment entries, GL, inventory, procurement, customer/product sync |
| **Multi-tenant** | Yes — tenant-scoped sync via `custom_medusa_id` |

### 4.3 Fleetbase

| Item | Detail |
|------|--------|
| **Environment** | `FLEETBASE_API_KEY`, `FLEETBASE_URL_DEV` |
| **Auth** | Bearer token |
| **Health Check** | `GET {FLEETBASE_URL_DEV}/health` |
| **Webhook** | `/webhooks/fleetbase` |
| **Capabilities** | Geocoding, address validation, delivery zones, fleet management, routing, tracking |

### 4.4 Walt.id

| Item | Detail |
|------|--------|
| **Environment** | `WALTID_URL_DEV`, `WALTID_API_KEY` |
| **Auth** | Bearer token |
| **Health Check** | `GET {WALTID_URL_DEV}/health` |
| **Credential Types** | 6 (KYC, Membership, Operator, Vendor, etc.) |
| **Features** | DID management, W3C Verifiable Credentials |
| **Temporal Workflows** | `kyc-verification`, `kyc-credential-issuance`, `membership-credential-issuance` |

### 4.5 Stripe

| Item | Detail |
|------|--------|
| **Environment** | `STRIPE_SECRET_KEY` |
| **Auth** | Bearer token |
| **Health Check** | `GET https://api.stripe.com/v1/balance` |
| **Webhook** | `/webhooks/stripe` |
| **Features** | Stripe Connect for vendors, subscription billing, payout processing |
| **Model Fields** | `SubscriptionPlan.stripe_price_id`, `SubscriptionPlan.stripe_product_id`, `TenantBilling.stripe_customer_id`, `TenantBilling.stripe_subscription_id`, `Vendor.stripe_account_id` |

---

## 5. Temporal Workflow Orchestration

All system workflows run on the `cityos-workflow-queue` task queue using the generic `cityOSWorkflow` workflow type. Dynamic agent workflows use `cityOSDynamicAgentWorkflow` on `cityos-dynamic-queue`.

### 5.1 System Workflows

| Category | Workflow ID | Triggered By | Description |
|----------|-------------|-------------|-------------|
| **Commerce** | `xsystem.unified-order-orchestrator` | `order.placed` | End-to-end order saga: inventory → payment → fulfillment → ERPNext sync |
| **Commerce** | `xsystem.order-cancellation-saga` | `order.cancelled` | Cancellation compensation: refund → inventory release → notify |
| **Commerce** | `xsystem.multi-gateway-payment` | `payment.initiated` | Multi-gateway payment processing |
| **Commerce** | `xsystem.refund-compensation-saga` | `refund.requested` | Refund processing with compensation |
| **Commerce** | `xsystem.returns-processing` | `return.initiated` | Returns lifecycle management |
| **Vendor** | `xsystem.vendor-onboarding-verification` | `vendor.registered` | Vendor registration verification |
| **Vendor** | `commerce.vendor-onboarding` | `vendor.created` | Vendor onboarding workflow |
| **Vendor** | `xsystem.vendor-dispute-resolution` | `dispute.opened` | Vendor dispute resolution |
| **Vendor** | `xsystem.vendor-ecosystem-setup` | `vendor.approved` | Post-approval vendor setup |
| **Vendor** | `xsystem.vendor-suspension-cascade` | `vendor.suspended` | Vendor suspension cascade |
| **Platform** | `xsystem.node-provisioning` | `node.created` | Node provisioning across all systems |
| **Platform** | `xsystem.node-update-propagation` | `node.updated` | Propagate node changes to child nodes and integrations |
| **Platform** | `xsystem.node-decommission` | `node.deleted` | Safe node decommission with data migration |
| **Platform** | `xsystem.tenant-setup-saga` | `tenant.provisioned` | Full tenant provisioning: ERPNext, CMS, Fleetbase, Walt.id, Store |
| **Platform** | `xsystem.tenant-config-sync` | `tenant.updated` | Sync tenant config changes to all systems |
| **Commerce Lifecycle** | `xsystem.subscription-lifecycle` | `subscription.created` | Subscription management: billing, renewals, retries |
| **Commerce Lifecycle** | `xsystem.service-booking-orchestrator` | `booking.created` | Service booking orchestration |
| **Commerce Lifecycle** | `xsystem.auction-lifecycle` | `auction.started` | Auction lifecycle: bidding, auto-extend, settlement |
| **Commerce Lifecycle** | `xsystem.restaurant-order-orchestrator` | `restaurant-order.placed` | Restaurant order: prep, dispatch, delivery |
| **Sync** | `commerce.product-catalog-sync` | `product.created` | Product catalog sync across systems |
| **Sync** | `commerce.sync-product-to-cms` | `product.updated` | Sync product updates to Payload CMS |
| **Sync** | `commerce.store-setup` | `store.created` | Store setup across systems |
| **Sync** | `commerce.store-config-sync` | `store.updated` | Store configuration sync |
| **Sync** | `xsystem.customer-onboarding` | `customer.created` | Customer onboarding across systems |
| **Sync** | `xsystem.customer-profile-sync` | `customer.updated` | Customer profile sync |
| **Sync** | `xsystem.inventory-reconciliation` | `inventory.updated` | Inventory reconciliation across systems |
| **Fulfillment** | `xsystem.fulfillment-dispatch` | `fulfillment.created` | Dispatch fulfillment to Fleetbase |
| **Fulfillment** | `xsystem.shipment-tracking-start` | `fulfillment.shipped` | Start shipment tracking |
| **Fulfillment** | `xsystem.delivery-confirmation` | `fulfillment.delivered` | Confirm delivery and close fulfillment |
| **Finance** | `xsystem.invoice-processing` | `invoice.created` | Invoice processing and ERPNext sync |
| **Finance** | `xsystem.payment-reconciliation` | `payment.completed` | Payment reconciliation across systems |
| **Identity** | `xsystem.kyc-verification` | `kyc.requested` | KYC verification via Walt.id |
| **Identity** | `xsystem.kyc-credential-issuance` | `kyc.completed` | Issue KYC Verifiable Credential |
| **Identity** | `xsystem.membership-credential-issuance` | `membership.created` | Issue membership Verifiable Credential |
| **Governance** | `xsystem.governance-policy-propagation` | `governance.policy.changed` | Propagate governance policy changes |

### 5.2 Dynamic Agent Workflows

Dynamic AI agent workflows run on `cityos-dynamic-queue` using `cityOSDynamicAgentWorkflow`. They accept:
- `goal` — natural language objective
- `context` — structured context data
- `availableTools` — list of permitted tools
- `maxIterations` — max reasoning iterations
- `nodeContext` — tenant/node scope

### 5.3 Task Queues

| Queue | Domain | Primary System |
|-------|--------|----------------|
| `cityos-workflow-queue` | Core | CityOS |
| `cityos-dynamic-queue` | Dynamic | AI Services |
| `cityos-main` | Core | CityOS |
| `commerce-queue` | Commerce | Medusa |
| `commerce-booking-queue` | Commerce | Medusa |
| `payload-queue` | CMS | Payload CMS |
| `payload-moderation-queue` | Moderation | Payload CMS |
| `xsystem-platform-queue` | Cross-system | ERPNext |
| `xsystem-content-queue` | Cross-system | Payload CMS |
| `xsystem-logistics-queue` | Logistics | Fleetbase |
| `xsystem-vertical-queue` | Cross-system | ERPNext |
| `core-queue` | Core | CityOS |
| `core-maintenance-queue` | Maintenance | CityOS |
| `notifications-queue` | Notifications | CityOS |
| `moderation-queue` | Moderation | CityOS |

### 5.4 Configuration

| Env Var | Required | Description |
|---------|----------|-------------|
| `TEMPORAL_ENDPOINT` | Yes | Temporal Cloud gRPC endpoint |
| `TEMPORAL_API_KEY` | Yes | Temporal Cloud API key |
| `TEMPORAL_NAMESPACE` | Yes | Temporal Cloud namespace |
| `TEMPORAL_TLS_CERT_PATH` | No | mTLS client certificate (alternative auth) |
| `TEMPORAL_TLS_KEY_PATH` | No | mTLS private key |
| `TEMPORAL_OUTBOX_BATCH_SIZE` | No | Outbox batch size (default: 50) |
| `TEMPORAL_OUTBOX_POLL_INTERVAL_MS` | No | Outbox poll interval (default: 5000ms) |

---

## 6. Per-Module Deep Assessment

---

### TIER 1 — Fully Implemented (18 modules)

---

#### 6.1 Tenant

**Scope:** Multi-tenant platform management — tenant lifecycle, settings, billing, team management, POIs, service channels, and inter-tenant relationships.

**Models:**

**tenant**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | id | PK | Primary key |
| name | text | required | Tenant display name |
| slug | text | unique | URL-safe identifier |
| handle | text | unique | Handle identifier |
| domain | text | nullable | Custom domain |
| custom_domains | json | nullable | Additional domains |
| residency_zone | enum | default "GLOBAL" | GCC, EU, MENA, APAC, AMERICAS, GLOBAL |
| country_id | text | nullable | Associated country |
| governance_authority_id | text | nullable | Linked governance authority |
| default_locale | text | default "en" | Default locale |
| supported_locales | json | default {locales:["en"]} | Supported locales |
| timezone | text | default "UTC" | Timezone |
| default_currency | text | default "usd" | Default currency |
| date_format | text | default "dd/MM/yyyy" | Date format |
| default_persona_id | text | nullable | Default persona |
| logo_url | text | nullable | Logo URL |
| favicon_url | text | nullable | Favicon URL |
| primary_color | text | nullable | Primary brand color |
| accent_color | text | nullable | Accent color |
| font_family | text | nullable | Font family |
| branding | json | nullable | Full branding config |
| status | enum | default "trial" | active, suspended, trial, archived, inactive |
| subscription_tier | enum | default "basic" | basic, pro, enterprise, custom |
| scope_tier | enum | default "nano" | nano, micro, small, medium, large, mega, global |
| tenant_type | enum | default "vendor" | platform, marketplace, vendor, brand |
| parent_tenant_id | text | nullable | Parent tenant for hierarchy |
| operating_countries | json | nullable | Countries of operation |
| max_pois | number | default 1 | Max points of interest |
| max_channels | number | default 1 | Max sales channels |
| can_host_vendors | boolean | default false | Multi-vendor capability |
| billing_email | text | nullable | Billing email |
| billing_address | json | nullable | Billing address |
| trial_starts_at | dateTime | nullable | Trial start |
| trial_ends_at | dateTime | nullable | Trial end |
| settings | json | nullable | General settings |
| metadata | json | nullable | Custom metadata |

**tenant_user**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | id | PK | Primary key |
| tenant_id | text | indexed | Tenant reference |
| user_id | text | indexed | User reference |
| role | enum | default "viewer" | 10 RBAC roles |
| role_level | number | default 10 | Numeric role level |
| assigned_nodes | json | nullable | Assigned node objects |
| assigned_node_ids | json | nullable | Assigned node IDs |
| permissions | json | nullable | Custom permissions |
| status | enum | default "invited" | active, inactive, invited |
| invitation_token | text | nullable, indexed | Invitation token |
| invitation_sent_at | dateTime | nullable | Invitation sent time |
| invitation_accepted_at | dateTime | nullable | Invitation accepted time |
| invited_by_id | text | nullable | Inviter user ID |
| last_active_at | dateTime | nullable | Last activity |
| metadata | json | nullable | Custom metadata |

*Indexes:* `[tenant_id]`, `[user_id]`, `[tenant_id, user_id] UNIQUE`, `[status]`, `[invitation_token]`, `[role_level]`

**tenant_settings**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | id | PK | Primary key |
| tenant_id | text | required | Tenant reference |
| timezone | text | default "UTC" | Timezone |
| date_format | text | default "dd/MM/yyyy" | Date format |
| time_format | text | default "HH:mm" | Time format |
| default_locale | text | default "en" | Default locale |
| supported_locales | json | nullable | Supported locales |
| default_currency | text | default "usd" | Default currency |
| supported_currencies | json | nullable | Supported currencies |
| primary_color | text | nullable | Primary color |
| secondary_color | text | nullable | Secondary color |
| accent_color | text | nullable | Accent color |
| font_family | text | nullable | Font family |
| custom_css | text | nullable | Custom CSS |
| email_from_name | text | nullable | Email sender name |
| email_from_address | text | nullable | Email sender address |
| email_reply_to | text | nullable | Reply-to address |
| smtp_host | text | nullable | SMTP host |
| smtp_port | number | nullable | SMTP port |
| smtp_user | text | nullable | SMTP user |
| smtp_password | text | nullable | SMTP password |
| guest_checkout_enabled | boolean | default true | Guest checkout |
| require_phone | boolean | default false | Require phone |
| require_company | boolean | default false | Require company |
| min_order_value | bigNumber | nullable | Min order value |
| max_order_value | bigNumber | nullable | Max order value |
| track_inventory | boolean | default true | Inventory tracking |
| allow_backorders | boolean | default false | Allow backorders |
| low_stock_threshold | number | default 10 | Low stock alert threshold |
| order_number_prefix | text | nullable | Order number prefix |
| order_number_start | number | default 1000 | Starting order number |
| auto_archive_days | number | default 90 | Auto archive period |
| accepted_payment_methods | json | nullable | Payment methods |
| payment_capture_method | text | nullable | Capture method |
| free_shipping_threshold | bigNumber | nullable | Free shipping threshold |
| default_weight_unit | text | default "kg" | Weight unit |
| default_dimension_unit | text | default "cm" | Dimension unit |
| tax_inclusive_pricing | boolean | default false | Tax inclusive pricing |
| tax_provider | text | nullable | Tax provider |
| notify_on_new_order | boolean | default true | New order notifications |
| notify_on_low_stock | boolean | default true | Low stock notifications |
| notification_emails | json | nullable | Notification recipients |
| google_analytics_id | text | nullable | GA tracking ID |
| facebook_pixel_id | text | nullable | FB pixel ID |
| google_tag_manager_id | text | nullable | GTM ID |
| api_rate_limit | number | nullable | API rate limit |
| webhook_secret | text | nullable | Webhook secret |
| metadata | json | nullable | Custom metadata |

**tenant_billing**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | id | PK | Primary key |
| tenant_id | text | required | Tenant reference |
| subscription_status | enum | default "trial" | active, trial, past_due, canceled, paused |
| plan_id | text | nullable | Plan identifier |
| plan_name | text | nullable | Plan display name |
| plan_type | text | nullable | Plan type |
| base_price | bigNumber | nullable | Base subscription price |
| currency_code | text | default "usd" | Currency |
| usage_metering_enabled | boolean | default false | Usage metering |
| usage_price_per_unit | bigNumber | nullable | Per-unit price |
| usage_unit_name | text | nullable | Unit name |
| included_units | number | nullable | Included units |
| current_period_start | dateTime | nullable | Period start |
| current_period_end | dateTime | nullable | Period end |
| current_usage | number | default 0 | Current usage |
| current_usage_cost | bigNumber | default 0 | Current usage cost |
| payment_method_id | text | nullable | Payment method |
| stripe_customer_id | text | nullable | **Stripe** customer ID |
| stripe_subscription_id | text | nullable | **Stripe** subscription ID |
| last_invoice_date | dateTime | nullable | Last invoice date |
| last_invoice_amount | bigNumber | nullable | Last invoice amount |
| next_invoice_date | dateTime | nullable | Next invoice date |
| max_products | number | nullable | Product limit |
| max_orders_per_month | number | nullable | Order limit |
| max_storage_gb | number | nullable | Storage limit |
| max_team_members | number | nullable | Team member limit |
| metadata | json | nullable | Custom metadata |

**tenant_invoice** — Tenant platform invoices (not B2B invoices)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | id | PK | Primary key |
| tenant_id | text | required | Tenant reference |
| billing_id | text | required | Billing record reference |
| invoice_number | text | unique | Invoice number |
| period_start | dateTime | required | Billing period start |
| period_end | dateTime | required | Billing period end |
| currency_code | text | required | Currency |
| base_amount | bigNumber | required | Base amount |
| usage_amount | bigNumber | default 0 | Usage charges |
| discount_amount | bigNumber | default 0 | Discounts |
| tax_amount | bigNumber | default 0 | Tax |
| total_amount | bigNumber | required | Total |
| status | enum | default "draft" | draft, sent, paid, overdue, void |
| paid_at | dateTime | nullable | Payment date |
| payment_method | text | nullable | Payment method |
| stripe_invoice_id | text | nullable | Stripe invoice ID |
| invoice_pdf_url | text | nullable | PDF URL |
| due_date | dateTime | nullable | Due date |
| line_items | json | nullable | Line items |
| metadata | json | nullable | Custom metadata |

**tenant_usage_record**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | id | PK | Primary key |
| tenant_id | text | required | Tenant reference |
| billing_id | text | required | Billing record reference |
| usage_type | enum | required | orders, products, storage, api_calls, bandwidth, team_members |
| quantity | number | required | Usage quantity |
| unit_price | bigNumber | required | Unit price |
| total_cost | bigNumber | required | Total cost |
| recorded_at | dateTime | required | Record time |
| period_start | dateTime | required | Period start |
| period_end | dateTime | required | Period end |
| reference_type | text | nullable | Reference entity type |
| reference_id | text | nullable | Reference entity ID |
| metadata | json | nullable | Custom metadata |

**tenant_poi** — Points of Interest

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | id | PK | Primary key |
| tenant_id | text | indexed | Tenant reference |
| node_id | text | indexed | Node reference |
| name | text | required | POI name |
| slug | text | required | URL slug |
| poi_type | text | required | POI type |
| address_line1 | text | required | Address line 1 |
| address_line2 | text | nullable | Address line 2 |
| city | text | required | City |
| state | text | nullable | State/province |
| postal_code | text | required | Postal code |
| country_code | text | required | Country code |
| latitude | number | nullable | Latitude |
| longitude | number | nullable | Longitude |
| geohash | text | nullable | Geohash |
| operating_hours | json | nullable | Operating hours |
| phone | text | nullable | Phone |
| email | text | nullable | Email |
| is_primary | boolean | default false | Primary POI flag |
| is_active | boolean | default true | Active status |
| service_radius_km | number | nullable | Service radius |
| delivery_zones | json | nullable | Delivery zones |
| fleetbase_place_id | text | nullable | Fleetbase place reference |
| media | json | nullable | Media assets |
| metadata | json | nullable | Custom metadata |

**tenant_relationship** — Inter-tenant relationships (marketplace vendor, franchise, etc.)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | id | PK | Primary key |
| host_tenant_id | text | indexed | Host tenant |
| vendor_tenant_id | text | indexed | Vendor tenant |
| relationship_type | enum | default "marketplace_vendor" | marketplace_vendor, franchise, affiliate, white_label, partnership |
| status | enum | default "pending" | pending, active, suspended, terminated |
| commission_type | enum | default "percentage" | percentage, flat, tiered, custom |
| commission_rate | number | nullable | Commission rate |
| commission_flat | bigNumber | nullable | Flat commission |
| commission_tiers | json | nullable | Tiered commission config |
| listing_scope | enum | default "approved_only" | all, approved_only, category_restricted, manual |
| allowed_categories | json | nullable | Allowed categories |
| revenue_share_model | json | nullable | Revenue share config |
| contract_start | dateTime | nullable | Contract start |
| contract_end | dateTime | nullable | Contract end |
| approved_by | text | nullable | Approver |
| approved_at | dateTime | nullable | Approval date |
| terms | json | nullable | Terms |
| metadata | json | nullable | Custom metadata |

*Indexes:* `[host_tenant_id]`, `[vendor_tenant_id]`, `[host_tenant_id, vendor_tenant_id] UNIQUE`, `[status]`

**service_channel** — Sales/service channels within a POI

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | id | PK | Primary key |
| tenant_id | text | required | Tenant reference |
| poi_id | text | required | POI reference |
| name | text | required | Channel name |
| slug | text | required | URL slug |
| channel_type | enum | required | dine_in, takeaway, delivery, drive_through, pickup |
| is_active | boolean | default true | Active status |
| capabilities | json | nullable | Channel capabilities |
| operating_hours | json | nullable | Operating hours |
| fulfillment_type | text | nullable | Fulfillment type |
| min_order_amount | bigNumber | nullable | Min order |
| max_order_amount | bigNumber | nullable | Max order |
| delivery_fee | bigNumber | nullable | Delivery fee |
| supported_payment_methods | json | nullable | Payment methods |
| priority | number | default 0 | Display priority |
| metadata | json | nullable | Custom metadata |

**Service Logic:** 20+ methods including tenant provisioning, settings management, billing, team management, POI management, service channel operations, relationship management.

**API Routes:**
- Admin: `GET/POST /admin/tenants`, `GET/PUT /admin/tenants/[id]`, `GET/PUT /admin/tenants/[id]/billing`, `GET/POST/DELETE /admin/tenants/[id]/team`, `PUT/DELETE /admin/tenants/[id]/team/[userId]`, `GET/PUT /admin/tenants/[id]/limits`
- Platform: `GET /platform/tenants`, `GET /platform/tenants/default`, `GET /platform/context`
- Store: `GET /store/cityos/tenant`

**Admin UI:** Tenants page (table with search, status filters) + Tenant Detail page + Billing detail page

**Seeded Data:** 1 tenant

**Cross-Module Relations:** Tenant↔Node, Tenant↔Store

**External Integrations:** Stripe (billing), Payload CMS (sync), ERPNext (company creation), Fleetbase (configuration), Walt.id (tenant DID)

**Temporal Workflows:** `tenant-setup-saga`, `tenant-config-sync`

**Implementation Status:** ✅ Complete

**Gaps:** None significant

---

#### 6.2 Vendor

**Scope:** Multi-vendor marketplace management — vendor profiles, products, orders, analytics, marketplace listings, and Stripe Connect integration.

**Models:**

**vendor** — See full field listing in Section 2 data. Key fields: `handle` (unique), `tenant_id`, `store_id`, `business_name`, `legal_name`, `business_type` (6 types), `tax_id`, contact fields, address fields, `verification_status` (5 states), `status` (5 states), commission fields (`commission_type`, `commission_rate`, `commission_flat`, `commission_tiers`), payout fields (`payout_method`, `payout_schedule`, `payout_minimum`), Stripe Connect fields (`stripe_account_id`, `stripe_account_status`, `stripe_charges_enabled`, `stripe_payouts_enabled`), statistics fields, branding fields.

**vendor_product**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | id | PK | Primary key |
| vendor_id | text | indexed | Vendor reference |
| product_id | text | indexed | Product reference |
| tenant_id | text | nullable, indexed | Tenant reference |
| is_primary_vendor | boolean | default true | Primary vendor flag |
| attribution_percentage | bigNumber | default 100 | Revenue attribution % |
| status | enum | default "pending_approval" | pending_approval, approved, rejected, suspended, discontinued |
| approved_by_id | text | nullable | Approver |
| approved_at | dateTime | nullable | Approval date |
| rejection_reason | text | nullable | Rejection reason |
| manage_inventory | boolean | default true | Manage inventory |
| vendor_sku | text | nullable | Vendor SKU |
| vendor_cost | bigNumber | nullable | Vendor cost |
| suggested_price | bigNumber | nullable | Suggested retail price |
| fulfillment_method | enum | default "vendor_ships" | vendor_ships, platform_ships, dropship |
| lead_time_days | number | default 3 | Lead time |
| commission_override | boolean | default false | Override default commission |
| commission_rate | bigNumber | nullable | Override rate |
| commission_type | enum | nullable | percentage, flat |
| marketplace_tenant_id | text | nullable | Marketplace tenant |
| metadata | json | nullable | Custom metadata |

**vendor_order**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | id | PK | Primary key |
| vendor_id | text | indexed | Vendor reference |
| order_id | text | indexed | Order reference |
| tenant_id | text | nullable | Tenant reference |
| vendor_order_number | text | unique | Vendor order number |
| status | enum | default "pending" | 10 states (pending through disputed) |
| currency_code | text | default "usd" | Currency |
| subtotal | bigNumber | default 0 | Subtotal |
| shipping_total | bigNumber | default 0 | Shipping |
| tax_total | bigNumber | default 0 | Tax |
| discount_total | bigNumber | default 0 | Discounts |
| total | bigNumber | default 0 | Total |
| commission_amount | bigNumber | default 0 | Commission |
| platform_fee | bigNumber | default 0 | Platform fee |
| net_amount | bigNumber | default 0 | Vendor net amount |
| payout_status | enum | default "pending" | pending, processing, paid, held, disputed |
| payout_id | text | nullable | Payout reference |
| fulfillment_status | enum | default "not_fulfilled" | Fulfillment status |
| shipping_method | text | nullable | Shipping method |
| tracking_number | text | nullable | Tracking number |
| tracking_url | text | nullable | Tracking URL |
| shipped_at | dateTime | nullable | Ship date |
| delivered_at | dateTime | nullable | Delivery date |
| shipping_address | json | nullable | Shipping address |
| vendor_notes | text | nullable | Vendor notes |
| internal_notes | text | nullable | Internal notes |
| marketplace_tenant_id | text | nullable | Marketplace tenant |
| metadata | json | nullable | Custom metadata |

**vendor_user** — Vendor team members with roles: owner, admin, manager, staff, viewer

**vendor_analytics_snapshot** — Periodic analytics: orders, revenue, products, performance, customer metrics

**vendor_performance_metric** — Rolling performance metrics: order_defect_rate, late_shipment_rate, cancellation_rate, etc.

**marketplace_listing** — Cross-tenant product listings with commission overrides, visibility, and analytics (impressions, clicks, conversions)

**Service Logic:** 10+ methods including vendor approval/rejection/suspension/reinstatement, performance analytics, Stripe Connect account creation, onboarding/dashboard links.

**API Routes:**
- Admin: `GET/POST /admin/vendors`, `GET/PUT /admin/vendors/[id]`, `POST /admin/vendors/[id]/approve|reject|suspend|reinstate`, `GET /admin/vendors/[id]/performance`, `GET /admin/vendors/analytics`
- Store: `GET /store/vendors`, `GET /store/vendors/featured`, `GET /store/vendors/[handle]`, `GET /store/vendors/[handle]/products|reviews`, `POST /store/vendors/register`, `POST /store/vendors/[id]/stripe-connect`, `GET /store/vendors/[id]/stripe-connect/status`
- Vendor: `GET /vendor/dashboard`, `GET/PUT /vendor/products`, `GET /vendor/orders`, `GET /vendor/commissions`, `GET /vendor/payouts`, `POST /vendor/payouts/request`, `GET /vendor/analytics`, `GET /vendor/transactions`

**Admin UI:** Vendors page (table with filters) + Vendor Analytics page + `vendor-management` widget (on vendor detail)

**Seeded Data:** 10 vendors, 13 vendor products

**Cross-Module Relations:** Vendor↔Commission, Vendor↔Payout, Vendor↔Store, Order↔Vendor

**External Integrations:** Stripe Connect, ERPNext (supplier sync)

**Temporal Workflows:** `vendor-onboarding`, `vendor-ecosystem-setup`, `vendor-suspension-cascade`

**Implementation Status:** ✅ Complete

**Gaps:** None significant

---

#### 6.3 Booking

**Scope:** Service booking management — appointments, availability scheduling, service products, service providers, reminders.

**Models:**

**booking** — Full booking model with customer, service, schedule, status, capacity, location (in_person/virtual/customer_location), pricing, payment status, cancellation, rescheduling, notes, confirmation, and check-in fields.

*Indexes:* `[tenant_id]`, `[customer_id]`, `[service_product_id]`, `[provider_id]`, `[start_time, end_time]`, `[status]`, `[booking_number]`

**booking_item** — Line items within a booking with service reference, timing, pricing.

**availability** — Schedule configuration with `owner_type`, `schedule_type` (recurring/custom/block), `weekly_schedule` (JSON), slot duration, buffer time, max advance booking, active status.

**availability_exception** — Exceptions to availability: day_off, holiday, special_hours, extended_hours.

**booking_reminder** — Automated reminders: email/sms/push, configurable timing, send status.

**service_product** — Service definitions with `service_type` (appointment/class/workshop/consultation/event), duration, capacity, pricing type (fixed/per_person/per_hour/tiered), location type, buffer time.

**service_provider** — Provider profiles with specializations, service IDs, daily booking limits, status, average rating.

**Service Logic:** 15+ methods — slot generation, schedule management, booking statistics, reminder scheduling, availability calculations.

**API Routes:**
- Admin: `GET/POST /admin/bookings`, `GET/PUT /admin/bookings/[id]`, `POST /admin/bookings/[id]/reschedule`, CRUD for availability/exceptions, service providers
- Store: `GET/POST /store/bookings`, `GET /store/bookings/[id]`, `POST /store/bookings/[id]/cancel|confirm|check-in|reschedule`, `GET /store/bookings/availability`, `GET /store/bookings/services`

**Admin UI:** Bookings page + Settings/Bookings page

**Seeded Data:** 3 bookings

**Cross-Module Relations:** Customer↔Booking

**Temporal Workflows:** `service-booking-orchestrator`

**Implementation Status:** ✅ Complete

---

#### 6.4 Commission

**Scope:** Vendor commission rules and transaction tracking.

**Models:**

**commission_rule** — Rules with `tenant_id`, `vendor_id`, `priority`, `name`, `commission_type` (percentage/flat/tiered), `commission_percentage`, `tiers` (JSON), `conditions` (JSON), `valid_from`, `valid_to`, `status`.

**commission_transaction** — Transactions with `vendor_id`, `order_id`, `commission_rule_id`, `transaction_type`, `order_total`, `commission_amount`, `net_amount`, `status`, `transaction_date`.

**Service Logic:** `createTransaction` method for calculating and recording commissions.

**API Routes:**
- Admin: CRUD for `/admin/commission-rules`, `/admin/commissions/tiers`, `/admin/commissions/transactions`

**Admin UI:** Commission Tiers page + Commission Transactions page + `commission-config` widget

**Seeded Data:** 6 rules, 3 transactions

**Cross-Module Relations:** Vendor↔Commission

**Implementation Status:** ✅ Complete

---

#### 6.5 Company

**Scope:** B2B commerce — company accounts, team management, approval workflows, purchase orders, payment terms, tax exemptions.

**Models:**

**company** — B2B company with `handle` (unique), `name`, `email`, `phone`, `website`, `tax_id`, `registration_number`, `industry`, `company_size`, `credit_limit`, `credit_used`, `currency_code`, `status` (active/inactive/suspended/pending_approval), `requires_approval`, `default_approval_threshold`, `billing_address`, `shipping_address`, `logo_url`, `metadata`.

**company_user** — Customer-company link with `role` (owner/admin/buyer/viewer), `spending_limit`, `approval_limit`, `status`.

**approval_workflow** — Workflow definitions with `workflow_type` (purchase_order/quote/return/general), `conditions` (JSON), `steps` (JSON), `is_active`.

**approval_request** — Individual requests with `entity_type`, `entity_id`, `status` (pending/approved/rejected/escalated), `current_step`, `amount`.

**approval_action** — Actions on requests with `step_number`, `action` (approved/rejected/escalated), `action_by_id`, `comments`.

**payment_terms** — Terms with `terms_type` (net/cod/prepaid/installment), `net_days`, `early_payment_discount_percent`, `early_payment_discount_days`, `late_fee_enabled`, `late_fee_rate`, `is_default`, `requires_credit_check`.

**purchase_order** — POs with `po_number` (unique), `company_id`, `customer_id`, `status` (10 states), `requires_approval`, pricing fields, `payment_terms_id`, `payment_due_date`, shipping/billing address.

**purchase_order_item** — PO line items with product/variant reference, quantity, pricing, status.

**tax_exemption** — Company tax exemptions with `certificate_number`, `certificate_type`, `issuing_country`, `expiration_date`, `status`, `exemption_percentage`.

**Service Logic:** 15+ methods — PO creation/approval, credit management, approval workflows, spending limit enforcement.

**API Routes:**
- Admin: CRUD for companies, `POST /admin/companies/[id]/approve|credit`, payment terms, purchase orders, tax exemptions
- Store: `GET /store/companies`, `GET /store/companies/me`, `GET /store/companies/me/credit|orders|team`, `POST /store/purchase-orders`

**Admin UI:** Company Detail page (`[id]`) + `customer-business-info` widget + `order-business-info` widget + Settings/Payment Terms page

**Seeded Data:** 3 companies

**Cross-Module Relations:** Company↔Invoice, Customer↔Company

**Implementation Status:** ✅ Complete

---

#### 6.6 Subscription

**Scope:** Recurring billing — subscription lifecycle, plans, items, billing cycles, events, pauses, discounts.

**Models:**

**subscription** — Core subscription with `customer_id`, `status` (draft/active/paused/past_due/canceled/expired), billing configuration (`billing_interval`, `billing_interval_count`, `billing_anchor_day`), payment fields, pricing, retry configuration (`max_retry_attempts`, `retry_count`, `next_retry_at`), `tenant_id`, `store_id`.

*Indexes:* `[customer_id]`, `[tenant_id, status]`, `[status, next_retry_at]` (partial: past_due), `[current_period_end]` (partial: active)

**subscription_plan** — Plans with `handle` (unique), `billing_interval`, `price`, `compare_at_price`, `trial_period_days`, `features` (JSON), `limits` (JSON), `included_products` (JSON), `stripe_price_id`, `stripe_product_id`.

**subscription_item** — Line items with product/variant reference, quantity, pricing, optional billing interval override.

**subscription_event** — Event log with 16 event types (created, activated, trial_started, paused, resumed, upgraded, etc.), `triggered_by` (customer/admin/system/webhook).

**subscription_pause** — Pause records with `pause_type` (customer_request/payment_issue/admin_action/scheduled), scheduled/actual resume times.

**billing_cycle** — Billing cycles with period, status (upcoming/processing/completed/failed/skipped), order reference, amounts, attempt tracking.

**subscription_discount** — Discount codes with `code` (unique), `name`, discount configuration.

**Service Logic:** 20+ methods — create, activate, pause, resume, cancel, change plan, process billing cycle, retry failed payments.

**API Routes:**
- Admin: CRUD for subscriptions/plans/discounts, `POST /admin/subscriptions/[id]/pause|resume|change-plan`, `GET /admin/subscriptions/[id]/events`
- Store: `GET/POST /store/subscriptions`, `GET /store/subscriptions/me`, `POST /store/subscriptions/[id]/pause|resume|cancel|change-plan|payment-method`, `GET /store/subscriptions/[id]/billing-history`, `POST /store/subscriptions/checkout`, `POST /store/subscriptions/webhook`

**Admin UI:** Subscriptions page

**Seeded Data:** 3 subscriptions, 5 plans

**Cross-Module Relations:** Customer↔Subscription

**External Integrations:** Stripe (stripe_price_id, stripe_product_id on plans)

**Temporal Workflows:** `subscription-lifecycle`

**Implementation Status:** ✅ Complete

---

#### 6.7 Node

**Scope:** CityOS spatial hierarchy — 5-level node tree for geographic and organizational structure.

**Models:**

**node**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | id | PK | Primary key |
| tenant_id | text | indexed | Tenant reference |
| name | text | required | Node name |
| slug | text | required | URL slug |
| code | text | nullable | Node code |
| type | enum | required | CITY, DISTRICT, ZONE, FACILITY, ASSET |
| depth | number | required | Hierarchy depth (0-4) |
| parent_id | text | nullable, indexed | Parent node ID |
| breadcrumbs | json | nullable | Path breadcrumbs |
| location | json | nullable | Geo location data |
| status | enum | default "active" | active, inactive, maintenance |
| metadata | json | nullable | Custom metadata |

*Indexes:* `[tenant_id]`, `[tenant_id, type]`, `[tenant_id, slug] UNIQUE`, `[parent_id]`, `[type, depth]`

**Service Logic:** 8+ methods — `getAncestors`, `getBreadcrumbs`, `getDescendants`, `getNodesByType`, `getChildren`, `moveNode`, `getSubtree`.

**API Routes:**
- Admin: `GET/POST /admin/nodes`, `GET/PUT/DELETE /admin/nodes/[id]`
- Store: `GET /store/cityos/nodes`

**Admin UI:** Nodes page (tree view with hierarchy)

**Seeded Data:** 10 nodes

**Cross-Module Relations:** Node↔Governance, Tenant↔Node

**Temporal Workflows:** `node-provisioning`, `node-update-propagation`, `node-decommission`

**Implementation Status:** ✅ Complete

---

#### 6.8 Governance

**Scope:** Regulatory governance — governance authorities, commerce policies, jurisdiction management.

**Models:**

**governance_authority**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | id | PK | Primary key |
| tenant_id | text | nullable | Tenant reference |
| name | text | required | Authority name |
| slug | text | required | URL slug |
| code | text | nullable | Authority code |
| type | enum | required | region, country, authority |
| jurisdiction_level | number | default 0 | Jurisdiction level |
| parent_authority_id | text | nullable | Parent authority |
| country_id | text | nullable | Country reference |
| region_id | text | nullable | Region reference |
| commerce_policies | json | nullable | Commerce policies |
| tax_policies | json | nullable | Tax policies |
| data_residency_requirements | json | nullable | Data residency |
| consumer_protection_rules | json | nullable | Consumer protection |
| supported_currencies | json | nullable | Supported currencies |
| supported_payment_methods | json | nullable | Payment methods |
| required_certifications | json | nullable | Required certifications |
| is_active | boolean | default true | Active status |
| metadata | json | nullable | Custom metadata |

**Service Logic:** `getCommercePolicy` — retrieves applicable policies for a jurisdiction.

**API Routes:**
- Admin: `GET/POST /admin/governance`, `GET/PUT/DELETE /admin/governance/[id]`
- Store: `GET /store/cityos/governance`

**Admin UI:** Governance page

**Seeded Data:** 1 governance authority

**Cross-Module Relations:** Node↔Governance

**Temporal Workflows:** `governance-policy-propagation`

**Implementation Status:** ✅ Complete

---

#### 6.9 Persona

**Scope:** Contextual user experience personalization — persona definitions and user assignments.

**Models:**

**persona**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | id | PK | Primary key |
| tenant_id | text | required | Tenant reference |
| name | text | required | Persona name |
| slug | text | required | URL slug |
| category | text | required | Persona category |
| axes | json | nullable | 6-axis scoring |
| constraints | json | nullable | Rules/limitations |
| allowed_workflows | json | nullable | Permitted workflows |
| allowed_tools | json | nullable | Available tools |
| allowed_surfaces | json | nullable | UI surfaces |
| feature_overrides | json | nullable | Feature flags |
| priority | number | default 0 | Priority |
| status | enum | default "active" | active, inactive |
| metadata | json | nullable | Custom metadata |

**persona_assignment**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | id | PK | Primary key |
| tenant_id | text | required | Tenant reference |
| persona_id | text | required | Persona reference |
| user_id | text | required | User reference |
| scope | text | required | Scope (tenant/node/store) |
| scope_reference | text | nullable | Scope entity ID |
| priority | number | default 0 | Priority |
| status | enum | default "active" | active, inactive |
| starts_at | dateTime | nullable | Start date |
| ends_at | dateTime | nullable | End date |

**Service Logic:** `getPersonasForTenant` — retrieves all personas for a tenant.

**API Routes:**
- Admin: `GET/POST /admin/personas`, `GET/PUT/DELETE /admin/personas/[id]`
- Store: `GET /store/cityos/persona`

**Admin UI:** Personas page

**Seeded Data:** 9 personas, 4 assignments

**Implementation Status:** ✅ Complete

---

#### 6.10 Review

**Scope:** Product and vendor reviews with moderation workflow.

**Models:**

**review**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | id | PK | Primary key |
| rating | number | required | Rating (1-5) |
| title | text | nullable | Review title |
| content | text | required | Review body |
| customer_id | text | required | Customer reference |
| customer_name | text | nullable | Customer display name |
| customer_email | text | nullable | Customer email |
| product_id | text | nullable | Product reference |
| vendor_id | text | nullable | Vendor reference |
| order_id | text | nullable | Order reference |
| is_verified_purchase | boolean | default false | Verified purchase flag |
| is_approved | boolean | default false | Approval status |
| helpful_count | number | default 0 | Helpful votes |
| images | json | default [] | Review images |
| metadata | json | nullable | Custom metadata |

**Service Logic:** 8+ methods — approve, reject, verify, mark helpful, analytics.

**API Routes:**
- Admin: `GET/POST /admin/reviews`, `GET/PUT /admin/reviews/[id]`, `POST /admin/reviews/[id]/approve|reject|verify`, `GET /admin/reviews/analytics`
- Store: `GET/POST /store/reviews`, `GET /store/reviews/[id]`, `POST /store/reviews/[id]/helpful`, `GET /store/reviews/products/[id]`, `GET /store/reviews/vendors/[id]`

**Admin UI:** Reviews page (with approve/reject/verify actions)

**Seeded Data:** 6 reviews

**Cross-Module Relations:** Product↔Review

**Implementation Status:** ✅ Complete

---

#### 6.11 Volume Pricing

**Scope:** B2B quantity-based pricing — volume discount rules and tiers.

**Models:**

**volume_pricing** — Rules with `name`, `applies_to` (product/category/all/customer_group/company), `target_id`, `pricing_type` (percentage/fixed_amount/fixed_price), `company_id`, `company_tier`, `tenant_id`, `store_id`, `region_id`, `priority`, `status`, `starts_at`, `ends_at`.

**volume_pricing_tier** — Tiers with `volume_pricing_id`, `min_quantity`, `max_quantity` (nullable = infinity), `discount_percentage`, `discount_amount`, `fixed_price`, `currency_code`.

**Service Logic:** `findApplicableRules`, `getBestVolumePrice` — find and calculate best volume discount.

**API Routes:**
- Admin: CRUD for `/admin/volume-pricing`, `/admin/pricing-tiers`
- Store: `GET /store/products/[id]/volume-pricing`

**Admin UI:** Volume Pricing page + `product-business-config` widget

**Seeded Data:** 5 rules, 5 tiers

**Implementation Status:** ✅ Complete

---

#### 6.12 Warranty

**Scope:** Product warranty management — plans, claims, repair orders, service centers, spare parts.

**Models:**

**warranty_plan** — Plans with `plan_type` (standard/extended/premium/accidental), `duration_months`, `price`, `coverage` (JSON), `exclusions` (JSON), `is_active`.

**warranty_claim** — Claims with `plan_id`, `customer_id`, `order_id`, `product_id`, `claim_number` (unique), `issue_description`, `evidence_urls`, `status` (8 states), `resolution_type` (repair/replace/refund/credit/reject), `resolution_notes`.

**repair_order** — Repair orders with `claim_id`, `service_center_id`, `status` (7 states), `diagnosis`, `repair_notes`, `parts_used`, `estimated_cost`, `actual_cost`, `tracking_number`.

**service_center** — Centers with address, `specializations` (JSON), `capacity_per_day`, `current_load`.

**spare_part** — Parts with `sku`, `compatible_products` (JSON), `price`, `stock_quantity`, `reorder_level`, `supplier`.

**Service Logic:** Auto-CRUD (no custom service methods).

**API Routes:**
- Admin: CRUD for `/admin/warranties`
- Store: `GET /store/warranties`, `GET /store/warranties/[id]`

**Admin UI:** Warranty page

**Seeded Data:** 5 plans, 2 claims

**Implementation Status:** ✅ Complete

---

#### 6.13 I18n

**Scope:** Internationalization — translation management for multi-locale support.

**Models:**

**translation**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | id | PK | Primary key |
| tenant_id | text | required | Tenant reference |
| locale | text | required | Locale code (e.g., "en", "ar") |
| namespace | text | required | Translation namespace |
| key | text | required | Translation key |
| value | text | required | Translated value |
| context | text | nullable | Translation context |
| status | enum | default "active" | active, draft, archived |
| metadata | json | nullable | Custom metadata |

**Service Logic:** `getSupportedLocales`, `getTranslation`, `getTranslations`.

**Admin UI:** I18n page

**Seeded Data:** 16 translations

**Implementation Status:** ✅ Complete

---

#### 6.14 Audit

**Scope:** Audit trail — comprehensive logging of all platform actions.

**Models:**

**audit_log**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | id | PK | Primary key |
| tenant_id | text | required | Tenant reference |
| action | text | required | Action performed |
| resource_type | text | required | Entity type |
| resource_id | text | required | Entity ID |
| actor_id | text | required | Actor user ID |
| actor_role | text | nullable | Actor role |
| actor_email | text | nullable | Actor email |
| node_id | text | nullable | Node context |
| changes | json | nullable | Change summary |
| previous_values | json | nullable | Previous values |
| new_values | json | nullable | New values |
| ip_address | text | nullable | Client IP |
| user_agent | text | nullable | User agent |
| data_classification | text | nullable | Data classification |
| metadata | json | nullable | Custom metadata |

**Service Logic:** `getAuditTrail`, `getResourceHistory` — query audit logs by resource or time range.

**Admin UI:** Audit Logs page

**Seeded Data:** 6 logs

**Implementation Status:** ✅ Complete

---

#### 6.15 Channel

**Scope:** Sales channel mapping — connecting Medusa sales channels to CityOS tenant/node structure.

**Models:**

**sales_channel_mapping**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | id | PK | Primary key |
| tenant_id | text | required | Tenant reference |
| channel_type | text | required | Channel type |
| medusa_sales_channel_id | text | required | Medusa channel ID |
| name | text | required | Channel name |
| description | text | nullable | Description |
| node_id | text | nullable | Node reference |
| config | json | nullable | Channel config |
| is_active | boolean | default true | Active status |
| metadata | json | nullable | Custom metadata |

**Service Logic:** `createMapping`, `getChannelForRequest` — map requests to channels.

**Admin UI:** Channels page

**Seeded Data:** Via core Medusa setup

**Implementation Status:** ✅ Complete

---

#### 6.16 Payout

**Scope:** Vendor payout processing — payout creation, processing, Stripe Connect integration.

**Models:**

**payout** — Payouts with `vendor_id`, `payout_number` (unique), `gross_amount`, fee fields, `net_amount`, `period_start/end`, `status` (10 states: draft through cancelled), `payment_method`, Stripe fields, processing/approval fields.

**payout_transaction_link** — Links payouts to commission transactions with `payout_id`, `commission_transaction_id`, `amount`.

**Service Logic:** Stripe Connect integration — `createStripeConnectAccount`, onboarding links, dashboard links, vendor balance queries.

**API Routes:**
- Admin: `GET /admin/payouts`, `POST /admin/payouts/[id]/process|hold|release|retry`
- Store: N/A
- Vendor: `GET /vendor/payouts`, `POST /vendor/payouts/request`

**Admin UI:** Payouts page + `payout-processing` widget

**Seeded Data:** 3 payouts

**Cross-Module Relations:** Vendor↔Payout

**External Integrations:** Stripe Connect

**Implementation Status:** ✅ Complete

---

#### 6.17 Invoice

**Scope:** B2B invoicing — invoice creation, payment processing, partial/early payments, voiding.

**Models:**

**invoice** — Invoices with `invoice_number` (unique), `company_id`, `customer_id`, `status` (draft/sent/paid/partially_paid/overdue/void), `issue_date`, `due_date`, pricing fields, `payment_terms_id`, `payment_terms_days`, `early_payment_discount_percent`, `early_payment_discount_days`, `notes`, `internal_notes`.

**invoice_item** — Line items with `invoice` reference, `title`, `description`, `order_id`, `quantity`, `unit_price`, pricing calculations.

**Service Logic:** `createInvoiceWithItems`, partial payment, early payment, void, send.

**API Routes:**
- Admin: CRUD for `/admin/invoices`, `POST /admin/invoices/[id]/pay|send|void|partial-payment|early-payment`, `GET /admin/invoices/overdue`
- Store: `GET /store/invoices`, `GET /store/invoices/[id]`, `POST /store/invoices/[id]/early-payment`

**Admin UI:** No dedicated page (API-only)

**Seeded Data:** 3 invoices

**Cross-Module Relations:** Company↔Invoice

**Temporal Workflows:** `invoice-processing`, `payment-reconciliation`

**Implementation Status:** ✅ Complete

**Gaps:** No dedicated admin page

---

#### 6.18 Quote

**Scope:** B2B quoting — quote creation, approval workflow, conversion to orders.

**Models:**

**quote** — Quotes with `quote_number` (unique), `company_id`, `customer_id`, `tenant_id`, `status` (draft/sent/accepted/rejected/expired/converted), pricing fields, `valid_from`, `valid_until`, approval fields, notes.

**quote_item** — Line items with product/variant reference, `custom_unit_price`, quantity, pricing calculations.

**Service Logic:** `createCartFromQuote`, approve, reject, convert to order.

**API Routes:**
- Admin: CRUD for `/admin/quotes`, `POST /admin/quotes/[id]/approve|reject|convert`, `GET /admin/quotes/expiring`
- Store: `GET/POST /store/quotes`, `GET /store/quotes/[id]`, `POST /store/quotes/[id]/accept|decline`

**Admin UI:** No dedicated page — `quote-management` widget only

**Seeded Data:** 2 quotes

**Implementation Status:** ✅ Complete

**Gaps:** No dedicated admin page

---

### TIER 2 — Backend Complete, No Admin UI (33 modules)

---

#### 6.19 Restaurant

**Scope:** Restaurant management — restaurants, menus, menu items, modifiers, table reservations, reviews.

**Models:** `restaurant` (29 fields: name, handle, cuisine_types, address, operating_hours, delivery settings, ratings), `menu` (menu_type: regular/breakfast/lunch/dinner/drinks/dessert/special), `menu_item` (price, prep time, calories, allergens, dietary tags, spice level), `modifier_group` (single/multiple selection), `modifier` (price adjustment, calories), `table_reservation` (party size, status, time slot), `review` (rating, comment).

**Seeded Data:** 5 restaurants, 4 menus, 8 menu items

**Temporal Workflows:** `restaurant-order-orchestrator`

**API Routes:** Admin + Store CRUD

**Implementation Status:** ⚠️ Partial — backend complete, no admin UI

---

#### 6.20 Auction

**Scope:** Auction marketplace — listings, bids, results, auto-bid rules, escrow.

**Models:** `auction_listing` (auction_type, starting/reserve/buy_now/current price, bid_increment, auto_extend, winner tracking), `bid` (amount, is_auto_bid, max_auto_bid, status), `auction_result` (winner, final_price, payment_status), `auto_bid_rule` (max_amount, increment, is_active), `auction_escrow` (amount, status, payment_reference).

**Seeded Data:** 6 listings, 4 bids

**Cross-Module Relations:** Product↔Auction

**Temporal Workflows:** `auction-lifecycle`

**Implementation Status:** ⚠️ Partial — backend complete, no admin UI

---

#### 6.21 Automotive

**Scope:** Vehicle marketplace — listings, services, test drives, trade-ins, parts catalog.

**Models:** `vehicle_listing` (make, model, year, mileage, fuel_type, transmission, body_type, VIN, condition, price), `vehicle_service` (service_type, status, scheduled_at, estimated/actual cost, parts_used), `test_drive` (scheduled_at, duration, license_verified, interest_level), `trade_in` (estimated/offered/accepted value, condition, appraisal), `part_catalog` (part_number, OEM number, compatible vehicles, condition, weight).

**Seeded Data:** 6 vehicles, 2 services

**Implementation Status:** ⚠️ Partial — backend complete, no admin UI

---

#### 6.22 Classified

**Scope:** Classified listings marketplace — listings, categories, images, flags, offers.

**Models:** `classified_listing` (title, description, price, listing_type, condition, location, contact), `listing_category` (name, parent, icon, display_order), `listing_image` (listing_id, url, display_order, is_primary), `listing_flag` (listing_id, reporter_id, reason, status), `listing_offer` (listing_id, buyer_id, amount, message, status).

**Seeded Data:** 7 listings, 5 categories

**Implementation Status:** ⚠️ Partial — backend complete, no admin UI

---

#### 6.23 Real Estate

**Scope:** Property marketplace — listings, valuations, viewings, leases, documents, agent profiles.

**Models:** `property_listing` (property_type, bedrooms, bathrooms, area, price, listing_type: sale/rent/lease, address, coordinates), `property_valuation` (estimated_value, methodology, comparables), `viewing_appointment` (property_id, customer_id, scheduled_at, status), `lease_agreement` (monthly_rent, deposit, start/end date, terms), `property_document` (document_type, file_url, status), `agent_profile` (name, license_number, specializations, rating).

**Seeded Data:** 7 properties

**External Integrations:** Fleetbase (geocoding, address validation)

**Implementation Status:** ⚠️ Partial — backend complete, no admin UI

---

#### 6.24 Rental

**Scope:** Product rental marketplace — rental products, agreements, periods, returns, damage claims.

**Models:** `rental_product` (rental_type, base_price, deposit_amount, late_fee_per_day, min/max duration, condition, total_rentals), `rental_agreement` (status, start/end date, total_price, deposit_paid/refunded, late_fees), `rental_period` (period_type, price_multiplier, is_blocked), `rental_return` (condition_on_return, inspection_notes, damage_fee, deposit_deduction/refund), `damage_claim` (description, evidence_urls, estimated/actual cost, status).

**Seeded Data:** 7 rental products

**Cross-Module Relations:** Product↔Rental

**Implementation Status:** ⚠️ Partial — backend complete, no admin UI

---

#### 6.25 Healthcare

**Scope:** Healthcare services — practitioners, appointments, medical records, prescriptions, lab orders, pharmacy products, insurance claims.

**Models:** `practitioner` (specialization, license_number, qualifications, consultation_fee, availability), `healthcare_appointment` (practitioner_id, patient_id, scheduled_at, status, diagnosis, notes), `medical_record` (patient_id, record_type, diagnosis, treatment, attachments), `prescription` (medications, dosage, frequency, duration), `lab_order` (test_type, status, results, lab_name), `pharmacy_product` (drug_type, requires_prescription, dosage_form, strength), `insurance_claim` (claim_number, policy_number, amount, status).

**Seeded Data:** 6 practitioners, 2 appointments

**Implementation Status:** ⚠️ Partial — backend complete, no admin UI

---

#### 6.26 Education

**Scope:** Online education — courses, lessons, enrollments, quizzes, certificates, assignments.

**Models:** `course` (instructor_id, title, level: beginner/intermediate/advanced/all_levels, format: self_paced/live/hybrid/in_person, price, duration_hours, status), `lesson` (content_type: video/text/quiz/assignment/live_session/download, duration_minutes, display_order, is_free_preview), `enrollment` (status, progress_pct, lessons_completed, certificate_id), `quiz` (quiz_type: multiple_choice/true_false/short_answer/mixed, questions JSON, passing_score, time_limit), `certificate` (certificate_number unique, issued_at, credential_url, verification_code, skills), `assignment` (status: pending/submitted/grading/graded/resubmit_requested, grade, max_grade, due_date).

**Seeded Data:** 6 courses, 6 lessons

**Implementation Status:** ⚠️ Partial — backend complete, no admin UI

---

#### 6.27 Freelance

**Scope:** Freelance marketplace — gig listings, contracts, proposals, disputes, milestones, time logs.

**Models:** `gig_listing` (title, category, skills, experience_level, budget_type, hourly/fixed price, delivery_days, status), `freelance_contract` (client_id, freelancer_id, amount, payment_type, milestones_count, status), `proposal` (gig_id, freelancer_id, cover_letter, proposed_rate, estimated_duration, status), `freelance_dispute` (contract_id, raised_by, reason, status, resolution), `milestone` (contract_id, title, amount, status, due_date), `time_log` (contract_id, started_at, duration_minutes, hourly_rate, total_amount, is_billable, is_approved).

**Seeded Data:** 7 gigs, 3 contracts

**Implementation Status:** ⚠️ Partial — backend complete, no admin UI

---

#### 6.28 Travel

**Scope:** Hospitality and travel — properties, reservations, rooms, room types, rate plans, guest profiles, amenities.

**Models:** `travel_property` (property_type: hotel/resort/hostel/apartment/villa/guesthouse/motel/boutique, star_rating, check_in/out times, amenities, policies), `travel_reservation` (confirmation_number unique, check_in/out dates, nights, adults, children, status, total_price), `room` (room_number, floor, status: available/occupied/maintenance/out_of_order, is_smoking, is_accessible), `room_type` (base_price, max_occupancy, bed_configuration, room_size_sqm, amenities), `rate_plan` (rate_type: standard/promotional/corporate/package/seasonal, cancellation_policy, includes_breakfast), `guest_profile` (preferences, loyalty_tier, total_stays/nights/spent, nationality, dietary_requirements), `amenity` (category: room/property/dining/wellness/business/entertainment, is_free, price).

**Seeded Data:** 2 properties, 3 reservations, 7 amenities

**Implementation Status:** ⚠️ Partial — backend complete, no admin UI

---

#### 6.29 Grocery

**Scope:** Grocery commerce — fresh products, delivery slots, substitution rules, batch tracking.

**Models:** `fresh_product` (product_id, category, shelf_life_days, storage_temp, unit_type, is_organic, allergens, nutritional_info), `delivery_slot` (date, start_time, end_time, max_orders, current_orders, premium_fee, is_active), `substitution_rule` (original_product_id, substitute_product_id, priority, auto_substitute, customer_approval_required), `batch_tracking` (product_id, batch_number, manufactured_date, expiry_date, quantity, status).

**Seeded Data:** 8 fresh products, 4 delivery slots

**Implementation Status:** ⚠️ Partial — backend complete, no admin UI

---

#### 6.30 Fitness

**Scope:** Fitness and wellness — trainer profiles, class schedules, bookings, gym memberships, wellness plans.

**Models:** `trainer_profile` (name, specializations, certifications, hourly_rate, bio, rating), `class_schedule` (class_type: yoga/pilates/hiit/spinning/boxing/dance/swimming/crossfit/meditation, day_of_week, start/end time, max_capacity, difficulty), `class_booking` (schedule_id, customer_id, status, waitlist_position), `gym_membership` (customer_id, plan_type, status, start/end date, auto_renew), `wellness_plan` (customer_id, trainer_id, goals, exercises, nutrition, duration_weeks).

**Seeded Data:** 5 trainers, 2 schedules

**Implementation Status:** ⚠️ Partial — backend complete, no admin UI

---

#### 6.31 Membership

**Scope:** Loyalty and membership programs — tiers, points, rewards, redemptions.

**Models:** `membership` (customer_id, tier_id, membership_number unique, status, total_points, lifetime_points, total_spent, auto_renew), `membership_tier` (tier_level, min_points, annual_fee, benefits, perks, upgrade/downgrade thresholds, color_code, icon_url), `points_ledger` (membership_id, transaction_type, points, balance_after, source, reference), `redemption` (membership_id, reward_id, points_spent, status, redemption_code, fulfilled_at), `reward` (reward_type, points_required, value, available_quantity, redeemed_count, min_tier_level, valid_from/until, image_url).

**Seeded Data:** 3 memberships, 6 tiers

**Cross-Module Relations:** Customer↔Membership

**Temporal Workflows:** `membership-credential-issuance`

**Implementation Status:** ⚠️ Partial — backend complete, no admin UI

---

#### 6.32 Crowdfunding

**Scope:** Crowdfunding campaigns — campaigns, backers, pledges, updates, reward tiers.

**Models:** `campaign` (title, description, goal_amount, current_amount, backer_count, status, campaign_type, starts/ends_at, images, is_featured), `backer` (campaign_id, customer_id, total_pledged, pledge_count, is_anonymous), `pledge` (campaign_id, backer_id, reward_tier_id, amount, status, payment_reference, anonymous, message), `campaign_update` (campaign_id, title, content, is_public), `reward_tier` (campaign_id, title, pledge_amount, quantity_available/claimed, estimated_delivery, shipping_type).

**Seeded Data:** 5 campaigns, 3 backers

**Implementation Status:** ⚠️ Partial — backend complete, no admin UI

---

#### 6.33 Charity

**Scope:** Charitable giving — organizations, donation campaigns, donations, impact reports.

**Models:** `charity_org` (name, registration_number, category, website, is_verified, tax_deductible, total_raised), `donation_campaign` (charity_id, title, goal_amount, current_amount, donor_count, status, campaign_type, starts/ends_at, is_featured), `donation` (campaign_id, charity_id, donor_id, amount, donation_type, is_anonymous, payment_reference, tax_receipt_id, recurring_id), `impact_report` (charity_id, campaign_id, title, content, report_period, metrics, is_published).

**Seeded Data:** 5 charities, 2 campaigns

**Implementation Status:** ⚠️ Partial — backend complete, no admin UI

---

#### 6.34 Legal

**Scope:** Legal services marketplace — attorney profiles, cases, consultations, retainer agreements.

**Models:** `attorney_profile` (bar_number, specializations, practice_areas, experience_years, hourly_rate, rating, total_cases, languages), `legal_case` (case_number unique, case_type: civil/criminal/corporate/family/immigration/ip/real_estate/tax/labor/environmental, status, priority, filing_date, court_name, opposing_party, estimated/actual cost, outcome), `consultation` (consultation_type, status, scheduled_at, duration_minutes, is_virtual, fee), `retainer_agreement` (agreement_number unique, retainer_amount, billing_cycle, hours_included, hourly_overage_rate, auto_renew, balance_remaining).

**Seeded Data:** 5 attorneys, 2 cases

**Implementation Status:** ⚠️ Partial — backend complete, no admin UI

---

#### 6.35 Financial Product

**Scope:** Financial services — loans, insurance, investments.

**Models:** `loan_product` (loan_type: personal/business/mortgage/auto/education/micro, min/max amount, interest_rate_min/max, interest_type: fixed/variable/reducing_balance, min/max term_months, processing_fee_pct), `loan_application` (application_number unique, requested/approved amount, term_months, interest_rate, monthly_payment, status, income_details, credit_score), `insurance_product` (insurance_type: health/life/auto/home/travel/business/pet/device, coverage_details, min/max premium, deductible_options), `insurance_policy` (policy_number unique, premium_amount, payment_frequency, coverage_amount, deductible, beneficiaries, auto_renew), `investment_plan` (plan_type: savings/fixed_deposit/mutual_fund/gold/crypto/real_estate, min_investment, expected_return_pct, risk_level, lock_in_months, is_shariah_compliant).

**Seeded Data:** 5 loan products, 2 insurance products

**Implementation Status:** ⚠️ Partial — backend complete, no admin UI

---

#### 6.36 Social Commerce

**Scope:** Social selling — live streams, live products, social posts, shares, group buys.

**Models:** `live_stream` (host_id, platform: internal/instagram/tiktok/youtube/facebook, status, viewer/peak counts, total_sales/orders, recording_url), `live_product` (stream_id, product_id, flash_price, flash_quantity/sold, display_order), `social_post` (author_id, post_type: product_review/outfit/unboxing/tutorial/recommendation, product_ids, status, like/comment/share counts, is_shoppable), `social_share` (product_id, platform: whatsapp/instagram/facebook/twitter/tiktok/email/copy_link, click/conversion counts, revenue_generated), `group_buy` (product_id, target/current quantity, original/group price, min/max participants, starts/ends_at).

**Seeded Data:** 5 streams, 3 live products

**Implementation Status:** ⚠️ Partial — backend complete, no admin UI

---

#### 6.37 Advertising

**Scope:** Platform advertising — ad accounts, campaigns, creatives, placements, impression tracking.

**Models:** `ad_account` (advertiser_id, balance, total_spent/deposited, status, auto_recharge config), `ad_campaign` (campaign_type, budget, spent, daily_budget, bid_type, bid_amount, targeting JSON, starts/ends_at, total impressions/clicks/conversions), `ad_creative` (campaign_id, placement_id, creative_type, title, body_text, image/video/click URLs, cta_text, product_ids, approval status), `ad_placement` (placement_type, dimensions, max_ads, price_per_day), `impression_log` (campaign_id, creative_id, placement_id, viewer_id, impression_type, IP, user_agent, revenue).

**Seeded Data:** 5 accounts, 2 campaigns

**Implementation Status:** ⚠️ Partial — backend complete, no admin UI

---

#### 6.38 Affiliate

**Scope:** Affiliate marketing — affiliates, commissions, click tracking, influencer campaigns, referral links.

**Models:** `affiliate` (affiliate_type: individual/company/influencer/blogger, status, commission_rate, commission_type: percentage/flat/tiered, payout settings, total earnings/paid/clicks/conversions, bio, social_links), `affiliate_commission` (affiliate_id, order_id, click_id, order_amount, commission_amount, status, payout_id), `click_tracking` (link_id, affiliate_id, ip_address, user_agent, referrer, converted, conversion_order_id/amount), `influencer_campaign` (affiliate_id, campaign_type: product_review/unboxing/tutorial/social_media/ambassador, budget, deliverables, performance_metrics), `referral_link` (affiliate_id, code unique, target_url, campaign_name, total clicks/conversions/revenue).

**Seeded Data:** 5 affiliates, 2 commissions

**Implementation Status:** ⚠️ Partial — backend complete, no admin UI

---

#### 6.39 Digital Product

**Scope:** Digital product delivery — assets and download licenses.

**Models:** `digital_asset` (product_id, file_url, file_type: pdf/video/audio/image/archive/ebook/software/other, file_size_bytes, preview_url, version, max_downloads, is_active), `download_license` (asset_id, customer_id, order_id, license_key unique, status: active/expired/revoked, download_count, max_downloads, first/last_downloaded_at, expires_at).

**Seeded Data:** 6 assets, 3 licenses

**Implementation Status:** ⚠️ Partial — backend complete, no admin UI

---

#### 6.40 Event Ticketing

**Scope:** Event management — events, ticket types, tickets, venues, check-ins, seat maps.

**Models:** `event` (event_type: concert/conference/workshop/sports/festival/webinar/meetup/other, status, venue_id, starts/ends_at, is_online, max_capacity, current_attendees), `ticket_type` (event_id, price, quantity_total/sold/reserved, max_per_order, sale_starts/ends_at), `ticket` (ticket_type_id, customer_id, barcode unique, qr_data, status: valid/used/cancelled/refunded/transferred, seat_info), `venue` (address, capacity, venue_type: indoor/outdoor/hybrid/virtual, amenities), `check_in` (event_id, ticket_id, check_in_method: scan/manual/online, device_id), `seat_map` (venue_id, event_id, layout JSON, total_seats).

**Seeded Data:** 6 events, 4 tickets, 2 venues

**Implementation Status:** ⚠️ Partial — backend complete, no admin UI

---

#### 6.41 Pet Service

**Scope:** Pet services — profiles, products, grooming bookings, vet appointments.

**Models:** `pet_profile` (owner_id, species: dog/cat/bird/fish/reptile/rabbit/hamster/other, breed, date_of_birth, weight, gender, is_neutered, microchip_id, medical_notes, allergies, vaccinations, photo), `pet_product` (product_id, category: food/treats/toys/accessories/health/grooming, species_tags, breed_specific, age_group, is_prescription_required), `grooming_booking` (pet_id, owner_id, provider_id, service_type: bath/haircut/nail_trim/full_grooming/dental, status, scheduled_at, price), `vet_appointment` (pet_id, owner_id, vet_id, clinic_name, appointment_type: checkup/vaccination/surgery/dental/emergency/follow_up, status, diagnosis, treatment, prescriptions, cost, follow_up_date).

**Seeded Data:** 5 pets, 3 products

**Implementation Status:** ⚠️ Partial — backend complete, no admin UI

---

#### 6.42 Parking

**Scope:** Parking and mobility — zones, sessions, ride requests, shuttle routes.

**Models:** `parking_zone` (zone_type: street/lot/garage/underground/rooftop/airport, address, coordinates, total/available spots, hourly/daily/monthly rates, has_ev_charging, has_disabled_spots), `parking_session` (zone_id, vehicle_plate, spot_number, status: active/completed/expired/cancelled, duration_minutes, amount, payment_status, is_ev_charging), `ride_request` (ride_type: standard/premium/shared/accessibility, pickup/dropoff locations, status, estimated/actual fare, distance_km, driver_id, rating), `shuttle_route` (route_type: fixed/on_demand/event/airport, stops JSON, schedule, vehicle_type, capacity, price).

**Seeded Data:** 6 zones, 3 sessions

**Implementation Status:** ⚠️ Partial — backend complete, no admin UI

---

#### 6.43 Utilities

**Scope:** Utility services — accounts, billing, meter readings, usage records.

**Models:** `utility_account` (utility_type: electricity/water/gas/internet/phone/cable/waste, provider_name, account/meter numbers, status, auto_pay), `utility_bill` (bill_number unique, billing_period, due_date, amount, consumption, status: generated/sent/paid/overdue/disputed, late_fee), `meter_reading` (reading_value, reading_date, reading_type: manual/smart_meter/estimated, previous_reading, consumption, is_verified), `usage_record` (period_start/end, usage_value, unit, usage_type: consumption/peak/off_peak/reactive, cost, tier).

**Seeded Data:** 5 accounts, 2 bills

**Implementation Status:** ⚠️ Partial — backend complete, no admin UI

---

#### 6.44 Government

**Scope:** Government and municipal services — citizen profiles, licenses, permits, fines, service requests.

**Models:** `citizen_profile` (national_id, full_name, date_of_birth, address, preferred_language, registered_services, total_requests), `municipal_license` (holder_id, license_type: business/trade/food/liquor/construction/event/health/transport, license_number unique, status, issued/expires_at, fee, conditions, issuing_authority), `permit` (applicant_id, permit_type: building/demolition/renovation/signage/excavation/event/parking/environmental/food_service, permit_number unique, status, fee, conditions, documents), `fine` (citizen_id, fine_type: traffic/parking/environmental/building/noise/health/business, fine_number unique, amount, status: issued/paid/overdue/contested/waived, evidence, contested_reason), `service_request` (citizen_id, request_type: maintenance/complaint/inquiry/emergency/feedback, category, title, description, location, status, priority: low/medium/high/urgent/critical, assigned_to, department, resolution).

**Seeded Data:** 10 citizens, 3 licenses

**Implementation Status:** ⚠️ Partial — backend complete, no admin UI

---

#### 6.45 Loyalty

**Scope:** Loyalty programs — programs, accounts, point transactions.

**Models:** `loyalty_program` (name, points_per_currency, status, tiers JSON, earn_rules JSON), `loyalty_account` (program_id, customer_id, points_balance, lifetime_points, tier, tier_expires_at, status), `point_transaction` (account_id, type: earn/redeem/expire/adjust/transfer/bonus, points, balance_after, reference_type/id, description, expires_at).

**Seeded Data:** 2 programs, 4 ledger entries

**Implementation Status:** ⚠️ Partial — backend complete, no admin UI

---

#### 6.46 Dispute

**Scope:** Order dispute resolution — disputes and messaging.

**Models:** `dispute` (order_id, customer_id, vendor_id, type, status: open default, priority: medium default, resolution, resolution_amount, resolved_by/at, escalated_at), `dispute_message` (dispute_id, sender_type, sender_id, content, attachments, is_internal).

**Seeded Data:** Via core

**Implementation Status:** ⚠️ Partial — backend complete, no admin UI

---

#### 6.47 Promotion Extension

**Scope:** Extended promotions — customer segments, gift cards, product bundles, referrals.

**Models:** `customer_segment` (segment_type, rules JSON, customer_count, is_active), `gift_card_ext` (code unique, initial/remaining value, sender/recipient info, message, delivered_at, expires_at), `product_bundle` (handle unique, bundle_type, discount_type, discount_value, min/max items, starts/ends_at), `referral` (referrer/referred_customer_id, referral_code unique, status, reward_type, reward_value, reward_given, expires_at, completed_at).

**Seeded Data:** 3 segments, 3 gift cards, 2 bundles

**Implementation Status:** ⚠️ Partial — backend complete, no admin UI

---

#### 6.48 Wishlist

**Scope:** Customer wishlists — lists and items.

**Models:** `wishlist` (customer_id, title, is_default, visibility: private/shared/public, share_token), `wishlist_item` (wishlist_id, product_id, variant_id, added_at, priority, notes).

**Seeded Data:** 5 wishlists, 4 items

**Implementation Status:** ⚠️ Partial — backend complete, no admin UI

---

#### 6.49 Notification Preferences

**Scope:** Customer notification preferences — per-channel, per-event-type preferences.

**Models:** `notification_preference` (customer_id, tenant_id, channel, event_type, enabled, frequency).

**Seeded Data:** 48 notifications, 4 preferences

**Implementation Status:** ⚠️ Partial — backend complete, no admin UI

---

#### 6.50 Region Zone

**Scope:** Map residency zones to Medusa regions.

**Models:**

**region_zone_mapping**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | id | PK | Primary key |
| residency_zone | enum | required | GCC, EU, MENA, APAC, AMERICAS, GLOBAL |
| medusa_region_id | text | required | Medusa region ID |
| country_codes | json | nullable | Country codes in zone |
| policies_override | json | nullable | Policy overrides |
| metadata | json | nullable | Custom metadata |

**Admin UI:** Region Zones page (has admin page)

**Seeded Data:** 1 mapping

**Implementation Status:** ✅ Complete (has admin page)

---

#### 6.51 Store

**Scope:** Multi-brand storefronts — store entities within tenants.

**Models:**

**cityosStore**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | id | PK | Primary key |
| tenant_id | text | required | Tenant reference |
| handle | text | unique | Store handle |
| name | text | required | Store name |
| sales_channel_id | text | required | Medusa sales channel |
| default_region_id | text | nullable | Default region |
| supported_currency_codes | json | nullable | Supported currencies |
| storefront_url | text | nullable | Storefront URL |
| subdomain | text | unique, nullable | Subdomain |
| custom_domain | text | unique, nullable | Custom domain |
| theme_config | json | nullable | Theme configuration |
| logo_url | text | nullable | Logo URL |
| favicon_url | text | nullable | Favicon URL |
| brand_colors | json | nullable | Brand colors |
| store_type | enum | default "retail" | retail, marketplace, b2b, subscription, hybrid |
| status | enum | default "inactive" | active, inactive, maintenance, coming_soon |
| seo_title | text | nullable | SEO title |
| seo_description | text | nullable | SEO description |
| seo_keywords | json | nullable | SEO keywords |
| cms_site_id | text | nullable | Payload CMS site ID |
| settings | json | nullable | Store settings |
| metadata | json | nullable | Custom metadata |

**Seeded Data:** 5 stores

**Cross-Module Relations:** Tenant↔Store, Vendor↔Store

**Temporal Workflows:** `store-setup`, `store-config-sync`

**API Routes:**
- Admin: `GET/POST /admin/tenant/stores`
- Store: `GET /store/stores/default`, `GET /store/stores/by-subdomain/[subdomain]`, `GET /store/stores/by-domain/[domain]`

**Implementation Status:** ⚠️ Partial — backend complete, no dedicated admin UI page

---

### TIER 3 — Incomplete (7 modules)

---

#### 6.52 CMS Content

**Scope:** Content management — pages and navigation, integrated with Payload CMS.

**Models:** `cms_page` (title, slug, locale, status, template, layout, SEO fields, country_code, region_zone, node_id, published_at), `cms_navigation` (locale, location, items JSON, status).

**Implementation Status:** ❌ Minimal — DB tables don't exist. Uses code-based content registry with Payload CMS as primary content source.

**Gaps:** Missing migrations, tables not created. Content served from Payload CMS via API.

---

#### 6.53 Analytics

**Scope:** Platform analytics — events, dashboards, reports.

**Models:** `analytics_event` (event_type, entity_type, entity_id, customer_id, session_id, properties, revenue, currency), `dashboard` (name, slug, widgets JSON, layout, is_default, role_access), `report` (name, slug, report_type, date_range_type, filters, schedule, last_generated, is_public).

**Service Logic:** Has service methods for event tracking.

**Implementation Status:** ❌ Minimal — `dashboard` and `report` tables don't exist. Only `analytics_event` table may exist.

**Gaps:** Missing migrations for dashboard/report tables, no admin UI.

---

#### 6.54 Cart Extension

**Scope:** Extended cart metadata — gift wrapping, delivery instructions, special handling.

**Models:** `cart_metadata` (cart_id, tenant_id, gift_wrap, gift_message, delivery_instructions, preferred_delivery_date, special_handling, source_channel).

**Service Logic:** `getByCartId` only.

**Implementation Status:** ❌ Minimal — single service method, no admin UI, minimal functionality.

**Gaps:** No admin UI, very limited service logic.

---

#### 6.55 Shipping Extension

**Scope:** Extended shipping — carrier configurations and rate management.

**Models:** `carrier_config` (carrier_code, carrier_name, api_endpoint, supported_countries, tracking_url_template, max_weight, max_dimensions), `shipping_rate` (carrier_id, service_type, origin/destination zones, base_rate, per_kg_rate, weight limits, estimated delivery days).

**Implementation Status:** ❌ Minimal — DB tables don't exist.

**Temporal Workflows:** `fulfillment-dispatch`, `shipment-tracking-start`, `delivery-confirmation`

**Gaps:** Missing migrations, tables not created. Temporal workflows defined but carrier integration not implemented.

---

#### 6.56 Inventory Extension

**Scope:** Extended inventory management — reservation holds, stock alerts, warehouse transfers.

**Models:** `reservation_hold` (variant_id, quantity, reason, reference_id, expires_at, status), `stock_alert` (variant_id, product_id, alert_type, threshold, current_quantity, is_resolved, notified_at), `warehouse_transfer` (source/destination location IDs, transfer_number unique, status, items JSON, initiated_by, shipped/received_at).

**Implementation Status:** ❌ Minimal — DB tables don't exist.

**Temporal Workflows:** `inventory-reconciliation`

**Gaps:** Missing migrations, tables not created. Temporal workflow defined but not functional.

---

#### 6.57 Tax Config

**Scope:** Tax configuration — rules and exemptions.

**Models:** `tax_rule` (country_code, region_code, city, postal_code_pattern, tax_rate, valid_from/to), `tax_config_exemption` (entity_type, entity_id, tax_rule_id, exemption_type, exemption_rate, certificate_number, valid_from/to, status).

**Implementation Status:** ❌ Minimal — `tax_rule` table missing. `tax_exemption` functionality exists in company module.

**Gaps:** `tax_rule` migration missing. Overlaps with company module's tax exemption.

---

#### 6.58 Events (Outbox)

**Scope:** Internal event infrastructure — transactional outbox pattern for reliable event dispatch to Temporal.

**Models:**

**event_outbox**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | id | PK | Primary key |
| tenant_id | text | indexed | Tenant reference |
| event_type | text | indexed | Event type |
| aggregate_type | text | required | Aggregate type |
| aggregate_id | text | required | Aggregate ID |
| payload | json | required | Event payload |
| metadata | json | nullable | Event metadata |
| source | text | default "commerce" | Event source |
| correlation_id | text | nullable, indexed | Correlation ID |
| causation_id | text | nullable | Causation ID |
| actor_id | text | nullable | Actor user ID |
| actor_role | text | nullable | Actor role |
| node_id | text | nullable | Node context |
| channel | text | nullable | Channel context |
| status | enum | default "pending" | pending, published, failed, archived |
| published_at | dateTime | nullable | Published timestamp |
| error | text | nullable | Error message |
| retry_count | number | default 0 | Retry count |

*Indexes:* `[tenant_id]`, `[status]`, `[event_type]`, `[aggregate_type, aggregate_id]`, `[correlation_id]`, `[tenant_id, status]`

**Implementation:** Outbox processor with circuit breaker pattern. Polls pending events, publishes to Temporal, marks as published/failed.

**Implementation Status:** ⚠️ Partial — infrastructure module, functional but internal-only.

---

## 7. Admin Panel Summary

### 7.1 Admin Pages (21 total)

| # | Route | Label | Icon | Module |
|---|-------|-------|------|--------|
| 1 | `/tenants` | Tenants | Building | tenant |
| 2 | `/tenants/[id]` | Tenant Detail | — | tenant |
| 3 | `/tenants/[id]/billing` | Tenant Billing | — | tenant |
| 4 | `/vendors` | Vendors | Store | vendor |
| 5 | `/vendors/analytics` | Vendor Analytics | BarChart | vendor |
| 6 | `/bookings` | Bookings | Calendar | booking |
| 7 | `/settings/bookings` | Booking Settings | Settings | booking |
| 8 | `/settings/payment-terms` | Payment Terms | CreditCard | company |
| 9 | `/commissions/tiers` | Commission Tiers | Layers | commission |
| 10 | `/commissions/transactions` | Commission Transactions | ArrowLeftRight | commission |
| 11 | `/companies/[id]` | Company Detail | Building2 | company |
| 12 | `/subscriptions` | Subscriptions | Repeat | subscription |
| 13 | `/nodes` | Nodes | Network | node |
| 14 | `/governance` | Governance | Shield | governance |
| 15 | `/personas` | Personas | Users | persona |
| 16 | `/volume-pricing` | Volume Pricing | Tags | volume-pricing |
| 17 | `/warranty` | Warranty | ShieldCheck | warranty |
| 18 | `/i18n` | Translations | Languages | i18n |
| 19 | `/audit` | Audit Logs | FileText | audit |
| 20 | `/channels` | Channels | Radio | channel |
| 21 | `/payouts` | Payouts | Wallet | payout |
| 22 | `/region-zones` | Region Zones | Map | region-zone |

### 7.2 Admin Widgets (7 total)

| # | Widget | Zone | Module |
|---|--------|------|--------|
| 1 | `commission-config` | Product Detail | commission |
| 2 | `customer-business-info` | Customer Detail | company |
| 3 | `order-business-info` | Order Detail | company |
| 4 | `payout-processing` | Vendor Detail | payout |
| 5 | `product-business-config` | Product Detail | volume-pricing |
| 6 | `quote-management` | Order Detail | quote |
| 7 | `vendor-management` | Vendor Detail | vendor |

### 7.3 Shared Admin Components

| Component | Description |
|-----------|-------------|
| `DataTable` | Reusable data table with sorting, filtering, pagination |
| `StatsGrid` | Grid layout for statistics display |
| `StatsCard` | Individual statistic card |
| `StatusBadge` | Color-coded status badge |
| `TierBadge` | Tier/level badge |
| `TimelineView` | Timeline/activity feed |
| `FormDrawer` | Side drawer with form |
| `ConfirmModal` | Confirmation dialog |
| `EmptyState` | Empty state placeholder |
| `LoadingState` | Loading indicator |
| `MoneyDisplay` | Formatted currency display |

### 7.4 Admin Hooks (19 total)

| Hook | Module |
|------|--------|
| `use-audit` | audit |
| `use-availability` | booking |
| `use-bookings` | booking |
| `use-channels` | channel |
| `use-companies` | company |
| `use-governance` | governance |
| `use-i18n` | i18n |
| `use-invoices` | invoice |
| `use-nodes` | node |
| `use-payment-terms` | company |
| `use-personas` | persona |
| `use-quotes` | quote |
| `use-region-zones` | region-zone |
| `use-reviews` | review |
| `use-subscriptions` | subscription |
| `use-tenants` | tenant |
| `use-vendors` | vendor |
| `use-volume-pricing` | volume-pricing |
| `use-warranty` | warranty |

---

## 8. Gap Analysis & Recommendations

### 8.1 Admin UI Gaps

**33 modules** have no dedicated admin UI. Priority recommendations:

| Priority | Module | Reason |
|----------|--------|--------|
| High | restaurant | Core vertical with 7 models, seeded data |
| High | auction | Active marketplace feature with Temporal workflow |
| High | membership | Customer loyalty with Temporal workflow, cross-module link |
| High | store | Core platform entity, already has link definitions |
| Medium | rental | Product extension with cross-module link |
| Medium | event-ticketing | 6 models, rich seeded data |
| Medium | real-estate | 6 models, Fleetbase integration |
| Medium | healthcare | 7 models, sensitive domain |
| Medium | education | 6 models, course/enrollment tracking |
| Low | digital-product | 2 simple models |
| Low | wishlist | 2 simple models |
| Low | notification-preferences | 1 simple model |

### 8.2 Missing Database Migrations

| Module | Missing Tables | Impact |
|--------|---------------|--------|
| cms-content | `cms_page`, `cms_navigation` | Content served from Payload CMS instead |
| analytics | `dashboard`, `report` | Only `analytics_event` may exist |
| shipping-extension | `carrier_config`, `shipping_rate` | Fulfillment workflows non-functional |
| inventory-extension | `reservation_hold`, `stock_alert`, `warehouse_transfer` | Inventory reconciliation workflow non-functional |
| tax-config | `tax_rule` | Tax exemption exists in company module |

### 8.3 Service Logic Gaps

~20 modules rely solely on auto-generated CRUD. Modules that would benefit from custom service logic:

- **restaurant** — order orchestration, menu management, table booking logic
- **auction** — bid validation, auto-extend, settlement
- **rental** — availability checking, pricing calculation, return processing
- **education** — enrollment management, progress tracking, certificate issuance
- **healthcare** — appointment scheduling, prescription validation
- **membership** — tier upgrades/downgrades, points expiration
- **loyalty** — tier calculation, points expiration, reward fulfillment

### 8.4 External Integration Configuration

All 5 external integrations require environment variables:

| Integration | Required Env Vars | Status |
|-------------|-------------------|--------|
| Payload CMS | `PAYLOAD_CMS_URL_DEV`, `PAYLOAD_API_KEY` | Not configured |
| ERPNext | `ERPNEXT_API_KEY`, `ERPNEXT_API_SECRET`, `ERPNEXT_URL_DEV` | Not configured |
| Fleetbase | `FLEETBASE_API_KEY`, `FLEETBASE_URL_DEV` | Not configured |
| Walt.id | `WALTID_URL_DEV`, `WALTID_API_KEY` | Not configured |
| Stripe | `STRIPE_SECRET_KEY` | Not configured |

### 8.5 Temporal Cloud Configuration

| Env Var | Required | Status |
|---------|----------|--------|
| `TEMPORAL_ENDPOINT` | Yes | Not configured |
| `TEMPORAL_API_KEY` | Yes | Not configured |
| `TEMPORAL_NAMESPACE` | Yes | Not configured |

Without Temporal Cloud:
- 30+ system workflows will not execute
- Event outbox processor will silently skip dispatch
- Cross-system coordination (ERPNext sync, CMS sync, fulfillment) will be inactive

### 8.6 Recommendations

1. **Phase 1 — Foundation:** Configure Stripe and Temporal Cloud. Create admin UI for store, membership, and restaurant modules.
2. **Phase 2 — Vertical Expansion:** Run migrations for Tier 3 modules (shipping-extension, inventory-extension). Build admin UIs for auction, rental, event-ticketing.
3. **Phase 3 — Integration:** Configure Payload CMS, ERPNext, Fleetbase, Walt.id. Verify webhook endpoints and sync flows.
4. **Phase 4 — Polish:** Add custom service logic for ~20 CRUD-only modules. Build remaining admin UIs for government, healthcare, education verticals.
5. **Phase 5 — Production:** End-to-end testing of all Temporal workflows. Performance testing for multi-tenant isolation. Security audit of RBAC and data classification.

---

## 9. Complete Model & Entity Registry

This section documents the comprehensive results of a deep audit across all 58 custom modules, cross-referencing model definitions in code against actual database tables, API route implementations, and storefront references.

---

### 9.1 Models Defined in Code but Missing Database Tables (17 entities)

These models exist as exported classes/entities in module code but have **no corresponding database table** created via migrations.

| # | Model Name | Module | Notes |
|---|-----------|--------|-------|
| 1 | `cms_navigation` | CMS Content | Navigation tree model — no migration exists |
| 2 | `cms_page` | CMS Content | Page content model — no migration exists |
| 3 | `dashboard` | Analytics | Dashboard configuration model — no migration exists |
| 4 | `report` | Analytics | Report definition model — no migration exists |
| 5 | `cart_metadata` | Cart Extension | Extended cart metadata — no migration exists |
| 6 | `carrier_config` | Shipping Extension | Carrier configuration — no migration exists |
| 7 | `shipping_rate` | Shipping Extension | Shipping rate rules — no migration exists |
| 8 | `reservation_hold` | Inventory Extension | Inventory reservation holds — no migration exists |
| 9 | `stock_alert` | Inventory Extension | Stock alert thresholds — no migration exists |
| 10 | `warehouse_transfer` | Inventory Extension | Inter-warehouse transfers — no migration exists |
| 11 | `tax_rule` | Tax Config | Tax rule definitions — no migration exists (TaxExemption has table) |
| 12 | `notification_preference` | Notification Preferences | User notification settings — no migration exists |
| 13 | `loyalty_account` | Loyalty | Customer loyalty account — no migration exists (LoyaltyProgram has table) |
| 14 | `point_transaction` | Loyalty | Points transaction log — no migration exists (loyalty_points_ledger exists as separate entity) |
| 15 | `service_channel` | Channel | Defined as MarketplaceListing/ServiceChannel export — no table |
| 16 | `tenant_poi` | Tenant | Defined as TenantPOI export — no table |
| 17 | `tenant_relationship` | Tenant | Defined as TenantRelationship export — no table |

**Impact:** These 17 models will throw runtime errors if any service or API route attempts to query them. Migrations must be created before these features can be activated.

---

### 9.2 Database Tables with Models Not Tracked in Main Documentation (13 entities)

These tables exist in the database with full schemas but were not previously documented in the per-module assessment sections.

#### 1. `approval_action` (14 columns)
Part of the booking module approval workflow.

| Column | Type | Description |
|--------|------|-------------|
| id | text PK | Primary key |
| approval_request_id | text | FK to approval_request |
| actor_id | text | User who took action |
| action | text | Action type (approve/reject/escalate) |
| comment | text | Action comment |
| previous_status | text | Status before action |
| new_status | text | Status after action |
| metadata | jsonb | Additional metadata |
| tenant_id | text | Tenant scope |
| created_at | timestamptz | Created timestamp |
| updated_at | timestamptz | Updated timestamp |
| deleted_at | timestamptz | Soft delete |
| raw_comment | jsonb | Raw comment data |
| raw_metadata | jsonb | Raw metadata |

#### 2. `approval_request` (20 columns)
Part of the booking module approval workflow.

| Column | Type | Description |
|--------|------|-------------|
| id | text PK | Primary key |
| workflow_id | text | FK to approval_workflow |
| entity_type | text | Type of entity being approved |
| entity_id | text | ID of entity being approved |
| requester_id | text | User requesting approval |
| current_step | integer | Current workflow step |
| status | text | pending/approved/rejected/escalated |
| priority | text | Request priority |
| due_date | timestamptz | Due date for approval |
| approved_at | timestamptz | When approved |
| rejected_at | timestamptz | When rejected |
| escalated_at | timestamptz | When escalated |
| notes | text | Request notes |
| context | jsonb | Request context data |
| metadata | jsonb | Additional metadata |
| tenant_id | text | Tenant scope |
| created_at | timestamptz | Created timestamp |
| updated_at | timestamptz | Updated timestamp |
| deleted_at | timestamptz | Soft delete |
| raw_context | jsonb | Raw context data |

#### 3. `availability_exception` (16 columns)
Part of the booking module — overrides regular availability schedules.

| Column | Type | Description |
|--------|------|-------------|
| id | text PK | Primary key |
| availability_id | text | FK to availability |
| title | text | Exception title |
| exception_type | text | Type (holiday/blackout/special) |
| start_date | timestamptz | Exception start |
| end_date | timestamptz | Exception end |
| all_day | boolean | Full day exception |
| start_time | text | Start time override |
| end_time | text | End time override |
| recurrence | jsonb | Recurrence rules |
| reason | text | Reason for exception |
| metadata | jsonb | Additional metadata |
| tenant_id | text | Tenant scope |
| created_at | timestamptz | Created timestamp |
| updated_at | timestamptz | Updated timestamp |
| deleted_at | timestamptz | Soft delete |

#### 4. `booking_item` (22 columns)
Part of the booking module — individual items within a booking.

| Column | Type | Description |
|--------|------|-------------|
| id | text PK | Primary key |
| booking_id | text | FK to booking |
| service_product_id | text | FK to service_product |
| provider_id | text | Service provider |
| title | text | Item title |
| description | text | Item description |
| quantity | integer | Quantity |
| unit_price | numeric | Unit price |
| total_price | numeric | Total price |
| duration_minutes | integer | Duration |
| start_time | timestamptz | Item start time |
| end_time | timestamptz | Item end time |
| status | text | Item status |
| notes | text | Item notes |
| resource_id | text | Assigned resource |
| metadata | jsonb | Additional metadata |
| tenant_id | text | Tenant scope |
| created_at | timestamptz | Created timestamp |
| updated_at | timestamptz | Updated timestamp |
| deleted_at | timestamptz | Soft delete |
| raw_unit_price | jsonb | Raw unit price |
| raw_total_price | jsonb | Raw total price |

#### 5. `booking_reminder` (20 columns)
Part of the booking module — automated reminder scheduling.

| Column | Type | Description |
|--------|------|-------------|
| id | text PK | Primary key |
| booking_id | text | FK to booking |
| reminder_type | text | Type (email/sms/push) |
| channel | text | Delivery channel |
| scheduled_at | timestamptz | When to send |
| sent_at | timestamptz | When actually sent |
| status | text | pending/sent/failed/cancelled |
| recipient_id | text | Recipient user ID |
| recipient_email | text | Recipient email |
| recipient_phone | text | Recipient phone |
| subject | text | Reminder subject |
| message | text | Reminder message |
| template_id | text | Template reference |
| retry_count | integer | Number of retries |
| error_message | text | Last error |
| metadata | jsonb | Additional metadata |
| tenant_id | text | Tenant scope |
| created_at | timestamptz | Created timestamp |
| updated_at | timestamptz | Updated timestamp |
| deleted_at | timestamptz | Soft delete |

#### 6. `credit_line` (10 columns)
Financial entity for company credit management.

| Column | Type | Description |
|--------|------|-------------|
| id | text PK | Primary key |
| company_id | text | FK to company |
| credit_limit | numeric | Maximum credit |
| balance | numeric | Current balance |
| currency_code | text | Currency |
| status | text | active/suspended/closed |
| metadata | jsonb | Additional metadata |
| tenant_id | text | Tenant scope |
| created_at | timestamptz | Created timestamp |
| updated_at | timestamptz | Updated timestamp |

#### 7. `loyalty_points_ledger` (15 columns)
Loyalty points transaction ledger — tracks all point movements.

| Column | Type | Description |
|--------|------|-------------|
| id | text PK | Primary key |
| tenant_id | text | Tenant scope |
| customer_id | text | Customer reference |
| program_id | text | FK to loyalty_program |
| transaction_type | text | earn/redeem/expire/adjust |
| points | integer | Points amount |
| balance_after | integer | Balance after transaction |
| reference_type | text | Source type (order/review/referral) |
| reference_id | text | Source entity ID |
| description | text | Transaction description |
| expires_at | timestamptz | Point expiry date |
| metadata | jsonb | Additional metadata |
| created_at | timestamptz | Created timestamp |
| updated_at | timestamptz | Updated timestamp |
| deleted_at | timestamptz | Soft delete |

#### 8. `vendor_analytics_snapshot` (35 columns)
Periodic vendor performance snapshots for analytics dashboards.

| Column | Type | Description |
|--------|------|-------------|
| id | text PK | Primary key |
| vendor_id | text | FK to vendor |
| tenant_id | text | Tenant scope |
| period_type | text | daily/weekly/monthly |
| period_start | timestamptz | Period start date |
| period_end | timestamptz | Period end date |
| total_orders | integer | Total orders in period |
| completed_orders | integer | Completed orders |
| cancelled_orders | integer | Cancelled orders |
| returned_orders | integer | Returned orders |
| gross_revenue | numeric | Gross revenue |
| net_revenue | numeric | Net revenue |
| total_commission | numeric | Total commission charged |
| total_refunds | numeric | Total refunds issued |
| total_products | integer | Total product count |
| active_products | integer | Active product count |
| out_of_stock_products | integer | Out-of-stock products |
| average_order_value | numeric | AOV |
| fulfillment_time | numeric | Avg fulfillment time (hours) |
| delivery_rate | numeric | Successful delivery rate |
| unique_customers | integer | Unique customer count |
| repeat_customers | integer | Repeat customer count |
| average_rating | numeric | Average review rating |
| total_reviews | integer | Total review count |
| metadata | jsonb | Additional metadata |
| created_at | timestamptz | Created timestamp |
| updated_at | timestamptz | Updated timestamp |
| deleted_at | timestamptz | Soft delete |
| raw_gross_revenue | jsonb | Raw gross revenue |
| raw_net_revenue | jsonb | Raw net revenue |
| raw_total_commission | jsonb | Raw commission |
| raw_total_refunds | jsonb | Raw refunds |
| raw_average_order_value | jsonb | Raw AOV |
| raw_fulfillment_time | jsonb | Raw fulfillment time |
| raw_delivery_rate | jsonb | Raw delivery rate |

#### 9. `vendor_order_item` (32 columns)
Individual line items within a vendor-specific order split.

| Column | Type | Description |
|--------|------|-------------|
| id | text PK | Primary key |
| vendor_order_id | text | FK to vendor_order |
| line_item_id | text | Original order line item |
| product_id | text | Product reference |
| variant_id | text | Product variant reference |
| title | text | Product title |
| sku | text | SKU |
| thumbnail | text | Thumbnail URL |
| quantity | integer | Ordered quantity |
| fulfilled_quantity | integer | Fulfilled quantity |
| returned_quantity | integer | Returned quantity |
| unit_price | numeric | Unit price |
| subtotal | numeric | Subtotal |
| discount_amount | numeric | Discount amount |
| tax_amount | numeric | Tax amount |
| total_amount | numeric | Total amount |
| vendor_cost | numeric | Vendor cost |
| commission_amount | numeric | Commission charged |
| net_amount | numeric | Net amount to vendor |
| status | text | Item status |
| metadata | jsonb | Additional metadata |
| tenant_id | text | Tenant scope |
| created_at | timestamptz | Created timestamp |
| updated_at | timestamptz | Updated timestamp |
| deleted_at | timestamptz | Soft delete |
| raw_unit_price | jsonb | Raw unit price |
| raw_subtotal | jsonb | Raw subtotal |
| raw_discount_amount | jsonb | Raw discount |
| raw_tax_amount | jsonb | Raw tax |
| raw_total_amount | jsonb | Raw total |
| raw_vendor_cost | jsonb | Raw vendor cost |
| raw_commission_amount | jsonb | Raw commission |

#### 10. `vendor_performance_metric` (18 columns)
Real-time vendor performance tracking metrics.

| Column | Type | Description |
|--------|------|-------------|
| id | text PK | Primary key |
| vendor_id | text | FK to vendor |
| tenant_id | text | Tenant scope |
| metric_type | text | Metric type (fulfillment_rate/response_time/etc) |
| value | numeric | Metric value |
| threshold_warning | numeric | Warning threshold |
| threshold_critical | numeric | Critical threshold |
| status | text | healthy/warning/critical |
| measured_at | timestamptz | Measurement timestamp |
| period_days | integer | Measurement period |
| sample_count | integer | Number of samples |
| metadata | jsonb | Additional metadata |
| created_at | timestamptz | Created timestamp |
| updated_at | timestamptz | Updated timestamp |
| deleted_at | timestamptz | Soft delete |
| raw_value | jsonb | Raw value |
| raw_threshold_warning | jsonb | Raw warning threshold |
| raw_threshold_critical | jsonb | Raw critical threshold |

#### 11. `workflow_execution` (11 columns)
Temporal workflow execution tracking.

| Column | Type | Description |
|--------|------|-------------|
| id | text PK | Primary key |
| workflow_id | text | Temporal workflow ID |
| transaction_id | text | Associated transaction |
| execution | jsonb | Execution details |
| context | jsonb | Workflow context |
| state | text | Execution state |
| created_at | timestamptz | Created timestamp |
| updated_at | timestamptz | Updated timestamp |
| deleted_at | timestamptz | Soft delete |
| retention_time | timestamptz | Data retention deadline |
| run_id | text | Temporal run ID |

#### 12. `tenant_invoice` (28 columns)
Tenant platform invoices for billing (documented in Tenant module but not in per-table detail).

| Column | Type | Description |
|--------|------|-------------|
| id | text PK | Primary key |
| tenant_id | text | Tenant reference |
| billing_id | text | FK to tenant_billing |
| invoice_number | text | Invoice number |
| period_start | timestamptz | Billing period start |
| period_end | timestamptz | Billing period end |
| currency_code | text | Currency |
| base_amount | numeric | Base subscription amount |
| usage_amount | numeric | Usage charges |
| discount_amount | numeric | Discounts applied |
| tax_amount | numeric | Tax amount |
| total_amount | numeric | Total invoice amount |
| status | text | draft/sent/paid/overdue/void |
| paid_at | timestamptz | Payment date |
| payment_method | text | Payment method used |
| stripe_invoice_id | text | Stripe invoice reference |
| invoice_pdf_url | text | PDF download URL |
| due_date | timestamptz | Payment due date |
| line_items | jsonb | Itemized line items |
| metadata | jsonb | Additional metadata |
| created_at | timestamptz | Created timestamp |
| updated_at | timestamptz | Updated timestamp |
| deleted_at | timestamptz | Soft delete |
| raw_base_amount | jsonb | Raw base amount |
| raw_usage_amount | jsonb | Raw usage amount |
| raw_discount_amount | jsonb | Raw discount |
| raw_tax_amount | jsonb | Raw tax |
| raw_total_amount | jsonb | Raw total |

#### 13. `user_preference` (7 columns)
User-specific preference storage.

| Column | Type | Description |
|--------|------|-------------|
| id | text PK | Primary key |
| user_id | text | User reference |
| key | text | Preference key |
| value | jsonb | Preference value |
| created_at | timestamptz | Created timestamp |
| updated_at | timestamptz | Updated timestamp |
| deleted_at | timestamptz | Soft delete |

---

### 9.3 Storefront API Endpoints Without Backend Routes (9 missing routes)

These endpoints are referenced in the storefront application but have **no corresponding backend API route implementation** in `apps/backend/src/api/store/`.

| # | Endpoint | Purpose | Storefront Reference |
|---|----------|---------|---------------------|
| 1 | `/store/bundles` | Product bundle browsing | Bundle components in storefront |
| 2 | `/store/consignments` | Consignment tracking | Consignment components |
| 3 | `/store/credit` | Store credit management | Store credit components |
| 4 | `/store/flash-sales` | Flash sale listings | Flash sale promotion pages |
| 5 | `/store/gift-cards` | Gift card purchasing | Gift card components |
| 6 | `/store/loyalty` | Loyalty program interaction | Loyalty components |
| 7 | `/store/newsletter` | Newsletter subscription | Newsletter signup forms |
| 8 | `/store/trade-in` | Trade-in submissions | Trade-in components |
| 9 | `/store/wallet` | Digital wallet operations | Wallet/payments components |

**Impact:** These storefront pages will show errors or empty states when accessed. Backend route handlers and corresponding service logic must be implemented.

---

### 9.4 Complete Model Count by Module

Comprehensive registry of all 58 modules with model details. Models marked with `*` are code-only (no database table).

| # | Module | Models | Model Names | DB Tables | API Routes | Admin UI | Seeded Data |
|---|--------|--------|-------------|-----------|------------|----------|-------------|
| 1 | tenant | 8 | Tenant, TenantUser, TenantSettings, TenantBilling, TenantInvoice, TenantUsageRecord, TenantPOI\*, TenantRelationship\* | 6/8 | Yes | Yes | Yes |
| 2 | node | 1 | Node | 1/1 | Yes | Yes | Yes |
| 3 | governance | 1 | GovernanceAuthority | 1/1 | Yes | Yes | Yes |
| 4 | persona | 2 | Persona, PersonaAssignment | 2/2 | Yes | Yes | Yes |
| 5 | store (cityos) | 1 | CityosStore | 1/1 | Yes | No | Yes |
| 6 | vendor | 8 | Vendor, VendorUser, VendorProduct, VendorOrder, VendorOrderItem, VendorAnalyticsSnapshot, VendorPerformanceMetric, CustomerSegment | 8/8 | Yes | Yes | Yes |
| 7 | commission | 2 | CommissionRule, CommissionTransaction | 2/2 | Yes | Yes | Yes |
| 8 | payout | 2 | Payout, PayoutTransactionLink | 2/2 | Yes | Yes | Yes |
| 9 | subscription | 7 | Subscription, SubscriptionPlan, SubscriptionItem, SubscriptionEvent, SubscriptionDiscount, SubscriptionPause, BillingCycle | 7/7 | Yes | Yes | Yes |
| 10 | company | 3 | Company, CompanyUser, PaymentTerms | 3/3 | Yes | Yes | Yes |
| 11 | quote | 2 | Quote, QuoteItem | 2/2 | Yes | Yes | Yes |
| 12 | volume-pricing | 2 | VolumePricing, VolumePricingTier | 2/2 | Yes | Yes | Yes |
| 13 | booking | 9 | Booking, ServiceProduct, Availability, ApprovalWorkflow, ApprovalRequest, ApprovalAction, AvailabilityException, BookingItem, BookingReminder | 9/9 | Yes | Yes | Yes |
| 14 | review | 1 | Review | 1/1 | Yes | Yes | Yes |
| 15 | invoice | 2 | Invoice, InvoiceItem | 2/2 | Yes | Yes | Yes |
| 16 | event-outbox | 1 | EventOutbox | 1/1 | No | No | No |
| 17 | audit | 1 | AuditLog | 1/1 | Yes | Yes | No |
| 18 | i18n | 1 | Translation | 1/1 | Yes | Yes | Yes |
| 19 | channel | 2 | SalesChannelMapping, ServiceChannel\* | 1/2 | Yes | Yes | Yes |
| 20 | region-zone | 1 | RegionZoneMapping | 1/1 | Yes | Yes | Yes |
| 21 | promotion-ext | 1 | GiftCardExt | 1/1 | Yes | No | Yes |
| 22 | digital-product | 2 | DigitalAsset, DownloadLicense | 2/2 | Yes | No | Yes |
| 23 | auction | 5 | AuctionListing, AuctionEscrow, AuctionResult, Bid, AutoBidRule | 5/5 | Yes | No | Yes |
| 24 | rental | 4 | RentalProduct, RentalAgreement, RentalPeriod, RentalReturn | 4/4 | Yes | No | Yes |
| 25 | restaurant | 8 | Restaurant, Menu, MenuItem, ModifierGroup, Modifier, KitchenOrder, TableReservation, DeliverySlot | 8/8 | Yes | No | Yes |
| 26 | event-ticketing | 5 | Event, Ticket, TicketType, SeatMap, Venue | 5/5 | Yes | No | Yes |
| 27 | classified | 5 | ClassifiedListing, ListingCategory, ListingImage, ListingOffer, ListingFlag | 5/5 | Yes | No | Yes |
| 28 | affiliate | 4 | Affiliate, AffiliateCommission, Referral, ReferralLink | 4/4 | Yes | No | Yes |
| 29 | warranty | 2 | WarrantyPlan, WarrantyClaim | 2/2 | Yes | Yes | Yes |
| 30 | freelance | 5 | GigListing, FreelanceContract, FreelanceDispute, Proposal, TimeLog | 5/5 | Yes | No | Yes |
| 31 | travel | 3 | TravelProperty, TravelReservation, GuestProfile | 3/3 | Yes | No | Yes |
| 32 | real-estate | 5 | PropertyListing, PropertyDocument, PropertyValuation, ViewingAppointment, LeaseAgreement | 5/5 | Yes | No | Yes |
| 33 | membership | 2 | Membership, MembershipTier | 2/2 | Yes | No | Yes |
| 34 | crowdfunding | 5 | CrowdfundCampaign, Backer, Pledge, CampaignUpdate, Milestone | 5/5 | Yes | No | Yes |
| 35 | social-commerce | 6 | LiveStream, LiveProduct, SocialPost, SocialShare, InfluencerCampaign, GroupBuy | 6/6 | Yes | No | Yes |
| 36 | grocery | 3 | FreshProduct, BatchTracking, SubstitutionRule | 3/3 | Yes | No | Yes |
| 37 | automotive | 9 | VehicleListing, TestDrive, TradeIn, PartCatalog, SparePart, RepairOrder, ServiceCenter, VehicleService, DamageClaim | 9/9 | Yes | No | Yes |
| 38 | healthcare | 6 | Practitioner, HealthcareAppointment, MedicalRecord, Prescription, LabOrder, PharmacyProduct | 6/6 | Yes | No | Yes |
| 39 | education | 5 | Course, Enrollment, Lesson, Quiz, Certificate | 5/5 | Yes | No | Yes |
| 40 | charity | 4 | CharityOrg, DonationCampaign, Donation, ImpactReport | 4/4 | Yes | No | Yes |
| 41 | financial-product | 6 | LoanProduct, LoanApplication, InvestmentPlan, InsuranceProduct, InsurancePolicy, InsuranceClaim | 6/6 | Yes | No | Yes |
| 42 | advertising | 6 | AdAccount, AdCampaign, AdCreative, AdPlacement, ClickTracking, ImpressionLog | 6/6 | Yes | No | Yes |
| 43 | parking | 2 | ParkingZone, ParkingSession | 2/2 | Yes | No | Yes |
| 44 | utilities | 4 | UtilityAccount, UtilityBill, MeterReading, UsageRecord | 4/4 | Yes | No | Yes |
| 45 | government | 8 | ServiceRequest, CitizenProfile, MunicipalLicense, Permit, Fine, ShuttleRoute, RideRequest, AgentProfile | 8/8 | Yes | No | Yes |
| 46 | pet-service | 5 | PetProfile, PetProduct, GroomingBooking, VetAppointment, WellnessPlan | 5/5 | Yes | No | Yes |
| 47 | fitness | 5 | GymMembership, ClassSchedule, ClassBooking, TrainerProfile, CheckIn | 5/5 | Yes | No | Yes |
| 48 | legal | 4 | AttorneyProfile, LegalCase, LegalConsultation, RetainerAgreement | 4/4 | Yes | No | Yes |
| 49 | analytics | 2\* | Dashboard\*, Report\* | 0/2 | No | No | No |
| 50 | cart-extension | 1\* | CartMetadata\* | 0/1 | No | No | No |
| 51 | cms-content | 2\* | CmsPage\*, CmsNavigation\* | 0/2 | No | No | No |
| 52 | dispute | 1 | Dispute | 1/1 | No | No | No |
| 53 | inventory-extension | 3\* | ReservationHold\*, StockAlert\*, WarehouseTransfer\* | 0/3 | No | No | No |
| 54 | loyalty | 3 | LoyaltyProgram, LoyaltyAccount\*, PointTransaction\* | 1/3 | Yes | No | Yes |
| 55 | notification-preferences | 1\* | NotificationPreference\* | 0/1 | No | No | No |
| 56 | shipping-extension | 2\* | CarrierConfig\*, ShippingRate\* | 0/2 | No | No | No |
| 57 | tax-config | 1 | TaxExemption, TaxRule\* | 1/2 | Yes | No | Yes |
| 58 | wishlist | 2 | Wishlist, WishlistItem | 2/2 | Yes | No | Yes |

> **Note:** `*` indicates a model defined in code but with no corresponding database table.

---

### 9.5 CRUD Config Entities vs Backend Models

The admin panel uses 42 CRUD configuration entries to auto-generate management interfaces. Below maps each CRUD config to its actual backend model.

| # | CRUD Config | Backend Model(s) | Status |
|---|-------------|-------------------|--------|
| 1 | travel | TravelProperty | Matches |
| 2 | automotive | VehicleListing | Matches |
| 3 | healthcare | Practitioner | Matches |
| 4 | education | Course | Matches |
| 5 | fitness | GymMembership | Matches |
| 6 | memberships | Membership, MembershipTier | Matches |
| 7 | parking | ParkingZone | Matches |
| 8 | freelance | GigListing | Matches |
| 9 | advertising | AdCampaign | Matches |
| 10 | affiliates | Affiliate | Matches |
| 11 | promotions | Core Medusa Promotion | Uses core model |
| 12 | crowdfunding | CrowdfundCampaign | Matches |
| 13 | charity | CharityOrg, DonationCampaign | Matches |
| 14 | classifieds | ClassifiedListing | Matches |
| 15 | quotes | Quote | Matches |
| 16 | invoices | Invoice | Matches |
| 17 | subscriptions | Subscription | Matches |
| 18 | reviews | Review | Matches |
| 19 | team | Core Medusa User | Uses core model |
| 20 | companies | Company | Matches |
| 21 | stores | Core Medusa Store | Uses core model |
| 22 | legal | AttorneyProfile, LegalCase | Matches |
| 23 | utilities | UtilityAccount | Matches |
| 24 | settings | Core Medusa Store config | Uses core model |
| 25 | digital-products | DigitalAsset | Matches |
| 26 | event-ticketing | Event | Matches |
| 27 | financial-products | LoanProduct | Matches |
| 28 | pet-services | PetProfile | Matches |
| 29 | real-estate | PropertyListing | Matches |
| 30 | social-commerce | LiveStream, SocialPost | Matches |
| 31 | government | ServiceRequest | Matches |
| 32 | grocery | FreshProduct | Matches |
| 33 | restaurants | Restaurant | Matches |
| 34 | rentals | RentalProduct | Matches |
| 35 | auctions | AuctionListing | Matches |
| 36 | bookings | Booking | Matches |
| 37 | products | Core Medusa Product | Uses core model |
| 38 | orders | Core Medusa Order | Uses core model |
| 39 | customers | Core Medusa Customer | Uses core model |
| 40 | vendors | Vendor | Matches |
| 41 | commissions | CommissionRule | Matches |
| 42 | payouts | Payout | Matches |

**Result:** All 42 CRUD configs map correctly to their backend models. 6 configs use core Medusa models directly; the remaining 36 use custom module models with full schema alignment.

---

### 9.6 Cross-Module Links (Complete Registry)

All 15 cross-module links defined in `apps/backend/src/links/` using Medusa's `defineLink()` utility.

| # | Link File | Source Module | Source Model | Target Module | Target Model | Relationship |
|---|-----------|---------------|-------------|---------------|-------------|-------------|
| 1 | `booking-customer.ts` | Customer (core) | `customer` | Booking | `booking` | One-to-Many |
| 2 | `company-invoice.ts` | Company | `company` | Invoice | `invoice` | One-to-Many |
| 3 | `customer-company.ts` | Customer (core) | `customer` | Company | `company` | Many-to-One |
| 4 | `customer-membership.ts` | Customer (core) | `customer` | Membership | `membership` | One-to-Many |
| 5 | `customer-subscription.ts` | Customer (core) | `customer` | Subscription | `subscription` | One-to-Many |
| 6 | `node-governance.ts` | Node | `node` | Governance | `governanceAuthority` | Many-to-One |
| 7 | `order-vendor.ts` | Order (core) | `order` | Vendor | `vendor` | Many-to-One |
| 8 | `product-auction.ts` | Product (core) | `product` | Auction | `auctionListing` | One-to-One |
| 9 | `product-rental.ts` | Product (core) | `product` | Rental | `rentalProduct` | One-to-One |
| 10 | `product-review.ts` | Product (core) | `product` | Review | `review` | One-to-Many |
| 11 | `tenant-node.ts` | Tenant | `tenant` | Node | `node` | One-to-Many |
| 12 | `tenant-store.ts` | Tenant | `tenant` | Store | `cityosStore` | One-to-Many |
| 13 | `vendor-commission.ts` | Vendor | `vendor` | Commission | `commissionRule` | One-to-Many |
| 14 | `vendor-payout.ts` | Vendor | `vendor` | Payout | `payout` | One-to-Many |
| 15 | `vendor-store.ts` | Vendor | `vendor` | Store | `cityosStore` | Many-to-One |

---

### 9.7 Summary Statistics

| Metric | Count |
|--------|-------|
| Total Custom Models (defined in code) | 205 |
| Models with DB Tables | 188 |
| Models Missing DB Tables | 17 |
| Extra DB Tables (not in module docs) | 13 |
| Total DB Tables (custom) | 201 |
| Missing Store API Routes | 9 |
| CRUD Configs | 42 |
| CMS Verticals | 27 |
| Cross-Module Links | 15 |
| Tier 1 Modules (fully implemented) | 18 |
| Tier 2 Modules (backend complete, no admin UI) | 33 |
| Tier 3 Modules (incomplete) | 7 |
| External Integrations | 5 |
| Temporal System Workflows | 30+ |

---

*Document generated: 2026-02-13 | Dakkah CityOS Commerce Platform v1.0*
