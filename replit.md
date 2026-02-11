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
The backend provides modularity for CityOS features including tenant management, a 5-level node hierarchy (CITY→DISTRICT→ZONE→FACILITY→ASSET), policy inheritance-based governance, a persona system, a CMS-compatible event outbox, and i18n. It supports multi-vendor marketplaces, subscriptions, B2B, bookings, promotions, and specialized services. API routes handle tenant, node, persona, and governance resolution.

### Storefront Architecture
The storefront utilizes TanStack Start with React for SSR, dynamic routing (`/$tenant/$locale/...`), and file-based routing. A centralized design system dictates design primitives, theming, and component interfaces. A robust provider chain ensures consistent context, including tenant-scoped routes wrapped with `TenantProvider` and `PlatformContextProvider`. It includes a comprehensive Payload CMS-compatible block system with 27 block type contracts and implementations, a `BlockRenderer`, and 13+ reusable UI components. All UI uses design tokens and follows mobile-first responsive patterns.

### Internationalization and Localization
The system supports full logical CSS properties for RTL/LTR, with `dir="rtl"` for Arabic locales and `rtl.css` for animation direction flips. Alignment fields use `"start" | "center" | "end"`. i18n integration uses a `locale` prop and `t(locale, "blocks.key")` for translations across 30+ namespaces in en/fr/ar JSON files.

### CMS Integration
A local CMS registry (`apps/backend/src/lib/platform/cms-registry.ts`), compatible with Payload CMS, defines 27 commerce verticals and additional pages. CMS pages support `countryCode` and `regionZone` for country-level unification and optional `nodeId` for hierarchy integration. Backend endpoints provide Payload-compatible responses, and frontend hooks use React Query for data fetching.

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

### Cross-System Integration Layer
This layer provides integration services called by Temporal activities, including wrappers for ERPNext, Payload CMS, Fleetbase, and Walt.id, managing sync tracking, an external system registry, retry states, and webhook receivers.

### System Responsibility Split
- **Medusa (Commerce Engine):** Products, orders, payments, commissions, marketplace listings, vendor registration, KYC, payouts, tenant/marketplace/service channel management.
- **Payload CMS (Entity & Content Management):** Tenant profiles, POI content, vendor public profiles, pages, navigation, service channel display content.
- **Fleetbase (Geo & Logistics):** Geocoding, address validation, delivery zone management, service area coverage, fleet management, routing, real-time tracking.
- **ERPNext (Finance, Accounting & ERP):** Sales invoices, payment entries, GL, inventory, procurement, customer/product sync, reporting. Multi-tenant support.
- **Temporal Cloud (Workflow Orchestration):** 80 system workflows across 35 categories, 21 specialized task queues, dynamic AI agent workflows, event outbox integration.
- **Walt.id (Decentralized Digital Identity):** DID management, 6 credential types, W3C Verifiable Credentials, wallet integration, trust registries.

## Test Accounts & Credentials

### Admin Panel (`/commerce/admin`)
| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@dakkah.com | admin123456 |

### Storefront Customer Accounts (`/dakkah/en/login`)
| Role | Email | Password | RBAC Role | Weight |
|------|-------|----------|-----------|--------|
| Tenant Owner | owner@dakkah.com | owner123456 | super-admin | 100 |
| Store Manager | manager@dakkah.com | manager123456 | zone-manager | 70 |
| Customer | mohammed@example.com | (seeded) | none | 0 |
| Customer | fatima@example.com | (seeded) | none | 0 |
| Customer | ahmed@example.com | (seeded) | none | 0 |

### RBAC Role Weights (manage access requires >= 40)
super-admin: 100, city-manager: 90, district-manager: 80, zone-manager: 70, facility-manager: 60, asset-manager: 50, vendor-admin: 40, content-editor: 30, analyst: 20, viewer: 10

### Auth Notes
- Admin users (`user` table) and customers (`customer` table) are separate auth systems
- Customer RBAC role stored in `customer.metadata.role`
- Management panel at `/$tenant/$locale/manage` requires weight >= 40
- UserMenu shows "Store Dashboard" link for users with management access

### Tenant
Dakkah (slug: `dakkah`, id: `01KGZ2JRYX607FWMMYQNQRKVWS`, status: active)

## Route Map

### Public: `/`, `/$t/$l`, `/$t/$l/login`, `/$t/$l/register`, `/$t/$l/reset-password`, `/$t/$l/products/$handle`, `/$t/$l/$slug` (CMS catch-all)
### Shop: `/$t/$l/cart`, `/$t/$l/checkout`, `/$t/$l/order/$id/confirmed`, `/$t/$l/compare`, `/$t/$l/wishlist`, `/$t/$l/flash-sales`, `/$t/$l/gift-cards`, `/$t/$l/bundles`
### Bookings: `/$t/$l/bookings`, `/$t/$l/bookings/$serviceHandle`, `/$t/$l/bookings/confirmation`
### Verticals: `/$t/$l/auctions`, `/$t/$l/digital`, `/$t/$l/events`, `/$t/$l/memberships`, `/$t/$l/rentals`, `/$t/$l/subscriptions`, `/$t/$l/campaigns`, `/$t/$l/quotes` (each with `/$id` detail)
### Alt Commerce: `/$t/$l/dropshipping`, `/$t/$l/white-label`, `/$t/$l/print-on-demand`, `/$t/$l/trade-in`, `/$t/$l/try-before-you-buy`, `/$t/$l/consignment`, `/$t/$l/store-pickup`, `/$t/$l/returns`, `/$t/$l/track`
### Marketplace: `/$t/$l/vendors`, `/$t/$l/vendors/$handle`, `/$t/$l/vendor/register`
### Content: `/$t/$l/blog`, `/$t/$l/blog/$slug`, `/$t/$l/help`, `/$t/$l/help/$slug`, `/$t/$l/places`, `/$t/$l/places/$id`
### Identity: `/$t/$l/verify/age`
### Account (auth required): `/$t/$l/account` (profile, settings, addresses, orders, bookings, subscriptions, purchase-orders, disputes, downloads, installments, loyalty, referrals, store-credits, wallet, wishlist, verification, consents)
### B2B: `/$t/$l/b2b/register`, `/$t/$l/b2b/dashboard`, `/$t/$l/business/approvals`, `/$t/$l/business/catalog`, `/$t/$l/business/orders`, `/$t/$l/business/team`
### Vendor Dashboard: `/$t/$l/vendor` (products, orders, commissions, payouts)
### Tenant Manage (RBAC >= 40): `/$t/$l/manage` — tenant-scoped operations
- Commerce: products, orders, customers, quotes, invoices, subscriptions, reviews
- Marketplace (shared): vendors, commissions, payouts, affiliates
- Verticals (27): auctions, bookings, event-ticketing, rentals, restaurants, grocery, travel, automotive, real-estate, healthcare, education, fitness, pet-services, digital-products, memberships, financial-products, freelance, parking
- Marketing: advertising, promotions, social-commerce, classifieds, crowdfunding, charity
- Organization: team, companies, stores, legal, utilities
- System: analytics, settings
### Super Admin (`/commerce/admin`) — platform-wide concerns (Medusa admin + extensions)
- Built-in Medusa: Products, Orders, Customers, Pricing, Promotions, Inventory, Regions, Sales Channels, Settings
- Platform Infrastructure: Tenants, Nodes, Governance, Personas, Region Zones, Channels
- Platform Commerce: Vendors (global), Commissions, Payouts (global), Volume Pricing, Warranty Templates
- System: Audit Logs, i18n, Bookings, Subscriptions, Companies
### System: `/health`

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