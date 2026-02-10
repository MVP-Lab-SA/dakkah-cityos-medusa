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
The backend provides modularity for CityOS features including tenant management, a 5-level node hierarchy (CITY→DISTRICT→ZONE→FACILITY→ASSET), policy inheritance-based governance, a persona system, a CMS-compatible event outbox, and i18n. It supports multi-vendor marketplaces, subscriptions, B2B, bookings, promotions, and specialized services. API routes handle tenant, node, persona, and governance resolution. Vendors are implemented as full tenants with `scope_tier` and `tenant_type` differentiation, linked via `TenantRelationship`. Key models include `TenantPOI`, `ServiceChannel`, and `MarketplaceListing`.

### Storefront Architecture
The storefront utilizes TanStack Start with React for SSR, dynamic routing (`/$tenant/$locale/...`), and file-based routing. A centralized design system dictates design primitives, theming, and component interfaces. A robust provider chain ensures consistent context, including tenant-scoped routes wrapped with `TenantProvider` and `PlatformContextProvider`.

### CMS Integration
A local CMS registry (`apps/backend/src/lib/platform/cms-registry.ts`), compatible with Payload CMS, defines 27 commerce verticals and additional pages. The `TemplateRenderer` dynamically renders layouts. CMS pages support `countryCode` and `regionZone` for country-level unification and optional `nodeId` for hierarchy integration. Backend endpoints provide Payload-compatible responses, and frontend hooks use React Query for data fetching.

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
- **SSR Architecture:** Route loaders return minimal data during SSR, with client-side data fetching via React Query to prevent OOM errors.
- **Authentication:** JWT-based authentication for customer SDK.
- **API Key Usage:** All tenant/governance/node API calls must use `sdk.client.fetch()` for automatic `VITE_MEDUSA_PUBLISHABLE_KEY` inclusion.
- **Tenant Resolution:** Default tenant "dakkah". Root `/` redirects to `/dakkah/en`.
- **Route Consolidation:** CMS-eligible routes are consolidated into catch-all routes.

### Platform Context API
The backend exposes a unified Platform Context API at `/platform/*` (no authentication required) for context resolution, including `tenant`, `nodeHierarchy`, `governanceChain`, `capabilities`, and `systems`.

### Temporal-First Integration Architecture
All cross-system integration calls flow through Temporal Cloud workflows. Direct API calls to ERPNext, Payload, Fleetbase, or Walt.id are avoided; all calls occur within Temporal workflow activities for durable execution, retries, saga/compensation patterns, and observability. The architecture includes an event dispatcher mapping events to Temporal workflows and dynamic AI agent workflows.

### Cross-System Integration Layer
This layer provides integration services called by Temporal activities, including wrappers for ERPNext, Payload CMS, Fleetbase, and Walt.id. It also manages sync tracking, an external system registry, retry states, and webhook receivers.

### System Responsibility Split
- **Medusa (Commerce Engine):** Products, orders, payments, commissions, marketplace listings, vendor registration, KYC, payouts, tenant/marketplace/service channel management.
- **Payload CMS (Entity & Content Management):** Tenant profiles, POI content, vendor public profiles, pages, navigation, service channel display content.
- **Fleetbase (Geo & Logistics):** Geocoding, address validation, delivery zone management, service area coverage, fleet management, routing, real-time tracking.
- **ERPNext (Finance, Accounting & ERP):** Sales invoices, payment entries, GL, inventory, procurement, customer/product sync, reporting. Multi-tenant support with each tenant mapping to an ERPNext company.
- **Temporal Cloud (Workflow Orchestration):** 65 system workflows across 9 categories, 21 specialized task queues mapped to 10 systems, dynamic AI agent workflows, event outbox integration. Workflows route to domain-specific queues (commerce-queue, xsystem-platform-queue, xsystem-logistics-queue, etc.) based on the Workflow Discovery Guide.
- **Walt.id (Decentralized Digital Identity):** DID management, 6 credential types (KYC, Vendor, Membership, TenantOperator, POI, MarketplaceSeller), W3C Verifiable Credentials, wallet integration, trust registries.

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