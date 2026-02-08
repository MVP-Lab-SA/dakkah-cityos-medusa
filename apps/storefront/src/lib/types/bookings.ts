export interface Service {
  id: string
  name: string
  handle: string
  description: string
  duration: number
  buffer_time?: number
  price: number
  currency_code: string
  capacity?: number
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
  tenant_id?: string
  user_id?: string
  name: string
  email?: string
  phone?: string
  bio?: string
  avatar?: string
  avatar_url?: string
  title?: string
  specializations?: string[]
  certifications?: string[]
  services?: string[]
  service_ids?: string[]
  max_daily_bookings?: number
  max_weekly_bookings?: number
  status: "active" | "inactive" | "on_leave"
  timezone: string
  calendar_color?: string
  external_calendar_id?: string
  external_calendar_provider?: "google" | "outlook" | "apple" | "none"
  total_reviews: number
  total_bookings: number
  availability?: ProviderAvailability
  rating?: number
  review_count?: number
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
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
  start: string
  end: string
  breaks?: { start: string; end: string }[]
}

export interface AvailabilityException {
  id?: string
  date: string
  available: boolean
  schedule?: DaySchedule
  reason?: string
}

export interface TimeSlot {
  start: string
  end: string
  provider_id: string
  available: boolean
  capacity_remaining?: number
}

export interface Booking {
  id: string
  customer_id: string
  service_id: string
  service?: Service
  provider_id: string
  provider?: ServiceProvider
  tenant_id?: string
  status: BookingStatus
  scheduled_at: string
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
  provider_id?: string
  start_time: string
  notes?: string
  attendees?: number
  location_type?: BookingLocation["type"]
  customer_name?: string
  customer_email?: string
  customer_phone?: string
}

export interface ServiceProduct {
  id: string
  product_id: string
  tenant_id?: string
  service_type: "appointment" | "class" | "workshop" | "consultation" | "event"
  duration_minutes: number
  buffer_before_minutes: number
  buffer_after_minutes: number
  buffer_minutes?: number
  max_capacity: number
  min_capacity: number
  max_participants?: number
  min_advance_booking_hours: number
  max_advance_booking_days: number
  cancellation_policy_hours: number
  cancellation_policy?: "flexible" | "moderate" | "strict"
  cancellation_deadline_hours?: number
  location_type: "in_person" | "virtual" | "phone" | "hybrid"
  location_address?: Record<string, unknown>
  virtual_meeting_url?: string
  virtual_meeting_provider?: "zoom" | "teams" | "meet" | "custom" | "none"
  pricing_type: "fixed" | "per_person" | "hourly" | "custom"
  required_resources?: string[]
  assigned_providers?: string[]
  inherits_provider_availability: boolean
  custom_availability_id?: string
  requires_provider?: boolean
  deposit_required?: boolean
  deposit_percentage?: number
  is_active: boolean
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface BookingItem {
  id: string
  booking_id?: string
  service_product_id?: string
  service_name?: string
  quantity?: number
  unit_price?: number
  total_price?: number
  duration_minutes?: number
  metadata?: Record<string, unknown>
}

export interface BookingReminder {
  id: string
  booking_id: string
  tenant_id?: string
  reminder_type: "email" | "sms" | "push"
  send_before_minutes: number
  scheduled_for: string
  status: "scheduled" | "sent" | "failed" | "cancelled"
  sent_at?: string
  delivered_at?: string
  opened_at?: string
  error_message?: string
  retry_count: number
  recipient_email?: string
  recipient_phone?: string
  subject?: string
  message?: string
  metadata?: Record<string, unknown>
  created_at: string
}

export interface AvailabilityModel {
  id: string
  tenant_id: string
  owner_type: "provider" | "service" | "resource"
  owner_id: string
  schedule_type: "weekly_recurring" | "custom"
  weekly_schedule?: WeeklySchedule
  timezone: string
  effective_from?: string
  effective_to?: string
  slot_duration_minutes?: number
  is_active: boolean
  exceptions?: AvailabilityException[]
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

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
