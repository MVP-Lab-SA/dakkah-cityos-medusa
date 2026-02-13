import { MedusaService } from "@medusajs/framework/utils"
import AttorneyProfile from "./models/attorney-profile.js"
import LegalCase from "./models/legal-case.js"
import LegalConsultation from "./models/consultation.js"
import RetainerAgreement from "./models/retainer-agreement.js"

class LegalModuleService extends MedusaService({
  AttorneyProfile,
  LegalCase,
  LegalConsultation,
  RetainerAgreement,
}) {}

export default LegalModuleService
