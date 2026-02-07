import { model } from "@medusajs/framework/utils"

export const BookingReminder = model.define("booking_reminder", {
  id: model.id().primaryKey(),
  booking_id: model.text(),
  tenant_id: model.text().nullable(),
  
  // Reminder Type
  reminder_type: model.enum([
    "email",
    "sms",
    "push"
  ]).default("email"),
  
  // Timing
  send_before_minutes: model.number().default(1440), // 24 hours default
  scheduled_for: model.dateTime(),
  
  // Status
  status: model.enum([
    "scheduled",
    "sent",
    "failed",
    "cancelled"
  ]).default("scheduled"),
  
  // Delivery
  sent_at: model.dateTime().nullable(),
  delivered_at: model.dateTime().nullable(),
  opened_at: model.dateTime().nullable(),
  
  // Error tracking
  error_message: model.text().nullable(),
  retry_count: model.number().default(0),
  
  // Content
  recipient_email: model.text().nullable(),
  recipient_phone: model.text().nullable(),
  subject: model.text().nullable(),
  message: model.text().nullable(),
  
  metadata: model.json().nullable(),
})
.indexes([
  { on: ["booking_id"] },
  { on: ["tenant_id"] },
  { on: ["status", "scheduled_for"] },
])
