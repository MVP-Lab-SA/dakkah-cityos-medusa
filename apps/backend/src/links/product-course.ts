import { defineLink } from "@medusajs/framework/utils"
import ProductModule from "@medusajs/medusa/product"
import EducationModule from "../modules/education"

export default defineLink(
  ProductModule.linkable.product,
  EducationModule.linkable.course
)
