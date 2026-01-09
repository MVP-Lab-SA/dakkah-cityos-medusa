import { model } from "@medusajs/framework/utils"

const Vendor = model.define("vendor", {
  id: model.id().primaryKey(),
  handle: model.text().unique(),
  
  // Relationships
  tenant_id: model.text(),
  store_id: model.text().nullable(),
  
  // Business Information
  business_name: model.text(),
  legal_name: model.text(),
  business_type: model.enum([
    "sole_proprietor",
    "partnership", 
    "llc",
    "corporation",
    "nonprofit",
    "cooperative"
  ]),
  tax_id: model.text().nullable(),
  
  // Contact
  email: model.text(),
  phone: model.text().nullable(),
  website: model.text().nullable(),
  
  // Address
  address_line1: model.text(),
  address_line2: model.text().nullable(),
  city: model.text(),
  state: model.text().nullable(),
  postal_code: model.text(),
  country_code: model.text(),
  
  // Verification
  verification_status: model.enum([
    "pending",
    "under_review",
    "approved",
    "rejected",
    "suspended"
  ]).default("pending"),
  verification_notes: model.text().nullable(),
  verified_at: model.dateTime().nullable(),
  verified_by: model.text().nullable(),
  
  // KYC Documents
  documents: model.json().nullable(), // Array of {type, url, status, uploaded_at}
  
  // Status
  status: model.enum([
    "onboarding",
    "active",
    "inactive",
    "suspended",
    "terminated"
  ]).default("onboarding"),
  
  // Commission
  commission_type: model.enum([
    "percentage",
    "flat",
    "tiered"
  ]).default("percentage"),
  commission_rate: model.number().nullable(), // Percentage (e.g., 15.5 for 15.5%)
  commission_flat: model.bigInt().nullable(), // Flat amount in cents
  commission_tiers: model.json().nullable(), // For tiered commission
  
  // Payout Settings
  payout_method: model.enum([
    "stripe_connect",
    "bank_transfer",
    "paypal",
    "manual"
  ]).default("stripe_connect"),
  payout_schedule: model.enum([
    "daily",
    "weekly",
    "biweekly",
    "monthly"
  ]).default("weekly"),
  payout_minimum: model.bigInt().default(5000), // Minimum payout in cents
  
  // Stripe Connect
  stripe_account_id: model.text().nullable(),
  stripe_account_status: model.text().nullable(),
  stripe_charges_enabled: model.boolean().default(false),
  stripe_payouts_enabled: model.boolean().default(false),
  
  // Statistics
  total_sales: model.bigInt().default(0),
  total_orders: model.number().default(0),
  total_products: model.number().default(0),
  total_commission_paid: model.bigInt().default(0),
  
  // Settings
  auto_approve_products: model.boolean().default(false),
  allow_returns: model.boolean().default(true),
  return_window_days: model.number().default(30),
  
  // Branding
  logo_url: model.text().nullable(),
  banner_url: model.text().nullable(),
  description: model.text().nullable(),
  
  // Contact Person
  contact_person_name: model.text().nullable(),
  contact_person_email: model.text().nullable(),
  contact_person_phone: model.text().nullable(),
  
  // Metadata
  metadata: model.json().nullable(),
  
  // Timestamps
  onboarded_at: model.dateTime().nullable(),
  suspended_at: model.dateTime().nullable(),
  terminated_at: model.dateTime().nullable(),
})

export default Vendor
