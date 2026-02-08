import { model } from "@medusajs/framework/utils"

const ListingCategory = model.define("listing_category", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  name: model.text(),
  handle: model.text().unique(),
  parent_id: model.text().nullable(),
  description: model.text().nullable(),
  icon: model.text().nullable(),
  display_order: model.number().default(0),
  is_active: model.boolean().default(true),
  metadata: model.json().nullable(),
})

export default ListingCategory
