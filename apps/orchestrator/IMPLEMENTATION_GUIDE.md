# Dakkah CityOS Payload Orchestrator - Implementation Guide

## Project Overview

This is a production-ready Payload CMS 3.x multi-tenant orchestrator for Dakkah CityOS. It serves as the portal/orchestrator layer that manages content, portals, tenant context, integration control plane, and governance for all CityOS systems.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Dakkah CityOS Platform                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐      ┌────────────────────────────┐  │
│  │  Payload CMS     │◄────►│   Medusa Commerce Engine   │  │
│  │  (Orchestrator)  │      │   (Commerce Truth)         │  │
│  └────────┬─────────┘      └────────────────────────────┘  │
│           │                                                   │
│           ├──► Keycloak (IAM/Auth)                          │
│           ├──► Cerbos (Policy/ABAC)                         │
│           ├──► Fleetbase (Logistics)                        │
│           ├──► ERPNext (ERP)                                │
│           └──► Notification Services                         │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **CMS**: Payload CMS 3.x
- **Database**: PostgreSQL with PostGIS + pgvector extensions
- **Storage**: Local filesystem (dev) / S3-compatible (production)
- **Auth**: Keycloak (OIDC/JWT)
- **Policy**: Cerbos (ABAC/PBAC)

## CityOS Tenancy Hierarchy

```
Country
  └─ Scope (Theme or City)
      └─ Category
          └─ Subcategory
              └─ Tenant (Business/Org)
                  └─ Store (Brand/Storefront)
                      └─ Portal (Admin/Vendor/B2B/etc.)
```

## Collections Implemented

### 1. Geo & Hierarchy
- ✅ **Countries**: ISO codes, names, metadata
- ✅ **Scopes**: Theme-based or City-based scopes
- ✅ **Categories**: Business categories
- ✅ **Subcategories**: Fine-grained categorization

### 2. Tenancy
- **Tenants**: Core tenant entities with hierarchy links
- **Stores**: Multi-brand storefronts per tenant

### 3. Portals
- **Portals**: Portal configurations (public, admin, vendor, B2B, etc.)

### 4. Users & Security
- **Users**: With external auth (Keycloak) and tenant memberships
- **ApiKeys**: Service-to-service authentication with scoping

### 5. Content
- **Pages**: Tenant/store-scoped pages
- **Posts**: Tenant/store-scoped blog posts
- **Media**: Tenant/store-scoped media library
- **ProductContent**: Editorial content for Medusa products

### 6. Orchestrator Control Plane
- **IntegrationEndpoints**: Per-tenant integration configurations
- **WebhookLogs**: Audit trail for all webhooks (inbound/outbound)
- **SyncJobs**: Background job queue for data synchronization

### 7. Audit
- **AuditLogs**: Comprehensive audit trail for all admin actions

## Key Libraries & Helpers

### ✅ Context Resolution (`lib/cityosContext.ts`)
Resolves tenant/store context from multiple sources:
1. Signed headers from gateway (highest priority)
2. Custom domain mapping
3. Subdomain mapping
4. Slug fallback
5. Cookie-based selection (super_admin only)

### ✅ Authentication (`lib/keycloak.ts`)
- JWT verification via Keycloak JWKS
- Role mapping to CityOS roles
- User lookup and session management

### ✅ Authorization (`lib/cerbos.ts`)
- Cerbos PDP client
- ABAC/PBAC policy enforcement
- Fallback mode when Cerbos unavailable
- Principal/Resource builders

## API Endpoints

### Integration Webhooks
- `POST /api/integrations/medusa/webhook` - Medusa events
- `POST /api/integrations/fleetbase/webhook` - Logistics events
- `POST /api/integrations/erpnext/webhook` - ERP events

### Outbound Triggers
- `POST /api/integrations/payload/push-to-medusa` - Manual sync to Medusa
- `POST /api/integrations/payload/reconcile` - Data reconciliation

### Cron Jobs
- `POST /api/cron/sync` - Process sync job queue
- `POST /api/cron/webhook-retry` - Retry failed webhooks
- `POST /api/cron/reconcile` - Daily reconciliation

## Environment Variables

### Required Variables

```bash
# Core
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3001
PAYLOAD_SECRET=<generate-with-openssl-rand-hex-32>
DATABASE_URL=postgresql://user:pass@localhost:5432/dakkah_orchestrator

# Database Extensions
POSTGRES_ENABLE_POSTGIS=true
POSTGRES_ENABLE_PGVECTOR=true

# Auth (Keycloak)
KEYCLOAK_ISSUER_URL=https://keycloak.example.com/realms/dakkah
KEYCLOAK_JWKS_URL=https://keycloak.example.com/realms/dakkah/protocol/openid-connect/certs
KEYCLOAK_CLIENT_ID=dakkah-cityos

# Policy (Cerbos)
CERBOS_PDP_URL=http://localhost:3592
CERBOS_PDP_API_KEY=<optional>

# Integrations
MEDUSA_BASE_URL=http://localhost:9000
MEDUSA_API_KEY=<service-to-service-key>
MEDUSA_WEBHOOK_SECRET=<generate-with-openssl-rand-hex-32>

# Security
CITYOS_SIGNATURE_SECRET=<generate-with-openssl-rand-hex-32>
CRON_SECRET=<generate-with-openssl-rand-hex-32>
API_KEY_HASH_SALT=<generate-with-openssl-rand-hex-32>
```

### Optional Variables

```bash
# Auth
KEYCLOAK_AUDIENCE=dakkah-cityos
AUTH_JWT_CLOCK_TOLERANCE_SECONDS=30

# Cerbos
CERBOS_REQUEST_TIMEOUT_MS=5000

# Additional Integrations
FLEETBASE_BASE_URL=http://localhost:8000
FLEETBASE_API_KEY=<api-key>
FLEETBASE_WEBHOOK_SECRET=<secret>

ERPNEXT_BASE_URL=https://erp.example.com
ERPNEXT_API_KEY=<api-key>
ERPNEXT_WEBHOOK_SECRET=<secret>

# Storage (S3)
S3_ENDPOINT=https://s3.amazonaws.com
S3_REGION=us-east-1
S3_BUCKET=dakkah-media
S3_ACCESS_KEY_ID=<access-key>
S3_SECRET_ACCESS_KEY=<secret-key>

# Security
WEBHOOK_REPLAY_WINDOW_SECONDS=300

# Observability
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
LOG_LEVEL=info
```

### Generate Secrets

```bash
# Generate strong random secrets
openssl rand -hex 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Database Setup

### 1. Create Database & Extensions

```sql
-- Create database
CREATE DATABASE dakkah_orchestrator;

-- Connect to database
\c dakkah_orchestrator

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS vector;
```

### 2. Run Migrations

```bash
cd apps/orchestrator
pnpm payload migrate
```

### 3. Seed Sample Data

```bash
# Create seed script
pnpm payload seed
```

Sample hierarchy seed data:
```typescript
// Country
const saudi = await payload.create({
  collection: 'countries',
  data: { code: 'SA', name: 'Saudi Arabia', nameAr: 'المملكة العربية السعودية', status: 'active' }
})

// Scope (City)
const riyadh = await payload.create({
  collection: 'scopes',
  data: { scopeType: 'city', name: 'Riyadh', nameAr: 'الرياض', country: saudi.id, status: 'active' }
})

// Category
const retail = await payload.create({
  collection: 'categories',
  data: { name: 'Retail', nameAr: 'تجزئة', scope: riyadh.id, status: 'active' }
})

// Subcategory
const fashion = await payload.create({
  collection: 'subcategories',
  data: { name: 'Fashion', nameAr: 'أزياء', category: retail.id, status: 'active' }
})

// Tenant
const tenant = await payload.create({
  collection: 'tenants',
  data: {
    handle: 'fashionista-sa',
    name: 'Fashionista Saudi',
    country: saudi.id,
    scope: riyadh.id,
    category: retail.id,
    subcategory: fashion.id,
    status: 'active',
    subscriptionTier: 'pro',
    subdomains: ['fashionista'],
    customDomains: ['fashionista.sa']
  }
})

// Store
const store = await payload.create({
  collection: 'stores',
  data: {
    tenant: tenant.id,
    handle: 'main',
    name: 'Fashionista Main Store',
    storefrontType: 'retail',
    status: 'active',
    subdomains: ['shop.fashionista'],
    customDomains: ['shop.fashionista.sa']
  }
})
```

## Installation & Setup

### 1. Install Dependencies

```bash
cd apps/orchestrator
pnpm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Setup Database

```bash
# Create database and extensions (see Database Setup above)

# Run migrations
pnpm payload migrate
```

### 4. Start Development Server

```bash
pnpm dev
```

Access admin panel at: http://localhost:3001/admin

## Testing Plan

### Test 1: Multi-Tenant Isolation

1. Create two tenants with different domains:
   - Tenant A: `tenant-a.example.com`
   - Tenant B: `tenant-b.example.com`

2. Create pages for each tenant

3. Verify isolation:
   - Access `tenant-a.example.com` → should only see Tenant A's pages
   - Access `tenant-b.example.com` → should only see Tenant B's pages
   - Super admin can see all pages with tenant selector

### Test 2: Authentication Flow

1. Generate Keycloak JWT token with roles
2. Make API request with `Authorization: Bearer <token>`
3. Verify JWT is validated and roles are mapped
4. Verify user context is resolved correctly

### Test 3: Authorization with Cerbos

1. Create test user with `tenant_admin` role
2. Try to access another tenant's data
3. Verify Cerbos denies access
4. Verify super_admin can access all data

### Test 4: Webhook Logging

1. Send test webhook to `/api/integrations/medusa/webhook`
2. Verify webhook is logged in WebhookLogs collection
3. Verify signature validation works
4. Check retry logic for failed webhooks

### Test 5: Sync Jobs

1. Create/update ProductContent
2. Verify SyncJob is enqueued
3. Trigger `/api/cron/sync`
4. Verify sync job processes and updates Medusa

## File Structure

```
apps/orchestrator/
├── src/
│   ├── app/
│   │   ├── (payload)/
│   │   │   ├── admin/
│   │   │   │   └── [[...segments]]/
│   │   │   │       └── page.tsx          # Payload admin UI
│   │   │   └── layout.tsx
│   │   ├── api/
│   │   │   ├── integrations/
│   │   │   │   ├── medusa/
│   │   │   │   │   └── webhook/
│   │   │   │   │       └── route.ts      # Medusa webhook handler
│   │   │   │   ├── fleetbase/
│   │   │   │   │   └── webhook/
│   │   │   │   │       └── route.ts      # Fleetbase webhook handler
│   │   │   │   ├── erpnext/
│   │   │   │   │   └── webhook/
│   │   │   │   │       └── route.ts      # ERPNext webhook handler
│   │   │   │   └── payload/
│   │   │   │       ├── push-to-medusa/
│   │   │   │       │   └── route.ts      # Manual push trigger
│   │   │   │       └── reconcile/
│   │   │   │           └── route.ts      # Reconciliation trigger
│   │   │   └── cron/
│   │   │       ├── sync/
│   │   │       │   └── route.ts          # Process sync jobs
│   │   │       ├── webhook-retry/
│   │   │       │   └── route.ts          # Retry failed webhooks
│   │   │       └── reconcile/
│   │   │           └── route.ts          # Daily reconciliation
│   │   └── layout.tsx
│   ├── collections/
│   │   ├── Countries.ts                  # ✅ Implemented
│   │   ├── Scopes.ts                     # ✅ Implemented
│   │   ├── Categories.ts                 # ✅ Implemented
│   │   ├── Subcategories.ts              # ✅ Implemented
│   │   ├── Tenants.ts                    # To implement
│   │   ├── Stores.ts                     # To implement
│   │   ├── Portals.ts                    # To implement
│   │   ├── Users.ts                      # To implement
│   │   ├── ApiKeys.ts                    # To implement
│   │   ├── Pages.ts                      # To implement
│   │   ├── Posts.ts                      # To implement
│   │   ├── Media.ts                      # To implement
│   │   ├── ProductContent.ts             # To implement
│   │   ├── IntegrationEndpoints.ts       # To implement
│   │   ├── WebhookLogs.ts                # To implement
│   │   ├── SyncJobs.ts                   # To implement
│   │   └── AuditLogs.ts                  # To implement
│   ├── lib/
│   │   ├── cityosContext.ts              # ✅ Implemented
│   │   ├── keycloak.ts                   # ✅ Implemented
│   │   ├── cerbos.ts                     # ✅ Implemented
│   │   ├── webhookSignature.ts           # To implement
│   │   └── audit.ts                      # To implement
│   └── payload.config.ts                 # To implement
├── package.json                          # ✅ Implemented
├── tsconfig.json                         # ✅ Implemented
├── next.config.mjs                       # ✅ Implemented
├── .env.example                          # To implement
└── IMPLEMENTATION_GUIDE.md               # ✅ This file
```

## Next Steps

### Phase 1: Complete Core Collections (Priority)
1. Implement Tenants collection with full access controls
2. Implement Stores collection with domain mapping
3. Implement Users collection with Keycloak integration
4. Implement ApiKeys collection

### Phase 2: Content Collections
1. Implement Pages collection with rich content blocks
2. Implement Posts collection
3. Implement Media collection with S3 support
4. Implement ProductContent collection with Medusa sync

### Phase 3: Orchestration
1. Implement IntegrationEndpoints collection
2. Implement WebhookLogs collection
3. Implement SyncJobs collection
4. Implement AuditLogs collection

### Phase 4: Integration Endpoints
1. Build webhook handlers with signature validation
2. Build sync job processors
3. Build cron endpoints with authentication

### Phase 5: Payload Config & Hooks
1. Complete payload.config.ts
2. Implement collection hooks for auto-sync
3. Implement authentication hooks
4. Configure admin UI customizations

## Security Considerations

1. **Multi-tenant Isolation**: Enforced at database query level, not just UI
2. **Signed Headers**: All gateway traffic must be signed
3. **JWT Verification**: All JWTs verified against Keycloak JWKS
4. **Cerbos Integration**: Fine-grained ABAC/PBAC for all sensitive operations
5. **Webhook Signatures**: All webhooks must be signed with HMAC-SHA256
6. **API Key Hashing**: API keys hashed with salt, never stored in plain text
7. **Audit Logging**: Comprehensive audit trail for compliance

## Performance Considerations

1. **Database Indexing**: Proper indexes on tenant_id, store_id, domain fields
2. **Query Optimization**: Use select() to limit fields fetched
3. **Caching**: Consider Redis for frequently accessed tenant/domain mappings
4. **Connection Pooling**: Configure PostgreSQL connection pool appropriately
5. **Background Jobs**: Use job queue for heavy operations (sync, reconciliation)

## Deployment

### Production Checklist
- [ ] All environment variables configured
- [ ] Database extensions enabled (PostGIS, pgvector)
- [ ] S3 storage configured
- [ ] Keycloak realm and client configured
- [ ] Cerbos policies deployed
- [ ] Webhook secrets generated and shared with systems
- [ ] Cron jobs scheduled (via cron or scheduler service)
- [ ] Monitoring and observability configured
- [ ] SSL certificates for all custom domains
- [ ] CDN configured for media delivery
- [ ] Database backups configured
- [ ] Rate limiting configured

## Support & Documentation

For additional help:
- Payload CMS Docs: https://payloadcms.com/docs
- Keycloak Docs: https://www.keycloak.org/documentation
- Cerbos Docs: https://docs.cerbos.dev
- Next.js Docs: https://nextjs.org/docs

## License

Proprietary - Dakkah CityOS Platform
