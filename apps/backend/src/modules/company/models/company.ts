import { model } from "@medusajs/framework/utils";

/**
 * B2B Company Account
 * 
 * Represents a business entity that can make bulk purchases.
 * Supports multi-user access, credit limits, and approval workflows.
 */
const Company = model.define("company", {
  id: model.id().primaryKey(),
  
  // Basic Info
  handle: model.text().unique(),
  name: model.text(),
  legal_name: model.text().nullable(),
  tax_id: model.text().nullable(),
  email: model.text(),
  phone: model.text().nullable(),
  
  // Business Details
  industry: model.text().nullable(),
  employee_count: model.number().nullable(),
  annual_revenue: model.bigNumber().nullable(),
  
  // Financial
  credit_limit: model.bigNumber().default("0"), // in base currency units
  credit_used: model.bigNumber().default("0"),
  payment_terms_days: model.number().default(30), // Net 30, Net 60, etc
  
  // Status & Type
  status: model.enum(["pending", "active", "suspended", "inactive"]).default("pending"),
  tier: model.enum(["bronze", "silver", "gold", "platinum"]).default("bronze"),
  
  // Approval
  approved_at: model.dateTime().nullable(),
  approved_by: model.text().nullable(), // admin user ID
  rejection_reason: model.text().nullable(),
  
  // Settings
  requires_approval: model.boolean().default(true), // orders need approval
  auto_approve_limit: model.bigNumber().nullable(), // auto-approve orders below this
  
  // Multi-tenancy
  tenant_id: model.text(),
  store_id: model.text().nullable(),
  
  // Addresses (JSON)
  billing_address: model.json().nullable(),
  shipping_addresses: model.json().nullable(), // array of addresses
  
  // Metadata
  metadata: model.json().nullable(),
});

export default Company;
