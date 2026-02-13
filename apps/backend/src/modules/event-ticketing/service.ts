import { MedusaService } from "@medusajs/framework/utils"
import Event from "./models/event.js"
import TicketType from "./models/ticket-type.js"
import Ticket from "./models/ticket.js"
import Venue from "./models/venue.js"
import SeatMap from "./models/seat-map.js"
import CheckIn from "./models/check-in.js"

class EventTicketingModuleService extends MedusaService({
  Event,
  TicketType,
  Ticket,
  Venue,
  SeatMap,
  CheckIn,
}) {}

export default EventTicketingModuleService
