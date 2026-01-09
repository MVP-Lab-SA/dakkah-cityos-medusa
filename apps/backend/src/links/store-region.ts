import { defineLink } from "@medusajs/framework/utils"
import StoreModule from "../modules/store"
import RegionModule from "@medusajs/medusa/region"

/**
 * Link: Store ↔ Region
 * One store can support multiple regions (multi-currency, multi-country)
 * One region can be used by multiple stores
 */
export default defineLink(
  StoreModule.linkable.store,
  {
    linkable: RegionModule.linkable.region,
    isList: true, // store supports many regions
  }
)
