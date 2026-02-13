import { defineLink } from "@medusajs/framework/utils"
import VendorModule from "../modules/vendor.js"
import PayoutModule from "../modules/payout.js"

export default defineLink(
  VendorModule.linkable.vendor,
  PayoutModule.linkable.payout
)
