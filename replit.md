# Medusa.js E-Commerce Monorepo — Dakkah CityOS Commerce Platform

## Overview
This project is a Medusa.js e-commerce monorepo for multi-tenancy, seamlessly integrating with the Dakkah CityOS CMS architecture. Dakkah is designed to power over 27 commerce verticals, featuring a 5-level node hierarchy, a 10-role RBAC system, a 6-axis persona system, a 4-level governance chain, and localization for en/fr/ar (with RTL support). The platform aims to be a comprehensive commerce solution, with "Dakkah" as the primary super-app tenant containing all seeded data.

## User Preferences
- Full alignment with CityOS CMS architecture required
- Centralized design system matching CMS pattern
- Port 5000 for frontend, 0.0.0.0 host
- Bypass host verification for Replit environment
- Country-level record unification for CMS pages
- Payload CMS API compatibility for future migration

## System Architecture

### Structure
The project uses a Turborepo monorepo with dedicated packages for the Medusa.js v2 backend API, a TanStack Start + React storefront, shared TypeScript contracts, design token definitions, theme runtime/React providers, and a component type system.

### Backend Features
The backend provides modularity for CityOS features including tenant management, a 5-level node hierarchy (CITY→DISTRICT→ZONE→FACILITY→ASSET), policy inheritance-based governance, a persona system, a CMS-compatible event outbox, and i18n. It supports multi-vendor marketplaces, subscriptions, B2B, bookings, promotions, and specialized services. Key design decisions include multi-tenant isolation, RBAC, persona precedence, and residency zones.

### Storefront Architecture
The storefront uses TanStack Start with React for SSR, dynamic routing, and file-based routing. It implements a centralized design system, ensuring consistent context via a robust provider chain, tenant-scoped routes, and a comprehensive Payload CMS-compatible block system with 76 block types. All UI follows mobile-first responsive patterns and utilizes design tokens.

### Internationalization and Localization
The system supports full logical CSS properties for RTL/LTR, with `dir="rtl"` for Arabic locales. i18n integration uses a `locale` prop for translations across 30+ namespaces in en/fr/ar JSON files.

### CMS Integration
A local CMS registry defines 27 commerce verticals and additional pages, supporting `countryCode` and `regionZone` for country-level unification. Backend endpoints provide Payload-compatible responses, and frontend hooks use React Query. The local registry is designed for seamless migration to Payload CMS. A CMS Hierarchy Sync Engine keeps 8 collections synchronized from Payload CMS to ERPNext.

### Integration Layer
All cross-system integration calls flow through Temporal Cloud workflows for durable execution, retries, saga/compensation patterns, and observability. This includes a PostgreSQL-backed durable sync tracking, webhook endpoints with signature verification for Stripe, ERPNext, Fleetbase, and Payload CMS, and an outbox processor with circuit breakers and rate limiters. An auto-sync scheduler manages product sync, hierarchy reconciliation, and cleanup jobs, dispatching to Temporal.

### Authentication and API Usage
JWT-based authentication is used for the customer SDK. All tenant/governance/node API calls must use `sdk.client.fetch()` for automatic `VITE_MEDUSA_PUBLISHABLE_KEY` inclusion.

### Manage Page Infrastructure
The platform supports 42 CRUD configurations for various manage verticals, utilizing shared components like DataTable, Charts, Calendar, and FormWizard. Enhanced features include AnalyticsOverview, BulkActionsBar, and AdvancedFilters.

### System Responsibility Split
- **Medusa (Commerce Engine):** Products, orders, payments, commissions, marketplace listings, vendor management.
- **Payload CMS (Entity & Content Management):** Tenant profiles, POI content, vendor public profiles, pages, navigation.
- **Fleetbase (Geo & Logistics):** Geocoding, address validation, delivery zone management, tracking.
- **ERPNext (Finance, Accounting & ERP):** Sales invoices, payment entries, GL, inventory, procurement, reporting.
- **Temporal Cloud (Workflow Orchestration):** 80 system workflows, 21 task queues, dynamic AI agent workflows, event outbox.
- **Walt.id (Decentralized Digital Identity):** DID management, verifiable credentials, wallet integration.

## External Dependencies
- **Database:** PostgreSQL
- **Frontend Framework:** TanStack Start, React
- **Monorepo Management:** Turborepo, pnpm
- **API Gateway/Orchestration:** Medusa.js
- **Workflow Orchestration:** Temporal Cloud (`@temporalio/client`)
- **CMS:** Payload CMS (local registry stand-in with migration path)
- **ERP:** ERPNext
- **Logistics:** Fleetbase
- **Digital Identity:** Walt.id
- **Payment Gateway:** Stripe

## Implementation Progress
- Phase 1-12: Initial build-out (58 modules, 258 models, admin pages, storefront, tests, deep audit)
- Phase 13-16: Service enrichment (12 services), manage pages (23), API routes (15), test expansion (157 tests)
- Phase 17: Service enrichment round 2 — 21 more services enhanced with 3-5 business logic methods each
- Phase 18: Vendor dashboard — 10 vendor API routes + 10 vendor dashboard pages
- Phase 19: Test expansion round 2 — 12 new test files with 97 tests
- Phase 20: Vendor dashboard expansion — 10 vendor API routes + 10 vendor dashboard pages (classified, crowdfunding, education, healthcare, fitness, grocery, travel, warranty, advertising, charity)
- Phase 21: Vendor dashboard expansion — 10 more vendor API routes + 10 vendor dashboard pages (automotive, parking, pet-service, legal, government, social-commerce, affiliate, financial-product, insurance, b2b)
- Phase 22: Vendor route test coverage — 2 batch test files with 82 tests for 20 vendor API routes, all passing
- Phase 23: Customer-facing storefront pages — 20 new browsing/listing pages for verticals (classifieds, crowdfunding, freelance, real-estate, restaurants, automotive, parking, pet-services, legal, healthcare, fitness, education, charity, travel, insurance, financial, government, social-commerce, warranties, grocery)
- Phase 24: Store API route enhancement — 21 store routes enhanced with proper filtering, pagination, error handling; insurance store route created
- Phase 25: Store route test coverage — 2 batch test files with 60 tests for 20 store API routes, all passing
- Phase 26: Vendor dashboard expansion — 10 vendor API routes + 10 vendor dashboard pages (loyalty, wishlists, flash-sales, bundles, consignments, gift-cards, newsletter, notification-preferences, tax-config, shipping-extension)
- Phase 27: Vendor dashboard expansion — 10 more vendor API routes + 10 vendor dashboard pages (inventory-extension, volume-pricing, dropshipping, print-on-demand, white-label, try-before-you-buy, credit, wallet, trade-in, cart-extension)
- Phase 28: Customer storefront expansion — 8 new browsing pages (affiliate, loyalty-program, gift-cards-shop, flash-deals, consignment-shop, dropshipping-marketplace, print-on-demand-shop, white-label-shop) + 76 vendor route tests
- Phase 29: Contract fixes (wallet API/UI alignment, flash-sales route fix) + 7 more customer pages (trade-in, try-before-you-buy, b2b, credit, newsletter, volume-deals, wallet) + 5 new store API routes (trade-ins, newsletters, try-before-you-buy, b2b, dropshipping) + 24 store route tests + 40 integration layer tests (webhooks, outbox processor, temporal workflows)
- Phase 30: 20 detail/single-item view pages for all verticals (classifieds, automotive, real-estate, restaurants, freelance, healthcare, fitness, education, charity, travel, insurance, financial, government, social-commerce, parking, pet-services, legal, crowdfunding, grocery, warranties) + 3 admin components (BulkActionsBar, AnalyticsOverview, AdvancedFilters) + 3 vendor onboarding pages + 36 e2e lifecycle tests (order + vendor) + i18n translations for 14 verticals in en/fr/ar
- Phase 31: 16 more detail pages for newer verticals (affiliate, loyalty-program, gift-cards-shop, flash-deals, consignment-shop, dropshipping-marketplace, print-on-demand-shop, white-label-shop, trade-in, try-before-you-buy, b2b, credit, volume-deals, bundles, subscriptions, newsletter) + 13 admin manage pages (insurance, flash-sales, bundles, consignments, gift-cards, newsletters, dropshipping, print-on-demand, white-label, try-before-you-buy, credit, wallet, trade-in)
- Phase 32: 19 i18n verticals added (en/fr/ar, 97 keys per language) + 15 backend test files (179 new tests) + 5 detail page fixes (bookings, consignment, dropshipping, print-on-demand, white-label) + 4 admin manage pages (cms-content, company, inventory-extension, warranty) + 7 admin API routes (charity, cms-content, company, inventory-extension, promotion-ext, shipping-extension, warranty) + CRUD config deduplication. Score: 98% → 99%
- Phase 33: 6 vendor dashboard pages (analytics, cart-extension, inventory-extension, shipping-extension, transactions, home) + 1 store route (subscriptions) + vendor profile detail page + 5 storefront test files (68 tests) + LSP fixes. Score: 99%
- Phase 34: 5 vendor API routes (dispute, invoice, quote, review, event-ticketing) + 5 vendor dashboard pages + 8 i18n verticals (en/fr/ar: government, grocery, legal, parking, petService, financial, freelance, restaurant) + 10 module test files (115 tests) + 4 storefront test files (78 tests) + 4 utility modules (currency, date-utils, url-utils, filters)
- Phase 35: Enhanced all 15 sub-80% modules with 40+ new service methods + 7 new store API routes (analytics, promotions, channels, disputes, tax-config, audit, cart-extension) + 12 backend test files (232 tests) + 4 storefront test files (57 tests) + 4 storefront utility modules (cms-utils, tenant-utils, locale-utils, search-utils). All modules now score 80%+

### Test Coverage Architecture
- **Backend (Jest):** 123 test suites in `apps/backend/tests/unit/`
- **Storefront (Vitest):** 20 test suites
- Run backend: `cd apps/backend && TEST_TYPE=unit npx jest`
- Run storefront: `cd apps/storefront && npx vitest run`

## Platform Metrics
| Metric | Count |
|--------|-------|
| Custom Modules | 58 |
| Model Files | 258 |
| Migration Files | 61 |
| Admin API Routes | 207 |
| Store API Routes | 134 |
| Vendor API Routes | 66 |
| Admin/Manage Pages | 83 |
| Vendor Dashboard Pages | 73 |
| CRUD Configs | 82 |
| Admin Hooks | 52 |
| Workflows | 30 |
| Subscribers | 33 |
| Jobs | 17 |
| Storefront Routes | 322 |
| Storefront Components | 600+ |
| Backend Test Files | 123 |
| Storefront Test Files | 20 |
| Total Tests | 2,506+ |
| Total Source Files | 2,900+ |

## Documentation
- `docs/PLATFORM_MODULE_ASSESSMENT.md` — Deep-dive assessment of all 58 modules (v3.0), 3400+ lines
- `docs/IMPLEMENTATION_PLAN.md` — 6-phase implementation plan (v2.0)
- `docs/MODULE_GAP_ANALYSIS.md` — Per-module gap analysis across 4 layers for all 58 modules