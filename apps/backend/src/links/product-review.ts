import { defineLink } from "@medusajs/framework/utils"
import ProductModule from "@medusajs/medusa/product"
import ReviewModule from "../modules/review.js"

export default defineLink(
  ProductModule.linkable.product,
  ReviewModule.linkable.review
)
