import { Module } from "@medusajs/framework/utils"
import BookingModuleService from "./service.js"

export const BOOKING_MODULE = "booking"

export default Module(BOOKING_MODULE, {
  service: BookingModuleService,
})
