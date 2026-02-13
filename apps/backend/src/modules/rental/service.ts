import { MedusaService } from "@medusajs/framework/utils"
import RentalProduct from "./models/rental-product"
import RentalAgreement from "./models/rental-agreement"
import RentalPeriod from "./models/rental-period"
import RentalReturn from "./models/rental-return"
import DamageClaim from "./models/damage-claim"

class RentalModuleService extends MedusaService({
  RentalProduct,
  RentalAgreement,
  RentalPeriod,
  RentalReturn,
  DamageClaim,
}) {}

export default RentalModuleService
