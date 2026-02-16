import { Module } from "@medusajs/framework/utils"
import TradeInModuleService from "./service"

export const TRADE_IN_MODULE = "tradeIn"

export default Module(TRADE_IN_MODULE, {
  service: TradeInModuleService,
})
