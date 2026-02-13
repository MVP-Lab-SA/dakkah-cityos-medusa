import { MedusaService } from "@medusajs/framework/utils"
import PetProfile from "./models/pet-profile.js"
import GroomingBooking from "./models/grooming-booking.js"
import VetAppointment from "./models/vet-appointment.js"
import PetProduct from "./models/pet-product.js"

class PetServiceModuleService extends MedusaService({
  PetProfile,
  GroomingBooking,
  VetAppointment,
  PetProduct,
}) {}

export default PetServiceModuleService
