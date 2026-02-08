import FitnessModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const FITNESS_MODULE = "fitness"

export default Module(FITNESS_MODULE, {
  service: FitnessModuleService,
})
