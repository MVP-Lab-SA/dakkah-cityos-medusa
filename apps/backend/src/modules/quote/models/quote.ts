import { model } from "@medusajs/framework/utils";

/**
 * B2B Quote (RFQ - Request for Quote)
 * 
 * Allows companies to request custom pricing before placing orders.
 * Supports negotiation workflow and expiration.
 */
const Quote = model.define("quote", {
  id: model.id().primaryKey(),
  
  // Reference
  quote_number: model.text(), // e.g., "Q-2024-0001"
  
  // Relationships
  company_id: model.text(),
  customer_id: model.text(), // requester
  cart_id: model.text().nullable(), // can convert to cart
  draft_order_id: model.text().nullable(), // or draft order
  
  // Multi-tenancy
  tenant_id: model.text(),
  store_id: model.text().nullable(),
  region_id: model.text().nullable(),
  
  // Status Flow: draft → submitted → under_review → approved/rejected → accepted/declined → expired
  status: model.enum([
    "draft",        // Customer building quote
    "submitted",    // Submitted for review
    "under_review", // Sales team reviewing
    "approved",     // Pricing approved, awaiting customer
    "rejected",     // Rejected by sales team
    "accepted",     // Customer accepted quote
    "declined",     // Customer declined quote
    "expired"       // Validity period passed
  ]).default("draft"),
  
  // Pricing
  subtotal: model.bigNumber().default("0"),
  discount_total: model.bigNumber().default("0"),
  tax_total: model.bigNumber().default("0"),
  shipping_total: model.bigNumber().default("0"),
  total: model.bigNumber().default("0"),
  currency_code: model.text().default("usd"),
  
  // Special Pricing
  custom_discount_percentage: model.number().nullable(),
  custom_discount_amount: model.bigNumber().nullable(),
  discount_reason: model.text().nullable(),
  
  // Validity
  valid_from: model.dateTime().nullable(),
  valid_until: model.dateTime().nullable(),
  
  // Approval
  reviewed_by: model.text().nullable(), // admin user ID
  reviewed_at: model.dateTime().nullable(),
  rejection_reason: model.text().nullable(),
  
  // Customer Response
  accepted_at: model.dateTime().nullable(),
  declined_at: model.dateTime().nullable(),
  declined_reason: model.text().nullable(),
  
  // Notes
  customer_notes: model.text().nullable(),
  internal_notes: model.text().nullable(),
  
  // Metadata
  metadata: model.json().nullable(),
});

export default Quote;
