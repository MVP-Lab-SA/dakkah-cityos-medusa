import { defineLink } from "@medusajs/framework/utils"
import CustomerModule from "@medusajs/medusa/customer"
import CompanyModule from "../modules/company.js"

export default defineLink(
  CustomerModule.linkable.customer,
  CompanyModule.linkable.company
)
