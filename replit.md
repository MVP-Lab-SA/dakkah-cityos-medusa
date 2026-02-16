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

## Module Audit (2026-02-16)

Full detailed audit with classification matrix, migration roadmap, and maturity assessment: **docs/module-audit.md**

### Summary: 66 custom modules classified against Medusa v2 built-in capabilities

**Duplicates (3):** `analytics`, `i18n`, `notification-preferences` have Medusa equivalents. Migration conditional on Medusa module capability fit and configuration status.

**Hybrid-Overlap (5):** `cart-extension`, `promotion-ext`, `shipping-extension`, `tax-config`, `inventory-extension` partially overlap with Medusa core. Require gap analysis before migration decisions.

**Extensions (16):** `cityosStore`, `volume-pricing`, `vendor`, `commission`, `payout`, `subscription`, `company`, `quote`, `review`, `digital-product`, `invoice`, `dispute`, `loyalty`, `wishlist`, `social-commerce`, `membership` extend Medusa with unique marketplace/B2B/consumer features. KEEP.

**Infrastructure/CityOS (8):** `tenant`, `node`, `governance`, `persona`, `channel`, `region-zone`, `audit`, `cms-content` are unique platform infrastructure with no Medusa equivalents. KEEP.

**Vertical/Domain-Specific (27):** `booking`, `healthcare`, `restaurant`, `travel`, `event-ticketing`, `freelance`, `grocery`, `automotive`, `fitness`, `financial-product`, `advertising`, `parking`, `utilities`, `legal`, `government`, `crowdfunding`, `auction`, `classified`, `charity`, `education`, `real-estate`, `pet-service`, `affiliate`, `warranty`, `rental`, `social-commerce`, `membership`. KEEP.

**Stub Modules (3, NOT registered in medusa-config.ts):** `wallet`, `trade-in`, `insurance` have no models and have orphaned API routes (wallet: 2, trade-in: 4, insurance: 4 route files). Removal requires deleting both module dirs and route files.

### Migration Roadmap
- Phase 1: Remove stubs + orphaned routes (immediate, no risk)
- Phase 2: Migrate confirmed duplicates (analytics, notification-preferences)
- Phase 3: Evaluate i18n feasibility + gap analysis on 5 hybrid modules
- Phase 4: Strengthen extension patterns (links, subscribers)
- Phase 5: Re-evaluate RSC-Labs plugins

## Environment Variables
**Set:** DATABASE_URL/PG*, VITE_MEDUSA_PUBLISHABLE_KEY, STRIPE_*, SENDGRID_API_KEY, TEMPORAL_*, PAYLOAD_*, ERPNEXT_*, FLEETBASE_*, WALTID_API_KEY
**Not set (with fallbacks):** MEILISEARCH_HOST (search disabled), SENTRY_DSN (monitoring disabled), REDIS_URL (in-memory fallback)

## Testing Status
~180 test files (160 backend unit, 1 integration, 2 E2E, 18 storefront unit, 4 storefront E2E, 3 orchestrator). No CI/CD pipeline executing them.

## Known Pre-existing Issues
- CommissionModule: 2 LSP type errors (non-blocking)
- Hydration mismatch warnings (cosmetic, SSR/client date differences)
- CMS hierarchy sync 503s (expected when Payload CMS not running)

## Recent Changes
- 2026-02-16: Comprehensive module audit (66 modules classified, migration roadmap created, detailed in docs/module-audit.md)
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
