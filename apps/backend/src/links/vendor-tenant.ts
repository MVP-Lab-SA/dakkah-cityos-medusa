import { defineLink } from "@medusajs/framework/utils"
import VendorModule from "../modules/vendor"
import TenantModule from "../modules/tenant"

export default defineLink(
  VendorModule.linkable.vendor,
  {
    linkable: TenantModule.linkable.tenant,
    field: "tenant",
  }
)
