# Medusa.js E-Commerce Monorepo — Dakkah CityOS Commerce Platform

## Overview
This project is a Medusa.js e-commerce monorepo for multi-tenancy and integration with the Dakkah CityOS CMS architecture. Dakkah is a comprehensive platform powering 25+ commerce verticals (shopping, dining, healthcare, education, real estate). It features a 5-level node hierarchy, a 10-role RBAC system, a 6-axis persona system, a 4-level governance chain, and localization for 3 locales (en/fr/ar with RTL support). The default tenant "Dakkah" (`01KGZ2JRYX607FWMMYQNQRKVWS`) is the primary super-app tenant with all seeded data.

## User Preferences
- Full alignment with CityOS CMS architecture required
- Centralized design system matching CMS pattern
- Port 5000 for frontend, 0.0.0.0 host
- Bypass host verification for Replit environment

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

**Tenant-Scoped Routing:** Supports home page, node hierarchy browser, dynamic CMS pages (`/$tenant/$locale/$slug`, `/$tenant/$locale/$...path`), and hardcoded commerce routes (`/store`, `/account`, `/cart`, `/checkout`, `/products/*`).

**CMS-Driven Routing and Templates:** Payload CMS is the primary content source. Pages are resolved by `path` with tenant and locale scoping. A `template` field on each CMS page dictates rendering (`landing`, `static`, `vertical-list`, `vertical-detail`, `home`, `category`, `node-browser`, `custom`). The `TemplateRenderer` component handles rendering. Hardcoded vertical routes will migrate to CMS-managed pages using `vertical-list` or `vertical-detail` templates.

**CMS Integration:** `useCMSPage`, `useCMSPageChildren`, `useCMSNavigation`, `useCMSVerticals` hooks provide React Query-powered data fetching from Payload CMS with tenant scoping and SSR safety. The backend exposes `/platform/cms/resolve` and `/platform/cms/navigation` endpoints that proxy to Payload CMS.

**Governance Integration:** `GovernanceProvider` fetches tenant-specific policies. The `useGovernanceContext()` hook provides `isVerticalAllowed()`, `isFeatureAllowed()`, and `getCommercePolicy()` for feature gating. CMS pages can have `governanceTags`.

### Key Design Decisions
- **Multi-tenant Isolation:** `tenantId` on all entities with node-scoped access.
- **RBAC:** 10 roles with node-scoped access.
- **Persona Precedence:** Hierarchical resolution from session to tenant-default.
- **Governance:** Deep merging of policies through an authority chain.
- **Residency Zones:** Data locality based on GCC/EU, MENA, APAC/AMERICAS/GLOBAL.
- **RTL Support:** Dedicated `dir="rtl"` and CSS overrides for Arabic.
- **Event Outbox:** CMS-compatible envelope format with correlation/causation IDs.
- **Vite Proxy:** Frontend uses a Vite proxy for seamless API communication.
- **SSR Architecture:** Route loaders return minimal/null data during SSR to prevent OOM errors, with client-side data fetching via React Query. ClientProviders use client-only boundaries.
- **Memory Management:** Backend limited to 512MB, storefront to 1024MB.
- **Authentication:** JWT-based authentication for customer SDK.
- **API Key Usage:** All tenant/governance/node API calls must use `sdk.client.fetch()` for automatic publishable API key inclusion (`VITE_MEDUSA_PUBLISHABLE_KEY`).
- **Tenant Resolution:** Default tenant "dakkah" (`01KGZ2JRYX607FWMMYQNQRKVWS`). Root `/` redirects to `/dakkah/en`. `DEFAULT_TENANT` fallback config and `TENANT_SLUG_TO_ID` maps are used for tenant ID resolution.

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

## External Dependencies
- **Database:** PostgreSQL
- **Frontend Framework:** TanStack Start, React
- **Monorepo Management:** Turborepo, pnpm
- **API Gateway/Orchestration:** Medusa.js
- **Workflow Orchestration:** Temporal Cloud (`@temporalio/client`)
- **CMS:** Payload CMS
- **ERP:** ERPNext
- **Logistics:** Fleetbase
- **Digital Identity:** Walt.id
- **Payment Gateway:** Stripe