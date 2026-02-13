import { defineLink } from "@medusajs/framework/utils"
import VendorModule from "../modules/vendor"
import FreelanceModule from "../modules/freelance"

export default defineLink(
  VendorModule.linkable.vendor,
  FreelanceModule.linkable.gigListing
)
