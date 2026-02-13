import { MedusaService } from "@medusajs/framework/utils"
import AttorneyProfile from "./models/attorney-profile"
import LegalCase from "./models/legal-case"
import LegalConsultation from "./models/consultation"
import RetainerAgreement from "./models/retainer-agreement"

class LegalModuleService extends MedusaService({
  AttorneyProfile,
  LegalCase,
  LegalConsultation,
  RetainerAgreement,
}) {}

export default LegalModuleService
