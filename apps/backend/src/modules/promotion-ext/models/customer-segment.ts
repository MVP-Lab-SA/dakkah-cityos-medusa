import { model } from "@medusajs/framework/utils"

const CustomerSegment = model.define("customer_segment", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  name: model.text(),
  description: model.text().nullable(),
  segment_type: model.enum(["manual", "dynamic"]),
  rules: model.json().nullable(),
  customer_count: model.number().default(0),
  is_active: model.boolean().default(true),
  metadata: model.json().nullable(),
})

export default CustomerSegment
