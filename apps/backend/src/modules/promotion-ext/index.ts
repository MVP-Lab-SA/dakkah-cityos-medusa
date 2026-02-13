import PromotionExtModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const PROMOTION_EXT_MODULE = "promotionExt"

export default Module(PROMOTION_EXT_MODULE, {
  service: PromotionExtModuleService,
})
