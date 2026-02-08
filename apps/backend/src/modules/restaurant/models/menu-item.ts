import { model } from "@medusajs/framework/utils"

const MenuItem = model.define("menu_item", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  menu_id: model.text(),
  product_id: model.text().nullable(),
  name: model.text(),
  description: model.text().nullable(),
  price: model.bigNumber(),
  currency_code: model.text(),
  category: model.text().nullable(),
  image_url: model.text().nullable(),
  is_available: model.boolean().default(true),
  is_featured: model.boolean().default(false),
  calories: model.number().nullable(),
  allergens: model.json().nullable(),
  dietary_tags: model.json().nullable(),
  prep_time_minutes: model.number().nullable(),
  display_order: model.number().default(0),
  metadata: model.json().nullable(),
})

export default MenuItem
