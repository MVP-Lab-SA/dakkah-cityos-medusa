import type { BaseComponentProps, Size } from "../components/ComponentTypes"
import type { PriceData } from "../commerce/CommerceTypes"
import type { MediaField } from "../blocks/BlockTypes"

export interface EventCardProps extends BaseComponentProps {
  id: string
  title: string
  description?: string
  thumbnail?: MediaField
  date: string
  endDate?: string
  venue?: VenueInfo
  category?: string
  price?: PriceData
  isFree?: boolean
  availableTickets?: number
  totalTickets?: number
  status: "upcoming" | "ongoing" | "ended" | "cancelled" | "sold-out"
  variant?: "default" | "compact" | "featured" | "horizontal"
  onBook?: () => void
}

export interface VenueInfo {
  id: string
  name: string
  address: string
  lat?: number
  lng?: number
  capacity?: number
  image?: MediaField
}

export interface TicketSelectorProps extends BaseComponentProps {
  eventId: string
  ticketTypes: TicketTypeInfo[]
  selectedTickets: Record<string, number>
  maxPerOrder?: number
  onSelectionChange: (selection: Record<string, number>) => void
}

export interface TicketTypeInfo {
  id: string
  name: string
  description?: string
  price: PriceData
  available: number
  maxPerOrder?: number
  benefits?: string[]
}

export interface SeatMapProps extends BaseComponentProps {
  venueId: string
  sections: SeatSection[]
  selectedSeats: string[]
  onSeatSelect: (seatId: string) => void
  onSeatDeselect: (seatId: string) => void
  interactive?: boolean
}

export interface SeatSection {
  id: string
  name: string
  rows: SeatRow[]
  priceCategory?: string
  color?: string
}

export interface SeatRow {
  id: string
  label: string
  seats: Seat[]
}

export interface Seat {
  id: string
  label: string
  status: "available" | "selected" | "reserved" | "unavailable"
  priceCategory?: string
}

export interface EventFilterProps extends BaseComponentProps {
  categories?: string[]
  dateRange?: { start: string; end: string }
  priceRange?: { min: number; max: number }
  location?: string
  onFilterChange: (filters: Record<string, unknown>) => void
}

export interface EventCountdownProps extends BaseComponentProps {
  date: string
  size?: Size
  showDays?: boolean
  showHours?: boolean
  showMinutes?: boolean
  showSeconds?: boolean
  onComplete?: () => void
}
