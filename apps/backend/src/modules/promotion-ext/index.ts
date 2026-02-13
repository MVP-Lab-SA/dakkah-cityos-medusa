import PromotionExtModuleService from "./service.js"
import { Module } from "@medusajs/framework/utils"

export const PROMOTION_EXT_MODULE = "promotionExt"

export default Module(PROMOTION_EXT_MODULE, {
  service: PromotionExtModuleService,
})
