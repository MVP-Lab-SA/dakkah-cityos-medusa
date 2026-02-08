import { model } from "@medusajs/framework/utils"

const Wishlist = model.define("wishlist", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  customer_id: model.text(),
  name: model.text().default("My Wishlist"),
  is_public: model.boolean().default(false),
  is_default: model.boolean().default(false),
  metadata: model.json().nullable(),
})

export default Wishlist
