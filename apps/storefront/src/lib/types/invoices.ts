export interface Invoice {
  id: string
  invoice_number: string
  company_id: string
  customer_id?: string
  tenant_id?: string
  order_id?: string
  subscription_id?: string
  status: InvoiceStatus
  issue_date: string
  due_date: string
  paid_at?: string
  currency_code: string
  period_start?: string
  period_end?: string
  payment_terms?: string
  payment_terms_days: number
  subtotal?: number
  tax_total?: number
  discount_total?: number
  shipping_total?: number
  total?: number
  amount_paid?: number
  amount_due?: number
  notes?: string
  internal_notes?: string
  billing_address?: InvoiceBillingAddress
  items: InvoiceItem[]
  early_payment_discount?: EarlyPaymentDiscount
  pdf_url?: string
  issued_at?: string
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export type InvoiceStatus =
  | "draft"
  | "issued"
  | "sent"
  | "paid"
  | "partially_paid"
  | "overdue"
  | "void"
  | "cancelled"

export interface InvoiceItem {
  id: string
  invoice_id?: string
  order_id?: string
  order_display_id?: string
  product_id?: string
  variant_id?: string
  title: string
  description?: string
  quantity: number
  unit_price?: number
  tax_amount?: number
  discount_amount?: number
  total?: number
  thumbnail?: string
  metadata?: Record<string, unknown>
}

export interface InvoiceBillingAddress {
  first_name?: string
  last_name?: string
  company?: string
  address_1: string
  address_2?: string
  city: string
  province?: string
  postal_code: string
  country_code: string
  phone?: string
}

export interface EarlyPaymentDiscount {
  discount_percentage: number
  deadline: string
  discounted_total: number
  savings: number
}

export interface InvoiceFilters {
  status?: InvoiceStatus[]
  order_id?: string
  company_id?: string
  created_after?: string
  created_before?: string
}

export interface InvoicesResponse {
  invoices: Invoice[]
  count: number
}

export interface InvoiceResponse {
  invoice: Invoice
}
