// Booking Types for Enterprise Commerce Platform

export interface Service {
  id: string
  name: string
  handle: string
  description: string
  duration: number // in minutes
  buffer_time?: number // minutes between appointments
  price: number
  currency_code: string
  capacity?: number // max concurrent bookings
  category_id?: string
  category?: ServiceCategory
  providers: ServiceProvider[]
  images?: { url: string }[]
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface ServiceCategory {
  id: string
  name: string
  handle: string
  description?: string
  parent_id?: string
  services?: Service[]
}

export interface ServiceProvider {
  id: string
  name: string
  email: string
  phone?: string
  bio?: string
  avatar?: string
  services: string[] // service IDs
  availability: ProviderAvailability
  rating?: number
  review_count?: number
  metadata?: Record<string, unknown>
}

export interface ProviderAvailability {
  timezone: string
  weekly_schedule: WeeklySchedule
  exceptions: AvailabilityException[]
}

export interface WeeklySchedule {
  monday: DaySchedule | null
  tuesday: DaySchedule | null
  wednesday: DaySchedule | null
  thursday: DaySchedule | null
  friday: DaySchedule | null
  saturday: DaySchedule | null
  sunday: DaySchedule | null
}

export interface DaySchedule {
  start: string // HH:mm format
  end: string
  breaks?: { start: string; end: string }[]
}

export interface AvailabilityException {
  date: string // YYYY-MM-DD
  available: boolean
  schedule?: DaySchedule
  reason?: string
}

export interface TimeSlot {
  start: string // ISO datetime
  end: string
  provider_id: string
  available: boolean
  capacity_remaining?: number
}

export interface Booking {
  id: string
  customer_id: string
  service_id: string
  service: Service
  provider_id: string
  provider?: ServiceProvider
  status: BookingStatus
  scheduled_at: string // main scheduled date/time
  start_time: string
  end_time: string
  notes?: string
  location?: string
  attendees?: number
  price: number
  currency_code: string
  payment_status: "pending" | "paid" | "refunded" | "failed"
  confirmation_code: string
  reminder_sent?: boolean
  canceled_at?: string
  cancellation_reason?: string
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "canceled"
  | "no_show"

export interface BookingLocation {
  type: "in_person" | "virtual" | "phone"
  address?: string
  meeting_url?: string
  phone?: string
}

export interface BookingRequest {
  service_id: string
  provider_id: string
  start_time: string
  notes?: string
  attendees?: number
  location_type?: BookingLocation["type"]
}

// API Response types
export interface ServicesResponse {
  services: Service[]
  count: number
}

export interface AvailabilityResponse {
  slots: TimeSlot[]
  date: string
  provider_id: string
}

export interface BookingsResponse {
  bookings: Booking[]
  count: number
}

export interface BookingResponse {
  booking: Booking
}
