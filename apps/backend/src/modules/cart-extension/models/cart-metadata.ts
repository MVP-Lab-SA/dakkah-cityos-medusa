// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const CartMetadata = model.define("cart_metadata", {
  id: model.id().primaryKey(),
  cart_id: model.text(),
  tenant_id: model.text(),
  gift_wrap: model.boolean().default(false),
  gift_message: model.text().nullable(),
  delivery_instructions: model.text().nullable(),
  preferred_delivery_date: model.dateTime().nullable(),
  special_handling: model.text().nullable(),
  source_channel: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default CartMetadata
