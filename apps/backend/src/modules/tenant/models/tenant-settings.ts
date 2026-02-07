import { model } from "@medusajs/framework/utils"

export const TenantSettings = model.define("tenant_settings", {
  id: model.id().primaryKey(),
  tenant_id: model.text().unique(),
  
  // General Settings
  timezone: model.text().default("UTC"),
  date_format: model.text().default("YYYY-MM-DD"),
  time_format: model.text().default("HH:mm"),
  
  // Localization
  default_locale: model.text().default("en"),
  supported_locales: model.json().nullable(), // ["en", "es", "fr"]
  default_currency: model.text().default("usd"),
  supported_currencies: model.json().nullable(),
  
  // Branding
  primary_color: model.text().nullable(),
  secondary_color: model.text().nullable(),
  accent_color: model.text().nullable(),
  font_family: model.text().nullable(),
  custom_css: model.text().nullable(),
  
  // Email Settings
  email_from_name: model.text().nullable(),
  email_from_address: model.text().nullable(),
  email_reply_to: model.text().nullable(),
  smtp_host: model.text().nullable(),
  smtp_port: model.number().nullable(),
  smtp_user: model.text().nullable(),
  smtp_password: model.text().nullable(),
  
  // Checkout Settings
  guest_checkout_enabled: model.boolean().default(true),
  require_phone: model.boolean().default(false),
  require_company: model.boolean().default(false),
  min_order_value: model.bigNumber().nullable(),
  max_order_value: model.bigNumber().nullable(),
  
  // Inventory Settings
  track_inventory: model.boolean().default(true),
  allow_backorders: model.boolean().default(false),
  low_stock_threshold: model.number().default(10),
  
  // Order Settings
  order_number_prefix: model.text().nullable(),
  order_number_start: model.number().default(1000),
  auto_archive_days: model.number().default(90),
  
  // Payment Settings
  accepted_payment_methods: model.json().nullable(),
  payment_capture_method: model.enum(["automatic", "manual"]).default("automatic"),
  
  // Shipping Settings
  free_shipping_threshold: model.bigNumber().nullable(),
  default_weight_unit: model.enum(["kg", "lb", "oz", "g"]).default("kg"),
  default_dimension_unit: model.enum(["cm", "in", "m", "ft"]).default("cm"),
  
  // Tax Settings
  tax_inclusive_pricing: model.boolean().default(false),
  tax_provider: model.text().nullable(),
  
  // Notifications
  notify_on_new_order: model.boolean().default(true),
  notify_on_low_stock: model.boolean().default(true),
  notification_emails: model.json().nullable(),
  
  // Integrations
  google_analytics_id: model.text().nullable(),
  facebook_pixel_id: model.text().nullable(),
  google_tag_manager_id: model.text().nullable(),
  
  // API Settings
  api_rate_limit: model.number().default(1000),
  webhook_secret: model.text().nullable(),
  
  metadata: model.json().nullable(),
})
.indexes([
  { on: ["tenant_id"] },
])
