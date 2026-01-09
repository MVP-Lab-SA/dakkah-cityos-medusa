import { model } from "@medusajs/framework/utils"

const CommissionTransaction = model.define("commission_transaction", {
  id: model.id().primaryKey(),
  
  // Relationships
  tenant_id: model.text(),
  store_id: model.text().nullable(),
  vendor_id: model.text(),
  order_id: model.text(),
  line_item_id: model.text().nullable(),
  commission_rule_id: model.text().nullable(),
  payout_id: model.text().nullable(), // Reference to payout when paid
  
  // Transaction Details
  transaction_type: model.enum([
    "sale",
    "refund",
    "adjustment",
    "reversal"
  ]).default("sale"),
  
  // Amounts (all in cents)
  order_subtotal: model.bigInt(), // Item subtotal
  order_tax: model.bigInt().default(0),
  order_shipping: model.bigInt().default(0),
  order_total: model.bigInt(), // Total for this line item
  
  // Commission Calculation
  commission_rate: model.number(), // Percentage used
  commission_flat: model.bigInt().nullable(), // Flat amount if applicable
  commission_amount: model.bigInt(), // Final commission amount
  
  // Platform Fee (if applicable)
  platform_fee_rate: model.number().nullable(),
  platform_fee_amount: model.bigInt().nullable(),
  
  // Net Amount (what vendor receives)
  net_amount: model.bigInt(), // order_total - commission_amount - platform_fee_amount
  
  // Status
  status: model.enum([
    "pending",
    "approved",
    "paid",
    "reversed",
    "disputed"
  ]).default("pending"),
  
  // Payout tracking
  payout_status: model.enum([
    "unpaid",
    "pending_payout",
    "paid",
    "failed"
  ]).default("unpaid"),
  
  // Dates
  transaction_date: model.dateTime(),
  approved_at: model.dateTime().nullable(),
  paid_at: model.dateTime().nullable(),
  
  // Notes
  notes: model.text().nullable(),
  
  // Metadata
  metadata: model.json().nullable(),
})

export default CommissionTransaction
