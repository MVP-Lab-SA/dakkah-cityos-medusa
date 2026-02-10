# Dakkah CityOS Commerce Platform — Gap Analysis

## vs. medusa-core-nrd4 Reference Implementation (53 Commerce Models)

**Date:** February 10, 2026  
**Scope:** Full platform comparison across backend modules, storefront routes/components, design system types, and UI patterns  
**Methodology:** Systematic comparison of our 48 backend modules, 90+ data models, storefront routes, 25+ component directories, and design system packages against the reference implementation's 53 commerce models (8 parts) and 100+ UI patterns

---

## 1. Executive Summary

The Dakkah CityOS Commerce Platform has strong backend coverage with **48 modules** and **90+ data models**, covering the majority of the 53 commerce models defined in the reference design document. However, significant gaps exist in **storefront coverage** — many backend-supported features lack corresponding customer-facing routes and components. The design system, while well-structured with 27 block types and 13 commerce types, needs expansion to support the full breadth of the 53 models.

### Key Findings

| Metric | Count |
|--------|-------|
| Total Models Assessed | 53 |
| Category D (Complete — backend + storefront) | 12 |
| Category C (Partial coverage) | 18 |
| Category A (Backend exists, no/minimal storefront) | 17 |
| Category B (Completely missing) | 6 |
| Missing Storefront Routes | ~24 |
| Missing Component Directories | ~7 |
| Missing Design System Types | ~75+ |
| Missing UI Patterns (vs 101 reference) | ~65 |

**Priority Breakdown:**
- P0 (Critical): 6 models — core commerce gaps blocking launch
- P1 (High): 14 models — important for marketplace differentiation
- P2 (Medium): 19 models — valuable but not blocking
- P3 (Low): 14 models — nice-to-have or infrastructure-level

---

## 2. Platform Comparison Matrix

### Part I: Commerce Business Models (1–20)

| # | Model | Backend Status | Storefront Status | Gap | Pri | Effort |
|---|-------|---------------|-------------------|-----|-----|--------|
| 1 | Direct-to-Consumer (DTC) | **Complete** — `store`, `product`, Medusa core | **Complete** — `products/`, `cart.tsx`, `checkout.tsx`, `order/` | D | — | — |
| 2 | Subscription Commerce | **Complete** — `subscription` module: `subscription.ts`, `subscription-plan.ts`, `subscription-item.ts`, `subscription-event.ts`, `billing-cycle.ts` | **Complete** — `subscriptions/`, `account/subscriptions/`, components in `src/components/subscriptions/` | D | — | — |
| 3 | Marketplace | **Complete** — `vendor` module: `vendor.ts`, `vendor-product.ts`, `vendor-order.ts`, `vendor-user.ts`, `vendor-analytics.ts`, `marketplace-listing.ts` | **Partial** — `vendor/` route (vendor dashboard), `src/components/vendor/`, `src/components/vendors/`; missing dedicated `/vendors` browse page, vendor storefront | C | P0 | M |
| 4 | B2B | **Complete** — `company` module: `company.ts`, `company-user.ts`, `purchase-order.ts`, `purchase-order-item.ts`, `payment-terms.ts`, `tax-exemption.ts` | **Partial** — `b2b/`, `business/`, `account/purchase-orders/`, `src/components/b2b/`, `src/components/purchase-orders/`; missing bulk ordering, RFQ flows | C | P0 | M |
| 5 | Wholesale | **Partial** — `volume-pricing` module: `volume-pricing.ts`, `volume-pricing-tier.ts`; no dedicated wholesale module | **Partial** — volume pricing on product pages; missing wholesale catalog, minimum order enforcement UI | C | P1 | M |
| 6 | Dropshipping | **Partial** — vendor module supports multi-vendor fulfillment; no dedicated dropship routing | **Missing** — no dropship-specific storefront features | A | P2 | M |
| 7 | White Label/Private Label | **Partial** — `tenant` module supports multi-tenant branding; `store.ts` | **Partial** — tenant-scoped theming exists; no private-label product management UI | C | P2 | S |
| 8 | Print-on-Demand | **Missing** — no print-on-demand module | **Missing** — no customizer/designer UI | B | P3 | XL |
| 9 | Rental/Leasing | **Complete** — `rental` module: `rental-product.ts`, `rental-agreement.ts`, `rental-period.ts`, `rental-return.ts`, `damage-claim.ts` | **Missing** — no `rentals/` route; no rental browsing or booking UI | A | P1 | L |
| 10 | Recommerce/Resale/Trade-In | **Partial** — `classified` module: `classified-listing.ts`, `listing-offer.ts`, `listing-flag.ts`; no trade-in valuation | **Missing** — no `trade-in/` route; no resale/consignment storefront | A | P1 | L |
| 11 | Social Commerce | **Complete** — `social-commerce` module with API routes | **Missing** — no social commerce storefront features (shoppable posts, social sharing, live shopping) | A | P2 | L |
| 12 | Headless Commerce | **Complete** — Medusa is headless by design; full API layer | **Complete** — TanStack Start storefront consuming APIs | D | — | — |
| 13 | Omnichannel Commerce | **Partial** — `channel` module: `service-channel.ts`, `sales-channel-mapping.ts`; `store` module | **Partial** — store locator in CMS blocks; missing channel-switching UI, BOPIS integration | C | P1 | L |
| 14 | Flash Sales/Daily Deals | **Partial** — `promotion-ext` module; no flash-sale scheduling | **Missing** — no `flash-sales/` route; no countdown/deal UI | A | P1 | M |
| 15 | Freemium Commerce | **Partial** — subscription plans can model freemium tiers | **Partial** — subscription UI exists; no freemium-specific gating or upgrade prompts | C | P2 | S |
| 16 | Bundling Commerce | **Partial** — `product-bundle.ts` model exists | **Missing** — no `bundles/` route; no bundle builder/configurator UI | A | P1 | M |
| 17 | Affiliate Commerce | **Complete** — `affiliate` module: `affiliate.ts`, `affiliate-commission.ts`, `referral.ts`, `referral-link.ts`, `click-tracking.ts` | **Missing** — no affiliate dashboard or referral link UI on storefront | A | P2 | M |
| 18 | Crowdfunding/Pre-order | **Complete** — `crowdfunding` module with admin + store APIs | **Missing** — no `preorders/` or `campaigns/` route; no crowdfunding progress UI | A | P1 | L |
| 19 | Membership/VIP Commerce | **Complete** — `membership` module with store API | **Missing** — no `memberships/` route; no membership tiers/benefits UI | A | P0 | M |
| 20 | Hybrid Commerce | **Complete** — platform supports multiple models via module composition | **Partial** — individual model UIs need completion | C | P2 | S |

### Part II: Alternative Commerce Models (21–30)

| # | Model | Backend Status | Storefront Status | Gap | Pri | Effort |
|---|-------|---------------|-------------------|-----|-----|--------|
| 21 | Try-Before-You-Buy | **Missing** — no TBYB module | **Missing** — no `try-before-you-buy/` route | B | P2 | L |
| 22 | Consignment | **Partial** — classified module partially covers; no consignment-specific workflow | **Missing** — no `consignment/` route | B | P2 | L |
| 23 | Auctions | **Complete** — `auction` module: `auction-listing.ts`, `auction-escrow.ts`, `auction-result.ts`, `bid.ts`, `auto-bid-rule.ts` | **Missing** — no `auctions/` route; no bidding UI, auction countdown, bid history | A | P1 | L |
| 24 | Services & Bookings | **Complete** — `booking` module: `booking.ts`, `check-in.ts`, `service.ts`, `service-product.ts`, `service-provider.ts`, `seat-map.ts`, `table-reservation.ts` | **Complete** — `bookings/`, `account/bookings/`, `src/components/bookings/` | D | — | — |
| 25 | Digital Products & Downloads | **Complete** — `digital-product` module: `digital-asset.ts`, `download-license.ts` | **Missing** — no dedicated digital product browsing, download library, or license management UI | A | P1 | M |
| 26 | Events & Ticketing | **Complete** — `events` + `event-ticketing` modules: `event.ts`, `venue.ts`, `ticket.ts`, `ticket-type.ts`, `seat-map.ts` | **Missing** — no `events/` route; no event browsing, ticket purchasing, seat selection UI | A | P0 | L |
| 27 | Gift Cards & Vouchers | **Partial** — `gift-card-ext.ts` extends Medusa core gift cards | **Missing** — no `gift-cards/` route; no gift card purchase/redeem UI | A | P1 | M |
| 28 | Referral Commerce | **Complete** — `affiliate` module: `referral.ts`, `referral-link.ts` | **Missing** — no referral dashboard or invite-a-friend UI | A | P2 | S |
| 29 | Loyalty & Rewards | **Partial** — `loyalty-program.ts`, `loyalty-points-ledger.ts` models exist; no dedicated module | **Missing** — no loyalty dashboard, points history, or rewards catalog UI | A | P1 | M |
| 30 | Multi-Tenant Platform | **Complete** — `tenant` module: `tenant.ts`, `tenant-billing.ts`, `tenant-poi.ts`, `tenant-relationship.ts`, `tenant-settings.ts`, `tenant-user.ts` | **Partial** — `src/components/cityos/`, platform context; missing `platform/` admin storefront | C | P2 | M |

### Part III: Payment & Financial Models (31–38)

| # | Model | Backend Status | Storefront Status | Gap | Pri | Effort |
|---|-------|---------------|-------------------|-----|-----|--------|
| 31 | Digital Wallet | **Missing** — no wallet module; Walt.id integration for identity only | **Missing** — no wallet balance/top-up UI | B | P2 | L |
| 32 | BNPL | **Missing** — no BNPL module (Stripe handles externally) | **Missing** — no BNPL selector in checkout | B | P2 | M |
| 33 | Installment Plans | **Partial** — `financial-product` module can model installments | **Missing** — no installment plan selector UI | A | P2 | M |
| 34 | Store Credits | **Partial** — Medusa core has gift cards; `gift-card-ext.ts` | **Missing** — no store credit balance/usage UI | A | P2 | S |
| 35 | Escrow Payments | **Complete** — `auction-escrow.ts` in auction module; `payout` module | **Missing** — no escrow status UI for buyers/sellers | A | P2 | S |
| 36 | Invoicing & Net Terms | **Complete** — `invoice` module: `invoice.ts`, `invoice-item.ts`; payment terms APIs | **Partial** — `src/components/invoices/`; missing full invoice management in account | C | P1 | M |
| 37 | Disputes & Refunds | **Partial** — Medusa core handles refunds; no formal dispute module | **Partial** — order return flow exists at `account/orders/$id.return` | C | P1 | M |
| 38 | Multi-Currency | **Complete** — Medusa core + `i18n` module: `translation.ts`, `region-zone-mapping.ts` | **Complete** — locale-based currency via `$tenant/$locale` routing | D | — | — |

### Part IV: Identity & Verification (39–43)

| # | Model | Backend Status | Storefront Status | Gap | Pri | Effort |
|---|-------|---------------|-------------------|-----|-----|--------|
| 39 | KYC | **Partial** — Walt.id integration for KYC credentials; vendor approval flow | **Missing** — no KYC submission UI, document upload | A | P1 | L |
| 40 | Age Verification | **Missing** — no age verification module | **Missing** — no age gate UI | B | P3 | M |
| 41 | Residency Verification | **Partial** — `region-zone` module; governance residency zones | **Missing** — no residency verification UI | A | P3 | S |
| 42 | Digital Identity Wallet | **Partial** — Walt.id integration: DID management, 6 credential types | **Missing** — no `verify/` route; no credential presentation UI | A | P2 | L |
| 43 | Consent Management | **Partial** — governance module handles policy; no explicit consent tracking | **Missing** — no cookie banner, consent preferences UI | A | P1 | M |

### Part V: Logistics & Delivery (44–49)

| # | Model | Backend Status | Storefront Status | Gap | Pri | Effort |
|---|-------|---------------|-------------------|-----|-----|--------|
| 44 | Standard Shipping | **Complete** — Medusa core shipping; Fleetbase integration | **Complete** — checkout shipping step | D | — | — |
| 45 | Same-Day/Express | **Partial** — Fleetbase integration supports; no express shipping module | **Partial** — shipping options in checkout; no express-specific UI | C | P1 | S |
| 46 | Store Pickup (BOPIS) | **Partial** — `store` module with locations; no pickup scheduling | **Missing** — no store pickup option in checkout, no pickup scheduling | A | P1 | M |
| 47 | Delivery Slots & Scheduling | **Partial** — booking module can model; no delivery slot module | **Missing** — no `delivery-slots/` route; no slot picker in checkout | A | P0 | L |
| 48 | Real-Time Tracking | **Partial** — Fleetbase integration for tracking; `order/$orderId` route | **Partial** — `account/orders/$id.track`; no `track/` standalone route, no live map | C | P1 | M |
| 49 | Returns & Exchanges | **Partial** — Medusa core returns; `rental-return.ts` | **Partial** — `account/orders/$id.return`; no `returns/` standalone route, no exchange selector | C | P0 | M |

### Part VI: Content & CMS (50–53)

| # | Model | Backend Status | Storefront Status | Gap | Pri | Effort |
|---|-------|---------------|-------------------|-----|-----|--------|
| 50 | Blog & Articles | **Partial** — CMS registry supports blog vertical; no blog models | **Missing** — no `blog/` route; no blog post list/detail UI | A | P1 | M |
| 51 | FAQ & Help Center | **Partial** — FAQBlockData exists; no help center module | **Missing** — no `help/` or `faq/` route; no searchable help center | A | P1 | M |
| 52 | Points of Interest (POI) | **Complete** — `tenant-poi.ts`, `node` module, CMS POI vertical | **Missing** — no `poi/` route; no POI browsing/detail UI | A | P2 | M |
| 53 | Dynamic CMS Pages | **Complete** — CMS registry, block system, 27 verticals | **Complete** — `$slug.tsx` catch-all, `$.tsx`, `src/components/cms/`, `src/components/blocks/`, `src/components/pages/` | D | — | — |

---

## 3. Detailed Gap Analysis by Part

### Part I: Commerce Business Models (1–20)

#### What We Have
- **DTC/Core Commerce:** Full Medusa product catalog, cart, checkout, order flow
  - Routes: `products/`, `cart.tsx`, `checkout.tsx`, `order/`
  - Components: `src/components/products/`, `src/components/cart/`, `src/components/orders/`
- **Subscriptions:** Complete module with plans, items, events, billing cycles
  - Backend: `apps/backend/src/modules/subscription/models/`
  - Routes: `subscriptions/`, `account/subscriptions/$id`, `account/subscriptions/$id.billing`
  - Components: `src/components/subscriptions/`
- **Marketplace:** Vendor module with products, orders, analytics, payouts
  - Backend: `apps/backend/src/modules/vendor/models/`
  - Routes: `vendor/` (dashboard), `vendor/orders/`, `vendor/products/`, `vendor/payouts/`
  - Components: `src/components/vendor/`, `src/components/vendors/`
- **B2B:** Company module with purchase orders, payment terms, tax exemptions
  - Backend: `apps/backend/src/modules/company/models/`
  - Routes: `b2b/`, `business/`, `account/purchase-orders/`
  - Components: `src/components/b2b/`, `src/components/business/`, `src/components/purchase-orders/`
- **Rental:** Full rental module with products, agreements, periods, returns, damage claims
  - Backend: `apps/backend/src/modules/rental/models/`
- **Affiliate:** Affiliate, referral, click tracking models
  - Backend: `apps/backend/src/modules/affiliate/models/`
- **Social Commerce:** Module with admin and store APIs
  - Backend: `apps/backend/src/modules/social-commerce/models/`
- **Crowdfunding:** Module with admin and store APIs
  - Backend: `apps/backend/src/modules/crowdfunding/models/`

#### What's Missing
- **Storefront routes needed:**
  - `/rentals/` — rental product browsing, availability calendar, rental booking
  - `/trade-in/` — trade-in valuation wizard, resale listings
  - `/flash-sales/` — countdown deals, limited-time offers
  - `/bundles/` — bundle configurator, package deals
  - `/campaigns/` — crowdfunding campaign pages, progress bars, backer rewards
  - `/preorders/` — pre-order product pages with estimated delivery
  - `/memberships/` — membership tier comparison, benefits, signup
- **Components needed:**
  - `src/components/rentals/` — RentalCard, RentalCalendar, RentalAgreementView
  - `src/components/auctions/` — AuctionCard, BidPanel, AuctionCountdown
  - `src/components/campaigns/` — CampaignCard, ProgressBar, BackerList
  - `src/components/memberships/` — MembershipTierCard, BenefitsList
  - `src/components/bundles/` — BundleConfigurator, BundleSummary
  - `src/components/flash-sales/` — CountdownTimer, DealCard
  - `src/components/social/` — ShoppablePost, LiveShoppingEmbed, SocialSharePanel

#### What Needs Enhancement
- **Marketplace:** Add vendor discovery page (`/vendors`), vendor storefront pages, vendor ratings aggregation
- **B2B:** Add bulk order UI, RFQ workflow, volume discount display
- **Wholesale:** Surface volume pricing tiers on product pages, minimum order indicators
- **Omnichannel:** Channel-switching UI, unified cart across channels

### Part II: Alternative Commerce Models (21–30)

#### What We Have
- **Auctions:** Complete backend with listings, bids, auto-bid rules, escrow, results
  - Backend: `apps/backend/src/modules/auction/models/`
  - API: `apps/backend/src/api/store/auctions/`, `apps/backend/src/api/admin/auctions/`
- **Services & Bookings:** Complete with availability, check-in, services, providers, reservations
  - Backend: `apps/backend/src/modules/booking/models/`
  - Routes: `bookings/`, `account/bookings/$id`
  - Components: `src/components/bookings/`
- **Digital Products:** Module with assets and download licenses
  - Backend: `apps/backend/src/modules/digital-product/models/`
- **Events & Ticketing:** Two modules (events + event-ticketing) with venues, tickets, seat maps
  - Backend: `apps/backend/src/modules/events/models/`, `apps/backend/src/modules/event-ticketing/models/`
- **Loyalty:** Models for programs and points ledger exist
  - Models: `loyalty-program.ts`, `loyalty-points-ledger.ts`
- **Multi-Tenant:** Full tenant module with billing, settings, users, POIs, relationships
  - Backend: `apps/backend/src/modules/tenant/models/`

#### What's Missing
- **Storefront routes needed:**
  - `/auctions/` — auction browsing, live bidding, bid history, won items
  - `/events/` — event browsing, ticket purchasing, seat selection
  - `/try-before-you-buy/` — TBYB product selection, trial management
  - `/consignment/` — consignment item submission, status tracking
  - `/wishlist/` — dedicated wishlist page (models exist: `wishlist.ts`, `wishlist-item.ts`)
  - `/gift-cards/` — gift card purchase, balance check, redemption
  - `/memberships/` — membership browsing, signup, management
- **Components needed:**
  - `src/components/auctions/` — full auction UI suite
  - `src/components/events/` — EventCard, TicketSelector, SeatMap, VenueMap
  - `src/components/digital/` — DigitalProductCard, DownloadManager, LicenseViewer
  - `src/components/wishlists/` — WishlistGrid, WishlistSharePanel
  - `src/components/loyalty/` — PointsBalance, RewardsGrid, PointsHistory
  - `src/components/gift-cards/` — GiftCardPurchase, BalanceChecker, RedeemForm
- **Backend modules needed:**
  - Try-Before-You-Buy module (trial period, conversion tracking, return handling)
  - Consignment module (consignment agreements, seller payouts on sale)

#### What Needs Enhancement
- **Auctions:** Need real-time WebSocket support for live bidding
- **Digital Products:** Need storefront download library in account section
- **Loyalty:** Need dedicated loyalty module (currently just models), rewards catalog, tier progression

### Part III: Payment & Financial Models (31–38)

#### What We Have
- **Invoicing:** Complete module with early payment, partial payment, void, send operations
  - Backend: `apps/backend/src/modules/invoice/models/`
  - API: `apps/backend/src/api/store/invoices/`, `apps/backend/src/api/admin/invoices/`
  - Components: `src/components/invoices/`
- **Escrow:** Auction escrow model; payout module with transaction links
  - Backend: `apps/backend/src/modules/payout/models/`
- **Multi-Currency:** Medusa core + i18n module with translations and region zones
  - Backend: `apps/backend/src/modules/i18n/models/`
- **Stripe Integration:** Stripe gateway, vendor Stripe Connect
  - Backend: `apps/backend/src/integrations/stripe-gateway/`

#### What's Missing
- **Backend modules needed:**
  - Digital Wallet module (balance, top-up, transfers, transaction history)
  - BNPL module (or Stripe/Klarna BNPL integration configuration)
  - Store Credits module (credit issuance, balance tracking, redemption)
  - Dispute module (dispute creation, evidence submission, resolution workflow)
- **Storefront routes/components needed:**
  - Wallet balance display in account section
  - BNPL option selector in checkout flow
  - Installment plan picker on product/checkout pages
  - Store credit balance in account, redemption at checkout
  - Dispute filing UI in order detail
  - `/returns/` standalone route for return/exchange management
- **Components needed:**
  - `src/components/payments/` — WalletBalance, BNPLSelector, InstallmentPicker, StoreCreditWidget
  - `src/components/finance/` — DisputeForm, RefundStatus, CreditHistory

#### What Needs Enhancement
- **Invoicing:** Add invoice PDF generation, recurring invoice support in storefront
- **Refunds:** Enhanced refund tracking UI with status timeline

### Part IV: Identity & Verification (39–43)

#### What We Have
- **Walt.id Integration:** DID management, 6 credential types (KYC, Vendor, Membership, TenantOperator, POI, MarketplaceSeller)
  - Backend: `apps/backend/src/integrations/waltid/`
- **Vendor Approval:** KYC-like approval flow for vendors
  - API: `apps/backend/src/api/admin/vendors/[id]/approve/`, `reject/`, `suspend/`
- **Governance:** Authority chain with deep policy merging
  - Backend: `apps/backend/src/modules/governance/models/`
- **Region Zones:** Residency zone support (GCC/EU, MENA, APAC, AMERICAS, GLOBAL)
  - Backend: `apps/backend/src/modules/region-zone/models/`

#### What's Missing
- **Backend modules needed:**
  - Age verification module (age gate logic, DOB verification, ID check)
  - Consent management module (consent records, opt-in/opt-out tracking, GDPR compliance)
- **Storefront routes needed:**
  - `/verify/` — credential verification, KYC submission
- **Components needed:**
  - `src/components/identity/` — KYCForm, DocumentUpload, VerificationStatus, AgeGate
  - `src/components/consent/` — CookieBanner, ConsentPreferences, PrivacySettings
  - `src/components/verification/` — CredentialCard, VerificationBadge

#### What Needs Enhancement
- **KYC:** Surface Walt.id credential presentation in storefront
- **Governance:** Add governance policy display for end users (data usage, privacy)

### Part V: Logistics & Delivery (44–49)

#### What We Have
- **Shipping:** Medusa core shipping with Fleetbase integration
  - Backend: `apps/backend/src/integrations/fleetbase/`
- **Order Tracking:** Order detail with tracking info
  - Routes: `account/orders/$id.track`
- **Returns:** Order return flow
  - Routes: `account/orders/$id.return`
  - Components: `src/components/orders/`

#### What's Missing
- **Storefront routes needed:**
  - `/delivery-slots/` — delivery slot selection page
  - `/track/` — standalone tracking by order ID/tracking number
  - `/returns/` — standalone returns center (initiate return without navigating to order)
- **Components needed:**
  - `src/components/delivery/` — DeliverySlotPicker, ExpressDeliveryBadge, StorePickupSelector, DeliveryScheduler
  - Enhanced `src/components/orders/` — TrackingMap (live map), ReturnRequestForm, ExchangeSelector
- **Backend enhancements needed:**
  - Delivery slot scheduling module
  - Store pickup (BOPIS) scheduling integration
  - Express delivery surcharge calculation

#### What Needs Enhancement
- **Tracking:** Add real-time map tracking (Fleetbase integration to storefront)
- **Returns:** Add exchange option (swap for different size/color), prepaid return labels
- **BOPIS:** Add store pickup as checkout option with store selector

### Part VI: Content & CMS (50–53)

#### What We Have
- **CMS Block System:** 27 block types defined in `packages/cityos-design-system/src/blocks/BlockTypes.ts`
  - 25 blocks implemented in `apps/storefront/src/components/blocks/`
  - `BlockRenderer` with `BLOCK_REGISTRY` for dynamic rendering
  - `FAQBlockData` type exists for FAQ content
- **CMS Pages:** Dynamic page rendering via catch-all routes
  - Routes: `$slug.tsx`, `$.tsx`
  - Components: `src/components/cms/`, `src/components/pages/`
  - Backend: CMS registry at `apps/backend/src/lib/platform/cms-registry.ts` with 27 verticals
- **POI:** Tenant POI model exists
  - Backend: `tenant-poi.ts` in tenant module
  - API: `apps/backend/src/api/platform/vendors/[id]/pois/`

#### What's Missing
- **Storefront routes needed:**
  - `/blog/` — blog post listing, categories, tags, single post view
  - `/help/` — help center with searchable articles, categories
  - `/faq/` — standalone FAQ page (can use FAQBlockData)
  - `/poi/` — POI browsing with map, category filtering
  - `/about/` — about page
  - `/contact/` — contact page (can use ContactFormBlockData)
  - `/announcements/` — announcements/news page
- **Components needed:**
  - `src/components/content/` — BlogPostCard, BlogPostDetail, BlogSidebar, ArticleSearch
  - `src/components/help/` — HelpCenter, ArticleCard, SearchBar, CategoryNav
  - `src/components/poi/` — POICard, POIMap, POIDetail, POICategoryFilter
- **Block implementations needed:**
  - `map` block (BlockType defined but not implemented)
  - `reviewList` block (BlockType defined but not implemented)

#### What Needs Enhancement
- **CMS:** Add blog-specific content type in CMS registry
- **FAQ:** Promote FAQ from block to standalone page with search
- **POI:** Connect POI display to Fleetbase geocoding

### Part VII: UI Component Patterns

*See Section 5 for detailed UI pattern gap analysis*

### Part VIII: Data Models & Architecture

#### What We Have
- **Core Data Models:** 90+ models across 48 modules
- **API Architecture:** RESTful APIs with admin, store, vendor, and platform scopes
- **State Management:** React Query for client-side state; SSR-safe architecture
- **Caching:** Built into Medusa core; React Query cache on frontend

#### What's Missing / Needs Enhancement
- **Data models needed:**
  - `wallet.ts`, `wallet-transaction.ts` — for digital wallet
  - `consent-record.ts`, `consent-type.ts` — for consent management
  - `dispute.ts`, `dispute-evidence.ts` — for disputes
  - `blog-post.ts`, `blog-category.ts` — for blog (or delegate to Payload CMS)
  - `help-article.ts`, `help-category.ts` — for help center (or delegate to Payload CMS)
  - `delivery-slot.ts`, `delivery-schedule.ts` — for delivery scheduling
  - `store-credit.ts`, `credit-transaction.ts` — for store credits
  - `trial-order.ts`, `trial-conversion.ts` — for try-before-you-buy
  - `consignment-agreement.ts`, `consignment-payout.ts` — for consignment
- **API Architecture:** Add WebSocket support for real-time features (auctions, tracking)
- **Caching Strategy:** Add CDN caching headers for CMS/blog content

---

## 4. Design System Type Gaps

Our design system currently defines types across 8 files. Below are the missing type definitions needed to support all 53 commerce models:

### Current Design System Types (Existing)

| File | Types Defined |
|------|--------------|
| `CommerceTypes.ts` | ProductCardProps, PriceData, PriceDisplayProps, CartItemProps, OrderSummaryProps, RatingProps, InventoryBadgeProps, QuantitySelectorProps, WishlistButtonProps, FilterGroupProps, SortSelectProps, ProductQuickViewProps, VendorCardProps |
| `BlockTypes.ts` | 27 block data types + supporting types |
| `NavigationTypes.ts` | NavbarProps, SidebarProps, TabsProps, BreadcrumbProps, PaginationProps, StepperProps, DropdownMenuProps |
| `FeedbackTypes.ts` | ModalProps, AlertProps, ToastNotification, NotificationProps, ConfirmDialogProps, BannerProps |
| `FormTypes.ts` | ButtonProps, InputProps, SelectProps, CheckboxProps, RadioGroupProps, TextareaProps, SwitchProps, FormFieldProps |
| `DataDisplayTypes.ts` | TableProps, BadgeProps, AvatarProps, TagProps, ProgressProps, StatProps, EmptyStateProps, SkeletonProps, TooltipProps |
| `LayoutTypes.ts` | ContainerProps, GridProps, StackProps, FlexProps, CardProps, DividerProps, SpacerProps, SectionProps |
| `ComponentTypes.ts` | Base types, Size, Variant, WithChildren, etc. |

### Missing Type Definitions by Domain

#### Auction & Bidding Types (new file: `AuctionTypes.ts`)
| Type | Description |
|------|------------|
| `AuctionCardProps` | Auction listing card with current bid, time remaining, bid count |
| `BidPanelProps` | Real-time bidding interface with bid input, bid history |
| `AuctionCountdownProps` | Countdown timer for auction end |
| `BidHistoryProps` | Table/list of bid history entries |
| `AuctionStatusBadgeProps` | Status indicator (active, ending soon, ended, sold) |
| `AutoBidConfigProps` | Auto-bid rule configuration form |

#### Rental & Leasing Types (new file: `RentalTypes.ts`)
| Type | Description |
|------|------------|
| `RentalCardProps` | Rental product card with pricing per period |
| `RentalCalendarProps` | Availability calendar for rental periods |
| `RentalAgreementViewProps` | Rental agreement display/acceptance |
| `RentalReturnFormProps` | Return process with condition assessment |
| `DamageClaimProps` | Damage report form with photo upload |
| `RentalPeriodSelectorProps` | Period picker (daily, weekly, monthly) |

#### Event & Ticketing Types (new file: `EventTypes.ts`)
| Type | Description |
|------|------------|
| `EventCardProps` | Event card with date, venue, price, category |
| `TicketSelectorProps` | Ticket type picker with quantity |
| `SeatMapProps` | Interactive seat map for venue selection |
| `VenueCardProps` | Venue information card |
| `EventCountdownProps` | Countdown to event start |
| `EventCalendarProps` | Calendar view of events |

#### Delivery & Logistics Types (new file: `DeliveryTypes.ts`)
| Type | Description |
|------|------------|
| `DeliverySlotPickerProps` | Date/time slot grid selector |
| `TrackingMapProps` | Live map with delivery tracking |
| `TrackingTimelineProps` | Order tracking status timeline |
| `ShippingMethodCardProps` | Shipping option card (standard, express, pickup) |
| `StorePickupSelectorProps` | Store location picker for BOPIS |
| `DeliveryEstimateProps` | Estimated delivery date display |
| `ReturnRequestFormProps` | Return/exchange request form |
| `ExchangeSelectorProps` | Product exchange variant picker |

#### Payment & Financial Types (new file: `PaymentTypes.ts`)
| Type | Description |
|------|------------|
| `WalletBalanceProps` | Wallet balance display with actions |
| `WalletTransactionListProps` | Transaction history list |
| `BNPLSelectorProps` | Buy-now-pay-later option selector |
| `InstallmentPlanCardProps` | Installment plan option card |
| `StoreCreditWidgetProps` | Store credit balance/apply at checkout |
| `EscrowStatusProps` | Escrow payment status indicator |
| `DisputeFormProps` | Dispute filing form |
| `RefundTimelineProps` | Refund processing status timeline |
| `InvoiceViewProps` | Invoice detail view |
| `PaymentTermsBadgeProps` | Net terms display (Net 30, etc.) |

#### Membership & Loyalty Types (new file: `MembershipTypes.ts`)
| Type | Description |
|------|------------|
| `MembershipTierCardProps` | Membership tier with benefits comparison |
| `LoyaltyDashboardProps` | Points balance, tier status, rewards overview |
| `PointsHistoryProps` | Points earning/spending history |
| `RewardCardProps` | Redeemable reward card |
| `TierProgressProps` | Progress bar toward next tier |
| `MemberBenefitsListProps` | List of active member benefits |

#### Gift Card Types (add to `CommerceTypes.ts`)
| Type | Description |
|------|------------|
| `GiftCardProps` | Gift card display with balance |
| `GiftCardPurchaseFormProps` | Gift card purchase form (amount, recipient, message) |
| `GiftCardRedeemProps` | Gift card redemption input |

#### Digital Product Types (new file: `DigitalTypes.ts`)
| Type | Description |
|------|------------|
| `DigitalProductCardProps` | Digital product card with format, size info |
| `DownloadButtonProps` | Download action with progress |
| `LicenseViewerProps` | License key display and management |
| `DownloadLibraryProps` | User's purchased digital product library |

#### Content & CMS Types (new file: `ContentTypes.ts`)
| Type | Description |
|------|------------|
| `BlogPostCardProps` | Blog post preview card |
| `BlogPostDetailProps` | Full blog post layout |
| `BlogSidebarProps` | Blog sidebar with categories, recent posts |
| `FAQAccordionProps` | Searchable FAQ accordion (standalone page) |
| `HelpArticleCardProps` | Help center article card |
| `HelpSearchProps` | Help center search interface |
| `POICardProps` | Point of interest card with map pin |
| `POIMapProps` | Interactive POI map |
| `AnnouncementCardProps` | Announcement/news card |

#### Identity & Verification Types (new file: `IdentityTypes.ts`)
| Type | Description |
|------|------------|
| `KYCFormProps` | KYC submission form (multi-step) |
| `DocumentUploadProps` | Document upload with preview |
| `VerificationStatusProps` | Verification status indicator |
| `AgeGateProps` | Age verification modal/page |
| `ConsentBannerProps` | Cookie/consent banner |
| `ConsentPreferencesProps` | Granular consent preference manager |
| `CredentialCardProps` | Verifiable credential display card |

#### Social Commerce Types (new file: `SocialTypes.ts`)
| Type | Description |
|------|------------|
| `ShoppablePostProps` | Social media post with embedded products |
| `SocialSharePanelProps` | Product sharing panel (social networks) |
| `LiveShoppingProps` | Live shopping stream embed |
| `InfluencerCardProps` | Influencer/creator profile card |

#### Marketplace Types (add to `CommerceTypes.ts`)
| Type | Description |
|------|------------|
| `VendorStorefrontProps` | Vendor store page layout |
| `VendorDashboardStatsProps` | Vendor dashboard statistics |
| `ConsignmentItemCardProps` | Consignment item with status |
| `TradeInValuationProps` | Trade-in value estimator |
| `CompareDrawerProps` | Product comparison drawer/panel |

#### Campaign Types (new file: `CampaignTypes.ts`)
| Type | Description |
|------|------------|
| `CrowdfundingCardProps` | Campaign card with progress, goal, backers |
| `CampaignProgressBarProps` | Funding progress visualization |
| `BackerListProps` | List of campaign backers |
| `PreorderCardProps` | Pre-order product with estimated delivery |
| `FlashSaleCardProps` | Flash sale product with countdown |
| `DealCountdownProps` | Deal expiry countdown timer |
| `BundleConfiguratorProps` | Bundle product selector/configurator |

**Total missing types: ~75+ across 11 new type files**

---

## 5. UI Pattern Gaps (Part VII Comparison)

### Current UI Inventory

**25 Block Components** (`apps/storefront/src/components/blocks/`):
hero, richText, featureGrid, cta, productGrid, collectionList, testimonial, faq, pricing, stats, imageGallery, videoEmbed, vendorShowcase, categoryGrid, serviceList, eventList, bookingCTA, promotionBanner, newsletter, trustBadges, comparisonTable, timeline, contactForm, divider, bannerCarousel

**10 Reusable UI Components** (`apps/storefront/src/components/ui/`):
Badge, Avatar, Breadcrumb, Tabs, Alert, Rating, Skeleton, Accordion, Switch, Textarea

**Implemented page-level components** (various directories):
ProductCard, ProductDetail, Cart, Checkout, OrderDetail, BookingForm, VendorCard, ReviewForm, InvoiceView, QuoteView, PurchaseOrderForm, SubscriptionCard

### Missing UI Patterns by Category

#### Navigation Patterns
| Pattern | Status | Notes |
|---------|--------|-------|
| Mega Menu | ❌ Missing | Multi-column dropdown with categories, images |
| Category Tree Nav | ❌ Missing | Hierarchical category navigation |
| Search Autocomplete | ❌ Missing | Search with suggestions, recent, trending |
| Command Palette (⌘K) | ❌ Missing | Keyboard-first search/navigation |
| Back-to-Top | ❌ Missing | Scroll-to-top button |
| Sticky Add-to-Cart | ❌ Missing | Fixed bottom bar on product pages |
| Mini Cart Drawer | ⚠️ Partial | Cart exists but drawer behavior may need work |
| Faceted Navigation | ⚠️ Partial | FilterGroup type exists; full implementation needed |
| Account Navigation | ✅ Exists | Account sidebar/tabs in place |

#### Product Display Patterns
| Pattern | Status | Notes |
|---------|--------|-------|
| Product Card (default) | ✅ Exists | `ProductCardProps` defined |
| Product Card (compact) | ✅ Exists | Variant supported |
| Product Card (horizontal) | ✅ Exists | Variant supported |
| Product Image Gallery | ❌ Missing | Zoomable, thumbnail strip, fullscreen |
| Product Variant Selector | ❌ Missing | Color/size swatches, option groups |
| Product Comparison | ❌ Missing | Side-by-side comparison table |
| Recently Viewed | ❌ Missing | Recently viewed products carousel |
| Product Recommendations | ❌ Missing | AI/rule-based related products |
| Wishlist Toggle | ✅ Exists | `WishlistButtonProps` defined |
| Quick View Modal | ✅ Exists | `ProductQuickViewProps` defined |
| Bundle Display | ❌ Missing | Bundle components with pricing |
| Subscription Product | ❌ Missing | Subscribe-and-save toggle on product |
| Digital Product Preview | ❌ Missing | Preview/sample for digital products |
| Auction Product | ❌ Missing | Auction-specific product display |
| Rental Product | ❌ Missing | Rental-specific with availability calendar |
| Pre-order Badge | ❌ Missing | Pre-order availability indicator |

#### Cart & Checkout Patterns
| Pattern | Status | Notes |
|---------|--------|-------|
| Cart Page | ✅ Exists | `cart.tsx` |
| Cart Drawer/Sidebar | ❌ Missing | Slide-out cart panel |
| Checkout Steps | ✅ Exists | `checkout.tsx` with Stepper |
| Address Form | ✅ Exists | In checkout |
| Payment Method Selection | ✅ Exists | Stripe integration |
| Order Summary | ✅ Exists | `OrderSummaryProps` defined |
| Coupon/Promo Code Input | ⚠️ Partial | Basic implementation |
| Gift Card Application | ❌ Missing | Gift card redemption at checkout |
| Store Credit Application | ❌ Missing | Apply credits at checkout |
| BNPL Option | ❌ Missing | BNPL provider selection |
| Delivery Slot Picker | ❌ Missing | Date/time slot grid |
| Store Pickup Option | ❌ Missing | BOPIS store selector |
| Subscription Checkout | ✅ Exists | Via subscription routes |
| Guest Checkout | ⚠️ Partial | May need enhancement |
| Multi-address Shipping | ❌ Missing | Ship to multiple addresses |
| Tip/Donation Add-on | ❌ Missing | Optional tip at checkout |
| Express Checkout | ❌ Missing | Apple Pay/Google Pay express buttons |

#### Form Patterns
| Pattern | Status | Notes |
|---------|--------|-------|
| Login Form | ✅ Exists | `login.tsx` |
| Registration Form | ✅ Exists | `register.tsx` |
| Address Form | ✅ Exists | In account + checkout |
| Multi-step Form | ✅ Exists | Stepper component |
| File Upload | ❌ Missing | Drag-and-drop file upload |
| Image Upload with Preview | ❌ Missing | Image upload + crop + preview |
| Rich Text Editor | ❌ Missing | WYSIWYG content editor |
| Date/Time Picker | ❌ Missing | Calendar date picker |
| Range Slider | ❌ Missing | Price range / filter slider |
| Autocomplete/Combobox | ❌ Missing | Searchable select with suggestions |
| Phone Number Input | ❌ Missing | International phone input with country code |
| OTP Input | ❌ Missing | One-time password verification |
| Signature Pad | ❌ Missing | Digital signature capture |

#### Interactive Patterns
| Pattern | Status | Notes |
|---------|--------|-------|
| Modal/Dialog | ✅ Exists | `ModalProps` defined |
| Drawer/Slideout | ❌ Missing | Side panel drawer |
| Popover | ❌ Missing | Contextual popup |
| Tooltip | ✅ Exists | `TooltipProps` defined |
| Dropdown Menu | ✅ Exists | `DropdownMenuProps` defined |
| Context Menu | ❌ Missing | Right-click menu |
| Command Menu | ❌ Missing | ⌘K command palette |
| Toast Notifications | ✅ Exists | `ToastNotification` defined |
| Confirmation Dialog | ✅ Exists | `ConfirmDialogProps` defined |
| Infinite Scroll | ❌ Missing | Scroll-triggered loading |
| Virtual List | ❌ Missing | Large list virtualization |
| Drag and Drop | ❌ Missing | Reorderable lists/grids |
| Live Chat Widget | ❌ Missing | Customer support chat |
| Cookie Banner | ❌ Missing | GDPR consent banner |
| Announcement Bar | ❌ Missing | Top-of-page announcements |

#### Marketing Patterns
| Pattern | Status | Notes |
|---------|--------|-------|
| Hero Banner | ✅ Exists | HeroBlockData |
| Promotion Banner | ✅ Exists | PromotionBannerBlockData |
| Newsletter Signup | ✅ Exists | NewsletterBlockData |
| Flash Sale Countdown | ❌ Missing | Countdown timer for deals |
| Loyalty Points Display | ❌ Missing | Points balance widget |
| Referral Share Card | ❌ Missing | Invite-a-friend card |
| Membership Upsell | ❌ Missing | Upgrade prompt |
| Social Proof Popup | ❌ Missing | "X just purchased" notification |
| Exit Intent Popup | ❌ Missing | Leave-page interception |
| Product Recommendations | ❌ Missing | "You might also like" |
| Cross-sell Widget | ❌ Missing | "Frequently bought together" |
| Upsell Widget | ❌ Missing | "Upgrade to" suggestion |

#### Trust & Social Proof Patterns
| Pattern | Status | Notes |
|---------|--------|-------|
| Trust Badges | ✅ Exists | TrustBadgesBlockData |
| Customer Reviews | ✅ Exists | Review components, `src/components/reviews/` |
| Star Rating | ✅ Exists | `RatingProps` defined |
| Review Summary | ⚠️ Partial | Basic review display |
| Review Photos | ❌ Missing | Photo reviews gallery |
| Verified Purchase Badge | ❌ Missing | Verified buyer indicator |
| Review Filters | ❌ Missing | Filter by rating, photos, verified |
| Vendor Trust Score | ❌ Missing | Vendor reliability score display |
| Security Badges | ❌ Missing | SSL, payment security badges |
| Social Media Links | ❌ Missing | Social proof via follower counts |

#### Loading & Error Patterns
| Pattern | Status | Notes |
|---------|--------|-------|
| Skeleton Loading | ✅ Exists | `SkeletonProps` defined |
| Empty State | ✅ Exists | `EmptyStateProps` defined |
| Error Boundary | ⚠️ Partial | Basic error handling |
| 404 Page | ❌ Missing | Custom not-found page |
| 500 Error Page | ❌ Missing | Custom server error page |
| Offline Indicator | ❌ Missing | Network status indicator |
| Progress Bar (Page) | ❌ Missing | Page load progress indicator |
| Retry Button | ❌ Missing | Error retry action |
| Partial Failure | ❌ Missing | Graceful degradation |

### Summary Count

| Category | Patterns in Reference | We Have | Missing | Partial |
|----------|----------------------|---------|---------|---------|
| Navigation | 9 | 2 | 5 | 2 |
| Product Display | 16 | 5 | 10 | 1 |
| Cart & Checkout | 17 | 5 | 10 | 2 |
| Form Patterns | 13 | 4 | 9 | 0 |
| Interactive | 15 | 5 | 10 | 0 |
| Marketing | 12 | 3 | 9 | 0 |
| Trust & Social Proof | 10 | 3 | 6 | 1 |
| Loading & Error | 9 | 2 | 6 | 1 |
| **Total** | **~101** | **~29** | **~65** | **~7** |

---

## 6. Route Gap Summary

| Reference Route | Our Equivalent | Status | Action Needed |
|----------------|---------------|--------|---------------|
| `account/` | `account/` | ✅ Exists | — |
| `auctions/` | — | ❌ Missing | Create `$tenant/$locale/auctions/` with index + `$id` |
| `blog/` | — | ❌ Missing | Create `$tenant/$locale/blog/` with index + `$slug` |
| `bundles/` | — | ❌ Missing | Create `$tenant/$locale/bundles/` with index + `$id` |
| `business/` | `business/` | ✅ Exists | — |
| `campaigns/` | — | ❌ Missing | Create `$tenant/$locale/campaigns/` with index + `$id` |
| `categories/` | — | ❌ Missing | Create `$tenant/$locale/categories/` with index + `$handle` |
| `cms/` | `$slug.tsx`, `$.tsx` | ✅ Exists | CMS catch-all handles this |
| `consignment/` | — | ❌ Missing | Create `$tenant/$locale/consignment/` |
| `events/` | — | ❌ Missing | Create `$tenant/$locale/events/` with index + `$id` |
| `explore/` | — | ❌ Missing | Create `$tenant/$locale/explore/` (discovery/browse page) |
| `help/` | — | ❌ Missing | Create `$tenant/$locale/help/` with index + `$slug` |
| `memberships/` | — | ❌ Missing | Create `$tenant/$locale/memberships/` with index + `$id` |
| `order/` | `order/` | ✅ Exists | — |
| `orders/` | `account/orders/` | ✅ Exists | — |
| `platform/` | — | ❌ Missing | Create `$tenant/$locale/platform/` (tenant admin portal) |
| `poi/` | — | ❌ Missing | Create `$tenant/$locale/poi/` with index + `$id` + map view |
| `preorders/` | — | ❌ Missing | Create `$tenant/$locale/preorders/` |
| `products/` | `products/` | ✅ Exists | — |
| `providers/` | — | ❌ Missing | Create `$tenant/$locale/providers/` (service providers) |
| `rentals/` | — | ❌ Missing | Create `$tenant/$locale/rentals/` with index + `$id` |
| `returns/` | `account/orders/$id.return` | ⚠️ Partial | Add standalone `$tenant/$locale/returns/` |
| `services/` | `bookings/` | ⚠️ Partial | May need separate `services/` browse |
| `subscriptions/` | `subscriptions/` | ✅ Exists | — |
| `track/` | `account/orders/$id.track` | ⚠️ Partial | Add standalone `$tenant/$locale/track/` |
| `trade-in/` | — | ❌ Missing | Create `$tenant/$locale/trade-in/` |
| `try-before-you-buy/` | — | ❌ Missing | Create `$tenant/$locale/try-before-you-buy/` |
| `vendors/` | `vendor/` | ⚠️ Partial | Add public `vendors/` browse (separate from vendor dashboard) |
| `venues/` | — | ❌ Missing | Create `$tenant/$locale/venues/` |
| `verify/` | — | ❌ Missing | Create `$tenant/$locale/verify/` |
| `wishlist/` | — | ❌ Missing | Create `$tenant/$locale/wishlist/` |
| **Standalone Pages** | | | |
| `about.tsx` | — | ❌ Missing | Create `$tenant/$locale/about.tsx` |
| `announcements.tsx` | — | ❌ Missing | Create `$tenant/$locale/announcements.tsx` |
| `compare.tsx` | — | ❌ Missing | Create `$tenant/$locale/compare.tsx` |
| `contact.tsx` | — | ❌ Missing | Create `$tenant/$locale/contact.tsx` |
| `delivery-slots.tsx` | — | ❌ Missing | Create `$tenant/$locale/delivery-slots.tsx` |
| `faq.tsx` | — | ❌ Missing | Create `$tenant/$locale/faq.tsx` |
| `flash-sales.tsx` | — | ❌ Missing | Create `$tenant/$locale/flash-sales.tsx` |
| `gift-cards.tsx` | — | ❌ Missing | Create `$tenant/$locale/gift-cards.tsx` |
| `cart.tsx` | `cart.tsx` | ✅ Exists | — |
| `checkout.tsx` | `checkout.tsx` | ✅ Exists | — |
| `login.tsx` | `login.tsx` | ✅ Exists | — |
| `register.tsx` | `register.tsx` | ✅ Exists | — |

### Route Gap Summary

| Status | Count |
|--------|-------|
| ✅ Exists | 13 |
| ⚠️ Partial | 4 |
| ❌ Missing | 24 |
| **Total Reference Routes** | **41** |

---

## 7. Component Directory Gap Summary

| Reference Directory | Our Equivalent | Status | Components Needed |
|--------------------|---------------|--------|-------------------|
| `account/` | `src/components/account/` | ✅ Exists | — |
| `b2b/` | `src/components/b2b/` | ✅ Exists | — |
| `bookings/` | `src/components/bookings/` | ✅ Exists | — |
| `business/` | `src/components/business/` | ✅ Exists | — |
| `cms/` | `src/components/cms/` | ✅ Exists | — |
| `content/` | — | ❌ Missing | BlogPostCard, BlogPostDetail, BlogSidebar, ArticleCard, ContentSearch, AuthorBio |
| `delivery/` | — | ❌ Missing | DeliverySlotPicker, StorePickupSelector, ExpressDeliveryBadge, DeliveryScheduler, ShippingMethodCard |
| `digital/` | — | ❌ Missing | DigitalProductCard, DownloadManager, LicenseViewer, DownloadLibrary, FilePreview |
| `finance/` | — | ❌ Missing | WalletBalance, TransactionHistory, BNPLSelector, InstallmentPicker, StoreCreditWidget, DisputeForm, RefundTracker |
| `identity/` | — | ❌ Missing | KYCForm, DocumentUpload, VerificationStatus, AgeGate, CredentialCard, VerificationBadge |
| `invoices/` | `src/components/invoices/` | ✅ Exists | — |
| `marketplace/` | `src/components/vendors/` + `src/components/vendor/` | ⚠️ Partial | VendorDiscovery, VendorStorefront, ConsignmentSubmit, TradeInWizard, VendorSearch |
| `navigation/` | `src/components/layout/` | ⚠️ Partial | MegaMenu, CategoryTree, SearchAutocomplete, CommandPalette, StickyAddToCart |
| `payments/` | — | ❌ Missing | PaymentMethodSelector, ExpressCheckoutButtons, PaymentStatusIndicator, SavedPaymentMethods |
| `platform/` | `src/components/cityos/` | ⚠️ Partial | PlatformDashboard, TenantAdmin, FeatureToggle, SystemHealth |
| `promotions/` | — | ❌ Missing | FlashSaleCard, CouponBanner, LoyaltyWidget, ReferralCard, PointsDisplay, DealCountdown, MembershipUpsell |
| `reviews/` | `src/components/reviews/` | ✅ Exists | Review photo gallery, review filters may need addition |
| `subscriptions/` | `src/components/subscriptions/` | ✅ Exists | — |
| `theme/` | Design tokens + runtime packages | ✅ Exists | Handled by packages |
| `ui/` | `src/components/ui/` | ⚠️ Partial | Need: Drawer, Popover, CommandMenu, DatePicker, RangeSlider, FileUpload, InfiniteScroll, Combobox |
| `wishlists/` | — | ❌ Missing | WishlistGrid, WishlistSharePanel, SaveForLater, WishlistCompare |

### Additional Directories We Have (Not in Reference)

| Our Directory | Purpose |
|--------------|---------|
| `src/components/admin/` | Admin components |
| `src/components/auth/` | Authentication forms |
| `src/components/blocks/` | CMS block renderers (25 types) |
| `src/components/cart/` | Cart components |
| `src/components/common/` | Shared utilities |
| `src/components/homepage/` | Homepage sections |
| `src/components/nodes/` | CityOS node hierarchy |
| `src/components/orders/` | Order management |
| `src/components/pages/` | Page templates |
| `src/components/products/` | Product display |
| `src/components/purchase-orders/` | B2B purchase orders |
| `src/components/quotes/` | Quote management |
| `src/components/search/` | Search interface |
| `src/components/store/` | Store components |

### Component Directory Gap Summary

| Status | Count |
|--------|-------|
| ✅ Exists | 10 |
| ⚠️ Partial | 4 |
| ❌ Missing | 7 |
| **Total Reference Directories** | **21** |

---

## Appendix A: Implementation Priority Roadmap

### Phase 1 — P0 Critical (Weeks 1–4)
1. **Model 3: Marketplace** — Add `/vendors` browse route, vendor storefront page
2. **Model 4: B2B** — Complete bulk ordering, RFQ workflow UI
3. **Model 19: Membership/VIP** — Add `/memberships/` route and tier comparison UI
4. **Model 26: Events & Ticketing** — Add `/events/` route with ticket purchasing
5. **Model 47: Delivery Slots** — Add delivery slot picker to checkout
6. **Model 49: Returns & Exchanges** — Add standalone `/returns/` route with exchange selector

### Phase 2 — P1 High (Weeks 5–10)
7. **Model 9: Rental/Leasing** — Add `/rentals/` route with calendar UI
8. **Model 10: Recommerce/Trade-In** — Add `/trade-in/` route
9. **Model 14: Flash Sales** — Add `/flash-sales/` with countdown UI
10. **Model 16: Bundling** — Add `/bundles/` with configurator
11. **Model 18: Crowdfunding** — Add `/campaigns/` with progress UI
12. **Model 23: Auctions** — Add `/auctions/` with real-time bidding UI
13. **Model 25: Digital Products** — Add download library to account
14. **Model 27: Gift Cards** — Add `/gift-cards/` purchase/redeem
15. **Model 29: Loyalty** — Add loyalty dashboard, points display
16. **Model 36: Invoicing** — Complete invoice management in account
17. **Model 43: Consent** — Add cookie banner, consent management
18. **Model 48: Real-Time Tracking** — Add live tracking map
19. **Model 50: Blog** — Add `/blog/` with post list/detail
20. **Model 51: FAQ/Help** — Add `/help/` and `/faq/` routes

### Phase 3 — P2 Medium (Weeks 11–16)
21–33. Remaining models: Social Commerce storefront, Freemium gating, POI browsing, Digital Identity UI, Wallet, BNPL, Try-Before-You-Buy, Consignment, Platform admin, etc.

### Phase 4 — P3 Low (Weeks 17+)
34–39. Print-on-Demand, Age Verification, and remaining edge cases.

---

## Appendix B: Effort Estimation Key

| Size | Scope | Time Estimate |
|------|-------|---------------|
| **S** (Small) | 1–2 components, config change, or minor route | 1–2 days |
| **M** (Medium) | 3–5 components, new route with CRUD | 3–5 days |
| **L** (Large) | New module + routes + 5–10 components | 1–2 weeks |
| **XL** (Extra Large) | New module + complex UI (designer, real-time) | 2–4 weeks |
