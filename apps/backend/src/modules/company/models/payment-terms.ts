import { model } from "@medusajs/framework/utils"

export const PaymentTerms = model.define("payment_terms", {
  id: model.id().primaryKey(),
  tenant_id: model.text().nullable(),
  
  // Basic Info
  name: model.text(), // e.g., "Net 30", "2/10 Net 30"
  code: model.text().unique(), // e.g., "NET30", "2_10_NET30"
  description: model.text().nullable(),
  
  // Terms Configuration
  terms_type: model.enum([
    "due_on_receipt",
    "net_days",
    "end_of_month",
    "end_of_next_month",
    "custom"
  ]).default("net_days"),
  
  // Payment Due
  net_days: model.number().default(30), // Days until payment due
  
  // Early Payment Discount
  early_payment_discount_percent: model.bigNumber().nullable(), // e.g., 2 for 2%
  early_payment_discount_days: model.number().nullable(), // e.g., 10 for "2/10 Net 30"
  
  // Late Fees
  late_fee_enabled: model.boolean().default(false),
  late_fee_type: model.enum(["percentage", "fixed"]).nullable(),
  late_fee_amount: model.bigNumber().nullable(),
  late_fee_grace_days: model.number().default(0),
  
  // Applicability
  is_default: model.boolean().default(false),
  is_active: model.boolean().default(true),
  min_order_value: model.bigNumber().nullable(), // Minimum order to qualify
  company_tiers: model.json().nullable(), // ["gold", "platinum"]
  
  // Credit Requirements
  requires_credit_check: model.boolean().default(false),
  min_credit_score: model.number().nullable(),
  
  metadata: model.json().nullable(),
})
.indexes([
  { on: ["tenant_id"] },
  { on: ["is_active"] },
  { on: ["is_default"] },
])
