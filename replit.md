# Medusa.js E-Commerce Monorepo — Dakkah CityOS Commerce Platform

## Overview
This project is a Medusa.js e-commerce monorepo designed for multi-tenancy and integration with the Dakkah CityOS CMS architecture. Dakkah is the super app for all city and lifestyle services — not just a smart city store, but a comprehensive platform powering 25+ commerce verticals from shopping and dining to healthcare, education, real estate, and beyond. Key features include a 5-level node hierarchy, a 10-role RBAC system, a 6-axis persona system, and a 4-level governance chain, alongside localization for 3 locales (en/fr/ar with RTL support). The default tenant "Dakkah" (ID: `01KGZ2JRYX607FWMMYQNQRKVWS`) is the primary super-app tenant with ALL seeded data linked to it — all products across all sales channels (Default, Web Store, Mobile App), all vendors, all customers (via citizen_profile), all nodes, personas, governance authorities, and subscriptions.

## User Preferences
- Full alignment with CityOS CMS architecture required
- Centralized design system matching CMS pattern
- Port 5000 for frontend, 0.0.0.0 host
- Bypass host verification for Replit environment

## System Architecture

### Structure
The project is organized as a Turborepo monorepo:
- `apps/backend/`: Medusa.js v2 backend API (port 9000).
- `apps/storefront/`: TanStack Start + React storefront (port 5000).
- `packages/cityos-contracts/`: Shared TypeScript contracts.
- `packages/cityos-design-tokens/`: Design token definitions.
- `packages/cityos-design-runtime/`: Theme runtime and React providers.
- `packages/cityos-design-system/`: Component type system.

### Backend Modules and Features
The backend provides extensive modularity for core CityOS features such as tenant management, node hierarchy (CITY→DISTRICT→ZONE→FACILITY→ASSET), governance with policy inheritance, persona system, CMS-compatible event outbox, and i18n. It also supports a wide range of commerce verticals including multi-vendor marketplaces, subscriptions, B2B company management, bookings, promotions, and specialized services for industries like healthcare, education, and real estate. API routes include dedicated resolution for tenant, node, persona, and governance, utilizing `NodeContext` middleware.

### Storefront Architecture
The storefront uses a dynamic routing pattern `/$tenant/$locale/...` with TanStack Router for file-based routing and Server-Side Rendering (SSR). A centralized design system, implemented through several packages, defines design primitives, theming infrastructure, and component interfaces.

**Provider Chain:** `ClientProviders` (root) wraps `QueryClientProvider` → `StoreProvider` → `AuthProvider` → `BrandingProvider` → `GovernanceProvider` → `ToastProvider`. The `$tenant.$locale` layout wraps children with `TenantProvider` → `PlatformContextProvider` so governance, tenant, and platform context are available to all tenant-scoped pages.

**Tenant-Scoped Routing:**
- `/$tenant/$locale/` — Home page with governance-filtered verticals
- `/$tenant/$locale/nodes` — Interactive 5-level node hierarchy browser (CITY→DISTRICT→ZONE→FACILITY→ASSET)
- `/$tenant/$locale/$slug` — Dynamic CMS pages from Payload, filtered by resolved tenant ID
- `/$tenant/$locale/store`, `/account`, `/bookings`, etc. — Feature pages

**Governance Integration:** `GovernanceProvider` fetches tenant-specific policies via `/store/cityos/governance?tenant_id=X`. The `useGovernanceContext()` hook provides `isVerticalAllowed()`, `isFeatureAllowed()`, and `getCommercePolicy()` for feature gating. SSR-safe via `typeof window` guard.

**Payload CMS Alignment:** The `$slug` route resolves tenant slug → tenant ID before calling `getPayloadPage(slug, tenantId)` for tenant-scoped page filtering. Governance policies sync to Payload via `syncGovernancePolicies()`. Node hierarchy syncs to Payload via `syncNodeToPayload()`.

### Key Design Decisions
- **Multi-tenant Isolation:** `tenantId` on all entities with node-scoped access.
- **RBAC:** 10 roles with node-scoped access.
- **Persona Precedence:** Hierarchical resolution from session to tenant-default.
- **Governance:** Deep merging of policies through an authority chain.
- **Residency Zones:** Data locality and cross-border data handling based on GCC/EU, MENA, APAC/AMERICAS/GLOBAL.
- **RTL Support:** Dedicated `dir="rtl"` and CSS overrides for Arabic locale.
- **Event Outbox:** CMS-compatible envelope format with correlation/causation IDs.
- **Vite Proxy:** Frontend uses a Vite proxy for seamless API communication.
- **SSR Architecture:** Route loaders skip API calls during SSR (`typeof window === "undefined"` guard) to prevent OOM crashes. Data fetching happens client-side via React Query. ClientProviders use client-only boundaries to prevent React instance duplication. Hydration mismatch warnings are expected and handled by React's client-side re-rendering fallback. Hooks like `useTenant()` cannot be used in route components during SSR due to dual React instance issue — use loader-based approaches with slug-to-ID mappings instead.
- **Memory Management:** Backend limited to 512MB (`NODE_OPTIONS=--max-old-space-size=512`), storefront to 1024MB. SSR loaders return minimal/null data to avoid memory-intensive API calls during server rendering.
- **Authentication:** Switched to JWT-based authentication for customer SDK to avoid session issues in the Replit environment.
- **API Key Usage:** All tenant/governance/node API calls must use `sdk.client.fetch()` (not raw `fetch()`) to automatically include the publishable API key header. Publishable key is stored in `VITE_MEDUSA_PUBLISHABLE_KEY` env var.
- **Tenant Resolution:** Default tenant is "dakkah" (ID: `01KGZ2JRYX607FWMMYQNQRKVWS`). Root `/` redirects to `/dakkah/en`. The `$tenant.$locale` layout provides `DEFAULT_TENANT` fallback config during SSR and when API calls fail. Routes that need tenant ID during SSR use `TENANT_SLUG_TO_ID` maps with `DEFAULT_TENANT_ID` fallback constant.
- **Node Hierarchy:** The `NodeHierarchy` component fetches root nodes independently via React Query (client-side) using `queryKeys.nodes.root(tenantId)`, rather than relying on SSR loader data which is always empty.

### Platform Context API
The backend exposes a unified Platform Context API at `/platform/*` (outside `/store/*` to avoid publishable API key requirement). These endpoints require no authentication and provide full context resolution for any tenant.

**Endpoints:**
- `GET /platform/context?tenant=<slug>` — Full context resolution returning `tenant`, `nodeHierarchy`, `governanceChain`, `capabilities`, `systems` (22 registered), `contextHeaders`, `hierarchyLevels`, `resolvedAt`, `isDefaultTenant`. Falls back to Dakkah tenant if requested tenant not found. Cache: `max-age=60, s-maxage=300`.
- `GET /platform/tenants/default` — Always returns Dakkah default tenant with `usage` instructions and bootstrap URL. Cache: `max-age=300, s-maxage=600`.
- `GET /platform/capabilities` — Returns plugin capabilities, enabled features, and available endpoint map.

**Context Propagation Headers:** All cross-system calls should include: `X-CityOS-Correlation-Id`, `X-CityOS-Tenant-Id`, `X-CityOS-Node-Id`, `X-CityOS-Node-Type`, `X-CityOS-Locale`, `X-CityOS-User-Id`, `X-CityOS-Channel`, `X-Idempotency-Key`. The `platformContextMiddleware` parses these headers and attaches them to `req.platformContext`.

**22 Registered Systems:** cms-payload, cms-bff, commerce-medusa, identity-auth, payments-stripe, analytics-internal, communication-email, communication-sms, infra-database, infra-cache, infra-storage, observability-health, observability-metrics, search-elasticsearch, geo-mapping, ai-recommendations, logistics-delivery, iot-platform, social-platform, workflow-temporal, erp-erpnext, logistics-fleetbase.

**Implementation Files:**
- Registry & Helpers: `apps/backend/src/lib/platform/{registry,helpers,index}.ts`
- API Routes: `apps/backend/src/api/platform/{context,capabilities}/route.ts`, `apps/backend/src/api/platform/tenants/default/route.ts`
- Middleware: `apps/backend/src/api/middlewares/platform-context.ts`
- Storefront: `apps/storefront/src/lib/context/platform-context.tsx`, `apps/storefront/src/lib/hooks/use-platform-context.ts`
- Vite Proxy: `/platform` → `http://localhost:9000` added in `apps/storefront/vite.config.ts`

**Storefront Integration:** `PlatformContextProvider` wraps tenant-scoped routes in the `$tenant.$locale` layout, consuming `/platform/context?tenant=<slug>` via `usePlatformContext()` hook. Provides `usePlatformContextValue()` for accessing unified platform data including node hierarchy, governance chain, capabilities, and systems registry. Uses plain `fetch()` (not `sdk.client.fetch()`) since platform routes don't require publishable API key.

### Temporal Integration Bridge
The Medusa backend integrates with Temporal Cloud for workflow orchestration. This includes a lazy-initialized Temporal client, an event dispatcher mapping Medusa events to Temporal workflows, and a dynamic workflow client supporting AI agent workflows. Admin API routes are available for health checks, workflow listing, and manual triggers. Temporal task queues are used for both static event-driven and dynamic AI agent workflows.

### Cross-System Integration Layer
A comprehensive integration orchestration layer connects Medusa with the CityOS ecosystem components:
- **Integration Services:** Bi-directional sync with Payload CMS, invoice creation and customer/product sync with ERPNext, shipment management with Fleetbase, digital identity and verifiable credentials with Walt.id, and payment processing with Stripe. A Node Hierarchy Sync service propagates the 5-level hierarchy to all external systems.
- **Integration Orchestrator:** Manages sync operations, includes a registry for external systems, and coordinates syncs, retries, and health checks.
- **Webhook Receivers:** Securely handles inbound webhooks from Payload CMS, ERPNext, Fleetbase, and Stripe with signature verification.
- **Admin Integration APIs:** Provides dashboards, health checks, manual sync triggers, and sync logs.
- **Scheduled Jobs:** Automates regular sync tasks and data reconciliation.
- **Integration Event Subscriber:** Triggers cross-system syncs based on Medusa events.

### Cross-System Architecture
The project integrates Medusa.js with ERPNext, Fleetbase, Walt.id, Stripe, and PayloadCMS, orchestrated by Temporal Workflows (505+ definitions). This creates a comprehensive data model across all integrated systems.

### Database Seeding
Seed scripts are provided for minimal and complete data seeding, including an admin user, store, regions, sales channels, products, customers, vendors, tenant, and the 5-level node hierarchy. A `db-verify.ts` script ensures database integrity and cleans up duplicates. Comprehensive seeding includes data for all vertical modules and CityOS tenant infrastructure, respecting enum constraints and ID prefixes for traceability.

### Test Infrastructure
- **Backend Tests:** Jest with @swc/jest (target: es2022). Unit test files are in `apps/backend/tests/unit/` (moved out of `src/` to prevent Medusa auto-loading). Run with `TEST_TYPE=unit npx jest`. 88 tests covering governance service, event dispatcher, API routes, subscribers, and Payload sync.
- **Storefront Tests:** Vitest with jsdom environment. Config excludes `**/e2e/**` directories. 16 tests covering governance context logic. Run with `npx vitest run`.

## External Dependencies
- **Database:** PostgreSQL.
- **Frontend Framework:** TanStack Start, React.
- **Monorepo Management:** Turborepo, pnpm.
- **API Gateway/Orchestration:** Medusa.js.
- **Workflow Orchestration:** Temporal Cloud (`@temporalio/client`).
- **Design System Tools:** Vite.
- **Security & Utilities:** `lodash.set-safe`.
- **Payment Gateway:** Stripe.
- **CMS:** Payload CMS.
- **ERP:** ERPNext.
- **Logistics:** Fleetbase.
- **Digital Identity:** Walt.id.