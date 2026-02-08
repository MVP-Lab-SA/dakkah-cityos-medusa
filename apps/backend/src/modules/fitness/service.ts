import { MedusaService } from "@medusajs/framework/utils"
import GymMembership from "./models/gym-membership"
import ClassSchedule from "./models/class-schedule"
import TrainerProfile from "./models/trainer-profile"
import ClassBooking from "./models/class-booking"
import WellnessPlan from "./models/wellness-plan"

class FitnessModuleService extends MedusaService({
  GymMembership,
  ClassSchedule,
  TrainerProfile,
  ClassBooking,
  WellnessPlan,
}) {}

export default FitnessModuleService
