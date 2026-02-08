import RealEstateModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const REAL_ESTATE_MODULE = "realEstate"

export default Module(REAL_ESTATE_MODULE, {
  service: RealEstateModuleService,
})
