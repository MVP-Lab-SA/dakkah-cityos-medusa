// Type augmentations for custom module types
// These allow accessing dynamically created properties

declare module "@medusajs/framework/types" {
  interface Booking {
    scheduled_at?: Date | string
    check_in_code?: string
    service_id?: string
    [key: string]: any
  }
  
  interface Vendor {
    name?: string
    contact_email?: string
    stripe_onboarding_complete?: boolean
    last_order_at?: Date | string
    [key: string]: any
  }
  
  interface Payout {
    vendor?: Vendor
    currency?: string
    [key: string]: any
  }
  
  interface Invoice {
    payments?: any[]
    reminder_count?: number
    [key: string]: any
  }
  
  interface Quote {
    items?: any[]
    [key: string]: any
  }
  
  interface Subscription {
    amount?: number
    plan_id?: string
    paused_at?: Date | string
    cancelled_at?: Date | string
    canceled_at?: Date | string
    cancellation_reason?: string
    invoices?: any[]
    next_billing_date?: Date | string
    customer?: any
    price?: number
    plan?: any
    trial_ends_at?: Date | string
    [key: string]: any
  }
  
  interface SubscriptionPlan {
    is_active?: boolean
    currency?: string
    interval?: string
    interval_count?: number
    [key: string]: any
  }
  
  interface Tenant {
    contact_email?: string
    plan?: string
    limits?: Record<string, any>
    [key: string]: any
  }
  
  interface Company {
    pricing_tier_id?: string
    pricing_tier?: any
    payment_terms?: number
    [key: string]: any
  }
  
  interface Order {
    display_id?: string | number
    [key: string]: any
  }
  
  interface Fulfillment {
    tracking_numbers?: string[]
    tracking_links?: string[]
    [key: string]: any
  }
  
  interface VendorOrder {
    order?: Order
    items?: any[]
    [key: string]: any
  }
  
  interface VendorProduct {
    inventory_quantity?: number
    product?: any
    [key: string]: any
  }
  
  interface CommissionTransaction {
    vendor?: Vendor
    order_amount?: number
    [key: string]: any
  }
  
  interface VolumePricing {
    tiers?: any[]
    variant_id?: string
    currency_code?: string
    [key: string]: any
  }
}

export {}
