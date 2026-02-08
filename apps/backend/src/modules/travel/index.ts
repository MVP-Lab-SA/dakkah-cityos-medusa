import TravelModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const TRAVEL_MODULE = "travel"

export default Module(TRAVEL_MODULE, {
  service: TravelModuleService,
})
