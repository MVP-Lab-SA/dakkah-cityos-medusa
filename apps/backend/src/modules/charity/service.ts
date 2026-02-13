import { MedusaService } from "@medusajs/framework/utils"
import CharityOrg from "./models/charity-org"
import DonationCampaign from "./models/donation-campaign"
import Donation from "./models/donation"
import ImpactReport from "./models/impact-report"

class CharityModuleService extends MedusaService({
  CharityOrg,
  DonationCampaign,
  Donation,
  ImpactReport,
}) {}

export default CharityModuleService
