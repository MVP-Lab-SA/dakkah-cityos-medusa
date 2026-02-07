// Subscription Types for Enterprise Commerce Platform

export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  handle: string
  billing_interval: "monthly" | "yearly" | "quarterly" | "weekly"
  price: number
  currency_code: string
  setup_fee?: number
  trial_days?: number
  features: string[]
  is_popular?: boolean
  product_ids?: string[]
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  customer_id: string
  plan_id: string
  plan?: SubscriptionPlan
  status: SubscriptionStatus
  current_period_start: string
  current_period_end: string
  canceled_at?: string
  pause_start?: string
  pause_end?: string
  trial_start?: string
  trial_end?: string
  billing_anchor?: number
  next_billing_date: string
  items: SubscriptionItem[]
  payment_method?: PaymentMethod
  invoices?: SubscriptionInvoice[]
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "paused"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "incomplete"

export interface SubscriptionItem {
  id: string
  subscription_id: string
  product_id: string
  variant_id?: string
  quantity: number
  price: number
  product?: {
    id: string
    title: string
    thumbnail?: string
    handle: string
  }
}

export interface SubscriptionInvoice {
  id: string
  subscription_id: string
  amount: number
  currency_code: string
  status: "draft" | "open" | "paid" | "void" | "uncollectible"
  due_date: string
  paid_at?: string
  invoice_url?: string
  created_at: string
}

export interface PaymentMethod {
  id: string
  type: "card" | "bank_account" | "paypal"
  last_four?: string
  brand?: string
  exp_month?: number
  exp_year?: number
  is_default: boolean
}

export interface SubscriptionCheckoutData {
  plan_id: string
  variant_id?: string
  quantity?: number
  promo_code?: string
  billing_address?: BillingAddress
  payment_method_id?: string
}

export interface BillingAddress {
  first_name: string
  last_name: string
  address_1: string
  address_2?: string
  city: string
  province?: string
  postal_code: string
  country_code: string
  phone?: string
}

// API Response types
export interface SubscriptionPlansResponse {
  plans: SubscriptionPlan[]
  count: number
}

export interface SubscriptionsResponse {
  subscriptions: Subscription[]
  count: number
}

export interface SubscriptionResponse {
  subscription: Subscription
}
