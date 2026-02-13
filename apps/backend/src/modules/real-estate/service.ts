import { MedusaService } from "@medusajs/framework/utils"
import PropertyListing from "./models/property-listing.js"
import ViewingAppointment from "./models/viewing-appointment.js"
import LeaseAgreement from "./models/lease-agreement.js"
import PropertyDocument from "./models/property-document.js"
import PropertyValuation from "./models/property-valuation.js"
import AgentProfile from "./models/agent-profile.js"

class RealEstateModuleService extends MedusaService({
  PropertyListing,
  ViewingAppointment,
  LeaseAgreement,
  PropertyDocument,
  PropertyValuation,
  AgentProfile,
}) {}

export default RealEstateModuleService
