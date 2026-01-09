# CityOS Platform Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CITYOS PLATFORM                                 │
│                    Multi-Tenant SaaS E-Commerce Platform                    │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                            CLIENT APPLICATIONS                               │
├──────────────────┬──────────────────┬──────────────────┬────────────────────┤
│   Storefront     │   Admin Panel    │   Mobile App     │   Vendor Portal   │
│   (TanStack)     │   (Medusa UI)    │   (React Native) │   (Custom)        │
│   Port: 9002     │   Port: 9001     │   Port: 3001     │   Port: TBD       │
└──────────────────┴──────────────────┴──────────────────┴────────────────────┘
           │                  │                  │                  │
           └──────────────────┼──────────────────┼──────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AUTHENTICATION LAYER                                 │
│                          Keycloak (Port 8080)                               │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │ • Multi-tenant SSO                  • OAuth 2.0 / OIDC             │   │
│  │ • Role-Based Access Control (RBAC)  • Session Management           │   │
│  │ • User Federation                   • Social Login                 │   │
│  │ • JWT Token Validation              • Password Policies            │   │
│  └────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
           │                                      │
           ▼                                      ▼
┌──────────────────────────────┐    ┌──────────────────────────────────────┐
│      MEDUSA BACKEND          │◄──►│        PAYLOAD CMS                   │
│      (Port 9001)             │    │        (Port 3001)                   │
├──────────────────────────────┤    ├──────────────────────────────────────┤
│                              │    │                                      │
│  ┌────────────────────────┐ │    │  ┌─────────────────────────────┐   │
│  │   CORE COMMERCE        │ │    │  │   CONTENT MANAGEMENT        │   │
│  ├────────────────────────┤ │    │  ├─────────────────────────────┤   │
│  │ • Products             │ │    │  │ • Landing Pages             │   │
│  │ • Product Variants     │ │    │  │ • Blog Posts                │   │
│  │ • Cart Management      │ │    │  │ • Hero Sections             │   │
│  │ • Order Processing     │ │    │  │ • Navigation Menus          │   │
│  │ • Customer Accounts    │ │    │  │ • Forms                     │   │
│  │ • Payment Processing   │ │    │  │ • Announcements             │   │
│  │ • Shipping Methods     │ │    │  │ • SEO Metadata              │   │
│  │ • Inventory Tracking   │ │    │  │ • Rich Text Content         │   │
│  │ • Regions & Currencies │ │    │  │ • Media Library             │   │
│  │ • Promotions & Coupons │ │    │  │ • Tenant Configuration      │   │
│  │ • Tax Calculation      │ │    │  │ • Store Branding            │   │
│  └────────────────────────┘ │    │  │ • Theme Settings            │   │
│                              │    │  └─────────────────────────────┘   │
│  ┌────────────────────────┐ │    │                                      │
│  │   CUSTOM MODULES       │ │    │  ┌─────────────────────────────┐   │
│  ├────────────────────────┤ │    │  │   COLLECTIONS (14)          │   │
│  │ • Tenant Management    │ │    │  ├─────────────────────────────┤   │
│  │ • Store Management     │ │    │  │ • Tenants                   │   │
│  │ • Vendor Module        │ │    │  │ • Stores                    │   │
│  │ • Subscription Module  │ │    │  │ • Products (content)        │   │
│  │ • Company Module (B2B) │ │    │  │ • Pages                     │   │
│  │ • Quote/RFQ Module     │ │    │  │ • Posts                     │   │
│  │ • Volume Pricing       │ │    │  │ • Categories                │   │
│  │ • Commission System    │ │    │  │ • Media                     │   │
│  │ • Payout Module        │ │    │  │ • Hero Sections             │   │
│  └────────────────────────┘ │    │  │ • Navigations               │   │
│                              │    │  │ • Forms                     │   │
│  ┌────────────────────────┐ │    │  │ • Form Submissions          │   │
│  │   WORKFLOWS (14)       │ │    │  │ • Announcements             │   │
│  ├────────────────────────┤ │    │  │ • Settings                  │   │
│  │ • Create Tenant        │ │    │  │ • Users                     │   │
│  │ • Create Store         │ │    │  └─────────────────────────────┘   │
│  │ • Create Vendor        │ │    │                                      │
│  │ • Create Subscription  │ │    │  Built with: Payload CMS 3.0        │
│  │ • Create Commission    │ │    │  Framework: Next.js 15              │
│  │ • Process Payout       │ │    │  Admin UI: React 19                 │
│  │ • Calculate Commission │ │    │                                      │
│  │ • Create Company       │ │    │                                      │
│  │ • Create Quote         │ │    │                                      │
│  │ • Convert Quote        │ │    │                                      │
│  │ • Create B2B Order     │ │    │                                      │
│  │ • Apply Volume Price   │ │    │                                      │
│  │ • Process Billing      │ │    │                                      │
│  │ • Update Subscription  │ │    │                                      │
│  └────────────────────────┘ │    │                                      │
│                              │    │                                      │
│  Built with: Medusa 2.0      │    │                                      │
│  Framework: Express.js       │    │                                      │
│  Module System: Awilix DI    │    │                                      │
│                              │    │                                      │
│  DATABASE: medusa_db         │    │  DATABASE: payload_db                │
│  (PostgreSQL)                │    │  (PostgreSQL)                        │
│  • 86 Tables                 │    │  • 14 Collections                    │
│  • Multi-tenant isolation    │    │  • Multi-tenant isolation            │
│  • Row-level security        │    │  • Collection-level access           │
│                              │    │                                      │
└──────────────────────────────┘    └──────────────────────────────────────┘
           │                                      │
           └──────────────┬───────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        INTEGRATION LAYER                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌───────────────────────┐  ┌───────────────────────┐  ┌─────────────────┐│
│  │  Bi-Directional Sync  │  │   Webhook Handlers    │  │  Scheduled Jobs ││
│  ├───────────────────────┤  ├───────────────────────┤  ├─────────────────┤│
│  │ • Medusa → Payload    │  │ • product.created     │  │ • Hourly sync   ││
│  │ • Payload → Medusa    │  │ • order.placed        │  │ • Daily payouts ││
│  │ • Batch operations    │  │ • tenant.updated      │  │ • Billing cycle ││
│  │ • Error recovery      │  │ • content.published   │  │ • Payment retry ││
│  │ • Conflict resolution │  │ • media.uploaded      │  │                 ││
│  └───────────────────────┘  └───────────────────────┘  └─────────────────┘│
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      EXTERNAL INTEGRATIONS                                   │
├────────────────┬────────────────┬────────────────┬─────────────────────────┤
│  Stripe        │  Fleetbase     │  ERPNext       │  Cerbos                 │
│  Connect       │  Logistics     │  Accounting    │  Authorization          │
├────────────────┼────────────────┼────────────────┼─────────────────────────┤
│ • Payments     │ • Shipments    │ • Invoicing    │ • Policy Engine         │
│ • Payouts      │ • Tracking     │ • Accounting   │ • Permission Checks     │
│ • Connected    │ • Driver mgmt  │ • Reports      │ • Multi-tenant rules    │
│   Accounts     │ • Estimates    │ • Payments     │ • Resource access       │
│ • Webhooks     │ • Webhooks     │ • Sync         │                         │
└────────────────┴────────────────┴────────────────┴─────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      OBSERVABILITY LAYER                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐  ┌──────────┐ │
│  │   Logging      │  │   Metrics      │  │   Tracing      │  │  Alerts  │ │
│  ├────────────────┤  ├────────────────┤  ├────────────────┤  ├──────────┤ │
│  │ • Winston      │  │ • Prometheus   │  │ • OpenTelemetry│  │ • PagerDuty││
│  │ • Structured   │  │ • Grafana      │  │ • Jaeger       │  │ • Slack  │ │
│  │ • Log levels   │  │ • Custom       │  │ • Distributed  │  │ • Email  │ │
│  │ • Context      │  │   dashboards   │  │   tracing      │  │          │ │
│  └────────────────┘  └────────────────┘  └────────────────┘  └──────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      INFRASTRUCTURE LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐  ┌──────────┐ │
│  │   PostgreSQL   │  │   Redis        │  │   S3/Storage   │  │  CDN     │ │
│  ├────────────────┤  ├────────────────┤  ├────────────────┤  ├──────────┤ │
│  │ • Primary DB   │  │ • Session      │  │ • Media files  │  │ • Assets │ │
│  │ • Read replica │  │ • Cache        │  │ • Documents    │  │ • Images │ │
│  │ • Backups      │  │ • Job queue    │  │ • Backups      │  │ • Videos │ │
│  │ • Connection   │  │ • Rate limit   │  │                │  │          │ │
│  │   pooling      │  │ • Pub/Sub      │  │                │  │          │ │
│  └────────────────┘  └────────────────┘  └────────────────┘  └──────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Architecture

### Request Flow: Customer Views Product

```
Customer Browser
       │
       │ 1. GET /products/tshirt
       ▼
   Storefront (TanStack Start)
       │
       ├─────────────────────────┬─────────────────────────┐
       │                         │                         │
       │ 2a. Commerce Data       │ 2b. Content Data        │ 2c. Auth Check
       ▼                         ▼                         ▼
   Medusa API                Payload API              Keycloak
   ├─ Products                ├─ SEO                  └─ Validate Session
   ├─ Pricing                 ├─ Images
   ├─ Inventory               ├─ Description
   └─ Variants                └─ Rich Content
       │                         │
       │ 3a. Return JSON         │ 3b. Return JSON
       └─────────────┬───────────┘
                     │
                     │ 4. Merge Data
                     ▼
              Storefront
                     │
                     │ 5. Render HTML
                     ▼
             Customer Browser
```

### Write Flow: Admin Creates Product

```
Admin Panel
       │
       │ 1. POST /admin/products
       ▼
   Medusa Backend
       │
       │ 2. Validate with Keycloak
       ▼
   Keycloak
       │
       │ 3. Token Valid
       ▼
   Medusa Backend
       ├─ 4a. Save to DB
       │       │
       │       ▼
       │  PostgreSQL (medusa_db)
       │
       ├─ 4b. Trigger Workflow
       │       └─ createProductWorkflow()
       │
       └─ 5. Emit Event
               │
               │ product.created
               ▼
       Webhook Handler
               │
               │ 6. Sync to Payload
               ▼
       Payload API
               │
               │ 7. Create product stub
               ▼
       PostgreSQL (payload_db)
               │
               │ 8. Available for content editing
               ▼
       Payload Admin UI
```

---

## Multi-Tenant Architecture

### Tenant Isolation Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                    TENANT HIERARCHY                          │
└─────────────────────────────────────────────────────────────┘

        CityOS Platform (Root)
                │
    ┌───────────┼───────────┬──────────┐
    │           │           │          │
  Tenant A   Tenant B   Tenant C   Tenant D
  (acme)     (widgets)  (fashion)  (tech)
    │
    ├── Stores
    │   ├── Store 1 (acme.com)
    │   ├── Store 2 (acme-eu.com)
    │   └── Store 3 (wholesale.acme.com)
    │
    ├── Products (per store)
    │   ├── Product catalog
    │   ├── Inventory
    │   └── Pricing
    │
    ├── Orders (per store)
    │
    ├── Customers (per tenant)
    │
    ├── Vendors (if marketplace)
    │
    └── Content (Payload)
        ├── Pages
        ├── Blog
        └── Media

┌─────────────────────────────────────────────────────────────┐
│              DATABASE ISOLATION                              │
└─────────────────────────────────────────────────────────────┘

METHOD 1: Row-Level Security (Medusa)
┌────────────────────────────────────┐
│ products table                     │
├────────────────────────────────────┤
│ id  │ name   │ price │ tenant_id  │
├────────────────────────────────────┤
│ 1   │ T-Shirt│ 20.00 │ tenant-a   │
│ 2   │ Mug    │ 15.00 │ tenant-b   │
│ 3   │ Hat    │ 25.00 │ tenant-a   │
└────────────────────────────────────┘

Query: SELECT * FROM products WHERE tenant_id = 'tenant-a'
Result: Only rows 1 and 3

METHOD 2: Collection-Level Access (Payload)
┌────────────────────────────────────┐
│ access control in collections      │
├────────────────────────────────────┤
│ read: ({ req }) => {               │
│   return {                         │
│     tenant: { equals: req.user.tenant }
│   }                                │
│ }                                  │
└────────────────────────────────────┘
```

### Routing Strategy

```
┌─────────────────────────────────────────────────────────────┐
│              DOMAIN-BASED ROUTING                            │
└─────────────────────────────────────────────────────────────┘

Request: https://acme.cityos.com/products
        │
        ▼
    DNS Resolution
        │
        ▼
    Load Balancer
        │
        ▼
    Storefront App
        │
        ├─ Extract domain: "acme.cityos.com"
        │
        ├─ Query Payload: GET /api/tenants?domain=acme.cityos.com
        │       │
        │       └─ Returns: { id: "tenant-a", slug: "acme", ... }
        │
        ├─ Set context: req.tenant = "tenant-a"
        │
        ├─ Query Medusa: GET /store/products?tenant_id=tenant-a
        │
        └─ Render with tenant theme/branding

CUSTOM DOMAINS:
acme.com               → tenant-a (store-1)
widgets.io             → tenant-b (store-1)
shop.fashion.com       → tenant-c (store-2)

SUBDOMAIN ROUTING:
*.cityos.com           → Dynamic tenant lookup
acme.cityos.com        → tenant-a
widgets.cityos.com     → tenant-b
```

---

## Security Architecture

### Authentication Flow (Keycloak)

```
┌─────────────────────────────────────────────────────────────┐
│              AUTHENTICATION FLOW                             │
└─────────────────────────────────────────────────────────────┘

1. User Login Request
   Customer → Storefront: POST /login
                │
                ▼
2. Redirect to Keycloak
   Storefront → Keycloak: /realms/cityos/protocol/openid-connect/auth
                │
                ▼
3. User Authentication
   Keycloak: Validate credentials
                │
                ▼
4. Generate Tokens
   Keycloak: {
     access_token: "eyJ...",
     refresh_token: "eyJ...",
     id_token: "eyJ..."
   }
                │
                ▼
5. Redirect with Tokens
   Keycloak → Storefront: /callback?code=abc123
                │
                ▼
6. Exchange Code for Tokens
   Storefront → Keycloak: POST /token
                │
                ▼
7. Store Session
   Storefront: Set cookie with token
                │
                ▼
8. API Requests with Token
   Storefront → Medusa/Payload: Authorization: Bearer eyJ...
                │
                ▼
9. Validate Token
   Backend → Keycloak: /introspect (or verify JWT locally)
                │
                ▼
10. Process Request
    Backend: Execute business logic
```

### Authorization Flow (Cerbos)

```
┌─────────────────────────────────────────────────────────────┐
│              AUTHORIZATION FLOW                              │
└─────────────────────────────────────────────────────────────┘

Request: DELETE /admin/products/123
    │
    │ 1. Extract user context
    ▼
{
  user: {
    id: "user-456",
    roles: ["admin"],
    tenant: "tenant-a"
  },
  resource: {
    kind: "product",
    id: "123",
    tenant: "tenant-a"
  },
  action: "delete"
}
    │
    │ 2. Check authorization
    ▼
Cerbos Policy Engine
    │
    │ 3. Evaluate policies
    ▼
Policy: admin_product_policy.yaml
rules:
  - actions: ["delete"]
    effect: ALLOW
    condition:
      match:
        expr: |
          resource.tenant == principal.tenant &&
          "admin" in principal.roles
    │
    │ 4. Return decision
    ▼
Decision: ALLOW
    │
    │ 5. Execute request
    ▼
Delete product from database
```

---

## Deployment Architecture

### Production Infrastructure

```
┌─────────────────────────────────────────────────────────────┐
│                   PRODUCTION SETUP                           │
└─────────────────────────────────────────────────────────────┘

                    ┌─────────────┐
                    │   Route 53  │ DNS
                    │   CloudFlare│
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │     CDN     │ CloudFront / CloudFlare
                    │   (Assets)  │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │Load Balancer│ ALB / NGINX
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
    ┌─────▼─────┐   ┌─────▼─────┐   ┌─────▼─────┐
    │Storefront │   │  Medusa   │   │  Payload  │
    │   Pods    │   │   Pods    │   │   Pods    │
    │ (3 replicas)  │ (3 replicas)  │ (2 replicas)
    └─────┬─────┘   └─────┬─────┘   └─────┬─────┘
          │               │               │
          └───────────────┼───────────────┘
                          │
              ┌───────────┼───────────┐
              │           │           │
        ┌─────▼─────┬─────▼─────┬────▼────┐
        │PostgreSQL │  Redis    │   S3    │
        │  Cluster  │  Cluster  │ Storage │
        │(Primary+  │(Sentinel) │         │
        │ Replica)  │           │         │
        └───────────┴───────────┴─────────┘

SCALING:
- Horizontal: Add pods based on CPU/memory
- Vertical: Increase pod resources
- Database: Read replicas for queries
- Cache: Redis cluster for sessions/cache
```

---

## Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | TanStack Start | Storefront framework |
| | React 19 | UI components |
| | Tailwind CSS | Styling |
| **Backend** | Medusa 2.0 | Commerce engine |
| | Express.js | HTTP server |
| | Payload CMS 3.0 | Content management |
| | Next.js 15 | Payload framework |
| **Database** | PostgreSQL 16 | Primary datastore |
| | Redis 7 | Cache & sessions |
| **Authentication** | Keycloak 23 | Identity provider |
| **Authorization** | Cerbos | Policy engine |
| **Payments** | Stripe Connect | Payment processing |
| **Logistics** | Fleetbase | Delivery tracking |
| **Accounting** | ERPNext | Financial management |
| **Observability** | Winston | Logging |
| | Prometheus | Metrics |
| | Grafana | Dashboards |
| **Infrastructure** | Docker | Containerization |
| | Kubernetes | Orchestration |
| | AWS/GCP | Cloud provider |

---

## Performance Characteristics

| Metric | Target | Current |
|--------|--------|---------|
| **API Response Time** | < 200ms | TBD |
| **Page Load Time** | < 2s | TBD |
| **Database Queries** | < 50ms | TBD |
| **Sync Latency** | < 5min | 1 hour (scheduled) |
| **Throughput** | 1000 req/s | TBD |
| **Availability** | 99.9% | TBD |

---

**Last Updated:** January 2024  
**Version:** 1.0.0
