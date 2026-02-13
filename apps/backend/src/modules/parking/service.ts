import { MedusaService } from "@medusajs/framework/utils"
import ParkingZone from "./models/parking-zone.js"
import ParkingSession from "./models/parking-session.js"
import ShuttleRoute from "./models/shuttle-route.js"
import RideRequest from "./models/ride-request.js"

class ParkingModuleService extends MedusaService({
  ParkingZone,
  ParkingSession,
  ShuttleRoute,
  RideRequest,
}) {}

export default ParkingModuleService
