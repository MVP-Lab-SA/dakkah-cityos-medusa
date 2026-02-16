import { defineLink } from "@medusajs/framework/utils"
import InventoryModule from "@medusajs/medusa/inventory"
import InventoryExtensionModule from "../modules/inventory-extension"

export default defineLink(
  InventoryModule.linkable.inventoryItem,
  InventoryExtensionModule.linkable.stockAlert
)
