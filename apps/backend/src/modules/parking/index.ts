import ParkingModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const PARKING_MODULE = "parking"

export default Module(PARKING_MODULE, {
  service: ParkingModuleService,
})
