import { MedusaService } from "@medusajs/framework/utils"
import CrowdfundCampaign from "./models/campaign"
import Pledge from "./models/pledge"
import RewardTier from "./models/reward-tier"
import CampaignUpdate from "./models/campaign-update"
import Backer from "./models/backer"

class CrowdfundingModuleService extends MedusaService({
  CrowdfundCampaign,
  Pledge,
  RewardTier,
  CampaignUpdate,
  Backer,
}) {}

export default CrowdfundingModuleService
