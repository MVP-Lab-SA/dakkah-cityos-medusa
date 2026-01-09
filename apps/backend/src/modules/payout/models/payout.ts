import { model } from "@medusajs/framework/utils"

const Payout = model.define("payout", {
  id: model.id().primaryKey(),
  
  // Relationships
  tenant_id: model.text(),
  store_id: model.text().nullable(),
  vendor_id: model.text(),
  
  // Payout Details
  payout_number: model.text().unique(), // e.g., PO-2024-001
  
  // Amounts (in cents)
  gross_amount: model.bigNumber(), // Total sales
  commission_amount: model.bigNumber(), // Platform commission
  platform_fee_amount: model.bigNumber().default(0), // Additional platform fees
  adjustment_amount: model.bigNumber().default(0), // Manual adjustments
  net_amount: model.bigNumber(), // Amount to be paid to vendor
  
  // Period
  period_start: model.dateTime(),
  period_end: model.dateTime(),
  
  // Transaction count
  transaction_count: model.number().default(0),
  
  // Status
  status: model.enum([
    "pending",
    "processing",
    "completed",
    "failed",
    "cancelled",
    "on_hold"
  ]).default("pending"),
  
  // Payment Method
  payment_method: model.enum([
    "stripe_connect",
    "bank_transfer",
    "paypal",
    "manual",
    "check"
  ]),
  
  // Stripe Connect Details
  stripe_transfer_id: model.text().nullable(),
  stripe_payout_id: model.text().nullable(),
  stripe_failure_code: model.text().nullable(),
  stripe_failure_message: model.text().nullable(),
  
  // Bank Transfer Details
  bank_reference_number: model.text().nullable(),
  
  // Processing
  processing_started_at: model.dateTime().nullable(),
  processing_completed_at: model.dateTime().nullable(),
  processing_failed_at: model.dateTime().nullable(),
  
  // Retry
  retry_count: model.number().default(0),
  last_retry_at: model.dateTime().nullable(),
  
  // Notes
  notes: model.text().nullable(),
  failure_reason: model.text().nullable(),
  
  // Approval (for manual review)
  requires_approval: model.boolean().default(false),
  approved_by: model.text().nullable(),
  approved_at: model.dateTime().nullable(),
  
  // Metadata
  metadata: model.json().nullable(),
  
  // Scheduled
  scheduled_for: model.dateTime().nullable(),
})

export default Payout
