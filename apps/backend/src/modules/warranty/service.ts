import { MedusaService } from "@medusajs/framework/utils"
import WarrantyPlan from "./models/warranty-plan.js"
import WarrantyClaim from "./models/warranty-claim.js"
import RepairOrder from "./models/repair-order.js"
import SparePart from "./models/spare-part.js"
import ServiceCenter from "./models/service-center.js"

class WarrantyModuleService extends MedusaService({
  WarrantyPlan,
  WarrantyClaim,
  RepairOrder,
  SparePart,
  ServiceCenter,
}) {}

export default WarrantyModuleService
