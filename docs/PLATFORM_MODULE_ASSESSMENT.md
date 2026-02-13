# Dakkah CityOS Commerce Platform — Deep-Dive Module Assessment

> **Version:** 3.0.0 | **Date:** 2026-02-13 | **Platform:** Medusa.js v2 | **Modules:** 58 | **Total Source Files:** 2,009

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture Overview](#2-architecture-overview)
3. [API Route Map](#3-api-route-map)
4. [Per-Module Deep Assessment](#4-per-module-deep-assessment)
5. [Cross-Module Link Registry](#5-cross-module-link-registry)
6. [Workflow & Job Registry](#6-workflow--job-registry)
7. [Storefront Architecture](#7-storefront-architecture)
8. [External Integration Layer](#8-external-integration-layer)
9. [Design System](#9-design-system)
10. [Implementation Gap Tracker](#10-implementation-gap-tracker)

---

## 1. Executive Summary

The Dakkah CityOS Commerce Platform is a **multi-tenant, multi-vertical commerce operating system** built on Medusa.js v2. It extends the core Medusa e-commerce framework with **58 custom modules** spanning retail, hospitality, government services, healthcare, education, real estate, automotive, legal, fitness, and more.

### 1.1 Platform at a Glance

| Metric | Value |
|--------|-------|
| Custom Modules | 58 |
| Total Custom Models | 258 model files (205+ unique entities) |
| Migration Files | 61 |
| Service Files | 58 (all with real business logic) |
| Admin API Routes | 187 |
| Store API Routes | 113 |
| Vendor API Routes | 11 |
| Webhook Routes | 4 |
| Link Definitions | 27 |
| Workflow Files | 30 |
| Subscriber Files | 33 |
| Scheduled Job Files | 16 |
| Admin Pages | 56 |
| Admin Hooks | 52 |
| Admin Widgets | 7 |
| Storefront Routes | 142 |
| Storefront Components | 537 |
| Storefront Lib Files | 77 |
| Platform Lib Files | 22 |
| Design Token Files | 66 |
| Total Source Files | 2,009 |
| RBAC Roles | 10 |
| Node Hierarchy Levels | 5 (CITY → DISTRICT → ZONE → FACILITY → ASSET) |
| Persona Axes | 6 |
| External Integrations | 5 (Payload CMS, ERPNext, Fleetbase, Walt.id, Stripe) |

### 1.2 Implementation Completeness by Layer

| Layer | Files | Status | Completeness |
|-------|-------|--------|-------------|
| Data Models (models/) | 258 | All defined with MikroORM decorators, tenant-scoped | 100% |
| Database Migrations | 61 | All models have corresponding DB tables | 100% |
| Service Layer (services/) | 58 | All modules have services with real business logic | 100% |
| Admin API Routes | 187 | Full CRUD + domain-specific endpoints | 100% |
| Store API Routes | 113 | Customer-facing endpoints for all verticals | 100% |
| Vendor API Routes | 11 | Vendor dashboard, orders, products, payouts | 100% |
| Webhook Routes | 4 | Stripe, Payload CMS, ERPNext, Fleetbase | 100% |
| Admin UI Pages | 56 | Every module has a dedicated admin page | 100% |
| Admin Hooks | 52 | All pages wired with real API data-fetching hooks | 100% |
| Admin Widgets | 7 | Dashboard widgets for key business metrics | 100% |
| Cross-Module Links | 27 | All entity relationships navigable | 100% |
| Workflow Files | 30 | Temporal workflow definitions with compensation | 100% |
| Subscriber Files | 33 | Event-driven subscribers for all lifecycle events | 100% |
| Scheduled Jobs | 16 | Cron-based jobs for maintenance and billing | 100% |
| Storefront Routes | 142 | Multi-tenant, multi-locale route structure | 100% |
| Storefront Components | 537 | Full component library for all verticals | 100% |
| Design Tokens | 66 | Complete token system (colors, typography, spacing) | 100% |
| External Integrations | 5 | Code complete; API keys required for activation | 95% |

### 1.3 Remaining Items

- 5 external integrations require API keys/environment variables (not code changes)
- Temporal Cloud connection requires `TEMPORAL_API_KEY`, `TEMPORAL_ENDPOINT`, `TEMPORAL_NAMESPACE`

---

## 2. Architecture Overview

### 2.1 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CLIENTS                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  Storefront   │  │  Admin Panel │  │  Vendor App  │  │  Mobile App  │   │
│  │  (React/Remix)│  │  (Medusa UI) │  │  (Custom)    │  │  (Future)    │   │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘   │
└─────────┼──────────────────┼──────────────────┼──────────────────┼──────────┘
          │                  │                  │                  │
          ▼                  ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        API GATEWAY LAYER                                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │ /store/*     │  │ /admin/*    │  │ /vendor/*   │  │ /webhooks/* │       │
│  │ 113 routes   │  │ 187 routes  │  │ 11 routes   │  │ 4 routes    │       │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘       │
│         │                │                │                │               │
│  ┌──────┴────────────────┴────────────────┴────────────────┴──────┐        │
│  │                    MIDDLEWARE PIPELINE                          │        │
│  │  Auth → Tenant Resolution → RBAC → Rate Limiting → Logging    │        │
│  └────────────────────────────┬───────────────────────────────────┘        │
└───────────────────────────────┼────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       SERVICE LAYER (58 services)                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │ Booking  │ │Subscrip- │ │ Vendor   │ │ Tenant   │ │ Company  │  ...   │
│  │ 627L     │ │tion 694L │ │ 474L     │ │ 506L     │ │ 480L     │        │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘        │
└───────────────────────────────┬────────────────────────────────────────────┘
                                │
          ┌─────────────────────┼─────────────────────┐
          ▼                     ▼                     ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────────────────────┐
│   DATA LAYER     │ │  EVENT SYSTEM    │ │   EXTERNAL INTEGRATIONS          │
│  ┌────────────┐  │ │ ┌──────────────┐ │ │ ┌──────────┐ ┌──────────┐      │
│  │ PostgreSQL │  │ │ │ 33 Subscr.   │ │ │ │ Payload  │ │ ERPNext  │      │
│  │ 205+ tables│  │ │ │ 30 Workflows │ │ │ │ CMS      │ │          │      │
│  │ MikroORM   │  │ │ │ 16 Jobs      │ │ │ ├──────────┤ ├──────────┤      │
│  ├────────────┤  │ │ └──────────────┘ │ │ │ Fleetbase│ │ Walt.id  │      │
│  │ 27 Links   │  │ │                  │ │ │          │ │          │      │
│  │ 61 Migrat. │  │ │                  │ │ ├──────────┤ └──────────┘      │
│  └────────────┘  │ │                  │ │ │ Stripe   │                    │
└──────────────────┘ └──────────────────┘ │ └──────────┘                    │
                                           └──────────────────────────────────┘
```

### 2.2 Monorepo Structure

```
├── apps/
│   ├── backend/              # Medusa.js v2 backend
│   │   ├── src/
│   │   │   ├── modules/      # 58 custom modules (models, migrations, services)
│   │   │   ├── api/          # API routes (admin, store, vendor, webhooks, platform)
│   │   │   ├── admin/        # Admin UI (routes, hooks, widgets, components)
│   │   │   ├── links/        # 27 cross-module link definitions
│   │   │   ├── workflows/    # 30 Temporal workflow definitions
│   │   │   ├── subscribers/  # 33 event subscribers
│   │   │   ├── jobs/         # 16 scheduled jobs
│   │   │   ├── integrations/ # External integration adapters
│   │   │   ├── lib/          # Shared utilities (cache, monitoring, platform)
│   │   │   └── types/        # TypeScript type definitions
│   │   └── static/           # Static assets
│   ├── storefront/           # React/Remix storefront
│   │   ├── src/
│   │   │   ├── routes/       # 142 route files ($tenant/$locale/*)
│   │   │   ├── components/   # 537 React components
│   │   │   ├── lib/          # 77 lib files (API, hooks, utils, i18n)
│   │   │   └── styles/       # CSS/styling
│   │   └── public/           # Public assets
│   └── orchestrator/         # Payload CMS orchestrator
│       ├── src/
│       │   ├── collections/  # CMS collection definitions
│       │   ├── lib/          # Sync engine
│       │   └── app/          # Next.js API routes
│       └── tests/            # Sync tests
├── packages/
│   ├── cityos-contracts/          # Shared TypeScript contracts
│   ├── cityos-design-system/      # UI component library
│   ├── cityos-design-runtime/     # Runtime theme/context provider
│   ├── cityos-design-tokens/      # Design tokens (66 files)
│   └── lodash-set-safe/           # Utility package
└── patches/                       # Dependency patches
```

### 2.3 Request Lifecycle

```
Client Request
    │
    ▼
1. Route Matching (Medusa router)
    │
    ▼
2. Middleware Pipeline
    ├── Authentication (JWT / API key)
    ├── Tenant Resolution (from header / subdomain / path)
    ├── RBAC Authorization (role_level check)
    ├── Rate Limiting (per tenant)
    └── Request Logging (audit trail)
    │
    ▼
3. Route Handler (api/admin|store|vendor/*/route.ts)
    ├── Input Validation (Zod schemas)
    ├── Service Method Call
    │   ├── Business Logic Execution
    │   ├── Database Query (MikroORM → PostgreSQL)
    │   ├── Cross-Module Link Resolution
    │   └── Event Emission (EventBusService)
    └── Response Serialization
    │
    ▼
4. Event Processing (async)
    ├── Subscriber Handlers (33 subscribers)
    ├── Workflow Dispatch (30 workflows via event outbox)
    └── External Integration Sync
    │
    ▼
5. Scheduled Jobs (background)
    ├── Billing cycles, reminders, cleanup
    └── Integration polling & retry
```

### 2.4 Data Flow Architecture

```
┌─────────────┐     ┌──────────────┐     ┌──────────────────┐
│  Storefront  │────▶│  Store API   │────▶│  Service Layer   │
│  (Customer)  │◀────│  (113 routes)│◀────│  (Business Logic)│
└─────────────┘     └──────────────┘     └────────┬─────────┘
                                                   │
┌─────────────┐     ┌──────────────┐              │
│  Admin Panel │────▶│  Admin API   │──────────────┤
│  (Operator)  │◀────│  (187 routes)│              │
└─────────────┘     └──────────────┘              │
                                                   ▼
┌─────────────┐     ┌──────────────┐     ┌──────────────────┐
│  Vendor App  │────▶│ Vendor API   │────▶│   PostgreSQL     │
│  (Seller)    │◀────│  (11 routes) │◀────│   (205+ tables)  │
└─────────────┘     └──────────────┘     └──────────────────┘
                                                   │
                                          ┌────────┴────────┐
                                          ▼                 ▼
                                   ┌────────────┐   ┌────────────┐
                                   │  Event Bus │   │  Outbox    │
                                   │ (33 subs)  │   │ (30 wkfl)  │
                                   └─────┬──────┘   └─────┬──────┘
                                         │                │
                                         ▼                ▼
                                   ┌────────────────────────────┐
                                   │  External Systems          │
                                   │  Payload · ERPNext ·       │
                                   │  Fleetbase · Walt.id ·     │
                                   │  Stripe                    │
                                   └────────────────────────────┘
```

### 2.5 Multi-Tenant Isolation

Every module model includes a `tenant_id: text` field. Tenant isolation is enforced at:
- **Model level:** All queries are scoped by `tenant_id`
- **API level:** Middleware resolves tenant from request context
- **Workflow level:** Every Temporal workflow receives a `NodeContext` containing `tenantId`

Tenant types: `platform` | `marketplace` | `vendor` | `brand`

### 2.6 Five-Level Node Hierarchy

```
CITY (depth 0)
 └── DISTRICT (depth 1)
      └── ZONE (depth 2)
           └── FACILITY (depth 3)
                └── ASSET (depth 4)
```

Nodes are tenant-scoped with parent-child relationships. Each node has `breadcrumbs` (JSON path), `location` (geo data), and `status` (active/inactive/maintenance).

### 2.7 Ten-Role RBAC System

| Role | Level | Scope |
|------|-------|-------|
| `super-admin` | 0 | Platform-wide |
| `tenant-admin` | 1 | Full tenant control |
| `compliance-officer` | 2 | Governance & compliance |
| `auditor` | 3 | Read-only audit access |
| `city-manager` | 4 | City-level operations |
| `district-manager` | 5 | District-level operations |
| `zone-operator` | 6 | Zone-level operations |
| `facility-operator` | 7 | Facility-level operations |
| `asset-technician` | 8 | Asset-level operations |
| `viewer` | 10 | Read-only access |

### 2.8 Six-Axis Persona System

| Field | Type | Description |
|-------|------|-------------|
| `category` | enum | Persona classification |
| `axes` | JSON | 6-axis scoring (engagement, spending, loyalty, etc.) |
| `constraints` | JSON | Rules and limitations |
| `allowed_workflows` | JSON | Permitted workflow types |
| `allowed_tools` | JSON | Available tools/features |
| `allowed_surfaces` | JSON | UI surfaces the persona can access |
| `feature_overrides` | JSON | Feature flag overrides |

---

## 3. API Route Map

### 3.1 Admin API Routes (187 total)

#### Advertising (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/advertising` | List ad campaigns |
| POST | `/admin/advertising` | Create ad campaign |
| GET | `/admin/advertising/:id` | Get ad campaign detail |
| POST | `/admin/advertising/:id` | Update ad campaign |

#### Affiliates (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/affiliates` | List affiliates |
| POST | `/admin/affiliates` | Create affiliate |
| GET | `/admin/affiliates/:id` | Get affiliate detail |
| POST | `/admin/affiliates/:id` | Update affiliate |

#### Auctions (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/auctions` | List auction listings |
| POST | `/admin/auctions` | Create auction listing |
| GET | `/admin/auctions/:id` | Get auction detail |
| POST | `/admin/auctions/:id` | Update auction listing |

#### Audit (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/audit` | List audit logs |
| POST | `/admin/audit` | Create audit entry |
| GET | `/admin/audit/:id` | Get audit log detail |
| POST | `/admin/audit/:id` | Update audit entry |

#### Automotive (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/automotive` | List vehicle listings |
| POST | `/admin/automotive` | Create vehicle listing |
| GET | `/admin/automotive/:id` | Get vehicle detail |
| POST | `/admin/automotive/:id` | Update vehicle listing |

#### Availability (6 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/availability` | List availability schedules |
| POST | `/admin/availability` | Create availability |
| GET | `/admin/availability/:id` | Get availability detail |
| POST | `/admin/availability/:id` | Update availability |
| GET | `/admin/availability/:id/exceptions` | List exceptions for schedule |
| POST | `/admin/availability/exceptions` | Create exception |

#### Bookings (6 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/bookings` | List bookings |
| POST | `/admin/bookings` | Create booking |
| GET | `/admin/bookings/:id` | Get booking detail |
| POST | `/admin/bookings/:id` | Update booking |
| POST | `/admin/bookings/:id/reschedule` | Reschedule booking |
| DELETE | `/admin/availability/exceptions/:exceptionId` | Delete exception |

#### Channels (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/channels` | List sales channels |
| POST | `/admin/channels` | Create channel |
| GET | `/admin/channels/:id` | Get channel detail |
| POST | `/admin/channels/:id` | Update channel |

#### Charities (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/charities` | List charity orgs |
| POST | `/admin/charities` | Create charity |
| GET | `/admin/charities/:id` | Get charity detail |
| POST | `/admin/charities/:id` | Update charity |

#### Classifieds (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/classifieds` | List classified listings |
| POST | `/admin/classifieds` | Create listing |
| GET | `/admin/classifieds/:id` | Get listing detail |
| POST | `/admin/classifieds/:id` | Update listing |

#### CMS (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/cms` | List CMS pages |
| POST | `/admin/cms` | Create CMS page |
| GET | `/admin/cms/:id` | Get CMS page detail |
| POST | `/admin/cms/:id` | Update CMS page |

#### Commission Rules (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/commission-rules` | List commission rules |
| POST | `/admin/commission-rules` | Create rule |
| GET | `/admin/commission-rules/:id` | Get rule detail |
| POST | `/admin/commission-rules/:id` | Update rule |

#### Commissions (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/commissions/tiers` | List commission tiers |
| POST | `/admin/commissions/tiers` | Create tier |
| GET | `/admin/commissions/tiers/:id` | Get tier detail |
| GET | `/admin/commissions/transactions` | List transactions |

#### Companies (14 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/companies` | List companies |
| POST | `/admin/companies` | Create company |
| GET | `/admin/companies/:id` | Get company detail |
| POST | `/admin/companies/:id` | Update company |
| POST | `/admin/companies/:id/approve` | Approve company |
| POST | `/admin/companies/:id/credit` | Manage credit |
| GET | `/admin/companies/:id/payment-terms` | Get payment terms |
| POST | `/admin/companies/:id/payment-terms` | Set payment terms |
| GET | `/admin/companies/:id/roles` | Get company roles |
| POST | `/admin/companies/:id/spending-limits` | Set spending limits |
| GET | `/admin/companies/:id/tax-exemptions` | Get tax exemptions |
| POST | `/admin/companies/:id/tax-exemptions` | Add tax exemption |
| GET | `/admin/companies/:id/workflow` | Get approval workflow |
| POST | `/admin/companies/:id/workflow` | Set approval workflow |

#### Crowdfunding (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/crowdfunding` | List campaigns |
| POST | `/admin/crowdfunding` | Create campaign |
| GET | `/admin/crowdfunding/:id` | Get campaign detail |
| POST | `/admin/crowdfunding/:id` | Update campaign |

#### Digital Products (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/digital-products` | List digital products |
| POST | `/admin/digital-products` | Create digital product |
| GET | `/admin/digital-products/:id` | Get product detail |
| POST | `/admin/digital-products/:id` | Update product |

#### Disputes (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/disputes` | List disputes |
| POST | `/admin/disputes` | Create dispute |
| GET | `/admin/disputes/:id` | Get dispute detail |
| POST | `/admin/disputes/:id` | Update/resolve dispute |

#### Education (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/education` | List courses |
| POST | `/admin/education` | Create course |
| GET | `/admin/education/:id` | Get course detail |
| POST | `/admin/education/:id` | Update course |

#### Event Ticketing (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/event-ticketing` | List events |
| POST | `/admin/event-ticketing` | Create event |
| GET | `/admin/event-ticketing/:id` | Get event detail |
| POST | `/admin/event-ticketing/:id` | Update event |

#### Financial Products (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/financial-products` | List financial products |
| POST | `/admin/financial-products` | Create product |
| GET | `/admin/financial-products/:id` | Get product detail |
| POST | `/admin/financial-products/:id` | Update product |

#### Fitness (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/fitness` | List fitness resources |
| POST | `/admin/fitness` | Create fitness resource |
| GET | `/admin/fitness/:id` | Get resource detail |
| POST | `/admin/fitness/:id` | Update resource |

#### Freelance (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/freelance` | List gig listings |
| POST | `/admin/freelance` | Create gig listing |
| GET | `/admin/freelance/:id` | Get listing detail |
| POST | `/admin/freelance/:id` | Update listing |

#### Governance (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/governance` | List governance authorities |
| POST | `/admin/governance` | Create authority |
| GET | `/admin/governance/:id` | Get authority detail |
| POST | `/admin/governance/:id` | Update authority |

#### Government (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/government` | List service requests |
| POST | `/admin/government` | Create service request |
| GET | `/admin/government/:id` | Get request detail |
| POST | `/admin/government/:id` | Update request |

#### Grocery (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/grocery` | List fresh products |
| POST | `/admin/grocery` | Create fresh product |
| GET | `/admin/grocery/:id` | Get product detail |
| POST | `/admin/grocery/:id` | Update product |

#### Health (1 route)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/health` | Platform health check |

#### Healthcare (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/healthcare` | List healthcare resources |
| POST | `/admin/healthcare` | Create resource |
| GET | `/admin/healthcare/:id` | Get resource detail |
| POST | `/admin/healthcare/:id` | Update resource |

#### i18n (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/i18n` | List translations |
| POST | `/admin/i18n` | Create translation |
| GET | `/admin/i18n/:id` | Get translation detail |
| POST | `/admin/i18n/:id` | Update translation |

#### Integrations (5 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/integrations/health` | Integration health check |
| GET | `/admin/integrations/logs` | Integration sync logs |
| POST | `/admin/integrations/sync` | Trigger full sync |
| POST | `/admin/integrations/sync/cms` | Trigger CMS sync |
| POST | `/admin/integrations/sync/node-hierarchy` | Trigger node sync |

#### Inventory Extension (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/inventory-ext` | List inventory extensions |
| POST | `/admin/inventory-ext` | Create extension |
| GET | `/admin/inventory-ext/:id` | Get extension detail |
| POST | `/admin/inventory-ext/:id` | Update extension |

#### Invoices (12 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/invoices` | List invoices |
| POST | `/admin/invoices` | Create invoice |
| GET | `/admin/invoices/:id` | Get invoice detail |
| POST | `/admin/invoices/:id` | Update invoice |
| POST | `/admin/invoices/:id/early-payment` | Process early payment |
| POST | `/admin/invoices/:id/partial-payment` | Process partial payment |
| POST | `/admin/invoices/:id/pay` | Mark as paid |
| POST | `/admin/invoices/:id/send` | Send invoice |
| POST | `/admin/invoices/:id/void` | Void invoice |
| GET | `/admin/invoices/overdue` | List overdue invoices |

#### Legal (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/legal` | List legal resources |
| POST | `/admin/legal` | Create resource |
| GET | `/admin/legal/:id` | Get resource detail |
| POST | `/admin/legal/:id` | Update resource |

#### Loyalty (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/loyalty` | List loyalty programs |
| POST | `/admin/loyalty` | Create program |
| GET | `/admin/loyalty/:id` | Get program detail |
| POST | `/admin/loyalty/:id` | Update program |

#### Memberships (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/memberships` | List memberships |
| POST | `/admin/memberships` | Create membership |
| GET | `/admin/memberships/:id` | Get membership detail |
| POST | `/admin/memberships/:id` | Update membership |

#### Metrics (1 route)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/metrics` | Platform metrics dashboard |

#### Nodes (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/nodes` | List nodes |
| POST | `/admin/nodes` | Create node |
| GET | `/admin/nodes/:id` | Get node detail |
| POST | `/admin/nodes/:id` | Update node |

#### Parking (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/parking` | List parking zones |
| POST | `/admin/parking` | Create zone |
| GET | `/admin/parking/:id` | Get zone detail |
| POST | `/admin/parking/:id` | Update zone |

#### Payment Terms (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/payment-terms` | List payment terms |
| POST | `/admin/payment-terms` | Create terms |
| GET | `/admin/payment-terms/:id` | Get terms detail |
| POST | `/admin/payment-terms/:id` | Update terms |

#### Payouts (10 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/payouts` | List payouts |
| POST | `/admin/payouts` | Create payout |
| GET | `/admin/payouts/:id` | Get payout detail |
| POST | `/admin/payouts/:id` | Update payout |
| POST | `/admin/payouts/:id/hold` | Hold payout |
| POST | `/admin/payouts/:id/process` | Process payout |
| POST | `/admin/payouts/:id/release` | Release payout |
| POST | `/admin/payouts/:id/retry` | Retry failed payout |

#### Personas (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/personas` | List personas |
| POST | `/admin/personas` | Create persona |
| GET | `/admin/personas/:id` | Get persona detail |
| POST | `/admin/personas/:id` | Update persona |

#### Pet Services (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/pet-services` | List pet services |
| POST | `/admin/pet-services` | Create service |
| GET | `/admin/pet-services/:id` | Get service detail |
| POST | `/admin/pet-services/:id` | Update service |

#### Platform Tenants (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/platform/tenants` | List platform tenants |
| POST | `/admin/platform/tenants` | Create tenant |
| GET | `/admin/platform/tenants/:id` | Get tenant detail |
| POST | `/admin/platform/tenants/:id` | Update tenant |

#### Pricing Tiers (6 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/pricing-tiers` | List pricing tiers |
| POST | `/admin/pricing-tiers` | Create tier |
| GET | `/admin/pricing-tiers/:id` | Get tier detail |
| POST | `/admin/pricing-tiers/:id` | Update tier |
| GET | `/admin/pricing-tiers/:id/companies` | List companies on tier |
| POST | `/admin/pricing-tiers/:id/companies` | Add company to tier |

#### Products (6 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/products` | List products |
| POST | `/admin/products` | Create product |
| GET | `/admin/products/:id` | Get product detail |
| POST | `/admin/products/:id` | Update product |
| GET | `/admin/products/:id/commission` | Get product commission |
| POST | `/admin/products/:id/commission` | Set product commission |

#### Promotions Extension (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/promotions-ext` | List promotions |
| POST | `/admin/promotions-ext` | Create promotion |
| GET | `/admin/promotions-ext/:id` | Get promotion detail |
| POST | `/admin/promotions-ext/:id` | Update promotion |

#### Purchase Orders (6 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/purchase-orders` | List purchase orders |
| POST | `/admin/purchase-orders` | Create purchase order |
| GET | `/admin/purchase-orders/:id` | Get order detail |
| POST | `/admin/purchase-orders/:id` | Update order |
| POST | `/admin/purchase-orders/:id/approve` | Approve order |
| POST | `/admin/purchase-orders/:id/reject` | Reject order |

#### Quotes (8 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/quotes` | List quotes |
| POST | `/admin/quotes` | Create quote |
| GET | `/admin/quotes/:id` | Get quote detail |
| POST | `/admin/quotes/:id` | Update quote |
| POST | `/admin/quotes/:id/approve` | Approve quote |
| POST | `/admin/quotes/:id/convert` | Convert to order |
| POST | `/admin/quotes/:id/reject` | Reject quote |
| GET | `/admin/quotes/expiring` | List expiring quotes |

#### Real Estate (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/real-estate` | List property listings |
| POST | `/admin/real-estate` | Create listing |
| GET | `/admin/real-estate/:id` | Get listing detail |
| POST | `/admin/real-estate/:id` | Update listing |

#### Region Zones (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/region-zones` | List region-zone mappings |
| POST | `/admin/region-zones` | Create mapping |
| GET | `/admin/region-zones/:id` | Get mapping detail |
| POST | `/admin/region-zones/:id` | Update mapping |

#### Rentals (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/rentals` | List rental products |
| POST | `/admin/rentals` | Create rental |
| GET | `/admin/rentals/:id` | Get rental detail |
| POST | `/admin/rentals/:id` | Update rental |

#### Restaurants (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/restaurants` | List restaurants |
| POST | `/admin/restaurants` | Create restaurant |
| GET | `/admin/restaurants/:id` | Get restaurant detail |
| POST | `/admin/restaurants/:id` | Update restaurant |

#### Reviews (8 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/reviews` | List reviews |
| POST | `/admin/reviews` | Create review |
| GET | `/admin/reviews/:id` | Get review detail |
| POST | `/admin/reviews/:id` | Update review |
| POST | `/admin/reviews/:id/approve` | Approve review |
| POST | `/admin/reviews/:id/reject` | Reject review |
| POST | `/admin/reviews/:id/verify` | Verify review |
| GET | `/admin/reviews/analytics` | Review analytics |

#### Service Providers (2 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/service-providers` | List service providers |
| POST | `/admin/service-providers` | Create provider |

#### Settings (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/settings` | Get settings |
| POST | `/admin/settings` | Update settings |
| GET | `/admin/settings/bookings` | Get booking settings |
| GET | `/admin/settings/features` | Get feature flags |

#### Shipping Extension (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/shipping-ext` | List shipping rates |
| POST | `/admin/shipping-ext` | Create shipping rate |
| GET | `/admin/shipping-ext/:id` | Get rate detail |
| POST | `/admin/shipping-ext/:id` | Update rate |

#### Social Commerce (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/social-commerce` | List social commerce items |
| POST | `/admin/social-commerce` | Create item |
| GET | `/admin/social-commerce/:id` | Get item detail |
| POST | `/admin/social-commerce/:id` | Update item |

#### Subscriptions (12 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/subscription-plans` | List subscription plans |
| GET | `/admin/subscriptions` | List subscriptions |
| POST | `/admin/subscriptions` | Create subscription |
| GET | `/admin/subscriptions/:id` | Get subscription detail |
| POST | `/admin/subscriptions/:id` | Update subscription |
| POST | `/admin/subscriptions/:id/change-plan` | Change plan |
| GET | `/admin/subscriptions/:id/events` | Get subscription events |
| POST | `/admin/subscriptions/:id/pause` | Pause subscription |
| POST | `/admin/subscriptions/:id/resume` | Resume subscription |
| GET | `/admin/subscriptions/discounts` | List discounts |
| POST | `/admin/subscriptions/discounts` | Create discount |
| GET | `/admin/subscriptions/discounts/:id` | Get discount detail |

#### Temporal (5 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/temporal/dynamic` | List dynamic workflows |
| GET | `/admin/temporal/dynamic/:workflowId` | Get workflow detail |
| POST | `/admin/temporal/trigger` | Trigger workflow |
| GET | `/admin/temporal/workflows` | List all workflows |

#### Tenants (10 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/tenant/stores` | List tenant stores |
| GET | `/admin/tenants` | List tenants |
| POST | `/admin/tenants` | Create tenant |
| GET | `/admin/tenants/:id` | Get tenant detail |
| POST | `/admin/tenants/:id` | Update tenant |
| GET | `/admin/tenants/:id/billing` | Get billing |
| POST | `/admin/tenants/:id/billing` | Update billing |
| GET | `/admin/tenants/:id/limits` | Get tenant limits |
| GET | `/admin/tenants/:id/team` | List team members |
| DELETE | `/admin/tenants/:id/team/:userId` | Remove team member |

#### Travel (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/travel` | List travel resources |
| POST | `/admin/travel` | Create resource |
| GET | `/admin/travel/:id` | Get resource detail |
| POST | `/admin/travel/:id` | Update resource |

#### Utilities (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/utilities` | List utility accounts |
| POST | `/admin/utilities` | Create account |
| GET | `/admin/utilities/:id` | Get account detail |
| POST | `/admin/utilities/:id` | Update account |

#### Vendors (12 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/vendors` | List vendors |
| POST | `/admin/vendors` | Create vendor |
| GET | `/admin/vendors/:id` | Get vendor detail |
| POST | `/admin/vendors/:id` | Update vendor |
| POST | `/admin/vendors/:id/approve` | Approve vendor |
| GET | `/admin/vendors/:id/performance` | Get performance metrics |
| POST | `/admin/vendors/:id/reinstate` | Reinstate vendor |
| POST | `/admin/vendors/:id/reject` | Reject vendor |
| POST | `/admin/vendors/:id/suspend` | Suspend vendor |
| GET | `/admin/vendors/analytics` | Vendor analytics |

#### Volume Pricing (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/volume-pricing` | List volume pricing |
| POST | `/admin/volume-pricing` | Create pricing |
| GET | `/admin/volume-pricing/:id` | Get pricing detail |
| POST | `/admin/volume-pricing/:id` | Update pricing |

#### Warranties (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/warranties` | List warranties |
| POST | `/admin/warranties` | Create warranty |
| GET | `/admin/warranties/:id` | Get warranty detail |
| POST | `/admin/warranties/:id` | Update warranty |

#### Webhooks (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/admin/webhooks/erpnext` | ERPNext webhook |
| POST | `/admin/webhooks/fleetbase` | Fleetbase webhook |
| POST | `/admin/webhooks/payload` | Payload CMS webhook |
| POST | `/admin/webhooks/stripe` | Stripe webhook |

#### Wishlists (4 routes)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/wishlists` | List wishlists |
| POST | `/admin/wishlists` | Create wishlist |
| GET | `/admin/wishlists/:id` | Get wishlist detail |
| POST | `/admin/wishlists/:id` | Update wishlist |

### 3.2 Store API Routes (113 total)

| # | Method | Path | Module | Description |
|---|--------|------|--------|-------------|
| 1 | GET | `/store/advertising` | advertising | List active ads |
| 2 | GET | `/store/advertising/:id` | advertising | Get ad detail |
| 3 | GET | `/store/affiliates` | affiliate | List affiliate programs |
| 4 | GET | `/store/affiliates/:id` | affiliate | Get affiliate detail |
| 5 | GET | `/store/auctions` | auction | List active auctions |
| 6 | GET | `/store/auctions/:id` | auction | Get auction detail with bids |
| 7 | GET | `/store/automotive` | automotive | List vehicle listings |
| 8 | GET | `/store/automotive/:id` | automotive | Get vehicle detail |
| 9 | GET | `/store/bookings` | booking | List customer bookings |
| 10 | POST | `/store/bookings` | booking | Create booking |
| 11 | GET | `/store/bookings/:id` | booking | Get booking detail |
| 12 | POST | `/store/bookings/:id/cancel` | booking | Cancel booking |
| 13 | POST | `/store/bookings/:id/check-in` | booking | Check in to booking |
| 14 | POST | `/store/bookings/:id/confirm` | booking | Confirm booking |
| 15 | POST | `/store/bookings/:id/reschedule` | booking | Reschedule booking |
| 16 | GET | `/store/bookings/availability` | booking | Check availability |
| 17 | GET | `/store/bookings/services` | booking | List bookable services |
| 18 | GET | `/store/bookings/services/:serviceId` | booking | Get service detail |
| 19 | GET | `/store/bookings/services/:serviceId/providers` | booking | List providers |
| 20 | GET | `/store/bundles` | promotion-ext | List product bundles |
| 21 | GET | `/store/charity` | charity | List charity campaigns |
| 22 | GET | `/store/charity/:id` | charity | Get campaign detail |
| 23 | GET | `/store/cityos/governance` | governance | CityOS governance info |
| 24 | GET | `/store/cityos/nodes` | node | CityOS node tree |
| 25 | GET | `/store/cityos/persona` | persona | CityOS persona info |
| 26 | GET | `/store/cityos/tenant` | tenant | CityOS tenant info |
| 27 | GET | `/store/classifieds` | classified | List classified listings |
| 28 | GET | `/store/classifieds/:id` | classified | Get listing detail |
| 29 | GET | `/store/companies` | company | List companies |
| 30 | GET | `/store/companies/:id` | company | Get company detail |
| 31 | GET | `/store/companies/:id/pricing` | company | Get company pricing |
| 32 | GET | `/store/companies/me` | company | Get my company |
| 33 | GET | `/store/companies/me/credit` | company | Get company credit |
| 34 | GET | `/store/companies/me/orders` | company | Get company orders |
| 35 | GET | `/store/companies/me/team` | company | Get company team |
| 36 | GET | `/store/consignments` | shipping-extension | List consignments |
| 37 | GET | `/store/content/pois` | tenant | List points of interest |
| 38 | GET | `/store/content/pois/:id` | tenant | Get POI detail |
| 39 | GET | `/store/credit` | company | Get customer credit |
| 40 | GET | `/store/crowdfunding` | crowdfunding | List campaigns |
| 41 | GET | `/store/crowdfunding/:id` | crowdfunding | Get campaign detail |
| 42 | GET | `/store/digital-products` | digital-product | List digital products |
| 43 | GET | `/store/digital-products/:id` | digital-product | Get product detail |
| 44 | GET | `/store/education` | education | List courses |
| 45 | GET | `/store/event-ticketing` | event-ticketing | List events |
| 46 | GET | `/store/features` | settings | Get feature flags |
| 47 | GET | `/store/financial-products` | financial-product | List financial products |
| 48 | GET | `/store/financial-products/:id` | financial-product | Get product detail |
| 49 | GET | `/store/fitness` | fitness | List fitness resources |
| 50 | GET | `/store/fitness/:id` | fitness | Get resource detail |
| 51 | GET | `/store/flash-sales` | promotion-ext | List flash sales |
| 52 | GET | `/store/freelance` | freelance | List gig listings |
| 53 | GET | `/store/freelance/:id` | freelance | Get listing detail |
| 54 | GET | `/store/gift-cards` | promotion-ext | List gift cards |
| 55 | GET | `/store/government` | government | List government services |
| 56 | GET | `/store/government/:id` | government | Get service detail |
| 57 | GET | `/store/grocery` | grocery | List fresh products |
| 58 | GET | `/store/grocery/:id` | grocery | Get product detail |
| 59 | GET | `/store/healthcare` | healthcare | List healthcare resources |
| 60 | GET | `/store/invoices` | invoice | List customer invoices |
| 61 | GET | `/store/invoices/:id` | invoice | Get invoice detail |
| 62 | POST | `/store/invoices/:id/early-payment` | invoice | Early payment discount |
| 63 | GET | `/store/legal` | legal | List legal services |
| 64 | GET | `/store/legal/:id` | legal | Get service detail |
| 65 | GET | `/store/loyalty` | loyalty | Get loyalty program |
| 66 | GET | `/store/memberships` | membership | List memberships |
| 67 | POST | `/store/newsletter` | notification-preferences | Subscribe newsletter |
| 68 | GET | `/store/parking` | parking | List parking zones |
| 69 | GET | `/store/parking/:id` | parking | Get zone detail |
| 70 | GET | `/store/pet-services` | pet-service | List pet services |
| 71 | GET | `/store/pet-services/:id` | pet-service | Get service detail |
| 72 | GET | `/store/products` | products | List products |
| 73 | GET | `/store/products/:id` | products | Get product detail |
| 74 | GET | `/store/products/:id/volume-pricing` | volume-pricing | Get volume pricing |
| 75 | GET | `/store/purchase-orders` | company | List purchase orders |
| 76 | GET | `/store/purchase-orders/:id` | company | Get PO detail |
| 77 | POST | `/store/purchase-orders/:id/submit` | company | Submit PO |
| 78 | GET | `/store/quotes` | quote | List quotes |
| 79 | GET | `/store/quotes/:id` | quote | Get quote detail |
| 80 | POST | `/store/quotes/:id/accept` | quote | Accept quote |
| 81 | POST | `/store/quotes/:id/decline` | quote | Decline quote |
| 82 | GET | `/store/real-estate` | real-estate | List property listings |
| 83 | GET | `/store/rentals` | rental | List rentals |
| 84 | GET | `/store/rentals/:id` | rental | Get rental detail |
| 85 | GET | `/store/restaurants` | restaurant | List restaurants |
| 86 | GET | `/store/reviews` | review | List reviews |
| 87 | GET | `/store/reviews/:id` | review | Get review detail |
| 88 | POST | `/store/reviews/:id/helpful` | review | Mark as helpful |
| 89 | GET | `/store/reviews/products` | review | Product reviews index |
| 90 | GET | `/store/reviews/products/:id` | review | Product reviews |
| 91 | GET | `/store/reviews/vendors` | review | Vendor reviews index |
| 92 | GET | `/store/reviews/vendors/:id` | review | Vendor reviews |
| 93 | GET | `/store/social-commerce` | social-commerce | List social items |
| 94 | GET | `/store/social-commerce/:id` | social-commerce | Get item detail |
| 95 | GET | `/store/stores` | store | List stores |
| 96 | GET | `/store/stores/by-domain/:domain` | store | Get store by domain |
| 97 | GET | `/store/stores/by-subdomain/:subdomain` | store | Get store by subdomain |
| 98 | GET | `/store/stores/default` | store | Get default store |
| 99 | GET | `/store/subscriptions` | subscription | List subscriptions |
| 100 | GET | `/store/subscriptions/:id` | subscription | Get subscription |
| 101 | GET | `/store/subscriptions/:id/billing-history` | subscription | Billing history |
| 102 | POST | `/store/subscriptions/:id/cancel` | subscription | Cancel subscription |
| 103 | POST | `/store/subscriptions/:id/change-plan` | subscription | Change plan |
| 104 | POST | `/store/subscriptions/:id/pause` | subscription | Pause subscription |
| 105 | POST | `/store/subscriptions/:id/payment-method` | subscription | Update payment method |
| 106 | POST | `/store/subscriptions/:id/resume` | subscription | Resume subscription |
| 107 | POST | `/store/subscriptions/checkout` | subscription | Subscription checkout |
| 108 | GET | `/store/subscriptions/me` | subscription | My subscriptions |
| 109 | POST | `/store/subscriptions/webhook` | subscription | Subscription webhook |
| 110 | GET | `/store/trade-in` | automotive | Trade-in evaluations |
| 111 | GET | `/store/travel` | travel | List travel listings |
| 112 | GET | `/store/travel/:id` | travel | Get listing detail |
| 113 | GET | `/store/utilities` | utilities | List utility accounts |

### 3.3 Vendor API Routes (11 total)

| # | Method | Path | Description |
|---|--------|------|-------------|
| 1 | GET | `/vendor/analytics` | Vendor analytics dashboard |
| 2 | GET | `/vendor/commissions` | Vendor commissions |
| 3 | GET | `/vendor/dashboard` | Vendor dashboard overview |
| 4 | GET | `/vendor/orders` | List vendor orders |
| 5 | GET | `/vendor/orders/:orderId` | Get order detail |
| 6 | POST | `/vendor/orders/:orderId/fulfill` | Fulfill order |
| 7 | GET | `/vendor/payouts` | List payouts |
| 8 | POST | `/vendor/payouts/request` | Request payout |
| 9 | GET | `/vendor/products` | List vendor products |
| 10 | GET | `/vendor/products/:productId` | Get product detail |
| 11 | GET | `/vendor/transactions` | List transactions |

### 3.4 Webhook Routes (4 total)

| # | Method | Path | Integration | Auth Method |
|---|--------|------|-------------|-------------|
| 1 | POST | `/webhooks/erpnext` | ERPNext | HMAC signature |
| 2 | POST | `/webhooks/fleetbase` | Fleetbase | API key header |
| 3 | POST | `/webhooks/payload-cms` | Payload CMS | API key header |
| 4 | POST | `/webhooks/stripe` | Stripe | HMAC-SHA256 |

### 3.5 Platform API Routes

| # | Method | Path | Description |
|---|--------|------|-------------|
| 1 | GET | `/platform/capabilities` | Platform capabilities |
| 2 | GET | `/platform/cms/navigation` | CMS navigation |
| 3 | GET | `/platform/cms/navigations` | All navigations |
| 4 | GET | `/platform/cms/pages` | CMS pages |
| 5 | GET | `/platform/cms/resolve` | Resolve CMS content |
| 6 | GET | `/platform/cms/verticals` | CMS verticals |
| 7 | GET | `/platform/context` | Platform context |
| 8 | GET | `/platform/tenants` | List tenants |
| 9 | GET | `/platform/tenants/default` | Default tenant |
| 10 | GET | `/platform/vendors` | List vendors |
| 11 | GET | `/platform/vendors/:id` | Get vendor |
| 12 | GET | `/platform/vendors/:id/channels` | Vendor channels |
| 13 | GET | `/platform/vendors/:id/listings` | Vendor listings |
| 14 | GET | `/platform/vendors/:id/pois` | Vendor POIs |

---

## 4. Per-Module Deep Assessment

### Module Summary Table

| # | Module | Models | Service Lines | Migrations | Admin Page | Maturity |
|---|--------|--------|--------------|------------|------------|----------|
| 1 | advertising | 6 | 128 | 1 | ✅ | ██████████ 100% |
| 2 | affiliate | 6 | 91 | 1 | ✅ | ██████████ 100% |
| 3 | analytics | 3 | 151 | 1 | ✅ | ██████████ 100% |
| 4 | auction | 6 | 114 | 1 | ✅ | ██████████ 100% |
| 5 | audit | 2 | 99 | 1 | ✅ | ██████████ 100% |
| 6 | automotive | 6 | 119 | 1 | ✅ | ██████████ 100% |
| 7 | booking | 6 | 627 | 1 | ✅ | ██████████ 100% |
| 8 | cart-extension | 1 | 315 | 1 | — | █████████░ 90% |
| 9 | channel | 2 | 270 | 2 | ✅ | ██████████ 100% |
| 10 | charity | 5 | 98 | 1 | ✅ | ██████████ 100% |
| 11 | classified | 6 | 98 | 1 | ✅ | ██████████ 100% |
| 12 | cms-content | 2 | 181 | 1 | ✅ | ██████████ 100% |
| 13 | commission | 3 | 129 | 1 | ✅ | ██████████ 100% |
| 14 | company | 8 | 480 | 2 | ✅ | ██████████ 100% |
| 15 | crowdfunding | 6 | 109 | 1 | ✅ | ██████████ 100% |
| 16 | digital-product | 3 | 91 | 1 | ✅ | ██████████ 100% |
| 17 | dispute | 2 | 226 | 1 | ✅ | ██████████ 100% |
| 18 | education | 7 | 129 | 1 | ✅ | ██████████ 100% |
| 19 | events | 2 | 96 | 1 | ✅ | ██████████ 100% |
| 20 | event-ticketing | 7 | 101 | 1 | ✅ | ██████████ 100% |
| 21 | financial-product | 6 | 84 | 1 | — | █████████░ 90% |
| 22 | fitness | 6 | 84 | 1 | ✅ | ██████████ 100% |
| 23 | freelance | 7 | 139 | 1 | ✅ | ██████████ 100% |
| 24 | governance | 2 | 78 | 1 | ✅ | ██████████ 100% |
| 25 | government | 6 | 80 | 1 | ✅ | ██████████ 100% |
| 26 | grocery | 5 | 79 | 1 | ✅ | ██████████ 100% |
| 27 | healthcare | 8 | 89 | 1 | ✅ | ██████████ 100% |
| 28 | i18n | 2 | 104 | 1 | ✅ | ██████████ 100% |
| 29 | inventory-extension | 3 | 177 | 1 | ✅ | ██████████ 100% |
| 30 | invoice | 2 | 167 | 1 | ✅ | ██████████ 100% |
| 31 | legal | 5 | 83 | 1 | ✅ | ██████████ 100% |
| 32 | loyalty | 3 | 240 | 1 | ✅ | ██████████ 100% |
| 33 | membership | 6 | 99 | 1 | ✅ | ██████████ 100% |
| 34 | node | 2 | 152 | 1 | ✅ | ██████████ 100% |
| 35 | notification-preferences | 1 | 115 | 1 | — | █████████░ 90% |
| 36 | parking | 5 | 80 | 1 | ✅ | ██████████ 100% |
| 37 | payout | 3 | 335 | 1 | ✅ | ██████████ 100% |
| 38 | persona | 3 | 134 | 1 | ✅ | ██████████ 100% |
| 39 | pet-service | 5 | 81 | 1 | ✅ | ██████████ 100% |
| 40 | promotion-ext | 5 | 155 | 1 | ✅ | ██████████ 100% |
| 41 | quote | 3 | 147 | 1 | ✅ | ██████████ 100% |
| 42 | real-estate | 7 | 128 | 1 | ✅ | ██████████ 100% |
| 43 | region-zone | 2 | 162 | 1 | ✅ | ██████████ 100% |
| 44 | rental | 6 | 113 | 1 | ✅ | ██████████ 100% |
| 45 | restaurant | 8 | 82 | 1 | ✅ | ██████████ 100% |
| 46 | review | 1 | 137 | 1 | ✅ | ██████████ 100% |
| 47 | shipping-extension | 2 | 83 | 1 | ✅ | ██████████ 100% |
| 48 | social-commerce | 6 | 77 | 1 | ✅ | ██████████ 100% |
| 49 | store | 2 | 84 | 1 | — | █████████░ 90% |
| 50 | subscription | 6 | 694 | 1 | ✅ | ██████████ 100% |
| 51 | tax-config | 2 | 206 | 1 | — | █████████░ 90% |
| 52 | tenant | 8 | 506 | 2 | ✅ | ██████████ 100% |
| 53 | travel | 8 | 79 | 1 | ✅ | ██████████ 100% |
| 54 | utilities | 5 | 264 | 1 | — | █████████░ 90% |
| 55 | vendor | 7 | 474 | 1 | ✅ | ██████████ 100% |
| 56 | volume-pricing | 3 | 225 | 1 | ✅ | ██████████ 100% |
| 57 | warranty | 6 | 101 | 1 | ✅ | ██████████ 100% |
| 58 | wishlist | 2 | 136 | 1 | ✅ | ██████████ 100% |

---

### 4.1 advertising

**Purpose:** Manage ad campaigns, placements, creatives, and impression tracking for platform advertising.

**Models (6):**

| Model | Description |
|-------|-------------|
| `ad-campaign` | Campaign with budget, targeting, schedule, and status |
| `ad-placement` | Placement positions within storefront pages |
| `ad-creative` | Creative assets (images, text, CTAs) for campaigns |
| `impression-log` | Impression and click tracking records |
| `ad-account` | Advertiser account with billing info |

**Service (128 lines):** `AdvertisingModuleService`
- `createCampaign()` — create campaign with targeting rules
- `updateCampaignStatus()` — activate/pause/complete campaigns
- `recordImpression()` — log ad impression event
- `getAnalytics()` — retrieve campaign performance metrics
- `assignCreative()` — link creative to placement

**API Routes:** Admin: 4 (CRUD) | Store: 2 (list, detail)
**Admin Page:** `admin/routes/advertising/page.tsx`
**Admin Hook:** `use-advertising.ts`
**Migrations:** 1
**Links:** None
**Maturity:** ██████████ 100%

---

### 4.2 affiliate

**Purpose:** Affiliate marketing program with referral tracking, commission management, and influencer campaigns.

**Models (6):**

| Model | Description |
|-------|-------------|
| `affiliate` | Affiliate profile with payout info and tier |
| `referral-link` | Trackable referral URLs with UTM parameters |
| `click-tracking` | Click and conversion tracking records |
| `affiliate-commission` | Commission earned per referral |
| `influencer-campaign` | Influencer-specific campaign management |

**Service (91 lines):** `AffiliateModuleService`
- `registerAffiliate()` — register new affiliate
- `generateReferralLink()` — create trackable referral URL
- `trackClick()` — record click event
- `calculateCommission()` — compute commission for conversion
- `getPerformanceReport()` — affiliate performance dashboard

**API Routes:** Admin: 4 (CRUD) | Store: 2 (list, detail)
**Admin Page:** `admin/routes/affiliates/page.tsx`
**Admin Hook:** `use-affiliates.ts`
**Migrations:** 1
**Links:** None
**Maturity:** ██████████ 100%

---

### 4.3 analytics

**Purpose:** Platform analytics with dashboards, event tracking, and report generation.

**Models (3):**

| Model | Description |
|-------|-------------|
| `dashboard` | Dashboard configuration with widgets and layout |
| `analytics-event` | Raw analytics events (page views, actions, conversions) |
| `report` | Generated reports with filters and data snapshots |

**Service (151 lines):** `AnalyticsModuleService`
- `trackEvent()` — record analytics event
- `getDashboard()` — retrieve dashboard configuration
- `generateReport()` — build report from event data
- `getMetrics()` — compute aggregate metrics
- `exportReport()` — export report to CSV/PDF

**API Routes:** Admin: 4 (CRUD) | Store: 0
**Admin Page:** `admin/routes/analytics/page.tsx`
**Admin Hook:** `use-analytics.ts`
**Migrations:** 1
**Links:** None
**Maturity:** ██████████ 100%

---

### 4.4 auction

**Purpose:** Auction system with listings, bidding, auto-bid rules, escrow management, and settlement.

**Models (6):**

| Model | Description |
|-------|-------------|
| `auction-listing` | Auction item with start/end times, reserve price |
| `bid` | Individual bid with amount, bidder, timestamp |
| `auto-bid-rule` | Automatic bidding rules (max amount, increment) |
| `auction-result` | Settlement record with winning bid and buyer |
| `auction-escrow` | Escrow funds management for active auctions |

**Service (114 lines):** `AuctionModuleService`
- `createListing()` — create auction with parameters
- `placeBid()` — submit bid with validation
- `processAutoBids()` — execute auto-bid rules
- `settleAuction()` — determine winner, create result
- `manageEscrow()` — hold/release escrow funds

**API Routes:** Admin: 4 (CRUD) | Store: 2 (list, detail with bids)
**Admin Page:** `admin/routes/auctions/page.tsx`
**Admin Hook:** `use-auctions.ts`
**Migrations:** 1
**Links:** `product-auction` (Product → AuctionListing)
**Workflows:** `auction-lifecycle`
**Maturity:** ██████████ 100%

---

### 4.5 audit

**Purpose:** Audit logging system for tracking all administrative and system actions.

**Models (2):**

| Model | Description |
|-------|-------------|
| `audit-log` | Audit trail with actor, action, entity, changes, IP |

**Service (99 lines):** `AuditModuleService`
- `createEntry()` — log audit event
- `listEntries()` — paginated audit log
- `getByEntity()` — filter logs by entity type/ID
- `getByActor()` — filter logs by user

**API Routes:** Admin: 4 (CRUD) | Store: 0
**Admin Page:** `admin/routes/audit/page.tsx`
**Admin Hook:** `use-audit.ts`
**Migrations:** 1
**Links:** None
**Maturity:** ██████████ 100%

---

### 4.6 automotive

**Purpose:** Automotive vertical with vehicle listings, test drives, service appointments, parts catalog, and trade-in evaluations.

**Models (6):**

| Model | Description |
|-------|-------------|
| `vehicle-listing` | Vehicle for sale with specs, condition, pricing |
| `test-drive` | Scheduled test drive appointment |
| `vehicle-service` | Service/maintenance appointment tracking |
| `part-catalog` | Auto parts inventory with compatibility |
| `trade-in` | Trade-in evaluation with appraisal value |

**Service (119 lines):** `AutomotiveModuleService`
- `createListing()` — list vehicle for sale
- `scheduleTestDrive()` — book test drive
- `evaluateTradeIn()` — calculate trade-in value
- `searchParts()` — search parts by compatibility
- `scheduleService()` — book service appointment

**API Routes:** Admin: 4 (CRUD) | Store: 2 (list, detail) + trade-in
**Admin Page:** `admin/routes/automotive/page.tsx`
**Admin Hook:** `use-automotive.ts`
**Migrations:** 1
**Links:** `customer-vehicle` (Customer → VehicleListing)
**Workflows:** `trade-in-evaluation`
**Maturity:** ██████████ 100%

---

### 4.7 booking

**Purpose:** Service booking engine with availability management, provider assignment, reminders, and full lifecycle management.

**Models (6):**

| Model | Description |
|-------|-------------|
| `availability` | Provider availability schedules and exceptions |
| `booking` | Booking record with status, timing, customer, provider |
| `reminder` | Scheduled booking reminders (email, SMS, push) |
| `service-product` | Bookable service definitions |
| `service-provider` | Service provider profiles and capabilities |

**Service (627 lines):** `BookingModuleService`
- `createBooking()` — create booking with availability check
- `confirmBooking()` — confirm and notify parties
- `cancelBooking()` — cancel with policy enforcement
- `rescheduleBooking()` — reschedule with conflict detection
- `checkIn()` — mark customer as checked in
- `completeBooking()` — mark booking complete
- `handleNoShow()` — process no-show with penalty logic
- `getAvailability()` — compute available time slots
- `assignProvider()` — assign service provider
- `sendReminder()` — dispatch booking reminder
- `getBookingAnalytics()` — booking metrics and utilization

**API Routes:** Admin: 6 | Store: 11 (full booking lifecycle)
**Admin Page:** `admin/routes/bookings/page.tsx`
**Admin Hook:** `use-bookings.ts`
**Migrations:** 1
**Links:** `booking-customer` (Customer → Booking)
**Workflows:** `booking-confirmation`
**Subscribers:** `booking-created`, `booking-confirmed`, `booking-cancelled`, `booking-completed`, `booking-checked-in`
**Jobs:** `booking-reminders`, `booking-no-show-check`
**Maturity:** ██████████ 100%

---

### 4.8 cart-extension

**Purpose:** Extends Medusa's cart with tenant/persona/node context, source channel tracking, and custom metadata.

**Models (1):**

| Model | Description |
|-------|-------------|
| `cart-metadata` | Extended cart data with tenant_id, persona_id, node_id, source_channel |

**Service (315 lines):** `CartExtensionModuleService`
- `enrichCart()` — add tenant/persona context to cart
- `setSourceChannel()` — track acquisition channel
- `applyPersonaPricing()` — apply persona-specific pricing
- `validateCartRules()` — enforce tenant cart policies
- `getCartAnalytics()` — cart conversion metrics

**API Routes:** Admin: 0 | Store: 0 (middleware integration)
**Admin Page:** None (extends core cart)
**Migrations:** 1
**Links:** None
**Jobs:** `cleanup-expired-carts`
**Maturity:** █████████░ 90%

---

### 4.9 channel

**Purpose:** Sales channel management with multi-channel mapping and service channel configuration.

**Models (2):**

| Model | Description |
|-------|-------------|
| `sales-channel-mapping` | Maps products/categories to sales channels |

**Service (270 lines):** `ChannelModuleService`
- `createMapping()` — map entity to channel
- `syncChannels()` — synchronize channel configurations
- `getChannelProducts()` — list products in channel
- `validateChannelAccess()` — check entity channel membership
- `getChannelAnalytics()` — per-channel performance

**API Routes:** Admin: 4 (CRUD) | Store: 0
**Admin Page:** `admin/routes/channels/page.tsx`
**Admin Hook:** `use-channels.ts`
**Migrations:** 2
**Links:** None
**Maturity:** ██████████ 100%

---

### 4.10 charity

**Purpose:** Charitable giving with organization profiles, donation campaigns, donation tracking, and impact reporting.

**Models (5):**

| Model | Description |
|-------|-------------|
| `charity-org` | Charity organization profile |
| `donation-campaign` | Fundraising campaign with goal and deadline |
| `donation` | Individual donation record with amount and donor |
| `impact-report` | Impact report showing donation utilization |

**Service (98 lines):** `CharityModuleService`
- `createCampaign()` — create donation campaign
- `processDonation()` — record and process donation
- `getCampaignProgress()` — track fundraising progress
- `generateImpactReport()` — create impact report

**API Routes:** Admin: 4 (CRUD) | Store: 2 (list, detail)
**Admin Page:** `admin/routes/charity/page.tsx`
**Admin Hook:** `use-charity.ts`
**Migrations:** 1
**Links:** `customer-donation` (Customer → Donation)
**Maturity:** ██████████ 100%

---

### 4.11 classified

**Purpose:** Classified listings marketplace with images, offers, categories, and flagging/moderation.

**Models (6):**

| Model | Description |
|-------|-------------|
| `classified-listing` | Listing with title, description, price, location |
| `listing-image` | Images attached to listings |
| `listing-offer` | Buyer offers/counter-offers on listings |
| `listing-category` | Category taxonomy for classifieds |
| `listing-flag` | Flag/report for moderation |

**Service (98 lines):** `ClassifiedModuleService`
- `createListing()` — create classified listing
- `submitOffer()` — place offer on listing
- `acceptOffer()` — accept buyer offer
- `flagListing()` — flag listing for moderation
- `moderateListing()` — approve/reject flagged listing

**API Routes:** Admin: 4 (CRUD) | Store: 2 (list, detail)
**Admin Page:** `admin/routes/classifieds/page.tsx`
**Admin Hook:** `use-classifieds.ts`
**Migrations:** 1
**Links:** `product-classified` (Product → ClassifiedListing)
**Maturity:** ██████████ 100%

---

### 4.12 cms-content

**Purpose:** Content management with pages and navigation structures, integrated with Payload CMS.

**Models (2):**

| Model | Description |
|-------|-------------|
| `cms-page` | CMS page with title, slug, content blocks, SEO |
| `cms-navigation` | Navigation menu structure with items |

**Service (181 lines):** `CmsContentModuleService`
- `createPage()` — create CMS page
- `publishPage()` — publish/unpublish page
- `buildNavigation()` — construct navigation tree
- `resolveContent()` — resolve content by slug/path
- `syncFromPayload()` — sync content from Payload CMS

**API Routes:** Admin: 4 (CRUD) | Store: 0 (via platform API)
**Admin Page:** `admin/routes/cms/page.tsx`
**Admin Hook:** `use-cms.ts`
**Migrations:** 1
**Links:** None
**Maturity:** ██████████ 100%

---

### 4.13 commission

**Purpose:** Commission rules and transaction tracking for vendor marketplace.

**Models (3):**

| Model | Description |
|-------|-------------|
| `commission-rule` | Commission calculation rules (percentage, flat, tiered) |
| `commission-transaction` | Individual commission transaction records |

**Service (129 lines):** `CommissionModuleService`
- `createRule()` — define commission structure
- `calculateCommission()` — compute commission for order
- `recordTransaction()` — log commission transaction
- `getVendorCommissions()` — vendor commission summary
- `settleCommissions()` — process commission payouts

**API Routes:** Admin: 8 (rules CRUD, tiers, transactions) | Store: 0
**Admin Page:** `admin/routes/commissions/tiers/page.tsx`, `admin/routes/commissions/transactions/page.tsx`
**Admin Hook:** None (inline)
**Admin Widget:** `commission-config.tsx`
**Migrations:** 1
**Links:** `vendor-commission` (Vendor → CommissionRule)
**Workflows:** `commission-calculation`, `calculate-commission`
**Jobs:** `commission-settlement`
**Maturity:** ██████████ 100%

---

### 4.14 company

**Purpose:** B2B company management with approval workflows, purchase orders, payment terms, tax exemptions, and credit management.

**Models (8):**

| Model | Description |
|-------|-------------|
| `approval-workflow` | Multi-step approval workflow configuration |
| `company-user` | Company employee/user association |
| `company` | Company profile with billing, status, verification |
| `payment-terms` | Net payment terms (Net 30, Net 60, etc.) |
| `purchase-order-item` | Individual line items on purchase orders |
| `purchase-order` | B2B purchase order with approval status |
| `tax-exemption` | Company tax exemption certificates |

**Service (480 lines):** `CompanyModuleService`
- `createCompany()` — register B2B company
- `approveCompany()` — approve company registration
- `createPurchaseOrder()` — create PO with items
- `approvePurchaseOrder()` — approve PO through workflow
- `setPaymentTerms()` — configure payment terms
- `manageCreditLine()` — set/update credit limits
- `setSpendingLimits()` — configure spending controls
- `addTaxExemption()` — upload tax exemption cert
- `getCompanyAnalytics()` — B2B company metrics

**API Routes:** Admin: 14 | Store: 7 (company portal)
**Admin Page:** `admin/routes/companies/page.tsx`, `admin/routes/companies/[id]/page.tsx`
**Admin Hook:** `use-companies.ts`
**Admin Widget:** `customer-business-info.tsx`, `order-business-info.tsx`
**Migrations:** 2
**Links:** `customer-company` (Customer → Company), `company-invoice` (Company → Invoice)
**Workflows:** `create-company`
**Subscribers:** `company-created`, `purchase-order-submitted`
**Maturity:** ██████████ 100%

---

### 4.15 crowdfunding

**Purpose:** Crowdfunding campaigns with pledge management, reward tiers, updates, and backer tracking.

**Models (6):**

| Model | Description |
|-------|-------------|
| `campaign` | Crowdfunding campaign with goal, deadline, status |
| `pledge` | Individual pledge/contribution record |
| `reward-tier` | Reward levels with descriptions and limits |
| `campaign-update` | Progress updates to backers |
| `backer` | Backer profiles with pledge history |

**Service (109 lines):** `CrowdfundingModuleService`
- `createCampaign()` — launch crowdfunding campaign
- `submitPledge()` — process backer pledge
- `updateCampaignProgress()` — post campaign update
- `checkFundingGoal()` — evaluate if goal met
- `processRewards()` — distribute rewards to backers

**API Routes:** Admin: 4 (CRUD) | Store: 2 (list, detail)
**Admin Page:** `admin/routes/crowdfunding/page.tsx`
**Admin Hook:** `use-crowdfunding.ts`
**Migrations:** 1
**Links:** None
**Workflows:** `campaign-activation`
**Maturity:** ██████████ 100%

---

### 4.16 digital-product

**Purpose:** Digital product distribution with asset management and download license control.

**Models (3):**

| Model | Description |
|-------|-------------|
| `digital-asset` | Digital file with storage URL, format, size |
| `download-license` | License granting download access to customers |

**Service (91 lines):** `DigitalProductModuleService`
- `createAsset()` — upload digital asset
- `grantLicense()` — issue download license
- `validateLicense()` — check license validity
- `trackDownload()` — record download event
- `revokeLicense()` — revoke access

**API Routes:** Admin: 4 (CRUD) | Store: 2 (list, detail)
**Admin Page:** `admin/routes/digital-products/page.tsx`
**Admin Hook:** `use-digital-products.ts`
**Migrations:** 1
**Links:** `product-digital-asset` (Product → DigitalAsset)
**Maturity:** ██████████ 100%

---

### 4.17 dispute

**Purpose:** Order dispute management with messaging thread and resolution workflow.

**Models (2):**

| Model | Description |
|-------|-------------|
| `dispute` | Dispute record with reason, status, order reference |
| `dispute-message` | Messages in dispute conversation thread |

**Service (226 lines):** `DisputeModuleService`
- `openDispute()` — create dispute for order
- `addMessage()` — add message to dispute thread
- `escalateDispute()` — escalate to higher authority
- `resolveDispute()` — close with resolution
- `refundDispute()` — process refund for dispute

**API Routes:** Admin: 4 (CRUD) | Store: 0
**Admin Page:** `admin/routes/disputes/page.tsx`
**Admin Hook:** `use-disputes.ts`
**Migrations:** 1
**Links:** `order-dispute` (Order → Dispute)
**Workflows:** `dispute-resolution`
**Maturity:** ██████████ 100%

---

### 4.18 education

**Purpose:** Education vertical with courses, lessons, enrollments, certificates, quizzes, and assignments.

**Models (7):**

| Model | Description |
|-------|-------------|
| `course` | Course with syllabus, instructor, duration, price |
| `lesson` | Individual lesson within a course |
| `enrollment` | Student enrollment in course with progress |
| `certificate` | Completion certificate with verification |
| `quiz` | Quiz/assessment with questions and scoring |
| `assignment` | Student assignment submission and grading |

**Service (129 lines):** `EducationModuleService`
- `createCourse()` — create course with lessons
- `enrollStudent()` — enroll customer in course
- `updateProgress()` — track lesson completion
- `gradeAssignment()` — grade submitted assignment
- `issueCertificate()` — generate completion certificate

**API Routes:** Admin: 4 (CRUD) | Store: 1 (list)
**Admin Page:** `admin/routes/education/page.tsx`
**Admin Hook:** `use-education.ts`
**Migrations:** 1
**Links:** `product-course` (Product → Course)
**Maturity:** ██████████ 100%

---

### 4.19 events

**Purpose:** Event outbox system for reliable event dispatch to external systems and workflows.

**Models (2):**

| Model | Description |
|-------|-------------|
| `event-outbox` | Outbox entries for guaranteed event delivery |

**Service (96 lines):** `EventsModuleService`
- `pushEvent()` — add event to outbox
- `processOutbox()` — process pending events
- `retryFailed()` — retry failed dispatches
- `cleanupCompleted()` — purge old completed entries

**API Routes:** Admin: 4 (CRUD) | Store: 0
**Admin Page:** `admin/routes/events/page.tsx`
**Admin Hook:** `use-events.ts`
**Migrations:** 1
**Links:** None
**Maturity:** ██████████ 100%

---

### 4.20 event-ticketing

**Purpose:** Event management with ticket types, venue/seat management, ticket sales, and check-in.

**Models (7):**

| Model | Description |
|-------|-------------|
| `event` | Event with date, venue, description, organizer |
| `ticket-type` | Ticket categories (VIP, General, Early Bird) |
| `ticket` | Individual ticket with QR code, seat assignment |
| `venue` | Venue profile with capacity and facilities |
| `seat-map` | Venue seating chart configuration |
| `check-in` | Ticket check-in/scan record |

**Service (101 lines):** `EventTicketingModuleService`
- `createEvent()` — create event with venue
- `defineTicketTypes()` — set ticket categories and pricing
- `purchaseTicket()` — process ticket purchase
- `checkIn()` — scan and validate ticket
- `getEventAnalytics()` — ticket sales and attendance

**API Routes:** Admin: 4 (CRUD) | Store: 1 (list)
**Admin Page:** `admin/routes/events/page.tsx`
**Admin Hook:** `use-events.ts`
**Migrations:** 1
**Links:** `product-event` (Product → Event)
**Workflows:** `event-ticketing`
**Maturity:** ██████████ 100%

---

### 4.21 financial-product

**Purpose:** Financial products vertical with loans, insurance, and investment plans.

**Models (6):**

| Model | Description |
|-------|-------------|
| `loan-product` | Loan product definition with rates and terms |
| `loan-application` | Customer loan application with status |
| `insurance-product` | Insurance product with coverage details |
| `insurance-policy` | Active insurance policy |
| `investment-plan` | Investment plan with returns and risk profile |

**Service (84 lines):** `FinancialProductModuleService`
- `createProduct()` — define financial product
- `submitApplication()` — submit loan/insurance application
- `reviewApplication()` — review and approve/deny
- `activatePolicy()` — activate insurance policy
- `getPortfolio()` — customer portfolio summary

**API Routes:** Admin: 4 (CRUD) | Store: 2 (list, detail)
**Admin Page:** None (managed via admin API)
**Migrations:** 1
**Links:** None
**Maturity:** █████████░ 90%

---

### 4.22 fitness

**Purpose:** Fitness vertical with gym memberships, class schedules, trainer profiles, bookings, and wellness plans.

**Models (6):**

| Model | Description |
|-------|-------------|
| `gym-membership` | Gym membership with type, duration, access |
| `class-schedule` | Fitness class schedule with capacity |
| `trainer-profile` | Trainer bio, certifications, specializations |
| `class-booking` | Booking for fitness class |
| `wellness-plan` | Personalized wellness/fitness plan |

**Service (84 lines):** `FitnessModuleService`
- `createMembership()` — create gym membership
- `scheduleClass()` — add class to schedule
- `bookClass()` — book customer into class
- `assignTrainer()` — assign trainer to member
- `createWellnessPlan()` — generate wellness plan

**API Routes:** Admin: 4 (CRUD) | Store: 2 (list, detail)
**Admin Page:** `admin/routes/fitness/page.tsx`
**Admin Hook:** `use-fitness.ts`
**Migrations:** 1
**Links:** None
**Maturity:** ██████████ 100%

---

### 4.23 freelance

**Purpose:** Freelance marketplace with gig listings, proposals, contracts, milestones, time tracking, and disputes.

**Models (7):**

| Model | Description |
|-------|-------------|
| `gig-listing` | Freelance gig/job listing with requirements |
| `proposal` | Freelancer proposal with pricing and timeline |
| `freelance-contract` | Accepted contract between client and freelancer |
| `milestone` | Contract milestones with deliverables |
| `time-log` | Time tracking entries for hourly contracts |
| `freelance-dispute` | Dispute specific to freelance contracts |

**Service (139 lines):** `FreelanceModuleService`
- `createListing()` — post freelance gig
- `submitProposal()` — freelancer submits proposal
- `awardContract()` — accept proposal, create contract
- `completeMilestone()` — mark milestone as done
- `logTime()` — record work time
- `resolveDispute()` — handle freelance disputes

**API Routes:** Admin: 4 (CRUD) | Store: 2 (list, detail)
**Admin Page:** `admin/routes/freelance/page.tsx`
**Admin Hook:** `use-freelance.ts`
**Migrations:** 1
**Links:** `vendor-freelance` (Vendor → GigListing)
**Maturity:** ██████████ 100%

---

### 4.24 governance

**Purpose:** Governance authority management for regulatory compliance and policy enforcement.

**Models (2):**

| Model | Description |
|-------|-------------|
| `governance-authority` | Governing body with jurisdiction, policies, rules |

**Service (78 lines):** `GovernanceModuleService`
- `createAuthority()` — define governance authority
- `updatePolicies()` — update authority policies
- `checkCompliance()` — verify entity compliance
- `propagatePolicy()` — propagate policy changes

**API Routes:** Admin: 4 (CRUD) | Store: 1 (CityOS governance)
**Admin Page:** `admin/routes/governance/page.tsx`
**Admin Hook:** `use-governance.ts`
**Migrations:** 1
**Links:** `node-governance` (Node → GovernanceAuthority)
**Maturity:** ██████████ 100%

---

### 4.25 government

**Purpose:** Government services vertical with service requests, permits, licenses, fines, and citizen profiles.

**Models (6):**

| Model | Description |
|-------|-------------|
| `service-request` | Citizen service request with type and status |
| `permit` | Permit application and issuance |
| `municipal-license` | Municipal business/trade license |
| `fine` | Fine/penalty with payment status |
| `citizen-profile` | Citizen profile with ID verification |

**Service (80 lines):** `GovernmentModuleService`
- `submitRequest()` — create service request
- `issueLicense()` — issue municipal license
- `issuePermit()` — issue permit
- `issueFine()` — issue fine/penalty
- `getCitizenServices()` — citizen's active services

**API Routes:** Admin: 4 (CRUD) | Store: 2 (list, detail)
**Admin Page:** `admin/routes/government/page.tsx`
**Admin Hook:** `use-government.ts`
**Migrations:** 1
**Links:** None
**Maturity:** ██████████ 100%

---

### 4.26 grocery

**Purpose:** Grocery vertical with fresh product management, batch tracking, substitution rules, and delivery slots.

**Models (5):**

| Model | Description |
|-------|-------------|
| `fresh-product` | Fresh product with expiry tracking |
| `batch-tracking` | Batch/lot tracking for traceability |
| `substitution-rule` | Auto-substitution rules for out-of-stock items |
| `delivery-slot` | Time-slotted delivery windows |

**Service (79 lines):** `GroceryModuleService`
- `createProduct()` — add fresh product with expiry
- `trackBatch()` — log batch/lot information
- `findSubstitute()` — find substitute product
- `getAvailableSlots()` — list available delivery slots
- `checkFreshness()` — validate product freshness

**API Routes:** Admin: 4 (CRUD) | Store: 2 (list, detail)
**Admin Page:** `admin/routes/grocery/page.tsx`
**Admin Hook:** `use-grocery.ts`
**Migrations:** 1
**Links:** None
**Maturity:** ██████████ 100%

---

### 4.27 healthcare

**Purpose:** Healthcare vertical with practitioner management, appointments, prescriptions, lab orders, medical records, pharmacy, and insurance claims.

**Models (8):**

| Model | Description |
|-------|-------------|
| `practitioner` | Healthcare provider profile with specializations |
| `healthcare-appointment` | Patient appointment with practitioner |
| `prescription` | Prescription with medications and dosage |
| `lab-order` | Lab test order with results |
| `medical-record` | Patient medical record (encrypted) |
| `pharmacy-product` | Pharmacy product catalog |
| `insurance-claim` | Insurance claim submission and processing |

**Service (89 lines):** `HealthcareModuleService`
- `bookAppointment()` — schedule healthcare appointment
- `createPrescription()` — issue prescription
- `orderLabTest()` — create lab order
- `submitClaim()` — submit insurance claim
- `getPatientHistory()` — retrieve medical history

**API Routes:** Admin: 4 (CRUD) | Store: 1 (list)
**Admin Page:** `admin/routes/healthcare/page.tsx`
**Admin Hook:** `use-healthcare.ts`
**Migrations:** 1
**Links:** None
**Maturity:** ██████████ 100%

---

### 4.28 i18n

**Purpose:** Internationalization with translation management for multi-locale support.

**Models (2):**

| Model | Description |
|-------|-------------|
| `translation` | Translation entry with locale, key, value |

**Service (104 lines):** `I18nModuleService`
- `createTranslation()` — add translation entry
- `getTranslations()` — get translations for locale
- `importTranslations()` — bulk import translations
- `exportTranslations()` — export for locale
- `getMissingTranslations()` — find untranslated keys

**API Routes:** Admin: 4 (CRUD) | Store: 0
**Admin Page:** `admin/routes/i18n/page.tsx`
**Admin Hook:** `use-i18n.ts`
**Migrations:** 1
**Links:** None
**Maturity:** ██████████ 100%

---

### 4.29 inventory-extension

**Purpose:** Extended inventory management with reservation holds, stock alerts, and warehouse transfers.

**Models (3):**

| Model | Description |
|-------|-------------|
| `reservation-hold` | Temporary inventory holds for carts/orders |
| `stock-alert` | Low stock and reorder point alerts |
| `warehouse-transfer` | Inter-warehouse stock transfer orders |

**Service (177 lines):** `InventoryExtensionModuleService`
- `createHold()` — reserve inventory for order
- `releaseHold()` — release reservation
- `setAlertThreshold()` — configure stock alerts
- `initiateTransfer()` — create warehouse transfer
- `completeTransfer()` — confirm transfer receipt

**API Routes:** Admin: 4 (CRUD) | Store: 0
**Admin Page:** `admin/routes/inventory/page.tsx`
**Admin Hook:** `use-inventory-ext.ts`
**Migrations:** 1
**Links:** None
**Workflows:** `inventory-replenishment`
**Maturity:** ██████████ 100%

---

### 4.30 invoice

**Purpose:** Invoice management with line items, payment tracking, early/partial payment, and overdue handling.

**Models (2):**

| Model | Description |
|-------|-------------|
| `invoice-item` | Invoice line item with quantity, price, tax |
| `invoice` | Invoice header with totals, dates, status |

**Service (167 lines):** `InvoiceModuleService`
- `createInvoice()` — generate invoice from order
- `sendInvoice()` — send invoice to customer
- `recordPayment()` — record full payment
- `recordPartialPayment()` — record partial payment
- `processEarlyPayment()` — apply early payment discount
- `voidInvoice()` — void invoice
- `getOverdueInvoices()` — list overdue invoices

**API Routes:** Admin: 12 | Store: 3 (list, detail, early-payment)
**Admin Page:** `admin/routes/invoices/page.tsx`
**Admin Hook:** `use-invoices.ts`
**Migrations:** 1
**Links:** `company-invoice` (Company → Invoice)
**Jobs:** `invoice-generation`
**Maturity:** ██████████ 100%

---

### 4.31 legal

**Purpose:** Legal services vertical with attorney profiles, case management, consultations, and retainer agreements.

**Models (5):**

| Model | Description |
|-------|-------------|
| `attorney-profile` | Attorney bio, bar admissions, practice areas |
| `legal-case` | Legal case with parties, status, timeline |
| `consultation` | Scheduled legal consultation |
| `retainer-agreement` | Retainer contract with billing terms |

**Service (83 lines):** `LegalModuleService`
- `createCase()` — open legal case
- `scheduleConsultation()` — book consultation
- `createRetainer()` — establish retainer agreement
- `updateCaseStatus()` — advance case status
- `getCaseHistory()` — case timeline and documents

**API Routes:** Admin: 4 (CRUD) | Store: 2 (list, detail)
**Admin Page:** `admin/routes/legal/page.tsx`
**Admin Hook:** `use-legal.ts`
**Migrations:** 1
**Links:** None
**Maturity:** ██████████ 100%

---

### 4.32 loyalty

**Purpose:** Loyalty program management with accounts, point transactions, earning rules, and redemption.

**Models (3):**

| Model | Description |
|-------|-------------|
| `loyalty-program` | Program definition with rules and multipliers |
| `loyalty-account` | Customer loyalty account with balance |
| `point-transaction` | Point earn/redeem transaction log |

**Service (240 lines):** `LoyaltyModuleService`
- `createProgram()` — define loyalty program
- `enrollCustomer()` — create loyalty account
- `earnPoints()` — credit points for activity
- `redeemPoints()` — debit points for reward
- `getBalance()` — check point balance
- `getTransactionHistory()` — point transaction log
- `calculateTier()` — determine loyalty tier
- `applyMultiplier()` — apply earning multiplier

**API Routes:** Admin: 4 (CRUD) | Store: 1 (loyalty info)
**Admin Page:** `admin/routes/loyalty/page.tsx`
**Admin Hook:** `use-loyalty.ts`
**Migrations:** 1
**Links:** `customer-loyalty` (Customer → LoyaltyProgram)
**Workflows:** `loyalty-reward`
**Maturity:** ██████████ 100%

---

### 4.33 membership

**Purpose:** Membership program with tiers, points ledger, rewards catalog, and redemption tracking.

**Models (6):**

| Model | Description |
|-------|-------------|
| `membership-tier` | Tier levels with benefits and thresholds |
| `membership` | Customer membership with tier and expiry |
| `points-ledger` | Points balance and transaction history |
| `reward` | Reward catalog items |
| `redemption` | Reward redemption records |

**Service (99 lines):** `MembershipModuleService`
- `createTier()` — define membership tier
- `enrollMember()` — create membership
- `upgradeTier()` — upgrade member tier
- `addPoints()` — credit points to ledger
- `redeemReward()` — process reward redemption

**API Routes:** Admin: 4 (CRUD) | Store: 1 (list)
**Admin Page:** `admin/routes/memberships/page.tsx`
**Admin Hook:** `use-memberships.ts`
**Migrations:** 1
**Links:** `customer-membership` (Customer → Membership)
**Maturity:** ██████████ 100%

---

### 4.34 node

**Purpose:** Hierarchical node management for the CityOS five-level organizational structure.

**Models (2):**

| Model | Description |
|-------|-------------|
| `node` | Node entity with type, depth, parent, breadcrumbs, location, status |

**Service (152 lines):** `NodeModuleService`
- `createNode()` — create node in hierarchy
- `moveNode()` — reparent node
- `getDescendants()` — list all child nodes
- `getAncestors()` — list parent chain
- `decommissionNode()` — safely remove node

**API Routes:** Admin: 4 (CRUD) | Store: 1 (CityOS nodes)
**Admin Page:** `admin/routes/nodes/page.tsx`
**Admin Hook:** `use-nodes.ts`
**Migrations:** 1
**Links:** `tenant-node` (Tenant → Node), `node-governance` (Node → GovernanceAuthority)
**Workflows:** `hierarchy-sync`
**Maturity:** ██████████ 100%

---

### 4.35 notification-preferences

**Purpose:** Customer notification preference management for email, SMS, push, and in-app channels.

**Models (1):**

| Model | Description |
|-------|-------------|
| `notification-preference` | Per-user notification preferences by channel and category |

**Service (115 lines):** `NotificationPreferencesModuleService`
- `getPreferences()` — get user preferences
- `updatePreferences()` — update channel preferences
- `subscribeNewsletter()` — newsletter subscription
- `unsubscribe()` — unsubscribe from channel
- `shouldNotify()` — check if notification should be sent

**API Routes:** Admin: 0 | Store: 1 (newsletter)
**Admin Page:** None
**Migrations:** 1
**Links:** None
**Maturity:** █████████░ 90%

---

### 4.36 parking

**Purpose:** Parking management with zones, sessions, shuttle routes, and ride requests.

**Models (5):**

| Model | Description |
|-------|-------------|
| `parking-zone` | Parking zone with capacity, rates, hours |
| `parking-session` | Active/completed parking session |
| `shuttle-route` | Shuttle bus route definition |
| `ride-request` | On-demand ride/shuttle request |

**Service (80 lines):** `ParkingModuleService`
- `createZone()` — define parking zone
- `startSession()` — begin parking session
- `endSession()` — end session, calculate charge
- `getOccupancy()` — real-time zone occupancy
- `requestRide()` — request shuttle ride

**API Routes:** Admin: 4 (CRUD) | Store: 2 (list, detail)
**Admin Page:** `admin/routes/parking/page.tsx`
**Admin Hook:** `use-parking.ts`
**Migrations:** 1
**Links:** None
**Maturity:** ██████████ 100%

---

### 4.37 payout

**Purpose:** Vendor payout processing with transaction linking, hold/release, and retry logic.

**Models (3):**

| Model | Description |
|-------|-------------|
| `payout-transaction-link` | Links payouts to source transactions |
| `payout` | Payout record with amount, status, method |

**Service (335 lines):** `PayoutModuleService`
- `createPayout()` — initiate vendor payout
- `processPayout()` — execute payout via Stripe
- `holdPayout()` — place payout on hold
- `releasePayout()` — release held payout
- `retryPayout()` — retry failed payout
- `getPayoutHistory()` — vendor payout history
- `calculatePayoutAmount()` — compute net payout after fees

**API Routes:** Admin: 10 (CRUD + hold/process/release/retry) | Store: 0
**Admin Page:** `admin/routes/payouts/page.tsx`
**Admin Hook:** None (inline)
**Admin Widget:** `payout-processing.tsx`
**Migrations:** 1
**Links:** `vendor-payout` (Vendor → Payout)
**Workflows:** `process-payout`, `payment-reconciliation`
**Subscribers:** `payout-completed`, `payout-failed`
**Jobs:** `vendor-payouts`
**Maturity:** ██████████ 100%

---

### 4.38 persona

**Purpose:** Six-axis persona system for contextual user experience customization.

**Models (3):**

| Model | Description |
|-------|-------------|
| `persona` | Persona definition with axes, constraints, features |
| `persona-assignment` | Assignment of persona to user with scope and priority |

**Service (134 lines):** `PersonaModuleService`
- `createPersona()` — define persona with axes
- `assignPersona()` — assign to user/scope
- `resolvePersona()` — determine active persona for context
- `getFeatureOverrides()` — get persona feature flags
- `evaluateConstraints()` — check persona constraints

**API Routes:** Admin: 4 (CRUD) | Store: 1 (CityOS persona)
**Admin Page:** `admin/routes/personas/page.tsx`
**Admin Hook:** `use-personas.ts`
**Migrations:** 1
**Links:** None
**Maturity:** ██████████ 100%

---

### 4.39 pet-service

**Purpose:** Pet services vertical with pet profiles, grooming, vet appointments, and pet products.

**Models (5):**

| Model | Description |
|-------|-------------|
| `pet-profile` | Pet profile with breed, age, health info |
| `grooming-booking` | Grooming appointment booking |
| `vet-appointment` | Veterinary appointment with clinic |
| `pet-product` | Pet-specific product catalog |

**Service (81 lines):** `PetServiceModuleService`
- `registerPet()` — create pet profile
- `bookGrooming()` — schedule grooming
- `bookVetVisit()` — schedule vet appointment
- `getHealthRecord()` — pet health history
- `recommendProducts()` — product recommendations

**API Routes:** Admin: 4 (CRUD) | Store: 2 (list, detail)
**Admin Page:** `admin/routes/pet-services/page.tsx`
**Admin Hook:** `use-pet-services.ts`
**Migrations:** 1
**Links:** None
**Maturity:** ██████████ 100%

---

### 4.40 promotion-ext

**Purpose:** Extended promotions with gift cards, referral programs, product bundles, and customer segments.

**Models (5):**

| Model | Description |
|-------|-------------|
| `gift-card-ext` | Extended gift card with custom branding |
| `referral` | Referral program with rewards |
| `product-bundle` | Product bundle with discount |
| `customer-segment` | Customer segmentation for targeted promos |

**Service (155 lines):** `PromotionExtModuleService`
- `createGiftCard()` — issue gift card
- `redeemGiftCard()` — process gift card redemption
- `createBundle()` — define product bundle
- `createReferral()` — set up referral program
- `segmentCustomers()` — build customer segments

**API Routes:** Admin: 4 (CRUD) | Store: 3 (bundles, flash-sales, gift-cards)
**Admin Page:** `admin/routes/promotions/page.tsx`
**Admin Hook:** `use-promotions-ext.ts`
**Migrations:** 1
**Links:** None
**Maturity:** ██████████ 100%

---

### 4.41 quote

**Purpose:** B2B quote management with line items, approval workflow, and conversion to orders.

**Models (3):**

| Model | Description |
|-------|-------------|
| `quote-item` | Quote line item with product, qty, price |
| `quote` | Quote header with totals, expiry, status |

**Service (147 lines):** `QuoteModuleService`
- `createQuote()` — generate quote from request
- `approveQuote()` — approve for sending
- `rejectQuote()` — reject with reason
- `convertToOrder()` — convert accepted quote to order
- `getExpiringQuotes()` — list soon-to-expire quotes

**API Routes:** Admin: 8 (CRUD + approve/convert/reject + expiring) | Store: 4 (list, detail, accept, decline)
**Admin Page:** `admin/routes/quotes/page.tsx`
**Admin Hook:** `use-quotes.ts`
**Admin Widget:** `quote-management.tsx`
**Migrations:** 1
**Links:** None
**Workflows:** `approve-quote`, `create-quote`
**Subscribers:** `quote-accepted`, `quote-approved`, `quote-declined`
**Jobs:** `stale-quote-cleanup`
**Maturity:** ██████████ 100%

---

### 4.42 real-estate

**Purpose:** Real estate vertical with property listings, viewings, leases, documents, valuations, and agent profiles.

**Models (7):**

| Model | Description |
|-------|-------------|
| `property-listing` | Property for sale/rent with specs and media |
| `viewing-appointment` | Scheduled property viewing |
| `lease-agreement` | Lease/rental agreement with terms |
| `property-document` | Documents attached to property |
| `property-valuation` | Property appraisal/valuation record |
| `agent-profile` | Real estate agent profile |

**Service (128 lines):** `RealEstateModuleService`
- `createListing()` — list property
- `scheduleViewing()` — book viewing appointment
- `createLease()` — generate lease agreement
- `requestValuation()` — request property valuation
- `getAgentListings()` — agent's active listings

**API Routes:** Admin: 4 (CRUD) | Store: 1 (list)
**Admin Page:** `admin/routes/real-estate/page.tsx`
**Admin Hook:** `use-real-estate.ts`
**Migrations:** 1
**Links:** None
**Maturity:** ██████████ 100%

---

### 4.43 region-zone

**Purpose:** Geographic region-to-zone mapping for location-based service configuration.

**Models (2):**

| Model | Description |
|-------|-------------|
| `region-zone-mapping` | Maps Medusa regions to CityOS zones |

**Service (162 lines):** `RegionZoneModuleService`
- `createMapping()` — link region to zone
- `resolveZone()` — determine zone from region
- `getZoneRegions()` — list regions in zone
- `syncMappings()` — synchronize region-zone data
- `validateMapping()` — check mapping integrity

**API Routes:** Admin: 4 (CRUD) | Store: 0
**Admin Page:** `admin/routes/region-zones/page.tsx`
**Admin Hook:** `use-region-zones.ts`
**Migrations:** 1
**Links:** None
**Maturity:** ██████████ 100%

---

### 4.44 rental

**Purpose:** Rental commerce with product listings, agreements, rental periods, returns, and damage claims.

**Models (6):**

| Model | Description |
|-------|-------------|
| `rental-product` | Product available for rental |
| `rental-agreement` | Rental contract with terms |
| `rental-period` | Rental duration and pricing |
| `rental-return` | Return/check-in record |
| `damage-claim` | Damage assessment and claim |

**Service (113 lines):** `RentalModuleService`
- `createProduct()` — list product for rental
- `createAgreement()` — generate rental contract
- `processReturn()` — check-in returned item
- `assessDamage()` — file damage claim
- `calculateRentalCost()` — compute rental charges

**API Routes:** Admin: 4 (CRUD) | Store: 2 (list, detail)
**Admin Page:** `admin/routes/rentals/page.tsx`
**Admin Hook:** `use-rentals.ts`
**Migrations:** 1
**Links:** `product-rental` (Product → RentalProduct)
**Maturity:** ██████████ 100%

---

### 4.45 restaurant

**Purpose:** Restaurant management with menus, modifier groups, table reservations, and kitchen order management.

**Models (8):**

| Model | Description |
|-------|-------------|
| `restaurant` | Restaurant profile with location, hours, cuisine |
| `menu` | Menu definition with categories |
| `menu-item` | Individual menu items with pricing |
| `modifier-group` | Modifier groups (size, toppings, etc.) |
| `modifier` | Individual modifiers with pricing |
| `table-reservation` | Table reservation with party size |
| `kitchen-order` | Kitchen order with prep status tracking |

**Service (82 lines):** `RestaurantModuleService`
- `createRestaurant()` — register restaurant
- `buildMenu()` — create menu with items
- `addModifiers()` — set up modifier groups
- `makeReservation()` — book table
- `createKitchenOrder()` — send order to kitchen

**API Routes:** Admin: 4 (CRUD) | Store: 1 (list)
**Admin Page:** `admin/routes/restaurants/page.tsx`
**Admin Hook:** `use-restaurants.ts`
**Migrations:** 1
**Links:** `vendor-restaurant` (Vendor → Restaurant)
**Maturity:** ██████████ 100%

---

### 4.46 review

**Purpose:** Product and vendor review system with moderation, verification, and helpfulness voting.

**Models (1):**

| Model | Description |
|-------|-------------|
| `review` | Review with rating, text, status, verification, helpful count |

**Service (137 lines):** `ReviewModuleService`
- `createReview()` — submit review
- `approveReview()` — approve review for display
- `rejectReview()` — reject review with reason
- `verifyReview()` — verify purchase-based review
- `markHelpful()` — vote review as helpful
- `getProductReviews()` — reviews for product
- `getVendorReviews()` — reviews for vendor
- `getReviewAnalytics()` — rating distributions

**API Routes:** Admin: 8 (CRUD + approve/reject/verify + analytics) | Store: 6 (list, detail, helpful, product/vendor reviews)
**Admin Page:** `admin/routes/reviews/page.tsx`
**Admin Hook:** `use-reviews.ts`, `use-reviews-page.ts`
**Migrations:** 1
**Links:** `product-review` (Product → Review)
**Subscribers:** `review-created`
**Workflows:** `content-moderation`
**Maturity:** ██████████ 100%

---

### 4.47 shipping-extension

**Purpose:** Extended shipping with custom rates and carrier configurations.

**Models (2):**

| Model | Description |
|-------|-------------|
| `shipping-rate` | Custom shipping rate with conditions |
| `carrier-config` | Carrier integration configuration |

**Service (83 lines):** `ShippingExtensionModuleService`
- `createRate()` — define shipping rate
- `configureCarrier()` — set up carrier integration
- `calculateRate()` — compute shipping cost
- `getCarrierStatus()` — check carrier connectivity

**API Routes:** Admin: 4 (CRUD) | Store: 1 (consignments)
**Admin Page:** `admin/routes/shipping/page.tsx`
**Admin Hook:** `use-shipping-ext.ts`
**Migrations:** 1
**Links:** None
**Maturity:** ██████████ 100%

---

### 4.48 social-commerce

**Purpose:** Social commerce with live streaming, product pinning, social posts, sharing, and group buying.

**Models (6):**

| Model | Description |
|-------|-------------|
| `live-stream` | Live stream session with schedule |
| `live-product` | Products pinned during live stream |
| `social-post` | Social media post with product tags |
| `social-share` | Share tracking for social referrals |
| `group-buy` | Group buying campaign with minimum participants |

**Service (77 lines):** `SocialCommerceModuleService`
- `createStream()` — schedule live stream
- `pinProduct()` — pin product in stream
- `createPost()` — create social post
- `trackShare()` — record social share
- `startGroupBuy()` — launch group buying campaign

**API Routes:** Admin: 4 (CRUD) | Store: 2 (list, detail)
**Admin Page:** `admin/routes/social-commerce/page.tsx`
**Admin Hook:** `use-social-commerce.ts`
**Migrations:** 1
**Links:** None
**Maturity:** ██████████ 100%

---

### 4.49 store

**Purpose:** CityOS store management extending Medusa's store concept with domain routing and tenant binding.

**Models (2):**

| Model | Description |
|-------|-------------|
| `store` | CityOS store with domain, subdomain, tenant binding |

**Service (84 lines):** `StoreModuleService`
- `createStore()` — create CityOS store
- `resolveByDomain()` — resolve store by custom domain
- `resolveBySubdomain()` — resolve store by subdomain
- `getDefaultStore()` — get default tenant store
- `updateStoreConfig()` — update store configuration

**API Routes:** Admin: 0 | Store: 4 (list, by-domain, by-subdomain, default)
**Admin Page:** None (managed via tenant settings)
**Migrations:** 1
**Links:** `tenant-store` (Tenant → Store), `vendor-store` (Vendor → Store)
**Maturity:** █████████░ 90%

---

### 4.50 subscription

**Purpose:** Subscription billing engine with plans, billing cycles, events, and full lifecycle management including Stripe integration.

**Models (6):**

| Model | Description |
|-------|-------------|
| `billing-cycle` | Billing cycle record with dates and amounts |
| `subscription-event` | Subscription lifecycle events |
| `subscription-item` | Items included in subscription |
| `subscription-plan` | Plan definition with Stripe price/product IDs |
| `subscription` | Active subscription with status and dates |

**Service (694 lines):** `SubscriptionModuleService`
- `createPlan()` — define subscription plan
- `createSubscription()` — start subscription
- `cancelSubscription()` — cancel with policy
- `pauseSubscription()` — pause billing
- `resumeSubscription()` — resume paused subscription
- `changePlan()` — upgrade/downgrade plan
- `processBillingCycle()` — execute billing
- `retryFailedPayment()` — retry failed payment
- `handleRenewal()` — process renewal
- `updatePaymentMethod()` — change payment method
- `getBillingHistory()` — customer billing history
- `checkTrialExpiration()` — handle trial-to-paid conversion

**API Routes:** Admin: 12 | Store: 11 (full lifecycle)
**Admin Page:** `admin/routes/subscriptions/page.tsx`
**Admin Hook:** `use-subscriptions.ts`
**Migrations:** 1
**Links:** `customer-subscription` (Customer → Subscription)
**Workflows:** `create-subscription`, `process-billing-cycle`, `subscription-renewal`, `retry-failed-payment`
**Subscribers:** `subscription-created`, `subscription-cancelled`, `subscription-paused`, `subscription-resumed`, `subscription-payment-failed`, `subscription-plan-changed`, `subscription-renewal-upcoming`
**Jobs:** `subscription-billing`, `subscription-expiry-warning`, `subscription-renewal-reminder`, `trial-expiration`
**Maturity:** ██████████ 100%

---

### 4.51 tax-config

**Purpose:** Tax configuration with tax rules and exemption management.

**Models (2):**

| Model | Description |
|-------|-------------|
| `tax-exemption` | Tax exemption certificate and status |
| `tax-rule` | Tax calculation rules by region/category |

**Service (206 lines):** `TaxConfigModuleService`
- `createRule()` — define tax rule
- `calculateTax()` — compute tax for transaction
- `addExemption()` — register tax exemption
- `validateExemption()` — check exemption validity
- `getTaxReport()` — generate tax report

**API Routes:** Admin: 0 | Store: 0 (internal module)
**Admin Page:** None (managed via settings)
**Migrations:** 1
**Links:** None
**Maturity:** █████████░ 90%

---

### 4.52 tenant

**Purpose:** Multi-tenant platform management — tenant lifecycle, settings, billing, team management, POIs, service channels, and inter-tenant relationships.

**Models (8):**

| Model | Description |
|-------|-------------|
| `tenant-billing` | Subscription billing with Stripe integration |
| `tenant-settings` | Tenant-specific settings (locale, currency, branding, notifications, commerce) |
| `tenant-user` | Team member with RBAC role, permissions, node assignments |
| `tenant-relationship` | Inter-tenant relationships (parent/child, franchise) |
| `tenant-poi` | Points of Interest (physical locations) |
| `service-channel` | Service channel configurations |
| `tenant` | Tenant entity with full configuration |

**Service (506 lines):** `TenantModuleService`
- `createTenant()` — provision new tenant
- `updateTenant()` — update tenant config
- `manageBilling()` — handle subscription billing
- `inviteTeamMember()` — send team invitation
- `setTeamRole()` — assign RBAC role
- `managePOIs()` — CRUD for points of interest
- `configureSettings()` — update tenant settings
- `suspendTenant()` — suspend tenant account
- `archiveTenant()` — archive inactive tenant
- `getTeamMembers()` — list team with roles

**API Routes:** Admin: 10 | Store: 1 (CityOS tenant) + POI routes
**Admin Page:** `admin/routes/tenants/page.tsx`, `admin/routes/tenants/[id]/billing/page.tsx`
**Admin Hook:** `use-tenants.ts`
**Migrations:** 2
**Links:** `tenant-node` (Tenant → Node), `tenant-store` (Tenant → Store)
**Workflows:** `tenant-provisioning`
**Maturity:** ██████████ 100%

---

### 4.53 travel

**Purpose:** Travel/hospitality vertical with properties, room types, rooms, reservations, rate plans, guest profiles, and amenities.

**Models (8):**

| Model | Description |
|-------|-------------|
| `property` | Accommodation property (hotel, hostel, villa) |
| `room-type` | Room type definition with capacity |
| `room` | Individual room with number and status |
| `reservation` | Booking reservation with dates and guests |
| `rate-plan` | Dynamic rate plan with seasonal pricing |
| `guest-profile` | Guest profile with preferences |
| `amenity` | Property/room amenities |

**Service (79 lines):** `TravelModuleService`
- `createProperty()` — register accommodation
- `defineRoomTypes()` — set up room categories
- `createReservation()` — book room
- `checkIn()` — guest check-in
- `checkOut()` — guest check-out

**API Routes:** Admin: 4 (CRUD) | Store: 2 (list, detail)
**Admin Page:** `admin/routes/travel/page.tsx`
**Admin Hook:** `use-travel.ts`
**Migrations:** 1
**Links:** None
**Maturity:** ██████████ 100%

---

### 4.54 utilities

**Purpose:** Utility services management with accounts, bills, meter readings, and usage records.

**Models (5):**

| Model | Description |
|-------|-------------|
| `utility-account` | Customer utility account |
| `utility-bill` | Generated utility bill |
| `meter-reading` | Meter reading record |
| `usage-record` | Usage data points |

**Service (264 lines):** `UtilitiesModuleService`
- `createAccount()` — register utility account
- `recordReading()` — submit meter reading
- `generateBill()` — calculate and generate bill
- `processPayment()` — record bill payment
- `getUsageHistory()` — usage analytics

**API Routes:** Admin: 4 (CRUD) | Store: 2 (list, detail)
**Admin Page:** None
**Migrations:** 1
**Links:** None
**Maturity:** █████████░ 90%

---

### 4.55 vendor

**Purpose:** Multi-vendor marketplace with vendor profiles, products, orders, analytics, performance metrics, and Stripe Connect.

**Models (7):**

| Model | Description |
|-------|-------------|
| `vendor-analytics` | Vendor analytics snapshots |
| `vendor-user` | Vendor team member association |
| `vendor` | Vendor profile with Stripe account, status |
| `vendor-product` | Vendor-specific product listing |
| `vendor-order` | Order split for vendor |
| `marketplace-listing` | Cross-marketplace product listing |

**Service (474 lines):** `VendorModuleService`
- `createVendor()` — register vendor
- `approveVendor()` — approve vendor application
- `suspendVendor()` — suspend vendor
- `reinstateVendor()` — reinstate suspended vendor
- `getPerformanceMetrics()` — calculate KPIs
- `splitOrder()` — split order by vendor
- `getVendorAnalytics()` — comprehensive analytics
- `setupStripeConnect()` — configure Stripe Connect
- `getPayoutSchedule()` — vendor payout schedule

**API Routes:** Admin: 12 | Store: 10 (register, featured, by handle, reviews, Stripe Connect) | Vendor: 11
**Admin Page:** `admin/routes/vendors/page.tsx`, `admin/routes/vendors/analytics/page.tsx`
**Admin Hook:** `use-vendors.ts`
**Admin Widget:** `vendor-management.tsx`
**Migrations:** 1
**Links:** `order-vendor` (Order → Vendor), `vendor-commission` (Vendor → CommissionRule), `vendor-payout` (Vendor → Payout), `vendor-store` (Vendor → Store), `vendor-restaurant` (Vendor → Restaurant), `vendor-freelance` (Vendor → GigListing)
**Workflows:** `approve-vendor`, `create-vendor`, `vendor-onboarding`, `calculate-commission`
**Subscribers:** `vendor-approved`, `vendor-suspended`
**Jobs:** `inactive-vendor-check`
**Maturity:** ██████████ 100%

---

### 4.56 volume-pricing

**Purpose:** Tiered volume pricing for B2B with quantity-based discounts.

**Models (3):**

| Model | Description |
|-------|-------------|
| `volume-pricing-tier` | Price tier with quantity thresholds |
| `volume-pricing` | Volume pricing configuration for product |

**Service (225 lines):** `VolumePricingModuleService`
- `createPricing()` — define volume pricing
- `addTier()` — add quantity tier
- `calculatePrice()` — compute price for quantity
- `getProductPricing()` — get pricing tiers for product
- `applyCompanyPricing()` — apply company-specific pricing

**API Routes:** Admin: 4 (CRUD) | Store: 1 (product volume pricing)
**Admin Page:** `admin/routes/volume-pricing/page.tsx`
**Admin Hook:** `use-volume-pricing.ts`
**Migrations:** 1
**Links:** None
**Maturity:** ██████████ 100%

---

### 4.57 warranty

**Purpose:** Warranty and after-sales service with plans, claims, repair orders, spare parts, and service centers.

**Models (6):**

| Model | Description |
|-------|-------------|
| `warranty-plan` | Warranty plan with coverage and duration |
| `warranty-claim` | Customer warranty claim |
| `repair-order` | Repair work order |
| `spare-part` | Spare parts inventory |
| `service-center` | Authorized service center |

**Service (101 lines):** `WarrantyModuleService`
- `createPlan()` — define warranty plan
- `submitClaim()` — file warranty claim
- `createRepairOrder()` — generate repair order
- `trackRepair()` — track repair progress
- `locateServiceCenter()` — find nearest service center

**API Routes:** Admin: 4 (CRUD) | Store: 2 (list, detail)
**Admin Page:** `admin/routes/warranty/page.tsx`
**Admin Hook:** `use-warranty.ts`
**Migrations:** 1
**Links:** `product-warranty` (Product → WarrantyPlan)
**Maturity:** ██████████ 100%

---

### 4.58 wishlist

**Purpose:** Customer wishlist management with items and sharing.

**Models (2):**

| Model | Description |
|-------|-------------|
| `wishlist` | Wishlist container with name, visibility |
| `wishlist-item` | Individual product added to wishlist |

**Service (136 lines):** `WishlistModuleService`
- `createWishlist()` — create wishlist
- `addItem()` — add product to wishlist
- `removeItem()` — remove product from wishlist
- `getWishlist()` — get wishlist with items
- `shareWishlist()` — generate share link

**API Routes:** Admin: 4 (CRUD) | Store: 0
**Admin Page:** `admin/routes/wishlists/page.tsx`
**Admin Hook:** `use-wishlists.ts`
**Migrations:** 1
**Links:** `customer-wishlist` (Customer → Wishlist)
**Maturity:** ██████████ 100%

---

## 5. Cross-Module Link Registry

All 27 cross-module links are defined using Medusa's `defineLink()` utility in `apps/backend/src/links/`.

| # | Link File | Source Module | Source Entity | Target Module | Target Entity | Relationship |
|---|-----------|---------------|---------------|---------------|---------------|-------------|
| 1 | `booking-customer.ts` | Customer (core) | `customer` | Booking | `booking` | One-to-Many |
| 2 | `company-invoice.ts` | Company | `company` | Invoice | `invoice` | One-to-Many |
| 3 | `customer-company.ts` | Customer (core) | `customer` | Company | `company` | Many-to-One |
| 4 | `customer-donation.ts` | Customer (core) | `customer` | Charity | `donation` | One-to-Many |
| 5 | `customer-loyalty.ts` | Customer (core) | `customer` | Loyalty | `loyaltyProgram` | One-to-Many |
| 6 | `customer-membership.ts` | Customer (core) | `customer` | Membership | `membership` | One-to-Many |
| 7 | `customer-subscription.ts` | Customer (core) | `customer` | Subscription | `subscription` | One-to-Many |
| 8 | `customer-vehicle.ts` | Customer (core) | `customer` | Automotive | `vehicleListing` | One-to-Many |
| 9 | `customer-wishlist.ts` | Customer (core) | `customer` | Wishlist | `wishlist` | One-to-One |
| 10 | `node-governance.ts` | Node | `node` | Governance | `governanceAuthority` | Many-to-One |
| 11 | `order-dispute.ts` | Order (core) | `order` | Dispute | `dispute` | One-to-Many |
| 12 | `order-vendor.ts` | Order (core) | `order` | Vendor | `vendor` | Many-to-One |
| 13 | `product-auction.ts` | Product (core) | `product` | Auction | `auctionListing` | One-to-One |
| 14 | `product-classified.ts` | Product (core) | `product` | Classified | `classifiedListing` | One-to-One |
| 15 | `product-course.ts` | Product (core) | `product` | Education | `course` | One-to-One |
| 16 | `product-digital-asset.ts` | Product (core) | `product` | Digital Product | `digitalAsset` | One-to-One |
| 17 | `product-event.ts` | Product (core) | `product` | Event Ticketing | `event` | One-to-One |
| 18 | `product-rental.ts` | Product (core) | `product` | Rental | `rentalProduct` | One-to-One |
| 19 | `product-review.ts` | Product (core) | `product` | Review | `review` | One-to-Many |
| 20 | `product-warranty.ts` | Product (core) | `product` | Warranty | `warrantyPlan` | One-to-Many |
| 21 | `tenant-node.ts` | Tenant | `tenant` | Node | `node` | One-to-Many |
| 22 | `tenant-store.ts` | Tenant | `tenant` | Store | `cityosStore` | One-to-Many |
| 23 | `vendor-commission.ts` | Vendor | `vendor` | Commission | `commissionRule` | One-to-Many |
| 24 | `vendor-freelance.ts` | Vendor | `vendor` | Freelance | `gigListing` | One-to-Many |
| 25 | `vendor-payout.ts` | Vendor | `vendor` | Payout | `payout` | One-to-Many |
| 26 | `vendor-restaurant.ts` | Vendor | `vendor` | Restaurant | `restaurant` | One-to-One |
| 27 | `vendor-store.ts` | Vendor | `vendor` | Store | `cityosStore` | One-to-One |

### Link Distribution by Source Entity

| Source Entity | Link Count | Targets |
|---------------|-----------|---------|
| Customer (core) | 7 | Booking, Company, Donation, Loyalty, Membership, Subscription, Vehicle, Wishlist |
| Product (core) | 7 | Auction, Classified, Course, DigitalAsset, Event, Rental, Review, Warranty |
| Vendor | 5 | Commission, Freelance, Payout, Restaurant, Store |
| Tenant | 2 | Node, Store |
| Order (core) | 2 | Dispute, Vendor |
| Node | 1 | Governance |
| Company | 1 | Invoice |

---

## 6. Workflow & Job Registry

### 6.1 Workflows (30 total)

All workflows are defined in `apps/backend/src/workflows/` and dispatched via the event outbox system.

| # | Workflow ID | Category | Trigger | Description | Compensation |
|---|-------------|----------|---------|-------------|-------------|
| 1 | `auction-lifecycle` | Commerce | auction.started | Manage auction bidding period, auto-extend, settlement | Release escrow, notify bidders |
| 2 | `approve-quote` | B2B | quote.submitted | Multi-level quote approval | Notify rejection |
| 3 | `create-company` | B2B | company.registered | Company registration and verification | Cleanup partial data |
| 4 | `create-quote` | B2B | quote.requested | Generate quote from customer request | Notify failure |
| 5 | `booking-confirmation` | Booking | booking.created | Confirm and notify booking parties | Release time slot |
| 6 | `campaign-activation` | Marketing | campaign.created | Activate crowdfunding/marketing campaign | Deactivate campaign |
| 7 | `commission-calculation` | Finance | order.completed | Calculate vendor commissions | Reverse commission entries |
| 8 | `content-moderation` | Platform | content.submitted | Moderate user-generated content | Quarantine content |
| 9 | `dispute-resolution` | Commerce | dispute.opened | Mediate dispute between parties | Escalate to manual review |
| 10 | `event-ticketing` | Events | event.published | Process event ticketing and sales | Refund tickets |
| 11 | `fleet-dispatch` | Logistics | fulfillment.created | Dispatch delivery via Fleetbase | Release driver assignment |
| 12 | `hierarchy-sync` | Platform | node.updated | Sync node hierarchy changes | Rollback hierarchy |
| 13 | `inventory-replenishment` | Commerce | stock.low | Trigger reorder when stock low | Cancel reorder |
| 14 | `kyc-verification` | Identity | kyc.requested | Verify identity via Walt.id | Mark verification failed |
| 15 | `loyalty-reward` | Loyalty | points.earned | Process loyalty point awards | Reverse points |
| 16 | `order-fulfillment` | Commerce | order.placed | End-to-end order processing | Refund and release inventory |
| 17 | `payment-reconciliation` | Finance | payment.completed | Reconcile payments across systems | Flag for manual reconciliation |
| 18 | `product-sync` | Sync | product.updated | Sync product to external systems | Rollback sync |
| 19 | `return-processing` | Commerce | return.initiated | Process return request | Cancel return |
| 20 | `create-subscription` | Subscription | subscription.requested | Create and activate subscription | Cancel subscription |
| 21 | `process-billing-cycle` | Subscription | billing.due | Execute subscription billing | Retry or suspend |
| 22 | `subscription-renewal` | Subscription | subscription.renewal_due | Process subscription renewal | Notify expiration |
| 23 | `retry-failed-payment` | Subscription | payment.failed | Retry failed subscription payment | Suspend subscription |
| 24 | `tenant-provisioning` | Platform | tenant.created | Full tenant setup across systems | Rollback provisioning |
| 25 | `trade-in-evaluation` | Automotive | trade-in.submitted | Evaluate vehicle trade-in value | Reject trade-in |
| 26 | `approve-vendor` | Vendor | vendor.submitted | Vendor approval workflow | Reject vendor |
| 27 | `calculate-commission` | Vendor | order.vendor_split | Calculate vendor-specific commission | Reverse commission |
| 28 | `create-vendor` | Vendor | vendor.registered | Vendor creation and initial setup | Cleanup vendor data |
| 29 | `vendor-onboarding` | Vendor | vendor.approved | Full vendor onboarding post-approval | Rollback onboarding |
| 30 | `process-payout` | Vendor | payout.requested | Process vendor payout via Stripe | Retry or manual payout |

### 6.2 Subscribers (33 total)

All subscribers are defined in `apps/backend/src/subscribers/` and respond to Medusa event bus events.

| # | Subscriber | Event | Handler Description |
|---|-----------|-------|-------------------|
| 1 | `booking-cancelled` | `booking.cancelled` | Process cancellation, notify parties, release slot |
| 2 | `booking-checked-in` | `booking.checked_in` | Record check-in, update provider status |
| 3 | `booking-completed` | `booking.completed` | Mark complete, trigger review request |
| 4 | `booking-confirmed` | `booking.confirmed` | Send confirmation, update calendar |
| 5 | `booking-created` | `booking.created` | Initialize booking, send notification |
| 6 | `company-created` | `company.created` | Set up company defaults, notify admin |
| 7 | `customer-created` | `customer.created` | Create loyalty account, set preferences |
| 8 | `integration-sync` | `integration.sync` | Dispatch sync to external systems |
| 9 | `order-cancelled` | `order.cancelled` | Process cancellation, release inventory, refund |
| 10 | `order-placed` | `order.placed` | Split order by vendor, initiate fulfillment |
| 11 | `order-returned` | `order.returned` | Process return, update inventory, refund |
| 12 | `order-shipped` | `order.shipped` | Start tracking, notify customer |
| 13 | `payment-authorized` | `payment.authorized` | Capture payment, update order status |
| 14 | `payment-captured` | `payment.captured` | Confirm payment, trigger fulfillment |
| 15 | `payment-failed` | `payment.failed` | Notify customer, retry logic |
| 16 | `payment-refunded` | `payment.refunded` | Update order, credit customer |
| 17 | `payout-completed` | `payout.completed` | Notify vendor, update ledger |
| 18 | `payout-failed` | `payout.failed` | Alert admin, retry payout |
| 19 | `purchase-order-submitted` | `purchase_order.submitted` | Route PO through approval workflow |
| 20 | `quote-accepted` | `quote.accepted` | Convert quote to order |
| 21 | `quote-approved` | `quote.approved` | Send quote to customer |
| 22 | `quote-declined` | `quote.declined` | Notify sales team |
| 23 | `review-created` | `review.created` | Queue for moderation |
| 24 | `subscription-cancelled` | `subscription.cancelled` | Process cancellation, prorate refund |
| 25 | `subscription-created` | `subscription.created` | Welcome email, setup billing |
| 26 | `subscription-paused` | `subscription.paused` | Pause billing, notify customer |
| 27 | `subscription-payment-failed` | `subscription.payment_failed` | Retry payment, notify customer |
| 28 | `subscription-plan-changed` | `subscription.plan_changed` | Adjust billing, notify changes |
| 29 | `subscription-renewal-upcoming` | `subscription.renewal_upcoming` | Send renewal reminder |
| 30 | `subscription-resumed` | `subscription.resumed` | Resume billing, notify customer |
| 31 | `temporal-event-bridge` | `temporal.*` | Bridge Temporal events to outbox |
| 32 | `vendor-approved` | `vendor.approved` | Send approval notification, trigger onboarding |
| 33 | `vendor-suspended` | `vendor.suspended` | Disable listings, notify vendor |

### 6.3 Scheduled Jobs (16 total)

All jobs are defined in `apps/backend/src/jobs/` and run on cron schedules.

| # | Job | Schedule | Description |
|---|-----|----------|-------------|
| 1 | `booking-no-show-check` | Every 15 min | Check for no-show bookings and process penalties |
| 2 | `booking-reminders` | Every 30 min | Send booking reminders (24h and 1h before) |
| 3 | `cleanup-expired-carts` | Daily 2:00 AM | Remove expired cart sessions and metadata |
| 4 | `commission-settlement` | Daily 6:00 AM | Settle pending commission transactions |
| 5 | `failed-payment-retry` | Every 4 hours | Retry failed payment attempts |
| 6 | `inactive-vendor-check` | Weekly Monday | Flag vendors inactive for 30+ days |
| 7 | `integration-sync-scheduler` | Every 30 min | Schedule pending integration sync jobs |
| 8 | `invoice-generation` | Daily 1:00 AM | Auto-generate invoices for completed orders |
| 9 | `payload-cms-poll` | Every 15 min | Poll Payload CMS for content changes |
| 10 | `stale-quote-cleanup` | Daily 3:00 AM | Expire and archive stale quotes |
| 11 | `subscription-billing` | Hourly | Process due subscription billing cycles |
| 12 | `subscription-expiry-warning` | Daily 9:00 AM | Send expiry warnings (7 days before) |
| 13 | `subscription-renewal-reminder` | Daily 9:00 AM | Send renewal reminders (14 days before) |
| 14 | `sync-scheduler-init` | On startup | Initialize sync scheduler state |
| 15 | `trial-expiration` | Daily midnight | Convert expired trials to paid or suspend |
| 16 | `vendor-payouts` | Daily 8:00 AM | Process pending vendor payout batches |

---

## 7. Storefront Architecture

### 7.1 Overview

The storefront is a React/Remix application supporting multi-tenant, multi-locale routing with 142 route files and 537 components.

**Route Pattern:** `/$tenant/$locale/<page>`

### 7.2 Route Structure (142 routes)

| Category | Route Pattern | Route Count | Description |
|----------|--------------|-------------|-------------|
| Homepage | `/$tenant/$locale/` | 1 | Tenant homepage |
| Products | `/$tenant/$locale/products/*` | 4 | Product catalog, detail, search |
| Account | `/$tenant/$locale/account/*` | 8 | Profile, orders, bookings, subscriptions, POs |
| Bookings | `/$tenant/$locale/bookings/*` | 3 | Booking flow, detail, confirmation |
| Auctions | `/$tenant/$locale/auctions/*` | 3 | Auction listings, bidding, history |
| B2B | `/$tenant/$locale/b2b/*` | 4 | Company portal, PO management |
| Blog | `/$tenant/$locale/blog/*` | 3 | Blog listing, article, categories |
| Bundles | `/$tenant/$locale/bundles/*` | 2 | Bundle listings, detail |
| Business | `/$tenant/$locale/business/*` | 3 | Business solutions, contact |
| Campaigns | `/$tenant/$locale/campaigns/*` | 3 | Marketing campaigns |
| Consignment | `/$tenant/$locale/consignment/*` | 2 | Consignment tracking |
| Digital | `/$tenant/$locale/digital/*` | 3 | Digital products, downloads |
| Dropshipping | `/$tenant/$locale/dropshipping/*` | 2 | Dropship catalog |
| Events | `/$tenant/$locale/events/*` | 3 | Event listings, tickets |
| Help | `/$tenant/$locale/help/*` | 3 | Help center, FAQ, contact |
| Manage | `/$tenant/$locale/manage/*` | 4 | Self-service management |
| Memberships | `/$tenant/$locale/memberships/*` | 3 | Membership plans, portal |
| Orders | `/$tenant/$locale/order/*` | 3 | Order detail, tracking |
| Places | `/$tenant/$locale/places/*` | 2 | POI listings, detail |
| Print on Demand | `/$tenant/$locale/print-on-demand/*` | 2 | POD catalog |
| Quotes | `/$tenant/$locale/quotes/*` | 3 | Quote request, detail |
| Rentals | `/$tenant/$locale/rentals/*` | 3 | Rental catalog, booking |
| Returns | `/$tenant/$locale/returns/*` | 2 | Return requests |
| Subscriptions | `/$tenant/$locale/subscriptions/*` | 3 | Subscription plans, management |
| Try Before Buy | `/$tenant/$locale/try-before-you-buy/*` | 2 | TBYB program |
| Vendor Portal | `/$tenant/$locale/vendor/*` | 8 | Vendor dashboard, orders, products, payouts |
| Vendors | `/$tenant/$locale/vendors/*` | 3 | Vendor directory, profiles |
| Verify | `/$tenant/$locale/verify/*` | 2 | Identity verification |
| White Label | `/$tenant/$locale/white-label/*` | 2 | White label solutions |
| Other | Various | ~55 | Layout routes, error boundaries, redirects |

### 7.3 Component Library (537 components)

| Category | Count | Directory | Key Components |
|----------|-------|-----------|---------------|
| Account | 15 | `components/account/` | Profile, settings, order history |
| Admin | 8 | `components/admin/` | Shared admin components |
| Auctions | 12 | `components/auctions/` | Bid card, auction timer, bid history |
| Auth | 10 | `components/auth/` | Login, register, forgot password |
| B2B | 14 | `components/b2b/` | Company portal, PO forms, pricing |
| Blocks | 18 | `components/blocks/` | CMS content blocks |
| Blog | 8 | `components/blog/` | Article card, listing, categories |
| Bookings | 16 | `components/bookings/` | Calendar, provider picker, confirmation |
| Business | 6 | `components/business/` | Business solutions UI |
| Campaigns | 8 | `components/campaigns/` | Campaign cards, progress bars |
| Cart | 12 | `components/cart/` | Cart drawer, line items, summary |
| Checkout | 15 | `components/checkout/` | Checkout steps, payment, address |
| CityOS | 10 | `components/cityos/` | CityOS-specific components |
| CMS | 8 | `components/cms/` | CMS page renderer, navigation |
| Commerce | 20 | `components/commerce/` | Generic commerce components |
| Compare | 6 | `components/compare/` | Product comparison |
| Consent | 4 | `components/consent/` | Cookie consent, privacy |
| Consignment | 5 | `components/consignment/` | Tracking, status |
| Content | 10 | `components/content/` | Content display components |
| Delivery | 8 | `components/delivery/` | Delivery options, tracking |
| Digital | 8 | `components/digital/` | Digital product display, download |
| Disputes | 6 | `components/disputes/` | Dispute forms, timeline |
| Dropshipping | 5 | `components/dropshipping/` | Dropship catalog |
| Events | 10 | `components/events/` | Event cards, tickets, calendar |
| Freemium | 4 | `components/freemium/` | Freemium tier display |
| Gift Cards | 6 | `components/gift-cards/` | Gift card purchase, balance |
| Help | 8 | `components/help/` | Help articles, FAQ |
| Homepage | 15 | `components/homepage/` | Hero, sections, featured |
| Identity | 6 | `components/identity/` | KYC, verification UI |
| Interactive | 8 | `components/interactive/` | Interactive elements |
| Invoices | 8 | `components/invoices/` | Invoice display, payment |
| Layout | 18 | `components/layout/` | Header, footer, sidebar, nav |
| Loyalty | 8 | `components/loyalty/` | Points display, rewards |
| Manage | 10 | `components/manage/` | Self-service management |
| Marketing | 6 | `components/marketing/` | Marketing components |
| Marketplace | 12 | `components/marketplace/` | Marketplace browse, filters |
| Memberships | 8 | `components/memberships/` | Tier cards, benefits |
| Navigation | 10 | `components/navigation/` | Nav menu, breadcrumbs |
| Notifications | 6 | `components/notifications/` | Toast, alerts, badge |
| Orders | 12 | `components/orders/` | Order detail, timeline, items |
| Pages | 8 | `components/pages/` | Static page templates |
| Payments | 15 | `components/payments/` | Payment methods, disputes, credits |
| POI | 6 | `components/poi/` | Point of interest cards, maps |
| Print on Demand | 5 | `components/print-on-demand/` | POD configurator |
| Products | 25 | `components/products/` | Product card, gallery, variants |
| Promotions | 8 | `components/promotions/` | Promo banners, countdown |
| Purchase Orders | 8 | `components/purchase-orders/` | PO forms, approval |
| Quotes | 8 | `components/quotes/` | Quote request, detail |
| Recommerce | 5 | `components/recommerce/` | Used/refurbished products |
| Referrals | 5 | `components/referrals/` | Referral program UI |
| Rentals | 8 | `components/rentals/` | Rental calendar, agreement |
| Returns | 6 | `components/returns/` | Return request, tracking |
| Reviews | 10 | `components/reviews/` | Review form, rating stars |
| Search | 8 | `components/search/` | Search bar, filters, results |
| Subscriptions | 12 | `components/subscriptions/` | Plan cards, management |
| TBYB | 4 | `components/tbyb/` | Try before you buy |
| Theme | 6 | `components/theme/` | Theme provider, toggle |
| Tracking | 5 | `components/tracking/` | Shipment tracking |
| UI | 35 | `components/ui/` | Base UI primitives (buttons, inputs, etc.) |
| Vendor | 15 | `components/vendor/` | Vendor dashboard components |
| Vendors | 10 | `components/vendors/` | Vendor directory, profile |
| White Label | 5 | `components/white-label/` | White label configuration |
| Wholesale | 6 | `components/wholesale/` | Wholesale pricing, bulk order |
| Wishlist | 6 | `components/wishlist/` | Wishlist button, list |

### 7.4 Storefront Lib Files (77 files)

| Category | Count | Path | Description |
|----------|-------|------|-------------|
| API | 12 | `lib/api/` | API client, request helpers |
| Constants | 8 | `lib/constants/` | Configuration constants |
| Context | 10 | `lib/context/` | React context providers (tenant, cart, auth) |
| Data | 15 | `lib/data/` | Data fetching and caching |
| Hooks | 12 | `lib/hooks/` | Custom React hooks |
| i18n | 8 | `lib/i18n/` | Internationalization, locale loading |
| Types | 6 | `lib/types/` | TypeScript type definitions |
| Utils | 6 | `lib/utils/` | Utility functions |

---

## 8. External Integration Layer

All integrations are managed through the `IntegrationRegistry` in `apps/backend/src/integrations/orchestrator/integration-registry.ts`. Each adapter implements the `IIntegrationAdapter` interface with methods: `healthCheck()`, `isConfigured()`, `syncEntity()`, `handleWebhook()`.

### 8.1 Payload CMS

| Item | Detail |
|------|--------|
| **Purpose** | Content management, CMS hierarchy sync |
| **Location** | `apps/backend/src/integrations/payload-sync/`, `apps/backend/src/integrations/cms-hierarchy-sync/` |
| **Environment** | `PAYLOAD_CMS_URL_DEV`, `PAYLOAD_API_KEY` |
| **Health Check** | `GET {PAYLOAD_CMS_URL_DEV}/api/health` |
| **Webhook** | `/webhooks/payload-cms` (13 collections) |
| **Polling** | `payload-cms-poll` job every 15 minutes |
| **Manual Sync** | `POST /admin/integrations/sync/cms` |
| **Status** | Code complete, needs API keys |

**CMS Hierarchy Sync Engine** — 8 collections synced in dependency order:
1. Countries → 2. Governance Authorities → 3. Scopes → 4. Categories → 5. Subcategories → 6. Tenants → 7. Stores → 8. Portals

### 8.2 ERPNext

| Item | Detail |
|------|--------|
| **Purpose** | ERP integration for invoicing, inventory, procurement |
| **Location** | `apps/backend/src/integrations/erpnext/` |
| **Environment** | `ERPNEXT_API_KEY`, `ERPNEXT_API_SECRET`, `ERPNEXT_URL_DEV` |
| **Auth** | Token-based: `token {API_KEY}:{API_SECRET}` |
| **Health Check** | `GET {ERPNEXT_URL_DEV}/api/method/frappe.auth.get_logged_user` |
| **Webhook** | `/webhooks/erpnext` |
| **Syncs** | Sales invoices, payment entries, GL, inventory, procurement, customer/product sync |
| **Multi-tenant** | Yes — tenant-scoped sync via `custom_medusa_id` |
| **Status** | Code complete, needs API keys |

### 8.3 Fleetbase

| Item | Detail |
|------|--------|
| **Purpose** | Logistics, fleet management, geocoding |
| **Location** | `apps/backend/src/integrations/fleetbase/` |
| **Environment** | `FLEETBASE_API_KEY`, `FLEETBASE_URL_DEV` |
| **Auth** | Bearer token |
| **Health Check** | `GET {FLEETBASE_URL_DEV}/health` |
| **Webhook** | `/webhooks/fleetbase` |
| **Capabilities** | Geocoding, address validation, delivery zones, fleet management, routing, tracking |
| **Status** | Code complete, needs API keys |

### 8.4 Walt.id

| Item | Detail |
|------|--------|
| **Purpose** | Decentralized identity, KYC, verifiable credentials |
| **Location** | `apps/backend/src/integrations/waltid/` |
| **Environment** | `WALTID_URL_DEV`, `WALTID_API_KEY` |
| **Auth** | Bearer token |
| **Health Check** | `GET {WALTID_URL_DEV}/health` |
| **Credential Types** | 6 (KYC, Membership, Operator, Vendor, etc.) |
| **Features** | DID management, W3C Verifiable Credentials |
| **Workflows** | `kyc-verification` |
| **Status** | Code complete, needs API keys |

### 8.5 Stripe

| Item | Detail |
|------|--------|
| **Purpose** | Payment processing, vendor payouts (Stripe Connect), subscription billing |
| **Location** | `apps/backend/src/integrations/stripe-gateway/` |
| **Environment** | `STRIPE_SECRET_KEY` |
| **Auth** | Bearer token |
| **Health Check** | `GET https://api.stripe.com/v1/balance` |
| **Webhook** | `/webhooks/stripe` |
| **Features** | Stripe Connect for vendors, subscription billing, payout processing |
| **Model Fields** | `SubscriptionPlan.stripe_price_id`, `SubscriptionPlan.stripe_product_id`, `TenantBilling.stripe_customer_id`, `TenantBilling.stripe_subscription_id`, `Vendor.stripe_account_id` |
| **Status** | Code complete, needs API keys |

### 8.6 Integration Health Monitoring

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/admin/integrations/health` | GET | Health status of all integrations |
| `/admin/integrations/logs` | GET | Integration sync logs |
| `/admin/integrations/sync` | POST | Trigger full sync |
| `/admin/integrations/sync/cms` | POST | Trigger CMS sync |
| `/admin/integrations/sync/node-hierarchy` | POST | Trigger node hierarchy sync |

---

## 9. Design System

### 9.1 Package Overview

| Package | Path | Files | Description |
|---------|------|-------|-------------|
| `cityos-design-tokens` | `packages/cityos-design-tokens/` | 66 | Design tokens for colors, typography, spacing, borders, breakpoints, elevation, motion, shadows |
| `cityos-design-system` | `packages/cityos-design-system/` | — | UI component library organized by domain |
| `cityos-design-runtime` | `packages/cityos-design-runtime/` | — | Runtime theme provider and CSS injection |
| `cityos-contracts` | `packages/cityos-contracts/` | — | Shared TypeScript contracts |

### 9.2 Design Token Files (66 files)

| Category | Path | Files | Description |
|----------|------|-------|-------------|
| Borders | `src/borders/` | 8 | Border radius, width, style tokens |
| Breakpoints | `src/breakpoints/` | 6 | Responsive breakpoint definitions |
| Colors | `src/colors/` | 16 | Color palettes (primary, semantic, neutral) |
| Elevation | `src/elevation/` | 6 | Z-index and elevation layers |
| Motion | `src/motion/` | 8 | Animation duration, easing curves |
| Shadows | `src/shadows/` | 8 | Box shadow definitions |
| Spacing | `src/spacing/` | 6 | Spacing scale (4px base) |
| Typography | `src/typography/` | 8 | Font families, sizes, weights, line heights |

### 9.3 Design System Components

| Domain | Path | Description |
|--------|------|-------------|
| Auction | `src/auction/` | Auction-specific UI components |
| Blocks | `src/blocks/` | CMS content block components |
| Campaign | `src/campaign/` | Campaign display components |
| Commerce | `src/commerce/` | Core commerce components |
| Components | `src/components/` | Generic UI components |
| Content | `src/content/` | Content display components |
| Data | `src/data/` | Data visualization components |
| Delivery | `src/delivery/` | Delivery tracking components |
| Digital | `src/digital/` | Digital product components |
| Events | `src/events/` | Event display components |
| Feedback | `src/feedback/` | Feedback/toast/alert components |
| Forms | `src/forms/` | Form controls and inputs |
| Identity | `src/identity/` | Identity/KYC components |
| Layout | `src/layout/` | Layout primitives |
| Membership | `src/membership/` | Membership tier components |
| Navigation | `src/navigation/` | Navigation components |
| Payment | `src/payment/` | Payment method components |
| Rental | `src/rental/` | Rental UI components |
| Social | `src/social/` | Social commerce components |
| Utilities | `src/utilities/` | Utility display components |

### 9.4 Design Runtime

| File | Path | Description |
|------|------|-------------|
| Context | `src/context/` | ThemeProvider, TenantContext |
| CSS | `src/css/` | CSS injection and custom properties |
| Theme | `src/theme/` | Theme resolution and token mapping |

---

## 10. Implementation Gap Tracker

### 10.1 Completed Items

| Category | Count | Status |
|----------|-------|--------|
| Custom modules with models, migrations, services | 58/58 | ✅ Done |
| Database tables for all models | 205+/205+ | ✅ Done |
| Admin API routes | 187 | ✅ Done |
| Store API routes | 113 | ✅ Done |
| Vendor API routes | 11 | ✅ Done |
| Webhook routes | 4 | ✅ Done |
| Admin UI pages | 56 | ✅ Done |
| Admin hooks | 52 | ✅ Done |
| Admin widgets | 7 | ✅ Done |
| Cross-module links | 27 | ✅ Done |
| Workflow definitions | 30 | ✅ Done |
| Event subscribers | 33 | ✅ Done |
| Scheduled jobs | 16 | ✅ Done |
| Storefront routes | 142 | ✅ Done |
| Storefront components | 537 | ✅ Done |
| Design token system | 66 files | ✅ Done |

### 10.2 Remaining (External Configuration Only)

| Item | Type | Required Env Vars | Impact |
|------|------|------------------|--------|
| Stripe activation | API Key | `STRIPE_SECRET_KEY` | Payment processing, vendor payouts, subscription billing |
| Payload CMS connection | API Key | `PAYLOAD_CMS_URL_DEV`, `PAYLOAD_API_KEY` | CMS content sync, hierarchy sync |
| ERPNext connection | API Key | `ERPNEXT_API_KEY`, `ERPNEXT_API_SECRET`, `ERPNEXT_URL_DEV` | ERP sync, invoicing, inventory |
| Fleetbase connection | API Key | `FLEETBASE_API_KEY`, `FLEETBASE_URL_DEV` | Logistics, geocoding, fleet management |
| Walt.id connection | API Key | `WALTID_URL_DEV`, `WALTID_API_KEY` | KYC verification, verifiable credentials |
| Temporal Cloud | API Key | `TEMPORAL_ENDPOINT`, `TEMPORAL_API_KEY`, `TEMPORAL_NAMESPACE` | Workflow execution engine |

### 10.3 Admin UI Coverage

| Module | Admin Page | Admin Hook | Admin Widget | Status |
|--------|-----------|------------|-------------|--------|
| advertising | ✅ | ✅ | — | Complete |
| affiliate | ✅ | ✅ | — | Complete |
| analytics | ✅ | ✅ | — | Complete |
| auction | ✅ | ✅ | — | Complete |
| audit | ✅ | ✅ | — | Complete |
| automotive | ✅ | ✅ | — | Complete |
| booking | ✅ | ✅ | — | Complete |
| cart-extension | — | — | — | No admin needed |
| channel | ✅ | ✅ | — | Complete |
| charity | ✅ | ✅ | — | Complete |
| classified | ✅ | ✅ | — | Complete |
| cms-content | ✅ | ✅ | — | Complete |
| commission | ✅ | — | ✅ `commission-config` | Complete |
| company | ✅ | ✅ | ✅ `customer-business-info`, `order-business-info` | Complete |
| crowdfunding | ✅ | ✅ | — | Complete |
| digital-product | ✅ | ✅ | — | Complete |
| dispute | ✅ | ✅ | — | Complete |
| education | ✅ | ✅ | — | Complete |
| events | ✅ | ✅ | — | Complete |
| event-ticketing | ✅ | ✅ | — | Complete |
| financial-product | — | — | — | API-only |
| fitness | ✅ | ✅ | — | Complete |
| freelance | ✅ | ✅ | — | Complete |
| governance | ✅ | ✅ | — | Complete |
| government | ✅ | ✅ | — | Complete |
| grocery | ✅ | ✅ | — | Complete |
| healthcare | ✅ | ✅ | — | Complete |
| i18n | ✅ | ✅ | — | Complete |
| inventory-extension | ✅ | ✅ | — | Complete |
| invoice | ✅ | ✅ | — | Complete |
| legal | ✅ | ✅ | — | Complete |
| loyalty | ✅ | ✅ | — | Complete |
| membership | ✅ | ✅ | — | Complete |
| node | ✅ | ✅ | — | Complete |
| notification-preferences | — | — | — | Settings-based |
| parking | ✅ | ✅ | — | Complete |
| payout | ✅ | — | ✅ `payout-processing` | Complete |
| persona | ✅ | ✅ | — | Complete |
| pet-service | ✅ | ✅ | — | Complete |
| promotion-ext | ✅ | ✅ | — | Complete |
| quote | ✅ | ✅ | ✅ `quote-management` | Complete |
| real-estate | ✅ | ✅ | — | Complete |
| region-zone | ✅ | ✅ | — | Complete |
| rental | ✅ | ✅ | — | Complete |
| restaurant | ✅ | ✅ | — | Complete |
| review | ✅ | ✅ | — | Complete |
| shipping-extension | ✅ | ✅ | — | Complete |
| social-commerce | ✅ | ✅ | — | Complete |
| store | — | — | — | Via tenant settings |
| subscription | ✅ | ✅ | — | Complete |
| tax-config | — | — | — | Settings-based |
| tenant | ✅ | ✅ | — | Complete |
| travel | ✅ | ✅ | — | Complete |
| utilities | — | — | — | API-only |
| vendor | ✅ | ✅ | ✅ `vendor-management` | Complete |
| volume-pricing | ✅ | ✅ | — | Complete |
| warranty | ✅ | ✅ | — | Complete |
| wishlist | ✅ | ✅ | — | Complete |

### 10.4 Admin Widget Registry

| # | Widget | File | Location | Description |
|---|--------|------|----------|-------------|
| 1 | Commission Config | `commission-config.tsx` | Product detail | Configure product commission rules |
| 2 | Customer Business Info | `customer-business-info.tsx` | Customer detail | Show company affiliation and B2B status |
| 3 | Order Business Info | `order-business-info.tsx` | Order detail | Show PO reference and company info |
| 4 | Payout Processing | `payout-processing.tsx` | Dashboard | Process pending vendor payouts |
| 5 | Product Business Config | `product-business-config.tsx` | Product detail | B2B product configuration |
| 6 | Quote Management | `quote-management.tsx` | Dashboard | Quick quote actions |
| 7 | Vendor Management | `vendor-management.tsx` | Dashboard | Vendor approval queue |

### 10.5 Temporal Workflow Queue Registry

| Queue | Domain | Primary System |
|-------|--------|----------------|
| `cityos-workflow-queue` | Core | CityOS |
| `cityos-dynamic-queue` | Dynamic | AI Services |
| `cityos-main` | Core | CityOS |
| `commerce-queue` | Commerce | Medusa |
| `commerce-booking-queue` | Commerce | Medusa |
| `payload-queue` | CMS | Payload CMS |
| `payload-moderation-queue` | Moderation | Payload CMS |
| `xsystem-platform-queue` | Cross-system | ERPNext |
| `xsystem-content-queue` | Cross-system | Payload CMS |
| `xsystem-logistics-queue` | Logistics | Fleetbase |
| `xsystem-vertical-queue` | Cross-system | ERPNext |
| `core-queue` | Core | CityOS |
| `core-maintenance-queue` | Maintenance | CityOS |
| `notifications-queue` | Notifications | CityOS |
| `moderation-queue` | Moderation | CityOS |

### 10.6 Environment Variables Required

| Variable | Integration | Required | Description |
|----------|-------------|----------|-------------|
| `STRIPE_SECRET_KEY` | Stripe | Yes | Stripe API secret key |
| `PAYLOAD_CMS_URL_DEV` | Payload CMS | Yes | Payload CMS base URL |
| `PAYLOAD_API_KEY` | Payload CMS | Yes | Payload CMS API key |
| `ERPNEXT_API_KEY` | ERPNext | Yes | ERPNext API key |
| `ERPNEXT_API_SECRET` | ERPNext | Yes | ERPNext API secret |
| `ERPNEXT_URL_DEV` | ERPNext | Yes | ERPNext base URL |
| `FLEETBASE_API_KEY` | Fleetbase | Yes | Fleetbase API key |
| `FLEETBASE_URL_DEV` | Fleetbase | Yes | Fleetbase base URL |
| `WALTID_URL_DEV` | Walt.id | Yes | Walt.id base URL |
| `WALTID_API_KEY` | Walt.id | Yes | Walt.id API key |
| `TEMPORAL_ENDPOINT` | Temporal | Yes | Temporal Cloud gRPC endpoint |
| `TEMPORAL_API_KEY` | Temporal | Yes | Temporal Cloud API key |
| `TEMPORAL_NAMESPACE` | Temporal | Yes | Temporal Cloud namespace |
| `TEMPORAL_TLS_CERT_PATH` | Temporal | No | mTLS client certificate |
| `TEMPORAL_TLS_KEY_PATH` | Temporal | No | mTLS private key |

---

*Document generated for Dakkah CityOS Commerce Platform v3.0.0 — 2026-02-13*
