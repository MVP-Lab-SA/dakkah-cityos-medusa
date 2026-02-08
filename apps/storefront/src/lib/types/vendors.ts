export interface Vendor {
  id: string
  handle: string
  name: string
  description?: string
  logo_url?: string
  banner_url?: string
  contact_email?: string
  contact_phone?: string
  website?: string
  is_verified: boolean
  is_featured: boolean
  status: "active" | "suspended" | "inactive" | "pending"
  rating?: number
  review_count?: number
  product_count?: number
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface VendorUser {
  id: string
  vendor_id: string
  user_id: string
  email: string
  first_name?: string
  last_name?: string
  role: "owner" | "admin" | "manager" | "staff"
  is_active: boolean
  permissions?: string[]
  last_login_at?: string
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface VendorProduct {
  id: string
  vendor_id: string
  product_id: string
  status: "active" | "inactive" | "pending_approval" | "rejected"
  commission_rate?: number
  product?: {
    id: string
    title: string
    handle: string
    thumbnail?: string
    status: string
  }
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface VendorOrder {
  id: string
  vendor_id: string
  order_id: string
  tenant_id?: string
  vendor_order_number: string
  display_id?: number
  status:
    | "pending"
    | "acknowledged"
    | "processing"
    | "ready_to_ship"
    | "shipped"
    | "delivered"
    | "completed"
    | "cancelled"
    | "returned"
    | "disputed"
  email?: string
  currency_code: string
  subtotal: number
  shipping_total: number
  tax_total: number
  discount_total: number
  total: number
  commission_amount?: number
  net_amount?: number
  items: VendorOrderItem[]
  shipping_address?: {
    address_1?: string
    city?: string
    province?: string
    postal_code?: string
    country_code?: string
  }
  fulfilled_at?: string
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface VendorOrderItem {
  id: string
  vendor_order_id: string
  product_id: string
  variant_id?: string
  title: string
  quantity: number
  unit_price: number
  total: number
  thumbnail?: string
  sku?: string
  metadata?: Record<string, unknown>
}

export interface VendorAnalyticsSnapshot {
  id: string
  vendor_id: string
  tenant_id?: string
  period_type: "daily" | "weekly" | "monthly"
  period_start: string
  period_end: string
  total_orders: number
  completed_orders: number
  cancelled_orders: number
  returned_orders: number
  total_products: number
  active_products: number
  out_of_stock_products: number
  average_fulfillment_time_hours: number
  unique_customers: number
  repeat_customers: number
  total_reviews: number
  revenue?: number
  units_sold?: number
  average_order_value?: number
  refund_rate?: number
  page_views?: number
  conversion_rate?: number
  metadata?: Record<string, unknown>
  created_at: string
}

export interface VendorPerformanceMetric {
  id: string
  vendor_id: string
  tenant_id?: string
  metric_type:
    | "fulfillment_time"
    | "response_time"
    | "return_rate"
    | "customer_satisfaction"
    | "order_accuracy"
  value?: number
  benchmark?: number
  status: "excellent" | "good" | "average" | "below_average" | "poor"
  measured_at: string
  period_days: number
  sample_count: number
  trend?: "up" | "down" | "stable"
  metadata?: Record<string, unknown>
  created_at: string
}

export interface CommissionRule {
  id: string
  tenant_id: string
  store_id?: string
  vendor_id?: string
  priority: number
  name: string
  description?: string
  commission_type: "percentage" | "fixed" | "tiered"
  commission_percentage?: number
  rate?: number
  tiers?: CommissionTier[]
  conditions?: Record<string, unknown>
  valid_from?: string
  valid_to?: string
  status: "active" | "inactive" | "scheduled"
  applies_to: "all_products" | "specific_products" | "specific_categories" | "specific_vendors"
  product_category_ids?: string[]
  is_default?: boolean
  is_active?: boolean
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface CommissionTier {
  min_amount: number
  max_amount?: number
  rate: number
}

export interface CommissionTransaction {
  id: string
  tenant_id: string
  store_id?: string
  vendor_id: string
  order_id: string
  line_item_id?: string
  commission_rule_id?: string
  payout_id?: string
  order_display_id?: number
  transaction_type: "sale" | "refund" | "adjustment" | "chargeback"
  commission_rate: number
  platform_fee_rate?: number
  gross_amount?: number
  commission_amount?: number
  net_amount?: number
  status: "pending" | "calculated" | "approved" | "paid" | "refunded" | "disputed"
  payout_status: "unpaid" | "scheduled" | "processing" | "paid" | "failed"
  transaction_date: string
  approved_at?: string
  paid_at?: string
  notes?: string
  metadata?: Record<string, unknown>
  created_at: string
}

export interface Payout {
  id: string
  tenant_id: string
  store_id?: string
  vendor_id: string
  payout_number: string
  period_start: string
  period_end: string
  amount?: number
  currency_code?: string
  transaction_count: number
  status: "pending" | "processing" | "completed" | "failed" | "cancelled"
  payment_method: "bank_transfer" | "stripe_connect" | "paypal" | "manual"
  stripe_transfer_id?: string
  stripe_payout_id?: string
  stripe_failure_code?: string
  stripe_failure_message?: string
  bank_reference_number?: string
  processing_started_at?: string
  processing_completed_at?: string
  processing_failed_at?: string
  retry_count: number
  last_retry_at?: string
  notes?: string
  failure_reason?: string
  requires_approval: boolean
  approved_by?: string
  approved_at?: string
  scheduled_for?: string
  transaction_links?: PayoutTransactionLink[]
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface PayoutTransactionLink {
  id: string
  payout_id: string
  commission_transaction_id: string
  amount?: number
  created_at: string
}

export interface PayoutSummary {
  available_balance: number
  pending_balance: number
  total_paid: number
  next_payout_date?: string
}

export interface VendorStats {
  total_products: number
  total_orders: number
  total_sales: number
  average_rating: number
  review_count: number
  response_rate?: number
  response_time_hours?: number
}

export interface VendorFilters {
  category?: string
  is_verified?: boolean
  is_featured?: boolean
  min_rating?: number
  search?: string
}

export interface CommissionSummary {
  total_gross: number
  total_commission: number
  total_net: number
  commission_rate: number
}

export interface VendorOrdersResponse {
  orders: VendorOrder[]
  count: number
}
