import { model } from "@medusajs/framework/utils"

const Bid = model.define("bid", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  auction_id: model.text(),
  customer_id: model.text(),
  amount: model.bigNumber(),
  is_auto_bid: model.boolean().default(false),
  max_auto_bid: model.bigNumber().nullable(),
  status: model.enum(["active", "outbid", "winning", "won", "cancelled"]).default("active"),
  placed_at: model.dateTime(),
  metadata: model.json().nullable(),
})

export default Bid
