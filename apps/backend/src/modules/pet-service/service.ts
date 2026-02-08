import { MedusaService } from "@medusajs/framework/utils"
import PetProfile from "./models/pet-profile"
import GroomingBooking from "./models/grooming-booking"
import VetAppointment from "./models/vet-appointment"
import PetProduct from "./models/pet-product"

class PetServiceModuleService extends MedusaService({
  PetProfile,
  GroomingBooking,
  VetAppointment,
  PetProduct,
}) {}

export default PetServiceModuleService
