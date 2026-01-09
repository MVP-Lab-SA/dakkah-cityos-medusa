import { model } from "@medusajs/framework/utils";

const BillingCycle = model.define("billing_cycle", {
  id: model.id().primaryKey(),
  subscription_id: model.text(),
  
  // Cycle period
  period_start: model.dateTime(),
  period_end: model.dateTime(),
  billing_date: model.dateTime(),
  
  // Status
  status: model.enum([
    "upcoming",
    "processing",
    "completed",
    "failed",
    "skipped"
  ]).default("upcoming"),
  
  // Order reference (when created)
  order_id: model.text().nullable(),
  payment_collection_id: model.text().nullable(),
  
  // Amounts
  subtotal: model.bigNumber(),
  tax_total: model.bigNumber().default(0),
  total: model.bigNumber(),
  
  // Attempt tracking
  attempt_count: model.number().default(0),
  last_attempt_at: model.dateTime().nullable(),
  next_attempt_at: model.dateTime().nullable(),
  completed_at: model.dateTime().nullable(),
  failed_at: model.dateTime().nullable(),
  
  // Failure details
  failure_reason: model.text().nullable(),
  failure_code: model.text().nullable(),
  
  // Tenant isolation
  tenant_id: model.text(),
  
  // Metadata
  metadata: model.json().nullable(),
})
  .indexes([
    {
      on: ["subscription_id", "period_start"],
      where: { deleted_at: null }
    },
    {
      on: ["tenant_id", "status"],
      where: { deleted_at: null }
    },
    {
      on: ["billing_date", "status"],
      where: { deleted_at: null, status: "upcoming" }
    },
    {
      on: ["next_attempt_at"],
      where: { deleted_at: null, status: "failed" }
    }
  ]);

export default BillingCycle;
