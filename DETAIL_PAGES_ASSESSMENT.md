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

### 7.8 Block Component Quality Assessment

Most blocks contain **hardcoded placeholder data** rather than rendering from props. This means even if blocks were integrated into detail pages, many would need refactoring to accept and display real API data:

| Quality Level | Count | Pattern |
|---|---|---|
| **Props-driven with real data support** | ~15 | hero, content, cta, features, faq, products, pricing, testimonial, review-list, etc. |
| **Props-defined but renders hardcoded data** | ~45 | auction-bidding (hardcoded bid history), crowdfunding-progress (hardcoded $1,250 goal), event-schedule (hardcoded events), etc. |
| **Fully hardcoded / placeholder-only** | ~17 | commission-dashboard, loyalty-dashboard, approval-workflow, etc. |

### 7.9 What the Block System SHOULD Enable

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

### 7.10 Recommended Block Integration Strategy

| Phase | Action | Impact | Effort |
|---|---|---|---|
| **Phase 0** | Fix database format mismatch (adapt `type`/`data` to `blockType`/flat props) | Enables DB-stored pages to render | 2 hours |
| **Phase 1** | Create vertical-specific detail page layouts in `cms-registry.ts` `buildDetailPage()` | Defines what blocks each detail page shows | 4 hours |
| **Phase 2** | Refactor ~45 blocks to accept real data from props instead of hardcoded data | Blocks render actual API data | 12 hours |
| **Phase 3** | Create `GenericVerticalDetailPage` route that uses `BlockRenderer` | Replaces 50 hardcoded route files with 1 | 8 hours |
| **Phase 4** | Add entity data context provider so blocks can access the loaded entity | Blocks auto-populate from SSR data | 4 hours |

---

## Section 8: CMS Integration Points Summary

### What EXISTS and is structured:

1. **77 React block components** (12,750+ lines) — fully implemented with TypeScript interfaces
2. **57 block type definitions** in the design system — comprehensive prop types with variants
3. **BlockRenderer component** — generic renderer that maps `blockType` → React component
4. **CMS page registry** with 27 vertical-specific LIST layouts — well-differentiated per vertical
5. **CMS resolve API endpoint** — `GET /platform/cms/resolve?path=...` returns page + layout
6. **CMS page database model** — `cms_page` table with `layout` JSON column (7 seeded pages)
7. **Payload CMS integration spec** — full contract document for webhook sync
8. **CMS hooks** — `useCMSVerticals()`, `useCMSNavigation()` in storefront
9. **Payload webhook handlers** — `POST /admin/webhooks/payload` and `POST /webhooks/payload-cms`
10. **CMS-to-ERP sync engine** — `cms-hierarchy-sync/engine.ts` for 8-collection sync

### What is MISSING / DISCONNECTED:

1. **Zero detail pages use `BlockRenderer`** — all 50 pages use hardcoded inline JSX
2. **No vertical-specific detail page layouts** in CMS registry — all get same 3 generic blocks
3. **Database and registry use incompatible block formats** — `type`/`data` vs `blockType`/flat
4. **Most blocks render placeholder data** — ~45 of 77 blocks don't use their props for rendering
5. **No entity data context** — blocks can't access the SSR-loaded entity data automatically
6. **No `useCMSPage()` hook** — storefront has `useCMSVerticals` and `useCMSNavigation` but no hook to fetch a specific page's block layout
7. **No generic detail page route** — each vertical has its own hardcoded route file instead of a shared CMS-driven page

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
- **Cons:** Requires upfront integration work, blocks need refactoring to use real data
- **Effort to implement:** ~30 hours total across 4 phases

### Option C: Hybrid — Custom Pages with Block Sections
- **Pros:** Custom page structure + block components for complex sections
- **Cons:** Still maintains 50 files, partial block utilization
- **Effort:** ~20 hours

### Recommendation

**Option B (Block-Based)** is the architecturally correct choice. The block system was clearly built for this purpose — 18 vertical-specific blocks exist that exactly match the vertical detail pages. The CMS registry already has the infrastructure for page resolution and layout delivery. The main gap is connecting the dots between the existing layers.
