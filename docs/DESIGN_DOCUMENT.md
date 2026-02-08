# Dakkah CityOS Commerce Platform — Detailed Design Document

> Medusa.js v2 E-Commerce Monorepo aligned with Dakkah CityOS CMS Architecture
>
> Date: 2026-02-08
> Version: 1.0

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Architecture](#2-system-architecture)
3. [Monorepo Structure](#3-monorepo-structure)
4. [Backend Modules & Data Models](#4-backend-modules--data-models)
5. [API Layer](#5-api-layer)
6. [Middleware & Security](#6-middleware--security)
7. [Workflows](#7-workflows)
8. [Scheduled Jobs](#8-scheduled-jobs)
9. [Event Subscribers](#9-event-subscribers)
10. [Admin Dashboard Extensions](#10-admin-dashboard-extensions)
11. [Storefront Application](#11-storefront-application)
12. [Design System Packages](#12-design-system-packages)
13. [External Integrations](#13-external-integrations)
14. [Infrastructure & Utilities](#14-infrastructure--utilities)
15. [Configuration & Feature Flags](#15-configuration--feature-flags)
16. [Seed Scripts & Data Setup](#16-seed-scripts--data-setup)
17. [Testing](#17-testing)
18. [Environment Variables](#18-environment-variables)
19. [Key Design Decisions](#19-key-design-decisions)

---

## 1. Executive Summary

The Dakkah CityOS Commerce Platform is a comprehensive, multi-tenant e-commerce system built on Medusa.js v2. It extends the core Medusa framework with 20 custom modules, 57 data models, 95+ API endpoints, and a full-featured React storefront — all aligned with the CityOS CMS architecture.

The platform supports:

- **Multi-tenant isolation** with tenant-scoped data across all entities
- **Multi-vendor marketplace** with commission management, payouts, and Stripe Connect
- **B2B commerce** with company accounts, purchase orders, quotes, approval workflows, and credit limits
- **Subscription billing** with recurring payments, trials, plan changes, and dunning
- **Service bookings** with provider availability, calendar management, and reminders
- **5-level node hierarchy** (City > District > Zone > Facility > Asset)
- **10-role RBAC** with node-scoped access control
- **6-axis persona system** with 5-level precedence resolution
- **4-level governance chain** with deep-merge policy inheritance
- **6 residency zones** for data sovereignty compliance
- **3 locales** (English, French, Arabic with RTL support)
- **CMS-compatible event outbox** for cross-system integration

**Total: 20 custom modules with 57 data models.**

---

## 2. System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Monorepo (Turbo + pnpm)                  │
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │  apps/backend    │  │ apps/storefront   │  │apps/orchestr.│  │
│  │  Medusa.js v2    │  │ TanStack Start    │  │ Payload CMS  │  │
│  │  Port 9000       │  │ + React + Vite    │  │ Next.js      │  │
│  │                  │  │ Port 5000         │  │ Port 3001    │  │
│  │  20 custom       │  │                   │  │              │  │
│  │  modules         │  │ 24 component      │  │ Content      │  │
│  │  95+ API routes  │  │ groups            │  │ management   │  │
│  │  10 workflows    │  │ 30+ pages         │  │ Sync engine  │  │
│  │  13 scheduled    │  │ 17 hooks          │  │              │  │
│  │  jobs            │  │ 6 context         │  │              │  │
│  │  31 subscribers  │  │ providers         │  │              │  │
│  └──────────────────┘  └──────────────────┘  └──────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    packages/ (shared)                     │   │
│  │  cityos-contracts │ design-tokens │ design-runtime │      │   │
│  │  design-system    │ lodash-set-safe                       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                     PostgreSQL (Neon)                      │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology |
|-------|-----------|
| Backend Framework | Medusa.js v2 (2.11.4-snapshot) |
| Frontend Framework | TanStack Start + React 19 |
| Build Tool | Vite 7.3.1 |
| CMS | Payload CMS 3.75 + Next.js 15.5 |
| Database | PostgreSQL (Neon-backed, via Replit) |
| ORM | Mikro-ORM (via Medusa) |
| Monorepo | Turborepo + pnpm 10.12 |
| Styling | Tailwind CSS 4.1 |
| State Management | TanStack Query 5 |
| Routing | TanStack Router (file-based, SSR) |
| Validation | Zod 4.3 |
| Payment | Stripe (payments + Connect) |
| Email | SendGrid (conditional) |
| Search | Meilisearch 0.55 |
| Caching | Redis (ioredis 5.9) / In-memory fallback |
| E2E Testing | Playwright |
| Unit Testing | Vitest + Jest |

---

## 3. Monorepo Structure

```
/
├── apps/
│   ├── backend/                    # Medusa.js v2 backend (port 9000)
│   │   ├── src/
│   │   │   ├── admin/              # Admin dashboard extensions
│   │   │   │   ├── components/     # 13 reusable UI components
│   │   │   │   ├── hooks/          # 12 data-fetching hooks
│   │   │   │   ├── lib/            # Client, formatters, query keys
│   │   │   │   ├── routes/         # 11 custom admin pages
│   │   │   │   └── widgets/        # 7 dashboard widgets
│   │   │   ├── api/                # API route handlers
│   │   │   │   ├── admin/          # ~50 admin endpoints
│   │   │   │   ├── store/          # ~35 storefront endpoints
│   │   │   │   ├── vendor/         # ~12 vendor portal endpoints
│   │   │   │   └── middlewares/    # 6 middleware functions
│   │   │   ├── integrations/       # External service connectors
│   │   │   │   ├── erpnext/        # ERPNext ERP integration
│   │   │   │   ├── fleetbase/      # Fleetbase logistics integration
│   │   │   │   └── payload-sync/   # Payload CMS bidirectional sync
│   │   │   ├── jobs/               # 13 scheduled background jobs
│   │   │   ├── lib/                # Shared utilities
│   │   │   │   ├── cache/          # Redis caching layer
│   │   │   │   ├── monitoring/     # Logger + Prometheus metrics
│   │   │   │   ├── config.ts       # Centralized configuration
│   │   │   │   ├── tenant-scoping.ts
│   │   │   │   └── validation.ts   # Zod helpers + pagination
│   │   │   ├── modules/            # 20 custom Medusa modules
│   │   │   ├── scripts/            # 15 seed & setup scripts
│   │   │   ├── subscribers/        # 31 event subscribers
│   │   │   └── workflows/          # 10 Medusa workflows
│   │   └── medusa-config.ts        # Module registration & config
│   │
│   ├── storefront/                 # React storefront (port 5000)
│   │   ├── src/
│   │   │   ├── components/         # 24 component groups
│   │   │   ├── lib/                # Hooks, utils, contexts, types
│   │   │   └── routes/             # File-based routing (TanStack)
│   │   └── e2e/                    # 4 Playwright E2E tests
│   │
│   └── orchestrator/               # Payload CMS (port 3001)
│       └── src/                    # CMS collections, hooks, sync
│
├── packages/
│   ├── cityos-contracts/           # Shared TypeScript contracts
│   ├── cityos-design-tokens/       # Design token definitions
│   ├── cityos-design-runtime/      # Theme runtime + React providers
│   ├── cityos-design-system/       # Component type interfaces
│   └── lodash-set-safe/            # Security replacement for lodash.set
│
├── docs/
│   ├── ALIGNMENT_ROADMAP.md        # 8-phase alignment roadmap
│   └── DESIGN_DOCUMENT.md          # This document
│
├── turbo.json                      # Turborepo pipeline config
├── pnpm-workspace.yaml             # Workspace: apps/* + packages/*
└── start.sh                        # Startup: backend then storefront
```

---

## 4. Backend Modules & Data Models

### 4.1 Tenant Module

Manages multi-tenant isolation with CMS-aligned schema.

| Model | Fields | Purpose |
|-------|--------|---------|
| `Tenant` | id, name, slug (unique), handle (unique), domain, custom_domains (JSON), residency_zone (GCC/EU/MENA/APAC/AMERICAS/GLOBAL), country_id, governance_authority_id, default_locale, supported_locales (JSON), timezone, default_currency, date_format, default_persona_id, logo_url, favicon_url, primary_color, accent_color, font_family, branding (JSON), status (active/suspended/trial/archived/inactive), subscription_tier (basic/pro/enterprise/custom), billing_email, billing_address (JSON), trial_starts_at, trial_ends_at, settings (JSON), metadata (JSON) | Core tenant entity with residency zones, branding, and billing |
| `TenantUser` | id, tenant_id, user_id, role (10 CityOS roles), role_level, assigned_nodes (JSON), assigned_node_ids (JSON), permissions (JSON), status (active/inactive/invited), invitation_token, invitation_sent_at, invitation_accepted_at, invited_by_id, last_active_at, metadata (JSON) | User access with node-hierarchy RBAC and invitation flow |
| `TenantBilling` | id, tenant_id, plan, billing_cycle, amount, currency, status, next_billing_date | Tenant billing and plan management |
| `TenantUsageRecord` | id, tenant_id, metric, value, period_start, period_end | Usage tracking per tenant |
| `TenantInvoice` | id, tenant_id, amount, currency, status, issue_date, due_date, paid_date | Tenant-level invoicing |
| `TenantSettings` | id, tenant_id, key, value, category | Key-value tenant configuration |

**RBAC Roles (10 levels):**

| Role | Default Level | Scope |
|------|---------------|-------|
| super-admin | 100 | Platform-wide |
| tenant-admin | 90 | Full tenant |
| compliance-officer | 80 | Compliance & regulatory |
| auditor | 70 | Audit & reporting |
| city-manager | 60 | City-level node operations |
| district-manager | 50 | District-level node operations |
| zone-operator | 40 | Zone-level node operations |
| facility-operator | 30 | Facility-level node operations |
| asset-technician | 20 | Asset-level node operations |
| viewer | 10 | Read-only access |

### 4.2 Node Module

Implements the CityOS 5-level hierarchy with parent-child validation.

| Model | Fields | Purpose |
|-------|--------|---------|
| `Node` | id, tenant_id, name, slug, type (CITY/DISTRICT/ZONE/FACILITY/ASSET), parent_id, level, path, config, geo_location, is_active, metadata | Hierarchical node with geo-location and configuration |

**Hierarchy Validation Rules:**
- CITY (level 0): No parent required
- DISTRICT (level 1): Parent must be CITY
- ZONE (level 2): Parent must be DISTRICT
- FACILITY (level 3): Parent must be ZONE
- ASSET (level 4): Parent must be FACILITY

### 4.3 Governance Module

Authority chain with deep-merge policy inheritance from region to country to tenant.

| Model | Fields | Purpose |
|-------|--------|---------|
| `GovernanceAuthority` | id, tenant_id, name, authority_type, parent_authority_id, policies (JSON), jurisdiction, effective_from, effective_to, is_active, metadata | Governance authority with policy chain |

**Policy Merge Strategy:** Deep merge from parent to child, child values override parent values at the leaf level.

### 4.4 Persona Module

6-axis persona system with 5-level precedence resolution.

| Model | Fields | Purpose |
|-------|--------|---------|
| `Persona` | id, tenant_id, name, description, axes (JSON: demographic, psychographic, behavioral, contextual, transactional, relational), rules, is_active, metadata | Persona definition with 6 behavioral axes |
| `PersonaAssignment` | id, persona_id, entity_type, entity_id, source (session/surface/membership/user-default/tenant-default), precedence, is_active, metadata | Persona binding with precedence levels |

**Precedence Levels:**
- Session (500) — highest, current session context
- Surface (400) — device/channel-specific
- Membership (300) — loyalty/membership tier
- User Default (200) — user profile setting
- Tenant Default (100) — lowest, fallback

### 4.5 Vendor Module

Full multi-vendor marketplace capabilities.

| Model | Fields | Purpose |
|-------|--------|---------|
| `Vendor` | id, handle (unique), tenant_id, store_id, business_name, legal_name, business_type (sole_proprietor/partnership/llc/corporation/nonprofit/cooperative), tax_id, email, phone, website, address fields (line1/line2/city/state/postal_code/country), description, logo_url, banner_url, status (pending/active/suspended/deactivated/banned), commission_type (percentage/flat/tiered), default_commission_rate, payout_method (bank_transfer/stripe_connect/paypal/manual), payout_schedule (weekly/biweekly/monthly/on_demand), stripe_connect_id, payout_details (JSON), rating, total_sales, total_orders, total_products, total_commission_paid, onboarded_at, metadata (JSON) | Vendor business profile |
| `VendorUser` | id, vendor_id, user_id, role (owner/admin/manager/staff/viewer), permissions (JSON), status (active/inactive/invited), invitation_token, invitation_sent_at, invitation_accepted_at, metadata (JSON) | Vendor team members with roles |
| `VendorProduct` | id, vendor_id, product_id, tenant_id, is_primary_vendor, attribution_percentage, status (pending_approval/approved/rejected/suspended/discontinued), approved_by_id, approved_at, rejection_reason, manage_inventory, vendor_sku, vendor_cost, fulfillment_method, lead_time_days, commission_override, commission_rate, metadata (JSON) | Product-to-vendor assignment with approval workflow |
| `VendorOrder` | id, vendor_id, order_id, tenant_id, vendor_order_number (unique), status (pending/acknowledged/processing/ready_to_ship/shipped/delivered/completed/cancelled/returned/disputed), currency_code, subtotal, shipping_total, tax_total, discount_total, total, commission_amount, net_amount, payout_status, fulfillment_status, shipping_method, tracking_number, tracking_url, shipped_at, delivered_at, shipping_address (JSON), metadata (JSON) | Vendor's view of an order |
| `VendorOrderItem` | id, vendor_order_id, line_item_id, product_id, quantity, unit_price, subtotal, total, vendor_cost, commission_amount, net_amount, status | Individual items in vendor order |
| `VendorAnalyticsSnapshot` | id, vendor_id, period, total_orders, total_revenue, total_commission, average_order_value, return_rate, rating | Aggregated vendor analytics |
| `VendorPerformanceMetric` | id, vendor_id, metric_type, value, period_start, period_end | Granular performance tracking |

### 4.6 Commission Module

Flexible commission structures for the marketplace.

| Model | Fields | Purpose |
|-------|--------|---------|
| `CommissionRule` | id, tenant_id, store_id, vendor_id, priority, name, description, commission_type (percentage/flat/tiered_percentage/tiered_flat/hybrid), commission_percentage, commission_flat, tiers (JSON), category_ids, product_ids, min_order_value, max_order_value, effective_from, effective_to, is_active, metadata | Commission rule definition |
| `CommissionTransaction` | id, tenant_id, store_id, vendor_id, order_id, line_item_id, commission_rule_id, payout_id, transaction_type (sale/refund/adjustment/reversal), order_subtotal, order_tax, order_shipping, commission_rate, commission_amount, platform_fee, net_vendor_amount, currency_code, status, metadata | Individual commission calculation record |

### 4.7 Payout Module

Vendor payout processing and tracking.

| Model | Fields | Purpose |
|-------|--------|---------|
| `Payout` | id, tenant_id, store_id, vendor_id, amount, currency_code, status (pending/processing/completed/failed/on_hold), payment_method, payment_reference, period_start, period_end, transactions_count, gross_amount, commission_amount, platform_fee, notes, processed_at, failed_reason, metadata | Payout batch record |
| `PayoutTransactionLink` | id, payout_id, commission_transaction_id | Links payout to commission transactions |

### 4.8 Company Module (B2B)

Complete B2B commerce with enterprise features.

| Model | Fields | Purpose |
|-------|--------|---------|
| `Company` | id, handle (unique), name, legal_name, tax_id, email, phone, industry, employee_count, annual_revenue, credit_limit, credit_used, payment_terms_days, status (pending/active/suspended/inactive), tier (bronze/silver/gold/platinum/enterprise), approved_at, approved_by, rejection_reason, requires_approval, auto_approve_limit, tenant_id, store_id, billing_address (JSON), shipping_addresses (JSON), metadata (JSON) | B2B company account |
| `CompanyUser` | id, company_id, customer_id, role (admin/approver/buyer/viewer), spending_limit, spending_limit_period (daily/weekly/monthly/yearly), current_period_spend, period_start, approval_limit, status (active/inactive/invited), invited_at, joined_at, metadata (JSON) | Company member with spending controls and approval authority |
| `PurchaseOrder` | id, po_number (unique), company_id, customer_id, tenant_id, order_id, cart_id, quote_id, external_po_number, department, cost_center, project_code, status (draft/pending_approval/approved/rejected/submitted/acknowledged/processing/partially_fulfilled/fulfilled/closed/cancelled), requires_approval, approval_threshold, approved_by_id, approved_at, approval_notes, rejected_by_id, rejected_at, rejection_reason, currency_code, subtotal, discount_total, tax_total, shipping_total, total, payment_terms_id, payment_due_date, payment_status, issue_date, expected_delivery_date, actual_delivery_date, shipping_address (JSON), billing_address (JSON), shipping_method_id, internal_notes, vendor_notes, metadata (JSON) | Purchase order with full lifecycle and approval flow |
| `PurchaseOrderItem` | id, purchase_order_id, product_id, variant_id, sku, title, quantity, unit_price, total_price, tax_rate, metadata | PO line items |
| `PaymentTerms` | id, company_id, name, code (e.g. "2/10 Net 30"), net_days, discount_percent, discount_days, is_default, is_active | B2B payment terms with early payment discounts |
| `TaxExemption` | id, company_id, exemption_type, certificate_number, issuing_authority, valid_from, valid_to, regions, is_verified, document_url, metadata | Tax exemption certificates |
| `ApprovalWorkflow` | id, company_id, tenant_id, name, description, workflow_type (purchase_order/quote_request/quote_acceptance/user_registration/credit_increase/payment_terms_change/return_request/custom), is_active, priority, conditions (JSON), steps (JSON), notify_on_submit, notify_on_approval, notify_on_rejection, notification_emails, metadata (JSON) | Configurable multi-type approval chains |
| `ApprovalRequest` | id, workflow_id, purchase_order_id, requestor_id, status (pending/approved/rejected/escalated), current_level, metadata | Approval request instance |
| `ApprovalAction` | id, request_id, approver_id, action (approve/reject/escalate), level, comments, acted_at | Individual approval decisions |

### 4.9 Quote Module

Request-for-quote management with negotiation workflow.

| Model | Fields | Purpose |
|-------|--------|---------|
| `Quote` | id, quote_number, tenant_id, store_id, customer_id, company_id, region_id, status (draft/submitted/under_review/approved/declined/accepted/expired/cancelled), subtotal, discount_total, tax_total, grand_total, currency_code, customer_notes, admin_notes, approved_by, approved_at, accepted_at, expires_at, metadata | Quote with full negotiation lifecycle |
| `QuoteItem` | id, quote_id, product_id, variant_id, sku, title, quantity, unit_price, discount_percent, discount_amount, total_price, notes, metadata | Quoted line items with custom pricing |

### 4.10 Subscription Module

Recurring billing with comprehensive lifecycle management.

| Model | Fields | Purpose |
|-------|--------|---------|
| `Subscription` | id, customer_id, status (draft/active/paused/past_due/canceled/expired), start_date, end_date, current_period_start, current_period_end, trial_start, trial_end, canceled_at, billing_interval (daily/weekly/monthly/quarterly/yearly), billing_interval_count, billing_anchor_day, payment_collection_method (charge_automatically/send_invoice), payment_provider_id, payment_method_id, currency_code, subtotal, tax_total, total, max_retry_attempts, retry_count, last_retry_at, next_retry_at, tenant_id, store_id, metadata (JSON) | Active subscription record |
| `SubscriptionItem` | id, subscription_id, product_id, variant_id, quantity, unit_price, total_price | Items within a subscription |
| `SubscriptionPlan` | id, tenant_id, name, handle (unique), description, status (draft/active/archived), billing_interval, billing_interval_count, currency_code, price, compare_at_price, trial_period_days, features (JSON), limits (JSON), included_products (JSON), sort_order, stripe_price_id, stripe_product_id, metadata (JSON) | Plan definition with Stripe integration |
| `BillingCycle` | id, subscription_id, period_start, period_end, billing_date, status (upcoming/processing/completed/failed/skipped), order_id, payment_collection_id, subtotal, tax_total, total, attempt_count, last_attempt_at, next_attempt_at, completed_at, failed_at, failure_reason, failure_code, tenant_id, metadata (JSON) | Individual billing cycle record |
| `SubscriptionDiscount` | id, subscription_id, discount_type, value, valid_from, valid_to, metadata | Subscription-specific discounts |
| `SubscriptionEvent` | id, subscription_id, tenant_id, event_type (created/activated/trial_started/trial_ended/paused/resumed/canceled/expired/renewed/upgraded/downgraded/payment_succeeded/payment_failed/payment_refunded/items_added/items_removed/items_updated), event_data (JSON), metadata (JSON) | Lifecycle event log |
| `SubscriptionPause` | id, subscription_id, paused_at, resume_at, resumed_at, reason, pause_type (customer_request/payment_issue/etc.), extends_billing_period, days_paused, metadata (JSON) | Pause/resume tracking |

### 4.11 Booking Module

Service booking system with provider management.

| Model | Fields | Purpose |
|-------|--------|---------|
| `ServiceProduct` | id, tenant_id, product_id, duration_minutes, buffer_minutes, max_participants, requires_provider, location_type, cancellation_policy, metadata | Bookable service definition |
| `ServiceProvider` | id, tenant_id, name, email, phone, specializations, bio, avatar_url, is_active, rating, total_bookings, metadata | Service provider profile |
| `Availability` | id, tenant_id, owner_type (provider/service/resource), owner_id, schedule_type (weekly_recurring/custom), weekly_schedule (JSON), timezone, effective_from, effective_to, slot_duration_minutes, is_active, metadata (JSON) | Flexible availability with weekly schedule |
| `AvailabilityException` | id, availability_id, tenant_id, exception_type, date, start_time, end_time, is_available, reason, metadata (JSON) | Date-specific overrides (holidays, special hours) |
| `Booking` | id, tenant_id, customer_id, service_product_id, provider_id, status (pending/confirmed/checked_in/completed/cancelled/no_show), scheduled_at, start_time, end_time, duration_minutes, participants, location, notes, cancellation_reason, cancelled_at, checked_in_at, completed_at, total_price, currency_code, payment_status, metadata | Customer booking record |
| `BookingItem` | id, booking_id, service_product_id, quantity, unit_price, total_price | Booking line items |
| `BookingReminder` | id, booking_id, tenant_id, reminder_type (email/sms/push), send_before_minutes, scheduled_for, status (scheduled/sent/failed/cancelled), sent_at, delivered_at, opened_at, metadata (JSON) | Automated reminders with delivery tracking |

### 4.12 Invoice Module

Invoice generation with payment tracking.

| Model | Fields | Purpose |
|-------|--------|---------|
| `Invoice` | id, tenant_id, invoice_number, order_id, customer_id, company_id, status (draft/sent/viewed/partially_paid/paid/overdue/void/cancelled), issue_date, due_date, paid_date, subtotal, tax_total, discount_total, grand_total, amount_paid, amount_due, currency_code, payment_terms, notes, metadata | Invoice with payment lifecycle |
| `InvoiceItem` | id, invoice_id, product_id, description, quantity, unit_price, tax_rate, tax_amount, discount_amount, total_price | Invoice line items |

### 4.13 Review Module

Product and vendor review system.

| Model | Fields | Purpose |
|-------|--------|---------|
| `Review` | id, tenant_id, customer_id, product_id, vendor_id, order_id, rating (1-5), title, content, status (pending/approved/rejected/flagged), is_verified_purchase, helpful_count, reported_count, admin_response, metadata | Customer review with moderation |

### 4.14 Volume Pricing Module

Quantity-based tiered pricing for B2B and bulk orders.

| Model | Fields | Purpose |
|-------|--------|---------|
| `VolumePricing` | id, tenant_id, product_id, variant_id, name, is_active, customer_group_ids, company_ids, valid_from, valid_to, metadata | Volume pricing rule |
| `VolumePricingTier` | id, volume_pricing_id, min_quantity, max_quantity, price_type (fixed/percentage_discount), price, discount_percentage | Individual quantity tier |

### 4.15 Store Module

CityOS-aligned store management.

| Model | Fields | Purpose |
|-------|--------|---------|
| `Store` | id, tenant_id, name, handle, domain, subdomain, description, logo_url, favicon_url, theme_config, default_currency, supported_currencies, default_locale, supported_locales, is_active, metadata | Store entity with branding and multi-currency |

### 4.16 Channel Module

Maps CityOS channel types to Medusa sales channels.

| Model | Fields | Purpose |
|-------|--------|---------|
| `SalesChannelMapping` | id, tenant_id, channel_type (web/mobile/api/kiosk/internal), medusa_sales_channel_id, name, description, node_id, config (JSON), is_active, metadata | Channel type mapping |

### 4.17 Region-Zone Module

Maps 6 CityOS residency zones to Medusa regions.

| Model | Fields | Purpose |
|-------|--------|---------|
| `RegionZoneMapping` | id, tenant_id, residency_zone (GCC/EU/MENA/APAC/AMERICAS/GLOBAL), medusa_region_id, name, data_storage_policy, cross_border_allowed, compliance_notes, is_active, metadata | Residency zone with data sovereignty rules |

**Zone Policies:**

| Zone | Data Storage | Cross-Border |
|------|-------------|--------------|
| GCC | Local only | Not allowed |
| EU | Local only (GDPR) | Not allowed |
| MENA | Local storage | Restricted |
| APAC | Flexible | Allowed |
| AMERICAS | Flexible | Allowed |
| GLOBAL | Flexible | Allowed |

### 4.18 Events Module

CMS-compatible event outbox pattern.

| Model | Fields | Purpose |
|-------|--------|---------|
| `EventOutbox` | id, tenant_id, event_type, aggregate_type, aggregate_id, payload (JSON), correlation_id, causation_id, actor_id, source_system, status (pending/processing/completed/failed/dead_letter), retry_count, max_retries, last_error, processed_at, metadata | Event envelope with correlation tracking |

### 4.19 I18n Module

Translation management for multi-locale support.

| Model | Fields | Purpose |
|-------|--------|---------|
| `Translation` | id, tenant_id, locale (en/fr/ar), namespace, key, value, is_verified, metadata | Translation entry |

### 4.20 Audit Module

Audit trail with data classification.

| Model | Fields | Purpose |
|-------|--------|---------|
| `AuditLog` | id, tenant_id, action, resource_type, resource_id, actor_id, actor_role, actor_email, node_id, changes (JSON), previous_values (JSON), new_values (JSON), ip_address, user_agent, data_classification (public/internal/confidential/restricted), metadata | Comprehensive audit entry |

---

## 5. API Layer

### 5.1 Admin Endpoints (~50 routes)

#### Tenant & Platform Management
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/platform/tenants` | List all tenants |
| POST | `/admin/platform/tenants` | Create tenant |
| GET | `/admin/platform/tenants/:id` | Get tenant details |
| PUT | `/admin/platform/tenants/:id` | Update tenant |

#### Company Management
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/companies` | List companies |
| POST | `/admin/companies` | Create company |
| GET | `/admin/companies/:id` | Get company details (with users, payment terms, tax exemptions) |
| PUT | `/admin/companies/:id` | Update company |
| DELETE | `/admin/companies/:id` | Delete company |
| POST | `/admin/companies/:id/approve` | Approve company registration |
| POST | `/admin/companies/:id/credit` | Adjust company credit |
| POST | `/admin/companies/:id/payment-terms` | Set payment terms |
| POST | `/admin/companies/:id/roles` | Manage user roles |
| POST | `/admin/companies/:id/spending-limits` | Set spending limits |
| POST | `/admin/companies/:id/tax-exemptions` | Add tax exemption |
| POST | `/admin/companies/:id/workflow` | Configure approval workflow |

#### Vendor Management
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/vendors` | List vendors |
| POST | `/admin/vendors` | Create vendor |
| GET | `/admin/vendors/:id` | Get vendor details |
| PUT | `/admin/vendors/:id` | Update vendor |
| GET | `/admin/vendors/analytics` | Vendor analytics dashboard |

#### Booking Management
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/bookings` | List all bookings |
| GET | `/admin/bookings/:id` | Get booking details |
| PUT | `/admin/bookings/:id` | Update booking status |
| POST | `/admin/bookings/:id/reschedule` | Reschedule booking |
| GET | `/admin/availability` | List provider availability |
| POST | `/admin/availability` | Create availability slot |
| GET | `/admin/availability/:id` | Get availability details |
| PUT | `/admin/availability/:id` | Update availability |
| POST | `/admin/availability/:id/exceptions` | Add exception |
| DELETE | `/admin/availability/exceptions/:exceptionId` | Remove exception |

#### Commission Management
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/commission-rules` | List commission rules |
| POST | `/admin/commission-rules` | Create commission rule |
| GET | `/admin/commission-rules/:id` | Get rule details |
| PUT | `/admin/commission-rules/:id` | Update rule |
| DELETE | `/admin/commission-rules/:id` | Delete rule |
| GET | `/admin/commissions/tiers` | List commission tiers |
| POST | `/admin/commissions/tiers` | Create tier |
| PUT | `/admin/commissions/tiers/:id` | Update tier |
| DELETE | `/admin/commissions/tiers/:id` | Delete tier |
| GET | `/admin/commissions/transactions` | List commission transactions |

#### Invoice Management
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/invoices` | List invoices (filterable by status, company, customer, date) |
| POST | `/admin/invoices` | Create invoice |
| GET | `/admin/invoices/:id` | Get invoice details |
| PUT | `/admin/invoices/:id` | Update invoice |
| POST | `/admin/invoices/:id/pay` | Record payment |
| POST | `/admin/invoices/:id/send` | Send invoice to customer |
| POST | `/admin/invoices/:id/void` | Void invoice |
| POST | `/admin/invoices/:id/early-payment` | Apply early payment discount |
| POST | `/admin/invoices/:id/partial-payment` | Record partial payment |
| GET | `/admin/invoices/overdue` | List overdue invoices |

#### Payout Management
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/payouts` | List all payouts |
| POST | `/admin/payouts/:id/process` | Process payout |
| POST | `/admin/payouts/:id/hold` | Put payout on hold |
| POST | `/admin/payouts/:id/release` | Release held payout |
| POST | `/admin/payouts/:id/retry` | Retry failed payout |

#### Purchase Order Management
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/purchase-orders` | List purchase orders |
| GET | `/admin/purchase-orders/:id` | Get PO details |
| PUT | `/admin/purchase-orders/:id` | Update PO |
| POST | `/admin/purchase-orders/:id/approve` | Approve PO |
| POST | `/admin/purchase-orders/:id/reject` | Reject PO |

#### Quote Management
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/quotes` | List quotes |
| GET | `/admin/quotes/:id` | Get quote details |
| PUT | `/admin/quotes/:id` | Update quote |
| POST | `/admin/quotes/:id/approve` | Approve quote with optional discount |
| GET | `/admin/quotes/expiring` | List expiring quotes |

#### Subscription & Pricing Management
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/subscriptions` | List subscriptions |
| GET | `/admin/pricing-tiers` | List pricing tiers |
| POST | `/admin/pricing-tiers` | Create pricing tier |
| PUT | `/admin/pricing-tiers/:id` | Update pricing tier |
| DELETE | `/admin/pricing-tiers/:id` | Delete pricing tier |
| POST | `/admin/pricing-tiers/:id/companies` | Assign companies to tier |
| POST | `/admin/products/:id/commission` | Set product commission |

#### Payment Terms & Settings
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/payment-terms` | List payment terms |
| POST | `/admin/payment-terms` | Create payment term |
| PUT | `/admin/payment-terms/:id` | Update payment term |
| DELETE | `/admin/payment-terms/:id` | Delete payment term |

#### System
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/health` | System health check |
| GET | `/admin/metrics` | Platform metrics |

### 5.2 Store (Customer) Endpoints (~35 routes)

#### CityOS APIs
| Method | Path | Description |
|--------|------|-------------|
| GET | `/store/cityos/tenant?slug=X` | Resolve tenant by slug |
| GET | `/store/cityos/nodes?tenant_id=X` | List node hierarchy |
| GET | `/store/cityos/persona?tenant_id=X` | Resolve persona |
| GET | `/store/cityos/governance?tenant_id=X` | Get effective governance policies |

#### Bookings
| Method | Path | Description |
|--------|------|-------------|
| GET | `/store/bookings` | List customer's bookings |
| POST | `/store/bookings` | Create new booking |

#### Companies
| Method | Path | Description |
|--------|------|-------------|
| GET | `/store/companies` | List customer's companies |
| POST | `/store/companies` | Register new company |

#### Quotes
| Method | Path | Description |
|--------|------|-------------|
| GET | `/store/quotes` | List customer's quotes |
| POST | `/store/quotes` | Submit quote request |
| GET | `/store/quotes/:id` | Get quote details |
| POST | `/store/quotes/:id/accept` | Accept approved quote |
| POST | `/store/quotes/:id/decline` | Decline quote |

#### Reviews
| Method | Path | Description |
|--------|------|-------------|
| GET | `/store/reviews` | List customer's reviews |
| POST | `/store/reviews` | Submit review |
| GET | `/store/reviews/products/:id` | Get product reviews |
| GET | `/store/reviews/vendors/:id` | Get vendor reviews |
| POST | `/store/reviews/:id/helpful` | Mark review as helpful |

#### Subscriptions
| Method | Path | Description |
|--------|------|-------------|
| GET | `/store/subscriptions/me` | List customer's subscriptions |
| POST | `/store/subscriptions/checkout` | Start subscription checkout |
| GET | `/store/subscriptions/:id/billing-history` | View billing history |
| POST | `/store/subscriptions/:id/cancel` | Cancel subscription |
| POST | `/store/subscriptions/:id/pause` | Pause subscription |
| POST | `/store/subscriptions/:id/resume` | Resume subscription |
| POST | `/store/subscriptions/:id/change-plan` | Change subscription plan |
| PUT | `/store/subscriptions/:id/payment-method` | Update payment method |
| POST | `/store/subscriptions/webhook` | Stripe webhook handler |

#### Purchase Orders
| Method | Path | Description |
|--------|------|-------------|
| GET | `/store/purchase-orders` | List customer's POs |
| POST | `/store/purchase-orders` | Create PO |
| GET | `/store/purchase-orders/:id` | Get PO details |
| POST | `/store/purchase-orders/:id/submit` | Submit PO for approval |

#### Invoices
| Method | Path | Description |
|--------|------|-------------|
| POST | `/store/invoices/:id/early-payment` | Apply early payment discount |

#### Vendors
| Method | Path | Description |
|--------|------|-------------|
| GET | `/store/vendors` | List vendors |
| GET | `/store/vendors/featured` | Get featured vendors |
| GET | `/store/vendors/:handle` | Get vendor profile |
| GET | `/store/vendors/:handle/products` | Get vendor's products |
| GET | `/store/vendors/:handle/reviews` | Get vendor's reviews |
| POST | `/store/vendors/register` | Register as vendor |
| GET | `/store/vendors/:id/stripe-connect` | Get Stripe Connect link |
| GET | `/store/vendors/:id/stripe-connect/status` | Check Connect status |

#### Volume Pricing & Products
| Method | Path | Description |
|--------|------|-------------|
| GET | `/store/products/:id/volume-pricing` | Get product volume pricing |
| GET | `/store/volume-pricing/:productId` | Get volume pricing tiers |

#### Stores
| Method | Path | Description |
|--------|------|-------------|
| GET | `/store/stores` | List stores |
| GET | `/store/stores/default` | Get default store |
| GET | `/store/stores/by-domain/:domain` | Resolve store by domain |
| GET | `/store/stores/by-subdomain/:subdomain` | Resolve store by subdomain |

#### Features
| Method | Path | Description |
|--------|------|-------------|
| GET | `/store/features` | Get enabled feature flags |

### 5.3 Vendor Portal Endpoints (~12 routes)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/vendor/dashboard` | Vendor dashboard summary |
| GET | `/vendor/products` | List vendor's products |
| POST | `/vendor/products` | Add product to vendor catalog |
| GET | `/vendor/products/:id` | Get product details |
| PUT | `/vendor/products/:id` | Update vendor product |
| GET | `/vendor/orders` | List vendor's orders |
| GET | `/vendor/orders/:orderId` | Get order details |
| POST | `/vendor/orders/:id/fulfill` | Fulfill order |
| GET | `/vendor/commissions` | View commission history |
| GET | `/vendor/payouts` | List payouts |
| POST | `/vendor/payouts/request` | Request payout |
| GET | `/vendor/transactions` | View transaction history |
| GET | `/vendor/analytics` | Vendor analytics data |

---

## 6. Middleware & Security

### 6.1 Middleware Stack

| Middleware | Applied To | Method | Purpose |
|------------|-----------|--------|---------|
| `detectTenantMiddleware` | `/store/*`, `/admin/*`, `/vendor/*`, `/store/b2b/*` | ALL | Extracts tenant from `x-tenant-slug` header, domain, or subdomain |
| `requireTenantMiddleware` | `/store/*`, `/store/b2b/*` | ALL | Returns 400 if no tenant detected |
| `injectTenantContextMiddleware` | `/store/*`, `/admin/*`, `/vendor/*`, `/store/b2b/*` | ALL | Injects tenant context (tenant_id, store_id, sales_channel_id) into request |
| `scopeToTenantMiddleware` | `/admin/*` | POST, PUT, PATCH, DELETE | Enforces tenant isolation on write operations |
| `scopeToVendorMiddleware` | `/vendor/*` | ALL | Authenticates and scopes to vendor |
| `scopeToCompanyMiddleware` | `/store/b2b/*` | ALL | Authenticates and scopes to B2B company |
| `nodeContextMiddleware` | `/store/cityos/*` | ALL | Injects CityOS node hierarchy context |

### 6.2 Request Headers

| Header | Purpose |
|--------|---------|
| `x-tenant-slug` | Tenant identification |
| `x-locale` | Locale selection (en/fr/ar) |
| `x-channel` | Channel type (web/mobile/api/kiosk/internal) |
| `x-node-id` | Node hierarchy position |
| `x-persona-id` | Active persona |

---

## 7. Workflows

### 7.1 Vendor Workflows

| Workflow | Steps | Description |
|----------|-------|-------------|
| `create-vendor` | 1. Create vendor entity 2. Create default commission rule | Registers new vendor with configurable default commission rate |
| `approve-vendor` | 1. Update vendor status to active 2. Set verification details | Approves pending vendor application |
| `calculate-commission` | 1. Find applicable commission rule 2. Calculate commission amount 3. Create commission transaction | Calculates commission for an order based on rule priority |
| `process-payout` | 1. Get unpaid transactions 2. Create payout record 3. Mark transactions as paid | Batches unpaid commissions into a payout |

### 7.2 B2B Workflows

| Workflow | Steps | Description |
|----------|-------|-------------|
| `create-company` | 1. Create company entity 2. Add primary contact as admin 3. Log creation | Registers B2B company with initial admin user |
| `create-quote` | 1. Generate quote number 2. Get product info 3. Create quote 4. Create line items 5. Calculate totals | Creates RFQ with auto-generated quote number |
| `approve-quote` | 1. Validate quote status 2. Apply custom discount 3. Update status 4. Send notification | Approves quote with optional discount adjustment |

### 7.3 Subscription Workflows

| Workflow | Steps | Description |
|----------|-------|-------------|
| `create-subscription` | 1. Validate data 2. Calculate amounts 3. Create subscription 4. Activate (if no trial) | Creates subscription with optional trial period |
| `process-billing-cycle` | 1. Load billing cycle 2. Mark as processing 3. Create order 4. Charge via Stripe 5. Complete cycle | Processes recurring billing with Stripe integration |
| `retry-failed-payment` | 1. Check retry eligibility 2. Retry payment 3. Update status 4. Send dunning notification | Dunning flow with configurable retry limits |

---

## 8. Scheduled Jobs

| Job | Schedule | Description |
|-----|----------|-------------|
| `booking-no-show-check` | Periodic | Flags bookings where the customer didn't check in within the grace period (default 30 min) |
| `booking-reminders` | Periodic | Sends upcoming booking reminders via configured channels |
| `cleanup-expired-carts` | Periodic | Removes stale abandoned carts to free resources |
| `commission-settlement` | Periodic | Settles pending commission transactions |
| `failed-payment-retry` | Periodic | Retries failed subscription payments (max 3 retries, configurable) |
| `inactive-vendor-check` | Periodic | Warns vendors at 30 days inactive, deactivates at 60 days (configurable) |
| `invoice-generation` | Periodic | Auto-generates invoices for completed orders |
| `stale-quote-cleanup` | Periodic | Expires quotes past their expiry date (default 30 days) |
| `subscription-billing` | Periodic | Processes due billing cycles for active subscriptions |
| `subscription-expiry-warning` | Periodic | Warns about expiring subscriptions |
| `subscription-renewal-reminder` | Periodic | Sends renewal reminders at 7, 3, and 1 day before renewal |
| `trial-expiration` | Periodic | Handles trial period endings — converts or cancels |
| `vendor-payouts` | Periodic | Processes scheduled vendor payout batches |

---

## 9. Event Subscribers

### 9.1 Booking Events (5)

| Subscriber | Event | Actions |
|------------|-------|---------|
| `booking-created` | `booking.created` | Send confirmation email, notify admin |
| `booking-confirmed` | `booking.confirmed` | Send confirmation to customer, schedule reminders |
| `booking-checked-in` | `booking.checked_in` | Log check-in, update provider stats |
| `booking-completed` | `booking.completed` | Send review prompt, update analytics |
| `booking-cancelled` | `booking.cancelled` | Process refund, free up availability, notify provider |

### 9.2 Order Events (4)

| Subscriber | Event | Actions |
|------------|-------|---------|
| `order-placed` | `order.placed` | Create vendor orders, calculate commissions, send confirmation |
| `order-shipped` | `order.fulfillment_created` | Notify customer with tracking info |
| `order-cancelled` | `order.canceled` | Reverse commissions, process refunds, notify vendor |
| `order-returned` | `order.return.received` | Adjust commissions, update vendor metrics |

### 9.3 Payment Events (4)

| Subscriber | Event | Actions |
|------------|-------|---------|
| `payment-authorized` | `payment.authorized` | Log authorization, update order status |
| `payment-captured` | `payment.captured` | Trigger commission calculation, update vendor balance |
| `payment-failed` | `payment.payment_capture_failed` | Notify customer, log failure, trigger retry flow |
| `payment-refunded` | `payment.refunded` | Create reversal commission transaction, notify vendor |

### 9.4 Subscription Events (7)

| Subscriber | Event | Actions |
|------------|-------|---------|
| `subscription-created` | `subscription.created` | Send welcome email, create initial billing cycle |
| `subscription-cancelled` | `subscription.cancelled` | Send cancellation email, schedule access revocation |
| `subscription-paused` | `subscription.paused` | Notify customer, pause billing |
| `subscription-resumed` | `subscription.resumed` | Notify customer, resume billing |
| `subscription-plan-changed` | `subscription.plan_changed` | Calculate prorations, notify customer |
| `subscription-payment-failed` | `subscription.payment_failed` | Send dunning email, update subscription status |
| `subscription-renewal-upcoming` | `subscription.renewal_upcoming` | Send renewal reminder email |

### 9.5 Vendor Events (2)

| Subscriber | Event | Actions |
|------------|-------|---------|
| `vendor-approved` | `vendor.approved` | Send welcome email, enable dashboard access |
| `vendor-suspended` | `vendor.suspended` | Notify vendor, disable product visibility |

### 9.6 Payout Events (2)

| Subscriber | Event | Actions |
|------------|-------|---------|
| `payout-completed` | `payout.completed` | Send payout receipt to vendor |
| `payout-failed` | `payout.failed` | Notify vendor, log failure, schedule retry |

### 9.7 B2B Events (5)

| Subscriber | Event | Actions |
|------------|-------|---------|
| `company-created` | `company.created` | Notify admin, send welcome package |
| `purchase-order-submitted` | `purchase_order.submitted` | Trigger approval workflow, notify approvers |
| `quote-accepted` | `quote.accepted` | Create order from quote, notify admin |
| `quote-approved` | `quote.approved` | Notify customer of approved quote |
| `quote-declined` | `quote.declined` | Notify customer of declined quote |

### 9.8 Other Events (2)

| Subscriber | Event | Actions |
|------------|-------|---------|
| `customer-created` | `customer.created` | Send welcome email |
| `review-created` | `review.created` | Notify vendor, update product rating |

---

## 10. Admin Dashboard Extensions

### 10.1 Custom Admin Pages (11)

| Route | Page | Description |
|-------|------|-------------|
| `/tenants` | Tenant Management | List, search, and manage all tenants |
| `/tenants/:id/billing` | Tenant Billing | View billing details, usage, invoices |
| `/vendors` | Vendor Management | List vendors, filter by status, bulk actions |
| `/vendors/analytics` | Vendor Analytics | Charts and metrics for vendor performance |
| `/companies/:id` | Company Detail | Full B2B company view with users, credit, terms |
| `/bookings` | Booking Management | Calendar view, status management |
| `/settings/bookings` | Booking Settings | Configure booking rules, cancellation policy |
| `/subscriptions` | Subscription Management | Active subscriptions, billing status |
| `/commissions/tiers` | Commission Tiers | Set up tiered commission structures |
| `/commissions/transactions` | Commission Transactions | View and search commission history |
| `/settings/payment-terms` | Payment Terms | Configure B2B payment terms (Net 30, 2/10 Net 30, etc.) |

### 10.2 Dashboard Widgets (7)

| Widget | Zone | Description |
|--------|------|-------------|
| `CommissionConfigWidget` | `order.details.before` | View and manage commission rules directly from order detail |
| `CustomerBusinessInfoWidget` | `customer.details.after` | Shows customer's company memberships, active subscriptions, and upcoming bookings |
| `OrderBusinessInfoWidget` | `order.details.after` | Displays vendor order splits, B2B info (PO number, payment terms), subscription context, and booking details |
| `PayoutProcessingWidget` | `order.details.side.before` | Process, hold, release, and retry vendor payouts |
| `QuoteManagementWidget` | `order.details.side.before` | View pending quotes with approve/decline actions |
| `VendorManagementWidget` | `order.details.side.before` | Quick vendor overview with approve/suspend actions |
| `ProductBusinessConfigWidget` | `product.details.after` | Assign vendor, toggle subscription/service flags, set service duration |

### 10.3 Reusable Admin Components (13)

| Category | Components |
|----------|-----------|
| Common | StatusBadge, StatsCard, EmptyState, LoadingState, TierBadge, MoneyDisplay, TimelineView |
| Tables | DataTable |
| Forms | FormDrawer |
| Modals | ConfirmModal |
| Charts | StatsGrid |

### 10.4 Admin Hooks (12)

| Hook | Purpose |
|------|---------|
| `useCompanies` | CRUD operations for B2B companies |
| `useVendors` | CRUD operations for vendors |
| `useSubscriptions` | Subscription management queries/mutations |
| `useBookings` | Booking management queries/mutations |
| `useTenants` | Tenant management queries/mutations |
| `useQuotes` | Quote management queries/mutations |
| `useInvoices` | Invoice management queries/mutations |
| `usePaymentTerms` | Payment terms CRUD |
| `useReviews` | Review moderation queries/mutations |
| `useAvailability` | Provider availability management |
| `useVolumePricing` | Volume pricing tier management |

---

## 11. Storefront Application

### 11.1 Routing Architecture

The storefront uses TanStack Router with file-based routing and SSR via TanStack Start.

**URL Pattern:** `/$tenant/$locale/...` (e.g., `/default/en/products/shirt`)

**Legacy Support:** `/$countryCode/...` pattern redirects to the new tenant-based routing.

### 11.2 Pages (~30 routes)

#### Core Commerce
| Route | Page | Description |
|-------|------|-------------|
| `/$tenant/$locale/` | Home | Landing page with hero, featured products, categories |
| `/$tenant/$locale/store` | Store | Full product listing with filters |
| `/$tenant/$locale/products/$handle` | Product Detail | Product page with variants, reviews, volume pricing |
| `/$tenant/$locale/categories/$handle` | Category | Category product listing |
| `/$tenant/$locale/search` | Search | Product search with filters |
| `/cart` | Cart | Shopping cart with quantity management |
| `/checkout` | Checkout | Multi-step checkout flow |

#### Customer Account
| Route | Page | Description |
|-------|------|-------------|
| `/$tenant/$locale/account/` | Dashboard | Overview with stats, recent orders, quick actions |
| `/$tenant/$locale/account/orders` | Orders | Order history with status tracking |
| `/$tenant/$locale/account/orders/$id` | Order Detail | Full order detail with tracking |
| `/$tenant/$locale/account/addresses` | Addresses | Address management |
| `/$tenant/$locale/account/profile` | Profile | Profile editing |
| `/$tenant/$locale/account/settings` | Settings | Account settings |

#### Authentication
| Route | Page | Description |
|-------|------|-------------|
| `/$tenant/$locale/login` | Login | Customer login with email/password |
| `/$tenant/$locale/register` | Register | Customer registration |
| `/$tenant/$locale/reset-password` | Reset Password | Password recovery |

#### Bookings
| Route | Page | Description |
|-------|------|-------------|
| `/$tenant/$locale/bookings/` | My Bookings | List of customer's bookings |
| `/$tenant/$locale/bookings/$handle` | Book Service | Service detail with availability calendar |

#### Subscriptions
| Route | Page | Description |
|-------|------|-------------|
| `/$tenant/$locale/subscriptions/` | Browse Plans | Available subscription plans |
| `/$tenant/$locale/subscriptions/checkout` | Subscribe | Subscription checkout flow |
| `/$tenant/$locale/subscriptions/success` | Success | Subscription confirmation |

#### B2B / Quotes
| Route | Page | Description |
|-------|------|-------------|
| `/$tenant/$locale/quotes/` | My Quotes | List of quotes |
| `/$tenant/$locale/quotes/$id` | Quote Detail | Quote detail with accept/decline |
| `/$tenant/$locale/quotes/request` | Request Quote | Submit RFQ |
| `/$tenant/$locale/invoices/` | Invoices | Invoice listing with payment options |

#### Vendor Marketplace
| Route | Page | Description |
|-------|------|-------------|
| `/$tenant/$locale/vendors/` | Browse Vendors | Vendor directory |
| `/$tenant/$locale/vendors/$handle` | Vendor Profile | Vendor storefront |
| `/$tenant/$locale/vendors/$handle/products` | Vendor Products | Vendor's product catalog |
| `/$tenant/$locale/vendors/$handle/reviews` | Vendor Reviews | Vendor review listing |

#### Vendor Portal
| Route | Page | Description |
|-------|------|-------------|
| `/$tenant/$locale/vendor/` | Vendor Dashboard | Sales overview, metrics |
| `/$tenant/$locale/vendor/register` | Vendor Registration | Become a vendor |
| `/$tenant/$locale/vendor/products/` | Manage Products | Product CRUD |
| `/$tenant/$locale/vendor/products/new` | Add Product | Create new product |
| `/$tenant/$locale/vendor/products/$productId` | Edit Product | Edit product details |
| `/$tenant/$locale/vendor/orders/` | Vendor Orders | Order management |
| `/$tenant/$locale/vendor/payouts/` | Payouts | Payout history and requests |
| `/$tenant/$locale/vendor/commissions` | Commissions | Commission history |

#### Other
| Route | Page | Description |
|-------|------|-------------|
| `/$tenant/$locale/stores` | Store Directory | Multi-store listing |
| `/health` | Health Check | Application health endpoint |

### 11.3 Component Groups (24)

| Group | Components | Purpose |
|-------|-----------|---------|
| **account** | AccountDashboard, AccountHeader, AccountLayout, AccountMobileNav, AccountSidebar, ActiveSubscriptions, AddressCard, AddressForm, DashboardStats, ProfileForm, QuickActions, RecentOrders, SettingsForm, UpcomingBookings | Full customer account experience |
| **auth** | AuthGuard, AuthModal, ForgotPasswordForm, ForgotPasswordModal, LoginForm, LoginModal, RegisterForm, RegisterModal, UserMenu | Authentication flows with modals |
| **b2b** | B2BCheckoutOptions, B2BDashboard, CompanyRegistrationForm | B2B-specific UI |
| **blocks** | ContentBlock, CTABlock, FeaturesBlock, HeroBlock, ProductsBlock | CMS content blocks |
| **bookings** | AddToCalendar, BookingActions, BookingCard, BookingDetail, BookingList, BookingReminder, CalendarPicker, ProviderSelect, RescheduleModal, ServiceCard | Booking flow |
| **business** | ApprovalQueue, BulkOrderForm, CompanyOrders, CompanyOverview | B2B business features |
| **cart** | Cart components | Shopping cart UI |
| **common** | Shared utility components | Breadcrumbs, loading states, etc. |
| **homepage** | Homepage-specific sections | Hero, featured collections |
| **invoices** | Invoice components | Invoice display, payment actions |
| **layout** | Layout components | Header, footer, navigation |
| **orders** | Order components | Order listing, order detail |
| **pages** | Page components | Static/CMS page rendering |
| **products** | Product components | Product card, gallery, variants |
| **purchase-orders** | PO components | PO creation, listing |
| **quotes** | Quote components | Quote request, detail, actions |
| **reviews** | Review components | Review display, submission |
| **search** | Search components | Search bar, results, filters |
| **store** | Store components | Store selection, branding |
| **subscriptions** | Subscription components | Plan cards, management UI |
| **ui** | Design system primitives | Button, Input, Select, Dialog, etc. |
| **vendor** | Vendor portal components | Dashboard, product management |
| **vendors** | Marketplace vendor components | Vendor cards, profiles |

### 11.4 Storefront Hooks (17+)

| Hook | Purpose |
|------|---------|
| `useAuth` | Authentication state and actions |
| `useBookings` | Booking queries and mutations |
| `useCart` | Cart operations (add, remove, update) |
| `useCategories` | Product category data |
| `useCheckout` | Multi-step checkout logic |
| `useCompanies` | B2B company data |
| `useCountryCode` | Country/region detection |
| `useDebounce` | Debounced value hook |
| `useIntersection` | Intersection observer for lazy loading |
| `useOrders` | Order history queries |
| `useProducts` | Product listing and detail queries |
| `usePurchaseOrders` | PO management |
| `useQuotes` | Quote CRUD operations |
| `useRegions` | Region/currency selection |
| `useReviews` | Review queries and submission |
| `useSearch` | Product search with debouncing |
| `useSubscriptions` | Subscription management |
| `useVendors` | Vendor directory queries |
| `useStoreTheme` | Dynamic store theming |

### 11.5 Context Providers (6)

| Provider | Purpose |
|----------|---------|
| `AuthContext` | User authentication state, login/logout/register |
| `BrandingContext` | Store-specific branding (logo, colors, name) |
| `CartContext` | Shopping cart state and operations |
| `FeatureContext` | Feature flag access from backend |
| `TenantContext` | Current tenant, locale, and routing |
| `ToastContext` | Toast notification management |

### 11.6 Data Layer

| File | Purpose |
|------|---------|
| `lib/api/unified-client.ts` | Unified API client for Medusa SDK + custom endpoints |
| `lib/data/cart.ts` | Cart data operations |
| `lib/data/categories.ts` | Category data fetching |
| `lib/data/checkout/addresses.ts` | Checkout address management |
| `lib/data/checkout/complete.ts` | Checkout completion |
| `lib/data/checkout/payment.ts` | Payment processing |
| `lib/data/checkout/shipping.ts` | Shipping method selection |
| `lib/data/common.ts` | Shared data utilities |
| `lib/data/country-code.ts` | Country code utilities |
| `lib/data/custom.ts` | Custom API data fetching |
| `lib/data/order.ts` | Order data operations |
| `lib/data/products.ts` | Product data fetching |
| `lib/data/regions.ts` | Region data operations |
| `lib/data/stores.ts` | Store data operations |

### 11.7 Utilities

| File | Purpose |
|------|---------|
| `lib/utils/cart.ts` | Cart calculation helpers |
| `lib/utils/checkout.ts` | Checkout flow utilities |
| `lib/utils/cn.ts` | Tailwind CSS class name merging (clsx + tailwind-merge) |
| `lib/utils/env.ts` | Environment variable access |
| `lib/utils/order.ts` | Order formatting helpers |
| `lib/utils/price.ts` | Price formatting and conversion |
| `lib/utils/product.ts` | Product data transformation |
| `lib/utils/query-keys.ts` | TanStack Query key factory |
| `lib/utils/region.ts` | Region selection helpers |
| `lib/utils/sdk.ts` | Medusa SDK wrapper |
| `lib/utils/validation.ts` | Form validation schemas |
| `lib/i18n/index.ts` | Internationalization utilities |
| `lib/store-context.tsx` | Store context provider |
| `lib/store-detector.ts` | Store resolution (domain/subdomain) |

---

## 12. Design System Packages

### 12.1 @dakkah-cityos/contracts

Shared TypeScript contracts between backend and frontend.

| Module | Exports |
|--------|---------|
| `node-context.ts` | `NodeContext` interface, context creation helpers |
| `rbac.ts` | 10 role definitions with levels, permission matrix |
| `persona.ts` | 6 persona axes (demographic, psychographic, behavioral, contextual, transactional, relational), 5 precedence levels |
| `governance.ts` | Governance policy types, merge strategy types |
| `node-types.ts` | 5 node types (CITY, DISTRICT, ZONE, FACILITY, ASSET) |
| `channels.ts` | 5 channel types (web, mobile, api, kiosk, internal) |
| `index.ts` | Re-exports all modules |

### 12.2 @dakkah-cityos/design-tokens

Design token definitions for consistent styling.

| Token Category | Contents |
|---------------|----------|
| `ColorTokens` | Full color palette with light/dark mode variants |
| `TypographyTokens` | Font families, sizes, weights, line heights |
| `SpacingTokens` | Spacing scale (4px base) |
| `ShadowTokens` | Box shadow levels (sm, md, lg, xl) |
| `BorderTokens` | Border widths, radii, colors |
| `BreakpointTokens` | Responsive breakpoints (sm, md, lg, xl, 2xl) |

### 12.3 @dakkah-cityos/design-runtime

Theme runtime with React integration.

| Export | Purpose |
|--------|---------|
| `ThemeProvider` | React context provider for theming |
| `createTheme` | Theme factory function from tokens |
| `CSSVariables` | CSS custom property injection |
| `useTheme` | React hook for accessing theme context |
| `ThemeTypes` | TypeScript types for theme configuration |

### 12.4 @dakkah-cityos/design-system

Component type system (interfaces only — no implementations).

| Module | Component Types |
|--------|----------------|
| `FormTypes` | Input, Select, Checkbox, Radio, Switch, Textarea, DatePicker, FileUpload |
| `LayoutTypes` | Container, Grid, Stack, Flex, Divider, Card, Section |
| `DataDisplayTypes` | Table, List, Badge, Avatar, Tag, Stat, Progress, Timeline |
| `NavigationTypes` | Navbar, Sidebar, Tabs, Breadcrumb, Pagination, Menu |
| `UtilityTypes` | Modal, Drawer, Toast, Tooltip, Popover, Alert, Spinner |

### 12.5 lodash-set-safe

Security replacement for `lodash.set` (critical CVE — prototype pollution). Implements the same API without the vulnerability. All `lodash.set` imports are redirected via pnpm override.

---

## 13. External Integrations

### 13.1 ERPNext Integration

**Location:** `apps/backend/src/integrations/erpnext/`

| Feature | Description |
|---------|-------------|
| Invoice sync | Push invoices to ERPNext |
| Inventory sync | Sync stock levels |
| Order push | Send completed orders to ERP |
| Customer sync | Sync customer data |

**Service methods:** `createInvoice()`, `syncInventory()`, `pushOrder()`, `syncCustomer()`

### 13.2 Fleetbase Integration

**Location:** `apps/backend/src/integrations/fleetbase/`

| Feature | Description |
|---------|-------------|
| Delivery tracking | Real-time delivery status |
| Fleet management | Driver/vehicle assignment |
| Route optimization | Delivery route planning |
| Proof of delivery | Delivery confirmation |

### 13.3 Payload CMS Sync

**Location:** `apps/backend/src/integrations/payload-sync/`

| Direction | Description |
|-----------|-------------|
| Medusa → Payload | Sync products, categories, orders to CMS |
| Payload → Medusa | Sync CMS content, pages, blocks to storefront |

**Sync engine** supports incremental updates via the event outbox pattern.

### 13.4 Medusa Built-in Integrations

| Integration | Status | Description |
|-------------|--------|-------------|
| **Stripe Payments** | Conditional (requires `STRIPE_API_KEY`) | Payment processing via Stripe |
| **Stripe Connect** | Conditional (requires `ENABLE_STRIPE_CONNECT`) | Vendor payouts via Stripe Connect |
| **SendGrid Email** | Conditional (requires `SENDGRID_API_KEY`) | Email notifications via SendGrid |
| **Meilisearch** | Configured | Product search engine |

### 13.5 Disabled/Planned Plugins

The following RSC-Labs plugins are configured but currently disabled pending installation resolution:

| Plugin | Purpose |
|--------|---------|
| `@rsc-labs/medusa-store-analytics-v2` | Store analytics |
| `@rsc-labs/medusa-documents-v2` | Document generation |
| `@rsc-labs/medusa-wishlist` | Customer wishlists |
| `@rsc-labs/medusa-rbac` | Role-based access control plugin |

---

## 14. Infrastructure & Utilities

### 14.1 Centralized Configuration

**File:** `apps/backend/src/lib/config.ts`

All business rules, thresholds, and feature flags are centralized:

```
appConfig.subscription.maxPaymentRetries    → 3
appConfig.subscription.gracePeriodDays      → 7
appConfig.subscription.trialDays            → 14
appConfig.subscription.renewalReminderDays  → [7, 3, 1]

appConfig.booking.checkInWindowMinutes      → 30
appConfig.booking.noShowGracePeriodMinutes  → 15
appConfig.booking.cancellationHoursNotice   → 24

appConfig.vendor.inactiveDaysWarning        → 30
appConfig.vendor.inactiveDaysDeactivate     → 60
appConfig.vendor.commissionPercentDefault   → 10

appConfig.b2b.quoteExpiryDays              → 30
appConfig.b2b.invoiceDueDays               → 30
appConfig.b2b.defaultPaymentTerms          → "net_30"
```

### 14.2 Structured Logging

**File:** `apps/backend/src/lib/monitoring/logger.ts`

Log levels: debug, info, warn, error

Context fields: tenant_id, store_id, vendor_id, customer_id, user_id, request_id, order_id

Features: Request/response logging, error tracking with stack traces, performance timing (duration_ms), structured JSON output.

### 14.3 Prometheus Metrics

**File:** `apps/backend/src/lib/monitoring/metrics.ts`

Exposes metrics at `/admin/metrics` for monitoring integration.

### 14.4 Redis Caching

**File:** `apps/backend/src/lib/cache/redis-cache.ts`

Query caching layer with TTL support. Falls back to in-memory when Redis is unavailable.

### 14.5 Tenant Scoping

**File:** `apps/backend/src/lib/tenant-scoping.ts`

Utilities for building tenant-isolated queries across products, orders, and other entities.

### 14.6 Validation

**File:** `apps/backend/src/lib/validation.ts`

Zod-based request validation with pagination schema and formatted error responses.

---

## 15. Configuration & Feature Flags

### 15.1 Feature Flags

| Flag | Environment Variable | Default | Description |
|------|---------------------|---------|-------------|
| Stripe Connect | `ENABLE_STRIPE_CONNECT` | `false` | Enable vendor payouts via Stripe Connect |
| Email Notifications | `ENABLE_EMAIL_NOTIFICATIONS` | `true` | Enable email notifications to customers |
| Admin Notifications | `ENABLE_ADMIN_NOTIFICATIONS` | `true` | Enable admin notification emails |

### 15.2 Conditional Module Loading

The following Medusa modules load conditionally based on environment variables:

| Module | Condition | Purpose |
|--------|-----------|---------|
| SendGrid Notification | `SENDGRID_API_KEY` is set | Email delivery |
| Stripe Payment | `STRIPE_API_KEY` is set | Payment processing |

---

## 16. Seed Scripts & Data Setup

| Script | Command | Description |
|--------|---------|-------------|
| `seed.ts` | `medusa exec ./src/scripts/seed.ts` | Base seed with default data |
| `seed-all.ts` | `medusa exec ./src/scripts/seed-all.ts` | Run all seed scripts |
| `seed-complete.ts` | `medusa exec ./src/scripts/seed-complete.ts` | Complete data setup |
| `seed-companies.ts` | | B2B company seed data |
| `seed-multi-tenant.ts` | | Multi-tenant sample data |
| `seed-saudi-arabia.ts` | | Saudi Arabia region/locale data |
| `seed-saudi-data.ts` | | Saudi-specific business data |
| `seed-saudi-fresh.ts` | | Fresh Saudi data reset |
| `seed-saudi-products.ts` | | Saudi product catalog |
| `seed-services.ts` | | Bookable service products |
| `seed-subscriptions.ts` | | Subscription plans and products |
| `seed-vendors.ts` | | Sample vendor marketplace data |
| `seed-volume-pricing.ts` | | Volume pricing tiers |
| `setup-defaults.ts` | | Default system configuration |
| `setup-saudi-sales-channel.ts` | | Saudi sales channel setup |

---

## 17. Testing

### 17.1 E2E Tests (Playwright)

| Test File | Coverage |
|-----------|----------|
| `b2b-quotes.spec.ts` | B2B quote request, approval, acceptance flow |
| `dynamic-pages.spec.ts` | CMS dynamic page rendering |
| `store-selection.spec.ts` | Multi-store selection and branding |
| `vendor-portal.spec.ts` | Vendor registration, product management, order fulfillment |

### 17.2 Unit/Integration Tests

| Framework | Location | Scope |
|-----------|----------|-------|
| Jest | `apps/backend/` | Integration tests (HTTP, modules) |
| Vitest | `apps/backend/`, `apps/orchestrator/` | Unit tests |

---

## 18. Environment Variables

### 18.1 Required

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (auto-managed by Replit) |

### 18.2 Backend Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `JWT_SECRET` | `supersecret` | JWT signing secret |
| `COOKIE_SECRET` | `supersecret` | Cookie encryption secret |
| `STORE_CORS` | (required) | Allowed CORS origins for store API |
| `ADMIN_CORS` | (required) | Allowed CORS origins for admin API |
| `AUTH_CORS` | (required) | Allowed CORS origins for auth API |
| `STOREFRONT_URL` | | Storefront base URL |
| `MEDUSA_BACKEND_URL` | | Backend API base URL |

### 18.3 Optional Integrations

| Variable | Description |
|----------|-------------|
| `STRIPE_API_KEY` | Stripe payment API key |
| `STRIPE_SECRET_KEY` | Stripe secret key for Connect |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `SENDGRID_API_KEY` | SendGrid email API key |
| `SENDGRID_FROM` | SendGrid sender email address |
| `REDIS_URL` | Redis connection URL |

### 18.4 Storefront

| Variable | Description |
|----------|-------------|
| `VITE_MEDUSA_BACKEND_URL` | Backend URL for SSR (`http://localhost:9000`) |
| `VITE_MEDUSA_PUBLISHABLE_KEY` | Medusa publishable API key |

### 18.5 Business Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `MAX_PAYMENT_RETRIES` | `3` | Max subscription payment retries |
| `GRACE_PERIOD_DAYS` | `7` | Subscription grace period |
| `DEFAULT_TRIAL_DAYS` | `14` | Default trial period |
| `BOOKING_CHECKIN_WINDOW` | `30` | Check-in window in minutes |
| `BOOKING_NOSHOW_GRACE` | `15` | No-show grace period in minutes |
| `BOOKING_CANCEL_NOTICE_HOURS` | `24` | Cancellation notice hours |
| `VENDOR_INACTIVE_WARNING_DAYS` | `30` | Days before inactive warning |
| `VENDOR_INACTIVE_DEACTIVATE_DAYS` | `60` | Days before deactivation |
| `DEFAULT_COMMISSION_PERCENT` | `10` | Default vendor commission % |
| `QUOTE_EXPIRY_DAYS` | `30` | Quote expiration days |
| `INVOICE_DUE_DAYS` | `30` | Invoice due days |
| `DEFAULT_PAYMENT_TERMS` | `net_30` | Default B2B payment terms |
| `ENABLE_STRIPE_CONNECT` | `false` | Enable Stripe Connect |
| `ENABLE_EMAIL_NOTIFICATIONS` | `true` | Enable email notifications |
| `ENABLE_ADMIN_NOTIFICATIONS` | `true` | Enable admin notifications |

---

## 19. Key Design Decisions

### 19.1 Multi-Tenant Isolation
Every entity carries a `tenant_id`. All queries are scoped through middleware that injects tenant context from headers or domain detection. Write operations on admin routes are enforced through `scopeToTenantMiddleware`.

### 19.2 Node-Scoped Access Control
Users are assigned to specific nodes via `assigned_node_ids` on `TenantUser`. RBAC roles define what a user can do; node assignments define where they can do it.

### 19.3 Persona Precedence
When multiple personas apply, the highest precedence wins: Session (500) > Surface (400) > Membership (300) > User Default (200) > Tenant Default (100).

### 19.4 Governance Policy Merge
Policies merge from parent authority to child using deep merge. Child values override parent values at the leaf level, allowing regional/national policies to be customized per tenant.

### 19.5 Residency Zones
GCC and EU zones enforce local data storage with no cross-border transfers (GDPR/GCC compliance). Other zones allow flexible data handling.

### 19.6 RTL Support
Arabic locale (`ar`) automatically sets `dir="rtl"` with dedicated CSS overrides across the storefront.

### 19.7 Event Outbox Pattern
All cross-system events use the CMS-compatible envelope format with `correlation_id` and `causation_id` for distributed tracing.

### 19.8 Vite Proxy for API Calls
Browser SDK uses empty `baseUrl` (Vite proxies requests from port 5000 to backend port 9000). SSR code calls `http://localhost:9000` directly.

### 19.9 Conditional Module Loading
Payment (Stripe) and notification (SendGrid) modules only load when their API keys are configured, preventing startup errors in development environments.

### 19.10 Security Overrides
Critical CVEs are addressed through pnpm overrides in the root `package.json`, ensuring all transitive dependencies resolve to patched versions without modifying individual package dependencies. The `lodash.set` package is replaced entirely with a safe local implementation.

---

## 20. Frontend–Backend Model Integration Audit

This section maps all 57 backend models against the storefront to identify which models have frontend representation, which files/routes use them, and whether the integration is active (API calls wired) or structural-only (UI exists but no working backend connection).

### 20.1 Models WITH Frontend Representation

#### Tenant Module (1 of 6 models reflected)

| Backend Model | Frontend Status | Files | Routes | Active? |
|--------------|----------------|-------|--------|---------|
| `Tenant` | **Reflected** — Used for multi-tenant context resolution, branding, slug-based routing | `lib/context/tenant-context.tsx`, `lib/context/branding-context.tsx`, `lib/api/unified-client.ts`, `lib/store-context.tsx`, `components/store/store-switcher.tsx`, `components/locale-switcher.tsx` | `/$tenant/$locale.tsx` (layout), `/$tenant/$locale/store.tsx`, `/$tenant/$locale/stores.tsx` | **Yes** — API call to `/store/cityos/tenant?slug=X` |

#### Vendor Module (3 of 7 models reflected)

| Backend Model | Frontend Status | Files | Routes | Active? |
|--------------|----------------|-------|--------|---------|
| `Vendor` | **Reflected** — Full vendor directory, profiles, registration, dashboard | `lib/hooks/use-vendors.ts`, `lib/types/vendors.ts`, `components/vendors/` (10 files: vendor-card, vendor-directory, vendor-header, vendor-about, vendor-contact, vendor-stats, vendor-badges, vendor-filters, vendor-products, vendor-reviews, featured-vendors), `components/vendor/` (vendor-dashboard, vendor-registration-form, vendor-product-form, vendor-product-list, vendor-order-list, vendor-analytics-dashboard, stripe-connect-setup) | `/$tenant/$locale/vendors/index.tsx`, `/$tenant/$locale/vendors/$handle.tsx`, `/$tenant/$locale/vendors/$handle.products.tsx`, `/$tenant/$locale/vendors/$handle.reviews.tsx`, `/$tenant/$locale/vendor/register.tsx`, `/$tenant/$locale/vendor/index.tsx` (dashboard), `/$tenant/$locale/vendor/products/*`, `/$tenant/$locale/vendor/orders/*` | **Yes** — API calls to `/store/vendors`, `/store/vendors/:handle`, `/store/vendors/:handle/products` |
| `VendorProduct` | **Reflected** — Vendor product management (CRUD) | `components/vendor/vendor-product-form.tsx`, `components/vendor/vendor-product-list.tsx` | `/$tenant/$locale/vendor/products/index.tsx`, `/$tenant/$locale/vendor/products/new.tsx`, `/$tenant/$locale/vendor/products/$productId.tsx` | **Yes** — API calls to `/store/vendors/:handle/products` |
| `VendorOrder` | **Reflected** — Vendor order management | `components/vendor/vendor-order-list.tsx` | `/$tenant/$locale/vendor/orders/index.tsx` | **Partial** — UI exists, references vendor orders but no dedicated hook; uses generic order data |

#### Commission Module (2 of 2 models reflected)

| Backend Model | Frontend Status | Files | Routes | Active? |
|--------------|----------------|-------|--------|---------|
| `CommissionRule` | **Reflected** — Commission display in vendor dashboard | `components/vendor/vendor-commissions.tsx`, `components/vendor/vendor-dashboard.tsx` | `/$tenant/$locale/vendor/commissions.tsx` | **Partial** — UI renders commission data but no dedicated hook for `/store/commissions`; data shown via vendor dashboard aggregate |
| `CommissionTransaction` | **Reflected** — Transaction history in commissions view | `components/vendor/vendor-commissions.tsx`, `components/vendor/vendor-analytics-dashboard.tsx` | `/$tenant/$locale/vendor/commissions.tsx` | **Partial** — Same as above; displayed within commission component |

#### Payout Module (1 of 2 models reflected)

| Backend Model | Frontend Status | Files | Routes | Active? |
|--------------|----------------|-------|--------|---------|
| `Payout` | **Reflected** — Vendor payout tracking, Stripe Connect setup | `components/vendor/vendor-payouts.tsx`, `components/vendor/vendor-dashboard.tsx`, `components/vendor/stripe-connect-setup.tsx` | `/$tenant/$locale/vendor/payouts/index.tsx`, `/$tenant/$locale/vendor/payouts.tsx` | **Partial** — UI exists with payout list display; Stripe Connect integration referenced |

#### Company Module (3 of 7 models reflected)

| Backend Model | Frontend Status | Files | Routes | Active? |
|--------------|----------------|-------|--------|---------|
| `Company` | **Reflected** — B2B company registration, dashboard, credit display | `lib/hooks/use-companies.ts`, `lib/types/companies.ts`, `components/b2b/b2b-dashboard.tsx`, `components/b2b/company-registration-form.tsx`, `components/business/company-overview.tsx`, `components/business/company-orders.tsx`, `components/business/credit-display.tsx` | `/$tenant/$locale/b2b/register.tsx`, `/$tenant/$locale/b2b/dashboard.tsx`, `/$tenant/$locale/business/orders.tsx`, `/$tenant/$locale/business/team.tsx` | **Yes** — API calls to `/store/companies/me`, `/store/companies/me/credit`, `/store/companies/me/orders`, `/store/companies/me/team` |
| `CompanyUser` | **Reflected** — Team management (invite, update, remove members) | `lib/hooks/use-companies.ts` (useCompanyTeam, useInviteTeamMember, useUpdateTeamMember, useRemoveTeamMember), `lib/types/companies.ts` (CompanyMember type) | `/$tenant/$locale/business/team.tsx` | **Yes** — API calls to `/store/companies/me/team`, `/store/companies/me/team/invite`, `/store/companies/me/team/:memberId` |
| `PurchaseOrder` + `PurchaseOrderItem` | **Reflected** — Full PO lifecycle (create, submit, approve/reject, view) | `lib/hooks/use-purchase-orders.ts`, `components/purchase-orders/` (po-card, po-detail, po-form, po-line-items, po-list, po-timeline, po-approval-flow), `components/business/approval-queue.tsx`, `components/business/po-checkout.tsx`, `components/b2b/b2b-checkout-options.tsx` | `/$tenant/$locale/account/purchase-orders/index.tsx`, `/$tenant/$locale/account/purchase-orders/$id.tsx`, `/$tenant/$locale/account/purchase-orders/new.tsx`, `/$tenant/$locale/business/approvals.tsx` | **Yes** — API calls to `/store/purchase-orders`, `/store/purchase-orders/:id`, `/store/purchase-orders/:id/submit` |

#### Quote Module (2 of 2 models reflected)

| Backend Model | Frontend Status | Files | Routes | Active? |
|--------------|----------------|-------|--------|---------|
| `Quote` | **Reflected** — Quote listing, details, request, accept/decline | `lib/hooks/use-quotes.ts`, `lib/types/quotes.ts`, `components/quotes/quote-list.tsx`, `components/quotes/quote-details.tsx`, `components/quotes/quote-request-form.tsx` | `/$tenant/$locale/quotes/index.tsx`, `/$tenant/$locale/quotes/$id.tsx`, `/$tenant/$locale/quotes/request.tsx` | **Yes** — API calls to `/store/quotes`, `/store/quotes/:id`, `/store/quotes/:id/accept`, `/store/quotes/:id/decline` |
| `QuoteItem` | **Reflected** — Rendered within quote details as line items | `lib/types/quotes.ts` (QuoteItem type), `components/quotes/quote-details.tsx`, `components/quotes/quote-request-form.tsx` | Same as Quote routes | **Yes** — Included in quote API responses |

#### Subscription Module (3 of 5 models reflected)

| Backend Model | Frontend Status | Files | Routes | Active? |
|--------------|----------------|-------|--------|---------|
| `SubscriptionPlan` | **Reflected** — Plan listing, selection, comparison | `lib/hooks/use-subscriptions.ts`, `lib/types/subscriptions.ts`, `components/subscriptions/plan-card.tsx` | `/$tenant/$locale/subscriptions/index.tsx`, `/$tenant/$locale/subscriptions/checkout.tsx` | **Yes** — API call to `/store/subscription-plans` |
| `Subscription` | **Reflected** — Full subscription management (view, pause, resume, cancel, change plan) | `lib/hooks/use-subscriptions.ts` (7 hooks), `lib/types/subscriptions.ts`, `components/subscriptions/` (subscription-card, subscription-detail, subscription-list, subscription-actions, cancellation-flow, billing-history), `components/account/active-subscriptions.tsx` | `/$tenant/$locale/account/subscriptions/index.tsx`, `/$tenant/$locale/account/subscriptions/$id.tsx`, `/$tenant/$locale/account/subscriptions/$id.billing.tsx`, `/$tenant/$locale/subscriptions/success.tsx` | **Yes** — API calls to `/store/subscriptions/me`, `/store/subscriptions/:id`, `/store/subscriptions/:id/pause`, `/store/subscriptions/:id/resume`, `/store/subscriptions/:id/cancel`, `/store/subscriptions/:id/change-plan` |
| `SubscriptionItem` | **Reflected** — Rendered within subscription detail as line items | `lib/types/subscriptions.ts` (SubscriptionItem type), `components/subscriptions/subscription-detail.tsx` | Same as Subscription routes | **Yes** — Included in subscription API responses |

#### Booking Module (4 of 7 models reflected)

| Backend Model | Frontend Status | Files | Routes | Active? |
|--------------|----------------|-------|--------|---------|
| `Booking` | **Reflected** — Full booking lifecycle (browse services, select time, book, view, cancel, reschedule) | `lib/hooks/use-bookings.ts` (8 hooks), `lib/types/bookings.ts`, `components/bookings/` (booking-card, booking-detail, booking-list, booking-actions, service-card, provider-select, calendar-picker, add-to-calendar, booking-reminder), `components/account/upcoming-bookings.tsx` | `/$tenant/$locale/bookings/index.tsx`, `/$tenant/$locale/bookings/$serviceHandle.tsx`, `/$tenant/$locale/bookings/confirmation.tsx`, `/$tenant/$locale/account/bookings/index.tsx`, `/$tenant/$locale/account/bookings/$id.tsx` | **Yes** — API calls to `/store/bookings`, `/store/bookings/services`, `/store/bookings/availability`, `/store/bookings/:id/cancel`, `/store/bookings/:id/reschedule` |
| `ServiceProvider` | **Reflected** — Provider selection during booking | `lib/types/bookings.ts` (ServiceProvider type), `lib/hooks/use-bookings.ts` (useServiceProviders), `components/bookings/provider-select.tsx` | `/$tenant/$locale/bookings/$serviceHandle.tsx` | **Yes** — API call to `/store/bookings/services/:serviceId/providers` |
| `Availability` | **Reflected** — Time slot display during booking flow | `lib/types/bookings.ts` (ProviderAvailability, WeeklySchedule, TimeSlot types), `lib/hooks/use-bookings.ts` (useServiceAvailability), `components/bookings/calendar-picker.tsx` | `/$tenant/$locale/bookings/$serviceHandle.tsx` | **Yes** — API call to `/store/bookings/availability` |
| `BookingReminder` | **Reflected** — Reminder display on booking detail | `components/bookings/booking-reminder.tsx` | `/$tenant/$locale/account/bookings/$id.tsx` | **Partial** — UI component exists but no dedicated API call; reminder data expected from booking detail response |

#### Review Module (1 of 1 model reflected)

| Backend Model | Frontend Status | Files | Routes | Active? |
|--------------|----------------|-------|--------|---------|
| `Review` | **Reflected** — Product reviews, vendor reviews, review submission, helpful voting | `lib/hooks/use-reviews.ts` (useProductReviews, useVendorReviews, useCreateReview, useMarkReviewHelpful), `lib/types/reviews.ts`, `components/reviews/` (review-card, review-form, review-list, review-summary, verified-badge), `components/vendors/vendor-reviews.tsx`, `components/homepage/sections/reviews-section.tsx` | `/$tenant/$locale/vendors/$handle.reviews.tsx` (vendor reviews on vendor profile) | **Yes** — API calls to `/store/reviews/products/:id`, `/store/reviews/vendors/:id`, `/store/reviews`, `/store/reviews/:id/helpful` |

#### Invoice Module (1 of 2 models reflected)

| Backend Model | Frontend Status | Files | Routes | Active? |
|--------------|----------------|-------|--------|---------|
| `Invoice` | **Reflected** — Invoice download, early payment discount banner | `components/orders/invoice-download.tsx`, `components/orders/order-actions.tsx`, `components/invoices/early-payment-banner.tsx`, `components/subscriptions/billing-history.tsx`, `components/business/po-checkout.tsx` | `/$tenant/$locale/account/orders/$id.tsx` (within order detail), `/$tenant/$locale/account/subscriptions/$id.billing.tsx` | **Partial** — Invoice download UI exists; early payment endpoint at `/store/invoices/:id/early-payment` exists on backend |

#### Volume Pricing Module (1 of 2 models reflected)

| Backend Model | Frontend Status | Files | Routes | Active? |
|--------------|----------------|-------|--------|---------|
| `VolumePricing` | **Reflected** — Tiered pricing display on product pages, B2B dashboard | `components/products/volume-pricing-display.tsx`, `components/b2b/b2b-dashboard.tsx`, `components/product-actions.tsx` | `/$tenant/$locale/products/$handle.tsx` (product detail page) | **Partial** — UI component exists; backend endpoint at `/store/products/:id/volume-pricing` and `/store/volume-pricing/:productId` available |

#### I18n Module (1 of 1 model reflected — indirectly)

| Backend Model | Frontend Status | Files | Routes | Active? |
|--------------|----------------|-------|--------|---------|
| `Translation` | **Indirectly reflected** — Locale switching, i18n utilities, RTL support | `lib/i18n/index.ts`, `components/locale-switcher.tsx`, `lib/context/tenant-context.tsx` | `/$tenant/$locale.tsx` (layout with locale param) | **Partial** — Frontend has hardcoded translation strings in i18n/index.ts; does NOT call `/store/translations` API. Locale is used for routing and formatting only |

#### Store Module (1 of 1 model reflected)

| Backend Model | Frontend Status | Files | Routes | Active? |
|--------------|----------------|-------|--------|---------|
| `CityosStore` | **Reflected** — Store detection, multi-store browsing | `lib/store-detector.ts`, `lib/store-context.tsx`, `components/store/store-switcher.tsx` | `/$tenant/$locale/store.tsx`, `/$tenant/$locale/stores.tsx` | **Yes** — API calls to `/store/stores`, `/store/stores/default`, `/store/stores/by-domain/:domain` |

### 20.2 Models NOT Reflected in Frontend (23 of 57)

These backend models have **zero frontend representation** — no types, no hooks, no components, no routes.

| # | Backend Model | Module | Reason / Notes |
|---|--------------|--------|----------------|
| 1 | `TenantUser` | Tenant | Admin-only model. RBAC roles and node-scoped access managed via admin dashboard, not storefront |
| 2 | `TenantSettings` | Tenant | Admin configuration (feature flags, limits). Backend-only; storefront reads effects via `/store/features` |
| 3 | `TenantBilling` | Tenant | Platform-level billing for tenant subscription. Admin/platform concern, not customer-facing |
| 4 | `TenantUsageRecord` | Tenant | Platform usage metering. Internal tracking only |
| 5 | `TenantInvoice` | Tenant | Platform invoices to tenants. Admin/platform concern |
| 6 | `Node` | Node | CityOS 5-level hierarchy. Backend-only structural model; storefront uses tenant context, not node hierarchy |
| 7 | `GovernanceAuthority` | Governance | Policy chain for data sovereignty. Backend-only enforcement; storefront never displays governance rules |
| 8 | `Persona` | Persona | 6-axis persona system. Backend-only resolution; storefront doesn't display/manage personas |
| 9 | `PersonaAssignment` | Persona | Persona-to-entity mapping. Backend-only |
| 10 | `EventOutbox` | Events | CMS event queue. Purely infrastructure; never exposed to storefront |
| 11 | `AuditLog` | Audit | Audit trail. Admin-only viewing; storefront has no audit display |
| 12 | `SalesChannelMapping` | Channel | Channel→Medusa sales channel mapping. Backend orchestration only |
| 13 | `RegionZoneMapping` | Region-Zone | Residency zone→Medusa region mapping. Backend orchestration only |
| 14 | `VendorUser` | Vendor | Vendor team members. Not exposed in vendor storefront portal (vendor dashboard shows products/orders, not team) |
| 15 | `VendorOrderItem` | Vendor | Line items within vendor orders. Vendor order list doesn't drill into line items |
| 16 | `VendorAnalyticsSnapshot` | Vendor | Analytics snapshots. Vendor dashboard shows aggregate data but doesn't use this model's API directly |
| 17 | `VendorPerformanceMetric` | Vendor | Performance metrics. Same as above — shown as aggregate in dashboard |
| 18 | `PayoutTransactionLink` | Payout | Links payouts to Medusa payment transactions. Backend join table only |
| 19 | `ApprovalWorkflow` | Company | B2B approval workflow configuration. Admin-configured; storefront only shows approval status on POs |
| 20 | `ApprovalRequest` + `ApprovalAction` | Company | Individual approval steps. Storefront shows approval status but doesn't expose the request/action models directly |
| 21 | `TaxExemption` | Company | B2B tax exemption certificates. Admin/backend validated; not shown in storefront |
| 22 | `PaymentTerms` | Company | B2B payment terms (net_30, etc.). Displayed as a field on Company, but no dedicated PaymentTerms model exposure |
| 23 | `ServiceProduct` | Booking | Bookable service definition. Frontend uses a `Service` type that maps to this but doesn't reference model directly; API returns services via `/store/bookings/services` |
| 24 | `AvailabilityException` | Booking | Date-specific overrides. Embedded within availability response, not standalone |
| 25 | `BookingItem` | Booking | Booking line items. Not exposed; bookings are shown as single-service records |
| 26 | `BillingCycle` | Subscription | Billing period tracking. Referenced in subscription detail display but no dedicated API call |
| 27 | `SubscriptionEvent` | Subscription | Subscription lifecycle events. Backend audit trail; not exposed to storefront |
| 28 | `SubscriptionPause` | Subscription | Pause period records. Pause/resume functionality exists but uses the Subscription model's pause fields, not a separate PauseRecord API |
| 29 | `SubscriptionDiscount` | Subscription | Discount/coupon application. `discount-code-input.tsx` component exists but references generic discount logic, not this model |
| 30 | `InvoiceItem` | Invoice | Invoice line items. Invoice download provides the full document; items not displayed individually |
| 31 | `VolumePricingTier` | Volume Pricing | Individual tier records. Volume pricing display reads tiers from the parent model response |

### 20.3 Summary

| Category | Count | Details |
|----------|-------|---------|
| **Models with active frontend integration** | **16** | Tenant, Vendor, VendorProduct, Company, CompanyUser, PurchaseOrder+PurchaseOrderItem, Quote, QuoteItem, Subscription, SubscriptionPlan, SubscriptionItem, Booking, ServiceProvider, Availability, Review, CityosStore |
| **Models with partial/UI-only frontend** | **10** | VendorOrder, CommissionRule, CommissionTransaction, Payout, BookingReminder, Invoice, VolumePricing, Translation, BillingCycle, SubscriptionDiscount |
| **Models with NO frontend representation** | **31** | TenantUser, TenantSettings, TenantBilling, TenantUsageRecord, TenantInvoice, Node, GovernanceAuthority, Persona, PersonaAssignment, EventOutbox, AuditLog, SalesChannelMapping, RegionZoneMapping, VendorUser, VendorOrderItem, VendorAnalyticsSnapshot, VendorPerformanceMetric, PayoutTransactionLink, ApprovalWorkflow, ApprovalRequest, ApprovalAction, TaxExemption, PaymentTerms, ServiceProduct, AvailabilityException, BookingItem, SubscriptionEvent, SubscriptionPause, InvoiceItem, VolumePricingTier |

**Key observations:**
- The 31 "not reflected" models fall into clear categories: **admin/platform models** (TenantUser, TenantSettings, TenantBilling, etc.), **infrastructure models** (EventOutbox, AuditLog, SalesChannelMapping, RegionZoneMapping), **join/child models** already embedded in parent responses (QuoteItem, BookingItem, InvoiceItem, VolumePricingTier, AvailabilityException), and **vendor internal models** (VendorUser, VendorAnalyticsSnapshot, VendorPerformanceMetric).
- Most "partial" models have UI components built but rely on data being included in parent API responses rather than making dedicated API calls.
- The 16 actively integrated models cover all core customer-facing features: shopping, B2B commerce, subscriptions, bookings, reviews, quotes, and vendor marketplace.

---

*Document generated: 2026-02-08*
*Platform version: Medusa.js 2.11.4-snapshot | React 19.1.1 | TanStack Router 1.131.32*
