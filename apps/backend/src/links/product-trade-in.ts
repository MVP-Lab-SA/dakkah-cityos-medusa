import { defineLink } from "@medusajs/framework/utils"
import ProductModule from "@medusajs/medusa/product"
import TradeInModule from "../modules/trade-in"

export default defineLink(
  ProductModule.linkable.product,
  TradeInModule.linkable.tradeInRequest
)
