import { defineLink } from "@medusajs/framework/utils"
import CustomerModule from "@medusajs/medusa/customer"
import MembershipModule from "../modules/membership.js"

export default defineLink(
  CustomerModule.linkable.customer,
  MembershipModule.linkable.membership
)
