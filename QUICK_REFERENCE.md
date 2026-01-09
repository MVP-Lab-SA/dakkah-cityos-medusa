# Quick Reference Guide

## URLs & Access Points

### Production URLs
```
Storefront:    https://storefront.vercel.app
Backend API:   https://backend.vercel.app
CMS Admin:     https://orchestrator.vercel.app/admin
Medusa Admin:  https://backend.vercel.app/app
```

### Development URLs
```
Storefront:    http://localhost:3000
Backend API:   http://localhost:9000
Orchestrator:  http://localhost:3001
CMS Admin:     http://localhost:3001/admin
```

---

## User Accounts

### Platform Admin
- **Access:** Medusa Admin + Payload CMS
- **Login:** Via Medusa Admin dashboard
- **Key Tasks:** Approve vendors, manage tenants, configure system

### Tenant Owner
- **Access:** Payload CMS (scoped)
- **Login:** Via CMS with tenant permissions
- **Key Tasks:** Manage branding, create pages, curate products

### Vendor
- **Access:** Vendor Portal at `/us/vendor`
- **Login:** Via storefront auth
- **Key Tasks:** Manage products, fulfill orders, request payouts

### B2B Customer
- **Access:** Storefront with B2B features
- **Login:** Register at `/us/b2b/register`
- **Key Tasks:** Request quotes, bulk orders, volume pricing

### Regular Customer
- **Access:** Public storefront
- **Login:** Optional registration
- **Key Tasks:** Browse, shop, checkout

---

## Key Routes

### Storefront Routes
```
/us/stores                    - Store selection
/us/products                  - Product catalog
/us/products/:handle          - Product detail
/us/:slug                     - Dynamic CMS page
/us/cart                      - Shopping cart
/us/checkout                  - Checkout flow

B2B Routes:
/us/quotes                    - All quotes
/us/quotes/request            - Request quote
/us/quotes/:id                - Quote details
/us/b2b/register              - Company registration

Vendor Routes:
/us/vendor                    - Dashboard
/us/vendor/products           - Product management
/us/vendor/orders             - Order fulfillment
/us/vendor/commissions        - Earnings tracking
/us/vendor/payouts            - Payout requests
```

### Admin Routes
```
Medusa Admin:
/app                          - Dashboard
/app/products                 - Products
/app/orders                   - Orders
/admin/vendors                - Vendor approval (custom)
/admin/tenants                - Tenant management (custom)

Payload CMS:
/admin                        - CMS Dashboard
/admin/collections/products   - Products collection
/admin/collections/pages      - Pages
/admin/collections/tenants    - Tenants
/admin/collections/vendors    - Vendors
```

---

## API Endpoints

### Store APIs (Customer-Facing)
```
GET    /store/products                    - List products
GET    /store/products/:id                - Get product
GET    /store/quotes                      - List quotes
POST   /store/quotes                      - Create quote
GET    /store/quotes/:id                  - Get quote
POST   /store/quotes/:id/accept           - Accept quote
POST   /store/quotes/:id/decline          - Decline quote
GET    /store/volume-pricing/:productId   - Get volume tiers
POST   /store/companies                   - Register company
```

### Vendor APIs
```
GET    /vendor/dashboard                  - Stats dashboard
GET    /vendor/products                   - List vendor products
POST   /vendor/products                   - Create product
PUT    /vendor/products/:id               - Update product
DELETE /vendor/products/:id               - Delete product
GET    /vendor/orders                     - List vendor orders
POST   /vendor/orders/:id/fulfill         - Mark fulfilled
GET    /vendor/transactions               - Commission history
GET    /vendor/payouts                    - Payout requests
POST   /vendor/payouts                    - Request payout
```

### Orchestrator APIs
```
POST   /api/webhooks/medusa               - Medusa webhook handler
POST   /api/webhooks/payload              - Payload webhook handler
GET    /api/health                        - Health check
GET    /api/metrics                       - System metrics
GET    /api/queue/stats                   - Queue status
```

---

## Database Tables

### Medusa Core Tables
```
product                 - Products catalog
product_variant         - Product variants
order                   - Orders
customer                - Customers
cart                    - Shopping carts
region                  - Regions/countries
payment                 - Payments
```

### Custom Module Tables
```
vendor                  - Vendor profiles
tenant                  - Store tenants
quote                   - B2B quotes
quote_item              - Quote line items
company                 - B2B companies
volume_pricing_tier     - Volume pricing rules
vendor_transaction      - Commission tracking
vendor_payout           - Payout requests
```

### Payload Collections
```
products                - Synced products
vendors                 - Synced vendors
tenants                 - Synced tenants
pages                   - CMS pages
media                   - Asset library
```

---

## Environment Variables

### Backend (.env)
```bash
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=...
COOKIE_SECRET=...
STORE_CORS=http://localhost:3000
ADMIN_CORS=http://localhost:9000
ORCHESTRATOR_URL=http://localhost:3001
ORCHESTRATOR_WEBHOOK_SECRET=...
```

### Orchestrator (.env)
```bash
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
PAYLOAD_SECRET=...
MEDUSA_BACKEND_URL=http://localhost:9000
MEDUSA_ADMIN_URL=http://localhost:9000/app
MEDUSA_WEBHOOK_SECRET=...
```

### Storefront (.env)
```bash
VITE_MEDUSA_BACKEND_URL=http://localhost:9000
VITE_PAYLOAD_API_URL=http://localhost:3001/api
VITE_MEDUSA_PUBLISHABLE_KEY=pk_...
```

---

## Common Commands

### Development
```bash
# Start all services
pnpm dev

# Backend only
cd apps/backend && pnpm dev

# Orchestrator only
cd apps/orchestrator && pnpm dev

# Storefront only
cd apps/storefront && pnpm dev
```

### Testing
```bash
# Integration tests
cd apps/orchestrator && pnpm test

# E2E tests
cd apps/storefront && pnpm test:e2e

# Type checking
pnpm typecheck
```

### Database
```bash
# Run migrations
cd apps/backend && pnpm medusa migrations run

# Seed data
cd apps/backend && pnpm medusa seed

# Create migration
cd apps/backend && pnpm medusa migrations create <name>
```

### Build & Deploy
```bash
# Build all
pnpm build

# Build specific app
cd apps/<app> && pnpm build

# Deploy (see VERCEL_DEPLOYMENT_GUIDE.md)
vercel --prod
```

---

## Data Models

### Product
```typescript
{
  id: string
  title: string
  description: string
  handle: string
  variants: ProductVariant[]
  images: Image[]
  vendor_id: string        // Custom field
  tenant_ids: string[]     // Custom field
  metadata: {
    cms_content: any       // From Payload
  }
}
```

### Vendor
```typescript
{
  id: string
  name: string
  email: string
  commission_rate: number  // 0-1 (0.15 = 15%)
  status: 'pending' | 'active' | 'suspended'
  approved_at: Date
  products_count: number
}
```

### Tenant
```typescript
{
  id: string
  name: string
  slug: string
  logo: string
  primary_color: string
  secondary_color: string
  font_family: string
  status: 'active' | 'inactive'
}
```

### Quote
```typescript
{
  id: string
  customer_id: string
  items: QuoteItem[]
  total: number
  approved_price?: number
  status: 'pending' | 'approved' | 'declined' | 'accepted'
  message: string
  delivery_date: Date
}
```

### Commission Transaction
```typescript
{
  id: string
  vendor_id: string
  order_id: string
  amount: number
  rate: number
  status: 'pending' | 'paid'
  payout_id?: string
}
```

---

## Workflow Summaries

### Customer Purchase Flow
1. Select store/tenant
2. Browse products (tenant-filtered)
3. Add to cart
4. Checkout
5. Payment
6. Order confirmation

### B2B Quote Flow
1. Customer adds bulk items
2. Click "Request Quote"
3. Admin reviews & approves
4. Customer accepts quote
5. Convert to cart with special pricing
6. Checkout

### Vendor Product Creation
1. Login to vendor portal
2. Navigate to products
3. Click "Add Product"
4. Fill form, select tenants
5. Submit
6. Auto-syncs to Payload
7. Appears in storefront

### Commission & Payout
1. Customer orders vendor product
2. Commission calculated automatically
3. Appears in vendor dashboard
4. Accumulates over time
5. Vendor requests payout (min $100)
6. Admin processes payment
7. Status updated to "paid"

### Content Publishing
1. Login to Payload CMS
2. Create new page
3. Add content blocks
4. Select tenant
5. Publish
6. Auto-syncs to Medusa metadata
7. Renders at `/us/:slug`

---

## Troubleshooting

### Sync Issues
```bash
# Check queue status
curl http://localhost:3001/api/queue/stats

# Check health
curl http://localhost:3001/api/health

# View Redis queue
redis-cli
> KEYS bull:*
> LRANGE bull:sync-to-payload:waiting 0 -1

# Re-run reconciliation
# Runs automatically every 6 hours, or manually trigger
```

### Missing Products
```bash
# Verify in Medusa
curl http://localhost:9000/store/products

# Verify in Payload
curl http://localhost:3001/api/products

# Check tenant filter
# Ensure product has tenant_id in metadata
```

### Webhook Not Firing
```bash
# Check webhook secret matches
# .env: ORCHESTRATOR_WEBHOOK_SECRET

# Check webhook URL is accessible
curl -X POST http://localhost:3001/api/webhooks/medusa \
  -H "Content-Type: application/json" \
  -d '{"event":"test","data":{}}'

# Check Medusa logs for webhook errors
```

### Cache Issues
```bash
# Clear Redis cache
redis-cli FLUSHDB

# Disable cache temporarily
# Set TTL to 0 in cache.ts
```

---

## Support & Documentation

### Main Documentation Files
- `SYSTEM_OVERVIEW.md` - Complete system explanation
- `VISUAL_ARCHITECTURE.md` - Diagrams and flows
- `FINAL_IMPLEMENTATION_STATUS.md` - What's built
- `TESTING_GUIDE.md` - How to test
- `VERCEL_DEPLOYMENT_GUIDE.md` - Deployment instructions
- `QUICK_REFERENCE.md` - This file

### Code Examples
- Integration tests: `apps/orchestrator/tests/`
- E2E tests: `apps/storefront/e2e/`
- Components: `apps/storefront/src/components/`
- API routes: `apps/backend/src/api/`

### External Resources
- Medusa Docs: https://docs.medusajs.com
- Payload Docs: https://payloadcms.com/docs
- TanStack Router: https://tanstack.com/router

---

## Quick Checklist

### Before Development
- ✅ PostgreSQL running
- ✅ Redis running
- ✅ Environment variables set
- ✅ Dependencies installed (`pnpm install`)
- ✅ Database migrated

### Before Deployment
- ✅ All tests passing
- ✅ Build succeeds
- ✅ Environment variables configured
- ✅ Database migrations run
- ✅ Redis/Postgres provisioned

### After Deployment
- ✅ Health check passes
- ✅ Webhooks configured
- ✅ DNS configured
- ✅ SSL certificates valid
- ✅ Monitoring enabled

---

## Performance Targets

### Response Times
```
API Endpoints:    < 200ms
Product Page:     < 300ms
Store Selection:  < 250ms
Cart Operations:  < 150ms
Checkout:         < 400ms
```

### Sync Performance
```
Product Sync:     < 500ms
Content Sync:     < 300ms
Vendor Sync:      < 400ms
Reconciliation:   < 5s (for 1000 records)
```

### Cache Hit Rates
```
Products:         > 80%
Tenants:          > 95%
Pages:            > 85%
```

---

## Scale Limits

### Current Capacity
```
Products:         10,000+
Vendors:          500+
Tenants:          50+
Orders/day:       5,000+
Concurrent Users: 1,000+
```

### Recommended Scaling
```
> 50 tenants:     Consider tenant-specific databases
> 1000 vendors:   Add worker nodes
> 10k orders/day: Horizontal scaling
> 5k users:       CDN + edge caching
```

---

This quick reference covers the most common tasks, endpoints, and troubleshooting steps for the multi-tenant B2B marketplace system.
