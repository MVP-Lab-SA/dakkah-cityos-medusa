import { model } from "@medusajs/framework/utils"

const ProductBundle = model.define("product_bundle", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  title: model.text(),
  handle: model.text().unique(),
  description: model.text().nullable(),
  bundle_type: model.enum(["fixed", "mix_and_match", "bogo"]),
  discount_type: model.enum(["percentage", "flat", "special_price"]),
  discount_value: model.number(),
  min_items: model.number().default(1),
  max_items: model.number().nullable(),
  is_active: model.boolean().default(true),
  starts_at: model.dateTime().nullable(),
  ends_at: model.dateTime().nullable(),
  metadata: model.json().nullable(),
})

export default ProductBundle
