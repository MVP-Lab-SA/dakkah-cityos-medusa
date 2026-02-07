import { model } from "@medusajs/framework/utils"

export const SubscriptionEvent = model.define("subscription_event", {
  id: model.id().primaryKey(),
  subscription_id: model.text(),
  tenant_id: model.text().nullable(),
  
  // Event Type
  event_type: model.enum([
    "created",
    "activated",
    "trial_started",
    "trial_ended",
    "paused",
    "resumed",
    "canceled",
    "expired",
    "renewed",
    "upgraded",
    "downgraded",
    "payment_succeeded",
    "payment_failed",
    "payment_refunded",
    "items_added",
    "items_removed",
    "items_updated"
  ]),
  
  // Event Data
  event_data: model.json().nullable(),
  /*
  Example for upgrade:
  {
    from_plan: "basic",
    to_plan: "pro",
    proration_amount: 1500
  }
  */
  
  // Context
  triggered_by: model.enum([
    "customer",
    "admin",
    "system",
    "webhook"
  ]).default("system"),
  triggered_by_id: model.text().nullable(), // User ID
  
  // Timestamp
  occurred_at: model.dateTime(),
  
  // Related Entities
  billing_cycle_id: model.text().nullable(),
  order_id: model.text().nullable(),
  
  metadata: model.json().nullable(),
})
.indexes([
  { on: ["subscription_id"] },
  { on: ["tenant_id"] },
  { on: ["event_type"] },
  { on: ["occurred_at"] },
])

export const SubscriptionPause = model.define("subscription_pause", {
  id: model.id().primaryKey(),
  subscription_id: model.text(),
  
  // Pause Details
  paused_at: model.dateTime(),
  resume_at: model.dateTime().nullable(), // Scheduled resume
  resumed_at: model.dateTime().nullable(), // Actual resume
  
  // Reason
  reason: model.text().nullable(),
  pause_type: model.enum([
    "customer_request",
    "payment_issue",
    "admin_action",
    "scheduled"
  ]).default("customer_request"),
  
  // Impact
  extends_billing_period: model.boolean().default(true),
  days_paused: model.number().default(0),
  
  metadata: model.json().nullable(),
})
.indexes([
  { on: ["subscription_id"] },
  { on: ["paused_at"] },
])
