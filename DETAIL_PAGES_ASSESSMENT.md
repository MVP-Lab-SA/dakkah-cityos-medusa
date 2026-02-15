# Dakkah CityOS — Detail Pages Deep Assessment

**Date:** February 15, 2026  
**Scope:** All 50 storefront detail pages (excluding account pages)  
**Depth:** Layout blocks, backend route handlers, database schemas, seed data quality, API response fields, data model alignment, image availability, routing mismatches

---

## Executive Summary

| Category | Total | Working | Partial | Broken |
|---|---|---|---|---|
| **Storefront Detail Pages** | 50 | 14 | 14 | 22 |
| **Backend GET /[id] Routes** | 28 exist | 14 return 200 | 3 return errors | 19 missing entirely |
| **Database Tables** | 26 exist | 22 with data | 4 empty | 24 verticals with no table |
| **Image Data** | 26 tables checked | 21 have image URLs | 5 have no images | — |
| **Seeded Listing Data** | 50 needed | 36 have data | — | 14 completely empty |

### Critical Structural Finding

**38 of 50 detail pages are copy-paste templates.** They all reference the exact same 13 generic fields (`address`, `avg_rating`, `banner_url`, `city`, `description`, `location`, `logo_url`, `metadata`, `photo_url`, `price`, `rating`, `review_count`, `thumbnail`) and ignore the unique fields each vertical's backend model actually provides. Only 12 pages have any customized field references.

**5 duplicate page pairs exist** (10 pages total) that fetch from the same backend endpoint and provide nearly identical layouts:
- `campaigns` (181 lines) ↔ `crowdfunding` (248 lines) — both fetch `/store/crowdfunding/{id}`
- `consignment` (213 lines) ↔ `consignment-shop` (212 lines) — both fetch `/store/consignments/{id}`
- `dropshipping` (205 lines) ↔ `dropshipping-marketplace` (211 lines) — both fetch `/store/dropshipping/{id}`
- `print-on-demand` (217 lines) ↔ `print-on-demand-shop` (207 lines) — both fetch `/store/print-on-demand/{id}`
- `white-label` (213 lines) ↔ `white-label-shop` (239 lines) — both fetch `/store/white-label/{id}`

---

## Tier Classification

### Tier 1 — Fully Functional (14 pages)
Backend detail endpoint returns 200, database has seeded rows, API response fields are displayable.

### Tier 2 — Partial (14 pages)
Has seeded listing data, but detail endpoint returns 404/500, or the page template doesn't map to the actual API response fields.

### Tier 3 — Broken (22 pages)
No seeded data, no working detail endpoint, fundamental data model mismatch, or no backend table exists.

---

## Section 1: Database Schema Analysis

### Tables That Exist With Data

| Table Name | Row Count | Has Images | Key Display Fields | Image Storage |
|---|---|---|---|---|
| `auction_listing` | 6 | No (in metadata) | title, description, price, currency | `metadata.images` |
| `vehicle_listing` | 6 | Yes (column) | title, make, model, year, price | `images` JSON array |
| `classified_listing` | 7 | Yes (metadata) | title, description, price, condition | `metadata.images`, `metadata.thumbnail` |
| `crowdfund_campaign` | 5 | Yes (column) | title, description, goal/raised amounts | `images` JSON array |
| `digital_asset` | 6 | Yes (metadata) | title, file_type, file_url | `metadata.images`, `metadata.thumbnail` |
| `class_schedule` | 10 | Yes (metadata) | class_name, description, difficulty | `metadata.images`, `metadata.thumbnail` |
| `gig_listing` | 7 | Yes (metadata) | title, description, price, rating | `metadata.images`, `metadata.thumbnail` |
| `fresh_product` | 8 | Partial (metadata) | storage_type, shelf_life, organic | `metadata.name` (name only in metadata!) |
| `practitioner` | 11 | Yes (column) | name, specialization, bio, rating | `photo_url` |
| `insurance_product` | 7 | No (metadata) | name, description, insurance_type | `metadata.images`, `metadata.thumbnail` |
| `insurance_policy` | 2 | No | policy_number, status, premium | None |
| `attorney_profile` | 8 | Yes (column) | name, specializations, bio, rating | `photo_url` |
| `parking_zone` | 6 | Yes (metadata) | name, description, zone_type, rates | `metadata.images`, `metadata.thumbnail` |
| `pet_profile` | 5 | Yes (column) | name, species, breed, weight | `photo_url` |
| `property_listing` | 7 | Yes (column) | title, description, price, bedrooms | `images` JSON array |
| `rental_product` | 7 | Yes (metadata) | rental_type, base_price, deposit | `metadata.name`, `metadata.images` |
| `restaurant` | 5 | Yes (columns) | name, description, cuisine_types, rating | `logo_url`, `banner_url` |
| `event` | 6 | Yes (column) | title, description, event_type, venue | `image_url` |
| `subscription_plan` | 5 | Partial (metadata) | name, description, price, features | `metadata.seeded` (no images!) |
| `membership_tier` | 6 | No | name, description, benefits, annual_fee | `icon_url` (empty) |
| `membership` | 3 | No | membership_number, status, points | None (customer record) |
| `loyalty_program` | 2 | Partial (metadata) | name, description, points_per_currency | `metadata.welcome_bonus` |
| `warranty_plan` | 5 | Yes (metadata) | name, description, plan_type, price | `metadata.images`, `metadata.thumbnail` |
| `charity_org` | 5 | Yes (column) | name, description, category, website | `logo_url` |
| `vendor` | 10 | Yes (columns) | business_name, description, rating | `logo_url`, `banner_url` |
| `travel_property` | 7 | Yes (column) | name, description, property_type, stars | `images` JSON array |
| `course` | 6 | Yes (column) | title, description, price, rating | `thumbnail_url` |
| `donation_campaign` | 8 | Yes (column) | title, description, goal_amount | `images` JSON array |
| `booking` | 3 | No | booking_number, status, total | None |
| `trade_in` | Table exists | — | — | — |
| `credit_line` | Table exists | — | — | — |

### Tables That Do NOT Exist

These verticals have no dedicated database table at all:

| Vertical | What Route Handler Uses Instead |
|---|---|
| **b2b** | `company` module (Company, PurchaseOrder) — procurement, not products |
| **bundles** | `promotionExt` module (ProductBundle) — `product_bundle` table |
| **consignment** | No module — listing route attempts vendor queries |
| **credit** | Wallet module — `credit_line` table (customer credit, not products) |
| **dropshipping** | `vendor` module — `vendor_product` table (join table, not products) |
| **flash-deals** | `promotionExt` + Medusa promotions — `promotion` table (codes, not deals) |
| **gift-cards** | Medusa core gift cards — `gift_card_ext` table (issued cards, not designs) |
| **newsletter** | Simple module — `newsletter` table doesn't exist, data from notification module |
| **places** | `tenant` module — `tenant_poi` table |
| **print-on-demand** | No module exists |
| **social-commerce** | Data hardcoded in route handler (no table, uses `social_post`/`live_stream` for detail) |
| **try-before-you-buy** | `vendor` module — same `vendor_product` table as dropshipping |
| **volume-deals** | `volume-pricing` module — `volume_pricing` table (pricing tiers, not products) |
| **white-label** | No module exists |

---

## Section 2: Backend Route Handler Analysis

### Detail Endpoint Handler Patterns

| Quality | Count | Pattern | Verticals |
|---|---|---|---|
| **Full with relations** | 3 | Fetches main entity + related records (bids, campaigns, etc.) | auctions (57 lines, broken), bookings (57 lines), charity (24 lines, broken) |
| **Simple retrieve** | 22 | `mod.retrieve[Entity](id)` — single entity fetch, 14-17 lines | automotive, classifieds, crowdfunding, digital, fitness, freelance, government, grocery, legal, parking, pet-services, rentals, travel, warranties, etc. |
| **Complex with auth** | 2 | Requires authentication, multi-step logic | purchase-orders (87 lines), quotes (51 lines) |
| **Dual-entity lookup** | 2 | Tries multiple entity types | charity (CharityOrg then DonationCampaign), social-commerce (GroupBuy then LiveStream) |
| **Missing entirely** | 19 | No `[id]/route.ts` file exists | See Section 3 |

### Detail Endpoint Bugs (3 broken endpoints)

**1. Auctions — 500 Internal Server Error**
- **Root Cause:** Route queries `mod.listBids({ auction_listing_id: id })` but the `bid` table column is named `auction_id`, not `auction_listing_id`
- **Fix:** Change query filter from `auction_listing_id` to `auction_id`
- **File:** `apps/backend/src/api/store/auctions/[id]/route.ts`

**2. Charity — 404 Not Found on valid IDs**
- **Root Cause:** Route calls `mod.retrieveCharityOrg(id)` which throws "not found" (caught silently), then tries `mod.retrieveDonationCampaign(id)` which also fails. The listing endpoint returns items with IDs from the `charity_org` table, but `retrieveCharityOrg()` may have a query filter mismatch or the resolver method doesn't match the module's service method name.
- **File:** `apps/backend/src/api/store/charity/[id]/route.ts`

**3. Social-Commerce — 404 Not Found on valid IDs**
- **Root Cause:** Listing endpoint uses hardcoded seed data (in-memory array with IDs like `sc_001`), but detail endpoint queries `mod.listLiveStreams({ id })` or `mod.listGroupBuys({ id })` against database tables. The hardcoded IDs don't exist in any database table.
- **Fix:** Either store social commerce data in a database table, or have the detail endpoint reference the same hardcoded array.
- **File:** `apps/backend/src/api/store/social-commerce/[id]/route.ts`

### Listing Endpoints With Hardcoded/In-Memory Data (no database)

| Vertical | Data Source | Detail |
|---|---|---|
| **social-commerce** | `SOCIAL_COMMERCE_SEED` array (7 items) in route handler | No database table — data exists only in source code |
| **events** | Database (`event` table, 6 rows) + some inline construction in route | Mixed approach |

### Listing Endpoints Using Wrong Data Model

| Vertical | What Listing Returns | What Detail Page Expects |
|---|---|---|
| **dropshipping** | `vendor_product` join records (vendor_id, product_id, status) | Product with name, description, images, price |
| **try-before-you-buy** | Same `vendor_product` join records | Product with name, description, images, price |
| **flash-deals** | Medusa `promotion` records (code, is_automatic, type) | Deal with name, images, price, discount |
| **memberships** | `membership` customer records (customer_id, points, status) | Plan with name, benefits, price, features |
| **subscriptions** | `subscription` customer records (customer_id, billing_interval) | Plan with name, description, price, features |
| **credit** | `credit_line` records (customer balance) | Credit product with terms, rates |
| **gift-cards** | Medusa gift card records (code, balance) | Gift card design with images, denominations |

---

## Section 3: Per-Vertical Deep Assessment

### Legend
- **DB Table:** The actual PostgreSQL table name and row count
- **API Response Fields:** What the backend detail endpoint actually returns
- **Page Expects:** What the storefront JSX template references via `item.xxx`
- **Field Alignment:** Whether API response fields match what the page template uses
- **Image Pipeline:** Whether images flow from DB → API → Page display

---

### 1. affiliate
| Layer | Status | Detail |
|---|---|---|
| **Tier** | **3 — Broken** |
| **DB Table** | `affiliate` — 0 rows |
| **Backend Listing** | `/store/affiliates` — ERROR (empty response / module resolution failure) |
| **Backend Detail** | `/store/affiliates/[id]` — 16 lines, simple retrieve. Untested (no data). |
| **Page Template** | 180 lines. GENERIC template (13 standard fields). |
| **Page Customization** | None — uses cookie-cutter template |
| **Field Alignment** | Unknown — no API response to compare against |
| **Image Pipeline** | No images in model (no photo_url, no images column) |
| **Gaps** | No seeded data. No images in model. Listing endpoint fails. Generic template. |

---

### 2. auctions
| Layer | Status | Detail |
|---|---|---|
| **Tier** | **2 — Partial** |
| **DB Table** | `auction_listing` — 6 rows. Columns: title, description, auction_type, status, starting_price, reserve_price, buy_now_price, current_price, currency_code, bid_increment, starts_at, ends_at, total_bids |
| **DB Images** | `metadata` column — images stored as metadata JSON but **currently NULL** for all rows. No dedicated images column despite `images` field existing in seed scripts. |
| **Backend Listing** | `/store/auctions` — 200 OK, 5 items returned |
| **Backend Detail** | `/store/auctions/[id]` — **500 ERROR**. Bug: queries `listBids({ auction_listing_id: id })` but `bid` table column is `auction_id`. |
| **API Response (listing)** | `{id, title, description, auction_type, status, starting_price, reserve_price, current_price, currency_code, starts_at, ends_at, total_bids, metadata}` |
| **Page Template** | 262 lines. GENERIC template. Has hero image, sidebar, reviews reference. |
| **Missing from page** | No breadcrumb, no CTA (Place Bid button), no not-found state, no auction countdown timer, no bid history display |
| **Field Alignment** | POOR — Page references `item.price`, `item.rating`, `item.photo_url` but API returns `starting_price`, `current_price`, no rating, no photo_url |
| **Unique fields NOT used by page** | `auction_type`, `starting_price`, `reserve_price`, `buy_now_price`, `current_price`, `bid_increment`, `starts_at`, `ends_at`, `total_bids`, `auto_extend` |
| **Gaps** | Detail endpoint crashes. Page doesn't display any auction-specific fields. No bid UI. No countdown. No images in DB despite metadata field. |

---

### 3. automotive
| Layer | Status | Detail |
|---|---|---|
| **Tier** | **1 — Fully Functional** |
| **DB Table** | `vehicle_listing` — 6 rows. Columns: title, make, model_name, year, mileage_km, fuel_type, transmission, body_type, color, VIN, condition, price, features, images, location_city |
| **DB Images** | `images` column — **YES**, populated with Unsplash URLs (JSON array of strings) |
| **Backend Detail** | `/store/automotive/[id]` — **200 OK** |
| **API Response** | Full vehicle data: `{id, title, make, model_name, year, mileage_km, fuel_type, transmission, body_type, color, vin, condition, price, description, features, images, location_city, location_country, view_count}` |
| **Page Template** | 205 lines. GENERIC template but has some custom sections: hero image, breadcrumb, sidebar, CTAs (Schedule Test Drive, Contact Dealer), details grid (4 sections). |
| **Field Alignment** | POOR despite working — Page references `item.price`, `item.thumbnail` but API returns `price` (integer), `images` (array). Page misses: make, model, year, mileage, fuel_type, transmission, body_type, VIN, features, location. |
| **Unique fields NOT used by page** | `make`, `model_name`, `year`, `mileage_km`, `fuel_type`, `transmission`, `body_type`, `color`, `vin`, `condition`, `features`, `view_count` |
| **Gaps** | Despite 200 OK, the generic template wastes the rich vehicle data. No vehicle spec display. No image gallery for multiple photos. |

---

### 4. b2b
| Layer | Status | Detail |
|---|---|---|
| **Tier** | **3 — Broken** |
| **DB Table** | `company` — for companies. `purchase_order` — for orders. No product-browsing table. |
| **Backend Listing** | `/store/b2b` — 0 items |
| **Backend Detail** | No `[id]` route |
| **Page Template** | 242 lines. CUSTOM template — references `company_name`, `industry`, `employees`, `moq`, `bulk_pricing`, `lead_time`, `certifications`, `products`. |
| **Field Alignment** | N/A — no API to compare |
| **Gaps** | No data model for B2B product browsing. Company module is for company management, not product catalog. Page has custom fields but nothing to display. |

---

### 5. bookings
| Layer | Status | Detail |
|---|---|---|
| **Tier** | **3 — Broken** |
| **DB Table** | `booking` — 3 rows, but these are customer booking records (with booking_number, status, payment_status), not browseable services. `service_product` table — 0 rows. |
| **Backend Detail** | `/store/bookings/[id]` — 57 lines with auth. Retrieves individual booking (requires authentication). |
| **Page Template** | 249 lines. GENERIC template. |
| **Gaps** | The `booking` table has customer appointments, not service listings. `service_product` table is empty. Detail endpoint is for viewing your own booking, not browsing services. Needs a service catalog model. |

---

### 6. bundles
| Layer | Status | Detail |
|---|---|---|
| **Tier** | **2 — Partial** |
| **DB Table** | `product_bundle` — 7 rows. Columns: title, handle, description, bundle_type, discount_type, discount_value, is_active. |
| **DB Images** | metadata — `{price, images, rating, category, thumbnail}` with Unsplash URLs |
| **Backend Listing** | `/store/bundles` — 200 OK, 7 items |
| **Backend Detail** | No `[id]` route — **404** |
| **Page Template** | 210 lines. CUSTOM template — references `item.name`, `item.title`, `item.quantity`, `item.image`. |
| **Field Alignment** | Partial match — page expects `name`, API has `title`. Images in metadata but page references `item.image`. |
| **Gaps** | Missing detail endpoint. Price only in metadata JSON. Page field references don't match API field names. |

---

### 7. campaigns
| Layer | Status | Detail |
|---|---|---|
| **Tier** | **2 — Partial** (DUPLICATE of crowdfunding) |
| **DB Table** | `crowdfund_campaign` — 5 rows (shared with crowdfunding) |
| **Backend Detail** | `/store/crowdfunding/[id]` — **200 OK** (same endpoint as crowdfunding) |
| **API Response** | `{title, description, campaign_type, status, goal_amount, raised_amount, backer_count, starts_at, ends_at, images, reward_tiers[], risks_and_challenges}` |
| **Page Template** | 181 lines. GENERIC template. Very minimal layout — no breadcrumb, no sidebar, no CTAs, no not-found state. |
| **Unique fields NOT used by page** | `campaign_type`, `goal_amount`, `raised_amount`, `backer_count`, `reward_tiers`, `starts_at`, `ends_at`, `risks_and_challenges` |
| **Gaps** | Duplicate page sharing same backend as crowdfunding. Severely minimal layout. Ignores all crowdfunding-specific fields like progress bar, reward tiers, timeline. |

---

### 8. charity
| Layer | Status | Detail |
|---|---|---|
| **Tier** | **2 — Partial** |
| **DB Table** | `charity_org` — 5 rows. `donation_campaign` — 8 rows. |
| **DB Images** | `logo_url` on charity_org — **YES**, Unsplash URLs. `images` on donation_campaign — **YES**. |
| **Backend Detail** | `/store/charity/[id]` — **404** on valid IDs. Bug: `retrieveCharityOrg(id)` throws, falls to `retrieveDonationCampaign(id)` which also fails. Likely module service method name mismatch. |
| **Page Template** | 243 lines. GENERIC template but has Share, CTAs (Donate). |
| **Gaps** | Detail endpoint query bug. Rich data exists in DB but unreachable. |

---

### 9. classifieds
| Layer | Status | Detail |
|---|---|---|
| **Tier** | **1 — Fully Functional** |
| **DB Table** | `classified_listing` — 7 rows. All key fields populated. |
| **DB Images** | `metadata` — `{images: [...], thumbnail: "..."}` — **YES**, Unsplash URLs |
| **Backend Detail** | `/store/classifieds/[id]` — **200 OK** |
| **API Response** | `{id, title, description, category_id, listing_type, condition, price, currency_code, is_negotiable, location_city, location_state, location_country, metadata}` |
| **Page Template** | 222 lines. CUSTOM template — references `item.title`, `item.category`, `item.condition`, `item.seller`, `item.details`. |
| **Field Alignment** | Good — page has custom fields that roughly match API. But `seller` field doesn't exist in API (seller_id only). |
| **Gaps** | `ListingImage` model exists in DB but not used by API (images only in metadata). No gallery despite image model. |

---

### 10. consignment
| Layer | Status | Detail |
|---|---|---|
| **Tier** | **3 — Broken** |
| **DB Table** | No dedicated table. Route queries vendor/consignment module. |
| **Backend Listing** | `/store/consignments` — 0 items |
| **Backend Detail** | No `[id]` route |
| **Page Template** | 213 lines. CUSTOM template — references `item.brand`, `item.condition`, `item.consignor`, `item.commission_rate`, `item.original_price`. |
| **Gaps** | DUPLICATE with consignment-shop. No data model. Custom template has fields that don't match any existing model. |

---

### 11. consignment-shop
| Layer | Status | Detail |
|---|---|---|
| **Tier** | **3 — Broken** (DUPLICATE of consignment) |
| **Page Template** | 212 lines. CUSTOM template — references `item.brand`, `item.authenticity`, `item.provenance`, `item.material`, `item.color`, `item.size`. |
| **Gaps** | Same backend as consignment. Both pages are empty. |

---

### 12. credit
| Layer | Status | Detail |
|---|---|---|
| **Tier** | **3 — Broken** |
| **DB Table** | `credit_line` — exists. Model is for customer store credit, not browseable credit products. |
| **Backend Listing** | `/store/credit` — 0 items (lists customer credit lines) |
| **Backend Detail** | No `[id]` route |
| **Page Template** | 259 lines. GENERIC template. |
| **Gaps** | Fundamental model mismatch — store credit vs credit products. |

---

### 13. crowdfunding
| Layer | Status | Detail |
|---|---|---|
| **Tier** | **1 — Fully Functional** |
| **DB Table** | `crowdfund_campaign` — 5 rows |
| **DB Images** | `images` column — **YES**, Unsplash URL arrays |
| **Backend Detail** | `/store/crowdfunding/[id]` — **200 OK** |
| **API Response** | `{title, description, campaign_type, goal_amount, raised_amount, backer_count, images, reward_tiers[{id, title, description, price, estimated_delivery, limited_quantity}], risks_and_challenges, starts_at, ends_at}` |
| **Page Template** | 248 lines. GENERIC template. Has Share. |
| **Unique fields NOT used by page** | `campaign_type`, `goal_amount`, `raised_amount`, `backer_count`, `reward_tiers`, `starts_at`, `ends_at`, `risks_and_challenges` |
| **Gaps** | Page ignores all crowdfunding-specific data: no progress bar, no reward tier cards, no backer count, no campaign deadline countdown. Missing CTAs (Back This Project). |

---

### 14. digital
| Layer | Status | Detail |
|---|---|---|
| **Tier** | **2 — Partial** (data works, layout severely lacking) |
| **DB Table** | `digital_asset` — 6 rows |
| **DB Images** | `metadata` — `{images: [...], thumbnail: "...", cover_image: "...", price_sar: N}` — **YES** |
| **Backend Detail** | `/store/digital-products/[id]` — **200 OK** |
| **API Response** | `{title, file_type, file_size_bytes, file_url, preview_url, version, max_downloads, is_active, metadata}` |
| **Page Template** | 181 lines. GENERIC template. No breadcrumb, no sidebar, no CTAs. |
| **Unique fields NOT used by page** | `file_type`, `file_size_bytes`, `preview_url`, `version`, `max_downloads`, `metadata.price_sar`, `metadata.pages`, `metadata.author` |
| **Gaps** | Very minimal layout despite working endpoint. Price buried in metadata. No Download/Buy button. No file type display. |

---

### 15-16. dropshipping + dropshipping-marketplace
| Layer | Status | Detail |
|---|---|---|
| **Tier** | **3 — Broken** (both pages) |
| **DB Table** | `vendor_product` — 12 rows. Columns: vendor_id, product_id, status, fulfillment_method, lead_time_days. **No name, description, images, or price.** |
| **Backend Listing** | `/store/dropshipping` — returns 12 `vendor_product` join records |
| **Backend Detail** | No `[id]` route |
| **Page Templates** | dropshipping: 205 lines GENERIC. dropshipping-marketplace: 211 lines GENERIC. |
| **Fundamental Issue** | `vendor_product` is a many-to-many join table linking vendors to products. It has no display fields. These pages need to query the linked `product` records with their names, images, and prices instead. |

---

### 17. education
| Layer | Status | Detail |
|---|---|---|
| **Tier** | **2 — Partial** (just needs detail endpoint) |
| **DB Table** | `course` — 6 rows. Rich model: title, description, category, level, format, language, price, duration_hours, total_lessons, total_enrollments, avg_rating, thumbnail_url, preview_video_url, syllabus, prerequisites, tags |
| **DB Images** | `thumbnail_url` — **YES**, Unsplash URLs |
| **Backend Listing** | `/store/education` — 200 OK, 6 items |
| **Backend Detail** | **No `[id]` route — 404** |
| **Page Template** | 263 lines. GENERIC template but has good layout: hero, breadcrumb, sidebar, CTAs (Enroll Now), reviews (7 refs), share. |
| **Priority** | **HIGH** — rich data model, good layout, just needs 16-line detail endpoint. |

---

### 18. events
| Layer | Status | Detail |
|---|---|---|
| **Tier** | **2 — Partial** |
| **DB Table** | `event` — 6 rows. Columns: title, description, event_type, status, address, starts_at, ends_at, is_online, max_capacity, image_url |
| **DB Images** | `image_url` — **YES**, Unsplash URLs |
| **Backend Listing** | `/store/events` — 200 OK, 8 items (6 DB + 2 constructed) |
| **Backend Detail** | **No `[id]` route — 404** |
| **Page Template** | 319 lines (longest page). GENERIC template. Has share (4 refs). |
| **Missing from page** | No breadcrumb, no CTAs (Buy Tickets), no not-found state |
| **Unique fields NOT used** | `event_type`, `venue_id`, `starts_at`, `ends_at`, `is_online`, `online_url`, `max_capacity`, `current_attendees`, `image_url`, `organizer_name` |
| **Priority** | **HIGH** — 319 lines of layout but none of the event-specific data is used. |

---

### 19. financial
| Layer | Status | Detail |
|---|---|---|
| **Tier** | **3 — Broken** |
| **DB Table** | No `financial` table. Uses `financial-product` module. |
| **Backend Listing** | `/store/financial` — ERROR. But `/store/financial-products` route exists. |
| **Backend Detail** | `/store/financial-products/[id]` — route exists |
| **Page Template** | 245 lines. GENERIC template. Fetches `/store/financial/${id}` but backend route is `/store/financial-products/[id]` |
| **Routing Mismatch** | Page fetches `/store/financial/{id}` → No such route. Backend has `/store/financial-products/[id]`. |
| **Gaps** | Endpoint naming mismatch between storefront and backend. |

---

### 20. fitness
| Layer | Status | Detail |
|---|---|---|
| **Tier** | **1 — Fully Functional** |
| **DB Table** | `class_schedule` — 10 rows |
| **DB Images** | `metadata` — `{price: N, images: [...], rating: N, category: "...", thumbnail: "..."}` — **YES** |
| **Backend Detail** | `/store/fitness/[id]` — **200 OK** |
| **API Response** | `{class_name, description, class_type, day_of_week, start_time, end_time, duration_minutes, max_capacity, current_enrollment, difficulty, room, metadata}` |
| **Page Template** | 228 lines. CUSTOM template — references `item.name`, `item.instructor`, `item.duration`, `item.level`, `item.schedule`, `item.benefits`, `item.membership_options`. |
| **Field Alignment** | PARTIAL — page expects `name` (API has `class_name`), `instructor` (API has no instructor data), `level` (API has `difficulty`). |
| **Unique fields NOT used** | `class_type`, `day_of_week`, `start_time`, `end_time`, `max_capacity`, `current_enrollment`, `room`, `is_recurring` |

---

### 21. flash-deals
| Layer | Status | Detail |
|---|---|---|
| **Tier** | **3 — Broken** |
| **DB Table** | Uses Medusa `promotion` table — 3 records with `code`, `is_automatic`, `type`, `status`, `campaign_id`. |
| **Backend Listing** | `/store/flash-sales` — returns Medusa promotion records |
| **Fundamental Issue** | Promotions are discount codes/rules, not product deals. A flash deal page needs products with their original price, discounted price, countdown timer, and stock quantity. |
| **Gaps** | Complete model mismatch. Need a `flash_deal` table linking promotions to products with deal-specific fields. |

---

### 22. freelance
| Layer | Status | Detail |
|---|---|---|
| **Tier** | **1 — Fully Functional** |
| **DB Table** | `gig_listing` — 7 rows. Rich: title, description, category, price, hourly_rate, delivery_time_days, skill_tags, avg_rating, portfolio_urls |
| **DB Images** | `metadata` — `{images: [...], thumbnail: "..."}` — **YES** |
| **Backend Detail** | `/store/freelance/[id]` — **200 OK** |
| **API Response** | `{title, description, category, subcategory, listing_type, price, hourly_rate, currency_code, delivery_time_days, revisions_included, skill_tags, avg_rating, portfolio_urls, metadata}` |
| **Page Template** | 246 lines. GENERIC template but has Reviews (8 refs). |
| **Unique fields NOT used** | `category`, `subcategory`, `listing_type`, `hourly_rate`, `delivery_time_days`, `revisions_included`, `skill_tags`, `portfolio_urls` |
| **Gaps** | Generic template wastes rich freelancer data. No skill tags display, no portfolio gallery, no delivery time info, no reviews form. |

---

### 23. gift-cards-shop
| Layer | Status | Detail |
|---|---|---|
| **Tier** | **2 — Partial** |
| **DB Table** | `gift_card_ext` — 8 rows. Customer-issued gift cards: code, currency_code, sender_name, recipient_email. |
| **DB Images** | `metadata` — `{design, images, category, thumbnail}` — images in metadata |
| **Backend Detail** | **No `[id]` route — 404** |
| **Fundamental Issue** | Data model is issued gift cards (with codes, balances), not a gift card design catalog. Page expects browseable gift card designs with images and denominations. |

---

### 24. government
| Layer | Status | Detail |
|---|---|---|
| **Tier** | **1 — Fully Functional** (but only 2 items) |
| **DB Table** | No `government_service_request` table found (may use different name). API returns 2 items. |
| **Backend Detail** | `/store/government/[id]` — **200 OK** |
| **API Response** | `{title, description, request_type, category, location, status, priority, department, photos}` |
| **Page Template** | 247 lines. GENERIC template. |
| **Gaps** | Very few items. Generic template. API has `photos` field but page doesn't render them. |

---

### 25. grocery
| Layer | Status | Detail |
|---|---|---|
| **Tier** | **1 — Fully Functional** (but very sparse data) |
| **DB Table** | `fresh_product` — 8 rows. Columns: storage_type, shelf_life_days, origin_country, organic, unit_type, nutrition_info. **Name only in metadata!** |
| **DB Images** | `metadata` — `{name: "...", seeded: true}` — **NO dedicated images** |
| **Backend Detail** | `/store/grocery/[id]` — **200 OK** |
| **API Response** | `{id, storage_type, shelf_life_days, origin_country, organic, unit_type, min_order_quantity, nutrition_info, metadata}` — **No name, no price, no images in response** |
| **Page Template** | 249 lines. CUSTOM template — references `item.name`, `item.value`. Has Related items (5 refs — unique among all pages). |
| **Field Alignment** | VERY POOR — page expects `name`, `price`, `thumbnail` but API returns none of these directly. Name buried in metadata. No price anywhere. |
| **Gaps** | Grocery product model needs name, price, images, and description as first-class fields, not metadata. |

---

### 26. healthcare
| Layer | Status | Detail |
|---|---|---|
| **Tier** | **2 — Partial** (just needs detail endpoint) |
| **DB Table** | `practitioner` — 11 rows. Rich: name, title, specialization, bio, education, experience_years, consultation_fee, rating, photo_url, languages |
| **DB Images** | `photo_url` — **YES**, Unsplash URLs |
| **Backend Detail** | **No `[id]` route — 404** |
| **Page Template** | 220 lines. GENERIC template. Has Reviews (8 refs). |
| **Priority** | **HIGH** — 11 items with rich data, images, rating. Just needs 16-line detail endpoint. |

---

### 27. insurance
| Layer | Status | Detail |
|---|---|---|
| **Tier** | **2 — Partial** |
| **DB Table** | `insurance_product` — 7 rows. Rich: name, description, insurance_type, coverage_details, deductible_options, term_options, claim_process, exclusions. |
| **DB Images** | `metadata` — `{images: [...], thumbnail: "..."}` — **YES** in metadata |
| **Backend Listing** | `/store/insurance` — uses `financialProduct` module to list insurance products. |
| **Backend Detail** | **No `[id]` route — 404** |
| **Page Template** | 237 lines. GENERIC template. Details grid (4 sections). |
| **Priority** | **MEDIUM** — good data model, just needs detail endpoint. |

---

### 28. legal
| Layer | Status | Detail |
|---|---|---|
| **Tier** | **1 — Fully Functional** |
| **DB Table** | `attorney_profile` — 8 rows. Rich: name, bar_number, specializations, practice_areas, bio, education, experience_years, hourly_rate, rating, photo_url, languages |
| **DB Images** | `photo_url` — **YES**, Unsplash URLs |
| **Backend Detail** | `/store/legal/[id]` — **200 OK** |
| **API Response** | `{name, bar_number, specializations, practice_areas, bio, education, experience_years, hourly_rate, currency_code, rating, total_cases, photo_url, languages}` |
| **Page Template** | 249 lines. GENERIC template. Reviews (8 refs). |
| **Unique fields NOT used** | `bar_number`, `specializations`, `practice_areas`, `education`, `experience_years`, `hourly_rate`, `total_cases`, `languages` |
| **Gaps** | Rich API data completely ignored by generic template. No attorney credentials display, no rate display, no case history. |

---

### 29. loyalty-program
| Layer | Status | Detail |
|---|---|---|
| **Tier** | **3 — Broken** |
| **DB Table** | `loyalty_program` — 2 rows. Very minimal: name, description, points_per_currency. |
| **Backend Detail** | No `[id]` route |
| **Page Template** | 199 lines. GENERIC template. |
| **Gaps** | No detail endpoint. Model is a program definition, not individual rewards to browse. |

---

### 30. memberships
| Layer | Status | Detail |
|---|---|---|
| **Tier** | **3 — Broken** |
| **DB Table** | `membership` — 3 rows (customer records). `membership_tier` — 6 rows (tier definitions with name, description, benefits, annual_fee). |
| **Backend Listing** | `/store/memberships` — returns `membership` records (customer's membership status, not browseable plans) |
| **Backend Detail** | No `[id]` route |
| **Page Template** | 185 lines. GENERIC template. No breadcrumb, no CTAs. |
| **Fundamental Issue** | Listing serves customer memberships but page should display `membership_tier` records for browsing. |
| **Fix Required** | Change listing to serve `membership_tier` records; add detail endpoint for tiers. |

---

### 31. newsletter
| Layer | Status | Detail |
|---|---|---|
| **Tier** | **2 — Partial** |
| **DB Table** | No dedicated table found. Backend uses notification module. |
| **Backend Listing** | `/store/newsletters` — 3 items |
| **Backend Detail** | No `[id]` route — 404 |
| **Page Template** | 259 lines. CUSTOM template — references `item.title`, `item.subject`, `item.date`, `item.excerpt`, `item.preview`. Has CTAs (Subscribe — 6 refs). |
| **Gaps** | Missing detail endpoint. Custom template but no data to display. |

---

### 32. parking
| Layer | Status | Detail |
|---|---|---|
| **Tier** | **1 — Fully Functional** |
| **DB Table** | `parking_zone` — 6 rows. Rich: name, description, zone_type, address, lat/lng, rates (hourly/daily/monthly), operating_hours, ev_charging, disabled_spots |
| **DB Images** | `metadata` — `{images: [...], thumbnail: "..."}` — **YES** |
| **Backend Detail** | `/store/parking/[id]` — **200 OK** |
| **API Response** | `{name, description, zone_type, address, latitude, longitude, total_spots, available_spots, hourly_rate, daily_rate, monthly_rate, operating_hours, has_ev_charging, metadata}` |
| **Page Template** | 245 lines. GENERIC template. |
| **Unique fields NOT used** | `zone_type`, `latitude`, `longitude`, `total_spots`, `available_spots`, `hourly_rate`, `daily_rate`, `monthly_rate`, `operating_hours`, `has_ev_charging`, `has_disabled_spots` |
| **Gaps** | Missing CTA (Reserve Spot). Rich location and pricing data completely ignored. No map display despite lat/lng. |

---

### 33. pet-services
| Layer | Status | Detail |
|---|---|---|
| **Tier** | **1 — Fully Functional** |
| **DB Table** | `pet_profile` — 5 rows. Columns: name, species, breed, date_of_birth, weight_kg, color, gender, is_neutered, microchip_id, photo_url |
| **DB Images** | `photo_url` — **YES**, Unsplash URLs |
| **Backend Detail** | `/store/pet-services/[id]` — **200 OK** |
| **Page Template** | 246 lines. GENERIC template. Has CTAs (Book Appointment, Contact Provider), Reviews (2 refs). |
| **Note** | Data model is pet profiles, not service provider listings. Works as a pet detail page but the "pet-services" page name implies service marketplace. |

---

### 34. places
| Layer | Status | Detail |
|---|---|---|
| **Tier** | **3 — Broken** |
| **DB Table** | `tenant_poi` — 0 rows |
| **Backend Listing** | `/store/content/pois` — 0 items |
| **Backend Detail** | `/store/content/pois/[id]` — route exists, untested |
| **Page Template** | **83 lines** — the most underdeveloped page. Only has a single review reference. No breadcrumb, no sidebar, no hero, no CTAs, no img tag, no not-found state. |
| **Gaps** | Virtually empty page. No data. Needs complete rebuild. |

---

### 35-36. print-on-demand + print-on-demand-shop
| Layer | Status | Detail |
|---|---|---|
| **Tier** | **3 — Broken** (both) |
| **DB Table** | No table exists. No backend module. |
| **Backend Listing** | `/store/print-on-demand` — ERROR (non-JSON response) |
| **Backend Detail** | No `[id]` route |
| **Page Templates** | print-on-demand: 217 lines. print-on-demand-shop: 207 lines. |
| **Gaps** | No data model exists at all. No module. Both pages are duplicates. |

---

### 37. quotes
| Layer | Status | Detail |
|---|---|---|
| **Tier** | **3 — Broken** |
| **DB Table** | `quote` table may exist (Medusa core). Module has QuoteItem. |
| **Backend Listing** | `/store/quotes` — 0 items |
| **Backend Detail** | `/store/quotes/[id]` — 51 lines, requires auth. |
| **Page Template** | **74 lines** — second most underdeveloped. Only 2 details grid refs. No breadcrumb, sidebar, hero, CTAs, images, not-found state. |
| **Gaps** | Quotes are B2B request-for-quote records, not browseable products. Page needs complete rebuild. No data. |

---

### 38. real-estate
| Layer | Status | Detail |
|---|---|---|
| **Tier** | **2 — Partial** (just needs detail endpoint) |
| **DB Table** | `property_listing` — 7 rows. Rich: title, description, listing_type, property_type, price, address, bedrooms, bathrooms, area_sqm, year_built, features, images, virtual_tour_url |
| **DB Images** | `images` column — **YES**, Unsplash URL arrays |
| **Backend Detail** | **No `[id]` route — 404** |
| **Page Template** | 213 lines. GENERIC template. Has CTAs (Schedule Viewing, Contact Agent — 4). |
| **Priority** | **HIGH** — rich data model with images, just needs 16-line detail endpoint. |

---

### 39. rentals
| Layer | Status | Detail |
|---|---|---|
| **Tier** | **1 — Fully Functional** |
| **DB Table** | `rental_product` — 7 rows |
| **DB Images** | `metadata` — `{name: "...", images: [...], description: "..."}` — **YES** |
| **Backend Detail** | `/store/rentals/[id]` — **200 OK** |
| **API Response** | `{rental_type, base_price, currency_code, deposit_amount, late_fee_per_day, min_duration, max_duration, is_available, total_rentals, metadata}` |
| **Page Template** | 288 lines. GENERIC template but **only page with gallery support** (3 gallery refs), Tabs (2), Reviews (2). |
| **Missing** | No breadcrumb, no sidebar, no CTAs (Rent Now), no not-found state despite being one of the more complete pages. |
| **Gaps** | Name and description only in metadata. Missing key layout blocks despite having gallery code. |

---

### 40. restaurants
| Layer | Status | Detail |
|---|---|---|
| **Tier** | **2 — Partial** (just needs detail endpoint) |
| **DB Table** | `restaurant` — 5 rows. Rich: name, description, cuisine_types, address, lat/lng, operating_hours, rating, total_reviews, logo_url, banner_url, min_order_amount, delivery_fee, avg_prep_time |
| **DB Images** | `logo_url` + `banner_url` — **YES**, Unsplash URLs |
| **Backend Detail** | **No `[id]` route — 404** |
| **Page Template** | 229 lines. GENERIC template. Has Tabs (1, for menu), Reviews (9 refs). |
| **Related Tables** | `menu_item`, `menu_category`, `restaurant_hours` — rich ecosystem exists |
| **Priority** | **HIGH** — very rich model with images, menu system, reviews. Just needs detail endpoint. |

---

### 41. social-commerce
| Layer | Status | Detail |
|---|---|---|
| **Tier** | **2 — Partial** |
| **DB Table** | No `social_seller` table. Listing data is **hardcoded in route handler** as `SOCIAL_COMMERCE_SEED` array. |
| **Backend Listing** | `/store/social-commerce` — returns hardcoded array (7 items with IDs like `sc_001`) |
| **Backend Detail** | `/store/social-commerce/[id]` — queries `live_streams` or `group_buys` tables. **Mismatch: listing IDs (`sc_001`) don't exist in any DB table.** |
| **Page Template** | 225 lines. GENERIC template. Has Share (6 refs), Reviews (8 refs). |
| **Fundamental Issue** | Listing = hardcoded data. Detail = DB query. IDs don't match. Must either store data in DB or use same hardcoded array in detail endpoint. |

---

### 42. subscriptions
| Layer | Status | Detail |
|---|---|---|
| **Tier** | **3 — Broken** |
| **DB Table** | `subscription` — 6 rows (customer records). `subscription_plan` — 5 rows (plan definitions: name, description, price, features, billing_interval). |
| **Backend Listing** | `/store/subscriptions` — returns customer `subscription` records |
| **Backend Detail** | Management routes exist (cancel, pause, resume) but **no GET `[id]` for browsing** |
| **Page Template** | 241 lines. CUSTOM template — references `item.question`, `item.answer` (FAQ pattern). |
| **Fundamental Issue** | Listing serves customer subscriptions, not browseable plans. Should serve `subscription_plan` records. Plans table has 5 rows with name, price, features. |
| **Fix Required** | Create plan listing endpoint + detail endpoint querying `subscription_plan` table. |

---

### 43. trade-in
| Layer | Status | Detail |
|---|---|---|
| **Tier** | **3 — Broken** |
| **DB Table** | `trade_in` — exists in `automotive` module. Model is for trade-in evaluations (vehicle appraisals), not browseable listings. |
| **Backend Listing** | `/store/trade-in` — 0 items |
| **Backend Detail** | No `[id]` route |
| **Page Template** | 219 lines. CUSTOM template — references `item.brand`, `item.condition`, `item.trade_in_value`, `item.offered_value`, `item.original_price`, `item.requirements`. |
| **Gaps** | Model is evaluation records, not product listings. Custom template has relevant fields but no data. |

---

### 44. travel
| Layer | Status | Detail |
|---|---|---|
| **Tier** | **1 — Fully Functional** |
| **DB Table** | `travel_property` — 7 rows. Rich: name, description, property_type, star_rating, address, city, lat/lng, check_in_time, check_out_time, images, amenities |
| **DB Images** | `images` column — **YES**, Unsplash URL arrays |
| **Backend Detail** | `/store/travel/[id]` — **200 OK** |
| **API Response** | `{name, description, property_type, star_rating, address, city, country_code, check_in_time, check_out_time, images, room_types[{id, name, description, base_price, max_occupancy, amenities}], avg_rating}` |
| **Page Template** | 286 lines. GENERIC template. Has Reviews (8 refs), CTAs (Book Now, Contact — 2). |
| **Unique fields NOT used** | `property_type`, `star_rating`, `check_in_time`, `check_out_time`, `room_types`, `amenities`, `policies` |
| **Gaps** | Generic template ignores room types, amenities, check-in/out times, star rating display. No room selection UI. |

---

### 45. try-before-you-buy
| Layer | Status | Detail |
|---|---|---|
| **Tier** | **3 — Broken** |
| **Identical to** | dropshipping — same `vendor_product` join table, same model mismatch |

---

### 46. vendors
| Layer | Status | Detail |
|---|---|---|
| **Tier** | **2 — Partial** (routing mismatch) |
| **DB Table** | `vendor` — 10 rows. Rich: handle, business_name, description, logo_url, banner_url, rating, review_count, total_products, total_orders, commission_type |
| **DB Images** | `logo_url` + `banner_url` — **YES**, Unsplash URLs |
| **Backend Detail** | `/store/vendors/[handle]` — uses **handle** parameter, not ID |
| **Page Template** | 293 lines (second longest). GENERIC template. Reviews (18 refs — most of any page), Share. |
| **Routing Mismatch** | Page fetches `/store/vendors/${params.id}` but backend route is `/store/vendors/[handle]` |
| **Fix Required** | Either change page to use handle param or add ID-based lookup to backend. |

---

### 47. volume-deals
| Layer | Status | Detail |
|---|---|---|
| **Tier** | **3 — Broken** |
| **DB Table** | `volume_pricing` + `volume_pricing_tier` — pricing rules, not browseable products |
| **Backend Listing** | ERROR (endpoint returns non-JSON) |
| **Backend Detail** | No `[id]` route |
| **Page Template** | 225 lines. CUSTOM template — references `item.product_name`, `item.base_price`, `item.volume_tiers`, `item.pricing_tiers`. |
| **Gaps** | Model is pricing tiers attached to products, not standalone deal listings. |

---

### 48. warranties
| Layer | Status | Detail |
|---|---|---|
| **Tier** | **1 — Fully Functional** |
| **DB Table** | `warranty_plan` — 5 rows. Columns: name, description, plan_type, duration_months, price, coverage, exclusions |
| **DB Images** | `metadata` — `{images: [...], thumbnail: "..."}` — **YES** |
| **Backend Detail** | `/store/warranties/[id]` — **200 OK** |
| **API Response** | `{name, description, plan_type, duration_months, price, currency_code, coverage{}, exclusions[], is_active}` |
| **Page Template** | 257 lines. CUSTOM template — references `item.name`, `item.question`, `item.answer`. |
| **Unique fields NOT used** | `plan_type`, `duration_months`, `coverage`, `exclusions` |
| **Gaps** | Missing CTAs (Purchase Plan). No hero image or img tag despite images in metadata. Coverage details and exclusions not displayed. |

---

### 49-50. white-label + white-label-shop
| Layer | Status | Detail |
|---|---|---|
| **Tier** | **3 — Broken** (both) |
| **DB Table** | No table. No module. |
| **Backend Listing** | `/store/white-label` — ERROR (non-JSON) |
| **Backend Detail** | No `[id]` route |
| **Page Templates** | white-label: 213 lines. white-label-shop: 239 lines. Both GENERIC. |
| **Gaps** | No data model, no module, no backend. Both pages are duplicates. |

---

## Section 4: Cross-Cutting Issues

### 4.1 Cookie-Cutter Template Problem

**38 of 50 pages** reference the identical 13 fields:
```
address, avg_rating, banner_url, city, description, location, 
logo_url, metadata, photo_url, price, rating, review_count, thumbnail
```

But most backend models use completely different field names:
| Page References | Actual API Field | Verticals Affected |
|---|---|---|
| `item.price` | `starting_price`, `hourly_rate`, `consultation_fee`, `base_price`, `premium_amount`, `annual_fee` | auctions, freelance, legal, rentals, insurance, memberships |
| `item.photo_url` | `images[]`, `thumbnail_url`, `logo_url`, `banner_url`, `image_url` | Most verticals use arrays or different field names |
| `item.rating` | `avg_rating`, `star_rating` | fitness, freelance, travel |
| `item.thumbnail` | `metadata.thumbnail`, `thumbnail_url`, `preview_url` | All metadata-based verticals |
| `item.address` | `address_line1`, `location_city` + `location_country` | automotive, real-estate, travel |

### 4.2 Image Storage Inconsistency

Three different patterns used across verticals:

| Pattern | Count | Tables Using |
|---|---|---|
| **Dedicated column** (`images` JSON array, `photo_url`, `logo_url`, `image_url`) | 13 | vehicle_listing, crowdfund_campaign, property_listing, travel_property, practitioner, attorney_profile, pet_profile, restaurant, event, charity_org, vendor, course, donation_campaign |
| **Metadata JSON** (`metadata.images`, `metadata.thumbnail`) | 10 | classified_listing, digital_asset, class_schedule, gig_listing, parking_zone, rental_product, insurance_product, warranty_plan, fresh_product, product_bundle |
| **No images at all** | 3+ | auction_listing (metadata NULL), insurance_policy, membership, subscription |

### 4.3 Endpoint Naming Inconsistencies

| Storefront Page Fetches | Backend Route Exists At | Mismatch Type |
|---|---|---|
| `/store/financial/${id}` | `/store/financial-products/[id]` | Different path name |
| `/store/vendors/${id}` | `/store/vendors/[handle]` | Parameter type (id vs handle) |
| `/store/events/${id}` | No `[id]` route | Missing entirely |
| `/store/healthcare/${id}` | No `[id]` route | Missing entirely |
| `/store/restaurants/${id}` | No `[id]` route | Missing entirely |
| `/store/real-estate/${id}` | No `[id]` route | Missing entirely |
| `/store/education/${id}` | No `[id]` route | Missing entirely |
| `/store/insurance/${id}` | No `[id]` route | Missing entirely |

### 4.4 Data Source Inconsistencies

| Pattern | Verticals |
|---|---|
| **Database-backed listing + detail** | automotive, classifieds, crowdfunding, digital, fitness, freelance, government, grocery, legal, parking, pet-services, rentals, travel, warranties |
| **Database-backed listing, missing detail endpoint** | education, events, healthcare, insurance, real-estate, restaurants |
| **Hardcoded data in route handler** | social-commerce (7 items in JS array) |
| **Wrong entity type in listing** | dropshipping, try-before-you-buy (join tables), flash-deals (promotions), memberships (customer records), subscriptions (customer records) |
| **Broken listing endpoint** | affiliate, financial, print-on-demand, volume-deals, white-label |
| **No backend at all** | print-on-demand, white-label (no module exists) |

---

## Section 5: Priority Action Matrix

### P0 — Critical (User sees errors or empty pages)

| # | Action | Impact | Effort | Verticals |
|---|---|---|---|---|
| 1 | **Fix auctions detail bug** — change `auction_listing_id` to `auction_id` in bid query | Unblocks 1 vertical | 1 line change | auctions |
| 2 | **Fix charity detail bug** — debug retrieveCharityOrg method resolution | Unblocks 1 vertical | ~15 min | charity |
| 3 | **Fix social-commerce listing/detail mismatch** — either persist seed data to DB or query same array in detail | Unblocks 1 vertical | ~30 min | social-commerce |
| 4 | **Create 6 high-priority detail endpoints** (16 lines each) for verticals with rich data models | Unblocks 6 verticals | ~1 hour | education, healthcare, restaurants, real-estate, events, insurance |
| 5 | **Fix financial routing mismatch** — align page URL with backend route | Unblocks 1 vertical | 1 line change | financial |
| 6 | **Fix vendors routing** — change page to use handle or add ID lookup | Unblocks 1 vertical | ~15 min | vendors |

### P1 — High Priority (Data model fixes)

| # | Action | Impact | Effort | Verticals |
|---|---|---|---|---|
| 7 | **Create remaining 13 detail endpoints** for verticals with some data | Unblocks 13 verticals | ~2 hours | bundles, gift-cards, loyalty, newsletter, b2b, trade-in, consignment, etc. |
| 8 | **Fix 5 data model mismatches** — change listing endpoints to serve correct entity types | Fixes data quality | ~3 hours | memberships→tiers, subscriptions→plans, dropshipping/try-before-buy→products, flash-deals→deals |
| 9 | **Fix 5 broken listing endpoints** | Unblocks 5 verticals | ~2 hours | affiliate, financial, print-on-demand, volume-deals, white-label |
| 10 | **Seed data for 14 empty verticals** | Enables testing | ~4 hours | affiliate, b2b, bookings, consignment, credit, financial, loyalty, places, print-on-demand, quotes, trade-in, volume-deals, white-label |

### P2 — Medium Priority (Template customization)

| # | Action | Impact | Effort | Verticals |
|---|---|---|---|---|
| 11 | **Customize 38 generic templates** to use each vertical's actual API fields | Major UX improvement | ~16 hours | All generic pages |
| 12 | **Rebuild places page** (83 lines → ~250 lines) | Fixes broken page | ~1 hour | places |
| 13 | **Rebuild quotes page** (74 lines → ~250 lines) | Fixes broken page | ~1 hour | quotes |
| 14 | **Add missing layout blocks** — breadcrumbs (8), CTAs (7), not-found states (6), sidebars (5) | UX consistency | ~4 hours | Various |
| 15 | **Resolve 5 duplicate page pairs** — either merge or differentiate | Reduces maintenance | ~3 hours | consignment/shop, dropshipping/marketplace, POD/shop, white-label/shop, campaigns/crowdfunding |

### P3 — Polish (Production quality)

| # | Action | Impact | Effort | Verticals |
|---|---|---|---|---|
| 16 | **Add image gallery component** — useable across all verticals | Major UX improvement | ~3 hours | All 50 pages |
| 17 | **Add related/similar items** sections | Engagement boost | ~2 hours | All pages |
| 18 | **Standardize image storage** — migrate metadata images to dedicated columns | Data consistency | ~4 hours | 10 verticals using metadata |
| 19 | **Add share/bookmark** functionality | Feature completeness | ~2 hours | 38 pages missing it |
| 20 | **Migrate hardcoded data to database** | Data integrity | ~1 hour | social-commerce |

---

## Section 6: Quick Wins (< 30 minutes each)

1. Fix auctions bid query — 1 line change
2. Fix financial route URL — 1 line change
3. Create education detail endpoint — 16 lines
4. Create healthcare detail endpoint — 16 lines
5. Create restaurants detail endpoint — 16 lines
6. Create real-estate detail endpoint — 16 lines
7. Create events detail endpoint — 16 lines
8. Create insurance detail endpoint — 16 lines
9. Fix vendors to use handle parameter — 1 line in storefront loader
10. Add breadcrumbs to 8 pages — simple template addition

---

## Section 7: Payload CMS Blocks System — Complete Structural Analysis

### 7.1 Architecture Overview

The platform has a **comprehensive, fully-structured Payload CMS blocks system** spanning 5 layers:

```
Layer 1: Type Definitions   → packages/cityos-design-system/src/blocks/BlockTypes.ts (870+ lines)
                               57 TypeScript interfaces defining every block's shape, props, variants
Layer 2: Block Registry     → apps/storefront/src/components/blocks/block-registry.ts (180 lines)
                               77 block types registered as React components in BLOCK_REGISTRY map
Layer 3: Block Renderer     → apps/storefront/src/components/blocks/block-renderer.tsx (44 lines)
                               Generic <BlockRenderer blocks={[...]} /> component that maps
                               blockType strings to registered React components
Layer 4: CMS Page Registry  → apps/backend/src/lib/platform/cms-registry.ts (1043 lines)
                               27 vertical-specific LIST page layouts with 3-5 blocks each
                               ALL detail pages share the same generic 3-block layout
                               7 additional pages (home, store, search, vendors, etc.)
Layer 5: CMS Page Database  → apps/backend/src/modules/cms-content/models/cms-page.ts
                               PostgreSQL model: cms_page table with layout JSON column
                               7 seeded pages (home, about, contact, privacy, terms + 2 more)
                               Database uses DIFFERENT block format than CMS registry!
```

### 7.2 Block Inventory (77 Components)

| Category | Block Types | Count | Total Lines |
|---|---|---|---|
| **Commerce Core** | productDetail, cartSummary, checkoutSteps, orderConfirmation, wishlistGrid, recentlyViewed, products | 7 | ~800 |
| **Content/Layout** | hero, content(richText), cta, features(featureGrid), stats, imageGallery, divider, bannerCarousel, videoEmbed, timeline, trustBadges, socialProof, blogPost | 13 | ~1,800 |
| **Navigation/Discovery** | categoryGrid, collectionList, comparisonTable, contactForm, faq, pricing, newsletter, reviewList, map | 9 | ~1,500 |
| **Vendor/Marketplace** | vendorProfile, vendorProducts, vendorShowcase, vendorRegisterForm, commissionDashboard, payoutHistory | 6 | ~850 |
| **Booking/Services** | bookingCalendar, bookingCta, bookingConfirmation, serviceCardGrid, serviceList, appointmentSlots, providerSchedule, resourceAvailability | 8 | ~1,400 |
| **Subscriptions/Loyalty** | subscriptionPlans, subscriptionManage, membershipTiers, loyaltyDashboard, loyaltyPointsDisplay, referralProgram | 6 | ~1,400 |
| **Vertical-Specific** | auctionBidding, rentalCalendar, propertyListing, vehicleListing, menuDisplay, courseCurriculum, eventSchedule, eventList, healthcareProvider, fitnessClassSchedule, petProfileCard, classifiedAdCard, crowdfundingProgress, donationCampaign, freelancerProfile, parkingSpotFinder, flashSaleCountdown, giftCardDisplay | 18 | ~3,600 |
| **B2B** | purchaseOrderForm, bulkPricingTable, companyDashboard, approvalWorkflow | 4 | ~900 |
| **Admin/Manage** | manageStats, manageRecentOrders, manageActivity, promotionBanner | 4 | ~500 |
| **TOTAL** | | **77** | **~12,750 lines** |

### 7.3 The Critical Disconnect: Blocks Exist But Are NEVER Used

**ZERO detail pages import or use `BlockRenderer` or any block component.**

The `BlockRenderer` component is exported from `apps/storefront/src/components/blocks/index.ts` but is **imported by exactly zero route files**. A `grep -rn "BlockRenderer" apps/storefront/src/routes/` returns **zero matches**.

Instead, every detail page uses hardcoded inline JSX that duplicates what the blocks already implement:

| What Blocks Provide | What Detail Pages Do Instead |
|---|---|
| `<HeroBlock heading="..." image={{url: "..."}} />` | Inline `<div className="relative w-full min-h-[300px]...">` (40-60 lines per page) |
| `<ReviewListBlock entityId={id} showSummary />` | Inline `reviews.map(r => ...)` with hardcoded fake reviews |
| `<ImageGalleryBlock images={[...]} layout="carousel" />` | Single `<img>` tag or no images at all |
| `<AuctionBiddingBlock auctionId={id} showCountdown />` | Nothing — auction page has no bid UI |
| `<BookingCalendarBlock serviceId={id} />` | Nothing — no calendar on any page |
| `<CrowdfundingProgressBlock campaignId={id} />` | Nothing — no progress bar |
| `<MenuDisplayBlock categories={[...]} showPrices />` | Nothing — restaurant page has no menu |

### 7.4 CMS Registry Layout Analysis

The CMS registry defines **two types of page layouts**:

#### LIST Page Layouts (27 verticals, well-differentiated)

Each vertical has a custom block layout with 3-5 vertical-appropriate blocks. Examples:

```
restaurants:     hero → menuDisplay → serviceCardGrid → reviewList → map
healthcare:      hero → healthcareProvider → bookingCalendar → faq
education:       hero → courseCurriculum → subscriptionPlans → testimonial
real-estate:     hero → propertyListing → map → contactForm
automotive:      hero → vehicleListing → comparisonTable
auctions:        hero → auctionBidding → productGrid
fitness:         hero → fitnessClassSchedule → membershipTiers → testimonial
crowdfunding:    hero → crowdfundingProgress → productGrid → faq
```

#### DETAIL Page Layouts (ALL 27 verticals share IDENTICAL generic layout)

```
ALL verticals:   hero → reviewList → recentlyViewed
```

Every single detail page in the CMS registry gets the exact same 3 generic blocks. There are **no vertical-specific detail layouts** — no `auctionBidding` on auction detail, no `bookingCalendar` on booking detail, no `menuDisplay` on restaurant detail, etc.

### 7.5 Database vs Registry Block Format Mismatch

The `cms_page` database table (7 seeded pages) uses a DIFFERENT block schema than the CMS registry:

**Database format (cms_page.layout):**
```json
[{"type": "hero", "data": {"title": "...", "subtitle": "..."}}]
```

**CMS registry format (cms-registry.ts):**
```json
[{"blockType": "hero", "heading": "...", "subheading": "..."}]
```

Key differences:
- Database uses `type` field; Registry uses `blockType`
- Database wraps props in `data` object; Registry spreads props flat
- Database uses `title/subtitle`; Registry uses `heading/subheading`
- `BlockRenderer` component expects `blockType` format (registry format)

This means the 7 database-seeded pages **cannot be rendered by BlockRenderer** without a format adapter.

### 7.6 Block Data Flow Architecture

Blocks are designed as **props-based presentational components**. Only 1 of 77 blocks (`products-block.tsx`) fetches its own data via `useQuery`. All other blocks expect data to be passed as props from a parent component.

This means for blocks to work on detail pages, the **detail page route handler** must:
1. Fetch the entity data via SSR loader (already happening)
2. Transform the API response into block-compatible prop shapes
3. Compose the appropriate blocks with the transformed data
4. OR: Fetch the CMS page layout from the registry and pass data to `BlockRenderer`

Currently, step 1 happens but the data never reaches any blocks.

### 7.7 Vertical-Specific Block ↔ Detail Page Mapping

These blocks exist and are ready to render vertical-specific UI, but none are used on their matching detail pages:

| Block Component | Lines | Designed For | Detail Page Status |
|---|---|---|---|
| `auction-bidding-block` | 198 | Auction detail with bid UI, countdown, bid history | NOT USED — auction detail has no bid interface |
| `booking-calendar-block` | 256 | Booking detail with date picker, time slots | NOT USED — no booking detail calendar |
| `course-curriculum-block` | 245 | Education detail with lesson tree, progress | NOT USED — education page is generic |
| `crowdfunding-progress-block` | 197 | Campaign detail with progress bar, backer count | NOT USED — crowdfunding page ignores all campaign data |
| `donation-campaign-block` | 229 | Charity detail with donation form, impact metrics | NOT USED — charity page is generic |
| `event-schedule-block` | 203 | Event detail with agenda, speakers | NOT USED — event page ignores event_type, dates |
| `fitness-class-schedule-block` | 204 | Fitness detail with weekly schedule | NOT USED — fitness page is generic |
| `freelancer-profile-block` | 247 | Freelancer detail with portfolio, skills | NOT USED — freelance page ignores skills, portfolio |
| `healthcare-provider-block` | 160 | Provider detail with specialties, availability | NOT USED — healthcare page is generic |
| `membership-tiers-block` | 220 | Membership comparison with tier cards | NOT USED — memberships serves wrong data |
| `menu-display-block` | 161 | Restaurant detail with categorized menu | NOT USED — restaurant page has no menu |
| `parking-spot-finder-block` | 220 | Parking detail with map, pricing grid | NOT USED — parking ignores rates, map |
| `pet-profile-card-block` | 223 | Pet profile with services, vet info | NOT USED — pet page is generic |
| `property-listing-block` | 158 | Property detail with specs, map | NOT USED — real-estate has no detail endpoint |
| `rental-calendar-block` | 124 | Rental detail with availability calendar | NOT USED — rental page has no calendar |
| `subscription-plans-block` | 238 | Subscription tier comparison | NOT USED — subscriptions serves wrong data |
| `vehicle-listing-block` | 206 | Vehicle detail with specs comparison | NOT USED — automotive ignores make/model/specs |

Total: **~3,600 lines of vertical-specific UI code** that exists but renders nowhere.

### 7.8 Block Component Quality Assessment — Complete Per-Block Breakdown

Every block was analyzed for: (1) does it accept data via props, (2) does it render from those props or from hardcoded constants, (3) does it use the `ds-` design system tokens, (4) what refactoring is needed.

#### Tier A: Props-Driven, Ready to Use (15 blocks)

These blocks accept data via props and render it — can be dropped into detail pages immediately:

| Block | Lines | Props Interface | Design Token Usage | Ready? |
|---|---|---|---|---|
| `hero` | 86 | heading, subheading, backgroundImage, overlay, alignment, minHeight, cta, badge | 5 `ds-` refs | YES |
| `cta` | 66 | heading, description, buttons, variant, backgroundStyle | 5 `ds-` refs | YES |
| `faq` | 90 | heading, description, items, layout | 3 `ds-` refs | YES |
| `features` (featureGrid) | 47 | heading, subtitle, features[], columns, variant | 3 `ds-` refs | YES |
| `content` (richText) | 27 | content, columns, maxWidth, textAlign | 1 `ds-` ref | YES |
| `pricing` | 171 | heading, description, plans[], billingToggle, highlightedPlan | 17 `ds-` refs | YES |
| `stats` | 130 | heading, stats[], columns, variant, showTrend | 14 `ds-` refs | YES |
| `membership-tiers` | 220 | heading, **tiers[]**, showComparison, variant | 21 `ds-` refs | YES — uses `tiers` prop with `defaultTiers` fallback |
| `subscription-plans` | 238 | heading, **plans[]**, billingToggle, highlightedPlan, variant | 33 `ds-` refs | YES — uses `plans` prop with `defaultPlans` fallback |
| `menu-display` | 161 | heading, **categories[]**, variant, showPrices, showDietaryIcons, currency | 12 `ds-` refs | YES — uses `categories` prop with `defaultCategories` fallback |
| `service-list` | 188 | heading, services[], showPricing, showBooking, layout | 14 `ds-` refs | YES |
| `booking-cta` | 134 | heading, description, serviceId, providerId, variant, showAvailability | 18 `ds-` refs | YES |
| `vendor-showcase` | 109 | heading, vendors[], layout, showRating, showProducts | 8 `ds-` refs | YES |
| `vendor-profile` | 101 | vendorId, showProducts, showReviews, variant | 16 `ds-` refs | YES |
| `divider` | 46 | variant, label, spacing | 4 `ds-` refs | YES |

**Import pattern for Tier A:**
```tsx
import { MembershipTiersBlock } from '../../components/blocks/membership-tiers-block'

<MembershipTiersBlock
  heading="Choose Your Plan"
  tiers={item.tiers || []}           // Pass API data directly
  showComparison={true}
  variant="cards"
/>
```

#### Tier B: Accept Props but Render Hardcoded Data (32 blocks)

These blocks define TypeScript prop interfaces but IGNORE the props internally, rendering from `const placeholder...` constants instead. They need refactoring to wire props → rendering:

| Block | Lines | Props Defined | Hardcoded Data | ds- Tokens | What Needs to Change |
|---|---|---|---|---|---|
| `auction-bidding` | 198 | auctionId, showHistory, showCountdown, variant | `placeholderBids` (5 bids), `currentBid: 1250`, `minIncrement: 50` | 47 | Accept `currentBid`, `bids[]`, `endTime` as props; render from them |
| `booking-calendar` | 256 | serviceId, variant, showPricing, allowMultiDay | `defaultTimeSlots` (9 slots with hardcoded $50-$70 prices) | 23 | Accept `timeSlots[]`, `bookedDates[]` as props |
| `crowdfunding-progress` | 197 | campaignId, showBackers, showUpdates, variant | `placeholderCampaign` (goal: $50,000, raised: $37,500, 842 backers), `recentBackers` (5 entries) | 43 | Accept `campaign: {goal, raised, backers, daysLeft}` as prop |
| `donation-campaign` | 229 | campaignId, showImpact, presetAmounts, allowRecurring, variant | `placeholderCampaign` (goal: $200,000, raised: $128,500, 3240 donors), `impactStats` (4 metrics) | 41 | Accept `campaign`, `impact[]` as props |
| `healthcare-provider` | 160 | heading, specialties, showAvailability, showRating, layout | `placeholderProviders` (6 doctors with hardcoded names/specialties) | 21 | Accept `providers[]` as prop |
| `vehicle-listing` | 206 | heading, vehicleType, layout, showComparison | `placeholderVehicles` (6 vehicles — Tesla, Toyota, BMW, etc.) | 29 | Accept `vehicles[]` as prop |
| `property-listing` | 158 | heading, propertyType, showMap, layout | `placeholderProperties` (hardcoded addresses, prices) | 21 | Accept `properties[]` as prop |
| `course-curriculum` | 245 | courseId, showProgress, expandAll, variant | `placeholderModules` (3 modules with hardcoded lessons) | 39 | Accept `modules[]` as prop |
| `event-schedule` | 203 | eventId, showSpeakers, showVenue, variant | `placeholderSessions` (5 events with hardcoded times) | 24 | Accept `sessions[]` as prop |
| `event-list` | 210 | heading, events[], layout, showPastEvents | Renders from `events` prop but has no default | 18 | ALMOST READY — just needs events data passed |
| `fitness-class-schedule` | 204 | heading, showInstructor, showLevel, allowBooking | `placeholderClasses` (6 classes with hardcoded schedules) | 27 | Accept `classes[]` as prop |
| `freelancer-profile` | 247 | heading, showPortfolio, showReviews, showAvailability, layout | `placeholderFreelancer` (name: "Jordan Rivera", $95/hr), `portfolioItems` (6), `reviews` (3) | 60 | Accept `freelancer`, `portfolio[]`, `reviews[]` as props |
| `pet-profile-card` | 223 | heading, showServices, showVetInfo, layout | `placeholderPets` (3 pets with hardcoded names/breeds) | 60 | Accept `pets[]` as prop |
| `classified-ad-card` | 187 | heading, category, layout, showContactInfo | `placeholderAds` (6 ads with hardcoded prices/locations) | 25 | Accept `ads[]` as prop |
| `parking-spot-finder` | 220 | locationId, showMap, showPricing, filterByType, variant | `placeholderSpots` (6 spots with hardcoded rates) | 23 | Accept `spots[]` as prop |
| `flash-sale-countdown` | 117 | heading, endTime, products, variant | `endTime` derived from +24h, `placeholderProducts` | 14 | Accept `endTime`, `products[]` as props |
| `gift-card-display` | 137 | heading, denominations, customizable, variant | `defaultDenominations` (5 values), hardcoded design templates | 19 | Accept `denominations[]`, `templates[]` as props |
| `rental-calendar` | 124 | itemId, pricingUnit, showDeposit, minDuration | Generates dates from current month, no real availability data | 25 | Accept `availability[]`, `pricing` as props |
| `appointment-slots` | 213 | providerId, date, duration, showPrice | `defaultTimeSlots`, hardcoded AM/PM slots | 29 | Accept `timeSlots[]` as prop |
| `provider-schedule` | 188 | providerId, viewMode, showCapacity | `placeholderSchedule` (weekly schedule with hardcoded times) | 22 | Accept `schedule[]` as prop |
| `resource-availability` | 199 | resourceType, locationId, showCalendar | `placeholderResources` (4 rooms with hardcoded availability) | — | Accept `resources[]` as prop |
| `booking-confirmation` | 105 | bookingId, showDetails, showActions | Renders from hardcoded confirmation template | 26 | Accept `booking` object as prop |
| `review-list` | 180 | heading, entityId, showSummary, allowSubmit | `placeholderReviews` (4 reviews with hardcoded users) | 17 | Accept `reviews[]` as prop |
| `product-detail` | 201 | productId, showReviews, showRelated, variant | Hardcoded product with "Premium Wireless Headphones" | 40 | Accept `product` object as prop |
| `recently-viewed` | 61 | heading, products, layout | `placeholderProducts` (3 items) | 10 | Accept `products[]` as prop |
| `cart-summary` | 142 | variant, showCoupon, showEstimatedShipping | Hardcoded 3-item cart | 28 | Accept `cartItems[]` as prop |
| `contact-form` | 163 | heading, recipientEmail, showMap, fields | Form fields hardcoded | 10 | Accept `fields[]` config |
| `newsletter` | 128 | heading, description, variant, showBenefits | Hardcoded benefits list | 8 | Accept `benefits[]` as prop |
| `map` | 198 | heading, center, markers, zoom, showSearch | `placeholderMarkers` (5 markers) | 21 | Accept `markers[]`, `center` as props |
| `service-card-grid` | 134 | heading, services, columns, showBookingCta | `placeholderServices` (6 services) | 12 | Accept `services[]` as prop |
| `social-proof` | 234 | variant, showPurchases, autoRotate, heading | Hardcoded purchases & reviews | 42 | Accept `purchases[]`, `reviews[]` as props |
| `blog-post` | 182 | heading, posts, layout, showAuthor | Hardcoded blog posts | 28 | Accept `posts[]` as prop |

**Refactoring pattern for Tier B:**
```tsx
// BEFORE (hardcoded):
const placeholderCampaign = { goal: 50000, raised: 37500, backers: 842, daysLeft: 18 }
const CrowdfundingProgressBlock = ({ campaignId, variant }) => {
  const percentFunded = Math.round((placeholderCampaign.raised / placeholderCampaign.goal) * 100)
  // renders placeholderCampaign...
}

// AFTER (data-driven):
const CrowdfundingProgressBlock = ({ campaign, variant }) => {
  const data = campaign || { goal: 0, raised: 0, backers: 0, daysLeft: 0 }
  const percentFunded = data.goal > 0 ? Math.round((data.raised / data.goal) * 100) : 0
  // renders data...
}
```

#### Tier C: Admin/Dashboard Blocks (11 blocks)

These are admin-only blocks not relevant to customer-facing detail pages:

| Block | Lines | Purpose |
|---|---|---|
| `commission-dashboard` | 143 | Vendor commission overview |
| `payout-history` | 180 | Vendor payout records |
| `purchase-order-form` | 278 | B2B purchase orders |
| `bulk-pricing-table` | 277 | B2B bulk pricing |
| `company-dashboard` | 185 | B2B company overview |
| `approval-workflow` | 287 | B2B approval chains |
| `manage-stats` | 61 | Admin dashboard stats |
| `manage-recent-orders` | 107 | Admin recent orders |
| `manage-activity` | 74 | Admin activity feed |
| `loyalty-dashboard` | 224 | Member loyalty overview |
| `loyalty-points-display` | 253 | Member points display |

#### Tier D: Specialized Blocks (19 blocks)

Fully working but serve specific non-vertical functions:

| Block | Lines | Purpose | Design Tokens |
|---|---|---|---|
| `image-gallery` | 209 | Multi-image carousel/grid viewer | 14 |
| `banner-carousel` | 185 | Promotional banner rotation | 11 |
| `video-embed` | 114 | Video player embed | 3 |
| `timeline` | 194 | Process/event timeline | 27 |
| `trust-badges` | 92 | Security/trust indicators | 8 |
| `category-grid` | 164 | Category browsing grid | 16 |
| `collection-list` | 123 | Product collection browser | 9 |
| `comparison-table` | 148 | Feature comparison matrix | 18 |
| `products` (productGrid) | 95 | Product grid (ONLY block with `useQuery`) | 6 |
| `wishlist-grid` | 94 | Saved items display | 12 |
| `checkout-steps` | 204 | Checkout wizard | 49 |
| `order-confirmation` | 132 | Order success display | 42 |
| `vendor-products` | 111 | Vendor product listing | 11 |
| `vendor-register-form` | 193 | Vendor registration | 34 |
| `referral-program` | 258 | Referral tracking | 60 |
| `subscription-manage` | 201 | Subscription management | 29 |
| `promotion-banner` | 169 | Promotional banner | 11 |
| `testimonial` | — | Customer testimonials | — |
| `products-block` | 95 | **ONLY block that fetches own data** via `useQuery` | 6 |

---

### 7.9 Design System & Theme Alignment — Detailed Analysis

#### 7.9.1 Token Architecture

The platform uses a **CSS custom properties design system** defined in `apps/storefront/src/styles/theme.css`:

```css
@theme {
  --color-ds-primary: var(--color-primary, hsl(221 83% 53%));        /* Blue */
  --color-ds-primary-foreground: var(--color-primary-foreground, hsl(0 0% 100%));
  --color-ds-secondary: var(--color-secondary, hsl(210 40% 96%));
  --color-ds-accent: var(--color-accent, hsl(210 40% 96%));
  --color-ds-background: var(--color-background, hsl(0 0% 100%));    /* White */
  --color-ds-foreground: var(--color-foreground, hsl(222 47% 11%));   /* Dark navy */
  --color-ds-muted: var(--color-muted, hsl(210 40% 96%));
  --color-ds-muted-foreground: var(--color-muted-foreground, hsl(215 16% 47%));
  --color-ds-card: var(--color-card, hsl(0 0% 100%));
  --color-ds-border: var(--color-border, hsl(214 32% 91%));
  --color-ds-destructive: var(--color-destructive, hsl(0 84% 60%));
  --color-ds-success: var(--color-success, hsl(142 76% 36%));
  --color-ds-warning: var(--color-warning, hsl(45 93% 47%));
  --color-ds-info: var(--color-info, hsl(199 95% 53%));
}
```

Plus shadow tokens (`--shadow-ds-sm/md/lg/xl`), radius tokens (`--radius-ds-sm/md/lg/xl/2xl/full`), motion tokens (`--duration-*`, `--ease-*`), and elevation tokens (`--elevation-1` through `--elevation-5`).

#### 7.9.2 Block ↔ Page Design Token Consistency

Both blocks AND detail pages use **identical** `ds-` prefixed Tailwind classes. There are **zero raw Tailwind color classes** (no `bg-blue-500`, `text-gray-700`, etc.) in either blocks or detail pages:

| Component Type | `ds-` Token Count | Raw Tailwind Colors | Consistent? |
|---|---|---|---|
| **crowdfunding-progress-block** | 43 | 0 | YES |
| **crowdfunding/$id.tsx page** | 62 | 0 | YES |
| **healthcare-provider-block** | 21 | 0 (uses `text-yellow-500` for stars, `text-green-600` for availability) | 98% |
| **healthcare/$id.tsx page** | 50 | 0 | YES |
| **menu-display-block** | 12 | 0 | YES |
| **restaurants/$id.tsx page** | 47 | 0 | YES |
| **freelancer-profile-block** | 60 | 0 | YES |
| **freelance/$id.tsx page** | 51 | 0 | YES |
| **vehicle-listing-block** | 29 | 0 | YES |
| **automotive/$id.tsx page** | 40 | 0 | YES |

**Key finding:** Both blocks and pages use the exact same CSS class vocabulary. Mixing blocks into pages will produce **pixel-perfect style consistency**. No theme conflicts will occur.

Only 2 minor exceptions across all 77 blocks:
- `healthcare-provider-block.tsx` uses `text-yellow-500` for star ratings and `text-green-600` for "Available" status — acceptable semantic colors
- `auction-bidding-block.tsx` uses `text-green-600` and `text-red-500` for bid up/down indicators — acceptable

#### 7.9.3 Common UI Patterns — Block vs Page Comparison

Both blocks and pages use identical UI structural patterns:

| Pattern | Block Implementation | Page Implementation | Match? |
|---|---|---|---|
| **Card wrapper** | `bg-ds-card border border-ds-border rounded-lg p-6 hover:shadow-md transition-shadow` | `bg-ds-background border border-ds-border rounded-xl p-6` | 95% (blocks use `rounded-lg`, pages use `rounded-xl`) |
| **Primary button** | `bg-ds-primary text-ds-primary-foreground rounded-lg font-semibold hover:opacity-90` | `bg-ds-primary text-ds-primary-foreground rounded-lg font-medium hover:bg-ds-primary/90` | 90% (blocks use `opacity-90`, pages use `bg-ds-primary/90`) |
| **Secondary button** | `bg-ds-muted text-ds-muted-foreground hover:text-ds-foreground` | `border border-ds-border text-ds-foreground hover:bg-ds-muted` | 85% |
| **Badge/tag** | `text-xs px-2 py-0.5 rounded-full bg-ds-muted text-ds-muted-foreground` | `px-3 py-1 text-xs font-medium rounded-full bg-ds-muted text-ds-muted-foreground` | 95% |
| **Section heading** | `text-2xl md:text-3xl lg:text-4xl font-bold text-ds-foreground mb-8` | `text-xl font-semibold text-ds-foreground mb-2` | 80% (blocks use responsive sizing) |
| **Muted text** | `text-sm text-ds-muted-foreground` | `text-sm text-ds-muted-foreground` | 100% |
| **Container** | `container mx-auto px-4 md:px-6` | `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` | 85% (blocks use `container`, pages use `max-w-7xl`) |

**Integration Note:** When importing blocks into detail pages, the minor differences in border-radius (`rounded-lg` vs `rounded-xl`) and container widths will be visually seamless since both are within the same design token system. No normalization needed.

#### 7.9.4 How the Tailwind Config Connects to Tokens

The `apps/storefront/tailwind.config.ts` is minimal — it only adds custom transition properties and opacity utilities. The `ds-` color tokens are resolved through Tailwind v4's `@theme` directive in `theme.css`, which maps CSS variables to Tailwind classes automatically:

```
theme.css: @theme { --color-ds-primary: hsl(221 83% 53%) }
    ↓
Tailwind: bg-ds-primary → background-color: var(--color-ds-primary)
    ↓
Rendered: background-color: hsl(221 83% 53%)
```

This means blocks and pages share the **exact same color pipeline** with zero configuration differences. Multi-tenant theming works automatically — changing `--color-primary` in a tenant's CSS overrides `--color-ds-primary` in both blocks and pages simultaneously.

---

### 7.10 Detailed Gap Analysis: Each Vertical's Page vs Block

For every vertical that has a matching block component, here is the exact gap between what the current detail page renders and what the block could provide:

#### 7.10.1 Crowdfunding

| Aspect | Current `crowdfunding/$id.tsx` (248 lines) | Available `crowdfunding-progress-block` (197 lines) |
|---|---|---|
| **Progress bar** | Inline `<div>` with calculated width — 8 lines of JSX | Full progress bar with percentage label, animated fill — 12 lines |
| **Campaign stats** | Inline grid showing raised/goal/backers — 15 lines | Grid showing raised/goal/backers/daysLeft + percentage — 20 lines |
| **Donation form** | Single "Back This Campaign" button, no amount picker | Full preset amount picker ($25/$50/$100/$250/$500) + custom amount input |
| **Recent backers** | Not shown | Shows last 5 backers with names, amounts, timestamps |
| **Variants** | Single layout | 3 variants: `full` (detail page), `widget` (sidebar), `minimal` (compact) |
| **Gap:** | Page has breadcrumbs, hero image, description, creator sidebar | Block adds donation form + backer list — combine for full page |
| **Data flow gap:** | Page uses `campaign.goal`, `campaign.raised` from API | Block uses `placeholderCampaign.goal = 50000` hardcoded |
| **Fix:** | Pass `campaign` prop to block → block reads `campaign.goal/raised/backers/daysLeft` |

#### 7.10.2 Healthcare

| Aspect | Current `healthcare/$id.tsx` (220 lines) | Available `healthcare-provider-block` (160 lines) |
|---|---|---|
| **Provider card** | Shows name, specialty, rating, location inline | Rich card with avatar placeholder, insurance tags, availability, "Book Appointment" CTA |
| **Specialty filter** | Not available | Interactive filter tabs (All, Family Medicine, Cardiology, etc.) |
| **Layout options** | Fixed 2-column layout | 3 layouts: `grid`, `list`, `cards` |
| **Insurance display** | Not shown | Shows insurance acceptance tags per provider |
| **Availability** | Shows raw `provider.availability` slots | Shows "Next Available: Tomorrow, 10:00 AM" formatted |
| **Gap:** | Page has breadcrumbs, sidebar with book/call/video buttons, credentials section | Block has provider listing + filter — need both |
| **Data flow gap:** | Page uses real API data from loader | Block uses `placeholderProviders` (6 hardcoded doctors) |
| **Fix:** | Accept `providers[]` prop → render from it instead of `placeholderProviders` |

#### 7.10.3 Restaurants

| Aspect | Current `restaurants/$id.tsx` (229 lines) | Available `menu-display-block` (161 lines) |
|---|---|---|
| **Menu display** | NO MENU — only shows name, description, hours, features | Full categorized menu with items, prices, dietary icons, "Add to Order" buttons |
| **Category tabs** | N/A | Sidebar tabs: Starters, Main Courses, Desserts, Drinks |
| **Price display** | Shows `price_range` as "$" symbols | Shows individual item prices formatted per currency |
| **Dietary icons** | N/A | Emoji-based dietary labels: Vegetarian, Vegan, Gluten-Free, Halal, Kosher |
| **Variants** | N/A | 3 variants: `grid`, `list`, `visual` (with food images) |
| **Gap:** | Page has hero image, breadcrumbs, hours, features sidebar, reserve/order/call buttons | Block adds THE MENU — the core functionality missing |
| **Data flow gap:** | Page has no menu data in API response | Block uses `defaultCategories` (4 categories, 13 items) |
| **Fix:** | Add `menu_categories` to restaurant API response → pass as `categories` prop |

#### 7.10.4 Auctions

| Aspect | Current `auctions/$id.tsx` (262 lines) | Available `auction-bidding-block` (198 lines) |
|---|---|---|
| **Bid form** | Shows current/starting price, no bid input | Full bid form with amount input, min increment display, "Place Bid" button |
| **Bid history** | Not shown | Recent bids table: bidder, amount, time |
| **Countdown** | Shows `time_left` as text | Live countdown timer with days:hours:minutes:seconds |
| **Quick bids** | N/A | "+$50", "+$100", "+$250" increment buttons |
| **Variants** | N/A | 3 variants: `full`, `compact`, `live` |
| **Gap:** | Page has breadcrumbs, image, details sidebar, bidding section skeleton | Block provides the ACTUAL bidding interface |
| **Data flow gap:** | Page reads `item.current_bid`, `item.starting_price` | Block uses `currentBid: 1250` hardcoded |
| **Fix:** | Accept `currentBid`, `bids[]`, `endTime` props → render from them |

#### 7.10.5 Education

| Aspect | Current `education/$id.tsx` (263 lines) | Available `course-curriculum-block` (245 lines) |
|---|---|---|
| **Curriculum** | Not shown — only title, description, generic fields | Full expandable module tree with lessons, durations, lock states |
| **Progress** | N/A | Progress bar per module, completion percentage |
| **Lesson details** | N/A | Lesson type icons (video/text/quiz), duration, preview button |
| **Variants** | N/A | 3 variants: `full`, `accordion`, `sidebar` |
| **Gap:** | Page has basic layout but no course structure | Block provides THE CORE FEATURE of a course page |
| **Data flow gap:** | N/A | Block uses `placeholderModules` (3 modules, 9 lessons) |
| **Fix:** | Add `modules` to course API → pass as prop |

#### 7.10.6 Fitness

| Aspect | Current `fitness/$id.tsx` (228 lines) | Available `fitness-class-schedule-block` (204 lines) |
|---|---|---|
| **Class schedule** | Not shown | Weekly schedule grid with time slots, instructor names, class levels |
| **Level filter** | N/A | Filter by: All, Beginner, Intermediate, Advanced |
| **Booking** | Generic "Book Now" button | Per-class "Join Class" button with availability counter |
| **Instructor** | Not shown | Name, photo placeholder per class |
| **Gap:** | Page shows basic service info | Block provides interactive class schedule |
| **Fix:** | Accept `classes[]` prop |

#### 7.10.7 Freelance

| Aspect | Current `freelance/$id.tsx` (246 lines) | Available `freelancer-profile-block` (247 lines) |
|---|---|---|
| **Portfolio** | Not shown | 6-item portfolio grid with category tags |
| **Skills** | Shows generic `item.skills` array | Shows skill badges in styled grid |
| **Reviews** | Generic review list | 3 detailed reviews with ratings, dates, text |
| **Stats** | Basic info display | Completions counter, rating, availability badge |
| **Variants** | N/A | 3 layouts: `full`, `card`, `sidebar` |
| **Gap:** | Page has breadcrumbs, sidebar with hire/message buttons | Block adds portfolio + skill showcase |
| **Data flow gap:** | Page uses `item.skills` from API | Block uses `placeholderFreelancer` (name: "Jordan Rivera", $95/hr) |
| **Fix:** | Accept `freelancer`, `portfolio[]`, `reviews[]` props |

#### 7.10.8 Automotive

| Aspect | Current `automotive/$id.tsx` (205 lines) | Available `vehicle-listing-block` (206 lines) |
|---|---|---|
| **Vehicle specs** | Shows generic metadata fields | Structured specs grid: year, mileage, fuel type, transmission, engine, color |
| **Make filter** | N/A | Filter dropdown by make |
| **Comparison** | N/A | Checkbox comparison tool for 2+ vehicles |
| **Layout toggle** | N/A | Grid/list view toggle |
| **Gap:** | Page shows one vehicle's detail | Block shows a listing of vehicles — better for LIST page |
| **Fix:** | For detail page, need `vehicle-detail-block` or pass single vehicle to listing block |

#### 7.10.9 Parking

| Aspect | Current `parking/$id.tsx` (245 lines) | Available `parking-spot-finder-block` (220 lines) |
|---|---|---|
| **Spot finder** | Shows basic parking zone info | Interactive spot finder with type filter (covered/open/valet/EV) |
| **Pricing grid** | Shows generic `item.rate` | Structured pricing: hourly, daily, monthly rates |
| **Availability** | Not shown | Real-time availability indicator per spot |
| **Map** | Not shown | Map placeholder with markers |
| **Gap:** | Page has basic zone info + sidebar | Block provides interactive parking interface |
| **Fix:** | Accept `spots[]` prop |

#### 7.10.10 Charity / Donations

| Aspect | Current `charity/$id.tsx` | Available `donation-campaign-block` (229 lines) |
|---|---|---|
| **Donation form** | Basic "Donate" button | Full donation form with preset amounts ($10/$25/$50/$100/$250), custom input, recurring toggle |
| **Impact stats** | Not shown | "12 Wells Built, 8,500+ People Served, 24 Communities, 5 Countries" |
| **Progress** | Not shown | Progress bar with percentage, goal, raised amount |
| **Variants** | N/A | 3 variants: `full`, `compact`, `widget` |
| **Fix:** | Accept `campaign`, `impact[]` props |

---

### 7.11 Import Guide — How to Wire Blocks into Detail Pages

#### Method 1: Direct Import (Hybrid approach — recommended for quick wins)

Keep the existing route files but import block components for the vertical-specific sections:

```tsx
// apps/storefront/src/routes/$tenant/$locale/crowdfunding/$id.tsx
import { createFileRoute, Link } from "@tanstack/react-router"
import { CrowdfundingProgressBlock } from '../../../../components/blocks/crowdfunding-progress-block'
import { ReviewListBlock } from '../../../../components/blocks/review-list-block'

function CrowdfundingDetailPage() {
  const loaderData = Route.useLoaderData()
  const campaign = loaderData?.item

  return (
    <div className="min-h-screen bg-ds-background">
      {/* Keep custom breadcrumbs + hero */}
      <div className="bg-ds-card border-b border-ds-border">...</div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* REPLACE inline progress with block */}
            <CrowdfundingProgressBlock
              campaign={{
                title: campaign.name || campaign.title,
                description: campaign.description,
                goal: Number(campaign.goal || 0),
                raised: Number(campaign.raised || campaign.amount_raised || 0),
                backers: Number(campaign.backers_count || 0),
                daysLeft: campaign.days_left || 0,
              }}
              variant="full"
              showBackers={true}
            />

            {/* REPLACE inline reviews with block */}
            <ReviewListBlock
              reviews={campaign.reviews || []}
              heading="Campaign Reviews"
              showSummary={true}
            />
          </div>

          <aside>
            {/* Sidebar CTA */}
            <CrowdfundingProgressBlock
              campaign={...same data...}
              variant="widget"
            />
          </aside>
        </div>
      </div>
    </div>
  )
}
```

**Import path pattern:** Blocks live at `apps/storefront/src/components/blocks/<name>-block.tsx`.
From route files at `apps/storefront/src/routes/$tenant/$locale/<vertical>/$id.tsx`:
```
import { BlockName } from '../../../../components/blocks/<name>-block'
```

#### Method 2: BlockRenderer with Layout (CMS-driven approach)

Use the `BlockRenderer` component with a layout array defined per vertical:

```tsx
import { BlockRenderer } from '../../../../components/blocks'

function CrowdfundingDetailPage() {
  const campaign = Route.useLoaderData()?.item

  const layout = [
    {
      blockType: 'hero',
      heading: campaign?.title,
      subheading: campaign?.description?.substring(0, 120),
      backgroundImage: campaign?.thumbnail ? { url: campaign.thumbnail } : undefined,
      minHeight: 'sm',
    },
    {
      blockType: 'crowdfundingProgress',
      campaign: {
        title: campaign?.title,
        goal: Number(campaign?.goal || 0),
        raised: Number(campaign?.raised || 0),
        backers: campaign?.backers_count || 0,
        daysLeft: campaign?.days_left || 0,
      },
      variant: 'full',
      showBackers: true,
    },
    {
      blockType: 'reviewList',
      reviews: campaign?.reviews || [],
      heading: 'Reviews',
    },
    {
      blockType: 'recentlyViewed',
      heading: 'Recently Viewed',
    },
  ]

  return (
    <div className="min-h-screen bg-ds-background">
      <BlockRenderer blocks={layout} />
    </div>
  )
}
```

#### Method 3: Full CMS Integration (long-term approach)

Use the CMS registry's `buildDetailPage()` to define per-vertical layouts, then have a generic route file resolve and render them:

1. Update `cms-registry.ts` `buildDetailPage()` to return vertical-specific layouts
2. Create a generic `$tenant/$locale/$vertical/$id.tsx` route
3. In the loader, resolve the CMS page and entity data
4. Pass layout + data to `BlockRenderer`

This requires the most infrastructure changes but yields the most maintainable architecture.

---

### 7.12 Per-Block Refactoring Recipes

For every Tier B block that needs refactoring, here is the exact code change pattern:

#### Pattern: Replace `const placeholder...` with prop + fallback

```tsx
// Step 1: Add data prop to interface
interface CrowdfundingProgressBlockProps {
  campaignId?: string
  campaign?: {                          // ADD THIS
    title: string
    description?: string
    goal: number
    raised: number
    backers: number
    daysLeft: number
  }
  showBackers?: boolean
  variant?: 'full' | 'widget' | 'minimal'
}

// Step 2: Keep placeholder as fallback default
const defaultCampaign = { title: 'Campaign', goal: 0, raised: 0, backers: 0, daysLeft: 0 }

// Step 3: Use prop with fallback
export const CrowdfundingProgressBlock: React.FC<CrowdfundingProgressBlockProps> = ({
  campaign = defaultCampaign,           // USE PROP, fallback to empty
  variant = 'full',
}) => {
  const percentFunded = campaign.goal > 0
    ? Math.round((campaign.raised / campaign.goal) * 100) : 0
  // ...render from `campaign` instead of `placeholderCampaign`
}
```

#### Blocks requiring this pattern (with their new prop shapes):

| Block | New Prop Name | Prop Shape |
|---|---|---|
| `crowdfunding-progress` | `campaign` | `{ title, goal, raised, backers, daysLeft }` |
| `donation-campaign` | `campaign` | `{ title, description, raised, goal, donors }` + `impact[]` |
| `healthcare-provider` | `providers` | `Provider[]` (id, name, specialty, rating, etc.) |
| `vehicle-listing` | `vehicles` | `Vehicle[]` (id, title, make, model, year, price, etc.) |
| `property-listing` | `properties` | `Property[]` (id, title, address, price, type, etc.) |
| `course-curriculum` | `modules` | `Module[]` (id, title, lessons[], duration) |
| `event-schedule` | `sessions` | `Session[]` (id, title, time, speaker, venue) |
| `freelancer-profile` | `freelancer` + `portfolio` | `Freelancer` + `PortfolioItem[]` |
| `fitness-class-schedule` | `classes` | `FitnessClass[]` (id, name, time, instructor, level) |
| `pet-profile-card` | `pets` | `Pet[]` (id, name, breed, services) |
| `auction-bidding` | `currentBid` + `bids` + `endTime` | `number` + `Bid[]` + `Date` |
| `parking-spot-finder` | `spots` | `ParkingSpot[]` (id, type, rate, available) |
| `classified-ad-card` | `ads` | `ClassifiedAd[]` (id, title, price, location) |
| `rental-calendar` | `availability` + `pricing` | `AvailableDate[]` + `PricingConfig` |
| `booking-calendar` | `timeSlots` + `bookedDates` | `TimeSlot[]` + `Date[]` |

---

### 7.13 Database Format Adapter Specification

The `cms_page` table stores 7 pages with blocks in **incompatible format**. An adapter function is needed:

```typescript
// apps/backend/src/lib/platform/block-format-adapter.ts
interface DatabaseBlock {
  type: string
  data: Record<string, any>
}

interface RendererBlock {
  blockType: string
  [key: string]: any
}

export function adaptDatabaseBlocks(dbBlocks: DatabaseBlock[]): RendererBlock[] {
  return dbBlocks.map(block => {
    const fieldMap: Record<string, Record<string, string>> = {
      hero: { title: 'heading', subtitle: 'subheading' },
      content: { body: 'content' },
      vertical_grid: { title: 'heading', limit: 'limit' },
      featured_products: { title: 'heading', limit: 'limit' },
      cta: { text: 'description', title: 'heading' },
      contact_form: { title: 'heading', email: 'recipientEmail' },
    }

    const mapped = fieldMap[block.type] || {}
    const props: Record<string, any> = {}

    for (const [dbKey, value] of Object.entries(block.data || {})) {
      props[mapped[dbKey] || dbKey] = value
    }

    const blockTypeMap: Record<string, string> = {
      hero: 'hero',
      content: 'richText',
      vertical_grid: 'categoryGrid',
      featured_products: 'productGrid',
      cta: 'cta',
      contact_form: 'contactForm',
    }

    return {
      blockType: blockTypeMap[block.type] || block.type,
      ...props,
    }
  })
}
```

**Database examples and their transformed output:**

| Database Format | Adapted Format |
|---|---|
| `{"type":"hero","data":{"title":"Welcome","subtitle":"Shop now"}}` | `{"blockType":"hero","heading":"Welcome","subheading":"Shop now"}` |
| `{"type":"content","data":{"body":"About us..."}}` | `{"blockType":"richText","content":"About us..."}` |
| `{"type":"featured_products","data":{"title":"Featured","limit":4}}` | `{"blockType":"productGrid","heading":"Featured","limit":4}` |
| `{"type":"cta","data":{"title":"Join","text":"Start today"}}` | `{"blockType":"cta","heading":"Join","description":"Start today"}` |
| `{"type":"contact_form","data":{"title":"Contact","email":"hi@..."}}` | `{"blockType":"contactForm","heading":"Contact","recipientEmail":"hi@..."}` |

---

### 7.14 What the Block System SHOULD Enable

If properly connected, the block system would allow:

1. **CMS-Driven Detail Pages** — Instead of 50 hardcoded route files, a single `GenericDetailPage` component could:
   - Fetch the CMS page layout from the registry (already works for list pages)
   - Fetch the entity data from the backend API
   - Pass data to `<BlockRenderer blocks={layout} />` with entity data as context

2. **Vertical-Specific Detail Layouts in CMS Registry** — Adding entries like:
   ```typescript
   "auctions-detail": [
     { blockType: "hero", heading: "Auction Detail" },
     { blockType: "imageGallery" },
     { blockType: "auctionBidding", showCountdown: true, showHistory: true },
     { blockType: "reviewList" },
     { blockType: "recentlyViewed" }
   ]
   ```

3. **Non-Developer Page Customization** — When migrated to actual Payload CMS, editors could rearrange, add, or remove blocks per vertical without code changes.

### 7.15 Recommended Block Integration Strategy

| Phase | Action | Impact | Effort |
|---|---|---|---|
| **Phase 0** | Fix database format mismatch (adapt `type`/`data` to `blockType`/flat props) | Enables DB-stored pages to render | 2 hours |
| **Phase 1** | Create vertical-specific detail page layouts in `cms-registry.ts` `buildDetailPage()` | Defines what blocks each detail page shows | 4 hours |
| **Phase 2** | Refactor ~32 Tier B blocks to accept real data from props instead of hardcoded data | Blocks render actual API data | 12 hours |
| **Phase 3** | Create `GenericVerticalDetailPage` route that uses `BlockRenderer` | Replaces 50 hardcoded route files with 1 | 8 hours |
| **Phase 4** | Add entity data context provider so blocks can access the loaded entity | Blocks auto-populate from SSR data | 4 hours |

---

## Section 8: CMS Integration Points Summary

### What EXISTS and is structured:

1. **77 React block components** (12,750+ lines) — fully implemented with TypeScript interfaces
2. **57 block type definitions** in the design system — comprehensive prop types with variants
3. **BlockRenderer component** (44 lines) — generic renderer that maps `blockType` → React component
4. **Block registry** (180 lines) — maps 77 string keys to React component imports
5. **CMS page registry** with 27 vertical-specific LIST layouts — well-differentiated per vertical (restaurants: 5 blocks, healthcare: 4 blocks, education: 4 blocks, etc.)
6. **CMS resolve API endpoint** — `GET /platform/cms/resolve?path=...` returns page + layout
7. **CMS page database model** — `cms_page` table with `layout` JSON column (7 seeded pages)
8. **Design system with 24 semantic color tokens** — `ds-primary/foreground/background/muted/card/border/destructive/success/warning/info` + foreground variants
9. **Zero raw Tailwind colors** in blocks or pages — 100% design system token compliance
10. **Payload CMS integration spec** — full contract document for webhook sync
11. **CMS hooks** — `useCMSVerticals()`, `useCMSNavigation()` in storefront
12. **Payload webhook handlers** — `POST /admin/webhooks/payload` and `POST /webhooks/payload-cms`
13. **CMS-to-ERP sync engine** — `cms-hierarchy-sync/engine.ts` for 8-collection sync

### What is MISSING / DISCONNECTED:

1. **Zero detail pages import or use `BlockRenderer`** — all 50 pages use hardcoded inline JSX (grep confirms 0 matches for `BlockRenderer` in routes/)
2. **No vertical-specific detail page layouts** in CMS registry — `buildDetailPage()` returns the same 3 generic blocks (hero + reviewList + recentlyViewed) for ALL 27 verticals
3. **Database and registry use incompatible block formats** — `cms_page.layout` stores `{"type": "hero", "data": {"title": "..."}}` but `BlockRenderer` expects `{"blockType": "hero", "heading": "..."}`
4. **32 blocks render placeholder data** instead of using their props (e.g., `placeholderCampaign`, `placeholderProviders`, `placeholderVehicles`)
5. **No entity data context** — blocks can't access the SSR-loaded entity data automatically
6. **No `useCMSPage()` hook** — storefront has `useCMSVerticals` and `useCMSNavigation` but no hook to fetch a specific page's block layout
7. **No generic detail page route** — each vertical has its own hardcoded route file instead of a shared CMS-driven page
8. **13 blocks accept entity-specific ID props** (`campaignId`, `auctionId`, `serviceId`, etc.) but never fetch data themselves — they expect a parent to pass the data, which no parent currently does
9. **Minor UI pattern inconsistencies** — blocks use `container mx-auto px-4 md:px-6` while pages use `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`; blocks use `rounded-lg` while pages use `rounded-xl`
10. **No block-level error boundaries** — if a block fails to render, the entire page breaks

---

## Section 9: Architecture Decision — Hardcoded vs Block-Based Detail Pages

### Option A: Keep Hardcoded Route Files (Current Approach)
- **Pros:** Direct control per vertical, simpler to understand one page at a time
- **Cons:** 50 files to maintain, cookie-cutter duplication, no CMS editability, 12,750 lines of block code wasted
- **Effort to fix:** Customize each of 50 files individually (~16 hours)

### Option B: Migrate to Block-Based Detail Pages (Recommended)
- **Pros:** 
  - Leverages 12,750 lines of existing block code
  - Reduces 50 route files to 1 generic route + vertical layouts in CMS registry
  - Enables CMS-driven page customization
  - Consistent with the platform's stated architecture
  - Blocks already have vertical-specific UI (auction bidding, booking calendar, etc.)
  - Zero theme conflict — both systems use identical `ds-` token vocabulary
- **Cons:** Requires upfront integration work, blocks need refactoring to use real data
- **Effort to implement:** ~30 hours total across 5 phases

### Option C: Hybrid — Custom Pages with Block Sections (Pragmatic)
- **Pros:** Custom page structure + block components for complex sections; quickest path to adding missing features (menus, bid forms, schedules)
- **Cons:** Still maintains 50 files, partial block utilization
- **Effort:** ~20 hours
- **How it works:** Keep each route file's breadcrumbs, hero, and sidebar layout. Import vertical-specific blocks for the main content sections. Each page becomes ~80 lines instead of ~250.

### Recommendation

**Option C (Hybrid)** is the fastest path to production readiness. It preserves the existing page structure (breadcrumbs, hero, sidebar with CTAs) while immediately adding the rich vertical-specific features that are currently missing (menus, bid forms, class schedules, donation forms, etc.). Since both blocks and pages use identical `ds-` design tokens, visual integration will be seamless with zero style conflicts.

**Option B (Block-Based)** should be the follow-up architectural refactor once Option C proves the blocks work correctly with real data.

---

## Section 10: Complete Block Catalog — All 77 Payload CMS Blocks

### Block Catalog Key

Each block entry includes:
- **Registry Key:** The `blockType` string used in `BLOCK_REGISTRY` and `BlockRenderer`
- **File:** Source file path
- **Lines:** Total lines of code
- **Design:** Visual layout description
- **Content:** What data/content the block displays
- **Props:** TypeScript interface (all accepted parameters)
- **Data Status:** Whether it uses props or hardcoded placeholder data
- **Use Cases:** Where this block should appear
- **Design Tokens:** Count of `ds-` token references (style consistency score)

---

### 10.1 Content & Layout Blocks

#### Block #1: `hero`
- **File:** `hero-block.tsx` (86 lines)
- **Design:** Full-width section with optional background image/video, text overlay with configurable alignment (start/center/end), CTA buttons, optional badge. Min-height variants: sm (200px), md (300px), lg (400px), xl (500px), full (100vh). Overlay options: none, light, dark, gradient.
- **Content:** Heading text, subheading text, background media, CTA button array, badge text
- **Props:** `heading?: string`, `subheading?: string`, `backgroundImage?: {url, alt}`, `backgroundVideo?: {url}`, `overlay?: 'none'|'light'|'dark'|'gradient'`, `alignment?: 'start'|'center'|'end'`, `minHeight?: 'sm'|'md'|'lg'|'xl'|'full'`, `cta?: {label, href}[]`, `badge?: string`
- **Data Status:** PROPS-DRIVEN — renders from props, no hardcoded data
- **Design Tokens:** 5 (bg-ds-background, text-ds-foreground, bg-ds-primary, text-ds-primary-foreground, text-ds-muted-foreground)
- **Use Cases:** Top of every page (list + detail), landing pages, campaign headers

#### Block #2: `richText` (content)
- **File:** `content-block.tsx` (27 lines)
- **Design:** Prose-styled rich text container with configurable max-width and column count. Clean typographic layout with responsive text sizing.
- **Content:** HTML string rendered as rich text
- **Props:** `content: string`, `columns?: 1|2`, `maxWidth?: 'sm'|'md'|'lg'|'xl'|'full'`, `textAlign?: 'start'|'center'|'end'`
- **Data Status:** PROPS-DRIVEN
- **Design Tokens:** 1 (text-ds-foreground)
- **Use Cases:** About pages, policy pages, blog content, long descriptions

#### Block #3: `cta`
- **File:** `cta-block.tsx` (66 lines)
- **Design:** Call-to-action banner with heading, description, and button array. Variants: banner (full-width colored), card (bordered container), inline (minimal), split (text + image side by side). Background styles: primary, secondary, muted, accent, custom.
- **Content:** Heading, description, button labels and URLs
- **Props:** `heading?: string`, `description?: string`, `buttons?: {label, href, variant}[]`, `variant?: 'banner'|'card'|'inline'|'split'`, `backgroundStyle?: 'primary'|'secondary'|'muted'|'accent'|'custom'`, `backgroundImage?: {url, alt}`
- **Data Status:** PROPS-DRIVEN
- **Design Tokens:** 5 (bg-ds-primary, text-ds-primary-foreground, bg-ds-card, border-ds-border, text-ds-foreground)
- **Use Cases:** Bottom of detail pages, conversion sections, newsletter sign-up prompts

#### Block #4: `featureGrid` (features)
- **File:** `features-block.tsx` (47 lines)
- **Design:** Grid of feature cards with icon + title + description. Configurable column count (2/3/4). Variants: icon-top (icon above text), icon-left (icon beside text), card (bordered containers), minimal (no borders).
- **Content:** Array of feature items with icons, titles, descriptions
- **Props:** `heading?: string`, `subtitle?: string`, `features: {icon, title, description}[]`, `columns?: 2|3|4`, `variant?: 'icon-top'|'icon-left'|'card'|'minimal'`
- **Data Status:** PROPS-DRIVEN
- **Design Tokens:** 3 (text-ds-foreground, text-ds-muted-foreground, bg-ds-card)
- **Use Cases:** Service features, membership benefits, product highlights, "Why Choose Us"

#### Block #5: `stats`
- **File:** `stats-block.tsx` (130 lines)
- **Design:** Horizontal/grid display of key statistics with large numbers and labels. Optional trend indicators (up/down arrows with percentage). Variants: default (simple numbers), card (bordered cards), highlighted (accent background), minimal.
- **Content:** Array of stat items: value, label, optional trend data
- **Props:** `heading?: string`, `stats: {value, label, trend?, trendDirection?}[]`, `columns?: 2|3|4`, `variant?: 'default'|'card'|'highlighted'|'minimal'`, `showTrend?: boolean`
- **Data Status:** PROPS-DRIVEN
- **Design Tokens:** 14
- **Use Cases:** Campaign progress metrics, vendor statistics, service counters, impact numbers

#### Block #6: `imageGallery`
- **File:** `image-gallery-block.tsx` (209 lines)
- **Design:** Multi-image display with three layouts: grid (equal cells), masonry (Pinterest-style), carousel (single image with nav arrows). Built-in lightbox with keyboard navigation (arrow keys, escape). Configurable aspect ratio (square/video/portrait) and column count (2/3/4).
- **Content:** Array of images with URLs, alt text, optional captions
- **Props:** `heading?: string`, `images: {image: {url, alt}, caption?}[]`, `layout?: 'grid'|'masonry'|'carousel'`, `columns?: 2|3|4`, `aspectRatio?: 'square'|'video'|'portrait'`
- **Data Status:** PROPS-DRIVEN — requires images array
- **Design Tokens:** 14 (bg-ds-background, text-ds-foreground, bg-ds-muted, border-ds-border, etc.)
- **Use Cases:** Product photos, property galleries, restaurant ambiance, event photos, portfolio showcases

#### Block #7: `divider`
- **File:** `divider-block.tsx` (46 lines)
- **Design:** Visual separator between sections. Variants: line (thin horizontal rule), dotted (dot pattern), label (line with centered text), space (whitespace only). Configurable spacing (sm/md/lg/xl).
- **Content:** Optional label text
- **Props:** `variant?: 'line'|'dotted'|'label'|'space'`, `label?: string`, `spacing?: 'sm'|'md'|'lg'|'xl'`
- **Data Status:** PROPS-DRIVEN
- **Design Tokens:** 4
- **Use Cases:** Between page sections, visual breaks in long content

#### Block #8: `bannerCarousel`
- **File:** `banner-carousel-block.tsx` (185 lines)
- **Design:** Auto-rotating promotional banner slider with navigation dots and arrow buttons. Each slide has background image, heading, description, and CTA button. Configurable auto-play interval and transition effects.
- **Content:** Array of banner slides with images, text, CTAs
- **Props:** `heading?: string`, `banners: {image: {url, alt}, heading, description, cta: {label, href}}[]`, `autoPlayInterval?: number`, `showDots?: boolean`, `showArrows?: boolean`, `height?: 'sm'|'md'|'lg'`
- **Data Status:** PROPS-DRIVEN
- **Design Tokens:** 11
- **Use Cases:** Homepage hero rotation, promotional campaigns, seasonal offers

#### Block #9: `videoEmbed`
- **File:** `video-embed-block.tsx` (114 lines)
- **Design:** Responsive video player embed with optional poster image and play button overlay. Supports YouTube, Vimeo, and direct video URLs. Aspect ratio configurable (16:9, 4:3, 1:1).
- **Content:** Video URL, optional poster image, title
- **Props:** `url: string`, `title?: string`, `poster?: {url, alt}`, `aspectRatio?: '16:9'|'4:3'|'1:1'`, `autoplay?: boolean`
- **Data Status:** PROPS-DRIVEN
- **Design Tokens:** 3
- **Use Cases:** Product demos, course previews, property virtual tours, event recordings

#### Block #10: `timeline`
- **File:** `timeline-block.tsx` (194 lines)
- **Design:** Vertical timeline with connected nodes. Each entry has date, title, description, and optional icon. Left/right alternating layout on desktop, stacked on mobile. Color-coded nodes for different statuses.
- **Content:** Array of timeline entries with dates, titles, descriptions
- **Props:** `heading?: string`, `items: {date, title, description, icon?, status?}[]`, `layout?: 'vertical'|'horizontal'|'alternating'`, `showConnectors?: boolean`
- **Data Status:** PROPS-DRIVEN
- **Design Tokens:** 27
- **Use Cases:** Order tracking, project milestones, government service processing steps, company history

#### Block #11: `trustBadges`
- **File:** `trust-badges-block.tsx` (92 lines)
- **Design:** Horizontal row of trust/security badges with icons and labels. Common badges: secure payment, money-back guarantee, free shipping, verified sellers. Optional description under each badge.
- **Content:** Array of badge items with icons and labels
- **Props:** `badges?: {icon, label, description?}[]`, `layout?: 'horizontal'|'grid'`, `variant?: 'icon-only'|'with-text'|'card'`
- **Data Status:** PROPS-DRIVEN with defaults
- **Design Tokens:** 8
- **Use Cases:** Footer trust indicators, checkout page reassurance, product detail confidence builders

#### Block #12: `socialProof`
- **File:** `social-proof-block.tsx` (234 lines)
- **Design:** Real-time social proof notifications showing recent purchases, reviews, and activity. Variants: feed (continuous scroll), toast (popup notifications), banner (summary bar), widget (sidebar card). Shows buyer name, location, product, and timestamp.
- **Content:** Recent purchases, reviews with ratings, activity data
- **Props:** `variant?: 'feed'|'toast'|'banner'|'widget'`, `showPurchases?: boolean`, `showReviews?: boolean`, `autoRotate?: boolean`, `heading?: string`, `maxItems?: number`
- **Data Status:** HARDCODED — uses placeholder purchases and reviews
- **Design Tokens:** 42
- **Use Cases:** Homepage social proof, product detail page urgency, checkout conversion

#### Block #13: `blogPost`
- **File:** `blog-post-block.tsx` (182 lines)
- **Design:** Full blog article layout with featured image, category badge, title, author info (avatar + name + bio), reading time, publication date, rich HTML content body, tags, and related posts sidebar.
- **Content:** Article content (HTML), author data, category, tags, related posts
- **Props:** `heading?: string`, `content?: string`, `author?: {name, avatar?, bio?}`, `publishedAt?: string`, `category?: string`, `tags?: string[]`, `featuredImage?: string`, `readingTime?: number`
- **Data Status:** HARDCODED — defaults to "Future of B2B Commerce" article
- **Design Tokens:** 28
- **Use Cases:** Blog detail pages, news articles, knowledge base entries

---

### 10.2 Navigation & Discovery Blocks

#### Block #14: `categoryGrid`
- **File:** `category-grid-block.tsx` (164 lines)
- **Design:** Grid of category cards with images, names, and item counts. Configurable columns (2/3/4/6). Variants: card (bordered with image), image-overlay (full image with text overlay), icon (centered icon with label), minimal (text only). Links to category pages.
- **Content:** Array of categories with images, names, item counts, URLs
- **Props:** `heading?: string`, `categories: {name, image?, itemCount?, href}[]`, `columns?: 2|3|4|6`, `variant?: 'card'|'image-overlay'|'icon'|'minimal'`
- **Data Status:** PROPS-DRIVEN
- **Design Tokens:** 16
- **Use Cases:** Homepage category browsing, vertical landing pages, storefront navigation

#### Block #15: `collectionList`
- **File:** `collection-list-block.tsx` (123 lines)
- **Design:** Curated collection cards with images, titles, and descriptions. Layouts: grid, carousel (horizontal scroll), list (vertical stack). Links to collection detail pages.
- **Content:** Array of product collections
- **Props:** `heading?: string`, `description?: string`, `collections?: {id, title, handle, image?}[]`, `layout?: 'grid'|'carousel'|'list'`, `columns?: 2|3|4|6`
- **Data Status:** PROPS-DRIVEN
- **Design Tokens:** 9
- **Use Cases:** Curated collections, seasonal picks, editor's choice, "Shop the Look"

#### Block #16: `comparisonTable`
- **File:** `comparison-table-block.tsx` (148 lines)
- **Design:** Feature comparison matrix with product/plan columns and feature rows. Checkmarks for included features, X for excluded. Highlighted column for recommended option. Sticky header for scrolling.
- **Content:** Products/plans with feature lists
- **Props:** `heading?: string`, `items: {name, features: Record<string, boolean|string>}[]`, `features: string[]`, `highlightedItem?: string`, `layout?: 'table'|'cards'`
- **Data Status:** PROPS-DRIVEN — requires items and features arrays
- **Design Tokens:** 18
- **Use Cases:** Membership tier comparison, insurance plan comparison, subscription plan features, vehicle spec comparison

#### Block #17: `contactForm`
- **File:** `contact-form-block.tsx` (163 lines)
- **Design:** Multi-field contact form with name, email, phone, subject, and message fields. Optional map embed below form. Success/error state feedback. Configurable field list.
- **Content:** Form fields, recipient email, heading
- **Props:** `heading?: string`, `recipientEmail?: string`, `showMap?: boolean`, `fields?: string[]`
- **Data Status:** PARTIALLY HARDCODED — form fields hardcoded but layout is prop-driven
- **Design Tokens:** 10
- **Use Cases:** Contact pages, vendor inquiry, property inquiry, service request

#### Block #18: `faq`
- **File:** `faq-block.tsx` (90 lines)
- **Design:** Accordion-style FAQ list with expandable question/answer pairs. Layouts: accordion (one open at a time), two-column (side by side), categorized (grouped by category). Smooth expand/collapse animation.
- **Content:** Array of question-answer pairs
- **Props:** `heading?: string`, `description?: string`, `items: {question, answer}[]`, `layout?: 'accordion'|'two-column'|'categorized'`
- **Data Status:** PROPS-DRIVEN — requires items array
- **Design Tokens:** 3
- **Use Cases:** Product FAQ, service information, legal disclaimers, healthcare information

#### Block #19: `pricing`
- **File:** `pricing-block.tsx` (171 lines)
- **Design:** Pricing tier cards with plan names, prices, feature lists, and CTA buttons. Highlighted/recommended plan with accent border. Optional billing toggle (monthly/annual). Responsive: stacks on mobile, side by side on desktop.
- **Content:** Array of pricing plans
- **Props:** `heading?: string`, `description?: string`, `plans: {name, price, currency, interval, features, highlighted?, cta?}[]`, `billingToggle?: boolean`, `highlightedPlan?: string`
- **Data Status:** PROPS-DRIVEN — requires plans array
- **Design Tokens:** 17
- **Use Cases:** Subscription pricing, membership tiers, service packages, SaaS plans

#### Block #20: `newsletter`
- **File:** `newsletter-block.tsx` (128 lines)
- **Design:** Email subscription form with heading, description, email input, and submit button. Optional benefits list. Variants: inline (single row), card (bordered container), full-width (accent background).
- **Content:** Heading, description, benefit items
- **Props:** `heading?: string`, `description?: string`, `variant?: 'inline'|'card'|'full-width'`, `showBenefits?: boolean`
- **Data Status:** PARTIALLY HARDCODED — benefits list hardcoded
- **Design Tokens:** 8
- **Use Cases:** Footer newsletter sign-up, event updates subscription, blog subscription

#### Block #21: `reviewList`
- **File:** `review-list-block.tsx` (180 lines)
- **Design:** Customer review cards with star ratings, reviewer name, date, and review text. Optional summary header showing average rating and total count. Optional "Write a Review" form. Filterable by star count.
- **Content:** Array of reviews with ratings, text, author info
- **Props:** `heading?: string`, `entityId?: string`, `showSummary?: boolean`, `allowSubmit?: boolean`
- **Data Status:** HARDCODED — uses 4 placeholder reviews
- **Design Tokens:** 17
- **Use Cases:** Product reviews, service reviews, vendor reviews, course reviews, restaurant reviews

#### Block #22: `map`
- **File:** `map-block.tsx` (198 lines)
- **Design:** Interactive map placeholder with location markers, search input, and location list panel. Shows pin markers with name, address, and phone. Sidebar list of locations with click-to-select. Map renders as styled placeholder (no actual map API).
- **Content:** Center coordinates, zoom level, array of location markers
- **Props:** `heading?: string`, `center?: {lat, lng}`, `markers?: {id, name, address, phone?, image?}[]`, `zoom?: number`, `showSearch?: boolean`
- **Data Status:** HARDCODED — uses 5 placeholder markers
- **Design Tokens:** 21
- **Use Cases:** Store locator, restaurant locations, parking zones, property locations, event venues

---

### 10.3 Commerce Core Blocks

#### Block #23: `productGrid` (products)
- **File:** `products-block.tsx` (95 lines)
- **Design:** Responsive product card grid with image, title, price, rating. Hover effect reveals "Add to Cart" button. Configurable columns (2/3/4). Sort dropdown (newest, price asc/desc, popular). Category filter tabs.
- **Content:** Product array (can be fetched via useQuery or passed as props)
- **Props:** `heading?: string`, `source?: 'latest'|'featured'|'category'|'vendor'|'manual'`, `productIds?: string[]`, `categoryId?: string`, `vendorId?: string`, `limit?: number`, `columns?: 2|3|4`, `showFilters?: boolean`, `showSort?: boolean`
- **Data Status:** **ONLY BLOCK WITH `useQuery`** — fetches its own product data
- **Design Tokens:** 6
- **Use Cases:** Product listings, featured products, category products, vendor products

#### Block #24: `productDetail`
- **File:** `product-detail-block.tsx` (201 lines)
- **Design:** Full product detail layout with image gallery (main + thumbnails), title, price, description, variant selector (size/color), quantity picker, "Add to Cart" button, product specs table. Tabs for description/specs/reviews.
- **Content:** Complete product data
- **Props:** `productId?: string`, `showReviews?: boolean`, `showRelated?: boolean`, `variant?: 'default'|'compact'|'gallery'`
- **Data Status:** HARDCODED — "Premium Wireless Headphones" placeholder
- **Design Tokens:** 40
- **Use Cases:** Standard product detail page, quick view modal

#### Block #25: `cartSummary`
- **File:** `cart-summary-block.tsx` (142 lines)
- **Design:** Shopping cart display with item list (image, name, quantity, price), subtotal, shipping estimate, coupon code input, and checkout button. Variants: mini (dropdown), full (page), sidebar (sticky).
- **Content:** Cart items, pricing summary
- **Props:** `variant?: 'mini'|'full'|'sidebar'`, `showCoupon?: boolean`, `showEstimatedShipping?: boolean`
- **Data Status:** HARDCODED — 3 placeholder cart items
- **Design Tokens:** 28
- **Use Cases:** Cart page, cart sidebar, checkout flow

#### Block #26: `checkoutSteps`
- **File:** `checkout-steps-block.tsx` (204 lines)
- **Design:** Multi-step checkout wizard with progress bar. Steps: Contact Info → Shipping → Payment → Review. Each step has form fields with validation states. Back/Next navigation buttons. Order summary sidebar.
- **Content:** Checkout form data, order summary
- **Props:** `showOrderSummary?: boolean`, `initialStep?: number`, `allowGuestCheckout?: boolean`, `paymentMethods?: string[]`, `shippingMethods?: string[]`
- **Data Status:** HARDCODED — placeholder form data
- **Design Tokens:** 49
- **Use Cases:** Checkout flow, booking confirmation, subscription signup

#### Block #27: `orderConfirmation`
- **File:** `order-confirmation-block.tsx` (132 lines)
- **Design:** Order success page with confirmation number, order summary, shipping details, estimated delivery, and "Continue Shopping" CTA. Green checkmark icon header. Line items with images and prices.
- **Content:** Order data, confirmation number, shipping info
- **Props:** `orderId?: string`, `showTracking?: boolean`, `showRelated?: boolean`, `variant?: 'full'|'compact'`
- **Data Status:** HARDCODED — placeholder order #ORD-2026-1234
- **Design Tokens:** 42
- **Use Cases:** Post-purchase confirmation, booking confirmation

#### Block #28: `wishlistGrid`
- **File:** `wishlist-grid-block.tsx` (94 lines)
- **Design:** Saved items grid with product cards, remove button, and "Move to Cart" action. Empty state with illustration and CTA.
- **Content:** Saved product array
- **Props:** `heading?: string`, `products?: any[]`, `layout?: 'grid'|'list'`
- **Data Status:** HARDCODED — 3 placeholder items
- **Design Tokens:** 12
- **Use Cases:** Wishlist page, saved items section

#### Block #29: `recentlyViewed`
- **File:** `recently-viewed-block.tsx` (61 lines)
- **Design:** Horizontal scrollable row of recently viewed product thumbnails with titles and prices. Compact card format. Carousel-style with overflow scroll.
- **Content:** Recently viewed product array
- **Props:** `heading?: string`, `products?: any[]`, `layout?: 'carousel'|'grid'`
- **Data Status:** HARDCODED — 3 placeholder products
- **Design Tokens:** 10
- **Use Cases:** Bottom of every detail page, shopping continuity

#### Block #30: `flashSaleCountdown`
- **File:** `flash-sale-countdown-block.tsx` (117 lines)
- **Design:** Countdown timer display with days:hours:minutes:seconds blocks. Featured sale products below timer. Urgency-colored design (red/orange tones). Animated countdown digits.
- **Content:** End time, sale products
- **Props:** `heading?: string`, `endTime?: Date`, `products?: any[]`, `variant?: 'banner'|'card'|'inline'`
- **Data Status:** HARDCODED — endTime = now + 24 hours, placeholder products
- **Design Tokens:** 14
- **Use Cases:** Flash deals detail, promotional pages, seasonal sales

#### Block #31: `giftCardDisplay`
- **File:** `gift-card-display-block.tsx` (137 lines)
- **Design:** Gift card selector with denomination buttons ($25/$50/$100/$250/$500), visual card template preview, recipient email input, personal message textarea. Card design templates with color variations.
- **Content:** Denominations, card templates, recipient info
- **Props:** `heading?: string`, `denominations?: number[]`, `customizable?: boolean`, `variant?: 'selector'|'preview'|'checkout'`
- **Data Status:** HARDCODED — 5 default denominations, hardcoded templates
- **Design Tokens:** 19
- **Use Cases:** Gift card purchase page, gift card detail

---

### 10.4 Vendor & Marketplace Blocks

#### Block #32: `vendorProfile`
- **File:** `vendor-profile-block.tsx` (101 lines)
- **Design:** Vendor information card with logo, name, description, rating, product count, verified badge. Optional sections: about, contact info, social links, policies.
- **Content:** Vendor data from API
- **Props:** `vendorId?: string`, `showProducts?: boolean`, `showReviews?: boolean`, `variant?: 'full'|'card'|'sidebar'`
- **Data Status:** PROPS-DRIVEN — accepts vendorId
- **Design Tokens:** 16
- **Use Cases:** Vendor storefront page, vendor detail, marketplace vendor listing

#### Block #33: `vendorProducts`
- **File:** `vendor-products-block.tsx` (111 lines)
- **Design:** Product grid filtered by vendor with vendor header info. Standard product card format with image, title, price, rating. "View All" link to vendor store.
- **Content:** Vendor's product array
- **Props:** `vendorId?: string`, `limit?: number`, `heading?: string`
- **Data Status:** PARTIALLY HARDCODED — placeholder products
- **Design Tokens:** 11
- **Use Cases:** Vendor detail page "Products" section, vendor storefront

#### Block #34: `vendorShowcase`
- **File:** `vendor-showcase-block.tsx` (109 lines)
- **Design:** Featured vendor cards in grid/carousel/featured layout. Each card shows logo, name, description, rating, product count, verified badge. "View Store" CTA link.
- **Content:** Array of vendor data
- **Props:** `heading?: string`, `description?: string`, `vendors: Vendor[]`, `layout?: 'grid'|'carousel'|'featured'`, `showRating?: boolean`, `showProducts?: boolean`
- **Data Status:** PROPS-DRIVEN — requires vendors array
- **Design Tokens:** 8
- **Use Cases:** Homepage vendor showcase, marketplace landing, vendor directory

#### Block #35: `vendorRegisterForm`
- **File:** `vendor-register-form-block.tsx` (193 lines)
- **Design:** Multi-section registration form with business info (name, type, description), contact details, document upload, terms acceptance, and submit button. Progress indicator for multi-step flow.
- **Content:** Form configuration, required fields
- **Props:** `heading?: string`, `showBusinessType?: boolean`, `requireDocuments?: boolean`
- **Data Status:** PARTIALLY HARDCODED — form structure hardcoded
- **Design Tokens:** 34
- **Use Cases:** Vendor registration page, seller onboarding

#### Block #36: `commissionDashboard`
- **File:** `commission-dashboard-block.tsx` (143 lines)
- **Design:** Vendor earnings dashboard with total earnings, pending payouts, commission rate card, and monthly earnings chart placeholder. Summary cards in 3-column grid.
- **Content:** Commission data, earnings history
- **Props:** `vendorId?: string`, `showChart?: boolean`
- **Data Status:** HARDCODED — placeholder earnings data
- **Design Tokens:** 30
- **Use Cases:** Vendor dashboard, admin vendor management

#### Block #37: `payoutHistory`
- **File:** `payout-history-block.tsx` (180 lines)
- **Design:** Table of past payouts with date, amount, status badge (paid/pending/failed), method. Pagination at bottom. Filter by status.
- **Content:** Payout records array
- **Props:** `vendorId?: string`
- **Data Status:** HARDCODED — placeholder payout records
- **Design Tokens:** 29
- **Use Cases:** Vendor payout history page, vendor dashboard section

---

### 10.5 Booking & Service Blocks

#### Block #38: `bookingCalendar`
- **File:** `booking-calendar-block.tsx` (256 lines)
- **Design:** Full month calendar view with day cells (colored: available=green, unavailable=gray, selected=primary). Time slot picker grid below calendar for selected date showing available times with prices. Confirm booking button with selected date+time summary. Variants: monthly (full calendar), weekly (7-day strip), daily (single day time slots). Optional multi-day range selection.
- **Content:** Available dates, time slots with prices, booked dates
- **Props:** `serviceId?: string`, `variant?: 'monthly'|'weekly'|'daily'`, `showPricing?: boolean`, `allowMultiDay?: boolean`
- **Data Status:** HARDCODED — defaultTimeSlots ($50-$70), hardcoded unavailable days (5,12,19,25)
- **Design Tokens:** 23
- **Use Cases:** Booking detail pages, appointment scheduling, rental availability, travel check-in

#### Block #39: `bookingCta`
- **File:** `booking-cta-block.tsx` (134 lines)
- **Design:** Compact booking prompt with service summary (name, duration, price), availability indicator, and "Book Now" CTA button. Variants: inline (text + button), card (bordered container), full-width (accent background).
- **Content:** Service info, availability, pricing
- **Props:** `heading?: string`, `description?: string`, `serviceId?: string`, `providerId?: string`, `variant?: 'inline'|'card'|'full-width'`, `showAvailability?: boolean`, `showPricing?: boolean`
- **Data Status:** PROPS-DRIVEN
- **Design Tokens:** 18
- **Use Cases:** Service detail sidebar CTA, bottom of service pages, promotional booking prompts

#### Block #40: `bookingConfirmation`
- **File:** `booking-confirmation-block.tsx` (105 lines)
- **Design:** Booking success page with confirmation number, service details, date/time, provider info, and action buttons (add to calendar, get directions, cancel booking).
- **Content:** Booking confirmation data
- **Props:** `bookingId?: string`, `showDetails?: boolean`, `showActions?: boolean`
- **Data Status:** HARDCODED — placeholder confirmation template
- **Design Tokens:** 26
- **Use Cases:** Post-booking confirmation, appointment confirmed

#### Block #41: `serviceCardGrid`
- **File:** `service-card-grid-block.tsx` (134 lines)
- **Design:** Grid of service cards with image, name, description, pricing, duration, and "Book" button. Configurable columns (2/3/4). Optional category filter.
- **Content:** Array of services
- **Props:** `heading?: string`, `services?: Service[]`, `columns?: 2|3|4`, `showBookingCta?: boolean`, `categoryFilter?: string`
- **Data Status:** HARDCODED — 6 placeholder services
- **Design Tokens:** 12
- **Use Cases:** Service listing, restaurant services, healthcare services, fitness classes

#### Block #42: `serviceList`
- **File:** `service-list-block.tsx` (188 lines)
- **Design:** Detailed service listing with image, name, description, pricing (with currency and unit), duration, rating, and booking URL. Layouts: grid (cards), list (horizontal rows), carousel (horizontal scroll). Responsive column count.
- **Content:** Array of services with full details
- **Props:** `heading?: string`, `description?: string`, `services: Service[]`, `layout?: 'grid'|'list'|'carousel'`, `columns?: 2|3|4`, `showBooking?: boolean`, `showPricing?: boolean`
- **Data Status:** PROPS-DRIVEN — requires services array
- **Design Tokens:** 14
- **Use Cases:** Legal services, insurance plans, government services, utilities, any service-based vertical

#### Block #43: `appointmentSlots`
- **File:** `appointment-slots-block.tsx` (213 lines)
- **Design:** 7-day date picker strip at top, time slot grid below. Each slot shows time, availability status (green=available, gray=taken). Selected slot highlights in primary color. Duration display. Variants: list (vertical), grid (button grid), timeline (visual timeline).
- **Content:** Available time slots per day
- **Props:** `providerId?: string`, `date?: string`, `duration?: string`, `variant?: 'list'|'grid'|'timeline'`
- **Data Status:** HARDCODED — 18 default slots with hardcoded availability
- **Design Tokens:** 29
- **Use Cases:** Healthcare appointment booking, legal consultation scheduling, fitness class booking

#### Block #44: `providerSchedule`
- **File:** `provider-schedule-block.tsx` (188 lines)
- **Design:** Weekly schedule grid showing provider availability. Time slots in rows, days in columns. Color-coded: available (green), busy (red), tentative (yellow). View modes: calendar, list, timeline.
- **Content:** Provider's weekly schedule
- **Props:** `providerId?: string`, `viewMode?: 'calendar'|'list'|'timeline'`, `showCapacity?: boolean`
- **Data Status:** HARDCODED — placeholder weekly schedule
- **Design Tokens:** 22
- **Use Cases:** Provider detail page, staff scheduling, resource availability

#### Block #45: `resourceAvailability`
- **File:** `resource-availability-block.tsx` (199 lines)
- **Design:** Resource availability checker with calendar view, time windows, and status indicators. Shows multiple resources (rooms, equipment) with their availability. Variants: calendar (month view), list (time slots), hybrid (calendar + time slots).
- **Content:** Resources with availability data
- **Props:** `resourceType?: string`, `resourceId?: string`, `dateRange?: {start, end}`, `variant?: 'calendar'|'list'|'hybrid'`
- **Data Status:** HARDCODED — 4 placeholder meeting rooms
- **Design Tokens:** ~20
- **Use Cases:** Meeting room booking, equipment rental, facility reservation

---

### 10.6 Subscription & Loyalty Blocks

#### Block #46: `subscriptionPlans`
- **File:** `subscription-plans-block.tsx` (238 lines)
- **Design:** Pricing comparison cards with plan name, price/interval, feature list (checkmarks), and "Subscribe" CTA. Highlighted plan with accent border and "Popular" badge. Optional billing toggle (monthly/yearly with discount). Variants: cards (side by side), table (comparison matrix), minimal (compact list).
- **Content:** Array of subscription plan data
- **Props:** `heading?: string`, `plans?: PlanData[]`, `billingToggle?: boolean`, `highlightedPlan?: string`, `variant?: 'cards'|'table'|'minimal'`
- **Data Status:** PROPS-DRIVEN — uses `plans` prop with `defaultPlans` fallback (Starter $9/mo, Professional $29/mo, Enterprise $79/mo)
- **Design Tokens:** 33
- **Use Cases:** Subscription pricing page, SaaS plans, membership upgrades

#### Block #47: `membershipTiers`
- **File:** `membership-tiers-block.tsx` (220 lines)
- **Design:** Tiered membership cards with color-coded headers (Bronze=#CD7F32, Silver=#C0C0C0, Gold=#FFD700). Each card shows tier name, price/month, benefit checklist with colored checkmark icons, and "Join" button in tier color. Variants: cards (vertical), horizontal (single row), vertical (stacked).
- **Content:** Array of membership tier data
- **Props:** `heading?: string`, `tiers?: TierData[]`, `showComparison?: boolean`, `variant?: 'cards'|'horizontal'|'vertical'`
- **Data Status:** PROPS-DRIVEN — uses `tiers` prop with `defaultTiers` fallback (Bronze $19, Silver $39, Gold $79)
- **Design Tokens:** 21
- **Use Cases:** Membership pricing, loyalty program tiers, gym membership, club memberships

#### Block #48: `loyaltyDashboard`
- **File:** `loyalty-dashboard-block.tsx` (224 lines)
- **Design:** Member dashboard with points balance (large number), tier progress bar, transaction history table (earned/redeemed), and rewards catalog grid. Variants: full (all sections), compact (summary only), widget (mini card).
- **Content:** Points balance, tier info, transactions, available rewards
- **Props:** `showTierProgress?: boolean`, `showHistory?: boolean`, `showRewards?: boolean`, `variant?: 'full'|'compact'|'widget'`
- **Data Status:** HARDCODED — 1,850 points, Silver tier, 5 transactions, 4 rewards
- **Design Tokens:** 54
- **Use Cases:** Loyalty program member dashboard, rewards page

#### Block #49: `loyaltyPointsDisplay`
- **File:** `loyalty-points-display-block.tsx` (253 lines)
- **Design:** Points display with tier badge, points balance, earning rate visualization, and quick actions (earn more, redeem, history). Animated point counter.
- **Content:** Points data, tier info, earning rates
- **Props:** `showTierBadge?: boolean`, `showEarningRate?: boolean`, `showQuickActions?: boolean`, `variant?: 'full'|'compact'|'badge'`
- **Data Status:** HARDCODED — placeholder points and tier data
- **Design Tokens:** 55
- **Use Cases:** Account header, sidebar widget, loyalty page

#### Block #50: `subscriptionManage`
- **File:** `subscription-manage-block.tsx` (201 lines)
- **Design:** Subscription management panel with current plan details, usage meters (bookings, storage, users, API calls), billing history table, and action buttons (upgrade, pause, cancel). Usage bars with color coding (green <70%, yellow 70-90%, red >90%).
- **Content:** Current subscription, usage data, billing records
- **Props:** `subscriptionId?: string`, `showUsage?: boolean`, `allowPause?: boolean`, `allowUpgrade?: boolean`
- **Data Status:** HARDCODED — Professional plan $29/mo, 5 billing records, 4 usage metrics
- **Design Tokens:** 29
- **Use Cases:** Subscription management page, account settings

#### Block #51: `referralProgram`
- **File:** `referral-program-block.tsx` (258 lines)
- **Design:** Referral dashboard with unique referral link (with copy button), referral stats (invited, joined, earned), sharing buttons (email, social), and referral history table. Tiered reward display.
- **Content:** Referral code, stats, history, reward tiers
- **Props:** `heading?: string`, `showStats?: boolean`, `showHistory?: boolean`, `showRewards?: boolean`, `shareChannels?: string[]`
- **Data Status:** HARDCODED — "DAKKAH-REFER-2026" code, placeholder stats
- **Design Tokens:** 60
- **Use Cases:** Referral program page, affiliate dashboard, "Invite Friends" section

---

### 10.7 Vertical-Specific Blocks

#### Block #52: `auctionBidding`
- **File:** `auction-bidding-block.tsx` (198 lines)
- **Design:** Live auction interface with current bid display (large number), countdown timer (D:H:M:S), bid input with quick-increment buttons (+$50/+$100/+$250), "Place Bid" button, and recent bid history table (bidder, amount, time). Variants: full (all sections), compact (bid + timer only), live (real-time feed).
- **Content:** Current bid, bid history, auction end time
- **Props:** `auctionId?: string`, `showHistory?: boolean`, `showCountdown?: boolean`, `variant?: 'full'|'compact'|'live'`
- **Data Status:** HARDCODED — currentBid: $1,250, 5 placeholder bids, hardcoded countdown
- **Design Tokens:** 47
- **Use Cases:** Auction detail page main content, live auction widget

#### Block #53: `rentalCalendar`
- **File:** `rental-calendar-block.tsx` (124 lines)
- **Design:** Date range picker for rental periods with calendar month view, start/end date selection, pricing unit display (hourly/daily/weekly/monthly), optional deposit display, and total calculation. Min duration enforcement.
- **Content:** Availability data, pricing per unit
- **Props:** `itemId?: string`, `pricingUnit?: 'hourly'|'daily'|'weekly'|'monthly'`, `showDeposit?: boolean`, `minDuration?: number`
- **Data Status:** HARDCODED — generated dates from current month
- **Design Tokens:** 25
- **Use Cases:** Rental item detail, equipment rental, property rental, vehicle rental

#### Block #54: `propertyListing`
- **File:** `property-listing-block.tsx` (158 lines)
- **Design:** Property cards with image placeholder, title, address, price, type badge (apartment/house/condo/commercial), specs row (bedrooms, bathrooms, sqft), and "View Details" CTA. Grid layout.
- **Content:** Array of property listings
- **Props:** `heading?: string`, `propertyType?: string`, `showMap?: boolean`, `layout?: 'grid'|'list'`
- **Data Status:** HARDCODED — placeholder properties with addresses and prices
- **Design Tokens:** 21
- **Use Cases:** Real estate listing page, property search results

#### Block #55: `vehicleListing`
- **File:** `vehicle-listing-block.tsx` (206 lines)
- **Design:** Vehicle cards with hero image, fuel type badge, price (prominent), title (year + make + model), specs row (year, mileage, transmission), and optional comparison checkbox. Make filter dropdown. Grid/list layout toggle.
- **Content:** Array of vehicle listings
- **Props:** `heading?: string`, `vehicleType?: string`, `layout?: 'grid'|'list'|'detailed'`, `showComparison?: boolean`
- **Data Status:** HARDCODED — 6 placeholder vehicles (Tesla Model 3, Toyota Camry, BMW X5, etc.)
- **Design Tokens:** 29
- **Use Cases:** Automotive listing page, vehicle search, comparison shopping

#### Block #56: `menuDisplay`
- **File:** `menu-display-block.tsx` (161 lines)
- **Design:** Restaurant menu with sidebar category tabs (Starters, Main Courses, Desserts, Drinks), item cards with name, description, price (formatted per currency), dietary badges (Vegetarian, Vegan, Gluten-Free, Halal, Kosher with emoji icons), "Popular" badge, and "Add to Order" button. Variants: grid (2-column), list (single column), visual (with food image thumbnails).
- **Content:** Array of menu categories with items
- **Props:** `heading?: string`, `categories?: MenuCategory[]`, `variant?: 'grid'|'list'|'visual'`, `showPrices?: boolean`, `showDietaryIcons?: boolean`, `currency?: string`
- **Data Status:** PROPS-DRIVEN with fallback — uses `categories` prop, falls back to `defaultCategories` (4 categories, 13 items)
- **Design Tokens:** 12
- **Use Cases:** Restaurant detail page, food ordering, café menu

#### Block #57: `courseCurriculum`
- **File:** `course-curriculum-block.tsx` (245 lines)
- **Design:** Expandable module tree with sections and lessons. Each module shows title, lesson count, total duration, and progress bar. Lessons show type icon (video/text/quiz), title, duration, and lock/unlock state. Expand/collapse animation. Variants: full (sidebar + content), accordion (stacked), sidebar (compact).
- **Content:** Array of course modules with lessons
- **Props:** `courseId?: string`, `showProgress?: boolean`, `expandAll?: boolean`, `variant?: 'full'|'accordion'|'sidebar'`
- **Data Status:** HARDCODED — 3 placeholder modules with 9 lessons
- **Design Tokens:** 39
- **Use Cases:** Course detail page, learning path, training program

#### Block #58: `eventSchedule`
- **File:** `event-schedule-block.tsx` (203 lines)
- **Design:** Multi-day event agenda with day tab switcher at top. Each day shows timeline of sessions with time, title, speaker, room, and track tag. Sessions color-coded by track (Engineering, Design, AI, Product, General). Optional bookmark button per session. Views: timeline (vertical flow), grid (room × time matrix), agenda (list format).
- **Content:** Array of event days with session data
- **Props:** `eventId?: string`, `view?: 'timeline'|'grid'|'agenda'`, `showSpeakers?: boolean`, `allowBookmark?: boolean`, `days?: EventDay[]`
- **Data Status:** HARDCODED — 2 default days with 12 sessions total
- **Design Tokens:** 24
- **Use Cases:** Conference/event detail page, workshop schedule, multi-day event program

#### Block #59: `eventList`
- **File:** `event-list-block.tsx` (210 lines)
- **Design:** Event cards with image, title, date (formatted by locale), location, category badge, and price. Layouts: timeline (vertical with date markers), grid (card grid), list (horizontal rows), calendar (month view placeholder). Supports past event filtering. Links to event detail pages.
- **Content:** Array of events with full metadata
- **Props:** `heading?: string`, `description?: string`, `events: EventItem[]`, `layout?: 'timeline'|'grid'|'list'|'calendar'`, `showPastEvents?: boolean`
- **Data Status:** PROPS-DRIVEN — requires events array (no default)
- **Design Tokens:** 18
- **Use Cases:** Event listing page, upcoming events section, event category page

#### Block #60: `healthcareProvider`
- **File:** `healthcare-provider-block.tsx` (160 lines)
- **Design:** Provider cards with avatar placeholder, name, specialty, location, star rating, review count, next availability ("Tomorrow, 10:00 AM"), insurance acceptance tags, and "Book Appointment" CTA button. Specialty filter tabs at top (All, Family Medicine, Cardiology, etc.). Layouts: grid (card grid), list (horizontal rows), cards (detailed cards).
- **Content:** Array of healthcare providers
- **Props:** `heading?: string`, `specialties?: string[]`, `showAvailability?: boolean`, `showRating?: boolean`, `layout?: 'grid'|'list'|'cards'`
- **Data Status:** HARDCODED — 6 placeholder providers (Dr. Sarah Johnson, Dr. Michael Chen, etc.)
- **Design Tokens:** 21
- **Use Cases:** Healthcare listing page, provider directory, find-a-doctor

#### Block #61: `fitnessClassSchedule`
- **File:** `fitness-class-schedule-block.tsx` (204 lines)
- **Design:** Weekly class schedule with day tab switcher, class cards showing time, class name, instructor, level badge (Beginner/Intermediate/Advanced), spots remaining counter, and "Join Class" button. Level filter at top.
- **Content:** Array of fitness classes per day
- **Props:** `heading?: string`, `showInstructor?: boolean`, `showLevel?: boolean`, `allowBooking?: boolean`
- **Data Status:** HARDCODED — 6 placeholder classes (Yoga Flow, HIIT Blast, etc.)
- **Design Tokens:** 27
- **Use Cases:** Fitness/gym listing page, class schedule, studio timetable

#### Block #62: `petProfileCard`
- **File:** `pet-profile-card-block.tsx` (223 lines)
- **Design:** Pet profile cards with photo placeholder, name, breed, age, weight, vaccination status badge, service history, and vet info section. Layouts: grid (card grid), list (horizontal rows), detailed (expanded with full info).
- **Content:** Array of pets with profiles
- **Props:** `heading?: string`, `showServices?: boolean`, `showVetInfo?: boolean`, `layout?: 'grid'|'list'|'detailed'`
- **Data Status:** HARDCODED — 3 placeholder pets (Luna/Golden Retriever, Milo/Tabby Cat, Rocky/German Shepherd)
- **Design Tokens:** 60
- **Use Cases:** Pet services listing, vet patient directory, pet store profiles

#### Block #63: `classifiedAdCard`
- **File:** `classified-ad-card-block.tsx` (187 lines)
- **Design:** Classified ad cards with image, title, price, location, posted date, condition badge, and seller info. Category filter. Layouts: grid (card grid), list (horizontal rows). Contact seller button.
- **Content:** Array of classified ads
- **Props:** `heading?: string`, `category?: string`, `layout?: 'grid'|'list'`, `showContactInfo?: boolean`
- **Data Status:** HARDCODED — 6 placeholder ads with prices and locations
- **Design Tokens:** 25
- **Use Cases:** Classifieds listing page, used items marketplace, community board

#### Block #64: `crowdfundingProgress`
- **File:** `crowdfunding-progress-block.tsx` (197 lines)
- **Design:** Campaign progress widget with animated progress bar, percentage funded label, stats row (raised amount, backer count, days left), preset donation amount buttons ($25/$50/$100/$250/$500), custom amount input, and "Back This Project" CTA. Variants: full (complete detail), widget (sidebar card), minimal (single-line progress).
- **Content:** Campaign progress data (goal, raised, backers, days)
- **Props:** `campaignId?: string`, `showBackers?: boolean`, `showUpdates?: boolean`, `variant?: 'full'|'widget'|'minimal'`
- **Data Status:** HARDCODED — placeholderCampaign (goal: $50,000, raised: $37,500, 842 backers, 18 days)
- **Design Tokens:** 43
- **Use Cases:** Crowdfunding campaign detail, campaign widget sidebar, campaign list cards

#### Block #65: `donationCampaign`
- **File:** `donation-campaign-block.tsx` (229 lines)
- **Design:** Charity donation interface with campaign title, description, progress bar with percentage, impact statistics grid (Wells Built, People Served, Communities, Countries), preset donation buttons ($10/$25/$50/$100/$250), custom amount input, recurring donation toggle, and "Donate Now" CTA. Variants: full (all sections), compact (form + progress), widget (minimal card).
- **Content:** Campaign data, impact stats, donation form
- **Props:** `campaignId?: string`, `showImpact?: boolean`, `presetAmounts?: number[]`, `allowRecurring?: boolean`, `variant?: 'full'|'compact'|'widget'`
- **Data Status:** HARDCODED — placeholderCampaign (goal: $200,000, raised: $128,500, 3,240 donors), 4 impact stats
- **Design Tokens:** 41
- **Use Cases:** Charity campaign detail, donation page, nonprofit landing

#### Block #66: `freelancerProfile`
- **File:** `freelancer-profile-block.tsx` (247 lines)
- **Design:** Freelancer portfolio page with hero section (name, title, hourly rate, availability badge), skill tags grid, portfolio project grid (title + category), client reviews with star ratings, and key stats (completed projects, rating, review count). Layouts: full (page layout), card (compact card), sidebar (narrow profile).
- **Content:** Freelancer profile data, portfolio items, reviews
- **Props:** `heading?: string`, `showPortfolio?: boolean`, `showReviews?: boolean`, `showAvailability?: boolean`, `layout?: 'full'|'card'|'sidebar'`
- **Data Status:** HARDCODED — "Jordan Rivera, Senior Full-Stack Developer" with $95/hr, 8 skills, 6 portfolio items, 3 reviews
- **Design Tokens:** 60
- **Use Cases:** Freelancer detail page, talent directory, skill marketplace

#### Block #67: `parkingSpotFinder`
- **File:** `parking-spot-finder-block.tsx` (220 lines)
- **Design:** Parking spot browser with type filter buttons (All, Covered, Open Air, Valet, EV Charging), spot cards with spot number, type badge, floor info, rate display (hourly/daily/monthly), availability status indicator (green/red), and "Reserve" button. Variants: map (with map view), list (card list), hybrid (split view).
- **Content:** Array of parking spots with rates and availability
- **Props:** `locationId?: string`, `showMap?: boolean`, `showPricing?: boolean`, `filterByType?: ('covered'|'open'|'valet'|'ev_charging')[]`, `variant?: 'map'|'list'|'hybrid'`
- **Data Status:** HARDCODED — 6 placeholder parking spots with rates ($4-$8/hr)
- **Design Tokens:** 23
- **Use Cases:** Parking zone detail page, parking search, facility parking section

---

### 10.8 B2B Blocks

#### Block #68: `purchaseOrderForm`
- **File:** `purchase-order-form-block.tsx` (278 lines)
- **Design:** B2B purchase order creation form with line item table (product, quantity, unit price, total), add/remove item buttons, shipping address section, notes field, budget limit display, approval required checkbox, and submit button. Total calculation with tax.
- **Content:** Product catalog for selection, shipping addresses, budget limits
- **Props:** `heading?: string`, `requiresApproval?: boolean`, `showBudget?: boolean`, `defaultShipping?: string`
- **Data Status:** PARTIALLY HARDCODED — form structure + 3 placeholder line items
- **Design Tokens:** 45
- **Use Cases:** B2B ordering page, wholesale purchase, procurement form

#### Block #69: `bulkPricingTable`
- **File:** `bulk-pricing-table-block.tsx` (277 lines)
- **Design:** Volume discount table showing quantity tiers (1-9, 10-49, 50-99, 100+), unit price per tier, savings percentage, and order form. Calculator tool to estimate total based on quantity input. Request-a-quote CTA for custom quantities.
- **Content:** Pricing tier data with quantity breaks
- **Props:** `heading?: string`, `productId?: string`, `tiers?: {minQty, maxQty, unitPrice, savings}[]`, `showCalculator?: boolean`, `showQuoteRequest?: boolean`, `currency?: string`
- **Data Status:** PROPS-DRIVEN — accepts tiers array
- **Design Tokens:** 47
- **Use Cases:** B2B product detail, wholesale pricing, volume deals page

#### Block #70: `companyDashboard`
- **File:** `company-dashboard-block.tsx` (185 lines)
- **Design:** B2B company overview dashboard with company info card, spending summary, recent orders list, team member count, and budget utilization meter. Quick action buttons.
- **Content:** Company data, spending data, team info
- **Props:** `showSpending?: boolean`, `showTeam?: boolean`, `showOrders?: boolean`, `showBudget?: boolean`, `variant?: 'full'|'summary'`
- **Data Status:** HARDCODED — placeholder company data
- **Design Tokens:** 46
- **Use Cases:** B2B company dashboard, procurement overview

#### Block #71: `approvalWorkflow`
- **File:** `approval-workflow-block.tsx` (287 lines)
- **Design:** Multi-stage approval pipeline with status indicator per stage (pending/approved/rejected), approver info, comments, timestamps, and action buttons (approve/reject/escalate). Visual workflow diagram.
- **Content:** Approval stages, approver data, comments
- **Props:** `workflowId?: string`, `showTimeline?: boolean`, `allowComments?: boolean`, `stages?: Stage[]`
- **Data Status:** HARDCODED — 4-stage placeholder workflow
- **Design Tokens:** 63
- **Use Cases:** B2B purchase approval, vendor application review, content approval

---

### 10.9 Admin/Manage Blocks

#### Block #72: `manageStats`
- **File:** `manage-stats-block.tsx` (61 lines)
- **Design:** Summary stat cards in a row — each card shows metric label, value, and optional trend indicator. Compact admin-style layout.
- **Content:** Array of stat items
- **Props:** `heading?: string`, `stats?: {label, value, trend?}[]`
- **Data Status:** PROPS-DRIVEN
- **Design Tokens:** 1
- **Use Cases:** Admin dashboard header, manage page summary

#### Block #73: `manageRecentOrders`
- **File:** `manage-recent-orders-block.tsx` (107 lines)
- **Design:** Recent orders table with order ID, customer name, date, total, status badge (pending/processing/shipped/delivered), and action button. Compact admin format.
- **Content:** Array of recent orders
- **Props:** `heading?: string`, `orders?: Order[]`, `limit?: number`, `showStatus?: boolean`
- **Data Status:** PROPS-DRIVEN
- **Design Tokens:** 15
- **Use Cases:** Admin dashboard, order management overview

#### Block #74: `manageActivity`
- **File:** `manage-activity-block.tsx` (74 lines)
- **Design:** Activity feed with icon-coded entries (order=cart, product=tag, team=users, setting=gear). Each entry shows description, actor name, and relative timestamp. Color-coded icons per type.
- **Content:** Array of activity entries
- **Props:** `heading?: string`, `activities?: {type, description, actor?, timestamp}[]`, `limit?: number`
- **Data Status:** PROPS-DRIVEN
- **Design Tokens:** 9
- **Use Cases:** Admin dashboard activity log, team activity feed

#### Block #75: `promotionBanner`
- **File:** `promotion-banner-block.tsx` (169 lines)
- **Design:** Promotional banner with heading, description, discount code (with copy button), expiry date, and "Shop Now" CTA. Variants: bar (top/bottom sticky), card (inline container), floating (fixed position overlay). Dismissible with X button.
- **Content:** Promotion details, discount code, expiry
- **Props:** `heading?: string`, `description?: string`, `code?: string`, `expiresAt?: string`, `variant?: 'bar'|'card'|'floating'`, `dismissible?: boolean`, `ctaLabel?: string`, `ctaUrl?: string`
- **Data Status:** PROPS-DRIVEN with defaults
- **Design Tokens:** 11
- **Use Cases:** Site-wide promotion, seasonal sale, new user discount

#### Block #76: `testimonial`
- **File:** `testimonial-block.tsx` (—)
- **Design:** Customer testimonial cards with quote text, author name, title, company, avatar, and star rating. Layouts: grid (card grid), carousel (horizontal scroll), stacked (vertical).
- **Content:** Array of testimonials
- **Props:** `heading?: string`, `testimonials: {quote, author, title?, company?, avatar?, rating?}[]`, `layout?: 'grid'|'carousel'|'stacked'`, `columns?: 1|2|3`, `showRating?: boolean`
- **Data Status:** PROPS-DRIVEN
- **Use Cases:** Landing pages, service pages, course reviews, member stories

#### Block #77: (Block registry count includes all 77 mapped entries including `testimonial`)

---

## Section 11: Block Assignment per Detail Page — Complete Mapping

For each of the 50 detail pages, the following defines exactly which existing blocks should be imported and which new blocks are needed (marked as `[NEW]`).

### Legend
- **E** = Existing block, ready to use (Tier A)
- **R** = Existing block, needs refactoring to accept real data (Tier B)
- **N** = New block needed (does not exist yet)
- **Breadcrumbs** = Every page needs a `[NEW] breadcrumbNav` block or keeps inline breadcrumb JSX

---

### 11.1 High-Value Verticals (Rich vertical-specific blocks available)

#### Page 1: `auctions/$id.tsx` (262 lines)
| Section | Block | Registry Key | Status | Notes |
|---|---|---|---|---|
| Hero image/banner | `hero` | hero | **E** | Pass item thumbnail as backgroundImage |
| Image gallery | `imageGallery` | imageGallery | **E** | Pass item.images array |
| Bidding interface | `auctionBidding` | auctionBidding | **R** | Needs: currentBid, bids[], endTime props |
| Item description | `richText` | richText | **E** | Pass item.description |
| Review section | `reviewList` | reviewList | **R** | Needs: reviews[] prop |
| Recently viewed | `recentlyViewed` | recentlyViewed | **R** | Needs: products[] prop |
| Seller info | `vendorProfile` | vendorProfile | **E** | Pass seller data |
| **Missing:** | Bid notification toast | — | **N** | `[NEW] bidNotification` for real-time bid alerts |

#### Page 2: `restaurants/$id.tsx` (229 lines)
| Section | Block | Registry Key | Status | Notes |
|---|---|---|---|---|
| Hero image | `hero` | hero | **E** | Restaurant banner image |
| Restaurant menu | `menuDisplay` | menuDisplay | **E** | categories prop — BEST integration target |
| Image gallery | `imageGallery` | imageGallery | **E** | Ambiance photos |
| Reviews | `reviewList` | reviewList | **R** | Customer reviews |
| Map/location | `map` | map | **R** | Restaurant location |
| Recently viewed | `recentlyViewed` | recentlyViewed | **R** | Recently browsed restaurants |
| **Missing:** | Hours display | — | **N** | `[NEW] businessHours` block |
| **Missing:** | Reservation form | — | **N** | `[NEW] reservationForm` block |

#### Page 3: `healthcare/$id.tsx` (220 lines)
| Section | Block | Registry Key | Status | Notes |
|---|---|---|---|---|
| Hero | `hero` | hero | **E** | Provider banner |
| Provider list/detail | `healthcareProvider` | healthcareProvider | **R** | Needs: providers[] prop |
| Appointment booking | `appointmentSlots` | appointmentSlots | **R** | Needs: timeSlots from API |
| Booking calendar | `bookingCalendar` | bookingCalendar | **R** | Needs: timeSlots, bookedDates |
| Reviews | `reviewList` | reviewList | **R** | Patient reviews |
| FAQ | `faq` | faq | **E** | Healthcare FAQ items |
| **Missing:** | Insurance checker | — | **N** | `[NEW] insuranceChecker` block |
| **Missing:** | Credentials display | — | **N** | `[NEW] credentialsList` block (or use existing inline) |

#### Page 4: `education/$id.tsx` (263 lines)
| Section | Block | Registry Key | Status | Notes |
|---|---|---|---|---|
| Hero | `hero` | hero | **E** | Course banner |
| Curriculum | `courseCurriculum` | courseCurriculum | **R** | Needs: modules[] prop |
| Subscription plans | `subscriptionPlans` | subscriptionPlans | **E** | Learning plans |
| Reviews | `reviewList` | reviewList | **R** | Student reviews |
| Testimonials | `testimonial` | testimonial | **E** | Student success stories |
| **Missing:** | Enrollment form | — | **N** | `[NEW] enrollmentForm` or use `bookingCta` |
| **Missing:** | Instructor profile | — | **N** | `[NEW] instructorProfile` or adapt `freelancerProfile` |

#### Page 5: `crowdfunding/$id.tsx` (248 lines)
| Section | Block | Registry Key | Status | Notes |
|---|---|---|---|---|
| Hero | `hero` | hero | **E** | Campaign banner |
| Progress + backing | `crowdfundingProgress` | crowdfundingProgress | **R** | Needs: campaign data prop |
| Image gallery | `imageGallery` | imageGallery | **E** | Campaign images |
| Description | `richText` | richText | **E** | Campaign description |
| Reviews | `reviewList` | reviewList | **R** | Backer comments |
| Stats | `stats` | stats | **E** | Campaign metrics |
| Recently viewed | `recentlyViewed` | recentlyViewed | **R** | Other campaigns |

#### Page 6: `charity/$id.tsx` (243 lines)
| Section | Block | Registry Key | Status | Notes |
|---|---|---|---|---|
| Hero | `hero` | hero | **E** | Campaign banner |
| Donation form | `donationCampaign` | donationCampaign | **R** | Needs: campaign data prop |
| Impact stats | `stats` | stats | **E** | Impact numbers |
| Progress bar | `crowdfundingProgress` | crowdfundingProgress | **R** | Donation progress |
| Reviews | `reviewList` | reviewList | **R** | Donor testimonials |
| FAQ | `faq` | faq | **E** | Donation FAQ |

#### Page 7: `events/$id.tsx` (319 lines)
| Section | Block | Registry Key | Status | Notes |
|---|---|---|---|---|
| Hero | `hero` | hero | **E** | Event banner |
| Schedule | `eventSchedule` | eventSchedule | **R** | Needs: days/sessions prop |
| Event list | `eventList` | eventList | **E** | Related events |
| Map/venue | `map` | map | **R** | Venue location |
| Reviews | `reviewList` | reviewList | **R** | Attendee reviews |
| Newsletter | `newsletter` | newsletter | **R** | Event updates signup |
| **Missing:** | Ticket selector | — | **N** | `[NEW] ticketSelector` block |

#### Page 8: `fitness/$id.tsx` (228 lines)
| Section | Block | Registry Key | Status | Notes |
|---|---|---|---|---|
| Hero | `hero` | hero | **E** | Gym/studio banner |
| Class schedule | `fitnessClassSchedule` | fitnessClassSchedule | **R** | Needs: classes[] prop |
| Membership tiers | `membershipTiers` | membershipTiers | **E** | Gym membership plans |
| Testimonials | `testimonial` | testimonial | **E** | Member stories |
| Reviews | `reviewList` | reviewList | **R** | Gym reviews |
| Booking CTA | `bookingCta` | bookingCTA | **E** | "Book a Trial" |

#### Page 9: `freelance/$id.tsx` (246 lines)
| Section | Block | Registry Key | Status | Notes |
|---|---|---|---|---|
| Hero | `hero` | hero | **E** | Freelancer banner |
| Profile | `freelancerProfile` | freelancerProfile | **R** | Needs: freelancer data prop |
| Reviews | `reviewList` | reviewList | **R** | Client reviews |
| **Missing:** | Hire form / contact | — | **N** | `[NEW] hireForm` or use `contactForm` |
| **Missing:** | Service packages | — | **N** | Adapt `pricing` block |

#### Page 10: `automotive/$id.tsx` (205 lines)
| Section | Block | Registry Key | Status | Notes |
|---|---|---|---|---|
| Hero | `hero` | hero | **E** | Vehicle banner |
| Vehicle specs | `vehicleListing` | vehicleListing | **R** | Needs: vehicles[] prop (single item) |
| Image gallery | `imageGallery` | imageGallery | **E** | Vehicle photos |
| Comparison | `comparisonTable` | comparisonTable | **E** | Spec comparison |
| Reviews | `reviewList` | reviewList | **R** | Vehicle reviews |
| **Missing:** | Financing calculator | — | **N** | `[NEW] financingCalculator` block |

#### Page 11: `real-estate/$id.tsx` (213 lines)
| Section | Block | Registry Key | Status | Notes |
|---|---|---|---|---|
| Hero | `hero` | hero | **E** | Property banner |
| Property details | `propertyListing` | propertyListing | **R** | Needs: properties[] prop |
| Image gallery | `imageGallery` | imageGallery | **E** | Property photos |
| Map | `map` | map | **R** | Property location |
| Contact form | `contactForm` | contactForm | **R** | Inquiry form |
| **Missing:** | Mortgage calculator | — | **N** | `[NEW] mortgageCalculator` block |
| **Missing:** | Virtual tour | — | **N** | Use `videoEmbed` block |

#### Page 12: `parking/$id.tsx` (245 lines)
| Section | Block | Registry Key | Status | Notes |
|---|---|---|---|---|
| Hero | `hero` | hero | **E** | Parking zone banner |
| Spot finder | `parkingSpotFinder` | parkingSpotFinder | **R** | Needs: spots[] prop |
| Map | `map` | map | **R** | Parking location |
| Pricing | `pricing` | pricing | **E** | Parking rates |
| Reviews | `reviewList` | reviewList | **R** | User reviews |

#### Page 13: `classifieds/$id.tsx` (222 lines)
| Section | Block | Registry Key | Status | Notes |
|---|---|---|---|---|
| Hero | `hero` | hero | **E** | Ad image |
| Ad detail | `classifiedAdCard` | classifiedAdCard | **R** | Needs: ads[] prop |
| Image gallery | `imageGallery` | imageGallery | **E** | Item photos |
| Contact form | `contactForm` | contactForm | **R** | Seller contact |
| Map | `map` | map | **R** | Item location |
| **Missing:** | Safety tips | — | **N** | Use `faq` block |

#### Page 14: `pet-services/$id.tsx` (246 lines)
| Section | Block | Registry Key | Status | Notes |
|---|---|---|---|---|
| Hero | `hero` | hero | **E** | Pet service banner |
| Pet profile | `petProfileCard` | petProfileCard | **R** | Needs: pets[] prop |
| Service list | `serviceList` | serviceList | **E** | Available pet services |
| Booking CTA | `bookingCta` | bookingCTA | **E** | "Book Service" |
| Reviews | `reviewList` | reviewList | **R** | Pet owner reviews |

#### Page 15: `rentals/$id.tsx` (288 lines)
| Section | Block | Registry Key | Status | Notes |
|---|---|---|---|---|
| Hero | `hero` | hero | **E** | Rental item banner |
| Rental calendar | `rentalCalendar` | rentalCalendar | **R** | Needs: availability prop |
| Pricing | `pricing` | pricing | **E** | Rental rates |
| Image gallery | `imageGallery` | imageGallery | **E** | Item photos |
| Reviews | `reviewList` | reviewList | **R** | Renter reviews |

---

### 11.2 Service-Based Verticals

#### Page 16: `bookings/$id.tsx` (249 lines)
| Block | Registry Key | Status |
|---|---|---|
| `hero` | hero | **E** |
| `bookingCalendar` | bookingCalendar | **R** |
| `appointmentSlots` | appointmentSlots | **R** |
| `bookingCta` | bookingCTA | **E** |
| `reviewList` | reviewList | **R** |
| `serviceList` | serviceList | **E** |

#### Page 17: `legal/$id.tsx` (249 lines)
| Block | Registry Key | Status |
|---|---|---|
| `hero` | hero | **E** |
| `serviceList` | serviceList | **E** — Practice areas |
| `bookingCalendar` | bookingCalendar | **R** — Consultation scheduling |
| `faq` | faq | **E** — Legal FAQ |
| `contactForm` | contactForm | **R** |
| `reviewList` | reviewList | **R** |

#### Page 18: `insurance/$id.tsx` (237 lines)
| Block | Registry Key | Status |
|---|---|---|
| `hero` | hero | **E** |
| `serviceList` | serviceList | **E** — Insurance plans |
| `comparisonTable` | comparisonTable | **E** — Plan comparison |
| `faq` | faq | **E** |
| `contactForm` | contactForm | **R** |
| `reviewList` | reviewList | **R** |

#### Page 19: `government/$id.tsx` (247 lines)
| Block | Registry Key | Status |
|---|---|---|
| `hero` | hero | **E** |
| `serviceList` | serviceList | **E** — Government services |
| `timeline` | timeline | **E** — Processing steps |
| `contactForm` | contactForm | **R** |
| `faq` | faq | **E** |

#### Page 20: `travel/$id.tsx` (286 lines)
| Block | Registry Key | Status |
|---|---|---|
| `hero` | hero | **E** |
| `imageGallery` | imageGallery | **E** — Destination photos |
| `bookingCalendar` | bookingCalendar | **R** — Check availability |
| `reviewList` | reviewList | **R** |
| `map` | map | **R** — Destination location |
| `pricing` | pricing | **E** — Package prices |

---

### 11.3 Commerce Verticals

#### Page 21: `subscriptions/$id.tsx` (241 lines)
| Block | Registry Key | Status |
|---|---|---|
| `hero` | hero | **E** |
| `subscriptionPlans` | subscriptionPlans | **E** |
| `comparisonTable` | comparisonTable | **E** |
| `faq` | faq | **E** |
| `reviewList` | reviewList | **R** |

#### Page 22: `memberships/$id.tsx` (185 lines)
| Block | Registry Key | Status |
|---|---|---|
| `hero` | hero | **E** |
| `membershipTiers` | membershipTiers | **E** |
| `featureGrid` | featureGrid | **E** — Member benefits |
| `testimonial` | testimonial | **E** |
| `faq` | faq | **E** |

#### Page 23: `loyalty-program/$id.tsx` (199 lines)
| Block | Registry Key | Status |
|---|---|---|
| `hero` | hero | **E** |
| `loyaltyDashboard` | loyaltyDashboard | **R** — Needs user data |
| `loyaltyPointsDisplay` | loyaltyPointsDisplay | **R** |
| `membershipTiers` | membershipTiers | **E** — Tier overview |
| `referralProgram` | referralProgram | **R** |

#### Page 24: `flash-deals/$id.tsx` (216 lines)
| Block | Registry Key | Status |
|---|---|---|
| `hero` | hero | **E** |
| `flashSaleCountdown` | flashSaleCountdown | **R** — Needs endTime, products |
| `productDetail` | productDetail | **R** |
| `reviewList` | reviewList | **R** |

#### Page 25: `gift-cards-shop/$id.tsx` (191 lines)
| Block | Registry Key | Status |
|---|---|---|
| `hero` | hero | **E** |
| `giftCardDisplay` | giftCardDisplay | **R** — Needs denominations |
| `reviewList` | reviewList | **R** |

#### Page 26: `bundles/$id.tsx` (210 lines)
| Block | Registry Key | Status |
|---|---|---|
| `hero` | hero | **E** |
| `productGrid` | productGrid | **E** — Bundle items |
| `pricing` | pricing | **E** — Bundle vs individual |
| `reviewList` | reviewList | **R** |

#### Page 27: `digital/$id.tsx` (181 lines)
| Block | Registry Key | Status |
|---|---|---|
| `hero` | hero | **E** |
| `productDetail` | productDetail | **R** — Digital product detail |
| `reviewList` | reviewList | **R** |
| **Missing:** | Download/license info | **N** | `[NEW] digitalDelivery` block |

#### Page 28: `grocery/$id.tsx` (249 lines)
| Block | Registry Key | Status |
|---|---|---|
| `hero` | hero | **E** |
| `productDetail` | productDetail | **R** |
| `categoryGrid` | categoryGrid | **E** — Related categories |
| `reviewList` | reviewList | **R** |

---

### 11.4 Marketplace Variants

#### Page 29: `vendors/$id.tsx` (293 lines)
| Block | Registry Key | Status |
|---|---|---|
| `hero` | hero | **E** |
| `vendorProfile` | vendorProfile | **E** |
| `vendorProducts` | vendorProducts | **R** — Needs vendor products |
| `reviewList` | reviewList | **R** |
| `contactForm` | contactForm | **R** |

#### Page 30: `affiliate/$id.tsx` (180 lines)
| Block | Registry Key | Status |
|---|---|---|
| `hero` | hero | **E** |
| `referralProgram` | referralProgram | **R** |
| `stats` | stats | **E** — Program stats |
| `faq` | faq | **E** |

#### Page 31: `social-commerce/$id.tsx` (225 lines)
| Block | Registry Key | Status |
|---|---|---|
| `hero` | hero | **E** |
| `socialProof` | socialProof | **R** — Social commerce feed |
| `productGrid` | productGrid | **E** |
| `reviewList` | reviewList | **R** |

---

### 11.5 Financial & Credit Verticals

#### Page 32: `financial/$id.tsx` (245 lines)
| Block | Registry Key | Status |
|---|---|---|
| `hero` | hero | **E** |
| `serviceList` | serviceList | **E** |
| `comparisonTable` | comparisonTable | **E** |
| `faq` | faq | **E** |
| `contactForm` | contactForm | **R** |

#### Page 33: `credit/$id.tsx` (259 lines)
| Block | Registry Key | Status |
|---|---|---|
| `hero` | hero | **E** |
| `pricing` | pricing | **E** — Credit plans |
| `comparisonTable` | comparisonTable | **E** |
| `faq` | faq | **E** |
| `timeline` | timeline | **E** — Application process |
| `reviewList` | reviewList | **R** |

#### Page 34: `warranties/$id.tsx` (257 lines)
| Block | Registry Key | Status |
|---|---|---|
| `hero` | hero | **E** |
| `serviceList` | serviceList | **E** — Warranty options |
| `comparisonTable` | comparisonTable | **E** — Coverage comparison |
| `faq` | faq | **E** |
| `reviewList` | reviewList | **R** |

---

### 11.6 B2B & Wholesale Verticals

#### Page 35: `b2b/$id.tsx` (242 lines)
| Block | Registry Key | Status |
|---|---|---|
| `hero` | hero | **E** |
| `purchaseOrderForm` | purchaseOrderForm | **R** |
| `bulkPricingTable` | bulkPricingTable | **E** |
| `companyDashboard` | companyDashboard | **R** |
| `reviewList` | reviewList | **R** |

#### Page 36: `volume-deals/$id.tsx` (225 lines)
| Block | Registry Key | Status |
|---|---|---|
| `hero` | hero | **E** |
| `bulkPricingTable` | bulkPricingTable | **E** |
| `productDetail` | productDetail | **R** |
| `reviewList` | reviewList | **R** |

#### Page 37: `white-label/$id.tsx` (213 lines)
| Block | Registry Key | Status |
|---|---|---|
| `hero` | hero | **E** |
| `pricing` | pricing | **E** |
| `featureGrid` | featureGrid | **E** |
| `faq` | faq | **E** |
| `contactForm` | contactForm | **R** |

#### Page 38: `white-label-shop/$id.tsx` (239 lines)
| Block | Registry Key | Status |
|---|---|---|
| `hero` | hero | **E** |
| `productDetail` | productDetail | **R** |
| `reviewList` | reviewList | **R** |

---

### 11.7 Remaining Detail Pages

#### Page 39: `campaigns/$id.tsx` (181 lines)
| Block | Registry Key | Status |
|---|---|---|
| `hero` | hero | **E** |
| `crowdfundingProgress` | crowdfundingProgress | **R** |
| `richText` | richText | **E** |
| `reviewList` | reviewList | **R** |

#### Page 40: `consignment/$id.tsx` (213 lines)
| Block | Registry Key | Status |
|---|---|---|
| `hero` | hero | **E** |
| `productDetail` | productDetail | **R** |
| `pricing` | pricing | **E** |
| `reviewList` | reviewList | **R** |

#### Page 41: `consignment-shop/$id.tsx` (212 lines)
Same as consignment — duplicate page, recommend merging.

#### Page 42: `dropshipping/$id.tsx` (205 lines)
| Block | Registry Key | Status |
|---|---|---|
| `hero` | hero | **E** |
| `productDetail` | productDetail | **R** |
| `vendorProfile` | vendorProfile | **E** |
| `reviewList` | reviewList | **R** |

#### Page 43: `dropshipping-marketplace/$id.tsx` (211 lines)
Same blocks as dropshipping — duplicate page, recommend merging.

#### Page 44: `newsletter/$id.tsx` (259 lines)
| Block | Registry Key | Status |
|---|---|---|
| `hero` | hero | **E** |
| `newsletter` | newsletter | **R** |
| `blogPost` | blogPost | **R** — Newsletter content |
| `reviewList` | reviewList | **R** |

#### Page 45: `print-on-demand/$id.tsx` (217 lines)
| Block | Registry Key | Status |
|---|---|---|
| `hero` | hero | **E** |
| `productDetail` | productDetail | **R** |
| `imageGallery` | imageGallery | **E** — Design previews |
| `reviewList` | reviewList | **R** |
| **Missing:** | Design customizer | **N** | `[NEW] designCustomizer` block |

#### Page 46: `print-on-demand-shop/$id.tsx` (207 lines)
Same as print-on-demand — duplicate page.

#### Page 47: `trade-in/$id.tsx` (219 lines)
| Block | Registry Key | Status |
|---|---|---|
| `hero` | hero | **E** |
| `productDetail` | productDetail | **R** — Item being traded |
| `pricing` | pricing | **E** — Trade-in value |
| `timeline` | timeline | **E** — Trade-in process |
| `faq` | faq | **E** |

#### Page 48: `try-before-you-buy/$id.tsx` (201 lines)
| Block | Registry Key | Status |
|---|---|---|
| `hero` | hero | **E** |
| `productDetail` | productDetail | **R** |
| `timeline` | timeline | **E** — Trial process |
| `faq` | faq | **E** |
| `reviewList` | reviewList | **R** |

#### Page 49: `quotes/$id.tsx` (74 lines)
| Block | Registry Key | Status |
|---|---|---|
| `hero` | hero | **E** |
| `contactForm` | contactForm | **R** — Quote request form |
| `serviceList` | serviceList | **E** — Available services |
| **Missing:** | Quote calculator | **N** | `[NEW] quoteCalculator` block |

#### Page 50: `places/$id.tsx` (83 lines)
| Block | Registry Key | Status |
|---|---|---|
| `hero` | hero | **E** |
| `imageGallery` | imageGallery | **E** — Place photos |
| `map` | map | **R** — Place location |
| `reviewList` | reviewList | **R** |
| `contactForm` | contactForm | **R** |

---

## Section 12: Summary — Block Coverage Statistics

### Existing Blocks Coverage

| Metric | Count |
|---|---|
| **Total detail pages** | 50 |
| **Existing blocks that can serve detail pages** | 42 of 77 |
| **Blocks ready to use immediately (Tier A)** | 15 |
| **Blocks needing refactoring (Tier B)** | 27 |
| **Admin-only blocks (Tier C, not for detail pages)** | 11 |
| **Pages fully coverable with existing blocks** | 50 (all pages) |
| **New blocks needed** | 8 specialized blocks |

### New Blocks Needed

| New Block | For Vertical(s) | Priority |
|---|---|---|
| `[NEW] breadcrumbNav` | All 50 pages (or keep inline) | P2 |
| `[NEW] businessHours` | restaurants, fitness, healthcare | P1 |
| `[NEW] reservationForm` | restaurants, travel | P1 |
| `[NEW] ticketSelector` | events | P1 |
| `[NEW] insuranceChecker` | healthcare | P2 |
| `[NEW] financingCalculator` | automotive, real-estate | P2 |
| `[NEW] designCustomizer` | print-on-demand | P3 |
| `[NEW] quoteCalculator` | quotes | P3 |

### Refactoring Priority by Impact

| Priority | Block Count | Impact |
|---|---|---|
| **P0 — Critical (used on 5+ pages)** | `reviewList`, `recentlyViewed`, `productDetail` | 3 blocks → unblocks 40+ pages |
| **P1 — High (vertical-specific)** | `auctionBidding`, `crowdfundingProgress`, `donationCampaign`, `menuDisplay`, `bookingCalendar`, `healthcareProvider`, `courseCurriculum`, `eventSchedule` | 8 blocks → unblocks 8 key verticals |
| **P2 — Medium** | `freelancerProfile`, `vehicleListing`, `fitnessClassSchedule`, `parkingSpotFinder`, `petProfileCard`, `classifiedAdCard`, `propertyListing`, `rentalCalendar` | 8 blocks → unblocks 8 more verticals |
| **P3 — Low** | `appointmentSlots`, `providerSchedule`, `resourceAvailability`, `flashSaleCountdown`, `giftCardDisplay`, `socialProof`, `map`, `contactForm`, `newsletter` | 9 blocks → polish and completeness |

### Block Import Count per Page

| Pages with this many blocks | Count | Example |
|---|---|---|
| 6+ blocks | 15 pages | healthcare (6), restaurants (6), events (6) |
| 4-5 blocks | 25 pages | crowdfunding (5), fitness (5), legal (5) |
| 3 blocks | 10 pages | campaigns (3), digital (3) |

---

## Section 13: Missing Blocks — Design Specifications

### `[NEW] breadcrumbNav` Block
- **Design:** Horizontal path: Home > Vertical > Item Name, with separator chevrons, truncation on long names
- **Props:** `items: {label, href}[]`, `separator?: '/'|'>'|'·'`
- **Lines estimate:** ~40 lines
- **Design tokens:** `text-ds-muted-foreground`, `hover:text-ds-foreground`, `bg-ds-card`, `border-ds-border`

### `[NEW] businessHours` Block
- **Design:** Day-of-week list with hours, current status indicator (Open/Closed with green/red dot)
- **Props:** `hours: {day, open, close}[]`, `showCurrentStatus?: boolean`
- **Lines estimate:** ~60 lines
- **Design tokens:** `text-ds-foreground`, `text-ds-muted-foreground`, `bg-ds-success`, `bg-ds-destructive`

### `[NEW] reservationForm` Block
- **Design:** Date picker, party size selector, time slot selector, name/email/phone fields, "Reserve" button
- **Props:** `availableSlots?: TimeSlot[]`, `maxPartySize?: number`, `restaurantId?: string`
- **Lines estimate:** ~120 lines

### `[NEW] ticketSelector` Block
- **Design:** Ticket type cards (General, VIP, Early Bird) with price, quantity picker, and "Buy Tickets" button
- **Props:** `tickets: {type, price, available, description}[]`, `eventId?: string`, `maxPerOrder?: number`
- **Lines estimate:** ~100 lines

### `[NEW] insuranceChecker` Block
- **Design:** Dropdown to select insurance provider, verification status display
- **Props:** `acceptedInsurance: string[]`, `providerId?: string`
- **Lines estimate:** ~50 lines

### `[NEW] financingCalculator` Block
- **Design:** Sliders for price/down-payment/term, monthly payment calculation display
- **Props:** `price: number`, `minDown?: number`, `rates?: {term, apr}[]`
- **Lines estimate:** ~100 lines

### `[NEW] designCustomizer` Block
- **Design:** Canvas preview area, color picker, text input, upload button, product template selector
- **Props:** `templates: {id, name, preview}[]`, `productId?: string`
- **Lines estimate:** ~150 lines

### `[NEW] quoteCalculator` Block
- **Design:** Service selection checkboxes, quantity inputs, estimated total display, "Request Quote" button
- **Props:** `services: {id, name, basePrice}[]`, `allowCustom?: boolean`
- **Lines estimate:** ~100 lines
