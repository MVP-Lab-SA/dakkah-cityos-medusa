import { MedusaService } from "@medusajs/framework/utils"
import Event from "./models/event"
import TicketType from "./models/ticket-type"
import Ticket from "./models/ticket"
import Venue from "./models/venue"
import SeatMap from "./models/seat-map"
import CheckIn from "./models/check-in"

class EventTicketingModuleService extends MedusaService({
  Event,
  TicketType,
  Ticket,
  Venue,
  SeatMap,
  CheckIn,
}) {}

export default EventTicketingModuleService
