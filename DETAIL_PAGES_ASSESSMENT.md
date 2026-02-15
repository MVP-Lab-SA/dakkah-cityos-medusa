# Dakkah CityOS — Detail Pages Comprehensive Assessment

**Date:** February 15, 2026
**Scope:** All 50 storefront detail pages (excluding 4 account pages)
**Purpose:** Identify gaps in layout, backend endpoints, data models, and seed data across all commerce verticals

---

## Executive Summary

| Category | Total | Fully Working | Partial | Broken/Missing |
|---|---|---|---|---|
| **Storefront Detail Pages** | 50 | 14 | 14 | 22 |
| **Backend Detail Endpoints** | 50 needed | 28 exist | 3 erroring | 19 missing |
| **Seeded Listing Data** | 50 needed | 36 have data | — | 14 empty |
| **Data Model Completeness** | 50 needed | 8 rich | 20 partial | 22 sparse/empty |

---

## Tier Classification

### TIER 1 — Fully Functional (14 pages)
Backend detail endpoint returns 200, has seeded data, page renders with content via SSR.

### TIER 2 — Partial (14 pages)
Has seeded listing data, but detail endpoint returns 404/500, or data model is too sparse for a meaningful detail view.

### TIER 3 — Broken/Missing (22 pages)
No seeded data, no working detail endpoint, or endpoint doesn't exist at all.

---

## Per-Vertical Assessment

### 1. affiliate
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/affiliate/$id.tsx` — 180 lines |
| **Layout Blocks** | Breadcrumb, Sidebar, CTAs (3), Details grid, Share button, Not-found state |
| **Missing Layout** | No hero image, no image tag, no gallery |
| **Backend Listing** | `/store/affiliate` — ERROR (endpoint returns non-JSON) |
| **Backend Detail** | `/store/affiliates/[id]` — route file exists |
| **Seeded Data** | None |
| **Data Model** | `affiliate` module: Affiliate, ReferralLink, ClickTracking, AffiliateCommission, InfluencerCampaign |
| **Gaps** | No seeded data. Listing endpoint broken. Detail endpoint untested. No images in model. |
| **Tier** | **3 — Broken** |

---

### 2. auctions
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/auctions/$id.tsx` — 262 lines |
| **Layout Blocks** | Hero image, Sidebar, Reviews |
| **Missing Layout** | No breadcrumb, no CTA buttons, no not-found state, no gallery |
| **Backend Listing** | `/store/auctions` — 5 items |
| **Backend Detail** | `/store/auctions/[id]` — **500 ERROR**: "Trying to query by not existing property Bid.auction_listing_id" |
| **Seeded Data** | 5 auctions. Fields: id, title, description, auction_type, status, currency_code, starts_at, ends_at |
| **Data Model** | `auction` module: AuctionListing, Bid, AuctionResult, AuctionEscrow, AutoBidRule |
| **Data Gaps** | No images on model (stored in metadata.images). No rating. No location. |
| **Gaps** | Detail endpoint crashes on Bid relationship query. Missing breadcrumb, CTAs, not-found state. |
| **Tier** | **2 — Partial** |

---

### 3. automotive
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/automotive/$id.tsx` — 205 lines |
| **Layout Blocks** | Hero image, Breadcrumb, Sidebar, CTAs (Schedule Test Drive, Contact Dealer), Details grid (4 sections), img tag |
| **Missing Layout** | No gallery, no reviews section, no related items, no share |
| **Backend Listing** | `/store/automotive` — 6 items |
| **Backend Detail** | `/store/automotive/[id]` — **200 OK** |
| **Seeded Data** | 6 vehicles. Fields: title, make, model_name, year, mileage_km, fuel_type, transmission, body_type, color, VIN, condition, price |
| **Data Model** | `automotive` module: VehicleListing, TestDrive, TradeIn, VehicleService, PartCatalog |
| **Data Gaps** | Has photo_url on model but no images seeded. No rating field. |
| **Gaps** | No gallery for multiple vehicle photos. No reviews section. Images field empty in seed data. |
| **Tier** | **1 — Fully Functional** |

---

### 4. b2b
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/b2b/$id.tsx` — 242 lines |
| **Layout Blocks** | Hero image, Breadcrumb, Sidebar, CTAs (2), Tabs (5), Details grid, img tag |
| **Missing Layout** | No gallery, no reviews, no share |
| **Backend Listing** | `/store/b2b` — 0 items (empty) |
| **Backend Detail** | No `[id]` route exists |
| **Seeded Data** | None |
| **Data Model** | `company` module: Company, CompanyUser, PurchaseOrder, PurchaseOrderItem, ApprovalWorkflow, PaymentTerms, TaxExemption |
| **Gaps** | No data seeded. No detail endpoint. Model doesn't have typical product fields (images, description) — it's company/procurement focused, not a product detail. |
| **Tier** | **3 — Broken** |

---

### 5. bookings
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/bookings/$id.tsx` — 249 lines |
| **Layout Blocks** | Breadcrumb, Sidebar, CTA (1), Details grid, Reviews, Not-found state |
| **Missing Layout** | No hero image area, no img tag, no gallery |
| **Backend Listing** | `/store/bookings` — 0 items (empty) |
| **Backend Detail** | `/store/bookings/[id]` — route exists (untested, no data) |
| **Seeded Data** | None |
| **Data Model** | `booking` module: Booking, ServiceProduct, ServiceProvider, Availability, Reminder |
| **Gaps** | No seeded data. Model has no image fields. Missing hero image section in layout. |
| **Tier** | **3 — Broken** |

---

### 6. bundles
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/bundles/$id.tsx` — 210 lines |
| **Layout Blocks** | Hero image, Breadcrumb, Sidebar, CTA (1), img tags (2), Not-found state |
| **Missing Layout** | No gallery, no reviews, no details grid |
| **Backend Listing** | `/store/bundles` — 7 items |
| **Backend Detail** | No `[id]` route exists — returns **404** |
| **Seeded Data** | 7 bundles. Fields: title, handle, description, bundle_type, discount_type, discount_value. Price/images/rating in metadata. |
| **Data Model** | Part of `promotion-ext` module |
| **Data Gaps** | No native image or price columns — stored in metadata JSON |
| **Gaps** | Missing detail endpoint. Price/images only in metadata. No reviews, no gallery. |
| **Tier** | **2 — Partial** |

---

### 7. campaigns
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/campaigns/$id.tsx` — 181 lines |
| **Layout Blocks** | img tag |
| **Missing Layout** | No breadcrumb, no sidebar, no CTAs, no hero image, no not-found state, no gallery, no details grid |
| **Backend Listing** | `/store/crowdfunding` — 5 items (shared with crowdfunding) |
| **Backend Detail** | `/store/crowdfunding/[id]` — **200 OK** |
| **Seeded Data** | 5 campaigns. Fields: title, description, campaign_type, status, backer_count, images |
| **Data Model** | `crowdfunding` module: Campaign, RewardTier, Backer, Pledge, CampaignUpdate |
| **Data Gaps** | No rating. Has images field on model. |
| **Gaps** | Very minimal layout — missing breadcrumb, sidebar, CTAs, not-found state. Shares endpoint with crowdfunding page. |
| **Tier** | **2 — Partial** (data works, layout severely lacking) |

---

### 8. charity
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/charity/$id.tsx` — 243 lines |
| **Layout Blocks** | Hero image, Breadcrumb, Sidebar, CTA (Donate), img tag, Share, Details grid, Not-found state |
| **Missing Layout** | No gallery, no reviews |
| **Backend Listing** | `/store/charity` — 5 items |
| **Backend Detail** | `/store/charity/[id]` — **404** on valid IDs |
| **Seeded Data** | 5 charities. Fields: name, description, registration_number, category, website, email, phone, address, logo_url, is_verified, currency_code |
| **Data Model** | `charity` module: CharityOrg, DonationCampaign, Donation, ImpactReport |
| **Data Gaps** | Has logo_url. No rating. No gallery images. |
| **Gaps** | Detail endpoint returns 404 despite route existing — likely a query bug. |
| **Tier** | **2 — Partial** |

---

### 9. classifieds
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/classifieds/$id.tsx` — 222 lines |
| **Layout Blocks** | Hero image, Breadcrumb, Sidebar, CTAs (3), img tag, Share, Details grid (2), Not-found state |
| **Missing Layout** | No gallery, no reviews |
| **Backend Listing** | `/store/classifieds` — 7 items |
| **Backend Detail** | `/store/classifieds/[id]` — **200 OK** |
| **Seeded Data** | 7 listings. Fields: title, description, category, listing_type, condition, currency_code, is_negotiable, location. Images in metadata. |
| **Data Model** | `classified` module: ClassifiedListing, ListingCategory, ListingImage, ListingOffer, ListingFlag |
| **Data Gaps** | No native image column — images in metadata.images and metadata.thumbnail. No rating. |
| **Gaps** | Image gallery model exists (ListingImage) but not used in API. No reviews section. |
| **Tier** | **1 — Fully Functional** |

---

### 10. consignment
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/consignment/$id.tsx` — 213 lines |
| **Layout Blocks** | Breadcrumb, Sidebar, CTAs (2), img tag, Share, Details grid (2), Not-found state |
| **Missing Layout** | No hero image, no gallery, no reviews |
| **Backend Listing** | `/store/consignments` — 0 items |
| **Backend Detail** | No `[id]` route exists |
| **Seeded Data** | None |
| **Data Model** | No dedicated consignment module — uses vendor module |
| **Gaps** | No data, no detail endpoint, no dedicated data model. |
| **Tier** | **3 — Broken** |

---

### 11. consignment-shop
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/consignment-shop/$id.tsx` — 212 lines |
| **Layout Blocks** | Hero image, Breadcrumb, Sidebar, CTAs (3), img tag, Share, Details grid (2), Not-found state |
| **Missing Layout** | No gallery, no reviews |
| **Backend Listing** | `/store/consignments` — 0 items (shared with consignment) |
| **Backend Detail** | No `[id]` route exists |
| **Seeded Data** | None |
| **Data Model** | Same as consignment |
| **Gaps** | Duplicate page of consignment. No data, no detail endpoint. |
| **Tier** | **3 — Broken** |

---

### 12. credit
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/credit/$id.tsx` — 259 lines |
| **Layout Blocks** | Hero image, Breadcrumb, Sidebar, CTA (Apply Now), img tag, Details grid (3), Not-found state |
| **Missing Layout** | No gallery, no reviews, no share |
| **Backend Listing** | `/store/credit` — 0 items |
| **Backend Detail** | No `[id]` route exists |
| **Seeded Data** | None |
| **Data Model** | Uses `wallet` module (Store Credit) |
| **Gaps** | No data seeded. No detail endpoint. Credit model is wallet-based, not product-based. |
| **Tier** | **3 — Broken** |

---

### 13. crowdfunding
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/crowdfunding/$id.tsx` — 248 lines |
| **Layout Blocks** | Hero image, Breadcrumb, Sidebar, img tag, Share, Not-found state |
| **Missing Layout** | No CTA buttons, no gallery, no reviews |
| **Backend Listing** | `/store/crowdfunding` — 5 items |
| **Backend Detail** | `/store/crowdfunding/[id]` — **200 OK** |
| **Seeded Data** | 5 campaigns. Fields: title, description, campaign_type, status, backer_count, starts_at, ends_at, images |
| **Data Model** | `crowdfunding` module: Campaign, RewardTier, Backer, Pledge, CampaignUpdate |
| **Data Gaps** | No rating. Has images. No location. |
| **Gaps** | Missing CTA (Back This Project) button. No reviews. |
| **Tier** | **1 — Fully Functional** (minor layout gaps) |

---

### 14. digital
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/digital/$id.tsx` — 181 lines |
| **Layout Blocks** | img tag, Reviews (5 references), Details grid (2) |
| **Missing Layout** | No breadcrumb, no sidebar, no hero image, no CTAs, no not-found state, no gallery |
| **Backend Listing** | `/store/digital-products` — 6 items |
| **Backend Detail** | `/store/digital-products/[id]` — **200 OK** |
| **Seeded Data** | 6 products. Fields: title, file_url, file_type, file_size_bytes, preview_url, version, max_downloads. Price/images in metadata. |
| **Data Model** | `digital-product` module: DigitalAsset |
| **Data Gaps** | No native price column (in metadata.price_sar). No native description. Has metadata.images, thumbnail, cover_image. |
| **Gaps** | Very minimal layout — no sidebar, breadcrumb, CTAs, or not-found state. Needs significant UI rebuild. |
| **Tier** | **2 — Partial** (data works, layout severely lacking) |

---

### 15. dropshipping
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/dropshipping/$id.tsx` — 205 lines |
| **Layout Blocks** | Breadcrumb, Sidebar, CTA (1), Details grid, Not-found state |
| **Missing Layout** | No hero image, no img tag, no gallery, no reviews |
| **Backend Listing** | `/store/dropshipping` — 12 items (vendor-product records) |
| **Backend Detail** | No `[id]` route exists — **404** |
| **Seeded Data** | 12 vendor-product mappings. Fields: vendor_id, product_id, status, fulfillment_method, lead_time_days. No name/description/images. |
| **Data Model** | `vendor` module: VendorProduct (relationship table, not a product entity) |
| **Data Gaps** | Model is a join table — has no name, description, images, price. Not suitable for a product detail page. |
| **Gaps** | Fundamental model mismatch — dropshipping listing data is vendor-product mappings, not displayable products. Needs different data source. |
| **Tier** | **3 — Broken** |

---

### 16. dropshipping-marketplace
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/dropshipping-marketplace/$id.tsx` — 211 lines |
| **Layout Blocks** | Hero image, Breadcrumb, Sidebar, CTAs (4), img tag, Details grid (4), Not-found state |
| **Missing Layout** | No gallery, no reviews |
| **Backend Listing** | `/store/dropshipping` — 12 items (same as dropshipping) |
| **Backend Detail** | No `[id]` route — **404** |
| **Seeded Data** | Same vendor-product join records as dropshipping |
| **Gaps** | Same model mismatch as dropshipping. Duplicate vertical. |
| **Tier** | **3 — Broken** |

---

### 17. education
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/education/$id.tsx` — 263 lines |
| **Layout Blocks** | Hero image, Breadcrumb, Sidebar, CTAs (Enroll Now, 1 more), img tag, Reviews (7), Share, Not-found state |
| **Missing Layout** | No gallery |
| **Backend Listing** | `/store/education` — 6 items |
| **Backend Detail** | No `[id]` route — **404** |
| **Seeded Data** | 6 courses. Fields: title, description, category, level, format, language, currency_code, duration_hours, total_lessons, total_enrollments, rating |
| **Data Model** | `education` module: Course, Lesson, Enrollment, Certificate, Quiz, Assignment |
| **Data Gaps** | Has image field but images empty in seed. Has rating + price. Rich model. |
| **Gaps** | Missing detail endpoint despite having a complete data model. Good layout. |
| **Tier** | **2 — Partial** (just needs detail endpoint) |

---

### 18. events
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/events/$id.tsx` — 319 lines |
| **Layout Blocks** | Hero image, Sidebar, Share (4), Reviews |
| **Missing Layout** | No breadcrumb, no CTA buttons, no img tag, no not-found state |
| **Backend Listing** | `/store/events` — 8 items |
| **Backend Detail** | No `[id]` route — **404** |
| **Seeded Data** | 8 events. Fields: name, description, event_type, venue, city, country_code, start_date, end_date, price, rating. No metadata — flat fields. |
| **Data Model** | `events` module + `event-ticketing` module: Event, Ticket, EventRegistration |
| **Data Gaps** | No image field on model. No metadata. Has price and rating as flat fields. |
| **Gaps** | Missing detail endpoint. Missing breadcrumb, CTAs, not-found state. No image support in data model. |
| **Tier** | **2 — Partial** |

---

### 19. financial
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/financial/$id.tsx` — 245 lines |
| **Layout Blocks** | Breadcrumb, Sidebar, CTA (1), Details grid (3), Not-found state |
| **Missing Layout** | No hero image, no img tag, no gallery, no reviews |
| **Backend Listing** | `/store/financial` — ERROR (endpoint broken) |
| **Backend Detail** | `/store/financial-products/[id]` — route exists (different endpoint name) |
| **Seeded Data** | None (listing endpoint errors) |
| **Data Model** | `financial-product` module: FinancialProduct |
| **Gaps** | Listing endpoint is `/store/financial` but detail route is `/store/financial-products/[id]` — naming mismatch. No seeded data. |
| **Tier** | **3 — Broken** |

---

### 20. fitness
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/fitness/$id.tsx` — 228 lines |
| **Layout Blocks** | Hero image, Breadcrumb, Sidebar, CTAs (Book Class, 2 more), img tag, Not-found state |
| **Missing Layout** | No gallery, no reviews, no share |
| **Backend Listing** | `/store/fitness` — 10 items |
| **Backend Detail** | `/store/fitness/[id]` — **200 OK** |
| **Seeded Data** | 10 classes. Fields: class_name, description, class_type, instructor_id, day_of_week, start_time, duration_minutes, max_capacity, difficulty. Price/images/rating in metadata. |
| **Data Model** | `fitness` module: FitnessClass, FitnessSubscription, FitnessBooking, FacilityEquipment, FitnessFacility |
| **Data Gaps** | No native price/image columns — all in metadata. |
| **Gaps** | No reviews section. Price and images from metadata only. |
| **Tier** | **1 — Fully Functional** |

---

### 21. flash-deals
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/flash-deals/$id.tsx` — 216 lines |
| **Layout Blocks** | Hero image, Breadcrumb, Sidebar, CTA (1), img tag, Details grid (2), Not-found state |
| **Missing Layout** | No gallery, no reviews, no share |
| **Backend Listing** | `/store/flash-sales` — 3 items |
| **Backend Detail** | No `[id]` route — **404** |
| **Seeded Data** | 3 promotions. Fields: code, is_automatic, type, status, campaign_id. No name, description, images, price. |
| **Data Model** | Uses `promotion-ext` module (Medusa promotions, not a product entity) |
| **Data Gaps** | Model is promotion records — no product-like fields (name, description, images, price). Fundamental mismatch. |
| **Gaps** | Data model is for promotion codes, not product deals. Needs a different data source or custom model. |
| **Tier** | **3 — Broken** |

---

### 22. freelance
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/freelance/$id.tsx` — 246 lines |
| **Layout Blocks** | Hero image, Breadcrumb, Sidebar, CTAs (2), img tag, Reviews (8), Not-found state |
| **Missing Layout** | No gallery, no share |
| **Backend Listing** | `/store/freelance` — 7 items |
| **Backend Detail** | `/store/freelance/[id]` — **200 OK** |
| **Seeded Data** | 7 gigs. Fields: title, description, category, subcategory, listing_type, currency_code, delivery_time_days, revisions_included, skill_tags, rating. Images/thumbnail in metadata. |
| **Data Model** | `freelance` module: FreelanceGig, FreelanceProposal, FreelanceContract, FreelanceMilestone, FreelanceReview |
| **Data Gaps** | No native image column — in metadata. Has rating. Has price. |
| **Gaps** | Minor — could add gallery support for portfolio_urls. |
| **Tier** | **1 — Fully Functional** |

---

### 23. gift-cards-shop
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/gift-cards-shop/$id.tsx` — 191 lines |
| **Layout Blocks** | Hero image, Breadcrumb, Sidebar, CTA (1), img tag, Not-found state |
| **Missing Layout** | No gallery, no reviews, no details grid, no share |
| **Backend Listing** | `/store/gift-cards` — 8 items |
| **Backend Detail** | No `[id]` route — **404** |
| **Seeded Data** | 8 gift cards. Fields: code, currency_code, sender_name, recipient_email, is_active. Design/images/category in metadata. No name or description. |
| **Data Model** | Medusa core gift card model |
| **Data Gaps** | No name or description fields. Design/images in metadata. |
| **Gaps** | Missing detail endpoint. Gift cards don't have typical product fields — model mismatch. |
| **Tier** | **2 — Partial** |

---

### 24. government
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/government/$id.tsx` — 247 lines |
| **Layout Blocks** | Breadcrumb, Sidebar, CTAs (Track, Report, Update — 3), Details grid, Not-found state |
| **Missing Layout** | No hero image, no img tag, no gallery, no reviews |
| **Backend Listing** | `/store/government` — 2 items |
| **Backend Detail** | `/store/government/[id]` — **200 OK** |
| **Seeded Data** | 2 service requests. Fields: request_type, category, title, description, location, status, priority, department, photos |
| **Data Model** | `government` module: GovernmentServiceRequest |
| **Data Gaps** | Has photos field but no thumbnail/image. No price (government services). No rating. |
| **Gaps** | Very few seeded items. No image display in layout despite photos field. |
| **Tier** | **1 — Fully Functional** (but only 2 items) |

---

### 25. grocery
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/grocery/$id.tsx` — 249 lines |
| **Layout Blocks** | Breadcrumb, Sidebar, CTA (Add to Cart), img tag, Related items (5), Details grid, Not-found state |
| **Missing Layout** | No hero image area, no gallery, no reviews |
| **Backend Listing** | `/store/grocery` — 8 items |
| **Backend Detail** | `/store/grocery/[id]` — **200 OK** |
| **Seeded Data** | 8 products. Fields: storage_type, shelf_life_days, origin_country, organic, unit_type, nutrition_info. Name only in metadata. No images, price, description on model. |
| **Data Model** | `grocery` module: GroceryProduct (extends Medusa product) |
| **Data Gaps** | Very sparse — no native name (in metadata.name), no images, no price, no description, no rating. Grocery-specific fields only (storage, shelf life, organic). |
| **Gaps** | Data model lacks display fields. Depends entirely on metadata or linked Medusa product for name/images/price. |
| **Tier** | **1 — Fully Functional** (but very sparse data) |

---

### 26. healthcare
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/healthcare/$id.tsx` — 220 lines |
| **Layout Blocks** | Breadcrumb, Sidebar, CTA (Book Consultation), img tag, Reviews (8), Not-found state |
| **Missing Layout** | No hero image, no gallery, no share |
| **Backend Listing** | `/store/healthcare` — 11 items |
| **Backend Detail** | No `[id]` route — **404** |
| **Seeded Data** | 11 practitioners. Fields: name, title, specialization, license_number, bio, education, experience_years, languages, consultation_duration_minutes, rating |
| **Data Model** | `healthcare` module: Practitioner, Appointment, MedicalRecord, Prescription |
| **Data Gaps** | Has photo_url. Has rating. Has price. Good seed data. |
| **Gaps** | Missing detail endpoint despite rich data model and seed data. Should be high priority fix. |
| **Tier** | **2 — Partial** (just needs detail endpoint) |

---

### 27. insurance
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/insurance/$id.tsx` — 237 lines |
| **Layout Blocks** | Breadcrumb, Sidebar, CTA (Get Quote), Details grid (4), Not-found state |
| **Missing Layout** | No hero image, no img tag, no gallery, no reviews |
| **Backend Listing** | `/store/insurance` — 7 items |
| **Backend Detail** | No `[id]` route — **404** |
| **Seeded Data** | 7 plans. Fields: name, description, insurance_type, coverage_details, deductible_options, term_options, claim_process, exclusions, premium range. Images/thumbnail in metadata. |
| **Data Model** | `insurance` module: InsurancePolicy, InsuranceClaim |
| **Data Gaps** | No native image column — in metadata. No rating. |
| **Gaps** | Missing detail endpoint. No image display. |
| **Tier** | **2 — Partial** |

---

### 28. legal
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/legal/$id.tsx` — 249 lines |
| **Layout Blocks** | Breadcrumb, Sidebar, CTA (Request Consultation), img tag, Reviews (8), Not-found state |
| **Missing Layout** | No hero image, no gallery, no share |
| **Backend Listing** | `/store/legal` — 8 items |
| **Backend Detail** | `/store/legal/[id]` — **200 OK** |
| **Seeded Data** | 8 attorneys. Fields: name, bar_number, specializations, practice_areas, bio, education, experience_years, rating, total_cases, photo_url |
| **Data Model** | `legal` module: Attorney, LegalCase, LegalDocument, Consultation |
| **Data Gaps** | Has photo_url. Has rating. No price column (consultation fees not on model). |
| **Gaps** | Minor — consultation pricing not exposed. Otherwise complete. |
| **Tier** | **1 — Fully Functional** |

---

### 29. loyalty-program
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/loyalty-program/$id.tsx` — 199 lines |
| **Layout Blocks** | Breadcrumb, Sidebar, CTA (1), Details grid (2), Not-found state |
| **Missing Layout** | No hero image, no img tag, no gallery, no reviews |
| **Backend Listing** | `/store/loyalty` — 0 items |
| **Backend Detail** | No `[id]` route exists |
| **Seeded Data** | None |
| **Data Model** | `loyalty` module: LoyaltyProgram, LoyaltyTier, LoyaltyTransaction, LoyaltyReward |
| **Gaps** | No data seeded. No detail endpoint. No images in model. |
| **Tier** | **3 — Broken** |

---

### 30. memberships
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/memberships/$id.tsx` — 185 lines |
| **Layout Blocks** | Sidebar (1), Reviews |
| **Missing Layout** | No breadcrumb, no hero image, no CTAs, no img tag, no not-found state, no gallery, no details grid |
| **Backend Listing** | `/store/memberships` — 3 items |
| **Backend Detail** | No `[id]` route — **404** |
| **Seeded Data** | 3 memberships. Fields: customer_id, tier_id, membership_number, status, total_points. No name, description, images. |
| **Data Model** | `membership` module: MembershipPlan, MembershipSubscription, MembershipBenefit |
| **Data Gaps** | Model is customer membership records, not plan descriptions. Missing name, description, images. |
| **Gaps** | Severely lacking layout. Data model mismatch — shows customer memberships, not browseable plans. |
| **Tier** | **3 — Broken** |

---

### 31. newsletter
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/newsletter/$id.tsx` — 259 lines |
| **Layout Blocks** | Hero image, Breadcrumb, Sidebar, CTAs (Subscribe — 6), img tag, Reviews (4), Details grid, Not-found state |
| **Missing Layout** | No gallery, no share |
| **Backend Listing** | `/store/newsletters` — 3 items |
| **Backend Detail** | No `[id]` route — **404** |
| **Seeded Data** | 3 newsletters. Fields: title, description, frequency, subscriber_count, category. No images, no metadata. |
| **Data Model** | Part of notification system |
| **Data Gaps** | No images. No price (free vs premium). No rating. Minimal model. |
| **Gaps** | Missing detail endpoint. Sparse data model. |
| **Tier** | **2 — Partial** |

---

### 32. parking
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/parking/$id.tsx` — 245 lines |
| **Layout Blocks** | Hero image (2), Breadcrumb, Sidebar, img tag, Details grid (2), Not-found state |
| **Missing Layout** | No CTA buttons, no gallery, no reviews |
| **Backend Listing** | `/store/parking` — 6 items |
| **Backend Detail** | `/store/parking/[id]` — **200 OK** |
| **Seeded Data** | 6 zones. Fields: name, description, zone_type, address, latitude, longitude, total_spots, available_spots, operating_hours, has_ev_charging. Images/thumbnail in metadata. Rating on model. |
| **Data Model** | `parking` module: ParkingZone, ParkingSpot, ParkingReservation, ParkingRate |
| **Data Gaps** | Images in metadata only. Has rating. Has location. |
| **Gaps** | Missing CTA (Reserve Spot) button. No reviews section despite having rating. |
| **Tier** | **1 — Fully Functional** |

---

### 33. pet-services
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/pet-services/$id.tsx` — 246 lines |
| **Layout Blocks** | Hero image, Breadcrumb, Sidebar, CTAs (Book Appointment, Contact Provider), img tag, Reviews (2), Details grid (2), Not-found state |
| **Missing Layout** | No gallery, no share |
| **Backend Listing** | `/store/pet-services` — 5 items |
| **Backend Detail** | `/store/pet-services/[id]` — **200 OK** |
| **Seeded Data** | 5 pets. Fields: name, species, breed, date_of_birth, weight_kg, color, gender, is_neutered, microchip_id. Photo_url on model. |
| **Data Model** | `pet-service` module: PetProfile, VetRecord, Vaccination, Grooming |
| **Data Gaps** | No price. No rating. No description. Has photo_url. Model is pet profiles, not service listings. |
| **Gaps** | Data model is pet profiles rather than service provider listings. Works as pet detail page but not as service marketplace. |
| **Tier** | **1 — Fully Functional** |

---

### 34. places
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/places/$id.tsx` — **83 lines** |
| **Layout Blocks** | Reviews (1) |
| **Missing Layout** | No breadcrumb, no sidebar, no hero image, no CTAs, no img tag, no not-found state, no gallery, no details grid |
| **Backend Listing** | `/store/content/pois` — 0 items |
| **Backend Detail** | `/store/content/pois/[id]` — route exists (untested, no data) |
| **Seeded Data** | None |
| **Data Model** | `tenant` module: TenantPOI (Point of Interest) |
| **Gaps** | **Most underdeveloped page.** Only 83 lines. Virtually no layout. No data. Needs complete rebuild. |
| **Tier** | **3 — Broken** |

---

### 35. print-on-demand
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/print-on-demand/$id.tsx` — 217 lines |
| **Layout Blocks** | Breadcrumb, Sidebar, img tag, Share, Details grid (2), Not-found state |
| **Missing Layout** | No hero image, no CTAs, no gallery, no reviews |
| **Backend Listing** | `/store/print-on-demand` — ERROR (endpoint broken) |
| **Backend Detail** | No `[id]` route exists |
| **Seeded Data** | None |
| **Data Model** | No dedicated module |
| **Gaps** | No data model, no seeded data, broken listing endpoint, no detail endpoint. |
| **Tier** | **3 — Broken** |

---

### 36. print-on-demand-shop
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/print-on-demand-shop/$id.tsx` — 207 lines |
| **Layout Blocks** | Breadcrumb, Sidebar, CTAs (3), img tag, Reviews (3), Details grid (4), Not-found state |
| **Missing Layout** | No hero image, no gallery |
| **Backend Listing** | Same as print-on-demand — ERROR |
| **Backend Detail** | No `[id]` route |
| **Seeded Data** | None |
| **Gaps** | Duplicate of print-on-demand. Same issues. |
| **Tier** | **3 — Broken** |

---

### 37. quotes
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/quotes/$id.tsx` — **74 lines** |
| **Layout Blocks** | Details grid (2) |
| **Missing Layout** | No breadcrumb, no sidebar, no hero image, no CTAs, no img tag, no not-found state, no gallery, no reviews |
| **Backend Listing** | `/store/quotes` — 0 items |
| **Backend Detail** | `/store/quotes/[id]` — route exists (untested, no data) |
| **Seeded Data** | None |
| **Data Model** | `quote` module: Quote, QuoteItem |
| **Gaps** | **Second most underdeveloped page.** Only 74 lines. Virtually no layout. No data. Needs complete rebuild. |
| **Tier** | **3 — Broken** |

---

### 38. real-estate
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/real-estate/$id.tsx` — 213 lines |
| **Layout Blocks** | Hero image, Breadcrumb, Sidebar, CTAs (Schedule Viewing, Contact Agent — 4), img tag, Details grid (3), Not-found state |
| **Missing Layout** | No gallery, no reviews |
| **Backend Listing** | `/store/real-estate` — 7 items |
| **Backend Detail** | No `[id]` route — **404** |
| **Seeded Data** | 7 listings. Fields: title, description, listing_type, property_type, status, price, address, city. Image field on model. |
| **Data Model** | `real-estate` module: PropertyListing, PropertyImage, OpenHouse, PropertyInquiry |
| **Data Gaps** | Has image model (PropertyImage) but not served. Has price. No rating. |
| **Gaps** | Missing detail endpoint. PropertyImage model exists but not used. Good layout. |
| **Tier** | **2 — Partial** (just needs detail endpoint) |

---

### 39. rentals
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/rentals/$id.tsx` — 288 lines |
| **Layout Blocks** | Hero image, img tag, Gallery (3 references), Tabs (2), Reviews (2) |
| **Missing Layout** | No breadcrumb, no sidebar, no CTAs, no not-found state |
| **Backend Listing** | `/store/rentals` — 7 items |
| **Backend Detail** | `/store/rentals/[id]` — **200 OK** |
| **Seeded Data** | 7 rentals. Fields: rental_type, currency_code, min_duration, max_duration, is_available, condition, base_price, deposit. Name/images/description in metadata. |
| **Data Model** | `rental` module: RentalItem, RentalReservation, RentalReturn, RentalInsurance |
| **Data Gaps** | No native name/description — all in metadata. Has price. No rating. |
| **Gaps** | Missing breadcrumb, sidebar, CTAs, not-found state. Has gallery support (unique among pages). |
| **Tier** | **1 — Fully Functional** (but layout missing key blocks) |

---

### 40. restaurants
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/restaurants/$id.tsx` — 229 lines |
| **Layout Blocks** | Hero image, Breadcrumb, Sidebar, img tag, Tabs (menu), Reviews (9), Details grid, Not-found state |
| **Missing Layout** | No CTA buttons, no gallery, no share |
| **Backend Listing** | `/store/restaurants` — 5 items |
| **Backend Detail** | No `[id]` route — **404** |
| **Seeded Data** | 5 restaurants. Fields: name, description, cuisine_types, address, city, latitude, longitude, rating. Image fields on model. |
| **Data Model** | `restaurant` module: Restaurant, MenuItem, MenuCategory, RestaurantHours, RestaurantReview |
| **Data Gaps** | Rich model. Has rating, location, images. Complete. |
| **Gaps** | Missing detail endpoint despite having a complete model with rich seed data. Should be high priority fix. Missing CTAs (Order, Reserve). |
| **Tier** | **2 — Partial** (just needs detail endpoint + CTAs) |

---

### 41. social-commerce
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/social-commerce/$id.tsx` — 225 lines |
| **Layout Blocks** | Hero image, Breadcrumb, Sidebar, CTAs (2), img tag, Reviews (8), Share (6), Not-found state |
| **Missing Layout** | No gallery, no details grid |
| **Backend Listing** | `/store/social-commerce` — 7 items |
| **Backend Detail** | `/store/social-commerce/[id]` — route exists, returns **404** on valid IDs |
| **Seeded Data** | 7 sellers. Fields: name, description, platform, category, city, followers, rating, seller_name, price |
| **Data Model** | `social-commerce` module: SocialSeller, SocialPost, SocialShare |
| **Data Gaps** | No image field on listing. Has rating, price, location. |
| **Gaps** | Detail endpoint exists but returns 404 — likely query bug. No images. |
| **Tier** | **2 — Partial** |

---

### 42. subscriptions
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/subscriptions/$id.tsx` — 241 lines |
| **Layout Blocks** | Hero image, Breadcrumb, Sidebar, CTA (Subscribe Now), img tag, Details grid (2), Not-found state |
| **Missing Layout** | No gallery, no reviews |
| **Backend Listing** | `/store/subscriptions` — 6 items |
| **Backend Detail** | Subscription management routes exist (cancel, pause, resume) but no GET `[id]` for detail view |
| **Seeded Data** | 6 subscriptions. Fields: customer_id, status, billing_interval, payment_provider. No name, description, images. |
| **Data Model** | `subscription` module: Subscription, SubscriptionPlan, SubscriptionItem, BillingCycle, SubscriptionEvent |
| **Data Gaps** | Model has SubscriptionPlan but API returns customer subscriptions, not browseable plans. No name/images. |
| **Gaps** | Data model mismatch — API returns customer subscription records, not plan descriptions. Needs plan listing endpoint. |
| **Tier** | **3 — Broken** |

---

### 43. trade-in
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/trade-in/$id.tsx` — 219 lines |
| **Layout Blocks** | Hero image, Breadcrumb, Sidebar, CTA (1), img tag, Details grid (2), Not-found state |
| **Missing Layout** | No gallery, no reviews |
| **Backend Listing** | `/store/trade-in` — 0 items |
| **Backend Detail** | No `[id]` route exists |
| **Seeded Data** | None |
| **Data Model** | `automotive` module: TradeIn (trade-in evaluation model, not a browseable entity) |
| **Gaps** | No data. Model is for trade-in evaluations, not product listings. |
| **Tier** | **3 — Broken** |

---

### 44. travel
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/travel/$id.tsx` — 286 lines |
| **Layout Blocks** | Hero image, Breadcrumb, Sidebar, CTAs (Book Now, Contact — 2), img tag, Reviews (8), Details grid, Not-found state |
| **Missing Layout** | No gallery, no share |
| **Backend Listing** | `/store/travel` — 7 items |
| **Backend Detail** | `/store/travel/[id]` — **200 OK** |
| **Seeded Data** | 7 properties. Fields: name, description, property_type, star_rating, address, city, latitude, longitude. Image field on model. Has amenities, rate plans, rooms. |
| **Data Model** | `travel` module: Property, RoomType, Room, RatePlan, Reservation, GuestProfile, Amenity |
| **Data Gaps** | Rich model. Has images, rating, location. No price on main model (on RatePlan). |
| **Gaps** | Minor — price comes from RatePlan relationship, not main model. |
| **Tier** | **1 — Fully Functional** |

---

### 45. try-before-you-buy
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/try-before-you-buy/$id.tsx` — 201 lines |
| **Layout Blocks** | Hero image, Breadcrumb, Sidebar, CTAs (Try Now, Buy — 3), img tag, Details grid (2), Not-found state |
| **Missing Layout** | No gallery, no reviews |
| **Backend Listing** | `/store/try-before-you-buy` — 12 items |
| **Backend Detail** | No `[id]` route — **404** |
| **Seeded Data** | 12 items — same vendor-product join records as dropshipping. No name/description/images. |
| **Data Model** | Uses `vendor` module: VendorProduct (join table) |
| **Data Gaps** | Same as dropshipping — model is a join table, not a product entity. |
| **Gaps** | Fundamental model mismatch. Same issue as dropshipping/dropshipping-marketplace. |
| **Tier** | **3 — Broken** |

---

### 46. vendors
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/vendors/$id.tsx` — 293 lines |
| **Layout Blocks** | Breadcrumb, Sidebar, CTAs (2), img tags (2), Reviews (18), Share, Details grid (2), Not-found state |
| **Missing Layout** | No hero image, no gallery |
| **Backend Listing** | `/store/vendors` — 10 items |
| **Backend Detail** | `/store/vendors/[handle]` — uses handle, not ID. Returns **404** when queried by ID. |
| **Seeded Data** | 10 vendors. Fields: handle, business_name, description, logo_url, banner_url, total_products, total_orders, rating, review_count, categories |
| **Data Model** | `vendor` module: Vendor, VendorUser, VendorProduct, VendorOrder, VendorAnalytics, MarketplaceListing |
| **Data Gaps** | Rich model. Has logo_url + banner_url. Has rating + review_count. No price (vendor, not product). |
| **Gaps** | Detail page uses `$id` param but backend uses `[handle]` — routing mismatch. Need to query by handle or add ID lookup. |
| **Tier** | **2 — Partial** (routing mismatch) |

---

### 47. volume-deals
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/volume-deals/$id.tsx` — 225 lines |
| **Layout Blocks** | Hero image, Breadcrumb, Sidebar, CTAs (2), img tag, Tabs (2), Details grid (2), Not-found state |
| **Missing Layout** | No gallery, no reviews |
| **Backend Listing** | `/store/volume-deals` — ERROR (endpoint broken) |
| **Backend Detail** | No `[id]` route exists (volume-pricing module) |
| **Seeded Data** | None (listing endpoint errors) |
| **Data Model** | `volume-pricing` module: VolumePricing, VolumePricingTier |
| **Gaps** | Broken listing endpoint. No detail endpoint. Model is pricing tiers, not a browseable product. |
| **Tier** | **3 — Broken** |

---

### 48. warranties
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/warranties/$id.tsx` — 257 lines |
| **Layout Blocks** | Breadcrumb, Sidebar, Details grid (2), Not-found state |
| **Missing Layout** | No hero image, no img tag, no CTAs, no gallery, no reviews |
| **Backend Listing** | `/store/warranties` — 5 items |
| **Backend Detail** | `/store/warranties/[id]` — **200 OK** |
| **Seeded Data** | 5 plans. Fields: name, description, plan_type, duration_months, coverage, exclusions, price. Images/thumbnail in metadata. |
| **Data Model** | `warranty` module: WarrantyPlan, WarrantyClaim, RepairOrder, ServiceCenter, SparePart |
| **Data Gaps** | No native image column — in metadata. Has price. No rating. |
| **Gaps** | Missing CTAs (Purchase Plan), hero image, img tag. Layout underserves the data. |
| **Tier** | **1 — Fully Functional** (but layout needs improvement) |

---

### 49. white-label
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/white-label/$id.tsx` — 213 lines |
| **Layout Blocks** | Breadcrumb, Sidebar, CTAs (3), img tag, Share, Details grid (2), Not-found state |
| **Missing Layout** | No hero image, no gallery, no reviews |
| **Backend Listing** | `/store/white-label` — ERROR (endpoint broken) |
| **Backend Detail** | No `[id]` route exists |
| **Seeded Data** | None |
| **Data Model** | No dedicated module |
| **Gaps** | No data model, no seeded data, broken endpoint. |
| **Tier** | **3 — Broken** |

---

### 50. white-label-shop
| Aspect | Status | Detail |
|---|---|---|
| **Storefront Page** | `$tenant/$locale/white-label-shop/$id.tsx` — 239 lines |
| **Layout Blocks** | Hero image, Breadcrumb, Sidebar, CTAs (4), img tag, Tabs (2), Details grid (2), Not-found state |
| **Missing Layout** | No gallery, no reviews |
| **Backend Listing** | Same as white-label — ERROR |
| **Backend Detail** | No `[id]` route |
| **Seeded Data** | None |
| **Gaps** | Duplicate of white-label. Same issues. |
| **Tier** | **3 — Broken** |

---

## Gap Summary Tables

### Backend Detail Endpoints

| Status | Count | Verticals |
|---|---|---|
| **200 OK** | 14 | automotive, classifieds, crowdfunding, digital, fitness, freelance, government, grocery, legal, parking, pet-services, rentals, travel, warranties |
| **500 Error** | 1 | auctions (Bid.auction_listing_id query bug) |
| **404 on valid IDs** | 2 | charity, social-commerce (route exists but query fails) |
| **Route missing entirely** | 19 | b2b, bundles, consignments, credit, dropshipping, education, events, flash-sales, gift-cards, healthcare, insurance, loyalty, memberships, newsletters, print-on-demand, real-estate, restaurants, trade-in, try-before-you-buy |
| **Endpoint mismatch** | 2 | vendors (uses handle not id), financial (endpoint naming mismatch) |
| **Listing endpoint broken** | 5 | affiliate, financial, print-on-demand, volume-deals, white-label |

### Data Model Mismatches
These verticals have a storefront detail page but the backend data model doesn't represent a browseable product/service:

| Vertical | What Model Actually Is | What Page Expects |
|---|---|---|
| dropshipping | Vendor-Product join table | Product listing |
| dropshipping-marketplace | Vendor-Product join table | Product listing |
| try-before-you-buy | Vendor-Product join table | Product listing |
| flash-deals | Promotion codes | Product deal |
| subscriptions | Customer subscription records | Browseable plan |
| memberships | Customer membership records | Browseable plan |
| trade-in | Trade-in evaluations | Browseable listing |
| credit | Store credit/wallet | Credit product |
| volume-deals | Volume pricing tiers | Deal listing |

### Empty Databases (No Seed Data)
14 verticals: affiliate, b2b, bookings, consignment, credit, financial, loyalty-program, places, print-on-demand, quotes, trade-in, volume-deals, white-label, consignment-shop

### Layout Quality Scores

| Quality | Count | Verticals |
|---|---|---|
| **Complete** (250+ lines, all blocks) | 12 | bookings, credit, crowdfunding, education, events, freelance, grocery, newsletter, travel, vendors, warranties, white-label-shop |
| **Good** (200-250 lines, most blocks) | 24 | affiliate, automotive, b2b, bundles, charity, classifieds, consignment, consignment-shop, dropshipping-marketplace, financial, fitness, flash-deals, gift-cards-shop, government, healthcare, insurance, legal, parking, pet-services, print-on-demand, print-on-demand-shop, real-estate, restaurants, social-commerce, subscriptions, trade-in, try-before-you-buy, volume-deals, white-label |
| **Minimal** (< 200 lines, missing key blocks) | 6 | affiliate (180), campaigns (181), digital (181), memberships (185), dropshipping (205), loyalty-program (199) |
| **Severely Lacking** (< 100 lines) | 2 | places (83), quotes (74) |

### Missing Layout Blocks Across All Pages

| Block | Missing From (count) |
|---|---|
| **Image Gallery** | 49 of 50 (only rentals has partial) |
| **Related/Similar Items** | 49 of 50 (only grocery has partial) |
| **Share/Bookmark** | 38 of 50 |
| **Breadcrumb** | 8 of 50 |
| **CTA Buttons** | 7 of 50 |
| **Not-found State** | 6 of 50 |
| **Sidebar** | 5 of 50 |
| **Hero Image** | 15 of 50 |
| **Reviews Section** | Most pages reference reviews but few have proper review UI |

---

## Priority Action Items

### P0 — Critical (Blocking user experience)
1. **Create 19 missing backend detail endpoints** — users clicking items see "Not Found"
2. **Fix auctions detail endpoint** — 500 error on Bid relationship
3. **Fix charity + social-commerce detail endpoints** — 404 on valid IDs
4. **Fix 5 broken listing endpoints** — affiliate, financial, print-on-demand, volume-deals, white-label

### P1 — High Priority (Data completeness)
5. **Seed data for 14 empty verticals** — these pages show nothing at all
6. **Resolve 9 data model mismatches** — dropshipping/try-before-you-buy/flash-deals/subscriptions/memberships/trade-in/credit/volume-deals need proper browseable models
7. **Fix vendors routing** — detail page uses `$id` but backend uses `[handle]`
8. **Fix financial endpoint naming** — listing is `/financial`, detail is `/financial-products`

### P2 — Medium Priority (Layout quality)
9. **Rebuild places page** — only 83 lines, virtually no layout
10. **Rebuild quotes page** — only 74 lines, virtually no layout
11. **Add breadcrumbs** to auctions, campaigns, digital, events, memberships, places, quotes, rentals
12. **Add CTA buttons** to auctions, campaigns, crowdfunding, events, parking, places, quotes, restaurants, warranties
13. **Add not-found states** to auctions, events, memberships, places, quotes, rentals
14. **Add sidebar** to campaigns, digital, places, quotes, rentals

### P3 — Polish (Production quality)
15. **Add image gallery** support across all verticals
16. **Add related/similar items** sections
17. **Add share/bookmark** functionality
18. **Seed thumbnail/images** for verticals missing visual content
19. **Add dedicated price/rating columns** to models currently using metadata JSON
20. **Deduplicate** consignment/consignment-shop, dropshipping/dropshipping-marketplace, print-on-demand/print-on-demand-shop, white-label/white-label-shop
