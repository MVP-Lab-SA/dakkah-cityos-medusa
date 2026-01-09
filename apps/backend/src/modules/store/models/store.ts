import { model } from "@medusajs/framework/utils"

/**
 * CityOS Store Entity
 * Represents a storefront/brand within a tenant
 * One tenant can have multiple stores (multi-brand strategy)
 */
const Store = model.define("cityosStore", {
  id: model.id().primaryKey(),
  
  // Tenant Relationship
  tenant_id: model.text(),
  
  // Identity
  handle: model.text().unique(),
  name: model.text(),
  
  // Sales Channel Mapping
  sales_channel_id: model.text(),
  
  // Regional Configuration
  default_region_id: model.text().nullable(),
  supported_currency_codes: model.json().nullable(), // ["usd", "sar", "aed"]
  
  // Storefront Configuration
  storefront_url: model.text().nullable(),
  subdomain: model.text().unique().nullable(),
  custom_domain: model.text().unique().nullable(),
  
  // Theme & Branding
  theme_config: model.json().nullable(),
  logo_url: model.text().nullable(),
  favicon_url: model.text().nullable(),
  brand_colors: model.json().nullable(),
  
  // Store Type
  store_type: model.enum([
    "retail",
    "marketplace",
    "b2b",
    "subscription",
    "hybrid"
  ]).default("retail"),
  
  // Status
  status: model.enum([
    "active",
    "inactive",
    "maintenance",
    "coming_soon"
  ]).default("inactive"),
  
  // SEO & Marketing
  seo_title: model.text().nullable(),
  seo_description: model.text().nullable(),
  seo_keywords: model.json().nullable(),
  
  // PayloadCMS Integration
  cms_site_id: model.text().nullable(), // Maps to Payload site/portal
  
  // Configuration
  settings: model.json().nullable(),
  metadata: model.json().nullable(),
})

export default Store
