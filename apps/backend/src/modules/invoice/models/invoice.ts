import { model } from "@medusajs/framework/utils"

export const Invoice = model.define("invoice", {
  id: model.id().primaryKey(),
  invoice_number: model.text().unique(),
  company_id: model.text(),
  customer_id: model.text().nullable(),
  
  // Invoice details
  status: model.enum(["draft", "sent", "paid", "overdue", "cancelled", "void"]).default("draft"),
  issue_date: model.dateTime(),
  due_date: model.dateTime(),
  paid_at: model.dateTime().nullable(),
  
  // Amounts
  subtotal: model.bigNumber(),
  tax_total: model.bigNumber().default(0),
  discount_total: model.bigNumber().default(0),
  total: model.bigNumber(),
  amount_paid: model.bigNumber().default(0),
  amount_due: model.bigNumber(),
  currency_code: model.text().default("usd"),
  
  // Period
  period_start: model.dateTime().nullable(),
  period_end: model.dateTime().nullable(),
  
  // Payment terms
  payment_terms: model.text().nullable(),
  payment_terms_days: model.number().default(30),
  
  // Notes
  notes: model.text().nullable(),
  internal_notes: model.text().nullable(),
  
  // PDF/file
  pdf_url: model.text().nullable(),
  
  // Items relationship
  items: model.hasMany(() => InvoiceItem, { mappedBy: "invoice" }),
  
  // Metadata
  metadata: model.json().nullable(),
})

// Import after definition to avoid circular dependency
import { InvoiceItem } from "./invoice-item.js"
