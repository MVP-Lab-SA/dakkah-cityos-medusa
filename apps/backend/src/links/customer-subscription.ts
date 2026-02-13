import { defineLink } from "@medusajs/framework/utils"
import CustomerModule from "@medusajs/medusa/customer"
import SubscriptionModule from "../modules/subscription.js"

export default defineLink(
  CustomerModule.linkable.customer,
  SubscriptionModule.linkable.subscription
)
