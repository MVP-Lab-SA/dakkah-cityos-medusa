import RealEstateModuleService from "./service.js"
import { Module } from "@medusajs/framework/utils"

export const REAL_ESTATE_MODULE = "realEstate"

export default Module(REAL_ESTATE_MODULE, {
  service: RealEstateModuleService,
})
