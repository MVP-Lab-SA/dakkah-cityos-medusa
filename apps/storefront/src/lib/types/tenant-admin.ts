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
  email: string
  first_name?: string
  last_name?: string
  role: RbacRole
  assigned_node_ids: string[]
  is_active: boolean
  last_login_at?: string
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface TenantSettings {
  id: string
  tenant_id: string
  features: Record<string, boolean>
  limits: {
    max_products?: number
    max_vendors?: number
    max_users?: number
    max_storage_gb?: number
    max_api_calls_per_month?: number
  }
  commerce: {
    default_currency: string
    supported_currencies: string[]
    tax_inclusive: boolean
    require_shipping_address: boolean
  }
  branding: {
    primary_color?: string
    secondary_color?: string
    logo_url?: string
    favicon_url?: string
    custom_domain?: string
  }
  notifications: {
    email_enabled: boolean
    sms_enabled: boolean
    push_enabled: boolean
    webhook_urls: string[]
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
  plan: BillingPlan
  status: BillingStatus
  monthly_amount: number
  currency_code: string
  billing_cycle_start: string
  billing_cycle_end: string
  next_billing_date: string
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
  period_start: string
  period_end: string
  metrics: {
    api_calls: number
    storage_used_mb: number
    bandwidth_used_mb: number
    active_products: number
    active_vendors: number
    active_users: number
    orders_processed: number
    revenue_processed: number
  }
  created_at: string
}

export interface TenantInvoice {
  id: string
  tenant_id: string
  invoice_number: string
  status: "draft" | "issued" | "paid" | "overdue" | "void"
  period_start: string
  period_end: string
  subtotal: number
  tax_total: number
  total: number
  currency_code: string
  line_items: TenantInvoiceLineItem[]
  due_date: string
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
  entity_type: string
  entity_id: string
  payload: Record<string, unknown>
  correlation_id: string
  causation_id?: string
  status: "pending" | "published" | "failed" | "dead_letter"
  published_at?: string
  error_message?: string
  retry_count: number
  created_at: string
}

export interface AuditLog {
  id: string
  tenant_id: string
  actor_id: string
  actor_type: "user" | "system" | "api"
  actor_email?: string
  action: string
  entity_type: string
  entity_id: string
  changes?: {
    before?: Record<string, unknown>
    after?: Record<string, unknown>
  }
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
  channel_name: string
  medusa_sales_channel_id: string
  is_active: boolean
  config?: Record<string, unknown>
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface RegionZoneMapping {
  id: string
  tenant_id: string
  residency_zone: "GCC" | "EU" | "MENA" | "APAC" | "AMERICAS" | "GLOBAL"
  medusa_region_id: string
  country_codes: string[]
  data_storage_location: string
  cross_border_allowed: boolean
  is_active: boolean
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface AuditLogFilters {
  actor_id?: string
  action?: string
  entity_type?: string
  entity_id?: string
  data_classification?: string
  created_after?: string
  created_before?: string
}

export interface EventOutboxFilters {
  event_type?: string
  entity_type?: string
  status?: string
  created_after?: string
  created_before?: string
}
