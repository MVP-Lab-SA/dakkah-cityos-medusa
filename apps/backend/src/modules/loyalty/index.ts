import { Module } from "@medusajs/framework/utils"
import LoyaltyModuleService from "./service.js"

export const LOYALTY_MODULE = "loyalty"

export default Module(LOYALTY_MODULE, {
  service: LoyaltyModuleService,
})
