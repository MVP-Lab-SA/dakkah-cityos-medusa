import { model } from "@medusajs/framework/utils"

const SparePart = model.define("spare_part", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  name: model.text(),
  sku: model.text().unique(),
  description: model.text().nullable(),
  compatible_products: model.json().nullable(),
  price: model.bigNumber(),
  currency_code: model.text(),
  stock_quantity: model.number().default(0),
  reorder_level: model.number().default(5),
  supplier: model.text().nullable(),
  is_active: model.boolean().default(true),
  metadata: model.json().nullable(),
})

export default SparePart
