import { model } from "@medusajs/framework/utils"

const RatePlan = model.define("rate_plan", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  property_id: model.text(),
  room_type_id: model.text(),
  name: model.text(),
  description: model.text().nullable(),
  rate_type: model.enum(["standard", "promotional", "corporate", "package", "seasonal"]),
  price: model.bigNumber(),
  currency_code: model.text(),
  valid_from: model.dateTime(),
  valid_to: model.dateTime(),
  min_stay: model.number().default(1),
  max_stay: model.number().nullable(),
  cancellation_policy: model.enum(["free", "moderate", "strict", "non_refundable"]).default("moderate"),
  includes_breakfast: model.boolean().default(false),
  is_active: model.boolean().default(true),
  metadata: model.json().nullable(),
})

export default RatePlan
