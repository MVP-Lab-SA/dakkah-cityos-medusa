import { MedusaService } from "@medusajs/framework/utils"
import ServiceRequest from "./models/service-request"
import Permit from "./models/permit"
import MunicipalLicense from "./models/municipal-license"
import Fine from "./models/fine"
import CitizenProfile from "./models/citizen-profile"

class GovernmentModuleService extends MedusaService({
  ServiceRequest,
  Permit,
  MunicipalLicense,
  Fine,
  CitizenProfile,
}) {}

export default GovernmentModuleService
