# Medusa.js E-Commerce Monorepo — Dakkah CityOS Commerce Platform

## Overview
This project is a Medusa.js e-commerce monorepo, designed for multi-tenancy and aligned with the Dakkah CityOS CMS architecture. It features a sophisticated backend with a 5-level node hierarchy, a 10-role RBAC system, a 6-axis persona system, and a 4-level governance chain. The platform supports 6 residency zones and a centralized design system, with localization for 3 locales (en/fr/ar with RTL support). Its purpose is to provide a robust and flexible commerce platform capable of handling diverse business models, from standard retail to specialized verticals like healthcare, education, and real estate, within a unified CityOS ecosystem.

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

### Backend Modules
The backend includes extensive modularity with specialized modules for:
- **Core CityOS Features:** Tenant management, 5-level node hierarchy (CITY→DISTRICT→ZONE→FACILITY→ASSET), governance chain with policy inheritance, 6-axis persona system, CMS-compatible event outbox, audit trail, i18n, channel mapping, and region-zone mapping.
- **Commerce Verticals:** A wide range of modules supporting various business models including multi-vendor marketplace, subscriptions, B2B company management, quoting, volume pricing, bookings, reviews, invoicing, promotions (loyalty, wishlists, gift cards), digital products, auctions, rentals, restaurants, event ticketing, classifieds, affiliates, warranties, freelance services, travel, real estate, memberships, crowdfunding, social commerce, grocery, automotive, healthcare, education, charity, financial products, advertising, parking, utilities, government services, pet services, fitness, and legal services.

### API Routes & Middleware
- Dedicated API routes for tenant, node, persona, and governance resolution under `/store/cityos/`.
- `NodeContext` middleware on `/store/cityos/*` routes, utilizing headers such as `x-tenant-slug`, `x-locale`, `x-channel`, `x-node-id`, and `x-persona-id`.

### Storefront Routing
- **New Pattern:** `/$tenant/$locale/...` for dynamic routing based on tenant and locale.
- **Legacy Pattern:** `/$countryCode/...` with redirection to the new pattern for backward compatibility.
- Root `/` redirects to `/default/en/`.
- Utilizes TanStack Router with file-based routing and Server-Side Rendering (SSR).

### Design System
A centralized design system is implemented through several packages:
- **@dakkah-cityos/contracts:** Defines core interfaces and enums (NodeContext, RBAC roles, Persona axes, Governance policies, Node types, Channel types, Locale config).
- **@dakkah-cityos/design-tokens:** Specifies design primitives (Colors, Typography, Spacing, Shadows, Borders, Breakpoints).
- **@dakkah-cityos/design-runtime:** Provides theming infrastructure (`ThemeProvider`, `createTheme`, CSS variable injection, `useTheme` hook).
- **@dakkah-cityos/design-system:** Defines component type interfaces across various categories (forms, layout, data display, navigation, utilities).

### Key Design Decisions
- **Multi-tenant Isolation:** `tenantId` on all entities with node-scoped access.
- **RBAC:** 10 roles with node-scoped access via `assigned_node_ids`.
- **Persona Precedence:** Hierarchical resolution from session to tenant-default.
- **Governance:** Deep merging of policies from region to country through an authority chain.
- **Residency Zones:** Data locality and cross-border data handling rules based on GCC/EU, MENA, APAC/AMERICAS/GLOBAL.
- **RTL Support:** Dedicated `dir="rtl"` and CSS overrides for Arabic locale.
- **Event Outbox:** CMS-compatible envelope format with correlation/causation IDs.
- **Vite Proxy:** Frontend uses a Vite proxy for seamless API communication, with SSR directly accessing the backend.

### Temporal Integration Bridge
The Medusa backend integrates with Temporal Cloud for workflow orchestration:
- **Client Library** (`src/lib/temporal-client.ts`): Lazy-initialized Temporal client with dynamic SDK import, connects to `ap-northeast-1.aws.api.temporal.io:7233`, namespace `quickstart-dakkah-cityos.djvai`.
- **Event Dispatcher** (`src/lib/event-dispatcher.ts`): Maps 18 Medusa event types to Temporal workflow IDs (order.placed → unified-order-orchestrator, payment.initiated → multi-gateway-payment, governance.policy.changed → governance-policy-propagation, node.created → node-provisioning, tenant.provisioned → tenant-setup-saga, etc.), with event outbox processing support.
- **Dynamic Workflow Client** (`src/lib/dynamic-workflow-client.ts`): Supports Temporal's dynamic AI agent workflow pattern — LLM-driven workflows that determine their execution path at runtime. Provides `startDynamicWorkflow`, `queryDynamicWorkflowStatus`, `signalDynamicWorkflow` (human-in-the-loop), `cancelDynamicWorkflow`, and `listDynamicWorkflows`.
- **Admin API Routes** (`src/api/admin/temporal/`): Health check, workflow listing, and manual trigger endpoints with Zod validation.
- **Dynamic Workflow API** (`src/api/admin/temporal/dynamic/`): CRUD+signal routes for dynamic AI agent workflows — start, list, query status, send signals, cancel.
- **Event Bridge Subscriber** (`src/subscribers/temporal-event-bridge.ts`): Listens to order/product events and dispatches to Temporal; dormant when TEMPORAL_API_KEY is unset.
- **Task Queues**: `cityos-workflow-queue` (static event-driven), `cityos-dynamic-queue` (AI agent dynamic workflows).
- **Workflow Repo**: Separate private repo at `Qahtani1979/dakkah-cityos-workflow` with 505+ workflow definitions.

### Cross-System Architecture
The project is part of a larger ecosystem involving:
- **Medusa.js:** Core commerce platform (approx. 209 models).
- **External Systems:** ERPNext, Fleetbase, Walt.id, various Payment Gateways, and PayloadCMS.
- **Temporal Workflows:** 505+ workflow definitions across 10 domain packs to manage complex business processes.
- **Comprehensive Data Model:** Approximately 396 models distributed across all integrated systems.

### Seed Data
Two seed scripts are available:
- `apps/backend/src/scripts/seed.ts` - Minimal seed: admin user, store, regions (MENA/International), sales channels, stock location, fulfillment, API key.
- `apps/backend/src/scripts/seed-complete.ts` - Full seed: adds tenant, governance, 5-level node hierarchy (Riyadh → Al Olaya → King Fahad Zone → Main Mall → Shop 101), 5 product categories, 7 products with variants, 3 customers, 2 vendors.
- `apps/backend/src/scripts/db-verify.ts` - Database verification and cleanup: checks all entities, detects duplicates (API keys, stock locations), prints summary report.
- Run via: `cd apps/backend && npx medusa exec ./src/scripts/seed-complete.ts`
- Verify via: `cd apps/backend && npx medusa exec ./src/scripts/db-verify.ts`

## External Dependencies
- **Database:** PostgreSQL (managed by Replit).
- **Frontend Framework:** TanStack Start, React.
- **Monorepo Management:** Turborepo, pnpm.
- **API Gateway/Orchestration:** Medusa.js.
- **Workflow Orchestration:** Temporal Cloud (`@temporalio/client`).
- **Design System Tools:** Vite.
- **Security & Utilities:** `lodash.set-safe` (custom replacement for `lodash.set`), various up-to-date dependencies for security patching.

## SSR Architecture Notes
- **Vite SSR dual React instance**: Vite's SSR dep optimizer pre-bundles React into `.vite/deps_ssr/`, creating a duplicate instance separate from react-dom-server's Node require(). Fixed via `ssr.optimizeDeps.noDiscovery: true` + `include: []` in vite.config.ts.
- **Client-only provider boundary**: `ClientProviders` in `__root.tsx` uses `typeof window === "undefined"` guard to skip rendering providers (QueryClient, Store, Auth, Branding, Toast) during SSR. Providers mount on client hydration.
- **SSR-safe Layout**: `Layout` component checks `typeof window` to render a minimal HTML shell during SSR and the full client layout (with Navbar, Footer, CartProvider, theme) on the client.
- **Trade-off**: Providers render only on client side, losing some SSR benefits but maintaining full application functionality and preventing crashes.

## Database Seeding Status
- **Total tables:** 332 | **With data:** 259 (78%) | **Empty:** 73 | **Total rows:** 1,430
- **Seed scripts:** seed.ts (minimal), seed-complete.ts (full), seed-verticals-4/5/6/7.ts (verticals + tenant), db-verify.ts (audit)
- **Remaining 73 empty tables:** Medusa core transactional tables (order*, cart*, payment*, fulfillment*, return* — ~50 tables) populated through real commerce operations, plus join/link tables (~15) and a few with complex FK constraints
- **Key pattern:** BigNumber columns require companion `raw_*` JSONB columns with `{"value":"X","precision":20}` structure
- **Enum constraints:** 30+ check constraints across tables — must verify allowed values before inserts
- **ID prefixes:** seed4_, seed5_, seed6_, seed7_ for tracking seed script origin
- **Data theme:** Saudi/Arabic (SAR currency, Riyadh/Jeddah locations, Arabic names)

## Recent Changes (Feb 2026)
- Fixed Vite SSR crash from dual React instances by disabling SSR dep optimization and implementing client-only provider boundaries.
- Fixed Layout component to be SSR-safe with typeof window guards.
- Added graceful fallback for PayloadCMS unavailability in storefront slug routes.
- Fixed Booking model job errors (missing service relation and reminder_sent property).
- Implemented Temporal Cloud integration bridge (client, event dispatcher, admin API, event bridge subscriber).
- Installed `@temporalio/client` SDK.
- Set TEMPORAL_ENDPOINT and TEMPORAL_NAMESPACE environment variables.
- Fixed Zod validation issues in trigger route (z.record requires key+value schema in this version).
- Updated and tested seed scripts with idempotent data creation.
- Database populated with full seed data (products, categories, customers, vendors, tenant, node hierarchy).
- Made seed scripts fully idempotent: API key creation checks for existing keys, region handling searches by name, link operations wrapped in try/catch.
- Created database verification/cleanup script (`db-verify.ts`): validates all entities, detects duplicates, prints summary report.
- Added Temporal dynamic AI agent workflow support: `dynamic-workflow-client.ts` with start/query/signal/cancel/list operations, admin API routes at `/admin/temporal/dynamic/`, separate `cityos-dynamic-queue` task queue.
- Extended event dispatcher with 4 new mappings (governance.policy.changed, node.created, tenant.provisioned, workflow.dynamic.start).
- Implemented 42 store-facing API routes across 21 verticals (auctions, rentals, classifieds, digital-products, freelance, travel, social-commerce, crowdfunding, automotive, grocery, warranties, fitness, legal, charity, government, parking, utilities, pet-services, financial-products, advertising, affiliates).
- Created 50 frontend route files (25 verticals x 2 pages each) with listing and detail pages.
- Populated all 40+ vertical module database tables with realistic seed data via 3 seed scripts (seed-verticals-1/2/3.ts).
- Redesigned navbar with professional mega-menu organizing verticals into 10 grouped categories.
- Redesigned homepage with hero section, featured products, vertical discovery grid, categories, and stats.
- Updated branding from "Bloom" to "Dakkah CityOS" across all UI components.
- Created i18n translation infrastructure with en.json, fr.json, ar.json and t() function.
- Fixed product thumbnails for 6 products missing images.
- Fixed travel module service method names (TravelPropertys → TravelProperties) in seed scripts and API routes.
- Fixed customer auth: switched SDK from session-based to JWT-based auth (`auth: { type: "jwt" }` in sdk.ts) to avoid cookie/session issues in Replit iframe proxy environment.
- Created auth identities for 3 seeded customers (Mohammed, Fatima, Ahmed) with password `Customer123!` and linked them to existing customer records.
- Auth flow: POST /auth/customer/emailpass → JWT token → Bearer token for subsequent requests (no session cookie needed).
- Comprehensive database seeding phase: seed-verticals-4/5/6/7.ts scripts + direct SQL seeded 111+ tables across all verticals and CityOS tenant infrastructure.
- Seeded CityOS-specific tables: persona (5), persona_assignment (4), cityos_store (2), tenant_settings, tenant_billing, tenant_invoice (2), tenant_usage_record (3), translation (10), audit_log (5), event_outbox (3), view_configuration (2), user_preference (4), sales_channel_mapping (3), region_zone_mapping (3).
- Seeded B2B/commerce tables: company (3), company_user (3), approval_workflow (2), approval_request (2), purchase_order (2), quote (2), payment_terms (3), price_list (2), promotion (3) with rules.
- Seeded additional verticals: inventory (7 items + levels), product_collection (3), product_type (3), product_tag (6), customer_group (3), customer_segment (3), gift_card_ext (3), amenity (7), volume_pricing (2) with tiers, vendor_analytics (2), vendor_performance_metric (4), service_provider (3), service_product (4), agent_profile (2), shuttle_route (2), time_log (3), billing_cycle (3), tax_exemption (2), ride_request (2), rental_agreement (2), retainer_agreement (2), workflow_execution (3), return_reason (5), product_bundle (2).