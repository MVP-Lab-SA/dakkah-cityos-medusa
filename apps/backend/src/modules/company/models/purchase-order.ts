import { model } from "@medusajs/framework/utils"

export const PurchaseOrder = model.define("purchase_order", {
  id: model.id().primaryKey(),
  po_number: model.text().unique(),
  company_id: model.text(),
  customer_id: model.text(),
  tenant_id: model.text().nullable(),
  
  // Order Reference
  order_id: model.text().nullable(),
  cart_id: model.text().nullable(),
  quote_id: model.text().nullable(),
  
  // PO Details
  external_po_number: model.text().nullable(), // Customer's PO number
  department: model.text().nullable(),
  cost_center: model.text().nullable(),
  project_code: model.text().nullable(),
  
  // Status
  status: model.enum([
    "draft",
    "pending_approval",
    "approved",
    "rejected",
    "submitted",
    "acknowledged",
    "processing",
    "partially_fulfilled",
    "fulfilled",
    "cancelled",
    "closed"
  ]).default("draft"),
  
  // Approval Workflow
  requires_approval: model.boolean().default(true),
  approval_threshold: model.bigNumber().nullable(),
  approved_by_id: model.text().nullable(),
  approved_at: model.dateTime().nullable(),
  approval_notes: model.text().nullable(),
  rejected_by_id: model.text().nullable(),
  rejected_at: model.dateTime().nullable(),
  rejection_reason: model.text().nullable(),
  
  // Pricing
  currency_code: model.text().default("usd"),
  subtotal: model.bigNumber().default(0),
  discount_total: model.bigNumber().default(0),
  tax_total: model.bigNumber().default(0),
  shipping_total: model.bigNumber().default(0),
  total: model.bigNumber().default(0),
  
  // Payment Terms
  payment_terms_id: model.text().nullable(),
  payment_due_date: model.dateTime().nullable(),
  payment_status: model.enum([
    "not_due",
    "due",
    "overdue",
    "partially_paid",
    "paid"
  ]).default("not_due"),
  
  // Dates
  issue_date: model.dateTime().nullable(),
  expected_delivery_date: model.dateTime().nullable(),
  actual_delivery_date: model.dateTime().nullable(),
  
  // Shipping
  shipping_address: model.json().nullable(),
  billing_address: model.json().nullable(),
  shipping_method_id: model.text().nullable(),
  
  // Notes
  internal_notes: model.text().nullable(),
  vendor_notes: model.text().nullable(),
  
  metadata: model.json().nullable(),
})
.indexes([
  { on: ["company_id"] },
  { on: ["customer_id"] },
  { on: ["tenant_id", "status"] },
  { on: ["status", "payment_status"] },
  { on: ["payment_due_date"] },
])
