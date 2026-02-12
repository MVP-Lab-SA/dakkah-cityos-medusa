// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const ReservationHold = model.define("reservation_hold", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  variant_id: model.text(),
  quantity: model.number(),
  reason: model.text(),
  reference_id: model.text().nullable(),
  expires_at: model.dateTime().nullable(),
  status: model.text().default("active"),
  metadata: model.json().nullable(),
})

export default ReservationHold
