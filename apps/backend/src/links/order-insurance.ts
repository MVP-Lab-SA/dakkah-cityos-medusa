import { defineLink } from "@medusajs/framework/utils"
import OrderModule from "@medusajs/order"
import InsuranceModule from "../modules/insurance"

export default defineLink(
  OrderModule.linkable.order,
  InsuranceModule.linkable.insPolicy
)
