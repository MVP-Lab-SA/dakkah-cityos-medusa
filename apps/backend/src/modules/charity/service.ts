import { MedusaService } from "@medusajs/framework/utils"
import CharityOrg from "./models/charity-org.js"
import DonationCampaign from "./models/donation-campaign.js"
import Donation from "./models/donation.js"
import ImpactReport from "./models/impact-report.js"

class CharityModuleService extends MedusaService({
  CharityOrg,
  DonationCampaign,
  Donation,
  ImpactReport,
}) {}

export default CharityModuleService
