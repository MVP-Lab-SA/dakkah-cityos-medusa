import { MedusaService } from "@medusajs/framework/utils"
import Practitioner from "./models/practitioner.js"
import HealthcareAppointment from "./models/healthcare-appointment.js"
import Prescription from "./models/prescription.js"
import LabOrder from "./models/lab-order.js"
import MedicalRecord from "./models/medical-record.js"
import PharmacyProduct from "./models/pharmacy-product.js"
import InsuranceClaim from "./models/insurance-claim.js"

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
