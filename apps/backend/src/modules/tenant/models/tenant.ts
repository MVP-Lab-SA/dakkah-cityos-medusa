import { model } from "@medusajs/framework/utils"

/**
 * CityOS Tenant Entity
 * Represents a business/organization within the CityOS tenancy hierarchy:
 * Country > Scope (Theme|City) > Category > Subcategory > Tenant
 */
const Tenant = model.define("tenant", {
  id: model.id().primaryKey(),
  
  // CityOS Hierarchy
  country_id: model.text(),
  scope_type: model.enum(["theme", "city"]),
  scope_id: model.text(),
  category_id: model.text(),
  subcategory_id: model.text().nullable(),
  
  // Identity
  handle: model.text().unique(),
  name: model.text(),
  
  // Domain Configuration
  subdomain: model.text().unique().nullable(),
  custom_domain: model.text().unique().nullable(),
  
  // Status & Subscription
  status: model.enum(["active", "suspended", "trial", "inactive"]).default("trial"),
  subscription_tier: model.enum(["basic", "pro", "enterprise", "custom"]).default("basic"),
  
  // Billing
  billing_email: model.text(),
  billing_address: model.json().nullable(),
  
  // Trial Management
  trial_starts_at: model.dateTime().nullable(),
  trial_ends_at: model.dateTime().nullable(),
  
  // Branding
  logo_url: model.text().nullable(),
  brand_colors: model.json().nullable(),
  
  // Configuration
  settings: model.json().nullable(),
  metadata: model.json().nullable(),
})

export default Tenant
