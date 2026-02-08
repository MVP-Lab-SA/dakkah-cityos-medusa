import { defineLink } from "@medusajs/framework/utils"
import VendorModule from "../modules/vendor"
import CommissionModule from "../modules/commission"

export default defineLink(
  VendorModule.linkable.vendor,
  CommissionModule.linkable.commissionRule
)
