import TravelModuleService from "./service.js"
import { Module } from "@medusajs/framework/utils"

export const TRAVEL_MODULE = "travel"

export default Module(TRAVEL_MODULE, {
  service: TravelModuleService,
})
