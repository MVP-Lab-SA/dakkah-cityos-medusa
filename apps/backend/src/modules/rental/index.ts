import RentalModuleService from "./service.js"
import { Module } from "@medusajs/framework/utils"

export const RENTAL_MODULE = "rental"

export default Module(RENTAL_MODULE, {
  service: RentalModuleService,
})
