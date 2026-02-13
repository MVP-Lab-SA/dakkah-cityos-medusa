import { MedusaService } from "@medusajs/framework/utils"
import RentalProduct from "./models/rental-product.js"
import RentalAgreement from "./models/rental-agreement.js"
import RentalPeriod from "./models/rental-period.js"
import RentalReturn from "./models/rental-return.js"
import DamageClaim from "./models/damage-claim.js"

class RentalModuleService extends MedusaService({
  RentalProduct,
  RentalAgreement,
  RentalPeriod,
  RentalReturn,
  DamageClaim,
}) {}

export default RentalModuleService
