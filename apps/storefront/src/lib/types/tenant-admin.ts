export type RbacRole =
  | "super-admin"
  | "city-manager"
  | "district-manager"
  | "zone-manager"
  | "facility-manager"
  | "asset-manager"
  | "vendor-admin"
  | "content-editor"
  | "analyst"
  | "viewer"

export const RBAC_ROLE_WEIGHTS: Record<RbacRole, number> = {
  "super-admin": 100,
  "city-manager": 90,
  "district-manager": 80,
  "zone-manager": 70,
  "facility-manager": 60,
  "asset-manager": 50,
  "vendor-admin": 40,
  "content-editor": 30,
  "analyst": 20,
  "viewer": 10,
}

export interface TenantUser {
  id: string
  tenant_id: string
  user_id: string
  email?: string
  first_name?: string
  last_name?: string
  role: RbacRole
  role_level: number
  assigned_nodes?: Record<string, unknown>
  assigned_node_ids?: string[]
  permissions?: Record<string, unknown>
  status: "invited" | "active" | "suspended" | "deactivated"
  invitation_token?: string
  invitation_sent_at?: string
  invitation_accepted_at?: string
  invited_by_id?: string
  is_active?: boolean
  last_active_at?: string
  last_login_at?: string
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface TenantSettings {
  id: string
  tenant_id: string
  timezone: string
  date_format: string
  time_format: string
  default_locale: string
  supported_locales?: string[]
  default_currency: string
  supported_currencies?: string[]
  primary_color?: string
  secondary_color?: string
  accent_color?: string
  font_family?: string
  custom_css?: string
  email_from_name?: string
  email_from_address?: string
  email_reply_to?: string
  smtp_host?: string
  smtp_port?: number
  smtp_user?: string
  smtp_password?: string
  guest_checkout_enabled: boolean
  require_phone: boolean
  require_company: boolean
  track_inventory: boolean
  allow_backorders: boolean
  low_stock_threshold: number
  order_number_prefix?: string
  order_number_start: number
  auto_archive_days: number
  accepted_payment_methods?: string[]
  payment_capture_method: "automatic" | "manual"
  default_weight_unit: "kg" | "lb" | "oz" | "g"
  default_dimension_unit: "cm" | "in" | "ft" | "m"
  tax_inclusive_pricing: boolean
  tax_provider?: string
  notify_on_new_order: boolean
  notify_on_low_stock: boolean
  notification_emails?: string[]
  features?: Record<string, boolean>
  limits?: {
    max_products?: number
    max_vendors?: number
    max_users?: number
    max_storage_gb?: number
    max_api_calls_per_month?: number
  }
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export type BillingPlan = "free" | "starter" | "professional" | "enterprise"
export type BillingStatus = "active" | "past_due" | "cancelled" | "trialing"

export interface TenantBilling {
  id: string
  tenant_id: string
  subscription_status: BillingStatus
  plan_id?: string
  plan_name?: string
  plan_type: "monthly" | "yearly" | "quarterly"
  plan?: BillingPlan
  status?: BillingStatus
  currency_code: string
  monthly_amount?: number
  usage_metering_enabled: boolean
  usage_unit_name?: string
  included_units: number
  current_period_start?: string
  current_period_end?: string
  current_usage: number
  billing_cycle_start?: string
  billing_cycle_end?: string
  next_billing_date?: string
  payment_method_id?: string
  stripe_customer_id?: string
  stripe_subscription_id?: string
  last_invoice_date?: string
  next_invoice_date?: string
  max_products?: number
  max_orders_per_month?: number
  max_storage_gb?: number
  max_team_members?: number
  payment_method?: {
    type: "card" | "bank_account"
    last_four: string
    brand?: string
  }
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface TenantUsageRecord {
  id: string
  tenant_id: string
  billing_id: string
  usage_type: "api_call" | "storage" | "bandwidth" | "order" | "product" | "user"
  quantity: number
  recorded_at: string
  period_start: string
  period_end: string
  reference_type?: string
  reference_id?: string
  metrics?: {
    api_calls?: number
    storage_used_mb?: number
    bandwidth_used_mb?: number
    active_products?: number
    active_vendors?: number
    active_users?: number
    orders_processed?: number
    revenue_processed?: number
  }
  metadata?: Record<string, unknown>
  created_at: string
}

export interface TenantInvoice {
  id: string
  tenant_id: string
  billing_id: string
  invoice_number?: string
  status?: "draft" | "issued" | "paid" | "overdue" | "void"
  period_start?: string
  period_end?: string
  subtotal?: number
  tax_total?: number
  total?: number
  currency_code?: string
  line_items?: TenantInvoiceLineItem[]
  due_date?: string
  paid_at?: string
  pdf_url?: string
  created_at: string
}

export interface TenantInvoiceLineItem {
  description: string
  quantity: number
  unit_price: number
  total: number
}

export interface EventOutboxEntry {
  id: string
  tenant_id: string
  event_type: string
  aggregate_type: string
  aggregate_id: string
  entity_type?: string
  entity_id?: string
  payload: Record<string, unknown>
  source: string
  correlation_id?: string
  causation_id?: string
  actor_id?: string
  actor_role?: string
  node_id?: string
  channel?: string
  status: "pending" | "published" | "failed" | "dead_letter"
  published_at?: string
  error?: string
  error_message?: string
  retry_count: number
  metadata?: Record<string, unknown>
  created_at: string
}

export interface AuditLog {
  id: string
  tenant_id: string
  action: string
  resource_type: string
  resource_id: string
  entity_type?: string
  entity_id?: string
  actor_id?: string
  actor_role?: string
  actor_type?: "user" | "system" | "api"
  actor_email?: string
  node_id?: string
  changes?: Record<string, unknown>
  previous_values?: Record<string, unknown>
  new_values?: Record<string, unknown>
  data_classification: "public" | "internal" | "confidential" | "restricted"
  ip_address?: string
  user_agent?: string
  metadata?: Record<string, unknown>
  created_at: string
}

export interface SalesChannelMapping {
  id: string
  tenant_id: string
  channel_type: "web" | "mobile" | "pos" | "marketplace" | "social"
  channel_name?: string
  name: string
  description?: string
  medusa_sales_channel_id?: string
  node_id?: string
  config?: Record<string, unknown>
  is_active: boolean
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface RegionZoneMapping {
  id: string
  tenant_id?: string
  residency_zone: "GCC" | "EU" | "MENA" | "APAC" | "AMERICAS" | "GLOBAL"
  medusa_region_id: string
  country_codes?: string[]
  policies_override?: Record<string, unknown>
  data_storage_location?: string
  cross_border_allowed?: boolean
  is_active?: boolean
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface AuditLogFilters {
  actor_id?: string
  action?: string
  resource_type?: string
  entity_type?: string
  entity_id?: string
  data_classification?: string
  created_after?: string
  created_before?: string
}

export interface EventOutboxFilters {
  event_type?: string
  aggregate_type?: string
  entity_type?: string
  status?: string
  created_after?: string
  created_before?: string
}
