// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const Dispute = model.define("dispute", {
  id: model.id().primaryKey(),
  order_id: model.text(),
  customer_id: model.text(),
  vendor_id: model.text().nullable(),
  tenant_id: model.text(),
  type: model.enum([
    "product_quality",
    "not_received",
    "wrong_item",
    "damaged",
    "unauthorized_charge",
    "service_issue",
    "other",
  ]),
  status: model.enum([
    "open",
    "under_review",
    "awaiting_customer",
    "awaiting_vendor",
    "escalated",
    "resolved",
    "closed",
  ]).default("open"),
  priority: model.enum(["low", "medium", "high", "urgent"]).default("medium"),
  resolution: model.enum([
    "refund_full",
    "refund_partial",
    "replacement",
    "store_credit",
    "rejected",
    "withdrawn",
  ]).nullable(),
  resolution_amount: model.bigNumber().nullable(),
  resolved_by: model.text().nullable(),
  resolved_at: model.dateTime().nullable(),
  escalated_at: model.dateTime().nullable(),
  metadata: model.json().nullable(),
})

export default Dispute
