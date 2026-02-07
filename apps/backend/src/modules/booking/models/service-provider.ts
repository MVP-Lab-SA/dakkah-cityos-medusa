import { model } from "@medusajs/framework/utils"

export const ServiceProvider = model.define("service_provider", {
  id: model.id().primaryKey(),
  tenant_id: model.text().nullable(),
  
  // Provider Info
  user_id: model.text().nullable(), // Linked Medusa user/admin
  
  // Basic Info
  name: model.text(),
  email: model.text().nullable(),
  phone: model.text().nullable(),
  bio: model.text().nullable(),
  avatar_url: model.text().nullable(),
  
  // Professional Info
  title: model.text().nullable(), // e.g., "Senior Stylist", "Trainer"
  specializations: model.json().nullable(), // Array of specialties
  certifications: model.json().nullable(), // Array of certifications
  
  // Services
  service_ids: model.json().nullable(), // Service products this provider offers
  
  // Capacity
  max_daily_bookings: model.number().nullable(),
  max_weekly_bookings: model.number().nullable(),
  
  // Status
  status: model.enum([
    "active",
    "inactive",
    "on_leave",
    "terminated"
  ]).default("active"),
  
  // Calendar
  timezone: model.text().default("UTC"),
  calendar_color: model.text().nullable(), // For UI display
  
  // External Calendar Sync
  external_calendar_id: model.text().nullable(),
  external_calendar_provider: model.enum([
    "google",
    "outlook",
    "ical"
  ]).nullable(),
  
  // Ratings
  average_rating: model.bigNumber().nullable(),
  total_reviews: model.number().default(0),
  total_bookings: model.number().default(0),
  
  metadata: model.json().nullable(),
})
.indexes([
  { on: ["tenant_id"] },
  { on: ["user_id"] },
  { on: ["status"] },
])
