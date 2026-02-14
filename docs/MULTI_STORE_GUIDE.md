# Multi-Store / Multi-Tenant Guide for Medusa

## Option 1: Multiple Storefronts (Same Backend) ⭐ RECOMMENDED

This is the easiest and most common approach. One Medusa backend serves multiple storefronts using **Sales Channels** and **Publishable API Keys**.

### Setup Steps:

#### 1. Create Sales Channels

In Medusa Admin:
- Go to Settings > Sales Channels
- Create channels like:
  - "Saudi Arabia Store"
  - "US Store"
  - "Europe Store"
  - "Mobile App"
  - "B2B Portal"

Or programmatically:

```typescript
// Create via script or custom API route
import { createSalesChannelsWorkflow } from "@medusajs/medusa/core-flows"

const { result } = await createSalesChannelsWorkflow(req.scope).run({
  input: {
    sales_channels: [
      {
        name: "Saudi Arabia Store",
        description: "Sales channel for Saudi market",
      },
      {
        name: "US Store",
        description: "Sales channel for US market",
      },
    ],
  },
})
```

#### 2. Create Publishable API Keys

In Medusa Admin:
- Go to Settings > Developer > Publishable API Keys
- Create one key per storefront
- Link each key to its sales channel(s)

Or programmatically:

```typescript
import { createApiKeysWorkflow, linkSalesChannelsToApiKeyWorkflow } from "@medusajs/medusa/core-flows"

// Create API key
const { result: apiKey } = await createApiKeysWorkflow(req.scope).run({
  input: {
    api_keys: [{
      title: "Saudi Store Key",
      type: "publishable",
    }],
  },
})

// Link to sales channel
await linkSalesChannelsToApiKeyWorkflow(req.scope).run({
  input: {
    id: apiKey[0].id,
    add: ["sc_saudi_channel_id"],
  },
})
```

#### 3. Assign Products to Sales Channels

When creating/updating products, specify which channels they belong to:

```typescript
import { createProductsWorkflow } from "@medusajs/medusa/core-flows"

await createProductsWorkflow(req.scope).run({
  input: {
    products: [{
      title: "Premium Thobe",
      // ... other product details
      sales_channels: [
        { id: "sc_saudi_channel_id" }
      ],
    }],
  },
})
```

#### 4. Configure Each Storefront

In each storefront's `.env`:

```env
# Saudi Store Frontend
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-backend.com
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_saudi_store_key_here

# US Store Frontend  
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-backend.com
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_us_store_key_here
```

#### 5. Use Publishable Key in Requests

Your storefront SDK or fetch calls should include the key:

```typescript
// Automatically handled if using Medusa JS SDK
const sdk = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
  publishableApiKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})

// Or manually in fetch:
fetch('https://your-backend.com/store/products', {
  headers: {
    'x-publishable-api-key': 'pk_your_key_here',
  },
})
```

### Benefits:
- ✅ One backend, multiple storefronts
- ✅ Shared inventory, orders, customers (or separate them)
- ✅ Each storefront sees only its products
- ✅ Easy to manage from one admin
- ✅ Different currencies/regions per storefront

---

## Option 2: True Multi-Tenancy (Separate Stores)

For complete isolation (e.g., SaaS with multiple independent businesses), use the **Store Module** to create multiple stores.

### Setup:

```typescript
import { createStoresWorkflow } from "@medusajs/medusa/core-flows"

const { result } = await createStoresWorkflow(req.scope).run({
  input: {
    stores: [
      {
        name: "Tenant A Store",
        supported_currencies: [
          { currency_code: "usd", is_default: true },
        ],
      },
      {
        name: "Tenant B Store", 
        supported_currencies: [
          { currency_code: "sar", is_default: true },
        ],
      },
    ],
  },
})
```

### Important Notes:
- ⚠️ Requires custom logic to link products, orders, customers to specific stores
- ⚠️ Admin UI currently only supports one default store
- ⚠️ More complex to implement
- ✅ Complete data isolation between tenants
- ✅ Different currencies, regions, settings per store

---

## Comparison

| Feature | Sales Channels (Option 1) | Multi-Store (Option 2) |
|---------|---------------------------|------------------------|
| Complexity | ⭐ Simple | ⭐⭐⭐ Complex |
| Setup Time | Minutes | Hours/Days |
| Admin Support | ✅ Full | ⚠️ Limited |
| Use Case | Multiple storefronts, omnichannel | SaaS, complete tenant isolation |
| Shared Data | Products, customers (configurable) | Completely separate |
| Recommended | ✅ Most cases | Only if needed |

---

## Recommended Approach for Your Use Case

For selling to multiple countries (Saudi Arabia, US, etc.), use **Option 1**:

1. **Create sales channels per region:**
   - "Saudi Arabia"
   - "United States"
   - "Europe"

2. **Create regions with proper currencies:**
   - Saudi Arabia → SAR
   - US → USD
   - Europe → EUR

3. **Create publishable keys for each storefront**

4. **Deploy multiple storefronts** (or one with region detection)

This gives you maximum flexibility with minimal complexity!

---

## Next Steps

1. Go to Admin > Settings > Sales Channels
2. Create your channels
3. Go to Settings > Developer > Publishable API Keys
4. Create and link keys to channels
5. Update your storefront `.env` with the publishable key
6. Assign products to appropriate channels

Need help implementing? Let me know which approach you want to use!
