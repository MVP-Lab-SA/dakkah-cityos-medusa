import { MedusaService } from "@medusajs/framework/utils"
import PropertyListing from "./models/property-listing"
import ViewingAppointment from "./models/viewing-appointment"
import LeaseAgreement from "./models/lease-agreement"
import PropertyDocument from "./models/property-document"
import PropertyValuation from "./models/property-valuation"
import AgentProfile from "./models/agent-profile"

class RealEstateModuleService extends MedusaService({
  PropertyListing,
  ViewingAppointment,
  LeaseAgreement,
  PropertyDocument,
  PropertyValuation,
  AgentProfile,
}) {}

export default RealEstateModuleService
