import { Module } from "@medusajs/framework/utils"
import ChannelModuleService from "./service.js"

export const CHANNEL_MODULE = "channel"

export default Module(CHANNEL_MODULE, {
  service: ChannelModuleService,
})
