# Dakkah CityOS Commerce Platform — Module Gap Analysis

> Generated: 2026-02-13 | 58 Modules Audited Across 4 Layers

## Legend

| Level | Meaning |
|-------|---------|
| **Full** | Production-ready with custom business logic, API routes, UI pages, and data wiring |
| **High** | Functional with routes and pages, but may lack deep business logic or advanced UI |
| **Medium** | Basic CRUD scaffolding present, thin service logic, generic UI template |
| **Low** | Minimal stub — model + migration exist, but service/routes/UI are skeletal |
| **None** | Layer not implemented for this module |

## Implementation Level Key

- **Backend**: Service file with custom business logic methods (beyond inherited CRUD), migrations, models
- **Admin Panel**: Manage page at `/$tenant/$locale/manage/` with CRUD hook wiring and admin API routes
- **Vendor Dashboard**: Vendor-specific API routes and vendor portal UI (only applicable to marketplace modules)
- **User Frontend**: Dedicated storefront routes, components, blocks, and customer-facing hooks

---

## Summary Dashboard

| Status | Backend | Admin Panel | Vendor Dashboard | User Frontend |
|--------|---------|-------------|-----------------|---------------|
| Full   | 15      | 8           | 1               | 12            |
| High   | 16      | 35          | 1               | 8             |
| Medium | 18      | 0           | 0               | 6             |
| Low    | 9       | 0           | 0               | 9             |
| None   | 0       | 15          | 56              | 23            |

---

## Per-Module Breakdown

### Tier 1: Core Commerce (Full/High across all layers)

| # | Module | Service Lines | Backend | Admin Panel | Vendor Dashboard | User Frontend | Key Gaps |
|---|--------|--------------|---------|-------------|-----------------|---------------|----------|
| 1 | **subscription** | 694 | **Full** — 18 methods: plans, billing cycles, renewals, pause/resume, plan changes, discounts | **High** — manage page + 9 admin routes + CRUD hooks | None | **Full** — 3 routes, 16 components, checkout flow, account pages | Vendor dashboard N/A |
| 2 | **booking** | 627 | **Full** — 20 methods: availability, slots, scheduling, reminders, provider stats | **High** — manage page + 4 admin routes + CRUD hooks | None | **Full** — 3 routes, 14 components, calendar blocks | No vendor-side booking management |
| 3 | **vendor** | 474 | **Full** — 15 methods: approval, orders, analytics, performance, dashboard | **High** — manage page + 8 admin routes | **High** — 11 vendor API routes (dashboard, orders, products, payouts, analytics) | **High** — vendor portal routes, registration | Vendor analytics dashboard components thin |
| 4 | **tenant** | 506 | **Full** — 15+ methods: resolution, governance, billing, usage, setup | **High** — manage page + 6 admin routes + settings panel | None | **Medium** — used via context/providers, no dedicated tenant UI | No tenant self-service portal |
| 5 | **company** | 480 | **Full** — 15 methods: credit, approvals, POs, spending limits, tax exemptions | **High** — manage page + 9 admin routes | None | **High** — B2B dashboard, approvals, catalog, team, PO pages | No company self-registration flow |
| 6 | **payout** | 335 | **Full** — payment processing, commission calc, reconciliation, scheduling | **High** — manage page + 5 admin routes + CRUD hooks | **Medium** — vendor payout request routes | **Low** — account wallet page only | No payout tracking UI for vendors |
| 7 | **cart-extension** | 315 | **Full** — cart totals, bulk discount, validation, extensions | None — internal module | None | **Full** — cart components, checkout flow | Backend-only module, no admin UI needed |
| 8 | **channel** | 270 | **Full** — active channels, by code/type, validation, capabilities, sync | **High** — admin channel-mapping component + 2 routes | None | **Medium** — used via context, no dedicated UI | No channel management admin page |

### Tier 2: Commerce Services (High Backend, varies on Frontend)

| # | Module | Service Lines | Backend | Admin Panel | Vendor Dashboard | User Frontend | Key Gaps |
|---|--------|--------------|---------|-------------|-----------------|---------------|----------|
| 9 | **loyalty** | 240 | **Full** — programs, points, redemption, tiers, earning rules, expiry | **High** — manage page + 3 admin routes | None | **High** — account loyalty page, 12 components, blocks | No loyalty program creation UI for admins |
| 10 | **dispute** | 226 | **Full** — open/escalate/resolve, messages, status transitions, stats | **High** — manage page + 4 admin routes | None | **High** — account disputes page, dispute components | No vendor-side dispute view |
| 11 | **volume-pricing** | 225 | **Full** — tier calculation, quantity pricing, applicable tiers | **High** — manage page + 2 admin routes (pricing-tiers) | None | **Medium** — bulk pricing block, used in product display | No visual tier editor |
| 12 | **tax-config** | 206 | **Full** — rate resolution, region config, tax calculation, exemption validation | **Medium** — no dedicated manage page (settings integration) | None | **None** — internal module | No tax configuration admin UI |
| 13 | **utilities** | 264 | **High** — service utility methods, multi-purpose | **High** — manage page + 2 admin routes + 2 store routes | None | **Low** — only through CMS catch-all | Thin user-facing UI |
| 14 | **invoice** | 167 | **High** — invoice numbering, creation, payment marking, overdue calc | **High** — manage page + 8 admin routes | None | **Medium** — account invoices, invoices component dir | No invoice PDF generation UI |
| 15 | **promotion-ext** | 155 | **High** — active promos, rule validation, discount calc, usage stats, expiry | **High** — manage page + 2 admin routes | None | **High** — 5 promotion components, flash-sale blocks | No promotion builder wizard |
| 16 | **commission** | 129 | **High** — commission calculation, tier management | **High** — manage page + 6 admin routes (commissions + commission-rules) | **Medium** — vendor commission view | **Low** — commission dashboard block only | No commission dispute flow |
| 17 | **node** | 152 | **High** — hierarchy traversal, ancestors, descendants, breadcrumbs, validation | **High** — manage page + 3 admin routes | None | **None** — internal infrastructure | No visual hierarchy editor |
| 18 | **review** | 137 | **High** — CRUD, product/vendor reviews, rating summaries, moderation | **High** — manage page + 6 admin routes | None | **Full** — 4 store routes, 13 review components | No review moderation dashboard |
| 19 | **region-zone** | 162 | **High** — zone lookups, country resolution, residency zones | **High** — region-zone mapping component + 2 admin routes | None | **None** — internal module | Backend-only, no admin page |
| 20 | **quote** | 147 | **High** — quote lifecycle, approval, conversion | **High** — manage page + 6 admin routes | None | **High** — 3 quote routes, request flow | No vendor quote response UI |

### Tier 3: Vertical Modules with Admin + Generic Frontend

| # | Module | Service Lines | Backend | Admin Panel | Vendor Dashboard | User Frontend | Key Gaps |
|---|--------|--------------|---------|-------------|-----------------|---------------|----------|
| 21 | **inventory-extension** | 177 | **High** — reservations, stock alerts, transfers, movements | **High** — manage page + 3 admin routes (inventory-ext) | None | **None** — internal module | No stock dashboard for admins |
| 22 | **i18n** | 104 | **High** — translations CRUD, locale support, bulk upsert | **High** — 2 admin routes | None | **None** — used via hooks/context | No translation management UI |
| 23 | **cms-content** | 181 | **High** — page management, content types | **High** — 3 admin routes (cms/) | None | **High** — CMS blocks, catch-all route rendering | No visual page builder |
| 24 | **persona** | 134 | **High** — persona resolution, assignment, scope priority | **High** — 2 admin routes | None | **None** — used via context providers | No persona assignment UI |
| 25 | **governance** | 78 | **Medium** — policy resolution (inherited logic mostly) | **High** — 2 admin routes + governance context | None | **None** — used via providers | No policy editor UI |
| 26 | **notification-preferences** | 115 | **Medium** — preference management | None — no dedicated admin page | None | **Medium** — account settings integration | No notification center |
| 27 | **analytics** | 151 | **High** — event counts, sales metrics, dashboards | **High** — manage analytics page (78L) | None | **None** — admin-only | No customer-facing analytics |
| 28 | **audit** | 99 | **Medium** — audit trail logging | **High** — audit-log-viewer component + 2 admin routes | None | **None** — admin-only | No audit export |
| 29 | **store** | 84 | **Medium** — basic store CRUD | **High** — manage stores page + 4 store routes | None | **Medium** — store selection flow, 4 store routes | No store creation wizard |

### Tier 4: Industry Verticals (Backend + Admin, Missing User Frontend)

| # | Module | Service Lines | Backend | Admin Panel | Vendor Dashboard | User Frontend | Key Gaps |
|---|--------|--------------|---------|-------------|-----------------|---------------|----------|
| 30 | **advertising** | 128 | **High** — campaigns, CTR calc, pause/resume | **High** — manage page + 2 admin routes + 2 store routes | None | **None** — no ad display components | **No ad display/click-tracking frontend** |
| 31 | **affiliate** | 91 | **Medium** — referral codes, tracking, commission | **High** — manage page + 2 admin routes + 2 store routes | None | **Low** — account referrals page only | **No affiliate dashboard, link tracking UI** |
| 32 | **auction** | 114 | **High** — bid placement, auction closing, lifecycle | **High** — manage page + 2 admin routes + 2 store routes | None | **Full** — 2 routes, 6 components, bidding block | Missing auction countdown/live bidding |
| 33 | **automotive** | 119 | **High** — trade-in, financing calc, listing | **High** — manage page + 2 admin routes + 2 store routes | None | **None** — **no vehicle listing or search UI** | **Major gap: no automotive storefront** |
| 34 | **charity** | 98 | **Medium** — donation processing, campaign progress | **High** — manage page + 2 admin routes + 2 store routes | None | **None** — **no donation or campaign UI** | **Major gap: no charity storefront** |
| 35 | **classified** | 98 | **Medium** — publish, expire, flag, renew | **High** — manage page + 2 admin routes + 2 store routes | None | **Low** — 1 component only, no dedicated routes | **No classifieds browse/post UI** |
| 36 | **crowdfunding** | 109 | **Medium** — campaign management | **High** — manage page + 2 admin routes + 2 store routes | None | **Low** — 1 component, crowdfunding block | **No crowdfunding campaign page** |
| 37 | **digital-product** | 91 | **Medium** — basic CRUD | **High** — manage page + 2 admin routes + 2 store routes | None | **High** — 2 routes, 2 components, downloads | Missing license management |
| 38 | **education** | 129 | **High** — course management, enrollment | **High** — manage page + 2 admin routes + 1 store route | None | **None** — **no course catalog or enrollment UI** | **Major gap: no education storefront** |
| 39 | **event-ticketing** | 101 | **Medium** — ticket management | **High** — manage page + 2 admin routes + 1 store route | None | **High** — 2 routes, 8 components, event blocks | Missing seat selection UI |
| 40 | **financial-product** | 84 | **Low** — basic CRUD only | **High** — manage page + 2 admin routes + 2 store routes | None | **None** — **no financial product listing** | **Major gap: no financial storefront** |
| 41 | **fitness** | 84 | **Low** — basic CRUD only | **High** — manage page + 2 admin routes + 2 store routes | None | **Low** — 1 component, fitness class block | **No class booking or schedule UI** |
| 42 | **freelance** | 139 | **High** — gig management, proposals, milestones | **High** — manage page + 2 admin routes + 2 store routes | None | **Low** — 1 component, freelancer block | **No freelance marketplace UI** |
| 43 | **government** | 80 | **Low** — basic CRUD only | **High** — manage page + 2 admin routes + 2 store routes | None | **None** — **no service request or gov portal** | **Major gap: no gov services UI** |
| 44 | **grocery** | 79 | **Low** — basic CRUD only | **High** — manage page + 2 admin routes + 2 store routes | None | **None** — **no grocery browse/delivery UI** | **Major gap: no grocery storefront** |
| 45 | **healthcare** | 89 | **Low** — basic CRUD only | **High** — manage page + 2 admin routes + 1 store route | None | **Low** — 1 component, provider block | **No appointment booking or health UI** |
| 46 | **legal** | 83 | **Low** — basic CRUD only | **High** — manage page + 2 admin routes + 2 store routes | None | **None** — **no legal service listing** | **Major gap: no legal storefront** |
| 47 | **membership** | 99 | **Medium** — membership lifecycle | **High** — manage page + 2 admin routes + 1 store route | None | **High** — 2 routes, 4 components | Missing tier comparison UI |
| 48 | **parking** | 80 | **Low** — basic CRUD only | **High** — manage page + 2 admin routes + 2 store routes | None | **Low** — 1 component only | **No parking search/booking UI** |
| 49 | **pet-service** | 81 | **Low** — basic CRUD only | **High** — manage page + 2 admin routes + 2 store routes | None | **Low** — 1 component only | **No pet service booking UI** |
| 50 | **real-estate** | 128 | **High** — property management, listing | **High** — manage page + 2 admin routes + 1 store route | None | **None** — **no property search/listing UI** | **Major gap: no real estate storefront** |
| 51 | **rental** | 113 | **Medium** — rental lifecycle | **High** — manage page + 2 admin routes + 2 store routes | None | **High** — 2 routes, 4 components | Missing availability calendar |
| 52 | **restaurant** | 82 | **Low** — basic CRUD only | **High** — manage page + 2 admin routes + 1 store route | None | **None** — **no menu/ordering UI** | **Major gap: no restaurant storefront** |
| 53 | **social-commerce** | 77 | **Low** — basic CRUD only | **High** — manage page + 2 admin routes + 2 store routes | None | **Low** — 4 components (social share/feed) | No social shopping experience |
| 54 | **travel** | 79 | **Low** — basic CRUD only | **High** — manage page + 2 admin routes + 2 store routes | None | **None** — **no travel search/booking UI** | **Major gap: no travel storefront** |
| 55 | **warranty** | 101 | **Medium** — warranty claims | **High** — manage page + 2 admin routes + 2 store routes | None | **None** — **no warranty claim UI** | **No warranty registration/claim flow** |
| 56 | **shipping-extension** | 83 | **Low** — basic CRUD only | **High** — 2 admin routes (shipping-ext) | None | **None** — internal module | No shipping configuration UI |
| 57 | **wishlist** | 136 | **High** — wishlist management, sharing | **High** — manage page + 2 admin routes + store routes | None | **Full** — account wishlist, 8 components | Complete |
| 58 | **events** | 96 | **Medium** — basic event management | **High** — 1 admin route | None | **High** — 2 routes, 8 components | Overlaps with event-ticketing |

---

## Critical Gap Summary

### Backend Service Logic Gaps (14 modules under 90 lines — CRUD-only)
These services inherit CRUD from MedusaService but lack custom business logic:

| Module | Lines | Missing Business Logic |
|--------|-------|----------------------|
| financial-product | 84 | Product comparison, risk scoring, application processing |
| fitness | 84 | Class scheduling, membership tiers, trainer assignment |
| government | 80 | Service requests, permit processing, document verification |
| grocery | 79 | Inventory tracking, delivery slots, recipe integration |
| healthcare | 89 | Appointment booking, prescription management, provider matching |
| legal | 83 | Case management, document generation, consultation scheduling |
| parking | 80 | Spot availability, reservation system, pricing zones |
| pet-service | 81 | Appointment booking, pet profiles, vaccination tracking |
| restaurant | 82 | Menu management, table reservations, order tracking |
| shipping-extension | 83 | Rate calculation, carrier selection, label generation |
| social-commerce | 77 | Social feed, group buying, influencer tracking |
| store | 84 | Store locator, hours management, inventory by location |
| travel | 79 | Itinerary building, booking aggregation, price comparison |
| governance | 78 | Policy builder, compliance checking (logic inherited from parent) |

### User Frontend Gaps (23 modules with None/Low frontend)
These verticals have NO or minimal customer-facing UI:

| Priority | Module | What's Needed |
|----------|--------|--------------|
| **Critical** | automotive | Vehicle listings, search/filter, trade-in calculator, financing |
| **Critical** | grocery | Product browse, delivery slots, cart with qty management |
| **Critical** | restaurant | Menu display, table booking, order tracking |
| **Critical** | real-estate | Property listings, map view, inquiry forms |
| **Critical** | education | Course catalog, enrollment, progress tracking |
| **Critical** | travel | Search, itinerary builder, booking flow |
| **High** | healthcare | Provider search, appointment booking, teleconsult |
| **High** | charity | Campaign pages, donation forms, progress tracking |
| **High** | government | Service catalog, application forms, status tracking |
| **High** | legal | Service listings, consultation booking, case tracking |
| **High** | freelance | Freelancer profiles, gig marketplace, project management |
| **High** | classified | Listing browse, post creation, messaging |
| **High** | financial-product | Product comparison, application, calculator |
| **Medium** | parking | Spot finder, reservation, payment |
| **Medium** | pet-service | Service booking, pet profiles |
| **Medium** | fitness | Class schedule, membership, trainer booking |
| **Medium** | crowdfunding | Campaign pages, pledge/back flow, updates |
| **Medium** | social-commerce | Social feed, group buying, share flow |
| **Medium** | warranty | Registration form, claim submission, tracking |
| **Low** | advertising | Ad display (may be internal infrastructure) |
| **Low** | affiliate | Affiliate dashboard (may be admin-only) |
| **Low** | shipping-extension | Internal infrastructure |
| **Low** | tax-config | Internal infrastructure |

### Admin Panel Gaps (15 modules without dedicated pages)
These modules use API routes but lack dedicated admin management pages:

| Module | Current State | What's Needed |
|--------|--------------|--------------|
| cart-extension | Internal module | N/A — no admin page needed |
| channel | Admin component exists, no full page | Channel management page |
| region-zone | Admin component exists, no full page | Zone management page |
| tax-config | No admin UI | Tax rate configuration page |
| i18n | No admin UI | Translation management interface |
| persona | No admin UI | Persona assignment manager |
| notification-preferences | No admin UI | Notification template editor |
| shipping-extension | Routes only | Carrier/rate management page |
| governance | Routes only | Policy editor/viewer page |
| node | Routes only | Visual hierarchy editor |
| cms-content | Routes exist | Visual CMS page builder |
| inventory-extension | Routes exist | Stock dashboard with alerts |
| promotion-ext | Routes exist | Promotion builder wizard |
| store | Routes exist | Store configuration wizard |
| events | Minimal routes | Event management dashboard |

### Vendor Dashboard Gaps
Only **vendor** and **payout** modules have vendor-specific API routes. No other modules support vendor self-service:

| Module | What's Needed |
|--------|--------------|
| booking | Vendor booking management, schedule config |
| subscription | Vendor subscription plan management |
| commission | Vendor commission tracking dashboard |
| dispute | Vendor dispute response interface |
| review | Vendor review response management |
| inventory-extension | Vendor stock management |

---

## Implementation Effort Estimates

### Quick Wins (1-2 days each)
1. Add business logic to 14 thin services (80-90 lines → 150-250 lines each)
2. Create 15 missing admin management pages using existing manage page template
3. Add vendor-side routes for booking, dispute, review modules

### Medium Effort (3-5 days each)
1. Build user frontend for membership, rental, crowdfunding, warranty (have partial components)
2. Add vendor dashboard with commission tracking, dispute response
3. Create notification center and translation management UI

### Major Effort (1-2 weeks each)
1. Full automotive storefront (vehicle search, listings, trade-in, financing)
2. Full grocery storefront (catalog, delivery slots, real-time inventory)
3. Full restaurant storefront (menu, reservations, ordering)
4. Full real-estate storefront (property search, map view, inquiries)
5. Full education storefront (courses, enrollment, LMS integration)
6. Full travel storefront (search, itinerary, multi-provider booking)
7. Full healthcare storefront (providers, appointments, telehealth)
