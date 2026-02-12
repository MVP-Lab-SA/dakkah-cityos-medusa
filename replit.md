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
The project uses a Turborepo monorepo with:
- `apps/backend/`: Medusa.js v2 backend API.
- `apps/storefront/`: TanStack Start + React storefront.
- `packages/cityos-contracts/`: Shared TypeScript contracts.
- `packages/cityos-design-tokens/`: Design token definitions.
- `packages/cityos-design-runtime/`: Theme runtime and React providers.
- `packages/cityos-design-system/`: Component type system.

### Backend Features
The backend provides modularity for CityOS features including tenant management, a 5-level node hierarchy (CITY→DISTRICT→ZONE→FACILITY→ASSET), policy inheritance-based governance, a persona system, a CMS-compatible event outbox, and i18n. It supports multi-vendor marketplaces, subscriptions, B2B, bookings, promotions, and specialized services.

### Storefront Architecture
The storefront utilizes TanStack Start with React for SSR, dynamic routing, and file-based routing. A centralized design system dictates design primitives, theming, and component interfaces. A robust provider chain ensures consistent context, including tenant-scoped routes. It includes a comprehensive Payload CMS-compatible block system with 76 block type contracts and implementations. All UI uses design tokens and follows mobile-first responsive patterns.

### Internationalization and Localization
The system supports full logical CSS properties for RTL/LTR, with `dir="rtl"` for Arabic locales. i18n integration uses a `locale` prop for translations across 30+ namespaces in en/fr/ar JSON files.

### CMS Integration
A local CMS registry (`apps/backend/src/lib/platform/cms-registry.ts`), compatible with Payload CMS, defines 27 commerce verticals and additional pages. CMS pages support `countryCode` and `regionZone` for country-level unification. Backend endpoints provide Payload-compatible responses, and frontend hooks use React Query for data fetching.

### Key Design Decisions
- **Multi-tenant Isolation:** `tenantId` is used across all entities with node-scoped access.
- **RBAC:** 10 roles with node-scoped access.
- **Persona Precedence:** Hierarchical resolution from session to tenant-default.
- **Governance:** Deep merging of policies via an authority chain.
- **Residency Zones:** Data locality based on GCC/EU, MENA, APAC/AMERICAS/GLOBAL.
- **Country-Level CMS Scoping:** Pages scoped by `countryCode`/`regionZone` with a 4-step resolution chain.
- **Payload CMS API Compatibility:** Local registry designed for seamless migration to Payload CMS.
- **RTL Support:** Dedicated `dir="rtl"` and CSS overrides for Arabic.
- **Event Outbox:** CMS-compatible envelope format with correlation/causation IDs.
- **Vite Proxy:** Frontend uses a Vite proxy for API communication.
- **SSR Architecture:** Route loaders return minimal data during SSR, with client-side data fetching via React Query.
- **Authentication:** JWT-based authentication for customer SDK.
- **API Key Usage:** All tenant/governance/node API calls must use `sdk.client.fetch()` for automatic `VITE_MEDUSA_PUBLISHABLE_KEY` inclusion.
- **Tenant Resolution:** Default tenant "dakkah". Root `/` redirects to `/dakkah/en`.
- **Route Consolidation:** CMS-eligible routes are consolidated into catch-all routes.
- **Platform Context API:** Exposed at `/platform/*` (no authentication required) for `tenant`, `nodeHierarchy`, `governanceChain`, `capabilities`, and `systems`.

### Temporal-First Integration Architecture
All cross-system integration calls flow through Temporal Cloud workflows for durable execution, retries, saga/compensation patterns, and observability, avoiding direct API calls to external systems. This includes an event dispatcher and dynamic AI agent workflows.

### Integration Layer
- **Durable Sync Tracking:** PostgreSQL-backed sync state (`apps/backend/src/lib/platform/sync-tracker.ts`)
- **Webhook Endpoints:** `/webhooks/stripe`, `/webhooks/erpnext`, `/webhooks/fleetbase`, `/webhooks/payload-cms` with signature verification. Payload CMS webhook supports 13 collections.
- **Outbox Processor:** Circuit breakers and rate limiters per external system (`apps/backend/src/lib/platform/outbox-processor.ts`)
- **Health Check:** `/health` endpoint reports database, external systems, circuit breaker states, Temporal status
- **Auto-Sync Scheduler:** Starts on backend boot via `sync-scheduler-init` job. Schedules: product sync (hourly), retry failed (30min), hierarchy reconciliation (6hr), cleanup (daily). Dispatches to Temporal.
- **CMS Hierarchy Sync Engine:** (`apps/backend/src/integrations/cms-hierarchy-sync/engine.ts`) Syncs 8 collections from Payload CMS → ERPNext in dependency order: Countries → Governance Authorities → Scopes → Categories → Subcategories → Tenants → Stores → Portals. Full create-or-update with `custom_cms_ref_id` matching and DurableSyncTracker integration.
- **Payload CMS Polling:** `payload-cms-poll` job runs every 15 minutes using CMSHierarchySyncEngine for ordered hierarchy sync.
- **Payload CMS Webhooks:** Real-time sync for all 13 collections (tenants, stores, scopes, categories, subcategories, portals, governance-authorities, policies, personas, persona-assignments, countries, compliance-records, nodes).
- **Manual CMS Sync:** POST `/admin/integrations/sync/cms` triggers on-demand sync for all or specific collections. GET returns config status.
- **Environment Variable Convention:** External service URLs use `_DEV` suffix: `PAYLOAD_CMS_URL_DEV`, `ERPNEXT_URL_DEV`, `FLEETBASE_URL_DEV`, `WALTID_URL_DEV`

### Storefront Feature Components
Key components include Wishlist, Comparison, Search, Notifications, Disputes, Tracking, Loyalty, a comprehensive Checkout process, and an Account Dashboard with various sub-features.

### Manage Page Infrastructure
- **42 CRUD Configs:** For all manage verticals with vertical-specific form fields.
- **Shared Components:** DataTable, Charts, Calendar, Map, RichTextEditor, FileUpload, FormWizard.
- **Enhanced Features:** AnalyticsOverview, BulkActionsBar, AdvancedFilters, StatusWorkflow, ManagePageWrapper.

### System Responsibility Split
- **Medusa (Commerce Engine):** Products, orders, payments, commissions, marketplace listings, vendor registration, KYC, payouts, tenant/marketplace/service channel management.
- **Payload CMS (Entity & Content Management):** Tenant profiles, POI content, vendor public profiles, pages, navigation, service channel display content.
- **Fleetbase (Geo & Logistics):** Geocoding, address validation, delivery zone management, service area coverage, fleet management, routing, real-time tracking.
- **ERPNext (Finance, Accounting & ERP):** Sales invoices, payment entries, GL, inventory, procurement, customer/product sync, reporting. Multi-tenant support.
- **Temporal Cloud (Workflow Orchestration):** 80 system workflows across 35 categories, 21 specialized task queues, dynamic AI agent workflows, event outbox integration.
- **Walt.id (Decentralized Digital Identity):** DID management, 6 credential types, W3C Verifiable Credentials, wallet integration, trust registries.

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