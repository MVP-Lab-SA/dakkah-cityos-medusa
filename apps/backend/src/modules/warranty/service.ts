import { MedusaService } from "@medusajs/framework/utils"
import WarrantyPlan from "./models/warranty-plan"
import WarrantyClaim from "./models/warranty-claim"
import RepairOrder from "./models/repair-order"
import SparePart from "./models/spare-part"
import ServiceCenter from "./models/service-center"

class WarrantyModuleService extends MedusaService({
  WarrantyPlan,
  WarrantyClaim,
  RepairOrder,
  SparePart,
  ServiceCenter,
}) {}

export default WarrantyModuleService
