import { defineLink } from "@medusajs/framework/utils"
import VendorModule from "../modules/vendor"
import RestaurantModule from "../modules/restaurant"

export default defineLink(
  VendorModule.linkable.vendor,
  RestaurantModule.linkable.restaurant
)
