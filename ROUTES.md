# Dakkah CityOS Commerce Platform — Route Map

> Generated: 2026-02-15
> Base URL pattern: `/{tenant}/{locale}/...` (e.g. `/dakkah/en/...`)

---

## Table of Contents
1. [Public Storefront Pages](#1-public-storefront-pages)
2. [Vertical Listing & Detail Pages (45 Verticals)](#2-vertical-listing--detail-pages-45-verticals)
3. [Account Pages (Auth Required)](#3-account-pages-auth-required)
4. [Vendor Dashboard (Vendor Auth Required)](#4-vendor-dashboard-vendor-auth-required)
5. [B2B / Business Pages (B2B Auth Required)](#5-b2b--business-pages-b2b-auth-required)
6. [Manage / Admin Dashboard (RBAC)](#6-manage--admin-dashboard-rbac)
7. [Auth & Utility Pages](#7-auth--utility-pages)
8. [Redirect-Only Routes](#8-redirect-only-routes)
9. [Accessibility Audit — Orphan Routes](#9-accessibility-audit--orphan-routes)
10. [Broken Links — Pages Linking to Non-Existent Routes](#10-broken-links--pages-linking-to-non-existent-routes)

---

## 1. Public Storefront Pages

These pages are accessible to all users without login.

| Route | Description | Linked From |
|---|---|---|
| `/` | Homepage / tenant landing | Header logo |
| `/cart` | Shopping cart | Header cart icon |
| `/checkout` | Checkout flow | Cart page |
| `/compare` | Product comparison | Product cards |
| `/wishlist` | Public wishlist | Header/product cards |
| `/flash-sales` | Flash sales page | Navigation |
| `/gift-cards` | Gift cards page | Navigation |
| `/marketplace` | Public marketplace browsing | Navigation |
| `/products/{handle}` | Product detail page | Product cards / search |
| `/order/{orderId}/confirmed` | Order confirmation page | Checkout flow |
| `/returns` | Returns page | Order detail / footer |
| `/store-pickup` | Store pickup page | Checkout / order flow |
| `/track` | Order tracking | Order detail / footer |
| `/categories/{handle}` | Category listing | Header mega-menu |
| `/vendors/` | Vendor directory | Navigation |
| `/vendors/{handle}` | Vendor public profile | Vendor directory |
| `/vendors/{id}` | Vendor profile by ID | — |
| `/blog/` | Blog listing | Footer |
| `/blog/{slug}` | Blog post detail | Blog listing |
| `/help/` | Help center | Footer |
| `/help/{slug}` | Help article | Help center |
| `/wallet/` | Wallet page | Product cards |
| `/{slug}` | Dynamic CMS page (privacy, terms, etc.) | CMS navigation |

---

## 2. Vertical Listing & Detail Pages (45 Verticals)

All verticals follow the pattern: listing at `/vertical/` and detail at `/vertical/{id}`.
These are **public storefront pages** showing available services/products.

| # | Vertical | Listing Route | Detail Route | Backend Endpoint |
|---|---|---|---|---|
| 1 | Affiliate | `/affiliate/` | `/affiliate/{id}` | `/store/affiliate` |
| 2 | Auctions | `/auctions/` | `/auctions/{id}` | `/store/auctions` |
| 3 | Automotive | `/automotive/` | `/automotive/{id}` | `/store/automotive` |
| 4 | B2B Marketplace | `/b2b/` | `/b2b/{id}` | `/store/b2b` |
| 5 | Bookings | `/bookings/` | `/bookings/{id}` | `/store/bookings` |
| 6 | Bundles | `/bundles/` | `/bundles/{id}` | `/store/bundles` |
| 7 | Campaigns | `/campaigns/` | `/campaigns/{id}` | `/store/campaigns` |
| 8 | Charity | `/charity/` | `/charity/{id}` | `/store/charity` |
| 9 | Classifieds | `/classifieds/` | `/classifieds/{id}` | `/store/classifieds` |
| 10 | Consignment | `/consignment/` | `/consignment/{id}` | `/store/consignments` |
| 11 | Credit | `/credit/` | `/credit/{id}` | `/store/credit` |
| 12 | Digital | `/digital/` | `/digital/{id}` | `/store/digital-products` |
| 13 | Dropshipping | `/dropshipping/` | `/dropshipping/{id}` | `/store/dropshipping` |
| 14 | Education | `/education/` | `/education/{id}` | `/store/education` |
| 15 | Events | `/events/` | `/events/{id}` | `/store/events` |
| 16 | Financial | `/financial/` | `/financial/{id}` | `/store/financial-products` |
| 17 | Fitness | `/fitness/` | `/fitness/{id}` | `/store/fitness` |
| 18 | Flash Deals | `/flash-deals/` | `/flash-deals/{id}` | `/store/flash-sales` |
| 19 | Freelance | `/freelance/` | `/freelance/{id}` | `/store/freelance` |
| 20 | Gift Cards Shop | `/gift-cards-shop/` | `/gift-cards-shop/{id}` | `/store/gift-cards` |
| 21 | Government | `/government/` | `/government/{id}` | `/store/government` |
| 22 | Grocery | `/grocery/` | `/grocery/{id}` | `/store/grocery` |
| 23 | Healthcare | `/healthcare/` | `/healthcare/{id}` | `/store/healthcare` |
| 24 | Insurance | `/insurance/` | `/insurance/{id}` | `/store/insurance` |
| 25 | Legal | `/legal/` | `/legal/{id}` | `/store/legal` |
| 26 | Loyalty Program | `/loyalty-program/` | `/loyalty-program/{id}` | `/store/loyalty` |
| 27 | Marketplace | `/marketplace/` | — | `/store/products` |
| 28 | Memberships | `/memberships/` | `/memberships/{id}` | `/store/memberships` |
| 29 | Newsletter | `/newsletter/` | `/newsletter/{id}` | `/store/newsletter` |
| 30 | Parking | `/parking/` | `/parking/{id}` | `/store/parking` |
| 31 | Pet Services | `/pet-services/` | `/pet-services/{id}` | `/store/pet-services` |
| 32 | Places | `/places/` | `/places/{id}` | `/store/content/pois` |
| 33 | Print on Demand | `/print-on-demand/` | `/print-on-demand/{id}` | `/store/print-on-demand` |
| 34 | Quotes | `/quotes/` | `/quotes/{id}` | `/store/quotes` |
| 35 | Real Estate | `/real-estate/` | `/real-estate/{id}` | `/store/real-estate` |
| 36 | Rentals | `/rentals/` | `/rentals/{id}` | `/store/rentals` |
| 37 | Restaurants | `/restaurants/` | `/restaurants/{id}` | `/store/restaurants` |
| 38 | Social Commerce | `/social-commerce/` | `/social-commerce/{id}` | `/store/social-commerce` |
| 39 | Subscriptions | `/subscriptions/` | `/subscriptions/{id}` | `/store/subscriptions` |
| 40 | Trade-in | `/trade-in/` | `/trade-in/{id}` | `/store/trade-ins` |
| 41 | Travel | `/travel/` | `/travel/{id}` | `/store/travel` |
| 42 | Try Before You Buy | `/try-before-you-buy/` | `/try-before-you-buy/{id}` | `/store/try-before-you-buy` |
| 43 | Volume Deals | `/volume-deals/` | `/volume-deals/{id}` | `/store/volume-deals` |
| 44 | Warranties | `/warranties/` | `/warranties/{id}` | `/store/warranties` |
| 45 | White Label | `/white-label/` | `/white-label/{id}` | `/store/white-label` |

**Additional Vertical Sub-routes:**
| Route | Description |
|---|---|
| `/quotes/request` | Request a quote form |
| `/subscriptions/checkout` | Subscription checkout flow |
| `/subscriptions/success` | Subscription success page |

**Bookings Architecture:**
| Route | Description | Backend Endpoint |
|---|---|---|
| `/bookings/` | Lists available bookable services | `/store/bookings/services` |
| `/bookings/{id}` | Booking record detail (public) | `/store/bookings/{id}` |
| `/bookings/{serviceHandle}` | Book a specific service (calendar/slot picker) | `/store/bookings/services/{serviceId}/providers` |
| `/bookings/confirmation` | Booking confirmation page | — |

> Note: The bookings listing page fetches from `/store/bookings/services` (public service catalog), NOT from `/store/bookings` (customer bookings). The `/{id}` detail page shows a booking record. The `/{serviceHandle}` page is the actual service booking flow with calendar, time slots, and provider selection.

---

## 3. Account Pages (Auth Required)

All account pages require **customer authentication** and use the `AccountLayout` component with sidebar navigation.

### Account Sidebar Navigation (22 items in 5 sections):

**Main:**
| Route | Label | In Sidebar |
|---|---|---|
| `/account/` | Overview | Yes |
| `/account/orders` | Orders | Yes |
| `/account/addresses` | Addresses | Yes |
| `/account/profile` | Profile | Yes |

**Payments & Billing:**
| Route | Label | In Sidebar |
|---|---|---|
| `/account/payment-methods` | Payment Methods | Yes |
| `/account/wallet` | Wallet | Yes |
| `/account/store-credits` | Store Credits | Yes |
| `/account/invoices` | Invoices | Yes |
| `/account/installments` | Installments | Yes |

**Shopping:**
| Route | Label | In Sidebar |
|---|---|---|
| `/account/subscriptions` | Subscriptions | Yes |
| `/account/bookings` | Bookings | Yes |
| `/account/wishlist` | Wishlist | Yes |
| `/account/downloads` | Downloads | Yes |
| `/account/purchase-orders` | Purchase Orders | Yes |

**Engagement:**
| Route | Label | In Sidebar |
|---|---|---|
| `/account/reviews` | Reviews | Yes |
| `/account/loyalty` | Loyalty | Yes |
| `/account/referrals` | Referrals | Yes |
| `/account/quotes` | Quotes | Yes |

**Account:**
| Route | Label | In Sidebar |
|---|---|---|
| `/account/settings` | Settings | Yes |
| `/account/consents` | Consents | Yes |
| `/account/disputes` | Disputes | Yes |
| `/account/verification` | Verification | Yes |

### Account Sub-routes (accessible from parent pages):
| Route | Description | Linked From |
|---|---|---|
| `/account/orders/{id}` | Order detail | Orders list |
| `/account/orders/{id}/return` | Order return | Order detail |
| `/account/orders/{id}/track` | Order tracking | Order detail |
| `/account/subscriptions/{id}` | Subscription detail | Subscriptions list |
| `/account/subscriptions/{id}/billing` | Subscription billing | Subscription detail |
| `/account/bookings/{id}` | Booking detail | Bookings list |
| `/account/purchase-orders/` | Purchase orders list | Sidebar |
| `/account/purchase-orders/{id}` | PO detail | PO list |
| `/account/purchase-orders/new` | Create new PO | PO list |

### B2B Navigation (shown for B2B customers):
The account sidebar includes a "Business" section for B2B customers with links to:
- `/b2b/dashboard` — Company Dashboard
- `/business/catalog` — Business Catalog

---

## 4. Vendor Dashboard (Vendor Auth Required)

Vendor pages require vendor authentication. The vendor dashboard uses the `VendorLayout` component with 7 collapsible sidebar sections containing 65 navigation items.

### Vendor Sidebar Navigation (7 collapsible sections):

**Main (7 items):**
| Route | Label |
|---|---|
| `/vendor/` | Dashboard |
| `/vendor/analytics` | Analytics |
| `/vendor/reviews` | Reviews |
| `/vendor/commissions` | Commissions |
| `/vendor/transactions` | Transactions |
| `/vendor/invoices` | Invoices |
| `/vendor/wallet` | Wallet |

**Products & Inventory (6 items):**
| Route | Label |
|---|---|
| `/vendor/products` | Products |
| `/vendor/bundles` | Bundles |
| `/vendor/digital-products` | Digital Products |
| `/vendor/inventory` | Inventory |
| `/vendor/inventory-extension` | Inventory Extension |
| `/vendor/print-on-demand` | Print on Demand |

**Orders & Fulfillment (6 items):**
| Route | Label |
|---|---|
| `/vendor/orders` | Orders |
| `/vendor/payouts` | Payouts |
| `/vendor/shipping-extension` | Shipping Extension |
| `/vendor/shipping-rules` | Shipping Rules |
| `/vendor/cart-extension` | Cart Extension |
| `/vendor/cart-rules` | Cart Rules |

**Services & Verticals (18 items):**
| Route | Label |
|---|---|
| `/vendor/bookings` | Bookings |
| `/vendor/events` | Events |
| `/vendor/event-ticketing` | Event Ticketing |
| `/vendor/auctions` | Auctions |
| `/vendor/rentals` | Rentals |
| `/vendor/restaurants` | Restaurants |
| `/vendor/freelance` | Freelance |
| `/vendor/fitness` | Fitness |
| `/vendor/healthcare` | Healthcare |
| `/vendor/education` | Education |
| `/vendor/automotive` | Automotive |
| `/vendor/real-estate` | Real Estate |
| `/vendor/pet-service` | Pet Service |
| `/vendor/parking` | Parking |
| `/vendor/travel` | Travel |
| `/vendor/insurance` | Insurance |
| `/vendor/government` | Government |
| `/vendor/grocery` | Grocery |

**Marketing (6 items):**
| Route | Label |
|---|---|
| `/vendor/advertising` | Advertising |
| `/vendor/affiliate` | Affiliate |
| `/vendor/social-commerce` | Social Commerce |
| `/vendor/flash-sales` | Flash Sales |
| `/vendor/crowdfunding` | Crowdfunding |
| `/vendor/charity` | Charity |

**Finance (8 items):**
| Route | Label |
|---|---|
| `/vendor/credit` | Credit |
| `/vendor/financial-product` | Financial Product |
| `/vendor/volume-pricing` | Volume Pricing |
| `/vendor/subscriptions` | Subscriptions |
| `/vendor/loyalty` | Loyalty |
| `/vendor/memberships` | Memberships |
| `/vendor/gift-cards` | Gift Cards |
| `/vendor/tax-config` | Tax Config |

**Other (14 items):**
| Route | Label |
|---|---|
| `/vendor/b2b` | B2B |
| `/vendor/classified` | Classified |
| `/vendor/consignments` | Consignments |
| `/vendor/dropshipping` | Dropshipping |
| `/vendor/trade-in` | Trade-in |
| `/vendor/try-before-you-buy` | Try Before You Buy |
| `/vendor/warranty` | Warranty |
| `/vendor/white-label` | White Label |
| `/vendor/wishlists` | Wishlists |
| `/vendor/newsletter` | Newsletter |
| `/vendor/notification-preferences` | Notification Preferences |
| `/vendor/disputes` | Disputes |
| `/vendor/legal` | Legal |
| `/vendor/quotes` | Quotes |

### Special Vendor Routes (not in sidebar):
| Route | Description | Accessible From |
|---|---|---|
| `/vendor/register` | Vendor registration | Login/public pages |
| `/vendor/onboarding/` | Onboarding flow | Post-registration |
| `/vendor/onboarding/verification` | Verification step | Onboarding |
| `/vendor/onboarding/complete` | Onboarding complete | Onboarding |

### Vendor Sub-routes:
| Route | Description | Linked From |
|---|---|---|
| `/vendor/products/{productId}` | Product detail/edit | Product list |
| `/vendor/products/new` | New product | Product list |
| `/vendor/orders/{orderId}` | Order detail | Order list |
| `/vendor/orders/{orderId}/fulfill` | Fulfill order | Order detail |
| `/vendor/payouts/request` | Request payout | Payouts page |

---

## 5. B2B / Business Pages (B2B Auth Required)

These pages require B2B authentication. The `/business` route redirects to `/b2b/dashboard`.

| Route | Description | Accessible From |
|---|---|---|
| `/b2b/` | B2B marketplace listing | Public |
| `/b2b/{id}` | B2B product detail | B2B listing |
| `/b2b/dashboard` | B2B dashboard | Account sidebar (B2B), user menu |
| `/b2b/register` | B2B registration | Public |
| `/business/` | Redirect to `/b2b/dashboard` | — |
| `/business/orders` | Business orders | B2B dashboard |
| `/business/catalog` | Business catalog | Account sidebar (B2B) |
| `/business/approvals` | Business approvals | B2B dashboard |
| `/business/team` | Business team | B2B dashboard |

---

## 6. Manage / Admin Dashboard (RBAC)

All manage pages require RBAC role-based access (minimum weight 40, platform features require 90). Uses `ManageLayout` with a sidebar powered by a module registry containing 95 modules across 9 sections.

### Manage Sidebar Sections & Modules:

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

**Marketing (8 modules):**
| Module | Route | Min Role Weight |
|---|---|---|
| Advertising | `/manage/advertising` | 40 |
| Promotions | `/manage/promotions` | 40 |
| Social Commerce | `/manage/social-commerce` | 40 |
| Classifieds | `/manage/classifieds` | 40 |
| Crowdfunding | `/manage/crowdfunding` | 40 |
| Charity | `/manage/charity` | 40 |
| Newsletters | `/manage/newsletters` | 40 |
| Promotion Extensions | `/manage/promotion-extensions` | 40 |

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

### Manage Route Files NOT in Module Registry (intentional duplicates):
| Route File | Description | Reason |
|---|---|---|
| `/manage/charities` | Charities | Duplicate of `charity` module |
| `/manage/promotions-ext` | Promotions Extended | Duplicate of `promotion-extensions` module |
| `/manage/warranty` | Warranty | Duplicate of `warranties` module |
| `/manage/company` | Single company view | Detail view, not a sidebar module |

---

## 7. Auth & Utility Pages

| Route | Description | Auth Required |
|---|---|---|
| `/login` | Login page | No |
| `/register` | Registration page | No |
| `/reset-password` | Password reset | No |
| `/verify/age` | Age verification | No |
| `/health` (root, outside tenant/locale) | Health check endpoint | No |

---

## 8. Redirect-Only Routes

These routes exist only to redirect to their canonical counterparts:

| Route | Redirects To |
|---|---|
| `/business/` | `/b2b/dashboard` |
| `/crowdfunding/{id}` | `/campaigns/{id}` |
| `/consignment-shop/` | `/consignment/` |
| `/consignment-shop/{id}` | `/consignment/{id}` |
| `/dropshipping-marketplace/` | `/dropshipping/` |
| `/dropshipping-marketplace/{id}` | `/dropshipping/{id}` |
| `/print-on-demand-shop/` | `/print-on-demand/` |
| `/print-on-demand-shop/{id}` | `/print-on-demand/{id}` |
| `/white-label-shop/` | `/white-label/` |
| `/white-label-shop/{id}` | `/white-label/{id}` |

---

## 9. Accessibility Audit — Orphan Routes

Routes that exist as files but are **NOT accessible from any navigation, sidebar, or parent page link**.

### Account Orphans: ✅ RESOLVED (0 orphans)
All 22 account routes are now in the account sidebar across 5 organized sections (Main, Payments & Billing, Shopping, Engagement, Account). Sub-routes (order detail, subscription detail, etc.) are accessible from their parent list pages.

### Vendor Orphans: ✅ RESOLVED (0 orphans)
All 65 vendor routes are now in the vendor sidebar via 7 collapsible sections (Main, Products & Inventory, Orders & Fulfillment, Services & Verticals, Marketing, Finance, Other). Registration and onboarding routes are special flows accessible from public pages.

### Manage Orphans: ✅ MOSTLY RESOLVED (~4 intentional duplicates remain)
The module registry now contains 95 modules across 9 sections. Only 4 route files remain outside the registry, all of which are intentional duplicates or detail views:
- `/manage/charities` (duplicate of `/manage/charity`)
- `/manage/promotions-ext` (duplicate of `/manage/promotion-extensions`)
- `/manage/warranty` (duplicate of `/manage/warranties`)
- `/manage/company` (single company detail view)

### B2B / Business Orphans: ✅ PARTIALLY RESOLVED
- `/b2b/dashboard` — accessible from account sidebar (B2B customers) and user menu
- `/business/` — redirects to `/b2b/dashboard`
- `/b2b/register` — accessible from public pages
- `/business/orders`, `/business/catalog`, `/business/approvals`, `/business/team` — accessible from B2B dashboard

### Public Storefront Orphans (~3 routes):
- `/compare` — only accessible via product cards (by design)
- `/wallet/` — only accessible via product cards (by design)
- `/flash-sales`, `/gift-cards`, `/marketplace` — accessible via site navigation ✅

---

## 10. Broken Links — Pages Linking to Non-Existent Routes

### ✅ ALL 16 previously identified broken links have been FIXED:

| Component | Original Link Target | Resolution |
|---|---|---|
| Account Dashboard | `/account/payment-methods` | Route file CREATED |
| Account Dashboard | `/account/reviews` | Route file CREATED |
| Account Dashboard | `/account/quotes` | Route file CREATED |
| Account Dashboard | `/account/invoices` | Route file CREATED |
| Account Dashboard | `/subscriptions` | Path FIXED to `/account/subscriptions` |
| Account Dashboard | `/bookings` | Path FIXED to `/account/bookings` |
| Account Dashboard | `/store` | Handled by `/{slug}` CMS catch-all |
| Quick Actions | `/store` | Handled by `/{slug}` CMS catch-all |
| Quick Actions | `/contact` | Link FIXED to `/help` |
| Account Layout | `/business` | Route CREATED (redirects to `/b2b/dashboard`) |
| Account Layout | `/business/quotes` | Route EXISTS |
| Navbar | `/store` | Handled by `/{slug}` CMS catch-all |
| Footer | `/privacy` | Resolves via `/{slug}` CMS catch-all ✅ |
| Footer | `/terms` | Resolves via `/{slug}` CMS catch-all ✅ |
| Manage Sidebar | `/manage/navigation` | Route file CREATED, added to module registry |
| Manage Sidebar | `/manage/media` | Route file CREATED, added to module registry |

**Current broken link count: 0**

---

## Summary Statistics

| Category | Count |
|---|---|
| Total route files | 340 |
| Public storefront pages | 22 (incl. marketplace, cart, checkout, etc.) |
| Public storefront verticals | 45 listing + 45 detail |
| Account routes | 30 |
| Vendor dashboard routes | 76 |
| Public vendor pages | 3 (directory + profiles) |
| Manage/Admin routes | 98 |
| B2B routes | 4 |
| Business routes | 5 |
| Auth/Utility routes | 5 |
| Redirect-only routes | 10 |
| Orphan routes | ~3 (down from ~118) |
| Broken links | 0 (down from 16) |
