import SocialCommerceModuleService from "./service.js"
import { Module } from "@medusajs/framework/utils"

export const SOCIAL_COMMERCE_MODULE = "socialCommerce"

export default Module(SOCIAL_COMMERCE_MODULE, {
  service: SocialCommerceModuleService,
})
