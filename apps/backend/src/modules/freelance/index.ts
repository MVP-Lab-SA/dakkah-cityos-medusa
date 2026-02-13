import FreelanceModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const FREELANCE_MODULE = "freelance"

export default Module(FREELANCE_MODULE, {
  service: FreelanceModuleService,
})
