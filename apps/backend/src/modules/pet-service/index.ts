import PetServiceModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const PET_SERVICE_MODULE = "petService"

export default Module(PET_SERVICE_MODULE, {
  service: PetServiceModuleService,
})
