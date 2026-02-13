import { MedusaService } from "@medusajs/framework/utils"
import GigListing from "./models/gig-listing.js"
import Proposal from "./models/proposal.js"
import FreelanceContract from "./models/freelance-contract.js"
import Milestone from "./models/milestone.js"
import TimeLog from "./models/time-log.js"
import FreelanceDispute from "./models/freelance-dispute.js"

class FreelanceModuleService extends MedusaService({
  GigListing,
  Proposal,
  FreelanceContract,
  Milestone,
  TimeLog,
  FreelanceDispute,
}) {}

export default FreelanceModuleService
