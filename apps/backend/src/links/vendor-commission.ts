import { defineLink } from "@medusajs/framework/utils"
import VendorModule from "../modules/vendor.js"
import CommissionModule from "../modules/commission.js"

export default defineLink(
  VendorModule.linkable.vendor,
  CommissionModule.linkable.commissionRule
)
