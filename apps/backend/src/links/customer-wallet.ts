import { defineLink } from "@medusajs/framework/utils"
import CustomerModule from "@medusajs/medusa/customer"
import WalletModule from "../modules/wallet"

export default defineLink(
  CustomerModule.linkable.customer,
  WalletModule.linkable.wallet
)
