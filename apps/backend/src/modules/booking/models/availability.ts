import { model } from "@medusajs/framework/utils"

export const Availability = model.define("availability", {
  id: model.id().primaryKey(),
  tenant_id: model.text().nullable(),
  
  // Owner
  owner_type: model.enum(["provider", "service", "resource"]),
  owner_id: model.text(),
  
  // Schedule Type
  schedule_type: model.enum([
    "weekly_recurring",
    "custom"
  ]).default("weekly_recurring"),
  
  // Weekly Schedule (for recurring)
  weekly_schedule: model.json().nullable(),
  /*
  Example:
  {
    monday: [{ start: "09:00", end: "17:00" }],
    tuesday: [{ start: "09:00", end: "12:00" }, { start: "14:00", end: "18:00" }],
    wednesday: [{ start: "09:00", end: "17:00" }],
    thursday: [{ start: "09:00", end: "17:00" }],
    friday: [{ start: "09:00", end: "15:00" }],
    saturday: [],
    sunday: []
  }
  */
  
  // Timezone
  timezone: model.text().default("UTC"),
  
  // Effective Period
  effective_from: model.dateTime().nullable(),
  effective_to: model.dateTime().nullable(),
  
  // Slot Settings
  slot_duration_minutes: model.number().default(30),
  slot_increment_minutes: model.number().default(30), // Time between slot starts
  
  // Status
  is_active: model.boolean().default(true),
  
  metadata: model.json().nullable(),
})
.indexes([
  { on: ["tenant_id"] },
  { on: ["owner_type", "owner_id"] },
  { on: ["is_active"] },
])

export const AvailabilityException = model.define("availability_exception", {
  id: model.id().primaryKey(),
  availability_id: model.text(),
  tenant_id: model.text().nullable(),
  
  // Exception Type
  exception_type: model.enum([
    "time_off",
    "holiday",
    "special_hours",
    "blocked"
  ]),
  
  // Period
  start_date: model.dateTime(),
  end_date: model.dateTime(),
  all_day: model.boolean().default(false),
  
  // For special_hours type
  special_hours: model.json().nullable(), // [{ start: "10:00", end: "14:00" }]
  
  // Details
  title: model.text().nullable(),
  reason: model.text().nullable(),
  
  // Recurrence
  is_recurring: model.boolean().default(false),
  recurrence_rule: model.text().nullable(), // RRULE format
  
  metadata: model.json().nullable(),
})
.indexes([
  { on: ["availability_id"] },
  { on: ["tenant_id"] },
  { on: ["start_date", "end_date"] },
  { on: ["exception_type"] },
])
