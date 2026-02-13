import { MedusaService } from "@medusajs/framework/utils"
import AdCampaign from "./models/ad-campaign"
import AdPlacement from "./models/ad-placement"
import AdCreative from "./models/ad-creative"
import ImpressionLog from "./models/impression-log"
import AdAccount from "./models/ad-account"

class AdvertisingModuleService extends MedusaService({
  AdCampaign,
  AdPlacement,
  AdCreative,
  ImpressionLog,
  AdAccount,
}) {}

export default AdvertisingModuleService
