import EventTicketingModuleService from "./service.js"
import { Module } from "@medusajs/framework/utils"

export const EVENT_TICKETING_MODULE = "eventTicketing"

export default Module(EVENT_TICKETING_MODULE, {
  service: EventTicketingModuleService,
})
