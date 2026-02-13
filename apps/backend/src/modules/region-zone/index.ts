import { Module } from "@medusajs/framework/utils"
import RegionZoneModuleService from "./service.js"

export const REGION_ZONE_MODULE = "regionZone"

export default Module(REGION_ZONE_MODULE, {
  service: RegionZoneModuleService,
})
