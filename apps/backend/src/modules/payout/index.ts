import PayoutModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const PAYOUT_MODULE = "payout"

export default Module(PAYOUT_MODULE, {
  service: PayoutModuleService,
})
