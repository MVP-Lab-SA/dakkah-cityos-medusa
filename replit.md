# Medusa.js E-Commerce Monorepo — Dakkah CityOS Commerce Platform

## Overview
Medusa.js e-commerce monorepo aligned with Dakkah CityOS CMS architecture. Multi-tenant commerce backend with 5-level node hierarchy, 10-role RBAC, 6-axis persona system, 4-level governance chain, 6 residency zones, and centralized design system. Supports 3 locales (en/fr/ar with RTL).

## Project Architecture

### Structure
- `apps/backend/` - Medusa.js v2 backend API (port 9000)
- `apps/storefront/` - TanStack Start + React storefront (port 5000)
- `packages/cityos-contracts/` - Shared TypeScript contracts (@dakkah-cityos/contracts)
- `packages/cityos-design-tokens/` - Design token definitions (@dakkah-cityos/design-tokens)
- `packages/cityos-design-runtime/` - Theme runtime + React providers (@dakkah-cityos/design-runtime)
- `packages/cityos-design-system/` - Component type system (@dakkah-cityos/design-system)
- `docs/ALIGNMENT_ROADMAP.md` - 8-phase alignment roadmap
- `turbo.json` - Turborepo config
- `pnpm-workspace.yaml` - Workspace packages: apps/* + packages/*
- `start.sh` - Startup script (backend → storefront)

### Backend Modules (apps/backend/src/modules/)
| Module | Key | Purpose |
|--------|-----|---------|
| tenant | tenant | Multi-tenant management with CMS-aligned schema |
| node | node | 5-level hierarchy (CITY→DISTRICT→ZONE→FACILITY→ASSET) |
| governance | governance | Authority chain with deep-merge policy inheritance |
| persona | persona | 6-axis persona system with 5-level precedence |
| events | eventOutbox | CMS-compatible outbox event pattern |
| audit | audit | Audit trail with data classification |
| i18n | i18n | Translation management (en/fr/ar) |
| channel | channel | 5 channel types → Medusa sales channel mapping |
| region-zone | regionZone | 6 residency zones → Medusa region mapping |
| store | cityosStore | Store management |
| vendor | vendor | Multi-vendor marketplace |
| commission | commission | Vendor commission management |
| payout | payout | Vendor payout management |
| subscription | subscription | Subscription products |
| company | company | B2B company management |
| quote | quote | Quote/RFQ management |
| volume-pricing | volumePricing | Tiered pricing |
| booking | booking | Service bookings |
| review | review | Product reviews |
| invoice | invoice | Invoice generation |

### API Routes
- `GET /store/cityos/tenant?slug=X` - Tenant resolution
- `GET /store/cityos/nodes?tenant_id=X` - Node hierarchy listing
- `GET /store/cityos/persona?tenant_id=X` - Persona resolution
- `GET /store/cityos/governance?tenant_id=X` - Effective governance policies

### Middleware
- NodeContext middleware on `/store/cityos/*` routes
- Headers: `x-tenant-slug`, `x-locale`, `x-channel`, `x-node-id`, `x-persona-id`

### Storefront Routing
- **New pattern:** `/$tenant/$locale/...` (e.g., `/default/en/products/shirt`)
- **Legacy pattern:** `/$countryCode/...` (kept for backward compatibility, redirects to new pattern)
- **Root `/`** redirects to `/default/en/`
- TanStack Router file-based routing with SSR

### Design System (packages/)
- **@dakkah-cityos/contracts** - NodeContext, RBAC roles, Persona axes, Governance policies, Node types, Channel types, Locale config
- **@dakkah-cityos/design-tokens** - Colors (light/dark), Typography, Spacing, Shadows, Borders, Breakpoints
- **@dakkah-cityos/design-runtime** - ThemeProvider, createTheme, CSS variable injection, useTheme hook
- **@dakkah-cityos/design-system** - Component type interfaces (forms, layout, data display, navigation, utilities)

### Key Design Decisions
- **Multi-tenant isolation:** tenantId on all entities, node-scoped access
- **RBAC:** 10 roles from super-admin(100) to viewer(10), with node-scoped access via assigned_node_ids
- **Persona precedence:** session(500) > surface(400) > membership(300) > user-default(200) > tenant-default(100)
- **Governance:** Deep merge policies from region → country → authority chain
- **Residency zones:** GCC/EU (local storage, no cross-border), MENA (local storage), APAC/AMERICAS/GLOBAL (flexible)
- **RTL:** Arabic locale gets dir="rtl", dedicated RTL CSS overrides
- **Event outbox:** CMS-compatible envelope format with correlation/causation IDs
- **Vite Proxy:** Browser SDK uses empty baseUrl (Vite proxy on 5000 → backend 9000), SSR uses http://localhost:9000

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection (auto-managed by Replit)
- `VITE_MEDUSA_BACKEND_URL` - Backend URL for SSR (http://localhost:9000)
- `VITE_MEDUSA_PUBLISHABLE_KEY` - Medusa publishable API key
- Backend `.env`: JWT_SECRET, COOKIE_SECRET, STORE_CORS, AUTH_CORS, ADMIN_CORS

### Admin Credentials
- Email: admin@medusa-test.com
- Password: supersecret

### Known Issues
- Hydration mismatch warnings due to SSR/client URL difference (non-blocking, pre-existing)
- Root `/` through Replit proxy iframe may need direct navigation to `/default/en/`
- `Booking` entity error in no-show check job (pre-existing custom module schema issue)
- Admin `/app` shows spinner initially; navigate to `/app/login` directly

## Recent Changes
- 2026-02-07: Initial setup - Node.js 20, pnpm, PostgreSQL database
- 2026-02-07: Medusa migrations, admin user creation, publishable API key
- 2026-02-07: Storefront Vite proxy configured for /store, /admin, /auth routes
- 2026-02-08: Created comprehensive alignment roadmap (docs/ALIGNMENT_ROADMAP.md)
- 2026-02-08: **Phase 1 COMPLETE** - Tenant model aligned with CMS (slug, residency_zone, governance, branding, locale). TenantUser updated to 10-role RBAC with node-scoped access
- 2026-02-08: **Phase 1 COMPLETE** - Node hierarchy module (5-level validation), Governance module (policy chain merge), Persona module (6-axis, 5-level precedence resolution)
- 2026-02-08: **Phase 1 COMPLETE** - NodeContext middleware, tenant/node/persona/governance APIs on /store/cityos/*
- 2026-02-08: **Phase 1 COMPLETE** - Storefront routing migrated from /$countryCode to /$tenant/$locale, TenantContext/LocaleSwitcher/i18n utils created
- 2026-02-08: **Phase 4 COMPLETE** - Design system packages: contracts, tokens, runtime (ThemeProvider), system (type interfaces)
- 2026-02-08: **Phase 5 COMPLETE** - Event outbox module (CMS-compatible envelopes)
- 2026-02-08: **Phase 6 COMPLETE** - Audit trail module, i18n module, channel mapping module, region-zone mapping module
- 2026-02-08: All 8 new modules registered in medusa-config.ts, migrations generated and applied
- 2026-02-08: Workspace updated to include packages/* in pnpm-workspace.yaml
- 2026-02-08: Security dependency updates via pnpm overrides: @remix-run/router@1.23.2, fast-xml-parser@5.3.4, jws@3.2.3, qs@6.14.1, h3@1.15.5, node-forge@1.3.2, seroval@1.4.1, seroval-plugins@1.4.2, tar@7.5.7, glob@11.1.0. Direct: next@15.0.8 in orchestrator
- 2026-02-08: Replaced lodash.set@4.3.2 (critical CVE - prototype pollution) with safe local package at packages/lodash-set-safe, using pnpm override to redirect all lodash.set imports. Removed old patch file.

## User Preferences
- Full alignment with CityOS CMS architecture required
- Centralized design system matching CMS pattern
- Port 5000 for frontend, 0.0.0.0 host
- Bypass host verification for Replit environment
