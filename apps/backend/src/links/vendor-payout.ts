import { defineLink } from "@medusajs/framework/utils"
import VendorModule from "../modules/vendor"
import PayoutModule from "../modules/payout"

export default defineLink(
  VendorModule.linkable.vendor,
  PayoutModule.linkable.payout
)
