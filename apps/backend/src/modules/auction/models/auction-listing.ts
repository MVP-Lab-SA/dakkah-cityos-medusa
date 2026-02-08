import { model } from "@medusajs/framework/utils"

const AuctionListing = model.define("auction_listing", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  product_id: model.text(),
  title: model.text(),
  description: model.text().nullable(),
  auction_type: model.enum(["english", "dutch", "sealed", "reserve"]),
  status: model.enum(["draft", "scheduled", "active", "ended", "cancelled"]).default("draft"),
  starting_price: model.bigNumber(),
  reserve_price: model.bigNumber().nullable(),
  buy_now_price: model.bigNumber().nullable(),
  current_price: model.bigNumber().nullable(),
  currency_code: model.text(),
  bid_increment: model.bigNumber(),
  starts_at: model.dateTime(),
  ends_at: model.dateTime(),
  auto_extend: model.boolean().default(true),
  extend_minutes: model.number().default(5),
  winner_customer_id: model.text().nullable(),
  winning_bid_id: model.text().nullable(),
  total_bids: model.number().default(0),
  metadata: model.json().nullable(),
})

export default AuctionListing
