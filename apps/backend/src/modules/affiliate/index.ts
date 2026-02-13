import AffiliateModuleService from "./service.js"
import { Module } from "@medusajs/framework/utils"

export const AFFILIATE_MODULE = "affiliate"

export default Module(AFFILIATE_MODULE, {
  service: AffiliateModuleService,
})
