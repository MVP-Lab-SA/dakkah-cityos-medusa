import { model } from "@medusajs/framework/utils"

const Amenity = model.define("amenity", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  name: model.text(),
  category: model.enum(["room", "property", "dining", "wellness", "business", "entertainment"]),
  description: model.text().nullable(),
  icon: model.text().nullable(),
  is_free: model.boolean().default(true),
  price: model.bigNumber().nullable(),
  currency_code: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default Amenity
