# Complete Implementation Plan: Multi-Tenant B2B Marketplace
## Medusa + Payload CMS Integration

> **Status**: Planning Phase  
> **Timeline**: 12-16 Weeks  
> **Architecture**: Dual-Engine (Medusa Commerce + Payload CMS)

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Current State Assessment](#current-state-assessment)
3. [Integration Strategy](#integration-strategy)
4. [Phase-by-Phase Implementation](#phase-by-phase-implementation)
5. [Data Flow Diagrams](#data-flow-diagrams)
6. [API Endpoints Map](#api-endpoints-map)
7. [Database Schema Integration](#database-schema-integration)
8. [Testing Strategy](#testing-strategy)
9. [Deployment Plan](#deployment-plan)

---

## System Overview

### Architecture Principles

```
┌──────────────────────────────────────────────────────────┐
│              THREE-ENGINE ARCHITECTURE                    │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   PAYLOAD   │  │   MEDUSA    │  │  STOREFRONT │     │
│  │     CMS     │  │  COMMERCE   │  │  (TanStack) │     │
│  │             │  │             │  │             │     │
│  │  Content    │  │  Products   │  │  Customer   │     │
│  │  Pages      │  │  Orders     │  │  Experience │     │
│  │  Tenants    │  │  Cart       │  │             │     │
│  │  Media      │  │  Payments   │  │  Consumes   │     │
│  │  Blog       │  │  Customers  │  │  Both APIs  │     │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘     │
│         │                │                │             │
│         └────────────────┼────────────────┘             │
│                          │                              │
│                  ┌───────▼───────┐                      │
│                  │  PostgreSQL   │                      │
│                  │  (2 Databases)│                      │
│                  └───────────────┘                      │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Why This Matters

**Payload CMS** manages:
- Dynamic content (homepage, about, blog)
- Multi-tenant configuration
- Landing pages per vendor
- Media assets
- SEO metadata
- Marketing content

**Medusa** manages:
- Product catalog
- Inventory
- Orders & fulfillment
- Payments
- Cart & checkout
- Customer accounts
- B2B pricing & quotes

**Storefront** consumes:
- Payload API for content
- Medusa API for commerce
- Renders unified experience

---

## Current State Assessment

### ✅ What's Complete

#### Backend (Medusa)
```
apps/backend/src/modules/
├── vendor/          ✅ Complete (CRUD, relationships)
├── tenant/          ✅ Complete (multi-tenant support)
├── quote/           ✅ Complete (B2B quotes)
├── commission/      ✅ Complete (vendor commissions)
├── payout/          ✅ Complete (vendor payouts)
├── company/         ✅ Complete (B2B companies)
├── volume-pricing/  ✅ Complete (tiered pricing)
└── store/           ✅ Complete (store management)
```

#### Orchestrator (Payload CMS)
```
apps/orchestrator/src/collections/
├── tenants          ✅ Complete (14 collections)
├── pages            ✅ Complete
├── blogs            ✅ Complete
├── products         ✅ Complete (sync ready)
├── orders           ✅ Complete (sync ready)
├── categories       ✅ Complete
├── media            ✅ Complete
└── users            ✅ Complete
```

#### Storefront (TanStack Start)
```
apps/storefront/src/
├── routes/          ✅ Basic e-commerce routes
├── components/      ✅ Product, cart, checkout
└── lib/            ✅ Medusa SDK setup
```

#### Integration Layer
```
apps/backend/src/integrations/payload-sync/
├── medusa-to-payload.ts    ✅ Sync logic defined
├── payload-to-medusa.ts    ✅ Sync logic defined
└── README.md               ✅ Documentation
```

### ❌ What's Missing

#### Storefront UI (0% Complete)
- ❌ No Payload CMS integration
- ❌ No dynamic content rendering
- ❌ No tenant/vendor selection
- ❌ No B2B features UI
- ❌ No vendor portal
- ❌ No admin customizations

#### Integration Active Jobs (0% Complete)
- ❌ Sync jobs not running
- ❌ Webhooks not configured
- ❌ Real-time updates not working

#### Authentication (50% Complete)
- ✅ Medusa customer auth works
- ✅ Payload admin auth works
- ❌ Shared SSO not configured
- ❌ Vendor/tenant role management incomplete

#### Testing (0% Complete)
- ❌ No integration tests
- ❌ No sync validation
- ❌ No end-to-end tests

---

## Integration Strategy

### Data Ownership Model

```
┌─────────────────────────────────────────────────────────────┐
│                    DATA OWNERSHIP                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  MEDUSA OWNS (Source of Truth)                              │
│  ════════════════════════════════                            │
│  • Products (SKU, price, inventory)                          │
│  • Product Variants                                          │
│  • Orders (status, fulfillment)                              │
│  • Customers (auth, addresses)                               │
│  • Cart & Checkout                                           │
│  • Payments                                                  │
│  • Shipping                                                  │
│  • Regions & Currencies                                      │
│  • Vendors (registration, status)                            │
│  • Companies (B2B accounts)                                  │
│  • Quotes (pricing requests)                                 │
│  • Commissions & Payouts                                     │
│                                                              │
│  PAYLOAD OWNS (Source of Truth)                              │
│  ═══════════════════════════════                             │
│  • Tenants (configuration)                                   │
│  • Pages (dynamic content)                                   │
│  • Blogs & Articles                                          │
│  • Media Library                                             │
│  • SEO Metadata                                              │
│  • Navigation Menus                                          │
│  • Marketing Banners                                         │
│  • Vendor Landing Pages                                      │
│  • Category Descriptions                                     │
│                                                              │
│  SYNCED (Bi-Directional)                                     │
│  ═══════════════════════                                     │
│  • Product metadata (Medusa → Payload)                       │
│  • Order summaries (Medusa → Payload)                        │
│  • Vendor profiles (Medusa → Payload)                        │
│  • Content links (Payload → Medusa)                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Sync Mechanisms

#### 1. Real-Time Sync (Webhooks)
```typescript
// Trigger: When critical data changes
// Method: HTTP webhooks
// Latency: < 1 second

Medusa Event → Webhook → Payload Update
├── product.created        → Create in Payload
├── product.updated        → Update in Payload
├── order.placed           → Log in Payload
├── vendor.approved        → Activate tenant
└── inventory.updated      → Sync stock levels

Payload Event → Webhook → Medusa Update
├── page.published         → Update metadata
├── tenant.configured      → Update vendor settings
└── media.uploaded         → Update product images
```

#### 2. Scheduled Sync (Cron Jobs)
```typescript
// Trigger: Time-based
// Method: Batch processing
// Frequency: Hourly/Daily

Every Hour:
├── Sync new products (Medusa → Payload)
├── Sync order summaries (Medusa → Payload)
└── Validate data consistency

Every Day:
├── Full vendor sync
├── Commission calculations
└── Analytics aggregation
```

#### 3. On-Demand Sync (API)
```typescript
// Trigger: User action
// Method: Direct API call
// Use: Admin operations

Admin Dashboard:
├── "Sync Now" button
├── Manual reconciliation
└── Force update
```

### API Communication Patterns

```typescript
// Pattern 1: Storefront reads from both
async function getProductPage(slug: string) {
  // Get commerce data from Medusa
  const product = await medusa.products.retrieve(slug)
  
  // Get content from Payload
  const content = await payload.find({
    collection: 'products',
    where: { medusa_id: { equals: product.id } }
  })
  
  return {
    ...product,        // Price, inventory, variants
    ...content.docs[0] // SEO, description, images
  }
}

// Pattern 2: Webhook updates
// In Medusa subscriber
async function onProductUpdate(product: Product) {
  await fetch('https://payload.example.com/api/sync/product', {
    method: 'POST',
    body: JSON.stringify({
      medusa_id: product.id,
      title: product.title,
      handle: product.handle,
      price: product.variants[0].prices[0].amount
    })
  })
}

// Pattern 3: Admin reads from both
// In Admin dashboard
async function getVendorOverview(vendorId: string) {
  // Get orders from Medusa
  const orders = await medusa.admin.orders.list({
    vendor_id: vendorId
  })
  
  // Get content from Payload
  const tenant = await payload.findByID({
    collection: 'tenants',
    id: vendorId
  })
  
  return {
    orders,           // From Medusa
    branding: tenant, // From Payload
    stats: calculateStats(orders)
  }
}
```

---

## Phase-by-Phase Implementation

### PHASE 0: Foundation & Setup (Week 1)
**Goal**: Establish integration infrastructure

#### Tasks

**0.1 Environment Configuration** (2 days)
```bash
# Create .env.integration file
apps/backend/.env.integration
├── PAYLOAD_URL=https://orchestrator.example.com
├── PAYLOAD_API_KEY=<secret>
├── SYNC_ENABLED=true
└── WEBHOOK_SECRET=<secret>

apps/orchestrator/.env.integration
├── MEDUSA_URL=https://backend.example.com
├── MEDUSA_API_KEY=<secret>
└── WEBHOOK_SECRET=<secret>
```

**0.2 Install Sync Dependencies** (1 day)
```bash
cd apps/backend
pnpm add axios retry-axios p-queue

cd apps/orchestrator
pnpm add @medusajs/js-sdk
```

**0.3 Create Shared Types** (1 day)
```typescript
// Create: packages/integration-types/src/index.ts
export interface SyncPayload {
  entity: 'product' | 'order' | 'vendor' | 'tenant'
  action: 'create' | 'update' | 'delete'
  data: Record<string, any>
  medusa_id?: string
  payload_id?: string
  timestamp: Date
}

export interface WebhookEvent {
  id: string
  type: string
  data: any
  retry_count: number
}
```

**0.4 Setup Webhook Infrastructure** (2 days)

```typescript
// Create: apps/backend/src/api/webhooks/payload/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { validateWebhookSignature } from "../../../utils/webhook"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const isValid = validateWebhookSignature(
    req.headers['x-payload-signature'],
    req.body
  )
  
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid signature' })
  }
  
  const { collection, operation, doc } = req.body
  
  // Route to appropriate handler
  switch (collection) {
    case 'tenants':
      await handleTenantUpdate(doc)
      break
    case 'pages':
      await handlePageUpdate(doc)
      break
  }
  
  return res.json({ received: true })
}
```

```typescript
// Create: apps/orchestrator/src/endpoints/medusa-webhook.ts
import { Payload } from 'payload'

export const medusaWebhook = async (req, res) => {
  const { event, data } = req.body
  
  switch (event) {
    case 'product.created':
      await req.payload.create({
        collection: 'products',
        data: {
          medusa_id: data.id,
          title: data.title,
          handle: data.handle,
          synced_at: new Date()
        }
      })
      break
      
    case 'order.placed':
      await req.payload.create({
        collection: 'orders',
        data: {
          medusa_id: data.id,
          order_number: data.display_id,
          customer_email: data.email,
          total: data.total,
          synced_at: new Date()
        }
      })
      break
  }
  
  res.json({ success: true })
}
```

**0.5 Create Sync Service** (2 days)

```typescript
// Create: apps/backend/src/services/payload-sync.service.ts
import { Logger } from "@medusajs/framework/types"

export class PayloadSyncService {
  private payloadUrl: string
  private apiKey: string
  
  constructor({ logger }: { logger: Logger }) {
    this.payloadUrl = process.env.PAYLOAD_URL
    this.apiKey = process.env.PAYLOAD_API_KEY
  }
  
  async syncProduct(product: any) {
    try {
      const response = await fetch(`${this.payloadUrl}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          medusa_id: product.id,
          title: product.title,
          handle: product.handle,
          description: product.description,
          thumbnail: product.thumbnail,
          synced_at: new Date()
        })
      })
      
      return response.json()
    } catch (error) {
      console.error('Sync failed:', error)
      throw error
    }
  }
  
  async syncOrder(order: any) {
    // Similar implementation
  }
  
  async syncVendor(vendor: any) {
    // Similar implementation
  }
}
```

**Deliverables**:
- ✅ Environment variables configured
- ✅ Webhook endpoints created
- ✅ Sync service scaffold
- ✅ Shared types package

---

### PHASE 1: Core Sync Implementation (Week 2-3)
**Goal**: Establish data synchronization between Medusa and Payload

#### Tasks

**1.1 Medusa → Payload Product Sync** (3 days)

```typescript
// Create: apps/backend/src/subscribers/product-sync.ts
import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"

export default async function productSyncHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const payloadSync = container.resolve("payloadSyncService")
  const productService = container.resolve("productService")
  
  const product = await productService.retrieve(data.id, {
    relations: ["variants", "images", "options"]
  })
  
  await payloadSync.syncProduct(product)
}

export const config: SubscriberConfig = {
  event: [
    "product.created",
    "product.updated"
  ],
}
```

**1.2 Medusa → Payload Order Sync** (2 days)

```typescript
// Create: apps/backend/src/subscribers/order-sync.ts
export default async function orderSyncHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const payloadSync = container.resolve("payloadSyncService")
  const orderService = container.resolve("orderService")
  
  const order = await orderService.retrieve(data.id, {
    relations: ["items", "customer", "shipping_address"]
  })
  
  await payloadSync.syncOrder(order)
}

export const config: SubscriberConfig = {
  event: [
    "order.placed",
    "order.updated",
    "order.completed"
  ],
}
```

**1.3 Medusa → Payload Vendor Sync** (2 days)

```typescript
// Create: apps/backend/src/subscribers/vendor-sync.ts
export default async function vendorSyncHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const payloadSync = container.resolve("payloadSyncService")
  const vendorModule = container.resolve("vendorModuleService")
  
  const vendor = await vendorModule.retrieveVendor(data.id)
  
  // Create/update tenant in Payload
  await payloadSync.syncVendor(vendor)
}

export const config: SubscriberConfig = {
  event: [
    "vendor.created",
    "vendor.approved",
    "vendor.updated"
  ],
}
```

**1.4 Payload → Medusa Content Sync** (3 days)

```typescript
// Create: apps/orchestrator/src/hooks/sync-to-medusa.ts
import { CollectionAfterChangeHook } from 'payload/types'

export const syncToMedusa: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
}) => {
  if (operation === 'update' || operation === 'create') {
    const medusaUrl = process.env.MEDUSA_URL
    const apiKey = process.env.MEDUSA_API_KEY
    
    await fetch(`${medusaUrl}/admin/custom/content-sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        collection: req.collection.slug,
        doc_id: doc.id,
        data: doc
      })
    })
  }
  
  return doc
}
```

**1.5 Scheduled Sync Jobs** (2 days)

```typescript
// Create: apps/backend/src/jobs/full-sync.ts
import { MedusaContainer } from "@medusajs/framework/types"

export default async function fullSyncJob(container: MedusaContainer) {
  const payloadSync = container.resolve("payloadSyncService")
  const productService = container.resolve("productService")
  
  console.log("Starting full sync...")
  
  // Sync all products
  const products = await productService.list({}, { take: 1000 })
  for (const product of products) {
    await payloadSync.syncProduct(product)
  }
  
  console.log(`Synced ${products.length} products`)
}

// Register in medusa-config.ts
export default defineConfig({
  projectConfig: {
    // ...
  },
  jobs: [
    {
      name: "full-sync",
      schedule: "0 * * * *", // Every hour
      handler: fullSyncJob
    }
  ]
})
```

**1.6 Sync Validation & Monitoring** (2 days)

```typescript
// Create: apps/backend/src/api/admin/sync-status/route.ts
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const payloadSync = req.scope.resolve("payloadSyncService")
  
  const status = await payloadSync.getStatus()
  
  return res.json({
    last_sync: status.lastSync,
    products_synced: status.productCount,
    orders_synced: status.orderCount,
    errors: status.errors,
    pending: status.pending
  })
}
```

**Deliverables**:
- ✅ Product sync working (Medusa → Payload)
- ✅ Order sync working (Medusa → Payload)
- ✅ Vendor sync working (Medusa → Payload)
- ✅ Content sync working (Payload → Medusa)
- ✅ Scheduled jobs running
- ✅ Monitoring dashboard

---

### PHASE 2: Storefront Payload Integration (Week 4-5)
**Goal**: Enable storefront to consume Payload CMS content

#### Tasks

**2.1 Setup Payload SDK in Storefront** (1 day)

```bash
cd apps/storefront
pnpm add @payloadcms/sdk
```

```typescript
// Create: apps/storefront/src/lib/payload.ts
import { PayloadClient } from '@payloadcms/sdk'

export const payload = new PayloadClient({
  serverURL: process.env.PAYLOAD_URL || 'http://localhost:3001',
  apiKey: process.env.PAYLOAD_API_KEY,
})
```

**2.2 Dynamic Homepage from Payload** (3 days)

```typescript
// Update: apps/storefront/src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { payload } from '../lib/payload'

export const Route = createFileRoute('/')({
  loader: async () => {
    // Get homepage from Payload
    const homepage = await payload.find({
      collection: 'pages',
      where: {
        slug: { equals: 'home' }
      },
      depth: 2
    })
    
    // Get featured products from Medusa
    const { products } = await sdk.store.product.list({
      limit: 8,
      is_featured: true
    })
    
    return {
      page: homepage.docs[0],
      products
    }
  },
  component: HomePage
})

function HomePage() {
  const { page, products } = Route.useLoaderData()
  
  return (
    <div>
      {/* Hero from Payload */}
      <section className="hero">
        <h1>{page.hero.title}</h1>
        <p>{page.hero.subtitle}</p>
        <img src={page.hero.image.url} alt="" />
      </section>
      
      {/* Products from Medusa */}
      <section className="products">
        <h2>{page.products_section.title}</h2>
        <div className="grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      
      {/* CTA from Payload */}
      <section className="cta">
        <h2>{page.cta.heading}</h2>
        <button>{page.cta.button_text}</button>
      </section>
    </div>
  )
}
```

**2.3 Dynamic Pages** (2 days)

```typescript
// Create: apps/storefront/src/routes/$slug.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$slug')({
  loader: async ({ params }) => {
    const page = await payload.find({
      collection: 'pages',
      where: {
        slug: { equals: params.slug }
      }
    })
    
    if (!page.docs[0]) {
      throw new Error('Page not found')
    }
    
    return { page: page.docs[0] }
  },
  component: DynamicPage
})

function DynamicPage() {
  const { page } = Route.useLoaderData()
  
  return (
    <div>
      <h1>{page.title}</h1>
      {page.blocks.map((block, index) => (
        <Block key={index} {...block} />
      ))}
    </div>
  )
}
```

**2.4 Blog Implementation** (3 days)

```typescript
// Create: apps/storefront/src/routes/blog/index.tsx
export const Route = createFileRoute('/blog/')({
  loader: async () => {
    const posts = await payload.find({
      collection: 'blogs',
      where: {
        status: { equals: 'published' }
      },
      sort: '-publishedAt',
      limit: 20
    })
    
    return { posts: posts.docs }
  },
  component: BlogIndex
})

// Create: apps/storefront/src/routes/blog/$slug.tsx
export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params }) => {
    const post = await payload.find({
      collection: 'blogs',
      where: {
        slug: { equals: params.slug }
      }
    })
    
    return { post: post.docs[0] }
  },
  component: BlogPost
})
```

**2.5 Enhanced Product Pages with CMS Content** (3 days)

```typescript
// Update: apps/storefront/src/routes/products/$handle.tsx
export const Route = createFileRoute('/products/$handle')({
  loader: async ({ params }) => {
    // Get product from Medusa (commerce data)
    const product = await sdk.store.product.retrieve(params.handle)
    
    // Get enhanced content from Payload
    const content = await payload.find({
      collection: 'products',
      where: {
        medusa_id: { equals: product.id }
      }
    })
    
    return {
      product,
      content: content.docs[0]
    }
  },
  component: ProductPage
})

function ProductPage() {
  const { product, content } = Route.useLoaderData()
  
  return (
    <div>
      {/* Images from Payload (higher quality) */}
      <Gallery images={content?.images || product.images} />
      
      {/* Commerce data from Medusa */}
      <div>
        <h1>{product.title}</h1>
        <Price amount={product.variants[0].calculated_price} />
        <AddToCart product={product} />
      </div>
      
      {/* Rich content from Payload */}
      {content?.long_description && (
        <RichText content={content.long_description} />
      )}
      
      {/* Specifications from Payload */}
      {content?.specifications && (
        <Specifications data={content.specifications} />
      )}
    </div>
  )
}
```

**2.6 Navigation Menu from Payload** (2 days)

```typescript
// Create: apps/storefront/src/components/Header.tsx
export function Header() {
  const [menu, setMenu] = useState(null)
  
  useEffect(() => {
    payload.find({
      collection: 'navigation',
      where: {
        location: { equals: 'main' }
      }
    }).then(result => setMenu(result.docs[0]))
  }, [])
  
  return (
    <header>
      <nav>
        {menu?.items.map(item => (
          <Link key={item.id} to={item.url}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
```

**Deliverables**:
- ✅ Payload SDK integrated
- ✅ Dynamic homepage
- ✅ Dynamic pages
- ✅ Blog functionality
- ✅ Enhanced product pages
- ✅ CMS-driven navigation

---

### PHASE 3: Multi-Tenant Storefront (Week 6-7)
**Goal**: Implement tenant/vendor selection and store switching

#### Tasks

**3.1 Tenant Selection Landing Page** (3 days)

```typescript
// Create: apps/storefront/src/routes/index.tsx (if multi-tenant)
export const Route = createFileRoute('/')({
  loader: async () => {
    // Get all active tenants from Payload
    const tenants = await payload.find({
      collection: 'tenants',
      where: {
        status: { equals: 'active' }
      }
    })
    
    return { tenants: tenants.docs }
  },
  component: TenantSelection
})

function TenantSelection() {
  const { tenants } = Route.useLoaderData()
  
  return (
    <div className="tenant-selection">
      <h1>Choose Your Store</h1>
      <div className="tenant-grid">
        {tenants.map(tenant => (
          <TenantCard
            key={tenant.id}
            tenant={tenant}
            onClick={() => setActiveTenant(tenant)}
          />
        ))}
      </div>
    </div>
  )
}

function TenantCard({ tenant }) {
  return (
    <Link to={`/${tenant.slug}`}>
      <img src={tenant.logo.url} alt={tenant.name} />
      <h3>{tenant.name}</h3>
      <p>{tenant.tagline}</p>
    </Link>
  )
}
```

**3.2 Tenant Context & Routing** (3 days)

```typescript
// Create: apps/storefront/src/contexts/tenant-context.tsx
import { createContext, useContext, useEffect, useState } from 'react'

interface TenantContext {
  tenant: any
  setTenant: (tenant: any) => void
  isLoading: boolean
}

const TenantContext = createContext<TenantContext>(null)

export function TenantProvider({ children }) {
  const [tenant, setTenant] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // Get tenant from URL or localStorage
    const tenantSlug = window.location.pathname.split('/')[1]
    
    if (tenantSlug) {
      payload.find({
        collection: 'tenants',
        where: { slug: { equals: tenantSlug } }
      }).then(result => {
        setTenant(result.docs[0])
        setIsLoading(false)
      })
    } else {
      setIsLoading(false)
    }
  }, [])
  
  return (
    <TenantContext.Provider value={{ tenant, setTenant, isLoading }}>
      {children}
    </TenantContext.Provider>
  )
}

export const useTenant = () => useContext(TenantContext)
```

```typescript
// Update: apps/storefront/src/routes/__root.tsx
import { TenantProvider } from '../contexts/tenant-context'

export const Route = createRootRoute({
  component: () => (
    <TenantProvider>
      <Outlet />
    </TenantProvider>
  )
})
```

**3.3 Tenant-Scoped Product Listing** (3 days)

```typescript
// Create: apps/storefront/src/routes/$tenant/products.tsx
export const Route = createFileRoute('/$tenant/products')({
  loader: async ({ params }) => {
    // Get tenant
    const tenant = await payload.find({
      collection: 'tenants',
      where: { slug: { equals: params.tenant } }
    })
    
    // Get vendor from Medusa
    const vendor = await sdk.admin.custom.get('/vendors', {
      params: {
        tenant_id: tenant.docs[0].id
      }
    })
    
    // Get products for this vendor
    const { products } = await sdk.store.product.list({
      vendor_id: vendor.id,
      limit: 50
    })
    
    return {
      tenant: tenant.docs[0],
      vendor,
      products
    }
  },
  component: TenantProducts
})

function TenantProducts() {
  const { tenant, products } = Route.useLoaderData()
  
  return (
    <div className="tenant-products">
      <TenantHeader tenant={tenant} />
      
      <div className="products-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
```

**3.4 Tenant Branding & Theming** (3 days)

```typescript
// Create: apps/storefront/src/components/TenantTheme.tsx
export function TenantTheme({ children }) {
  const { tenant } = useTenant()
  
  useEffect(() => {
    if (tenant?.branding) {
      // Apply custom CSS variables
      document.documentElement.style.setProperty(
        '--primary-color',
        tenant.branding.primary_color
      )
      document.documentElement.style.setProperty(
        '--secondary-color',
        tenant.branding.secondary_color
      )
      document.documentElement.style.setProperty(
        '--font-heading',
        tenant.branding.font_heading
      )
      
      // Set favicon
      const favicon = document.querySelector('link[rel="icon"]')
      if (favicon && tenant.branding.favicon) {
        favicon.setAttribute('href', tenant.branding.favicon.url)
      }
      
      // Set page title
      document.title = tenant.name
    }
  }, [tenant])
  
  return <>{children}</>
}
```

**3.5 Tenant Switcher Component** (2 days)

```typescript
// Create: apps/storefront/src/components/TenantSwitcher.tsx
export function TenantSwitcher() {
  const { tenant } = useTenant()
  const [tenants, setTenants] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  
  useEffect(() => {
    payload.find({
      collection: 'tenants',
      where: { status: { equals: 'active' } }
    }).then(result => setTenants(result.docs))
  }, [])
  
  return (
    <div className="tenant-switcher">
      <button onClick={() => setIsOpen(!isOpen)}>
        <img src={tenant?.logo.url} alt="" />
        {tenant?.name}
      </button>
      
      {isOpen && (
        <div className="dropdown">
          {tenants.map(t => (
            <Link key={t.id} to={`/${t.slug}`}>
              <img src={t.logo.url} alt="" />
              {t.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
```

**Deliverables**:
- ✅ Tenant selection page
- ✅ Tenant routing
- ✅ Tenant-scoped products
- ✅ Dynamic branding
- ✅ Tenant switcher

---

### PHASE 4: B2B Features Implementation (Week 8-9)
**Goal**: Add B2B functionality (quotes, company accounts, volume pricing)

#### Tasks

**4.1 Company Registration Flow** (3 days)

```typescript
// Create: apps/storefront/src/routes/register/company.tsx
export const Route = createFileRoute('/register/company')({
  component: CompanyRegistration
})

function CompanyRegistration() {
  const [formData, setFormData] = useState({
    company_name: '',
    tax_id: '',
    industry: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    billing_address: {},
    shipping_address: {}
  })
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Create company in Medusa
    const response = await fetch('/api/company/register', {
      method: 'POST',
      body: JSON.stringify(formData)
    })
    
    const { company } = await response.json()
    
    // Redirect to approval pending page
    navigate(`/company/${company.id}/pending`)
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <h1>Register Your Company</h1>
      
      <Input
        label="Company Name"
        value={formData.company_name}
        onChange={(e) => setFormData({
          ...formData,
          company_name: e.target.value
        })}
      />
      
      {/* More fields... */}
      
      <button type="submit">Submit Application</button>
    </form>
  )
}
```

```typescript
// Create: apps/backend/src/api/company/register/route.ts
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const companyModule = req.scope.resolve("companyModuleService")
  
  const company = await companyModule.createCompany({
    ...req.body,
    status: 'pending_approval'
  })
  
  // Send notification to admin
  const notificationService = req.scope.resolve("notificationService")
  await notificationService.send({
    to: 'admin@example.com',
    template: 'company-registration',
    data: { company }
  })
  
  return res.json({ company })
}
```

**4.2 Quote Request System** (4 days)

```typescript
// Create: apps/storefront/src/routes/quote/request.tsx
export const Route = createFileRoute('/quote/request')({
  component: QuoteRequest
})

function QuoteRequest() {
  const [items, setItems] = useState([])
  const [message, setMessage] = useState('')
  
  const handleSubmit = async () => {
    const response = await fetch('/api/quote/create', {
      method: 'POST',
      body: JSON.stringify({
        items: items.map(item => ({
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity
        })),
        message,
        company_id: user.company_id
      })
    })
    
    const { quote } = await response.json()
    
    navigate(`/quote/${quote.id}`)
  }
  
  return (
    <div className="quote-request">
      <h1>Request a Quote</h1>
      
      <div className="items">
        {items.map((item, index) => (
          <QuoteItem key={index} item={item} />
        ))}
        <button onClick={() => setItems([...items, {}])}>
          Add Item
        </button>
      </div>
      
      <textarea
        placeholder="Additional notes or requirements..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      
      <button onClick={handleSubmit}>Submit Quote Request</button>
    </div>
  )
}
```

```typescript
// Create: apps/backend/src/api/quote/create/route.ts
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const quoteModule = req.scope.resolve("quoteModuleService")
  
  const quote = await quoteModule.createQuote({
    company_id: req.body.company_id,
    items: req.body.items,
    message: req.body.message,
    status: 'pending',
    requested_by: req.user.id
  })
  
  // Notify sales team
  await notifyQuoteRequest(quote)
  
  return res.json({ quote })
}
```

**4.3 Volume Pricing Display** (3 days)

```typescript
// Update: apps/storefront/src/routes/products/$handle.tsx
function ProductPage() {
  const { product } = Route.useLoaderData()
  const [quantity, setQuantity] = useState(1)
  const [volumePricing, setVolumePricing] = useState([])
  
  useEffect(() => {
    // Fetch volume pricing tiers
    fetch(`/api/products/${product.id}/volume-pricing`)
      .then(res => res.json())
      .then(data => setVolumePricing(data.tiers))
  }, [product.id])
  
  const getCurrentPrice = () => {
    const tier = volumePricing.find(t => 
      quantity >= t.min_quantity && quantity <= t.max_quantity
    )
    return tier?.price || product.variants[0].calculated_price
  }
  
  return (
    <div>
      <h1>{product.title}</h1>
      
      {/* Volume Pricing Table */}
      {volumePricing.length > 0 && (
        <div className="volume-pricing">
          <h3>Volume Discounts</h3>
          <table>
            <thead>
              <tr>
                <th>Quantity</th>
                <th>Price Each</th>
                <th>You Save</th>
              </tr>
            </thead>
            <tbody>
              {volumePricing.map(tier => (
                <tr key={tier.id}>
                  <td>{tier.min_quantity} - {tier.max_quantity || '∞'}</td>
                  <td>${tier.price}</td>
                  <td className="savings">
                    {calculateSavings(tier.price, product.variants[0].calculated_price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Quantity Selector */}
      <QuantityInput
        value={quantity}
        onChange={setQuantity}
        currentPrice={getCurrentPrice()}
      />
      
      <AddToCart product={product} quantity={quantity} />
    </div>
  )
}
```

**4.4 Company Dashboard** (4 days)

```typescript
// Create: apps/storefront/src/routes/company/dashboard.tsx
export const Route = createFileRoute('/company/dashboard')({
  loader: async () => {
    const company = await fetch('/api/company/me').then(r => r.json())
    const orders = await fetch('/api/company/orders').then(r => r.json())
    const quotes = await fetch('/api/company/quotes').then(r => r.json())
    const users = await fetch('/api/company/users').then(r => r.json())
    
    return { company, orders, quotes, users }
  },
  component: CompanyDashboard
})

function CompanyDashboard() {
  const { company, orders, quotes, users } = Route.useLoaderData()
  
  return (
    <div className="company-dashboard">
      <header>
        <h1>{company.name}</h1>
        <p>Account #: {company.account_number}</p>
      </header>
      
      <div className="stats">
        <StatCard title="Total Orders" value={orders.length} />
        <StatCard title="Pending Quotes" value={quotes.filter(q => q.status === 'pending').length} />
        <StatCard title="Team Members" value={users.length} />
        <StatCard title="Credit Limit" value={`$${company.credit_limit}`} />
      </div>
      
      <Tabs>
        <Tab label="Orders">
          <OrdersTable orders={orders} />
        </Tab>
        <Tab label="Quotes">
          <QuotesTable quotes={quotes} />
        </Tab>
        <Tab label="Users">
          <UsersTable users={users} />
        </Tab>
        <Tab label="Settings">
          <CompanySettings company={company} />
        </Tab>
      </Tabs>
    </div>
  )
}
```

**Deliverables**:
- ✅ Company registration
- ✅ Quote request system
- ✅ Volume pricing display
- ✅ Company dashboard
- ✅ B2B user management

---

### PHASE 5: Vendor Portal (Week 10-11)
**Goal**: Build vendor dashboard for product & order management

#### Tasks

**5.1 Vendor Registration Flow** (2 days)

```typescript
// Create: apps/storefront/src/routes/vendor/register.tsx
export const Route = createFileRoute('/vendor/register')({
  component: VendorRegistration
})

function VendorRegistration() {
  const handleSubmit = async (data) => {
    const response = await fetch('/api/vendor/register', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    
    const { vendor } = await response.json()
    
    // Create tenant in Payload
    await payload.create({
      collection: 'tenants',
      data: {
        medusa_vendor_id: vendor.id,
        name: data.business_name,
        slug: data.slug,
        status: 'pending_approval'
      }
    })
    
    navigate(`/vendor/${vendor.id}/pending`)
  }
  
  return <VendorRegistrationForm onSubmit={handleSubmit} />
}
```

**5.2 Vendor Dashboard** (4 days)

```typescript
// Create: apps/storefront/src/routes/vendor/dashboard.tsx
export const Route = createFileRoute('/vendor/dashboard')({
  loader: async () => {
    const vendor = await fetch('/api/vendor/me').then(r => r.json())
    
    const [orders, products, commissions, payouts] = await Promise.all([
      fetch('/api/vendor/orders').then(r => r.json()),
      fetch('/api/vendor/products').then(r => r.json()),
      fetch('/api/vendor/commissions').then(r => r.json()),
      fetch('/api/vendor/payouts').then(r => r.json())
    ])
    
    return { vendor, orders, products, commissions, payouts }
  },
  component: VendorDashboard
})

function VendorDashboard() {
  const { vendor, orders, products, commissions, payouts } = Route.useLoaderData()
  
  const stats = {
    totalSales: orders.reduce((sum, o) => sum + o.total, 0),
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    totalProducts: products.length,
    pendingCommissions: commissions.reduce((sum, c) => sum + c.amount, 0),
    availableForPayout: payouts.reduce((sum, p) => sum + p.amount, 0)
  }
  
  return (
    <div className="vendor-dashboard">
      <h1>Vendor Dashboard</h1>
      
      <div className="stats-grid">
        <StatCard
          title="Total Sales"
          value={`$${stats.totalSales.toFixed(2)}`}
          trend="+12%"
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          alert={stats.pendingOrders > 5}
        />
        <StatCard
          title="Active Products"
          value={stats.totalProducts}
        />
        <StatCard
          title="Available Payout"
          value={`$${stats.availableForPayout.toFixed(2)}`}
          action="Request Payout"
        />
      </div>
      
      <Tabs>
        <Tab label="Orders">
          <VendorOrdersTable orders={orders} />
        </Tab>
        <Tab label="Products">
          <VendorProductsTable products={products} />
        </Tab>
        <Tab label="Commissions">
          <CommissionsTable commissions={commissions} />
        </Tab>
        <Tab label="Payouts">
          <PayoutsTable payouts={payouts} />
        </Tab>
      </Tabs>
    </div>
  )
}
```

**5.3 Vendor Product Management** (4 days)

```typescript
// Create: apps/storefront/src/routes/vendor/products/new.tsx
export const Route = createFileRoute('/vendor/products/new')({
  component: CreateProduct
})

function CreateProduct() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    handle: '',
    variants: [{ title: 'Default', sku: '', price: 0 }],
    images: [],
    options: [],
    category_id: ''
  })
  
  const handleSubmit = async () => {
    // Create in Medusa
    const product = await sdk.admin.product.create({
      ...formData,
      vendor_id: vendor.id
    })
    
    // Create in Payload with rich content
    await payload.create({
      collection: 'products',
      data: {
        medusa_id: product.id,
        title: formData.title,
        long_description: formData.longDescription,
        specifications: formData.specifications,
        images: formData.highResImages
      }
    })
    
    navigate(`/vendor/products/${product.id}`)
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <h1>Add New Product</h1>
      
      <Input label="Title" {...bindInput('title')} />
      <Textarea label="Description" {...bindInput('description')} />
      <RichTextEditor
        label="Detailed Description"
        {...bindInput('longDescription')}
      />
      
      <ImageUpload
        label="Product Images"
        multiple
        onChange={(files) => setFormData({
          ...formData,
          images: files
        })}
      />
      
      <VariantEditor
        variants={formData.variants}
        onChange={(variants) => setFormData({ ...formData, variants })}
      />
      
      <button type="submit">Create Product</button>
    </form>
  )
}
```

**5.4 Order Fulfillment Interface** (3 days)

```typescript
// Create: apps/storefront/src/routes/vendor/orders/$id.tsx
export const Route = createFileRoute('/vendor/orders/$id')({
  loader: async ({ params }) => {
    const order = await fetch(`/api/vendor/orders/${params.id}`)
      .then(r => r.json())
    return { order }
  },
  component: VendorOrderDetail
})

function VendorOrderDetail() {
  const { order } = Route.useLoaderData()
  const [fulfillmentData, setFulfillmentData] = useState({
    tracking_number: '',
    carrier: '',
    notes: ''
  })
  
  const handleFulfill = async () => {
    await fetch(`/api/vendor/orders/${order.id}/fulfill`, {
      method: 'POST',
      body: JSON.stringify(fulfillmentData)
    })
    
    toast.success('Order fulfilled successfully!')
    navigate('/vendor/orders')
  }
  
  return (
    <div className="order-detail">
      <header>
        <h1>Order #{order.display_id}</h1>
        <Badge status={order.fulfillment_status} />
      </header>
      
      <div className="order-items">
        {order.items.map(item => (
          <OrderItem key={item.id} item={item} />
        ))}
      </div>
      
      <div className="shipping-info">
        <h2>Shipping Address</h2>
        <Address address={order.shipping_address} />
      </div>
      
      {order.fulfillment_status === 'not_fulfilled' && (
        <div className="fulfillment-form">
          <h2>Mark as Fulfilled</h2>
          <Input
            label="Tracking Number"
            value={fulfillmentData.tracking_number}
            onChange={(e) => setFulfillmentData({
              ...fulfillmentData,
              tracking_number: e.target.value
            })}
          />
          <Select
            label="Carrier"
            options={['UPS', 'FedEx', 'USPS', 'DHL']}
            value={fulfillmentData.carrier}
            onChange={(carrier) => setFulfillmentData({
              ...fulfillmentData,
              carrier
            })}
          />
          <button onClick={handleFulfill}>Fulfill Order</button>
        </div>
      )}
    </div>
  )
}
```

**5.5 Commission & Payout Management** (3 days)

```typescript
// Create: apps/storefront/src/routes/vendor/payouts/index.tsx
export const Route = createFileRoute('/vendor/payouts/')({
  loader: async () => {
    const payouts = await fetch('/api/vendor/payouts').then(r => r.json())
    const commissions = await fetch('/api/vendor/commissions/pending')
      .then(r => r.json())
    
    return { payouts, commissions }
  },
  component: PayoutsPage
})

function PayoutsPage() {
  const { payouts, commissions } = Route.useLoaderData()
  
  const availableAmount = commissions.reduce((sum, c) => sum + c.amount, 0)
  
  const requestPayout = async () => {
    await fetch('/api/vendor/payouts/request', {
      method: 'POST',
      body: JSON.stringify({
        amount: availableAmount,
        commission_ids: commissions.map(c => c.id)
      })
    })
    
    toast.success('Payout request submitted!')
  }
  
  return (
    <div className="payouts-page">
      <div className="available-balance">
        <h2>Available for Payout</h2>
        <div className="amount">${availableAmount.toFixed(2)}</div>
        <button
          onClick={requestPayout}
          disabled={availableAmount < 50}
        >
          Request Payout
        </button>
        {availableAmount < 50 && (
          <p className="note">Minimum payout amount is $50</p>
        )}
      </div>
      
      <div className="payout-history">
        <h2>Payout History</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Method</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map(payout => (
              <tr key={payout.id}>
                <td>{formatDate(payout.requested_at)}</td>
                <td>${payout.amount.toFixed(2)}</td>
                <td><Badge status={payout.status} /></td>
                <td>{payout.method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

**Deliverables**:
- ✅ Vendor registration
- ✅ Vendor dashboard
- ✅ Product management
- ✅ Order fulfillment
- ✅ Commission tracking
- ✅ Payout requests

---

### PHASE 6: Admin Customizations (Week 12-13)
**Goal**: Extend Medusa Admin with custom widgets and pages

#### Tasks

**6.1 Setup Admin Customization** (1 day)

```bash
cd apps/backend
pnpm add @medusajs/admin-ui
```

```typescript
// Create: apps/backend/src/admin/widgets/vendor-overview.tsx
import { defineWidgetConfig } from "@medusajs/admin-sdk"

const VendorOverview = () => {
  const [vendors, setVendors] = useState([])
  
  useEffect(() => {
    fetch('/admin/custom/vendors/stats')
      .then(r => r.json())
      .then(data => setVendors(data.vendors))
  }, [])
  
  return (
    <div className="vendor-overview-widget">
      <h3>Vendor Overview</h3>
      <div className="stats">
        <div>Total Vendors: {vendors.length}</div>
        <div>Active: {vendors.filter(v => v.status === 'active').length}</div>
        <div>Pending: {vendors.filter(v => v.status === 'pending').length}</div>
      </div>
    </div>
  )
}

export const config = defineWidgetConfig({
  zone: "product.list.before",
})

export default VendorOverview
```

**6.2 Vendor Management Page** (3 days)

```typescript
// Create: apps/backend/src/admin/routes/vendors/page.tsx
import { defineRouteConfig } from "@medusajs/admin-sdk"

const VendorsPage = () => {
  const [vendors, setVendors] = useState([])
  const [selectedVendor, setSelectedVendor] = useState(null)
  
  return (
    <div className="vendors-admin-page">
      <header>
        <h1>Vendor Management</h1>
        <button onClick={handleInviteVendor}>Invite Vendor</button>
      </header>
      
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Products</th>
            <th>Sales</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map(vendor => (
            <tr key={vendor.id}>
              <td>{vendor.name}</td>
              <td>{vendor.email}</td>
              <td><Badge status={vendor.status} /></td>
              <td>{vendor.product_count}</td>
              <td>${vendor.total_sales}</td>
              <td>
                <button onClick={() => approveVendor(vendor.id)}>
                  Approve
                </button>
                <button onClick={() => setSelectedVendor(vendor)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {selectedVendor && (
        <VendorEditModal
          vendor={selectedVendor}
          onClose={() => setSelectedVendor(null)}
        />
      )}
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Vendors",
  icon: Store,
})

export default VendorsPage
```

**6.3 Quote Management Widget** (2 days)

```typescript
// Create: apps/backend/src/admin/widgets/pending-quotes.tsx
const PendingQuotes = () => {
  const [quotes, setQuotes] = useState([])
  
  useEffect(() => {
    fetch('/admin/custom/quotes?status=pending')
      .then(r => r.json())
      .then(data => setQuotes(data.quotes))
  }, [])
  
  const handleRespond = async (quoteId, response) => {
    await fetch(`/admin/custom/quotes/${quoteId}/respond`, {
      method: 'POST',
      body: JSON.stringify(response)
    })
    
    // Refresh
    setQuotes(quotes.filter(q => q.id !== quoteId))
  }
  
  return (
    <div className="pending-quotes-widget">
      <h3>Pending Quotes ({quotes.length})</h3>
      {quotes.map(quote => (
        <div key={quote.id} className="quote-card">
          <div>
            <strong>{quote.company.name}</strong>
            <p>{quote.items.length} items</p>
          </div>
          <button onClick={() => handleRespond(quote.id, { approved: true })}>
            Respond
          </button>
        </div>
      ))}
    </div>
  )
}

export const config = defineWidgetConfig({
  zone: "order.list.before",
})

export default PendingQuotes
```

**6.4 Commission Configuration** (3 days)

```typescript
// Create: apps/backend/src/admin/routes/commissions/page.tsx
const CommissionsPage = () => {
  const [rules, setRules] = useState([])
  
  return (
    <div className="commissions-page">
      <h1>Commission Rules</h1>
      
      <button onClick={handleAddRule}>Add Rule</button>
      
      <table>
        <thead>
          <tr>
            <th>Vendor</th>
            <th>Rate</th>
            <th>Type</th>
            <th>Conditions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rules.map(rule => (
            <tr key={rule.id}>
              <td>{rule.vendor?.name || 'All Vendors'}</td>
              <td>{rule.rate}%</td>
              <td>{rule.type}</td>
              <td>{rule.conditions}</td>
              <td>
                <button onClick={() => editRule(rule)}>Edit</button>
                <button onClick={() => deleteRule(rule.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Commissions",
})

export default CommissionsPage
```

**6.5 Sync Status Widget** (2 days)

```typescript
// Create: apps/backend/src/admin/widgets/sync-status.tsx
const SyncStatus = () => {
  const [status, setStatus] = useState(null)
  
  useEffect(() => {
    const fetchStatus = () => {
      fetch('/admin/custom/sync/status')
        .then(r => r.json())
        .then(data => setStatus(data))
    }
    
    fetchStatus()
    const interval = setInterval(fetchStatus, 30000) // Every 30s
    
    return () => clearInterval(interval)
  }, [])
  
  const handleManualSync = async () => {
    await fetch('/admin/custom/sync/trigger', { method: 'POST' })
    toast.success('Sync triggered')
  }
  
  return (
    <div className="sync-status-widget">
      <h3>Payload Sync Status</h3>
      <div className="status">
        <div>
          Last Sync: {status?.last_sync ? formatRelative(status.last_sync) : 'Never'}
        </div>
        <div>
          Products: {status?.products_synced} / {status?.total_products}
        </div>
        <div>
          Orders: {status?.orders_synced}
        </div>
        {status?.errors > 0 && (
          <div className="error">
            Errors: {status.errors} <a href="/admin/sync/logs">View</a>
          </div>
        )}
      </div>
      <button onClick={handleManualSync}>Sync Now</button>
    </div>
  )
}

export const config = defineWidgetConfig({
  zone: "dashboard.after",
})

export default SyncStatus
```

**Deliverables**:
- ✅ Vendor overview widget
- ✅ Vendor management page
- ✅ Quote management widget
- ✅ Commission configuration
- ✅ Sync status widget

---

### PHASE 7: Testing & QA (Week 14)
**Goal**: Comprehensive testing of all integrations

#### Test Categories

**7.1 Integration Tests**

```typescript
// Create: tests/integration/sync.test.ts
describe('Medusa ↔ Payload Sync', () => {
  test('Product created in Medusa syncs to Payload', async () => {
    // Create product in Medusa
    const product = await medusa.admin.products.create({
      title: 'Test Product',
      handle: 'test-product'
    })
    
    // Wait for webhook
    await sleep(2000)
    
    // Check Payload
    const payloadProduct = await payload.find({
      collection: 'products',
      where: { medusa_id: { equals: product.id } }
    })
    
    expect(payloadProduct.docs.length).toBe(1)
    expect(payloadProduct.docs[0].title).toBe('Test Product')
  })
  
  test('Tenant updated in Payload syncs to Medusa', async () => {
    // Update tenant in Payload
    const tenant = await payload.update({
      collection: 'tenants',
      id: tenantId,
      data: {
        name: 'Updated Name'
      }
    })
    
    // Wait for webhook
    await sleep(2000)
    
    // Check Medusa
    const vendor = await medusa.admin.custom.get(`/vendors/${tenant.medusa_vendor_id}`)
    
    expect(vendor.name).toBe('Updated Name')
  })
})
```

**7.2 E2E Tests**

```typescript
// Create: tests/e2e/vendor-flow.test.ts
import { test, expect } from '@playwright/test'

test.describe('Vendor Registration Flow', () => {
  test('Complete vendor registration and product creation', async ({ page }) => {
    // Go to registration
    await page.goto('/vendor/register')
    
    // Fill form
    await page.fill('[name="business_name"]', 'Test Vendor')
    await page.fill('[name="email"]', 'vendor@test.com')
    await page.fill('[name="slug"]', 'test-vendor')
    
    // Submit
    await page.click('button[type="submit"]')
    
    // Check pending page
    await expect(page).toHaveURL(/\/vendor\/.*\/pending/)
    
    // Admin approves (simulate)
    await approveVendorAsAdmin(page)
    
    // Login as vendor
    await page.goto('/vendor/login')
    await page.fill('[name="email"]', 'vendor@test.com')
    await page.fill('[name="password"]', 'password')
    await page.click('button[type="submit"]')
    
    // Create product
    await page.goto('/vendor/products/new')
    await page.fill('[name="title"]', 'Test Product')
    await page.fill('[name="price"]', '99.99')
    await page.click('button[type="submit"]')
    
    // Check product appears in storefront
    await page.goto('/test-vendor/products')
    await expect(page.locator('text=Test Product')).toBeVisible()
  })
})
```

**7.3 Load Tests**

```typescript
// Create: tests/load/sync-performance.test.ts
import { check } from 'k6'
import http from 'k6/http'

export const options = {
  stages: [
    { duration: '1m', target: 50 },
    { duration: '3m', target: 100 },
    { duration: '1m', target: 0 },
  ],
}

export default function () {
  // Create product
  const res = http.post(
    `${MEDUSA_URL}/admin/products`,
    JSON.stringify({
      title: `Product ${Date.now()}`,
      handle: `product-${Date.now()}`
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      }
    }
  )
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'sync completed': (r) => checkPayloadSync(r.json().id)
  })
}
```

**Deliverables**:
- ✅ Integration test suite
- ✅ E2E test suite
- ✅ Load test suite
- ✅ Test documentation

---

### PHASE 8: Performance & Optimization (Week 15)
**Goal**: Optimize performance and scalability

#### Tasks

**8.1 Caching Strategy** (2 days)

```typescript
// Create: apps/storefront/src/lib/cache.ts
import { createClient } from 'redis'

const redis = createClient({
  url: process.env.REDIS_URL
})

export async function getCachedPayloadContent(
  collection: string,
  id: string
) {
  const cacheKey = `payload:${collection}:${id}`
  
  // Try cache first
  const cached = await redis.get(cacheKey)
  if (cached) {
    return JSON.parse(cached)
  }
  
  // Fetch from Payload
  const content = await payload.findByID({
    collection,
    id
  })
  
  // Cache for 1 hour
  await redis.setex(cacheKey, 3600, JSON.stringify(content))
  
  return content
}

export async function invalidateCache(
  collection: string,
  id: string
) {
  const cacheKey = `payload:${collection}:${id}`
  await redis.del(cacheKey)
}
```

**8.2 Database Indexing** (1 day)

```sql
-- Add indexes for sync queries
CREATE INDEX idx_products_medusa_id ON products(medusa_id);
CREATE INDEX idx_orders_medusa_id ON orders(medusa_id);
CREATE INDEX idx_tenants_medusa_vendor_id ON tenants(medusa_vendor_id);
CREATE INDEX idx_products_synced_at ON products(synced_at);

-- Medusa indexes
CREATE INDEX idx_vendor_tenant_id ON vendor(tenant_id);
CREATE INDEX idx_product_vendor_id ON product(vendor_id);
CREATE INDEX idx_order_vendor_id ON order(vendor_id);
```

**8.3 Async Job Queue** (2 days)

```typescript
// Create: apps/backend/src/services/sync-queue.service.ts
import Bull from 'bull'

export class SyncQueueService {
  private queue: Bull.Queue
  
  constructor() {
    this.queue = new Bull('payload-sync', {
      redis: process.env.REDIS_URL
    })
    
    this.queue.process('product-sync', this.processProductSync.bind(this))
    this.queue.process('order-sync', this.processOrderSync.bind(this))
  }
  
  async queueProductSync(productId: string) {
    await this.queue.add('product-sync', {
      productId,
      timestamp: Date.now()
    }, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000
      }
    })
  }
  
  private async processProductSync(job: Bull.Job) {
    const { productId } = job.data
    
    // Fetch product
    const product = await this.productService.retrieve(productId)
    
    // Sync to Payload
    await this.payloadSync.syncProduct(product)
    
    job.progress(100)
  }
}
```

**8.4 CDN Configuration** (1 day)

```typescript
// Create: apps/orchestrator/src/collections/Media.ts
const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: '../uploads',
    mimeTypes: ['image/*', 'video/*'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 400,
        position: 'centre',
      },
      {
        name: 'card',
        width: 800,
        height: 600,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 1920,
        height: 1080,
        position: 'centre',
      },
    ],
  },
  hooks: {
    afterChange: [
      async ({ doc }) => {
        // Upload to CDN
        await uploadToCDN(doc.url, doc.filename)
        
        // Return CDN URL
        return {
          ...doc,
          cdn_url: `https://cdn.example.com/media/${doc.filename}`
        }
      }
    ]
  }
}
```

**Deliverables**:
- ✅ Redis caching
- ✅ Database indexes
- ✅ Async job queue
- ✅ CDN integration

---

### PHASE 9: Security & Compliance (Week 16)
**Goal**: Implement security best practices

#### Tasks

**9.1 API Key Rotation** (1 day)

```typescript
// Create: apps/backend/src/api/admin/api-keys/rotate/route.ts
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { service } = req.body // 'payload' or 'medusa'
  
  // Generate new key
  const newKey = generateSecureKey()
  
  // Store in secrets manager
  await updateSecret(`${service}_api_key`, newKey)
  
  // Notify
  await notifyKeyRotation(service, newKey)
  
  return res.json({
    message: 'API key rotated successfully',
    service,
    expires_at: addDays(new Date(), 90)
  })
}
```

**9.2 Webhook Signature Verification** (1 day)

```typescript
// Create: apps/backend/src/utils/webhook.ts
import crypto from 'crypto'

export function validateWebhookSignature(
  signature: string,
  body: any
): boolean {
  const secret = process.env.WEBHOOK_SECRET
  
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(JSON.stringify(body))
  const expectedSignature = hmac.digest('hex')
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}
```

**9.3 Rate Limiting** (2 days)

```typescript
// Create: apps/backend/src/middlewares/rate-limit.ts
import rateLimit from 'express-rate-limit'
import RedisStore from 'rate-limit-redis'

export const rateLimitMiddleware = rateLimit({
  store: new RedisStore({
    client: redis
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
})

// Apply to webhook endpoints
app.use('/api/webhooks', rateLimitMiddleware)
```

**9.4 Audit Logging** (2 days)

```typescript
// Create: apps/backend/src/subscribers/audit-log.ts
export default async function auditLogHandler({
  event,
  container,
}: SubscriberArgs) {
  const auditService = container.resolve("auditService")
  
  await auditService.log({
    event: event.name,
    user_id: event.metadata?.user_id,
    resource: event.metadata?.resource,
    action: event.metadata?.action,
    data: event.data,
    ip_address: event.metadata?.ip,
    timestamp: new Date()
  })
}

export const config: SubscriberConfig = {
  event: [
    "product.*",
    "order.*",
    "vendor.*",
    "quote.*"
  ],
}
```

**Deliverables**:
- ✅ API key rotation
- ✅ Webhook verification
- ✅ Rate limiting
- ✅ Audit logging

---

## Data Flow Diagrams

### Customer Purchase Flow

```
┌─────────────────────────────────────────────────────────┐
│            CUSTOMER PURCHASE FLOW                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Customer visits storefront                          │
│     └─> Loads page from Payload (content)               │
│         └─> Loads products from Medusa (commerce)       │
│                                                          │
│  2. Adds product to cart                                │
│     └─> Cart stored in Medusa                           │
│                                                          │
│  3. Proceeds to checkout                                │
│     └─> Checkout flow in Medusa                         │
│         ├─> Shipping calculation                        │
│         ├─> Tax calculation                             │
│         └─> Payment processing                          │
│                                                          │
│  4. Order placed                                        │
│     └─> Medusa creates order                            │
│         └─> Webhook → Payload (order sync)              │
│             └─> Payload stores order record             │
│                                                          │
│  5. Vendor notified                                     │
│     └─> Email notification                              │
│     └─> Dashboard updates (Medusa)                      │
│                                                          │
│  6. Vendor fulfills                                     │
│     └─> Updates order in Medusa                         │
│         └─> Webhook → Payload (status sync)             │
│                                                          │
│  7. Commission calculated                               │
│     └─> Commission module (Medusa)                      │
│         └─> Payout queue updated                        │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Content Publishing Flow

```
┌─────────────────────────────────────────────────────────┐
│            CONTENT PUBLISHING FLOW                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Admin creates/edits page in Payload CMS             │
│     ├─> Rich text editor                                │
│     ├─> Media upload                                    │
│     └─> SEO metadata                                    │
│                                                          │
│  2. Admin publishes page                                │
│     └─> Payload saves to DB                             │
│         └─> Hook triggers                               │
│             └─> Webhook → Medusa (notify)               │
│                 └─> Cache invalidation                  │
│                                                          │
│  3. Storefront fetches content                          │
│     └─> Checks cache (Redis)                            │
│         ├─> Cache hit: Return cached                    │
│         └─> Cache miss:                                 │
│             └─> Fetch from Payload API                  │
│                 └─> Cache result                        │
│                                                          │
│  4. Page rendered                                       │
│     ├─> Content from Payload                            │
│     ├─> Products from Medusa                            │
│     └─> Combined UI                                     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Vendor Onboarding Flow

```
┌─────────────────────────────────────────────────────────┐
│            VENDOR ONBOARDING FLOW                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Vendor registers                                    │
│     └─> Form submission (Storefront)                    │
│         └─> API → Medusa                                │
│             └─> Creates vendor (status: pending)        │
│                 └─> Webhook → Payload                   │
│                     └─> Creates tenant (draft)          │
│                                                          │
│  2. Admin reviews application                           │
│     └─> Medusa Admin dashboard                          │
│         ├─> View vendor details                         │
│         ├─> Verify documents                            │
│         └─> Click "Approve"                             │
│             └─> Updates vendor status                   │
│                 └─> Webhook → Payload                   │
│                     └─> Activates tenant                │
│                                                          │
│  3. Vendor account activated                            │
│     ├─> Email notification sent                         │
│     ├─> Login credentials provided                      │
│     └─> Dashboard access granted                        │
│                                                          │
│  4. Vendor sets up store                                │
│     └─> Payload CMS (tenant dashboard)                  │
│         ├─> Upload logo                                 │
│         ├─> Set brand colors                            │
│         ├─> Create landing page                         │
│         └─> Configure settings                          │
│                                                          │
│  5. Vendor adds products                                │
│     └─> Medusa API (vendor portal)                      │
│         └─> Creates products                            │
│             └─> Webhook → Payload                       │
│                 └─> Syncs product metadata              │
│                                                          │
│  6. Store goes live                                     │
│     └─> URL: storefront.com/{tenant-slug}               │
│         ├─> Branded experience                          │
│         ├─> Custom content                              │
│         └─> Vendor products                             │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## API Endpoints Map

### Medusa Endpoints

```typescript
// Standard Medusa
GET    /store/products              // List products
GET    /store/products/:id          // Get product
POST   /store/cart                  // Create cart
POST   /store/cart/:id/line-items   // Add to cart
POST   /store/carts/:id/complete    // Complete order
GET    /store/orders                // List orders
GET    /admin/products              // Admin: List products
POST   /admin/products              // Admin: Create product

// Custom Endpoints
// Vendor Management
GET    /admin/custom/vendors                   // List vendors
POST   /admin/custom/vendors                   // Create vendor
GET    /admin/custom/vendors/:id               // Get vendor
PUT    /admin/custom/vendors/:id               // Update vendor
POST   /admin/custom/vendors/:id/approve       // Approve vendor
GET    /admin/custom/vendors/:id/stats         // Vendor stats

// Quote Management
POST   /store/quotes                           // Create quote request
GET    /store/quotes/:id                       // Get quote
GET    /admin/custom/quotes                    // Admin: List quotes
POST   /admin/custom/quotes/:id/respond        // Respond to quote

// Commission & Payouts
GET    /admin/custom/commissions               // List commissions
POST   /admin/custom/commissions/calculate     // Calculate commissions
GET    /admin/custom/payouts                   // List payouts
POST   /admin/custom/payouts/approve           // Approve payout
GET    /vendor/commissions                     // Vendor: My commissions
POST   /vendor/payouts/request                 // Vendor: Request payout

// Volume Pricing
GET    /store/products/:id/volume-pricing      // Get volume pricing
GET    /admin/custom/volume-pricing            // Admin: List rules
POST   /admin/custom/volume-pricing            // Admin: Create rule

// Company (B2B)
POST   /store/company/register                 // Register company
GET    /store/company/me                       // Get my company
GET    /store/company/orders                   // Company orders
POST   /store/company/users                    // Add user to company

// Sync Status
GET    /admin/custom/sync/status               // Get sync status
POST   /admin/custom/sync/trigger              // Trigger manual sync
```

### Payload Endpoints

```typescript
// Collections API
GET    /api/tenants              // List tenants
POST   /api/tenants              // Create tenant
GET    /api/tenants/:id          // Get tenant
PATCH  /api/tenants/:id          // Update tenant

GET    /api/pages                // List pages
POST   /api/pages                // Create page
GET    /api/pages/:id            // Get page
PATCH  /api/pages/:id            // Update page

GET    /api/blogs                // List blog posts
POST   /api/blogs                // Create post
GET    /api/blogs/:id            // Get post

GET    /api/media                // List media
POST   /api/media                // Upload media

GET    /api/products             // List synced products
GET    /api/products/:id         // Get product metadata

GET    /api/orders               // List synced orders
GET    /api/orders/:id           // Get order record

// Custom Endpoints
POST   /api/sync/product         // Sync product from Medusa
POST   /api/sync/order           // Sync order from Medusa
POST   /api/sync/vendor          // Sync vendor from Medusa

// Webhooks
POST   /api/webhooks/medusa      // Receive Medusa webhooks
```

### Storefront API Calls

```typescript
// Homepage
const page = await payload.find({
  collection: 'pages',
  where: { slug: { equals: 'home' } }
})
const products = await medusa.store.product.list({ limit: 8 })

// Product Page
const product = await medusa.store.product.retrieve(handle)
const content = await payload.find({
  collection: 'products',
  where: { medusa_id: { equals: product.id } }
})

// Tenant Store
const tenant = await payload.find({
  collection: 'tenants',
  where: { slug: { equals: tenantSlug } }
})
const products = await medusa.store.product.list({
  vendor_id: tenant.medusa_vendor_id
})

// Blog
const posts = await payload.find({
  collection: 'blogs',
  where: { status: { equals: 'published' } },
  sort: '-publishedAt'
})
```

---

## Database Schema Integration

### Medusa Tables (PostgreSQL)

```sql
-- Core Commerce (Built-in)
product (id, title, handle, description, thumbnail, status, created_at, updated_at)
product_variant (id, product_id, title, sku, prices, inventory_quantity)
order (id, display_id, email, total, status, payment_status, fulfillment_status)
cart (id, email, region_id, items, total)
customer (id, email, first_name, last_name, has_account)

-- Custom Modules
vendor (id, name, email, slug, status, tenant_id, commission_rate, created_at)
tenant (id, vendor_id, name, slug, configuration, active)
quote (id, company_id, vendor_id, items, status, total, expires_at)
commission (id, vendor_id, order_id, amount, rate, status, paid_at)
payout (id, vendor_id, amount, status, requested_at, approved_at, paid_at)
company (id, name, tax_id, status, credit_limit, created_at)
volume_pricing (id, product_id, min_quantity, max_quantity, price, currency_code)
store (id, tenant_id, name, settings, active)

-- Relationships
product.vendor_id → vendor.id
order.vendor_id → vendor.id
quote.vendor_id → vendor.id
commission.vendor_id → vendor.id
payout.vendor_id → vendor.id
```

### Payload Collections (PostgreSQL)

```sql
-- Content Management
tenants (
  id, 
  medusa_vendor_id,  -- Links to Medusa vendor
  name,
  slug,
  logo,
  branding (colors, fonts),
  status,
  created_at,
  synced_at
)

pages (
  id,
  tenant_id,  -- Optional: tenant-specific pages
  title,
  slug,
  blocks (JSON),  -- Flexible content blocks
  seo_title,
  seo_description,
  published_at
)

blogs (
  id,
  tenant_id,  -- Optional: tenant blog
  title,
  slug,
  content (rich text),
  author_id,
  published_at,
  tags
)

products (
  id,
  medusa_id,  -- Links to Medusa product
  long_description (rich text),
  specifications (JSON),
  images (high res),
  synced_at
)

orders (
  id,
  medusa_id,  -- Links to Medusa order
  order_number,
  customer_email,
  total,
  synced_at
)

media (
  id,
  filename,
  url,
  cdn_url,
  alt_text,
  sizes (JSON),
  uploaded_at
)

navigation (
  id,
  tenant_id,  -- Optional: tenant menu
  location,
  items (JSON),
  active
)

categories (
  id,
  name,
  slug,
  description,
  image,
  parent_id
)
```

### Sync Fields

Every synced entity has these fields:

```typescript
{
  medusa_id: string       // Reference to Medusa entity
  synced_at: Date        // Last sync timestamp
  sync_status: enum      // 'synced' | 'pending' | 'failed'
  sync_error?: string    // Error message if failed
}
```

---

## Deployment Plan

### Infrastructure

```yaml
# Production Architecture
┌────────────────────────────────────────┐
│            PRODUCTION SETUP             │
├────────────────────────────────────────┤
│                                        │
│  Vercel                                │
│  ├─ Storefront (TanStack Start)       │
│  └─ CDN & Edge functions              │
│                                        │
│  Railway (or AWS/GCP)                  │
│  ├─ Medusa Backend                     │
│  │  ├─ API Server (2 instances)       │
│  │  └─ Background workers             │
│  │                                     │
│  └─ Payload CMS                        │
│     ├─ Admin UI + API                  │
│     └─ Image processing                │
│                                        │
│  Supabase (or RDS)                     │
│  ├─ Medusa Database                    │
│  └─ Payload Database                   │
│                                        │
│  Upstash Redis                         │
│  ├─ Session storage                    │
│  ├─ Cache                              │
│  └─ Job queue                          │
│                                        │
│  Cloudflare R2 (or S3)                 │
│  ├─ Product images                     │
│  ├─ Media library                      │
│  └─ User uploads                       │
│                                        │
└────────────────────────────────────────┘
```

### Environment Variables

```bash
# Storefront (.env.production)
VITE_MEDUSA_URL=https://api.example.com
VITE_MEDUSA_PUBLISHABLE_KEY=pk_prod_xxx
VITE_PAYLOAD_URL=https://cms.example.com
VITE_PAYLOAD_API_KEY=payload_xxx

# Backend (.env.production)
DATABASE_URL=postgresql://user:pass@db.example.com/medusa
REDIS_URL=redis://user:pass@redis.example.com
PAYLOAD_URL=https://cms.example.com
PAYLOAD_API_KEY=payload_xxx
WEBHOOK_SECRET=xxx
STORE_CORS=https://store.example.com
ADMIN_CORS=https://admin.example.com

# Orchestrator (.env.production)
DATABASE_URL=postgresql://user:pass@db.example.com/payload
PAYLOAD_SECRET=xxx
MEDUSA_URL=https://api.example.com
MEDUSA_API_KEY=medusa_xxx
WEBHOOK_SECRET=xxx
```

### Deployment Steps

```bash
# 1. Deploy databases
# - Create PostgreSQL databases (2)
# - Run Medusa migrations
# - Run Payload migrations

# 2. Deploy Redis
# - Setup Upstash Redis
# - Configure connection

# 3. Deploy Backend (Railway)
cd apps/backend
railway init
railway up
railway run npx medusa db:migrate
railway run npx medusa user -e admin@example.com -p password

# 4. Deploy Orchestrator (Railway)
cd apps/orchestrator
railway up

# 5. Deploy Storefront (Vercel)
cd apps/storefront
vercel --prod

# 6. Configure webhooks
# - Medusa → Payload webhook URL
# - Payload → Medusa webhook URL

# 7. Initial sync
# - Run full sync job
# - Verify data

# 8. Test integration
# - Create test product
# - Verify sync
# - Test storefront
```

---

## Success Metrics

### Technical Metrics

- Sync latency < 2 seconds (webhooks)
- API response time < 300ms (p95)
- Storefront page load < 2 seconds
- 99.9% uptime
- Zero data loss

### Business Metrics

- Vendor onboarding time < 24 hours
- Product publishing time < 5 minutes
- Order processing time < 1 hour
- Commission calculation accuracy 100%
- Customer satisfaction > 4.5/5

---

## Timeline Summary

```
┌──────────────────────────────────────────────────────────┐
│                  TIMELINE (16 WEEKS)                      │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  Week 1:    Foundation & Setup                           │
│  Week 2-3:  Core Sync Implementation                     │
│  Week 4-5:  Storefront Payload Integration               │
│  Week 6-7:  Multi-Tenant Storefront                      │
│  Week 8-9:  B2B Features                                 │
│  Week 10-11: Vendor Portal                               │
│  Week 12-13: Admin Customizations                        │
│  Week 14:    Testing & QA                                │
│  Week 15:    Performance & Optimization                  │
│  Week 16:    Security & Deployment                       │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

---

## Next Steps

1. **Review this plan** with your team
2. **Prioritize phases** based on business needs
3. **Assign developers** to each phase
4. **Setup staging environment** for testing
5. **Begin Phase 0** - Foundation & Setup

Would you like me to:
- Start implementing any specific phase?
- Create detailed wireframes for UI components?
- Generate API documentation?
- Setup the development environment?
