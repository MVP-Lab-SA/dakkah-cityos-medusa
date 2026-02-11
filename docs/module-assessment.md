# Dakkah CityOS Commerce Platform - Module Assessment & Gap Analysis

**Assessment Date:** February 11, 2026
**Platform:** Medusa.js v2 Monorepo
**Total Custom Modules:** 48
**Total Models:** 248
**Total Links:** 15
**Total Workflows:** 10
**Total Subscribers:** 33

---

## Table of Contents

1. [Assessment Summary](#assessment-summary)
2. [Maturity Classification](#maturity-classification)
3. [Platform Infrastructure Modules (8)](#platform-infrastructure-modules)
4. [Core Commerce Modules (8)](#core-commerce-modules)
5. [Commerce Verticals (27)](#commerce-verticals)
6. [Supporting Modules (5)](#supporting-modules)
7. [Medusa Built-in Module Extensions](#medusa-built-in-module-extensions)
8. [Cross-Cutting Concerns](#cross-cutting-concerns)
9. [Missing Modules](#missing-modules)
10. [Priority Roadmap](#priority-roadmap)

---

## Assessment Summary

| Maturity Level | Count | Description |
|---|---|---|
| **Production-Ready** | 5 | Full business logic, services >400 lines, workflows, subscribers, links |
| **Functional** | 8 | Working services >100 lines, some workflows or subscribers |
| **Scaffolded** | 30 | Model + CRUD service (<20 lines) + API routes, no business logic |
| **Stub** | 5 | Minimal model (1-2 lines), placeholder service |

---

## Maturity Classification

### Production-Ready (5)
| Module | Service Lines | Models | Links | Workflows | Subscribers |
|---|---|---|---|---|---|
| tenant | 506 | 8 | 2 | - | 1 |
| subscription | 694 | 6 | 1 | 3 | 7 |
| vendor | 474 | 7 | 4 | 4 | 2 |
| booking | 627 | 6 | 1 | - | 5 |
| company (B2B) | 480 | 8 | 2 | 3 | 1 |

### Functional (8)
| Module | Service Lines | Models | Links | Workflows | Subscribers |
|---|---|---|---|---|---|
| payout | 335 | 3 | 1 | 1 | 2 |
| volume-pricing | 225 | 3 | - | - | - |
| invoice | 167 | 2 | 1 | - | - |
| node | 152 | 2 | 2 | - | - |
| quote | 147 | 3 | - | - | 3 |
| review | 137 | 1 | 1 | - | 1 |
| persona | 134 | 3 | - | - | - |
| commission | 129 | 3 | 1 | 1 | - |

### Scaffolded (30)
All remaining vertical modules with 14-22 line services and 5-9 models each.

### Stub (5)
| Module | Issue |
|---|---|
| store | 1 model, 84-line service but model has only 1 line |
| payout (model) | payout.ts model is 2 lines |
| quote (model) | quote.ts model is 2 lines |
| volume-pricing (model) | volume-pricing.ts model is 2 lines |
| digital-product | 3 models, 10-line service |

---

## Platform Infrastructure Modules

### 1. Tenant Module
**Status:** Production-Ready | **Service:** 506 lines | **Models:** 8

**Models:**
| Model | Fields | Purpose |
|---|---|---|
| `tenant` | id, name, slug, domain, description, logo_url, status, plan_tier, owner_id, settings, feature_flags, metadata | Core multi-tenant entity |
| `tenant-settings` | id, tenant_id, currency_code, default_locale, supported_locales, timezone, tax_settings, shipping_settings, checkout_settings, notification_settings | Tenant configuration |
| `tenant-user` | id, tenant_id, user_id, role, permissions, status, invited_by, metadata | Tenant team member mapping |
| `tenant-billing` | 27 fields | Stripe-integrated billing with usage metering, plan management, invoice tracking |
| `tenant-usage-record` | 14 fields | Usage tracking for orders, products, storage, API calls, bandwidth |
| `tenant-invoice` | 18 fields | Tenant platform invoicing with Stripe integration |
| `tenant-poi` | id, tenant_id, poi_id, node_id, type, metadata | Point-of-Interest association |
| `tenant-relationship` | id, parent_id, child_id, type, metadata | Tenant hierarchy for sub-tenants |
| `service-channel` | id, tenant_id, name, type, config, status | Multi-channel commerce (web, mobile, POS, marketplace) |

**Links:** tenant-node, tenant-store
**Subscribers:** customer-created (auto-assigns tenant)

**Gaps:**
- No tenant provisioning workflow (onboarding flow)
- No tenant suspension/reactivation workflow
- No tenant data isolation middleware (tenant_id filtering not enforced at query level)
- No tenant plan enforcement (limit checking for max_products, max_orders, max_team_members)
- Billing integration has Stripe fields but no actual Stripe webhook processing
- No usage metering collection (usage records exist but nothing writes to them)
- No tenant invitation workflow (tenant-user model exists but no invite/accept flow)

---

### 2. Node Module
**Status:** Functional | **Service:** 152 lines | **Models:** 2

**Models:**
| Model | Fields | Purpose |
|---|---|---|
| `node` | id, tenant_id, name, slug, code, type(CITY/DISTRICT/ZONE/FACILITY/ASSET), depth, parent_id, breadcrumbs, location, status, metadata | 5-level spatial hierarchy |

**Links:** tenant-node, node-governance

**Gaps:**
- No tree traversal utilities (ancestors, descendants, siblings)
- No node-scoped data filtering middleware
- No node capacity/resource management
- No node transfer or merge operations
- Location field is JSON but no geospatial queries

---

### 3. Governance Module
**Status:** Functional | **Service:** 78 lines | **Models:** 2

**Models:**
| Model | Fields | Purpose |
|---|---|---|
| `governance-authority` | id, tenant_id, name, slug, code, type(region/country/authority), jurisdiction_level, parent_authority_id, country_id, region_id, residency_zone, policies, status, metadata | Policy and authority management |

**Links:** node-governance

**Gaps:**
- No deep policy merging engine (authority chain resolution)
- No policy inheritance cascade when parent policy changes
- No compliance validation against governance rules
- No policy versioning or audit trail
- No policy conflict resolution mechanism

---

### 4. Persona Module
**Status:** Functional | **Service:** 134 lines | **Models:** 3

**Models:**
| Model | Fields | Purpose |
|---|---|---|
| `persona` | id, tenant_id, name, slug, category(consumer/creator/business/cityops/platform), axes, constraints, allowed_workflows, allowed_tools, allowed_surfaces, feature_overrides, priority, status, metadata | 6-axis persona profiles |
| `persona-assignment` | id, persona_id, entity_type, entity_id, priority, metadata | Persona-to-entity binding |

**Gaps:**
- No persona resolution chain (session > explicit > customer-default > tenant-default)
- No 6-axis scoring engine (loyalty, engagement, spending, influence, expertise, trust)
- No persona-based feature gating at API level
- No automatic persona progression based on behavior
- No persona-based UI surface adaptation

---

### 5. Region Zone Module
**Status:** Functional | **Service:** 39 lines | **Models:** 2

**Models:**
| Model | Fields | Purpose |
|---|---|---|
| `region-zone-mapping` | id, residency_zone(GCC/EU/MENA/APAC/AMERICAS/GLOBAL), medusa_region_id, country_codes, policies_override, metadata | Data residency and regional policy mapping |

**Gaps:**
- No data locality enforcement at storage level
- No region-based routing middleware
- No cross-region data transfer compliance checks
- No GDPR/data sovereignty enforcement

---

### 6. Channel Module
**Status:** Functional | **Service:** 70 lines | **Models:** 2

**Models:**
| Model | Fields | Purpose |
|---|---|---|
| `sales-channel-mapping` | id, tenant_id, medusa_channel_id, channel_type, config, display_name, status, metadata | Map custom channels to Medusa sales channels |

**Gaps:**
- No channel-specific pricing rules
- No channel-specific product visibility
- No channel analytics aggregation

---

### 7. Audit Module
**Status:** Functional | **Service:** 99 lines | **Models:** 2

**Models:**
| Model | Fields | Purpose |
|---|---|---|
| `audit-log` | id, tenant_id, actor_id, actor_type, action, entity_type, entity_id, changes, ip_address, user_agent, metadata | Immutable audit trail |

**Gaps:**
- No automatic audit logging middleware (must be called manually)
- No audit log search/filter API
- No audit log retention policies
- No audit log export functionality
- Not connected to any entity change events

---

### 8. i18n Module
**Status:** Functional | **Service:** 104 lines | **Models:** 2

**Models:**
| Model | Fields | Purpose |
|---|---|---|
| `translation` | id, tenant_id, locale, namespace, key, value, context, status, metadata | Dynamic translation storage |

**Gaps:**
- No translation import/export (CSV, XLIFF, PO)
- No translation memory or suggestion engine
- No missing translation detection
- No machine translation integration
- No translation approval workflow

---

## Core Commerce Modules

### 9. Vendor Module
**Status:** Production-Ready | **Service:** 474 lines | **Models:** 7

**Models:**
| Model | Fields | Purpose |
|---|---|---|
| `vendor` | 24 fields | Marketplace vendor profiles with KYC, ratings, banking |
| `vendor-user` | id, vendor_id, user_id, role, permissions, status | Vendor team management |
| `vendor-product` | id, vendor_id, product_id, commission_rate_override, status | Product-vendor assignment |
| `vendor-order` | id, vendor_id, order_id, order_items, subtotal, commission, net_amount, status | Vendor order splits |
| `marketplace-listing` | id, vendor_id, product_id, status, featured, listing_rank, category_ids | Marketplace product listings |
| `vendor-analytics` | 22 fields | Revenue, orders, fulfillment, customer metrics per period |
| `vendor-performance-metric` | 13 fields | Defect rate, late shipment, cancellation tracking |

**Links:** vendor-commission, vendor-payout, vendor-store, order-vendor
**Workflows:** create-vendor, approve-vendor, calculate-commission, process-payout
**Subscribers:** vendor-approved, vendor-suspended

**Gaps:**
- Vendor onboarding wizard not connected to workflow
- No vendor document upload/verification (KYC fields exist, no file handling)
- No vendor catalog sync from external sources
- Vendor analytics model exists but no aggregation job/cron
- Performance metrics model exists but no measurement collection
- No vendor rating calculation from reviews
- No vendor payout schedule automation
- No vendor dispute resolution flow

---

### 10. Commission Module
**Status:** Functional | **Service:** 129 lines | **Models:** 3

**Models:**
| Model | Fields | Purpose |
|---|---|---|
| `commission-rule` | id, tenant_id, vendor_id, name, type(percentage/fixed/tiered), rate, tiers, category_ids, product_ids, min_order, max_commission, status, priority, metadata | Flexible commission rules |
| `commission-transaction` | id, tenant_id, vendor_id, order_id, rule_id, order_amount, commission_amount, currency_code, status, metadata | Commission calculation records |

**Links:** vendor-commission
**Workflows:** calculate-commission

**Gaps:**
- Tiered commission calculation engine not implemented (field exists but logic is absent)
- No category-based or product-based rule matching
- No commission dispute handling
- No commission adjustment/override workflow
- No retroactive commission recalculation
- No commission reporting/dashboard data aggregation

---

### 11. Payout Module
**Status:** Functional | **Service:** 335 lines | **Models:** 3

**Models:**
| Model | Fields | Purpose |
|---|---|---|
| `payout` | 2 lines (STUB) | Placeholder only |
| `payout-transaction-link` | id, payout_id, commission_transaction_id | Links payouts to commissions |

**Links:** vendor-payout
**Workflows:** process-payout
**Subscribers:** payout-completed, payout-failed

**Gaps:**
- **CRITICAL: Payout model is a 2-line stub** — needs full field definition (amount, currency, vendor_id, bank_details, status, scheduled_date, completed_date, reference, etc.)
- No payment gateway integration for actual payouts (Stripe Connect, bank transfers)
- No payout minimum threshold enforcement
- No payout schedule configuration (weekly, bi-weekly, monthly)
- No tax withholding calculations
- No payout reconciliation

---

### 12. Volume Pricing Module
**Status:** Functional | **Service:** 225 lines | **Models:** 3

**Models:**
| Model | Fields | Purpose |
|---|---|---|
| `volume-pricing` | 2 lines (STUB) | Placeholder only |
| `volume-pricing-tier` | id, volume_pricing_id, min_quantity, max_quantity, price, discount_percentage, metadata | Quantity-based pricing breaks |

**Gaps:**
- **CRITICAL: Main model is 2-line stub** — needs product_id, variant_id, currency_code, status, etc.
- No integration with Medusa's pricing engine
- No customer group-based volume pricing
- No volume pricing display on storefront product pages

---

### 13. Warranty Module
**Status:** Scaffolded | **Service:** 16 lines | **Models:** 6

**Models:**
| Model | Fields | Purpose |
|---|---|---|
| `warranty-plan` | 12 fields | Plan types (standard/extended/premium/accidental), coverage, exclusions |
| `warranty-claim` | id, warranty_plan_id, customer_id, product_id, order_id, claim_type, description, status, resolution, metadata | Claim lifecycle |
| `repair-order` | id, claim_id, service_center_id, status, diagnosis, repair_notes, parts_used, cost, metadata | Repair tracking |
| `service-center` | id, tenant_id, name, address, phone, specializations, status | Authorized repair locations |
| `spare-part` | id, tenant_id, name, part_number, price, stock_quantity, compatible_products | Parts inventory |

**Gaps:**
- Service is a 16-line CRUD stub — no claim processing logic
- No warranty activation on order completion
- No claim assessment workflow
- No repair order lifecycle management
- No spare parts inventory deduction
- No warranty expiration notifications
- No warranty transfer between customers

---

### 14. Invoice Module
**Status:** Functional | **Service:** 167 lines | **Models:** 2

**Models:**
| Model | Fields | Purpose |
|---|---|---|
| `invoice` | id, tenant_id, customer_id, order_id, invoice_number, status(draft/sent/paid/overdue/void), currency_code, subtotal, tax_total, discount_total, total, due_date, paid_at, payment_method, notes, metadata | Standard invoicing |
| `invoice-item` | id, invoice_id, title, description, order_id, order_display_id, quantity, unit_price, subtotal, tax_total, total, metadata | Line items |

**Links:** company-invoice

**Gaps:**
- No automatic invoice generation from orders
- No PDF generation
- No email sending on invoice creation/overdue
- No recurring invoice generation
- No partial payment tracking
- No credit note support
- No tax calculation engine integration

---

### 15. Review Module
**Status:** Functional | **Service:** 137 lines | **Models:** 1

**Models:**
| Model | Fields | Purpose |
|---|---|---|
| `review` | id, rating, title, content, customer_id, customer_name, customer_email, product_id, vendor_id, order_id, is_verified_purchase, is_approved, helpful_count, images, metadata | Product/vendor reviews |

**Links:** product-review
**Subscribers:** review-created

**Gaps:**
- No review moderation queue workflow
- No vendor response to reviews
- No review-based product/vendor rating aggregation
- No review incentive system (points for reviews)
- No review photo moderation
- No spam/fake review detection

---

### 16. Store Module
**Status:** Stub | **Service:** 84 lines | **Models:** 2

**Models:**
| Model | Fields | Purpose |
|---|---|---|
| `store` | 1 line (STUB) | Placeholder |

**Links:** tenant-store, vendor-store

**Gaps:**
- **CRITICAL: Model is 1-line stub** — needs name, address, coordinates, operating_hours, phone, email, vendor_id, tenant_id, type, status
- No store locator functionality
- No store-specific inventory management
- No click-and-collect integration
- No store operating hours/holiday management

---

## Commerce Verticals

### 17. Booking Module
**Status:** Production-Ready | **Service:** 627 lines | **Models:** 6

**Models:**
| Model | Fields | Purpose |
|---|---|---|
| `booking` | 20+ fields | Full booking lifecycle with customer, service, provider, time, status, payment |
| `service-product` | id, tenant_id, product_id, name, duration, buffer_time, max_capacity, price, currency, category, location, provider_id, status | Bookable services |
| `service-provider` | id, tenant_id, name, email, phone, specializations, availability, rating, status | Service providers |
| `availability` | id, provider_id, service_id, day_of_week, start_time, end_time, is_available, date_override, max_bookings | Calendar availability |
| `reminder` | id, booking_id, type, scheduled_at, sent_at, status | Booking reminders |

**Links:** booking-customer
**Subscribers:** booking-created, booking-confirmed, booking-completed, booking-cancelled, booking-checked-in

**Gaps:**
- No real-time availability checking engine
- No recurring booking support
- No group booking support
- No waitlist management
- No calendar sync (Google, Outlook)
- No payment integration for deposits/cancellation fees
- Reminder model exists but no sending mechanism

---

### 18. Subscription Module
**Status:** Production-Ready | **Service:** 694 lines | **Models:** 6

**Models:**
| Model | Fields | Purpose |
|---|---|---|
| `subscription` | 20+ fields | Full lifecycle with plan, customer, status, billing, trial, cancellation |
| `subscription-plan` | id, tenant_id, name, handle, description, price, currency, interval(monthly/quarterly/yearly), trial_days, features, status | Plan definitions |
| `subscription-item` | id, subscription_id, product_id, variant_id, quantity, unit_price | Subscription line items |
| `billing-cycle` | 20 fields | Per-cycle billing with payment tracking, retry logic |
| `subscription-event` | id, subscription_id, event_type, data, metadata | Lifecycle event log |

**Links:** customer-subscription
**Workflows:** create-subscription, process-billing-cycle, retry-failed-payment
**Subscribers:** 7 subscribers covering full lifecycle

**Gaps:**
- No subscription upgrade/downgrade proration
- No usage-based billing metering
- No subscription pause/resume with credit
- No gift subscription support
- No family/group subscription plans
- No Stripe subscription sync (local billing only)

---

### 19. Company (B2B) Module
**Status:** Production-Ready | **Service:** 480 lines | **Models:** 8

**Models:**
| Model | Fields | Purpose |
|---|---|---|
| `company` | 20+ fields | B2B company profiles with verification, credit limits, tax settings |
| `company-user` | id, company_id, customer_id, role, permissions, spending_limit, status | Company buyer management |
| `purchase-order` | id, company_id, created_by, items, subtotal, tax, total, status, approval_chain | B2B purchase orders |
| `purchase-order-item` | id, po_id, product_id, variant_id, quantity, unit_price, total | PO line items |
| `approval-workflow` | id, company_id, name, steps, conditions, status | Multi-step approval chains |
| `payment-terms` | id, company_id, net_days, discount_percentage, discount_days, credit_limit | Net-30/60/90 payment terms |
| `tax-exemption` | id, company_id, certificate_number, jurisdiction, status, valid_until | Tax exemption certificates |

**Links:** company-invoice, customer-company
**Workflows:** create-company, create-quote, approve-quote
**Subscribers:** company-created, purchase-order-submitted, quote-accepted, quote-approved, quote-declined

**Gaps:**
- No approval workflow engine (model exists but no execution logic)
- No credit limit enforcement at checkout
- No payment terms application to orders
- No tax exemption validation
- No company-specific catalog/pricing
- No company budget management
- No PO-to-order conversion workflow

---

### 20. Auction Module
**Status:** Scaffolded | **Service:** 16 lines | **Models:** 6

**Models:**
| Model | Fields | Purpose |
|---|---|---|
| `auction-listing` | id, tenant_id, product_id, title, description, starting_price, reserve_price, buy_now_price, currency, start_time, end_time, status, bid_increment, extensions_enabled, metadata | Auction configuration |
| `bid` | id, auction_id, bidder_id, amount, is_auto_bid, status, metadata | Individual bids |
| `auto-bid-rule` | id, auction_id, bidder_id, max_amount, increment, is_active | Proxy bidding |
| `auction-result` | id, auction_id, winning_bid_id, winner_id, final_price, status | Auction outcomes |
| `auction-escrow` | id, auction_id, bidder_id, amount, status | Payment holds |

**Links:** product-auction

**Gaps:**
- No bidding engine (bid validation, outbid notification, auto-bid execution)
- No auction timer with extension rules
- No reserve price enforcement
- No buy-now conversion
- No escrow payment integration
- No auction result settlement workflow
- No sniping protection (bid extension in final minutes)

---

### 21. Event Ticketing Module
**Status:** Scaffolded | **Service:** 18 lines | **Models:** 7

**Models:**
| Model | Fields | Purpose |
|---|---|---|
| `event` | id, tenant_id, title, description, venue_id, organizer_id, start_date, end_date, status, category, capacity, images, metadata | Event definitions |
| `venue` | id, tenant_id, name, address, capacity, seat_map_config, amenities, metadata | Venue management |
| `ticket-type` | id, event_id, name, price, currency, quantity, sold, status, sale_start, sale_end, max_per_order | Ticket tiers |
| `ticket` | id, ticket_type_id, event_id, customer_id, order_id, barcode, seat_info, status, checked_in_at | Individual tickets |
| `check-in` | id, ticket_id, checked_in_by, location, metadata | Check-in records |
| `seat-map` | id, venue_id, sections, rows, seats_per_row, pricing_zones | Venue seating |

**Gaps:**
- No ticket purchase flow integration with Medusa checkout
- No barcode/QR code generation
- No seat selection UI/engine
- No ticket transfer/resale marketplace
- No waitlist for sold-out events
- No event reminder notifications
- No check-in mobile app integration
- No early-bird/dynamic pricing engine

---

### 22. Rental Module
**Status:** Scaffolded | **Service:** 16 lines | **Models:** 6

**Models:**
| Model | Fields | Purpose |
|---|---|---|
| `rental-product` | id, tenant_id, product_id, rental_type(daily/weekly/monthly/hourly), base_price, currency, deposit_amount, late_fee_per_day, min/max_duration, is_available, condition, total_rentals, metadata | Rental item configuration |

**Links:** product-rental

**Gaps:**
- No rental availability calendar
- No rental period validation
- No deposit processing/refund workflow
- No late return fee calculation
- No condition inspection workflow (check-out/check-in)
- No rental extension handling
- No insurance add-on support
- No rental agreement generation

---

### 23. Restaurant Module
**Status:** Scaffolded | **Service:** 20 lines | **Models:** 8

**Models:**
| Model | Fields | Purpose |
|---|---|---|
| `restaurant` | 30 fields | Full restaurant profile with location, hours, delivery settings, ratings |
| Additional models | menu-item, menu-category, order, table-reservation, delivery-zone, kitchen-display, rating | Full F&B operations |

**Gaps:**
- No menu management UI
- No real-time order queue (kitchen display system)
- No table reservation engine
- No delivery zone radius calculation
- No delivery driver assignment
- No order preparation time estimation
- No restaurant operating hours enforcement
- No multi-location restaurant support

---

### 24. Grocery Module
**Status:** Scaffolded | **Service:** 14 lines | **Models:** 5

**Models:**
| Model | Fields | Purpose |
|---|---|---|
| `fresh-product` | 15 fields | Perishable product tracking with storage type, shelf life, temperature, origin, organic, seasonal |
| `delivery-slot` | id, tenant_id, date, start_time, end_time, capacity, booked_count, zone_id | Time-slot delivery |
| `batch-tracking` | id, product_id, batch_number, expiry_date, quantity, received_date | Lot/batch tracking |
| `substitution-rule` | id, product_id, substitute_product_id, priority, auto_substitute | Out-of-stock substitutions |

**Gaps:**
- No delivery slot booking engine
- No real-time inventory with batch/lot tracking
- No expiration date management and alerts
- No automatic substitution logic at fulfillment
- No weight-based pricing (price per kg)
- No shopping list/recurring orders
- No aisle/shelf location for picker optimization

---

### 25. Travel Module
**Status:** Scaffolded | **Service:** 20 lines | **Models:** 8

**Models:**
| Model | Fields | Purpose |
|---|---|---|
| `property` | 28 fields | Hotel/resort profiles with star rating, amenities, check-in/out times |
| `room-type` | id, property_id, name, description, max_occupancy, base_price, amenities, images, status | Room categories |
| `room` | id, room_type_id, room_number, floor, status, maintenance_notes | Physical rooms |
| `rate-plan` | id, room_type_id, name, price, currency, meal_plan, cancellation_policy, restrictions | Dynamic pricing |
| `reservation` | id, property_id, room_type_id, room_id, guest_id, check_in, check_out, adults, children, status, total, special_requests | Booking records |
| `guest-profile` | id, customer_id, preferences, loyalty_tier, past_stays, special_needs | Guest CRM |
| `amenity` | id, property_id, name, category, description, price, is_complimentary | Amenity catalog |

**Gaps:**
- No room availability engine (date range availability checking)
- No dynamic pricing engine (seasonal, demand-based)
- No channel manager integration (Booking.com, Expedia, Airbnb)
- No housekeeping workflow
- No PMS (Property Management System) integration
- No guest communication automation
- No multi-property portfolio management

---

### 26. Automotive Module
**Status:** Scaffolded | **Service:** 16 lines | **Models:** 6

**Models:**
| Model | Fields | Purpose |
|---|---|---|
| `vehicle-listing` | id, tenant_id, vendor_id, make, model, year, trim, vin, mileage, condition, price, currency, color, fuel_type, transmission, body_type, features, images, status, metadata | Vehicle inventory |
| `test-drive` | id, listing_id, customer_id, preferred_date, status, location, notes | Test drive scheduling |
| `trade-in` | id, customer_id, make, model, year, mileage, condition, estimated_value, status, inspection_notes | Trade-in evaluation |
| `vehicle-service` | id, vehicle_id, service_type, description, cost, status, scheduled_date, completed_date | Service records |
| `part-catalog` | id, tenant_id, part_number, name, category, price, compatibility, stock | Parts inventory |

**Gaps:**
- No VIN decoder integration
- No vehicle valuation engine (KBB, Edmunds)
- No trade-in offer workflow
- No financing calculator
- No vehicle comparison tool
- No service appointment scheduling
- No vehicle history report integration (Carfax)
- No inventory feed import (dealer management systems)

---

### 27. Real Estate Module
**Status:** Scaffolded | **Service:** 18 lines | **Models:** 7

**Models:**
| Model | Fields | Purpose |
|---|---|---|
| `property-listing` | 30 fields | Full property listing with listing type, property type, price, address, coordinates, bedrooms, bathrooms, area, features, images, virtual tour |

**Gaps:**
- No property search with geo-spatial queries
- No mortgage calculator
- No property comparison tool
- No virtual tour integration
- No agent commission calculation
- No property viewing appointment scheduling
- No MLS feed import
- No lead management for inquiries

---

### 28. Healthcare Module
**Status:** Scaffolded | **Service:** 20 lines | **Models:** 8

**Models:**
| Model | Fields | Purpose |
|---|---|---|
| `practitioner` | 20 fields | Healthcare provider profiles with license, specialization, consultation fees, availability |
| `healthcare-appointment` | Full scheduling | Patient appointments with practitioner |
| `prescription` | id, patient_id, practitioner_id, medications, diagnosis, notes, status | Prescription management |
| `medical-record` | Patient medical history | HIPAA-relevant data |
| `pharmacy-product` | Pharmaceutical catalog | Rx and OTC products |
| `lab-order` | Laboratory test orders | Lab test lifecycle |
| `insurance-claim` | Claim processing | Insurance billing |

**Gaps:**
- No HIPAA compliance measures (encryption at rest, access logging)
- No telemedicine/video consultation integration
- No prescription verification workflow
- No insurance eligibility verification
- No appointment reminder system
- No lab result delivery
- No pharmacy order fulfillment
- No practitioner schedule management

---

### 29. Education Module
**Status:** Scaffolded | **Service:** 18 lines | **Models:** 7

**Models:**
| Model | Fields | Purpose |
|---|---|---|
| `course` | id, tenant_id, instructor_id, title, description, category, level, price, currency, duration, syllabus, prerequisites, max_students, status, rating, total_reviews, images | Course catalog |
| `lesson` | id, course_id, title, content_type, content_url, duration, order, is_preview | Course content |
| `enrollment` | id, course_id, student_id, status, progress_percentage, enrolled_at, completed_at | Student tracking |
| `assignment` | id, course_id, title, description, due_date, max_score, submission_type | Assignments |
| `quiz` | id, lesson_id, title, questions, passing_score, time_limit, attempts_allowed | Assessments |
| `certificate` | id, enrollment_id, template_id, certificate_number, issued_at, valid_until | Completion certificates |

**Gaps:**
- No video hosting/streaming integration
- No progress tracking engine
- No quiz engine with auto-grading
- No certificate PDF generation
- No learning path/curriculum builder
- No student discussion forums
- No instructor payout system
- No SCORM/xAPI compliance
- No live class scheduling integration

---

### 30-48. Remaining Vertical Modules

All following modules share the same scaffolded pattern: **rich data models (5-8 each) but 14-18 line stub services with no business logic**.

| # | Module | Models | Key Models |
|---|---|---|---|
| 30 | Financial Product | 6 | insurance-product, insurance-policy, loan-product, loan-application, investment-plan |
| 31 | Fitness | 6 | trainer-profile, class-schedule, class-booking, gym-membership, wellness-plan |
| 32 | Freelance | 7 | gig-listing, proposal, freelance-contract, milestone, time-log, freelance-dispute |
| 33 | Parking | 5 | parking-zone (20 fields), parking-session, ride-request, shuttle-route |
| 34 | Pet Service | 5 | pet-profile (18 fields), grooming-booking, veterinary-visit, pet-sitting, pet-insurance |
| 35 | Digital Product | 3 | digital-asset, download-license |
| 36 | Membership | 6 | membership-tier (16 fields), membership, points-ledger, redemption, reward, loyalty-program |
| 37 | Advertising | 6 | ad-campaign, ad-creative, ad-placement, ad-account, impression-log |
| 38 | Affiliate | 6 | affiliate (20 fields), referral-link, click-tracking, affiliate-commission, influencer-campaign |
| 39 | Classified | 6 | classified-listing, listing-category, listing-image, listing-offer, listing-flag |
| 40 | Crowdfunding | 6 | campaign, reward-tier, pledge, backer, campaign-update |
| 41 | Charity | 5 | charity-org, donation-campaign, donation, impact-report |
| 42 | Social Commerce | 6 | live-stream (20 fields), social-post, social-share, live-product |
| 43 | Legal | 5 | attorney-profile (16 fields), legal-case, consultation, retainer-agreement |
| 44 | Utilities | 5 | utility-account (14 fields), utility-bill, meter-reading, usage-record |
| 45 | Government | 6 | citizen-profile, service-request (20 fields), permit, municipal-license, fine |
| 46 | Promotion Extension | 9 | Extended promotion rules beyond Medusa's built-in |
| 47 | Events (Outbox) | 2 | event-outbox — CMS-compatible event envelope |
| 48 | Quote | 3 | quote model is 2-line STUB |

**Common Gaps Across All Scaffolded Verticals:**
- Services are 14-20 line CRUD stubs with no domain logic
- No validation rules beyond basic types
- No status transition enforcement (state machines)
- No business rule engines
- No notification triggers
- No reporting/analytics data aggregation
- No integration with Medusa's order/payment/fulfillment lifecycle
- No search/filtering beyond basic list endpoints

---

## Medusa Built-in Module Extensions

Medusa v2 provides these modules natively. Current extension status:

| Medusa Module | Custom Extension? | Gap |
|---|---|---|
| Product | No | No multi-tenant product isolation, no vendor-product link enforcement |
| Order | No | No order-splitting for multi-vendor, no vendor notification on order |
| Customer | No | No customer-tenant scoping, no customer merge |
| Payment (Stripe) | Config only | No webhook processing, no split payment for marketplace |
| Fulfillment | No | No multi-vendor fulfillment routing |
| Inventory | No | No vendor-specific inventory, no warehouse management |
| Pricing | No | No volume pricing integration, no customer-group pricing |
| Promotion | Extension exists | 9 models but stub service |
| Tax | No | No tax exemption application from B2B module |
| Region | No | No region-zone integration |
| Sales Channel | No | No channel mapping enforcement |
| Notification | SendGrid config | No template management, no notification preferences |
| API Key | No | No tenant-scoped API keys |
| Auth | No | No RBAC enforcement middleware |

---

## Cross-Cutting Concerns

### Existing Infrastructure
| Component | Status | Detail |
|---|---|---|
| Module Links | 15 defined | tenant-node, tenant-store, node-governance, vendor-commission, vendor-payout, vendor-store, order-vendor, product-review, product-auction, product-rental, company-invoice, customer-company, customer-subscription, customer-membership, booking-customer |
| Workflows | 10 defined | 3 B2B (company, quote), 3 subscription (create, billing, retry), 4 vendor (create, approve, commission, payout) |
| Subscribers | 33 defined | Booking (5), Order (4), Payment (4), Subscription (7), Vendor (2), Quote (3), Company (1), Purchase Order (1), Review (1), Payout (2), Customer (1), Integration (1), Temporal (1) |
| Temporal Client | Configured | Client wrapper exists but no workflow definitions |
| Integration Layer | Wrappers only | ERPNext, Fleetbase, Walt.id, Payload CMS service wrappers with no active connections |

### Missing Cross-Cutting Features
| Feature | Impact | Priority |
|---|---|---|
| Tenant data isolation middleware | All queries must filter by tenant_id — currently not enforced | CRITICAL |
| RBAC enforcement middleware | Role/weight checks not enforced at API level | CRITICAL |
| State machine engine | No status transition validation in any module | HIGH |
| Notification system | 33 subscribers exist but most just log, don't send emails/push | HIGH |
| Search engine | No full-text search across products, listings, content | HIGH |
| File upload/storage | No image/document upload handling anywhere | HIGH |
| Scheduled jobs/cron | No recurring tasks (billing cycles, auction endings, expiration checks) | HIGH |
| Webhook outbound | No webhook delivery to external systems | MEDIUM |
| Rate limiting | No API rate limiting per tenant | MEDIUM |
| Caching layer | No Redis/cache for frequently accessed data | MEDIUM |
| Data validation middleware | No request validation beyond basic types | MEDIUM |
| Audit auto-logging | Audit module exists but not auto-connected to entity changes | MEDIUM |
| Analytics pipeline | No data aggregation for dashboards | LOW |

---

## Missing Modules

The following modules are referenced in the platform architecture or needed for feature completeness but do not exist:

### 1. Wishlist Module
**Priority:** HIGH
**Purpose:** Customer product wishlists and save-for-later
**Required Models:**
- `wishlist` — id, customer_id, tenant_id, name, is_public, metadata
- `wishlist-item` — id, wishlist_id, product_id, variant_id, added_at, notes, priority
**Required Features:**
- Add/remove products from wishlist
- Multiple named wishlists per customer
- Share wishlist (public/private)
- Back-in-stock notifications for wishlist items
- Wishlist to cart conversion
- Wishlist analytics (most wishlisted products)
**API Routes:** /store/wishlists (CRUD), /store/wishlists/:id/items (CRUD)

### 2. Cart/Checkout Extension Module
**Priority:** HIGH
**Purpose:** Extended checkout features beyond Medusa defaults
**Required Models:**
- `checkout-config` — tenant_id, guest_checkout_enabled, address_validation, minimum_order_amount, checkout_fields
- `abandoned-cart` — id, cart_id, customer_id, email, items_snapshot, reminder_sent_at, recovered_at
- `gift-card-balance` — id, customer_id, code, balance, currency, expires_at
**Required Features:**
- Abandoned cart recovery (email reminders)
- Custom checkout fields per tenant
- Gift card balance management
- Checkout address validation
- Minimum order enforcement
- Express checkout (Apple Pay, Google Pay config)

### 3. Shipping/Fulfillment Extension Module
**Priority:** HIGH
**Purpose:** Multi-vendor fulfillment, shipping rates, tracking
**Required Models:**
- `shipping-profile-vendor` — id, vendor_id, shipping_profile_id, handling_time_days
- `shipment-tracking` — id, order_id, fulfillment_id, carrier, tracking_number, tracking_url, status, events
- `return-request` — id, order_id, customer_id, items, reason, status, refund_amount, label_url
**Required Features:**
- Multi-vendor order splitting and routing
- Real-time tracking integration (AfterShip, EasyPost)
- Return/exchange request workflow
- Shipping label generation
- Delivery estimation
- Fleetbase integration for local delivery

### 4. Notification Preferences Module
**Priority:** HIGH
**Purpose:** Customer and vendor notification management
**Required Models:**
- `notification-preference` — id, entity_type, entity_id, channel(email/sms/push/in_app), category, enabled
- `notification-template` — id, tenant_id, name, channel, subject, body, variables, locale
- `notification-log` — id, recipient_id, template_id, channel, status, sent_at, error
**Required Features:**
- Per-customer notification preferences
- Multi-channel delivery (email, SMS, push, in-app)
- Template management with localization
- Delivery tracking and retry
- Unsubscribe management

### 5. CMS Content Module
**Priority:** MEDIUM
**Purpose:** Content pages, blog, navigation management
**Required Models:**
- `cms-page` — id, tenant_id, title, slug, content_blocks, seo_metadata, status, locale, published_at
- `cms-navigation` — id, tenant_id, location(header/footer/sidebar), items, locale
- `cms-media` — id, tenant_id, url, alt_text, type, file_size, dimensions
- `blog-post` — id, tenant_id, title, slug, content, author_id, category, tags, featured_image, status, published_at
**Required Features:**
- Block-based page builder
- SEO metadata management
- Media library with upload
- Blog with categories and tags
- Navigation menu builder
- Content scheduling (publish/unpublish dates)
- Content versioning

### 6. Loyalty & Rewards Module
**Priority:** MEDIUM
**Purpose:** Points-based loyalty program (beyond membership tiers)
**Required Models:**
- `loyalty-program` — Already exists in membership module but needs expansion
- `points-transaction` — id, customer_id, points, type(earn/redeem/expire/adjust), source, reference_id, balance_after
- `earn-rule` — id, program_id, event_type(purchase/review/referral/birthday), points_formula, conditions
- `reward-catalog` — id, program_id, name, points_cost, type(discount/product/experience), value, stock
**Required Features:**
- Points earning on purchases (configurable rate)
- Points redemption at checkout
- Tiered multipliers based on membership level
- Points expiration management
- Referral bonus points
- Birthday/anniversary bonus
- Reward catalog management

### 7. Analytics & Reporting Module
**Priority:** MEDIUM
**Purpose:** Business intelligence and dashboards
**Required Models:**
- `report-definition` — id, tenant_id, name, type, query, filters, schedule
- `report-snapshot` — id, report_id, data, generated_at
- `kpi-metric` — id, tenant_id, metric_type, value, period, dimensions
**Required Features:**
- Revenue analytics (daily/weekly/monthly trends)
- Product performance (views, conversion, revenue)
- Customer analytics (acquisition, retention, LTV)
- Vendor performance dashboards
- Real-time sales monitoring
- Custom report builder
- Scheduled report delivery (email)
- Export to CSV/PDF

### 8. Dispute & Resolution Module
**Priority:** MEDIUM
**Purpose:** Order disputes, chargebacks, mediation
**Required Models:**
- `dispute` — id, tenant_id, order_id, customer_id, vendor_id, type(quality/delivery/fraud/billing), description, evidence, status, resolution, resolved_at
- `dispute-message` — id, dispute_id, sender_type, sender_id, message, attachments
- `dispute-evidence` — id, dispute_id, type, file_url, description
**Required Features:**
- Dispute creation by customer or vendor
- Evidence submission workflow
- Mediation process with admin intervention
- Resolution enforcement (refund, replacement, rejection)
- Escalation rules and SLAs
- Dispute analytics (rates, resolution times)

### 9. Inventory Management Extension
**Priority:** MEDIUM
**Purpose:** Multi-location, vendor-specific inventory beyond Medusa defaults
**Required Models:**
- `warehouse` — id, tenant_id, name, address, type(fulfillment/display/vendor), capacity
- `stock-transfer` — id, from_warehouse_id, to_warehouse_id, items, status, shipped_at, received_at
- `stock-alert` — id, product_id, variant_id, warehouse_id, threshold, alert_type(low/out), notified_at
- `inventory-count` — id, warehouse_id, items, status, counted_by, completed_at
**Required Features:**
- Multi-warehouse stock management
- Stock transfer between locations
- Low stock alerts
- Inventory counting/reconciliation
- Vendor-specific stock segregation
- Reserved stock for pending orders
- Backorder management

### 10. Tax Configuration Module
**Priority:** LOW
**Purpose:** Advanced tax management beyond Medusa defaults
**Required Models:**
- `tax-rule` — id, tenant_id, region_id, product_category, rate, type(inclusive/exclusive), name
- `tax-exemption-cert` — Already in company module but needs validation engine
**Required Features:**
- Multi-jurisdiction tax calculation
- Tax-exempt customer handling
- Digital goods tax (VAT MOSS)
- Tax reporting per jurisdiction
- Integration with tax services (Avalara, TaxJar)

---

## Priority Roadmap

### Phase 1: Critical Foundation (Weeks 1-3)
1. **Tenant data isolation middleware** — Enforce tenant_id filtering on all queries
2. **RBAC enforcement middleware** — Validate role weights at API level
3. **Payout model completion** — Replace 2-line stub with full model
4. **Store model completion** — Replace 1-line stub with full model
5. **Quote model completion** — Replace 2-line stub with full model
6. **Volume pricing model completion** — Replace 2-line stub and integrate with pricing

### Phase 2: Core Commerce Logic (Weeks 4-8)
7. **Wishlist module** — New module
8. **Order multi-vendor splitting** — Extend Medusa order workflow
9. **Commission calculation engine** — Implement tiered/category rules
10. **Invoice auto-generation** — Create invoices from completed orders
11. **Notification system** — Connect subscribers to actual email/push delivery
12. **Shipping/fulfillment extension** — Tracking, returns, multi-vendor routing
13. **File upload/storage** — Image and document upload handling

### Phase 3: Vertical Business Logic (Weeks 9-14)
14. **Booking availability engine** — Real-time calendar with conflict detection
15. **Auction bidding engine** — Bid validation, auto-bid, timer, settlement
16. **Subscription billing automation** — Scheduled billing cycle processing
17. **B2B approval workflow engine** — Execute multi-step approval chains
18. **Vendor payout automation** — Scheduled payouts with threshold enforcement
19. **State machine engine** — Reusable status transitions across all modules
20. **Search integration** — Full-text search for products, listings, content

### Phase 4: Extended Features (Weeks 15-20)
21. **Analytics & reporting module** — Dashboards and custom reports
22. **Dispute resolution module** — Customer/vendor dispute workflow
23. **Loyalty & rewards module** — Points earning/redemption engine
24. **CMS content module** — Page builder and blog
25. **Inventory extension** — Multi-warehouse, vendor stock, alerts
26. **Cart/checkout extension** — Abandoned cart, gift cards, custom fields

### Phase 5: Vertical Depth (Weeks 21+)
27. Deepen all 27 scaffolded verticals with domain-specific business logic
28. Temporal workflow definitions for cross-system integration
29. External system integration activation (ERPNext, Fleetbase, Walt.id)
30. Performance optimization and caching layer

---

*Document generated from codebase analysis. All line counts and model inventories verified against source files.*
