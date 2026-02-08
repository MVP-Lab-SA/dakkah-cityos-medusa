import { model } from "@medusajs/framework/utils"

const RepairOrder = model.define("repair_order", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  claim_id: model.text(),
  service_center_id: model.text().nullable(),
  status: model.enum([
    "created",
    "received",
    "diagnosing",
    "repairing",
    "testing",
    "ready",
    "shipped",
    "completed",
  ]).default("created"),
  diagnosis: model.text().nullable(),
  repair_notes: model.text().nullable(),
  parts_used: model.json().nullable(),
  estimated_cost: model.bigNumber().nullable(),
  actual_cost: model.bigNumber().nullable(),
  currency_code: model.text(),
  estimated_completion: model.dateTime().nullable(),
  completed_at: model.dateTime().nullable(),
  tracking_number: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default RepairOrder
