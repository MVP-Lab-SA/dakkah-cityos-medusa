export interface Invoice {
  id: string
  tenant_id: string
  order_id?: string
  subscription_id?: string
  customer_id: string
  invoice_number: string
  status: InvoiceStatus
  subtotal: number
  tax_total: number
  discount_total: number
  shipping_total: number
  total: number
  amount_paid: number
  amount_due: number
  currency_code: string
  due_date: string
  paid_at?: string
  issued_at: string
  notes?: string
  billing_address?: InvoiceBillingAddress
  items: InvoiceItem[]
  early_payment_discount?: EarlyPaymentDiscount
  pdf_url?: string
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
  invoice_id: string
  product_id?: string
  variant_id?: string
  title: string
  description?: string
  quantity: number
  unit_price: number
  tax_amount: number
  discount_amount: number
  total: number
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
