import { MedusaService } from "@medusajs/framework/utils"
import CrowdfundCampaign from "./models/campaign.js"
import Pledge from "./models/pledge.js"
import RewardTier from "./models/reward-tier.js"
import CampaignUpdate from "./models/campaign-update.js"
import Backer from "./models/backer.js"

class CrowdfundingModuleService extends MedusaService({
  CrowdfundCampaign,
  Pledge,
  RewardTier,
  CampaignUpdate,
  Backer,
}) {}

export default CrowdfundingModuleService
