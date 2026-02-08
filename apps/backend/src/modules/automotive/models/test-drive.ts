import { model } from "@medusajs/framework/utils"

const TestDrive = model.define("test_drive", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  listing_id: model.text(),
  customer_id: model.text(),
  dealer_id: model.text().nullable(),
  scheduled_at: model.dateTime(),
  duration_minutes: model.number().default(30),
  status: model.enum(["requested", "confirmed", "completed", "cancelled", "no_show"]).default("requested"),
  location: model.text().nullable(),
  license_verified: model.boolean().default(false),
  feedback: model.text().nullable(),
  interest_level: model.enum(["not_interested", "considering", "ready_to_buy"]).nullable(),
  confirmed_at: model.dateTime().nullable(),
  completed_at: model.dateTime().nullable(),
  metadata: model.json().nullable(),
})

export default TestDrive
