// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const WarehouseTransfer = model.define("warehouse_transfer", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  source_location_id: model.text(),
  destination_location_id: model.text(),
  transfer_number: model.text(),
  status: model.text().default("draft"),
  items: model.json().default([]),
  notes: model.text().nullable(),
  initiated_by: model.text().nullable(),
  shipped_at: model.dateTime().nullable(),
  received_at: model.dateTime().nullable(),
  metadata: model.json().nullable(),
})

export default WarehouseTransfer
