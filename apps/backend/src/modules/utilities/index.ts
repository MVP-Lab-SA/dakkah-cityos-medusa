import UtilitiesModuleService from "./service.js"
import { Module } from "@medusajs/framework/utils"

export const UTILITIES_MODULE = "utilities"

export default Module(UTILITIES_MODULE, {
  service: UtilitiesModuleService,
})
