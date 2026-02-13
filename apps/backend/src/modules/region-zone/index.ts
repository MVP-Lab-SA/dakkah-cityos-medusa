import { Module } from "@medusajs/framework/utils"
import RegionZoneModuleService from "./service"

export const REGION_ZONE_MODULE = "regionZone"

export default Module(REGION_ZONE_MODULE, {
  service: RegionZoneModuleService,
})
