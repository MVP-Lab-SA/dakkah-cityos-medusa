// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const CarrierConfig = model.define("carrier_config", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  carrier_code: model.text(),
  carrier_name: model.text(),
  api_endpoint: model.text().nullable(),
  is_active: model.boolean().default(true),
  supported_countries: model.json().nullable(),
  tracking_url_template: model.text().nullable(),
  max_weight: model.number().nullable(),
  max_dimensions: model.json().nullable(),
  metadata: model.json().nullable(),
})

export default CarrierConfig
