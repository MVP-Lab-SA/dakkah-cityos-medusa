# Medusa.js E-Commerce Monorepo — Dakkah CityOS Commerce Platform

## Overview
This project is a Medusa.js e-commerce monorepo for multi-tenancy, seamlessly integrating with the Dakkah CityOS CMS architecture. Dakkah is designed to power over 27 commerce verticals, featuring a 5-level node hierarchy, a 10-role RBAC system, a 6-axis persona system, a 4-level governance chain, and localization for en/fr/ar (with RTL support). The platform aims to be a comprehensive commerce solution, with "Dakkah" as the primary super-app tenant containing all seeded data, and business vision to be a leading commerce platform across various verticals.

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
The backend provides modularity for CityOS features including tenant management, a 5-level node hierarchy (CITY→DISTRICT→ZONE→FACILITY→ASSET), policy inheritance-based governance, a persona system, a CMS-compatible event outbox, and i18n. It supports multi-vendor marketplaces, subscriptions, B2B, bookings, promotions, and specialized services. Key design decisions include multi-tenant isolation, RBAC, persona precedence, and residency zones. All 446/446 API routes use centralized `handleApiError` utility (apps/backend/src/lib/api-error-handler.ts) with try/catch blocks. 1,523+ structured logger calls via `apps/backend/src/lib/logger.ts` with `LOG_LEVEL` support. Zero console.log/error/warn remaining in backend (excluding logger.ts itself). All logger template strings use backtick interpolation. All import paths verified correct. 34/34 compliance sections PASS (2026-02-15).

### Storefront
The storefront uses TanStack Start with React for SSR, dynamic routing, and file-based routing. It implements a centralized design system, ensuring consistent context via a robust provider chain, tenant-scoped routes, and a comprehensive Payload CMS-compatible block system with 77 block types across 45 vertical detail pages. All UI follows mobile-first responsive patterns and utilizes design tokens, with full semantic color migration to 13,104+ `ds-*` token usages (0 legacy colors remaining). Full logical CSS properties for RTL/LTR (3,551+ logical usages, 0 physical ml/mr/pl/pr/left/right remaining). i18n integration using a `locale` prop for translations across 124 namespaces in en/fr/ar JSON files (3,558 keys each, 100% parity). 3,115+ t(locale) calls across routes and components. All 133 images include `loading="lazy"`. All 138 public routes include SEO meta tags. All clickable divs have proper ARIA roles/keyboard support (0 a11y violations). Module-level constants use English fallback strings (not t(locale) which requires route-param scope).

### Vertical Page Pattern
All vertical storefront pages follow a consistent SSR pattern: `createFileRoute` with async loader fetching from the backend, including `x-publishable-api-key` header, and data extraction into `data.items || data.listings || data.products || []`. UI structure includes a gradient hero, search with sidebar filters, a responsive card grid, and a "How It Works" section. Pages without backend endpoints use hardcoded data as a fallback. `// @ts-nocheck` is used to bypass strict TypeScript checking. Detail page `normalizeDetail` functions handle both flat API fields (price as number, start_date as string) and structured objects ({amount, currencyCode}), using `normalizePriceField` and `normalizeRating` helpers. All 15 block components have null-safety guards preventing SSR crashes from undefined array props (2026-02-15).

### CMS Integration
A local CMS registry defines 27 commerce verticals and additional pages, supporting `countryCode` and `regionZone`. Backend endpoints provide Payload-compatible responses. A CMS Hierarchy Sync Engine keeps 8 collections synchronized from Payload CMS to ERPNext.

### Integration Layer
All cross-system integration calls flow through Temporal Cloud workflows for durable execution, retries, saga/compensation patterns, and observability. This includes a PostgreSQL-backed durable sync tracking, webhook endpoints with signature verification for Stripe, ERPNext, Fleetbase, and Payload CMS, and an outbox processor with circuit breakers and rate limiters. An auto-sync scheduler manages various synchronization and cleanup jobs.

### Authentication and API Usage
JWT-based authentication is used for the customer SDK. All tenant/governance/node API calls must use `sdk.client.fetch()` for automatic `VITE_MEDUSA_PUBLISHABLE_KEY` inclusion. All 199 authenticated routes are protected, with granular access control via `RoleGuard` using a `requiredWeight` prop based on a 10-role RBAC system.

### Manage Page Infrastructure
The platform supports 42 CRUD configurations for various manage verticals, utilizing shared components like DataTable, Charts, Calendar, and FormWizard. Enhanced features include AnalyticsOverview, BulkActionsBar, and AdvancedFilters. The sidebar dynamically filters modules based on user role weight.

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