import { defineLink } from "@medusajs/framework/utils"
import VendorModule from "../modules/vendor"
import { Modules } from "@medusajs/framework/utils"

export default defineLink(
  {
    linkable: VendorModule.linkable.vendor,
    field: "vendor",
  },
  {
    linkable: Modules.PRODUCT,
    field: "products",
  }
)
