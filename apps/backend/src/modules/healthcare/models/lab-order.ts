import { model } from "@medusajs/framework/utils"

const LabOrder = model.define("lab_order", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  practitioner_id: model.text().nullable(),
  patient_id: model.text(),
  order_number: model.text().unique(),
  tests: model.json(),
  status: model.enum(["ordered", "sample_collected", "processing", "results_ready", "reviewed", "cancelled"]).default("ordered"),
  priority: model.enum(["routine", "urgent", "stat"]).default("routine"),
  fasting_required: model.boolean().default(false),
  sample_type: model.text().nullable(),
  collected_at: model.dateTime().nullable(),
  results: model.json().nullable(),
  results_reviewed_by: model.text().nullable(),
  results_reviewed_at: model.dateTime().nullable(),
  lab_name: model.text().nullable(),
  notes: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default LabOrder
