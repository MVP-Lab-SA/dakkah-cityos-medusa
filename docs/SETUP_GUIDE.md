# Medusa Store Setup Guide

## Current Configuration

Your Medusa store has been configured with the following default features:

### Regions
- **US Region** (USD) - United States
- **Europe Region** (EUR) - France, Germany, Italy, Denmark, Sweden, UK, Spain

### Sales Channels
- **Default Sales Channel** - Main storefront

### Stock Locations
- **Main Warehouse** (US) - Primary fulfillment location

### Store
- **Name**: Medusa Store
- **Default Sales Channel**: Default Sales Channel
- **Default Region**: Not set (will use first available region)

---

## Adding Default Customer Groups & Sales Channels

To add useful default configurations (customer groups for VIP/Wholesale/B2B and additional sales channels), run:

```bash
cd apps/backend
npx medusa exec ./src/scripts/setup-defaults.ts
```

This will create:
- **Customer Groups**: VIP, Wholesale, B2B
- **Sales Channels**: Mobile App, B2B Portal, Wholesale

---

## Accessing Admin Features

All default features are accessible via the Medusa Admin panel:

### Products & Catalog
- **Products**: Admin → Products
- **Collections**: Admin → Products → Collections
- **Categories**: Admin → Products → Categories
- **Product Types**: Manage via product creation

### Orders & Fulfillment
- **Orders**: Admin → Orders
- **Draft Orders**: Admin → Orders → Draft Orders

### Customers
- **Customers**: Admin → Customers
- **Customer Groups**: Admin → Settings → Customer Groups

### Settings
- **Regions**: Admin → Settings → Regions
- **Sales Channels**: Admin → Settings → Sales Channels
- **Locations & Shipping**: Admin → Settings → Locations & Shipping
- **Store Settings**: Admin → Settings → Store

### Promotions
- **Promotions**: Admin → Promotions

---

## Common Configuration Tasks

### 1. Add a New Region

1. Go to **Admin → Settings → Regions**
2. Click **Create Region**
3. Configure:
   - Name (e.g., "Canada", "Asia Pacific")
   - Currency code (e.g., CAD, JPY)
   - Countries to include
   - Tax settings (inclusive/exclusive)
   - Payment providers

### 2. Create a Sales Channel

1. Go to **Admin → Settings → Sales Channels**
2. Click **Create Sales Channel**
3. Configure:
   - Name (e.g., "Mobile App", "B2B Portal")
   - Description
   - Enabled/Disabled status

### 3. Add a Stock Location

1. Go to **Admin → Settings → Locations & Shipping**
2. Click **Create Location**
3. Configure:
   - Name (e.g., "East Coast Warehouse")
   - Address details
   - Link to sales channels

### 4. Create Customer Groups

1. Go to **Admin → Settings → Customer Groups**
2. Click **Create Group**
3. Configure:
   - Name (e.g., "VIP", "Wholesale")
   - Use for targeted promotions and pricing

### 5. Assign Products to Sales Channels

1. Go to **Admin → Products**
2. Select a product
3. Scroll to **Sales Channels** section
4. Add/remove channels as needed

### 6. Create Promotions

1. Go to **Admin → Promotions**
2. Click **Create Promotion**
3. Configure:
   - Type (percentage, fixed amount, free shipping, BOGO)
   - Target (products, collections, customer groups)
   - Conditions (minimum purchase, specific variants)
   - Automatic or code-based

---

## Next Steps

1. **Review Current Setup**: Check all configurations in the Admin panel
2. **Add Products**: Create your product catalog
3. **Configure Shipping**: Set up shipping options for your regions
4. **Set Up Payment Providers**: Configure payment processing
5. **Test Checkout Flow**: Place test orders to verify everything works
6. **Review Missing Features**: Check `MEDUSA_FEATURES.md` for advanced features you may need

---

## Advanced Features

For advanced features like subscriptions, marketplace, B2B quotes, etc., see `MEDUSA_FEATURES.md` for detailed implementation guides and priorities.

---

## Resources

- **Medusa Documentation**: https://docs.medusajs.com
- **Admin User Guide**: https://docs.medusajs.com/user-guide
- **API Reference**: https://docs.medusajs.com/api
- **Recipes**: https://docs.medusajs.com/resources/recipes
