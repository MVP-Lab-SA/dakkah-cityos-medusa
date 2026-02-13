import HealthcareModuleService from "./service.js"
import { Module } from "@medusajs/framework/utils"

export const HEALTHCARE_MODULE = "healthcare"

export default Module(HEALTHCARE_MODULE, {
  service: HealthcareModuleService,
})
