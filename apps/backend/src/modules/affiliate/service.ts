import { MedusaService } from "@medusajs/framework/utils"
import Affiliate from "./models/affiliate.js"
import ReferralLink from "./models/referral-link.js"
import ClickTracking from "./models/click-tracking.js"
import AffiliateCommission from "./models/affiliate-commission.js"
import InfluencerCampaign from "./models/influencer-campaign.js"

class AffiliateModuleService extends MedusaService({
  Affiliate,
  ReferralLink,
  ClickTracking,
  AffiliateCommission,
  InfluencerCampaign,
}) {}

export default AffiliateModuleService
