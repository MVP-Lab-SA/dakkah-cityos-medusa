import { model } from "@medusajs/framework/utils"

export const ServiceProduct = model.define("service_product", {
  id: model.id().primaryKey(),
  product_id: model.text(), // Links to Medusa product
  tenant_id: model.text().nullable(),
  
  // Service Type
  service_type: model.enum([
    "appointment",
    "class",
    "rental",
    "consultation",
    "event",
    "custom"
  ]).default("appointment"),
  
  // Duration
  duration_minutes: model.number().default(60),
  buffer_before_minutes: model.number().default(0), // Time before next booking
  buffer_after_minutes: model.number().default(0), // Time after booking
  
  // Capacity
  max_capacity: model.number().default(1), // Max attendees/bookings per slot
  min_capacity: model.number().default(1), // Min required to proceed
  
  // Booking Rules
  min_advance_booking_hours: model.number().default(24), // Book at least X hours ahead
  max_advance_booking_days: model.number().default(60), // Book at most X days ahead
  cancellation_policy_hours: model.number().default(24), // Free cancellation window
  
  // Location
  location_type: model.enum([
    "in_person",
    "virtual",
    "customer_location",
    "flexible"
  ]).default("in_person"),
  
  location_address: model.json().nullable(),
  virtual_meeting_url: model.text().nullable(),
  virtual_meeting_provider: model.enum([
    "zoom",
    "google_meet",
    "teams",
    "custom"
  ]).nullable(),
  
  // Pricing
  pricing_type: model.enum([
    "fixed",
    "per_person",
    "per_hour",
    "custom"
  ]).default("fixed"),
  
  // Resources
  required_resources: model.json().nullable(), // Resource IDs needed
  assigned_providers: model.json().nullable(), // Provider IDs who can provide this
  
  // Availability
  inherits_provider_availability: model.boolean().default(true),
  custom_availability_id: model.text().nullable(),
  
  // Status
  is_active: model.boolean().default(true),
  
  metadata: model.json().nullable(),
})
.indexes([
  { on: ["product_id"] },
  { on: ["tenant_id"] },
  { on: ["service_type"] },
  { on: ["is_active"] },
])
