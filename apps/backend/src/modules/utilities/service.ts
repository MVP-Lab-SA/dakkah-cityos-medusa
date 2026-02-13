import { MedusaService } from "@medusajs/framework/utils"
import UtilityAccount from "./models/utility-account.js"
import UtilityBill from "./models/utility-bill.js"
import MeterReading from "./models/meter-reading.js"
import UsageRecord from "./models/usage-record.js"

class UtilitiesModuleService extends MedusaService({
  UtilityAccount,
  UtilityBill,
  MeterReading,
  UsageRecord,
}) {}

export default UtilitiesModuleService
