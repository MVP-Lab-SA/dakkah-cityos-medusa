import { model } from "@medusajs/framework/utils"

const AuctionEscrow = model.define("auction_escrow", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  auction_id: model.text(),
  customer_id: model.text(),
  amount: model.bigNumber(),
  currency_code: model.text(),
  status: model.enum(["held", "released", "refunded"]).default("held"),
  payment_reference: model.text().nullable(),
  held_at: model.dateTime(),
  released_at: model.dateTime().nullable(),
  metadata: model.json().nullable(),
})

export default AuctionEscrow
