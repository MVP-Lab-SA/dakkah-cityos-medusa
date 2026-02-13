import { MedusaService } from "@medusajs/framework/utils"
import ServiceRequest from "./models/service-request.js"
import Permit from "./models/permit.js"
import MunicipalLicense from "./models/municipal-license.js"
import Fine from "./models/fine.js"
import CitizenProfile from "./models/citizen-profile.js"

class GovernmentModuleService extends MedusaService({
  ServiceRequest,
  Permit,
  MunicipalLicense,
  Fine,
  CitizenProfile,
}) {}

export default GovernmentModuleService
