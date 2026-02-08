import { model } from "@medusajs/framework/utils"

const VehicleService = model.define("vehicle_service", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  vehicle_listing_id: model.text().nullable(),
  customer_id: model.text(),
  service_type: model.enum(["maintenance", "repair", "inspection", "detailing", "tire", "oil_change", "other"]),
  status: model.enum(["scheduled", "in_progress", "completed", "cancelled"]).default("scheduled"),
  description: model.text().nullable(),
  scheduled_at: model.dateTime(),
  completed_at: model.dateTime().nullable(),
  estimated_cost: model.bigNumber().nullable(),
  actual_cost: model.bigNumber().nullable(),
  currency_code: model.text(),
  service_center: model.text().nullable(),
  technician: model.text().nullable(),
  parts_used: model.json().nullable(),
  notes: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default VehicleService
