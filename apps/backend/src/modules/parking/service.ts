import { MedusaService } from "@medusajs/framework/utils"
import ParkingZone from "./models/parking-zone"
import ParkingSession from "./models/parking-session"
import ShuttleRoute from "./models/shuttle-route"
import RideRequest from "./models/ride-request"

class ParkingModuleService extends MedusaService({
  ParkingZone,
  ParkingSession,
  ShuttleRoute,
  RideRequest,
}) {}

export default ParkingModuleService
