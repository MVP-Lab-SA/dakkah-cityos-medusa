# Dakkah CityOS Commerce Platform — Route Map

> Generated: 2026-02-15
> Base URL pattern: `/{tenant}/{locale}/...` (e.g. `/dakkah/en/...`)

---

## Table of Contents
1. [Public Storefront Pages](#1-public-storefront-pages)
2. [Vertical Listing & Detail Pages (45 Verticals)](#2-vertical-listing--detail-pages)
3. [Account Pages (Auth Required)](#3-account-pages)
4. [Vendor Dashboard (Vendor Auth Required)](#4-vendor-dashboard)
5. [B2B / Business Pages (B2B Auth Required)](#5-b2b--business-pages)
6. [Manage / Admin Dashboard (RBAC)](#6-manage--admin-dashboard)
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
| `/flash-sales` | Flash sales page | — |
| `/gift-cards` | Gift cards page | — |
| `/categories/{handle}` | Category listing | Header mega-menu |
| `/vendors/` | Vendor directory | — |
| `/vendors/{handle}` | Vendor public profile | Vendor directory |
| `/vendors/{id}` | Vendor profile by ID | — |
| `/blog/` | Blog listing | Footer |
| `/blog/{slug}` | Blog post detail | Blog listing |
| `/help/` | Help center | Footer |
| `/help/{slug}` | Help article | Help center |
| `/wallet/` | Wallet page | — |
| `/{slug}` | Dynamic CMS page | CMS navigation |

---

## 2. Vertical Listing & Detail Pages

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
| 10 | Consignment | `/consignment/` | `/consignment/{id}` | `/store/consignment` |
| 11 | Credit | `/credit/` | `/credit/{id}` | `/store/credit` |
| 12 | Digital | `/digital/` | `/digital/{id}` | `/store/digital` |
| 13 | Dropshipping | `/dropshipping/` | `/dropshipping/{id}` | `/store/dropshipping` |
| 14 | Education | `/education/` | `/education/{id}` | `/store/education` |
| 15 | Events | `/events/` | `/events/{id}` | `/store/events` |
| 16 | Financial | `/financial/` | `/financial/{id}` | `/store/financial` |
| 17 | Fitness | `/fitness/` | `/fitness/{id}` | `/store/fitness` |
| 18 | Flash Deals | `/flash-deals/` | `/flash-deals/{id}` | `/store/flash-deals` |
| 19 | Freelance | `/freelance/` | `/freelance/{id}` | `/store/freelance` |
| 20 | Gift Cards Shop | `/gift-cards-shop/` | `/gift-cards-shop/{id}` | `/store/gift-cards-shop` |
| 21 | Government | `/government/` | `/government/{id}` | `/store/government` |
| 22 | Grocery | `/grocery/` | `/grocery/{id}` | `/store/grocery` |
| 23 | Healthcare | `/healthcare/` | `/healthcare/{id}` | `/store/healthcare` |
| 24 | Insurance | `/insurance/` | `/insurance/{id}` | `/store/insurance` |
| 25 | Legal | `/legal/` | `/legal/{id}` | `/store/legal` |
| 26 | Loyalty Program | `/loyalty-program/` | `/loyalty-program/{id}` | `/store/loyalty-program` |
| 27 | Volume Deals | `/volume-deals/` | `/volume-deals/{id}` | `/store/volume-deals` |
| 28 | Warranties | `/warranties/` | `/warranties/{id}` | `/store/warranties` |
| 29 | White Label | `/white-label/` | `/white-label/{id}` | `/store/white-label` |

**Bookings Architecture:**
| Route | Description | Backend Endpoint |
|---|---|---|
| `/bookings/` | Lists available bookable services | `/store/bookings/services` |
| `/bookings/{id}` | Booking record detail (public) | `/store/bookings/{id}` |
| `/bookings/{serviceHandle}` | Book a specific service (calendar/slot picker) | `/store/bookings/services/{serviceId}/providers` |
| `/bookings/confirmation` | Booking confirmation page | — |

> Note: The bookings listing page fetches from `/store/bookings/services` (public service catalog), NOT from `/store/bookings` (customer bookings). The `/{id}` detail page shows a booking record. The `/{serviceHandle}` page is the actual service booking flow with calendar, time slots, and provider selection.

---

## 3. Account Pages

All account pages require **customer authentication** and use the `AccountLayout` component with sidebar navigation.

### Currently in Account Sidebar Navigation (6 items):
| Route | Label | In Sidebar |
|---|---|---|
| `/account/` | Overview | Yes |
| `/account/orders` | Orders | Yes |
| `/account/subscriptions` | Subscriptions | Yes |
| `/account/bookings` | Bookings | Yes |
| `/account/addresses` | Addresses | Yes |
| `/account/settings` | Settings | Yes |

### Account Routes NOT in Sidebar (orphan — no navigation link):
| Route | Description | Linked From |
|---|---|---|
| `/account/profile` | Profile page | Account dashboard card |
| `/account/wallet` | Wallet / balance | Nowhere |
| `/account/wishlist` | Saved wishlist | Nowhere |
| `/account/downloads` | Digital downloads | Nowhere |
| `/account/loyalty` | Loyalty points | Nowhere |
| `/account/referrals` | Referral program | Nowhere |
| `/account/store-credits` | Store credits | Nowhere |
| `/account/consents` | Privacy consents | Nowhere |
| `/account/disputes` | Disputes | Nowhere |
| `/account/installments` | Payment installments | Nowhere |
| `/account/verification` | Identity verification | Nowhere |
| `/account/purchase-orders/` | Purchase orders list | Nowhere |
| `/account/purchase-orders/{id}` | PO detail | PO list |
| `/account/purchase-orders/new` | Create new PO | Nowhere |
| `/account/orders/{id}` | Order detail | Orders list |
| `/account/orders/{id}/return` | Order return | Order detail |
| `/account/orders/{id}/track` | Order tracking | Order detail |
| `/account/subscriptions/{id}` | Subscription detail | Subscriptions list |
| `/account/subscriptions/{id}/billing` | Subscription billing | Subscription detail |

---

## 4. Vendor Dashboard

Vendor pages require vendor authentication. The vendor dashboard is at `/vendor/`.

### Linked from Vendor Dashboard (3 items only):
| Route | Linked |
|---|---|
| `/vendor/products` | Yes |
| `/vendor/orders` | Yes |
| `/vendor/payouts` | Yes |

### All Vendor Routes (most are ORPHAN — no navigation links):
| Route | Description | Accessible From Nav |
|---|---|---|
| `/vendor/` | Dashboard | — |
| `/vendor/register` | Vendor registration | Login/public |
| `/vendor/onboarding/` | Onboarding | Post-registration |
| `/vendor/onboarding/verification` | Verification step | Onboarding |
| `/vendor/onboarding/complete` | Onboarding complete | Onboarding |
| `/vendor/products/` | Product list | Dashboard |
| `/vendor/products/{productId}` | Product detail | Product list |
| `/vendor/products/new` | New product | Product list |
| `/vendor/orders/` | Order list | Dashboard |
| `/vendor/payouts` | Payouts overview | Dashboard |
| `/vendor/payouts/` | Payouts list | — |
| `/vendor/home` | Vendor home | Nowhere |
| `/vendor/analytics` | Analytics | Nowhere |
| `/vendor/reviews` | Reviews | Nowhere |
| `/vendor/commissions` | Commissions | Nowhere |
| `/vendor/transactions` | Transactions | Nowhere |
| `/vendor/disputes` | Disputes | Nowhere |
| `/vendor/invoices` | Invoices | Nowhere |
| `/vendor/wallet` | Wallet | Nowhere |
| `/vendor/advertising` | Advertising | Nowhere |
| `/vendor/affiliate` | Affiliate | Nowhere |
| `/vendor/auctions` | Auctions | Nowhere |
| `/vendor/automotive` | Automotive | Nowhere |
| `/vendor/b2b` | B2B | Nowhere |
| `/vendor/bookings` | Bookings | Nowhere |
| `/vendor/bundles` | Bundles | Nowhere |
| `/vendor/cart-extension` | Cart extension | Nowhere |
| `/vendor/cart-rules` | Cart rules | Nowhere |
| `/vendor/charity` | Charity | Nowhere |
| `/vendor/classified` | Classified | Nowhere |
| `/vendor/consignments` | Consignments | Nowhere |
| `/vendor/credit` | Credit | Nowhere |
| `/vendor/crowdfunding` | Crowdfunding | Nowhere |
| `/vendor/digital-products` | Digital products | Nowhere |
| `/vendor/dropshipping` | Dropshipping | Nowhere |
| `/vendor/education` | Education | Nowhere |
| `/vendor/events` | Events | Nowhere |
| `/vendor/event-ticketing` | Event ticketing | Nowhere |
| `/vendor/financial-product` | Financial product | Nowhere |
| `/vendor/fitness` | Fitness | Nowhere |
| `/vendor/flash-sales` | Flash sales | Nowhere |
| `/vendor/freelance` | Freelance | Nowhere |
| `/vendor/gift-cards` | Gift cards | Nowhere |
| `/vendor/government` | Government | Nowhere |
| `/vendor/grocery` | Grocery | Nowhere |
| `/vendor/healthcare` | Healthcare | Nowhere |
| `/vendor/insurance` | Insurance | Nowhere |
| `/vendor/inventory` | Inventory | Nowhere |
| `/vendor/inventory-extension` | Inventory extension | Nowhere |
| `/vendor/legal` | Legal | Nowhere |
| `/vendor/loyalty` | Loyalty | Nowhere |
| `/vendor/memberships` | Memberships | Nowhere |
| `/vendor/newsletter` | Newsletter | Nowhere |
| `/vendor/notification-preferences` | Notification prefs | Nowhere |
| `/vendor/parking` | Parking | Nowhere |
| `/vendor/pet-service` | Pet service | Nowhere |
| `/vendor/print-on-demand` | Print on demand | Nowhere |
| `/vendor/quotes` | Quotes | Nowhere |
| `/vendor/real-estate` | Real estate | Nowhere |
| `/vendor/rentals` | Rentals | Nowhere |
| `/vendor/restaurants` | Restaurants | Nowhere |
| `/vendor/shipping-extension` | Shipping extension | Nowhere |
| `/vendor/shipping-rules` | Shipping rules | Nowhere |
| `/vendor/social-commerce` | Social commerce | Nowhere |
| `/vendor/subscriptions` | Subscriptions | Nowhere |
| `/vendor/tax-config` | Tax config | Nowhere |
| `/vendor/trade-in` | Trade-in | Nowhere |
| `/vendor/travel` | Travel | Nowhere |
| `/vendor/try-before-you-buy` | Try before you buy | Nowhere |
| `/vendor/volume-pricing` | Volume pricing | Nowhere |
| `/vendor/warranty` | Warranty | Nowhere |
| `/vendor/white-label` | White label | Nowhere |
| `/vendor/wishlists` | Wishlists | Nowhere |

---

## 5. B2B / Business Pages

These pages require B2B authentication.

| Route | Description | Accessible From |
|---|---|---|
| `/b2b/` | B2B marketplace listing | Public |
| `/b2b/{id}` | B2B product detail | B2B listing |
| `/b2b/dashboard` | B2B dashboard | Nowhere (no link from B2B listing or account) |
| `/b2b/register` | B2B registration | Nowhere |
| `/business/orders` | Business orders | Nowhere |
| `/business/catalog` | Business catalog | Nowhere |
| `/business/approvals` | Business approvals | Nowhere |
| `/business/team` | Business team | Nowhere |

---

## 6. Manage / Admin Dashboard

All manage pages require RBAC role-based access (minimum weight 40, platform features require 90). Uses `ManageLayout` with a sidebar powered by a module registry.

### Manage Sidebar Sections & Modules:

**Overview:**
| Module | Route | Min Role Weight |
|---|---|---|
| Dashboard | `/manage/` | 40 |

**Commerce:**
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

**Marketplace:**
| Module | Route | Min Role Weight |
|---|---|---|
| Vendors | `/manage/vendors` | 40 |
| Commissions | `/manage/commissions` | 40 |
| Payouts | `/manage/payouts` | 40 |
| Affiliates | `/manage/affiliates` | 40 |

**Verticals:**
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
| Credit | `/manage/credit` | 40 |
| Dropshipping | `/manage/dropshipping` | 40 |
| Loyalty | `/manage/loyalty` | 40 |
| Bundles | `/manage/bundles` | 40 |
| Wallet | `/manage/wallet` | 40 |
| Wishlists | `/manage/wishlists` | 40 |

**Marketing:**
| Module | Route | Min Role Weight |
|---|---|---|
| Advertising | `/manage/advertising` | 40 |
| Promotions | `/manage/promotions` | 40 |
| Social Commerce | `/manage/social-commerce` | 40 |
| Classifieds | `/manage/classifieds` | 40 |
| Crowdfunding | `/manage/crowdfunding` | 40 |
| Charity | `/manage/charity` | 40 |
| Newsletter | `/manage/newsletter` (route: newsletters) | 40 |

**Content (CMS):**
| Module | Route | Min Role Weight |
|---|---|---|
| CMS Pages | `/manage/cms` | 30 |
| CMS Content | `/manage/cms-content` | 30 |
| Media Library | `/manage/media` | 30 |
| Navigation | `/manage/navigation` (route: n/a) | 30 |

**Organization:**
| Module | Route | Min Role Weight |
|---|---|---|
| Team | `/manage/team` | 40 |
| Companies | `/manage/companies` | 40 |
| Stores | `/manage/stores` | 40 |
| Legal | `/manage/legal` | 40 |
| Utilities | `/manage/utilities` | 40 |

**Platform (Super Admin):**
| Module | Route | Min Role Weight |
|---|---|---|
| Tenants Admin | `/manage/tenants-admin` | 90 |
| Governance | `/manage/governance` | 90 |
| Region Zones | `/manage/region-zones` | 90 |
| Webhooks | `/manage/webhooks` | 90 |
| Integrations | `/manage/integrations` | 90 |
| Temporal | `/manage/temporal` | 90 |
| Audit | `/manage/audit` | 90 |

**System:**
| Module | Route | Min Role Weight |
|---|---|---|
| Analytics | `/manage/analytics` | 40 |
| Settings | `/manage/settings` | 40 |

### Manage Routes WITH route files but NOT in sidebar module registry:
| Route File | Description |
|---|---|
| `/manage/availability` | Availability management |
| `/manage/cart-extensions` | Cart extensions |
| `/manage/channels` | Sales channels |
| `/manage/charities` | Charities (duplicate of charity) |
| `/manage/commission-rules` | Commission rules |
| `/manage/companies-admin` | Companies admin |
| `/manage/company` | Single company |
| `/manage/consignments` | Consignments |
| `/manage/digital-products` | Digital products |
| `/manage/events` | Events |
| `/manage/financial-products` | Financial products |
| `/manage/flash-sales` | Flash sales |
| `/manage/freelance` | Freelance |
| `/manage/gift-cards` | Gift cards |
| `/manage/government` | Government |
| `/manage/i18n` | Internationalization |
| `/manage/insurance` | Insurance |
| `/manage/inventory-extension` | Inventory extension |
| `/manage/memberships` | Memberships |
| `/manage/metrics` | Metrics |
| `/manage/nodes` | Node hierarchy |
| `/manage/notification-preferences` | Notification preferences |
| `/manage/parking` | Parking |
| `/manage/payment-terms` | Payment terms |
| `/manage/personas` | Personas |
| `/manage/pet-services` | Pet services |
| `/manage/pricing-tiers` | Pricing tiers |
| `/manage/print-on-demand` | Print on demand |
| `/manage/promotion-extensions` | Promotion extensions |
| `/manage/promotions-ext` | Promotions extended (duplicate) |
| `/manage/purchase-orders` | Purchase orders |
| `/manage/service-providers` | Service providers |
| `/manage/subscription-plans` | Subscription plans |
| `/manage/tax-config` | Tax configuration |
| `/manage/trade-in` | Trade-in |
| `/manage/travel` | Travel |
| `/manage/try-before-you-buy` | Try before you buy |
| `/manage/volume-pricing` | Volume pricing |
| `/manage/warranties` | Warranties (vs warranty) |
| `/manage/warranty` | Warranty |
| `/manage/white-label` | White label |

---

## 7. Auth & Utility Pages

| Route | Description | Auth Required |
|---|---|---|
| `/login` | Login / register | No |
| `/verify/age` | Age verification | No |
| `/health` (root) | Health check endpoint | No |

---

## 8. Redirect-Only Routes

These routes exist only to redirect to their canonical counterparts:

| Route | Redirects To |
|---|---|
| `/crowdfunding/{id}` | `/campaigns/{id}` |
| `/consignment-shop/` | `/consignment/` |
| `/consignment-shop/{id}` | `/consignment/{id}` |
| `/dropshipping-marketplace/` | `/dropshipping/` |
| `/dropshipping-marketplace/{id}` | `/dropshipping/{id}` |
| `/print-on-demand-shop/` | Likely `/print-on-demand/` (no route exists) |
| `/print-on-demand-shop/{id}` | Redirects but target may not exist |
| `/white-label-shop/` | `/white-label/` |
| `/white-label-shop/{id}` | `/white-label/{id}` |

---

## 9. Accessibility Audit — Orphan Routes

Routes that exist as files but are **NOT accessible from any navigation, sidebar, or parent page link**.

### Account Orphans (15 routes):
- `/account/wallet`
- `/account/wishlist`
- `/account/downloads`
- `/account/loyalty`
- `/account/referrals`
- `/account/store-credits`
- `/account/consents`
- `/account/disputes`
- `/account/installments`
- `/account/verification`
- `/account/purchase-orders/`
- `/account/purchase-orders/new`
- `/account/profile` (linked from dashboard card, NOT in sidebar)

### Vendor Orphans (60+ routes):
Nearly all vendor sub-pages except `/vendor/products`, `/vendor/orders`, and `/vendor/payouts` are orphaned. The vendor dashboard only links to 3 pages. All 60+ vertical-specific vendor pages (e.g., `/vendor/auctions`, `/vendor/bookings`, `/vendor/healthcare`) have NO sidebar or navigation linking to them.

### B2B / Business Orphans (6 routes):
- `/b2b/dashboard` — no link from B2B listing or account
- `/b2b/register` — no link from anywhere
- `/business/orders` — no link
- `/business/catalog` — no link
- `/business/approvals` — no link
- `/business/team` — no link

### Manage Orphans (37 route files):
Route files exist but are NOT in the manage sidebar module registry, making them unreachable. See Section 6 for the full list.

### Public Storefront Orphans:
- `/flash-sales` — no navigation link
- `/gift-cards` — no navigation link
- `/wallet/` — no navigation link
- `/compare` — only accessible via product cards (if implemented)

---

## 10. Broken Links — Pages Linking to Non-Existent Routes

Links found in components that point to routes with **no matching route file**:

| Component | Link Target | Status | Fix Needed |
|---|---|---|---|
| Account Dashboard | `{prefix}/store` | NO ROUTE — no `/store` route exists | Create route or redirect to `/` |
| Account Dashboard | `{prefix}/account/payment-methods` | NO ROUTE | Create route file |
| Account Dashboard | `{prefix}/account/reviews` | NO ROUTE | Create route file |
| Account Dashboard | `{prefix}/account/quotes` | NO ROUTE | Create route file |
| Account Dashboard | `{prefix}/account/invoices` | NO ROUTE | Create route file |
| Account Dashboard | `{prefix}/subscriptions` | WRONG PATH — should be `/account/subscriptions` | Fix link path |
| Account Dashboard | `{prefix}/bookings` | WRONG PATH — should be `/account/bookings` | Fix link path |
| Quick Actions | `{prefix}/store` | NO ROUTE | Create route or redirect to `/` |
| Quick Actions | `{prefix}/contact` | NO ROUTE | Create route or use `/help` |
| Account Layout | `{prefix}/business` | NO ROUTE — business has sub-pages only | Create index route |
| Account Layout | `{prefix}/business/quotes` | NO ROUTE | Create route file |
| Navbar | `{baseHref}/store` | NO ROUTE — "Shop all" links to non-existent `/store` | Create route or redirect |
| Footer | `{prefix}/privacy` | MAY RESOLVE via dynamic CMS slug route `/{slug}` | Verify CMS page exists |
| Footer | `{prefix}/terms` | MAY RESOLVE via dynamic CMS slug route `/{slug}` | Verify CMS page exists |
| Manage Sidebar | `/manage/navigation` | NO ROUTE FILE | Create route file |
| Manage Sidebar | `/manage/media` | NO ROUTE FILE | Create route file |

---

## Summary Statistics

| Category | Count |
|---|---|
| Total route files | ~240 |
| Public storefront verticals | 29 listing + 29 detail |
| Account routes | 22 |
| Vendor routes | 74 |
| Manage routes | 93 |
| B2B/Business routes | 8 |
| Redirect-only routes | 8 |
| **Orphan routes (no navigation)** | **~118** |
| **Broken links (target doesn't exist)** | **16** |
