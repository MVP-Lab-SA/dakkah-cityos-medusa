import { MedusaService } from "@medusajs/framework/utils"
import GymMembership from "./models/gym-membership.js"
import ClassSchedule from "./models/class-schedule.js"
import TrainerProfile from "./models/trainer-profile.js"
import ClassBooking from "./models/class-booking.js"
import WellnessPlan from "./models/wellness-plan.js"

class FitnessModuleService extends MedusaService({
  GymMembership,
  ClassSchedule,
  TrainerProfile,
  ClassBooking,
  WellnessPlan,
}) {}

export default FitnessModuleService
