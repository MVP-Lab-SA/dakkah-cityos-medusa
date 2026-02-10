# Dakkah CityOS — Cross-System Commerce Architecture

> **Version:** 2.0.0
> **Date:** 2026-02-10
> **Status:** Reference Architecture
> **Audience:** All system teams (Medusa, ERPNext, Fleetbase, Walt.id, Payment Gateways, PayloadCMS, Temporal)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Roles & Responsibilities](#2-system-roles--responsibilities)
3. [Model Distribution by System](#3-model-distribution-by-system)
   - 3.1 Medusa.js — Commerce Engine
   - 3.2 ERPNext — Back-Office ERP
   - 3.3 Fleetbase — Logistics & Fulfillment
   - 3.4 Walt.id — Identity & Credentials
   - 3.5 Payment Gateways — Financial Transactions
   - 3.6 PayloadCMS — Content & Configuration
   - 3.7 Shared / Synced Models (PayloadCMS = Master System)
4. [Temporal Workflow System](#4-temporal-workflow-system)
   - 4.1 Architecture Overview
   - 4.2 Design Principles
   - 4.3 Workflow Catalog
   - 4.4 Signal & Query Contracts
   - 4.5 Error Handling & Retry Policies
5. [Integration Patterns](#5-integration-patterns)
6. [Data Flow Diagrams](#6-data-flow-diagrams)
7. [Security & Compliance](#7-security--compliance)
8. [Appendix](#8-appendix)
9. [Implementation Mapping](#9-implementation-mapping)
   - 9.1 Repository Structure
   - 9.2 Key File Responsibilities
   - 9.3 Integration Adapter Interface
   - 9.4 Event-to-Workflow Dispatch Map
   - 9.5 Sync Tracking Data Model
10. [Deployment Architecture](#10-deployment-architecture)
    - 10.1 Infrastructure Topology
    - 10.2 Worker Deployment Strategy
    - 10.3 Environment Variables Reference
    - 10.4 Network Security
11. [Monitoring & Observability](#11-monitoring--observability)
    - 11.1 Observability Stack
    - 11.2 Key Metrics
    - 11.3 Structured Logging Format
    - 11.4 Dashboard Definitions
    - 11.5 Distributed Tracing
12. [Disaster Recovery & Business Continuity](#12-disaster-recovery--business-continuity)
    - 12.1 Recovery Objectives
    - 12.2 Failure Modes & Mitigation
    - 12.3 Event Outbox as Durability Guarantee
    - 12.4 Data Reconciliation Procedures
    - 12.5 Backup Strategy
13. [Performance & Scaling Constraints](#13-performance--scaling-constraints)
    - 13.1 System Rate Limits
    - 13.2 Workflow Concurrency Limits
    - 13.3 Batch Processing Guidelines
    - 13.4 Latency Budgets
    - 13.5 Database Performance
    - 13.6 Scaling Recommendations by Scope Tier
14. [Testing Strategy](#14-testing-strategy)
    - 14.1 Test Pyramid
    - 14.2 Integration Test Categories
    - 14.3 Contract Testing
    - 14.4 Temporal Workflow Testing
    - 14.5 Chaos Testing Scenarios
    - 14.6 Pre-Production Checklist
15. [Operational Runbooks](#15-operational-runbooks)
    - 15.1 Incident Response
    - 15.2 Common Operational Procedures
    - 15.3 Troubleshooting Guide
    - 15.4 Maintenance Windows

---

## 1. Executive Summary

Dakkah CityOS is a multi-tenant, multi-vendor city-scale commerce platform. It distributes **~396 data models** across 6 specialized systems, orchestrated by **80 Temporal workflows** for cross-system operations. The platform covers **27 personas** and **26+ commerce verticals** spanning retail, marketplace, B2B, hospitality, healthcare, education, government, real estate, automotive, gig economy, and more.

**Core principle:** Each system owns the models it is best suited to manage. Cross-system coordination happens through Temporal workflows, with the EventOutbox providing an audit trail of all inter-system events.

### System Count Summary

| System | Model Count | Role |
|--------|------------|------|
| Medusa.js | ~209 | Commerce engine, marketplace, B2B, all commerce verticals |
| ERPNext | ~55 | Accounting, inventory, HR, compliance, vertical finance |
| Fleetbase | ~32 | Delivery, fleet, warehousing, cold chain, transport |
| Walt.id | ~25 | Identity, credentials, KYC, professional licenses |
| Payment Gateways | ~25 | Money movement, wallets, BNPL, escrow, tips, micro |
| PayloadCMS | ~40 | Content, branding, city services, knowledge, community |
| Shared/Synced (PayloadCMS-managed) | ~10 | Master data synced via Temporal |
| **Total** | **~396** | |

### Temporal Workflow Count Summary

| Category | Workflow Count |
|----------|---------------|
| Order Lifecycle | 8 |
| Payment & Financial | 7 |
| Marketplace & Vendor | 6 |
| B2B Commerce | 5 |
| Subscription & Billing | 5 |
| Logistics & Fulfillment | 6 |
| Identity & Compliance | 5 |
| Content & Notification | 4 |
| Booking & Services | 4 |
| Platform Operations | 5 |
| Auction & Bidding | 1 |
| Rental & Leasing | 1 |
| Restaurant & Food | 1 |
| Events & Ticketing | 1 |
| Classified & C2C | 1 |
| Affiliate & Influencer | 1 |
| Warranty & After-Sales | 1 |
| Freelance & Gig Economy | 1 |
| Travel & Hospitality | 1 |
| Real Estate | 1 |
| Crowdfunding | 1 |
| Social Commerce | 1 |
| Grocery & Fresh | 1 |
| Automotive | 1 |
| Healthcare | 1 |
| Education | 1 |
| Charity & Donations | 1 |
| Financial Products | 1 |
| Advertising | 1 |
| Parking & Transport | 1 |
| Utility Bill Payment | 1 |
| Government & Municipal | 1 |
| Membership Lifecycle | 1 |
| Pet Services | 1 |
| Fitness & Wellness | 1 |
| **Total** | **~80** |

### Persona Coverage Matrix

Every commerce vertical is mapped to the personas it serves:

| Persona | Verticals Covered |
|---------|------------------|
| **Consumer (B2C)** | Core commerce, subscriptions, bookings, auctions, rentals, restaurant, events, travel, grocery, automotive, healthcare, education, fitness, pet services, parking, utilities, membership, social commerce |
| **Business Buyer (B2B)** | B2B commerce, quotes, purchase orders, volume pricing, payment terms, tax exemptions, approval workflows |
| **Vendor / Seller** | Marketplace, commissions, payouts, product management, performance reviews, settlement |
| **Restaurant Owner** | Restaurant & food, menu management, kitchen orders, table reservations, food delivery |
| **Service Provider** | Bookings, freelance/gig, healthcare provider, fitness instructor, pet services, legal/professional, automotive workshop |
| **Freelancer / Gig Worker** | Gig listings, proposals, contracts, milestones, escrow, mutual reviews |
| **Property Owner / Agent** | Real estate listings, lease agreements, property transactions, viewing scheduling |
| **Event Organizer** | Events & ticketing, seating, sponsorships, registrations |
| **Hotel / Hospitality** | Hotel reservations, room management, tour packages, transfers |
| **Delivery Driver / Courier** | Fleet management, route optimization, proof of delivery, ride assignments |
| **Healthcare Practitioner** | Medical appointments, prescriptions, telemedicine, lab bookings |
| **Educator / Instructor** | Courses, modules, enrollments, assignments, certifications, tutoring |
| **Government Official** | Municipal services, permits, fines, public consultations, citizen identity |
| **Citizen / Resident** | Government services, utility payments, public consultations, parking |
| **Advertiser / Marketer** | Ad campaigns, placements, creatives, impressions, sponsored products, influencer programs |
| **Affiliate / Influencer** | Affiliate programs, tracked links, commissions, influencer campaigns |
| **Donor / Philanthropist** | Donation campaigns, recurring donations, tax receipts, non-profit profiles |
| **Investor / Backer** | Crowdfunding campaigns, pledges, rewards, stretch goals |
| **Auction Participant** | Auctions (English, Dutch, sealed, reverse), bidding, watchlists |
| **Renter / Lessee** | Rental products, rental agreements, returns, damage reports |
| **Tourist / Visitor** | Travel packages, hotel reservations, tours, city guides, event tickets |
| **Student / Learner** | Course enrollment, progress tracking, assignments, certifications |
| **Patient** | Medical appointments, prescriptions, pharmacy orders, telemedicine, lab tests |
| **Pet Owner** | Pet profiles, pet service bookings, pet product subscriptions |
| **Vehicle Owner** | Vehicle listings, parts, service appointments, inspections, trade-ins |
| **Membership Holder** | Membership plans, loyalty tiers, member benefits, digital cards |
| **Platform Admin** | Tenant management, audit logs, system health, compliance, data migration |

---

## 2. System Roles & Responsibilities

### 2.1 Medusa.js — Commerce Engine
- **Owns:** Product catalog, cart, checkout, orders, pricing, customers, marketplace, B2B, subscriptions, bookings, reviews, quotes, commissions
- **Does NOT own:** Accounting ledger, physical fulfillment, identity verification, content pages, payment processing internals
- **Integration role:** Source of truth for commerce events. Publishes to EventOutbox → Temporal picks up

### 2.2 ERPNext — Back-Office ERP
- **Owns:** Chart of accounts, general ledger, inventory levels, stock movements, HR, payroll, tax reporting, compliance, supplier management, asset management, budgets
- **Does NOT own:** Customer-facing checkout, real-time delivery tracking, content management
- **Integration role:** Receives order/payment events from Medusa via Temporal. Publishes inventory updates back

### 2.3 Fleetbase — Logistics & Fulfillment
- **Owns:** Delivery orders, driver/fleet management, route optimization, real-time tracking, warehouse operations, proof of delivery, last-mile config
- **Does NOT own:** Product catalog, pricing, payment, accounting
- **Integration role:** Receives fulfillment requests from Medusa via Temporal. Publishes tracking updates back

### 2.4 Walt.id — Identity & Credentials
- **Owns:** Decentralized identities (DIDs), verifiable credentials, KYC verification, digital wallets, credential schemas, consent management
- **Does NOT own:** Commerce transactions, content, delivery
- **Integration role:** Called by Temporal for identity verification during onboarding, high-value transactions, and credential issuance

### 2.5 Payment Gateways (Stripe / Tap / HyperPay)
- **Owns:** Payment intents, payment methods, transaction processing, refunds, disputes, escrow, connected accounts, wallets, BNPL
- **Does NOT own:** Order lifecycle, product data, delivery
- **Integration role:** Called by Temporal for payment capture, refunds, splits, escrow. Webhooks feed back into Medusa

### 2.6 PayloadCMS — Content, Configuration & Master Data
- **Owns:** Pages, blog posts, media, navigation, banners, email/SMS/push templates, storefront themes, SEO, forms, city events, venue profiles, localized content
- **Owns (Master System):** Node hierarchy, Governance, Persona, Translations, Sales Channel mappings, Region-Zone mappings, Store config, Event envelope routing, Audit log aggregation. PayloadCMS is the single source of truth for all shared/synced models — all other systems receive these via Temporal sync workflows
- **Does NOT own:** Transactional data, inventory, payments
- **Integration role:** Master system for platform configuration and shared models. Temporal workflows sync changes from PayloadCMS → all other systems. Also provides content to storefront

---

## 3. Model Distribution by System

### 3.1 Medusa.js — Commerce Engine (~209 models)

#### 3.1.1 Core Commerce (Medusa Built-in) — 18 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 1 | Product | Product catalog entries | product |
| 2 | ProductVariant | SKU-level variants | product_variant |
| 3 | ProductCollection | Product groupings | product_collection |
| 4 | ProductCategory | Product taxonomy | product_category |
| 5 | Cart | Shopping session | cart |
| 6 | Order | Order lifecycle | order |
| 7 | LineItem | Order/cart items | line_item |
| 8 | Customer | Customer accounts | customer |
| 9 | Region | Regional configuration | region |
| 10 | SalesChannel | Multi-channel selling | sales_channel |
| 11 | PriceList | B2B/VIP pricing | price_list |
| 12 | Discount | Promotion rules | discount |
| 13 | GiftCard | Gift card management | gift_card |
| 14 | Return | Return processing | return |
| 15 | Exchange | Product exchanges | exchange |
| 16 | Swap | Product swaps | swap |
| 17 | ClaimOrder | Damage/defect claims | claim_order |
| 18 | Notification | System notifications | notification |

#### 3.1.2 Tenant & Platform — 6 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 19 | Tenant | Multi-tenant isolation | tenant |
| 20 | TenantUser | Tenant RBAC (10 roles, node-scoped) | tenant_user |
| 21 | TenantSettings | Tenant commerce config | tenant_settings |
| 22 | TenantBilling | Platform billing per tenant | tenant_billing |
| 23 | TenantUsageRecord | Usage metering | tenant_usage_record |
| 24 | TenantInvoice | Platform invoices to tenants | tenant_invoice |

#### 3.1.3 Vendor Marketplace — 7 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 25 | Vendor | Marketplace vendor profiles | vendor |
| 26 | VendorUser | Vendor staff accounts | vendor_user |
| 27 | VendorProduct | Vendor-product ownership | vendor_product |
| 28 | VendorOrder | Order split per vendor | vendor_order |
| 29 | VendorOrderItem | Vendor line items | vendor_order_item |
| 30 | VendorAnalyticsSnapshot | Periodic analytics snapshots | vendor_analytics_snapshot |
| 31 | VendorPerformanceMetric | Performance KPIs | vendor_performance_metric |

#### 3.1.4 Commission & Payouts — 4 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 32 | CommissionRule | Commission rate structures | commission_rule |
| 33 | CommissionTransaction | Commission ledger entries | commission_transaction |
| 34 | Payout | Vendor payout records | payout |
| 35 | PayoutTransactionLink | Payout-to-transaction mapping | payout_transaction_link |

#### 3.1.5 B2B Commerce — 9 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 36 | Company | B2B company accounts | company |
| 37 | CompanyUser | Company user roles/limits | company_user |
| 38 | PurchaseOrder | B2B purchase orders | purchase_order |
| 39 | PurchaseOrderItem | PO line items | purchase_order_item |
| 40 | PaymentTerms | Net 30/60 payment terms | payment_terms |
| 41 | TaxExemption | B2B tax exemptions | tax_exemption |
| 42 | ApprovalWorkflow | Purchase approval config | approval_workflow |
| 43 | ApprovalRequest | Approval instances | approval_request |
| 44 | ApprovalAction | Individual approval decisions | approval_action |

#### 3.1.6 Quotes — 2 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 45 | Quote | RFQ/quote management | quote |
| 46 | QuoteItem | Quote line items | quote_item |

#### 3.1.7 Subscriptions — 7 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 47 | Subscription | Active subscriptions | subscription |
| 48 | SubscriptionItem | Subscribed products | subscription_item |
| 49 | SubscriptionPlan | Plan definitions | subscription_plan |
| 50 | SubscriptionDiscount | Plan-level discounts | subscription_discount |
| 51 | BillingCycle | Billing period records | billing_cycle |
| 52 | SubscriptionEvent | Lifecycle events | subscription_event |
| 53 | SubscriptionPause | Pause/resume records | subscription_pause |

#### 3.1.8 Bookings & Services — 7 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 54 | Booking | Service bookings | booking |
| 55 | BookingItem | Booking line items | booking_item |
| 56 | BookingReminder | Reminder scheduling | booking_reminder |
| 57 | ServiceProduct | Bookable product config | service_product |
| 58 | ServiceProvider | Service provider profiles | service_provider |
| 59 | Availability | Provider schedules | availability |
| 60 | AvailabilityException | Schedule overrides | availability_exception |

#### 3.1.9 Reviews & Pricing — 5 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 61 | Review | Product/service reviews | review |
| 62 | VolumePricing | Tiered pricing rules | volume_pricing |
| 63 | VolumePricingTier | Individual price tiers | volume_pricing_tier |
| 64 | Invoice | Order invoices | invoice |
| 65 | InvoiceItem | Invoice line items | invoice_item |

#### 3.1.10 Promotions & Customer (NEW — to build) — 8 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 66 | Coupon | Coupon codes with usage limits | coupon |
| 67 | BundleOffer | Product bundle pricing | bundle_offer |
| 68 | FlashSale | Time-limited deals | flash_sale |
| 69 | WishList | Customer saved items | wish_list |
| 70 | AbandonedCart | Cart recovery tracking | abandoned_cart |
| 71 | CustomerGroup | Customer grouping | customer_group |
| 72 | ReferralProgram | Referral tracking/rewards | referral_program |
| 73 | FeaturedListing | Sponsored/promoted products | featured_listing |

#### 3.1.11 Digital Products — 2 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 74 | DigitalAsset | Downloadable files/media | digital_asset |
| 75 | LicenseKey | Software license keys | license_key |

#### 3.1.12 Auction & Bidding — 5 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 76 | Auction | Auction event (timed, reverse, Dutch, sealed) | auction |
| 77 | AuctionLot | Individual lot/item in an auction | auction_lot |
| 78 | AuctionBid | Individual bid submission | auction_bid |
| 79 | AuctionWatchlist | User-saved auctions to follow | auction_watchlist |
| 80 | AuctionResult | Final outcome (winner, price, settlement) | auction_result |

#### 3.1.13 Rental & Leasing — 5 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 81 | RentalProduct | Products/assets available for rent | rental_product |
| 82 | RentalAgreement | Active rental contract (dates, terms, deposit) | rental_agreement |
| 83 | RentalPeriod | Individual rental period (extension, early return) | rental_period |
| 84 | RentalReturn | Return inspection and deposit reconciliation | rental_return |
| 85 | RentalDamageReport | Damage assessment and charges | rental_damage_report |

#### 3.1.14 Restaurant & Food Commerce — 7 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 86 | Restaurant | Restaurant/kitchen profile (hours, cuisine, rating) | restaurant |
| 87 | Menu | Active menu per restaurant (breakfast, lunch, dinner) | menu |
| 88 | MenuItem | Individual dish with modifiers/add-ons | menu_item |
| 89 | MenuModifier | Add-on options (extra cheese, size upgrades) | menu_modifier |
| 90 | TableReservation | Dine-in table booking (party size, time, deposit) | table_reservation |
| 91 | DineInOrder | In-restaurant order with table assignment | dine_in_order |
| 92 | KitchenOrder | Kitchen display system order queue | kitchen_order |

#### 3.1.15 Events & Ticketing — 6 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 93 | TicketedEvent | Ticketed event (concert, conference, match, fair) | ticketed_event |
| 94 | EventTicketType | Ticket tiers (VIP, general, early bird) | event_ticket_type |
| 95 | EventTicket | Individual issued ticket (barcode, seat, status) | event_ticket |
| 96 | EventRegistration | Registration for free/paid events | event_registration |
| 97 | SeatingChart | Venue seating layout and availability | seating_chart |
| 98 | EventSponsor | Event sponsor packages and deliverables | event_sponsor |

#### 3.1.16 Classified Ads & C2C — 5 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 99 | ClassifiedListing | User-posted listing (item, vehicle, service) | classified_listing |
| 100 | ClassifiedCategory | Classified ad taxonomy | classified_category |
| 101 | ClassifiedOffer | Buyer offer/counteroffer on a listing | classified_offer |
| 102 | ClassifiedMessage | Buyer-seller messaging thread | classified_message |
| 103 | ClassifiedReport | Flag/report inappropriate listings | classified_report |

#### 3.1.17 Affiliate & Influencer Marketing — 5 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 104 | AffiliateProgram | Program definition (commission %, cookie duration) | affiliate_program |
| 105 | AffiliatePartner | Approved affiliate/influencer profiles | affiliate_partner |
| 106 | AffiliateLink | Tracked referral links with UTM codes | affiliate_link |
| 107 | AffiliateCommission | Earned commission per referred sale | affiliate_commission |
| 108 | InfluencerCampaign | Paid influencer collaboration campaigns | influencer_campaign |

#### 3.1.18 Warranty & After-Sales — 5 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 109 | WarrantyPlan | Warranty/extended warranty plan definitions | warranty_plan |
| 110 | WarrantyRegistration | Customer product warranty activation | warranty_registration |
| 111 | WarrantyClaim | Warranty claim lifecycle (submitted→approved→resolved) | warranty_claim |
| 112 | ServiceContract | Annual maintenance / service level agreements | service_contract |
| 113 | RepairTicket | Repair/service request tracking | repair_ticket |

#### 3.1.19 Freelance & Gig Economy — 6 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 114 | FreelancerProfile | Freelancer portfolio, skills, rates, rating | freelancer_profile |
| 115 | GigListing | Posted job/project/task listing | gig_listing |
| 116 | GigProposal | Freelancer proposal with quote and timeline | gig_proposal |
| 117 | GigContract | Accepted proposal → active contract | gig_contract |
| 118 | GigMilestone | Milestone-based deliverables and payments | gig_milestone |
| 119 | GigReview | Client ↔ freelancer mutual reviews | gig_review |

#### 3.1.20 Travel & Hospitality — 7 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 120 | HotelProperty | Hotel/resort/hostel profile | hotel_property |
| 121 | HotelRoom | Room types (single, double, suite) with rates | hotel_room |
| 122 | HotelReservation | Room booking with check-in/check-out | hotel_reservation |
| 123 | TourPackage | Tour/experience package (itinerary, inclusions) | tour_package |
| 124 | TourBooking | Booked tour with participant details | tour_booking |
| 125 | TravelItinerary | Multi-stop itinerary planner | travel_itinerary |
| 126 | TransferService | Airport/station pickup and transfer bookings | transfer_service |

#### 3.1.21 Real Estate — 6 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 127 | Property | Property listing (sale/rent, residential/commercial) | property |
| 128 | PropertyUnit | Individual units in a building (apartment, office) | property_unit |
| 129 | LeaseAgreement | Active lease contract (tenant, terms, rent) | lease_agreement |
| 130 | PropertyInquiry | Buyer/tenant inquiry with agent assignment | property_inquiry |
| 131 | PropertyViewing | Scheduled property viewing/open house | property_viewing |
| 132 | PropertyTransaction | Purchase/sale transaction (offer→closing) | property_transaction |

#### 3.1.22 Membership & Loyalty Programs — 5 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 133 | MembershipPlan | Plan tiers (bronze, silver, gold, platinum) | membership_plan |
| 134 | MembershipCard | Issued membership with validity period | membership_card |
| 135 | MemberBenefit | Benefits per tier (discounts, priority, access) | member_benefit |
| 136 | MembershipTransaction | Membership purchase/renewal/upgrade records | membership_transaction |
| 137 | LoyaltyTier | Points-based tier progression rules | loyalty_tier |

#### 3.1.23 Crowdfunding & Community Investment — 5 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 138 | CrowdfundCampaign | Fundraising campaign (goal, deadline, type) | crowdfund_campaign |
| 139 | CampaignPledge | Individual pledge/contribution | campaign_pledge |
| 140 | CampaignReward | Backer reward tiers and fulfillment | campaign_reward |
| 141 | CampaignUpdate | Creator updates to backers | campaign_update |
| 142 | CampaignMilestone | Stretch goals and milestones | campaign_milestone |

#### 3.1.24 Social Commerce & Live Selling — 5 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 143 | LiveSaleSession | Live-stream selling event (start, host, products) | live_sale_session |
| 144 | LiveSaleItem | Products featured during live session | live_sale_item |
| 145 | LiveSaleBid | Real-time bids during live sale | live_sale_bid |
| 146 | SocialShareReward | Rewards for social sharing/referrals | social_share_reward |
| 147 | UserGeneratedReview | Photo/video reviews from customers | user_generated_review |

#### 3.1.25 Grocery & Fresh Commerce — 4 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 148 | FreshProductProfile | Perishable product metadata (shelf life, storage) | fresh_product_profile |
| 149 | GroceryList | Saved/recurring shopping lists | grocery_list |
| 150 | RecipeKit | Meal kit with linked ingredients and instructions | recipe_kit |
| 151 | SubstitutionRule | Auto-substitution rules for out-of-stock items | substitution_rule |

#### 3.1.26 Automotive Commerce — 5 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 152 | VehicleListing | Vehicle sale listing (make, model, year, mileage) | vehicle_listing |
| 153 | VehiclePart | Auto parts catalog with compatibility | vehicle_part |
| 154 | VehicleServiceAppointment | Workshop/service center booking | vehicle_service_appointment |
| 155 | VehicleInspection | Pre-sale inspection report | vehicle_inspection |
| 156 | TradeInOffer | Vehicle trade-in valuation and offer | trade_in_offer |

#### 3.1.27 Healthcare Commerce — 7 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 157 | HealthcareProvider | Doctor/clinic/hospital profile | healthcare_provider |
| 158 | MedicalAppointment | Patient appointment booking | medical_appointment |
| 159 | Prescription | Doctor-issued prescription | prescription |
| 160 | PrescriptionItem | Individual medication in a prescription | prescription_item |
| 161 | PharmacyOrder | Prescription fulfillment order | pharmacy_order |
| 162 | TelemedicineSession | Virtual consultation session (video/chat) | telemedicine_session |
| 163 | LabTestBooking | Diagnostic lab test booking | lab_test_booking |

#### 3.1.28 Education & Training Commerce — 6 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 164 | Course | Course/workshop/training program | course |
| 165 | CourseModule | Sections/chapters within a course | course_module |
| 166 | CourseEnrollment | Student enrollment with progress tracking | course_enrollment |
| 167 | Assignment | Student assignments/quizzes/exams | assignment |
| 168 | TutoringSession | 1-on-1 tutoring session booking | tutoring_session |
| 169 | AcademicCertificate | Completion certificate issuance | academic_certificate |

#### 3.1.29 Charity & Donations — 4 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 170 | DonationCampaign | Fundraising campaign (cause, goal, deadline) | donation_campaign |
| 171 | Donation | Individual donation transaction | donation |
| 172 | NonProfitOrg | Registered non-profit organization profile | non_profit_org |
| 173 | DonorProfile | Recurring donor profile and preferences | donor_profile |

#### 3.1.30 Financial Products & Services — 5 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 174 | LoanApplication | Consumer/business loan application | loan_application |
| 175 | FinancingPlan | Product financing (0% APR, payment plans) | financing_plan |
| 176 | InsuranceProduct | Insurance product listings (travel, product, health) | insurance_product |
| 177 | InsuranceQuote | Customer insurance quotation | insurance_quote |
| 178 | MicrofinanceAccount | Microfinance/community lending account | microfinance_account |

#### 3.1.31 Advertising & Sponsored Listings — 5 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 179 | AdCampaign | Advertiser campaign (budget, targeting, schedule) | ad_campaign |
| 180 | AdPlacement | Ad slot on storefront (banner, sidebar, search) | ad_placement |
| 181 | AdCreative | Ad visual/copy assets | ad_creative |
| 182 | AdImpression | Impression/click/conversion tracking | ad_impression |
| 183 | SponsoredProduct | Promoted product placement in search/category | sponsored_product |

#### 3.1.32 Parking & Urban Transport — 4 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 184 | ParkingFacility | Parking garage/lot profile (capacity, rates) | parking_facility |
| 185 | ParkingSpot | Individual spot (type, floor, EV charging) | parking_spot |
| 186 | ParkingReservation | Reserved parking booking with QR entry | parking_reservation |
| 187 | RideRequest | Ride-hailing/shuttle booking | ride_request |

#### 3.1.33 Utilities & Bill Payment — 4 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 188 | UtilityProvider | Utility company profile (electricity, water, gas, internet) | utility_provider |
| 189 | UtilityAccount | Customer utility account linking | utility_account |
| 190 | UtilityBill | Bill statement with amount and due date | utility_bill |
| 191 | UtilityPayment | Bill payment transaction record | utility_payment |

#### 3.1.34 Government & Municipal Services — 5 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 192 | MunicipalService | City service catalog (permits, registrations) | municipal_service |
| 193 | ServiceApplication | Citizen application for a municipal service | service_application |
| 194 | PermitApplication | Permit request lifecycle (applied→reviewing→issued) | permit_application |
| 195 | FineRecord | Issued fine/penalty with payment status | fine_record |
| 196 | PublicConsultation | Public feedback/voting on city proposals | public_consultation |

#### 3.1.35 Pet Services — 4 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 197 | PetProfile | Pet record (species, breed, vaccinations, owner) | pet_profile |
| 198 | PetServiceListing | Pet service (grooming, boarding, walking, vet) | pet_service_listing |
| 199 | PetServiceBooking | Booked pet service appointment | pet_service_booking |
| 200 | PetProductSubscription | Recurring pet food/supply subscription box | pet_product_subscription |

#### 3.1.36 Fitness & Wellness — 5 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 201 | FitnessCenter | Gym/studio/wellness center profile | fitness_center |
| 202 | FitnessClass | Class schedule (yoga, HIIT, swimming, personal training) | fitness_class |
| 203 | ClassEnrollment | Member class registration/waitlist | class_enrollment |
| 204 | GymMembership | Active gym membership with check-in tracking | gym_membership |
| 205 | WellnessPackage | Spa/wellness service bundles | wellness_package |

#### 3.1.37 Legal & Professional Services — 4 models

| # | Model | Description | DB Table |
|---|-------|-------------|----------|
| 206 | ProfessionalProfile | Lawyer/accountant/consultant profile | professional_profile |
| 207 | ConsultationBooking | Professional consultation session | consultation_booking |
| 208 | DocumentService | Legal document preparation/notarization | document_service |
| 209 | RetainerAgreement | Ongoing retainer contract with billing | retainer_agreement |

---

### 3.2 ERPNext — Back-Office ERP (~55 models)

#### 3.2.1 Accounting & Finance — 8 models

| # | Model (ERPNext DocType) | Description |
|---|------------------------|-------------|
| 1 | Chart of Accounts | Account structure |
| 2 | Journal Entry | Double-entry bookkeeping |
| 3 | General Ledger Entry | Ledger records |
| 4 | Accounts Receivable | Customer outstanding amounts |
| 5 | Accounts Payable | Vendor/supplier outstanding |
| 6 | Bank Reconciliation | Bank statement matching |
| 7 | Credit Note | Store credits issued |
| 8 | Debit Note | Debit adjustments |

#### 3.2.2 Tax & Compliance — 5 models

| # | Model (ERPNext DocType) | Description |
|---|------------------------|-------------|
| 9 | Tax Rate | Tax rates per region/product type |
| 10 | Tax Zone | Geographic tax jurisdictions |
| 11 | Tax Report | Generated tax filing reports |
| 12 | Compliance Certificate | Business licenses, health permits |
| 13 | Data Retention Policy | GDPR/data retention rules per zone |

#### 3.2.3 Inventory & Stock — 7 models

| # | Model (ERPNext DocType) | Description |
|---|------------------------|-------------|
| 14 | Warehouse (InventoryLocation) | Stock locations |
| 15 | Bin (InventoryLevel) | Stock quantity per location per item |
| 16 | Stock Entry (InventoryMovement) | Stock transfers/adjustments/receipts |
| 17 | Stock Reservation Entry | Reserved inventory for orders |
| 18 | Stock Alert (InventoryAlert) | Low/overstock notifications |
| 19 | Batch | Batch/lot tracking for perishables |
| 20 | Supplier Quotation (SupplierCatalog) | Supplier product listings and costs |

#### 3.2.4 Procurement & Suppliers — 3 models

| # | Model (ERPNext DocType) | Description |
|---|------------------------|-------------|
| 21 | Supplier | Supplier management |
| 22 | Purchase Receipt | Goods received notes |
| 23 | Settlement Report | Periodic vendor settlement reports |

#### 3.2.5 HR & Payroll — 4 models

| # | Model (ERPNext DocType) | Description |
|---|------------------------|-------------|
| 24 | Employee | Employee records |
| 25 | Payroll Entry | Salary processing |
| 26 | Leave Application | Leave management |
| 27 | Attendance | Employee attendance tracking |

#### 3.2.6 Asset Management — 3 models

| # | Model (ERPNext DocType) | Description |
|---|------------------------|-------------|
| 28 | Asset (FixedAsset) | City/company asset register |
| 29 | Asset Maintenance | Maintenance schedules |
| 30 | Asset Depreciation | Depreciation calculations |

#### 3.2.7 Insurance — 3 models

| # | Model (ERPNext DocType) | Description |
|---|------------------------|-------------|
| 31 | Insurance Policy | Business/asset insurance |
| 32 | Insurance Claim | Claim processing |
| 33 | Insurance Premium | Premium payment schedules |

#### 3.2.8 Budgets — 2 models

| # | Model (ERPNext DocType) | Description |
|---|------------------------|-------------|
| 34 | Budget Allocation | Department/project budgets |
| 35 | Cost Center | Cost center tracking |

#### 3.2.9 Rental & Leasing Accounting — 3 models

| # | Model (ERPNext DocType) | Description |
|---|------------------------|-------------|
| 36 | Rental Revenue Schedule | Recognized rental income over lease term |
| 37 | Security Deposit Ledger | Refundable deposit tracking per rental |
| 38 | Depreciation Schedule (Rental Assets) | Rental asset depreciation tracking |

#### 3.2.10 Real Estate Finance — 3 models

| # | Model (ERPNext DocType) | Description |
|---|------------------------|-------------|
| 39 | Property Asset Register | Owned/managed property valuation |
| 40 | Rental Income Statement | Periodic rental income reporting |
| 41 | Property Expense Ledger | Maintenance, tax, HOA expense tracking |

#### 3.2.11 Financial Products & Lending — 3 models

| # | Model (ERPNext DocType) | Description |
|---|------------------------|-------------|
| 42 | Loan Ledger | Principal + interest tracking per loan |
| 43 | Loan Repayment Schedule | Amortization schedule |
| 44 | Provision for Bad Debts | Loan default provisions |

#### 3.2.12 Healthcare & Pharmacy Inventory — 2 models

| # | Model (ERPNext DocType) | Description |
|---|------------------------|-------------|
| 45 | Medical Supply Inventory | Pharmaceutical and medical supply stock |
| 46 | Controlled Substance Log | Regulated medication dispensing log |

#### 3.2.13 Government & Municipal Finance — 3 models

| # | Model (ERPNext DocType) | Description |
|---|------------------------|-------------|
| 47 | Fee & Fine Revenue | Government fee/fine revenue tracking |
| 48 | Permit Revenue | Permit issuance revenue tracking |
| 49 | Subsidy & Grant Disbursement | Government subsidy/grant tracking |

#### 3.2.14 Crowdfunding & Donations Finance — 2 models

| # | Model (ERPNext DocType) | Description |
|---|------------------------|-------------|
| 50 | Donation Revenue | Donation income categorization and receipts |
| 51 | Campaign Fund Accounting | Crowdfund campaign escrow and disbursement |

#### 3.2.15 Advertising Revenue — 2 models

| # | Model (ERPNext DocType) | Description |
|---|------------------------|-------------|
| 52 | Ad Revenue Recognition | Advertiser billing and revenue recognition |
| 53 | Media Spend Report | Cross-campaign spend and ROI reporting |

#### 3.2.16 Automotive & Vehicle Assets — 2 models

| # | Model (ERPNext DocType) | Description |
|---|------------------------|-------------|
| 54 | Vehicle Asset Register | Owned vehicle fleet valuation |
| 55 | Vehicle Maintenance Cost Center | Workshop labor and parts cost tracking |

---

### 3.3 Fleetbase — Logistics & Fulfillment (~32 models)

| # | Model (Fleetbase Resource) | Description |
|---|---------------------------|-------------|
| 1 | Service Area (DeliveryZone) | Geographic delivery boundaries, pricing per zone |
| 2 | Delivery Slot | Schedulable time windows for delivery |
| 3 | Order (DeliveryOrder) | Delivery order lifecycle (pickup → transit → delivered) |
| 4 | Tracking Status (DeliveryTracking) | Real-time GPS tracking events |
| 5 | Driver (CourierProvider) | Driver profiles, credentials, ratings |
| 6 | Fleet | Vehicle fleet groups |
| 7 | Vehicle | Individual vehicle records, maintenance status |
| 8 | Route | Optimized delivery routes |
| 9 | Waypoint (RouteWaypoint) | Individual stops on a route |
| 10 | Payload (ShipmentPackage) | Package dimensions, weight, labels |
| 11 | Return Shipment | Reverse logistics tracking |
| 12 | Warehouse (WarehouseLocation) | Fulfillment center profiles |
| 13 | Warehouse Zone | Zones within a warehouse (cold, fragile, etc.) |
| 14 | Pick List | Order picking assignments |
| 15 | Packing Slip | Packing instructions per shipment |
| 16 | Proof of Delivery | Delivery confirmation (photo, signature, code) |
| 17 | Service Rate | Delivery rate calculations |
| 18 | Fuel Log | Fleet fuel consumption tracking |
| 19 | Driver Schedule | Driver shift management |
| 20 | Last Mile Config | Last-mile delivery rules per zone |
| 21 | Cold Chain Tracker | Temperature/humidity monitoring for perishables |
| 22 | Temperature Log | Time-series temperature readings per shipment |
| 23 | Food Delivery Config | Restaurant-specific delivery rules (hot bags, time limits) |
| 24 | Kitchen Dispatch | Timed kitchen-to-driver handoff coordination |
| 25 | Airport Transfer Route | Airport pickup/dropoff optimized routes |
| 26 | Luggage Tracking | Travel luggage pickup and delivery tracking |
| 27 | Moving Order | Residential/commercial relocation job |
| 28 | Moving Inventory | Item-level inventory for moving jobs |
| 29 | Parking Lot Map | Geospatial parking facility layout for navigation |
| 30 | Shuttle Route | Fixed-route shuttle/bus scheduling |
| 31 | Ride Assignment | On-demand ride driver-passenger matching |
| 32 | Pharmacy Delivery | Regulated prescription delivery with chain-of-custody |

---

### 3.4 Walt.id — Identity & Credentials (~25 models)

| # | Model (Walt.id Resource) | Description |
|---|-------------------------|-------------|
| 1 | Decentralized Identity (DID) | W3C DID documents for users/orgs |
| 2 | Verifiable Credential (VC) | Issued W3C Verifiable Credentials |
| 3 | Credential Schema | Templates defining credential structure |
| 4 | Credential Issuance Record | Log of who issued what to whom |
| 5 | Credential Verification Log | Verification attempts and results |
| 6 | Identity Wallet | User's digital credential wallet |
| 7 | KYC Verification | KYC process state machine |
| 8 | KYC Document | Uploaded identity documents |
| 9 | Access Policy | Credential-based access control rules |
| 10 | Municipal Permit | Digitally-signed city permits |
| 11 | Business License | Verifiable business operating licenses |
| 12 | Professional Certification | Professional credentials (healthcare, legal) |
| 13 | Age Verification | Age-gated commerce verification |
| 14 | Residency Proof | Zone-based residency verification |
| 15 | Consent Record | GDPR/privacy consent tracking |
| 16 | Medical License | Healthcare practitioner license verification |
| 17 | Patient Identity | Verified patient identity for healthcare |
| 18 | Academic Credential | University degree, diploma, certification |
| 19 | Bar Association Credential | Legal practitioner verification |
| 20 | Citizen Identity | Municipal citizen ID for government services |
| 21 | Vehicle Ownership Proof | Verifiable vehicle registration/title |
| 22 | Property Ownership Credential | Verifiable real estate deed/title |
| 23 | Food Safety Certificate | Restaurant health and safety certification |
| 24 | Driver Background Check | Background check for ride/delivery drivers |
| 25 | Freelancer Verification | Skills and portfolio credential for gig workers |

---

### 3.5 Payment Gateways (Stripe / Tap / HyperPay) (~25 models)

| # | Model (Gateway Resource) | Description | Primary Gateway |
|---|-------------------------|-------------|-----------------|
| 1 | Payment Intent | Payment initiation and lifecycle | Stripe/Tap/HyperPay |
| 2 | Payment Method | Stored cards, bank accounts, wallets | Stripe/Tap |
| 3 | Payment Transaction | Completed transaction records | All |
| 4 | Refund | Refund processing and tracking | All |
| 5 | Dispute (Chargeback) | Dispute/chargeback cases | Stripe/Tap |
| 6 | Dispute Evidence | Evidence uploaded for disputes | Stripe |
| 7 | Escrow Hold | Held funds for marketplace | Stripe Connect |
| 8 | Escrow Release | Release events for held funds | Stripe Connect |
| 9 | Connected Account | Vendor payment accounts | Stripe Connect |
| 10 | Transfer (Payment Split) | Split payments to vendors | Stripe Connect |
| 11 | Wallet | Digital wallet balances | Tap/Custom |
| 12 | Wallet Transaction | Wallet top-ups, debits, transfers | Tap/Custom |
| 13 | Installment Plan (BNPL) | Buy-now-pay-later plan setup | Tap/Tamara |
| 14 | Installment Payment | Individual installment records | Tap/Tamara |
| 15 | Loyalty Points & Transactions | Points earning and redemption | Custom |
| 16 | Bid Deposit (Auction) | Refundable auction bid security deposit | Stripe/Tap |
| 17 | Rental Security Deposit | Held rental deposit with conditional release | Stripe/Tap |
| 18 | Crowdfunding Pledge Hold | Pledged funds held until campaign goal met | Stripe |
| 19 | Donation Receipt | Tax-deductible donation receipt generation | Stripe/Tap |
| 20 | Tip / Gratuity | Service tip collection and distribution | Stripe/Tap |
| 21 | Split Billing | Multi-party bill splitting (restaurants, group orders) | Stripe |
| 22 | Recurring Bill Payment | Automated utility/subscription bill payment | Stripe/Tap |
| 23 | Loan Disbursement | Loan payout to borrower account | Stripe Connect |
| 24 | Insurance Payout | Insurance claim payout processing | Stripe Connect |
| 25 | Micropayment | Sub-dollar content/service micropayments | Stripe/Custom |

---

### 3.6 PayloadCMS — Content, Configuration & Master Data (~40 models)

#### 3.6.1 Core Content — 8 models

| # | Collection/Global | Description |
|---|-------------------|-------------|
| 1 | Page | CMS pages with block-based layout |
| 2 | Blog Post | Blog/news articles |
| 3 | Media | Images, videos, documents |
| 4 | Navigation | Site navigation menus |
| 5 | Menu Item | Individual menu entries |
| 6 | Content Block | Reusable content components |
| 7 | Taxonomy / Tag | Content classification tags |
| 8 | Redirect | URL redirect rules |

#### 3.6.2 Marketing & Communication — 6 models

| # | Collection/Global | Description |
|---|-------------------|-------------|
| 9 | Banner / HeroBanner | Marketing banners with scheduling |
| 10 | Announcement | Platform-wide announcements |
| 11 | Email Template | Transactional email templates (localized) |
| 12 | SMS Template | SMS notification templates |
| 13 | Push Template | Push notification templates |
| 14 | FAQ | Frequently asked questions |

#### 3.6.3 Tenant & Storefront Config — 4 models

| # | Collection/Global | Description |
|---|-------------------|-------------|
| 15 | Storefront Theme | Tenant branding, colors, fonts, logos |
| 16 | SEO Metadata | Per-page/collection SEO configuration |
| 17 | Localized Content | Multi-language content variants (en/fr/ar) |
| 18 | Site Settings (Global) | Global site configuration |

#### 3.6.4 City-Specific Content — 4 models

| # | Collection/Global | Description |
|---|-------------------|-------------|
| 19 | City Event | Public events, festivals, conferences |
| 20 | City Service | Municipal service listings |
| 21 | Venue Profile | Venue/restaurant/facility pages |
| 22 | Property Listing | Real estate listing content |

#### 3.6.5 Interactive Content — 3 models

| # | Collection/Global | Description |
|---|-------------------|-------------|
| 23 | Form Builder | Dynamic form definitions |
| 24 | Form Submission | Form response records |
| 25 | Course Content | Educational/training content |

#### 3.6.6 Events & Entertainment Content — 3 models

| # | Collection/Global | Description |
|---|-------------------|-------------|
| 26 | Event Page | Rich event detail pages with galleries, speakers, schedules |
| 27 | Event Gallery | Photo/video galleries for past events |
| 28 | Speaker / Performer Profile | Bios for event speakers, performers, panelists |

#### 3.6.7 Education & Knowledge Content — 3 models

| # | Collection/Global | Description |
|---|-------------------|-------------|
| 29 | Course Catalog Page | Marketing pages for courses and programs |
| 30 | Learning Path | Curated sequences of courses/certifications |
| 31 | Knowledge Base Article | Help center / documentation articles |

#### 3.6.8 Social & Community Content — 3 models

| # | Collection/Global | Description |
|---|-------------------|-------------|
| 32 | Influencer Profile Page | Public influencer/affiliate profile pages |
| 33 | Community Forum | Discussion forum structure and moderation |
| 34 | User Generated Content Gallery | Curated UGC photo/video galleries |

#### 3.6.9 Advertising & Sponsorship Content — 3 models

| # | Collection/Global | Description |
|---|-------------------|-------------|
| 35 | Ad Template | Creative templates for self-serve advertisers |
| 36 | Sponsored Content Page | Native advertising / sponsored articles |
| 37 | Media Kit | Downloadable media kits for advertisers |

#### 3.6.10 City & Neighborhood Content — 3 models

| # | Collection/Global | Description |
|---|-------------------|-------------|
| 38 | City Guide | Neighborhood/district guide pages |
| 39 | Service Directory | Categorized local service provider directory |
| 40 | Public Notice Board | Government/municipal public notices |

---

### 3.7 Shared / Synced Models (~10 models) — PayloadCMS = Master System

PayloadCMS is the **master system** (single source of truth) for all shared/synced models. Changes are authored in PayloadCMS and propagated to all other systems via Temporal sync workflows. Other systems hold read replicas of this data and must not modify it directly.

| # | Model | Master System | Synced To | Sync Direction | Temporal Workflow Trigger |
|---|-------|--------------|-----------|----------------|--------------------------|
| 1 | Node (5-level hierarchy) | PayloadCMS | Medusa, ERPNext, Fleetbase | PayloadCMS → Others | node.created / node.updated |
| 2 | GovernanceAuthority | PayloadCMS | Medusa, ERPNext | PayloadCMS → Others | governance.updated |
| 3 | Persona | PayloadCMS | Medusa | PayloadCMS → Medusa | persona.created |
| 4 | PersonaAssignment | PayloadCMS | Medusa | PayloadCMS → Medusa | persona.assigned |
| 5 | EventOutbox | PayloadCMS | All (event bus) | PayloadCMS → All | Every domain event routing |
| 6 | AuditLog | PayloadCMS | ERPNext | PayloadCMS → ERPNext | All auditable actions (aggregated) |
| 7 | SalesChannelMapping | PayloadCMS | Medusa, Fleetbase | PayloadCMS → Others | channel.mapped |
| 8 | RegionZoneMapping | PayloadCMS | Medusa, ERPNext, Fleetbase, Walt.id | PayloadCMS → Others | region.mapped |
| 9 | Translation | PayloadCMS | Medusa | PayloadCMS → Medusa | translation.updated |
| 10 | CityosStore | PayloadCMS | Medusa, ERPNext | PayloadCMS → Others | store.updated |

> **Sync Rule:** All changes to shared models originate in PayloadCMS. Temporal workflows detect changes via PayloadCMS webhooks/events and push updates to target systems. If a target system needs to reference a shared model, it reads from its local synced copy (never calls PayloadCMS directly at runtime).

---

## 4. Temporal Workflow System

### 4.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     TEMPORAL SERVER                              │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │  Task Queue  │  │  Task Queue  │  │  Task Queue  │           │
│  │  medusa-     │  │  erpnext-    │  │  fleetbase-  │           │
│  │  commerce    │  │  backoffice  │  │  logistics   │           │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘            │
│         │                │                │                     │
│  ┌──────┴──────┐  ┌──────┴──────┐  ┌──────┴──────┐            │
│  │  Task Queue  │  │  Task Queue  │  │  Task Queue  │           │
│  │  waltid-     │  │  payment-    │  │  payload-    │           │
│  │  identity    │  │  gateway     │  │  content     │           │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                 │
│  Workflow History │ Timers │ Signals │ Queries │ Schedules      │
└─────────────────────────────────────────────────────────────────┘

Workers per system:
  - medusa-commerce-worker    → Activities that call Medusa APIs
  - erpnext-backoffice-worker → Activities that call ERPNext APIs
  - fleetbase-logistics-worker→ Activities that call Fleetbase APIs
  - waltid-identity-worker    → Activities that call Walt.id APIs
  - payment-gateway-worker    → Activities that call Stripe/Tap/HyperPay APIs
  - payload-content-worker    → Activities that call PayloadCMS APIs
```

### 4.2 Design Principles

1. **Workflow as saga coordinator:** Each workflow orchestrates activities across multiple systems. If any step fails, compensation activities run to undo previous steps.

2. **Idempotency keys:** Every activity call carries an idempotency key derived from `{workflow_id}_{activity_name}_{attempt}`.

3. **Correlation IDs:** All workflows propagate `correlation_id` and `causation_id` from the originating EventOutbox entry.

4. **Tenant isolation:** All workflow IDs are prefixed with `tenant:{tenant_id}:` to prevent cross-tenant interference.

5. **Retry policies (defaults):**

```typescript
const DEFAULT_RETRY_POLICY = {
  initialInterval: '1s',
  backoffCoefficient: 2.0,
  maximumInterval: '5m',
  maximumAttempts: 5,
  nonRetryableErrorTypes: [
    'InvalidArgumentError',
    'InsufficientFundsError',
    'CredentialVerificationFailedError',
    'FraudDetectedError',
  ],
}
```

6. **Timeouts:**

```typescript
const DEFAULT_TIMEOUTS = {
  workflowExecutionTimeout: '24h',     // max total workflow time
  workflowRunTimeout: '1h',            // max single run (before continue-as-new)
  defaultActivityTimeout: '30s',        // default per activity
  paymentActivityTimeout: '2m',         // payment gateway calls
  fulfillmentActivityTimeout: '5m',     // logistics calls
  identityVerificationTimeout: '48h',   // KYC can take days (uses timer)
}
```

7. **Versioning:** All workflows use Temporal's patching API for backward-compatible changes.

8. **Observability:** Every workflow emits:
   - Start/complete/fail metrics to Prometheus
   - Structured logs with correlation_id
   - AuditLog entry via Medusa EventOutbox activity

---

### 4.3 Workflow Catalog

#### 4.3.1 ORDER LIFECYCLE WORKFLOWS

---

##### WF-001: OrderPlacementWorkflow

**Trigger:** `order.placed` event from Medusa EventOutbox
**Task Queue:** `medusa-commerce`
**Estimated Duration:** 30s–2m

```typescript
interface OrderPlacementPayload {
  workflow_id: string                    // "tenant:{tenant_id}:order:{order_id}"
  correlation_id: string
  tenant_id: string
  order_id: string
  customer_id: string
  vendor_orders: {
    vendor_id: string
    vendor_order_id: string
    items: {
      line_item_id: string
      product_id: string
      variant_id: string
      quantity: number
      unit_price: number
    }[]
    subtotal: number
    commission_rate: number
  }[]
  payment: {
    payment_intent_id: string
    gateway: 'stripe' | 'tap' | 'hyperpay'
    amount: number
    currency_code: string
  }
  shipping_address: {
    address_1: string
    city: string
    province: string
    postal_code: string
    country_code: string
    lat?: number
    lng?: number
  }
  requires_identity_verification: boolean
  is_b2b: boolean
  company_id?: string
  purchase_order_id?: string
}
```

**Steps:**

| Step | Activity | System | Compensating Activity |
|------|----------|--------|----------------------|
| 1 | capturePayment | Payment Gateway | refundPayment |
| 2 | verifyIdentity (if required) | Walt.id | — |
| 3 | reserveInventory | ERPNext | releaseInventory |
| 4 | calculateCommissions | Medusa | reverseCommissions |
| 5 | createDeliveryOrder | Fleetbase | cancelDeliveryOrder |
| 6 | createAccountingEntries | ERPNext | reverseAccountingEntries |
| 7 | sendOrderConfirmation | PayloadCMS (template) | — |
| 8 | recordAuditLog | Medusa | — |

**Signals:**
- `payment.captured` — payment gateway webhook confirmation
- `inventory.reserved` — ERPNext stock reservation confirmation
- `delivery.created` — Fleetbase delivery creation confirmation

**Queries:**
- `getOrderStatus()` → returns current step and status
- `getPaymentStatus()` → returns payment capture state

---

##### WF-002: OrderFulfillmentWorkflow

**Trigger:** `order.fulfillment_started` OR Fleetbase `delivery.status_changed`
**Task Queue:** `fleetbase-logistics`
**Estimated Duration:** Minutes to days

```typescript
interface OrderFulfillmentPayload {
  workflow_id: string
  correlation_id: string
  tenant_id: string
  order_id: string
  vendor_order_id: string
  vendor_id: string
  delivery_order_id: string           // Fleetbase delivery ID
  items: {
    line_item_id: string
    sku: string
    quantity: number
    warehouse_id: string
  }[]
  shipping_method: 'standard' | 'express' | 'same_day' | 'pickup'
  delivery_zone_id: string
  delivery_slot?: {
    date: string                      // ISO date
    window_start: string              // "09:00"
    window_end: string                // "12:00"
  }
  recipient: {
    name: string
    phone: string
    address: object
    lat: number
    lng: number
  }
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | generatePickList | Fleetbase |
| 2 | assignDriver | Fleetbase |
| 3 | optimizeRoute | Fleetbase |
| 4 | awaitPickup (signal) | Fleetbase |
| 5 | trackDelivery (polling/signal) | Fleetbase |
| 6 | awaitDeliveryProof (signal) | Fleetbase |
| 7 | confirmDelivery | Medusa |
| 8 | updateInventoryDeducted | ERPNext |
| 9 | triggerVendorPayout (timer: T+7 days) | Medusa |

**Signals:**
- `driver.assigned` — driver accepted the job
- `pickup.completed` — goods picked up
- `delivery.in_transit` — en route
- `delivery.completed` — delivered with proof
- `delivery.failed` — delivery attempt failed
- `delivery.returned` — returned to sender

---

##### WF-003: OrderCancellationWorkflow

**Trigger:** `order.cancel_requested`
**Task Queue:** `medusa-commerce`

```typescript
interface OrderCancellationPayload {
  workflow_id: string
  correlation_id: string
  tenant_id: string
  order_id: string
  vendor_order_ids: string[]
  reason: string
  requested_by: string                // customer_id or admin user_id
  refund_amount: number
  currency_code: string
  payment_intent_id: string
  gateway: string
  delivery_order_id?: string          // if already in fulfillment
  has_inventory_reserved: boolean
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | cancelDeliveryOrder (if exists) | Fleetbase |
| 2 | releaseInventory | ERPNext |
| 3 | reverseCommissions | Medusa |
| 4 | processRefund | Payment Gateway |
| 5 | reverseAccountingEntries | ERPNext |
| 6 | updateOrderStatus | Medusa |
| 7 | sendCancellationNotification | PayloadCMS |
| 8 | recordAuditLog | Medusa |

---

##### WF-004: ReturnAndRefundWorkflow

**Trigger:** `return.requested`
**Task Queue:** `medusa-commerce`

```typescript
interface ReturnRefundPayload {
  workflow_id: string
  correlation_id: string
  tenant_id: string
  order_id: string
  return_id: string
  customer_id: string
  items: {
    line_item_id: string
    quantity: number
    reason: string
    condition: 'unopened' | 'opened' | 'damaged' | 'defective'
  }[]
  return_method: 'pickup' | 'drop_off' | 'mail'
  refund_method: 'original_payment' | 'store_credit' | 'exchange'
  original_payment_intent_id: string
  gateway: string
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | validateReturnEligibility | Medusa |
| 2 | createReturnShipment | Fleetbase |
| 3 | awaitReturnReceipt (signal) | Fleetbase |
| 4 | inspectReturnItems | ERPNext |
| 5 | processRefund OR issueCreditNote | Payment Gateway / ERPNext |
| 6 | restockItems (if applicable) | ERPNext |
| 7 | reverseCommissions (partial) | Medusa |
| 8 | sendRefundConfirmation | PayloadCMS |
| 9 | recordAuditLog | Medusa |

---

##### WF-005: OrderDisputeWorkflow

**Trigger:** `dispute.opened` (payment gateway webhook)
**Task Queue:** `payment-gateway`

```typescript
interface OrderDisputePayload {
  workflow_id: string
  correlation_id: string
  tenant_id: string
  order_id: string
  dispute_id: string                  // gateway dispute ID
  gateway: string
  amount: number
  currency_code: string
  reason: string
  evidence_due_by: string             // ISO datetime
  vendor_id?: string
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | freezePayoutForVendor | Medusa |
| 2 | gatherOrderEvidence | Medusa |
| 3 | gatherDeliveryEvidence | Fleetbase |
| 4 | submitDisputeEvidence | Payment Gateway |
| 5 | awaitDisputeResolution (signal, timer: evidence_due_by) | Payment Gateway |
| 6 | applyDisputeOutcome | Medusa, ERPNext |
| 7 | notifyVendor | PayloadCMS |
| 8 | recordAuditLog | Medusa |

---

##### WF-006: OrderSplitAndRoutingWorkflow

**Trigger:** `cart.completed` (multi-vendor cart)
**Task Queue:** `medusa-commerce`

```typescript
interface OrderSplitPayload {
  workflow_id: string
  correlation_id: string
  tenant_id: string
  order_id: string
  customer_id: string
  items_by_vendor: {
    vendor_id: string
    items: { variant_id: string; quantity: number; price: number }[]
    fulfillment_zone: string
    warehouse_id: string
  }[]
  total_amount: number
  payment_intent_id: string
  gateway: string
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | splitOrderByVendor | Medusa |
| 2 | calculateCommissionsPerVendor | Medusa |
| 3 | splitPayment | Payment Gateway |
| 4 | createVendorOrders | Medusa |
| 5 | createDeliveryOrdersPerVendor | Fleetbase |
| 6 | notifyVendors | PayloadCMS |

---

##### WF-007: NoShowCheckWorkflow

**Trigger:** Scheduled — runs every 15 minutes
**Task Queue:** `medusa-commerce`

```typescript
interface NoShowCheckPayload {
  workflow_id: string
  tenant_id: string
  check_window_minutes: number         // e.g., 30 minutes past booking time
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | findOverdueBookings | Medusa |
| 2 | markAsNoShow | Medusa |
| 3 | applyNoShowFee (if configured) | Payment Gateway |
| 4 | notifyCustomer | PayloadCMS |
| 5 | freeProviderSlot | Medusa |

---

##### WF-008: OrderReviewReminderWorkflow

**Trigger:** `delivery.completed` + timer (T+3 days)
**Task Queue:** `payload-content`

```typescript
interface ReviewReminderPayload {
  workflow_id: string
  tenant_id: string
  order_id: string
  customer_id: string
  customer_email: string
  products: { product_id: string; title: string; thumbnail?: string }[]
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | waitForReviewWindow (timer: 3 days) | Temporal |
| 2 | checkIfAlreadyReviewed | Medusa |
| 3 | sendReviewReminder | PayloadCMS |
| 4 | waitForSecondWindow (timer: 7 days) | Temporal |
| 5 | sendFinalReminder (if still no review) | PayloadCMS |

---

#### 4.3.2 PAYMENT & FINANCIAL WORKFLOWS

---

##### WF-009: PaymentCaptureWorkflow

**Trigger:** `checkout.completed`
**Task Queue:** `payment-gateway`

```typescript
interface PaymentCapturePayload {
  workflow_id: string
  correlation_id: string
  tenant_id: string
  order_id: string
  payment_intent_id: string
  gateway: 'stripe' | 'tap' | 'hyperpay'
  amount: number
  currency_code: string
  capture_method: 'immediate' | 'manual'
  customer_id: string
  vendor_splits?: {
    vendor_id: string
    connected_account_id: string
    amount: number
    commission_amount: number
  }[]
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | capturePaymentIntent | Payment Gateway |
| 2 | splitPaymentToVendors (if marketplace) | Payment Gateway |
| 3 | holdPlatformCommission | Payment Gateway |
| 4 | recordTransaction | Medusa |
| 5 | createAccountingEntry | ERPNext |
| 6 | recordAuditLog | Medusa |

---

##### WF-010: VendorPayoutWorkflow

**Trigger:** Scheduled (daily) OR `payout.requested`
**Task Queue:** `payment-gateway`

```typescript
interface VendorPayoutPayload {
  workflow_id: string
  correlation_id: string
  tenant_id: string
  payout_id: string
  vendor_id: string
  connected_account_id: string
  amount: number
  currency_code: string
  commission_transactions: string[]    // IDs of included transactions
  payout_method: 'bank_transfer' | 'stripe_connect' | 'wallet'
  settlement_period: string            // "2026-02-01 to 2026-02-07"
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | validatePayoutEligibility | Medusa |
| 2 | verifyVendorIdentity (if first payout) | Walt.id |
| 3 | calculateNetPayout | Medusa |
| 4 | initiateTransfer | Payment Gateway |
| 5 | awaitTransferCompletion (signal) | Payment Gateway |
| 6 | updatePayoutStatus | Medusa |
| 7 | createSettlementReport | ERPNext |
| 8 | notifyVendor | PayloadCMS |

---

##### WF-011: EscrowManagementWorkflow

**Trigger:** `order.placed` (marketplace with escrow)
**Task Queue:** `payment-gateway`

```typescript
interface EscrowPayload {
  workflow_id: string
  correlation_id: string
  tenant_id: string
  order_id: string
  vendor_order_id: string
  vendor_id: string
  amount: number
  currency_code: string
  escrow_period_days: number           // e.g., 7 days after delivery
  release_conditions: ('delivery_confirmed' | 'no_dispute' | 'review_period_passed')[]
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | holdFundsInEscrow | Payment Gateway |
| 2 | awaitDeliveryConfirmation (signal) | Fleetbase |
| 3 | startDisputeWindow (timer) | Temporal |
| 4 | checkForDisputes | Payment Gateway |
| 5 | releaseFunds OR holdForDispute | Payment Gateway |
| 6 | updatePayoutLedger | Medusa |
| 7 | createAccountingEntry | ERPNext |

---

##### WF-012: InstallmentPaymentWorkflow (BNPL)

**Trigger:** `order.placed` with installment plan
**Task Queue:** `payment-gateway`

```typescript
interface InstallmentPayload {
  workflow_id: string
  correlation_id: string
  tenant_id: string
  order_id: string
  customer_id: string
  plan: {
    total_amount: number
    currency_code: string
    num_installments: number
    interval: 'weekly' | 'biweekly' | 'monthly'
    first_payment_amount: number
    recurring_amount: number
    fees: number
  }
  payment_method_id: string
  gateway: string
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | chargeFirstInstallment | Payment Gateway |
| 2 | loop: scheduleNextInstallment (timer) | Temporal |
| 3 | chargeInstallment | Payment Gateway |
| 4 | handlePaymentFailure (retry 3x, then notify) | Payment Gateway, PayloadCMS |
| 5 | updateInstallmentStatus | Medusa |
| 6 | finalInstallmentComplete → closeplan | Medusa |

**Signals:**
- `installment.paid` — payment webhook
- `installment.failed` — payment failure
- `plan.cancelled` — early cancellation

---

##### WF-013: LoyaltyPointsWorkflow

**Trigger:** `order.completed`, `review.submitted`, `referral.converted`
**Task Queue:** `medusa-commerce`

```typescript
interface LoyaltyPointsPayload {
  workflow_id: string
  tenant_id: string
  customer_id: string
  trigger_event: 'purchase' | 'review' | 'referral' | 'birthday' | 'manual'
  order_id?: string
  amount_spent?: number
  currency_code?: string
  points_rule: {
    points_per_currency_unit: number
    bonus_multiplier: number
    max_points_per_transaction?: number
  }
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | calculatePointsEarned | Medusa |
| 2 | creditPoints | Payment Gateway (wallet) |
| 3 | updateCustomerTier (if threshold crossed) | Medusa |
| 4 | notifyCustomer | PayloadCMS |

---

##### WF-014: ReconciliationWorkflow

**Trigger:** Scheduled (daily at 02:00 UTC)
**Task Queue:** `erpnext-backoffice`

```typescript
interface ReconciliationPayload {
  workflow_id: string
  tenant_id: string
  date: string                         // ISO date to reconcile
  gateways: string[]                   // ['stripe', 'tap']
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | fetchGatewayTransactions | Payment Gateway |
| 2 | fetchMedusaTransactions | Medusa |
| 3 | compareAndFindDiscrepancies | ERPNext |
| 4 | createReconciliationReport | ERPNext |
| 5 | flagUnmatchedTransactions | ERPNext |
| 6 | notifyFinanceTeam (if discrepancies) | PayloadCMS |

---

##### WF-015: GiftCardWorkflow

**Trigger:** `gift_card.purchased` OR `gift_card.redeemed`
**Task Queue:** `medusa-commerce`

```typescript
interface GiftCardPayload {
  workflow_id: string
  tenant_id: string
  gift_card_id: string
  action: 'purchase' | 'redeem' | 'expire'
  amount: number
  currency_code: string
  customer_id: string
  recipient_email?: string
}
```

**Steps (purchase):**

| Step | Activity | System |
|------|----------|--------|
| 1 | generateGiftCardCode | Medusa |
| 2 | capturePayment | Payment Gateway |
| 3 | sendGiftCardEmail | PayloadCMS |
| 4 | createAccountingEntry | ERPNext |

---

#### 4.3.3 MARKETPLACE & VENDOR WORKFLOWS

---

##### WF-016: VendorOnboardingWorkflow

**Trigger:** `vendor.registration_submitted`
**Task Queue:** `medusa-commerce`
**Estimated Duration:** Minutes to days (KYC dependent)

```typescript
interface VendorOnboardingPayload {
  workflow_id: string
  correlation_id: string
  tenant_id: string
  vendor_id: string
  owner_user_id: string
  business_info: {
    legal_name: string
    trade_name: string
    tax_id: string
    business_type: 'sole_proprietor' | 'partnership' | 'corporation' | 'llc'
    country_code: string
    address: object
  }
  documents: {
    type: 'trade_license' | 'tax_certificate' | 'bank_statement' | 'id_document'
    file_url: string
  }[]
  bank_details: {
    account_holder: string
    iban?: string
    swift?: string
    account_number?: string
    bank_name: string
  }
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | createVendorRecord | Medusa |
| 2 | initiateKYC | Walt.id |
| 3 | verifyDocuments | Walt.id |
| 4 | awaitKYCApproval (signal, timer: 48h) | Walt.id |
| 5 | createConnectedPaymentAccount | Payment Gateway |
| 6 | issueBusinessCredential | Walt.id |
| 7 | createERPSupplierRecord | ERPNext |
| 8 | setDefaultCommissionRules | Medusa |
| 9 | createVendorStorefrontPage | PayloadCMS |
| 10 | activateVendor | Medusa |
| 11 | sendWelcomeKit | PayloadCMS |
| 12 | recordAuditLog | Medusa |

**Signals:**
- `kyc.approved` — KYC passed
- `kyc.rejected` — KYC failed (with reason)
- `kyc.additional_info_required` — need more documents
- `payment_account.verified` — bank account verified

---

##### WF-017: VendorPerformanceReviewWorkflow

**Trigger:** Scheduled (weekly, Sunday 00:00 UTC)
**Task Queue:** `medusa-commerce`

```typescript
interface VendorPerformancePayload {
  workflow_id: string
  tenant_id: string
  review_period: { start: string; end: string }
  vendor_ids: string[]                 // all active vendors
  thresholds: {
    min_order_fulfillment_rate: number  // e.g., 0.95
    max_cancellation_rate: number       // e.g., 0.05
    min_review_rating: number           // e.g., 3.5
    max_dispute_rate: number            // e.g., 0.02
    max_avg_fulfillment_hours: number   // e.g., 48
  }
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | aggregateOrderMetrics | Medusa |
| 2 | aggregateReviewMetrics | Medusa |
| 3 | aggregateDeliveryMetrics | Fleetbase |
| 4 | calculatePerformanceScores | Medusa |
| 5 | createAnalyticsSnapshots | Medusa |
| 6 | flagUnderperformingVendors | Medusa |
| 7 | sendPerformanceReports | PayloadCMS |
| 8 | applyPenalties (if thresholds breached) | Medusa |

---

##### WF-018: VendorProductApprovalWorkflow

**Trigger:** `vendor_product.submitted`
**Task Queue:** `medusa-commerce`

```typescript
interface ProductApprovalPayload {
  workflow_id: string
  tenant_id: string
  vendor_id: string
  product_id: string
  product_data: {
    title: string
    description: string
    category_ids: string[]
    variants: { sku: string; price: number }[]
    images: string[]
  }
  requires_compliance_check: boolean
  product_category_rules?: {
    requires_license: boolean
    restricted_zones: string[]
  }
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | validateProductData | Medusa |
| 2 | checkCategoryCompliance | ERPNext |
| 3 | verifyVendorLicense (if required) | Walt.id |
| 4 | contentModerationCheck | PayloadCMS / external |
| 5 | autoApprove OR queueForManualReview | Medusa |
| 6 | awaitManualApproval (signal, timer: 72h) | Medusa |
| 7 | publishProduct | Medusa |
| 8 | syncToERPCatalog | ERPNext |
| 9 | notifyVendor | PayloadCMS |

---

##### WF-019: CommissionRecalculationWorkflow

**Trigger:** `commission_rule.updated` OR `order.refunded` (partial)
**Task Queue:** `medusa-commerce`

```typescript
interface CommissionRecalcPayload {
  workflow_id: string
  tenant_id: string
  trigger: 'rule_change' | 'partial_refund' | 'adjustment'
  commission_rule_id?: string
  order_id?: string
  vendor_id?: string
  recalc_scope: 'single_order' | 'vendor_all_pending' | 'global'
  effective_date: string
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | fetchAffectedTransactions | Medusa |
| 2 | recalculateCommissions | Medusa |
| 3 | createAdjustmentTransactions | Medusa |
| 4 | updatePayoutLedger | Medusa |
| 5 | updateAccountingEntries | ERPNext |
| 6 | notifyAffectedVendors | PayloadCMS |

---

##### WF-020: VendorSuspensionWorkflow

**Trigger:** Manual admin action OR automated performance threshold breach
**Task Queue:** `medusa-commerce`

```typescript
interface VendorSuspensionPayload {
  workflow_id: string
  tenant_id: string
  vendor_id: string
  reason: string
  suspension_type: 'temporary' | 'permanent'
  duration_days?: number
  initiated_by: string
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | deactivateVendorProducts | Medusa |
| 2 | pausePendingPayouts | Medusa |
| 3 | reassignPendingOrders (if any) | Medusa, Fleetbase |
| 4 | revokeVendorCredentials | Walt.id |
| 5 | notifyVendor | PayloadCMS |
| 6 | notifyAffectedCustomers | PayloadCMS |
| 7 | scheduleReactivation (if temporary, timer) | Temporal |
| 8 | recordAuditLog | Medusa |

---

##### WF-021: MarketplaceSettlementWorkflow

**Trigger:** Scheduled (weekly or biweekly)
**Task Queue:** `erpnext-backoffice`

```typescript
interface SettlementPayload {
  workflow_id: string
  tenant_id: string
  settlement_period: { start: string; end: string }
  vendor_ids: string[]
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | aggregateCommissionTransactions | Medusa |
| 2 | deductPendingRefunds | Medusa |
| 3 | deductPlatformFees | Medusa |
| 4 | generateSettlementReports | ERPNext |
| 5 | initiatePayouts (batch) | Payment Gateway |
| 6 | sendSettlementStatements | PayloadCMS |
| 7 | createAccountingEntries | ERPNext |
| 8 | recordAuditLog | Medusa |

---

#### 4.3.4 B2B COMMERCE WORKFLOWS

---

##### WF-022: PurchaseOrderApprovalWorkflow

**Trigger:** `purchase_order.submitted`
**Task Queue:** `medusa-commerce`

```typescript
interface POApprovalPayload {
  workflow_id: string
  correlation_id: string
  tenant_id: string
  purchase_order_id: string
  company_id: string
  submitted_by: string                 // company_user_id
  total_amount: number
  currency_code: string
  approval_workflow_id: string
  steps: {
    step_number: number
    approver_role: string
    approver_ids: string[]
    threshold_amount?: number
    auto_approve_below?: number
  }[]
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | validatePOAgainstSpendingLimits | Medusa |
| 2 | checkBudgetAvailability | ERPNext |
| 3 | routeToApprovers (per step) | Medusa |
| 4 | awaitApproval (signal per step, timer: 72h) | Medusa |
| 5 | escalateIfTimeout | PayloadCMS |
| 6 | convertPOToOrder (if approved) | Medusa |
| 7 | updateCreditUsed | Medusa |
| 8 | notifySubmitter | PayloadCMS |
| 9 | recordAuditLog | Medusa |

**Signals:**
- `approval.approved` — approver approved
- `approval.rejected` — approver rejected (with reason)
- `approval.delegated` — forwarded to another approver

---

##### WF-023: QuoteNegotiationWorkflow

**Trigger:** `quote.requested`
**Task Queue:** `medusa-commerce`

```typescript
interface QuoteNegotiationPayload {
  workflow_id: string
  tenant_id: string
  quote_id: string
  company_id: string
  customer_id: string
  requested_items: {
    product_id: string
    variant_id: string
    quantity: number
    requested_price?: number
  }[]
  delivery_requirements?: {
    delivery_date: string
    location: object
  }
  max_negotiation_rounds: number       // e.g., 3
  expiry_days: number                  // e.g., 14
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | calculateInitialQuote (volume pricing) | Medusa |
| 2 | checkInventoryAvailability | ERPNext |
| 3 | sendQuoteToCustomer | PayloadCMS |
| 4 | awaitCustomerResponse (signal, timer: expiry) | Medusa |
| 5 | handleCounterOffer (loop up to max rounds) | Medusa |
| 6 | finalizeQuote | Medusa |
| 7 | convertToPurchaseOrder (if accepted) | Medusa |
| 8 | recordAuditLog | Medusa |

**Signals:**
- `quote.accepted` — customer accepted
- `quote.countered` — customer counter-offered
- `quote.rejected` — customer rejected
- `quote.expired` — timer expired

---

##### WF-024: CreditLimitReviewWorkflow

**Trigger:** `company.credit_limit_review_requested` OR scheduled (quarterly)
**Task Queue:** `medusa-commerce`

```typescript
interface CreditLimitReviewPayload {
  workflow_id: string
  tenant_id: string
  company_id: string
  current_credit_limit: number
  requested_credit_limit?: number
  review_data: {
    payment_history_months: number
    total_orders: number
    total_spent: number
    average_days_to_pay: number
    late_payments: number
    current_credit_used: number
  }
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | gatherPaymentHistory | ERPNext |
| 2 | calculateCreditScore | ERPNext |
| 3 | checkCompanyCredentials | Walt.id |
| 4 | proposeNewLimit | Medusa |
| 5 | routeForApproval (if above threshold) | Medusa |
| 6 | updateCreditLimit | Medusa |
| 7 | notifyCompany | PayloadCMS |
| 8 | recordAuditLog | Medusa |

---

##### WF-025: CompanyOnboardingWorkflow

**Trigger:** `company.registration_submitted`
**Task Queue:** `medusa-commerce`

```typescript
interface CompanyOnboardingPayload {
  workflow_id: string
  tenant_id: string
  company_id: string
  admin_user_id: string
  business_info: {
    name: string
    legal_name: string
    tax_id: string
    industry: string
    employee_count: number
    country_code: string
    address: object
  }
  documents: {
    type: 'trade_license' | 'tax_certificate' | 'tax_exemption_cert'
    file_url: string
  }[]
  requested_tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  requested_payment_terms: string
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | createCompanyRecord | Medusa |
| 2 | verifyBusinessDocuments | Walt.id |
| 3 | issueBusinessCredentials | Walt.id |
| 4 | createERPCustomerAccount | ERPNext |
| 5 | assignPaymentTerms | Medusa |
| 6 | setInitialCreditLimit | Medusa |
| 7 | processTaxExemptions | Medusa, ERPNext |
| 8 | setupApprovalWorkflows | Medusa |
| 9 | sendWelcomeKit | PayloadCMS |
| 10 | recordAuditLog | Medusa |

---

##### WF-026: B2BInvoicingWorkflow

**Trigger:** `order.completed` (B2B order with payment terms)
**Task Queue:** `erpnext-backoffice`

```typescript
interface B2BInvoicingPayload {
  workflow_id: string
  tenant_id: string
  order_id: string
  company_id: string
  invoice_id: string
  payment_terms_id: string
  net_days: number
  amount: number
  currency_code: string
  early_payment_discount?: {
    percent: number
    days: number
  }
  line_items: {
    product_id: string
    title: string
    quantity: number
    unit_price: number
    tax_amount: number
  }[]
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | generateInvoice | Medusa |
| 2 | createAccountsReceivable | ERPNext |
| 3 | sendInvoice | PayloadCMS |
| 4 | schedulePaymentReminder (timer: due_date - 7d) | Temporal |
| 5 | sendPaymentReminder | PayloadCMS |
| 6 | awaitPayment (signal, timer: due_date + grace) | Payment Gateway |
| 7 | markAsPaid OR markAsOverdue | Medusa, ERPNext |
| 8 | applyLateFees (if overdue) | ERPNext |
| 9 | escalateToCollections (if > 90 days) | ERPNext |

**Signals:**
- `payment.received` — payment captured
- `payment.partial` — partial payment received

---

#### 4.3.5 SUBSCRIPTION & BILLING WORKFLOWS

---

##### WF-027: SubscriptionLifecycleWorkflow

**Trigger:** `subscription.created`
**Task Queue:** `medusa-commerce`
**Duration:** Long-running (months/years, uses continue-as-new)

```typescript
interface SubscriptionLifecyclePayload {
  workflow_id: string
  tenant_id: string
  subscription_id: string
  customer_id: string
  plan_id: string
  billing_interval: 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  billing_anchor_date: string
  payment_method_id: string
  gateway: string
  items: {
    product_id: string
    variant_id: string
    quantity: number
    unit_price: number
  }[]
  trial_days?: number
}
```

**Steps (recurring loop):**

| Step | Activity | System |
|------|----------|--------|
| 1 | startTrialPeriod (if trial_days) | Temporal timer |
| 2 | createBillingCycle | Medusa |
| 3 | calculateBillingAmount (with discounts) | Medusa |
| 4 | chargeSubscription | Payment Gateway |
| 5 | handlePaymentFailure (retry 3x over 7 days) | Payment Gateway |
| 6 | createSubscriptionOrder | Medusa |
| 7 | createFulfillment (if physical) | Fleetbase |
| 8 | createAccountingEntry | ERPNext |
| 9 | sendBillingReceipt | PayloadCMS |
| 10 | scheduleNextBillingCycle (timer) | Temporal |
| 11 | continue-as-new (every 30 cycles) | Temporal |

**Signals:**
- `subscription.paused` — customer paused
- `subscription.resumed` — customer resumed
- `subscription.cancelled` — customer cancelled
- `subscription.plan_changed` — upgrade/downgrade
- `subscription.payment_method_updated` — new payment method
- `subscription.discount_applied` — new discount added

---

##### WF-028: SubscriptionTrialEndWorkflow

**Trigger:** Timer from SubscriptionLifecycleWorkflow (trial_days)
**Task Queue:** `medusa-commerce`

```typescript
interface TrialEndPayload {
  workflow_id: string
  tenant_id: string
  subscription_id: string
  customer_id: string
  plan_id: string
  payment_method_id: string
  first_billing_amount: number
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | sendTrialEndingReminder (3 days before) | PayloadCMS |
| 2 | validatePaymentMethod | Payment Gateway |
| 3 | chargeFirstBilling | Payment Gateway |
| 4 | activateSubscription | Medusa |
| 5 | sendActivationConfirmation | PayloadCMS |
| 6 | OR cancelIfNoPaymentMethod | Medusa |

---

##### WF-029: SubscriptionDunningWorkflow

**Trigger:** `subscription.payment_failed`
**Task Queue:** `payment-gateway`

```typescript
interface DunningPayload {
  workflow_id: string
  tenant_id: string
  subscription_id: string
  customer_id: string
  billing_cycle_id: string
  amount: number
  currency_code: string
  attempt_number: number
  max_attempts: number                 // e.g., 4
  retry_schedule: number[]             // e.g., [1, 3, 5, 7] days
  payment_method_id: string
  gateway: string
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | sendPaymentFailureNotice | PayloadCMS |
| 2 | waitRetryPeriod (timer) | Temporal |
| 3 | retryPayment | Payment Gateway |
| 4 | if success: updateBillingCycle | Medusa |
| 5 | if fail and attempts < max: goto step 1 | — |
| 6 | if fail and attempts >= max: pauseSubscription | Medusa |
| 7 | sendFinalNotice | PayloadCMS |
| 8 | scheduleGracePeriodCancellation (timer: 14 days) | Temporal |
| 9 | cancelSubscription (if no payment) | Medusa |

---

##### WF-030: SubscriptionUpgradeDowngradeWorkflow

**Trigger:** `subscription.plan_change_requested`
**Task Queue:** `medusa-commerce`

```typescript
interface PlanChangePayload {
  workflow_id: string
  tenant_id: string
  subscription_id: string
  customer_id: string
  current_plan_id: string
  new_plan_id: string
  change_type: 'upgrade' | 'downgrade'
  proration_method: 'immediate' | 'next_billing_cycle' | 'prorated_now'
  current_period_end: string
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | calculateProration | Medusa |
| 2 | chargeOrCreditDifference | Payment Gateway |
| 3 | updateSubscriptionPlan | Medusa |
| 4 | updateERPBillingSchedule | ERPNext |
| 5 | sendConfirmation | PayloadCMS |

---

##### WF-031: SubscriptionCancellationWorkflow

**Trigger:** `subscription.cancel_requested`
**Task Queue:** `medusa-commerce`

```typescript
interface SubscriptionCancelPayload {
  workflow_id: string
  tenant_id: string
  subscription_id: string
  customer_id: string
  cancellation_type: 'immediate' | 'end_of_period'
  reason: string
  refund_prorated: boolean
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | cancelPendingFulfillments | Fleetbase |
| 2 | calculateProratedRefund (if applicable) | Medusa |
| 3 | processRefund (if applicable) | Payment Gateway |
| 4 | deactivateSubscription | Medusa |
| 5 | sendCancellationSurvey | PayloadCMS |
| 6 | updateAccountingEntries | ERPNext |
| 7 | scheduleWinBackCampaign (timer: 30d) | PayloadCMS |
| 8 | recordAuditLog | Medusa |

---

#### 4.3.6 LOGISTICS & FULFILLMENT WORKFLOWS

---

##### WF-032: WarehouseReceivingWorkflow

**Trigger:** `purchase_receipt.created` (ERPNext)
**Task Queue:** `fleetbase-logistics`

```typescript
interface WarehouseReceivingPayload {
  workflow_id: string
  tenant_id: string
  purchase_receipt_id: string
  supplier_id: string
  warehouse_id: string
  items: {
    product_id: string
    variant_id: string
    sku: string
    expected_quantity: number
    batch_number?: string
    expiry_date?: string
  }[]
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | createReceivingTask | Fleetbase |
| 2 | awaitInspection (signal) | Fleetbase |
| 3 | updateInventoryLevels | ERPNext |
| 4 | assignWarehouseZones | Fleetbase |
| 5 | updateProductAvailability | Medusa |
| 6 | recordAuditLog | Medusa |

---

##### WF-033: InventorySyncWorkflow

**Trigger:** Scheduled (every 15 minutes) OR `stock.level_changed`
**Task Queue:** `erpnext-backoffice`

```typescript
interface InventorySyncPayload {
  workflow_id: string
  tenant_id: string
  sync_type: 'full' | 'delta'
  changed_variants?: string[]          // for delta sync
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | fetchERPInventoryLevels | ERPNext |
| 2 | compareWithMedusaLevels | Medusa |
| 3 | updateMedusaStockQuantities | Medusa |
| 4 | updateFleetbaseWarehouseLevels | Fleetbase |
| 5 | triggerLowStockAlerts (if needed) | PayloadCMS |
| 6 | markOutOfStockProducts (if zero) | Medusa |

---

##### WF-034: RouteOptimizationWorkflow

**Trigger:** Scheduled (daily) OR `delivery_batch.ready`
**Task Queue:** `fleetbase-logistics`

```typescript
interface RouteOptimizationPayload {
  workflow_id: string
  tenant_id: string
  delivery_zone_id: string
  date: string
  pending_deliveries: {
    delivery_order_id: string
    pickup_location: { lat: number; lng: number }
    dropoff_location: { lat: number; lng: number }
    priority: 'standard' | 'express' | 'same_day'
    time_window?: { start: string; end: string }
    package_weight_kg: number
  }[]
  available_drivers: {
    driver_id: string
    vehicle_type: string
    current_location: { lat: number; lng: number }
    shift_end: string
    max_capacity_kg: number
  }[]
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | calculateOptimalRoutes | Fleetbase |
| 2 | assignDeliveriesToDrivers | Fleetbase |
| 3 | notifyDrivers | Fleetbase |
| 4 | updateEstimatedDeliveryTimes | Medusa |
| 5 | notifyCustomers (ETA updates) | PayloadCMS |

---

##### WF-035: SameDayDeliveryWorkflow

**Trigger:** `order.placed` with same_day shipping
**Task Queue:** `fleetbase-logistics`

```typescript
interface SameDayDeliveryPayload {
  workflow_id: string
  tenant_id: string
  order_id: string
  delivery_order_id: string
  cutoff_time: string                  // e.g., "14:00" local time
  warehouse_id: string
  items: { sku: string; quantity: number; location_in_warehouse: string }[]
  recipient: { name: string; phone: string; address: object; lat: number; lng: number }
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | verifyCutoffTime | Fleetbase |
| 2 | createUrgentPickList | Fleetbase |
| 3 | assignNearestDriver | Fleetbase |
| 4 | trackPickupCompletion (signal) | Fleetbase |
| 5 | optimizeDirectRoute | Fleetbase |
| 6 | trackDelivery (real-time) | Fleetbase |
| 7 | confirmDelivery (signal) | Fleetbase |
| 8 | updateOrderStatus | Medusa |

---

##### WF-036: FleetMaintenanceWorkflow

**Trigger:** Scheduled OR `vehicle.maintenance_due`
**Task Queue:** `fleetbase-logistics`

```typescript
interface FleetMaintenancePayload {
  workflow_id: string
  tenant_id: string
  vehicle_id: string
  maintenance_type: 'scheduled' | 'unscheduled' | 'inspection'
  due_date: string
  mileage_at_due: number
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | markVehicleUnavailable | Fleetbase |
| 2 | reassignPendingDeliveries | Fleetbase |
| 3 | createMaintenanceRecord | ERPNext (asset) |
| 4 | scheduleMaintenanceAppointment | Fleetbase |
| 5 | awaitMaintenanceCompletion (signal) | Fleetbase |
| 6 | markVehicleAvailable | Fleetbase |
| 7 | updateAssetRecord | ERPNext |

---

##### WF-037: LastMileHandoffWorkflow

**Trigger:** `delivery.arrived_at_hub`
**Task Queue:** `fleetbase-logistics`

```typescript
interface LastMileHandoffPayload {
  workflow_id: string
  tenant_id: string
  delivery_order_id: string
  from_driver_id: string
  hub_id: string
  last_mile_zone: string
  packages: { package_id: string; weight_kg: number }[]
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | confirmHubArrival | Fleetbase |
| 2 | sortPackagesByZone | Fleetbase |
| 3 | assignLastMileDriver | Fleetbase |
| 4 | transferCustody | Fleetbase |
| 5 | optimizeLastMileRoute | Fleetbase |
| 6 | dispatchLastMile | Fleetbase |
| 7 | updateTrackingStatus | Medusa |

---

#### 4.3.7 IDENTITY & COMPLIANCE WORKFLOWS

---

##### WF-038: CustomerKYCWorkflow

**Trigger:** `customer.high_value_purchase` OR `customer.kyc_required`
**Task Queue:** `waltid-identity`

```typescript
interface CustomerKYCPayload {
  workflow_id: string
  tenant_id: string
  customer_id: string
  verification_level: 'basic' | 'enhanced' | 'full'
  required_documents: ('id_card' | 'passport' | 'utility_bill' | 'selfie')[]
  purpose: 'age_verification' | 'high_value_purchase' | 'regulatory' | 'account_upgrade'
  residency_zone: string
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | createVerificationSession | Walt.id |
| 2 | sendVerificationLink | PayloadCMS |
| 3 | awaitDocumentUpload (signal, timer: 7d) | Walt.id |
| 4 | verifyDocuments (OCR + liveness) | Walt.id |
| 5 | checkSanctionsList | Walt.id |
| 6 | issueVerifiedCredential | Walt.id |
| 7 | updateCustomerVerificationStatus | Medusa |
| 8 | unlockRestrictedProducts (if applicable) | Medusa |
| 9 | recordAuditLog | Medusa |

---

##### WF-039: CredentialIssuanceWorkflow

**Trigger:** `credential.issue_requested`
**Task Queue:** `waltid-identity`

```typescript
interface CredentialIssuancePayload {
  workflow_id: string
  tenant_id: string
  issuer_did: string
  subject_did: string
  credential_type: 'business_license' | 'professional_cert' | 'municipal_permit' | 'residency_proof' | 'age_verification'
  credential_data: Record<string, unknown>
  schema_id: string
  expiry_date?: string
  revocable: boolean
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | validateSchema | Walt.id |
| 2 | signCredential | Walt.id |
| 3 | storeCredential | Walt.id |
| 4 | issueToWallet | Walt.id |
| 5 | createIssuanceRecord | Walt.id |
| 6 | notifySubject | PayloadCMS |
| 7 | recordAuditLog | Medusa |

---

##### WF-040: PeriodicComplianceCheckWorkflow

**Trigger:** Scheduled (monthly)
**Task Queue:** `waltid-identity`

```typescript
interface ComplianceCheckPayload {
  workflow_id: string
  tenant_id: string
  check_type: 'vendor_licenses' | 'product_compliance' | 'data_retention' | 'credential_expiry'
  scope: 'all_vendors' | 'all_companies' | 'all_credentials'
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | fetchExpiringCredentials | Walt.id |
| 2 | fetchExpiredBusinessLicenses | ERPNext |
| 3 | checkDataRetentionPolicies | ERPNext |
| 4 | flagNonCompliantEntities | Medusa |
| 5 | sendRenewalNotices | PayloadCMS |
| 6 | suspendExpiredVendors (if grace period exceeded) | Medusa |
| 7 | generateComplianceReport | ERPNext |
| 8 | recordAuditLog | Medusa |

---

##### WF-041: ConsentManagementWorkflow

**Trigger:** `customer.consent_updated` OR GDPR request
**Task Queue:** `waltid-identity`

```typescript
interface ConsentManagementPayload {
  workflow_id: string
  tenant_id: string
  customer_id: string
  request_type: 'consent_update' | 'data_export' | 'data_deletion' | 'right_to_forget'
  consent_changes?: {
    marketing_email: boolean
    marketing_sms: boolean
    analytics_tracking: boolean
    third_party_sharing: boolean
  }
  residency_zone: string              // determines applicable regulations
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | updateConsentRecord | Walt.id |
| 2 | propagateConsentToSystems | All systems |
| 3 | exportCustomerData (if requested) | Medusa, ERPNext |
| 4 | deleteCustomerData (if right_to_forget) | All systems |
| 5 | sendConfirmation | PayloadCMS |
| 6 | recordAuditLog | Medusa |

---

##### WF-042: AgeVerificationWorkflow

**Trigger:** `cart.contains_age_restricted_product`
**Task Queue:** `waltid-identity`

```typescript
interface AgeVerificationPayload {
  workflow_id: string
  tenant_id: string
  customer_id: string
  cart_id: string
  required_age: number
  verification_method: 'credential_check' | 'id_upload' | 'third_party'
  product_ids: string[]
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | checkExistingAgeCredential | Walt.id |
| 2 | if valid: approveCheckout | Medusa |
| 3 | if not: requestAgeVerification | Walt.id |
| 4 | awaitVerification (signal, timer: 24h) | Walt.id |
| 5 | verifyAge | Walt.id |
| 6 | issueAgeCredential (for future use) | Walt.id |
| 7 | approveOrBlockCheckout | Medusa |

---

#### 4.3.8 CONTENT & NOTIFICATION WORKFLOWS

---

##### WF-043: TransactionalNotificationWorkflow

**Trigger:** Any commerce event requiring customer notification
**Task Queue:** `payload-content`

```typescript
interface NotificationPayload {
  workflow_id: string
  tenant_id: string
  template_id: string
  channels: ('email' | 'sms' | 'push' | 'in_app')[]
  recipient: {
    customer_id: string
    email?: string
    phone?: string
    push_token?: string
    locale: 'en' | 'fr' | 'ar'
  }
  variables: Record<string, unknown>   // template variables
  priority: 'high' | 'normal' | 'low'
  scheduled_at?: string               // for delayed sending
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | fetchTemplate (localized) | PayloadCMS |
| 2 | renderTemplate | PayloadCMS |
| 3 | sendEmail (if channel includes email) | PayloadCMS / SMTP |
| 4 | sendSMS (if channel includes sms) | PayloadCMS / Twilio |
| 5 | sendPush (if channel includes push) | PayloadCMS / FCM |
| 6 | recordNotificationLog | Medusa |

---

##### WF-044: ContentPublishingWorkflow

**Trigger:** `content.publish_requested` (PayloadCMS)
**Task Queue:** `payload-content`

```typescript
interface ContentPublishPayload {
  workflow_id: string
  tenant_id: string
  content_type: 'page' | 'blog_post' | 'banner' | 'announcement'
  content_id: string
  locales: string[]
  publish_at?: string
  requires_approval: boolean
  approver_ids?: string[]
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | validateContent | PayloadCMS |
| 2 | routeForApproval (if required) | PayloadCMS |
| 3 | awaitApproval (signal) | PayloadCMS |
| 4 | publishContent | PayloadCMS |
| 5 | invalidateCDNCache | PayloadCMS |
| 6 | notifySubscribers (if blog) | PayloadCMS |
| 7 | recordAuditLog | Medusa |

---

##### WF-045: TenantBrandingSyncWorkflow

**Trigger:** `tenant.branding_updated`
**Task Queue:** `payload-content`

```typescript
interface BrandingSyncPayload {
  workflow_id: string
  tenant_id: string
  branding: {
    logo_url: string
    favicon_url: string
    primary_color: string
    secondary_color: string
    font_family: string
    custom_css?: string
  }
  affected_storefronts: string[]
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | updateStorefrontTheme | PayloadCMS |
| 2 | generateDesignTokens | Medusa (design-runtime) |
| 3 | updateEmailTemplates | PayloadCMS |
| 4 | invalidateCache | PayloadCMS |
| 5 | notifyTenantAdmin | PayloadCMS |

---

##### WF-046: AbandonedCartRecoveryWorkflow

**Trigger:** `cart.abandoned` (no activity for 1 hour with items)
**Task Queue:** `payload-content`

```typescript
interface AbandonedCartPayload {
  workflow_id: string
  tenant_id: string
  cart_id: string
  customer_id: string
  customer_email: string
  locale: string
  items: {
    product_id: string
    title: string
    thumbnail?: string
    quantity: number
    unit_price: number
  }[]
  total: number
  currency_code: string
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | wait1Hour | Temporal timer |
| 2 | checkIfCartCompleted | Medusa |
| 3 | sendReminder1 (gentle reminder) | PayloadCMS |
| 4 | wait24Hours | Temporal timer |
| 5 | checkIfCartCompleted | Medusa |
| 6 | sendReminder2 (with incentive/coupon) | PayloadCMS |
| 7 | wait72Hours | Temporal timer |
| 8 | sendFinalReminder | PayloadCMS |
| 9 | trackConversion | Medusa |

---

#### 4.3.9 BOOKING & SERVICES WORKFLOWS

---

##### WF-047: BookingLifecycleWorkflow

**Trigger:** `booking.created`
**Task Queue:** `medusa-commerce`

```typescript
interface BookingLifecyclePayload {
  workflow_id: string
  tenant_id: string
  booking_id: string
  customer_id: string
  service_product_id: string
  provider_id: string
  scheduled_at: string
  start_time: string
  end_time: string
  price: number
  currency_code: string
  payment_intent_id: string
  gateway: string
  reminders: {
    type: 'email' | 'sms' | 'push'
    send_before_minutes: number
  }[]
  cancellation_policy: 'flexible' | 'moderate' | 'strict'
  cancellation_deadline_hours: number
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | capturePayment (or authorize) | Payment Gateway |
| 2 | confirmBooking | Medusa |
| 3 | blockProviderSlot | Medusa |
| 4 | sendBookingConfirmation | PayloadCMS |
| 5 | scheduleReminders (timers) | Temporal |
| 6 | sendReminder (for each configured) | PayloadCMS |
| 7 | awaitBookingTime | Temporal timer |
| 8 | markInProgress | Medusa |
| 9 | awaitCompletion (signal or timer) | Medusa |
| 10 | finalizePayment | Payment Gateway |
| 11 | sendReviewRequest | PayloadCMS |
| 12 | recordAuditLog | Medusa |

**Signals:**
- `booking.checked_in` — customer arrived
- `booking.completed` — service completed
- `booking.no_show` — customer didn't show
- `booking.cancelled` — cancelled before deadline

---

##### WF-048: BookingRescheduleWorkflow

**Trigger:** `booking.reschedule_requested`
**Task Queue:** `medusa-commerce`

```typescript
interface BookingReschedulePayload {
  workflow_id: string
  tenant_id: string
  booking_id: string
  original_start_time: string
  new_start_time: string
  new_end_time: string
  requested_by: 'customer' | 'provider'
  reason?: string
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | checkNewSlotAvailability | Medusa |
| 2 | releaseOriginalSlot | Medusa |
| 3 | blockNewSlot | Medusa |
| 4 | updateBooking | Medusa |
| 5 | cancelOldReminders | Temporal (cancel timers) |
| 6 | scheduleNewReminders | Temporal |
| 7 | notifyOtherParty | PayloadCMS |

---

##### WF-049: ProviderAvailabilitySyncWorkflow

**Trigger:** `provider.external_calendar_connected` OR scheduled (every 30 min)
**Task Queue:** `medusa-commerce`

```typescript
interface AvailabilitySyncPayload {
  workflow_id: string
  tenant_id: string
  provider_id: string
  external_calendar_provider: 'google' | 'outlook' | 'apple'
  external_calendar_id: string
  sync_direction: 'inbound' | 'outbound' | 'bidirectional'
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | fetchExternalCalendarEvents | External API |
| 2 | compareWithInternalAvailability | Medusa |
| 3 | blockConflictingSlots | Medusa |
| 4 | pushBookingsToExternalCalendar | External API |
| 5 | updateAvailabilityExceptions | Medusa |

---

##### WF-050: ServiceProviderOnboardingWorkflow

**Trigger:** `service_provider.registered`
**Task Queue:** `medusa-commerce`

```typescript
interface ProviderOnboardingPayload {
  workflow_id: string
  tenant_id: string
  provider_id: string
  user_id: string
  services: string[]
  certifications: {
    type: string
    document_url: string
    expiry_date?: string
  }[]
  requires_background_check: boolean
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | createProviderRecord | Medusa |
| 2 | verifyCertifications | Walt.id |
| 3 | runBackgroundCheck (if required) | Walt.id |
| 4 | issueProfessionalCredential | Walt.id |
| 5 | setupDefaultAvailability | Medusa |
| 6 | createProviderProfile | PayloadCMS |
| 7 | activateProvider | Medusa |
| 8 | sendWelcomeKit | PayloadCMS |

---

#### 4.3.10 PLATFORM OPERATIONS WORKFLOWS

---

##### WF-051: TenantProvisioningWorkflow

**Trigger:** `tenant.created`
**Task Queue:** `medusa-commerce`

```typescript
interface TenantProvisioningPayload {
  workflow_id: string
  tenant_id: string
  tenant_slug: string
  owner_user_id: string
  plan: 'free' | 'starter' | 'professional' | 'enterprise'
  locales: string[]
  residency_zone: string
  initial_config: {
    default_currency: string
    default_locale: string
    timezone: string
  }
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | createTenantRecord | Medusa |
| 2 | createDefaultSettings | Medusa |
| 3 | createNodeHierarchy (root city node) | Medusa |
| 4 | setupDefaultGovernance | Medusa |
| 5 | createDefaultPersonas | Medusa |
| 6 | createERPCompanyRecord | ERPNext |
| 7 | createPayloadTenantSpace | PayloadCMS |
| 8 | createDefaultSalesChannels | Medusa |
| 9 | createFleetbaseOrg | Fleetbase |
| 10 | issueAdminCredentials | Walt.id |
| 11 | sendWelcomeEmail | PayloadCMS |
| 12 | recordAuditLog | Medusa |

---

##### WF-052: TenantBillingWorkflow

**Trigger:** Scheduled (monthly, per tenant)
**Task Queue:** `medusa-commerce`

```typescript
interface TenantBillingPayload {
  workflow_id: string
  tenant_id: string
  billing_period: { start: string; end: string }
  plan: string
  base_amount: number
  usage_metrics: {
    api_calls: number
    storage_mb: number
    bandwidth_mb: number
    active_products: number
    orders_processed: number
    active_vendors: number
  }
  overage_rates: Record<string, number>
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | aggregateUsageMetrics | Medusa |
| 2 | calculateOverages | Medusa |
| 3 | generateTenantInvoice | Medusa |
| 4 | chargeTenantPayment | Payment Gateway |
| 5 | createAccountingEntry | ERPNext |
| 6 | sendInvoice | PayloadCMS |
| 7 | handlePaymentFailure (if failed) | Payment Gateway, PayloadCMS |
| 8 | recordUsageRecord | Medusa |

---

##### WF-053: DataMigrationWorkflow

**Trigger:** Manual admin trigger
**Task Queue:** `medusa-commerce`

```typescript
interface DataMigrationPayload {
  workflow_id: string
  tenant_id: string
  migration_type: 'import' | 'export' | 'transfer'
  source_system: string
  target_system: string
  entities: string[]                   // e.g., ['products', 'customers', 'orders']
  batch_size: number
  dry_run: boolean
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | validateMigrationConfig | Medusa |
| 2 | extractData (batched) | Source system |
| 3 | transformData | Medusa |
| 4 | loadData (batched, with rollback) | Target system |
| 5 | validateMigrationResults | Medusa |
| 6 | generateMigrationReport | Medusa |
| 7 | recordAuditLog | Medusa |

---

##### WF-054: SystemHealthCheckWorkflow

**Trigger:** Scheduled (every 5 minutes)
**Task Queue:** `medusa-commerce`

```typescript
interface HealthCheckPayload {
  workflow_id: string
  systems: {
    name: string
    health_endpoint: string
    timeout_ms: number
    critical: boolean
  }[]
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | pingMedusa | Medusa |
| 2 | pingERPNext | ERPNext |
| 3 | pingFleetbase | Fleetbase |
| 4 | pingWaltId | Walt.id |
| 5 | pingPaymentGateways | Payment Gateway |
| 6 | pingPayloadCMS | PayloadCMS |
| 7 | compareWithPreviousCheck | Temporal |
| 8 | alertOnDegradation (if critical) | PayloadCMS |
| 9 | updateStatusPage | PayloadCMS |

---

##### WF-055: AuditReportWorkflow

**Trigger:** Scheduled (daily) OR manual
**Task Queue:** `medusa-commerce`

```typescript
interface AuditReportPayload {
  workflow_id: string
  tenant_id: string
  report_type: 'daily_activity' | 'security_audit' | 'compliance_report' | 'financial_audit'
  period: { start: string; end: string }
  include_systems: string[]
  recipients: string[]
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | gatherMedusaAuditLogs | Medusa |
| 2 | gatherERPAuditTrail | ERPNext |
| 3 | gatherIdentityEvents | Walt.id |
| 4 | gatherPaymentAuditTrail | Payment Gateway |
| 5 | correlateEvents | Medusa |
| 6 | generateReport | ERPNext |
| 7 | sendReport | PayloadCMS |
| 8 | archiveReport | ERPNext |

---

#### 4.3.11 AUCTION & BIDDING WORKFLOWS

---

##### WF-056: AuctionLifecycleWorkflow

**Trigger:** `auction.created`
**Task Queue:** `medusa-commerce`
**Duration:** Hours to days (timed auction)

```typescript
interface AuctionLifecyclePayload {
  workflow_id: string
  tenant_id: string
  auction_id: string
  auction_type: 'english' | 'dutch' | 'sealed' | 'reverse'
  seller_id: string
  lots: {
    lot_id: string
    product_id: string
    starting_price: number
    reserve_price?: number
    buy_now_price?: number
  }[]
  start_time: string
  end_time: string
  currency_code: string
  bid_increment: number
  auto_extend_minutes: number
  requires_bid_deposit: boolean
  deposit_amount?: number
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | validateAuctionConfig | Medusa |
| 2 | publishAuctionListing | Medusa |
| 3 | notifyWatchlistUsers | PayloadCMS |
| 4 | awaitAuctionStart (timer) | Temporal |
| 5 | openBidding | Medusa |
| 6 | monitorBids (signals: bid.placed) | Medusa |
| 7 | autoExtendIfLastMinuteBid | Medusa |
| 8 | closeAuction (timer: end_time) | Medusa |
| 9 | determineWinners | Medusa |
| 10 | collectBidDeposits OR chargeWinners | Payment Gateway |
| 11 | createOrderFromAuction | Medusa |
| 12 | refundLosingBidDeposits | Payment Gateway |
| 13 | notifyWinners | PayloadCMS |
| 14 | recordAuditLog | Medusa |

**Signals:**
- `bid.placed` — new bid received
- `bid.retracted` — bid withdrawn (if allowed)
- `auction.cancelled` — seller cancelled
- `buy_now.triggered` — instant purchase at buy-now price

---

#### 4.3.12 RENTAL & LEASING WORKFLOWS

---

##### WF-057: RentalAgreementWorkflow

**Trigger:** `rental.agreement_created`
**Task Queue:** `medusa-commerce`
**Duration:** Days to years (continue-as-new)

```typescript
interface RentalAgreementPayload {
  workflow_id: string
  tenant_id: string
  rental_agreement_id: string
  customer_id: string
  rental_product_id: string
  start_date: string
  end_date: string
  billing_frequency: 'daily' | 'weekly' | 'monthly'
  rate: number
  currency_code: string
  security_deposit: number
  payment_method_id: string
  gateway: string
  late_return_fee_per_day: number
  damage_waiver_opted: boolean
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | holdSecurityDeposit | Payment Gateway |
| 2 | verifyCustomerIdentity (if high-value) | Walt.id |
| 3 | activateRentalAgreement | Medusa |
| 4 | updateInventoryAsRented | ERPNext |
| 5 | sendRentalConfirmation | PayloadCMS |
| 6 | loop: scheduleBillingCycle (timer) | Temporal |
| 7 | chargeRentalFee | Payment Gateway |
| 8 | createAccountingEntry | ERPNext |
| 9 | scheduleReturnReminder (timer: end_date - 3d) | Temporal |
| 10 | awaitReturn (signal) | Medusa |
| 11 | processReturnInspection | Medusa |
| 12 | releaseOrDeductDeposit | Payment Gateway |
| 13 | markAsReturned | Medusa, ERPNext |
| 14 | recordAuditLog | Medusa |

**Signals:**
- `rental.returned` — item returned
- `rental.extended` — extension requested
- `rental.damaged` — damage reported
- `rental.early_termination` — early return

---

#### 4.3.13 RESTAURANT & FOOD WORKFLOWS

---

##### WF-058: RestaurantOrderWorkflow

**Trigger:** `restaurant.order_placed`
**Task Queue:** `medusa-commerce`

```typescript
interface RestaurantOrderPayload {
  workflow_id: string
  tenant_id: string
  order_id: string
  restaurant_id: string
  customer_id: string
  order_type: 'dine_in' | 'takeaway' | 'delivery'
  table_id?: string
  items: {
    menu_item_id: string
    quantity: number
    modifiers: { modifier_id: string; quantity: number }[]
    special_instructions?: string
  }[]
  payment: {
    payment_intent_id: string
    gateway: string
    amount: number
    tip_amount?: number
  }
  estimated_prep_minutes: number
  delivery_address?: object
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | capturePayment (or authorize for dine-in) | Payment Gateway |
| 2 | sendToKitchenDisplay | Medusa |
| 3 | notifyRestaurant | PayloadCMS |
| 4 | awaitKitchenAcceptance (signal, timer: 5m) | Medusa |
| 5 | awaitPrepComplete (signal) | Medusa |
| 6 | if delivery: createFoodDeliveryOrder | Fleetbase |
| 7 | if delivery: assignNearestDriver | Fleetbase |
| 8 | if delivery: trackDelivery | Fleetbase |
| 9 | if dine_in: notifyServerReady | PayloadCMS |
| 10 | finalizePayment (with tip) | Payment Gateway |
| 11 | calculateRestaurantCommission | Medusa |
| 12 | recordAuditLog | Medusa |

---

#### 4.3.14 EVENTS & TICKETING WORKFLOWS

---

##### WF-059: EventTicketingWorkflow

**Trigger:** `event.ticket_purchased`
**Task Queue:** `medusa-commerce`

```typescript
interface EventTicketingPayload {
  workflow_id: string
  tenant_id: string
  event_id: string
  customer_id: string
  tickets: {
    ticket_type_id: string
    quantity: number
    seat_ids?: string[]
    attendee_names?: string[]
  }[]
  total_amount: number
  currency_code: string
  payment_intent_id: string
  gateway: string
  requires_age_verification: boolean
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | reserveSeats (if seated) | Medusa |
| 2 | verifyAge (if required) | Walt.id |
| 3 | capturePayment | Payment Gateway |
| 4 | generateTickets (with barcodes/QR) | Medusa |
| 5 | issueTicketCredentials (verifiable) | Walt.id |
| 6 | sendTicketsByEmail | PayloadCMS |
| 7 | updateAvailability | Medusa |
| 8 | scheduleEventReminder (timer: event_date - 1d) | Temporal |
| 9 | sendEventReminder | PayloadCMS |
| 10 | createAccountingEntry | ERPNext |
| 11 | recordAuditLog | Medusa |

---

#### 4.3.15 CLASSIFIED & C2C WORKFLOWS

---

##### WF-060: ClassifiedTransactionWorkflow

**Trigger:** `classified.offer_accepted`
**Task Queue:** `medusa-commerce`

```typescript
interface ClassifiedTransactionPayload {
  workflow_id: string
  tenant_id: string
  listing_id: string
  seller_id: string
  buyer_id: string
  agreed_price: number
  currency_code: string
  exchange_method: 'in_person' | 'shipped' | 'digital'
  escrow_required: boolean
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | holdPaymentInEscrow | Payment Gateway |
| 2 | notifySeller | PayloadCMS |
| 3 | if shipped: createShipment | Fleetbase |
| 4 | if shipped: awaitDelivery (signal) | Fleetbase |
| 5 | if in_person: awaitMeetupConfirmation (signal) | Medusa |
| 6 | awaitBuyerConfirmation (signal, timer: 48h) | Medusa |
| 7 | releasePaymentToSeller | Payment Gateway |
| 8 | markListingAsSold | Medusa |
| 9 | sendReviewRequests | PayloadCMS |
| 10 | recordAuditLog | Medusa |

---

#### 4.3.16 AFFILIATE & INFLUENCER WORKFLOWS

---

##### WF-061: AffiliateTrackingWorkflow

**Trigger:** `affiliate.conversion_detected` (via tracked link click → purchase)
**Task Queue:** `medusa-commerce`

```typescript
interface AffiliateTrackingPayload {
  workflow_id: string
  tenant_id: string
  affiliate_link_id: string
  affiliate_partner_id: string
  order_id: string
  order_amount: number
  currency_code: string
  commission_rate: number
  cookie_attribution_window_days: number
  influencer_campaign_id?: string
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | validateAttribution | Medusa |
| 2 | calculateAffiliateCommission | Medusa |
| 3 | createCommissionRecord | Medusa |
| 4 | checkMinimumPayoutThreshold | Medusa |
| 5 | if threshold_met: initiateAffiliatePayout | Payment Gateway |
| 6 | updateAffiliateAnalytics | Medusa |
| 7 | notifyAffiliate | PayloadCMS |
| 8 | createAccountingEntry | ERPNext |

---

#### 4.3.17 WARRANTY & AFTER-SALES WORKFLOWS

---

##### WF-062: WarrantyClaimWorkflow

**Trigger:** `warranty.claim_submitted`
**Task Queue:** `medusa-commerce`

```typescript
interface WarrantyClaimPayload {
  workflow_id: string
  tenant_id: string
  warranty_claim_id: string
  warranty_registration_id: string
  customer_id: string
  product_id: string
  issue_description: string
  issue_photos: string[]
  claim_type: 'repair' | 'replacement' | 'refund'
  vendor_id: string
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | validateWarrantyCoverage | Medusa |
| 2 | assessClaimType | Medusa |
| 3 | if repair: createRepairTicket | Medusa |
| 4 | if repair: schedulePickup | Fleetbase |
| 5 | if replacement: reserveReplacementUnit | ERPNext |
| 6 | if replacement: createReplacementOrder | Medusa |
| 7 | if refund: processWarrantyRefund | Payment Gateway |
| 8 | notifyCustomer | PayloadCMS |
| 9 | notifyVendor | PayloadCMS |
| 10 | chargeVendorIfApplicable | Payment Gateway |
| 11 | createAccountingEntry | ERPNext |
| 12 | recordAuditLog | Medusa |

---

#### 4.3.18 FREELANCE & GIG ECONOMY WORKFLOWS

---

##### WF-063: GigContractWorkflow

**Trigger:** `gig.proposal_accepted`
**Task Queue:** `medusa-commerce`
**Duration:** Days to months (milestone-based)

```typescript
interface GigContractPayload {
  workflow_id: string
  tenant_id: string
  gig_contract_id: string
  gig_listing_id: string
  client_id: string
  freelancer_id: string
  total_amount: number
  currency_code: string
  milestones: {
    milestone_id: string
    title: string
    amount: number
    due_date: string
    deliverables: string[]
  }[]
  payment_method_id: string
  gateway: string
  platform_fee_percent: number
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | verifyFreelancerCredentials | Walt.id |
| 2 | holdFullAmountInEscrow | Payment Gateway |
| 3 | activateContract | Medusa |
| 4 | notifyBothParties | PayloadCMS |
| 5 | loop per milestone: awaitDelivery (signal) | Medusa |
| 6 | awaitClientApproval (signal, timer: 72h) | Medusa |
| 7 | autoApproveIfTimeout | Medusa |
| 8 | releaseMilestonePayment | Payment Gateway |
| 9 | deductPlatformFee | Payment Gateway |
| 10 | sendPaymentConfirmation | PayloadCMS |
| 11 | finalMilestone: closeContract | Medusa |
| 12 | sendReviewRequests | PayloadCMS |
| 13 | createAccountingEntries | ERPNext |

**Signals:**
- `milestone.delivered` — freelancer submitted deliverable
- `milestone.approved` — client approved
- `milestone.revision_requested` — client requested changes
- `contract.disputed` — dispute raised
- `contract.cancelled` — mutual or unilateral cancellation

---

#### 4.3.19 TRAVEL & HOSPITALITY WORKFLOWS

---

##### WF-064: HotelReservationWorkflow

**Trigger:** `hotel.reservation_created`
**Task Queue:** `medusa-commerce`

```typescript
interface HotelReservationPayload {
  workflow_id: string
  tenant_id: string
  reservation_id: string
  hotel_property_id: string
  customer_id: string
  rooms: {
    room_id: string
    room_type: string
    rate_per_night: number
    guests: number
  }[]
  check_in: string
  check_out: string
  total_amount: number
  currency_code: string
  payment_method_id: string
  gateway: string
  cancellation_policy: 'free_24h' | 'non_refundable' | 'flexible'
  special_requests?: string[]
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | reserveRooms | Medusa |
| 2 | authorizePayment | Payment Gateway |
| 3 | sendBookingConfirmation | PayloadCMS |
| 4 | scheduleCheckInReminder (timer: check_in - 1d) | Temporal |
| 5 | sendCheckInReminder | PayloadCMS |
| 6 | awaitCheckIn (signal) | Medusa |
| 7 | capturePayment | Payment Gateway |
| 8 | if transfer_needed: createAirportTransfer | Fleetbase |
| 9 | awaitCheckOut (signal) | Medusa |
| 10 | processExtraCharges (minibar, room service) | Payment Gateway |
| 11 | createAccountingEntry | ERPNext |
| 12 | sendReviewRequest | PayloadCMS |

---

#### 4.3.20 REAL ESTATE WORKFLOWS

---

##### WF-065: PropertyTransactionWorkflow

**Trigger:** `property.offer_accepted`
**Task Queue:** `medusa-commerce`
**Duration:** Days to weeks

```typescript
interface PropertyTransactionPayload {
  workflow_id: string
  tenant_id: string
  property_transaction_id: string
  property_id: string
  transaction_type: 'sale' | 'lease'
  seller_id: string
  buyer_id: string
  agreed_price: number
  currency_code: string
  payment_method: 'full' | 'mortgage' | 'installments'
  requires_title_verification: boolean
  escrow_amount: number
  documents_required: string[]
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | holdEscrowDeposit | Payment Gateway |
| 2 | verifyBuyerIdentity | Walt.id |
| 3 | verifyPropertyOwnership | Walt.id |
| 4 | awaitDocumentUploads (signal) | Walt.id |
| 5 | verifyDocuments | Walt.id |
| 6 | awaitInspectionReport (signal) | Medusa |
| 7 | processFullPayment | Payment Gateway |
| 8 | transferPropertyCredential | Walt.id |
| 9 | updatePropertyAsset | ERPNext |
| 10 | createAccountingEntries (stamp duty, fees) | ERPNext |
| 11 | sendCompletionDocuments | PayloadCMS |
| 12 | recordAuditLog | Medusa |

---

#### 4.3.21 CROWDFUNDING WORKFLOWS

---

##### WF-066: CrowdfundingCampaignWorkflow

**Trigger:** `crowdfund.campaign_launched`
**Task Queue:** `medusa-commerce`
**Duration:** Days to months

```typescript
interface CrowdfundingPayload {
  workflow_id: string
  tenant_id: string
  campaign_id: string
  creator_id: string
  goal_amount: number
  currency_code: string
  deadline: string
  funding_model: 'all_or_nothing' | 'keep_what_you_raise'
  stretch_goals: { amount: number; description: string }[]
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | publishCampaign | Medusa |
| 2 | createCampaignPage | PayloadCMS |
| 3 | monitorPledges (signals: pledge.created) | Medusa |
| 4 | checkStretchGoals | Medusa |
| 5 | sendMilestoneNotifications | PayloadCMS |
| 6 | awaitDeadline (timer) | Temporal |
| 7 | if goal_met: holdAllPledges | Payment Gateway |
| 8 | if goal_met: chargeAllPledges | Payment Gateway |
| 9 | if goal_not_met AND all_or_nothing: refundAll | Payment Gateway |
| 10 | disburseFundsToCreator | Payment Gateway |
| 11 | beginRewardFulfillment | Medusa, Fleetbase |
| 12 | createAccountingEntry | ERPNext |
| 13 | recordAuditLog | Medusa |

---

#### 4.3.22 SOCIAL COMMERCE WORKFLOWS

---

##### WF-067: LiveSaleSessionWorkflow

**Trigger:** `live_sale.session_started`
**Task Queue:** `medusa-commerce`

```typescript
interface LiveSalePayload {
  workflow_id: string
  tenant_id: string
  session_id: string
  host_id: string
  vendor_id: string
  products: {
    product_id: string
    flash_price: number
    limited_quantity: number
  }[]
  start_time: string
  estimated_duration_minutes: number
  platform: 'native' | 'instagram' | 'tiktok' | 'youtube'
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | reserveFlashInventory | ERPNext |
| 2 | startSession | Medusa |
| 3 | monitorBids/Purchases (signals) | Medusa |
| 4 | processInstantPurchases | Payment Gateway |
| 5 | updateLiveInventoryCounts | Medusa |
| 6 | endSession (signal or timer) | Medusa |
| 7 | releaseUnpurchasedInventory | ERPNext |
| 8 | calculateHostCommission | Medusa |
| 9 | sendPurchaseConfirmations | PayloadCMS |
| 10 | createFulfillmentOrders | Fleetbase |

---

#### 4.3.23 GROCERY & FRESH COMMERCE WORKFLOWS

---

##### WF-068: GroceryFreshDeliveryWorkflow

**Trigger:** `order.placed` with perishable items
**Task Queue:** `fleetbase-logistics`

```typescript
interface GroceryDeliveryPayload {
  workflow_id: string
  tenant_id: string
  order_id: string
  customer_id: string
  items: {
    product_id: string
    sku: string
    quantity: number
    storage_type: 'ambient' | 'chilled' | 'frozen'
    shelf_life_hours: number
  }[]
  delivery_window: { start: string; end: string }
  substitution_preference: 'allow' | 'deny' | 'ask_first'
  warehouse_id: string
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | checkFreshInventory | ERPNext |
| 2 | handleSubstitutions (if out of stock) | Medusa |
| 3 | notifyCustomerOfSubstitutions | PayloadCMS |
| 4 | awaitSubstitutionApproval (signal) | Medusa |
| 5 | createPickList (temperature-sorted) | Fleetbase |
| 6 | assignColdChainVehicle | Fleetbase |
| 7 | startTemperatureMonitoring | Fleetbase |
| 8 | trackDelivery | Fleetbase |
| 9 | awaitDeliveryProof | Fleetbase |
| 10 | verifyTemperatureCompliance | Fleetbase |
| 11 | flagIfTemperatureBreach | Medusa, ERPNext |
| 12 | confirmDelivery | Medusa |

---

#### 4.3.24 AUTOMOTIVE COMMERCE WORKFLOWS

---

##### WF-069: VehicleServiceWorkflow

**Trigger:** `vehicle.service_booked`
**Task Queue:** `medusa-commerce`

```typescript
interface VehicleServicePayload {
  workflow_id: string
  tenant_id: string
  appointment_id: string
  customer_id: string
  vehicle_listing_id?: string
  service_type: 'maintenance' | 'repair' | 'inspection' | 'trade_in_appraisal'
  workshop_id: string
  scheduled_date: string
  estimated_hours: number
  parts_needed: { part_id: string; quantity: number }[]
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | reserveWorkshopSlot | Medusa |
| 2 | checkPartsAvailability | ERPNext |
| 3 | orderMissingParts (if needed) | ERPNext |
| 4 | sendAppointmentConfirmation | PayloadCMS |
| 5 | scheduleReminder (timer: date - 1d) | Temporal |
| 6 | awaitVehicleDropoff (signal) | Medusa |
| 7 | performInspection | Medusa |
| 8 | if trade_in: generateAppraisalReport | Medusa |
| 9 | awaitServiceCompletion (signal) | Medusa |
| 10 | generateInvoice | Medusa |
| 11 | processPayment | Payment Gateway |
| 12 | updateVehicleServiceHistory | Medusa |
| 13 | createAccountingEntry | ERPNext |

---

#### 4.3.25 HEALTHCARE COMMERCE WORKFLOWS

---

##### WF-070: HealthcareAppointmentWorkflow

**Trigger:** `healthcare.appointment_booked`
**Task Queue:** `medusa-commerce`

```typescript
interface HealthcareAppointmentPayload {
  workflow_id: string
  tenant_id: string
  appointment_id: string
  patient_id: string
  provider_id: string
  appointment_type: 'in_person' | 'telemedicine' | 'home_visit' | 'lab_test'
  scheduled_at: string
  duration_minutes: number
  insurance_policy_id?: string
  copay_amount?: number
  requires_prescription_history: boolean
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | verifyPatientIdentity | Walt.id |
| 2 | verifyProviderLicense | Walt.id |
| 3 | checkInsuranceCoverage (if insured) | ERPNext |
| 4 | collectCopay | Payment Gateway |
| 5 | blockProviderSlot | Medusa |
| 6 | sendAppointmentConfirmation | PayloadCMS |
| 7 | scheduleReminder (timer) | Temporal |
| 8 | if telemedicine: createVideoSession | Medusa |
| 9 | if lab_test: reserveLabSlot | Medusa |
| 10 | if home_visit: scheduleVisitRoute | Fleetbase |
| 11 | awaitCompletion (signal) | Medusa |
| 12 | if prescription: createPrescription | Medusa |
| 13 | if prescription: routeToPharmacy | Medusa, Fleetbase |
| 14 | processInsuranceClaim | ERPNext |
| 15 | sendPostVisitSummary | PayloadCMS |
| 16 | recordAuditLog (HIPAA-compliant) | Medusa |

---

#### 4.3.26 EDUCATION COMMERCE WORKFLOWS

---

##### WF-071: CourseEnrollmentWorkflow

**Trigger:** `course.enrollment_purchased`
**Task Queue:** `medusa-commerce`

```typescript
interface CourseEnrollmentPayload {
  workflow_id: string
  tenant_id: string
  enrollment_id: string
  course_id: string
  student_id: string
  plan: 'self_paced' | 'instructor_led' | 'cohort'
  price: number
  currency_code: string
  payment_intent_id: string
  gateway: string
  includes_certification: boolean
  scholarship_discount?: number
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | capturePayment | Payment Gateway |
| 2 | createEnrollment | Medusa |
| 3 | grantCourseAccess | PayloadCMS |
| 4 | sendWelcomeKit | PayloadCMS |
| 5 | if instructor_led: addToClassRoster | Medusa |
| 6 | trackProgress (continue-as-new, weekly checks) | Medusa |
| 7 | sendProgressReminders (timer) | PayloadCMS |
| 8 | awaitCompletion (signal) | Medusa |
| 9 | if includes_certification: generateCertificate | Medusa |
| 10 | issueVerifiableCertificate | Walt.id |
| 11 | sendCertificate | PayloadCMS |
| 12 | createAccountingEntry | ERPNext |

---

#### 4.3.27 CHARITY & DONATION WORKFLOWS

---

##### WF-072: DonationProcessingWorkflow

**Trigger:** `donation.submitted`
**Task Queue:** `medusa-commerce`

```typescript
interface DonationPayload {
  workflow_id: string
  tenant_id: string
  donation_id: string
  campaign_id: string
  donor_id: string
  amount: number
  currency_code: string
  is_recurring: boolean
  recurrence_interval?: 'weekly' | 'monthly' | 'yearly'
  is_anonymous: boolean
  tax_deductible: boolean
  payment_method_id: string
  gateway: string
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | processPayment | Payment Gateway |
| 2 | recordDonation | Medusa |
| 3 | updateCampaignTotal | Medusa |
| 4 | if tax_deductible: generateTaxReceipt | ERPNext |
| 5 | sendThankYouMessage | PayloadCMS |
| 6 | if recurring: setupRecurringPayment | Payment Gateway |
| 7 | notifyCampaignOrganizer | PayloadCMS |
| 8 | createAccountingEntry | ERPNext |
| 9 | recordAuditLog | Medusa |

---

#### 4.3.28 FINANCIAL PRODUCTS WORKFLOWS

---

##### WF-073: LoanApplicationWorkflow

**Trigger:** `loan.application_submitted`
**Task Queue:** `medusa-commerce`
**Duration:** Hours to days

```typescript
interface LoanApplicationPayload {
  workflow_id: string
  tenant_id: string
  loan_application_id: string
  applicant_id: string
  loan_type: 'personal' | 'business' | 'product_financing' | 'microfinance'
  requested_amount: number
  currency_code: string
  term_months: number
  purpose: string
  applicant_income?: number
  collateral_description?: string
  product_id?: string
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | verifyApplicantIdentity | Walt.id |
| 2 | checkCreditHistory | ERPNext |
| 3 | assessRisk (credit score, income ratio) | ERPNext |
| 4 | calculateInterestRate | ERPNext |
| 5 | generateLoanOffer | Medusa |
| 6 | sendOfferToApplicant | PayloadCMS |
| 7 | awaitAcceptance (signal, timer: 14d) | Medusa |
| 8 | if accepted: signLoanAgreement | Walt.id |
| 9 | disburseFunds | Payment Gateway |
| 10 | createLoanLedger | ERPNext |
| 11 | scheduleRepayments | Temporal |
| 12 | loop: collectRepayment (timer per installment) | Payment Gateway |
| 13 | handleLatePayment (if missed) | ERPNext, PayloadCMS |
| 14 | loanCompletion: closeLoanLedger | ERPNext |

---

#### 4.3.29 ADVERTISING WORKFLOWS

---

##### WF-074: AdCampaignWorkflow

**Trigger:** `ad.campaign_created`
**Task Queue:** `medusa-commerce`
**Duration:** Days to months

```typescript
interface AdCampaignPayload {
  workflow_id: string
  tenant_id: string
  campaign_id: string
  advertiser_id: string
  budget: number
  currency_code: string
  billing_model: 'cpm' | 'cpc' | 'cpa' | 'flat_rate'
  start_date: string
  end_date: string
  placements: {
    placement_id: string
    creative_id: string
    targeting: {
      node_ids?: string[]
      persona_ids?: string[]
      categories?: string[]
      demographics?: object
    }
  }[]
  payment_method_id: string
  gateway: string
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | validateCreatives | PayloadCMS |
| 2 | holdBudgetAuthorization | Payment Gateway |
| 3 | activatePlacements | Medusa |
| 4 | startImpressionTracking | Medusa |
| 5 | loop: dailyBillingCycle | Temporal |
| 6 | aggregateImpressions/Clicks | Medusa |
| 7 | chargeDaily (or deduct from hold) | Payment Gateway |
| 8 | sendPerformanceReport (weekly) | PayloadCMS |
| 9 | checkBudgetExhaustion | Medusa |
| 10 | endCampaign (timer: end_date) | Medusa |
| 11 | generateFinalReport | Medusa |
| 12 | createAdRevenueEntry | ERPNext |
| 13 | reconcileCharges | ERPNext |

---

#### 4.3.30 PARKING & TRANSPORT WORKFLOWS

---

##### WF-075: ParkingReservationWorkflow

**Trigger:** `parking.reservation_created`
**Task Queue:** `medusa-commerce`

```typescript
interface ParkingReservationPayload {
  workflow_id: string
  tenant_id: string
  reservation_id: string
  customer_id: string
  facility_id: string
  spot_id?: string
  start_time: string
  end_time: string
  vehicle_type: 'car' | 'motorcycle' | 'truck' | 'ev'
  ev_charging_requested: boolean
  amount: number
  currency_code: string
  payment_method_id: string
  gateway: string
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | reserveSpot | Medusa |
| 2 | authorizePayment | Payment Gateway |
| 3 | generateQREntryPass | Medusa |
| 4 | sendConfirmation | PayloadCMS |
| 5 | awaitEntry (signal: qr_scanned) | Medusa |
| 6 | if ev_charging: activateCharger | Medusa |
| 7 | awaitExit (signal: qr_scanned) | Medusa |
| 8 | calculateFinalAmount (with overstay if any) | Medusa |
| 9 | capturePayment | Payment Gateway |
| 10 | releaseSpot | Medusa |

---

#### 4.3.31 UTILITY BILL PAYMENT WORKFLOWS

---

##### WF-076: UtilityBillPaymentWorkflow

**Trigger:** `utility.bill_due` OR `utility.payment_requested`
**Task Queue:** `medusa-commerce`

```typescript
interface UtilityBillPayload {
  workflow_id: string
  tenant_id: string
  utility_payment_id: string
  customer_id: string
  utility_account_id: string
  provider_id: string
  bill_id: string
  amount: number
  currency_code: string
  due_date: string
  auto_pay_enabled: boolean
  payment_method_id: string
  gateway: string
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | validateBillDetails | Medusa |
| 2 | processPayment | Payment Gateway |
| 3 | notifyUtilityProvider | Medusa (API) |
| 4 | updateBillStatus | Medusa |
| 5 | sendPaymentReceipt | PayloadCMS |
| 6 | createAccountingEntry | ERPNext |
| 7 | if auto_pay: scheduleNextPayment (timer) | Temporal |

---

#### 4.3.32 GOVERNMENT & MUNICIPAL SERVICE WORKFLOWS

---

##### WF-077: MunicipalServiceApplicationWorkflow

**Trigger:** `municipal.application_submitted`
**Task Queue:** `medusa-commerce`

```typescript
interface MunicipalServicePayload {
  workflow_id: string
  tenant_id: string
  application_id: string
  service_id: string
  citizen_id: string
  service_type: 'permit' | 'registration' | 'license' | 'certificate' | 'fine_payment'
  fee_amount: number
  currency_code: string
  required_documents: string[]
  node_id: string
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | verifyCitizenIdentity | Walt.id |
| 2 | validateApplicationData | Medusa |
| 3 | collectFee | Payment Gateway |
| 4 | awaitDocumentUploads (signal) | Walt.id |
| 5 | verifyDocuments | Walt.id |
| 6 | routeForApproval (per node governance) | Medusa |
| 7 | awaitApproval (signal, timer: 30d) | Medusa |
| 8 | if approved: issuePermitCredential | Walt.id |
| 9 | if approved: generatePermitDocument | PayloadCMS |
| 10 | notifyCitizen | PayloadCMS |
| 11 | createRevenueEntry | ERPNext |
| 12 | recordAuditLog | Medusa |

---

#### 4.3.33 MEMBERSHIP LIFECYCLE WORKFLOWS

---

##### WF-078: MembershipLifecycleWorkflow

**Trigger:** `membership.purchased`
**Task Queue:** `medusa-commerce`
**Duration:** Long-running (continue-as-new)

```typescript
interface MembershipLifecyclePayload {
  workflow_id: string
  tenant_id: string
  membership_card_id: string
  customer_id: string
  plan_id: string
  tier: string
  billing_interval: 'monthly' | 'quarterly' | 'yearly' | 'lifetime'
  price: number
  currency_code: string
  payment_method_id: string
  gateway: string
  benefits: string[]
  points_earned_on_purchase: number
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | capturePayment | Payment Gateway |
| 2 | activateMembership | Medusa |
| 3 | issueDigitalMembershipCard | Walt.id |
| 4 | grantBenefits (discounts, access, priority) | Medusa |
| 5 | creditWelcomePoints | Payment Gateway (wallet) |
| 6 | sendWelcomeKit | PayloadCMS |
| 7 | loop: scheduleBillingCycle (timer) | Temporal |
| 8 | chargeRenewal | Payment Gateway |
| 9 | evaluateTierUpgrade (points-based) | Medusa |
| 10 | sendRenewalConfirmation | PayloadCMS |
| 11 | scheduleExpiryReminder (if non-renewal) | Temporal |
| 12 | createAccountingEntry | ERPNext |

---

#### 4.3.34 PET SERVICES WORKFLOWS

---

##### WF-079: PetServiceWorkflow

**Trigger:** `pet.service_booked`
**Task Queue:** `medusa-commerce`

```typescript
interface PetServicePayload {
  workflow_id: string
  tenant_id: string
  booking_id: string
  pet_profile_id: string
  owner_id: string
  service_type: 'grooming' | 'boarding' | 'walking' | 'veterinary' | 'training'
  provider_id: string
  scheduled_at: string
  duration_minutes: number
  price: number
  currency_code: string
  pet_info: {
    species: string
    breed: string
    weight_kg: number
    vaccination_status: string
    special_needs?: string
  }
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | verifyVaccinationStatus | Walt.id |
| 2 | capturePayment | Payment Gateway |
| 3 | blockProviderSlot | Medusa |
| 4 | sendBookingConfirmation | PayloadCMS |
| 5 | scheduleReminder (timer) | Temporal |
| 6 | if walking: assignWalker | Fleetbase |
| 7 | if walking: trackWalk (GPS) | Fleetbase |
| 8 | awaitServiceCompletion (signal) | Medusa |
| 9 | sendServiceSummary (with photos) | PayloadCMS |
| 10 | sendReviewRequest | PayloadCMS |

---

#### 4.3.35 FITNESS & WELLNESS WORKFLOWS

---

##### WF-080: FitnessClassWorkflow

**Trigger:** `fitness.class_enrolled`
**Task Queue:** `medusa-commerce`

```typescript
interface FitnessClassPayload {
  workflow_id: string
  tenant_id: string
  enrollment_id: string
  class_id: string
  customer_id: string
  fitness_center_id: string
  class_type: 'yoga' | 'hiit' | 'swimming' | 'personal_training' | 'group_fitness'
  scheduled_at: string
  instructor_id: string
  price: number
  currency_code: string
  membership_card_id?: string
  is_included_in_membership: boolean
  waitlisted: boolean
}
```

**Steps:**

| Step | Activity | System |
|------|----------|--------|
| 1 | if waitlisted: addToWaitlist | Medusa |
| 2 | if waitlisted: awaitSpotOpening (signal) | Medusa |
| 3 | if not_included: chargeClassFee | Payment Gateway |
| 4 | confirmEnrollment | Medusa |
| 5 | sendConfirmation | PayloadCMS |
| 6 | scheduleReminder (timer: class - 2h) | Temporal |
| 7 | sendReminder | PayloadCMS |
| 8 | awaitCheckIn (signal) | Medusa |
| 9 | if noShow after 15m: markNoShow | Medusa |
| 10 | if noShow: openSpotForWaitlist | Medusa |
| 11 | sendClassSummary | PayloadCMS |

---

### 4.4 Signal & Query Contracts

This section documents all Temporal signals and queries used across the 80 workflows. Signals are async messages sent to running workflows to trigger state transitions; queries are synchronous read-only inspections of workflow state.

#### 4.4.1 Signal Naming Convention

All signals follow the `{domain}.{entity}.{event}` convention. Every signal contract specifies:

| Field | Description |
|-------|-------------|
| **Signal name** | Dot-separated identifier following `{domain}.{entity}.{event}` |
| **Payload interface** | TypeScript interface describing the data carried |
| **Handling workflows** | Which of the 80 workflows listen for this signal |
| **Behavior** | Expected state transition when the signal is received |

---

#### 4.4.2 Payment Signals

| Signal Name | Handling Workflows | Behavior |
|-------------|-------------------|----------|
| `payment.intent.captured` | OrderPlacement, SubscriptionBilling, AuctionLifecycle, EventTicketPurchase | Mark payment as captured; advance order to fulfillment |
| `payment.intent.failed` | OrderPlacement, SubscriptionBilling, RentalLifecycle | Trigger retry or compensation depending on retry policy |
| `payment.intent.requires_action` | OrderPlacement, SubscriptionBilling | Pause workflow; send customer notification with action URL |
| `payment.refund.completed` | RefundProcessing, ReturnProcessing, WarrantyClaimProcessing | Confirm refund in Medusa; update ERP ledger |
| `payment.refund.failed` | RefundProcessing, ReturnProcessing | Escalate to manual review; create support ticket |
| `payment.transfer.completed` | VendorSettlement, CommissionPayout, FreelanceEscrowRelease | Mark payout as settled; update vendor balance |
| `payment.escrow.released` | AuctionLifecycle, FreelanceContractLifecycle, RentalLifecycle | Release held funds to seller/provider; close escrow record |

```typescript
interface PaymentCapturedSignal {
  payment_intent_id: string
  amount: number
  currency_code: string
  gateway: string
  captured_at: string
  metadata?: Record<string, unknown>
}

interface PaymentFailedSignal {
  payment_intent_id: string
  error_code: string
  error_message: string
  decline_reason?: string
  gateway: string
  failed_at: string
  retryable: boolean
}

interface PaymentRequiresActionSignal {
  payment_intent_id: string
  action_type: 'redirect' | '3ds' | 'otp' | 'manual_review'
  action_url?: string
  expires_at: string
  gateway: string
}

interface PaymentRefundCompletedSignal {
  refund_id: string
  payment_intent_id: string
  amount: number
  currency_code: string
  reason: string
  refunded_at: string
}

interface PaymentRefundFailedSignal {
  refund_id: string
  payment_intent_id: string
  error_code: string
  error_message: string
  failed_at: string
}

interface PaymentTransferCompletedSignal {
  transfer_id: string
  source_account: string
  destination_account: string
  amount: number
  currency_code: string
  transferred_at: string
}

interface PaymentEscrowReleasedSignal {
  escrow_id: string
  amount: number
  currency_code: string
  released_to: string
  released_at: string
  release_reason: 'completed' | 'dispute_resolved' | 'timeout'
}
```

---

#### 4.4.3 Delivery Signals

| Signal Name | Handling Workflows | Behavior |
|-------------|-------------------|----------|
| `delivery.order.picked_up` | OrderFulfillment, GroceryDelivery, RestaurantOrder | Update tracking status; notify customer |
| `delivery.order.in_transit` | OrderFulfillment, GroceryDelivery, RestaurantOrder | Update ETA; broadcast real-time position |
| `delivery.order.delivered` | OrderFulfillment, GroceryDelivery, RestaurantOrder | Complete delivery step; trigger settlement |
| `delivery.order.failed` | OrderFulfillment, GroceryDelivery | Trigger re-dispatch or compensation; notify customer |
| `delivery.driver.assigned` | OrderFulfillment, GroceryDelivery, RestaurantOrder | Store driver info; enable live tracking |
| `delivery.proof.submitted` | OrderFulfillment, RentalLifecycle | Attach proof-of-delivery media; advance to completion |

```typescript
interface DeliveryPickedUpSignal {
  delivery_order_id: string
  driver_id: string
  driver_name: string
  pickup_location: { lat: number; lng: number }
  picked_up_at: string
  estimated_delivery_at: string
}

interface DeliveryInTransitSignal {
  delivery_order_id: string
  driver_id: string
  current_position: { lat: number; lng: number }
  speed_kmh?: number
  estimated_delivery_at: string
  updated_at: string
}

interface DeliveryDeliveredSignal {
  delivery_order_id: string
  driver_id: string
  delivered_at: string
  delivery_location: { lat: number; lng: number }
  signature_url?: string
  photo_url?: string
  recipient_name?: string
}

interface DeliveryFailedSignal {
  delivery_order_id: string
  driver_id: string
  failure_reason: 'address_not_found' | 'recipient_unavailable' | 'access_denied' | 'vehicle_breakdown' | 'weather' | 'other'
  failed_at: string
  notes?: string
  retry_eligible: boolean
}

interface DeliveryDriverAssignedSignal {
  delivery_order_id: string
  driver_id: string
  driver_name: string
  driver_phone: string
  vehicle_type: string
  vehicle_plate: string
  estimated_pickup_at: string
}

interface DeliveryProofSubmittedSignal {
  delivery_order_id: string
  proof_type: 'photo' | 'signature' | 'pin_code' | 'barcode_scan'
  proof_url: string
  submitted_at: string
  verified: boolean
}
```

---

#### 4.4.4 Identity Signals

| Signal Name | Handling Workflows | Behavior |
|-------------|-------------------|----------|
| `kyc.verification.approved` | VendorOnboarding, CustomerVerification, CompanyApproval | Activate account; issue credentials |
| `kyc.verification.rejected` | VendorOnboarding, CustomerVerification, CompanyApproval | Notify applicant; offer re-submission or appeal |
| `kyc.document.uploaded` | VendorOnboarding, CustomerVerification | Start verification activity; update progress |
| `credential.issued` | VendorOnboarding, ProfessionalLicensing | Store credential reference; enable scoped permissions |
| `credential.revoked` | ComplianceEnforcement, VendorOnboarding | Disable associated permissions; notify affected parties |

```typescript
interface KYCVerificationApprovedSignal {
  verification_id: string
  entity_type: 'vendor' | 'customer' | 'company' | 'driver'
  entity_id: string
  verification_level: 'basic' | 'enhanced' | 'full'
  approved_at: string
  verified_fields: string[]
  expiry_date?: string
}

interface KYCVerificationRejectedSignal {
  verification_id: string
  entity_type: 'vendor' | 'customer' | 'company' | 'driver'
  entity_id: string
  rejection_reason: string
  rejection_code: string
  rejected_at: string
  resubmission_allowed: boolean
  required_documents?: string[]
}

interface KYCDocumentUploadedSignal {
  document_id: string
  verification_id: string
  document_type: 'passport' | 'national_id' | 'drivers_license' | 'proof_of_address' | 'business_license' | 'tax_certificate'
  file_url: string
  uploaded_at: string
}

interface CredentialIssuedSignal {
  credential_id: string
  did: string
  schema_id: string
  credential_type: string
  issued_at: string
  valid_until?: string
  claims: Record<string, unknown>
}

interface CredentialRevokedSignal {
  credential_id: string
  did: string
  revocation_reason: string
  revoked_at: string
  revoked_by: string
}
```

---

#### 4.4.5 Booking Signals

| Signal Name | Handling Workflows | Behavior |
|-------------|-------------------|----------|
| `booking.customer.checked_in` | BookingLifecycle, FitnessClassBooking | Mark booking as active; start service timer |
| `booking.completed` | BookingLifecycle, FitnessClassBooking, HealthcareAppointment | Complete service; trigger review request and settlement |
| `booking.no_show` | BookingLifecycle, FitnessClassBooking | Apply no-show fee; release slot for waitlist |
| `booking.cancelled` | BookingLifecycle, FitnessClassBooking, HealthcareAppointment | Process cancellation fee or full refund; release slot |

```typescript
interface BookingCheckedInSignal {
  booking_id: string
  customer_id: string
  checked_in_at: string
  checked_in_by: 'customer' | 'provider' | 'system'
  location?: { lat: number; lng: number }
}

interface BookingCompletedSignal {
  booking_id: string
  completed_at: string
  duration_minutes: number
  provider_id: string
  service_notes?: string
  rating_requested: boolean
}

interface BookingNoShowSignal {
  booking_id: string
  customer_id: string
  scheduled_at: string
  grace_period_minutes: number
  no_show_fee?: number
  marked_at: string
}

interface BookingCancelledSignal {
  booking_id: string
  cancelled_by: 'customer' | 'provider' | 'system'
  cancellation_reason: string
  cancelled_at: string
  refund_amount?: number
  refund_percentage?: number
  within_free_cancellation: boolean
}
```

---

#### 4.4.6 Approval Signals

| Signal Name | Handling Workflows | Behavior |
|-------------|-------------------|----------|
| `approval.request.approved` | B2BPurchaseApproval, VendorOnboarding, CompanyApproval | Advance to next step (order placement, account activation) |
| `approval.request.rejected` | B2BPurchaseApproval, VendorOnboarding, CompanyApproval | Notify requester; optionally allow re-submission |
| `approval.request.escalated` | B2BPurchaseApproval, CompanyApproval | Route to higher-level approver; extend approval deadline |

```typescript
interface ApprovalApprovedSignal {
  approval_request_id: string
  approved_by: string
  approved_at: string
  approval_level: number
  comments?: string
  conditions?: string[]
}

interface ApprovalRejectedSignal {
  approval_request_id: string
  rejected_by: string
  rejected_at: string
  rejection_reason: string
  resubmission_allowed: boolean
}

interface ApprovalEscalatedSignal {
  approval_request_id: string
  escalated_by: string
  escalated_to: string
  escalated_at: string
  escalation_reason: 'timeout' | 'amount_threshold' | 'manual' | 'policy'
  new_deadline: string
}
```

---

#### 4.4.7 Auction Signals

| Signal Name | Handling Workflows | Behavior |
|-------------|-------------------|----------|
| `bid.placed` | AuctionLifecycle | Validate bid; update current price; notify outbid parties |
| `bid.retracted` | AuctionLifecycle | Remove bid; recalculate current winning bid |
| `auction.cancelled` | AuctionLifecycle | Refund deposits; notify all bidders; close auction |
| `buy_now.triggered` | AuctionLifecycle | End auction immediately; process instant purchase |

```typescript
interface BidPlacedSignal {
  auction_id: string
  lot_id: string
  bidder_id: string
  bid_amount: number
  currency_code: string
  bid_type: 'standard' | 'proxy' | 'sealed'
  max_proxy_amount?: number
  placed_at: string
}

interface BidRetractedSignal {
  auction_id: string
  lot_id: string
  bid_id: string
  bidder_id: string
  retraction_reason: string
  retracted_at: string
}

interface AuctionCancelledSignal {
  auction_id: string
  cancelled_by: string
  cancellation_reason: string
  cancelled_at: string
  refund_deposits: boolean
}

interface BuyNowTriggeredSignal {
  auction_id: string
  lot_id: string
  buyer_id: string
  buy_now_price: number
  currency_code: string
  triggered_at: string
}
```

---

#### 4.4.8 Rental Signals

| Signal Name | Handling Workflows | Behavior |
|-------------|-------------------|----------|
| `rental.returned` | RentalLifecycle | Inspect item; reconcile deposit; close rental |
| `rental.extended` | RentalLifecycle | Charge extension fee; update return deadline |
| `rental.damaged` | RentalLifecycle | Assess damage; charge repair costs from deposit |
| `rental.early_termination` | RentalLifecycle | Calculate early termination fee; process partial refund |

```typescript
interface RentalReturnedSignal {
  rental_agreement_id: string
  returned_at: string
  condition: 'excellent' | 'good' | 'fair' | 'damaged'
  inspection_notes?: string
  deposit_refund_amount: number
}

interface RentalExtendedSignal {
  rental_agreement_id: string
  original_end_date: string
  new_end_date: string
  extension_fee: number
  currency_code: string
  extended_at: string
}

interface RentalDamagedSignal {
  rental_agreement_id: string
  damage_report_id: string
  damage_description: string
  repair_cost_estimate: number
  photo_urls: string[]
  reported_at: string
}

interface RentalEarlyTerminationSignal {
  rental_agreement_id: string
  termination_date: string
  original_end_date: string
  termination_fee: number
  refund_amount: number
  reason: string
}
```

---

#### 4.4.9 Gig Signals

| Signal Name | Handling Workflows | Behavior |
|-------------|-------------------|----------|
| `milestone.delivered` | FreelanceContractLifecycle | Notify client; start review timer |
| `milestone.approved` | FreelanceContractLifecycle | Release milestone payment from escrow |
| `milestone.revision_requested` | FreelanceContractLifecycle | Notify freelancer; reset delivery deadline |
| `contract.disputed` | FreelanceContractLifecycle | Freeze escrow; initiate dispute resolution |
| `contract.cancelled` | FreelanceContractLifecycle | Process partial payment for completed milestones; release remaining escrow |

```typescript
interface MilestoneDeliveredSignal {
  contract_id: string
  milestone_id: string
  freelancer_id: string
  deliverable_urls: string[]
  notes?: string
  delivered_at: string
}

interface MilestoneApprovedSignal {
  contract_id: string
  milestone_id: string
  approved_by: string
  approved_at: string
  payment_amount: number
  rating?: number
  feedback?: string
}

interface MilestoneRevisionRequestedSignal {
  contract_id: string
  milestone_id: string
  requested_by: string
  revision_notes: string
  new_deadline?: string
  revision_number: number
  requested_at: string
}

interface ContractDisputedSignal {
  contract_id: string
  disputed_by: 'client' | 'freelancer'
  dispute_reason: string
  dispute_category: 'quality' | 'deadline' | 'scope' | 'payment' | 'communication' | 'other'
  evidence_urls?: string[]
  disputed_at: string
}

interface ContractCancelledSignal {
  contract_id: string
  cancelled_by: 'client' | 'freelancer' | 'system'
  cancellation_reason: string
  completed_milestones: number
  total_milestones: number
  refund_amount: number
  cancelled_at: string
}
```

---

#### 4.4.10 Subscription Signals

| Signal Name | Handling Workflows | Behavior |
|-------------|-------------------|----------|
| `subscription.payment.received` | SubscriptionLifecycle, SubscriptionBilling | Extend current period; reset retry count |
| `subscription.payment.failed` | SubscriptionLifecycle, SubscriptionBilling | Enter dunning flow; send payment failure notification |
| `subscription.cancelled` | SubscriptionLifecycle | Schedule end-of-period deactivation; process prorated refund if applicable |
| `subscription.paused` | SubscriptionLifecycle | Freeze billing; retain access until pause end date |
| `subscription.resumed` | SubscriptionLifecycle | Re-activate billing; calculate prorated charge |

```typescript
interface SubscriptionPaymentReceivedSignal {
  subscription_id: string
  billing_cycle_id: string
  amount: number
  currency_code: string
  payment_method: string
  received_at: string
  next_billing_date: string
}

interface SubscriptionPaymentFailedSignal {
  subscription_id: string
  billing_cycle_id: string
  amount: number
  currency_code: string
  failure_reason: string
  retry_count: number
  max_retries: number
  next_retry_at?: string
  failed_at: string
}

interface SubscriptionCancelledSignal {
  subscription_id: string
  cancelled_by: 'customer' | 'admin' | 'system'
  cancellation_reason: string
  effective_date: string
  immediate: boolean
  prorated_refund?: number
  cancelled_at: string
}

interface SubscriptionPausedSignal {
  subscription_id: string
  paused_by: 'customer' | 'admin'
  pause_reason?: string
  pause_start: string
  pause_end?: string
  max_pause_days: number
  paused_at: string
}

interface SubscriptionResumedSignal {
  subscription_id: string
  resumed_at: string
  next_billing_date: string
  prorated_charge?: number
  paused_days: number
}
```

---

#### 4.4.11 Signal Registry Summary

| Domain | Signal Count | Primary Workflows |
|--------|-------------|-------------------|
| Payment | 7 | OrderPlacement, SubscriptionBilling, RefundProcessing, VendorSettlement |
| Delivery | 6 | OrderFulfillment, GroceryDelivery, RestaurantOrder |
| Identity | 5 | VendorOnboarding, CustomerVerification, CompanyApproval |
| Booking | 4 | BookingLifecycle, FitnessClassBooking, HealthcareAppointment |
| Approval | 3 | B2BPurchaseApproval, VendorOnboarding, CompanyApproval |
| Auction | 4 | AuctionLifecycle |
| Rental | 4 | RentalLifecycle |
| Gig | 5 | FreelanceContractLifecycle |
| Subscription | 5 | SubscriptionLifecycle, SubscriptionBilling |
| **Total** | **43** | |

---

#### 4.4.12 Query Contracts

Queries are synchronous, read-only operations that inspect the current state of a running workflow without affecting it. They are used by APIs, dashboards, and other workflows to retrieve real-time status.

| Query Name | Target Workflows | Description |
|------------|-----------------|-------------|
| `getWorkflowStatus` | All 80 workflows | Returns current state, step, and progress percentage |
| `getOrderProgress` | OrderPlacement, OrderFulfillment | Order-specific progress with fulfillment status |
| `getDeliveryTracking` | OrderFulfillment, GroceryDelivery, RestaurantOrder | Real-time delivery position and ETA |
| `getPaymentStatus` | OrderPlacement, SubscriptionBilling, RefundProcessing | Payment state across gateways |
| `getSubscriptionState` | SubscriptionLifecycle, SubscriptionBilling | Current period, renewal date, billing status |
| `getAuctionState` | AuctionLifecycle | Current bid, time remaining, bidder count |
| `getBookingState` | BookingLifecycle, FitnessClassBooking | Booking status, check-in status, provider info |
| `getComplianceStatus` | VendorOnboarding, CustomerVerification | Verification state, pending documents |

```typescript
interface WorkflowStatusQueryResult {
  workflow_id: string
  workflow_type: string
  current_state: string
  current_step: number
  total_steps: number
  progress_percentage: number
  started_at: string
  last_activity_at: string
  tenant_id: string
  error?: {
    code: string
    message: string
    occurred_at: string
  }
}

interface OrderProgressQueryResult {
  order_id: string
  workflow_id: string
  status: 'pending' | 'payment_processing' | 'paid' | 'fulfillment_pending' | 'shipped' | 'in_transit' | 'delivered' | 'completed' | 'cancelled' | 'refunded'
  payment_status: 'pending' | 'captured' | 'failed' | 'refunded' | 'partially_refunded'
  fulfillment_status: 'not_started' | 'picking' | 'packing' | 'shipped' | 'in_transit' | 'delivered'
  items_fulfilled: number
  items_total: number
  estimated_delivery?: string
  tracking_numbers: string[]
  current_step_description: string
}

interface DeliveryTrackingQueryResult {
  delivery_order_id: string
  order_id: string
  status: 'pending' | 'driver_assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'failed'
  driver?: {
    id: string
    name: string
    phone: string
    vehicle_type: string
    vehicle_plate: string
  }
  current_position?: { lat: number; lng: number }
  pickup_location: { lat: number; lng: number }
  delivery_location: { lat: number; lng: number }
  estimated_arrival: string
  distance_remaining_km?: number
  proof_of_delivery?: {
    type: string
    url: string
    submitted_at: string
  }
}

interface PaymentStatusQueryResult {
  payment_intent_id: string
  order_id?: string
  subscription_id?: string
  status: 'pending' | 'requires_action' | 'processing' | 'captured' | 'failed' | 'cancelled' | 'refunded'
  amount: number
  currency_code: string
  gateway: string
  payment_method_type: string
  attempts: number
  last_error?: string
  captured_at?: string
  refund_amount?: number
}

interface SubscriptionStateQueryResult {
  subscription_id: string
  plan_id: string
  plan_name: string
  status: 'active' | 'paused' | 'past_due' | 'cancelled' | 'expired' | 'trialing'
  current_period_start: string
  current_period_end: string
  next_billing_date?: string
  billing_amount: number
  currency_code: string
  retry_count: number
  pause_info?: {
    paused_at: string
    resume_at?: string
  }
  cancellation_info?: {
    cancelled_at: string
    effective_date: string
    reason: string
  }
}

interface AuctionStateQueryResult {
  auction_id: string
  status: 'upcoming' | 'active' | 'ending_soon' | 'ended' | 'cancelled'
  auction_type: 'english' | 'dutch' | 'sealed' | 'reverse'
  current_bid: number
  starting_price: number
  reserve_price?: number
  buy_now_price?: number
  currency_code: string
  bidder_count: number
  bid_count: number
  time_remaining_seconds: number
  leading_bidder_id?: string
  ends_at: string
}

interface BookingStateQueryResult {
  booking_id: string
  status: 'pending' | 'confirmed' | 'checked_in' | 'in_progress' | 'completed' | 'no_show' | 'cancelled'
  service_name: string
  provider: {
    id: string
    name: string
    phone?: string
  }
  scheduled_at: string
  duration_minutes: number
  check_in_status: 'pending' | 'checked_in' | 'no_show'
  location?: string
  cancellation_deadline?: string
}

interface ComplianceStatusQueryResult {
  entity_type: 'vendor' | 'customer' | 'company' | 'driver'
  entity_id: string
  verification_status: 'not_started' | 'documents_pending' | 'under_review' | 'approved' | 'rejected' | 'expired'
  verification_level: 'basic' | 'enhanced' | 'full'
  documents: {
    type: string
    status: 'pending' | 'uploaded' | 'verified' | 'rejected' | 'expired'
    uploaded_at?: string
    verified_at?: string
    expiry_date?: string
    rejection_reason?: string
  }[]
  credentials_issued: {
    credential_id: string
    credential_type: string
    issued_at: string
    valid_until?: string
    status: 'active' | 'revoked' | 'expired'
  }[]
  overall_progress_percentage: number
  next_action?: string
}
```

---

### 4.5 Error Handling & Retry Policies

This section expands on the design principles from Section 4.2 with comprehensive error handling, retry, circuit breaker, and compensation documentation for all 80 Temporal workflows.

#### 4.5.1 Error Taxonomy

Every error thrown within a Temporal activity or workflow is classified into one of the following types. This taxonomy drives automatic retry decisions, alerting, and compensation logic.

| # | Error Class | HTTP Equiv. | Retryable | Default Retry Policy | Compensation Action | Alert Level |
|---|-------------|-------------|-----------|----------------------|---------------------|-------------|
| 1 | `NetworkError` | 503 | Yes | 5 retries, 1s→30s exponential | None (transient) | warn |
| 2 | `TimeoutError` | 504 | Yes | 3 retries, 5s→60s exponential | None (transient) | warn |
| 3 | `RateLimitError` | 429 | Yes | 5 retries, respect `Retry-After` header | None (throttle) | info |
| 4 | `ServiceUnavailableError` | 503 | Yes | 5 retries, 10s→120s exponential | Fallback to secondary provider if available | warn |
| 5 | `InvalidArgumentError` | 400 | No | No retry (non-retryable) | Return validation errors to caller | info |
| 6 | `InsufficientFundsError` | 402 | Conditional | Retry after customer notification (timer: 24h) | Cancel order if not resolved in 72h | warn |
| 7 | `AuthenticationError` | 401 | Conditional | Retry once after token refresh | Refresh credentials; escalate if persistent | critical |
| 8 | `FraudDetectedError` | 403 | No | No retry | Block transaction; flag account; notify compliance | critical |
| 9 | `DataConflictError` | 409 | Yes | 3 retries with optimistic locking | Reload and merge; escalate if unresolvable | warn |
| 10 | `CredentialExpiredError` | 401 | Yes | 1 retry after credential renewal | Re-issue credential via Walt.id; re-verify | warn |
| 11 | `InventoryUnavailableError` | 409 | Conditional | Retry after 5m (inventory may be replenished) | Suggest alternatives; offer backorder | info |
| 12 | `DeliveryZoneUnavailableError` | 422 | No | No retry | Notify customer; suggest alternative delivery method | info |
| 13 | `ProviderUnavailableError` | 503 | Yes | 3 retries, 30s→300s exponential | Auto-assign alternative provider | warn |
| 14 | `QuotaExceededError` | 429 | Conditional | Retry after quota reset (timer-based) | Notify tenant admin; suggest plan upgrade | warn |
| 15 | `PaymentDeclinedError` | 402 | No | No retry (hard decline) | Notify customer; request alternative payment method | info |
| 16 | `DuplicateRequestError` | 409 | No | No retry (idempotency) | Return existing result | info |
| 17 | `SchemaValidationError` | 422 | No | No retry | Log validation failures; return detailed field errors | info |
| 18 | `TenantSuspendedError` | 403 | No | No retry | Block all operations; notify platform admin | critical |
| 19 | `GDPRDeletionError` | 500 | Yes | 3 retries, 60s intervals | Queue for manual deletion; notify DPO | critical |
| 20 | `CircuitBreakerOpenError` | 503 | Yes | Wait for circuit recovery (30s–300s) | Use fallback/cached response if available | warn |
| 21 | `ExternalAPIError` | 502 | Yes | 3 retries, 5s→60s exponential | None (transient) | warn |
| 22 | `ConfigurationError` | 500 | No | No retry | Alert platform team; block affected operations | critical |
| 23 | `ConcurrencyLimitError` | 429 | Yes | Retry after slot available (queue-based) | None (backpressure) | info |
| 24 | `DataIntegrityError` | 500 | No | No retry | Quarantine record; alert data team | critical |
| 25 | `ComplianceViolationError` | 403 | No | No retry | Block operation; create compliance ticket | critical |

```typescript
interface TemporalActivityError {
  error_class: string
  message: string
  http_equivalent: number
  retryable: boolean
  retry_policy?: RetryPolicyConfig
  compensation_action?: string
  alert_level: 'info' | 'warn' | 'critical'
  context: {
    workflow_id: string
    activity_name: string
    tenant_id: string
    timestamp: string
    attempt_number: number
  }
  cause?: {
    system: 'medusa' | 'erpnext' | 'fleetbase' | 'waltid' | 'stripe' | 'payloadcms'
    external_error_code?: string
    external_message?: string
  }
}

interface RetryPolicyConfig {
  max_attempts: number
  initial_interval_ms: number
  max_interval_ms: number
  backoff_coefficient: number
  non_retryable_error_types?: string[]
  retry_timeout_ms?: number
}
```

---

#### 4.5.2 Retry Policies by Domain

Each external system has different reliability characteristics and SLAs, requiring tailored retry configurations.

##### Payment Gateway (Stripe / Tap / HyperPay)

| Operation | Max Attempts | Initial Interval | Max Interval | Backoff | Non-Retryable Errors |
|-----------|-------------|-------------------|--------------|---------|---------------------|
| Payment Capture | 5 | 1s | 30s | 2.0 | PaymentDeclinedError, FraudDetectedError |
| Refund Processing | 3 | 5s | 60s | 2.0 | InvalidArgumentError |
| Transfer / Payout | 3 | 10s | 120s | 2.0 | InsufficientFundsError |
| Webhook Verification | 1 | — | — | — | All (single attempt) |
| Account Creation | 3 | 5s | 60s | 2.0 | DuplicateRequestError |

```typescript
const paymentRetryPolicy: RetryPolicyConfig = {
  max_attempts: 5,
  initial_interval_ms: 1000,
  max_interval_ms: 30000,
  backoff_coefficient: 2.0,
  non_retryable_error_types: [
    'PaymentDeclinedError',
    'FraudDetectedError',
    'InvalidArgumentError',
    'DuplicateRequestError',
  ],
}
```

##### Logistics (Fleetbase)

| Operation | Max Attempts | Initial Interval | Max Interval | Backoff | Non-Retryable Errors |
|-----------|-------------|-------------------|--------------|---------|---------------------|
| Create Delivery Order | 3 | 10s | 120s | 2.0 | DeliveryZoneUnavailableError |
| Assign Driver | 5 | 30s | 300s | 2.0 | — |
| Update Tracking | 3 | 5s | 60s | 2.0 | — |
| Cancel Delivery | 2 | 5s | 30s | 2.0 | — |
| Get ETA | 3 | 5s | 30s | 1.5 | — |

```typescript
const logisticsRetryPolicy: RetryPolicyConfig = {
  max_attempts: 3,
  initial_interval_ms: 10000,
  max_interval_ms: 120000,
  backoff_coefficient: 2.0,
  non_retryable_error_types: ['DeliveryZoneUnavailableError'],
}
```

##### Identity (Walt.id)

| Operation | Max Attempts | Initial Interval | Max Interval | Backoff | Non-Retryable Errors |
|-----------|-------------|-------------------|--------------|---------|---------------------|
| Issue Credential | 3 | 5s | 60s | 2.0 | SchemaValidationError |
| Verify Identity | 2 | 10s | 60s | 2.0 | — |
| Revoke Credential | 3 | 5s | 30s | 2.0 | — |
| KYC Document Check | 1* | — | — | — | — |

\* KYC checks use Temporal timers (await up to 7 days) rather than activity retries, as verification is an async human/ML process.

```typescript
const identityRetryPolicy: RetryPolicyConfig = {
  max_attempts: 3,
  initial_interval_ms: 5000,
  max_interval_ms: 60000,
  backoff_coefficient: 2.0,
  non_retryable_error_types: ['SchemaValidationError'],
  retry_timeout_ms: 604800000,
}
```

##### Content (PayloadCMS)

| Operation | Max Attempts | Initial Interval | Max Interval | Backoff | Non-Retryable Errors |
|-----------|-------------|-------------------|--------------|---------|---------------------|
| Fetch Content | 3 | 2s | 30s | 2.0 | — |
| Sync Configuration | 5 | 5s | 120s | 2.0 | SchemaValidationError |
| Send Notification | 3 | 5s | 60s | 2.0 | InvalidArgumentError |
| Update Template | 2 | 5s | 30s | 2.0 | — |

```typescript
const contentRetryPolicy: RetryPolicyConfig = {
  max_attempts: 3,
  initial_interval_ms: 2000,
  max_interval_ms: 30000,
  backoff_coefficient: 2.0,
  non_retryable_error_types: ['SchemaValidationError', 'InvalidArgumentError'],
}
```

##### ERP (ERPNext)

| Operation | Max Attempts | Initial Interval | Max Interval | Backoff | Non-Retryable Errors |
|-----------|-------------|-------------------|--------------|---------|---------------------|
| Sync Order | 5 | 5s | 120s | 2.0 | DataConflictError (after merge attempt) |
| Update Inventory | 3 | 5s | 60s | 2.0 | — |
| Create Invoice | 3 | 10s | 120s | 2.0 | DuplicateRequestError |
| Post Journal Entry | 3 | 5s | 60s | 2.0 | DataIntegrityError |
| Sync Stock Levels | 5 | 10s | 300s | 2.0 | — |

```typescript
const erpRetryPolicy: RetryPolicyConfig = {
  max_attempts: 5,
  initial_interval_ms: 5000,
  max_interval_ms: 120000,
  backoff_coefficient: 2.0,
  non_retryable_error_types: ['DuplicateRequestError', 'DataIntegrityError'],
}
```

---

#### 4.5.3 Circuit Breaker Configuration

Each external system integration has a circuit breaker to prevent cascading failures. The circuit breaker operates in three states: **Closed** (normal), **Open** (failing, requests blocked), and **Half-Open** (testing recovery).

| System | Failure Threshold | Recovery Window | Half-Open Test Requests | Fallback Behavior |
|--------|-------------------|-----------------|------------------------|-------------------|
| Stripe / Tap / HyperPay | 5 failures in 60s | 30s | 2 | Queue payment for retry; return "processing" status |
| Fleetbase | 5 failures in 120s | 60s | 3 | Use cached ETA; queue delivery creation |
| ERPNext | 10 failures in 300s | 120s | 5 | Buffer events in EventOutbox; sync when recovered |
| Walt.id | 3 failures in 60s | 60s | 1 | Use cached credential status; queue new requests |
| PayloadCMS | 5 failures in 120s | 60s | 3 | Serve cached content/config; queue sync operations |

```typescript
interface CircuitBreakerConfig {
  system: string
  failure_threshold: number
  failure_window_ms: number
  recovery_window_ms: number
  half_open_max_requests: number
  fallback_strategy: 'queue' | 'cache' | 'degrade' | 'reject'
  fallback_description: string
  alert_on_open: boolean
  metrics_enabled: boolean
}

const circuitBreakerConfigs: CircuitBreakerConfig[] = [
  {
    system: 'stripe',
    failure_threshold: 5,
    failure_window_ms: 60000,
    recovery_window_ms: 30000,
    half_open_max_requests: 2,
    fallback_strategy: 'queue',
    fallback_description: 'Queue payment for retry; return processing status to customer',
    alert_on_open: true,
    metrics_enabled: true,
  },
  {
    system: 'fleetbase',
    failure_threshold: 5,
    failure_window_ms: 120000,
    recovery_window_ms: 60000,
    half_open_max_requests: 3,
    fallback_strategy: 'cache',
    fallback_description: 'Use cached ETA and tracking; queue new delivery orders',
    alert_on_open: true,
    metrics_enabled: true,
  },
  {
    system: 'erpnext',
    failure_threshold: 10,
    failure_window_ms: 300000,
    recovery_window_ms: 120000,
    half_open_max_requests: 5,
    fallback_strategy: 'queue',
    fallback_description: 'Buffer events in EventOutbox; batch sync when recovered',
    alert_on_open: true,
    metrics_enabled: true,
  },
  {
    system: 'waltid',
    failure_threshold: 3,
    failure_window_ms: 60000,
    recovery_window_ms: 60000,
    half_open_max_requests: 1,
    fallback_strategy: 'cache',
    fallback_description: 'Use cached credential status; queue new verification requests',
    alert_on_open: true,
    metrics_enabled: true,
  },
  {
    system: 'payloadcms',
    failure_threshold: 5,
    failure_window_ms: 120000,
    recovery_window_ms: 60000,
    half_open_max_requests: 3,
    fallback_strategy: 'cache',
    fallback_description: 'Serve cached content and configuration; queue sync operations',
    alert_on_open: true,
    metrics_enabled: true,
  },
]
```

---

#### 4.5.4 Compensation (Saga) Patterns

When a multi-step workflow fails after partially completing, compensation actions are executed in reverse order to restore consistency across systems. Each workflow defines a compensation registry mapping completed steps to their undo operations.

##### OrderPlacement Compensation Chain

| Step | Forward Action | Compensation (Undo) | System | Timeout |
|------|---------------|---------------------|--------|---------|
| 1 | Reserve inventory | Restore inventory | Medusa / ERPNext | 30s |
| 2 | Capture payment | Release / refund payment | Stripe | 60s |
| 3 | Create delivery order | Cancel delivery order | Fleetbase | 30s |
| 4 | Create ERP sales order | Void ERP sales order | ERPNext | 30s |
| 5 | Send confirmation | Send cancellation notice | PayloadCMS | 10s |

```
Failure at Step 3 (delivery creation fails):
  → Compensate Step 2: refund payment via Stripe
  → Compensate Step 1: restore inventory in Medusa + ERPNext
  → Notify customer via PayloadCMS
```

##### VendorOnboarding Compensation Chain

| Step | Forward Action | Compensation (Undo) | System | Timeout |
|------|---------------|---------------------|--------|---------|
| 1 | Create vendor account | Deactivate vendor account | Medusa | 30s |
| 2 | Submit KYC verification | Cancel KYC request | Walt.id | 30s |
| 3 | Issue credentials | Revoke credentials | Walt.id | 30s |
| 4 | Create ERP supplier | Remove ERP supplier | ERPNext | 30s |
| 5 | Create connected account | Deactivate connected account | Stripe | 60s |
| 6 | Send welcome email | Send cancellation notice | PayloadCMS | 10s |

```
Failure at Step 4 (ERP supplier creation fails):
  → Compensate Step 3: revoke credentials via Walt.id
  → Compensate Step 2: cancel KYC request via Walt.id
  → Compensate Step 1: deactivate vendor account in Medusa
  → Notify applicant via PayloadCMS
```

##### SubscriptionLifecycle Compensation Chain

| Step | Forward Action | Compensation (Undo) | System | Timeout |
|------|---------------|---------------------|--------|---------|
| 1 | Activate subscription | Deactivate subscription | Medusa | 30s |
| 2 | Schedule billing | Cancel scheduled billing | Stripe | 30s |
| 3 | Grant benefits/access | Revoke benefits/access | Medusa | 30s |
| 4 | Create ERP revenue entry | Void ERP revenue entry | ERPNext | 30s |
| 5 | Send welcome / activation email | Send cancellation confirmation | PayloadCMS | 10s |

```
Failure at Step 3 (benefit granting fails):
  → Compensate Step 2: cancel scheduled billing via Stripe
  → Compensate Step 1: deactivate subscription in Medusa
  → Issue prorated refund if payment was captured
  → Notify customer via PayloadCMS
```

```typescript
interface CompensationStep {
  step_number: number
  forward_action: string
  compensation_action: string
  system: 'medusa' | 'erpnext' | 'fleetbase' | 'waltid' | 'stripe' | 'payloadcms'
  timeout_ms: number
  idempotency_key_pattern: string
  max_compensation_attempts: number
}

interface CompensationRegistry {
  workflow_type: string
  steps: CompensationStep[]
  on_compensation_failure: 'manual_review' | 'dead_letter' | 'alert_and_retry'
  notification_on_compensation: boolean
}

const orderPlacementCompensation: CompensationRegistry = {
  workflow_type: 'OrderPlacement',
  steps: [
    {
      step_number: 1,
      forward_action: 'reserveInventory',
      compensation_action: 'restoreInventory',
      system: 'medusa',
      timeout_ms: 30000,
      idempotency_key_pattern: 'comp-inv-{order_id}-{attempt}',
      max_compensation_attempts: 3,
    },
    {
      step_number: 2,
      forward_action: 'capturePayment',
      compensation_action: 'refundPayment',
      system: 'stripe',
      timeout_ms: 60000,
      idempotency_key_pattern: 'comp-pay-{order_id}-{attempt}',
      max_compensation_attempts: 3,
    },
    {
      step_number: 3,
      forward_action: 'createDeliveryOrder',
      compensation_action: 'cancelDeliveryOrder',
      system: 'fleetbase',
      timeout_ms: 30000,
      idempotency_key_pattern: 'comp-del-{order_id}-{attempt}',
      max_compensation_attempts: 3,
    },
    {
      step_number: 4,
      forward_action: 'createERPSalesOrder',
      compensation_action: 'voidERPSalesOrder',
      system: 'erpnext',
      timeout_ms: 30000,
      idempotency_key_pattern: 'comp-erp-{order_id}-{attempt}',
      max_compensation_attempts: 3,
    },
    {
      step_number: 5,
      forward_action: 'sendConfirmation',
      compensation_action: 'sendCancellationNotice',
      system: 'payloadcms',
      timeout_ms: 10000,
      idempotency_key_pattern: 'comp-notify-{order_id}-{attempt}',
      max_compensation_attempts: 2,
    },
  ],
  on_compensation_failure: 'manual_review',
  notification_on_compensation: true,
}
```

---

#### 4.5.5 Dead Letter Queue (DLQ)

When all retry attempts are exhausted and compensation cannot resolve the issue, events are routed to the Dead Letter Queue for manual intervention.

##### DLQ Structure

| Field | Type | Description |
|-------|------|-------------|
| `dlq_entry_id` | string | Unique DLQ entry identifier |
| `original_workflow_id` | string | The Temporal workflow that failed |
| `original_activity` | string | The activity that exhausted retries |
| `error_class` | string | Classification from error taxonomy |
| `error_message` | string | Last error message |
| `payload` | JSON | Original activity input payload |
| `attempt_count` | number | Total attempts made |
| `first_failed_at` | string | Timestamp of first failure |
| `last_failed_at` | string | Timestamp of final failure |
| `tenant_id` | string | Tenant context |
| `system` | string | Target system that failed |
| `status` | string | `pending_review` / `in_review` / `replayed` / `discarded` |
| `reviewed_by` | string | Admin who reviewed (if applicable) |
| `resolution_notes` | string | Notes on resolution |

```typescript
interface DeadLetterEntry {
  dlq_entry_id: string
  original_workflow_id: string
  original_run_id: string
  original_activity: string
  error_class: string
  error_message: string
  error_stack?: string
  payload: Record<string, unknown>
  attempt_count: number
  first_failed_at: string
  last_failed_at: string
  tenant_id: string
  system: 'medusa' | 'erpnext' | 'fleetbase' | 'waltid' | 'stripe' | 'payloadcms'
  status: 'pending_review' | 'in_review' | 'replayed' | 'discarded'
  reviewed_by?: string
  reviewed_at?: string
  resolution_notes?: string
  replay_workflow_id?: string
}

interface DLQReplayRequest {
  dlq_entry_id: string
  replay_strategy: 'retry_activity' | 'restart_workflow' | 'skip_and_continue' | 'manual_fix'
  modified_payload?: Record<string, unknown>
  initiated_by: string
  reason: string
}
```

##### Manual Review Process

1. **Alert** — When an event enters the DLQ, the platform admin dashboard shows a notification. Critical errors also trigger PagerDuty / Slack alerts.
2. **Triage** — An admin reviews the entry, examining the error class, payload, and attempt history.
3. **Resolution Options:**
   - **Replay** — Fix the root cause (e.g., restore connectivity), then replay the failed activity with the original or modified payload.
   - **Skip** — Mark the activity as skipped and advance the workflow to the next step (only for non-critical steps).
   - **Manual Fix** — Directly intervene in the target system (e.g., manually create the ERP entry), then mark the DLQ entry as resolved.
   - **Discard** — Determine the event is no longer relevant (e.g., order was already cancelled) and discard it.

##### Replay Mechanism

The replay mechanism re-executes a failed activity within a new Temporal workflow:

1. Load the DLQ entry with its original payload
2. Optionally modify the payload (e.g., fix a malformed field)
3. Start a new child workflow that executes only the failed activity
4. On success, update the DLQ entry status to `replayed` and link the new workflow ID
5. On failure, increment the attempt count and keep in DLQ for further review

```
DLQ Entry                    Replay Workflow
┌─────────────────┐         ┌──────────────────────┐
│ Failed Activity  │────────>│ ReplayActivity        │
│ + Original       │         │   (same activity with │
│   Payload        │         │    original/modified   │
│ + Error Context  │         │    payload)            │
└─────────────────┘         └──────────┬───────────┘
                                       │
                            ┌──────────┴───────────┐
                            │                      │
                         Success                Failure
                            │                      │
                     Mark "replayed"         Keep in DLQ
                     Link new workflow_id    Increment attempts
```

---

## 5. Integration Patterns

### 5.1 Event Flow Architecture

```
  PayloadCMS (Master)            Temporal Server              Target Systems
  ┌───────────────────┐        ┌──────────────────┐      ┌────────────────────┐
  │ SHARED MODELS     │        │                  │      │                    │
  │ (Source of Truth)  │        │  Config Sync     │      │                    │
  │                   │        │  Workflows       │      │                    │
  │  node.created ────┼───────>│  (PayloadCMS →   │─────>│  Medusa            │
  │  governance.upd ──┼───────>│   All systems)   │─────>│  ERPNext           │
  │  persona.created ─┼───────>│                  │─────>│  Fleetbase         │
  │  channel.mapped ──┼───────>│                  │─────>│  Walt.id           │
  │  translation.upd ─┼───────>│                  │      │                    │
  └───────────────────┘        └──────────────────┘      └────────────────────┘

  Medusa EventOutbox             Temporal Server              Target Systems
  ┌───────────────────┐        ┌──────────────────┐      ┌────────────────────┐
  │ COMMERCE EVENTS    │        │                  │      │                    │
  │                   │        │  OrderPlacement  │─────>│  Payment Gateway   │
  │  order.placed ────┼───────>│  Workflow         │─────>│  ERPNext           │
  │  order.cancelled ─┼───────>│                  │─────>│  Fleetbase         │
  │  vendor.created ──┼───────>│  OrderCancellation│─────>│  PayloadCMS        │
  │  subscription.    │        │  Workflow         │─────>│  Walt.id           │
  │   created ────────┼───────>│                  │      │                    │
  │                   │        │  VendorOnboarding │      │                    │
  └───────────────────┘        │  Workflow         │      └────────────────────┘
                               │                  │               ▲
                               │  Subscription    │               │
                               │  Lifecycle       │               │
                               └──────────────────┘               │
                                        │                        │
                                        │    Webhooks/Signals    │
                                        └────────────────────────┘
```

### 5.2 EventOutbox Envelope Format

Every cross-system event follows this envelope format:

```typescript
interface EventEnvelope {
  id: string                           // UUID
  tenant_id: string
  event_type: string                   // e.g., "order.placed"
  aggregate_type: string               // e.g., "order"
  aggregate_id: string                 // e.g., order_id
  correlation_id: string               // traces the original user action
  causation_id: string                 // the event that caused this event
  payload: Record<string, unknown>     // event-specific data
  metadata: {
    source_system: string              // "payloadcms" | "medusa" | "erpnext" | "fleetbase" | "waltid" | "payment_gateway"
    actor_id: string
    actor_role: string
    node_id?: string
    timestamp: string
    version: number
  }
  status: 'pending' | 'processing' | 'delivered' | 'failed'
  retry_count: number
  max_retries: number
  next_retry_at?: string
  error_message?: string
  created_at: string
  processed_at?: string
}
```

### 5.3 System Sync Rules

#### Shared/Synced Models (PayloadCMS = Master)

PayloadCMS is the master system for all platform configuration and shared models. Changes flow outward from PayloadCMS to all other systems via Temporal.

| Source → Target | Sync Method | Frequency | Conflict Resolution |
|----------------|-------------|-----------|---------------------|
| PayloadCMS → Medusa | Temporal workflow | Real-time (webhook) | PayloadCMS wins (master for shared models) |
| PayloadCMS → ERPNext | Temporal workflow | Real-time (webhook) | PayloadCMS wins (master for shared models) |
| PayloadCMS → Fleetbase | Temporal workflow | Real-time (webhook) | PayloadCMS wins (master for shared models) |
| PayloadCMS → Walt.id | Temporal workflow | Real-time (webhook) | PayloadCMS wins (master for shared models) |

#### Domain-Specific Data (each system owns its domain)

| Source → Target | Sync Method | Frequency | Conflict Resolution |
|----------------|-------------|-----------|---------------------|
| Medusa → ERPNext | Temporal workflow | Real-time (event) | Medusa wins (commerce truth) |
| ERPNext → Medusa | Temporal workflow | Every 15 min (inventory) | ERPNext wins (inventory truth) |
| Medusa → Fleetbase | Temporal workflow | Real-time (fulfillment) | Medusa wins (order truth) |
| Fleetbase → Medusa | Webhook → Signal | Real-time (tracking) | Fleetbase wins (logistics truth) |
| Walt.id → Medusa | Temporal signal | Real-time (verification) | Walt.id wins (identity truth) |
| Gateway → Medusa | Webhook → Signal | Real-time (payment) | Gateway wins (payment truth) |

---

## 6. Data Flow Diagrams

### 6.1 Order-to-Cash Flow

```
Customer                Medusa              Payment          ERPNext          Fleetbase          PayloadCMS
   │                      │                 Gateway             │                │                   │
   │──── Place Order ────>│                    │                │                │                   │
   │                      │── Capture ────────>│                │                │                   │
   │                      │<── Captured ───────│                │                │                   │
   │                      │── Reserve Stock ──────────────────>│                │                   │
   │                      │<── Reserved ──────────────────────│                │                   │
   │                      │── Create Delivery ─────────────────────────────>  │                   │
   │                      │<── Delivery Created ──────────────────────────── │                   │
   │                      │── Journal Entry ──────────────────>│                │                   │
   │                      │── Order Confirm ────────────────────────────────────────────────────> │
   │<─── Confirmation ────────────────────────────────────────────────────────────────────────── │
   │                      │                    │                │                │                   │
   │                      │                    │                │── Driver Assigned ─>│             │
   │                      │                    │                │── In Transit ──────>│             │
   │                      │                    │                │── Delivered ────────>│             │
   │                      │<── Delivery Done ──────────────────────────────── │                   │
   │                      │── Deduct Stock ───────────────────>│                │                   │
   │                      │── Calculate Commission ─>│          │                │                   │
   │                      │                    │                │                │                   │
   │                      │ ~~~ T+7 days ~~~   │                │                │                   │
   │                      │── Vendor Payout ──>│── Transfer ──>│                │                   │
   │                      │── Settlement ─────────────────────>│                │                   │
```

### 6.2 Vendor Onboarding Flow

```
Vendor                  Medusa              Walt.id          Payment          ERPNext          PayloadCMS
   │                      │                    │              Gateway             │                │
   │── Register ─────────>│                    │                │                │                │
   │                      │── Initiate KYC ───>│                │                │                │
   │                      │                    │── Verify ──>  │                │                │
   │<── Upload Docs ──────────────────────────>│                │                │                │
   │                      │<── KYC Approved ───│                │                │                │
   │                      │── Create Account ──────────────>   │                │                │
   │                      │<── Account Ready ──────────────    │                │                │
   │                      │── Issue Credential ─>│              │                │                │
   │                      │── Create Supplier ─────────────────────────────>   │                │
   │                      │── Create Profile ────────────────────────────────────────────────> │
   │                      │── Activate ────────>│              │                │                │
   │<── Welcome ──────────────────────────────────────────────────────────────────────────── │
```

---

## 7. Security & Compliance

### 7.1 Data Classification

| Classification | Examples | Storage Rules | Access Rules |
|---------------|----------|---------------|-------------|
| **Restricted** | Payment credentials, KYC documents, passwords | Encrypted at rest, never in logs | MFA required, role-based |
| **Confidential** | PII (names, emails, addresses), financial data | Encrypted at rest, masked in logs | Role-based, audit logged |
| **Internal** | Order details, product data, analytics | Standard encryption | Authenticated users |
| **Public** | Published content, product listings | Standard | Open access |

### 7.2 Residency Zone Rules

| Zone | Data Storage | Cross-Border Transfer | Applicable Regulations |
|------|-------------|----------------------|----------------------|
| **GCC** | Local storage required | No cross-border for PII | PDPL (Saudi), DPL (UAE) |
| **EU** | EU data centers only | Requires adequacy decision | GDPR |
| **MENA** | Regional storage preferred | Restricted for financial data | Country-specific |
| **APAC** | Flexible | Flexible with consent | PDPA (Singapore), etc. |
| **AMERICAS** | Flexible | Flexible | CCPA, LGPD |
| **GLOBAL** | Flexible | Flexible | Minimum: GDPR-aligned |

### 7.3 Cross-System Authentication

| System Pair | Auth Method | Token Type | Rotation |
|------------|-------------|-----------|----------|
| Medusa ↔ Temporal | mTLS + API key | Service token | 90 days |
| Temporal ↔ ERPNext | API key + OAuth2 | Bearer token | 24 hours |
| Temporal ↔ Fleetbase | API key | API key | 90 days |
| Temporal ↔ Walt.id | DID-based auth | Verifiable Presentation | Per-session |
| Temporal ↔ Payment GW | API key (env secret) | Secret key | 90 days |
| Temporal ↔ PayloadCMS | API key + JWT | Bearer token | 24 hours |

---

## 8. Appendix

### 8.1 Temporal Task Queue Reference

| Task Queue Name | Worker Service | Activities |
|----------------|---------------|------------|
| `medusa-commerce` | medusa-worker | All Medusa API calls (orders, products, vendors, subscriptions, bookings) |
| `erpnext-backoffice` | erpnext-worker | Accounting, inventory, HR, compliance, tax, supplier operations |
| `fleetbase-logistics` | fleetbase-worker | Delivery, fleet, route, warehouse, tracking operations |
| `waltid-identity` | waltid-worker | KYC, credential issuance/verification, consent, DID operations |
| `payment-gateway` | payment-worker | Capture, refund, transfer, escrow, wallet, BNPL operations |
| `payload-content` | payload-worker | Content publishing, notifications, template rendering, branding |

### 8.2 Workflow ID Conventions

```
Format: tenant:{tenant_id}:{domain}:{entity_id}:{action}

Examples:
  tenant:t_001:order:ord_abc:placement
  tenant:t_001:vendor:vnd_xyz:onboarding
  tenant:t_001:subscription:sub_123:lifecycle
  tenant:t_001:booking:bkg_456:lifecycle
  tenant:t_001:payout:pay_789:processing
  scheduled:tenant:t_001:performance_review:2026-02-08
  scheduled:system:health_check:2026-02-08T12:00
```

### 8.3 Signal Name Conventions

```
Format: {domain}.{entity}.{event}

Examples:
  payment.intent.captured
  payment.intent.failed
  delivery.order.completed
  delivery.order.failed
  kyc.verification.approved
  kyc.verification.rejected
  approval.request.approved
  approval.request.rejected
  subscription.payment.received
  booking.customer.checked_in
```

### 8.4 Common Activity Interfaces

```typescript
// Every activity receives this context
interface ActivityContext {
  tenant_id: string
  correlation_id: string
  causation_id: string
  idempotency_key: string
  actor_id?: string
  node_id?: string
}

// Every activity returns this shape
interface ActivityResult<T = unknown> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    retryable: boolean
    details?: Record<string, unknown>
  }
  audit?: {
    action: string
    resource_type: string
    resource_id: string
    changes?: Record<string, unknown>
  }
}
```

### 8.5 Error Classification

| Error Type | Retryable | Action |
|-----------|-----------|--------|
| NetworkError | Yes | Retry with backoff |
| TimeoutError | Yes | Retry with backoff |
| RateLimitError | Yes | Retry after rate limit window |
| ServiceUnavailableError | Yes | Retry with backoff |
| InvalidArgumentError | No | Fail immediately, notify admin |
| InsufficientFundsError | No | Fail, notify customer |
| AuthenticationError | No | Fail, alert security |
| FraudDetectedError | No | Fail, freeze account, alert security |
| DataConflictError | Conditional | Retry with fresh data fetch |
| CredentialExpiredError | No | Fail, trigger renewal workflow |

---

## 9. Implementation Mapping

Map the architecture documented above to the actual codebase. This helps developers find where each architectural concept lives in code.

### 9.1 Repository Structure

```
apps/backend/
├── src/
│   ├── api/admin/
│   │   ├── temporal/
│   │   │   ├── route.ts              # GET /admin/temporal — health check
│   │   │   ├── trigger/route.ts      # POST /admin/temporal/trigger — start workflow
│   │   │   ├── workflows/route.ts    # GET /admin/temporal/workflows — list active
│   │   │   └── dynamic/
│   │   │       ├── route.ts          # POST /admin/temporal/dynamic — start dynamic workflow
│   │   │       └── [workflowId]/route.ts  # GET dynamic workflow status
│   │   ├── webhooks/
│   │   │   ├── route.ts             # Webhook router
│   │   │   ├── stripe/route.ts      # Stripe webhook handler
│   │   │   ├── erpnext/route.ts     # ERPNext webhook handler
│   │   │   ├── fleetbase/route.ts   # Fleetbase webhook handler
│   │   │   └── payload/route.ts     # PayloadCMS webhook handler
│   │   └── integration/             # Integration management APIs
│   ├── integrations/
│   │   ├── orchestrator/
│   │   │   ├── integration-orchestrator.ts  # Core sync orchestrator
│   │   │   ├── integration-registry.ts      # Adapter registry & health checks
│   │   │   ├── sync-tracker.ts              # Sync entry tracking
│   │   │   └── index.ts
│   │   ├── erpnext/                  # ERPNext adapter implementation
│   │   │   ├── service.ts           # ERPNext API client
│   │   │   └── index.ts
│   │   ├── fleetbase/               # Fleetbase adapter implementation
│   │   │   ├── service.ts           # Fleetbase API client
│   │   │   └── index.ts
│   │   ├── waltid/                  # Walt.id adapter implementation
│   │   │   ├── service.ts           # Walt.id API client
│   │   │   └── index.ts
│   │   ├── stripe-gateway/          # Stripe adapter implementation
│   │   │   ├── service.ts           # Stripe API client
│   │   │   └── index.ts
│   │   ├── payload-sync/            # Payload CMS sync
│   │   │   ├── payload-to-medusa.ts # Inbound sync
│   │   │   ├── medusa-to-payload.ts # Outbound sync
│   │   │   └── index.ts
│   │   └── node-hierarchy-sync/     # Node hierarchy sync
│   │       ├── service.ts
│   │       └── index.ts
│   └── lib/
│       ├── temporal-client.ts        # Temporal client singleton & helpers
│       ├── event-dispatcher.ts       # EVENT_WORKFLOW_MAP & dispatch logic
│       └── integrations/
│           ├── temporal-spec.ts      # Temporal integration contract (1,661 lines)
│           ├── erpnext-spec.ts       # ERPNext integration contract (1,593 lines)
│           ├── fleetbase-spec.ts     # Fleetbase integration contract (952 lines)
│           ├── payload-cms-spec.ts   # PayloadCMS integration contract (1,034 lines)
│           └── waltid-spec.ts        # Walt.id integration contract (1,396 lines)
```

### 9.2 Key File Responsibilities

| File | Architectural Role | Section Reference |
|------|-------------------|-------------------|
| `lib/temporal-client.ts` | Temporal Cloud connection singleton, lazy initialization, health check | §4.1 |
| `lib/event-dispatcher.ts` | EVENT_WORKFLOW_MAP (65+ event→workflow mappings), outbox processing, cross-system dispatch | §4.3, §5.1 |
| `integrations/orchestrator/integration-orchestrator.ts` | Core sync engine: `syncToSystem()`, `syncToAllSystems()`, `retryFailed()`, dashboard | §5.3 |
| `integrations/orchestrator/integration-registry.ts` | Adapter interface (`IIntegrationAdapter`), health checks, adapter registration | §5.3, §7.3 |
| `integrations/orchestrator/sync-tracker.ts` | Sync entry lifecycle, status tracking, stats aggregation | §5.3 |
| `api/admin/webhooks/stripe/route.ts` | Stripe webhook signature verification, event routing | §4.3.2 |
| `api/admin/webhooks/erpnext/route.ts` | ERPNext webhook handler, inventory/accounting events | §4.3.4, §4.3.6 |
| `api/admin/webhooks/fleetbase/route.ts` | Fleetbase delivery status webhooks, signal dispatch | §4.3.6 |
| `api/admin/webhooks/payload/route.ts` | PayloadCMS content sync webhooks, shared model propagation | §5.1 |
| `lib/integrations/temporal-spec.ts` | Complete Temporal contract: task queues, workflow types, event mapping, scaling | §4.1, §4.2, §8.1 |
| `lib/integrations/erpnext-spec.ts` | ERPNext API contract: doctypes, fields, sync rules | §2, §3.2 |
| `lib/integrations/fleetbase-spec.ts` | Fleetbase API contract: endpoints, models, tracking | §2, §3.3 |
| `lib/integrations/payload-cms-spec.ts` | PayloadCMS API contract: collections, sync direction | §2, §3.6 |
| `lib/integrations/waltid-spec.ts` | Walt.id API contract: DIDs, credentials, verification | §2, §3.4 |

### 9.3 Integration Adapter Interface

Every external system implements the `IIntegrationAdapter` interface (from `integration-registry.ts`):

```typescript
interface IIntegrationAdapter {
  name: string
  healthCheck(): Promise<{ healthy: boolean; message?: string }>
  isConfigured(): boolean
  syncEntity(type: string, id: string, data: any): Promise<{ success: boolean; externalId?: string; error?: string }>
  handleWebhook(event: string, payload: any): Promise<{ processed: boolean; error?: string }>
}
```

**Registered Adapters:**

| Adapter Name | Configuration Check | Health Endpoint |
|-------------|-------------------|-----------------|
| `payload` | `PAYLOAD_API_URL` + `PAYLOAD_API_KEY` | `GET {PAYLOAD_API_URL}/api/health` |
| `erpnext` | `ERPNEXT_URL` + `ERPNEXT_API_KEY` | `GET {ERPNEXT_URL}/api/method/ping` |
| `fleetbase` | `FLEETBASE_API_URL` + `FLEETBASE_API_KEY` | `GET {FLEETBASE_API_URL}/health` |
| `waltid` | `WALTID_API_URL` + `WALTID_API_KEY` | `GET {WALTID_API_URL}/health` |
| `stripe` | `STRIPE_SECRET_KEY` | Stripe SDK connection test |
| `temporal` | `TEMPORAL_API_KEY` | Temporal client connection test |

### 9.4 Event-to-Workflow Dispatch Map

The `EVENT_WORKFLOW_MAP` in `lib/event-dispatcher.ts` maps commerce events to Temporal workflows:

| Event Type | Workflow ID | Task Queue |
|-----------|-------------|------------|
| `order.placed` | `xsystem.unified-order-orchestrator` | `commerce-queue` |
| `order.cancelled` | `xsystem.order-cancellation-saga` | `commerce-queue` |
| `payment.initiated` | `xsystem.multi-gateway-payment` | `commerce-queue` |
| `refund.requested` | `xsystem.refund-compensation-saga` | `commerce-queue` |
| `return.initiated` | `xsystem.returns-processing` | `commerce-queue` |
| `product.created` | `commerce.product-catalog-sync` | `commerce-queue` |
| `product.updated` | `commerce.sync-product-to-cms` | `commerce-queue` |
| `booking.created` | `xsystem.service-booking-orchestrator` | `commerce-booking-queue` |
| `subscription.created` | `xsystem.subscription-lifecycle` | `commerce-booking-queue` |
| `tenant.provisioned` | `xsystem.tenant-setup-saga` | `xsystem-platform-queue` |
| `node.created` | `xsystem.node-provisioning` | `xsystem-platform-queue` |
| `vendor.registered` | `xsystem.vendor-onboarding-saga` | `xsystem-platform-queue` |

*(Full map contains 65+ entries — see `lib/event-dispatcher.ts` for complete reference)*

### 9.5 Sync Tracking Data Model

The `SyncTracker` (from `sync-tracker.ts`) tracks all cross-system synchronization operations:

```typescript
interface ISyncEntry {
  id: string                    // UUID
  system: SyncSystem            // "payload" | "erpnext" | "fleetbase" | "waltid" | "stripe" | "temporal"
  entity_type: string           // e.g., "product", "order", "customer"
  entity_id: string             // Medusa entity ID
  direction: "inbound" | "outbound"
  status: "pending" | "in_progress" | "success" | "failed" | "retrying"
  error_message: string | null
  retry_count: number
  max_retries: number           // default: 3
  payload_hash: string | null   // SHA-256 of sync payload for deduplication
  correlation_id: string
  tenant_id: string | null
  node_id: string | null
  created_at: Date
  updated_at: Date
  completed_at: Date | null
}
```

---

## 10. Deployment Architecture

### 10.1 Infrastructure Topology

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CLOUD INFRASTRUCTURE                                │
│                                                                             │
│  ┌──────────────────────────┐    ┌──────────────────────────────────┐      │
│  │   APPLICATION TIER        │    │   TEMPORAL CLOUD (Managed)       │      │
│  │                          │    │                                  │      │
│  │  ┌──────────────────┐   │    │  Namespace: quickstart-dakkah-   │      │
│  │  │ Medusa Backend   │   │    │   cityos.djvai                   │      │
│  │  │ (Node.js)        │◄──┼───►│  Region: ap-northeast-1          │      │
│  │  │ Port: 9000       │   │    │  Encryption: TLS + API Key       │      │
│  │  └──────────────────┘   │    │                                  │      │
│  │                          │    │  Task Queues: 21 queues          │      │
│  │  ┌──────────────────┐   │    │  Workers: Deployed per-system    │      │
│  │  │ Storefront       │   │    │  Retention: 30 days              │      │
│  │  │ (TanStack Start) │   │    └──────────────────────────────────┘      │
│  │  │ Port: 5000       │   │                                             │
│  │  └──────────────────┘   │    ┌──────────────────────────────────┐      │
│  │                          │    │   EXTERNAL SYSTEMS                │      │
│  │  ┌──────────────────┐   │    │                                  │      │
│  │  │ Temporal Workers │   │    │  ERPNext      ─── HTTPS/REST     │      │
│  │  │ (Node.js)       │◄──┼───►│  Fleetbase    ─── HTTPS/REST     │      │
│  │  │ Per-queue scaled │   │    │  Walt.id      ─── HTTPS/REST     │      │
│  │  └──────────────────┘   │    │  Stripe       ─── HTTPS/REST     │      │
│  │                          │    │  PayloadCMS   ─── HTTPS/REST     │      │
│  └──────────────────────────┘    └──────────────────────────────────┘      │
│                                                                             │
│  ┌──────────────────────────┐    ┌──────────────────────────────────┐      │
│  │   DATA TIER               │    │   STORAGE TIER                   │      │
│  │                          │    │                                  │      │
│  │  PostgreSQL (Neon)       │    │  MinIO AIStor (S3-compatible)   │      │
│  │  ├── medusa_db           │    │  ├── Media assets               │      │
│  │  ├── event_outbox        │    │  ├── Document uploads           │      │
│  │  └── sync_tracking       │    │  └── Backup archives            │      │
│  └──────────────────────────┘    └──────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 10.2 Worker Deployment Strategy

Each Temporal task queue has dedicated workers. Workers are deployed as independent processes/containers that can be scaled independently based on queue depth.

| Task Queue Group | Worker Process | Scaling Strategy | Min Instances | Max Instances |
|-----------------|---------------|-----------------|---------------|---------------|
| `cityos-workflow-queue` | `cityos-system-worker` | Queue-depth autoscaling | 1 | 10 |
| `cityos-dynamic-queue` | `cityos-dynamic-worker` | Active-workflow count | 0 | 5 |
| `commerce-queue` | `commerce-worker` | Order volume | 1 | 10 |
| `commerce-booking-queue` | `booking-worker` | Booking volume | 1 | 5 |
| `xsystem-platform-queue` | `platform-worker` | Event rate | 1 | 5 |
| `xsystem-logistics-queue` | `logistics-worker` | Delivery volume | 1 | 8 |
| `xsystem-content-queue` | `content-worker` | Content events | 1 | 3 |
| `payload-*` queues | `payload-worker` | Content volume | 1 | 3 |
| `zes-*` queues | `zes-worker` | POI activity | 1 | 5 |
| `core-*` queues | `core-worker` | Scheduled tasks | 1 | 3 |

### 10.3 Environment Variables Reference

| Variable | System | Required | Description |
|----------|--------|----------|-------------|
| `TEMPORAL_API_KEY` | Temporal | Yes | Temporal Cloud API key for authentication |
| `TEMPORAL_ENDPOINT` | Temporal | No | Temporal Cloud gRPC endpoint (default: `ap-northeast-1.aws.api.temporal.io:7233`) |
| `TEMPORAL_NAMESPACE` | Temporal | No | Temporal namespace (default: `quickstart-dakkah-cityos.djvai`) |
| `PAYLOAD_API_URL` | PayloadCMS | Yes | PayloadCMS API base URL |
| `PAYLOAD_API_KEY` | PayloadCMS | Yes | PayloadCMS API authentication key |
| `ERPNEXT_URL` | ERPNext | Yes | ERPNext instance URL |
| `ERPNEXT_API_KEY` | ERPNext | Yes | ERPNext API key |
| `ERPNEXT_API_SECRET` | ERPNext | Yes | ERPNext API secret |
| `FLEETBASE_API_URL` | Fleetbase | Yes | Fleetbase API base URL |
| `FLEETBASE_API_KEY` | Fleetbase | Yes | Fleetbase API key |
| `WALTID_API_URL` | Walt.id | Yes | Walt.id API base URL |
| `WALTID_API_KEY` | Walt.id | Yes | Walt.id API key |
| `STRIPE_SECRET_KEY` | Stripe | Yes | Stripe secret API key |
| `STRIPE_WEBHOOK_SECRET` | Stripe | Yes | Stripe webhook signing secret |
| `DATABASE_URL` | PostgreSQL | Yes | PostgreSQL connection string |

### 10.4 Network Security

All inter-system communication uses TLS encryption. No plaintext API calls are permitted.

| Connection | Protocol | Auth Method | Port |
|-----------|----------|-------------|------|
| Medusa → Temporal Cloud | gRPC + TLS | API Key | 7233 |
| Medusa → ERPNext | HTTPS | API Key + Secret | 443 |
| Medusa → Fleetbase | HTTPS | API Key | 443 |
| Medusa → Walt.id | HTTPS | API Key | 443 |
| Medusa → Stripe | HTTPS | Secret Key | 443 |
| Medusa → PayloadCMS | HTTPS | API Key + JWT | 443 |
| Stripe → Medusa (webhook) | HTTPS | Signature verification | 443 |
| ERPNext → Medusa (webhook) | HTTPS | Shared secret | 443 |
| Fleetbase → Medusa (webhook) | HTTPS | API Key header | 443 |
| PayloadCMS → Medusa (webhook) | HTTPS | Shared secret | 443 |

---

## 11. Monitoring & Observability

### 11.1 Observability Stack

```
┌───────────────────────────────────────────────────────────────┐
│                     OBSERVABILITY LAYER                        │
│                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   METRICS    │  │   LOGGING   │  │   TRACING            │  │
│  │             │  │             │  │                     │  │
│  │  Prometheus  │  │  Structured │  │  correlation_id     │  │
│  │  + Grafana   │  │  JSON logs  │  │  causation_id       │  │
│  │             │  │  → Loki     │  │  trace_id            │  │
│  │  Workflow    │  │             │  │  → Jaeger/OTLP      │  │
│  │  counters    │  │  Per-system │  │                     │  │
│  │  latency     │  │  log streams│  │  Cross-system       │  │
│  │  error rates │  │             │  │  request tracing     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                    ALERTING                              │  │
│  │  PagerDuty / OpsGenie / Slack                           │  │
│  │  Severity: P1 (Critical) → P4 (Info)                   │  │
│  └─────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
```

### 11.2 Key Metrics

#### Temporal Workflow Metrics

| Metric | Type | Labels | Alert Threshold |
|--------|------|--------|----------------|
| `temporal_workflow_started_total` | Counter | workflow_type, task_queue, tenant_id | N/A |
| `temporal_workflow_completed_total` | Counter | workflow_type, task_queue, status | N/A |
| `temporal_workflow_failed_total` | Counter | workflow_type, task_queue, error_type | > 5/min → P2 |
| `temporal_workflow_duration_seconds` | Histogram | workflow_type, task_queue | p99 > 5min → P3 |
| `temporal_activity_duration_seconds` | Histogram | activity_type, system | p99 > 30s → P3 |
| `temporal_activity_retry_total` | Counter | activity_type, system | > 10/min → P2 |
| `temporal_task_queue_depth` | Gauge | task_queue | > 1000 → P2 |
| `temporal_schedule_missed_total` | Counter | schedule_id | > 0 → P3 |

#### Cross-System Sync Metrics

| Metric | Type | Labels | Alert Threshold |
|--------|------|--------|----------------|
| `sync_operation_total` | Counter | system, entity_type, direction, status | N/A |
| `sync_duration_seconds` | Histogram | system, entity_type | p99 > 10s → P3 |
| `sync_failure_total` | Counter | system, entity_type, error_type | > 10/min → P2 |
| `sync_retry_total` | Counter | system, entity_type | > 20/hour → P3 |
| `sync_lag_seconds` | Gauge | system, entity_type | > 300s → P2 |

#### System Health Metrics

| Metric | Type | Labels | Alert Threshold |
|--------|------|--------|----------------|
| `integration_health_status` | Gauge | system | 0 (unhealthy) for > 5min → P1 |
| `webhook_received_total` | Counter | system, event_type | N/A |
| `webhook_processing_duration_seconds` | Histogram | system, event_type | p99 > 5s → P3 |
| `event_outbox_pending_count` | Gauge | tenant_id | > 100 → P2 |
| `event_outbox_age_seconds` | Gauge | tenant_id | > 3600 → P1 |

### 11.3 Structured Logging Format

All cross-system operations use structured JSON logging with mandatory fields:

```typescript
interface StructuredLogEntry {
  timestamp: string               // ISO 8601
  level: "DEBUG" | "INFO" | "WARN" | "ERROR" | "FATAL"
  service: string                 // "medusa" | "temporal-worker" | etc.
  correlation_id: string          // Links related operations
  causation_id?: string           // The event that caused this
  tenant_id?: string
  node_id?: string
  workflow_id?: string
  activity_type?: string
  system?: string                 // External system involved
  entity_type?: string
  entity_id?: string
  duration_ms?: number
  error?: {
    type: string
    message: string
    stack?: string
    retryable: boolean
  }
  message: string
}
```

### 11.4 Dashboard Definitions

#### Primary Dashboard: Cross-System Health

| Panel | Visualization | Query |
|-------|--------------|-------|
| System Health Matrix | Status grid | `integration_health_status` per system |
| Workflow Throughput | Time series | `rate(temporal_workflow_completed_total[5m])` by type |
| Workflow Error Rate | Time series | `rate(temporal_workflow_failed_total[5m])` by type |
| Sync Lag Heatmap | Heatmap | `sync_lag_seconds` by system |
| Event Outbox Backlog | Gauge | `event_outbox_pending_count` sum |
| Active Workflows | Gauge | `temporal_workflow_active_count` by task_queue |

#### Secondary Dashboard: Per-Tenant View

| Panel | Visualization | Query |
|-------|--------------|-------|
| Tenant Order Volume | Time series | `temporal_workflow_started_total{workflow_type="OrderPlacement"}` by tenant_id |
| Tenant Sync Status | Table | Latest sync entry per system per tenant |
| Tenant Error Log | Log panel | Filtered by tenant_id, level >= WARN |
| Tenant API Latency | Histogram | `sync_duration_seconds` by system, filtered by tenant_id |

### 11.5 Distributed Tracing

Every cross-system operation is traceable via `correlation_id`:

```
Customer Request → correlation_id: "corr_abc123"
  ├── Medusa: order.placed (causation: user_action)
  ├── Temporal: OrderPlacementWorkflow started
  │   ├── Activity: capturePayment → Stripe
  │   ├── Activity: reserveInventory → ERPNext
  │   ├── Activity: createDeliveryOrder → Fleetbase
  │   └── Activity: sendConfirmation → PayloadCMS
  └── All systems log with correlation_id: "corr_abc123"
```

To trace a request across all systems:
```sql
-- Find all events for a correlation
SELECT * FROM event_outbox 
WHERE correlation_id = 'corr_abc123' 
ORDER BY created_at;
```

---

## 12. Disaster Recovery & Business Continuity

### 12.1 Recovery Objectives

| System | RTO (Recovery Time) | RPO (Recovery Point) | Criticality |
|--------|-------------------|---------------------|-------------|
| Medusa Commerce | 15 minutes | 0 (real-time replication) | Critical |
| PostgreSQL (Neon) | 5 minutes | 0 (synchronous replication) | Critical |
| Temporal Cloud | 0 (managed, multi-AZ) | 0 (durable execution) | Critical |
| Stripe Payment Gateway | 0 (managed by Stripe) | 0 | Critical |
| ERPNext | 30 minutes | 15 minutes | High |
| Fleetbase | 30 minutes | 15 minutes | High |
| PayloadCMS | 1 hour | 30 minutes | Medium |
| Walt.id | 1 hour | 30 minutes | Medium |
| MinIO Object Storage | 1 hour | 1 hour | Medium |

### 12.2 Failure Modes & Mitigation

| Failure Scenario | Impact | Detection | Automatic Mitigation | Manual Recovery |
|-----------------|--------|-----------|---------------------|-----------------|
| Temporal Cloud outage | Workflows pause, no new workflows | Health check fails | Events queue in outbox | Process outbox backlog on recovery |
| Stripe unavailable | Payments fail | Payment activity timeout | Retry with backoff | Manual payment reconciliation |
| ERPNext unavailable | Accounting delayed, inventory stale | Health check fails | Queue accounting entries | Bulk sync on recovery |
| Fleetbase unavailable | Deliveries not dispatched | Health check fails | Queue delivery orders | Dispatch backlog on recovery |
| PayloadCMS unavailable | Notifications delayed, content stale | Health check fails | Queue notifications | Bulk send on recovery |
| Walt.id unavailable | KYC/verification delayed | Health check fails | Queue verification requests | Process backlog on recovery |
| PostgreSQL unavailable | Full system outage | Connection failure | Neon automatic failover | Verify data consistency |
| Network partition | Partial system isolation | Cross-system health checks | Circuit breaker activation | Reconcile after partition heals |

### 12.3 Event Outbox as Durability Guarantee

The EventOutbox in PostgreSQL serves as a durable buffer for all cross-system events. If Temporal Cloud or any external system is unavailable:

1. Events are written to `event_outbox` table with status `pending`
2. The outbox processor (`processOutbox()` in `event-dispatcher.ts`) attempts dispatch
3. Failed events are marked `failed` with error message and incremented retry_count
4. The scheduled `OutboxProcessor` workflow retries failed events periodically
5. After `max_retries` exceeded, events move to dead-letter status for manual review

```
Normal Flow:
  Event → Outbox (pending) → Temporal dispatch → Outbox (published)

Failure Flow:
  Event → Outbox (pending) → Temporal unavailable → Outbox (failed, retry_count=1)
       → Retry after interval → Temporal available → Outbox (published)

DLQ Flow:
  Event → Outbox (pending) → 5 failures → Outbox (dead_letter)
       → Admin review → Manual replay OR discard
```

### 12.4 Data Reconciliation Procedures

After any system recovery, run reconciliation to ensure consistency:

| Reconciliation Type | Trigger | Process | Frequency |
|-------------------|---------|---------|-----------|
| Inventory Sync | ERPNext recovery | WF-033 InventorySyncWorkflow (full mode) | On recovery + every 15 min |
| Order Status Sync | Any system recovery | Compare Medusa orders with Stripe/ERPNext/Fleetbase | On recovery |
| Customer Profile Sync | Walt.id recovery | Re-verify pending KYC, re-issue expired credentials | On recovery |
| Content Sync | PayloadCMS recovery | Full CMS page/template sync | On recovery |
| Financial Reconciliation | ERPNext recovery | WF-018 SettlementReconciliationWorkflow | On recovery + daily |

### 12.5 Backup Strategy

| Data Store | Backup Method | Frequency | Retention | Location |
|-----------|--------------|-----------|-----------|----------|
| PostgreSQL (Medusa) | Neon point-in-time recovery | Continuous | 30 days | Same region + cross-region |
| PostgreSQL (EventOutbox) | Included in Medusa backup | Continuous | 30 days | Same region |
| Temporal Workflow History | Managed by Temporal Cloud | Continuous | 30 days | Temporal Cloud |
| MinIO Object Storage | Cross-region replication | Real-time | Indefinite | Secondary region |
| Integration Specs | Git repository | On commit | Indefinite | GitHub |
| Environment Config | Encrypted backup | Daily | 90 days | Secure vault |

---

## 13. Performance & Scaling Constraints

### 13.1 System Rate Limits

| System | Rate Limit | Burst | Throttling Strategy |
|--------|-----------|-------|-------------------|
| Stripe API | 100 req/s (read), 25 req/s (write) | 2x for 10s | Queue with backpressure |
| ERPNext API | 50 req/s (varies by plan) | N/A | Rate-limited activity retry |
| Fleetbase API | 100 req/s | 200/s burst | Standard retry |
| Walt.id API | 30 req/s | N/A | Queue credential operations |
| PayloadCMS API | Depends on deployment | N/A | Standard retry |
| Temporal Cloud | 200 actions/s per namespace (default) | Configurable | Activity-level throttling |

### 13.2 Workflow Concurrency Limits

| Scope | Limit | Rationale |
|-------|-------|-----------|
| Active workflows per tenant | 10,000 | Prevent tenant monopolization |
| Active workflows per task queue | 50,000 | Temporal namespace capacity |
| Concurrent activities per worker | 50-500 (by tier) | See §10.2 scaling table |
| Pending activities per task queue | 100,000 | Temporal queue limit |
| Workflow history events | 50,000 events | Use continue-as-new before limit |
| Workflow execution timeout | 24 hours (default) | Override per workflow type |
| Schedule count per namespace | 1,000 | Temporal Cloud limit |

### 13.3 Batch Processing Guidelines

| Operation | Recommended Batch Size | Max Batch Size | Concurrency |
|-----------|----------------------|----------------|-------------|
| Product catalog sync | 50 items | 200 items | 5 parallel |
| Inventory sync (delta) | 100 variants | 500 variants | 10 parallel |
| Inventory sync (full) | 200 variants | 1000 variants | 20 parallel |
| Customer data export | 100 records | 500 records | 3 parallel |
| Order history migration | 50 orders | 200 orders | 5 parallel |
| Notification bulk send | 100 recipients | 500 recipients | 10 parallel |
| Financial reconciliation | 200 transactions | 1000 transactions | 5 parallel |
| Credential batch issuance | 20 credentials | 50 credentials | 3 parallel |

### 13.4 Latency Budgets

| Operation | p50 Target | p95 Target | p99 Target | Timeout |
|-----------|-----------|-----------|-----------|---------|
| Stripe payment capture | 500ms | 1.5s | 3s | 2 min |
| ERPNext journal entry | 200ms | 800ms | 2s | 30s |
| Fleetbase delivery creation | 300ms | 1s | 3s | 5 min |
| Walt.id credential issuance | 500ms | 2s | 5s | 30s |
| PayloadCMS content sync | 200ms | 600ms | 1.5s | 30s |
| Full order placement workflow | 2s | 8s | 15s | 2 min |
| Vendor onboarding workflow | 5s | 30s | 2 min | 24 hours |
| KYC verification workflow | N/A | N/A | N/A | 7 days |

### 13.5 Database Performance

| Table | Expected Volume (per tenant/year) | Index Strategy |
|-------|----------------------------------|----------------|
| `event_outbox` | 100K–10M events | `(status, created_at)`, `(correlation_id)`, `(tenant_id, event_type)` |
| `sync_entries` (in-memory) | 10K–500K entries | In-memory Map (persisted on demand) |
| Orders | 1K–1M orders | `(tenant_id, created_at)`, `(customer_id)`, `(status)` |
| Products | 100–100K products | `(tenant_id)`, `(handle)`, `(category_id)` |
| Customers | 100–500K customers | `(tenant_id)`, `(email)` |

### 13.6 Scaling Recommendations by Scope Tier

| Tier | Tenants | Products/Tenant | Orders/Day | Workers | DB Connections |
|------|---------|----------------|------------|---------|----------------|
| Nano | 1 | < 100 | < 10 | 1 | 5 |
| Micro | 1-3 | < 500 | < 50 | 1 | 10 |
| Small | 3-10 | < 2,000 | < 200 | 2-3 | 20 |
| Medium | 10-50 | < 10,000 | < 1,000 | 3-5 | 50 |
| Large | 50-200 | < 50,000 | < 5,000 | 5-10 | 100 |
| Mega | 200-1000 | < 200,000 | < 20,000 | 10-20 | 200 |
| Global | 1000+ | Unlimited | Unlimited | Auto-scale | Connection pooling |

---

## 14. Testing Strategy

### 14.1 Test Pyramid

```
                    ┌─────────────────┐
                    │   E2E Tests      │  ← 5% — Full cross-system flows
                   ┌┤  (Playwright)    ├┐
                   │└─────────────────┘│
                  ┌┤  Integration Tests ├┐ ← 20% — System-pair interactions
                  │├───────────────────┤│
                  │├───────────────────┤│
                 ┌┤  Contract Tests     ├┐ ← 25% — API contract verification
                 │├───────────────────┤│
                 │├───────────────────┤│
                ┌┤  Unit Tests          ├┐ ← 50% — Individual functions/modules
                │└─────────────────────┘│
                └───────────────────────┘
```

### 14.2 Integration Test Categories

| Test Category | Scope | Mocking Strategy | CI Frequency |
|--------------|-------|-----------------|-------------|
| Medusa ↔ Temporal | Workflow dispatch, signal handling | Temporal test server (in-process) | Every PR |
| Medusa ↔ Stripe | Payment capture, refund, webhook verification | Stripe test mode | Every PR |
| Medusa ↔ ERPNext | Accounting entries, inventory sync | ERPNext sandbox or mock | Daily |
| Medusa ↔ Fleetbase | Delivery creation, tracking updates | Fleetbase sandbox or mock | Daily |
| Medusa ↔ Walt.id | Credential issuance, verification | Walt.id test instance | Daily |
| Medusa ↔ PayloadCMS | Content sync, webhook processing | PayloadCMS test instance | Daily |
| Full saga tests | Multi-system workflow completion | Mix of real + mock | Weekly |

### 14.3 Contract Testing

Each integration spec file (`lib/integrations/*-spec.ts`) serves as the contract definition. Contract tests verify:

1. **Request format**: API calls match the spec's expected payload structure
2. **Response handling**: Adapters correctly parse successful and error responses
3. **Webhook validation**: Incoming webhooks match expected signature and schema
4. **Idempotency**: Duplicate requests produce identical results

```typescript
describe("ERPNext Contract Tests", () => {
  it("should format sales invoice payload per erpnext-spec", () => {
    const invoice = formatSalesInvoice(order)
    expect(invoice).toMatchObject({
      doctype: "Sales Invoice",
      customer: expect.any(String),
      items: expect.arrayContaining([
        expect.objectContaining({
          item_code: expect.any(String),
          qty: expect.any(Number),
          rate: expect.any(Number),
        }),
      ]),
    })
  })
})
```

### 14.4 Temporal Workflow Testing

```typescript
import { TestWorkflowEnvironment } from "@temporalio/testing"

describe("OrderPlacementWorkflow", () => {
  let env: TestWorkflowEnvironment

  beforeAll(async () => {
    env = await TestWorkflowEnvironment.createLocal()
  })

  it("should complete happy path: capture → reserve → fulfill → notify", async () => {
    const result = await env.client.workflow.execute("cityOSWorkflow", {
      taskQueue: "test-queue",
      workflowId: "test-order-001",
      args: [{
        workflowId: "xsystem.unified-order-orchestrator",
        input: { order_id: "ord_test", tenant_id: "t_001" },
        nodeContext: { tenantId: "t_001" },
        correlationId: "corr_test",
      }],
    })
    expect(result.status).toBe("completed")
  })

  it("should compensate on payment failure", async () => {
    // Mock capturePayment to fail
    const result = await env.client.workflow.execute("cityOSWorkflow", {
      taskQueue: "test-queue",
      workflowId: "test-order-002",
      args: [{
        workflowId: "xsystem.unified-order-orchestrator",
        input: { order_id: "ord_fail", tenant_id: "t_001", __test_fail_payment: true },
        nodeContext: { tenantId: "t_001" },
        correlationId: "corr_test",
      }],
    })
    expect(result.compensated).toBe(true)
    expect(result.compensation_steps).toContain("releaseInventory")
  })
})
```

### 14.5 Chaos Testing Scenarios

| Scenario | Method | Expected Behavior | Validation |
|----------|--------|-------------------|------------|
| Temporal Cloud unavailable | Block gRPC port | Events queue in outbox, no data loss | Outbox count increases, processed on recovery |
| Stripe timeout (50% requests) | Network fault injection | Retry with backoff, eventual capture | Payment eventually succeeds within timeout |
| ERPNext returns 500 | Mock error responses | Accounting entries queued for retry | Entries created after ERPNext recovers |
| Fleetbase webhook delayed | Delay webhook delivery | Order status shows "awaiting delivery update" | Status updates when webhook arrives |
| Database failover | Trigger Neon failover | Brief interruption (< 5s), automatic reconnection | No data loss, all operations resume |
| Network partition (Medusa ↔ ERPNext) | Block network | Circuit breaker opens, fallback to queue | Sync resumes after partition heals |
| High-volume order spike | Load test (10x normal) | Queue depth increases, workers scale, no drops | All orders processed within latency budget |
| Concurrent workflow limit | Saturate task queue | Backpressure applied, new workflows queued | All workflows eventually complete |

### 14.6 Pre-Production Checklist

Before deploying to production, verify:

- [ ] All integration adapters return `healthy: true` from health check
- [ ] Temporal Cloud connection established and workflow dispatch succeeds
- [ ] All webhook endpoints respond to test events with 200
- [ ] Event outbox processor runs and clears pending events
- [ ] Circuit breakers configured for all external systems
- [ ] Monitoring dashboards show data from all systems
- [ ] Alert rules configured and tested (PagerDuty/Slack integration)
- [ ] Backup and restore procedure tested for PostgreSQL
- [ ] Load test completed at 2x expected peak volume
- [ ] Reconciliation workflows tested (inventory, financial, customer)

---

## 15. Operational Runbooks

### 15.1 Incident Response

#### Severity Classification

| Severity | Description | Examples | Response Time | Escalation |
|----------|-----------|---------|---------------|------------|
| P1 — Critical | Complete system outage or data loss risk | Database down, Temporal unavailable, payment processing failed for all | 5 minutes | Immediate page to on-call |
| P2 — High | Major feature degradation affecting many users | Sync lag > 5 min, high workflow failure rate, webhook processing stopped | 15 minutes | Page after 15 min |
| P3 — Medium | Minor feature degradation or intermittent issues | Single system slow, occasional sync failures, single tenant affected | 1 hour | Slack notification |
| P4 — Low | Cosmetic or non-urgent issues | Log noise, minor metric anomaly, documentation gap | Next business day | Ticket |

#### Incident Response Steps

1. **Detect**: Automated alert or user report
2. **Acknowledge**: On-call acknowledges within response time
3. **Assess**: Determine severity, affected systems, impacted tenants
4. **Communicate**: Post in #incidents channel with summary
5. **Mitigate**: Apply immediate fix or workaround
6. **Resolve**: Implement permanent fix
7. **Post-mortem**: Within 48 hours for P1/P2

### 15.2 Common Operational Procedures

#### Procedure: Clear Event Outbox Backlog

**When**: Event outbox has > 100 pending events or events older than 1 hour.

```bash
# 1. Check outbox status
curl -s http://localhost:9000/admin/integrations/dashboard | jq '.stats'

# 2. Check if Temporal is healthy
curl -s http://localhost:9000/admin/temporal | jq '.connected'

# 3. If Temporal is healthy, trigger outbox processing
curl -X POST http://localhost:9000/admin/integrations/process-outbox

# 4. If Temporal is NOT healthy, wait for recovery
# Events are safe in PostgreSQL — they won't be lost

# 5. After recovery, process the backlog
curl -X POST http://localhost:9000/admin/integrations/process-outbox

# 6. Verify backlog is cleared
curl -s http://localhost:9000/admin/integrations/dashboard | jq '.stats.pending'
```

#### Procedure: Retry Failed Sync Operations

**When**: Sync tracker shows failed entries.

```bash
# 1. Check failed syncs
curl -s http://localhost:9000/admin/integrations/dashboard | jq '.failedSyncs'

# 2. Retry all failed syncs (with exponential backoff)
curl -X POST http://localhost:9000/admin/integrations/retry-failed

# 3. Check specific system health
curl -s http://localhost:9000/admin/integrations/health | jq '.[] | select(.system == "erpnext")'

# 4. If system is unhealthy, check environment variables
# Verify ERPNEXT_URL, ERPNEXT_API_KEY, ERPNEXT_API_SECRET are set

# 5. After fixing, retry again
curl -X POST http://localhost:9000/admin/integrations/retry-failed
```

#### Procedure: Manual Workflow Trigger

**When**: Need to manually start a workflow for testing or recovery.

```bash
# 1. Trigger a specific workflow
curl -X POST http://localhost:9000/admin/temporal/trigger \
  -H "Content-Type: application/json" \
  -d '{
    "workflowId": "xsystem.unified-order-orchestrator",
    "input": {
      "order_id": "ord_12345",
      "tenant_id": "t_001"
    },
    "nodeContext": {
      "tenantId": "t_001",
      "nodeId": "node_city_001"
    }
  }'

# 2. Check workflow status
curl -s http://localhost:9000/admin/temporal/workflows?limit=5 | jq '.workflows'

# 3. Trigger via event type (auto-resolves workflow ID)
curl -X POST http://localhost:9000/admin/temporal/trigger \
  -H "Content-Type: application/json" \
  -d '{
    "workflowId": "manual",
    "eventType": "order.placed",
    "input": { "order_id": "ord_12345" },
    "nodeContext": { "tenantId": "t_001" }
  }'
```

#### Procedure: System Health Check

**When**: Periodic verification or after deployment.

```bash
# 1. Full health check
curl -s http://localhost:9000/admin/integrations/health | jq '.'

# 2. Temporal-specific health
curl -s http://localhost:9000/admin/temporal | jq '.'

# 3. Integration dashboard (sync stats + health)
curl -s http://localhost:9000/admin/integrations/dashboard | jq '.'

# 4. List active Temporal workflows
curl -s http://localhost:9000/admin/temporal/workflows?limit=20 | jq '.workflows[] | {workflowId, status, type}'
```

#### Procedure: Inventory Reconciliation

**When**: Suspected inventory drift between Medusa and ERPNext.

```bash
# 1. Trigger full inventory sync
curl -X POST http://localhost:9000/admin/temporal/trigger \
  -H "Content-Type: application/json" \
  -d '{
    "workflowId": "xsystem.inventory-full-sync",
    "input": {
      "sync_type": "full",
      "tenant_id": "t_001"
    },
    "nodeContext": { "tenantId": "t_001" }
  }'

# 2. Monitor sync progress
curl -s http://localhost:9000/admin/temporal/workflows?limit=5 | jq '.workflows[] | select(.type == "InventorySyncWorkflow")'
```

### 15.3 Troubleshooting Guide

| Symptom | Likely Cause | Diagnostic Steps | Resolution |
|---------|-------------|-----------------|------------|
| Workflows not starting | Temporal Cloud connection failure | Check `GET /admin/temporal`, verify `TEMPORAL_API_KEY` | Verify API key, check Temporal Cloud status page |
| Webhooks not processing | Webhook endpoint misconfigured | Check webhook logs, verify secret/signature config | Update webhook URL and secrets in external system |
| Sync entries stuck in "in_progress" | Worker crashed mid-sync | Check sync tracker dashboard | Retry failed syncs, investigate worker logs |
| Payment workflows failing | Stripe API issues or key rotation | Check Stripe dashboard, verify `STRIPE_SECRET_KEY` | Update Stripe keys, retry pending payments |
| High workflow failure rate | External system degraded | Check all system health endpoints | Enable circuit breaker, queue operations for later |
| Event outbox growing | Temporal dispatch failing | Check Temporal health, outbox error messages | Fix Temporal connection, process backlog |
| Inventory mismatch | ERPNext sync lag or failure | Compare Medusa and ERPNext quantities | Run full inventory sync (WF-033) |
| Duplicate operations | Missing idempotency key | Check if activities have idempotency keys | Add/fix idempotency key derivation |
| Cross-tenant data leak | Workflow ID without tenant prefix | Audit workflow IDs | Fix workflow ID generation to include `tenant:{id}:` prefix |
| Slow workflow execution | Activity timeout or retry storms | Check activity duration metrics, retry counts | Adjust timeouts, investigate root cause of retries |

### 15.4 Maintenance Windows

| Task | Frequency | Duration | Impact |
|------|-----------|----------|--------|
| Temporal worker rolling restart | Weekly | 5 minutes | Zero downtime (rolling) |
| Database maintenance (Neon) | Monthly | 0 (online) | None (managed) |
| Integration key rotation | Quarterly (90 days) | 15 minutes | Brief sync interruption |
| Full system reconciliation | Monthly | 30 minutes | Background process, no impact |
| Log rotation and cleanup | Daily | 0 (automated) | None |
| Performance load test | Quarterly | 2 hours | Staging environment only |

---

*This document is the single source of truth for cross-system architecture. All teams should reference this when implementing integrations, building new features, or debugging cross-system issues.*

*Last updated: 2026-02-10 | Next review: 2026-03-01*
