import { MedusaService } from "@medusajs/framework/utils"
import AdCampaign from "./models/ad-campaign.js"
import AdPlacement from "./models/ad-placement.js"
import AdCreative from "./models/ad-creative.js"
import ImpressionLog from "./models/impression-log.js"
import AdAccount from "./models/ad-account.js"

class AdvertisingModuleService extends MedusaService({
  AdCampaign,
  AdPlacement,
  AdCreative,
  ImpressionLog,
  AdAccount,
}) {}

export default AdvertisingModuleService
