import { MedusaService } from "@medusajs/framework/utils"
import TravelProperty from "./models/property.js"
import RoomType from "./models/room-type.js"
import Room from "./models/room.js"
import TravelReservation from "./models/reservation.js"
import RatePlan from "./models/rate-plan.js"
import GuestProfile from "./models/guest-profile.js"
import Amenity from "./models/amenity.js"

class TravelModuleService extends MedusaService({
  TravelProperty,
  RoomType,
  Room,
  TravelReservation,
  RatePlan,
  GuestProfile,
  Amenity,
}) {}

export default TravelModuleService
