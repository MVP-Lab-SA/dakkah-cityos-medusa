import { defineLink } from "@medusajs/framework/utils"
import OrderModule from "@medusajs/medusa/order"
import DisputeModule from "../modules/dispute"

export default defineLink(
  OrderModule.linkable.order,
  DisputeModule.linkable.dispute
)
