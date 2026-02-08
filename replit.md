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

### Cross-System Architecture
The project is part of a larger ecosystem involving:
- **Medusa.js:** Core commerce platform (approx. 209 models).
- **External Systems:** ERPNext, Fleetbase, Walt.id, various Payment Gateways, and PayloadCMS.
- **Temporal Workflows:** 80 workflow definitions across 35 commerce categories to manage complex business processes.
- **Comprehensive Data Model:** Approximately 396 models distributed across all integrated systems.

## External Dependencies
- **Database:** PostgreSQL (managed by Replit).
- **Frontend Framework:** TanStack Start, React.
- **Monorepo Management:** Turborepo, pnpm.
- **API Gateway/Orchestration:** Medusa.js.
- **Design System Tools:** Vite.
- **Security & Utilities:** `lodash.set-safe` (custom replacement for `lodash.set`), various up-to-date dependencies for security patching.