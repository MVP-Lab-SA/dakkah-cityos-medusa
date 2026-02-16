# Medusa.js E-Commerce Monorepo — Dakkah CityOS Commerce Platform

## Overview
This project is a Medusa.js e-commerce monorepo for multi-tenancy, integrating with the Dakkah CityOS CMS architecture. Dakkah aims to be a comprehensive commerce platform supporting over 27 verticals, featuring a 5-level node hierarchy, a 10-role RBAC system, a 6-axis persona system, a 4-level governance chain, and localization (en/fr/ar with RTL support). The vision is to establish Dakkah as a leading commerce solution across diverse verticals, with "Dakkah" serving as the primary super-app tenant.

## User Preferences
- Full alignment with CityOS CMS architecture required
- Centralized design system matching CMS pattern
- Port 5000 for frontend, 0.0.0.0 host
- Bypass host verification for Replit environment
- Country-level record unification for CMS pages
- Payload CMS API compatibility for future migration

## System Architecture
The project utilizes a Turborepo monorepo structure, incorporating a Medusa.js v2 backend API, a TanStack Start + React storefront, shared TypeScript contracts, design tokens, theme providers, and a component type system.

### Backend
The backend offers modularity for CityOS features including tenant management, a 5-level node hierarchy (CITY→DISTRICT→ZONE→FACILITY→ASSET), policy inheritance-based governance, a persona system, a CMS-compatible event outbox, and i18n. It supports multi-vendor marketplaces, subscriptions, B2B, bookings, promotions, and specialized services. Key design principles include multi-tenant isolation, RBAC, persona precedence, and residency zones. The API includes 486 endpoints with centralized error handling and structured logging.

### Storefront
The storefront, built with TanStack Start and React, provides SSR, dynamic routing, and file-based routing. It features a centralized design system with a robust provider chain, tenant-scoped routes, and a comprehensive Payload CMS-compatible block system with 77 block types across 45 vertical detail pages. UI adheres to mobile-first responsive design, utilizes design tokens, and supports i18n with logical CSS properties for RTL/LTR. All public routes include SEO meta tags and accessibility features, and all 65 detail pages have SSR loaders.

### Multi-Vendor Architecture
The platform employs a custom multi-vendor module for granular control, linking vendors to products via a `vendor_product` junction table. It includes order splitting functionality for `VendorOrder` and `VendorOrderItem` creation based on product vendors, with commission calculation. A dedicated Vendor Portal provides 73 dashboard pages.

### Verticals
The system distinguishes between verticals requiring product variants (e.g., Products, Subscription, Quote, B2B) and those managing their own entity models without direct variant dependency (e.g., Bookings, Auctions, Classifieds, Events/Ticketing, Real Estate). There are 27 vertical modules, each with domain-specific models and business logic.

### CMS Integration
A local CMS registry defines 27 commerce verticals and additional pages, supporting `countryCode` and `regionZone`. Backend endpoints provide Payload-compatible responses, and a CMS Hierarchy Sync Engine synchronizes 8 collections from Payload CMS to ERPNext.

### Integration Layer
All cross-system integration occurs via Temporal Cloud workflows, ensuring durability, retries, saga patterns, and observability. This includes PostgreSQL-backed sync tracking, webhook endpoints with signature verification for Stripe, ERPNext, Fleetbase, and Payload CMS, and an outbox processor with circuit breakers and rate limiters. An auto-sync scheduler manages synchronization and cleanup.

### Authentication and API Usage
JWT-based authentication is used for the customer SDK. All tenant/governance/node API calls must use `sdk.client.fetch()` for automatic `VITE_MEDUSA_PUBLISHABLE_KEY` inclusion. Authenticated routes are protected with granular access control via `RoleGuard` based on a 10-role RBAC system.

### Manage Page Infrastructure
The platform supports 45 CRUD configurations for various verticals using shared components like DataTable, Charts, Calendar, and FormWizard. Features include AnalyticsOverview, BulkActionsBar, and AdvancedFilters. The sidebar dynamically filters modules based on user role weight.

### System Responsibility Split
- **Medusa (Commerce Engine):** Products, orders, payments, commissions, marketplace listings, vendor management.
- **Payload CMS (Entity & Content Management):** Tenant profiles, POI content, vendor public profiles, pages, navigation.
- **Fleetbase (Geo & Logistics):** Geocoding, address validation, delivery zone management, tracking.
- **ERPNext (Finance, Accounting & ERP):** Sales invoices, payment entries, GL, inventory, procurement, reporting.
- **Temporal Cloud (Workflow Orchestration):** Workflow execution, task queues, dynamic AI agent workflows, event outbox.
- **Walt.id (Decentralized Digital Identity):** DID management, verifiable credentials, wallet integration.

## Module Audit (2026-02-16, revised 2026-02-16)

Full detailed audit: **docs/module-audit.md** (architecture, code inventory, classification matrix, gap analysis, upgrade risks, implementation plans)

### Code Separation from Medusa
All custom code lives in `apps/backend/src/` — completely separate from Medusa's `node_modules/@medusajs/`. No patches, no forks, no modifications to Medusa source code. All modules use Medusa's official extension pattern (`MedusaService`, `model.define`, `Module()`, `defineLink`). Future Medusa upgrades will not break custom modules unless Medusa changes its extension APIs.

### Custom Backend Code Inventory
59 module directories, 486 API route files (237 admin, 163 store, 68 vendor, 18 other), 34 subscribers, 30 workflows, 27 links, 17 jobs, 29 scripts, 134 admin UI files, 8 integrations, 1 worker

### Module Classification (59 modules, all justified — 0 requiring immediate migration)

**Reclassified from Duplicate/Hybrid to Extension (8):** After deep comparison with Medusa v2 built-in capabilities:
- `analytics` — NOT a duplicate: Medusa Analytics (v2.8.3+) only forwards events to external providers (track/identify). Our module is a self-contained BI system with persistent storage (AnalyticsEvent, Report, Dashboard models). Report/Dashboard have NO Medusa equivalent.
- `i18n` — NOT a duplicate: Medusa Translation (experimental) is entity-field-level translation. Our module is a tenant-scoped key-value translation store for UI strings/labels with namespace support and draft/published workflow. Complementary, not duplicative.
- `notification-preferences` — NOT a duplicate: Medusa Notification handles sending. Our module handles customer consent/preference management. Medusa docs explicitly recommend building this as a custom module.
- `cart-extension`, `promotion-ext`, `shipping-extension`, `tax-config`, `inventory-extension` — All add unique capabilities beyond Medusa core (tenant-scoped rules, typed queryable fields, unique domain models).

**Extensions (24 total):** `analytics`, `i18n`, `notification-preferences`, `cart-extension`, `promotion-ext`, `shipping-extension`, `tax-config`, `inventory-extension`, `cityosStore`, `volume-pricing`, `vendor`, `commission`, `payout`, `subscription`, `company`, `quote`, `review`, `digital-product`, `invoice`, `dispute`, `loyalty`, `wishlist`, `social-commerce`, `membership`

**Infrastructure/CityOS (8):** `tenant`, `node`, `governance`, `persona`, `channel`, `region-zone`, `audit`, `cms-content`

**Vertical/Domain-Specific (27):** `booking`, `healthcare`, `restaurant`, `travel`, `event-ticketing`, `freelance`, `grocery`, `automotive`, `fitness`, `financial-product`, `advertising`, `parking`, `utilities`, `legal`, `government`, `crowdfunding`, `auction`, `classified`, `charity`, `education`, `real-estate`, `pet-service`, `affiliate`, `warranty`, `rental`, `membership`, `social-commerce`

**Stub Modules (3, need implementation):** `wallet`, `trade-in`, `insurance` — have services with business logic, API routes, storefront pages, but lack data models and medusa-config.ts registration. No Medusa built-in or official plugin exists for any of these. Implementation plan in docs/module-audit.md.

### Implementation Status
- **DONE:** Wallet module implemented (Wallet + WalletTransaction models, index.ts, medusa-config, customer-wallet link)
- **DONE:** Trade-in module implemented (TradeInRequest + TradeInOffer models, index.ts, medusa-config, customer + product links)
- **DONE:** Insurance module implemented (InsPolicy + InsClaim models — renamed from insurance_policy to avoid conflict with financial-product module — index.ts, medusa-config, customer + order links)
- **DONE:** CMS hierarchy sync — health check before sync, exponential backoff, noise reduction
- **DONE:** SendGrid notification — graceful degradation for 401 errors (skip with warning instead of stack traces)
- **DONE:** Commission module — fixed LSP type errors (list method parameter shapes)
- **DONE:** Env var validation utility created (apps/backend/src/lib/env-validation.ts)
- **DONE:** Storefront — hydration fix (dates in useEffect), SSR external config for React dedup, stream lifecycle fixes

### Remaining Roadmap
- Phase 4: Strengthen extension patterns (add missing defineLink connections, subscribers)
- Phase 5: Re-evaluate RSC-Labs plugins when compatible
- Phase 6: CI/CD pipeline for ~180 test files
- Phase 7: Production deployment configuration

## Environment Variables
**Set:** DATABASE_URL/PG*, VITE_MEDUSA_PUBLISHABLE_KEY, STRIPE_*, SENDGRID_API_KEY, TEMPORAL_*, PAYLOAD_*, ERPNEXT_*, FLEETBASE_*, WALTID_API_KEY
**Not set (with fallbacks):** MEILISEARCH_HOST (search disabled), SENTRY_DSN (monitoring disabled), REDIS_URL (in-memory fallback)

## Testing Status
~180 test files (160 backend unit, 1 integration, 2 E2E, 18 storefront unit, 4 storefront E2E, 3 orchestrator). No CI/CD pipeline executing them.

## Known Pre-existing Issues
- Hydration mismatch warnings may persist in browser console during development (mitigated with SSR fixes, fully resolved on production build)
- CMS hierarchy sync silently skips when Payload CMS is unreachable (by design — health check added)
- SendGrid notifications gracefully degrade when API key is invalid (single warning, no stack traces)

## Recent Changes
- 2026-02-16: Implemented wallet, trade-in, insurance stub modules (models, registration, links)
- 2026-02-16: Phase 0 stability fixes (CMS health check, SendGrid graceful degradation, hydration fixes, React dedup, stream lifecycle)
- 2026-02-16: Fixed Commission module LSP type errors, created env var validation utility
- 2026-02-16: Comprehensive module audit (59 modules classified, migration roadmap created, detailed in docs/module-audit.md)
- 2026-02-16: Fixed vendor-product alias conflict, commission service resolution safety
- 2026-02-15: Created vendor-order-split subscriber, added final SSR loaders

## External Dependencies
- **Database:** PostgreSQL
- **Frontend Framework:** TanStack Start, React
- **Monorepo Management:** Turborepo, pnpm
- **API Gateway/Orchestration:** Medusa.js
- **Workflow Orchestration:** Temporal Cloud
- **CMS:** Payload CMS
- **ERP:** ERPNext
- **Logistics:** Fleetbase
- **Digital Identity:** Walt.id
- **Payment Gateway:** Stripe
- **Email Service:** SendGrid
