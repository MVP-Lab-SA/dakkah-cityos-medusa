import EventTicketingModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const EVENT_TICKETING_MODULE = "eventTicketing"

export default Module(EVENT_TICKETING_MODULE, {
  service: EventTicketingModuleService,
})
