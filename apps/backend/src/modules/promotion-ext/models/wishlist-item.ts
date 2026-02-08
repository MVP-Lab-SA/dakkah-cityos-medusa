import { model } from "@medusajs/framework/utils"

const WishlistItem = model.define("wishlist_item", {
  id: model.id().primaryKey(),
  wishlist_id: model.text(),
  product_id: model.text(),
  variant_id: model.text().nullable(),
  added_price: model.bigNumber().nullable(),
  notes: model.text().nullable(),
  priority: model.number().default(0),
  metadata: model.json().nullable(),
})

export default WishlistItem
