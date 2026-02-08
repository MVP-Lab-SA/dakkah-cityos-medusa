import MembershipModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const MEMBERSHIP_MODULE = "membership"

export default Module(MEMBERSHIP_MODULE, {
  service: MembershipModuleService,
})
