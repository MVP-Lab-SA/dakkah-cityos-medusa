import { defineLink } from "@medusajs/framework/utils"
import ProductModule from "@medusajs/medusa/product"
import PromotionExtModule from "../modules/promotion-ext"

export default defineLink(
  ProductModule.linkable.product,
  PromotionExtModule.linkable.productBundle
)
