# Full Enterprise Multi-Tenant Implementation Plan

## Executive Summary

Your Dakkah CityOS platform has a **world-class enterprise multi-tenant architecture** spanning:
- **PayloadCMS Orchestrator** (Control Plane)
- **Medusa Commerce Engine** (Transactional Layer)  
- **TanStack Start Storefront** (Customer-Facing)
- **Role-Based Access Control** with Cerbos
- **Event-Driven Sync** (Bull Queue + Webhooks)

**Estimated Implementation Time:** 3-4 hours  
**Complexity:** High (Enterprise-Grade)  
**Benefits:** Full marketplace, multi-store, multi-tenant SaaS platform

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    DAKKAH CITYOS PLATFORM                   │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────┐    ┌─────────────────────────────────┐
│  PAYLOADCMS          │    │  MEDUSA COMMERCE ENGINE         │
│  ORCHESTRATOR        │◄──►│  (Commerce Backend)             │
│  (Control Plane)     │    │                                 │
│                      │    │  Custom Modules:                │
│  Collections:        │    │  - cityosStore                  │
│  - Tenants           │    │  - cityosTenant                 │
│  - Stores            │    │  - cityosVendor                 │
│  - Users (RBAC)      │    │  - cityosCompany (B2B)          │
│  - API Keys          │    │  - cityosSubscription           │
│  - Audit Logs        │    │                                 │
│  - Sync Jobs         │    │  Standard Modules:              │
│  - Webhook Logs      │    │  - Product, Order, Customer     │
│  - Integration Endpoints│  │  - Region, Sales Channel       │
│                      │    │  - Payment (Stripe)             │
│  Port: 3001          │    │  - Notification (SendGrid)      │
└──────────────────────┘    └─────────────────────────────────┘
         │                               │
         │    Bull Queue (Redis)         │
         └──────────┬───────────────────┘
                    │
         ┌──────────▼───────────┐
         │  EVENT-DRIVEN SYNC   │
         │  - Bidirectional     │
         │  - Reconciliation    │
         │  - Webhook Handling  │
         └──────────────────────┘
                    │
         ┌──────────▼───────────────────────────────┐
         │  TANSTACK START STOREFRONT               │
         │  (Customer-Facing)                       │
         │                                          │
         │  Routing Strategies:                     │
         │  1. Subdomain: store1.dakkah.com         │
         │  2. Path: dakkah.com/stores/store1       │
         │  3. Custom Domain: mybrand.com           │
         │                                          │
         │  Port: 9002                              │
         └──────────────────────────────────────────┘
                    │
         ┌──────────▼───────────┐
         │   END USERS          │
         │   - Customers        │
         │   - Store Managers   │
         │   - Tenant Admins    │
         │   - Super Admins     │
         └──────────────────────┘
```

---

## Phase 1: Database Setup & Migrations (45 mins)

### 1.1 Run Medusa Migrations for Custom Modules

Custom modules exist but tables are not created yet.

**Custom Modules to Migrate:**
- `cityosStore` (Store/Brand management)
- `cityosTenant` (Multi-tenancy)
- `cityosVendor` (Marketplace vendors)
- `cityosCompany` (B2B companies)
- `cityosSubscription` (Recurring billing)
- `cityosCommission` (Marketplace commissions)

**Actions:**
```bash
# Backend directory
cd apps/backend

# Generate migrations for custom modules
npx medusa db:migrate

# This will create tables:
# - cityos_store (stores/brands)
# - cityos_tenant (tenants/organizations)
# - cityos_vendor (marketplace vendors)
# - cityos_company (B2B companies)
# - cityos_subscription (billing)
# - cityos_commission (marketplace revenue)
```

**Expected Tables Created:**
```
cityos_store
├── id (PK)
├── tenant_id (FK → cityos_tenant)
├── handle (unique per tenant)
├── name
├── status (active, inactive, maintenance)
├── storefront_type (retail, services, marketplace, b2b)
├── medusa_vendor_id (FK → vendor)
├── medusa_sales_channel_id (FK → sales_channel)
├── theme_config (JSONB)
├── metadata (JSONB)
└── timestamps

cityos_tenant
├── id (PK)
├── handle (unique globally)
├── name
├── status (active, trial, suspended, inactive)
├── subscription_tier (basic, pro, enterprise)
├── country_id (hierarchical)
├── medusa_tenant_id
├── metadata (JSONB)
└── timestamps
```

### 1.2 Run PayloadCMS Migrations

PayloadCMS needs its own schema for the orchestrator.

**Actions:**
```bash
# Orchestrator directory
cd apps/orchestrator

# Install dependencies if not done
pnpm install

# Generate Payload schema
pnpm payload migrate

# This creates 14+ collections:
# - Countries, Scopes, Categories, Subcategories
# - Tenants, Stores, Portals
# - Users, API Keys
# - Media, Pages, Product Content
# - Integration Endpoints, Webhook Logs, Sync Jobs, Audit Logs
```

**Environment Variables Required:**
```env
# apps/orchestrator/.env
DATABASE_URL=<your-postgres-url>
PAYLOAD_SECRET=<generate-random-32-char-string>
PAYLOAD_PUBLIC_SERVER_URL=https://<your-domain>/orchestrator
NEXT_PUBLIC_APP_URL=https://<your-domain>

# Redis for Bull Queue
REDIS_URL=<your-redis-url>

# Medusa integration
MEDUSA_BACKEND_URL=https://sb-9maabvghfbn4.ai.prod.medusajs.cloud
MEDUSA_ADMIN_API_KEY=<admin-api-key>

# Cerbos (optional - role-based access control)
CERBOS_URL=<cerbos-server-url>
```

**Database State After Migrations:**
```
Total Tables: ~80
- Medusa Core: ~60 tables (products, orders, customers, etc.)
- Custom Modules: ~10 tables (cityos_*)
- PayloadCMS: ~20 tables (payload_*)
```

---

## Phase 2: Store Routing Implementation (60 mins)

### 2.1 Routing Strategy Decision

**Option A: Subdomain-Based (Recommended for Multi-Tenant SaaS)**

**Examples:**
```
https://saudi-traditional.dakkah.com  → Saudi Traditional Wear Store
https://modern-fashion.dakkah.com     → Modern Fashion Store
https://home-decor.dakkah.com         → Home Decor Store
```

**Pros:**
- Clean brand separation
- SEO-friendly (each subdomain ranks independently)
- Professional appearance
- Standard for SaaS platforms

**Cons:**
- Requires wildcard DNS: *.dakkah.com
- More complex server setup
- SSL certificates for each subdomain

**Option B: Path-Based (Simpler Implementation)**

**Examples:**
```
https://dakkah.com/stores/saudi-traditional
https://dakkah.com/stores/modern-fashion
https://dakkah.com/stores/home-decor
```

**Pros:**
- Simple routing (no DNS changes)
- Single SSL certificate
- Easy development/testing

**Cons:**
- Less professional for brands
- Shared SEO authority
- Longer URLs

**Option C: Custom Domains (Full Enterprise)**

**Examples:**
```
https://sauditraditions.com   → Saudi Traditional Wear
https://modernsaudi.com        → Modern Fashion
https://homedecorksa.com       → Home Decor
```

**Pros:**
- Complete brand independence
- Maximum SEO value
- Professional enterprise appearance

**Cons:**
- Requires DNS management per tenant
- Domain verification system needed
- Complex SSL management

### 2.2 Storefront Routing Implementation

**Step 1: Detect Store Context**

Create middleware to identify store from URL:

```typescript
// apps/storefront/src/middleware/store-resolver.ts
import { createServerFn } from '@tanstack/start'
import { getCookie, setCookie } from 'vinxi/http'

export type StoreContext = {
  storeHandle: string | null
  tenantHandle: string | null
  storeId: string | null
  storeName: string | null
  themeConfig: any
}

// Subdomain Strategy
function getStoreFromSubdomain(hostname: string): string | null {
  // Extract: saudi-traditional from saudi-traditional.dakkah.com
  const parts = hostname.split('.')
  if (parts.length >= 3) {
    return parts[0] // saudi-traditional
  }
  return null
}

// Path Strategy
function getStoreFromPath(pathname: string): string | null {
  // Extract: saudi-traditional from /stores/saudi-traditional/products
  const match = pathname.match(/^\/stores\/([^\/]+)/)
  return match ? match[1] : null
}

export const resolveStoreContext = createServerFn('GET', async (request: Request) => {
  const url = new URL(request.url)
  const hostname = url.hostname
  const pathname = url.pathname
  
  // Try subdomain first
  let storeHandle = getStoreFromSubdomain(hostname)
  
  // Fall back to path
  if (!storeHandle) {
    storeHandle = getStoreFromPath(pathname)
  }
  
  // Fall back to cookie (for multi-store browsing)
  if (!storeHandle) {
    storeHandle = getCookie('current_store') || null
  }
  
  if (!storeHandle) {
    return {
      storeHandle: null,
      tenantHandle: null,
      storeId: null,
      storeName: null,
      themeConfig: null
    }
  }
  
  // Fetch store from Medusa custom API
  const response = await fetch(`${process.env.MEDUSA_BACKEND_URL}/store/stores/${storeHandle}`, {
    headers: {
      'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!
    }
  })
  
  if (!response.ok) {
    return {
      storeHandle,
      tenantHandle: null,
      storeId: null,
      storeName: null,
      themeConfig: null
    }
  }
  
  const { store } = await response.json()
  
  // Set cookie for persistence
  setCookie('current_store', storeHandle, {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
    sameSite: 'lax'
  })
  
  return {
    storeHandle: store.handle,
    tenantHandle: store.tenant?.handle || null,
    storeId: store.id,
    storeName: store.name,
    themeConfig: store.themeConfig
  }
})
```

**Step 2: Create Store-Scoped Product Fetching**

```typescript
// apps/storefront/src/lib/data/products.ts (enhanced)
import { sdk } from '@/lib/utils/sdk'
import { resolveStoreContext } from '@/middleware/store-resolver'

export async function listProducts(options?: {
  limit?: number
  offset?: number
  categoryId?: string
  collectionId?: string
  order?: string
  // NEW: Store filtering
  storeId?: string
}) {
  // Get current store context
  const storeContext = await resolveStoreContext()
  
  const queryParams: any = {
    limit: options?.limit || 12,
    offset: options?.offset || 0,
    fields: '*variants.calculated_price,+variants.inventory_quantity',
  }
  
  // Filter by sales channel if store has one
  if (storeContext.storeId) {
    const store = await getStoreDetails(storeContext.storeId)
    if (store.medusaSalesChannelId) {
      queryParams.sales_channel_id = [store.medusaSalesChannelId]
    }
  }
  
  if (options?.categoryId) {
    queryParams.category_id = [options.categoryId]
  }
  
  const { products } = await sdk.client.fetch('/store/products', {
    query: queryParams,
  })
  
  return products || []
}

async function getStoreDetails(storeId: string) {
  const response = await fetch(`${process.env.MEDUSA_BACKEND_URL}/store/stores/${storeId}`, {
    headers: {
      'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!
    }
  })
  const { store } = await response.json()
  return store
}
```

**Step 3: Update Routes to Use Store Context**

```typescript
// apps/storefront/src/routes/$countryCode/index.tsx (Homepage)
import { createFileRoute } from '@tanstack/react-router'
import { resolveStoreContext } from '@/middleware/store-resolver'
import { listProducts } from '@/lib/data/products'

export const Route = createFileRoute('/$countryCode/')({
  loader: async ({ context }) => {
    const [storeContext, products] = await Promise.all([
      resolveStoreContext(),
      listProducts({ limit: 8 })
    ])
    
    return {
      storeContext,
      products,
    }
  },
  component: HomePage,
})

function HomePage() {
  const { storeContext, products } = Route.useLoaderData()
  
  return (
    <div>
      {/* Store-specific hero */}
      {storeContext.storeName && (
        <section className="bg-gradient-to-r from-amber-50 to-orange-50 py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold">
              Welcome to {storeContext.storeName}
            </h1>
          </div>
        </section>
      )}
      
      {/* Products from this store only */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        <div className="grid grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}
```

### 2.3 Store Selector Component

For users to browse multiple stores:

```typescript
// apps/storefront/src/components/store-selector.tsx
import { useState } from 'react'
import { Link } from '@tanstack/react-router'

export function StoreSelector({ stores }: { stores: any[] }) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        Browse Stores
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-xl z-50">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Choose a Store</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {stores.map(store => (
              <Link
                key={store.id}
                href={`/stores/${store.handle}`}
                className="block p-4 hover:bg-gray-50 border-b"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center gap-3">
                  {store.logo && (
                    <img src={store.logo} alt="" className="w-10 h-10 rounded" />
                  )}
                  <div>
                    <div className="font-medium">{store.name}</div>
                    <div className="text-sm text-gray-500">
                      {store.storefrontType} • {store.productCount} products
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
```

---

## Phase 3: PayloadCMS Orchestrator Setup (45 mins)

### 3.1 Environment Configuration

```env
# apps/orchestrator/.env

# Database (same as Medusa)
DATABASE_URL=postgresql://user:pass@host:5432/dakkah

# PayloadCMS
PAYLOAD_SECRET=<generate-32-char-random-string>
PAYLOAD_PUBLIC_SERVER_URL=https://orchestrator.dakkah.com
NEXT_PUBLIC_APP_URL=https://orchestrator.dakkah.com

# Redis (for Bull Queue sync)
REDIS_URL=redis://localhost:6379

# Medusa Integration
MEDUSA_BACKEND_URL=https://sb-9maabvghfbn4.ai.prod.medusajs.cloud
MEDUSA_ADMIN_API_KEY=<create-admin-api-key>
MEDUSA_PUBLISHABLE_KEY=<your-publishable-key>

# Keycloak (Optional - Advanced SSO)
KEYCLOAK_URL=https://auth.dakkah.com
KEYCLOAK_REALM=dakkah
KEYCLOAK_CLIENT_ID=orchestrator
KEYCLOAK_CLIENT_SECRET=<secret>

# Cerbos (Optional - Advanced RBAC)
CERBOS_URL=https://cerbos.dakkah.com

# Stripe (for tenant billing)
STRIPE_API_KEY=<stripe-secret-key>
STRIPE_WEBHOOK_SECRET=<webhook-secret>

# S3 Storage (for media uploads)
S3_BUCKET=dakkah-media
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=<aws-access-key>
S3_SECRET_ACCESS_KEY=<aws-secret>
```

### 3.2 Start Orchestrator

```bash
cd apps/orchestrator

# Install dependencies
pnpm install

# Run migrations
pnpm migrate

# Generate TypeScript types
pnpm generate:types

# Start dev server
pnpm dev

# Access at: http://localhost:3001/admin
```

### 3.3 Create Initial Data

**Create Super Admin User:**
```bash
# In orchestrator admin at localhost:3001/admin
# First user is automatically super_admin
Email: admin@dakkah.com
Password: <secure-password>
Roles: [super_admin]
```

**Create First Tenant:**
```javascript
// Via Payload Admin UI or API
{
  handle: "saudi-marketplace",
  name: "Saudi Marketplace",
  status: "active",
  subscriptionTier: "enterprise",
  billingEmail: "billing@saudimarketplace.com",
  country: <select-saudi-arabia>,
  subdomains: [
    { subdomain: "saudi-marketplace", isPrimary: true }
  ]
}
```

**Create First Store:**
```javascript
{
  tenant: <saudi-marketplace-id>,
  handle: "saudi-traditional",
  name: "Saudi Traditional Wear",
  status: "active",
  storefrontType: "retail",
  subdomains: [
    { subdomain: "saudi-traditional", isPrimary: true }
  ],
  storefrontUrl: "https://saudi-traditional.dakkah.com",
  themeConfig: {
    colors: {
      primary: "#d97706", // amber
      secondary: "#92400e"
    },
    logo: "/logos/saudi-traditional.png"
  },
  medusaSalesChannelId: <create-in-medusa>
}
```

---

## Phase 4: Medusa Backend Integration (30 mins)

### 4.1 Create Store API Endpoints

**Fetch Store by Handle:**

```typescript
// apps/backend/src/api/store/stores/[handle]/route.ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const storeService = req.scope.resolve("cityosStore")
  const handle = req.params.handle
  
  try {
    const store = await storeService.retrieveByHandle(handle, {
      relations: ["tenant"]
    })
    
    if (!store) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Store with handle ${handle} not found`
      )
    }
    
    res.json({ store })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
```

**List Active Stores:**

```typescript
// apps/backend/src/api/store/stores/route.ts (update)
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const storeService = req.scope.resolve("cityosStore")
  const query = req.scope.resolve("query")
  
  try {
    const { data: stores } = await query.graph({
      entity: "cityos_store",
      fields: [
        "id",
        "handle",
        "name",
        "status",
        "storefrontType",
        "storefrontUrl",
        "themeConfig",
        "medusaSalesChannelId",
        "medusaVendorId",
        "tenant.*"
      ],
      filters: {
        status: "active"
      },
      pagination: {
        take: req.query.limit ? parseInt(req.query.limit as string) : 50,
        skip: req.query.offset ? parseInt(req.query.offset as string) : 0
      }
    })
    
    res.json({ stores })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
```

### 4.2 Link Products to Stores via Sales Channels

**Create Sales Channel per Store:**

```bash
# Via Medusa Admin or API
POST /admin/sales-channels
{
  name: "Saudi Traditional Store",
  description: "Sales channel for Saudi Traditional Wear store",
  is_disabled: false
}
```

**Assign Products to Sales Channel:**

```bash
# Via Medusa Admin
# 1. Go to Products
# 2. Edit Product
# 3. Under "Sales Channels" select "Saudi Traditional Store"
# 4. Save

# Or via API:
POST /admin/products/{product_id}/sales-channels
{
  add: ["sales_channel_id_1", "sales_channel_id_2"]
}
```

### 4.3 Store Service Implementation

```typescript
// apps/backend/src/modules/store/service.ts
import { MedusaService } from "@medusajs/framework/utils"
import { Store } from "./models/store"

class StoreModuleService extends MedusaService({
  Store,
}) {
  async retrieveByHandle(handle: string, config?: any) {
    const stores = await this.listStores(
      {
        handle,
      },
      config
    )
    
    return stores[0] || null
  }
  
  async retrieveBySubdomain(subdomain: string) {
    // Query by metadata or separate subdomain field
    const stores = await this.listStores({
      metadata: {
        subdomain
      }
    })
    
    return stores[0] || null
  }
}

export default StoreModuleService
```

---

## Phase 5: Event-Driven Sync Setup (30 mins)

### 5.1 Bull Queue Configuration

**Queue Manager:**

```typescript
// apps/orchestrator/src/lib/queue.ts (already exists)
import Bull from 'bull'

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'

export const syncQueue = new Bull('store-sync', redisUrl, {
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    },
    removeOnComplete: true,
    removeOnFail: false
  }
})

// Payload → Medusa Sync
syncQueue.process('payload-to-medusa', async (job) => {
  const { collection, docId, operation } = job.data
  
  // Fetch from Payload
  const doc = await payload.findByID({
    collection,
    id: docId
  })
  
  // Sync to Medusa
  if (collection === 'stores') {
    await syncStoreToMedusa(doc)
  }
  
  return { success: true }
})

// Medusa → Payload Sync
syncQueue.process('medusa-to-payload', async (job) => {
  const { entity, entityId, operation } = job.data
  
  // Fetch from Medusa
  const response = await fetch(`${process.env.MEDUSA_BACKEND_URL}/admin/${entity}/${entityId}`, {
    headers: {
      'x-medusa-access-token': process.env.MEDUSA_ADMIN_API_KEY
    }
  })
  
  const data = await response.json()
  
  // Sync to Payload
  if (entity === 'product') {
    await syncProductToPayload(data)
  }
  
  return { success: true }
})
```

### 5.2 Medusa Webhooks → Orchestrator

**Register Webhook in Medusa:**

```typescript
// Via Medusa Admin or migration
POST /admin/webhooks
{
  url: "https://orchestrator.dakkah.com/api/integrations/medusa/webhook",
  events: [
    "product.created",
    "product.updated",
    "order.placed",
    "order.completed",
    "customer.created"
  ]
}
```

**Webhook Handler (already exists):**

```typescript
// apps/orchestrator/src/app/api/integrations/medusa/webhook/route.ts
export async function POST(req: Request) {
  const signature = req.headers.get('x-medusa-signature')
  const payload = await req.json()
  
  // Verify signature
  const isValid = verifyWebhookSignature(payload, signature)
  if (!isValid) {
    return Response.json({ error: 'Invalid signature' }, { status: 401 })
  }
  
  // Queue sync job
  await syncQueue.add('medusa-to-payload', {
    entity: payload.metadata.object,
    entityId: payload.data.id,
    operation: payload.metadata.action
  })
  
  // Log webhook
  await payload.create({
    collection: 'webhook-logs',
    data: {
      source: 'medusa',
      event: payload.metadata.action,
      payload: payload,
      status: 'processed'
    }
  })
  
  return Response.json({ received: true })
}
```

---

## Phase 6: Storefront Theme System (30 mins)

### 6.1 Dynamic Theme Provider

```typescript
// apps/storefront/src/components/theme-provider.tsx
import { createContext, useContext, useEffect } from 'react'
import { resolveStoreContext } from '@/middleware/store-resolver'

type ThemeConfig = {
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  fonts: {
    heading: string
    body: string
  }
  logo?: string
  favicon?: string
}

const ThemeContext = createContext<ThemeConfig | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const storeContext = useStoreContext()
  const themeConfig = storeContext?.themeConfig
  
  useEffect(() => {
    if (themeConfig) {
      // Apply CSS variables
      document.documentElement.style.setProperty('--color-primary', themeConfig.colors.primary)
      document.documentElement.style.setProperty('--color-secondary', themeConfig.colors.secondary)
      
      // Apply favicon
      if (themeConfig.favicon) {
        const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement
        if (link) link.href = themeConfig.favicon
      }
    }
  }, [themeConfig])
  
  return (
    <ThemeContext.Provider value={themeConfig}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
```

### 6.2 Store-Specific Layouts

```typescript
// apps/storefront/src/components/layouts/store-layout.tsx
export function StoreLayout({ children }: { children: React.ReactNode }) {
  const storeContext = useStoreContext()
  const theme = useTheme()
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Store-specific header */}
      <header 
        className="border-b"
        style={{ backgroundColor: theme?.colors.primary || '#ffffff' }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {theme?.logo ? (
            <img src={theme.logo} alt={storeContext?.storeName} className="h-12" />
          ) : (
            <h1 className="text-2xl font-bold">{storeContext?.storeName}</h1>
          )}
          
          <nav className="flex gap-6">
            <Link href="/">Home</Link>
            <Link href="/products">Products</Link>
            <Link href="/about">About</Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>
      
      {/* Store-specific footer */}
      <footer className="bg-gray-50 border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} {storeContext?.storeName}. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
```

---

## Phase 7: Role-Based Access Control (30 mins)

### 7.1 Admin Panel Permissions

**Medusa Admin Extensions (already have infrastructure):**

```typescript
// apps/backend/src/admin/routes/stores/page.tsx
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container } from "@medusajs/ui"

const StoresPage = () => {
  const { user } = useAdminUser()
  
  // Store managers only see their store
  // Tenant admins see all stores in their tenant
  // Super admins see everything
  
  return (
    <Container>
      <h1>Stores</h1>
      {/* List stores based on user role */}
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Stores",
  icon: <ShoppingBag />,
})

export default StoresPage
```

**PayloadCMS Access Control (already configured):**

The Stores collection already has sophisticated RBAC:
- Super admins: Read/write all stores
- Tenant admins: Read/write stores in their tenant
- Store managers: Read/write only their assigned store

---

## Phase 8: Testing & Verification (30 mins)

### 8.1 Create Test Data

**Script to populate test stores:**

```typescript
// scripts/create-test-stores.ts
import { ExecArgs } from "@medusajs/framework/types"

export default async function({ container }: ExecArgs) {
  const storeService = container.resolve("cityosStore")
  const salesChannelService = container.resolve("salesChannelService")
  
  // Create Saudi Traditional Store
  const saudiTraditionalChannel = await salesChannelService.create({
    name: "Saudi Traditional Store",
    description: "Traditional Saudi clothing and accessories"
  })
  
  const saudiStore = await storeService.create({
    handle: "saudi-traditional",
    name: "Saudi Traditional Wear",
    status: "active",
    storefrontType: "retail",
    medusaSalesChannelId: saudiTraditionalChannel.id,
    themeConfig: {
      colors: {
        primary: "#d97706",
        secondary: "#92400e"
      }
    },
    metadata: {
      subdomain: "saudi-traditional"
    }
  })
  
  // Create Modern Fashion Store
  const modernFashionChannel = await salesChannelService.create({
    name: "Modern Fashion Store",
    description: "Contemporary Saudi fashion"
  })
  
  const modernStore = await storeService.create({
    handle: "modern-fashion",
    name: "Modern Saudi Fashion",
    status: "active",
    storefrontType: "retail",
    medusaSalesChannelId: modernFashionChannel.id,
    themeConfig: {
      colors: {
        primary: "#3b82f6",
        secondary: "#1e40af"
      }
    },
    metadata: {
      subdomain: "modern-fashion"
    }
  })
  
  console.log("Created stores:", {
    saudiStore: saudiStore.id,
    modernStore: modernStore.id
  })
}
```

### 8.2 Test Routing

**Test Scenarios:**

1. **Subdomain routing:**
   - Visit: https://saudi-traditional.dakkah.com
   - Should load store with amber theme
   - Should show only traditional products

2. **Path routing:**
   - Visit: https://dakkah.com/stores/modern-fashion
   - Should load store with blue theme
   - Should show only modern fashion products

3. **Store selector:**
   - Visit: https://dakkah.com/stores
   - Should list all active stores
   - Click store → navigate to that store's homepage

4. **Product filtering:**
   - Products should only appear in their assigned stores
   - Verified via sales channel filtering

### 8.3 Admin Panel Testing

**PayloadCMS Orchestrator:**
1. Login at localhost:3001/admin
2. Create tenant
3. Create store under tenant
4. Upload logo/theme config
5. Verify sync job created

**Medusa Admin:**
1. Login at backend/admin
2. Create sales channel
3. Assign products to sales channel
4. Verify products appear in correct store

---

## Deployment Architecture

### Production Infrastructure

```
┌────────────────────────────────────────────────────────────┐
│                    LOAD BALANCER / CDN                     │
│                  (Cloudflare / AWS CloudFront)             │
└────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼──────────────────────┐
        │                     │                      │
        ▼                     ▼                      ▼
┌───────────────┐   ┌──────────────────┐   ┌────────────────┐
│ PAYLOADCMS    │   │ MEDUSA BACKEND   │   │ STOREFRONT     │
│ ORCHESTRATOR  │   │ (Commerce)       │   │ (TanStack)     │
│               │   │                  │   │                │
│ orchestrator  │   │ api.dakkah.com   │   │ *.dakkah.com   │
│ .dakkah.com   │   │                  │   │                │
│               │   │                  │   │                │
│ Port: 3001    │   │ Port: 9000       │   │ Port: 9002     │
└───────────────┘   └──────────────────┘   └────────────────┘
        │                     │                      │
        └─────────────────────┼──────────────────────┘
                              │
                    ┌─────────▼──────────┐
                    │   POSTGRES DB      │
                    │   (Multi-Schema)   │
                    └────────────────────┘
                              │
                    ┌─────────▼──────────┐
                    │   REDIS            │
                    │   (Queue + Cache)  │
                    └────────────────────┘
```

### DNS Configuration

**Wildcard Subdomain:**
```
*.dakkah.com  →  A Record  →  <storefront-server-ip>

saudi-traditional.dakkah.com  →  CNAME  →  storefront.dakkah.com
modern-fashion.dakkah.com     →  CNAME  →  storefront.dakkah.com
```

**Custom Domains (per tenant):**
```
sauditraditions.com  →  CNAME  →  storefront.dakkah.com
                     →  TXT    →  dakkah-verification=<token>
```

---

## Success Metrics

After full implementation:

1. **Multi-Store:**
   - ✅ Each store has unique branding
   - ✅ Products filtered by sales channel
   - ✅ Independent URLs (subdomain or custom domain)

2. **Multi-Tenant:**
   - ✅ Tenants manage multiple stores
   - ✅ Isolated data per tenant
   - ✅ Subscription billing per tenant

3. **Admin Access:**
   - ✅ Super admins see all tenants/stores
   - ✅ Tenant admins see only their stores
   - ✅ Store managers see only their store
   - ✅ Audit logs track all changes

4. **Sync System:**
   - ✅ Payload changes sync to Medusa
   - ✅ Medusa changes sync to Payload
   - ✅ Reconciliation jobs fix inconsistencies
   - ✅ Webhook logs for debugging

---

## Timeline Summary

| Phase | Duration | Complexity |
|-------|----------|------------|
| 1. Database Migrations | 45 mins | Medium |
| 2. Store Routing | 60 mins | High |
| 3. Orchestrator Setup | 45 mins | Medium |
| 4. Backend Integration | 30 mins | Low |
| 5. Event Sync | 30 mins | Medium |
| 6. Theme System | 30 mins | Low |
| 7. RBAC | 30 mins | Low |
| 8. Testing | 30 mins | Low |
| **Total** | **4 hours** | **High** |

---

## Store Routing Examples

### Saudi Traditional Store
```
URL: https://saudi-traditional.dakkah.com
Theme: Amber/Gold colors
Logo: Traditional Arabic calligraphy
Products: Thobes, Abayas, Oud, Prayer Mats
Sales Channel: "Saudi Traditional Store"
```

### Modern Fashion Store
```
URL: https://modern-fashion.dakkah.com
Theme: Blue/White colors
Logo: Modern minimalist
Products: Contemporary abayas, modern hijabs
Sales Channel: "Modern Fashion Store"
```

### Home Decor Store
```
URL: https://home-decor.dakkah.com
Theme: Green/Brown colors
Logo: Minimalist home icon
Products: Wall art, prayer mats, decorative items
Sales Channel: "Home Decor Store"
```

### Oud Perfumes Store
```
URL: https://oud-perfumes.dakkah.com
Theme: Black/Gold colors
Logo: Elegant perfume bottle
Products: Oud oils, bakhoor, fragrances
Sales Channel: "Oud Perfumes Store"
```

### Dates & Coffee Store
```
URL: https://dates-coffee.dakkah.com
Theme: Brown/Cream colors
Logo: Palm tree and coffee cup
Products: Ajwa dates, Khawlani coffee
Sales Channel: "Dates & Coffee Store"
```

---

## Next Steps

Ready to proceed? Here's the implementation order:

1. **Confirm routing strategy** (subdomain vs path vs custom domain)
2. **Run database migrations** (Medusa + Payload)
3. **Start PayloadCMS orchestrator**
4. **Create test stores in Payload**
5. **Implement storefront routing**
6. **Test end-to-end flow**

Let me know which phase you want to start with!
