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
The project uses a Turborepo monorepo with dedicated packages for the Medusa.js v2 backend API, a TanStack Start + React storefront, shared TypeScript contracts, design token definitions, theme runtime/React providers, and a component type system.

### Backend
The backend provides modularity for CityOS features including tenant management, a 5-level node hierarchy (CITY→DISTRICT→ZONE→FACILITY→ASSET), policy inheritance-based governance, a persona system, a CMS-compatible event outbox, and i18n. It supports multi-vendor marketplaces, subscriptions, B2B, bookings, promotions, and specialized services. Key design decisions include multi-tenant isolation, RBAC, persona precedence, and residency zones.

### Storefront
The storefront uses TanStack Start with React for SSR, dynamic routing, and file-based routing. It implements a centralized design system, ensuring consistent context via a robust provider chain, tenant-scoped routes, and a comprehensive Payload CMS-compatible block system with 76 block types. All UI follows mobile-first responsive patterns and utilizes design tokens. The system supports full logical CSS properties for RTL/LTR, with `dir="rtl"` for Arabic locales, and i18n integration using a `locale` prop for translations across 30+ namespaces in en/fr/ar JSON files.

### Vertical Page Pattern (53+ pages)
All vertical storefront pages follow a consistent SSR pattern established by the bookings page:
- **SSR Loader**: `createFileRoute` with async loader fetching from `http://localhost:9000` (server) or relative URL (client)
- **API Key**: All requests include `x-publishable-api-key` header
- **Data Extraction**: `data.items || data.listings || data.products || []` with metadata JSON parsing for images, ratings, prices
- **UI Structure**: Gradient hero (unique colors per vertical) → Search + sidebar filters → Responsive card grid → "How It Works" section
- **Fallback Data**: Pages without backend endpoints use hardcoded data in loader (blog, campaigns, government, loyalty, etc.)
- **Image Sources**: Unsplash URLs stored in `metadata.images` array and `metadata.thumbnail` field
- **Files start with**: `// @ts-nocheck` to bypass strict TypeScript checking

### CMS Integration
A local CMS registry defines 27 commerce verticals and additional pages, supporting `countryCode` and `regionZone` for country-level unification. Backend endpoints provide Payload-compatible responses, and frontend hooks use React Query. The local registry is designed for seamless migration to Payload CMS. A CMS Hierarchy Sync Engine keeps 8 collections synchronized from Payload CMS to ERPNext.

### Integration Layer
All cross-system integration calls flow through Temporal Cloud workflows for durable execution, retries, saga/compensation patterns, and observability. This includes a PostgreSQL-backed durable sync tracking, webhook endpoints with signature verification for Stripe, ERPNext, Fleetbase, and Payload CMS, and an outbox processor with circuit breakers and rate limiters. An auto-sync scheduler manages product sync, hierarchy reconciliation, and cleanup jobs, dispatching to Temporal.

### Authentication and API Usage
JWT-based authentication is used for the customer SDK. All tenant/governance/node API calls must use `sdk.client.fetch()` for automatic `VITE_MEDUSA_PUBLISHABLE_KEY` inclusion.

### Manage Page Infrastructure
The platform supports 42 CRUD configurations for various manage verticals, utilizing shared components like DataTable, Charts, Calendar, and FormWizard. Enhanced features include AnalyticsOverview, BulkActionsBar, and AdvancedFilters.

### RBAC & Navigation Architecture
- **10 roles** with weights: super-admin(100), city-manager(90), district-manager(80), zone-manager(70), facility-manager(60), asset-manager(50), vendor-admin(40), content-editor(30), analyst(20), viewer(10)
- **MIN_MANAGE_WEIGHT**: 20 (allows analyst+ to access manage area)
- **Per-route weight**: RoleGuard accepts `requiredWeight` prop for granular access control
- **Module registry**: 9 nav sections (overview, commerce, marketplace, verticals, marketing, cms, organization, platform, system) with ~75 modules
- **CMS section**: minWeight 30 (content-editors can access page builder, content, media)
- **Platform section**: minWeight 90 (super-admin/city-manager only: tenants, governance, webhooks, integrations)
- **Sidebar**: Uses `useManageRole()` for dynamic weight-based module filtering (no longer hardcoded)
- **Design tokens**: role-guard and sidebar use ds-* token classes (not raw gray/violet)

## Recent Changes (Feb 2026)
- **Phase 0 Complete**: Fixed auctions bid query (auction_listing_id→auction_id), financial routing (/financial→/financial-products), vendors data extraction. Created 19 new backend detail endpoints. Added social-commerce seed data fallback.
- **Phase 1 Complete**: RBAC weight lowered to 20, requiredWeight prop added, module registry expanded with CMS/Platform sections and 28 missing modules, sidebar uses actual user role weight, design token migration for role-guard and sidebar.

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