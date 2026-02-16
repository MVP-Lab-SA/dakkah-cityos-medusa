import { defineLink } from "@medusajs/framework/utils"
import CustomerModule from "@medusajs/medusa/customer"
import InsuranceModule from "../modules/insurance"

export default defineLink(
  CustomerModule.linkable.customer,
  InsuranceModule.linkable.insPolicy
)
