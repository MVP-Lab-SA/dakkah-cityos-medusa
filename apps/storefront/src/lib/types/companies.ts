export interface Company {
  id: string
  handle?: string
  name: string
  email: string
  phone?: string
  tax_id?: string
  industry?: string
  company_size?: "small" | "medium" | "large" | "enterprise"
  credit_limit: number
  credit_used: number
  available_credit: number
  payment_terms: "net_15" | "net_30" | "net_45" | "net_60" | "prepaid"
  tier: "bronze" | "silver" | "gold" | "platinum"
  is_verified: boolean
  billing_address?: Address
  shipping_addresses?: Address[]
  members?: CompanyMember[]
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface CompanyMember {
  id: string
  company_id: string
  customer_id: string
  role: "admin" | "buyer" | "viewer"
  spending_limit?: number
  can_approve_orders: boolean
  customer?: {
    id: string
    email: string
    first_name?: string
    last_name?: string
  }
  created_at: string
}

export interface CreditInfo {
  credit_limit: number
  credit_used: number
  available_credit: number
  pending_orders_total: number
  payment_terms: string
  next_payment_due?: string
  overdue_amount: number
}

export interface Address {
  id?: string
  address_1: string
  address_2?: string
  city: string
  province?: string
  postal_code: string
  country_code: string
  phone?: string
  company?: string
}
