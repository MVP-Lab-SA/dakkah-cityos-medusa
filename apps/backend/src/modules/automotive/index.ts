import AutomotiveModuleService from "./service.js"
import { Module } from "@medusajs/framework/utils"

export const AUTOMOTIVE_MODULE = "automotive"

export default Module(AUTOMOTIVE_MODULE, {
  service: AutomotiveModuleService,
})
