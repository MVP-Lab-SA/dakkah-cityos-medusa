import { defineLink } from "@medusajs/framework/utils"
import CustomerModule from "@medusajs/medusa/customer"
import BookingModule from "../modules/booking"

export default defineLink(
  CustomerModule.linkable.customer,
  BookingModule.linkable.booking
)
