import { Module } from "@medusajs/framework/utils"
import NodeModuleService from "./service"

export const NODE_MODULE = "node"

export default Module(NODE_MODULE, {
  service: NodeModuleService,
})
