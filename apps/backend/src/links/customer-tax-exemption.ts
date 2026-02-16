import { defineLink } from "@medusajs/framework/utils"
import CustomerModule from "@medusajs/medusa/customer"
import TaxConfigModule from "../modules/tax-config"

export default defineLink(
  CustomerModule.linkable.customer,
  TaxConfigModule.linkable.taxConfigExemption
)
