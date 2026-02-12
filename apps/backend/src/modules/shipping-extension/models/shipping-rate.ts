// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const ShippingRate = model.define("shipping_rate", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  carrier_id: model.text(),
  carrier_name: model.text(),
  service_type: model.text(),
  origin_zone: model.text().nullable(),
  destination_zone: model.text().nullable(),
  base_rate: model.bigNumber(),
  per_kg_rate: model.bigNumber().default(0),
  min_weight: model.number().default(0),
  max_weight: model.number().default(999999),
  estimated_days_min: model.number(),
  estimated_days_max: model.number(),
  is_active: model.boolean().default(true),
  metadata: model.json().nullable(),
})

export default ShippingRate
