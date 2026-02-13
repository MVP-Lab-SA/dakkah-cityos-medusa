import { MedusaService } from "@medusajs/framework/utils"
import Affiliate from "./models/affiliate"
import ReferralLink from "./models/referral-link"
import ClickTracking from "./models/click-tracking"
import AffiliateCommission from "./models/affiliate-commission"
import InfluencerCampaign from "./models/influencer-campaign"

class AffiliateModuleService extends MedusaService({
  Affiliate,
  ReferralLink,
  ClickTracking,
  AffiliateCommission,
  InfluencerCampaign,
}) {}

export default AffiliateModuleService
