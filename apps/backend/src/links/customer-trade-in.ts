import { defineLink } from "@medusajs/framework/utils"
import CustomerModule from "@medusajs/medusa/customer"
import TradeInModule from "../modules/trade-in"

export default defineLink(
  CustomerModule.linkable.customer,
  TradeInModule.linkable.tradeInRequest
)
