import { defineLink } from "@medusajs/framework/utils"
import ProductModule from "@medusajs/medusa/product"
import ClassifiedModule from "../modules/classified"

export default defineLink(
  ProductModule.linkable.product,
  ClassifiedModule.linkable.classifiedListing
)
