import { defineLink } from "@medusajs/framework/utils"
import CustomerModule from "@medusajs/medusa/customer"
import CharityModule from "../modules/charity"

export default defineLink(
  CustomerModule.linkable.customer,
  CharityModule.linkable.donation
)
