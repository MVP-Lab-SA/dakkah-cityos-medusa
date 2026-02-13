import FitnessModuleService from "./service.js"
import { Module } from "@medusajs/framework/utils"

export const FITNESS_MODULE = "fitness"

export default Module(FITNESS_MODULE, {
  service: FitnessModuleService,
})
