# Dakkah CityOS Commerce Alignment Roadmap

> Full alignment plan for Medusa.js e-commerce backend + Vite/React storefront with the Dakkah CityOS CMS architecture.
>
> Date: 2026-02-08
> Status: ACTIVE — Master tracking document

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current State Assessment](#current-state-assessment)
3. [Phase 1: Foundation — Tenant & Routing Alignment](#phase-1-foundation--tenant--routing-alignment)
4. [Phase 2: Node Hierarchy & Governance Integration](#phase-2-node-hierarchy--governance-integration)
5. [Phase 3: Persona System & Catalog Intelligence](#phase-3-persona-system--catalog-intelligence)
6. [Phase 4: Centralized Design System](#phase-4-centralized-design-system)
7. [Phase 5: Event System & Workflow Orchestration](#phase-5-event-system--workflow-orchestration)
8. [Phase 6: Compliance, Security & Data Classification](#phase-6-compliance-security--data-classification)
9. [Phase 7: Advanced Commerce Features](#phase-7-advanced-commerce-features)
10. [Phase 8: Quality, Testing & Documentation](#phase-8-quality-testing--documentation)
11. [Dependency Map](#dependency-map)
12. [Risk Register](#risk-register)

---

## Executive Summary

The Dakkah CityOS Commerce system must fully integrate with the CityOS CMS architecture. This means every commerce entity (products, orders, carts, customers, prices) must respect:

- **Multi-tenant isolation** — `tenantId` on every entity, cross-tenant access forbidden
- **5-level node hierarchy** — CITY → DISTRICT → ZONE → FACILITY → ASSET scoping
- **4-level governance chain** — Region → Country → Authority policy inheritance
- **6 residency zones** — GCC, EU, MENA, APAC, AMERICAS, GLOBAL data sovereignty
- **10-role RBAC** — Node-scoped access control from super-admin to viewer
- **6-axis persona system** — Catalog, pricing, and promotions driven by persona
- **Centralized design system** — Shared tokens, themes, and component contracts across CMS and commerce
- **3 locales** — English, French, Arabic (RTL) with localized fields
- **5 channel types** — web, mobile, api, kiosk, internal mapped to Medusa sales channels

### Architecture Reference

```
CityOS CMS (PayloadCMS + Next.js)          Commerce (Medusa v2 + Vite/React)
┌─────────────────────────────┐             ┌─────────────────────────────┐
│ Tenants Collection          │◄───────────►│ Tenant Module               │
│ Nodes Collection            │◄───────────►│ Node-scoped entities        │
│ Regions/Countries           │◄───────────►│ Medusa Regions + Zones      │
│ GovernanceAuthorities       │◄───────────►│ Policy inheritance          │
│ Personas Collection         │◄───────────►│ Persona-aware pricing       │
│ Users + RBAC (10 roles)     │◄───────────►│ Auth + access control       │
│ Design Tokens/Runtime/System│◄───────────►│ Centralized Design System   │
│ Outbox + Events             │◄───────────►│ Medusa Subscribers          │
│ Workflow SDK + Temporal      │◄───────────►│ Medusa Workflows SDK        │
└─────────────────────────────┘             └─────────────────────────────┘
```

---

## Current State Assessment

### What We Have (Backend)

| Component | Status | Gap |
|-----------|--------|-----|
| Medusa v2 backend (port 9000) | Running | Single-tenant assumptions |
| Tenant module | Basic | Missing CMS fields: slug, domain, customDomains, residencyZone, country, governanceAuthority, defaultPersona, locale/timezone/currency settings |
| Store module | Basic | Not linked to tenant governance |
| Vendor module | Basic | No tenantId scoping |
| Commission module | Basic | No node-level scoping |
| Payout module | Basic | No residency zone awareness |
| Subscription module | Basic | No persona-based plans |
| Booking module | Basic | No node (FACILITY/ASSET) scoping |
| Review module | Basic | No tenant isolation |
| Invoice module | Basic | No data classification |
| Quote module | Basic | No persona/B2B alignment |
| Volume Pricing module | Basic | No persona-driven tiers |
| Company module | Basic | No governance chain link |
| Product catalog | 6 sample products | No tenant or node scoping |
| Regions | US, GB, SA | No residencyZone mapping |
| Sales channels | Default | Not mapped to CMS channels (web, mobile, api, kiosk, internal) |

### What We Have (Storefront)

| Component | Status | Gap |
|-----------|--------|-----|
| TanStack Start + React (port 5000) | Running | Single-tenant, no locale routing |
| Route structure | `/$countryCode/...` | Needs `/$tenant/$locale/...` |
| SDK configuration | Dual server/client URLs | No tenant/locale headers |
| Theme | Enterprise CSS variables | Not aligned with CMS design tokens |
| Layout | Navbar + Footer + Outlet | No tenant-specific branding |
| Admin panel | Proxied at `/app` | Working |
| Account pages | Full suite | No persona awareness |
| B2B pages | Dashboard, register | No company-governance link |
| Vendor portal | Products, orders, payouts | No tenant isolation |
| Cart/Checkout | Multi-step | No residency zone payment routing |

### What We Have (Design System)

| Component | Status | Gap |
|-----------|--------|-----|
| Tailwind CSS | Configured with @medusajs/ui-preset | Not using CMS design tokens |
| theme.css | Enterprise color palette, fonts | Hardcoded, not tenant-configurable |
| app.css | Component styles (cards, buttons) | Not matching CMS design-system contracts |
| Store theming | `useStoreTheme` hook | Basic, not using CMS `createTheme` pattern |

---

## Phase 1: Foundation — Tenant & Routing Alignment

**Priority:** CRITICAL — Must complete first
**Estimated effort:** Large
**Dependencies:** None

### 1.1 Align Tenant Module Schema with CMS

Extend the backend tenant model to match the CMS Tenant collection fields.

| Task | Description | Status |
|------|-------------|--------|
| 1.1.1 | Add `slug` field (unique, URL-safe identifier) | [ ] |
| 1.1.2 | Add `domain` field (primary domain for the tenant) | [ ] |
| 1.1.3 | Add `customDomains` array field (additional domains) | [ ] |
| 1.1.4 | Add `residencyZone` enum field (GCC, EU, MENA, APAC, AMERICAS, GLOBAL) | [ ] |
| 1.1.5 | Add `countryId` relationship field (link to Medusa region/country) | [ ] |
| 1.1.6 | Add `governanceAuthorityId` field (link to governance chain) | [ ] |
| 1.1.7 | Add `settings` JSON field with: `defaultLocale`, `supportedLocales[]`, `timezone`, `currency`, `dateFormat` | [ ] |
| 1.1.8 | Add `defaultPersonaId` field (tenant-level default persona) | [ ] |
| 1.1.9 | Add `branding` JSON field: `logo`, `favicon`, `colors`, `fonts` | [ ] |
| 1.1.10 | Add `status` enum field (active, suspended, archived) | [ ] |
| 1.1.11 | Create database migration for tenant schema changes | [ ] |
| 1.1.12 | Seed default tenant with slug, domain, and settings | [ ] |

**Tenant Schema Target:**

```typescript
Tenant {
  id: string
  name: string
  slug: string                    // URL-safe: "dakkah-riyadh"
  domain: string                  // Primary: "riyadh.dakkah.com"
  customDomains: string[]         // Additional domains
  residencyZone: ResidencyZone    // GCC | EU | MENA | APAC | AMERICAS | GLOBAL
  countryId: string               // FK → country/region
  governanceAuthorityId: string   // FK → governance authority
  settings: {
    defaultLocale: string         // "en" | "fr" | "ar"
    supportedLocales: string[]    // ["en", "ar"]
    timezone: string              // "Asia/Riyadh"
    currency: string              // "SAR"
    dateFormat: string            // "dd/MM/yyyy"
  }
  defaultPersonaId: string        // FK → persona
  branding: {
    logo: string
    favicon: string
    primaryColor: string
    accentColor: string
    fontFamily: string
  }
  status: "active" | "suspended" | "archived"
  metadata: Record<string, unknown>
}
```

### 1.2 Tenant Resolution API

| Task | Description | Status |
|------|-------------|--------|
| 1.2.1 | Create `GET /store/tenants/resolve` endpoint (resolve by slug or domain) | [ ] |
| 1.2.2 | Implement slug-based resolution: `/store/tenants/resolve?slug=dakkah-riyadh` | [ ] |
| 1.2.3 | Implement domain-based resolution: `/store/tenants/resolve?domain=riyadh.dakkah.com` | [ ] |
| 1.2.4 | Return full tenant object with settings, branding, and locale info | [ ] |
| 1.2.5 | Cache tenant resolution results (in-memory or Redis) | [ ] |
| 1.2.6 | Add `x-tenant-id` header middleware for all subsequent API calls | [ ] |

### 1.3 Enforce tenantId Across All Entities

| Task | Description | Status |
|------|-------------|--------|
| 1.3.1 | Add `tenantId` foreign key to Product model | [ ] |
| 1.3.2 | Add `tenantId` foreign key to Order model | [ ] |
| 1.3.3 | Add `tenantId` foreign key to Cart model | [ ] |
| 1.3.4 | Add `tenantId` foreign key to Customer model | [ ] |
| 1.3.5 | Add `tenantId` foreign key to all custom module models (vendor, commission, payout, subscription, booking, review, invoice, quote, volume-pricing, company) | [ ] |
| 1.3.6 | Create middleware that extracts `tenantId` from request context and injects into all queries | [ ] |
| 1.3.7 | Add tenant isolation guard: cross-tenant access returns 403 | [ ] |
| 1.3.8 | Backfill existing data with default tenant ID | [ ] |
| 1.3.9 | Add database indexes on `tenantId` for all scoped tables | [ ] |

### 1.4 Migrate Storefront Routing to Tenant + Locale Pattern

**Current:** `/$countryCode/store`, `/$countryCode/cart`, etc.
**Target:** `/$tenant/$locale/store`, `/$tenant/$locale/cart`, etc.

| Task | Description | Status |
|------|-------------|--------|
| 1.4.1 | Create `/$tenant/$locale` route layout wrapper | [ ] |
| 1.4.2 | Create `TenantLoader` that resolves tenant from URL slug | [ ] |
| 1.4.3 | Create `LocaleLoader` that validates locale against tenant's `supportedLocales` | [ ] |
| 1.4.4 | Migrate `/$countryCode/index` → `/$tenant/$locale/index` (home page) | [ ] |
| 1.4.5 | Migrate `/$countryCode/store` → `/$tenant/$locale/store` (product listing) | [ ] |
| 1.4.6 | Migrate `/$countryCode/products/$handle` → `/$tenant/$locale/products/$handle` | [ ] |
| 1.4.7 | Migrate `/$countryCode/categories/$handle` → `/$tenant/$locale/categories/$handle` | [ ] |
| 1.4.8 | Migrate `/$countryCode/cart` → `/$tenant/$locale/cart` | [ ] |
| 1.4.9 | Migrate `/$countryCode/checkout` → `/$tenant/$locale/checkout` | [ ] |
| 1.4.10 | Migrate `/$countryCode/account/...` → `/$tenant/$locale/account/...` (all account routes) | [ ] |
| 1.4.11 | Migrate `/$countryCode/b2b/...` → `/$tenant/$locale/b2b/...` (B2B routes) | [ ] |
| 1.4.12 | Migrate `/$countryCode/vendors/...` → `/$tenant/$locale/vendors/...` (vendor pages) | [ ] |
| 1.4.13 | Migrate vendor portal routes under tenant scope | [ ] |
| 1.4.14 | Add backward-compatible redirects from `/$countryCode/*` to `/$tenant/$locale/*` | [ ] |
| 1.4.15 | Update root `/` redirect to resolve default tenant + locale | [ ] |

### 1.5 NodeContext Propagation

| Task | Description | Status |
|------|-------------|--------|
| 1.5.1 | Define `NodeContext` TypeScript interface matching CMS contract | [ ] |
| 1.5.2 | Create `NodeContextProvider` React context in storefront | [ ] |
| 1.5.3 | Populate NodeContext from tenant resolution (tenantId, locale, channel) | [ ] |
| 1.5.4 | Pass NodeContext as headers in all SDK/API calls (`x-tenant-id`, `x-locale`, `x-channel`) | [ ] |
| 1.5.5 | Backend middleware extracts NodeContext from request headers | [ ] |
| 1.5.6 | All Medusa service calls receive NodeContext as parameter | [ ] |

**NodeContext Interface:**

```typescript
interface NodeContext {
  tenantId: string
  tenantSlug: string
  locale: "en" | "fr" | "ar"
  channel: "web" | "mobile" | "api" | "kiosk" | "internal"
  nodeId?: string
  nodeType?: "CITY" | "DISTRICT" | "ZONE" | "FACILITY" | "ASSET"
  sessionId?: string
  userId?: string
  personaId?: string
  residencyZone?: "GCC" | "EU" | "MENA" | "APAC" | "AMERICAS" | "GLOBAL"
}
```

### 1.6 Sales Channel → CMS Channel Mapping

| Task | Description | Status |
|------|-------------|--------|
| 1.6.1 | Create 5 Medusa sales channels matching CMS channel types: `web`, `mobile`, `api`, `kiosk`, `internal` | [ ] |
| 1.6.2 | Add `cmsChannelType` metadata to each sales channel | [ ] |
| 1.6.3 | Link products to appropriate sales channels based on tenant config | [ ] |
| 1.6.4 | Storefront passes channel type in NodeContext headers | [ ] |

### 1.7 Region → Residency Zone Mapping

| Task | Description | Status |
|------|-------------|--------|
| 1.7.1 | Add `residencyZone` metadata to Medusa regions | [ ] |
| 1.7.2 | Map existing regions (US, GB, SA) to residency zones (AMERICAS, EU, GCC) | [ ] |
| 1.7.3 | Create additional regions for MENA, APAC, GLOBAL zones | [ ] |
| 1.7.4 | Validate that tenant's residencyZone matches linked region's zone | [ ] |

---

## Phase 2: Node Hierarchy & Governance Integration

**Priority:** HIGH
**Estimated effort:** Large
**Dependencies:** Phase 1 complete

### 2.1 Node Hierarchy Module

| Task | Description | Status |
|------|-------------|--------|
| 2.1.1 | Create `node` custom Medusa module with 5-level hierarchy model | [ ] |
| 2.1.2 | Define `Node` model: id, name, slug, type (CITY/DISTRICT/ZONE/FACILITY/ASSET), parentId, tenantId, depth, breadcrumbs[], metadata | [ ] |
| 2.1.3 | Implement hierarchy validation: enforce `NODE_HIERARCHY_RULES` (CITY→DISTRICT→ZONE→FACILITY→ASSET parent/child rules) | [ ] |
| 2.1.4 | Implement `getAncestorNodes(nodeId)` — walk up to root | [ ] |
| 2.1.5 | Implement `getDescendantNodes(nodeId)` — walk down to leaves | [ ] |
| 2.1.6 | Implement `getBreadcrumbs(nodeId)` — return path from root | [ ] |
| 2.1.7 | Create API endpoints: `GET /store/nodes`, `GET /store/nodes/:id`, `GET /store/nodes/:id/children` | [ ] |
| 2.1.8 | Seed sample node hierarchy: 1 CITY → 2 DISTRICTs → 4 ZONEs → 8 FACILITYs → 16 ASSETs | [ ] |

### 2.2 Commerce Entity → Node Scoping

| Task | Description | Status |
|------|-------------|--------|
| 2.2.1 | Add `nodeId` + `nodeType` to Medusa Store/StockLocation model (FACILITY level) | [ ] |
| 2.2.2 | Add `nodeId` to Product model for catalog scoping (CITY or higher) | [ ] |
| 2.2.3 | Add `nodeId` to Inventory/StockLocation for warehouse scoping (FACILITY or ZONE) | [ ] |
| 2.2.4 | Add `nodeId` to Pricing rules for zone-specific pricing (ZONE or higher) | [ ] |
| 2.2.5 | Add `nodeId` to Booking model for facility/asset booking (FACILITY/ASSET) | [ ] |
| 2.2.6 | Add `nodeId` to Fulfillment for center scoping (FACILITY) | [ ] |
| 2.2.7 | Implement node-scoped query filtering: "show products available in this zone and below" | [ ] |
| 2.2.8 | Implement node inheritance: products at CITY level visible to all zones/facilities below | [ ] |

### 2.3 Governance Authority Module

| Task | Description | Status |
|------|-------------|--------|
| 2.3.1 | Create `governance` custom Medusa module | [ ] |
| 2.3.2 | Define `GovernanceAuthority` model: id, name, slug, code, type, jurisdictionLevel, parentAuthorityId, countryId, tenantId, policies (JSON) | [ ] |
| 2.3.3 | Implement authority chain resolution: `buildAuthorityChain(authorityId)` → ancestor array | [ ] |
| 2.3.4 | Implement policy inheritance: `resolveEffectivePolicies(tenantId)` with deep merge | [ ] |
| 2.3.5 | Define commerce policy schema within governance policies | [ ] |
| 2.3.6 | Seed sample governance chain: Region(GCC) → Country(SA) → Authority(SDAIA) | [ ] |

**Commerce Policy Schema (within governance):**

```typescript
{
  commerce: {
    vatRate: number                      // 0.15 for SA
    restrictedCategories: string[]       // ["alcohol", "gambling"]
    paymentProviders: string[]           // ["mada", "stcpay"]
    maxRefundDays: number                // 14
    requiresInvoice: boolean             // true
    dataRetentionDays: number            // 730
    crossBorderAllowed: boolean          // false for GCC
    localStorageRequired: boolean        // true for GCC
    minimumDataClassification: string    // "CONFIDENTIAL" for GCC
  }
}
```

### 2.4 Policy-Driven Commerce Rules

| Task | Description | Status |
|------|-------------|--------|
| 2.4.1 | Apply `restrictedCategories` filter to product catalog queries | [ ] |
| 2.4.2 | Apply `vatRate` from governance to pricing calculations | [ ] |
| 2.4.3 | Filter available `paymentProviders` based on governance chain | [ ] |
| 2.4.4 | Enforce `maxRefundDays` in refund workflow | [ ] |
| 2.4.5 | Auto-generate invoices when `requiresInvoice = true` | [ ] |
| 2.4.6 | Enforce `crossBorderAllowed` in checkout (prevent cross-zone orders when false) | [ ] |

---

## Phase 3: Persona System & Catalog Intelligence

**Priority:** HIGH
**Estimated effort:** Large
**Dependencies:** Phase 1 + Phase 2

### 3.1 Persona Module

| Task | Description | Status |
|------|-------------|--------|
| 3.1.1 | Create `persona` custom Medusa module | [ ] |
| 3.1.2 | Define `Persona` model with 6-axis values | [ ] |
| 3.1.3 | Define `PersonaAssignment` model: userId, personaId, scope (session/surface/membership/user-default/tenant-default), priority, status | [ ] |
| 3.1.4 | Implement `resolvePersona(assignments[])` — 5-level precedence resolution | [ ] |
| 3.1.5 | Implement `mergePersonaConstraints(personas[])` — most restrictive wins | [ ] |
| 3.1.6 | Create API endpoints: `GET /store/personas`, `GET /store/personas/resolve` | [ ] |
| 3.1.7 | Seed personas: consumer-resident, consumer-visitor, consumer-luxury, business-sme, business-enterprise, government-inspector | [ ] |

**Persona Model:**

```typescript
Persona {
  id: string
  name: string
  slug: string
  tenantId: string
  category: "consumer" | "creator" | "business" | "cityops" | "platform"
  axes: {
    audience: string[]       // ["resident", "luxury"]
    economic: string[]       // ["consumer"]
    ecosystem: string[]      // []
    government: string[]     // []
    interaction: string[]    // ["discovery"]
    aiMode: string[]         // ["concierge"]
  }
  constraints: {
    kidSafe: boolean
    readOnly: boolean
    geoScope: "facility" | "zone" | "district" | "city" | "global"
    maxDataClassification: "public" | "internal" | "confidential" | "restricted"
  }
  allowedWorkflows: string[]
  allowedTools: string[]
  allowedSurfaces: string[]  // ["consumer-app", "partner-portal", "admin-console", "kiosk", "api"]
  featureOverrides: Record<string, boolean>
}
```

### 3.2 Persona-Aware Catalog

| Task | Description | Status |
|------|-------------|--------|
| 3.2.1 | Add `personaVisibility` field to Product model (which persona categories can see it) | [ ] |
| 3.2.2 | Add `kidSafe` boolean to Product model (age-restricted content flag) | [ ] |
| 3.2.3 | Add `geoScope` to Product model (at which node level is this product available) | [ ] |
| 3.2.4 | Implement catalog filtering by resolved persona constraints | [ ] |
| 3.2.5 | When `kidSafe = true`, exclude products with `kidSafe = false` | [ ] |
| 3.2.6 | When `readOnly = true`, disable add-to-cart and checkout | [ ] |
| 3.2.7 | Filter products by `geoScope` intersection with user's node context | [ ] |

### 3.3 Persona-Aware Pricing

| Task | Description | Status |
|------|-------------|--------|
| 3.3.1 | Add persona-based pricing rules: different prices for different persona categories | [ ] |
| 3.3.2 | Implement audience-based pricing tiers (student discount, senior discount, luxury markup) | [ ] |
| 3.3.3 | Implement economic-based pricing (B2C vs B2B vs wholesale) | [ ] |
| 3.3.4 | Integrate persona pricing with volume-pricing module | [ ] |
| 3.3.5 | Storefront shows persona-appropriate prices after resolution | [ ] |

### 3.4 Persona-Aware Promotions

| Task | Description | Status |
|------|-------------|--------|
| 3.4.1 | Add `eligiblePersonas` field to Medusa promotion rules | [ ] |
| 3.4.2 | Filter active promotions by resolved persona | [ ] |
| 3.4.3 | Display persona-specific promotional banners on storefront | [ ] |
| 3.4.4 | Apply persona-scoped discount codes at checkout | [ ] |

---

## Phase 4: Centralized Design System

**Priority:** HIGH
**Estimated effort:** Large
**Dependencies:** Phase 1 (tenant routing required for tenant-specific theming)

### 4.1 Design Token Package

Create a shared design token package mirroring the CMS `@dakkah-cityos/cityos-design-tokens` structure.

| Task | Description | Status |
|------|-------------|--------|
| 4.1.1 | Create `packages/cityos-design-tokens/` package in monorepo | [ ] |
| 4.1.2 | Define **Color Tokens**: primary, primaryForeground, secondary, secondaryForeground, accent, accentForeground, background, foreground, muted, mutedForeground, card, cardForeground, border, input, ring, destructive, destructiveForeground, success, successForeground, warning, warningForeground, info, infoForeground | [ ] |
| 4.1.3 | Define **Spacing Tokens**: xs (0.25rem), sm (0.5rem), md (1rem), lg (1.5rem), xl (2rem), 2xl (3rem), 3xl (4rem), 4xl (6rem) | [ ] |
| 4.1.4 | Define **Typography Tokens**: fontFamily (sans, serif, mono), fontSize (xs through 5xl), fontWeight (light, normal, medium, semibold, bold), lineHeight (tight, snug, normal, relaxed, loose) | [ ] |
| 4.1.5 | Define **Shadow Tokens**: none, sm, md, lg, xl, 2xl, inner | [ ] |
| 4.1.6 | Define **Border Tokens**: radius (none, sm, md, lg, xl, 2xl, full), width (0, 1, 2, 4, 8) | [ ] |
| 4.1.7 | Define **Breakpoint Tokens**: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px) | [ ] |
| 4.1.8 | Export all tokens as TypeScript constants + CSS custom properties | [ ] |
| 4.1.9 | Add unit tests for all token definitions | [ ] |

### 4.2 Design Runtime Package

Create a theme runtime mirroring `@dakkah-cityos/cityos-design-runtime`.

| Task | Description | Status |
|------|-------------|--------|
| 4.2.1 | Create `packages/cityos-design-runtime/` package in monorepo | [ ] |
| 4.2.2 | Define `Theme` interface: name, mode (light/dark/system), colors, spacing, typography, shadows, borders | [ ] |
| 4.2.3 | Implement `lightTheme` preset — default light theme with all token values | [ ] |
| 4.2.4 | Implement `darkTheme` preset — dark mode with inverted colors | [ ] |
| 4.2.5 | Implement `createTheme(options)` — factory function to create custom themes with overrides | [ ] |
| 4.2.6 | Implement `mergeThemes(base, override)` — deep merge two themes | [ ] |
| 4.2.7 | Implement `extendTheme(base, extensions)` — extend a theme with additional tokens | [ ] |
| 4.2.8 | Implement `ThemeContext` React context + `ThemeProvider` component | [ ] |
| 4.2.9 | Implement `useTheme()` hook for consuming theme in components | [ ] |
| 4.2.10 | Implement CSS variable generation from theme object | [ ] |
| 4.2.11 | Support tenant-specific theme overrides (loaded from tenant.branding) | [ ] |
| 4.2.12 | Add unit tests for theme creation, merging, and extension | [ ] |

### 4.3 Design System Package

Create component type contracts mirroring `@dakkah-cityos/cityos-design-system`.

| Task | Description | Status |
|------|-------------|--------|
| 4.3.1 | Create `packages/cityos-design-system/` package in monorepo | [ ] |
| 4.3.2 | Define **Form component types**: Button, Input, Select, Checkbox, Radio, Toggle, DatePicker, TimePicker, FileUpload, Form, Label, Textarea | [ ] |
| 4.3.3 | Define **Layout component types**: Container, Grid, Stack, Flex, Spacer, Divider, Card, Section, AspectRatio | [ ] |
| 4.3.4 | Define **Data Display component types**: Table, List, Badge, Avatar, Tag, Stat, Progress, Skeleton, DataGrid | [ ] |
| 4.3.5 | Define **Navigation component types**: Navbar, Sidebar, Tabs, Breadcrumb, Pagination, Menu, Link, StepIndicator | [ ] |
| 4.3.6 | Define **Feedback component types**: Alert, Toast, Spinner, Modal, Drawer, Tooltip, Popover, Banner, EmptyState | [ ] |
| 4.3.7 | Define **Utility types**: Animation, Transition, Responsive, Accessible, RTLAware | [ ] |
| 4.3.8 | Export all component type contracts for consumption by implementations | [ ] |

### 4.4 Integrate Design System with Storefront

| Task | Description | Status |
|------|-------------|--------|
| 4.4.1 | Replace hardcoded `theme.css` variables with design token imports | [ ] |
| 4.4.2 | Update `tailwind.config.ts` to consume design tokens for colors, spacing, typography, borders, shadows | [ ] |
| 4.4.3 | Replace `app.css` component styles with design-system-aligned classes | [ ] |
| 4.4.4 | Wrap storefront root with `ThemeProvider` from design-runtime | [ ] |
| 4.4.5 | Implement tenant-specific theme loading in `ThemeProvider` (fetch tenant.branding, create theme, apply) | [ ] |
| 4.4.6 | Add dark mode toggle using theme system | [ ] |
| 4.4.7 | Implement RTL layout support for Arabic locale (dir="rtl", mirrored spacing, RTL-aware components) | [ ] |
| 4.4.8 | Update Navbar to use design system tokens | [ ] |
| 4.4.9 | Update Footer to use design system tokens | [ ] |
| 4.4.10 | Update product cards to use design system tokens | [ ] |
| 4.4.11 | Update checkout flow to use design system tokens | [ ] |
| 4.4.12 | Update account pages to use design system tokens | [ ] |

### 4.5 Design Studio (Internal Tool)

| Task | Description | Status |
|------|-------------|--------|
| 4.5.1 | Plan Design Studio scope: token browser, theme editor, component playground | [ ] |
| 4.5.2 | Token browser: visual display of all color, spacing, typography, shadow, border tokens | [ ] |
| 4.5.3 | Theme editor: create/edit tenant themes with live preview | [ ] |
| 4.5.4 | Component playground: preview components with different theme/token configurations | [ ] |
| 4.5.5 | Theme exporter: export theme as CSS variables, Tailwind config, or JSON | [ ] |

---

## Phase 5: Event System & Workflow Orchestration

**Priority:** MEDIUM
**Estimated effort:** Medium
**Dependencies:** Phase 1 + Phase 2

### 5.1 CMS-Compatible Event Envelopes

| Task | Description | Status |
|------|-------------|--------|
| 5.1.1 | Define CMS outbox event envelope schema: `{ eventId, eventType, tenantId, nodeContext, timestamp, payload, source: "medusa", version }` | [ ] |
| 5.1.2 | Create Medusa subscriber that wraps events in CMS-compatible envelopes | [ ] |
| 5.1.3 | Emit `commerce.order.created` events with full NodeContext | [ ] |
| 5.1.4 | Emit `commerce.order.completed` events | [ ] |
| 5.1.5 | Emit `commerce.product.created` / `commerce.product.updated` events | [ ] |
| 5.1.6 | Emit `commerce.customer.registered` events | [ ] |
| 5.1.7 | Emit `commerce.payment.captured` events with residency zone info | [ ] |
| 5.1.8 | Emit `commerce.refund.processed` events | [ ] |
| 5.1.9 | Create event outbox table for reliable delivery | [ ] |
| 5.1.10 | Implement outbox polling/publishing mechanism | [ ] |

### 5.2 Medusa Workflows with NodeContext

| Task | Description | Status |
|------|-------------|--------|
| 5.2.1 | Ensure all Medusa workflow steps receive `NodeContext` as input | [ ] |
| 5.2.2 | Add governance policy validation step to order workflows | [ ] |
| 5.2.3 | Add residency zone enforcement step to payment workflows | [ ] |
| 5.2.4 | Add persona constraint check step to checkout workflow | [ ] |
| 5.2.5 | Create commerce refund saga workflow (matching CMS dakkah-cityos-workflow pattern) | [ ] |
| 5.2.6 | Create inventory refresh workflow triggered by node hierarchy changes | [ ] |
| 5.2.7 | Emit audit events at end of each workflow step | [ ] |

### 5.3 System Registry Integration

| Task | Description | Status |
|------|-------------|--------|
| 5.3.1 | Register Medusa as a system in CMS SystemRegistry format | [ ] |
| 5.3.2 | Define capabilities: `["products", "orders", "carts", "payments", "fulfillment", "inventory", "pricing", "promotions"]` | [ ] |
| 5.3.3 | Define health check endpoint for CMS monitoring | [ ] |
| 5.3.4 | Define supported event types for CMS subscription | [ ] |

---

## Phase 6: Compliance, Security & Data Classification

**Priority:** MEDIUM
**Estimated effort:** Medium
**Dependencies:** Phase 2 (governance), Phase 1 (residency zones)

### 6.1 Data Classification

| Task | Description | Status |
|------|-------------|--------|
| 6.1.1 | Add `dataClassification` field to all commerce entities: PUBLIC, INTERNAL, CONFIDENTIAL, RESTRICTED | [ ] |
| 6.1.2 | Auto-classify: product catalog = PUBLIC, customer profiles = INTERNAL, payment info = CONFIDENTIAL, financial reports = RESTRICTED | [ ] |
| 6.1.3 | Implement `canAccessClassification(userRoles, classification)` check | [ ] |
| 6.1.4 | Enforce minimum classification per residency zone | [ ] |
| 6.1.5 | Block RESTRICTED data access for non-admin roles | [ ] |

### 6.2 RBAC Role Mapping

| Task | Description | Status |
|------|-------------|--------|
| 6.2.1 | Map CMS 10-role hierarchy to Medusa admin roles | [ ] |
| 6.2.2 | Implement `hasNodeAccess(userId, nodeId, requiredRole)` for commerce operations | [ ] |
| 6.2.3 | Implement `hasNodeScopedWriteAccess` for commerce write operations | [ ] |
| 6.2.4 | Zone-operator can manage commerce at ZONE level and below | [ ] |
| 6.2.5 | Facility-operator can manage at FACILITY level and below | [ ] |
| 6.2.6 | City-manager has commerce access across all nodes in their CITY | [ ] |
| 6.2.7 | Auditor can view transaction data up to CONFIDENTIAL level | [ ] |

### 6.3 Residency Zone Enforcement

| Task | Description | Status |
|------|-------------|--------|
| 6.3.1 | Payment routing by zone: GCC → local gateway, EU → EU Stripe, etc. | [ ] |
| 6.3.2 | Prevent cross-border payment processing for GCC and EU zones | [ ] |
| 6.3.3 | Enforce local storage requirements for GCC/EU order data | [ ] |
| 6.3.4 | Add PSD2/SCA compliance flag for EU zone payments | [ ] |
| 6.3.5 | Log all cross-zone data access attempts for audit | [ ] |

### 6.4 Audit Trail

| Task | Description | Status |
|------|-------------|--------|
| 6.4.1 | Create audit log table: eventType, userId, tenantId, nodeId, entityType, entityId, action, before/after, timestamp, ipAddress | [ ] |
| 6.4.2 | Log all write operations (create, update, delete) on commerce entities | [ ] |
| 6.4.3 | Log all access to CONFIDENTIAL and RESTRICTED data | [ ] |
| 6.4.4 | Log all cross-tenant access attempts (should be denied) | [ ] |
| 6.4.5 | Implement audit log query API for compliance-officer and auditor roles | [ ] |

---

## Phase 7: Advanced Commerce Features

**Priority:** LOWER
**Estimated effort:** Large
**Dependencies:** Phases 1-3

### 7.1 Localization (i18n)

| Task | Description | Status |
|------|-------------|--------|
| 7.1.1 | Set up i18n framework in storefront (react-i18next or similar) | [ ] |
| 7.1.2 | Create translation files for English, French, Arabic | [ ] |
| 7.1.3 | Implement RTL layout switching for Arabic (`dir="rtl"`) | [ ] |
| 7.1.4 | Localize product names and descriptions (from CMS localized fields) | [ ] |
| 7.1.5 | Localize checkout flow labels and error messages | [ ] |
| 7.1.6 | Localize email templates (order confirmation, shipping updates) | [ ] |
| 7.1.7 | Currency formatting per locale/region | [ ] |
| 7.1.8 | Date formatting per locale/timezone | [ ] |
| 7.1.9 | Language switcher component in storefront header | [ ] |
| 7.1.10 | Persist locale preference in user profile and cookie | [ ] |

### 7.2 Multi-Tenant Storefront Customization

| Task | Description | Status |
|------|-------------|--------|
| 7.2.1 | Tenant-specific logo in navbar | [ ] |
| 7.2.2 | Tenant-specific footer content | [ ] |
| 7.2.3 | Tenant-specific favicon | [ ] |
| 7.2.4 | Tenant-specific meta tags (title, description, OG) | [ ] |
| 7.2.5 | Tenant-specific home page hero section | [ ] |
| 7.2.6 | Tenant-specific product collections/categories | [ ] |
| 7.2.7 | Domain-based tenant resolution (custom domains) | [ ] |
| 7.2.8 | Wildcard subdomain tenant resolution (*.dakkah.com) | [ ] |

### 7.3 CMS Page Integration

| Task | Description | Status |
|------|-------------|--------|
| 7.3.1 | Fetch CMS pages via Payload API for dynamic content | [ ] |
| 7.3.2 | Render CMS page blocks (hero, content, gallery, form) in storefront | [ ] |
| 7.3.3 | Implement CMS-driven navigation menus | [ ] |
| 7.3.4 | Implement CMS-driven banner/announcement system | [ ] |
| 7.3.5 | Support CMS draft/preview mode for content editors | [ ] |

### 7.4 POI (Point of Interest) Integration

| Task | Description | Status |
|------|-------------|--------|
| 7.4.1 | Map Medusa products to CMS POI catalog entries | [ ] |
| 7.4.2 | Display POI-linked products on store pages with location context | [ ] |
| 7.4.3 | Enable "find near me" product search using POI geolocation | [ ] |
| 7.4.4 | Show facility/asset node context for pickup/booking products | [ ] |

---

## Phase 8: Quality, Testing & Documentation

**Priority:** ONGOING
**Estimated effort:** Medium (ongoing)
**Dependencies:** All phases

### 8.1 Testing

| Task | Description | Status |
|------|-------------|--------|
| 8.1.1 | Unit tests for tenant resolution and isolation | [ ] |
| 8.1.2 | Unit tests for node hierarchy validation | [ ] |
| 8.1.3 | Unit tests for governance policy inheritance (deep merge) | [ ] |
| 8.1.4 | Unit tests for persona resolution (5-level precedence) | [ ] |
| 8.1.5 | Unit tests for design token exports | [ ] |
| 8.1.6 | Unit tests for theme creation and merging | [ ] |
| 8.1.7 | Integration tests for tenant-scoped API calls | [ ] |
| 8.1.8 | Integration tests for node-scoped product queries | [ ] |
| 8.1.9 | Integration tests for persona-filtered catalog | [ ] |
| 8.1.10 | E2E tests for tenant + locale routing | [ ] |
| 8.1.11 | E2E tests for checkout with governance policies | [ ] |
| 8.1.12 | E2E tests for multi-tenant isolation (can't see other tenant's data) | [ ] |

### 8.2 Documentation

| Task | Description | Status |
|------|-------------|--------|
| 8.2.1 | API documentation for all new endpoints (tenant, node, persona, governance) | [ ] |
| 8.2.2 | Architecture decision records (ADRs) for key design choices | [ ] |
| 8.2.3 | Developer guide: how to add a new tenant | [ ] |
| 8.2.4 | Developer guide: how to extend the node hierarchy | [ ] |
| 8.2.5 | Developer guide: how to create a new persona | [ ] |
| 8.2.6 | Developer guide: how to use the design system | [ ] |
| 8.2.7 | Runbook: deployment and environment setup | [ ] |
| 8.2.8 | Update replit.md with all architecture changes | [ ] |

### 8.3 Contract Verification

| Task | Description | Status |
|------|-------------|--------|
| 8.3.1 | Verify NodeContext interface matches CMS `cityos-core` contract | [ ] |
| 8.3.2 | Verify tenant schema matches CMS Tenants collection | [ ] |
| 8.3.3 | Verify node hierarchy matches CMS `node-types.ts` rules | [ ] |
| 8.3.4 | Verify RBAC roles match CMS `roles.ts` (10 roles, correct levels) | [ ] |
| 8.3.5 | Verify persona axes match CMS persona collection (6 axes, correct values) | [ ] |
| 8.3.6 | Verify event envelope matches CMS outbox schema | [ ] |
| 8.3.7 | Verify residency zones match CMS `residency.ts` (6 zones, correct rules) | [ ] |
| 8.3.8 | Verify design tokens match CMS `cityos-design-tokens` package | [ ] |

---

## Dependency Map

```
Phase 1: Foundation (Tenant + Routing)
  │
  ├──► Phase 2: Node Hierarchy + Governance
  │      │
  │      ├──► Phase 3: Persona System
  │      │      │
  │      │      └──► Phase 7: Advanced Features
  │      │
  │      ├──► Phase 5: Events + Workflows
  │      │
  │      └──► Phase 6: Compliance + Security
  │
  └──► Phase 4: Design System (parallel with Phase 2)
         │
         └──► Phase 7.2: Multi-Tenant Customization

Phase 8: Quality + Testing (runs in parallel with all phases)
```

### Critical Path

```
1.1 (Tenant Schema) → 1.3 (tenantId enforcement) → 1.4 (Routing) → 1.5 (NodeContext)
                                                                         │
                                                                         ▼
                                                     2.1 (Node Hierarchy) → 2.2 (Entity Scoping)
                                                                         │
                                                                         ▼
                                                     3.1 (Persona Module) → 3.2 (Catalog)
```

---

## Risk Register

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Medusa v2 does not natively support multi-tenant isolation | High | Medium | Use custom middleware + link modules for tenantId scoping |
| Breaking existing storefront routes during migration | High | Medium | Implement backward-compatible redirects; keep old routes temporarily |
| Performance degradation with tenant + node + persona filtering on every query | Medium | Medium | Add database indexes; implement caching layers; optimize query patterns |
| Design token drift between CMS and commerce | Medium | Low | Share `cityos-design-tokens` package via git submodule or npm |
| Governance policy deep merge conflicts | Medium | Low | Define clear merge precedence rules; add conflict detection |
| RTL layout complexity for Arabic | Medium | Medium | Use CSS logical properties; test with RTL-first approach |
| Residency zone payment routing complexity | High | Low | Start with zone-aware metadata; implement actual routing incrementally |
| Custom Medusa module schema migrations | Medium | Medium | Use Medusa's migration system; test migrations on staging first |

---

## Summary Statistics

| Metric | Count |
|--------|-------|
| Total Phases | 8 |
| Total Task Groups | 33 |
| Total Individual Tasks | ~200 |
| Critical Priority Phases | 2 (Phase 1, Phase 4) |
| High Priority Phases | 2 (Phase 2, Phase 3) |
| Medium Priority Phases | 2 (Phase 5, Phase 6) |
| Lower Priority Phases | 1 (Phase 7) |
| Ongoing Phases | 1 (Phase 8) |

---

> **Next Steps:** Begin Phase 1.1 (Tenant Schema Alignment) and Phase 4.1 (Design Token Package) in parallel. These are the two foundational blocks that unblock all downstream work.
