import { model } from "@medusajs/framework/utils"

const CheckIn = model.define("check_in", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  event_id: model.text(),
  ticket_id: model.text(),
  checked_in_by: model.text().nullable(),
  checked_in_at: model.dateTime(),
  check_in_method: model.enum([
    "scan",
    "manual",
    "online",
  ]).default("scan"),
  device_id: model.text().nullable(),
  notes: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default CheckIn
