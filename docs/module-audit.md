# Module Audit: Medusa Built-in vs Custom (2026-02-16)

## Medusa v2 Built-in Modules (17 Commerce + Infrastructure)
Product, Cart, Order, Customer, Inventory, Fulfillment, Payment, Pricing, Promotion, Region, Sales Channel, Tax, Currency, Store, Stock Location, Auth, User, API Key, Notification, File, Cache, Event Bus, Workflow Engine, Locking, Analytics, Translation (experimental v2.13), Draft Order

## Classification Matrix

### Category A — DUPLICATE (migrate to Medusa built-in)

| Custom Module | Medusa Equivalent | Overlap | Migration Priority | Effort |
|---|---|---|---|---|
| `analytics` (3 models, 9 methods, 5 API routes) | Medusa Analytics (analytics.js, analytics-local, analytics-posthog) | Event tracking, reporting, dashboards. Medusa has built-in analytics with PostHog provider. No Medusa analytics provider is currently configured in medusa-config.ts. | P1 - HIGH | Medium: remap event tracking to Medusa analytics API; Report/Dashboard models may stay as extension for custom BI |
| `i18n` (2 models, 5 methods, 2 API routes) | Medusa Translation (v2.13, experimental) | Translation model with key/locale/value. Medusa Translation is experimental. No Medusa translation provider is configured yet. | P2 - EVALUATE FEASIBILITY | Low effort IF Medusa Translation covers custom entity translations; experimental status requires feasibility check first |
| `notification-preferences` (1 model, 10 methods, 2 API routes) | Medusa Notification module | Customer notification channel preferences. Medusa Notification is configured (SendGrid provider). Preferences are not natively part of Medusa Notification. | P3 - MEDIUM | Low: preferences can be stored as customer metadata or kept as lightweight extension |

### Category B-HYBRID — OVERLAP with Medusa core, requires gap analysis

These modules add features that partially overlap with Medusa built-in capabilities. A detailed capability gap analysis is needed before deciding to migrate or keep.

| Custom Module | Medusa Overlap | Custom Additions Beyond Core | Recommendation |
|---|---|---|---|
| `cart-extension` (1 model: CartMetadata, 14 methods, 2 API routes) | Medusa Cart (metadata field support) | Gift wrapping, scheduling, delivery notes via CartMetadata model linked to cart | GAP ANALYSIS NEEDED: check if Medusa Cart's native metadata JSON field can replace CartMetadata model |
| `promotion-ext` (4 models: GiftCardExt, Referral, ProductBundle, CustomerSegment, 8 methods, 1 API route) | Medusa Promotion + Gift Cards | GiftCardExt may duplicate Medusa's native gift cards; Referral/Bundle/Segment are likely unique | GAP ANALYSIS NEEDED: GiftCardExt overlap with Medusa gift cards; Referral/Bundle/Segment likely stay |
| `shipping-extension` (2 models: ShippingRate, CarrierConfig, 9 methods, 2 API routes) | Medusa Fulfillment (fulfillment providers) | Custom rate rules per zone/weight, carrier API key configuration | GAP ANALYSIS NEEDED: check if Medusa Fulfillment provider options cover carrier config needs |
| `tax-config` (2 models: TaxRule, TaxExemption, 11 methods, 1 API route) | Medusa Tax (tax regions, rates) | Tenant-scoped TaxRules, customer TaxExemption workflows | GAP ANALYSIS NEEDED: Medusa Tax has regional rates; check if it supports tenant-scoped rules and exemptions |
| `inventory-extension` (3 models: ReservationHold, StockAlert, WarehouseTransfer, 7 methods, 2 API routes) | Medusa Inventory + Stock Location (levels, reservations) | Reservation holds with expiry, low-stock alerts, warehouse-to-warehouse transfers | GAP ANALYSIS NEEDED: Medusa Inventory handles levels/reservations; check if holds/alerts/transfers are covered |

### Category B-EXTENSION — Extends Medusa core with unique features (KEEP)

| Custom Module | Extends | What It Adds | Status |
|---|---|---|---|
| `cityosStore` (key: "cityosStore", 1 model, 10 methods) | Medusa Store | Multi-tenant store entity with tenant_id, subdomain, custom_domain, theme_config, brand_colors. Uses model name "cityosStore" and key "cityosStore" — completely separate entity from Medusa's built-in Store module. | KEEP: no conflict with Medusa Store |
| `volume-pricing` (3 models, 3 methods) | Medusa Pricing | Tiered/volume pricing rules targeting products/variants | KEEP: Medusa Pricing has price rules but not tiered volume discount logic |
| `vendor` (7 models, 15 methods) | None (custom marketplace) | Full vendor management, VendorProduct, VendorOrder, vendor profiles, order splitting | KEEP: core marketplace module, no Medusa equivalent |
| `commission` (3 models, 7 methods) | None | Commission rules, calculations per vendor/tenant | KEEP: marketplace-specific |
| `payout` (3 models, 10 methods) | None | Vendor payout management, payout schedules | KEEP: marketplace-specific |
| `subscription` (6 models, 17 methods) | None | Recurring subscriptions, billing cycles, subscription items | KEEP: no Medusa equivalent |
| `company` (8 models, 15 methods) | None | B2B: companies, purchase orders, buyer/seller relationships | KEEP: no Medusa equivalent |
| `quote` (2 models) | Medusa Draft Order (partial) | B2B quote/RFQ workflow with negotiation, approval chains. More complex than Draft Order. | KEEP: Draft Order is simpler; Quote adds B2B-specific negotiation |
| `review` (1 model, 10 methods) | None | Product/service reviews and ratings | KEEP |
| `digital-product` (3 models, 9 methods) | None | Digital asset delivery, download management | KEEP |
| `invoice` (2 models, 10 methods) | None | Invoice generation and management | KEEP |
| `dispute` (2 models, 12 methods) | None | Order/transaction dispute resolution | KEEP |
| `loyalty` (3 models, 8 methods) | None | Points programs, loyalty accounts | KEEP |
| `wishlist` (2 models, 7 methods) | RSC-Labs plugin (disabled) | Wishlist with items. RSC-Labs medusa-wishlist plugin was attempted but disabled due to install issues. | KEEP: custom implementation works; plugin can be revisited |
| `social-commerce` (6 models, 6 methods) | None | Live shopping, social selling features | KEEP |
| `membership` (6 models, 4 methods) | None | Membership tiers, benefits | KEEP |

### Category C — VERTICAL/DOMAIN-SPECIFIC (unique, KEEP)

27 vertical modules, each with domain-specific models and business logic. No Medusa equivalents exist.

**Most mature (6+ models, 7+ methods):**
booking (6 models, 19 methods), healthcare (8, 8), restaurant (8, 7), travel (8, 8), event-ticketing (7, 8), freelance (7, 8), grocery (5, 8), automotive (6, 8), fitness (6, 8), financial-product (6, 8), advertising (6, 9), parking (5, 8), utilities (5, 8), legal (5, 7), government (6, 7), crowdfunding (6, 7)

**Standard (5-6 models, 4-6 methods):**
auction (6, 4), classified (6, 6), charity (5, 5), education (7, 5), real-estate (7, 5), pet-service (5, 7), affiliate (5 models, 7 methods), warranty (5 models, 7 methods)

**Basic:**
rental (6 models, 4 methods), membership (6, 4)

### Category D — INFRASTRUCTURE/CityOS (unique, KEEP)

| Module | Models | Methods | Purpose |
|---|---|---|---|
| `tenant` | 8 | 22 | Multi-tenant isolation, tenant profiles, onboarding |
| `node` | 2 | 9 | 5-level hierarchy (CITY > DISTRICT > ZONE > FACILITY > ASSET) |
| `governance` | 2 | 10 | Policy inheritance, approval chains |
| `persona` | 3 | 8 | 6-axis persona system |
| `channel` | 2 | 11 | Communication channels per tenant |
| `region-zone` | 2 | 8 | Residency zones, geographic scoping |
| `audit` | 2 | 7 | Audit trail, compliance logging |
| `cms-content` | 2 | 7 | CMS pages and navigation (Payload CMS bridge) |

## Stub Modules (NOT registered in medusa-config.ts, no models)

| Module | Lines | Methods | API Routes | Impact of Removal |
|---|---|---|---|---|
| `wallet` | 127 | 6 | 2 route files (admin, store) | Routes will 500 at runtime since module not registered. Remove module + routes together. |
| `trade-in` | 120 | 6 | 4 route files (admin, store, vendor) | Routes will 500 at runtime. Remove module + routes together. |
| `insurance` | 123 | 5 | 4 route files (admin, store, vendor) | Routes will 500 at runtime. Remove module + routes together. |

**Pre-removal checklist:**
1. Search storefront for any references to wallet/trade-in/insurance API endpoints
2. Remove API route files first, then module directories
3. Verify no other modules import from these modules

## Config Notes

- `meilisearch` is referenced in medusa-config.ts (conditional on MEILISEARCH_HOST env var) but has no module directory at `src/modules/meilisearch`. This is acceptable since it is conditionally loaded and MEILISEARCH_HOST is not set.

## Integration Pattern Observations

The following extension modules have API routes but zero subscriber/workflow/job references. They function correctly via direct API calls. Adding event-driven behavior is an optional enhancement, not a required fix:
- analytics, cart-extension, inventory-extension, shipping-extension, tax-config, promotion-ext, notification-preferences

## Migration Priority Roadmap

### Phase 1 — Remove Dead Code (Immediate, No Risk)
1. Remove `wallet` stub module directory + 2 API route files
2. Remove `trade-in` stub module directory + 4 API route files
3. Remove `insurance` stub module directory + 4 API route files
4. Verify no storefront code references these modules
5. Verify no other backend modules import from these modules

### Phase 2 — Migrate Confirmed Duplicates (Medium Effort)
1. `analytics` -> Medusa Analytics module
   - Configure Medusa analytics provider (PostHog or local) in medusa-config.ts
   - Migrate event tracking calls to Medusa analytics API
   - Evaluate if Report/Dashboard models should remain as extension or move to external BI
   - Conditional: only proceed if Medusa analytics API covers current trackEvent/getEventCounts/getSalesMetrics needs
2. `notification-preferences` -> Customer metadata or lightweight extension
   - If Medusa Notification module handles channel preferences natively, migrate
   - If not, keep as extension but ensure it links to Medusa Customer via defineLink

### Phase 3 — Evaluate Experimental Migrations (Requires Feasibility Check)
1. `i18n` -> Medusa Translation module (v2.13, experimental)
   - Check if Medusa Translation supports custom entity translations (not just products)
   - Check if experimental status is acceptable for production
   - If both yes, migrate; if either no, keep custom module
2. Conduct gap analysis on 5 hybrid-overlap modules:
   - cart-extension: Can Medusa Cart metadata replace CartMetadata model?
   - promotion-ext: Does Medusa gift card cover GiftCardExt? (Referral/Bundle likely stay)
   - shipping-extension: Do Medusa Fulfillment providers cover CarrierConfig?
   - tax-config: Does Medusa Tax support tenant-scoped rules and exemptions?
   - inventory-extension: Does Medusa Inventory cover holds, alerts, transfers?

### Phase 4 — Strengthen Extension Patterns (Optional Enhancement)
1. Add Medusa links for extension modules where missing (cart-extension -> Cart, promotion-ext -> Promotion)
2. Consider subscribers for isolated modules (e.g., inventory-extension reacting to stock events)
3. Consolidate promotion-ext.GiftCardExt with Medusa native gift card support if gap analysis confirms overlap

### Phase 5 — Plugin Re-evaluation (Future)
1. Re-evaluate RSC-Labs plugins when compatible: medusa-wishlist, medusa-rbac, medusa-documents-v2, medusa-store-analytics-v2

## Maturity Assessment Summary

| Tier | Modules | Description |
|---|---|---|
| **Production-ready** (15+ methods, 5+ models) | tenant (22m), booking (19m), subscription (17m), vendor (15m), company (15m) | Well-tested, comprehensive business logic |
| **Solid** (7-14 methods) | governance, channel, region-zone, commission, payout, cart-extension, tax-config, notification-preferences, review, dispute, invoice, loyalty, digital-product, shipping-extension + most verticals | Functional, adequate for MVP |
| **Basic** (3-6 methods) | node, persona, audit, i18n, volume-pricing, wishlist, social-commerce, membership, rental | Minimal viable implementation |
| **Non-functional stubs** | wallet, trade-in, insurance | No models, not registered in medusa-config.ts. Remove. |
