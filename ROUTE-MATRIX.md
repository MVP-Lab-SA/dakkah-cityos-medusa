# Dakkah CityOS Commerce Platform — Complete Route Matrix

> Generated: 2026-02-15
> Base URL pattern: `/{tenant}/{locale}/...` (e.g. `/dakkah/en/...`)
> Storefront convention: `/$` = index route, `/$slug` = dynamic segment (TanStack Router)

---

## Summary Statistics

| Metric | Count |
|---|---|
| Total Storefront Route Files | 340 |
| Total Backend API Endpoints | 454 |
| — Admin Endpoints | 207 |
| — Store Endpoints | 163 |
| — Other Endpoints (vendor, platform, webhook) | 84 |
| Verticals Tracked | 48 |
| Account Route Files | 30 |
| Vendor Route Files | 76 |
| Manage Route Files | 98 |
| Redirect Routes | 11 |
| Verticals Fully Complete | 29 (22 strict + 7 naming-only) |
| Verticals with Gaps | 19 |

---

## Table of Contents

- [A. Core Platform Routes](#a-core-platform-routes)
- [B. Auth & Utility Routes](#b-auth--utility-routes)
- [C. Account Routes Matrix](#c-account-routes-matrix)
- [D. Vertical Route Matrix (48 Verticals)](#d-vertical-route-matrix-48-verticals)
- [E. Vendor Dashboard Routes](#e-vendor-dashboard-routes)
- [F. Manage / Admin Routes](#f-manage--admin-routes)
- [G. B2B / Business Routes](#g-b2b--business-routes)
- [H. Redirect-Only Routes](#h-redirect-only-routes)
- [I. Complete Gap Analysis Summary](#i-complete-gap-analysis-summary)
- [J. Summary Statistics (Detailed)](#j-summary-statistics-detailed)

---

## A. Core Platform Routes

Public storefront pages accessible to all users without login.

| Route | Description | Linked From |
|---|---|---|
| `/` | Homepage / tenant landing (`/$` index route) | Header logo |
| `/{slug}` | Dynamic CMS page (privacy, terms, about, etc.) | CMS navigation |
| `/cart` | Shopping cart | Header cart icon |
| `/checkout` | Checkout flow | Cart page |
| `/compare` | Product comparison | Product cards |
| `/wishlist` | Public wishlist | Header / product cards |
| `/marketplace` | Public marketplace browsing | Navigation |
| `/products/{handle}` | Product detail page | Product cards / search |
| `/categories/{handle}` | Category listing | Header mega-menu |
| `/vendors/` | Vendor directory | Navigation |
| `/vendors/{handle}` | Vendor public profile | Vendor directory |
| `/vendors/{id}` | Vendor profile by ID | — |
| `/order/{orderId}/confirmed` | Order confirmation page | Checkout flow |
| `/returns` | Returns page | Order detail / footer |
| `/store-pickup` | Store pickup page | Checkout / order flow |
| `/track` | Order tracking | Order detail / footer |
| `/blog/` | Blog listing | Footer |
| `/blog/{slug}` | Blog post detail | Blog listing |
| `/help/` | Help center | Footer |
| `/help/{slug}` | Help article | Help center |
| `/wallet/` | Wallet page | Product cards |
| `/flash-sales` | Flash sales listing | Navigation |
| `/gift-cards` | Gift cards listing | Navigation |

---

## B. Auth & Utility Routes

| Route | Description | Auth Required |
|---|---|---|
| `/login` | Login page | No |
| `/register` | Registration page | No |
| `/reset-password` | Password reset | No |
| `/verify/age` | Age verification | No |
| `/health` (root, outside tenant/locale) | Health check endpoint | No |

---

## C. Account Routes Matrix

All account pages require customer authentication and use `AccountLayout` with sidebar navigation.
**Total: 30 route files, 22 sidebar items across 5 sections.**

### Sidebar Navigation

**Main (4 items):**

| Route | Label | In Sidebar |
|---|---|---|
| `/account/` | Overview | YES |
| `/account/orders` | Orders | YES |
| `/account/addresses` | Addresses | YES |
| `/account/profile` | Profile | YES |

**Payments & Billing (5 items):**

| Route | Label | In Sidebar |
|---|---|---|
| `/account/payment-methods` | Payment Methods | YES |
| `/account/wallet` | Wallet | YES |
| `/account/store-credits` | Store Credits | YES |
| `/account/invoices` | Invoices | YES |
| `/account/installments` | Installments | YES |

**Shopping (5 items):**

| Route | Label | In Sidebar |
|---|---|---|
| `/account/subscriptions` | Subscriptions | YES |
| `/account/bookings` | Bookings | YES |
| `/account/wishlist` | Wishlist | YES |
| `/account/downloads` | Downloads | YES |
| `/account/purchase-orders` | Purchase Orders | YES |

**Engagement (4 items):**

| Route | Label | In Sidebar |
|---|---|---|
| `/account/reviews` | Reviews | YES |
| `/account/loyalty` | Loyalty | YES |
| `/account/referrals` | Referrals | YES |
| `/account/quotes` | Quotes | YES |

**Account (4 items):**

| Route | Label | In Sidebar |
|---|---|---|
| `/account/settings` | Settings | YES |
| `/account/consents` | Consents | YES |
| `/account/disputes` | Disputes | YES |
| `/account/verification` | Verification | YES |

### Account Sub-routes (accessible from parent pages)

| Route | Description | Linked From |
|---|---|---|
| `/account/orders/{id}` | Order detail | Orders list |
| `/account/orders/{id}/return` | Order return | Order detail |
| `/account/orders/{id}/track` | Order tracking | Order detail |
| `/account/subscriptions/{id}` | Subscription detail | Subscriptions list |
| `/account/subscriptions/{id}/billing` | Subscription billing | Subscription detail |
| `/account/bookings/{id}` | Booking detail | Bookings list |
| `/account/purchase-orders/{id}` | PO detail | PO list |
| `/account/purchase-orders/new` | Create new PO | PO list |

---

## D. Vertical Route Matrix (48 Verticals)

The complete cross-reference of all 48 verticals across public storefront, store API, admin API, vendor dashboard, and manage dashboard.

**Legend:**
- **YES** = Route/endpoint exists and is verified
- **NO** = Expected but missing (gap)
- **—** = Not applicable for this vertical

| # | Vertical | Public Listing | Public Detail | Store EP (List) | Store EP (Detail) | Admin EP (List) | Admin EP (Detail) | Vendor Page | Manage Page | In Vendor Nav | In Manage Nav | Gaps/Issues |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Affiliate | YES `/affiliate/` | YES `/affiliate/{id}` | YES `/store/affiliate` | YES `/store/affiliate/[id]` | YES `/admin/affiliates` | YES `/admin/affiliates/[id]` | YES `/vendor/affiliate` | YES `/manage/affiliates` | YES | YES | Complete |
| 2 | Auctions | YES `/auctions/` | YES `/auctions/{id}` | YES `/store/auctions` | YES `/store/auctions/[id]` | YES `/admin/auctions` | YES `/admin/auctions/[id]` | YES `/vendor/auctions` | YES `/manage/auctions` | YES | YES | Complete |
| 3 | Automotive | YES `/automotive/` | YES `/automotive/{id}` | YES `/store/automotive` | YES `/store/automotive/[id]` | YES `/admin/automotive` | YES `/admin/automotive/[id]` | YES `/vendor/automotive` | YES `/manage/automotive` | YES | YES | Complete |
| 4 | B2B | YES `/b2b/` | YES `/b2b/{id}` | YES `/store/b2b` | YES `/store/b2b/[id]` | NO | NO | YES `/vendor/b2b` | NO | YES | NO | Missing admin EP, missing manage page |
| 5 | Bookings | YES `/bookings/` | YES `/bookings/{id}` | YES `/store/bookings` | YES `/store/bookings/[id]` | YES `/admin/bookings` | YES `/admin/bookings/[id]` | YES `/vendor/bookings` | YES `/manage/bookings` | YES | YES | Complete. Store has sub-routes: services, availability, cancel, confirm, reschedule, check-in |
| 6 | Bundles | YES `/bundles/` | YES `/bundles/{id}` | YES `/store/bundles` | YES `/store/bundles/[id]` | NO | NO | YES `/vendor/bundles` | YES `/manage/bundles` | YES | YES | Missing admin endpoints |
| 7 | Campaigns/Crowdfunding | YES `/campaigns/` | YES `/campaigns/{id}` | YES `/store/crowdfunding` | YES `/store/crowdfunding/[id]` | YES `/admin/crowdfunding` | YES `/admin/crowdfunding/[id]` | YES `/vendor/crowdfunding` | YES `/manage/crowdfunding` | YES | YES | Name mismatch: public=campaigns, backend=crowdfunding |
| 8 | Charity | YES `/charity/` | YES `/charity/{id}` | YES `/store/charity` | YES `/store/charity/[id]` | YES `/admin/charity` (list only) + `/admin/charities` | YES `/admin/charities/[id]` | YES `/vendor/charity` | YES `/manage/charity` | YES | YES | Dual admin endpoints (charity + charities) |
| 9 | Classifieds | YES `/classifieds/` | YES `/classifieds/{id}` | YES `/store/classifieds` | YES `/store/classifieds/[id]` | YES `/admin/classifieds` | YES `/admin/classifieds/[id]` | YES `/vendor/classified` | YES `/manage/classifieds` | YES | YES | Vendor uses singular path (`classified`) |
| 10 | Consignment | YES `/consignment/` | YES `/consignment/{id}` | YES `/store/consignments` | YES `/store/consignments/[id]` | NO | NO | YES `/vendor/consignments` | YES `/manage/consignments` | YES | YES | Missing admin endpoints |
| 11 | Credit | YES `/credit/` | YES `/credit/{id}` | YES `/store/credit` | YES `/store/credit/[id]` | NO | NO | YES `/vendor/credit` | YES `/manage/credit` | YES | YES | Missing admin endpoints |
| 12 | Digital Products | YES `/digital/` | YES `/digital/{id}` | YES `/store/digital-products` | YES `/store/digital-products/[id]` | YES `/admin/digital-products` | YES `/admin/digital-products/[id]` | YES `/vendor/digital-products` | YES `/manage/digital-products` | YES | YES | Complete. Public slug=digital, backend=digital-products |
| 13 | Dropshipping | YES `/dropshipping/` | YES `/dropshipping/{id}` | YES `/store/dropshipping` | YES `/store/dropshipping/[id]` | NO | NO | YES `/vendor/dropshipping` | YES `/manage/dropshipping` | YES | YES | Missing admin endpoints |
| 14 | Education | YES `/education/` | YES `/education/{id}` | YES `/store/education` | YES `/store/education/[id]` | YES `/admin/education` | YES `/admin/education/[id]` | YES `/vendor/education` | YES `/manage/education` | YES | YES | Complete |
| 15 | Events | YES `/events/` | YES `/events/{id}` | YES `/store/events` | YES `/store/events/[id]` | YES `/admin/events` | YES `/admin/events/[id]` | YES `/vendor/events` | YES `/manage/events` | YES | YES | Complete |
| 16 | Event Ticketing | NO | NO | YES `/store/event-ticketing` | NO | YES `/admin/event-ticketing` | YES `/admin/event-ticketing/[id]` | YES `/vendor/event-ticketing` | YES `/manage/event-ticketing` | YES | YES | Missing public page, missing store detail EP |
| 17 | Financial Products | YES `/financial/` | YES `/financial/{id}` | YES `/store/financial-products` | YES `/store/financial-products/[id]` | YES `/admin/financial-products` | YES `/admin/financial-products/[id]` | YES `/vendor/financial-product` | YES `/manage/financial-products` | YES | YES | Vendor uses singular path (`financial-product`) |
| 18 | Fitness | YES `/fitness/` | YES `/fitness/{id}` | YES `/store/fitness` | YES `/store/fitness/[id]` | YES `/admin/fitness` | YES `/admin/fitness/[id]` | YES `/vendor/fitness` | YES `/manage/fitness` | YES | YES | Complete |
| 19 | Flash Deals | YES `/flash-deals/` | YES `/flash-deals/{id}` | YES `/store/flash-sales` | YES `/store/flash-sales/[id]` | NO | NO | NO | NO | NO | NO | Name mismatch (public=flash-deals, backend=flash-sales). Missing admin, vendor, manage |
| 20 | Flash Sales | YES `/flash-sales/` | NO | YES `/store/flash-sales` | YES `/store/flash-sales/[id]` | NO | NO | YES `/vendor/flash-sales` | YES `/manage/flash-sales` | YES | YES | Missing admin EP, no public detail page |
| 21 | Freelance | YES `/freelance/` | YES `/freelance/{id}` | YES `/store/freelance` | YES `/store/freelance/[id]` | YES `/admin/freelance` | YES `/admin/freelance/[id]` | YES `/vendor/freelance` | YES `/manage/freelance` | YES | YES | Complete |
| 22 | Gift Cards | YES `/gift-cards/` | NO | YES `/store/gift-cards` | YES `/store/gift-cards/[id]` | NO | NO | YES `/vendor/gift-cards` | YES `/manage/gift-cards` | YES | YES | Missing admin EP, no public detail page |
| 23 | Gift Cards Shop | YES `/gift-cards-shop/` | YES `/gift-cards-shop/{id}` | YES `/store/gift-cards` | YES `/store/gift-cards/[id]` | — | — | — | — | — | — | Shares backend with Gift Cards. No dedicated admin/vendor/manage |
| 24 | Government | YES `/government/` | YES `/government/{id}` | YES `/store/government` | YES `/store/government/[id]` | YES `/admin/government` | YES `/admin/government/[id]` | YES `/vendor/government` | YES `/manage/government` | YES | YES | Complete |
| 25 | Grocery | YES `/grocery/` | YES `/grocery/{id}` | YES `/store/grocery` | YES `/store/grocery/[id]` | YES `/admin/grocery` | YES `/admin/grocery/[id]` | YES `/vendor/grocery` | YES `/manage/grocery` | YES | YES | Complete |
| 26 | Healthcare | YES `/healthcare/` | YES `/healthcare/{id}` | YES `/store/healthcare` | YES `/store/healthcare/[id]` | YES `/admin/healthcare` | YES `/admin/healthcare/[id]` | YES `/vendor/healthcare` | YES `/manage/healthcare` | YES | YES | Complete |
| 27 | Insurance | YES `/insurance/` | YES `/insurance/{id}` | YES `/store/insurance` | YES `/store/insurance/[id]` | NO | NO | YES `/vendor/insurance` | YES `/manage/insurance` | YES | YES | Missing admin endpoints |
| 28 | Legal Services | YES `/legal/` | YES `/legal/{id}` | YES `/store/legal` | YES `/store/legal/[id]` | YES `/admin/legal` | YES `/admin/legal/[id]` | YES `/vendor/legal` | YES `/manage/legal` | YES | YES | Complete |
| 29 | Loyalty Program | YES `/loyalty-program/` | YES `/loyalty-program/{id}` | YES `/store/loyalty` | YES `/store/loyalty/[id]` | YES `/admin/loyalty` | YES `/admin/loyalty/programs/[id]` | YES `/vendor/loyalty` | YES `/manage/loyalty` | YES | YES | Admin uses sub-routes (accounts, programs) |
| 30 | Memberships | YES `/memberships/` | YES `/memberships/{id}` | YES `/store/memberships` | YES `/store/memberships/[id]` | YES `/admin/memberships` | YES `/admin/memberships/[id]` | YES `/vendor/memberships` | YES `/manage/memberships` | YES | YES | Complete |
| 31 | Newsletter | YES `/newsletter/` | YES `/newsletter/{id}` | YES `/store/newsletter` | YES `/store/newsletter/[id]` | NO | NO | YES `/vendor/newsletter` | YES `/manage/newsletters` | YES | YES | Missing admin endpoints. Singular/plural variation (store=newsletter, manage=newsletters) |
| 32 | Parking | YES `/parking/` | YES `/parking/{id}` | YES `/store/parking` | YES `/store/parking/[id]` | YES `/admin/parking` | YES `/admin/parking/[id]` | YES `/vendor/parking` | YES `/manage/parking` | YES | YES | Complete |
| 33 | Pet Services | YES `/pet-services/` | YES `/pet-services/{id}` | YES `/store/pet-services` | YES `/store/pet-services/[id]` | YES `/admin/pet-services` | YES `/admin/pet-services/[id]` | YES `/vendor/pet-service` | YES `/manage/pet-services` | YES | YES | Vendor uses singular path (`pet-service`) |
| 34 | Places/POI | YES `/places/` | YES `/places/{id}` | YES `/store/content/pois` | YES `/store/content/pois/[id]` | — | — | — | — | — | — | Content-driven vertical. No admin/vendor/manage |
| 35 | Print on Demand | YES `/print-on-demand/` | YES `/print-on-demand/{id}` | YES `/store/print-on-demand` | YES `/store/print-on-demand/[id]` | NO | NO | YES `/vendor/print-on-demand` | YES `/manage/print-on-demand` | YES | YES | Missing admin endpoints |
| 36 | Quotes | YES `/quotes/` | YES `/quotes/{id}` | YES `/store/quotes` | YES `/store/quotes/[id]` | YES `/admin/quotes` | YES `/admin/quotes/[id]` | YES `/vendor/quotes` | YES `/manage/quotes` | YES | YES | Complete. Store has accept/decline. Admin has approve/reject/convert/expiring. Extra: `/quotes/request` |
| 37 | Real Estate | YES `/real-estate/` | YES `/real-estate/{id}` | YES `/store/real-estate` | YES `/store/real-estate/[id]` | YES `/admin/real-estate` | YES `/admin/real-estate/[id]` | YES `/vendor/real-estate` | YES `/manage/real-estate` | YES | YES | Complete |
| 38 | Rentals | YES `/rentals/` | YES `/rentals/{id}` | YES `/store/rentals` | YES `/store/rentals/[id]` | YES `/admin/rentals` | YES `/admin/rentals/[id]` | YES `/vendor/rentals` | YES `/manage/rentals` | YES | YES | Complete |
| 39 | Restaurants | YES `/restaurants/` | YES `/restaurants/{id}` | YES `/store/restaurants` | YES `/store/restaurants/[id]` | YES `/admin/restaurants` | YES `/admin/restaurants/[id]` | YES `/vendor/restaurants` | YES `/manage/restaurants` | YES | YES | Complete |
| 40 | Social Commerce | YES `/social-commerce/` | YES `/social-commerce/{id}` | YES `/store/social-commerce` | YES `/store/social-commerce/[id]` | YES `/admin/social-commerce` | YES `/admin/social-commerce/[id]` | YES `/vendor/social-commerce` | YES `/manage/social-commerce` | YES | YES | Complete |
| 41 | Subscriptions | YES `/subscriptions/` | YES `/subscriptions/{id}` | YES `/store/subscriptions` | YES `/store/subscriptions/[id]` | YES `/admin/subscriptions` | YES `/admin/subscriptions/[id]` | YES `/vendor/subscriptions` | YES `/manage/subscriptions` | YES | YES | Complete. Extra public: /checkout, /success. Store: cancel, pause, resume, change-plan, billing-history. Admin: discounts, change-plan, pause, resume |
| 42 | Trade-in | YES `/trade-in/` | YES `/trade-in/{id}` | YES `/store/trade-in` + `/store/trade-ins` | YES `/store/trade-ins/[id]` | NO | NO | YES `/vendor/trade-in` | YES `/manage/trade-in` | YES | YES | Missing admin EP. Backend has both `/store/trade-in` (list only) and `/store/trade-ins` (list+detail) |
| 43 | Travel | YES `/travel/` | YES `/travel/{id}` | YES `/store/travel` | YES `/store/travel/[id]` | YES `/admin/travel` | YES `/admin/travel/[id]` | YES `/vendor/travel` | YES `/manage/travel` | YES | YES | Complete |
| 44 | Try Before You Buy | YES `/try-before-you-buy/` | YES `/try-before-you-buy/{id}` | YES `/store/try-before-you-buy` | YES `/store/try-before-you-buy/[id]` | NO | NO | YES `/vendor/try-before-you-buy` | YES `/manage/try-before-you-buy` | YES | YES | Missing admin endpoints |
| 45 | Volume Deals | YES `/volume-deals/` | YES `/volume-deals/{id}` | YES `/store/volume-deals` | YES `/store/volume-deals/[id]` | NO | NO | NO | NO | NO | NO | Missing admin, vendor, manage |
| 46 | Volume Pricing | NO | NO | YES `/store/volume-pricing` | YES `/store/volume-pricing/[id]` | YES `/admin/volume-pricing` | YES `/admin/volume-pricing/[id]` | YES `/vendor/volume-pricing` | YES `/manage/volume-pricing` | YES | YES | No public page (manage/vendor only) |
| 47 | Warranties | YES `/warranties/` | YES `/warranties/{id}` | YES `/store/warranties` | YES `/store/warranties/[id]` | YES `/admin/warranties` | YES `/admin/warranties/[id]` | YES `/vendor/warranty` | YES `/manage/warranties` | YES | YES | Vendor uses singular path (`warranty`) |
| 48 | White Label | YES `/white-label/` | YES `/white-label/{id}` | YES `/store/white-label` | YES `/store/white-label/[id]` | NO | NO | YES `/vendor/white-label` | YES `/manage/white-label` | YES | YES | Missing admin endpoints |

### Additional Vertical Sub-routes

| Route | Description |
|---|---|
| `/quotes/request` | Request a quote form |
| `/subscriptions/checkout` | Subscription checkout flow |
| `/subscriptions/success` | Subscription success page |

### Bookings Architecture (Complex Sub-routes)

| Route | Description | Backend Endpoint |
|---|---|---|
| `/bookings/` | Lists available bookable services | `/store/bookings/services` |
| `/bookings/{id}` | Booking record detail | `/store/bookings/[id]` |
| `/bookings/{serviceHandle}` | Service booking flow (calendar/slot picker) | `/store/bookings/services/[serviceId]/providers` |
| `/bookings/confirmation` | Booking confirmation page | — |

Store sub-routes: `/store/bookings/services`, `/store/bookings/availability`, `/store/bookings/[id]/cancel`, `/store/bookings/[id]/confirm`, `/store/bookings/[id]/reschedule`, `/store/bookings/[id]/check-in`

---

## E. Vendor Dashboard Routes

Vendor pages require vendor authentication. Uses `VendorLayout` with 7 collapsible sidebar sections.
**Total: 76 route files, 67 sidebar items.**

### Vendor Sidebar Navigation

**Main (7 items):**

| Route | Label | In Sidebar |
|---|---|---|
| `/vendor/` | Dashboard | YES |
| `/vendor/analytics` | Analytics | YES |
| `/vendor/reviews` | Reviews | YES |
| `/vendor/commissions` | Commissions | YES |
| `/vendor/transactions` | Transactions | YES |
| `/vendor/invoices` | Invoices | YES |
| `/vendor/wallet` | Wallet | YES |

**Products & Inventory (6 items):**

| Route | Label | In Sidebar |
|---|---|---|
| `/vendor/products` | Products | YES |
| `/vendor/bundles` | Bundles | YES |
| `/vendor/digital-products` | Digital Products | YES |
| `/vendor/inventory` | Inventory | YES |
| `/vendor/inventory-extension` | Inventory Extension | YES |
| `/vendor/print-on-demand` | Print on Demand | YES |

**Orders & Fulfillment (6 items):**

| Route | Label | In Sidebar |
|---|---|---|
| `/vendor/orders` | Orders | YES |
| `/vendor/payouts` | Payouts | YES |
| `/vendor/shipping-extension` | Shipping Extension | YES |
| `/vendor/shipping-rules` | Shipping Rules | YES |
| `/vendor/cart-extension` | Cart Extension | YES |
| `/vendor/cart-rules` | Cart Rules | YES |

**Services & Verticals (18 items):**

| Route | Label | In Sidebar |
|---|---|---|
| `/vendor/bookings` | Bookings | YES |
| `/vendor/events` | Events | YES |
| `/vendor/event-ticketing` | Event Ticketing | YES |
| `/vendor/auctions` | Auctions | YES |
| `/vendor/rentals` | Rentals | YES |
| `/vendor/restaurants` | Restaurants | YES |
| `/vendor/freelance` | Freelance | YES |
| `/vendor/fitness` | Fitness | YES |
| `/vendor/healthcare` | Healthcare | YES |
| `/vendor/education` | Education | YES |
| `/vendor/automotive` | Automotive | YES |
| `/vendor/real-estate` | Real Estate | YES |
| `/vendor/pet-service` | Pet Service | YES |
| `/vendor/parking` | Parking | YES |
| `/vendor/travel` | Travel | YES |
| `/vendor/insurance` | Insurance | YES |
| `/vendor/government` | Government | YES |
| `/vendor/grocery` | Grocery | YES |

**Marketing (6 items):**

| Route | Label | In Sidebar |
|---|---|---|
| `/vendor/advertising` | Advertising | YES |
| `/vendor/affiliate` | Affiliate | YES |
| `/vendor/social-commerce` | Social Commerce | YES |
| `/vendor/flash-sales` | Flash Sales | YES |
| `/vendor/crowdfunding` | Crowdfunding | YES |
| `/vendor/charity` | Charity | YES |

**Finance (8 items):**

| Route | Label | In Sidebar |
|---|---|---|
| `/vendor/credit` | Credit | YES |
| `/vendor/financial-product` | Financial Product | YES |
| `/vendor/volume-pricing` | Volume Pricing | YES |
| `/vendor/subscriptions` | Subscriptions | YES |
| `/vendor/loyalty` | Loyalty | YES |
| `/vendor/memberships` | Memberships | YES |
| `/vendor/gift-cards` | Gift Cards | YES |
| `/vendor/tax-config` | Tax Config | YES |

**Other (14 items):**

| Route | Label | In Sidebar |
|---|---|---|
| `/vendor/b2b` | B2B | YES |
| `/vendor/classified` | Classified | YES |
| `/vendor/consignments` | Consignments | YES |
| `/vendor/dropshipping` | Dropshipping | YES |
| `/vendor/trade-in` | Trade-in | YES |
| `/vendor/try-before-you-buy` | Try Before You Buy | YES |
| `/vendor/warranty` | Warranty | YES |
| `/vendor/white-label` | White Label | YES |
| `/vendor/wishlists` | Wishlists | YES |
| `/vendor/newsletter` | Newsletter | YES |
| `/vendor/notification-preferences` | Notification Preferences | YES |
| `/vendor/disputes` | Disputes | YES |
| `/vendor/legal` | Legal | YES |
| `/vendor/quotes` | Quotes | YES |

### Special Vendor Routes (not in sidebar)

| Route | Description | Accessible From |
|---|---|---|
| `/vendor/register` | Vendor registration | Login / public pages |
| `/vendor/onboarding/` | Onboarding flow | Post-registration |
| `/vendor/onboarding/verification` | Verification step | Onboarding |
| `/vendor/onboarding/complete` | Onboarding complete | Onboarding |
| `/vendor/home` | Vendor home (orphan) | — |

### Vendor Sub-routes

| Route | Description | Linked From |
|---|---|---|
| `/vendor/products/{productId}` | Product detail/edit | Product list |
| `/vendor/products/new` | New product | Product list |
| `/vendor/orders/{orderId}` | Order detail | Order list |
| `/vendor/orders/{orderId}/fulfill` | Fulfill order | Order detail |
| `/vendor/payouts/request` | Request payout | Payouts page |

---

## F. Manage / Admin Routes

All manage pages require RBAC role-based access. Uses `ManageLayout` with a sidebar powered by a module registry containing 120+ modules across 9 sections.
**Total: 98 route files.**

### Manage Sidebar Sections & Modules

**Overview (1 module):**

| Module | Route | Min Role Weight |
|---|---|---|
| Dashboard | `/manage/` | 40 |

**Commerce (17 modules):**

| Module | Route | Min Role Weight |
|---|---|---|
| Products | `/manage/products` | 40 |
| Orders | `/manage/orders` | 40 |
| Customers | `/manage/customers` | 40 |
| Quotes | `/manage/quotes` | 40 |
| Invoices | `/manage/invoices` | 40 |
| Subscriptions | `/manage/subscriptions` | 40 |
| Reviews | `/manage/reviews` | 40 |
| Disputes | `/manage/disputes` | 40 |
| Inventory | `/manage/inventory` | 40 |
| Shipping | `/manage/shipping-extensions` | 40 |
| Cart Extensions | `/manage/cart-extensions` | 40 |
| Purchase Orders | `/manage/purchase-orders` | 40 |
| Subscription Plans | `/manage/subscription-plans` | 40 |
| Payment Terms | `/manage/payment-terms` | 40 |
| Service Providers | `/manage/service-providers` | 40 |
| Inventory Extension | `/manage/inventory-extension` | 40 |
| Pricing Tiers | `/manage/pricing-tiers` | 40 |

**Marketplace (5 modules):**

| Module | Route | Min Role Weight |
|---|---|---|
| Vendors | `/manage/vendors` | 40 |
| Commissions | `/manage/commissions` | 40 |
| Payouts | `/manage/payouts` | 40 |
| Affiliates | `/manage/affiliates` | 40 |
| Commission Rules | `/manage/commission-rules` | 40 |

**Verticals (38 modules):**

| Module | Route | Min Role Weight |
|---|---|---|
| Auctions | `/manage/auctions` | 40 |
| Bookings | `/manage/bookings` | 40 |
| Event Ticketing | `/manage/event-ticketing` | 40 |
| Rentals | `/manage/rentals` | 40 |
| Restaurants | `/manage/restaurants` | 40 |
| Grocery | `/manage/grocery` | 40 |
| Travel | `/manage/travel` | 40 |
| Automotive | `/manage/automotive` | 40 |
| Real Estate | `/manage/real-estate` | 40 |
| Healthcare | `/manage/healthcare` | 40 |
| Education | `/manage/education` | 40 |
| Fitness | `/manage/fitness` | 40 |
| Pet Services | `/manage/pet-services` | 40 |
| Digital Products | `/manage/digital-products` | 40 |
| Memberships | `/manage/memberships` | 40 |
| Financial Products | `/manage/financial-products` | 40 |
| Freelance | `/manage/freelance` | 40 |
| Parking | `/manage/parking` | 40 |
| Insurance | `/manage/insurance` | 40 |
| Government | `/manage/government` | 40 |
| Trade-in | `/manage/trade-in` | 40 |
| Try Before You Buy | `/manage/try-before-you-buy` | 40 |
| White Label | `/manage/white-label` | 40 |
| Volume Pricing | `/manage/volume-pricing` | 40 |
| Gift Cards | `/manage/gift-cards` | 40 |
| Warranties | `/manage/warranties` | 40 |
| Flash Sales | `/manage/flash-sales` | 40 |
| Consignments | `/manage/consignments` | 40 |
| Credit | `/manage/credit` | 40 |
| Dropshipping | `/manage/dropshipping` | 40 |
| Loyalty | `/manage/loyalty` | 40 |
| Bundles | `/manage/bundles` | 40 |
| Wallet | `/manage/wallet` | 40 |
| Wishlists | `/manage/wishlists` | 40 |
| Events | `/manage/events` | 40 |
| Availability | `/manage/availability` | 40 |
| Print on Demand | `/manage/print-on-demand` | 40 |
| Social Commerce | `/manage/social-commerce` | 40 |

**Marketing (8 modules):**

| Module | Route | Min Role Weight |
|---|---|---|
| Advertising | `/manage/advertising` | 40 |
| Promotions | `/manage/promotions` | 40 |
| Classifieds | `/manage/classifieds` | 40 |
| Crowdfunding | `/manage/crowdfunding` | 40 |
| Charity | `/manage/charity` | 40 |
| Newsletters | `/manage/newsletters` | 40 |
| Promotion Extensions | `/manage/promotion-extensions` | 40 |
| Social Commerce | `/manage/social-commerce` | 40 |

**Content (CMS) (4 modules):**

| Module | Route | Min Role Weight |
|---|---|---|
| CMS Pages | `/manage/cms` | 30 |
| CMS Content | `/manage/cms-content` | 30 |
| Media Library | `/manage/media` | 30 |
| Navigation | `/manage/navigation` | 30 |

**Organization (6 modules):**

| Module | Route | Min Role Weight |
|---|---|---|
| Team | `/manage/team` | 40 |
| Companies | `/manage/companies` | 40 |
| Stores | `/manage/stores` | 40 |
| Legal | `/manage/legal` | 40 |
| Utilities | `/manage/utilities` | 40 |
| Companies Admin | `/manage/companies-admin` | 40 |

**Platform (Super Admin) (11 modules):**

| Module | Route | Min Role Weight |
|---|---|---|
| Tenants Admin | `/manage/tenants-admin` | 90 |
| Governance | `/manage/governance` | 90 |
| Region Zones | `/manage/region-zones` | 90 |
| Webhooks | `/manage/webhooks` | 90 |
| Integrations | `/manage/integrations` | 90 |
| Temporal | `/manage/temporal` | 90 |
| Audit | `/manage/audit` | 90 |
| Nodes | `/manage/nodes` | 90 |
| Personas | `/manage/personas` | 90 |
| Channels | `/manage/channels` | 90 |
| i18n | `/manage/i18n` | 90 |

**System (5 modules):**

| Module | Route | Min Role Weight |
|---|---|---|
| Analytics | `/manage/analytics` | 40 |
| Settings | `/manage/settings` | 40 |
| Metrics | `/manage/metrics` | 40 |
| Notification Preferences | `/manage/notification-preferences` | 40 |
| Tax Config | `/manage/tax-config` | 40 |

### Manage Route Files NOT in Module Registry (intentional duplicates)

| Route File | Description | Reason |
|---|---|---|
| `/manage/charities` | Charities | Duplicate of `charity` module |
| `/manage/promotions-ext` | Promotions Extended | Duplicate of `promotion-extensions` module |
| `/manage/warranty` | Warranty (singular) | Duplicate of `warranties` module |
| `/manage/company` | Single company view | Detail view, not a sidebar module |

---

## G. B2B / Business Routes

These pages require B2B authentication. The `/business` route redirects to `/b2b/dashboard`.

| Route | Description | Auth Required | Accessible From |
|---|---|---|---|
| `/b2b/` | B2B marketplace listing | No (public) | Navigation |
| `/b2b/{id}` | B2B product detail | No (public) | B2B listing |
| `/b2b/dashboard` | B2B dashboard | Yes (B2B) | Account sidebar, user menu |
| `/b2b/register` | B2B registration | No | Public pages |
| `/business/` | Redirect → `/b2b/dashboard` | — | — |
| `/business/orders` | Business orders | Yes (B2B) | B2B dashboard |
| `/business/catalog` | Business catalog | Yes (B2B) | Account sidebar (B2B) |
| `/business/approvals` | Business approvals | Yes (B2B) | B2B dashboard |
| `/business/team` | Business team | Yes (B2B) | B2B dashboard |

---

## H. Redirect-Only Routes

These routes exist only to redirect to their canonical counterparts (11 total):

| # | Route | Redirects To | Type |
|---|---|---|---|
| 1 | `/business/` | `/b2b/dashboard` | Listing |
| 2 | `/crowdfunding/` | `/campaigns/` | Listing |
| 3 | `/crowdfunding/{id}` | `/campaigns/{id}` | Detail |
| 4 | `/consignment-shop/` | `/consignment/` | Listing |
| 5 | `/consignment-shop/{id}` | `/consignment/{id}` | Detail |
| 6 | `/dropshipping-marketplace/` | `/dropshipping/` | Listing |
| 7 | `/dropshipping-marketplace/{id}` | `/dropshipping/{id}` | Detail |
| 8 | `/print-on-demand-shop/` | `/print-on-demand/` | Listing |
| 9 | `/print-on-demand-shop/{id}` | `/print-on-demand/{id}` | Detail |
| 10 | `/white-label-shop/` | `/white-label/` | Listing |
| 11 | `/white-label-shop/{id}` | `/white-label/{id}` | Detail |

---

## I. Complete Gap Analysis Summary

### Verticals Missing Admin API Endpoints (15)

| # | Vertical | Has Store EP | Has Vendor | Has Manage | Missing |
|---|---|---|---|---|---|
| 1 | B2B | YES | YES | NO | Admin EP + Manage page |
| 2 | Bundles | YES | YES | YES | Admin EP |
| 3 | Consignment | YES | YES | YES | Admin EP |
| 4 | Credit | YES | YES | YES | Admin EP |
| 5 | Dropshipping | YES | YES | YES | Admin EP |
| 6 | Flash Deals | YES | NO | NO | Admin EP + Vendor + Manage |
| 7 | Flash Sales | YES | YES | YES | Admin EP |
| 8 | Gift Cards | YES | YES | YES | Admin EP |
| 9 | Insurance | YES | YES | YES | Admin EP |
| 10 | Newsletter | YES | YES | YES | Admin EP |
| 11 | Print on Demand | YES | YES | YES | Admin EP |
| 12 | Trade-in | YES | YES | YES | Admin EP |
| 13 | Try Before You Buy | YES | YES | YES | Admin EP |
| 14 | Volume Deals | YES | NO | NO | Admin EP + Vendor + Manage |
| 15 | White Label | YES | YES | YES | Admin EP |

### Verticals Missing Store API Endpoints (0)

None — all verticals with public storefronts have corresponding store API endpoints.

### Verticals Missing Public Pages (2)

| Vertical | Has Store EP | Has Admin EP | Missing |
|---|---|---|---|
| Event Ticketing | YES (list only) | YES | Public listing + detail pages, Store detail EP |
| Volume Pricing | YES | YES | Public listing + detail pages (by design — admin/vendor only) |

### Verticals Missing Vendor + Manage (2)

| Vertical | Has Public | Has Store EP | Missing |
|---|---|---|---|
| Flash Deals | YES | YES | Vendor page + Manage page (separate from Flash Sales) |
| Volume Deals | YES | YES | Vendor page + Manage page |

### Naming Inconsistencies

| Vertical | Public Slug | Backend Slug | Vendor Slug | Issue |
|---|---|---|---|---|
| Campaigns/Crowdfunding | `/campaigns` | `/crowdfunding` | `/vendor/crowdfunding` | Public vs backend name mismatch |
| Digital Products | `/digital` | `/digital-products` | `/vendor/digital-products` | Public slug shortened |
| Financial Products | `/financial` | `/financial-products` | `/vendor/financial-product` | Public shortened + vendor singular |
| Flash Deals vs Flash Sales | `/flash-deals` + `/flash-sales` | `/flash-sales` | `/vendor/flash-sales` | Two public pages, one backend |
| Classifieds | `/classifieds` | `/classifieds` | `/vendor/classified` | Vendor uses singular |
| Pet Services | `/pet-services` | `/pet-services` | `/vendor/pet-service` | Vendor uses singular |
| Warranties | `/warranties` | `/warranties` | `/vendor/warranty` | Vendor uses singular |
| Loyalty Program | `/loyalty-program` | `/loyalty` | `/vendor/loyalty` | Public slug differs from backend |
| Trade-in | `/trade-in` | `/trade-in` + `/trade-ins` | `/vendor/trade-in` | Backend has both singular and plural |
| Charity | `/charity` | `/charity` | `/vendor/charity` | Admin has dual endpoints: `/admin/charity` + `/admin/charities` |
| Newsletter | `/newsletter` | `/newsletter` | `/vendor/newsletter` | Manage uses plural: `/manage/newsletters` |

### Orphan Route Status

| Area | Orphan Count | Status |
|---|---|---|
| Account | 0 | RESOLVED — All 22 routes in sidebar |
| Vendor | 1 | `/vendor/home` orphan remains |
| Manage | 4 intentional | `company`, `charities`, `promotions-ext`, `warranty` (duplicates/detail views) |
| Public | 0 | All accessible via navigation or product cards |

---

## J. Summary Statistics (Detailed)

### Route File Counts

| Area | Route Files |
|---|---|
| Storefront (total) | 340 |
| Account | 30 |
| Vendor | 76 |
| Manage | 98 |
| Redirect | 11 |
| Core (public, auth, utility) | ~125 |

### Backend API Endpoint Counts

| Scope | Endpoints |
|---|---|
| Admin (`/api/admin/...`) | 207 |
| Store (`/api/store/...`) | 163 |
| Other (vendor, platform, webhook, health) | 84 |
| **Total** | **454** |

### Vertical Coverage Summary

| Metric | Count |
|---|---|
| Total verticals tracked | 48 |
| Fully complete (all layers present) | 22 |
| Functionally complete (naming notes only) | 7 |
| Verticals with missing admin EP | 15 |
| Verticals with missing public pages | 2 |
| Verticals with missing vendor + manage | 2 |
| Content-only verticals (Places/POI) | 1 |
| Shared-backend verticals (Gift Cards Shop) | 1 |

### Fully Complete Verticals (22)

Affiliate, Auctions, Automotive, Bookings, Digital Products, Education, Events, Fitness, Freelance, Government, Grocery, Healthcare, Legal Services, Memberships, Parking, Quotes, Real Estate, Rentals, Restaurants, Social Commerce, Subscriptions, Travel

### Functionally Complete (naming inconsistencies only, 7)

Campaigns/Crowdfunding, Charity, Classifieds, Financial Products, Loyalty Program, Pet Services, Warranties

### Verticals with Gaps (19)

B2B, Bundles, Consignment, Credit, Dropshipping, Event Ticketing, Flash Deals, Flash Sales, Gift Cards, Gift Cards Shop, Insurance, Newsletter, Places/POI, Print on Demand, Trade-in, Try Before You Buy, Volume Deals, Volume Pricing, White Label
