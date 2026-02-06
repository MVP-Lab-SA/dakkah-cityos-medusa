import { model } from "@medusajs/framework/utils";

const Subscription = model.define("subscription", {
  id: model.id().primaryKey(),
  customer_id: model.text(),
  status: model.enum([
    "draft",
    "active",
    "paused",
    "past_due",
    "canceled",
    "expired"
  ]).default("draft"),
  
  // Subscription details
  start_date: model.dateTime().nullable(),
  end_date: model.dateTime().nullable(),
  current_period_start: model.dateTime().nullable(),
  current_period_end: model.dateTime().nullable(),
  trial_start: model.dateTime().nullable(),
  trial_end: model.dateTime().nullable(),
  canceled_at: model.dateTime().nullable(),
  
  // Billing configuration
  billing_interval: model.enum(["daily", "weekly", "monthly", "quarterly", "yearly"]),
  billing_interval_count: model.number().default(1),
  billing_anchor_day: model.number().nullable(), // Day of month (1-31) or week (0-6)
  
  // Payment
  payment_collection_method: model.enum(["charge_automatically", "send_invoice"]).default("charge_automatically"),
  payment_provider_id: model.text().nullable(),
  payment_method_id: model.text().nullable(),
  
  // Pricing
  currency_code: model.text(),
  subtotal: model.bigNumber(),
  tax_total: model.bigNumber().default(0),
  total: model.bigNumber(),
  
  // Retry configuration
  max_retry_attempts: model.number().default(3),
  retry_count: model.number().default(0),
  last_retry_at: model.dateTime().nullable(),
  next_retry_at: model.dateTime().nullable(),
  
  // Tenant isolation
  tenant_id: model.text(),
  store_id: model.text().nullable(),
  
  // Metadata
  metadata: model.json().nullable(),
})
  // Cascades managed by database relations
  .indexes([
    {
      on: ["customer_id"],
      where: { deleted_at: null }
    },
    {
      on: ["tenant_id", "status"],
      where: { deleted_at: null }
    },
    {
      on: ["status", "next_retry_at"],
      where: { deleted_at: null, status: "past_due" }
    },
    {
      on: ["current_period_end"],
      where: { deleted_at: null, status: "active" }
    }
  ]);

export default Subscription;
