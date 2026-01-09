import { defineLink } from "@medusajs/framework/utils"
import VendorModule from "../modules/vendor"
import StoreModule from "../modules/store"

export default defineLink(
  VendorModule.linkable.vendor,
  {
    linkable: StoreModule.linkable.store,
    field: "store",
  }
)
