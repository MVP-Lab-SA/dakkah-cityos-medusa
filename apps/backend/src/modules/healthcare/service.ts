import { MedusaService } from "@medusajs/framework/utils"
import Practitioner from "./models/practitioner"
import HealthcareAppointment from "./models/healthcare-appointment"
import Prescription from "./models/prescription"
import LabOrder from "./models/lab-order"
import MedicalRecord from "./models/medical-record"
import PharmacyProduct from "./models/pharmacy-product"
import InsuranceClaim from "./models/insurance-claim"

class HealthcareModuleService extends MedusaService({
  Practitioner,
  HealthcareAppointment,
  Prescription,
  LabOrder,
  MedicalRecord,
  PharmacyProduct,
  InsuranceClaim,
}) {}

export default HealthcareModuleService
