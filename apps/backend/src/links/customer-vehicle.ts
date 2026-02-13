import { defineLink } from "@medusajs/framework/utils"
import CustomerModule from "@medusajs/medusa/customer"
import AutomotiveModule from "../modules/automotive"

export default defineLink(
  CustomerModule.linkable.customer,
  AutomotiveModule.linkable.vehicleListing
)
