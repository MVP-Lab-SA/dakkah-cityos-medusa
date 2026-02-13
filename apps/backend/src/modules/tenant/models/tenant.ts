import { model } from "@medusajs/framework/utils"

const Tenant = model.define("tenant", {
  id: model.id().primaryKey(),
  
  name: model.text(),
  slug: model.text().unique(),
  handle: model.text().unique(),
  
  domain: model.text().nullable(),
  custom_domains: model.json().nullable(),
  
  residency_zone: model.enum(["GCC", "EU", "MENA", "APAC", "AMERICAS", "GLOBAL"]).default("GLOBAL"),
  
  country_id: model.text().nullable(),
  governance_authority_id: model.text().nullable(),
  
  default_locale: model.text().default("en"),
  supported_locales: model.json().default({ locales: ["en"] }),
  timezone: model.text().default("UTC"),
  default_currency: model.text().default("usd"),
  date_format: model.text().default("dd/MM/yyyy"),
  
  default_persona_id: model.text().nullable(),
  
  logo_url: model.text().nullable(),
  favicon_url: model.text().nullable(),
  primary_color: model.text().nullable(),
  accent_color: model.text().nullable(),
  font_family: model.text().nullable(),
  branding: model.json().nullable(),
  
  status: model.enum(["active", "suspended", "trial", "archived", "inactive"]).default("trial"),
  subscription_tier: model.enum(["basic", "pro", "enterprise", "custom"]).default("basic"),
  
  scope_tier: model.enum(["nano", "micro", "small", "medium", "large", "mega", "global"]).default("nano"),
  tenant_type: model.enum(["platform", "marketplace", "vendor", "brand"]).default("vendor"),
  parent_tenant_id: model.text().nullable(),
  operating_countries: model.json().nullable(),
  max_pois: model.number().default(1),
  max_channels: model.number().default(1),
  can_host_vendors: model.boolean().default(false),
  
  billing_email: model.text().nullable(),
  billing_address: model.json().nullable(),
  trial_starts_at: model.dateTime().nullable(),
  trial_ends_at: model.dateTime().nullable(),
  
  settings: model.json().nullable(),
  metadata: model.json().nullable(),
})

export default Tenant
