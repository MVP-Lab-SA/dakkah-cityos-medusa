import { MedusaService } from "@medusajs/framework/utils"
import FreshProduct from "./models/fresh-product"
import BatchTracking from "./models/batch-tracking"
import SubstitutionRule from "./models/substitution-rule"
import DeliverySlot from "./models/delivery-slot"

class GroceryModuleService extends MedusaService({
  FreshProduct,
  BatchTracking,
  SubstitutionRule,
  DeliverySlot,
}) {}

export default GroceryModuleService
