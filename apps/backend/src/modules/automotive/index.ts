import AutomotiveModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const AUTOMOTIVE_MODULE = "automotive"

export default Module(AUTOMOTIVE_MODULE, {
  service: AutomotiveModuleService,
})
