import { defineLink } from "@medusajs/framework/utils"
import VendorModule from "../modules/vendor.js"
import StoreModule from "../modules/store.js"

export default defineLink(
  VendorModule.linkable.vendor,
  StoreModule.linkable.cityosStore
)
