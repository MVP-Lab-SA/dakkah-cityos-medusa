import { MedusaService } from "@medusajs/framework/utils"
import FreshProduct from "./models/fresh-product.js"
import BatchTracking from "./models/batch-tracking.js"
import SubstitutionRule from "./models/substitution-rule.js"
import DeliverySlot from "./models/delivery-slot.js"

class GroceryModuleService extends MedusaService({
  FreshProduct,
  BatchTracking,
  SubstitutionRule,
  DeliverySlot,
}) {}

export default GroceryModuleService
