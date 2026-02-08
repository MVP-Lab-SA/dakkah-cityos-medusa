import { model } from "@medusajs/framework/utils"

const ListingOffer = model.define("listing_offer", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  listing_id: model.text(),
  buyer_id: model.text(),
  amount: model.bigNumber(),
  currency_code: model.text(),
  message: model.text().nullable(),
  status: model.enum([
    "pending",
    "accepted",
    "rejected",
    "withdrawn",
    "expired",
  ]).default("pending"),
  counter_amount: model.bigNumber().nullable(),
  responded_at: model.dateTime().nullable(),
  expires_at: model.dateTime().nullable(),
  metadata: model.json().nullable(),
})

export default ListingOffer
