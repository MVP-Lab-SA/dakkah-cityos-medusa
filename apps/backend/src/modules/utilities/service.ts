import { MedusaService } from "@medusajs/framework/utils"
import UtilityAccount from "./models/utility-account"
import UtilityBill from "./models/utility-bill"
import MeterReading from "./models/meter-reading"
import UsageRecord from "./models/usage-record"

class UtilitiesModuleService extends MedusaService({
  UtilityAccount,
  UtilityBill,
  MeterReading,
  UsageRecord,
}) {}

export default UtilitiesModuleService
