import { model } from "@medusajs/framework/utils"

const LiveProduct = model.define("live_product", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  stream_id: model.text(),
  product_id: model.text(),
  variant_id: model.text().nullable(),
  featured_at: model.dateTime().nullable(),
  flash_price: model.bigNumber().nullable(),
  flash_quantity: model.number().nullable(),
  flash_sold: model.number().default(0),
  currency_code: model.text(),
  display_order: model.number().default(0),
  is_active: model.boolean().default(true),
  metadata: model.json().nullable(),
})

export default LiveProduct
