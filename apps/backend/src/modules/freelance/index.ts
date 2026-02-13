import FreelanceModuleService from "./service.js"
import { Module } from "@medusajs/framework/utils"

export const FREELANCE_MODULE = "freelance"

export default Module(FREELANCE_MODULE, {
  service: FreelanceModuleService,
})
