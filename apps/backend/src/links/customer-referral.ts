import { defineLink } from "@medusajs/framework/utils"
import CustomerModule from "@medusajs/medusa/customer"
import PromotionExtModule from "../modules/promotion-ext"

export default defineLink(
  CustomerModule.linkable.customer,
  PromotionExtModule.linkable.referral
)
