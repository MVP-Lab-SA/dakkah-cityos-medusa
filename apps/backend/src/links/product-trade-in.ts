import { defineLink } from "@medusajs/framework/utils"
import ProductModule from "@medusajs/product"
import TradeInModule from "../modules/trade-in"

export default defineLink(
  ProductModule.linkable.product,
  TradeInModule.linkable.tradeInRequest
)
