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
  display_id: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded"
  email: string
  vendor_total: number
  commission_amount: number
  net_amount: number
  currency_code: string
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
  period: "daily" | "weekly" | "monthly"
  period_start: string
  period_end: string
  metrics: {
    revenue: number
    orders: number
    units_sold: number
    average_order_value: number
    refund_rate: number
    new_customers: number
    returning_customers: number
    page_views: number
    conversion_rate: number
  }
  created_at: string
}

export interface VendorPerformanceMetric {
  id: string
  vendor_id: string
  metric_type: "fulfillment_time" | "response_time" | "return_rate" | "customer_satisfaction" | "order_accuracy"
  value: number
  benchmark: number
  rating: "excellent" | "good" | "average" | "below_average" | "poor"
  period: string
  trend: "up" | "down" | "stable"
  created_at: string
}

export interface CommissionRule {
  id: string
  tenant_id: string
  vendor_id?: string
  name: string
  commission_type: "percentage" | "fixed" | "tiered"
  rate: number
  tiers?: CommissionTier[]
  product_category_ids?: string[]
  is_default: boolean
  is_active: boolean
  effective_from: string
  effective_until?: string
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
  vendor_id: string
  order_id: string
  order_display_id: number
  gross_amount: number
  commission_rate: number
  commission_amount: number
  net_amount: number
  status: "pending" | "calculated" | "paid" | "refunded"
  paid_at?: string
  metadata?: Record<string, unknown>
  created_at: string
}

export interface Payout {
  id: string
  tenant_id: string
  vendor_id: string
  amount: number
  currency_code: string
  status: "pending" | "processing" | "completed" | "failed" | "cancelled"
  method: "bank_transfer" | "stripe_connect" | "paypal" | "manual"
  reference_id?: string
  processed_at?: string
  notes?: string
  transaction_links?: PayoutTransactionLink[]
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface PayoutTransactionLink {
  id: string
  payout_id: string
  commission_transaction_id: string
  amount: number
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

