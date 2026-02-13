import { defineLink } from "@medusajs/framework/utils"
import CustomerModule from "@medusajs/medusa/customer"
import WishlistModule from "../modules/wishlist"

export default defineLink(
  CustomerModule.linkable.customer,
  WishlistModule.linkable.wishlist
)
