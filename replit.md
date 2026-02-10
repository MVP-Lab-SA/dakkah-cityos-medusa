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

### Block System & CMS Migration Readiness
The storefront includes a comprehensive Payload CMS-compatible block system:
- **27 block type contracts** defined in `packages/cityos-design-system/src/blocks/BlockTypes.ts` with `BlockBase`, shared field types (`MediaField`, `CTAField`, `RichTextField`), and a `BlockData` union type
- **25 implemented blocks** in `apps/storefront/src/components/blocks/` (map and reviewList pending)
- **BlockRenderer** (`block-renderer.tsx`) dynamically renders a `PageLayout` array by looking up components from `BLOCK_REGISTRY` (`block-registry.ts`)
- **10 reusable UI components** (Badge, Avatar, Breadcrumb, Tabs, Alert, Rating, Skeleton, Accordion, Switch, Textarea) all using ds-* tokens
- All blocks follow mobile-first responsive patterns: section py-12 md:py-16 lg:py-20, container px-4 md:px-6, responsive typography scales
- Zero hardcoded colors: all blocks and UI components use exclusively ds-* design system token classes
- SSR-safe: client-only logic (intervals, clipboard, window listeners) gated inside useEffect or event handlers
- Design tokens expanded with motion/transition tokens (duration, easing), elevation tokens (6 levels), container tokens, and responsive spacing utilities in `packages/cityos-design-tokens/src/`
- Commerce types (`ProductCard`, `PriceDisplay`, `Rating`, `CartItem`, `VendorCard`) and feedback types (`Modal`, `Alert`, `Toast`, `Notification`) defined in design-system package

### RTL/LTR & i18n Architecture (Updated Feb 2026)
- **Full logical CSS properties**: All blocks, UI components, and layout components use Tailwind CSS v4 logical property utilities (`ms-`/`me-`/`ps-`/`pe-`/`start-`/`end-`/`text-start`/`text-end`/`border-s-`/`border-e-`/`rounded-s-`/`rounded-e-`) instead of physical direction classes (`ml-`/`mr-`/`pl-`/`pr-`/`left-`/`right-`/`text-left`/`text-right`)
- **RTL direction**: `$tenant.$locale.tsx` sets `dir="rtl"` for Arabic locale; `rtl.css` handles animation direction flips (`slide-in-from-left/right`), gradient direction overrides, and `flex-row` reversal
- **Alignment fields**: BlockTypes.ts uses `"start" | "center" | "end"` for alignment/textAlign fields (backward-compatible with legacy `"left"`/`"right"` in renderers)
- **i18n integration**: Blocks accept `locale` prop (default `'en'`) or use `useTenant()` hook; hardcoded UI strings use `t(locale, "blocks.key")` with prop override pattern. 53+ translation keys across `blocks` namespace in en/fr/ar JSON files
- **Preserved exceptions**: Dialog centering (`left-[50%] translate-x-[-50%]`), Radix UI data attributes (`data-[side=left/right]`), animation class names (flipped via rtl.css)
- **Locale files**: `apps/storefront/src/lib/i18n/locales/{en,fr,ar}.json` with namespaces: common, nav, home, product, cart, account, footer, blocks

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
- **Temporal Cloud (Workflow Orchestration):** 80 system workflows across 35 categories, 21 specialized task queues mapped to 10 systems, dynamic AI agent workflows, event outbox integration. Workflows route to domain-specific queues (commerce-queue, xsystem-platform-queue, xsystem-logistics-queue, etc.) based on the Workflow Discovery Guide. Full architecture documented in `docs/CROSS_SYSTEM_ARCHITECTURE.md` (6,667 lines, 15 sections).
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