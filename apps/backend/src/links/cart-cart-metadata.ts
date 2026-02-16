import { defineLink } from "@medusajs/framework/utils"
import CartModule from "@medusajs/medusa/cart"
import CartExtensionModule from "../modules/cart-extension"

export default defineLink(
  CartModule.linkable.cart,
  CartExtensionModule.linkable.cartMetadata
)
