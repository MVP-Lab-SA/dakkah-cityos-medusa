import HealthcareModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const HEALTHCARE_MODULE = "healthcare"

export default Module(HEALTHCARE_MODULE, {
  service: HealthcareModuleService,
})
