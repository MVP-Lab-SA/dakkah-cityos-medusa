// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const Dispute = model.define("dispute", {
  id: model.id().primaryKey(),
  order_id: model.text(),
  customer_id: model.text(),
  vendor_id: model.text().nullable(),
  tenant_id: model.text(),
  type: model.text(),
  status: model.text().default("open"),
  priority: model.text().default("medium"),
  resolution: model.text().nullable(),
  resolution_amount: model.bigNumber().nullable(),
  resolved_by: model.text().nullable(),
  resolved_at: model.dateTime().nullable(),
  escalated_at: model.dateTime().nullable(),
  metadata: model.json().nullable(),
})

export default Dispute
