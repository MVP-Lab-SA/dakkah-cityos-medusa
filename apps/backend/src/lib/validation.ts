/**
 * Centralized Zod validation schemas for API routes
 */
import { z } from "zod"

// Common schemas
export const paginationSchema = z.object({
  limit: z.coerce.number().min(1).max(100).optional().default(20),
  offset: z.coerce.number().min(0).optional().default(0),
})

export const idParamSchema = z.object({
  id: z.string().min(1, "ID is required"),
})

export const handleParamSchema = z.object({
  handle: z.string().min(1, "Handle is required"),
})

// Commission rules
export const createCommissionRuleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["percentage", "fixed", "tiered"]),
  value: z.number().min(0),
  vendor_id: z.string().optional(),
  category_id: z.string().optional(),
  priority: z.number().int().optional().default(0),
  is_active: z.boolean().optional().default(true),
})

export const updateCommissionRuleSchema = createCommissionRuleSchema.partial()

// Volume pricing
export const createVolumePricingSchema = z.object({
  product_id: z.string().min(1, "Product ID is required"),
  min_quantity: z.number().int().min(1),
  max_quantity: z.number().int().optional(),
  price: z.number().min(0),
  discount_percent: z.number().min(0).max(100).optional(),
})

export const updateVolumePricingSchema = createVolumePricingSchema.partial()

// Reviews
export const createReviewSchema = z.object({
  product_id: z.string().min(1, "Product ID is required"),
  customer_id: z.string().min(1, "Customer ID is required"),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(200).optional(),
  content: z.string().max(5000).optional(),
})

export const reviewModerationSchema = z.object({
  reason: z.string().optional(),
})

// Subscriptions
export const createSubscriptionSchema = z.object({
  plan_id: z.string().min(1, "Plan ID is required"),
  customer_id: z.string().min(1, "Customer ID is required"),
  payment_method_id: z.string().optional(),
  trial_days: z.number().int().min(0).optional(),
})

export const changePlanSchema = z.object({
  plan_id: z.string().min(1, "Plan ID is required"),
  prorate: z.boolean().optional().default(true),
})

export const updatePaymentMethodSchema = z.object({
  payment_method_id: z.string().min(1, "Payment method ID is required"),
})

// Bookings
export const createBookingSchema = z.object({
  service_id: z.string().min(1, "Service ID is required"),
  customer_id: z.string().min(1, "Customer ID is required"),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  notes: z.string().max(1000).optional(),
})

export const updateBookingSchema = z.object({
  start_time: z.string().datetime().optional(),
  end_time: z.string().datetime().optional(),
  notes: z.string().max(1000).optional(),
  status: z.enum(["pending", "confirmed", "cancelled", "completed", "no_show"]).optional(),
})

// Quotes
export const createQuoteSchema = z.object({
  company_id: z.string().min(1, "Company ID is required"),
  items: z.array(z.object({
    product_id: z.string().min(1),
    variant_id: z.string().min(1),
    quantity: z.number().int().min(1),
  })).min(1, "At least one item is required"),
  notes: z.string().max(2000).optional(),
  valid_until: z.string().datetime().optional(),
})

export const quoteResponseSchema = z.object({
  items: z.array(z.object({
    product_id: z.string(),
    variant_id: z.string(),
    quantity: z.number().int().min(1),
    unit_price: z.number().min(0),
  })),
  discount_percent: z.number().min(0).max(100).optional(),
  notes: z.string().max(2000).optional(),
  valid_until: z.string().datetime(),
})

// Purchase Orders
export const createPurchaseOrderSchema = z.object({
  company_id: z.string().min(1, "Company ID is required"),
  quote_id: z.string().optional(),
  items: z.array(z.object({
    product_id: z.string().min(1),
    variant_id: z.string().min(1),
    quantity: z.number().int().min(1),
    unit_price: z.number().min(0),
  })).min(1, "At least one item is required"),
  billing_address: z.object({
    address_1: z.string().min(1),
    city: z.string().min(1),
    country_code: z.string().length(2),
    postal_code: z.string().optional(),
  }).optional(),
  shipping_address: z.object({
    address_1: z.string().min(1),
    city: z.string().min(1),
    country_code: z.string().length(2),
    postal_code: z.string().optional(),
  }).optional(),
})

// Companies
export const createCompanySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  handle: z.string().min(1).regex(/^[a-z0-9-]+$/, "Handle must be lowercase alphanumeric with dashes"),
  tax_id: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  spending_limit: z.number().min(0).optional(),
  payment_terms: z.enum(["net_15", "net_30", "net_45", "net_60"]).optional(),
})

export const updateCompanySchema = createCompanySchema.partial()

export const addCompanyMemberSchema = z.object({
  customer_id: z.string().min(1, "Customer ID is required"),
  role: z.enum(["admin", "buyer", "viewer"]).optional().default("buyer"),
  spending_limit: z.number().min(0).optional(),
})

// Vendors
export const createVendorSchema = z.object({
  name: z.string().min(1, "Vendor name is required"),
  handle: z.string().min(1).regex(/^[a-z0-9-]+$/, "Handle must be lowercase alphanumeric with dashes"),
  email: z.string().email(),
  description: z.string().max(5000).optional(),
  logo_url: z.string().url().optional(),
  banner_url: z.string().url().optional(),
})

export const updateVendorSchema = createVendorSchema.partial()

export const vendorSuspendSchema = z.object({
  reason: z.string().min(1, "Reason is required"),
})

// Payouts
export const processPayoutSchema = z.object({
  payout_method: z.enum(["stripe_connect", "bank_transfer", "manual"]).optional(),
  notes: z.string().max(500).optional(),
})

// Helper function to validate and parse
export function validateBody<T>(schema: z.ZodSchema<T>, body: unknown): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(body)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, errors: result.error }
}

// Helper to format Zod errors for API response
export function formatZodErrors(error: z.ZodError): { field: string; message: string }[] {
  return error.errors.map((e) => ({
    field: e.path.join("."),
    message: e.message,
  }))
}
