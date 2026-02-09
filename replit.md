# Medusa.js E-Commerce Monorepo — Dakkah CityOS Commerce Platform

## Overview
This project is a Medusa.js e-commerce monorepo for multi-tenancy and integration with the Dakkah CityOS CMS architecture. Dakkah is a comprehensive platform powering 27+ commerce verticals (shopping, dining, healthcare, education, real estate, automotive, travel, fitness, legal, financial, government services, etc.). It features a 5-level node hierarchy, a 10-role RBAC system, a 6-axis persona system, a 4-level governance chain, and localization for 3 locales (en/fr/ar with RTL support). The default tenant "Dakkah" (`01KGZ2JRYX607FWMMYQNQRKVWS`) is the primary super-app tenant with all seeded data.

## User Preferences
- Full alignment with CityOS CMS architecture required
- Centralized design system matching CMS pattern
- Port 5000 for frontend, 0.0.0.0 host
- Bypass host verification for Replit environment
- Country-level record unification for CMS pages
- Payload CMS API compatibility for future migration

## System Architecture

### Structure
The project is a Turborepo monorepo:
- `apps/backend/`: Medusa.js v2 backend API (port 9000).
- `apps/storefront/`: TanStack Start + React storefront (port 5000).
- `packages/cityos-contracts/`: Shared TypeScript contracts.
- `packages/cityos-design-tokens/`: Design token definitions.
- `packages/cityos-design-runtime/`: Theme runtime and React providers.
- `packages/cityos-design-system/`: Component type system.

### Backend Modules and Features
The backend provides modularity for CityOS features like tenant management, node hierarchy (CITY→DISTRICT→ZONE→FACILITY→ASSET), governance with policy inheritance, a persona system, CMS-compatible event outbox, and i18n. It supports multi-vendor marketplaces, subscriptions, B2B, bookings, promotions, and specialized services. API routes handle tenant, node, persona, and governance resolution using `NodeContext` middleware.

### Storefront Architecture
The storefront uses dynamic routing (`/$tenant/$locale/...`) with TanStack Router for file-based routing and Server-Side Rendering (SSR). A centralized design system defines design primitives, theming, and component interfaces. The provider chain (`ClientProviders` → `QueryClientProvider` → `StoreProvider` → `AuthProvider` → `BrandingProvider` → `GovernanceProvider` → `ToastProvider`) ensures consistent context availability. Tenant-scoped routes (`/$tenant/$locale/`) wrap children with `TenantProvider` and `PlatformContextProvider`.

**Tenant-Scoped Routing:** Two dynamic catch-all routes handle all CMS-driven pages (`/$tenant/$locale/$slug` for single-segment, `/$tenant/$locale/$...path` for multi-segment). Transactional routes (cart, checkout, account/*, bookings/*, vendor/*, b2b/*, quotes/*, subscriptions/*) remain as dedicated route files.

**CMS-Driven Routing and Templates:** A local CMS registry (`apps/backend/src/lib/platform/cms-registry.ts`) with Payload CMS-compatible data model serves as a drop-in stand-in for Payload CMS. The registry defines 27 commerce verticals (54 page entries for list + detail), plus 5 additional pages (home, store, search, vendors, categories). All pages use Payload CMS document shape (`id`, `createdAt`, `updatedAt`, `_status`). The `TemplateRenderer` component switches on `page.template` (`vertical-list`, `vertical-detail`, `landing`, `static`, `category`, `node-browser`, `custom`) to render the appropriate layout.

**Country/Region Scope Model:** CMS pages have `countryCode` (ISO code or "global") and `regionZone` (GCC_EU, MENA, APAC, AMERICAS, GLOBAL) fields for country-level unification. Pages also support optional `nodeId` and `nodeLevel` for node hierarchy integration. Resolution chain: exact country match → region zone match → global fallback → wildcard detail page matching.

**Payload CMS Collection Endpoints (Local Registry):**
- `GET /platform/cms/pages` - Payload-compatible collection query with where/limit/sort/page params. Returns `{ docs, totalDocs, limit, page, totalPages, hasNextPage, hasPrevPage, pagingCounter }`.
- `GET /platform/cms/navigations` - Navigation collection with Payload response shape.
- `GET /platform/cms/verticals` - Vertical template catalog with Payload response shape.
- `GET /platform/cms/resolve` - Single-page resolution with `countryCode` support. Returns both legacy `{ success, data: { page } }` and Payload-compatible `payload: { docs: [...] }` shapes.
- `GET /platform/cms/navigation` - Navigation resolution with both legacy and Payload response shapes.

**CMS Integration:** `useCMSPage`, `useCMSPageChildren`, `useCMSNavigation`, `useCMSVerticals` hooks provide React Query-powered data fetching. All hooks now consume from local Payload-compatible endpoints (`/platform/cms/pages`, `/platform/cms/verticals`) instead of direct Payload CMS access. Response extraction prefers Payload shape (`docs` array) with fallback to legacy shape.

**Governance Integration:** `GovernanceProvider` fetches tenant-specific policies. The `useGovernanceContext()` hook provides `isVerticalAllowed()`, `isFeatureAllowed()`, and `getCommercePolicy()` for feature gating. CMS pages can have `governanceTags`.

### Key Design Decisions
- **Multi-tenant Isolation:** `tenantId` on all entities with node-scoped access.
- **RBAC:** 10 roles with node-scoped access.
- **Persona Precedence:** Hierarchical resolution from session to tenant-default.
- **Governance:** Deep merging of policies through an authority chain.
- **Residency Zones:** Data locality based on GCC/EU, MENA, APAC/AMERICAS/GLOBAL.
- **Country-Level CMS Scoping:** Pages scoped by countryCode/regionZone with 4-step resolution chain.
- **Payload CMS API Compatibility:** Local registry returns Payload-shaped responses for seamless migration to real Payload CMS.
- **RTL Support:** Dedicated `dir="rtl"` and CSS overrides for Arabic.
- **Event Outbox:** CMS-compatible envelope format with correlation/causation IDs.
- **Vite Proxy:** Frontend uses a Vite proxy for seamless API communication.
- **SSR Architecture:** Route loaders return minimal/null data during SSR to prevent OOM errors, with client-side data fetching via React Query. ClientProviders use client-only boundaries.
- **Memory Management:** Backend limited to 512MB, storefront to 1024MB.
- **Authentication:** JWT-based authentication for customer SDK.
- **API Key Usage:** All tenant/governance/node API calls must use `sdk.client.fetch()` for automatic publishable API key inclusion (`VITE_MEDUSA_PUBLISHABLE_KEY`).
- **Tenant Resolution:** Default tenant "dakkah" (`01KGZ2JRYX607FWMMYQNQRKVWS`). Root `/` redirects to `/dakkah/en`. `DEFAULT_TENANT` fallback config and `TENANT_SLUG_TO_ID` maps are used for tenant ID resolution.
- **Route Consolidation:** CMS-eligible routes (store, search, vendors, categories, nodes) consolidated into catch-all routes. Only transactional/authenticated routes (cart, checkout, account, bookings, vendor dashboard, B2B, quotes, subscriptions) remain as dedicated files.

### Payload CMS Migration Path
The local CMS registry is designed as a drop-in stand-in for Payload CMS:
1. **Current State:** Local registry in `cms-registry.ts` serves all CMS data through Payload-compatible endpoints.
2. **Migration Step 1:** Deploy Payload CMS instance with matching collection schemas (pages, navigations, verticals).
3. **Migration Step 2:** Set `PAYLOAD_CMS_URL` and `PAYLOAD_API_KEY` environment variables. The resolve/navigation endpoints already fall back to Payload CMS when local registry has no match.
4. **Migration Step 3:** Import registry data into Payload CMS collections. Frontend hooks already consume Payload response shapes.
5. **Migration Step 4:** Remove local registry fallback logic once Payload CMS has all data.
6. **Future:** Replace storefront with Next.js + Payload CMS frontend, keeping Medusa as remote commerce backend.

### Platform Context API
The backend exposes a unified Platform Context API at `/platform/*` (no authentication required) for full context resolution:
- `GET /platform/context?tenant=<slug>`: Returns `tenant`, `nodeHierarchy`, `governanceChain`, `capabilities`, `systems` (22 registered), `contextHeaders`, `hierarchyLevels`.
- `GET /platform/tenants/default`: Returns Dakkah default tenant.
- `GET /platform/capabilities`: Returns plugin capabilities and available endpoints.
Context propagation headers (`X-CityOS-Correlation-Id`, `X-CityOS-Tenant-Id`, etc.) are parsed by `platformContextMiddleware`.

### Temporal Integration Bridge
The Medusa backend integrates with Temporal Cloud for workflow orchestration, including a lazy-initialized client, an event dispatcher mapping Medusa events to Temporal workflows, and a dynamic workflow client for AI agent workflows. Admin API routes for health checks and workflow management are provided.

### Cross-System Integration Layer
This layer orchestrates integration with CityOS ecosystem components:
- **Integration Services:** Bi-directional sync with Payload CMS, ERPNext (invoices, customer/product sync), Fleetbase (shipment management), Walt.id (digital identity), and Stripe (payments). A Node Hierarchy Sync service propagates the 5-level hierarchy.
- **Integration Orchestrator:** Manages sync operations, external system registry, and coordinates syncs, retries, and health checks.
- **Webhook Receivers:** Handles inbound webhooks with signature verification.
- **Admin Integration APIs:** Provides dashboards, health checks, manual triggers, and logs.
- **Scheduled Jobs:** Automates regular syncs.
- **Integration Event Subscriber:** Triggers cross-system syncs based on Medusa events.

### Database Seeding and Testing
Seed scripts provide minimal and complete data seeding, including an admin user, store, products, customers, vendors, tenant, and the 5-level node hierarchy. `db-verify.ts` ensures database integrity. Backend tests use Jest; storefront tests use Vitest.

## Recent Changes (2026-02-09)
- **CMS Registry Restructure:** Added `PayloadPage` interface with Payload CMS standard fields, country/region scope model, vertical templates catalog, and 4-step resolution chain.
- **Payload CMS Collection Endpoints:** Created `/platform/cms/pages`, `/platform/cms/navigations`, `/platform/cms/verticals` with standard Payload response shape. Updated `/resolve` and `/navigation` to return Payload-compatible responses alongside legacy shape.
- **Route Consolidation:** Removed 9 CMS-eligible route files (stores, store, search, nodes, categories/*, vendors/*). These are now handled by catch-all routes resolving from CMS registry.
- **Frontend Hook Updates:** All CMS hooks now consume from local Payload-compatible endpoints instead of direct Payload CMS access.
- **Country-to-Region Mapping:** Hardcoded mapping for 26 countries across GCC_EU, MENA, APAC, AMERICAS zones.

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
