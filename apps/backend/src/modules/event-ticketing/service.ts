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
}) {
  /** Reserve tickets for an event */
  async reserveTickets(eventId: string, quantity: number, ticketTypeId: string, customerId?: string): Promise<any[]> {
    if (quantity <= 0) {
      throw new Error("Quantity must be greater than zero")
    }

    const event = await this.retrieveEvent(eventId) as any
    if (event.status !== "published" && event.status !== "active") {
      throw new Error("Event is not available for ticket sales")
    }

    if (new Date(event.start_date) < new Date()) {
      throw new Error("Event has already started")
    }

    const capacity = await this.getEventCapacity(eventId)
    if (capacity.available < quantity) {
      throw new Error(`Only ${capacity.available} tickets available`)
    }

    const tickets: any[] = []
    for (let i = 0; i < quantity; i++) {
      const ticketCode = `TK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
      const ticket = await (this as any).createTickets({
        event_id: eventId,
        ticket_type_id: ticketTypeId,
        customer_id: customerId || null,
        ticket_code: ticketCode,
        status: "reserved",
        reserved_at: new Date(),
      })
      tickets.push(ticket)
    }

    return tickets
  }

  /** Issue a reserved ticket (confirm purchase) */
  async issueTicket(ticketId: string): Promise<any> {
    const ticket = await this.retrieveTicket(ticketId) as any

    if (ticket.status !== "reserved") {
      throw new Error("Only reserved tickets can be issued")
    }

    return await (this as any).updateTickets({
      id: ticketId,
      status: "issued",
      issued_at: new Date(),
    })
  }

  /** Cancel a ticket and release capacity */
  async cancelTicket(ticketId: string, reason?: string): Promise<any> {
    const ticket = await this.retrieveTicket(ticketId) as any

    if (["cancelled", "used"].includes(ticket.status)) {
      throw new Error("Ticket cannot be cancelled")
    }

    return await (this as any).updateTickets({
      id: ticketId,
      status: "cancelled",
      cancelled_at: new Date(),
      cancellation_reason: reason || null,
    })
  }

  /** Get event capacity and availability */
  async getEventCapacity(eventId: string): Promise<{ total: number; sold: number; reserved: number; available: number }> {
    const event = await this.retrieveEvent(eventId) as any
    const totalCapacity = Number(event.capacity || event.max_capacity || 0)

    const tickets = await this.listTickets({ event_id: eventId }) as any
    const ticketList = Array.isArray(tickets) ? tickets : [tickets].filter(Boolean)

    const sold = ticketList.filter((t: any) => t.status === "issued" || t.status === "used").length
    const reserved = ticketList.filter((t: any) => t.status === "reserved").length
    const available = Math.max(0, totalCapacity - sold - reserved)

    return { total: totalCapacity, sold, reserved, available }
  }
}

export default EventTicketingModuleService
