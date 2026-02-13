import { MedusaService } from "@medusajs/framework/utils"
import TravelProperty from "./models/property"
import RoomType from "./models/room-type"
import Room from "./models/room"
import TravelReservation from "./models/reservation"
import RatePlan from "./models/rate-plan"
import GuestProfile from "./models/guest-profile"
import Amenity from "./models/amenity"

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
