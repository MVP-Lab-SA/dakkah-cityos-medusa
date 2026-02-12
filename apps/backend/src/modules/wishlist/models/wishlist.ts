// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const Wishlist = model.define("wishlist", {
  id: model.id().primaryKey(),
  customer_id: model.text(),
  tenant_id: model.text(),
  title: model.text().default("My Wishlist"),
  is_default: model.boolean().default(false),
  visibility: model.enum(["private", "shared", "public"]).default("private"),
  share_token: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default Wishlist
