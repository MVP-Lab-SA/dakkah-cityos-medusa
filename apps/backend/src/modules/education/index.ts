import EducationModuleService from "./service.js"
import { Module } from "@medusajs/framework/utils"

export const EDUCATION_MODULE = "education"

export default Module(EDUCATION_MODULE, {
  service: EducationModuleService,
})
