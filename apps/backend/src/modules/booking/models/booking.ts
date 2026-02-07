import { model } from "@medusajs/framework/utils"

export const Booking = model.define("booking", {
  id: model.id().primaryKey(),
  booking_number: model.text().unique(),
  tenant_id: model.text().nullable(),
  
  // Customer
  customer_id: model.text().nullable(),
  customer_name: model.text(),
  customer_email: model.text(),
  customer_phone: model.text().nullable(),
  
  // Service & Provider
  service_product_id: model.text(),
  provider_id: model.text().nullable(),
  
  // Order Reference
  order_id: model.text().nullable(),
  line_item_id: model.text().nullable(),
  
  // Schedule
  start_time: model.dateTime(),
  end_time: model.dateTime(),
  timezone: model.text().default("UTC"),
  
  // Status
  status: model.enum([
    "pending",
    "confirmed",
    "checked_in",
    "in_progress",
    "completed",
    "cancelled",
    "no_show",
    "rescheduled"
  ]).default("pending"),
  
  // Capacity
  attendee_count: model.number().default(1),
  
  // Location
  location_type: model.enum([
    "in_person",
    "virtual",
    "customer_location"
  ]).default("in_person"),
  
  location_address: model.json().nullable(),
  virtual_meeting_url: model.text().nullable(),
  virtual_meeting_id: model.text().nullable(),
  
  // Pricing
  currency_code: model.text().default("usd"),
  subtotal: model.bigNumber().default(0),
  discount_total: model.bigNumber().default(0),
  tax_total: model.bigNumber().default(0),
  total: model.bigNumber().default(0),
  
  // Payment
  payment_status: model.enum([
    "unpaid",
    "deposit_paid",
    "paid",
    "refunded",
    "partially_refunded"
  ]).default("unpaid"),
  deposit_amount: model.bigNumber().nullable(),
  deposit_paid_at: model.dateTime().nullable(),
  
  // Cancellation
  cancelled_at: model.dateTime().nullable(),
  cancelled_by: model.enum(["customer", "provider", "admin", "system"]).nullable(),
  cancellation_reason: model.text().nullable(),
  cancellation_fee: model.bigNumber().nullable(),
  
  // Rescheduling
  rescheduled_from_id: model.text().nullable(), // Original booking ID
  rescheduled_to_id: model.text().nullable(), // New booking ID
  reschedule_count: model.number().default(0),
  
  // Notes
  customer_notes: model.text().nullable(),
  internal_notes: model.text().nullable(),
  provider_notes: model.text().nullable(),
  
  // Confirmation
  confirmed_at: model.dateTime().nullable(),
  confirmation_sent_at: model.dateTime().nullable(),
  
  // Check-in
  checked_in_at: model.dateTime().nullable(),
  completed_at: model.dateTime().nullable(),
  
  metadata: model.json().nullable(),
})
.indexes([
  { on: ["tenant_id"] },
  { on: ["customer_id"] },
  { on: ["service_product_id"] },
  { on: ["provider_id"] },
  { on: ["start_time", "end_time"] },
  { on: ["status"] },
  { on: ["booking_number"] },
])

export const BookingItem = model.define("booking_item", {
  id: model.id().primaryKey(),
  booking_id: model.text(),
  
  // Service Reference
  service_product_id: model.text(),
  
  // Details
  title: model.text(),
  description: model.text().nullable(),
  
  // Timing
  duration_minutes: model.number(),
  
  // Pricing
  quantity: model.number().default(1),
  unit_price: model.bigNumber(),
  subtotal: model.bigNumber(),
  discount_amount: model.bigNumber().default(0),
  tax_amount: model.bigNumber().default(0),
  total: model.bigNumber(),
  
  // Provider (if different from main booking)
  provider_id: model.text().nullable(),
  
  metadata: model.json().nullable(),
})
.indexes([
  { on: ["booking_id"] },
  { on: ["service_product_id"] },
])
