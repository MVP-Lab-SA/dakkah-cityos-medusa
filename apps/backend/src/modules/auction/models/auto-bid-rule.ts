import { model } from "@medusajs/framework/utils"

const AutoBidRule = model.define("auto_bid_rule", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  auction_id: model.text(),
  customer_id: model.text(),
  max_amount: model.bigNumber(),
  increment_amount: model.bigNumber().nullable(),
  is_active: model.boolean().default(true),
  total_bids_placed: model.number().default(0),
  metadata: model.json().nullable(),
})

export default AutoBidRule
