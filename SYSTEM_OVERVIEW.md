# Multi-Tenant B2B Marketplace - Complete System Overview

## Table of Contents
1. [System Architecture](#system-architecture)
2. [User Personas](#user-personas)
3. [Project Scope](#project-scope)
4. [Technical Structure](#technical-structure)
5. [User Journeys](#user-journeys)
6. [Data Flow](#data-flow)

---

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    MULTI-TENANT B2B MARKETPLACE                 │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  STOREFRONT  │    │   BACKEND    │    │ ORCHESTRATOR │
│  (TanStack)  │◄──►│  (Medusa 2)  │◄──►│  (Payload)   │
└──────────────┘    └──────────────┘    └──────────────┘
      │                    │                    │
      │                    │                    │
      ▼                    ▼                    ▼
┌──────────────────────────────────────────────────────┐
│            POSTGRESQL DATABASE (Shared)              │
└──────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────┐
│              REDIS (Queue + Cache)                   │
└──────────────────────────────────────────────────────┘
```

### Three Core Systems

#### 1. **Medusa Backend** (E-commerce Engine)
**Port:** 9000  
**Purpose:** Commerce operations, orders, payments, inventory

**Key Responsibilities:**
- Product catalog management
- Order processing
- Payment handling
- Customer management
- Vendor operations
- B2B quotes
- Commission tracking

**Custom Modules:**
- `vendor` - Multi-vendor marketplace
- `tenant` - Multi-tenant isolation
- `quote` - B2B quotation system
- `company` - B2B company accounts
- `volume-pricing` - Tiered pricing
- `commission` - Vendor payouts

#### 2. **Payload CMS** (Content & Orchestration)
**Port:** 3001  
**Purpose:** Content management, data orchestration, sync coordination

**Key Responsibilities:**
- Content creation (pages, blogs, marketing)
- Brand management (logos, colors, fonts)
- Data synchronization
- Event orchestration
- Webhook processing
- Job queue management

**Collections:**
- `products` - Synced from Medusa
- `vendors` - Vendor profiles
- `tenants` - Store/tenant data
- `pages` - Dynamic content pages
- `media` - Asset management

#### 3. **TanStack Storefront** (Customer-Facing UI)
**Port:** 3000  
**Purpose:** Customer experience, vendor portal, multi-tenant UI

**Key Responsibilities:**
- Multi-store selection
- Product browsing
- B2B quote requests
- Vendor dashboard
- Dynamic CMS pages
- Tenant-specific branding

---

## User Personas

### 1. **Platform Administrator (Super Admin)**

**Who:** Owner/operator of the entire marketplace platform

**Goals:**
- Manage all tenants and vendors
- Monitor platform health
- Configure commissions
- Approve new vendors
- View analytics across all stores

**Access:**
- Medusa Admin Dashboard
- Payload CMS Admin
- Orchestrator metrics
- All system settings

**Typical Tasks:**
```
1. Morning: Check platform health (/api/health)
2. Review pending vendor applications
3. Approve/reject new vendor signups
4. Configure commission rates per tenant
5. Monitor sync jobs and webhooks
6. Review financial reports
```

**Key Screens:**
- `/admin/vendors` - Vendor approval workflow
- `/admin/tenants` - Tenant management
- Medusa Admin - Full product/order access
- Payload CMS - Content management

---

### 2. **Tenant Owner (Store Owner)**

**Who:** Operates a branded store within the marketplace (e.g., "Nike Store", "Adidas Store")

**Goals:**
- Manage their store's branding
- Curate products for their store
- View store-specific analytics
- Manage pricing for their tenant
- Create marketing content

**Access:**
- Limited Medusa Admin (tenant-scoped)
- Payload CMS (tenant-scoped)
- Tenant-specific reports

**Typical Tasks:**
```
1. Update store branding (logo, colors)
2. Create landing pages in Payload
3. Set pricing rules for products
4. Review sales performance
5. Manage product visibility
6. Create promotions
```

**Key Screens:**
- Payload CMS - Create pages with blocks
- Medusa Admin - Products (filtered by tenant)
- Storefront - Preview their store

**Example Tenant:** 
- Name: "Nike Performance"
- Slug: `nike-performance`
- URL: `/us/stores` → select Nike
- Branding: Nike colors, logo, fonts
- Products: Only Nike-branded items

---

### 3. **Vendor (Seller/Supplier)**

**Who:** Third-party seller providing products through the marketplace

**Goals:**
- List and manage products
- Fulfill orders
- Track commissions
- Request payouts
- Monitor sales performance

**Access:**
- Vendor Portal (Storefront at `/us/vendor/*`)
- Limited API access
- Order notifications

**Typical Tasks:**
```
1. List new products
2. Update inventory
3. View incoming orders
4. Mark orders as fulfilled
5. Track commission earnings
6. Request payouts
```

**Key Screens:**
- `/us/vendor` - Dashboard (sales stats)
- `/us/vendor/products` - Product management
- `/us/vendor/orders` - Order fulfillment
- `/us/vendor/commissions` - Earnings tracking
- `/us/vendor/payouts` - Payout requests

**Example Vendor:**
- Name: "Elite Sports Supply"
- Commission Rate: 15%
- Products: 45 items
- Monthly Sales: $12,450
- Pending Payout: $1,867.50

---

### 4. **B2B Customer (Business Buyer)**

**Who:** Business purchasing in bulk with special pricing and quotes

**Goals:**
- Request bulk quotes
- Get volume pricing
- Track company orders
- Manage team members

**Access:**
- Storefront (authenticated)
- B2B features (quotes, volume pricing)
- Company dashboard

**Typical Tasks:**
```
1. Browse products
2. Add to cart in bulk quantities
3. Request quote for custom pricing
4. Review and accept quotes
5. Place orders
6. Track order status
```

**Key Screens:**
- `/us/products` - Browse with volume pricing
- `/us/quotes/request` - Request quote
- `/us/quotes` - View all quotes
- `/us/b2b/register` - Company registration
- Product pages - See volume discounts

**Example B2B Customer:**
- Company: "Fitness First Gyms"
- Volume Tier: 100+ units = 20% off
- Open Quote: $8,500 for 200 yoga mats
- Monthly Spend: $25,000

---

### 5. **Regular Customer (End Consumer)**

**Who:** Individual shopping for personal use

**Goals:**
- Browse products
- Make purchases
- Track orders
- Read content

**Access:**
- Storefront (guest or authenticated)
- Public pages

**Typical Tasks:**
```
1. Visit store selection page
2. Select preferred tenant/store
3. Browse products
4. Add to cart
5. Checkout
6. Track order
```

**Key Screens:**
- `/us/stores` - Store selection
- `/us/products` - Product catalog
- `/us/products/[handle]` - Product details
- `/us/cart` - Shopping cart
- `/us/checkout` - Checkout flow
- Dynamic pages - Marketing content

---

## Project Scope

### What's Included ✅

#### **Multi-Tenancy**
- Multiple branded stores on one platform
- Tenant-specific branding (logo, colors, fonts)
- Isolated product catalogs per tenant
- Store selection interface
- Dynamic store switching

#### **Multi-Vendor Marketplace**
- Vendor registration & approval
- Vendor product management
- Commission calculation
- Payout request system
- Order fulfillment tracking
- Vendor dashboard with analytics

#### **B2B Commerce**
- Quote request system
- Quote approval workflow
- Volume pricing tiers
- Company account registration
- Bulk order support

#### **Content Management**
- Headless CMS (Payload)
- Dynamic page builder (5 block types)
- Brand management
- Media management
- SEO optimization

#### **Synchronization**
- Bidirectional Medusa ↔ Payload sync
- Event-driven webhooks
- Redis job queue
- Automatic reconciliation
- Real-time updates

#### **Developer Features**
- REST APIs (41 endpoints)
- Admin widgets
- Custom Medusa modules
- TypeScript throughout
- Comprehensive testing

#### **Production Ready**
- Redis caching
- Health monitoring
- Metrics tracking
- Error logging
- Performance optimization

### What's NOT Included ❌

#### **Out of Scope (By Design):**
- Subscription/recurring billing
- Multi-channel inventory (POS systems)
- Advanced shipping integrations (FedEx, UPS APIs)
- Payment gateway integrations (handled by Medusa)
- Email marketing automation (Klaviyo, Mailchimp)
- Advanced analytics (Google Analytics integration needed)
- Mobile apps (only web responsive)

---

## Technical Structure

### Directory Structure

```
workspace/
├── apps/
│   ├── backend/                # Medusa 2.0 Backend
│   │   ├── src/
│   │   │   ├── modules/        # Custom modules
│   │   │   │   ├── vendor/     # Vendor marketplace
│   │   │   │   ├── tenant/     # Multi-tenancy
│   │   │   │   ├── quote/      # B2B quotes
│   │   │   │   ├── company/    # B2B companies
│   │   │   │   ├── volume-pricing/
│   │   │   │   └── commission/
│   │   │   ├── api/            # API routes
│   │   │   │   ├── store/      # Customer APIs
│   │   │   │   ├── vendor/     # Vendor APIs
│   │   │   │   └── admin/      # Admin APIs
│   │   │   └── admin/          # Admin customizations
│   │   │       ├── widgets/    # Dashboard widgets
│   │   │       └── routes/     # Admin pages
│   │   └── medusa-config.ts
│   │
│   ├── orchestrator/           # Payload CMS + Sync Engine
│   │   ├── src/
│   │   │   ├── collections/    # Payload collections
│   │   │   │   ├── Products.ts
│   │   │   │   ├── Vendors.ts
│   │   │   │   ├── Tenants.ts
│   │   │   │   ├── Pages.ts
│   │   │   │   └── Media.ts
│   │   │   ├── lib/
│   │   │   │   ├── sync/       # Sync services
│   │   │   │   ├── queue/      # Bull queue
│   │   │   │   ├── cache.ts    # Redis cache
│   │   │   │   └── monitoring.ts
│   │   │   └── app/
│   │   │       └── api/        # Webhook handlers
│   │   └── tests/              # Integration tests
│   │
│   └── storefront/             # TanStack Start
│       ├── src/
│       │   ├── routes/         # File-based routing
│       │   │   ├── $countryCode/
│       │   │   │   ├── stores.tsx      # Store selection
│       │   │   │   ├── $slug.tsx       # Dynamic CMS pages
│       │   │   │   ├── products/
│       │   │   │   ├── quotes/         # B2B quotes
│       │   │   │   ├── vendor/         # Vendor portal
│       │   │   │   └── b2b/            # Company registration
│       │   │   └── __root.tsx
│       │   ├── components/
│       │   │   ├── blocks/     # CMS block components
│       │   │   ├── vendor/     # Vendor UI components
│       │   │   ├── quotes/     # Quote components
│       │   │   └── store/      # Multi-tenant components
│       │   └── lib/
│       │       ├── api/        # API client
│       │       ├── context/    # React contexts
│       │       └── data/       # Data fetching
│       └── e2e/                # Playwright tests
│
└── docs/
    ├── SYSTEM_OVERVIEW.md (this file)
    ├── FINAL_IMPLEMENTATION_STATUS.md
    ├── TESTING_GUIDE.md
    └── VERCEL_DEPLOYMENT_GUIDE.md
```

### Database Schema (Key Tables)

```
PostgreSQL Tables:

Medusa Core:
- product (Medusa managed)
- product_variant
- cart
- order
- customer
- region

Custom Modules:
- vendor (vendor profiles)
- tenant (store tenants)
- quote (B2B quotes)
- quote_item
- company (B2B companies)
- volume_pricing_tier
- vendor_transaction (commissions)
- vendor_payout

Payload Collections:
- products (synced from Medusa)
- vendors (synced from Medusa)
- tenants (synced from Medusa)
- pages (CMS content)
- media (assets)
- payload_preferences
```

---

## User Journeys

### Journey 1: Customer Discovers and Purchases

```
1. Customer visits homepage
   → Redirected to /us/stores (store selection)

2. Views available stores
   → Sees: Nike Store, Adidas Store, Puma Store
   → Each has logo, description, product count

3. Selects "Nike Store"
   → Branding applies: Nike logo, colors (black/white)
   → Products filtered: Only Nike items visible

4. Browses products
   → Sees product cards with images, prices
   → Volume pricing displayed if B2B customer

5. Clicks product
   → Product detail page
   → Add to cart button
   → Volume pricing table (if applicable)

6. Adds to cart
   → Cart updates
   → Option to "Request Quote" if B2B

7. Proceeds to checkout
   → Standard Medusa checkout flow
   → Payment processing
   → Order confirmation

8. Store switcher in header
   → Can switch to different tenant anytime
   → Branding updates instantly
```

### Journey 2: B2B Customer Requests Quote

```
1. B2B customer logs in
   → Company account: "Fitness First Gyms"

2. Adds 200 units of yoga mat to cart
   → Sees volume pricing: 100+ = 20% off
   → Current price: $4,000 (from $5,000)

3. Wants custom pricing
   → Clicks "Request Quote" button

4. Fill quote form
   → Quantity: 200
   → Delivery Date: 2024-12-01
   → Message: "Need for 10 gym locations"

5. Submit quote request
   → API: POST /store/quotes
   → Quote status: "pending"
   → Admin notified

6. Admin reviews in Medusa Admin
   → Approves with $3,500 total (30% off)
   → Status: "approved"

7. Customer receives notification
   → Views quote at /us/quotes/[id]
   → Accepts quote

8. Quote converts to order
   → Checkout with quote price
   → Order placed with special pricing
```

### Journey 3: Vendor Lists Product and Fulfills Order

```
1. Vendor logs into portal
   → /us/vendor
   → Dashboard shows: Sales, Orders, Commission

2. Clicks "Products"
   → /us/vendor/products
   → See all their products

3. Click "Add Product"
   → Form: Title, Description, Price, Images
   → Select tenant(s) to sell on
   → Submit

4. Product created in Medusa
   → Webhook fires → Syncs to Payload
   → Appears in storefront
   → Commission rate applied (15%)

5. Customer orders vendor's product
   → Order appears in /us/vendor/orders
   → Status: "pending"

6. Vendor processes order
   → Clicks "Fulfill"
   → Marks as shipped
   → Enters tracking number

7. Commission calculated
   → Order: $100
   → Commission (15%): $15
   → Shows in /us/vendor/commissions

8. Vendor requests payout
   → /us/vendor/payouts
   → Clicks "Request Payout"
   → Admin processes payment
```

### Journey 4: Tenant Owner Creates Marketing Page

```
1. Tenant owner logs into Payload CMS
   → https://orchestrator.vercel.app/admin

2. Navigates to "Pages"
   → Creates new page

3. Fills page details
   → Title: "Holiday Sale"
   → Slug: "holiday-sale"
   → Tenant: Nike Store
   → Status: Published

4. Adds content blocks
   Block 1: Hero Block
   - Heading: "50% Off Holiday Sale"
   - Subheading: "Limited Time"
   - CTA: "Shop Now" → /us/products
   - Background image

   Block 2: Featured Products
   - Select 4 products from Medusa
   - Auto-fetched via sync

   Block 3: Content Block
   - Rich text about sale
   - Images

   Block 4: CTA Block
   - "Don't Miss Out"
   - Button to products

5. Publishes page
   → Webhook fires
   → Syncs to Medusa metadata

6. Page available at:
   → /us/holiday-sale
   → Renders with all blocks
   → Nike branding applied
```

### Journey 5: Admin Approves Vendor

```
1. New vendor registers
   → Fills vendor application
   → Submits

2. Vendor record created
   → Status: "pending_approval"
   → Admin notified

3. Admin logs into Medusa Admin
   → Navigates to custom route: /admin/vendors

4. Reviews vendor application
   → Company name: "Elite Sports Supply"
   → Tax ID: XXX-XX-XXXX
   → Product category: Sports equipment

5. Clicks "Approve"
   → Modal: Set commission rate (15%)
   → Confirm approval

6. Vendor status updated
   → Status: "active"
   → Commission rate: 15%
   → Webhook fires → Syncs to Payload

7. Vendor receives email
   → "Your vendor account is approved"
   → Can now log into vendor portal
```

---

## Data Flow

### Product Creation Flow

```
1. VENDOR creates product in Vendor Portal
   ↓
   POST /vendor/products
   ↓
2. MEDUSA creates product record
   - Validates data
   - Sets vendor_id
   - Emits event: "product.created"
   ↓
3. WEBHOOK to Orchestrator
   POST /api/webhooks/medusa
   ↓
4. ORCHESTRATOR queues sync job
   Bull Queue: "sync-product-to-payload"
   ↓
5. WORKER processes job
   - Fetches full product data from Medusa
   - Creates/updates in Payload
   ↓
6. PAYLOAD product record created
   - Synced fields: id, title, description, price
   - Relationship: vendor_id
   ↓
7. STOREFRONT fetches product
   - API call to Medusa
   - Includes metadata from Payload
   - Displays to customer
```

### Quote Request Flow

```
1. CUSTOMER submits quote request
   ↓
   POST /store/quotes
   {
     items: [{product_id, quantity, price}],
     message: "Need bulk pricing",
     delivery_date: "2024-12-01"
   }
   ↓
2. MEDUSA creates quote
   - Status: "pending"
   - Calculates total
   - Links to customer
   ↓
3. ADMIN receives notification
   - Views in Medusa Admin
   - Reviews quote details
   ↓
4. ADMIN approves quote
   - Sets approved_price
   - Status: "approved"
   - Emits: "quote.approved"
   ↓
5. CUSTOMER notified
   - Email sent
   - Views at /us/quotes/[id]
   ↓
6. CUSTOMER accepts quote
   POST /store/quotes/[id]/accept
   ↓
7. QUOTE converts to cart
   - Creates cart with quote prices
   - Customer proceeds to checkout
   ↓
8. ORDER placed
   - Regular order flow
   - Special pricing preserved
```

### Sync Reconciliation Flow

```
Runs every 6 hours:

1. RECONCILIATION job starts
   ↓
2. Fetch all products from MEDUSA
   ↓
3. Fetch all products from PAYLOAD
   ↓
4. Compare records
   - Missing in Payload? → Create
   - Different data? → Update
   - Missing in Medusa? → Delete from Payload
   ↓
5. Process discrepancies
   - Queue individual sync jobs
   - Update sync_status
   ↓
6. Log results
   {
     checked: 1500,
     synced: 12,
     errors: 0,
     duration: "2.3s"
   }
   ↓
7. MONITORING captures metrics
   - Sync success rate: 99.2%
   - Average sync time: 230ms
```

### Commission Calculation Flow

```
1. CUSTOMER completes order
   ↓
   Order includes vendor product
   ↓
2. MEDUSA "order.placed" event
   ↓
3. COMMISSION module calculates
   - Order item: $100
   - Vendor commission rate: 15%
   - Commission: $15
   ↓
4. Create vendor_transaction record
   {
     vendor_id: "ven_123",
     order_id: "order_456",
     amount: 15.00,
     rate: 0.15,
     status: "pending"
   }
   ↓
5. VENDOR views in dashboard
   /us/vendor/commissions
   - Shows pending commission
   ↓
6. VENDOR requests payout
   - Button: "Request Payout"
   - Minimum: $100
   ↓
7. ADMIN processes payout
   - Reviews in admin
   - Marks as "paid"
   - Updates vendor_payout record
   ↓
8. VENDOR receives payment
   - Status: "completed"
   - No longer shows as pending
```

---

## API Overview

### Store APIs (Customer-Facing)

```
GET    /store/quotes              # List customer quotes
POST   /store/quotes              # Create quote request
GET    /store/quotes/:id          # Get quote details
POST   /store/quotes/:id/accept   # Accept quote
POST   /store/quotes/:id/decline  # Decline quote

GET    /store/volume-pricing/:productId  # Get volume tiers
POST   /store/companies           # Register company (B2B)
GET    /store/products            # List products (tenant-filtered)
```

### Vendor APIs

```
GET    /vendor/dashboard          # Stats: sales, orders, commissions
GET    /vendor/products           # List vendor products
POST   /vendor/products           # Create product
PUT    /vendor/products/:id       # Update product
DELETE /vendor/products/:id       # Delete product

GET    /vendor/orders             # List vendor orders
POST   /vendor/orders/:id/fulfill # Mark order fulfilled

GET    /vendor/transactions       # Commission history
GET    /vendor/payouts            # Payout requests
POST   /vendor/payouts            # Request payout
```

### Orchestrator APIs

```
POST   /api/webhooks/medusa       # Medusa events
POST   /api/webhooks/payload      # Payload events
GET    /api/health                # System health check
GET    /api/metrics               # Performance metrics
GET    /api/queue/stats           # Job queue status
```

---

## Key Features by Persona

### Platform Admin
- ✅ Approve/reject vendors
- ✅ Configure commission rates
- ✅ Manage all tenants
- ✅ View platform analytics
- ✅ Monitor system health
- ✅ Process payouts

### Tenant Owner
- ✅ Customize store branding
- ✅ Create marketing pages
- ✅ Manage product visibility
- ✅ Set pricing rules
- ✅ View tenant analytics

### Vendor
- ✅ List products
- ✅ Fulfill orders
- ✅ Track commissions
- ✅ Request payouts
- ✅ View sales dashboard

### B2B Customer
- ✅ Request quotes
- ✅ View volume pricing
- ✅ Register company
- ✅ Bulk ordering
- ✅ Track quotes

### Regular Customer
- ✅ Select store/tenant
- ✅ Browse products
- ✅ Add to cart
- ✅ Checkout
- ✅ View dynamic content

---

## Summary

This is a **complete enterprise-grade multi-tenant B2B marketplace** with:

- **3 systems** working together (Medusa, Payload, Storefront)
- **5 user personas** with distinct roles
- **85+ files** and 18,000+ lines of code
- **41 API endpoints** across all systems
- **Full test coverage** (integration + E2E)
- **Production ready** with caching, monitoring, logging

The platform enables **multiple branded stores** (tenants) to operate on a single infrastructure, with **multiple vendors** selling products, supporting both **B2C and B2B** commerce models, all managed through a **headless CMS** with **real-time synchronization**.
