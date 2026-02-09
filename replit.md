# Medusa.js E-Commerce Monorepo — Dakkah CityOS Commerce Platform

## Overview
This project is a Medusa.js e-commerce monorepo designed for multi-tenancy and seamless integration with the Dakkah CityOS CMS architecture. Dakkah is a comprehensive platform intended to power over 27 commerce verticals. Key features include a 5-level node hierarchy, a 10-role RBAC system, a 6-axis persona system, a 4-level governance chain, and localization for en/fr/ar (with RTL support). The primary super-app tenant is "Dakkah" (`01KGZ2JRYX607FWMMYQNQRKVWS`), containing all seeded data.

## User Preferences
- Full alignment with CityOS CMS architecture required
- Centralized design system matching CMS pattern
- Port 5000 for frontend, 0.0.0.0 host
- Bypass host verification for Replit environment
- Country-level record unification for CMS pages
- Payload CMS API compatibility for future migration

## System Architecture

### Structure
The project utilizes a Turborepo monorepo:
- `apps/backend/`: Medusa.js v2 backend API (port 9000).
- `apps/storefront/`: TanStack Start + React storefront (port 5000).
- `packages/cityos-contracts/`: Shared TypeScript contracts.
- `packages/cityos-design-tokens/`: Design token definitions.
- `packages/cityos-design-runtime/`: Theme runtime and React providers.
- `packages/cityos-design-system/`: Component type system.

### Backend Modules and Features
The backend provides modularity for CityOS features such as tenant management, a 5-level node hierarchy (CITY→DISTRICT→ZONE→FACILITY→ASSET), policy inheritance-based governance, a persona system, a CMS-compatible event outbox, and i18n. It supports multi-vendor marketplaces, subscriptions, B2B, bookings, promotions, and specialized services. API routes handle tenant, node, persona, and governance resolution using `NodeContext` middleware.

### Vendor-as-Tenant Architecture
Vendors are implemented as full tenants within the system, differentiated by `scope_tier` (nano, micro, small, medium, large, mega, global) and `tenant_type` (platform, marketplace, vendor, brand). Key models include `TenantRelationship` for linking vendor-tenants to marketplace-tenants, `TenantPOI` for physical locations, `ServiceChannel` for delivery methods, and `MarketplaceListing` for cross-tenant product listings.

### Storefront Architecture
The storefront uses TanStack Start with React for SSR, dynamic routing (`/$tenant/$locale/...`), and file-based routing. A centralized design system dictates design primitives, theming, and component interfaces. The provider chain (`ClientProviders` → `QueryClientProvider` → `StoreProvider` → `AuthProvider` → `BrandingProvider` → `GovernanceProvider` → `ToastProvider`) ensures consistent context. Tenant-scoped routes (`/$tenant/$locale/`) are wrapped with `TenantProvider` and `PlatformContextProvider`.

### CMS Integration
A local CMS registry (`apps/backend/src/lib/platform/cms-registry.ts`), compatible with Payload CMS, serves as a stand-in for CMS data. It defines 27 commerce verticals and additional pages. The `TemplateRenderer` component dynamically renders layouts based on page templates. CMS pages include `countryCode` and `regionZone` for country-level unification, and optional `nodeId` for hierarchy integration. Backend endpoints `/platform/cms/pages`, `/platform/cms/navigations`, `/platform/cms/verticals`, `/platform/cms/resolve`, and `/platform/cms/navigation` provide Payload-compatible responses. Frontend hooks (`useCMSPage`, `useCMSPageChildren`, `useCMSNavigation`, `useCMSVerticals`) utilize React Query for data fetching from these endpoints.

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
- **Memory Management:** Backend limited to 512MB, storefront to 1024MB.
- **Authentication:** JWT-based authentication for customer SDK.
- **API Key Usage:** All tenant/governance/node API calls must use `sdk.client.fetch()` for automatic `VITE_MEDUSA_PUBLISHABLE_KEY` inclusion.
- **Tenant Resolution:** Default tenant "dakkah" (`01KGZ2JRYX607FWMMYQNQRKVWS`). Root `/` redirects to `/dakkah/en`. `DEFAULT_TENANT` and `TENANT_SLUG_TO_ID` are used for tenant ID resolution.
- **Route Consolidation:** CMS-eligible routes are consolidated into catch-all routes, while transactional/authenticated routes remain dedicated files.

### Platform Context API
The backend exposes a unified Platform Context API at `/platform/*` (no authentication required) for context resolution, including `tenant`, `nodeHierarchy`, `governanceChain`, `capabilities`, and `systems`.

### Temporal Integration Bridge
The Medusa backend integrates with Temporal Cloud for workflow orchestration, featuring a lazy-initialized client, an event dispatcher for Medusa events, and a dynamic workflow client for AI agent workflows.

### Cross-System Integration Layer
This layer orchestrates integration with CityOS ecosystem components:
- **Integration Services:** Bi-directional sync with Payload CMS, ERPNext, Fleetbase, Walt.id, and Stripe.
- **Integration Orchestrator:** Manages sync operations, external system registry, retries, and health checks.
- **Webhook Receivers:** Handles inbound webhooks with signature verification.
- **Admin Integration APIs:** Provides dashboards, health checks, manual triggers, and logs.
- **Scheduled Jobs:** Automates regular syncs.
- **Integration Event Subscriber:** Triggers cross-system syncs based on Medusa events.

### System Responsibility Split
Three systems work together, each owning specific domains:

**Medusa (this codebase) — Commerce Engine:**
- Products, orders, payments, commissions, marketplace listings
- Vendor registration, KYC status, payout management (Stripe Connect)
- TenantRelationship and MarketplaceListing management
- ServiceChannel definitions (fulfillment types, order rules)
- VendorProduct/VendorOrder attribution across tenant boundaries

**Payload CMS — Entity & Content Management:**
- Tenant profiles (branding, SEO, localized content, media)
- POI content (descriptions, media galleries, operating hours display)
- Vendor public profiles (about, story, team, FAQ, reviews display)
- Pages and navigation (tenant-scoped, tier-gated)
- Service channel display content (icons, promotional banners)
- Integration spec: `apps/backend/src/lib/integrations/payload-cms-spec.ts`

**Fleetbase — Geo & Logistics:**
- Geocoding and address validation for POIs
- Delivery zone management (polygons, radius-based)
- Service area coverage checks
- Fleet management per vendor-tenant (drivers, assignments)
- Routing, ETA calculations, route optimization
- Real-time driver tracking
- Integration spec: `apps/backend/src/lib/integrations/fleetbase-spec.ts`

**ERPNext — Finance, Accounting & ERP:**
- Sales Invoices, Payment Entries, Credit Notes, GL Journal Entries
- Inventory & Warehousing (Stock Entries, Batch tracking, Reconciliation)
- Procurement (Purchase Orders bi-directional sync, Supplier management)
- Customer & Product sync, Pricing Rules, BOM
- Reporting (AR, P&L, Balance Sheet, Stock Ledger)
- Multi-tenant: each tenant maps to ERPNext Company, vendor-tenants sync as Suppliers
- Integration spec: `apps/backend/src/lib/integrations/erpnext-spec.ts`

**Temporal Cloud — Workflow Orchestration:**
- 35+ system workflows across 9 categories (Commerce, Vendor, Platform, Lifecycle, Sync, Fulfillment, Finance, Identity, Governance)
- 2 task queues: `cityos-workflow-queue` (system) and `cityos-dynamic-queue` (AI agents)
- Dynamic AI agent workflows with goal-based orchestration, signals, queries
- Event outbox integration for reliable delivery with correlation/causation IDs
- Cross-system dispatch fan-out (Temporal + direct integration calls)
- Integration spec: `apps/backend/src/lib/integrations/temporal-spec.ts`

**Walt.id — Decentralized Digital Identity:**
- DID Management (did:key, did:web, did:ion methods)
- 6 credential types: KYC, Vendor, Membership, TenantOperator, POI, MarketplaceSeller
- W3C Verifiable Credentials standard, presentation exchange, selective disclosure
- Wallet integration for credential storage and QR presentation
- Trust registries and issuer verification
- Multi-tenant: platform root issuer DID, delegated issuers for large+ tiers
- Integration spec: `apps/backend/src/lib/integrations/waltid-spec.ts`

## Recent Changes (2026-02-09)
- **Vendor-as-Tenant Architecture:** Vendors are now full tenants with scope tiers (nano→global), tenant types (platform/marketplace/vendor/brand), parent tenant hierarchy, POI collections, multi-channel services, and cross-tenant marketplace listings.
- **New Models:** TenantRelationship, TenantPOI, ServiceChannel, MarketplaceListing added to backend modules.
- **Platform Vendor APIs:** New `/platform/vendors` endpoints for vendor discovery with marketplace filtering, POI/channel/listing sub-resources.
- **Integration Specs:** Created all 5 integration specs as TypeScript contract documents: Payload CMS (content), Fleetbase (geo/logistics), ERPNext (finance/ERP), Temporal (workflows), Walt.id (identity).

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