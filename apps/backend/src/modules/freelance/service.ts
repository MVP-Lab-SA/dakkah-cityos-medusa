import { MedusaService } from "@medusajs/framework/utils"
import GigListing from "./models/gig-listing"
import Proposal from "./models/proposal"
import FreelanceContract from "./models/freelance-contract"
import Milestone from "./models/milestone"
import TimeLog from "./models/time-log"
import FreelanceDispute from "./models/freelance-dispute"

class FreelanceModuleService extends MedusaService({
  GigListing,
  Proposal,
  FreelanceContract,
  Milestone,
  TimeLog,
  FreelanceDispute,
}) {}

export default FreelanceModuleService
