import { model } from "@medusajs/framework/utils"

const AuctionResult = model.define("auction_result", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  auction_id: model.text(),
  winner_customer_id: model.text(),
  winning_bid_id: model.text(),
  final_price: model.bigNumber(),
  currency_code: model.text(),
  order_id: model.text().nullable(),
  payment_status: model.enum(["pending", "paid", "failed", "refunded"]).default("pending"),
  settled_at: model.dateTime().nullable(),
  metadata: model.json().nullable(),
})

export default AuctionResult
