# Multi-Store System - Complete Guide

## Current Status

Your project has a **sophisticated enterprise multi-tenant, multi-store architecture** that's partially implemented:

### What Exists ✅
1. **Custom Medusa Modules**
   - `cityosStore` module with tenant relationships
   - `cityosTenant` module for multi-tenancy
   - `cityosVendor`, `cityosCompany` modules for marketplace/B2B

2. **PayloadCMS Orchestrator** (Admin Panel)
   - 16 admin collections for full platform management
   - Store management UI with branding, domains, SEO
   - Tenant management with subscription tiers
   - User & role management (super_admin, tenant_admin, store_manager, etc.)
   - API key management with scoping
   - Audit logs and sync jobs
   - Integration endpoints configuration

3. **Admin API Routes**
   - `/admin/tenant/stores` - List/create stores within tenant
   - `/admin/platform/tenants` - Super admin tenant management
   - Role-based access control middleware

### What's Missing ❌
1. **Database migrations** - Custom modules not migrated to Postgres
2. **Orchestrator not running** - PayloadCMS admin panel needs setup
3. **Store data** - No stores/tenants in database yet
4. **Storefront store routing** - Users can't select/switch stores

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   PayloadCMS Orchestrator                │
│         (Admin Panel for Multi-Tenant Management)        │
│                                                           │
│  • Tenants Collection     • API Keys Collection          │
│  • Stores Collection      • Users & Roles                │
│  • Portals Collection     • Audit Logs                   │
│  • Integration Endpoints  • Sync Jobs                    │
└───────────────────┬─────────────────────────────────────┘
                    │
                    │ Sync & Webhooks
                    ↓
┌─────────────────────────────────────────────────────────┐
│                    Medusa Backend                        │
│              (Custom Multi-Store Modules)                │
│                                                           │
│  • cityosStore        • cityosVendor                     │
│  • cityosTenant       • cityosCompany                    │
│  • cityosSubscription • Custom APIs                      │
└───────────────────┬─────────────────────────────────────┘
                    │
                    │ API
                    ↓
┌─────────────────────────────────────────────────────────┐
│                   TanStack Start Storefront              │
│                  (Customer-Facing Store)                 │
│                                                           │
│  • Store Selector    • Multi-Brand Support               │
│  • Store Routing     • Tenant Context                    │
└─────────────────────────────────────────────────────────┘
```

---

## Implementation Options

### Option 1: Quick Single-Store (Current) ✅ WORKING
**Time**: Already done  
**Complexity**: Simple  
**Use Case**: Single brand, one storefront

**What works now:**
- Single store with all products
- Multi-region (US, Saudi Arabia, Europe)
- Multi-currency (USD, SAR, EUR)
- Full product catalog with categories
- Shopping cart and checkout

**For users to access:**
- Visit: https://sb-984ftw23nrx1.ai.prod.medusajs.cloud/us/stores
- All Saudi products are displayed
- Works perfectly without multi-store complexity

---

### Option 2: Simple Multi-Store (Recommended) 
**Time**: 1-2 hours  
**Complexity**: Medium  
**Use Case**: Multiple brands, separate storefronts, simple management

**What you get:**
- Multiple independent stores (e.g., "Saudi Traditional Wear", "Modern Fashion")
- Store selector in storefront
- Separate product catalogs per store
- Store-specific branding (colors, logos)
- Admin UI in Medusa dashboard (simple widgets)

**Implementation:**
1. ✅ Run database migrations for store module
2. ✅ Create 3-5 Saudi stores with products
3. ✅ Add store selector component in storefront header
4. ✅ Create Medusa Admin widgets for store management
5. ✅ Update product queries to filter by store

**I can do this for you right now if you want!**

---

### Option 3: Full Enterprise Multi-Tenant (Complete) 
**Time**: 2-4 hours  
**Complexity**: High  
**Use Case**: SaaS platform, multiple tenants, each with multiple stores

**What you get:**
- Everything from Option 2 PLUS:
- PayloadCMS orchestrator admin panel
- Tenant hierarchy (Country → Scope → Tenant → Store)
- Role-based access control (super_admin, tenant_admin, store_manager)
- Domain/subdomain routing per store
- Keycloak authentication integration
- Cerbos authorization policies
- API key management per tenant
- Webhook sync between Payload ↔ Medusa
- Audit logging for compliance
- Integration endpoints (Stripe, ERPNext, Fleetbase)
- B2B and vendor marketplace features

**Implementation:**
1. Run all database migrations (store, tenant, vendor, company, subscription modules)
2. Set up PayloadCMS orchestrator environment
3. Configure Keycloak for external auth
4. Set up Cerbos policies
5. Seed country/scope/tenant/store hierarchy
6. Configure domain routing
7. Set up webhook synchronization
8. Test role-based access control

---

## How Users Access Stores

### Current (Single Store)
Users visit `/us/stores` or `/sa/stores` and see all products from your catalog.

### Option 2 (Simple Multi-Store)
```
┌──────────────────────────────────────────┐
│  Header with Store Selector               │
│  [Saudi Traditional Wear ▼]              │
│     • Saudi Traditional Wear              │
│     • Modern Saudi Fashion                │
│     • Premium Oud & Fragrances            │
└──────────────────────────────────────────┘
```

**Navigation:**
- `/us/store/saudi-traditional-wear` - Store-specific products
- `/us/store/modern-fashion` - Different store, different products
- Store selector persists in cookie/session

### Option 3 (Enterprise Multi-Tenant)
```
• store1.yourdomain.com (Store 1 subdomain)
• store2.yourdomain.com (Store 2 subdomain)
• custom-domain.com (Store with custom domain)
• yourdomain.com/tenant1/store1 (Path-based routing)
```

**Admin Access:**
- orchestrator.yourdomain.com/admin - PayloadCMS admin for super_admin
- Each tenant admin logs in and only sees their tenants/stores
- Store managers only see their store

---

## Admin Panel - Current vs Future

### Current (Medusa Admin) ✅
- Product management
- Order management
- Customer management
- Inventory tracking
- Region/currency configuration
- No multi-store UI yet

### With Option 2 (Simple Multi-Store)
**New Medusa Admin Widgets:**
- Store selector in header
- Store-scoped product listings
- Store settings widget (name, logo, colors)
- Store performance metrics
- Quick store switcher

### With Option 3 (Full Enterprise)
**PayloadCMS Orchestrator Admin:**
- Full tenant management dashboard
- Multi-store creation wizard
- User & role management UI
- Domain configuration interface
- Branding customization per store
- Integration endpoints setup
- Webhook monitoring
- Audit log viewer
- API key generation UI

---

## Recommendation

For your Saudi marketplace, I recommend **Option 2: Simple Multi-Store** because:

1. ✅ You get multiple stores/brands immediately
2. ✅ Simple for users to understand and navigate
3. ✅ Admin UI stays in familiar Medusa dashboard
4. ✅ No complex tenant hierarchy needed
5. ✅ Can upgrade to Option 3 later if needed

**Next Steps:**
1. I run database migrations for store module
2. I create 3-5 Saudi stores (Traditional Wear, Modern Fashion, Fragrances, etc.)
3. I assign products to stores
4. I add store selector to storefront header
5. I create Medusa Admin widgets for store management

**Time: 1-2 hours total**

Would you like me to implement Option 2 now?

---

## Technical Details for Option 2

### Store Module Schema (Already Defined)
```typescript
{
  id: string
  handle: string              // "saudi-traditional-wear"
  name: string                // "Saudi Traditional Wear"
  status: "active" | "inactive"
  store_type: "retail" | "marketplace" | "b2b"
  sales_channel_id: string    // Maps to Medusa sales channel
  logo_url: string?
  brand_colors: { primary, secondary, accent }
  subdomain: string?          // "traditional.yourdomain.com"
  custom_domain: string?      // "mysaudistore.com"
}
```

### Storefront Changes
1. Store context provider
2. Store selector component in header
3. Product queries filtered by store
4. Store-specific branding applied

### Admin Changes
1. Custom widget: Store list
2. Custom widget: Store selector
3. Custom route: Store settings
4. Product form: Store assignment field

---

## FAQ

**Q: Can I start with single-store and add multi-store later?**  
A: Yes! Your current single-store setup works perfectly. Multi-store is additive.

**Q: Will multi-store break my existing products?**  
A: No. Products without a store assignment can belong to a "default" store or all stores.

**Q: Do I need the orchestrator for multi-store?**  
A: No for Option 2 (simple). Yes for Option 3 (enterprise).

**Q: Can stores share products?**  
A: Yes! Products can be assigned to multiple stores.

**Q: How do I test multi-store locally?**  
A: Use subdomains (store1.localhost:9002) or path-based routing (/store/store1).

---

## Current Store Page

Your `/us/stores` page currently shows:
- All 10 Saudi products in one view
- Organized by categories
- Professional product cards with images
- Price display (USD/SAR)
- In Stock badges
- Collection tags (Ramadan, Eid)

This is a **product catalog page**, not a multi-store selector. For true multi-store, users need to:
1. See a list of available stores/brands
2. Click on a store to enter it
3. Browse that store's specific products
4. Switch between stores easily

**Should I implement this now?**
