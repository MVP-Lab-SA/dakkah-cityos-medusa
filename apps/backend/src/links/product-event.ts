import { defineLink } from "@medusajs/framework/utils"
import ProductModule from "@medusajs/medusa/product"
import EventTicketingModule from "../modules/event-ticketing"

export default defineLink(
  ProductModule.linkable.product,
  EventTicketingModule.linkable.event
)
