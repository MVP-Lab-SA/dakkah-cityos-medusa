import { defineLink } from "@medusajs/framework/utils"
import ProductModule from "@medusajs/medusa/product"
import WarrantyModule from "../modules/warranty"

export default defineLink(
  ProductModule.linkable.product,
  WarrantyModule.linkable.warrantyPlan
)
