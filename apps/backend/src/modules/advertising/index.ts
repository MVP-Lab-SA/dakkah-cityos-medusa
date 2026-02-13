import AdvertisingModuleService from "./service.js"
import { Module } from "@medusajs/framework/utils"

export const ADVERTISING_MODULE = "advertising"

export default Module(ADVERTISING_MODULE, {
  service: AdvertisingModuleService,
})
