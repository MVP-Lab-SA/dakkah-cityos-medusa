# Medusa.js E-Commerce Monorepo — Dakkah CityOS Commerce Platform

## Overview
This project is a Medusa.js e-commerce monorepo designed for multi-tenancy and integration with the Dakkah CityOS CMS architecture. It provides a robust and flexible commerce platform supporting diverse business models, including specialized verticals like healthcare and real estate, within a unified CityOS ecosystem. Key features include a 5-level node hierarchy, a 10-role RBAC system, a 6-axis persona system, and a 4-level governance chain, alongside localization for 3 locales (en/fr/ar with RTL support). The platform aims to be a comprehensive commerce solution for smart city operations.

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

**Provider Chain:** `ClientProviders` (root) wraps `QueryClientProvider` → `StoreProvider` → `AuthProvider` → `BrandingProvider` → `GovernanceProvider` → `ToastProvider`. The `$tenant.$locale` layout wraps children with `TenantProvider` so governance and tenant context are available to all tenant-scoped pages.

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
- **SSR Architecture:** Implemented SSR-safe practices using `typeof window` guards and client-only provider boundaries to prevent React instance duplication and ensure proper hydration.
- **Authentication:** Switched to JWT-based authentication for customer SDK to avoid session issues in the Replit environment.

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