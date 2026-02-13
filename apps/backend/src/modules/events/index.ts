import { Module } from "@medusajs/framework/utils"
import EventModuleService from "./service"

export const EVENT_MODULE = "eventOutbox"

export default Module(EVENT_MODULE, {
  service: EventModuleService,
})
