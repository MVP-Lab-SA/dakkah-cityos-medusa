// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const WishlistItem = model.define("wishlist_item", {
  id: model.id().primaryKey(),
  wishlist_id: model.text(),
  product_id: model.text(),
  variant_id: model.text().nullable(),
  added_at: model.dateTime(),
  priority: model.enum(["low", "medium", "high"]).default("medium"),
  notes: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default WishlistItem
