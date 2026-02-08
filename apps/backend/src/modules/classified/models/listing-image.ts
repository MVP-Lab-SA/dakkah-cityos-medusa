import { model } from "@medusajs/framework/utils"

const ListingImage = model.define("listing_image", {
  id: model.id().primaryKey(),
  listing_id: model.text(),
  url: model.text(),
  alt_text: model.text().nullable(),
  display_order: model.number().default(0),
  is_primary: model.boolean().default(false),
  metadata: model.json().nullable(),
})

export default ListingImage
